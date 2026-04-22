"use client";

import { motion } from "framer-motion";

/* ==========================================================================
 * ConfusionMatrix
 * --------------------------------------------------------------------------
 * 4×4 confusion matrix rendered as SVG. Cells fill with color proportional
 * to the value; diagonal (true-positive) cells are strongest. Staggered
 * reveal on scroll gives the grid a "model evaluating" feel.
 * ========================================================================== */

// Row = true class, column = predicted class. Diagonal dominance = accuracy.
const MATRIX = [
  [0.93, 0.03, 0.02, 0.02],
  [0.04, 0.89, 0.04, 0.03],
  [0.02, 0.05, 0.87, 0.06],
  [0.01, 0.03, 0.05, 0.91],
];

const LABELS = ["A", "B", "C", "D"];

const W = 520;
const H = 200;

const PAD_LEFT = 70;
const PAD_TOP = 30;
const PAD_RIGHT = 28;
const PAD_BOTTOM = 40;

export default function ConfusionMatrix({
  color,
  inView,
}: {
  color: string;
  inView: boolean;
}) {
  const cols = MATRIX[0].length;
  const rows = MATRIX.length;
  const cellW = (W - PAD_LEFT - PAD_RIGHT) / cols;
  const cellH = (H - PAD_TOP - PAD_BOTTOM) / rows;

  // Convert "#FF6B35" → rgb triple for opacity-based fills.
  const [r, g, b] = hexToRgb(color);

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          />
          Confusion matrix · eval run
        </span>
        <span>acc · 90%</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="cm-glow">
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Axis labels — predicted (top) */}
        <text
          x={PAD_LEFT + (cols * cellW) / 2}
          y={16}
          textAnchor="middle"
          fill="#8ba3c7"
          fontFamily="var(--font-space-mono), monospace"
          fontSize="9"
          style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          predicted →
        </text>

        {/* True label (left, rotated) */}
        <text
          x={18}
          y={PAD_TOP + (rows * cellH) / 2}
          textAnchor="middle"
          fill="#8ba3c7"
          fontFamily="var(--font-space-mono), monospace"
          fontSize="9"
          transform={`rotate(-90 18 ${PAD_TOP + (rows * cellH) / 2})`}
          style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          ← actual
        </text>

        {/* Column headers */}
        {LABELS.map((l, i) => (
          <text
            key={`col-${l}`}
            x={PAD_LEFT + i * cellW + cellW / 2}
            y={PAD_TOP - 6}
            textAnchor="middle"
            fill="#e8f4fd"
            fontFamily="var(--font-space-mono), monospace"
            fontSize="11"
            style={{ letterSpacing: "0.08em" }}
          >
            {l}
          </text>
        ))}

        {/* Row headers */}
        {LABELS.map((l, i) => (
          <text
            key={`row-${l}`}
            x={PAD_LEFT - 8}
            y={PAD_TOP + i * cellH + cellH / 2 + 4}
            textAnchor="end"
            fill="#e8f4fd"
            fontFamily="var(--font-space-mono), monospace"
            fontSize="11"
            style={{ letterSpacing: "0.08em" }}
          >
            {l}
          </text>
        ))}

        {/* Cells */}
        {MATRIX.map((row, ri) =>
          row.map((v, ci) => {
            const x = PAD_LEFT + ci * cellW;
            const y = PAD_TOP + ri * cellH;
            const isDiagonal = ri === ci;
            const alpha = isDiagonal
              ? 0.15 + v * 0.8
              : 0.04 + v * 0.6;
            const delay = 0.2 + (ri * cols + ci) * 0.05;
            const strokeWidth = isDiagonal ? 1 : 0.4;
            return (
              <g key={`c-${ri}-${ci}`}>
                {/* Cell background */}
                <rect
                  x={x + 1.5}
                  y={y + 1.5}
                  width={cellW - 3}
                  height={cellH - 3}
                  rx={3}
                  fill="rgba(10,22,40,0.6)"
                  stroke={`rgba(${r},${g},${b},0.18)`}
                  strokeWidth={strokeWidth}
                />

                {/* Animated value fill */}
                <motion.rect
                  x={x + 1.5}
                  y={y + 1.5}
                  width={cellW - 3}
                  height={cellH - 3}
                  rx={3}
                  fill={`rgba(${r},${g},${b},${alpha})`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    transformOrigin: `${x + cellW / 2}px ${y + cellH / 2}px`,
                    transformBox: "fill-box",
                  }}
                />

                {/* Value text */}
                <motion.text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 4}
                  textAnchor="middle"
                  fill={
                    isDiagonal ? "#ffffff" : v > 0.04 ? "#e8f4fd" : "#5a7298"
                  }
                  fontFamily="var(--font-space-mono), monospace"
                  fontSize="10"
                  fontWeight={isDiagonal ? 700 : 400}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: delay + 0.25 }}
                  filter={isDiagonal ? "url(#cm-glow)" : undefined}
                >
                  {(v * 100).toFixed(0)}
                </motion.text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
