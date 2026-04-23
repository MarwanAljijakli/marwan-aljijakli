"use client";

import { motion } from "framer-motion";
import DataStreamBackground from "@/components/backgrounds/DataStreamBackground";
import GlitchText from "@/components/common/GlitchText";
import LossCurveBackground from "./LossCurveBackground";
import RadarChart from "./RadarChart";
import SkillsTicker from "./SkillsTicker";
import TechCategoryCards from "./TechCategoryCards";
import TechMatrix from "./TechMatrix";

/* ==========================================================================
 * Skills — "The Tech Stack" section
 * --------------------------------------------------------------------------
 * Control-room aesthetic. Layout:
 *
 *   [ Infinite stats ticker ]
 *   [ Eyebrow + headline ]
 *   [ RadarChart  |  SkillConstellation ]   (side by side on lg+, stacked below)
 *   [ TechCategoryCards — 3 cols ]
 *
 * A very faint training-loss curve slowly draws itself as a background
 * easter-egg — visible only if you're looking for it.
 * ========================================================================== */

export default function Skills() {
  return (
    <section
      id="skills"
      aria-label="Tech stack"
      className="relative isolate overflow-hidden border-t border-white/5"
    >
      {/* Data stream grid (binary / hex / math) — runs behind everything */}
      <DataStreamBackground opacity={0.9} />

      {/* Background easter egg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center"
      >
        <div className="relative h-[80%] w-full">
          <LossCurveBackground opacity={0.05} />
        </div>
      </div>

      {/* Grid overlay — graph paper vibe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, #000 30%, transparent 90%)",
        }}
      />

      {/* Radial accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 right-0 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,47,190,0.4), transparent 70%)",
        }}
      />

      {/* Ticker */}
      <div className="relative">
        <SkillsTicker />
      </div>

      <div className="container-page relative flex flex-col gap-20 py-24 md:py-32">
        {/* Eyebrow + headline */}
        <header className="flex flex-col items-start gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent-primary)]"
          >
            <span className="inline-block h-px w-10 bg-[color:var(--accent-primary)]" />
            04 · The Tech Stack
          </motion.div>

          <div className="flex w-full items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              <GlitchText className="text-[color:var(--text-primary)]">
                THE TECH
              </GlitchText>{" "}
              <GlitchText className="text-gradient" delayMs={180}>
                STACK
              </GlitchText>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden flex-col items-end font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] lg:flex"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
                System online · dash v1.0
              </span>
              <span className="mt-1">loss.json · last run · 98.3% conv.</span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl text-[color:var(--text-secondary)]"
          >
            A live dashboard of the tools and frameworks that ship the systems.
            The radar summarises depth per domain; the matrix lists every
            tool with years of use.
          </motion.p>
        </header>

        {/* Main visualisations — side by side on lg+ */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <RadarChart />
          <TechMatrix />
        </div>

        {/* Category cards */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]"
          >
            <span className="inline-block h-px w-10 bg-[color:var(--text-muted)]" />
            Capabilities · by domain
          </motion.div>
          <TechCategoryCards />
        </div>
      </div>
    </section>
  );
}
