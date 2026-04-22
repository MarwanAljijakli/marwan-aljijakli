"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Eye,
  Zap,
  Database,
  Bot,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/* ==========================================================================
 * TechCategoryCards
 * --------------------------------------------------------------------------
 * Six small cards in a 3-column grid. Each carries its own emoji/icon,
 * label, technology list, and an animated bottom border that fills
 * left-to-right on hover.
 * ========================================================================== */

interface Category {
  emoji: string;
  icon: LucideIcon;
  label: string;
  tech: string[];
  accent: string; // hex
}

const CATEGORIES: Category[] = [
  {
    emoji: "🧠",
    icon: Brain,
    label: "AI & LLMs",
    tech: ["GPT-4", "Claude", "Llama", "Qwen", "LangChain", "RAG"],
    accent: "#00D4FF",
  },
  {
    emoji: "👁️",
    icon: Eye,
    label: "Computer Vision",
    tech: ["OpenCV", "YOLO v8/v11", "MediaPipe", "rPPG", "Video Analytics"],
    accent: "#10dc78",
  },
  {
    emoji: "⚡",
    icon: Zap,
    label: "Deployment",
    tech: ["Docker", "FastAPI", "Linux", "CI/CD", "Microservices", "REST APIs"],
    accent: "#FF6B35",
  },
  {
    emoji: "🗄️",
    icon: Database,
    label: "Data & Databases",
    tech: ["Python", "SQL", "PostgreSQL", "FAISS", "Chroma", "Vector DBs"],
    accent: "#7B2FBE",
  },
  {
    emoji: "🤖",
    icon: Bot,
    label: "GenAI & Vibe Coding",
    tech: ["Cursor", "Claude Code", "GitHub Copilot", "Prompt Engineering"],
    accent: "#fcc44e",
  },
  {
    emoji: "📱",
    icon: Smartphone,
    label: "Frontend & Mobile",
    tech: ["Flutter", "API Design", "Real-time Streaming"],
    accent: "#BFF7FF",
  },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function TechCategoryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((cat, i) => (
        <Card key={cat.label} category={cat} index={i} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Card({ category, index }: { category: Category; index: number }) {
  const { icon: Icon } = category;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: EASE_OUT_EXPO,
      }}
      data-cursor="card"
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--bg-secondary)]/60 p-6 backdrop-blur-sm transition-colors duration-300"
      style={{
        ["--card-accent" as string]: category.accent,
      }}
    >
      {/* spotlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at 25% 10%, ${category.accent}18, transparent 60%)`,
        }}
      />

      {/* header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-300"
          style={{
            backgroundColor: `${category.accent}15`,
            borderColor: `${category.accent}38`,
            color: category.accent,
          }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-base">
              {category.emoji}
            </span>
            <h3 className="font-display text-xl tracking-tight text-[color:var(--text-primary)]">
              {category.label}
            </h3>
          </div>
          <div
            className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.28em]"
            style={{ color: `${category.accent}cc` }}
          >
            {String(index + 1).padStart(2, "0")} / 06
          </div>
        </div>
      </div>

      {/* tech list */}
      <ul className="flex flex-wrap gap-1.5">
        {category.tech.map((t) => (
          <li
            key={t}
            className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-secondary)] transition-colors duration-200 group-hover:border-white/15 group-hover:text-[color:var(--text-primary)]"
          >
            {t}
          </li>
        ))}
      </ul>

      {/* animated bottom border — fills on hover */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
        style={{
          background: `linear-gradient(90deg, ${category.accent} 0%, transparent 100%)`,
          boxShadow: `0 0 14px ${category.accent}cc`,
        }}
      />
    </motion.article>
  );
}
