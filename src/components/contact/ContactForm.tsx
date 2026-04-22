"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { AlertTriangle, Check, Loader2, Send } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import FloatingField from "./FloatingField";

/* ==========================================================================
 * ContactForm
 * --------------------------------------------------------------------------
 * Glass-morphism card with four floating-label fields and a submit button
 * that cycles idle → sending → success and back. Every submit triggers a
 * short particle burst from the button centre.
 * ========================================================================== */

type SubmitState = "idle" | "sending" | "success" | "error";

interface Burst {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
  duration: number;
}

const SUBJECT_OPTIONS = [
  { value: "Job Opportunity", label: "Job Opportunity" },
  { value: "Collaboration", label: "Collaboration" },
  { value: "Project Inquiry", label: "Project Inquiry" },
  { value: "Just saying hi", label: "Just saying hi" },
];

const BURST_COLORS = ["#00D4FF", "#7B2FBE", "#BFF7FF", "#10dc78"];

export default function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const disabled = status !== "idle";

  const spawnBurst = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const newBursts: Burst[] = Array.from({ length: 14 }).map(() => ({
      id: burstIdRef.current++,
      x: cx,
      y: cy,
      angle: Math.random() * Math.PI * 2,
      distance: 40 + Math.random() * 60,
      color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
      duration: 0.5 + Math.random() * 0.4,
    }));

    setBursts((prev) => [...prev, ...newBursts]);

    // Clean particles after they animate
    window.setTimeout(() => {
      setBursts((prev) =>
        prev.filter((b) => !newBursts.find((nb) => nb.id === b.id))
      );
    }, 1200);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    spawnBurst();
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;

      if (!res.ok || !data?.ok) {
        setErrorMsg(
          data?.error ??
            "Could not deliver the message. Please email marwan2004000@gmail.com directly."
        );
        setStatus("error");
        window.setTimeout(() => setStatus("idle"), 4500);
        return;
      }

      setStatus("success");
      window.setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 3200);
    } catch (err) {
      console.warn("contact submission failed", err);
      setErrorMsg(
        "Network error. Please try again, or email marwan2004000@gmail.com directly."
      );
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 4500);
    }
  };

  const summaryLine = useMemo(() => {
    if (status === "sending") return "encoding · routing · uplink";
    if (status === "success") return "transmission received · 200 OK";
    if (status === "error") return "transmission failed · see note";
    return "signal · encrypted · AES-256";
  }, [status]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--bg-secondary)]/30 p-6 backdrop-blur-xl md:p-10"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -24px rgba(0,212,255,0.18)",
      }}
    >
      {/* Decorative mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px 300px at 10% 0%, rgba(0,212,255,0.12), transparent 65%), radial-gradient(600px 300px at 100% 100%, rgba(123,47,190,0.15), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] grid-bg"
      />

      {/* Title bar */}
      <div className="relative mb-8 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-primary)]">
            /· transmission form
          </div>
          <div className="mt-1.5 font-display text-2xl tracking-wide text-[color:var(--text-primary)] md:text-3xl">
            Compose your signal
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 8px rgba(0,212,255,0.6)" }}
          />
          {summaryLine}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-2">
          <FloatingField
            id="cf-name"
            label="Your name, human"
            type="text"
            value={name}
            onChange={setName}
            autoComplete="name"
            required
          />
          <FloatingField
            id="cf-email"
            label="your@email.com"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
        </div>

        <FloatingField
          id="cf-subject"
          label="Subject"
          type="select"
          value={subject}
          onChange={setSubject}
          options={SUBJECT_OPTIONS}
          required
        />

        <FloatingField
          id="cf-message"
          label="Tell me about your project…"
          type="textarea"
          value={message}
          onChange={setMessage}
          rows={5}
          required
        />

        {/* Submit */}
        <div className="relative">
          {/* Particle burst layer */}
          <div className="pointer-events-none absolute inset-0">
            <AnimatePresence>
              {bursts.map((b) => (
                <motion.span
                  key={b.id}
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{
                    left: b.x,
                    top: b.y,
                    backgroundColor: b.color,
                    boxShadow: `0 0 10px ${b.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(b.angle) * b.distance,
                    y: Math.sin(b.angle) * b.distance,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: b.duration, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            ref={btnRef}
            type="submit"
            disabled={disabled}
            data-cursor="hover"
            className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-[color:var(--bg-primary)] transition-transform duration-300"
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient track */}
            <motion.span
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg, #00D4FF 0%, #7B2FBE 50%, #FF6B35 100%)",
                backgroundSize: "250% 100%",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Hover brighten */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.15), transparent 40%, rgba(255,255,255,0.2))",
              }}
            />

            <span className="relative z-10 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    Send Transmission
                    <Send className="h-4 w-4" strokeWidth={2} />
                  </motion.span>
                )}
                {status === "sending" && (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    Transmitting
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  </motion.span>
                )}
                {status === "success" && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                    Transmission Received
                  </motion.span>
                )}
                {status === "error" && (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
                    Delivery Failed — Retry
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>

          {/* Inline error detail */}
          <AnimatePresence>
            {status === "error" && errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--accent-tertiary)]"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Fine print */}
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          By sending you agree to be replied to from{" "}
          <span className="text-[color:var(--accent-primary)]">Jeddah, KSA</span>
          .
        </p>
      </form>
    </motion.div>
  );
}
