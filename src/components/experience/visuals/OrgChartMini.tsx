"use client";

import { motion } from "framer-motion";

/* ==========================================================================
 * OrgChartMini
 * --------------------------------------------------------------------------
 * Tiny 3-level org chart. Top: CTO. Middle: three engineering functions.
 * Bottom: six shipped AI products. Connectors are SVG paths; a "command
 * pulse" travels down from the CTO node through the tree on loop.
 * ========================================================================== */

const LEVEL_1 = { id: "cto", label: "CTO" };
const LEVEL_2 = [
  { id: "eng", label: "Engineering" },
  { id: "prod", label: "Product" },
  { id: "ai", label: "AI R&D" },
];
const LEVEL_3 = [
  { id: "a", parent: "eng" },
  { id: "b", parent: "eng" },
  { id: "c", parent: "prod" },
  { id: "d", parent: "prod" },
  { id: "e", parent: "ai" },
  { id: "f", parent: "ai" },
];

const W = 520;
const H = 200;

// Positions (in SVG user units) keyed by node id.
const POS: Record<string, { x: number; y: number }> = {
  cto: { x: W / 2, y: 24 },

  eng: { x: W * 0.2, y: 98 },
  prod: { x: W * 0.5, y: 98 },
  ai: { x: W * 0.8, y: 98 },

  a: { x: W * 0.12, y: 170 },
  b: { x: W * 0.28, y: 170 },
  c: { x: W * 0.42, y: 170 },
  d: { x: W * 0.58, y: 170 },
  e: { x: W * 0.72, y: 170 },
  f: { x: W * 0.88, y: 170 },
};

export default function OrgChartMini({
  color,
  inView,
}: {
  color: string;
  inView: boolean;
}) {
  // Edges (top-down)
  const edgesL1toL2 = LEVEL_2.map((l2) => ({
    from: LEVEL_1.id,
    to: l2.id,
  }));
  const edgesL2toL3 = LEVEL_3.map((l3) => ({
    from: l3.parent,
    to: l3.id,
  }));

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        <span>/· org · structure</span>
        <span>depth = 3 · breadth = 6</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="org-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
          <filter id="org-glow">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — rendered first so nodes sit on top */}
        {[...edgesL1toL2, ...edgesL2toL3].map((e, i) => {
          const a = POS[e.from];
          const b = POS[e.to];
          const midY = (a.y + b.y) / 2;
          const d = `M ${a.x} ${a.y + 14} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - 14}`;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="url(#org-edge)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.25 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* CTO (root) */}
        <OrgNode
          x={POS.cto.x}
          y={POS.cto.y}
          label={LEVEL_1.label}
          color={color}
          role="root"
          inView={inView}
          delay={0.15}
        />

        {/* Level 2 — functions */}
        {LEVEL_2.map((l2, i) => (
          <OrgNode
            key={l2.id}
            x={POS[l2.id].x}
            y={POS[l2.id].y}
            label={l2.label}
            color={color}
            role="branch"
            inView={inView}
            delay={0.45 + i * 0.06}
          />
        ))}

        {/* Level 3 — leaf products */}
        {LEVEL_3.map((l3, i) => (
          <OrgNode
            key={l3.id}
            x={POS[l3.id].x}
            y={POS[l3.id].y}
            color={color}
            role="leaf"
            inView={inView}
            delay={0.85 + i * 0.05}
          />
        ))}

        {/* Command pulse — a glowing dot traveling down a central path,
            restarting on loop. Very subtle but makes the chart feel alive. */}
        <CommandPulse color={color} inView={inView} />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function OrgNode({
  x,
  y,
  label,
  color,
  role,
  inView,
  delay,
}: {
  x: number;
  y: number;
  label?: string;
  color: string;
  role: "root" | "branch" | "leaf";
  inView: boolean;
  delay: number;
}) {
  const r = role === "root" ? 11 : role === "branch" ? 8 : 4.5;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
    >
      {/* Halo */}
      <circle
        cx={x}
        cy={y}
        r={r + 2.5}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.35"
      >
        <animate
          attributeName="r"
          values={`${r + 1};${r + 4};${r + 1}`}
          dur={`${2 + delay * 2}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.1;0.6"
          dur={`${2 + delay * 2}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Core */}
      <circle cx={x} cy={y} r={r} fill={color} filter="url(#org-glow)" />

      {/* Inner dot for depth */}
      <circle cx={x} cy={y} r={r * 0.45} fill="#050A0F" />

      {/* Label (only for root + branches) */}
      {label && (
        <text
          x={x}
          y={y + r + 14}
          textAnchor="middle"
          fontFamily="var(--font-space-mono), monospace"
          fontSize="10"
          fill="#E8F4FD"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {label}
        </text>
      )}
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */

/** A bright dot that travels the central CTO→AI→leaf path on loop. */
function CommandPulse({ color, inView }: { color: string; inView: boolean }) {
  if (!inView) return null;
  return (
    <g>
      <circle r="2.4" fill="#ffffff" opacity="0.95">
        <animateMotion
          dur="3.4s"
          repeatCount="indefinite"
          keyPoints="0;1"
          keyTimes="0;1"
          path={`M ${W / 2} 38 C ${W / 2} 70, ${W * 0.5} 70, ${W * 0.5} 84 L ${W * 0.5} 98 C ${W * 0.5} 120, ${W * 0.5} 135, ${W * 0.5} 156`}
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.9;1"
          dur="3.4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="5" fill={color} opacity="0.6">
        <animateMotion
          dur="3.4s"
          repeatCount="indefinite"
          path={`M ${W / 2} 38 C ${W / 2} 70, ${W * 0.5} 70, ${W * 0.5} 84 L ${W * 0.5} 98 C ${W * 0.5} 120, ${W * 0.5} 135, ${W * 0.5} 156`}
        />
        <animate
          attributeName="opacity"
          values="0;0.5;0.5;0"
          keyTimes="0;0.1;0.9;1"
          dur="3.4s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}
