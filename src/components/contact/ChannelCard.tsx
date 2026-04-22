"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type ChannelAccent = "cyan" | "violet" | "blue" | "amber" | "sky";

export interface Channel {
  id: string;
  label: string;           // e.g. "Email"
  displayValue: string;    // e.g. "marwan2004000@gmail.com"
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: string;          // hex — border glow + icon tint on hover
  external?: boolean;
}

interface ChannelCardProps {
  channel: Channel;
  index: number;
  inView: boolean;
}

/* ==========================================================================
 * ChannelCard
 * --------------------------------------------------------------------------
 * A "transmission channel" tile. Renders an animated icon well, a label,
 * a clickable value, and a hover glow keyed to the channel's signature
 * color.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function ChannelCard({ channel, index, inView }: ChannelCardProps) {
  const { Icon, href, label, displayValue, accent, external } = channel;

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      data-cursor="hover"
      data-cursor-label={label}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.05 + index * 0.09,
        ease: EASE_OUT_EXPO,
      }}
      whileHover={{ y: -6 }}
      className="group relative flex min-w-[200px] flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--bg-secondary)]/60 p-5 backdrop-blur-sm"
      style={{
        ["--ch-accent" as string]: accent,
      }}
    >
      {/* Hover glow — a color-keyed halo that fades in */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px 220px at 50% 0%, ${accent}25, transparent 70%)`,
        }}
      />
      {/* Top accent bar */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)`,
        }}
      />

      {/* Status dot — live transmission indicator */}
      <span className="absolute top-4 right-4 flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        <motion.span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        live
      </span>

      {/* Icon well */}
      <div className="relative h-10 w-10">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-xl border transition-colors duration-300"
          style={{
            borderColor: `${accent}55`,
            backgroundColor: `${accent}12`,
          }}
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: accent }}
          initial={{ rotate: 0 }}
          whileHover={{ rotate: -8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </motion.span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: accent }}
        >
          {label}
        </div>
        <div className="truncate font-mono text-[13px] text-[color:var(--text-primary)] transition-colors duration-200 group-hover:text-white">
          {displayValue}
        </div>
      </div>

      {/* Footer arrow indicator */}
      <div className="mt-auto flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        <span>
          CH · {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: accent }}
          strokeWidth={2}
        />
      </div>
    </motion.a>
  );
}
