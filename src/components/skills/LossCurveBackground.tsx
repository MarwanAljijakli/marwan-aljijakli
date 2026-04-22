"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/* ==========================================================================
 * LossCurveBackground
 * --------------------------------------------------------------------------
 * A very subtle (5% opacity) training-loss curve rendered as a thin SVG
 * line.  y = exp(-kx) + small noise — the classic shape of a fine-tune
 * settling down. Animates its stroke-dashoffset on loop so it *very*
 * slowly re-traces itself, which reads as a quiet pulse.
 * ========================================================================== */

const POINTS = 160;

interface Props {
  /** Main loss curve opacity. Default: 0.05. */
  opacity?: number;
}

export default function LossCurveBackground({ opacity = 0.05 }: Props) {
  const { path, validationPath, total } = useMemo(() => {
    const seed = 42;
    const rng = mulberry32(seed);

    // Training loss — fast decay with noise.
    const train: [number, number][] = [];
    // Validation loss — slightly higher, slower decay.
    const val: [number, number][] = [];

    for (let i = 0; i < POINTS; i++) {
      const x = i / (POINTS - 1);
      const trainY =
        0.05 + Math.exp(-x * 5.5) * 0.9 + (rng() - 0.5) * 0.03;
      const valY =
        0.1 + Math.exp(-x * 3.8) * 0.82 + (rng() - 0.5) * 0.05;
      train.push([x, Math.max(0.02, Math.min(1, trainY))]);
      val.push([x, Math.max(0.02, Math.min(1, valY))]);
    }

    return {
      path: toPath(train),
      validationPath: toPath(val),
      total: POINTS,
    };
  }, []);

  void total;

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="loss-stroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Gridlines — very faint */}
      <g stroke="rgba(0,212,255,0.04)" strokeWidth="0.1">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={`h${t}`} x1="0" x2="100" y1={t * 40} y2={t * 40} />
        ))}
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={`v${t}`} x1={t * 100} x2={t * 100} y1="0" y2="40" />
        ))}
      </g>

      {/* Validation — slightly higher, flatter */}
      <motion.path
        d={validationPath}
        fill="none"
        stroke="#7B2FBE"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity * 0.6}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 8, ease: "easeOut" }}
      />

      {/* Training — the "loss curve" proper */}
      <motion.path
        d={path}
        fill="none"
        stroke="url(#loss-stroke)"
        strokeWidth="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 6, ease: "easeOut" }}
      />

      {/* Final-step marker dot — barely there */}
      <circle
        cx="100"
        cy={mapY(0.08)}
        r="0.45"
        fill="#00D4FF"
        opacity={opacity * 2}
      >
        <animate
          attributeName="r"
          values="0.3;0.7;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function toPath(points: [number, number][]): string {
  return points
    .map(([x, y], i) => {
      const X = x * 100;
      const Y = mapY(y);
      return `${i === 0 ? "M" : "L"} ${X.toFixed(3)} ${Y.toFixed(3)}`;
    })
    .join(" ");
}

/** Map a normalised loss value in [0,1] into the 0..40 viewBox y-range,
 *  flipped so high-loss sits at the top. */
function mapY(y: number): number {
  return 4 + (1 - y) * 32;
}

/** Deterministic PRNG so server/client paths match exactly. */
function mulberry32(seed: number) {
  let t = seed;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
