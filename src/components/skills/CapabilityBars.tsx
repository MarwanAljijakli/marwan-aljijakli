"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ==========================================================================
 * CapabilityBars — fig. 01 of the Skills section
 * --------------------------------------------------------------------------
 * A tier-based capability profile. Instead of arbitrary self-rated
 * percentages (which read as amateur), each engineering domain is tagged
 * with one of four qualitative tiers that hiring managers and CTOs
 * recognise immediately:
 *
 *   CORE     — specialist depth, research + production
 *   DEEP     — production-grade, shipped multiple systems
 *   PROVEN   — delivered repeatedly across projects
 *   ACTIVE   — currently growing · actively shipping
 *
 * The horizontal bar is purely a visual reinforcement of the tier; it is
 * never labelled with a numeric value and has no 0-100 axis underneath.
 * ========================================================================== */

type TierId = "core" | "deep" | "proven" | "active";

interface TierDef {
  id: TierId;
  label: string;
  fill: number; // 0-1, bar fill ratio
  accent: string;
  glow: string;
  description: string;
}

const TIERS: Record<TierId, TierDef> = {
  core: {
    id: "core",
    label: "Core",
    fill: 1.0,
    accent: "#00D4FF",
    glow: "rgba(0,212,255,0.4)",
    description: "Specialist depth · research + production",
  },
  deep: {
    id: "deep",
    label: "Deep",
    fill: 0.88,
    accent: "#38BDF8",
    glow: "rgba(56,189,248,0.35)",
    description: "Production-grade · multiple shipped systems",
  },
  proven: {
    id: "proven",
    label: "Proven",
    fill: 0.76,
    accent: "#BFF7FF",
    glow: "rgba(191,247,255,0.3)",
    description: "Delivered repeatedly across projects",
  },
  active: {
    id: "active",
    label: "Active",
    fill: 0.62,
    accent: "#a4b6d1",
    glow: "rgba(164,182,209,0.25)",
    description: "Currently growing · actively shipping",
  },
};

interface Domain {
  name: string;
  sub: string;
  tier: TierId;
  color: string;
  glow: string;
}

const DOMAINS: Domain[] = [
  {
    name: "Prompt Engineering",
    sub: "Chain-of-thought · guardrails · structured output",
    tier: "core",
    color: "#fcc44e",
    glow: "rgba(252,196,78,0.35)",
  },
  {
    name: "LLM & GenAI Engineering",
    sub: "GPT-4 · Claude · Llama · Ollama · vLLM",
    tier: "core",
    color: "#38BDF8",
    glow: "rgba(56,189,248,0.4)",
  },
  {
    name: "RAG & Vector Search",
    sub: "LangChain · FAISS · Qdrant · hybrid retrieval",
    tier: "core",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.4)",
  },
  {
    name: "Computer Vision",
    sub: "YOLO · OpenCV · MediaPipe · rPPG · ONNX",
    tier: "deep",
    color: "#10dc78",
    glow: "rgba(16,220,120,0.35)",
  },
  {
    name: "AI / ML Training",
    sub: "PyTorch · TensorFlow · CUDA · LoRA / PEFT",
    tier: "deep",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
  },
  {
    name: "System Architecture",
    sub: "Microservices · async · vector DBs · edge",
    tier: "proven",
    color: "#BFF7FF",
    glow: "rgba(191,247,255,0.35)",
  },
  {
    name: "Backend & APIs",
    sub: "FastAPI · WebSocket · Celery · Redis queues",
    tier: "proven",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
  },
  {
    name: "DevOps & Cloud",
    sub: "Docker · Kubernetes · AWS · CI/CD · Nginx",
    tier: "proven",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.35)",
  },
  {
    name: "Data Engineering",
    sub: "Postgres · Redis · MongoDB · pipelines",
    tier: "active",
    color: "#7B2FBE",
    glow: "rgba(123,47,190,0.4)",
  },
  {
    name: "Frontend & Mobile",
    sub: "Next.js · Tailwind · Three.js · Flutter",
    tier: "active",
    color: "#a4b6d1",
    glow: "rgba(164,182,209,0.3)",
  },
];

const TIER_COUNT: Record<TierId, number> = DOMAINS.reduce(
  (acc, d) => {
    acc[d.tier]++;
    return acc;
  },
  { core: 0, deep: 0, proven: 0, active: 0 } as Record<TierId, number>
);

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */

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
            fig. 01 — production capability profile
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Engineering depth · by tier
          </div>
        </div>
        <div className="hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] md:flex">
          <span className="tabular-nums text-[color:var(--accent-primary)]">
            {DOMAINS.length} domains
          </span>
          <span>{Object.keys(TIERS).length} tiers</span>
        </div>
      </header>

      {/* ── Seniority strip ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          "End-to-end ownership",
          "Applied research",
          "Production AI",
          "Team leadership",
          "Strategic roadmap",
        ].map((cap) => (
          <span
            key={cap}
            className="rounded-md border border-[color:var(--accent-primary)]/20 bg-[color:var(--accent-primary)]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent-primary)]"
          >
            {cap}
          </span>
        ))}
      </div>

      {/* ── Tier distribution summary ───────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
        {(Object.values(TIERS) as TierDef[]).map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: t.accent,
                boxShadow: `0 0 8px ${t.glow}`,
              }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white">
              {t.label}
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[color:var(--text-muted)]">
              {TIER_COUNT[t.id]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bars card ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:p-5">
        {/* Column labels */}
        <div className="mb-2 flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          <span className="w-6 shrink-0" />
          <span className="w-40 shrink-0">domain</span>
          <span className="flex-1">capability</span>
          <span className="w-[72px] shrink-0 text-right">tier</span>
        </div>

        <div className="flex flex-col">
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
  const tier = TIERS[domain.tier];

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
      <div className="w-40 shrink-0">
        <div
          className="font-mono text-[11px] uppercase leading-tight tracking-[0.12em] transition-colors"
          style={{ color: isHovered ? domain.color : "#E8F4FD" }}
        >
          {domain.name}
        </div>
        <div className="mt-1 text-[10.5px] leading-snug text-[color:var(--text-muted)]">
          {domain.sub}
        </div>
      </div>

      {/* Bar track — width reflects tier, not any numeric score */}
      <div className="relative flex-1 min-w-0">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${tier.fill * 100}%` } : {}}
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
      </div>

      {/* Tier badge — replaces the numeric score column */}
      <div className="w-[72px] shrink-0 text-right">
        <span
          className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
          style={{
            color: isHovered ? "#ffffff" : tier.accent,
            borderColor: isHovered ? tier.accent : `${tier.accent}44`,
            backgroundColor: isHovered ? `${tier.accent}22` : `${tier.accent}0E`,
            boxShadow: isHovered ? `0 0 12px ${tier.glow}` : undefined,
          }}
        >
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{
              backgroundColor: tier.accent,
              boxShadow: `0 0 6px ${tier.glow}`,
            }}
          />
          {tier.label}
        </span>
      </div>
    </motion.div>
  );
}
