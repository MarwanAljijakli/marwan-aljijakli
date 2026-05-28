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
  value: number | string;
  suffix?: string;
  label: string;
  formatter?: (v: number) => string;
}

const STATS: StatDef[] = [
  { value: 3, label: "Production AI Systems" },
  { value: 435, suffix: "", label: "University GPA", formatter: (v) => `${(v / 100).toFixed(2)}/5.0` },
  { value: 800, suffix: "+", label: "Active Users" },
  { value: "🏆", label: "National Competition Finalist" },
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
  const isString = typeof stat.value === "string";
  const targetNumber = isString ? 0 : (stat.value as number);

  const animated = useCountUp(targetNumber, {
    trigger: inView && !isString,
    duration: 2000,
  });

  const displayNumber = isString
    ? (stat.value as string)
    : stat.formatter
      ? stat.formatter(animated) + (stat.suffix ?? "")
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
        {isString ? (
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

      <p className="relative mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        {stat.label}
      </p>
    </motion.div>
  );
}
