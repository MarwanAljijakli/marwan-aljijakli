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

type CategoryId =
  | "language"
  | "ai"
  | "llm"
  | "cv"
  | "rag"
  | "backend"
  | "data"
  | "devops"
  | "frontend";

interface Domain {
  id: CategoryId;
  label: string;
  unit: string; // singular noun for count badge ("tool", "language", …)
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
  /* ── 1. Languages ──────────────────────────────────────────────── */
  {
    id: "language",
    label: "Languages",
    unit: "language",
    color: "#BFF7FF",
    glow: "rgba(191,247,255,0.35)",
    items: [
      { name: "Python", proficiency: 98, years: "6+", note: "End-to-end · every production service" },
      { name: "TypeScript", proficiency: 85, years: "2", note: "React · Next.js · typed APIs" },
      { name: "SQL", proficiency: 88, years: "3", note: "Postgres · analytics · window functions" },
      { name: "Dart", proficiency: 80, years: "2", note: "Flutter mobile applications" },
      { name: "Bash / Shell", proficiency: 82, years: "4", note: "Automation · Linux pipelines" },
      { name: "C++", proficiency: 72, years: "2", note: "Perf-critical CV modules · bindings" },
    ],
  },

  /* ── 2. AI / ML frameworks ─────────────────────────────────────── */
  {
    id: "ai",
    label: "AI / ML Frameworks",
    unit: "framework",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.35)",
    items: [
      { name: "PyTorch", proficiency: 95, years: "2", note: "Model training · research to production" },
      { name: "TensorFlow / Keras", proficiency: 88, years: "2", note: "Production inference · serving" },
      { name: "Hugging Face Transformers", proficiency: 92, years: "2", note: "Pretrained models · pipelines" },
      { name: "scikit-learn", proficiency: 90, years: "3", note: "Classical ML · feature engineering" },
      { name: "CUDA / GPU", proficiency: 78, years: "2", note: "GPU acceleration · mixed precision" },
    ],
  },

  /* ── 3. LLM & GenAI engineering ─────────────────────────────────── */
  {
    id: "llm",
    label: "LLM & GenAI Engineering",
    unit: "stack",
    color: "#38BDF8",
    glow: "rgba(56,189,248,0.4)",
    items: [
      { name: "LangChain / LangGraph", proficiency: 95, years: "2", note: "Agent orchestration · tool use" },
      { name: "OpenAI API", proficiency: 95, years: "2", note: "GPT-4 · function calling · structured output" },
      { name: "Anthropic Claude API", proficiency: 92, years: "2", note: "Long-context reasoning · tool use" },
      { name: "Ollama / vLLM", proficiency: 82, years: "1", note: "Self-hosted LLM inference serving" },
      { name: "LoRA · PEFT", proficiency: 78, years: "1", note: "Parameter-efficient fine-tuning" },
      { name: "Prompt Engineering", proficiency: 97, years: "2", note: "CoT · guardrails · few-shot" },
    ],
  },

  /* ── 4. Computer Vision ─────────────────────────────────────────── */
  {
    id: "cv",
    label: "Computer Vision",
    unit: "library",
    color: "#10dc78",
    glow: "rgba(16,220,120,0.35)",
    items: [
      { name: "OpenCV", proficiency: 92, years: "2", note: "Image & video processing pipelines" },
      { name: "YOLO v8 / v11", proficiency: 94, years: "2", note: "Real-time object detection" },
      { name: "MediaPipe", proficiency: 85, years: "1", note: "Face · pose · hand tracking" },
      { name: "ONNX Runtime", proficiency: 80, years: "1", note: "Cross-framework model deployment" },
      { name: "rPPG", proficiency: 90, years: "2", note: "Contactless vitals from RGB video" },
    ],
  },

  /* ── 5. RAG & Vector DBs ────────────────────────────────────────── */
  {
    id: "rag",
    label: "RAG & Vector DBs",
    unit: "store",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.4)",
    items: [
      { name: "FAISS", proficiency: 95, years: "2", note: "High-performance similarity search" },
      { name: "ChromaDB", proficiency: 90, years: "2", note: "Embedded vector database" },
      { name: "Qdrant", proficiency: 82, years: "1", note: "Production vector search · filters" },
      { name: "Hybrid Retrieval", proficiency: 88, years: "1", note: "BM25 + dense · re-ranking" },
    ],
  },

  /* ── 6. Backend & APIs ──────────────────────────────────────────── */
  {
    id: "backend",
    label: "Backend & APIs",
    unit: "framework",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    items: [
      { name: "FastAPI", proficiency: 95, years: "2", note: "Async Python microservices · Pydantic" },
      { name: "Flask", proficiency: 82, years: "3", note: "Lightweight services · prototypes" },
      { name: "WebSocket / SSE", proficiency: 85, years: "2", note: "Real-time streaming telemetry" },
      { name: "Celery / Redis Queues", proficiency: 80, years: "2", note: "Background workers · async tasks" },
    ],
  },

  /* ── 7. Data Stores ─────────────────────────────────────────────── */
  {
    id: "data",
    label: "Data Stores",
    unit: "store",
    color: "#7B2FBE",
    glow: "rgba(123,47,190,0.4)",
    items: [
      { name: "PostgreSQL", proficiency: 88, years: "2", note: "Relational · structured data" },
      { name: "Redis", proficiency: 82, years: "2", note: "Caching · pub/sub · rate limiting" },
      { name: "MongoDB", proficiency: 75, years: "2", note: "Document store · flexible schema" },
    ],
  },

  /* ── 8. DevOps & Cloud ──────────────────────────────────────────── */
  {
    id: "devops",
    label: "DevOps & Cloud",
    unit: "tool",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.35)",
    items: [
      { name: "Docker · Compose", proficiency: 92, years: "2", note: "Containerised deployments" },
      { name: "Kubernetes", proficiency: 72, years: "1", note: "Orchestration · scaling · rollouts" },
      { name: "GitHub Actions", proficiency: 88, years: "2", note: "CI/CD · automated builds" },
      { name: "AWS", proficiency: 80, years: "2", note: "EC2 · S3 · Lambda · CloudFront" },
      { name: "Nginx", proficiency: 82, years: "2", note: "Reverse proxy · TLS · load balancing" },
      { name: "Git", proficiency: 96, years: "4", note: "Source control & collaboration" },
      { name: "Linux", proficiency: 90, years: "6+", note: "Servers · edge hosts · Ubuntu/Debian" },
    ],
  },

  /* ── 9. Frontend & Mobile ───────────────────────────────────────── */
  {
    id: "frontend",
    label: "Frontend & Mobile",
    unit: "framework",
    color: "#fcc44e",
    glow: "rgba(252,196,78,0.35)",
    items: [
      { name: "Next.js / React", proficiency: 85, years: "2", note: "App Router · SSR · RSC" },
      { name: "Tailwind CSS", proficiency: 90, years: "2", note: "Utility-first design system" },
      { name: "Three.js / R3F", proficiency: 80, years: "1", note: "3D scenes · GPU particles" },
      { name: "Flutter", proficiency: 82, years: "2", note: "Cross-platform mobile apps" },
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
            fig. 02 — production technology index
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Engineering stack · matrix view
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          <span className="tabular-nums text-[color:var(--accent-primary)]">
            {TOTAL_ITEMS} stacks
          </span>
          <span>{DOMAINS.length} domains</span>
        </div>
      </header>

      {/* ── Capability strip — high-signal callouts ──────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          "GPU · CUDA",
          "RAG · Hybrid Retrieval",
          "LLM Fine-tuning",
          "Real-time CV",
          "Vector Search",
          "Multi-cloud",
          "Production Microservices",
        ].map((cap) => (
          <span
            key={cap}
            className="rounded-md border border-[color:var(--accent-primary)]/20 bg-[color:var(--accent-primary)]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent-primary)]"
          >
            {cap}
          </span>
        ))}
      </div>

      {/* ── Body — masonry-style 2-col grid on lg+ ──────────────────── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
          {domain.items.length} {domain.unit}
          {domain.items.length === 1 ? "" : "s"}
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

              {/* Years of hands-on use — the only numeric readout kept.
                  Years are verifiable (timeline-anchored) and professional,
                  unlike self-rated percentage scores. */}
              <div className="w-12 shrink-0 text-right">
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
