"use client";

import { useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

/* ==========================================================================
 * BlePositioningVisual
 * --------------------------------------------------------------------------
 * Floor-plan grid with 4 BLE anchors at corners, a target dot that follows
 * a Lissajous path, and animated trilateration rings emanating from the
 * nearest anchor. Accuracy readout updates as the dot moves.
 * ========================================================================== */

const ACCENT = "#7B2FBE";
const ACCENT_LIGHT = "#c6a4f5";
const VIEW = 260; // square SVG viewBox

// Anchor positions (% of VIEW)
const ANCHORS = [
  { id: "A1", x: 0.12, y: 0.12 },
  { id: "A2", x: 0.88, y: 0.12 },
  { id: "A3", x: 0.12, y: 0.88 },
  { id: "A4", x: 0.88, y: 0.88 },
];

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export default function BlePositioningVisual() {
  const tRef = useRef(0);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [accuracy, setAccuracy] = useState(1.8);

  // Animate target along a Lissajous figure
  useAnimationFrame((_, delta) => {
    tRef.current += delta * 0.0004;
    const t = tRef.current;
    const nx = 0.5 + 0.32 * Math.sin(t * 1.3);
    const ny = 0.5 + 0.28 * Math.sin(t * 0.9 + 0.6);
    setPos({ x: nx, y: ny });
    // Accuracy wobbles slightly
    setAccuracy(parseFloat((1.6 + Math.sin(t * 2.1) * 0.3).toFixed(1)));
  });

  const tx = pos.x * VIEW;
  const ty = pos.y * VIEW;

  // Nearest anchor for ring pulse
  const nearestAnchor = ANCHORS.reduce((best, a) => {
    const d = dist(a.x * VIEW, a.y * VIEW, tx, ty);
    const bd = dist(best.x * VIEW, best.y * VIEW, tx, ty);
    return d < bd ? a : best;
  });

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-black/50">
      {/* SVG canvas */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="BLE indoor positioning simulation"
      >
        <defs>
          {/* Floor grid */}
          <pattern id="ble-grid" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M 26 0 L 0 0 0 26" fill="none" stroke={ACCENT} strokeWidth="0.4" opacity="0.25" />
          </pattern>
          <filter id="ble-glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="anchor-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="ble-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width={VIEW} height={VIEW} fill="url(#ble-grid)" />
        <rect width={VIEW} height={VIEW} fill="url(#ble-bg)" />

        {/* Dashed lines from anchors to target */}
        {ANCHORS.map((a) => (
          <line
            key={a.id}
            x1={a.x * VIEW}
            y1={a.y * VIEW}
            x2={tx}
            y2={ty}
            stroke={ACCENT}
            strokeWidth="0.6"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        ))}

        {/* Trilateration ring from nearest anchor */}
        {(() => {
          const r = dist(nearestAnchor.x * VIEW, nearestAnchor.y * VIEW, tx, ty);
          return (
            <>
              <circle
                cx={nearestAnchor.x * VIEW}
                cy={nearestAnchor.y * VIEW}
                r={r}
                fill="none"
                stroke={ACCENT}
                strokeWidth="1"
                opacity="0.35"
                strokeDasharray="6 4"
              />
              <circle
                cx={nearestAnchor.x * VIEW}
                cy={nearestAnchor.y * VIEW}
                r={r * 0.85}
                fill="none"
                stroke={ACCENT}
                strokeWidth="0.5"
                opacity="0.15"
              />
            </>
          );
        })()}

        {/* Anchors */}
        {ANCHORS.map((a) => (
          <g key={a.id} filter="url(#anchor-glow)">
            <rect
              x={a.x * VIEW - 12}
              y={a.y * VIEW - 10}
              width="24"
              height="20"
              rx="4"
              fill={`${ACCENT}22`}
              stroke={ACCENT}
              strokeWidth="1"
            />
            <text
              x={a.x * VIEW}
              y={a.y * VIEW + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ACCENT_LIGHT}
              fontSize="7"
              fontFamily="monospace"
              letterSpacing="0.5"
            >
              {a.id}
            </text>
            {/* BLE pulse ring */}
            <circle
              cx={a.x * VIEW}
              cy={a.y * VIEW}
              r="18"
              fill="none"
              stroke={ACCENT}
              strokeWidth="0.7"
              opacity="0.2"
            >
              <animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Target dot (tracked person/asset) */}
        <g filter="url(#ble-glow)">
          <circle cx={tx} cy={ty} r="5.5" fill="#ffffff" opacity="0.92" />
          <circle cx={tx} cy={ty} r="9" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.2" opacity="0.6" />
        </g>
      </svg>

      {/* Accuracy HUD */}
      <div className="absolute left-3 top-2 flex items-baseline gap-1.5 font-mono">
        <span className="text-[9px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Accuracy</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT_LIGHT }}>±{accuracy}m</span>
      </div>

      {/* Connections HUD */}
      <div className="absolute right-3 top-2 flex items-baseline gap-1.5 font-mono">
        <span className="text-[9px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Conns</span>
        <span className="text-sm font-semibold" style={{ color: ACCENT_LIGHT }}>200+</span>
      </div>
    </div>
  );
}
