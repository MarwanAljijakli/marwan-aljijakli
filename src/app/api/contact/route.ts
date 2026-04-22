import { NextResponse, type NextRequest } from "next/server";

/* ==========================================================================
 * POST /api/contact
 * --------------------------------------------------------------------------
 * Receives the portfolio contact form submissions.
 *
 *   - Validates shape + field lengths + email format (no new deps)
 *   - Rate-limits by IP using an in-memory token bucket (best-effort —
 *     resets on server restart, per-edge-instance in a serverless env)
 *   - If RESEND_API_KEY is set in the environment, sends the message
 *     via Resend's REST API using plain fetch (no @resend/ SDK needed)
 *   - Otherwise logs the submission + returns 200 so local dev "just works"
 *
 * To enable real email delivery in production:
 *   1. Sign up at https://resend.com and verify a sending domain
 *   2. Set RESEND_API_KEY   = your API key
 *      Set CONTACT_TO_EMAIL = marwan2004000@gmail.com   (or whichever inbox)
 *      Set CONTACT_FROM     = "Marwan Portfolio <hello@yourdomain.com>"
 *   3. Redeploy
 * ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_000;

const FIELD_LIMITS = {
  name: 120,
  email: 200,
  subject: 120,
  message: 5_000,
} as const;

const ALLOWED_SUBJECTS = new Set([
  "Job Opportunity",
  "Collaboration",
  "Project Inquiry",
  "Just saying hi",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---- Simple per-IP rate limiter ----------------------------------------- */

interface Bucket {
  tokens: number;
  lastRefillMs: number;
}
const buckets = new Map<string, Bucket>();

const RATE_CAPACITY = 5;        // max 5 submissions
const RATE_WINDOW_MS = 60_000;  // per minute

function rateLimit(ip: string): { ok: true } | { ok: false; retryMs: number } {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? {
    tokens: RATE_CAPACITY,
    lastRefillMs: now,
  };

  // Refill proportionally to time elapsed.
  const elapsed = now - bucket.lastRefillMs;
  if (elapsed > 0) {
    const refill = (elapsed / RATE_WINDOW_MS) * RATE_CAPACITY;
    bucket.tokens = Math.min(RATE_CAPACITY, bucket.tokens + refill);
    bucket.lastRefillMs = now;
  }

  if (bucket.tokens < 1) {
    buckets.set(ip, bucket);
    return {
      ok: false,
      retryMs: Math.ceil(((1 - bucket.tokens) / RATE_CAPACITY) * RATE_WINDOW_MS),
    };
  }

  bucket.tokens -= 1;
  buckets.set(ip, bucket);
  return { ok: true };
}

/* ---- Route handler ------------------------------------------------------- */

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot — if filled in, we silently discard the submission. */
  website?: unknown;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please retry shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryMs / 1000)) } }
    );
  }

  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large." },
      { status: 413 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill every input; humans never see it.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    // Pretend success so the bot thinks it won.
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = validation.data;

  try {
    const delivered = await deliver({ name, email, subject, message, ip });
    return NextResponse.json(
      {
        ok: true,
        delivered,
        message: delivered
          ? "Transmission received."
          : "Received (dev mode — not actually sent).",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("contact delivery failed", err);
    return NextResponse.json(
      { ok: false, error: "Delivery failed — please email marwan2004000@gmail.com directly." },
      { status: 502 }
    );
  }
}

/* ---- Validation --------------------------------------------------------- */

type Validated = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function validate(
  body: Payload
): { ok: true; data: Validated } | { ok: false; error: string } {
  const name = requireString(body.name, FIELD_LIMITS.name, "name");
  if (!name.ok) return name;

  const email = requireString(body.email, FIELD_LIMITS.email, "email");
  if (!email.ok) return email;
  if (!EMAIL_RE.test(email.value)) {
    return { ok: false, error: "Email is not a valid address." };
  }

  const subject = requireString(body.subject, FIELD_LIMITS.subject, "subject");
  if (!subject.ok) return subject;
  if (!ALLOWED_SUBJECTS.has(subject.value)) {
    return { ok: false, error: "Subject must be one of the allowed options." };
  }

  const message = requireString(body.message, FIELD_LIMITS.message, "message");
  if (!message.ok) return message;

  return {
    ok: true,
    data: {
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    },
  };
}

function requireString(
  v: unknown,
  max: number,
  field: string
):
  | { ok: true; value: string }
  | { ok: false; error: string } {
  if (typeof v !== "string") {
    return { ok: false, error: `Missing field: ${field}.` };
  }
  const trimmed = v.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: `Field "${field}" cannot be empty.` };
  }
  if (trimmed.length > max) {
    return { ok: false, error: `Field "${field}" exceeds ${max} characters.` };
  }
  return { ok: true, value: trimmed };
}

/* ---- Delivery via Resend REST (no SDK needed) --------------------------- */

async function deliver(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_TO_EMAIL ?? "marwan2004000@gmail.com";
  const from =
    process.env.CONTACT_FROM ?? "Marwan Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    // Dev mode: log so the user can verify end-to-end during local testing.
    console.info("[contact] received (dev mode, not sent)", {
      to,
      from: input.email,
      subject: input.subject,
      name: input.name,
      ip: input.ip,
      length: input.message.length,
    });
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `[Portfolio · ${input.subject}] ${input.name}`,
      text: [
        `From: ${input.name} <${input.email}>`,
        `Subject: ${input.subject}`,
        `IP: ${input.ip}`,
        "",
        input.message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Resend returned ${res.status}: ${errBody}`);
  }
  return true;
}
