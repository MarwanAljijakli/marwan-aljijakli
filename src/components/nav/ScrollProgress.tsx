"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin 2px progress bar pinned to the very top of the viewport. Its
 * `scaleX` follows the page's `scrollYProgress`, spring-damped so the
 * bar eases instead of jittering frame-to-frame.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      data-floating-nav
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left"
      style={{
        scaleX: smooth,
        background:
          "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 60%, var(--accent-tertiary) 100%)",
        boxShadow: "0 0 12px rgba(0,212,255,0.7)",
      }}
    />
  );
}
