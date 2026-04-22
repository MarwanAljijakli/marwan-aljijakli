"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInViewport } from "@/lib/hooks/useInViewport";

/* ==========================================================================
 * DataStreamBackground
 * --------------------------------------------------------------------------
 * Differentiated-from-The-Matrix data grid:
 *
 *  - A 2D grid of single-character cells (binary, hex digits, math glyphs).
 *  - Columns gate in and out via independent slow-sine-wave envelopes —
 *    only a subset are "active" at any moment.
 *  - Vertical streams (falling heads) spawn inside active columns.
 *  - Horizontal sweeps (left-to-right scans) occasionally cut across a row.
 *  - Characters on lit cells reshuffle randomly every ~250–700 ms.
 *
 * Intentionally kept at 3–8 % opacity so it lives behind the content.
 * ========================================================================== */

const CELL_W = 20;  // px
const CELL_H = 22;  // px

const CHAR_BINARY = ["0", "1"];
const CHAR_HEX = "0123456789ABCDEF".split("");
const CHAR_MATH = [
  "∇", "Σ", "∫", "θ", "λ", "∂", "π", "ε", "σ", "μ",
  "β", "α", "Δ", "∞", "⊗", "⊕", "⊂", "∈", "≈", "≠", "→",
];

/** Weighted pick from the three character pools. */
function pickChar(): string {
  const r = Math.random();
  if (r < 0.4) return CHAR_BINARY[Math.floor(Math.random() * CHAR_BINARY.length)];
  if (r < 0.75) return CHAR_HEX[Math.floor(Math.random() * CHAR_HEX.length)];
  return CHAR_MATH[Math.floor(Math.random() * CHAR_MATH.length)];
}

interface Props {
  /** Global opacity multiplier (0–1). Defaults to 1; internal per-cell
   *  opacity is already pinned at 3–8 %, so leave this at 1 unless you
   *  want to dim the whole layer. */
  opacity?: number;
  /** Stream/sweep colour as hex. Default cyan. */
  color?: string;
  /** Head cell colour (bright tip). Default off-white for contrast. */
  headColor?: string;
  className?: string;
}

interface Stream {
  col: number;
  headY: number;    // cell-row position (float)
  speed: number;    // rows/sec
  tail: number;     // tail length in cells
  born: number;     // spawn time
}

interface Sweep {
  row: number;
  headX: number;
  speed: number;
  tail: number;
  born: number;
}

export default function DataStreamBackground({
  opacity = 1,
  color = "#00D4FF",
  headColor = "#BFF7FF",
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const visible = useInViewport(wrapRef, "200px 0px");
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // --- Layout state -------------------------------------------------
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Char per cell (flat: col * rows + row).
    let cellChar: string[] = [];
    // Per-cell opacity decays each frame.
    let cellAlpha: Float32Array = new Float32Array(0);
    // Per-cell "next char change" timestamp (ms).
    let cellChangeAt: Float32Array = new Float32Array(0);

    // Column gating.
    let colPhase: Float32Array = new Float32Array(0);
    let colFreq: Float32Array = new Float32Array(0);
    let colActivity: Float32Array = new Float32Array(0);

    const streams: Stream[] = [];
    const sweeps: Sweep[] = [];

    let lastStreamSpawnAt = 0;
    let lastSweepSpawnAt = 0;

    const CELL_COUNT = () => cols * rows;

    const rebuild = () => {
      width = wrap.clientWidth;
      height = wrap.clientHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.ceil(width / CELL_W));
      rows = Math.max(1, Math.ceil(height / CELL_H));

      const n = CELL_COUNT();
      cellChar = new Array<string>(n);
      cellAlpha = new Float32Array(n);
      cellChangeAt = new Float32Array(n);

      colPhase = new Float32Array(cols);
      colFreq = new Float32Array(cols);
      colActivity = new Float32Array(cols);

      for (let c = 0; c < cols; c++) {
        colPhase[c] = Math.random() * Math.PI * 2;
        // Most columns breathe slowly; a handful pulse quicker.
        colFreq[c] = 0.05 + Math.random() * 0.35;
      }
      for (let i = 0; i < n; i++) {
        cellChar[i] = pickChar();
        cellChangeAt[i] = Math.random() * 1000;
      }

      streams.length = 0;
      sweeps.length = 0;
    };

    rebuild();

    const resizeObs = new ResizeObserver(() => rebuild());
    resizeObs.observe(wrap);

    /* ---- Paint (one frame) -------------------------------------------- */
    const paint = () => {
      // Soft clear — a translucent fill gives a touch of trail effect
      // without the overt "phosphor" look of classic matrix rain.
      ctx.clearRect(0, 0, width, height);
      ctx.font = `14px "Space Mono", "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let c = 0; c < cols; c++) {
        const colA = colActivity[c];
        if (colA < 0.02) continue; // skip gated-off columns entirely
        const colX = c * CELL_W + CELL_W / 2;

        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const a = cellAlpha[idx];
          if (a < 0.01) continue;

          // Cells at a stream head get a brighter tint.
          const isHead = a > 0.85;
          const effective = Math.min(0.08, a * colA) * opacity;

          ctx.globalAlpha = effective;
          ctx.fillStyle = isHead ? headColor : color;
          ctx.fillText(cellChar[idx], colX, r * CELL_H + CELL_H / 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    if (prefersReduced) {
      // Static snapshot: random static pattern, no loop.
      for (let c = 0; c < cols; c++) {
        colActivity[c] = Math.max(0, Math.sin(colPhase[c])) * 0.5;
        for (let r = 0; r < rows; r++) {
          cellAlpha[c * rows + r] = Math.random() < 0.12 ? 0.4 : 0;
        }
      }
      paint();
      return () => resizeObs.disconnect();
    }

    /* ---- rAF loop ----------------------------------------------------- */
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // 1. Update column activity via independent sine envelopes.
      //    clamp max activity at ~1 so strongly "on" columns all read similar.
      for (let c = 0; c < cols; c++) {
        const v = Math.sin(t * colFreq[c] * 2 + colPhase[c]);
        // Only the positive half counts → ~half of columns dark at any moment.
        colActivity[c] = Math.max(0, v);
      }

      // 2. Decay per-cell alpha.
      for (let i = 0; i < cellAlpha.length; i++) {
        cellAlpha[i] = Math.max(0, cellAlpha[i] - dt * 1.4);
      }

      // 3. Advance streams.
      for (let s = streams.length - 1; s >= 0; s--) {
        const stream = streams[s];
        stream.headY += stream.speed * dt;
        const headRow = Math.floor(stream.headY);

        // Light up the head + tail cells.
        for (let t2 = 0; t2 <= stream.tail; t2++) {
          const r = headRow - t2;
          if (r < 0 || r >= rows) continue;
          const idx = stream.col * rows + r;
          const trailAlpha = t2 === 0 ? 1 : 0.7 - (t2 / stream.tail) * 0.55;
          if (trailAlpha > cellAlpha[idx]) cellAlpha[idx] = trailAlpha;
        }

        // Retire streams that have fallen off-screen.
        if (headRow - stream.tail > rows + 2) {
          streams.splice(s, 1);
        }
      }

      // 4. Advance sweeps (same as streams but horizontal).
      for (let s = sweeps.length - 1; s >= 0; s--) {
        const sweep = sweeps[s];
        sweep.headX += sweep.speed * dt;
        const headCol = Math.floor(sweep.headX);

        for (let t2 = 0; t2 <= sweep.tail; t2++) {
          const c = headCol - t2;
          if (c < 0 || c >= cols) continue;
          const idx = c * rows + sweep.row;
          const trailAlpha = t2 === 0 ? 0.9 : 0.6 - (t2 / sweep.tail) * 0.45;
          if (trailAlpha > cellAlpha[idx]) cellAlpha[idx] = trailAlpha;
        }

        if (headCol - sweep.tail > cols + 2) {
          sweeps.splice(s, 1);
        }
      }

      // 5. Spawn new streams / sweeps. Throttled so the grid never gets loud.
      if (now - lastStreamSpawnAt > 220 + Math.random() * 260) {
        lastStreamSpawnAt = now;
        const spawnCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < spawnCount; i++) {
          // Pick a column that's currently active (gated "on").
          let col = Math.floor(Math.random() * cols);
          for (let tries = 0; tries < 8; tries++) {
            if (colActivity[col] > 0.35) break;
            col = Math.floor(Math.random() * cols);
          }
          streams.push({
            col,
            headY: -Math.random() * 3,
            speed: 5 + Math.random() * 12,
            tail: 6 + Math.floor(Math.random() * 10),
            born: now,
          });
        }
      }

      if (now - lastSweepSpawnAt > 2200 + Math.random() * 3000) {
        lastSweepSpawnAt = now;
        sweeps.push({
          row: Math.floor(Math.random() * rows),
          headX: -Math.random() * 5,
          speed: 10 + Math.random() * 20,
          tail: 8 + Math.floor(Math.random() * 12),
          born: now,
        });
      }

      // 6. Periodically mutate characters on lit cells.
      for (let i = 0; i < cellAlpha.length; i++) {
        if (cellAlpha[i] < 0.15) continue;
        if (now > cellChangeAt[i]) {
          cellChar[i] = pickChar();
          cellChangeAt[i] = now + 250 + Math.random() * 450;
        }
      }

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
  }, [visible, prefersReduced, opacity, color, headColor]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
