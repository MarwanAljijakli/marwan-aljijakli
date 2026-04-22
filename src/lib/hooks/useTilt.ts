"use client";

import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, type RefObject } from "react";

export interface TiltController {
  ref: RefObject<HTMLDivElement>;
  /** rotateX in degrees — feed into a style prop. */
  rotateX: MotionValue<number>;
  /** rotateY in degrees. */
  rotateY: MotionValue<number>;
  /** Normalised cursor X in [0,1] (raw, for gradient highlight positioning). */
  pointerX: MotionValue<number>;
  /** Normalised cursor Y in [0,1]. */
  pointerY: MotionValue<number>;
  /** True while the pointer is over the element. */
  hoveredRef: RefObject<boolean>;
}

/**
 * Installs 3D-tilt behaviour on a div:
 *
 *   const tilt = useTilt({ maxDeg: 8 });
 *   <motion.div ref={tilt.ref} style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }} />
 *
 * The tilt tracks the pointer with a soft spring so the card feels "weighted"
 * and smoothly eases back to rest when the pointer leaves.
 */
export function useTilt({
  maxDeg = 8,
  stiffness = 180,
  damping = 22,
}: {
  maxDeg?: number;
  stiffness?: number;
  damping?: number;
} = {}): TiltController {
  const ref = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  // Normalised cursor position over the element, 0..1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const springX = useSpring(px, { stiffness, damping, mass: 0.35 });
  const springY = useSpring(py, { stiffness, damping, mass: 0.35 });

  // y → rotateX, x → rotateY (standard tilt mapping; positive Y rotation
  // means the right edge tilts toward viewer).
  const rotateX = useTransform(springY, [0, 1], [maxDeg, -maxDeg]);
  const rotateY = useTransform(springX, [0, 1], [-maxDeg, maxDeg]);

  const setFromEvent = useCallback(
    (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      px.set(Math.min(1, Math.max(0, nx)));
      py.set(Math.min(1, Math.max(0, ny)));
    },
    [px, py]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () => {
      hoveredRef.current = true;
    };
    const onLeave = () => {
      hoveredRef.current = false;
      px.set(0.5);
      py.set(0.5);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointermove", setFromEvent);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", setFromEvent);
    };
  }, [setFromEvent, px, py]);

  return { ref, rotateX, rotateY, pointerX: px, pointerY: py, hoveredRef };
}
