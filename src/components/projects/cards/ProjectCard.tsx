"use client";

import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useTilt } from "@/lib/hooks/useTilt";
import TechPill from "../TechPill";
import type { AccentColor, Project } from "../data";

/* ==========================================================================
 * ProjectCard
 * --------------------------------------------------------------------------
 * The shared card shell used by every non-featured project. Handles:
 *   - 3D tilt on cursor move (useTilt with a ±8° cap)
 *   - Staggered scroll-in reveal (driven by the parent via `index`)
 *   - Reactive glow layer that follows the cursor
 *   - A children slot for the project-specific visual
 * ========================================================================== */

const ACCENT_HEX: Record<AccentColor, string> = {
  cyan: "#00D4FF",
  violet: "#7B2FBE",
  orange: "#FF6B35",
  amber: "#FCC44E",
};

export default function ProjectCard({
  project,
  index,
  children,
  onOpen,
}: {
  project: Project;
  index: number;
  children: ReactNode;
  onOpen: () => void;
}) {
  const tilt = useTilt({ maxDeg: 8 });

  const hex = ACCENT_HEX[project.accent];

  // Cursor-following spotlight: maps pointerX/Y (0..1) → CSS gradient position.
  const bgX = useTransform(tilt.pointerX, [0, 1], ["0%", "100%"]);
  const bgY = useTransform(tilt.pointerY, [0, 1], ["0%", "100%"]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <motion.div
        ref={tilt.ref}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--bg-secondary)]"
      >
        {/* Cursor spotlight */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${bgX.get()} ${bgY.get()}, ${hex}22, transparent 65%)`,
          }}
        />

        {/* Top accent bar */}
        <div
          aria-hidden
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${hex} 40%, ${hex} 60%, transparent)`,
            boxShadow: `0 0 12px ${hex}aa`,
          }}
        />

        {/* Visual slot */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative aspect-[16/8] w-full overflow-hidden border-b border-white/5 bg-black/40"
        >
          {children}
        </div>

        {/* Body */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="relative flex flex-1 flex-col gap-5 p-7 md:p-8"
        >
          {/* Top row: role/year + badge */}
          <div className="flex flex-wrap items-center gap-3">
            {project.badge && <BadgePill badge={project.badge} />}
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-muted)]">
              {project.role}
              {project.role && project.year && " · "}
              {project.year}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3
              className="font-display leading-[0.95] text-[color:var(--text-primary)]"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
                letterSpacing: "-0.015em",
              }}
            >
              {project.title}
            </h3>
            <p
              className="mt-2 text-sm"
              style={{ color: hex }}
            >
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p
            data-cursor="text"
            className="text-sm leading-[1.65] text-[color:var(--text-secondary)]"
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechPill key={t} accent={pillAccent(project.accent)}>
                {t}
              </TechPill>
            ))}
          </div>

          {/* Impact */}
          <div
            className="rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase leading-[1.6] tracking-[0.18em]"
            style={{
              borderColor: `${hex}33`,
              backgroundColor: `${hex}0d`,
              color: `${hex}dd`,
            }}
          >
            <span className="mr-1.5" style={{ color: hex }}>→</span>
            {project.impact}
          </div>

          {/* Action */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onOpen}
              data-cursor="hover"
              className="group/btn inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--accent-primary)]"
              style={{ transform: "translateZ(0)" }}
            >
              View Project
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                strokeWidth={2}
              />
            </button>

            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]"
            >
              0{index + 2} / 04
            </span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */

function BadgePill({ badge }: { badge: NonNullable<Project["badge"]> }) {
  const toneClasses = {
    amber: "text-amber-300 border-amber-400/40 bg-amber-400/10",
    orange:
      "text-[color:var(--accent-tertiary)] border-[color:var(--accent-tertiary)]/40 bg-[color:var(--accent-tertiary)]/10",
    cyan:
      "text-[color:var(--accent-primary)] border-[color:var(--accent-primary)]/40 bg-[color:var(--accent-primary)]/10",
    violet:
      "text-[#c6a4f5] border-[color:var(--accent-secondary)]/40 bg-[color:var(--accent-secondary)]/10",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${toneClasses[badge.tone]}`}
    >
      <span aria-hidden>{badge.emoji}</span>
      {badge.label}
    </span>
  );
}

function pillAccent(accent: AccentColor): "cyan" | "violet" | "orange" {
  if (accent === "violet") return "violet";
  if (accent === "orange" || accent === "amber") return "orange";
  return "cyan";
}
