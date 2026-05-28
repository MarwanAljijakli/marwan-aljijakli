"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ==========================================================================
 * GreenhouseVisual
 * --------------------------------------------------------------------------
 * A 3×4 grid of ESP32 sensor nodes that pulse green, transmit "telemetry"
 * packets to a central hub, and surface live temperature/humidity readouts.
 * ========================================================================== */

const ACCENT = "#22C55E";
const ACCENT_DIM = "#15803d";

const NODE_COUNT = 12;
const COLS = 4;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface NodeData {
  id: number;
  col: number;
  row: number;
  temp: number;
  humidity: number;
  active: boolean;
}

function makeNodes(): NodeData[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    col: i % COLS,
    row: Math.floor(i / COLS),
    temp: Math.round(rand(22, 30)),
    humidity: Math.round(rand(60, 85)),
    active: true,
  }));
}

export default function GreenhouseVisual() {
  const [nodes, setNodes] = useState<NodeData[]>(makeNodes);
  const [pulseNode, setPulseNode] = useState<number | null>(null);

  // Rotate which node is "transmitting" every 800ms
  useEffect(() => {
    const id = setInterval(() => {
      const nextNode = Math.floor(Math.random() * NODE_COUNT);
      setPulseNode(nextNode);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nextNode
            ? {
                ...n,
                temp: Math.round(rand(22, 30)),
                humidity: Math.round(rand(60, 85)),
              }
            : n
        )
      );
      setTimeout(() => setPulseNode(null), 600);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-black/50 p-3">
      {/* Background grid */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-15"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="gh-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={ACCENT} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gh-grid)" />
      </svg>

      {/* Header */}
      <div className="relative flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
          ESP32 Mesh · 12 Nodes
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          MQTT Live
        </span>
      </div>

      {/* Node grid */}
      <div className="relative grid grid-cols-4 gap-2 px-1">
        {nodes.map((node) => {
          const isPulsing = pulseNode === node.id;
          return (
            <div key={node.id} className="relative flex flex-col items-center">
              {/* Transmission ripple */}
              {isPulsing && (
                <motion.span
                  className="absolute inset-0 rounded-md"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)` }}
                />
              )}

              {/* Node chip */}
              <div
                className="relative flex h-9 w-full flex-col items-center justify-center rounded-md border transition-colors duration-300"
                style={{
                  borderColor: isPulsing ? ACCENT : `${ACCENT}40`,
                  backgroundColor: isPulsing ? `${ACCENT}18` : `${ACCENT}08`,
                  boxShadow: isPulsing ? `0 0 10px ${ACCENT}55` : "none",
                }}
              >
                {/* Status dot */}
                <span
                  className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: isPulsing ? ACCENT : ACCENT_DIM }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: isPulsing ? ACCENT : `${ACCENT}99` }}>
                  N{String(node.id + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[8px] text-[color:var(--text-muted)]">
                  {node.temp}°C
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stats bar */}
      <div className="relative mt-2.5 flex items-center justify-between rounded-md border px-3 py-1.5"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}0a` }}>
        <Stat label="Avg Temp" value={`${Math.round(nodes.reduce((s, n) => s + n.temp, 0) / NODE_COUNT)}°C`} color={ACCENT} />
        <div className="h-4 w-px" style={{ backgroundColor: `${ACCENT}30` }} />
        <Stat label="Avg Humidity" value={`${Math.round(nodes.reduce((s, n) => s + n.humidity, 0) / NODE_COUNT)}%`} color={ACCENT} />
        <div className="h-4 w-px" style={{ backgroundColor: `${ACCENT}30` }} />
        <Stat label="Online" value={`${NODE_COUNT}/${NODE_COUNT}`} color={ACCENT} />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">{label}</span>
      <span className="font-mono text-[11px] font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
