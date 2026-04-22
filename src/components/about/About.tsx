"use client";

import { motion } from "framer-motion";
import MathBackground from "@/components/backgrounds/MathBackground";
import GlitchText from "@/components/common/GlitchText";
import BioReveal from "./BioReveal";
import BrainOrb from "./BrainOrb";
import CounterCards from "./CounterCards";
import EducationTimeline from "./EducationTimeline";
import SkillBars from "./SkillBars";
import Terminal from "./Terminal";

/* ==========================================================================
 * About — Section
 * --------------------------------------------------------------------------
 * Layout:
 *   • Left column (60%) — eyebrow, headline, counter cards, bio, skills
 *   • Right column (40%) — brain orb, terminal
 *   • Full-width band    — education timeline
 * ========================================================================== */

export default function About() {
  return (
    <section
      id="about"
      aria-label="About Marwan Aljijakli"
      className="relative isolate overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      {/* Drifting math symbols (subtle) */}
      <MathBackground
        opacity={0.6}
        density={55}
        colors={["#00D4FF", "#7B2FBE"]}
      />

      {/* Background pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] grid-bg mask-radial-fade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,47,190,0.4), transparent 70%)",
        }}
      />

      <div className="container-page relative">
        {/* ------------------------------------------------------------- */}
        {/* Section eyebrow                                               */}
        {/* ------------------------------------------------------------- */}
        <SectionEyebrow />

        {/* ------------------------------------------------------------- */}
        {/* Headline                                                      */}
        {/* ------------------------------------------------------------- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
        >
          <GlitchText className="text-[color:var(--text-primary)]">
            THE MIND
          </GlitchText>{" "}
          <GlitchText className="text-gradient" delayMs={180}>
            BEHIND THE SYSTEMS
          </GlitchText>
        </motion.h2>

        {/* ------------------------------------------------------------- */}
        {/* 60 / 40 split                                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* ================= LEFT COLUMN (60%) ====================== */}
          <div className="flex flex-col gap-12 lg:col-span-3">
            <CounterCards />

            <div className="flex flex-col gap-10">
              <BioReveal />
              <SkillBars />
            </div>
          </div>

          {/* ================= RIGHT COLUMN (40%) ===================== */}
          <div className="flex flex-col gap-10 lg:col-span-2">
            <BrainOrb />
            <Terminal />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Full-width education timeline                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-24 border-t border-white/5 pt-16">
          <EducationTimeline />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SectionEyebrow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]"
    >
      <span className="inline-block h-px w-10 bg-[color:var(--accent-primary)]" />
      02 · About
      <span className="ml-auto hidden text-[color:var(--text-muted)] sm:inline">
        /· intelligence · research · production
      </span>
    </motion.div>
  );
}
