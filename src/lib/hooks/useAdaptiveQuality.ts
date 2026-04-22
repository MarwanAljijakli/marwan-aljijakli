"use client";

import { useEffect, useRef, useState } from "react";

/* ==========================================================================
 * useAdaptiveQuality
 * --------------------------------------------------------------------------
 * A single source of truth for GPU/CPU budget decisions across every R3F
 * scene + canvas animation in the app.
 *
 *   const { tier, config } = useAdaptiveQuality();
 *
 *   <Canvas dpr={[1, config.pixelRatio]} gl={{ antialias: config.antialias }}>
 *     <NeuralNetwork nodeCount={Math.round(200 * config.particleCount)} … />
 *   </Canvas>
 *
 * Two signals drive the tier:
 *   1. Static device capability probe at mount — mobile, CPU cores, RAM,
 *      prefers-reduced-motion — narrows the initial tier down.
 *   2. Rolling 60-frame fps measurement — downgrades the tier at runtime if
 *      the device can't hold 45fps for a sustained window.
 *
 * The hook is SSR-safe: on the server and during the very first render, it
 * returns a conservative "medium" tier so no CPU is wasted until the real
 * device capabilities are measured.
 * ========================================================================== */

export type QualityTier = "high" | "medium" | "low" | "minimal";

export interface QualityConfig {
  /** Multiplier to apply to particle / node counts. 1 = full, 0.3 = 30 %. */
  particleCount: number;
  /** Max pixel ratio (dpr). Keep ≤ 1.5 on mid/low tiers. */
  pixelRatio: number;
  /** Whether the renderer should allocate an MSAA buffer. */
  antialias: boolean;
  /** Multiplier for geometry segment counts (sphere, torus, …). */
  geometryDetail: number;
  /** True if animated backgrounds should throttle to 30 fps instead of 60. */
  halfRate: boolean;
}

const QUALITY_PRESETS: Record<QualityTier, QualityConfig> = {
  high: {
    particleCount: 1.0,
    pixelRatio: 1.75,
    antialias: true,
    geometryDetail: 1.0,
    halfRate: false,
  },
  medium: {
    particleCount: 0.6,
    pixelRatio: 1.5,
    antialias: true,
    geometryDetail: 0.75,
    halfRate: false,
  },
  low: {
    particleCount: 0.3,
    pixelRatio: 1.0,
    antialias: false,
    geometryDetail: 0.5,
    halfRate: true,
  },
  minimal: {
    particleCount: 0.15,
    pixelRatio: 1.0,
    antialias: false,
    geometryDetail: 0.35,
    halfRate: true,
  },
};

const DEFAULT_TIER: QualityTier = "medium";

// Cache the tier across hook instances in one module scope — every
// component in the same browser session starts with the same decision.
let cachedTier: QualityTier | null = null;

/** Quick static probe: mobile flag, cores, ram, reduced-motion. */
function probeInitialTier(): QualityTier {
  if (typeof window === "undefined") return DEFAULT_TIER;

  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|Mobile|Opera Mini/i.test(ua);
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (reducedMotion) return "minimal";

  if (isMobile) {
    if (cores <= 2 || memory <= 2) return "low";
    if (cores <= 4 || memory <= 4) return "medium";
    return "medium"; // even modern mobile should start at medium
  }

  // Desktop
  if (cores <= 2 || memory <= 2) return "low";
  if (cores <= 4 || memory <= 4) return "medium";
  return "high";
}

export function useAdaptiveQuality(): {
  tier: QualityTier;
  config: QualityConfig;
} {
  const [tier, setTier] = useState<QualityTier>(
    cachedTier ?? DEFAULT_TIER
  );

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const downgradedRef = useRef(false);

  useEffect(() => {
    // 1. Apply the static probe on the client (once per session).
    if (cachedTier === null) {
      cachedTier = probeInitialTier();
      setTier(cachedTier);
    }

    // 2. Rolling fps monitor — only downgrade, never upgrade, during a
    //    single session to avoid oscillation.
    lastFrameRef.current = performance.now();

    const sample = (now: number) => {
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      frameTimesRef.current.push(delta);

      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
        const avg =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const fps = 1000 / avg;

        if (!downgradedRef.current) {
          setTier((prev) => {
            if (fps < 28 && prev !== "minimal") {
              downgradedRef.current = true;
              cachedTier = "minimal";
              return "minimal";
            }
            if (fps < 38 && prev === "high") {
              downgradedRef.current = true;
              cachedTier = "medium";
              return "medium";
            }
            if (fps < 45 && prev === "medium") {
              downgradedRef.current = true;
              cachedTier = "low";
              return "low";
            }
            return prev;
          });
        }
      }

      rafRef.current = requestAnimationFrame(sample);
    };

    rafRef.current = requestAnimationFrame(sample);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { tier, config: QUALITY_PRESETS[tier] };
}
