"use client";

import { motion, useInView } from "framer-motion";
import { scaleLinear } from "d3-scale";
import { useMemo, useRef, useState } from "react";

/* ==========================================================================
 * RadarChart
 * --------------------------------------------------------------------------
 *   • Pure React + SVG, using d3-scale for the value→radius mapping.
 *   • Concentric polygon gridlines at 20 / 40 / 60 / 80 / 100.
 *   • The data polygon draws itself from the center outward when the chart
 *     scrolls into view (Framer Motion scales the inner group from 0 → 1 at
 *     ease-out-expo over 1.5 s).
 *   • Hovering an axis label lifts the whole axis (brighter stroke + enlarged
 *     data node) and shows a Space Mono tooltip listing key technologies.
 * ========================================================================== */

interface Axis {
  name: string;
  value: number;
  techs: string[];
}

const AXES: Axis[] = [
  { name: "Computer Vision", value: 90, techs: ["OpenCV", "YOLO v8/v11", "MediaPipe", "rPPG"] },
  { name: "LLM / GenAI", value: 95, techs: ["GPT-4", "Claude", "Llama", "Qwen"] },
  { name: "RAG Systems", value: 95, techs: ["LangChain", "FAISS", "Chroma", "Hybrid Retrieval"] },
  { name: "DevOps", value: 88, techs: ["Docker", "Compose", "CI/CD", "Linux"] },
  { name: "Data Engineering", value: 82, techs: ["Python", "SQL", "Postgres", "Feature Stores"] },
  { name: "Mobile", value: 75, techs: ["Flutter", "Dart", "REST", "Streaming"] },
  { name: "Prompt Eng.", value: 97, techs: ["Chain-of-Thought", "Few-shot", "Guardrails", "Tool Use"] },
  { name: "Architecture", value: 88, techs: ["FastAPI", "Microservices", "Vector DBs", "Edge"] },
];

// Rectangular viewBox so long axis labels ("PROMPT ENGINEERING",
// "SYSTEM ARCHITECTURE") have horizontal room to breathe.
const VIEW_W = 720;
const VIEW_H = 540;
const CENTER_X = VIEW_W / 2;
const CENTER_Y = VIEW_H / 2;
const MAX_RADIUS = 180;
const LABEL_PAD = 32;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Angle for axis `i` (0-indexed). First axis points straight up. */
function axisAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i / n) * Math.PI * 2;
}

export default function RadarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const [hovered, setHovered] = useState<number | null>(null);

  const radius = useMemo(
    () => scaleLinear().domain([0, 100]).range([0, MAX_RADIUS]),
    []
  );

  const N = AXES.length;

  // Polygon vertices at 100% (the outermost gridline).
  const outerPolygon = useMemo(() => {
    return AXES.map((_, i) => {
      const a = axisAngle(i, N);
      return `${CENTER_X + Math.cos(a) * MAX_RADIUS},${
        CENTER_Y + Math.sin(a) * MAX_RADIUS
      }`;
    }).join(" ");
  }, [N]);

  // Grid rings at 20/40/60/80/100 — polygons, not circles, so they match
  // the faceted radar look.
  const gridRings = useMemo(() => {
    return [0.2, 0.4, 0.6, 0.8, 1.0].map((t) =>
      AXES.map((_, i) => {
        const a = axisAngle(i, N);
        return `${CENTER_X + Math.cos(a) * MAX_RADIUS * t},${
          CENTER_Y + Math.sin(a) * MAX_RADIUS * t
        }`;
      }).join(" ")
    );
  }, [N]);

  // Data polygon at current values.
  const dataPolygon = useMemo(() => {
    return AXES.map((ax, i) => {
      const a = axisAngle(i, N);
      const r = radius(ax.value);
      return `${CENTER_X + Math.cos(a) * r},${CENTER_Y + Math.sin(a) * r}`;
    }).join(" ");
  }, [radius, N]);

  return (
    <div ref={ref} className="relative flex flex-col gap-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent-primary)]">
            fig. 01 — capability radar
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Skill surface · normalised
          </div>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--text-muted)] md:block">
          n = {AXES.length} · max = 100
        </div>
      </header>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
          aria-label="Radar chart of skill proficiencies"
        >
          <defs>
            <radialGradient id="radar-fill" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.08" />
            </radialGradient>
            <filter id="radar-glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid rings */}
          {gridRings.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(0,212,255,0.15)"
              strokeWidth="1"
              strokeDasharray={i === gridRings.length - 1 ? "none" : "2 4"}
            />
          ))}

          {/* Axis lines */}
          {AXES.map((ax, i) => {
            const a = axisAngle(i, N);
            const x = CENTER_X + Math.cos(a) * MAX_RADIUS;
            const y = CENTER_Y + Math.sin(a) * MAX_RADIUS;
            const active = hovered === i;
            return (
              <line
                key={ax.name}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={x}
                y2={y}
                stroke={active ? "#00D4FF" : "rgba(0,212,255,0.25)"}
                strokeWidth={active ? 1.4 : 1}
              />
            );
          })}

          {/* Outer ring accent */}
          <polygon
            points={outerPolygon}
            fill="none"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="1.2"
          />

          {/* Data polygon — draws from center on scroll */}
          <motion.g
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          >
            <polygon
              points={dataPolygon}
              fill="url(#radar-fill)"
              stroke="#00D4FF"
              strokeWidth="2"
              strokeLinejoin="round"
              filter="url(#radar-glow)"
            />
          </motion.g>

          {/* Data nodes (points at each axis) — staggered pop-in */}
          {AXES.map((ax, i) => {
            const a = axisAngle(i, N);
            const r = radius(ax.value);
            const x = CENTER_X + Math.cos(a) * r;
            const y = CENTER_Y + Math.sin(a) * r;
            const active = hovered === i;
            return (
              <motion.circle
                key={ax.name}
                cx={x}
                cy={y}
                initial={{ r: 0, opacity: 0 }}
                animate={inView ? { r: active ? 6 : 4, opacity: 1 } : {}}
                transition={{
                  duration: 0.45,
                  delay: inView ? 1.1 + i * 0.05 : 0,
                  ease: EASE_OUT_EXPO,
                }}
                fill="#BFF7FF"
                stroke="#00D4FF"
                strokeWidth="1.5"
                style={{
                  filter: active
                    ? "drop-shadow(0 0 10px rgba(0,212,255,0.9))"
                    : "drop-shadow(0 0 4px rgba(0,212,255,0.4))",
                }}
              />
            );
          })}

          {/* Axis labels — interactive hotspots */}
          {AXES.map((ax, i) => {
            const a = axisAngle(i, N);
            const lx = CENTER_X + Math.cos(a) * (MAX_RADIUS + LABEL_PAD);
            const ly = CENTER_Y + Math.sin(a) * (MAX_RADIUS + LABEL_PAD);
            const textAnchor =
              Math.cos(a) > 0.35 ? "start" : Math.cos(a) < -0.35 ? "end" : "middle";
            const active = hovered === i;
            return (
              <g
                key={ax.name}
                transform={`translate(${lx} ${ly})`}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: "none" }}
              >
                {/* Hover hitbox */}
                <rect
                  x={textAnchor === "start" ? 0 : textAnchor === "end" ? -120 : -60}
                  y={-22}
                  width="120"
                  height="40"
                  fill="transparent"
                />
                <text
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fontFamily="var(--font-space-mono), monospace"
                  fontSize="11"
                  fill={active ? "#00D4FF" : "#E8F4FD"}
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    transition: "fill 0.2s",
                  }}
                >
                  {ax.name}
                </text>
                <text
                  textAnchor={textAnchor}
                  y="14"
                  fontFamily="var(--font-space-mono), monospace"
                  fontSize="10"
                  fill={active ? "#BFF7FF" : "#5a7298"}
                >
                  {ax.value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && <AxisTooltip axis={AXES[hovered]} index={hovered} />}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tooltip                                                                   */
/* -------------------------------------------------------------------------- */

function AxisTooltip({ axis, index }: { axis: Axis; index: number }) {
  // Position the tooltip just outside the hovered axis label, on the side
  // furthest from the chart centre.
  const a = -Math.PI / 2 + (index / AXES.length) * Math.PI * 2;
  const ratioX = (MAX_RADIUS + 78) / (VIEW_W / 2);
  const ratioY = (MAX_RADIUS + 78) / (VIEW_H / 2);
  const tx = 50 + Math.cos(a) * ratioX * 50;
  const ty = 50 + Math.sin(a) * ratioY * 50;
  const alignRight = Math.cos(a) < -0.35;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.92 }}
      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute z-10 min-w-[200px] max-w-[260px] rounded-xl border border-[color:var(--accent-primary)]/30 bg-[color:var(--bg-primary)]/95 px-4 py-3 backdrop-blur-md"
      style={{
        left: `${tx}%`,
        top: `${ty}%`,
        transform: `translate(${alignRight ? "-100%" : "0"}, -50%)`,
        boxShadow: "0 12px 40px -8px rgba(0,212,255,0.35)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-primary)]">
        <span>{axis.name}</span>
        <span className="tabular-nums">{axis.value}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {axis.techs.map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[color:var(--text-secondary)]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

