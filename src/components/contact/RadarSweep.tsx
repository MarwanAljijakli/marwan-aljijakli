"use client";

import { motion } from "framer-motion";

/* ==========================================================================
 * RadarSweep
 * --------------------------------------------------------------------------
 * A passive sonar display painted with pure CSS/SVG:
 *   • Concentric expanding rings, phase-offset so a new pulse is always
 *     leaving the emitter
 *   • A conic-gradient sweep beam rotating on loop
 *   • A pulsing center dot with a breathing halo
 *   • Fine crosshair grid + subtle radial fade to keep the background dark
 *
 * Intentionally cheap — every element is CSS-transformable, no canvas.
 * ========================================================================== */

const RING_COUNT = 4;
const RING_DURATION = 4.5; // seconds per ring
const RING_STAGGER = RING_DURATION / RING_COUNT;

export default function RadarSweep() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Background crosshair grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="radar-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10dc78" strokeWidth="0.4" />
          </pattern>
          <radialGradient id="radar-fade" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#050a0f" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#radar-grid)" />
        <rect width="100%" height="100%" fill="url(#radar-fade)" />
        {/* Axes */}
        <line x1="0" y1="200" x2="400" y2="200" stroke="#10dc78" strokeOpacity="0.18" strokeWidth="0.5" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="#10dc78" strokeOpacity="0.18" strokeWidth="0.5" />
      </svg>

      {/* Radial fade — darkens the outer edges so the sweep "recedes" */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(5,10,15,0) 0%, rgba(5,10,15,0) 40%, rgba(5,10,15,0.85) 100%)",
        }}
      />

      {/* Concentric emitter rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border"
            style={{
              borderColor: "#10dc78",
              borderWidth: 1.5,
              width: 40,
              height: 40,
              boxShadow: "0 0 24px rgba(16,220,120,0.35)",
            }}
            animate={{
              width: ["40px", "1100px"],
              height: ["40px", "1100px"],
              opacity: [0.9, 0],
              borderWidth: [2, 0.4],
            }}
            transition={{
              duration: RING_DURATION,
              delay: i * RING_STAGGER,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Rotating sweep beam — conic gradient inside a circular mask */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative rounded-full"
          style={{
            width: "min(90vmin, 1100px)",
            height: "min(90vmin, 1100px)",
            background:
              "conic-gradient(from 0deg, rgba(16,220,120,0) 0deg, rgba(16,220,120,0) 320deg, rgba(16,220,120,0.22) 355deg, rgba(16,220,120,0.55) 360deg, rgba(16,220,120,0) 361deg)",
            maskImage: "radial-gradient(circle, #000 58%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle, #000 58%, transparent 100%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Center dot + breathing halo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <motion.span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 18,
              height: 18,
              backgroundColor: "#10dc78",
              boxShadow: "0 0 18px rgba(16,220,120,0.8)",
              filter: "blur(10px)",
            }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="relative block rounded-full"
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#c9ffe0",
              boxShadow: "0 0 20px #10dc78, 0 0 0 3px rgba(16,220,120,0.25)",
            }}
          />
        </div>
      </div>

      {/* Subtle range readout (decorative) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
        <span className="mr-2 inline-block h-1 w-1 animate-pulse-slow rounded-full bg-[#10dc78]" />
        beacon · live · 3.2ghz
      </div>
    </div>
  );
}
