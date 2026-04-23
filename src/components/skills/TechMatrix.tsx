"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ==========================================================================
 * TechMatrix
 * --------------------------------------------------------------------------
 * A dense, dashboard-style replacement for the previous 3D orbital
 * constellation. Groups technologies by domain; each row carries:
 *   - category-coded dot
 *   - tech name (bold, legible sans-serif)
 *   - animated proficiency bar (0–100)
 *   - years-of-experience badge
 *
 * All 14+ stacks are readable at a glance without hover — hover just
 * highlights the row and shows an associated task hint.
 * ========================================================================== */

type Category = "language" | "ai" | "cv" | "data" | "devops" | "frontend";

interface Domain {
  id: Category;
  label: string;
  color: string;
  glow: string;
  items: Tech[];
}

interface Tech {
  name: string;
  proficiency: number; // 0-100
  years: string; // "6+", "4", "2"
  note: string; // shown on hover
}

const DOMAINS: Domain[] = [
  {
    id: "language",
    label: "Language",
    color: "#BFF7FF",
    glow: "rgba(191,247,255,0.35)",
    items: [
      { name: "Python", proficiency: 98, years: "6+", note: "End-to-end · every project" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
    items: [
      { name: "PyTorch", proficiency: 95, years: "2", note: "Model training · research to prod" },
      { name: "TensorFlow", proficiency: 88, years: "2", note: "Production inference · serving" },
      { name: "LangChain", proficiency: 95, years: "2", note: "LLM orchestration · RAG" },
    ],
  },
  {
    id: "cv",
    label: "Computer Vision",
    color: "#10dc78",
    glow: "rgba(16,220,120,0.35)",
    items: [
      { name: "OpenCV", proficiency: 92, years: "2", note: "Image · video pipelines" },
      { name: "YOLO v8 / v11", proficiency: 94, years: "2", note: "Real-time detection" },
      { name: "MediaPipe", proficiency: 85, years: "1", note: "Face · pose · hands" },
    ],
  },
  {
    id: "data",
    label: "Data",
    color: "#7B2FBE",
    glow: "rgba(123,47,190,0.4)",
    items: [
      { name: "FAISS", proficiency: 95, years: "2", note: "Vector similarity search" },
      { name: "PostgreSQL", proficiency: 88, years: "2", note: "Relational · structured data" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.35)",
    items: [
      { name: "FastAPI", proficiency: 95, years: "2", note: "Async microservices" },
      { name: "Docker", proficiency: 92, years: "2", note: "Containerised deploys" },
      { name: "Git", proficiency: 96, years: "4", note: "Source control · collab" },
      { name: "Linux", proficiency: 90, years: "6+", note: "Servers + edge hosts" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend · Mobile",
    color: "#fcc44e",
    glow: "rgba(252,196,78,0.35)",
    items: [
      { name: "Flutter", proficiency: 82, years: "2", note: "Cross-platform mobile" },
      { name: "Next.js", proficiency: 85, years: "1", note: "This portfolio · App Router" },
    ],
  },
];

const TOTAL_ITEMS = DOMAINS.reduce((s, d) => s + d.items.length, 0);

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TechMatrix() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]">
            fig. 02 — technology index
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Tech stack · matrix view
          </div>
        </div>
        <div className="hidden flex-col items-end font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] md:flex">
          <span>{TOTAL_ITEMS} stacks · {DOMAINS.length} domains</span>
          <span className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
            sorted · proficiency
          </span>
        </div>
      </header>

      {/* ── Matrix ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
        {/* Column markers — subtle graph-paper vibe */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)",
            backgroundSize: "10% 100%",
          }}
        />

        {/* Column header row */}
        <div className="flex items-center gap-3 border-b border-white/5 bg-black/30 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          <span className="w-28 shrink-0 md:w-32">domain</span>
          <span className="w-24 shrink-0 md:w-32">technology</span>
          <span className="flex-1">proficiency</span>
          <span className="w-10 shrink-0 text-right">pct</span>
          <span className="w-12 shrink-0 text-right">yrs</span>
        </div>

        {/* Body */}
        <div>
          {DOMAINS.map((domain, domainIdx) => (
            <DomainBlock
              key={domain.id}
              domain={domain}
              inView={inView}
              baseDelay={domainIdx * 0.08}
              hovered={hovered}
              onHover={setHovered}
              isLast={domainIdx === DOMAINS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ── Caption ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
        <p className="text-[13px] leading-relaxed text-[color:var(--text-secondary)]">
          <span className="font-mono uppercase tracking-[0.14em] text-[color:var(--accent-primary)]">
            How to read:
          </span>{" "}
          each bar shows self-rated proficiency on a 0–100 scale, with years
          of hands-on use alongside. Domains are ordered top-down by how much
          of the day-to-day work lives there.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Domain block                                                              */
/* -------------------------------------------------------------------------- */

function DomainBlock({
  domain,
  inView,
  baseDelay,
  hovered,
  onHover,
  isLast,
}: {
  domain: Domain;
  inView: boolean;
  baseDelay: number;
  hovered: string | null;
  onHover: (key: string | null) => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`relative ${isLast ? "" : "border-b border-white/5"}`}
      style={{ borderLeft: `2px solid ${domain.color}66` }}
    >
      {domain.items.map((tech, i) => {
        const key = `${domain.id}:${tech.name}`;
        const isHovered = hovered === key;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: baseDelay + i * 0.06,
              ease: EASE,
            }}
            onPointerEnter={() => onHover(key)}
            onPointerLeave={() => onHover(null)}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
              isHovered ? "bg-white/[0.03]" : ""
            } ${i === 0 ? "pt-3" : ""} ${
              i === domain.items.length - 1 ? "pb-3" : ""
            }`}
          >
            {/* Domain label — only on first item of each group */}
            <div className="w-28 shrink-0 md:w-32">
              {i === 0 ? (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: domain.color,
                      boxShadow: `0 0 8px ${domain.glow}`,
                    }}
                  />
                  <span
                    className="truncate font-mono text-[11px] uppercase tracking-[0.14em]"
                    style={{ color: domain.color }}
                  >
                    {domain.label}
                  </span>
                </div>
              ) : (
                <span className="block h-2 w-2" />
              )}
            </div>

            {/* Tech name */}
            <div className="w-24 shrink-0 md:w-32">
              <div
                className={`truncate text-[13.5px] font-semibold transition-colors ${
                  isHovered ? "text-white" : "text-[color:var(--text-primary)]"
                }`}
              >
                {tech.name}
              </div>
              <div className="mt-0.5 truncate font-mono text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                {tech.note}
              </div>
            </div>

            {/* Proficiency bar */}
            <div className="relative flex-1 min-w-0">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${tech.proficiency}%` } : {}}
                  transition={{
                    duration: 1.2,
                    delay: baseDelay + i * 0.06 + 0.2,
                    ease: EASE,
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${domain.color}99 0%, ${domain.color} 100%)`,
                    boxShadow: isHovered
                      ? `0 0 12px ${domain.glow}`
                      : `0 0 4px ${domain.glow}`,
                  }}
                />
              </div>
            </div>

            {/* Pct */}
            <div
              className="w-10 shrink-0 text-right font-mono text-[12px] tabular-nums"
              style={{ color: isHovered ? domain.color : "#a4b6d1" }}
            >
              {tech.proficiency}
              <span className="text-[9px] text-[color:var(--text-muted)]">%</span>
            </div>

            {/* Years */}
            <div className="w-12 shrink-0 text-right">
              <span
                className="inline-block rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums"
                style={{
                  borderColor: `${domain.color}44`,
                  backgroundColor: `${domain.color}10`,
                  color: domain.color,
                }}
              >
                {tech.years}y
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
