"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/* ==========================================================================
 * LoadingScreen
 * --------------------------------------------------------------------------
 * A cinematic 4-phase intro played once per session:
 *
 *   Phase 1 · 0.00–0.80s  →  "M" + "A" fly in from opposite sides
 *   Phase 2 · 0.80–1.50s  →  glow-pulse + streaming mathematical symbols
 *   Phase 3 · 1.50–2.50s  →  MA shatters into particles (canvas + rAF)
 *   Phase 4 · 2.50–3.10s  →  loader fades out, page slides up
 *
 * A cyan progress bar fills the bottom edge for the full duration.
 * sessionStorage gates the experience so it only plays once per session.
 * ========================================================================== */

type Phase = 0 | 1 | 2 | 3 | 4 | 5;
//  0: pure black / pre-mount
//  1: letters fly in
//  2: pulse + equations
//  3: shatter (canvas particles)
//  4: slide-up exit
//  5: unmounted

const STORAGE_KEY = "marwan-portfolio-visited";

const TIMINGS = {
  flyIn: 800,       // phase 1 end
  equations: 1500,  // phase 2 end
  shatter: 2500,    // phase 3 end
  exit: 700,        // phase 4 duration
} as const;

const TOTAL_LOADING_MS = TIMINGS.shatter; // progress bar target

const SYMBOLS = ["∇", "Σ", "∫", "θ", "λ", "∂", "π", "ε", "∞", "Δ", "α", "∑"] as const;

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const [shouldShow, setShouldShow] = useState<boolean | null>(null); // null = deciding
  const [progress, setProgress] = useState(0);

  // --- Session gate --------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    let visited = false;
    try {
      visited = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage blocked (privacy mode / SSR) — show once.
    }

    if (visited) {
      setShouldShow(false);
      onComplete?.();
      return;
    }

    setShouldShow(true);
  }, [onComplete]);

  // --- Phase scheduler -----------------------------------------------------
  useEffect(() => {
    if (!shouldShow) return;

    setPhase(1);
    const t2 = window.setTimeout(() => setPhase(2), TIMINGS.flyIn);
    const t3 = window.setTimeout(() => setPhase(3), TIMINGS.equations);
    const t4 = window.setTimeout(() => setPhase(4), TIMINGS.shatter);
    const t5 = window.setTimeout(() => {
      setPhase(5);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
      onComplete?.();
    }, TIMINGS.shatter + TIMINGS.exit);

    return () => {
      [t2, t3, t4, t5].forEach(window.clearTimeout);
    };
  }, [shouldShow, onComplete]);

  // --- Progress bar (driven by rAF for smoothness) -------------------------
  useEffect(() => {
    if (!shouldShow) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(1, (now - start) / TOTAL_LOADING_MS);
      setProgress(pct * 100);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldShow]);

  // --- Render --------------------------------------------------------------
  if (shouldShow === null || !shouldShow) return null;

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          key="loading-screen"
          aria-hidden="true"
          initial={{ opacity: 1, y: 0 }}
          animate={
            phase === 4
              ? { y: "-100%", opacity: 0 }
              : { y: 0, opacity: 1 }
          }
          transition={{
            duration: TIMINGS.exit / 1000,
            ease: [0.87, 0, 0.13, 1],
          }}
          className="fixed inset-0 z-[200] overflow-hidden bg-black"
        >
          {/* Subtle cyan grid backdrop */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-bg mask-radial-fade" />

          {/* Equations layer (phase 2+) */}
          <EquationsLayer active={phase === 2} />

          {/* Letters — rendered during phase 1 & 2, hidden in 3+ */}
          {phase < 3 && <LettersMA phase={phase} />}

          {/* Particle shatter (phase 3+) */}
          {phase >= 3 && phase < 5 && <ParticleShatter />}

          {/* Meta text */}
          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 && phase < 4 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-secondary)]"
            >
              Marwan Aljijakli — Initializing systems
            </motion.span>
          </div>

          {/* Progress bar (bottom edge) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <motion.div
              className="h-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--accent-primary) 60%, #bff7ff 100%)",
                boxShadow: "0 0 12px var(--glow)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "tween", ease: "linear", duration: 0.08 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
 * LettersMA — Phase 1 fly-in + Phase 2 pulse
 * ========================================================================== */

function LettersMA({ phase }: { phase: Phase }) {
  // `dir` is -1 for "M" (flies in from the left) and +1 for "A" (from the right).
  const letterBase: Variants = {
    hidden: (dir: 1 | -1) => ({
      x: `${dir * 120}vw`,
      opacity: 0,
      rotate: dir * -8,
      filter: "blur(12px)",
    }),
    visible: {
      x: 0,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 18,
        mass: 0.9,
      },
    },
  };

  const pulseAnim =
    phase >= 2
      ? {
          scale: [1, 1.06, 1],
          filter: [
            "drop-shadow(0 0 0px rgba(0,212,255,0))",
            "drop-shadow(0 0 36px rgba(0,212,255,0.9))",
            "drop-shadow(0 0 18px rgba(0,212,255,0.5))",
          ],
        }
      : {};

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      data-ma-root
      animate={pulseAnim}
      transition={
        phase >= 2
          ? { duration: 0.7, ease: "easeInOut", repeat: 0 }
          : undefined
      }
    >
      <div className="relative flex items-center justify-center leading-none">
        <motion.span
          custom={-1}
          variants={letterBase}
          initial="hidden"
          animate="visible"
          data-ma-letter="M"
          className="font-display text-[color:var(--accent-primary)]"
          style={{
            fontSize: "20vw",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: phase >= 2 ? "0 0 40px rgba(0,212,255,0.6)" : undefined,
          }}
        >
          M
        </motion.span>
        <motion.span
          custom={1}
          variants={letterBase}
          initial="hidden"
          animate="visible"
          data-ma-letter="A"
          className="font-display text-[color:var(--accent-primary)]"
          style={{
            fontSize: "20vw",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: phase >= 2 ? "0 0 40px rgba(0,212,255,0.6)" : undefined,
          }}
        >
          A
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
 * EquationsLayer — floating LaTeX-style symbols
 * ========================================================================== */

interface FloatingSymbol {
  id: number;
  char: string;
  x: number; // vw
  y: number; // vh
  size: number; // rem
  rotate: number;
  delay: number;
  duration: number;
}

function EquationsLayer({ active }: { active: boolean }) {
  const symbols = useMemo<FloatingSymbol[]>(() => {
    const count = 22;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.2 + Math.random() * 2.4, // rem
      rotate: (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.35,
      duration: 1.8 + Math.random() * 1.2,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {active &&
          symbols.map((s) => (
            <motion.span
              key={s.id}
              className="absolute font-mono font-bold select-none"
              style={{
                left: `${s.x}vw`,
                top: `${s.y}vh`,
                fontSize: `${s.size}rem`,
                color: "var(--accent-secondary)",
                opacity: 0.3,
                textShadow: "0 0 16px rgba(123,47,190,0.6)",
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, scale: 0.6, rotate: s.rotate }}
              animate={{
                opacity: [0, 0.3, 0.3, 0],
                scale: [0.6, 1, 1.08, 0.8],
                y: [-8, -28, -48, -68],
                rotate: [s.rotate, s.rotate + 10, s.rotate + 20],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                ease: "easeOut",
              }}
            >
              {s.char}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
 * ParticleShatter — Phase 3
 * --------------------------------------------------------------------------
 * Samples non-transparent pixels of "MA" rendered to an offscreen canvas,
 * spawns a particle at each sample, then runs physics with requestAnimationFrame.
 * ========================================================================== */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: "cyan" | "violet" | "orange";
}

function ParticleShatter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // ---- Sample "MA" pixel grid from an offscreen canvas ------------------
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = w;
    sampleCanvas.height = h;
    const sctx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    const sizePx = Math.round(w * 0.2); // matches 20vw
    sctx.fillStyle = "#00D4FF";
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    sctx.font = `700 ${sizePx}px "Space Grotesk", Inter, system-ui, sans-serif`;
    sctx.fillText("MA", w / 2, h / 2);

    const img = sctx.getImageData(0, 0, w, h);
    const data = img.data;

    const particles: Particle[] = [];
    const cx = w / 2;
    const cy = h / 2;

    // Sampling step — larger = fewer particles.
    const step = Math.max(3, Math.round(w / 520));

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4 + 3;
        if (data[idx] > 128) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const pushOut = 0.08 + Math.random() * 0.14;
          const jitterAngle = (Math.random() - 0.5) * 0.8;
          const cos = Math.cos(jitterAngle);
          const sin = Math.sin(jitterAngle);

          const vx = ((dx * cos - dy * sin) / dist) * (dist * pushOut);
          const vy = ((dx * sin + dy * cos) / dist) * (dist * pushOut);

          const roll = Math.random();
          const hue: Particle["hue"] =
            roll < 0.78 ? "cyan" : roll < 0.96 ? "violet" : "orange";

          particles.push({
            x,
            y,
            vx: vx * 0.12 + (Math.random() - 0.5) * 2.5,
            vy: vy * 0.12 + (Math.random() - 0.5) * 2.5 - 1.2, // slight upward bias
            size: 1 + Math.random() * 2.2,
            life: 0,
            maxLife: 800 + Math.random() * 350, // ms
            hue,
          });
        }
      }
    }

    particlesRef.current = particles;

    // ---- Physics loop ------------------------------------------------------
    const COLORS: Record<Particle["hue"], string> = {
      cyan: "0, 212, 255",
      violet: "123, 47, 190",
      orange: "255, 107, 53",
    };

    const FRICTION = 0.985;
    const GRAVITY = 0.08;

    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      ctx.clearRect(0, 0, w, h);

      const list = particlesRef.current;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        if (p.life >= p.maxLife) continue;

        // Integrate (dt is in ms; treat 16ms as a "unit frame").
        const step = dt / 16.666;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.vx *= FRICTION;
        p.vy = p.vy * FRICTION + GRAVITY * step;
        p.life += dt;

        const lifeT = p.life / p.maxLife;
        const alpha = 1 - lifeT * lifeT;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${COLORS[p.hue]}, ${alpha})`;
        ctx.arc(p.x, p.y, p.size * (1 - lifeT * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Additive glow pass for cyan particles
        if (p.hue === "cyan" && alpha > 0.2) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${COLORS[p.hue]}, ${alpha * 0.25})`;
          ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
    />
  );
}
