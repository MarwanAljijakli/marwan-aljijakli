"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInViewport } from "@/lib/hooks/useInViewport";

/* ==========================================================================
 * MathBackground
 * --------------------------------------------------------------------------
 * Full-section canvas that renders a cloud of slowly drifting mathematical
 * glyphs and short LaTeX-ish tokens. Each symbol has its own velocity,
 * rotation, scale and opacity. When the cursor enters within
 * `DEFLECT_RADIUS` px of a symbol, the symbol is pushed radially away —
 * the effect is barely-there but rewards anyone who scrubs the mouse
 * through the section.
 *
 * Pure Canvas 2D. No external libraries. IntersectionObserver pauses the
 * rAF loop when the section is off-screen. prefers-reduced-motion renders
 * a single static frame.
 * ========================================================================== */

const SYMBOLS: string[] = [
  "∇", "Σ", "∫", "θ", "λ", "∂", "π", "ε", "σ", "μ", "β", "α",
  "Δ", "∞", "⊗", "ℝ", "ℕ", "ℤ", "∈", "∉", "∀", "∃", "⊂", "∩",
  "∪", "≈", "≠", "≤", "≥", "→", "⟶", "⊕", "★",
  "f(x)", "y=mx+b", "P(A|B)", "argmax", "loss(θ)",
];

const DEFAULT_COLORS = ["#00D4FF", "#7B2FBE"];

const DEFLECT_RADIUS = 100; // px
const DEFLECT_STRENGTH = 0.9; // force multiplier

interface Props {
  /** Overall opacity multiplier on top of each symbol's per-glyph alpha. */
  opacity?: number;
  /** Symbol stroke/fill colours (each glyph picks one at spawn). */
  colors?: string[];
  /** Approximate symbol count at 1920×1080; scaled by viewport area. */
  density?: number;
  /** Tailwind/utility classes forwarded to the root element. */
  className?: string;
}

interface Symbol {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  alpha: number; // 0..1 — per-glyph base opacity
  color: string;
}

export default function MathBackground({
  opacity = 1,
  colors = DEFAULT_COLORS,
  density = 70,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const symbolsRef = useRef<Symbol[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const visible = useInViewport(wrapRef, "200px 0px");
  const prefersReduced = useReducedMotion();

  /* --- Pointer tracking -------------------------------------------------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* --- Canvas setup + animation loop ------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    /**
     * (Re)build the symbol pool from scratch using the current section size.
     * Density scales with area; we clamp to a sane count on big screens.
     */
    const rebuild = () => {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseArea = 1920 * 1080;
      const currentArea = width * height;
      const count = Math.max(
        12,
        Math.min(140, Math.round(density * (currentArea / baseArea)))
      );

      const out: Symbol[] = [];
      for (let i = 0; i < count; i++) {
        out.push(makeSymbol(width, height, colors));
      }
      symbolsRef.current = out;
    };

    rebuild();

    // Resize handling via ResizeObserver — section can change height when
    // content above it expands.
    const resizeObs = new ResizeObserver(() => rebuild());
    resizeObs.observe(wrap);

    /* ---- Single-frame paint (for reduced-motion) ---- */
    const paintOnce = () => {
      ctx.clearRect(0, 0, width, height);
      paint(ctx, symbolsRef.current, opacity);
    };

    if (prefersReduced) {
      paintOnce();
      return () => resizeObs.disconnect();
    }

    /* ---- rAF loop (only when visible) ---- */
    let raf = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      const symbols = symbolsRef.current;
      for (let i = 0; i < symbols.length; i++) {
        const s = symbols[i];

        // Integrate position + rotation.
        s.x += s.vx * dt * 60;
        s.y += s.vy * dt * 60;
        s.rotation += s.rotSpeed * dt;

        // Wrap around the edges.
        if (s.x < -60) s.x = width + 60;
        else if (s.x > width + 60) s.x = -60;
        if (s.y < -60) s.y = height + 60;
        else if (s.y > height + 60) s.y = -60;

        // Mouse deflection.
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < DEFLECT_RADIUS * DEFLECT_RADIUS) {
            const dist = Math.sqrt(distSq) || 1;
            const force =
              (1 - dist / DEFLECT_RADIUS) * DEFLECT_STRENGTH * dt * 60;
            s.vx += (dx / dist) * force * 0.6;
            s.vy += (dy / dist) * force * 0.6;
          }
        }

        // Gentle drag so deflected symbols settle back to drift speed.
        s.vx *= 0.985;
        s.vy *= 0.985;
      }

      paint(ctx, symbols, opacity);

      if (visible) raf = requestAnimationFrame(step);
    };

    if (visible) {
      lastTime = performance.now();
      raf = requestAnimationFrame(step);
    } else {
      paintOnce(); // keep the last frame visible while paused
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
    };
  }, [visible, prefersReduced, opacity, colors, density]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="pointer-events-auto block h-full w-full" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function makeSymbol(w: number, h: number, colors: string[]): Symbol {
  const isToken = Math.random() < 0.15; // larger "f(x)" / "y=mx+b" tokens
  const text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const size = isToken
    ? 16 + Math.random() * 10
    : 12 + Math.random() * 36;
  return {
    text,
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size,
    rotation: (Math.random() - 0.5) * 0.6,
    rotSpeed: (Math.random() - 0.5) * 0.08,
    alpha: 0.04 + Math.random() * 0.08, // 0.04 – 0.12
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  symbols: Symbol[],
  globalOpacity: number
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < symbols.length; i++) {
    const s = symbols[i];
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.globalAlpha = Math.min(1, s.alpha * globalOpacity);
    ctx.fillStyle = s.color;
    ctx.font = `${s.size}px "Space Mono", "JetBrains Mono", ui-monospace, monospace`;
    ctx.fillText(s.text, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
