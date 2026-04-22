"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/scroll";

/**
 * Floating action button in the bottom-right corner. Appears once the
 * reader crosses 50 % of the page; clicking it smooth-scrolls to the top
 * via Lenis. Hovering spins the arrow 360° once.
 */
export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  // `opacity` here isn't used directly; we use it to trigger state updates
  // that flip the boolean `visible` below.
  const threshold = useTransform(scrollYProgress, (v) => (v > 0.5 ? 1 : 0));

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = threshold.on("change", (v) => setVisible(v === 1));
    return () => unsub();
  }, [threshold]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          data-cursor="hover"
          data-cursor-label="Top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover="hover"
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-6 right-6 z-[40] flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--accent-primary)]/40 bg-[color:var(--bg-secondary)]/80 text-[color:var(--accent-primary)] backdrop-blur-md md:bottom-8 md:right-8"
          style={{
            boxShadow: "0 12px 32px -8px rgba(0,212,255,0.35)",
          }}
        >
          {/* Outer orbit ring */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border border-[color:var(--accent-primary)]/25"
            variants={{
              hover: { scale: 1.22 },
              idle: { scale: 1 },
            }}
            initial="idle"
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          />

          {/* Arrow — rotates 360° once on hover */}
          <motion.span
            aria-hidden
            className="relative flex items-center justify-center"
            variants={{
              hover: { rotate: 360 },
              idle: { rotate: 0 },
            }}
            initial="idle"
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </motion.span>

          {/* Progress ring — fills as you scroll */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 -rotate-90"
            viewBox="0 0 48 48"
          >
            <motion.circle
              cx="24"
              cy="24"
              r="23"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={1}
              style={{ pathLength: scrollYProgress }}
              opacity={0.55}
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
