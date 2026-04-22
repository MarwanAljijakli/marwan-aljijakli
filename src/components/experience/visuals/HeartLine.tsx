"use client";

import { useEffect, useRef } from "react";

/* ==========================================================================
 * HeartLine
 * --------------------------------------------------------------------------
 * A compact canvas-rendered ECG trace. Uses a ring buffer of PQRST samples
 * and blits them onto a dark canvas every frame, adding a glowing trailing
 * dot at the write head. Intentionally self-contained (no React re-renders
 * per frame — everything lives on the canvas context).
 * ========================================================================== */

const VIEW_W = 520;
const VIEW_H = 150;

const SAMPLES_PER_BEAT = 60;
const BUFFER = SAMPLES_PER_BEAT * 5; // 5 beats visible

export default function HeartLine({ inView }: { inView: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VIEW_W * dpr;
    canvas.height = VIEW_H * dpr;
    canvas.style.width = `${VIEW_W}px`;
    canvas.style.height = `${VIEW_H}px`;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const beat = buildBeat();
    const samples = new Float32Array(BUFFER);
    let writeHead = 0;
    let cursor = 0;
    const hr = 72;

    let last = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Advance samples per second scaled by HR
      const samplesPerSec = (hr / 60) * SAMPLES_PER_BEAT;
      const step = Math.floor(samplesPerSec * dt);

      for (let k = 0; k < step; k++) {
        const jitter = (Math.random() - 0.5) * 0.012;
        samples[writeHead] = beat[cursor % beat.length] + jitter;
        writeHead = (writeHead + 1) % BUFFER;
        cursor++;
      }

      // Background — subtle trail effect
      ctx.fillStyle = "rgba(3, 18, 10, 0.24)";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      // Grid — drawn once-ish (on top of fading trail)
      ctx.strokeStyle = "rgba(18,255,136,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < VIEW_W; x += 26) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, VIEW_H);
      }
      for (let y = 0; y < VIEW_H; y += 22) {
        ctx.moveTo(0, y);
        ctx.lineTo(VIEW_W, y);
      }
      ctx.stroke();

      // ECG trace
      ctx.strokeStyle = "#12ff88";
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(18,255,136,0.65)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const spacing = VIEW_W / BUFFER;
      for (let i = 0; i < BUFFER; i++) {
        const idx = (writeHead + i) % BUFFER;
        const x = i * spacing;
        const y =
          VIEW_H / 2 - samples[idx] * (VIEW_H * 0.42);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Write-head glow dot (at right edge)
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#bfffd8";
      const headIdx = (writeHead + BUFFER - 1) % BUFFER;
      const hx = VIEW_W - spacing;
      const hy = VIEW_H / 2 - samples[headIdx] * (VIEW_H * 0.42);
      ctx.beginPath();
      ctx.arc(hx, hy, 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[#12ff88]" />
          rPPG · live trace
        </span>
        <span>hr · 72 bpm · spo₂ · 98%</span>
      </div>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PQRST morphology — built from 5 Gaussian bumps.                            */
/* -------------------------------------------------------------------------- */

function buildBeat(): number[] {
  const out = new Array<number>(SAMPLES_PER_BEAT).fill(0);
  const g = (t: number, mu: number, sigma: number, amp: number) =>
    amp * Math.exp(-Math.pow((t - mu) / sigma, 2));

  for (let i = 0; i < SAMPLES_PER_BEAT; i++) {
    const t = i / SAMPLES_PER_BEAT;
    let y = g(t, 0.18, 0.03, 0.12);  // P
    y += g(t, 0.32, 0.012, -0.12);    // Q
    y += g(t, 0.36, 0.010, 1.0);      // R
    y += g(t, 0.40, 0.015, -0.28);    // S
    y += g(t, 0.62, 0.055, 0.3);      // T
    out[i] = y;
  }
  return out;
}
