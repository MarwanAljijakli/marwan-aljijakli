"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type ChannelAccent = "cyan" | "violet" | "blue" | "amber" | "sky";

export interface Channel {
  id: string;
  label: string; // e.g. "Email"
  displayValue: string; // e.g. "marwan2004000@gmail.com"
  cta: string; // e.g. "Write an email"
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: string;
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
 * A professional contact card. Renders an accent-colored icon well, the
 * channel name, a readable value (email address / phone / handle), and a
 * clear CTA row at the bottom ("Write an email →", "Call directly →",
 * "View profile →") so visitors immediately know what tapping the card
 * will do.
 *
 * Prior revisions had a "LIVE" pulsing chip and a "CH · 01" metadata
 * footer — both added visual noise without adding information. Removed.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function ChannelCard({ channel, index, inView }: ChannelCardProps) {
  const { Icon, href, label, displayValue, cta, accent, external } = channel;

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
      className="group relative flex min-w-[200px] flex-1 flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--bg-secondary)]/70 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20"
      style={{
        ["--ch-accent" as string]: accent,
      }}
    >
      {/* Hover glow — a color-keyed halo that fades in */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px 200px at 30% 0%, ${accent}2a, transparent 70%)`,
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

      {/* Icon well */}
      <div className="relative h-12 w-12">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-xl border transition-colors duration-300"
          style={{
            borderColor: `${accent}55`,
            backgroundColor: `${accent}12`,
          }}
          whileHover={{ scale: 1.06, rotate: -4 }}
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
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </motion.span>
      </div>

      {/* Label + value */}
      <div className="flex flex-col gap-1.5">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: accent }}
        >
          {label}
        </div>
        <div
          className="truncate text-[15px] font-semibold leading-snug text-[color:var(--text-primary)] transition-colors duration-200 group-hover:text-white"
          title={displayValue}
        >
          {displayValue}
        </div>
      </div>

      {/* CTA footer — explicit action text so hover intent is obvious */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3">
        <span
          className="text-[12px] font-medium transition-colors duration-200"
          style={{ color: "var(--text-secondary)" }}
        >
          {cta}
        </span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: accent }}
          strokeWidth={2}
        />
      </div>
    </motion.a>
  );
}
