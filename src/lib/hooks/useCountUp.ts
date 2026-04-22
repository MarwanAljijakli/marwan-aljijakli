"use client";

import { useEffect, useRef, useState } from "react";

export type EasingFn = (t: number) => number;

/** ease-out-expo — matches the rest of the site's motion curve. */
export const easeOutExpo: EasingFn = (t) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Animate a numeric value from 0 to `target` using `requestAnimationFrame`.
 *
 *   const value = useCountUp(10, { trigger: inView, duration: 2000 });
 *
 *  - `trigger` flips the hook from idle to animating (no-op when false).
 *  - `duration` is in milliseconds. Defaults to 2000 ms.
 *  - `easing` defaults to ease-out-expo.
 *  - Returns the current animated value (float).
 */
export function useCountUp(
  target: number,
  {
    trigger,
    duration = 2000,
    easing = easeOutExpo,
  }: { trigger: boolean; duration?: number; easing?: EasingFn }
): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easing(t);
      setValue(target * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, trigger, duration, easing]);

  return value;
}
