"use client";

import { motion } from "framer-motion";
import { Brain, Database, FileText, MessageSquare, Sparkles, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ==========================================================================
 * RagFlowDiagram
 * --------------------------------------------------------------------------
 * A 6-node data pipeline drawn with HTML + SVG:
 *
 *   Document → Embeddings → Vector DB → Query → LLM → Answer
 *
 * Each node sits on top of a background SVG that carries the connecting
 * dashed lines and the animated "data packets" (small glowing circles
 * travelling between nodes, using <animateMotion>).
 * ========================================================================== */

interface Node {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const NODES: Node[] = [
  { id: "doc", label: "Document", hint: "PDFs · Markdown · HTML", icon: FileText },
  { id: "emb", label: "Embeddings", hint: "Text → Vectors", icon: Layers },
  { id: "db", label: "Vector DB", hint: "FAISS · Chroma", icon: Database },
  { id: "q", label: "Query", hint: "User question", icon: MessageSquare },
  { id: "llm", label: "LLM", hint: "GPT-4 · Claude", icon: Brain },
  { id: "ans", label: "Answer", hint: "Cited response", icon: Sparkles },
];

// Layout: a 2×3 grid with arrows zig-zagging left→right, down, right→left, down, right→left.
// Positions are in a 520×270 SVG viewBox, normalised so cards can position via %.
const POSITIONS: Record<string, { x: number; y: number }> = {
  doc: { x: 8, y: 20 },
  emb: { x: 40, y: 20 },
  db: { x: 72, y: 20 },
  q: { x: 8, y: 72 },
  llm: { x: 40, y: 72 },
  ans: { x: 72, y: 72 },
};

/** Edges = draw order. Each edge renders a dashed path and ships a packet. */
const EDGES: { from: string; to: string; delay: number }[] = [
  { from: "doc", to: "emb", delay: 0 },
  { from: "emb", to: "db", delay: 0.5 },
  { from: "db", to: "q", delay: 1.0 },
  { from: "q", to: "llm", delay: 1.5 },
  { from: "llm", to: "ans", delay: 2.0 },
];

const VIEW_W = 520;
const VIEW_H = 260;

export default function RagFlowDiagram() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-black/40">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 grid-bg"
        style={{ maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 95%)" }}
      />

      {/* SVG: connectors + packets */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rag-stroke" x1="0" x2="1">
            <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.9" />
          </linearGradient>

          <filter id="rag-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {EDGES.map((edge) => {
          const a = POSITIONS[edge.from];
          const b = POSITIONS[edge.to];
          const ax = (a.x / 100) * VIEW_W + 50;
          const ay = (a.y / 100) * VIEW_H + 22;
          const bx = (b.x / 100) * VIEW_W + 50;
          const by = (b.y / 100) * VIEW_H + 22;
          const path = buildPath(ax, ay, bx, by);
          const pathId = `rag-path-${edge.from}-${edge.to}`;

          return (
            <g key={pathId}>
              <path
                id={pathId}
                d={path}
                fill="none"
                stroke="url(#rag-stroke)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.55"
              />
              {/* Animated data packet */}
              <circle
                r="3.2"
                fill="#bff7ff"
                filter="url(#rag-glow)"
              >
                <animateMotion
                  dur="2.6s"
                  repeatCount="indefinite"
                  begin={`${edge.delay}s`}
                  path={path}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="2.6s"
                  repeatCount="indefinite"
                  begin={`${edge.delay}s`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Nodes on top — regular HTML */}
      {NODES.map((n, i) => {
        const p = POSITIONS[n.id];
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute flex translate-x-0 translate-y-0 items-center justify-center"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: "100px",
              height: "44px",
            }}
          >
            <div
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-[color:var(--bg-secondary)]/90 px-2.5 py-1.5 backdrop-blur-sm"
              style={{
                boxShadow: "0 4px 20px rgba(123,47,190,0.25)",
              }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-secondary)]/20 text-[color:var(--accent-primary)]">
                <n.icon className="h-3 w-3" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-primary)]">
                  {n.label}
                </div>
                <div className="truncate font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                  {n.hint}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Builds a smooth S-curve between two points. Horizontal-adjacent nodes get
 * a straight line; nodes that change rows (doc→q transitions) get a gentle
 * curve that hugs a grid of implied rails.
 */
function buildPath(x1: number, y1: number, x2: number, y2: number): string {
  const dy = y2 - y1;
  if (Math.abs(dy) < 5) {
    // Straight horizontal
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  // S-curve with control points pulled toward each endpoint's row.
  const cx1 = x1 + (x2 - x1) * 0.4;
  const cx2 = x1 + (x2 - x1) * 0.6;
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}
