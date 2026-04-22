"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import Image from "next/image";

/* ==========================================================================
 * Portrait
 * --------------------------------------------------------------------------
 * A framed headshot tile that lives at the top of the About section's right
 * column. Styled to match the site's "control room" aesthetic without
 * losing the warmth a real photo of Marwan brings to the page:
 *
 *  - Outer gradient border (cyan → violet → orange) that subtly pulses
 *  - Tiny corner tick marks reminiscent of a detection overlay
 *  - A single sweeping scan line at 3 % opacity (almost invisible)
 *  - Credential strip below the photo: name · role · verified chip · loc
 *
 * The photo itself is intentionally *not* tinted — professional headshots
 * should read true to colour. The framing does the stylistic heavy lifting.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Portrait() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      className="relative mx-auto w-full max-w-[460px]"
    >
      {/* ---- Outer animated gradient border ----------------------------- */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-70"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, #00D4FF 0deg, #7B2FBE 120deg, #FF6B35 240deg, #00D4FF 360deg)",
          filter: "blur(14px)",
        }}
        animate={prefersReduced ? undefined : { opacity: [0.35, 0.7, 0.35] }}
        transition={
          prefersReduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* ---- Frame body ------------------------------------------------- */}
      <div
        className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[color:var(--bg-secondary)]/80 p-1.5 backdrop-blur-sm"
        style={{
          boxShadow: "0 30px 60px -30px rgba(0,212,255,0.35)",
        }}
      >
        <div className="relative overflow-hidden rounded-[20px]">
          {/* Corner "detection" brackets */}
          <CornerBracket className="top-2 left-2" />
          <CornerBracket className="top-2 right-2 rotate-90" />
          <CornerBracket className="bottom-2 right-2 rotate-180" />
          <CornerBracket className="bottom-2 left-2 -rotate-90" />

          {/* Image */}
          <div className="relative aspect-[4/5] w-full bg-[color:var(--bg-primary)]">
            <Image
              src="/marwan-portrait.png"
              alt="Marwan Aljijakli — CTO & AI/ML Engineer"
              fill
              priority={false}
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 55vw, 90vw"
              quality={92}
              className="object-cover object-[center_20%]"
            />

            {/* Very subtle scan sweep — 3% alpha so you barely see it */}
            {!prefersReduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)",
                  boxShadow: "0 0 12px rgba(0,212,255,0.25)",
                  opacity: 0.55,
                }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Bottom darkening gradient for caption legibility */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(5,10,15,0.8) 100%)",
              }}
            />

            {/* Top-right "live" chip */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
              <motion.span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#10dc78]"
                style={{ boxShadow: "0 0 10px #10dc78" }}
                animate={
                  prefersReduced
                    ? undefined
                    : { opacity: [1, 0.4, 1] }
                }
                transition={
                  prefersReduced
                    ? undefined
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
              />
              On the ground · ICAIS 2025
            </div>

            {/* In-image caption */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]">
                /· profile · subject_01
              </div>
              <div
                className="mt-1.5 font-display leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)" }}
              >
                Marwan Aljijakli
              </div>
              <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75">
                <MapPin className="h-3 w-3" strokeWidth={1.6} />
                Jeddah, KSA · GMT+3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Credential strip under the photo --------------------------- */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2
            className="h-3 w-3 text-[color:var(--accent-primary)]"
            strokeWidth={2}
          />
          Verified · CTO &amp; AI/ML Engineer
        </span>
        <span>fig. 00 — operator</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={`pointer-events-none absolute z-10 text-[color:var(--accent-primary)] ${className}`}
    >
      <path
        d="M3 9 V3 H9"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
