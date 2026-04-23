"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ==========================================================================
 * CapabilityBars — fig. 01 of the Skills section
 * --------------------------------------------------------------------------
 * Replaces the radar chart with a ranked horizontal bar chart. Rationale:
 *   - Most values are high, so the radar polygon looked like a uniform
 *     heptagon — visually "all strong" with no information shown.
 *   - Horizontal bars give a direct, ordered comparison and a clear mean
 *     reference line for the eye.
 *
 * Each domain carries:
 *   - a rank chip on the left
 *   - a named label with its key technologies underneath
 *   - a capability bar coloured by domain with a cyan value pill at the
 *     right of the bar, and a years-of-focus badge
 *   - a dashed μ (mean) reference line painted across every row
 * ========================================================================== */

interface Domain {
  name: string;
  sub: string; // examples underneath
  value: number; // 0-100
  color: string;
  glow: string;
}

const RAW: Domain[] = [
  {
    name: "Prompt Engineering",
    sub: "Chain-of-thought · guardrails · tool use",
    value: 97,
    color: "#fcc44e",
    glow: "rgba(252,196,78,0.35)",
  },
  {
    name: "LLM · GenAI",
    sub: "GPT-4 · Claude · Llama · Qwen",
    value: 95,
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
  },
  {
    name: "RAG Systems",
    sub: "LangChain · FAISS · hybrid retrieval",
    value: 95,
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
  },
  {
    name: "Computer Vision",
    sub: "OpenCV · YOLO · MediaPipe · rPPG",
    value: 90,
    color: "#10dc78",
    glow: "rgba(16,220,120,0.35)",
  },
  {
    name: "System Architecture",
    sub: "FastAPI · microservices · vector DBs",
    value: 88,
    color: "#BFF7FF",
    glow: "rgba(191,247,255,0.35)",
  },
  {
    name: "DevOps",
    sub: "Docker · CI/CD · Linux edge",
    value: 88,
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.35)",
  },
  {
    name: "Data Engineering",
    sub: "Python · SQL · Postgres · feature stores",
    value: 82,
    color: "#7B2FBE",
    glow: "rgba(123,47,190,0.4)",
  },
  {
    name: "Mobile",
    sub: "Flutter · Dart · streaming APIs",
    value: 75,
    color: "#a4b6d1",
    glow: "rgba(164,182,209,0.3)",
  },
];

const DOMAINS = [...RAW].sort((a, b) => b.value - a.value);
const MEAN = Math.round(
  DOMAINS.reduce((s, d) => s + d.value, 0) / DOMAINS.length
);
const MAX = Math.max(...DOMAINS.map((d) => d.value));
const MIN = Math.min(...DOMAINS.map((d) => d.value));
const EASE = [0.16, 1, 0.3, 1] as const;

export default function CapabilityBars() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]">
            fig. 01 — capability profile
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Domain depth · ranked
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          <span className="tabular-nums text-[color:var(--accent-primary)]">
            μ = {MEAN}
          </span>
          <span>
            max = {MAX} · min = {MIN}
          </span>
        </div>
      </header>

      {/* ── Bars card ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:p-5">
        {/* Column labels */}
        <div className="mb-2 flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          <span className="w-6 shrink-0" />
          <span className="w-28 shrink-0 md:w-36">domain</span>
          <span className="flex-1">capability</span>
          <span className="w-10 shrink-0 text-right">score</span>
        </div>

        {/* Bars */}
        <div className="relative flex flex-col">
          {/* Mean reference line — spans the bar columns */}
          <MeanLine mean={MEAN} inView={inView} />

          {DOMAINS.map((d, i) => (
            <BarRow
              key={d.name}
              domain={d}
              rank={i + 1}
              inView={inView}
              isHovered={hovered === i}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>

        {/* Scale axis */}
        <div className="mt-2 flex items-center gap-3">
          <span className="w-6 shrink-0" />
          <span className="w-28 shrink-0 md:w-36" />
          <div className="relative flex-1">
            <div className="flex justify-between font-mono text-[9.5px] tabular-nums text-[color:var(--text-muted)]">
              {[0, 20, 40, 60, 80, 100].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>
          <span className="w-10 shrink-0" />
        </div>
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                             */
/* -------------------------------------------------------------------------- */

function BarRow({
  domain,
  rank,
  inView,
  isHovered,
  onHover,
  onLeave,
}: {
  domain: Domain;
  rank: number;
  inView: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: (rank - 1) * 0.06, ease: EASE }}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
      className={`group relative flex items-center gap-3 rounded-lg px-1 py-2 transition-colors ${
        isHovered ? "bg-white/[0.03]" : ""
      }`}
    >
      {/* Rank chip */}
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] tabular-nums transition-colors"
        style={{
          color: isHovered ? domain.color : "var(--text-muted)",
          borderColor: isHovered ? `${domain.color}66` : "rgba(255,255,255,0.1)",
          backgroundColor: isHovered ? `${domain.color}18` : "transparent",
        }}
      >
        {String(rank).padStart(2, "0")}
      </span>

      {/* Label */}
      <div className="w-28 shrink-0 md:w-36">
        <div
          className="truncate font-mono text-[11.5px] uppercase tracking-[0.14em] transition-colors"
          style={{ color: isHovered ? domain.color : "#E8F4FD" }}
        >
          {domain.name}
        </div>
        <div className="mt-0.5 truncate text-[10.5px] text-[color:var(--text-muted)]">
          {domain.sub}
        </div>
      </div>

      {/* Bar track */}
      <div className="relative flex-1 min-w-0">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${domain.value}%` } : {}}
            transition={{
              duration: 1.1,
              delay: 0.25 + (rank - 1) * 0.06,
              ease: EASE,
            }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${domain.color}80 0%, ${domain.color} 100%)`,
              boxShadow: isHovered
                ? `0 0 14px ${domain.glow}, 0 0 4px ${domain.glow}`
                : `0 0 6px ${domain.glow}`,
            }}
          />
        </div>
        {/* Tick marks at 20/40/60/80 — very faint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex justify-between px-[20%]"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-full w-px"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      </div>

      {/* Score pill */}
      <div className="w-10 shrink-0 text-right">
        <span
          className="font-mono text-[13px] font-semibold tabular-nums transition-colors"
          style={{ color: isHovered ? domain.color : "#ffffff" }}
        >
          {domain.value}
        </span>
      </div>
    </motion.div>
  );
}

function MeanLine({ mean, inView }: { mean: number; inView: boolean }) {
  // The mean line lives inside the bar column. It's painted absolutely over
  // the whole column stack so it crosses every bar. Its horizontal position
  // is `mean%` along the bar-column width.
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
      className="pointer-events-none absolute inset-y-0 flex items-stretch"
      style={{
        // Left = rank chip (24px) + gap (12px) + label (144px on md+) + gap (12px)
        // We approximate by pushing in from the label cell; on mobile it
        // just shifts a bit but the line still reads clearly.
        left: "calc(24px + 12px + 144px + 12px)",
        right: "calc(40px + 12px)",
      }}
    >
      <div className="relative h-full w-full">
        <div
          className="absolute inset-y-1 w-px"
          style={{
            left: `${mean}%`,
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,212,255,0.55) 0 6px, transparent 6px 10px)",
            backgroundSize: "1px 10px",
          }}
        />
        <div
          className="absolute -top-3 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--accent-primary)]"
          style={{ left: `${mean}%` }}
        >
          μ
        </div>
      </div>
    </motion.div>
  );
}
