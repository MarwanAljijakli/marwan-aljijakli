"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { CATEGORIES, type Star } from "./starData";

const ConstellationScene = dynamic(() => import("./ConstellationScene"), {
  ssr: false,
  loading: () => null,
});

/* ==========================================================================
 * SkillConstellation
 * --------------------------------------------------------------------------
 * Client wrapper around ConstellationScene. Owns:
 *   - Hover state (which star, pointer screen coords)
 *   - Overlay tooltip (HTML, positioned at the pointer)
 *   - Legend strip (category → colour swatches)
 *   - The data-three-canvas attribute → automatic crosshair cursor
 * ========================================================================== */

export default function SkillConstellation() {
  const [hovered, setHovered] = useState<Star | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]">
            fig. 02 — skill constellation
          </div>
          <div className="mt-1 font-display text-2xl md:text-3xl">
            Tech graph · orbital view
          </div>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] md:block">
          14 stars · 6 domains
        </div>
      </header>

      <div
        ref={wrapRef}
        data-three-canvas
        onPointerMove={onMove}
        className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/5 bg-black/40"
      >
        {/* Radial glow backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,212,255,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Faint grid */}
        <div aria-hidden className="absolute inset-0 opacity-30 grid-bg" />

        <ConstellationScene
          hoveredName={hovered?.name ?? null}
          onHoverChange={setHovered}
        />

        {/* Corner readout */}
        <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
            Telemetry · live
          </span>
        </div>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.name}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute z-10 min-w-[180px] rounded-xl border px-3 py-2 backdrop-blur-md"
              style={{
                left: Math.min(mouse.x + 14, 520 - 200),
                top: Math.max(0, mouse.y - 50),
                borderColor: `${CATEGORIES[hovered.category].color}55`,
                backgroundColor: "rgba(5,10,15,0.9)",
                boxShadow: `0 8px 32px -8px ${CATEGORIES[hovered.category].color}55`,
              }}
            >
              <div
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: CATEGORIES[hovered.category].color }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: CATEGORIES[hovered.category].color,
                    boxShadow: `0 0 10px ${CATEGORIES[hovered.category].color}`,
                  }}
                />
                {CATEGORIES[hovered.category].label}
              </div>
              <div className="mt-1 font-display text-lg leading-none text-white">
                {hovered.name}
              </div>
              <div className="mt-2 font-mono text-[10px] text-[color:var(--text-secondary)]">
                {hovered.description}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                <span>Ring · {hovered.ring}</span>
                <span>{hovered.ring === 0 ? "Core" : `Orbital ${hovered.ring}`}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {(Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(
          ([key, def]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: def.color,
                  boxShadow: `0 0 8px ${def.color}`,
                }}
              />
              {def.label}
            </span>
          )
        )}
      </div>
    </div>
  );
}
