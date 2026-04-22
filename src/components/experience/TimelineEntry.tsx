"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import OrgChartMini from "./visuals/OrgChartMini";
import HeartLine from "./visuals/HeartLine";
import ConfusionMatrix from "./visuals/ConfusionMatrix";
import { NODE_HEX, type Experience } from "./data";

/* ==========================================================================
 * TimelineEntry
 * --------------------------------------------------------------------------
 * A single mission-log row. On mobile, the card sits right of a left-edge
 * line; on md+ the card alternates sides around a centered timeline line
 * and flies in from its own side. A pulsing radar-ping node anchors it to
 * the line at the card's vertical midpoint.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function TimelineEntry({
  entry,
  index,
}: {
  entry: Experience;
  index: number;
}) {
  const isLeft = entry.side === "left";
  const color = NODE_HEX[entry.nodeColor];

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const baseDelay = 0.05 + index * 0.18;

  return (
    <div ref={ref} className="relative py-2">
      {/* Pulsing node on the line ------------------------------------- */}
      <TimelineNode
        color={color}
        current={entry.current}
        inView={inView}
        delay={baseDelay}
      />

      {/* Card wrapper ------------------------------------------------- */}
      <div
        className={cn(
          // Mobile: offset from the left-aligned line
          "relative pl-16 md:pl-0",
          // Desktop: half width, pushed to the correct side
          "md:w-[calc(50%-2.5rem)]",
          isLeft ? "md:mr-auto md:pr-2" : "md:ml-auto md:pl-2"
        )}
      >
        <motion.article
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.85,
            delay: baseDelay + 0.08,
            ease: EASE_OUT_EXPO,
          }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--bg-secondary)]/60 backdrop-blur-sm"
          style={{
            boxShadow: `0 24px 60px -24px ${color}22`,
          }}
        >
          {/* Side accent bar */}
          <span
            aria-hidden
            className={cn(
              "absolute top-0 bottom-0 w-[3px]",
              isLeft ? "md:right-0 left-0" : "left-0"
            )}
            style={{
              background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
              boxShadow: `0 0 12px ${color}66`,
            }}
          />

          {/* Connector from node → card on desktop */}
          <span
            aria-hidden
            className={cn(
              "absolute top-8 hidden h-px md:block",
              isLeft ? "right-0 w-8 translate-x-full" : "left-0 w-8 -translate-x-full"
            )}
            style={{
              background: `linear-gradient(${
                isLeft ? "270deg" : "90deg"
              }, ${color}, transparent)`,
            }}
          />

          <div className="p-6 md:p-7">
            {/* Header row */}
            <header className="flex flex-wrap items-center gap-3">
              <time
                dateTime={entry.period}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-muted)]"
              >
                {entry.period}
              </time>
              {entry.current && (
                <CurrentBadge color={color} />
              )}
            </header>

            {/* Role + company */}
            <div className="mt-3">
              {entry.tagline && (
                <div
                  className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: `${color}dd` }}
                >
                  /· {entry.tagline}
                </div>
              )}
              <h3
                className="font-display leading-[0.95] tracking-tight text-[color:var(--text-primary)]"
                style={{ fontSize: "clamp(1.6rem, 2.3vw, 2.1rem)" }}
              >
                {entry.role}
              </h3>
              <div
                className="mt-1 font-display text-2xl tracking-wide"
                style={{ color }}
              >
                {entry.company}
              </div>
            </div>

            {/* Achievements list */}
            <ul className="mt-5 flex flex-col gap-2.5">
              {entry.achievements.map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: baseDelay + 0.35 + i * 0.07,
                    ease: EASE_OUT_EXPO,
                  }}
                  data-cursor="text"
                  className="flex items-start gap-2.5 font-mono text-[12px] leading-[1.6] text-[color:var(--text-secondary)]"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 font-semibold"
                    style={{ color }}
                  >
                    {">"}
                  </span>
                  <span>{a}</span>
                </motion.li>
              ))}
            </ul>

            {/* Visual */}
            <div className="mt-6 overflow-hidden rounded-xl border border-white/5 bg-black/30">
              <VisualFor visual={entry.visual} color={color} inView={inView} />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline node                                                             */
/* -------------------------------------------------------------------------- */

function TimelineNode({
  color,
  current,
  inView,
  delay,
}: {
  color: string;
  current?: boolean;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-9 left-6 z-10 -translate-x-1/2 md:left-1/2"
    >
      {/* Outer ripple — continuously pulses */}
      <motion.span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 28,
          height: 28,
          border: `1px solid ${color}`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          inView
            ? {
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.6, 2],
              }
            : {}
        }
        transition={{
          duration: 1.8,
          delay,
          repeat: Infinity,
          repeatDelay: current ? 0 : 1.2,
          ease: "easeOut",
        }}
      />
      {/* Inner core — scales in with a quick pop */}
      <motion.span
        className="relative block rounded-full"
        initial={{ scale: 0 }}
        animate={inView ? { scale: [0, 1.35, 1] } : {}}
        transition={{
          duration: 0.55,
          delay,
          ease: EASE_OUT_EXPO,
        }}
        style={{
          width: 14,
          height: 14,
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}, 0 0 0 4px rgba(5,10,15,0.9)`,
        }}
      />
      {/* Continuous breathing glow for "current" roles */}
      {current && (
        <motion.span
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.9, 1.3, 0.9],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 14,
            height: 14,
            backgroundColor: color,
            filter: "blur(6px)",
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  "CURRENT" badge                                                           */
/* -------------------------------------------------------------------------- */

function CurrentBadge({ color }: { color: string }) {
  return (
    <motion.span
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 18px 2px ${color}77`,
          `0 0 0 0 ${color}00`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.26em]"
      style={{
        borderColor: `${color}55`,
        backgroundColor: `${color}12`,
        color,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      Current
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Visual dispatcher                                                         */
/* -------------------------------------------------------------------------- */

function VisualFor({
  visual,
  color,
  inView,
}: {
  visual: Experience["visual"];
  color: string;
  inView: boolean;
}) {
  switch (visual) {
    case "orgChart":
      return <OrgChartMini color={color} inView={inView} />;
    case "heartLine":
      return <HeartLine inView={inView} />;
    case "confusionMatrix":
      return <ConfusionMatrix color={color} inView={inView} />;
  }
}
