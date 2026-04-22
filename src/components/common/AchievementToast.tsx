"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";

/* ==========================================================================
 * AchievementToast
 * --------------------------------------------------------------------------
 * Fires once per browser session, three minutes after the component mounts
 * (i.e. after the loader completes — we're mounted under AppShell's
 * `ready` gate). A short "Deep Dive" acknowledgement shows from the bottom
 * right and auto-dismisses five seconds later.
 *
 * sessionStorage keeps us from badgering repeat-visitors inside one session.
 * ========================================================================== */

const STORAGE_KEY = "marwan-portfolio-deep-dive";
const TRIGGER_DELAY_MS = 3 * 60 * 1000; // 3 minutes
const DISMISS_DELAY_MS = 5_000;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function AchievementToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // One per session — don't annoy the reader if they already earned it.
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* private mode / blocked storage: just allow it */
    }
    if (alreadyShown) return;

    const openTimer = window.setTimeout(() => {
      setVisible(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
    }, TRIGGER_DELAY_MS);

    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const closeTimer = window.setTimeout(
      () => setVisible(false),
      DISMISS_DELAY_MS
    );
    return () => window.clearTimeout(closeTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, x: 30, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, y: 10, scale: 0.92 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="fixed bottom-6 right-6 z-[130] flex w-[min(92vw,360px)] items-start gap-3 overflow-hidden rounded-2xl border border-[color:var(--accent-primary)]/30 bg-[color:var(--bg-secondary)]/90 p-4 backdrop-blur-xl md:bottom-8 md:right-8"
          style={{
            boxShadow:
              "0 24px 60px -16px rgba(0,212,255,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Animated shimmer strip */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.8), transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
          />

          {/* Trophy icon */}
          <motion.div
            initial={{ rotate: -12, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 14,
              delay: 0.15,
            }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300"
            style={{ boxShadow: "0 0 24px rgba(252,196,78,0.35)" }}
          >
            <Trophy className="h-5 w-5" strokeWidth={1.8} />
          </motion.div>

          {/* Body */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent-primary)]">
              <span>Achievement Unlocked</span>
              <span
                aria-hidden
                className="inline-block h-1 w-1 rounded-full bg-[color:var(--accent-primary)]"
              />
              <span className="text-[color:var(--text-muted)]">Deep Dive</span>
            </div>
            <p className="mt-1.5 text-sm leading-snug text-[color:var(--text-primary)]">
              You&rsquo;ve explored Marwan&rsquo;s portfolio thoroughly.
            </p>
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            data-cursor="hover"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[color:var(--text-muted)] transition-colors hover:border-white/30 hover:text-[color:var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>

          {/* Auto-dismiss progress line */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[color:var(--accent-primary)]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: DISMISS_DELAY_MS / 1000, ease: "linear" }}
            style={{
              boxShadow: "0 0 8px rgba(0,212,255,0.6)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
