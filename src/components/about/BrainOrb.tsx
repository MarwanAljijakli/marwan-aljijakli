"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const BrainOrbScene = dynamic(() => import("./BrainOrbScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Client wrapper around <BrainOrbScene>. Keeps hover state in a ref so the
 * R3F frame loop can read it without the scene re-mounting on every hover
 * change, and carries the scene's cursor semantics (`data-three-canvas` →
 * automatic crosshair cursor).
 */
export default function BrainOrb() {
  const hoveredRef = useRef(false);
  const [, setBumpKey] = useState(0); // trivial re-render on hover to trigger fade

  return (
    <div
      data-three-canvas
      onPointerEnter={() => {
        hoveredRef.current = true;
        setBumpKey((k) => k + 1);
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
        setBumpKey((k) => k + 1);
      }}
      className="relative mx-auto aspect-square w-full max-w-[500px]"
    >
      {/* Decorative corner crosshairs */}
      <CornerTick className="absolute left-0 top-0" />
      <CornerTick className="absolute right-0 top-0 rotate-90" />
      <CornerTick className="absolute right-0 bottom-0 rotate-180" />
      <CornerTick className="absolute bottom-0 left-0 -rotate-90" />

      {/* Soft radial backdrop glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,212,255,0.08) 0%, transparent 70%)",
        }}
      />

      <BrainOrbScene hoveredRef={hoveredRef} />

      {/* Inner vignette — keeps the orb feeling contained */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(5,10,15,0.75) 100%)",
        }}
      />

      {/* Caption */}
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
        <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
        Cognitive network · live
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CornerTick({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={`pointer-events-none text-[color:var(--accent-primary)] opacity-70 ${className}`}
    >
      <path
        d="M1 7 V1 H7"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}
