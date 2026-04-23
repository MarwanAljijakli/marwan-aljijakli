"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ==========================================================================
 * TechMatrix — fig. 02 of the Skills section
 * --------------------------------------------------------------------------
 * A dashboard-style inventory of every technology, grouped by domain.
 *
 * Layout:
 *   ┌─ Domain header (colour-coded dot · name · item count) ─┐
 *   │   Tech row · bar · pct · years                         │
 *   │   Tech row · bar · pct · years                         │
 *   └────────────────────────────────────────────────────────┘
 *
 * The previous inline-label layout truncated long domain names
 * ("COMPUTER VISI…") on narrow columns; this version gives every domain
 * its own full-width header row so names never truncate.
 * ========================================================================== */

type CategoryId = "language" | "ai" | "cv" | "data" | "devops" | "frontend";

interface Domain {
  id: CategoryId;
  label: string;
  color: string;
  glow: string;
  items: Tech[];
}

interface Tech {
  name: string;
  proficiency: number; // 0-100
  years: string;
  note: string;
}

const DOMAINS: Domain[] = [
  {
    id: "language",
    label: "Language",
    color: "#BFF7FF",
    glow: "rgba(191,247,255,0.35)",
    items: [
      {
        name: "Python",
        proficiency: 98,
        years: "6+",
        note: "End-to-end · every project",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
    items: [
      {
        name: "PyTorch",
        proficiency: 95,
        years: "2",
        note: "Model training · research to prod",
      },
      {
        name: "TensorFlow",
        proficiency: 88,
        years: "2",
        note: "Production inference & serving",
      },
      {
        name: "LangChain",
        proficiency: 95,
        years: "2",
        note: "LLM orchestration · RAG",
      },
    ],
  },
  {
    id: "cv",
    label: "Computer Vision",
    color: "#10dc78",
    glow: "rgba(16,220,120,0.35)",
    items: [
      {
        name: "OpenCV",
        proficiency: 92,
        years: "2",
        note: "Image & video pipelines",
      },
      {
        name: "YOLO v8 / v11",
        proficiency: 94,
        years: "2",
        note: "Real-time object detection",
      },
      {
        name: "MediaPipe",
        proficiency: 85,
        years: "1",
        note: "Face · pose · hand tracking",
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    color: "#7B2FBE",
    glow: "rgba(123,47,190,0.4)",
    items: [
      {
        name: "FAISS",
        proficiency: 95,
        years: "2",
        note: "Vector similarity search",
      },
      {
        name: "PostgreSQL",
        proficiency: 88,
        years: "2",
        note: "Relational & structured data",
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.35)",
    items: [
      {
        name: "FastAPI",
        proficiency: 95,
        years: "2",
        note: "Async Python microservices",
      },
      {
        name: "Docker",
        proficiency: 92,
        years: "2",
        note: "Containerised deployments",
      },
      {
        name: "Git",
        proficiency: 96,
        years: "4",
        note: "Source control & collaboration",
      },
      {
        name: "Linux",
        proficiency: 90,
        years: "6+",
        note: "Servers and edge hosts",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & Mobile",
    color: "#fcc44e",
    glow: "rgba(252,196,78,0.35)",
    items: [
      {
        name: "Flutter",
        proficiency: 82,
        years: "2",
        note: "Cross-platform mobile apps",
      },
      {
        name: "Next.js",
        proficiency: 85,
        years: "1",
        note: "This portfolio · App Router",
      },
    ],
  },
];

const TOTAL_ITEMS = DOMAINS.reduce((s, d) => s + d.items.length, 0);
const EASE = [0.16, 1, 0.3, 1] as const;

export default function TechMatrix() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.15 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]">
            fig. 02 — technology index
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Tech stack · matrix view
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          <span className="tabular-nums text-[color:var(--accent-primary)]">
            {TOTAL_ITEMS} stacks
          </span>
          <span>{DOMAINS.length} domains</span>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {DOMAINS.map((domain, domainIdx) => (
          <DomainGroup
            key={domain.id}
            domain={domain}
            inView={inView}
            baseDelay={domainIdx * 0.07}
            hovered={hovered}
            onHover={setHovered}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Domain group                                                              */
/* -------------------------------------------------------------------------- */

function DomainGroup({
  domain,
  inView,
  baseDelay,
  hovered,
  onHover,
}: {
  domain: Domain;
  inView: boolean;
  baseDelay: number;
  hovered: string | null;
  onHover: (key: string | null) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: baseDelay, ease: EASE }}
      className="overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.025] to-transparent"
      style={{ borderLeft: `2px solid ${domain.color}66` }}
    >
      {/* Group header */}
      <header
        className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5"
        style={{
          background: `linear-gradient(90deg, ${domain.color}10 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: domain.color,
              boxShadow: `0 0 10px ${domain.glow}`,
            }}
          />
          <span
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: domain.color }}
          >
            {domain.label}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          {domain.items.length}
          {domain.items.length === 1 ? " tool" : " tools"}
        </span>
      </header>

      {/* Rows */}
      <div>
        {domain.items.map((tech, i) => {
          const key = `${domain.id}:${tech.name}`;
          const isHovered = hovered === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.45,
                delay: baseDelay + 0.12 + i * 0.05,
                ease: EASE,
              }}
              onPointerEnter={() => onHover(key)}
              onPointerLeave={() => onHover(null)}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                i === domain.items.length - 1 ? "" : "border-b border-white/5"
              } ${isHovered ? "bg-white/[0.03]" : ""}`}
            >
              {/* Tech name + subtitle */}
              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-[14px] font-semibold transition-colors ${
                    isHovered
                      ? "text-white"
                      : "text-[color:var(--text-primary)]"
                  }`}
                >
                  {tech.name}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-[color:var(--text-muted)]">
                  {tech.note}
                </div>
              </div>

              {/* Proficiency bar */}
              <div className="hidden w-32 shrink-0 sm:block md:w-36 lg:w-32 xl:w-44">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${tech.proficiency}%` } : {}}
                    transition={{
                      duration: 1.1,
                      delay: baseDelay + 0.25 + i * 0.05,
                      ease: EASE,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${domain.color}99 0%, ${domain.color} 100%)`,
                      boxShadow: isHovered
                        ? `0 0 10px ${domain.glow}`
                        : `0 0 4px ${domain.glow}`,
                    }}
                  />
                </div>
              </div>

              {/* Pct */}
              <div className="w-11 shrink-0 text-right">
                <span
                  className="font-mono text-[13px] font-semibold tabular-nums transition-colors"
                  style={{ color: isHovered ? domain.color : "#a4b6d1" }}
                >
                  {tech.proficiency}
                  <span className="text-[9px] text-[color:var(--text-muted)]">
                    %
                  </span>
                </span>
              </div>

              {/* Years */}
              <div className="w-11 shrink-0 text-right">
                <span
                  className="inline-block rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums"
                  style={{
                    borderColor: `${domain.color}44`,
                    backgroundColor: `${domain.color}12`,
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
    </motion.section>
  );
}
