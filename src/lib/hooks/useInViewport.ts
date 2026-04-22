"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Reports whether the referenced element is currently intersecting the
 * viewport. Used by the animated background components to pause their
 * requestAnimationFrame loops while off-screen.
 *
 *   const visible = useInViewport(ref, 0);
 *
 * Unlike framer-motion's `useInView` (which is a "fire once" gate), this is
 * a live boolean that flips back to `false` when the element scrolls out.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "0px",
  threshold: number | number[] = 0
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // `rootMargin` / `threshold` are deliberately treated as stable configs;
    // callers should pass primitive literals to avoid churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return visible;
}
