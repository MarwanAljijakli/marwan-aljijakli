"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

/* ==========================================================================
 * CounterCards
 * --------------------------------------------------------------------------
 * Four stat tiles that count up from 0 when the group scrolls into view.
 * The last tile uses the infinity symbol and pulses instead of counting.
 * ========================================================================== */

interface StatDef {
  value: number | "∞";
  suffix?: string;
  label: string;
  formatter?: (v: number) => string;
}

const STATS: StatDef[] = [
  { value: 3, suffix: "+", label: "Years in AI Engineering" },
  { value: 10, suffix: "+", label: "Production AI Systems Deployed" },
  { value: 5, suffix: "+", label: "Industries Impacted" },
  { value: "∞", label: "Lines of Code" },
];

export default function CounterCards() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.35 });

  return (
    <div
      ref={wrapRef}
      className="grid grid-cols-2 gap-3 sm:gap-4"
      aria-label="Key statistics"
    >
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} inView={inView} index={i} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function StatCard({
  stat,
  inView,
  index,
}: {
  stat: StatDef;
  inView: boolean;
  index: number;
}) {
  const isInfinity = stat.value === "∞";
  const targetNumber = isInfinity ? 0 : (stat.value as number);

  const animated = useCountUp(targetNumber, {
    trigger: inView && !isInfinity,
    duration: 2000,
  });

  const displayNumber = isInfinity
    ? "∞"
    : `${Math.round(animated)}${stat.suffix ?? ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      data-cursor="card"
      className="group relative overflow-hidden rounded-xl border-t-[3px] border-t-[color:var(--accent-primary)] bg-[color:var(--bg-secondary)] p-5 transition-colors hover:bg-[color:var(--bg-tertiary)]"
      style={{
        boxShadow: "0 0 0 1px rgba(0,212,255,0.08)",
      }}
    >
      {/* subtle radial highlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at 30% 0%, rgba(0,212,255,0.12), transparent 70%)",
        }}
      />

      <div className="relative flex items-end gap-2">
        {isInfinity ? (
          <motion.span
            className="font-display leading-none text-[color:var(--accent-primary)]"
            style={{
              fontSize: "4rem",
              textShadow: "0 0 30px rgba(0,212,255,0.6)",
            }}
            animate={
              inView
                ? { opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }
                : undefined
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {displayNumber}
          </motion.span>
        ) : (
          <span
            className="font-display leading-none text-[color:var(--accent-primary)] tabular-nums"
            style={{
              fontSize: "4rem",
              textShadow: "0 0 24px rgba(0,212,255,0.35)",
            }}
          >
            {displayNumber}
          </span>
        )}
      </div>

      <p className="relative mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        {stat.label}
      </p>
    </motion.div>
  );
}
