"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ==========================================================================
 * GlitchText
 * --------------------------------------------------------------------------
 * A decryption-reveal effect: the target text is scrambled with random
 * "noise" characters, then resolves left-to-right over ~0.7s the first
 * time it scrolls into view.
 *
 *   <GlitchText>THE MIND</GlitchText>
 *
 * - Keeps spaces and non-alphanumeric punctuation pinned (doesn't scramble
 *   them — keeps word boundaries readable while the effect plays).
 * - Idempotent-safe: once resolved, subsequent re-renders are no-ops.
 * - Respects prefers-reduced-motion → shows the final text immediately.
 *
 * Apply the same styling as a regular <span>: `className`, `style`, etc.
 * For styled sub-ranges (gradient half, accent colour), use two siblings:
 *   <GlitchText>THE MIND</GlitchText> <GlitchText className="text-gradient">
 *     BEHIND THE SYSTEMS
 *   </GlitchText>
 * ========================================================================== */

const NOISE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ΣΔπλσθ01";

const DEFAULT_TOTAL_MS = 700; // total decryption duration
const DEFAULT_TICK_MS = 32;   // per-frame scramble tick

interface GlitchTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  /** ms; how long the whole scramble→resolve takes. */
  durationMs?: number;
  /** Delay (ms) applied after the element enters view. */
  delayMs?: number;
  /** Portion of target string considered visible as viewport intersection.
   *  0.5 means trigger only when 50% is in view. */
  amount?: number;
}

export default function GlitchText({
  children,
  className,
  style,
  durationMs = DEFAULT_TOTAL_MS,
  delayMs = 0,
  amount = 0.4,
}: GlitchTextProps) {
  const target = typeof children === "string" ? children : String(children);

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const prefersReduced = useReducedMotion();

  const [display, setDisplay] = useState(target);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!inView || hasRunRef.current) return;

    if (prefersReduced) {
      setDisplay(target);
      hasRunRef.current = true;
      return;
    }

    hasRunRef.current = true;

    let tickTimer: ReturnType<typeof setInterval> | null = null;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const t0 = performance.now();

      // Pre-compute which character positions are *fixed* (whitespace and
      // punctuation stay as-is so the layout never jitters).
      const fixed = new Array<boolean>(target.length);
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        fixed[i] = /\s|['".,:;!?()\-—&·]/.test(ch);
      }

      // Seed with an initial fully-scrambled string so frame 0 looks intentional.
      setDisplay(scramble(target, 0, fixed));

      tickTimer = setInterval(() => {
        const elapsed = performance.now() - t0;
        const progress = Math.min(1, elapsed / durationMs);
        // Bias reveal to finish slightly before the full duration so the
        // final frame reads as "locked-in".
        const reveal = Math.min(target.length, Math.floor(progress * target.length * 1.15));

        setDisplay(scramble(target, reveal, fixed));

        if (progress >= 1) {
          setDisplay(target);
          if (tickTimer) clearInterval(tickTimer);
        }
      }, DEFAULT_TICK_MS);
    };

    if (delayMs > 0) {
      startTimer = setTimeout(start, delayMs);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      if (tickTimer) clearInterval(tickTimer);
      if (startTimer) clearTimeout(startTimer);
    };
  }, [inView, prefersReduced, target, durationMs, delayMs]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}

/* -------------------------------------------------------------------------- */

function scramble(
  target: string,
  revealedCount: number,
  fixed: boolean[]
): string {
  let out = "";
  for (let i = 0; i < target.length; i++) {
    if (i < revealedCount || fixed[i]) {
      out += target[i];
    } else {
      out += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    }
  }
  return out;
}
