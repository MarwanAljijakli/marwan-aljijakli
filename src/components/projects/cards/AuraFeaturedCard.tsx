"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useLazySection } from "@/lib/hooks/useLazySection";
import AuraSimulation from "../visuals/AuraSimulation";
import TechPill from "../TechPill";
import type { Project } from "../data";

/**
 * Full-width hero card for the flagship project. Animated mesh gradient
 * background on the left, live AURA simulation on the right, hover-driven
 * speed-up baked into both.
 */
export default function AuraFeaturedCard({
  project,
}: {
  project: Project;
}) {
  const speedRef = useRef<number>(1);

  const setSpeed = (s: number) => {
    speedRef.current = s;
  };

  // Only mount the R3F factory scene once the card nears the viewport, and
  // pause its render loop when it leaves. This was the single heaviest
  // background animation on the page.
  const {
    ref: simWrapRef,
    hasBeenVisible,
    isVisible,
  } = useLazySection<HTMLDivElement>({ rootMargin: "400px" });

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onPointerEnter={() => setSpeed(2.4)}
      onPointerLeave={() => setSpeed(1)}
      className="group relative grid min-h-[500px] w-full grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--bg-secondary)] lg:grid-cols-2"
      style={{
        boxShadow: "0 30px 80px -30px rgba(255,107,53,0.25)",
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Animated mesh gradient background                                */}
      {/* ---------------------------------------------------------------- */}
      <MeshGradient />

      {/* ---------------------------------------------------------------- */}
      {/* LEFT: info                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-col gap-6 p-8 md:p-12">
        {/* Flagship badge */}
        <div className="flex items-center gap-3">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(252,196,78,0)",
                "0 0 24px 2px rgba(252,196,78,0.45)",
                "0 0 0 0 rgba(252,196,78,0)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300"
          >
            <span aria-hidden>🏆</span>
            Flagship Project
          </motion.span>
          {project.year && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              {project.year}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <h3
            className="font-display leading-[0.9] text-white"
            style={{
              fontSize: "clamp(3rem, 7vw, 5rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(255,107,53,0.3)",
            }}
          >
            {project.title}
          </h3>
          <p className="text-base text-[color:var(--text-primary)]/80 md:text-lg">
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p
          data-cursor="text"
          className="max-w-xl text-[15px] leading-[1.65] text-[color:var(--text-secondary)] md:text-[16px] md:leading-[1.7]"
        >
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <TechPill key={t} accent="orange">
              {t}
            </TechPill>
          ))}
        </div>

        {/* Impact strip */}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 font-mono text-[11px] uppercase leading-[1.6] tracking-[0.18em] text-amber-200/90">
          <span className="mr-2 text-amber-400">→</span>
          {project.impact}
        </div>

      </div>

      {/* ---------------------------------------------------------------- */}
      {/* RIGHT: live simulation                                           */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={simWrapRef}
        data-three-canvas
        className="relative min-h-[300px] lg:min-h-0"
      >
        {/* subtle inset border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 rounded-2xl border border-white/5"
        />
        {/* Canvas — only mounts once near viewport, pauses when off-screen */}
        {hasBeenVisible && (
          <AuraSimulation speedRef={speedRef} visible={isVisible} />
        )}

        {/* Legend overlay */}
        <div className="pointer-events-none absolute bottom-5 left-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80">
          <LegendDot color="#ffce3c" label="Worker" />
          <LegendDot color="#ff3b5c" label="Restricted" />
          <LegendDot color="#ffd93c" label="CCTV FOV" />
          <LegendDot color="#10dc78" label="PPE ✓" />
          <LegendDot color="#ff405a" label="PPE ✗" />
        </div>

        {/* "Live" tag */}
        <div className="pointer-events-none absolute top-5 right-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,60,80,0.8)]" />
          Live simulation
        </div>
      </div>

      {/* Hover lift (applied to the whole card via CSS var animation) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {label}
    </span>
  );
}

/** Slowly-shifting mesh gradient (dark navy → deep violet) on the left half. */
function MeshGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base layers that shift position over time */}
      <motion.div
        className="absolute -inset-[40%]"
        animate={{
          transform: [
            "translate3d(-10%, -10%, 0)",
            "translate3d(10%, 10%, 0)",
            "translate3d(-10%, -10%, 0)",
          ],
        }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(60% 50% at 25% 40%, rgba(123,47,190,0.55), transparent 70%)",
        }}
      />
      <motion.div
        className="absolute -inset-[40%]"
        animate={{
          transform: [
            "translate3d(10%, -5%, 0)",
            "translate3d(-5%, 10%, 0)",
            "translate3d(10%, -5%, 0)",
          ],
        }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(55% 50% at 75% 30%, rgba(255,107,53,0.35), transparent 70%)",
        }}
      />
      <motion.div
        className="absolute -inset-[40%]"
        animate={{
          transform: [
            "translate3d(5%, 20%, 0)",
            "translate3d(-20%, -10%, 0)",
            "translate3d(5%, 20%, 0)",
          ],
        }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(60% 60% at 40% 80%, rgba(0,212,255,0.25), transparent 70%)",
        }}
      />

      {/* Base dark gradient so text stays crisp over the right side */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.55) 45%, rgba(10,22,40,0.25) 70%, rgba(10,22,40,0) 100%)",
        }}
      />

      {/* Faint grid for texture */}
      <div
        className="absolute inset-0 grid-bg opacity-25"
        style={{
          maskImage: "linear-gradient(110deg, #000 0%, #000 50%, transparent 90%)",
        }}
      />
    </div>
  );
}
