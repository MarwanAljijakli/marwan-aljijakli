"use client";

import { motion, useInView } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useRef } from "react";

/* ==========================================================================
 * EducationTimeline
 * --------------------------------------------------------------------------
 * Three pulse-nodes connected by a dashed line that draws itself when the
 * component scrolls into view. Each node fades up on its own rhythm and
 * begins an on-going pulse glow.
 * ========================================================================== */

interface Milestone {
  title: string;
  org: string;
  detail?: string;
  year?: string;
}

const MILESTONES: Milestone[] = [
  {
    title: "B.Sc. Artificial Intelligence",
    org: "Jeddah International College",
    detail: "GPA: 4.35/5.0 · Graduating 2026",
    year: "2026",
  },
  {
    title: "AI Training Program",
    org: "SDAIA — Saudi Data & AI Authority",
    detail: "National AI authority certification",
    year: "2024",
  },
  {
    title: "AI Training Program",
    org: "KAUST",
    detail: "King Abdullah University of Science and Technology",
    year: "2024",
  },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function EducationTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      aria-label="Education & training"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]"
      >
        <GraduationCap className="h-3.5 w-3.5 text-[color:var(--accent-primary)]" strokeWidth={1.6} />
        Education &amp; training
        <span className="ml-2 h-px flex-1 bg-gradient-to-r from-[color:var(--accent-primary)]/30 to-transparent" />
      </motion.div>

      <div className="relative">
        {/* Dashed connector — horizontal on md+, vertical on mobile */}
        <Connector inView={inView} orientation="desktop" />
        <Connector inView={inView} orientation="mobile" />

        <ol className="relative z-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {MILESTONES.map((ms, i) => (
            <MilestoneCard
              key={ms.title + ms.org}
              milestone={ms}
              index={i}
              total={MILESTONES.length}
              inView={inView}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashed animated connector                                                 */
/* -------------------------------------------------------------------------- */

function Connector({
  inView,
  orientation,
}: {
  inView: boolean;
  orientation: "desktop" | "mobile";
}) {
  const isDesktop = orientation === "desktop";
  return (
    <motion.span
      aria-hidden
      initial={isDesktop ? { scaleX: 0 } : { scaleY: 0 }}
      animate={inView ? (isDesktop ? { scaleX: 1 } : { scaleY: 1 }) : {}}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }}
      className={
        isDesktop
          ? "absolute left-[8%] right-[8%] top-[28px] hidden h-px origin-left md:block"
          : "absolute left-[28px] top-0 bottom-0 block w-px origin-top md:hidden"
      }
      style={{
        backgroundImage: isDesktop
          ? "repeating-linear-gradient(90deg, var(--accent-primary) 0 8px, transparent 8px 16px)"
          : "repeating-linear-gradient(180deg, var(--accent-primary) 0 8px, transparent 8px 16px)",
        opacity: 0.55,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Milestone card                                                            */
/* -------------------------------------------------------------------------- */

function MilestoneCard({
  milestone,
  index,
  total,
  inView,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  inView: boolean;
}) {
  const delay = 0.3 + index * 0.18;
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay }}
      className="relative flex items-start gap-4 md:flex-col md:items-start"
    >
      {/* Node dot */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        {/* outer animated pulse ring */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[color:var(--accent-primary)]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={
            inView
              ? {
                  scale: [0.6, 1.4, 1.8],
                  opacity: [0, 0.6, 0],
                }
              : {}
          }
          transition={{
            duration: 1.8,
            delay: delay + 0.1,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        />

        {/* inner filled core */}
        <motion.span
          className="relative h-4 w-4 rounded-full bg-[color:var(--accent-primary)]"
          initial={{ scale: 0 }}
          animate={inView ? { scale: [0, 1.25, 1] } : {}}
          transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
          style={{ boxShadow: "0 0 20px rgba(0,212,255,0.65)" }}
        />

        {/* connector stubs (only on desktop) */}
        {index > 0 && (
          <span
            aria-hidden
            className="absolute left-0 top-1/2 hidden h-px w-2 -translate-y-1/2 -translate-x-2 bg-[color:var(--accent-primary)] md:block"
          />
        )}
        {index < total - 1 && (
          <span
            aria-hidden
            className="absolute right-0 top-1/2 hidden h-px w-2 -translate-y-1/2 translate-x-2 bg-[color:var(--accent-primary)] md:block"
          />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]">
          {String(index + 1).padStart(2, "0")} / 0{total}
        </div>
        <h3 className="mt-2 text-base font-semibold text-[color:var(--text-primary)] md:text-[17px]">
          {milestone.title}
        </h3>
        <div className="text-sm text-[color:var(--text-secondary)]">
          {milestone.org}
        </div>
        {milestone.detail && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            {milestone.detail}
          </p>
        )}
      </div>
    </motion.li>
  );
}
