"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/common/GlitchText";

/**
 * Section header for "What I've Built" — title plus a left-to-right animated
 * underline that draws itself when the header scrolls into view.
 */
export default function ProjectsHeader() {
  return (
    <div className="flex flex-col items-start gap-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]"
      >
        <span className="inline-block h-px w-10 bg-[color:var(--accent-primary)]" />
        03 · Selected Work
      </motion.div>

      <div className="relative inline-block">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[0.9] tracking-tight text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)" }}
        >
          <GlitchText>WHAT I&apos;VE</GlitchText>{" "}
          <GlitchText className="text-gradient" delayMs={180}>
            BUILT
          </GlitchText>
        </motion.h2>

        {/* Animated underline — draws left → right when it enters the viewport. */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-2 block h-[3px] w-full origin-left rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 60%, var(--accent-tertiary) 100%)",
            boxShadow: "0 0 18px rgba(0,212,255,0.5)",
          }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl font-mono text-[12px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]"
      >
        Production AI systems that create real-world impact.
      </motion.p>
    </div>
  );
}
