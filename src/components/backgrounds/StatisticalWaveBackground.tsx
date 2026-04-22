"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInViewport } from "@/lib/hooks/useInViewport";

/* ==========================================================================
 * StatisticalWaveBackground
 * --------------------------------------------------------------------------
 * Three overlapping sine waves anchored to the bottom of the section.
 * Each wave has its own frequency, amplitude, colour, phase, and advances
 * phase over time — together they read as an "ocean of data".
 *
 * Drawn with Canvas 2D as additive-blended filled paths so intersections
 * brighten, giving the impression of constructive interference.
 * ========================================================================== */

interface WaveConfig {
  color: string;
  opacity: number;   // 0–1
  amplitude: number; // px
  frequency: number; // cycles per full width
  speed: number;     // phase rad/sec
  thickness: number; // stroke px (0 = fill only)
  phase: number;     // starting phase
}

const DEFAULT_WAVES: WaveConfig[] = [
  {
    color: "#00D4FF",
    opacity: 0.4,
    amplitude: 34,
    frequency: 1.4,
    speed: 0.6,
    thickness: 1.6,
    phase: 0,
  },
  {
    color: "#7B2FBE",
    opacity: 0.25,
    amplitude: 28,
    frequency: 1.8, // 1.3× of primary
    speed: 0.8,
    thickness: 1.2,
    phase: Math.PI / 4,
  },
  {
    color: "#FF6B35",
    opacity: 0.15,
    amplitude: 52, // larger amplitude
    frequency: 0.9, // 0.7× of primary
    speed: 0.4,
    thickness: 1,
    phase: Math.PI / 2,
  },
];

interface Props {
  /** Global multiplier on every wave's opacity. */
  opacity?: number;
  /** Override the default wave stack. */
  waves?: WaveConfig[];
  /** Height of the wave band in px (anchored to bottom). */
  height?: number;
  className?: string;
}

export default function StatisticalWaveBackground({
  opacity = 1,
  waves = DEFAULT_WAVES,
  height = 220,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const visible = useInViewport(wrapRef, "150px 0px");
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let canvasH = 0;

    const waveState = waves.map((w) => ({ ...w })); // mutable copy for phase

    const rebuild = () => {
      width = wrap.clientWidth;
      canvasH = Math.min(height, wrap.clientHeight);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(canvasH * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    rebuild();

    const resizeObs = new ResizeObserver(() => rebuild());
    resizeObs.observe(wrap);

    /** Draw one wave as a filled path (bottom-anchored) plus an optional
     *  stroke along the crest line. */
    const drawWave = (w: (typeof waveState)[number]) => {
      const SAMPLES = Math.max(48, Math.ceil(width / 8));
      const baseY = canvasH - 6; // small gutter so the crest doesn't clip

      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let i = 0; i <= SAMPLES; i++) {
        const x = (i / SAMPLES) * width;
        const theta = (x / width) * Math.PI * 2 * w.frequency + w.phase;
        const y = baseY - Math.sin(theta) * w.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, canvasH);
      ctx.lineTo(0, canvasH);
      ctx.closePath();

      // Vertical gradient fill — brightest at the crest, fully transparent
      // at the baseline.
      const grad = ctx.createLinearGradient(0, baseY - w.amplitude, 0, canvasH);
      grad.addColorStop(0, hexWithAlpha(w.color, w.opacity * opacity));
      grad.addColorStop(1, hexWithAlpha(w.color, 0));
      ctx.fillStyle = grad;
      ctx.fill();

      // Crest stroke for a crisper waveline.
      if (w.thickness > 0) {
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const x = (i / SAMPLES) * width;
          const theta = (x / width) * Math.PI * 2 * w.frequency + w.phase;
          const y = baseY - Math.sin(theta) * w.amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hexWithAlpha(w.color, Math.min(1, w.opacity * 1.8 * opacity));
        ctx.lineWidth = w.thickness;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, canvasH);
      // Additive blending so overlapping waves brighten each other.
      ctx.globalCompositeOperation = "lighter";
      for (const w of waveState) drawWave(w);
      ctx.globalCompositeOperation = "source-over";
    };

    if (prefersReduced) {
      paint();
      return () => resizeObs.disconnect();
    }

    /* ---- Animate ------------------------------------------------------ */
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const w of waveState) w.phase += w.speed * dt;
      paint();
      if (visible) raf = requestAnimationFrame(tick);
    };

    if (visible) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else {
      paint();
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
    };
  }, [visible, prefersReduced, opacity, waves, height]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Expand a hex like `#FF6B35` (or `#F63`) to `rgba(255,107,53,a)`. */
function hexWithAlpha(hex: string, a: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
}
