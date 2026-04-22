"use client";

import { scaleLinear } from "d3-scale";
import { line as d3line, curveLinear } from "d3-shape";
import { useEffect, useMemo, useRef, useState } from "react";

/* ==========================================================================
 * EcgChart
 * --------------------------------------------------------------------------
 * A scrolling ECG-style waveform with a pulsing heartbeat dot and a live
 * HR counter. Built with D3 scales + hand-authored PQRST morphology (no
 * library of canned ECGs — this is procedurally shaped so the animation
 * never repeats tile boundaries).
 *
 * Renders into an SVG of fixed viewBox (responsive via width=100%).
 * ========================================================================== */

const VIEW_W = 520;
const VIEW_H = 180;

const SAMPLES_PER_BEAT = 80; // samples in one PQRST cycle
const BEATS_IN_BUFFER = 5;   // how much history we keep in the trace
const SAMPLE_SPACING = 6;    // px between samples in SVG space
const BASE_HR = 72;          // starting heart rate (bpm)

/** Build one ECG beat (PQRST) as an array of amplitudes in [-0.4..1.0]. */
function buildBeat(): number[] {
  const out = new Array<number>(SAMPLES_PER_BEAT).fill(0);

  // Gaussian helper
  const g = (t: number, mu: number, sigma: number, amp: number) =>
    amp * Math.exp(-Math.pow((t - mu) / sigma, 2));

  for (let i = 0; i < SAMPLES_PER_BEAT; i++) {
    const t = i / SAMPLES_PER_BEAT; // 0..1
    // P wave — small bump
    let y = g(t, 0.18, 0.025, 0.15);
    // Q wave — small dip
    y += g(t, 0.32, 0.012, -0.12);
    // R wave — big spike
    y += g(t, 0.36, 0.01, 1.0);
    // S wave — dip after R
    y += g(t, 0.40, 0.015, -0.25);
    // T wave — broad hump
    y += g(t, 0.62, 0.05, 0.28);
    out[i] = y;
  }
  return out;
}

export default function EcgChart({ speedMul = 1 }: { speedMul?: number }) {
  const [hr, setHr] = useState(BASE_HR);

  // Ring buffer of samples (total = SAMPLES_PER_BEAT * BEATS_IN_BUFFER).
  const BUFFER = SAMPLES_PER_BEAT * BEATS_IN_BUFFER;
  const samplesRef = useRef<Float32Array>(new Float32Array(BUFFER));
  const beatRef = useRef<number[]>(buildBeat());
  const readHeadRef = useRef(0);

  // One motion version state — mutated for re-renders of the <path/>.
  const [version, bump] = useState(0);

  // Fixed scales
  const { xScale, yScale } = useMemo(() => {
    const total = BUFFER;
    const xs = scaleLinear().domain([0, total - 1]).range([0, total * SAMPLE_SPACING]);
    const ys = scaleLinear().domain([-0.5, 1.2]).range([VIEW_H - 20, 20]);
    return { xScale: xs, yScale: ys };
  }, [BUFFER]);

  /* Drive the buffer ------------------------------------------------------- */
  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();
    let cursor = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // How many samples to advance this frame — scale by current HR.
      // Each beat is SAMPLES_PER_BEAT samples; samples/sec = HR/60 * samples.
      const samplesPerSec = (hr / 60) * SAMPLES_PER_BEAT * speedMul;
      const stepF = samplesPerSec * dt;
      const step = Math.floor(stepF);

      if (step > 0) {
        const beat = beatRef.current;
        const buf = samplesRef.current;
        for (let k = 0; k < step; k++) {
          // Small jitter so repeated beats don't alias.
          const jitter = (Math.random() - 0.5) * 0.015;
          buf[readHeadRef.current] = beat[cursor % beat.length] + jitter;
          readHeadRef.current = (readHeadRef.current + 1) % BUFFER;
          cursor++;
        }
        bump((v) => (v + step) % 1_000_000);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hr, speedMul, BUFFER]);

  /* Wobble the HR naturally ------------------------------------------------ */
  useEffect(() => {
    const id = window.setInterval(() => {
      setHr((prev) => {
        const target = 72 + Math.round(Math.sin(Date.now() / 3000) * 6);
        return prev + Math.sign(target - prev);
      });
    }, 240);
    return () => window.clearInterval(id);
  }, []);

  /* Build the SVG path string from the current ring buffer ----------------- */
  const { path, dotX, dotY } = useMemo(() => {
    const buf = samplesRef.current;
    const read = readHeadRef.current;
    const pts: [number, number][] = new Array(BUFFER);

    for (let i = 0; i < BUFFER; i++) {
      const idx = (read + i) % BUFFER;
      pts[i] = [xScale(i), yScale(buf[idx])];
    }

    const line = d3line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(curveLinear);

    // Leading dot = the newest sample (last written to the buffer).
    const last = pts[BUFFER - 1];

    return {
      path: line(pts) ?? "",
      dotX: last[0],
      dotY: last[1],
    };
    // `version` is the re-render trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, BUFFER, xScale, yScale]);

  const fullWidth = BUFFER * SAMPLE_SPACING;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-black/50">
      {/* Background grid */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="ecg-grid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#12ff88"
              strokeWidth="0.4"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ecg-grid)" />
      </svg>

      {/* Trace */}
      <svg
        className="relative h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-label="Live electrocardiogram"
      >
        <defs>
          <linearGradient id="ecg-fade" x1="0" x2="1">
            <stop offset="0%" stopColor="#12ff88" stopOpacity="0" />
            <stop offset="25%" stopColor="#12ff88" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#12ff88" stopOpacity="1" />
          </linearGradient>
          <filter id="ecg-glow">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The path is wider than the view — anchor its right edge to the
            right of the viewBox so the trace 'scrolls' by translateX. */}
        <g transform={`translate(${VIEW_W - fullWidth},0)`}>
          <path
            d={path}
            fill="none"
            stroke="url(#ecg-fade)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#ecg-glow)"
          />

          {/* Heartbeat dot */}
          <circle cx={dotX} cy={dotY} r="4.2" fill="#ffffff" opacity="0.9" />
          <circle
            cx={dotX}
            cy={dotY}
            r="9"
            fill="none"
            stroke="#12ff88"
            strokeWidth="1"
            opacity="0.55"
          >
            <animate
              attributeName="r"
              values="3;14;3"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* HR readout */}
      <div className="absolute left-4 top-3 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
        HR
        <span className="text-base font-semibold tabular-nums text-[#12ff88]">
          {hr}
        </span>
        <span className="text-[color:var(--text-muted)]">bpm</span>
      </div>

      {/* SpO₂ readout */}
      <div className="absolute right-4 top-3 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
        SpO₂
        <span className="text-base font-semibold tabular-nums text-[#12ff88]">
          98
        </span>
        <span className="text-[color:var(--text-muted)]">%</span>
      </div>
    </div>
  );
}
