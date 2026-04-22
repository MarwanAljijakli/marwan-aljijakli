"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { scaleLinear } from "d3-scale";

/* ==========================================================================
 * MiningBarChart
 * --------------------------------------------------------------------------
 * Horizontal bar chart rendered in SVG, filling from left-to-right once the
 * card scrolls into view. D3 provides the scale; Framer Motion handles the
 * per-bar animation and staggered reveal.
 * ========================================================================== */

const METRICS = [
  { label: "Safety Incidents", value: 48, suffix: "% ↓", negative: true },
  { label: "Equipment Uptime", value: 94, suffix: "%" },
  { label: "Yield Prediction", value: 87, suffix: "%" },
  { label: "Cost Optimization", value: 31, suffix: "% ↓", negative: true },
  { label: "Operator Efficiency", value: 76, suffix: "%" },
];

const VIEW_W = 520;
const VIEW_H = 250;
const PADDING_X = 130;
const PADDING_Y = 18;

export default function MiningBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const barHeight = 18;
  const gap = (VIEW_H - PADDING_Y * 2 - METRICS.length * barHeight) / (METRICS.length - 1);

  const xScale = scaleLinear().domain([0, 100]).range([0, VIEW_W - PADDING_X - 50]);

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full flex-col justify-center rounded-lg bg-black/30 p-4"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(252,196,78,0.6)]" />
          Mining Optimization Metrics
        </span>
        <span>Future Minerals Pioneers</span>
      </div>

      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bar-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffc94d" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fcc44e" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff9a3c" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="bar-fill-dim" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#fcc44e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Gridlines at 25/50/75/100 */}
        {[25, 50, 75, 100].map((t) => {
          const x = PADDING_X + xScale(t);
          return (
            <g key={t}>
              <line
                x1={x}
                x2={x}
                y1={PADDING_Y - 4}
                y2={VIEW_H - PADDING_Y + 4}
                stroke="rgba(252,196,78,0.1)"
                strokeDasharray="2 3"
              />
              <text
                x={x}
                y={PADDING_Y - 7}
                fill="rgba(252,196,78,0.45)"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {METRICS.map((m, i) => {
          const y = PADDING_Y + i * (barHeight + gap);
          const fullW = xScale(m.value);
          return (
            <g key={m.label}>
              {/* Label */}
              <text
                x={PADDING_X - 10}
                y={y + barHeight / 2 + 3}
                textAnchor="end"
                fontSize="10"
                fontFamily="monospace"
                fill="#e8f4fd"
                opacity="0.88"
              >
                {m.label}
              </text>

              {/* Track */}
              <rect
                x={PADDING_X}
                y={y}
                width={xScale(100)}
                height={barHeight}
                rx={3}
                fill="rgba(252,196,78,0.06)"
                stroke="rgba(252,196,78,0.12)"
              />

              {/* Fill */}
              <motion.rect
                x={PADDING_X}
                y={y}
                height={barHeight}
                rx={3}
                fill={m.negative ? "url(#bar-fill-dim)" : "url(#bar-fill)"}
                initial={{ width: 0 }}
                animate={inView ? { width: fullW } : {}}
                transition={{
                  duration: 1.3,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(252,196,78,0.35))",
                }}
              />

              {/* Value label */}
              <motion.text
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.12 + 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                x={PADDING_X + fullW + 8}
                y={y + barHeight / 2 + 3}
                fontSize="10"
                fontFamily="monospace"
                fill="#fcc44e"
              >
                {m.value}
                {m.suffix}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
