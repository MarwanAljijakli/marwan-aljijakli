"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal } from "lucide-react";
import { useRef } from "react";
import GridBackground from "@/components/backgrounds/GridBackground";
import GlitchText from "@/components/common/GlitchText";
import { EXPERIENCES } from "./data";
import TimelineEntry from "./TimelineEntry";

/* ==========================================================================
 * Experience — "Mission Log"
 * --------------------------------------------------------------------------
 * Vertical timeline. Each entry is a TimelineEntry that flies in from its
 * own side; a scroll-linked gradient line "draws" itself downward as the
 * user reads, connecting every entry's pulsing node.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Map scroll-through-timeline 0→1 to the line's drawing progress.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 70%", "end 50%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      aria-label="Experience & mission log"
      className="relative isolate overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      {/* Background grid */}
      <GridBackground opacity={0.07} mask="radial" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.32), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-1/4 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,47,190,0.42), transparent 70%)",
        }}
      />

      <div className="container-page relative flex flex-col gap-16">
        {/* ------------------------------------------------------------ */}
        {/* Header                                                       */}
        {/* ------------------------------------------------------------ */}
        <header className="flex flex-col items-start gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]"
          >
            <Terminal className="h-3.5 w-3.5" strokeWidth={1.6} />
            05 · Mission Log
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            className="font-display leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
          >
            <GlitchText className="text-[color:var(--text-primary)]">
              EXP
            </GlitchText>
            <GlitchText className="text-gradient" delayMs={120}>
              ERIENCE
            </GlitchText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="max-w-xl font-mono text-[12px] uppercase leading-relaxed tracking-[0.22em] text-[color:var(--text-muted)]"
          >
            A chronological log of shipped work — roles, responsibilities,
            and the systems that came out of each sprint.
          </motion.p>
        </header>

        {/* ------------------------------------------------------------ */}
        {/* Timeline                                                     */}
        {/* ------------------------------------------------------------ */}
        <div ref={wrapRef} className="relative mt-4">
          {/* Line — mobile: left-6, desktop: centered. Animated gradient. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 left-6 w-[2px] -translate-x-1/2 md:left-1/2"
          >
            {/* Dim base track so you can see where the line will go */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
              }}
            />
            {/* Bright animated line that draws in with scroll progress */}
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: "top" }}
              className="absolute inset-0"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(180deg, var(--accent-primary) 0%, #8e58d6 55%, var(--accent-secondary) 100%)",
                  boxShadow:
                    "0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(123,47,190,0.25)",
                }}
              />
            </motion.div>
          </div>

          {/* Entries */}
          <div className="flex flex-col gap-16 md:gap-24">
            {EXPERIENCES.map((entry, i) => (
              <TimelineEntry key={entry.slug} entry={entry} index={i} />
            ))}
          </div>

          {/* Terminal prompt tail marker */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mt-12 ml-6 md:ml-0 md:text-center"
          >
            <span
              className="inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[color:var(--accent-secondary)]/30 bg-[color:var(--bg-secondary)]/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-muted)] backdrop-blur-sm md:translate-x-0"
            >
              <span className="animate-cursor-blink text-[color:var(--accent-primary)]">
                $_
              </span>
              log continues …
            </span>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Footer                                                       */}
        {/* ------------------------------------------------------------ */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-8 text-center text-sm italic text-[color:var(--text-muted)] md:text-base"
        >
          And the journey continues…
        </motion.p>
      </div>
    </section>
  );
}
