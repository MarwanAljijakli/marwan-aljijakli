"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseLazySectionOptions {
  /** Load when the section is within this many pixels of the viewport. */
  rootMargin?: string;
  /** Intersection threshold. Default 0.01 (any overlap triggers). */
  threshold?: number;
}

interface UseLazySectionResult<T extends Element> {
  ref: RefObject<T>;
  /** True the moment the section has *ever* entered the pre-load window.
   *  Flips once and stays true. Use this to mount heavy subtrees. */
  hasBeenVisible: boolean;
  /** True while the section currently intersects the viewport. Use this to
   *  gate per-frame work (R3F `frameloop`, canvas rAF loops, …). */
  isVisible: boolean;
}

/**
 * Two signals combined:
 *
 *   - `hasBeenVisible`   — latches true once you've ever been near the
 *                          section. Perfect for `{hasBeenVisible && <Scene/>}`
 *                          so a heavy R3F tree only mounts once when it
 *                          first approaches the viewport, and stays mounted
 *                          afterwards so scrolling back doesn't restart
 *                          animations.
 *   - `isVisible`        — live boolean, flips as the section enters / exits
 *                          the viewport. Feed it into `<Canvas frameloop>`
 *                          so the render loop stops entirely while off-screen.
 */
export function useLazySection<T extends Element = HTMLDivElement>({
  rootMargin = "200px",
  threshold = 0.01,
}: UseLazySectionOptions = {}): UseLazySectionResult<T> {
  const ref = useRef<T>(null as unknown as T);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // SSR / legacy browsers — mount everything eagerly.
      setHasBeenVisible(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasBeenVisible(true);
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // rootMargin / threshold are treated as stable configs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, hasBeenVisible, isVisible };
}
