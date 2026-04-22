"use client";

import { useEffect, useRef } from "react";

/* ==========================================================================
 * CursorTrail
 * --------------------------------------------------------------------------
 * 8 fading cyan dots tracking the cursor's recent positions — a comet tail.
 *
 *  - Captures a snapshot of the cursor every ~3 frames into a ring buffer
 *    so the trail has visible spacing (not all dots clumped on the head).
 *  - Positions are written directly via `element.style.transform` in the
 *    rAF loop — zero React re-renders, zero GC churn per frame.
 *  - Hidden entirely on touch / coarse-pointer devices via CSS.
 *  - Renders behind `AnimatedCursor` (z-[9998] vs the cursor's 9999) so the
 *    main dot + ring always sit on top.
 * ========================================================================== */

const TRAIL_LENGTH = 8;
const SNAPSHOT_EVERY_FRAMES = 3;
const MAX_OPACITY = 0.2;

export default function CursorTrail() {
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on coarse-pointer devices — touch UIs shouldn't ship a phantom
    // desktop-only cursor tail.
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mql.matches) return;

    // Ring buffer of past cursor positions — index 0 is the newest snapshot.
    const positions = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: -100,
      y: -100,
    }));
    const current = { x: -100, y: -100 };

    const onMove = (e: PointerEvent) => {
      current.x = e.clientX;
      current.y = e.clientY;
    };

    let frame = 0;
    let raf = 0;

    const tick = () => {
      frame++;

      // Push a new snapshot every SNAPSHOT_EVERY_FRAMES so the trail reads
      // as "spaced out" rather than "eight dots on the head".
      if (frame % SNAPSHOT_EVERY_FRAMES === 0) {
        for (let i = positions.length - 1; i > 0; i--) {
          positions[i].x = positions[i - 1].x;
          positions[i].y = positions[i - 1].y;
        }
        positions[0].x = current.x;
        positions[0].y = current.y;
      }

      // Repaint each dot against its corresponding slot.
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const el = dots[i];
        if (!el) continue;
        const p = positions[i];
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] hidden md:block"
    >
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        // Newest is biggest + brightest; oldest is tiniest + faintest.
        const size = 6 - i * 0.5;
        const opacity = MAX_OPACITY * (1 - i / TRAIL_LENGTH);
        return (
          <span
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className="absolute left-0 top-0 rounded-full bg-[color:var(--accent-primary)] will-change-transform"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              boxShadow: i < 3 ? "0 0 6px rgba(0,212,255,0.5)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
