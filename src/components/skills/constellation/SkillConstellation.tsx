"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useLazySection } from "@/lib/hooks/useLazySection";
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

  // Use a ref-backed mount gate so the heavy R3F scene only enters the
  // tree once the skills section is close to the viewport, and its
  // frameloop pauses the moment it leaves again.
  const { ref: wrapRef, hasBeenVisible, isVisible } = useLazySection<HTMLDivElement>({
    rootMargin: "250px",
  });

  // Throttle mouse tracking — we only need it for tooltip positioning and
  // it caused a re-render per pixel otherwise.
  const lastMoveRef = useRef(0);
  const onMove = useCallback((e: React.PointerEvent) => {
    const now = performance.now();
    if (now - lastMoveRef.current < 33) return; // ~30fps is plenty
    lastMoveRef.current = now;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, [wrapRef]);

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

        {hasBeenVisible && (
          <ConstellationScene
            hoveredName={hovered?.name ?? null}
            onHoverChange={setHovered}
            visible={isVisible}
          />
        )}

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

      {/* Caption — how to read the constellation */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
        <p className="text-[13px] leading-relaxed text-[color:var(--text-secondary)]">
          <span className="font-mono uppercase tracking-[0.14em] text-[color:var(--accent-primary)]">
            How to read:
          </span>{" "}
          <span className="text-white">Python</span> sits at the core. Each
          orbital ring moves outward from foundational frameworks to specialist
          tools. Lines link technologies in the same domain; colour denotes the
          domain. Hover any node for details.
        </p>
      </div>

      {/* Ring legend — explains the concentric structure */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { n: "0", title: "Core", desc: "Master language" },
          { n: "1", title: "Foundations", desc: "Frameworks" },
          { n: "2", title: "Specialists", desc: "Task-specific tools" },
          { n: "3", title: "Tooling", desc: "Infra · storage · edge" },
        ].map((r) => (
          <div
            key={r.n}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--accent-primary)]/40 bg-[color:var(--accent-primary)]/10 font-mono text-[11px] text-[color:var(--accent-primary)]">
              {r.n}
            </span>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                {r.title}
              </div>
              <div className="truncate text-[11px] text-[color:var(--text-muted)]">
                {r.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category legend — colour keys */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          Domains:
        </span>
        {(Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(
          ([key, def]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-secondary)]"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
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
