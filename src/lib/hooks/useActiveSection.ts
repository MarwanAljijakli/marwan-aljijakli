"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the provided section ids is currently "the active one"
 * (the section whose midpoint is closest to the viewport middle).
 *
 *   const active = useActiveSection(["about", "projects", "skills"]);
 *
 * Uses IntersectionObserver with a tight rootMargin so only the section the
 * reader is actually looking at is reported. Returns `null` when no tracked
 * section intersects.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Record the most recent intersection ratio per id; on each IO callback,
    // pick the id with the highest current ratio to avoid flicker when two
    // sections straddle the middle band.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            bestId = id;
            bestRatio = r;
          }
        }
        if (bestRatio > 0 && bestId !== activeId) setActiveId(bestId);
      },
      {
        // A horizontal band across the viewport middle; anything inside
        // that band counts as "active".
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const targets: Element[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    });

    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
    // Re-run if the id list identity changes; `activeId` is a read-only
    // comparison value for avoiding redundant setState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  return activeId;
}
