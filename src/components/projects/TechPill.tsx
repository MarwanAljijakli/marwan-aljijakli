"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reusable monospace chip used across project cards.
 *
 *  - Rests with a muted border and cyan glyph
 *  - On hover: cyan border, faint cyan fill, glow — feels like a live circuit node
 */
export default function TechPill({
  children,
  accent = "cyan",
}: {
  children: ReactNode;
  accent?: "cyan" | "violet" | "orange";
}) {
  const variants = {
    cyan: {
      base: "border-white/10 text-[color:var(--text-secondary)]",
      hover:
        "hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)]/10 hover:text-[color:var(--accent-primary)] hover:shadow-[0_0_18px_rgba(0,212,255,0.28)]",
    },
    violet: {
      base: "border-white/10 text-[color:var(--text-secondary)]",
      hover:
        "hover:border-[color:var(--accent-secondary)] hover:bg-[color:var(--accent-secondary)]/10 hover:text-[#c6a4f5] hover:shadow-[0_0_18px_rgba(123,47,190,0.35)]",
    },
    orange: {
      base: "border-white/10 text-[color:var(--text-secondary)]",
      hover:
        "hover:border-[color:var(--accent-tertiary)] hover:bg-[color:var(--accent-tertiary)]/10 hover:text-[color:var(--accent-tertiary)] hover:shadow-[0_0_18px_rgba(255,107,53,0.28)]",
    },
  } as const;

  const v = variants[accent];

  return (
    <motion.span
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex cursor-default items-center rounded-full border bg-[color:var(--bg-primary)]/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-sm transition-colors duration-200 ${v.base} ${v.hover}`}
    >
      {children}
    </motion.span>
  );
}
