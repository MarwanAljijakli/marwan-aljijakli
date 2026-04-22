"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ==========================================================================
 * AnimatedCursor
 * --------------------------------------------------------------------------
 *   • Inner dot  : 8px solid cyan · instant follow (raw motion values)
 *   • Outer ring : 40px 2px cyan border · spring(stiffness: 300, damping: 28)
 *
 * Variants (applied automatically or via `data-cursor`):
 *   default → dot + 40px ring
 *   hover   → ring expands to 60px, fills with rgba(0,212,255,0.1)
 *             (auto for <a>, <button>, [role="button"])
 *   three   → cursor hides, custom crosshair SVG is shown
 *             (auto for [data-cursor="three"] / [data-three-canvas])
 *   text    → ring morphs into a thin horizontal line (i-beam aesthetic)
 *             (auto for <p>, <input>, <textarea>, [data-cursor="text"])
 *   card    → ring becomes a "drag" indicator with ← → arrows
 *             (auto for [data-cursor="card"])
 *
 * Applied globally via layout.tsx → AppShell.
 * ========================================================================== */

export type CursorState = "default" | "hover" | "three" | "text" | "card";

export default function AnimatedCursor() {
  // Raw pointer position — dot follows this directly.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring uses springs → produces the satisfying trailing lag.
  const ringX = useSpring(mouseX, { stiffness: 300, damping: 28, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 28, mass: 0.5 });

  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const rafRef = useRef<number | null>(null);

  /* --- Pointer tracking --------------------------------------------------- */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (!visible) setVisible(true);
      });
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY, visible]);

  /* --- Variant detection -------------------------------------------------- */
  useEffect(() => {
    const resolveState = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return "default";

      // Walk up until we find something meaningful.
      const node = target.closest<HTMLElement>(
        '[data-cursor], [data-three-canvas], a, button, [role="button"], input, textarea, select, p'
      );
      if (!node) return "default";

      const explicit = node.getAttribute("data-cursor");
      if (explicit === "hover" || explicit === "link" || explicit === "button")
        return "hover";
      if (explicit === "three") return "three";
      if (explicit === "text") return "text";
      if (explicit === "card" || explicit === "drag") return "card";
      if (explicit === "default") return "default";

      if (node.matches("[data-three-canvas]")) return "three";
      if (node.matches("a, button, [role='button']")) return "hover";
      if (node.matches("input, textarea, select")) return "text";
      if (node.matches("p")) return "text";

      return "default";
    };

    const onOver = (e: MouseEvent) => setState(resolveState(e.target));
    const onOut = () => setState("default");

    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  /* --- Variant visuals ---------------------------------------------------- */
  const ringStyles = {
    default: {
      width: 40,
      height: 40,
      borderWidth: 2,
      borderRadius: 999,
      backgroundColor: "rgba(0, 212, 255, 0)",
      opacity: 1,
    },
    hover: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderRadius: 999,
      backgroundColor: "rgba(0, 212, 255, 0.1)",
      opacity: 1,
    },
    text: {
      width: 28,
      height: 2,
      borderWidth: 0,
      borderRadius: 2,
      backgroundColor: "rgba(0, 212, 255, 1)",
      opacity: 1,
    },
    three: {
      width: 40,
      height: 40,
      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: "rgba(0, 212, 255, 0)",
      opacity: 0,
    },
    card: {
      width: 96,
      height: 42,
      borderWidth: 2,
      borderRadius: 999,
      backgroundColor: "rgba(0, 212, 255, 0.08)",
      opacity: 1,
    },
  } as const;

  const dotStyles = {
    default: { width: 8, height: 8, opacity: 1, scale: 1 },
    hover: { width: 8, height: 8, opacity: 0.4, scale: 0.75 },
    text: { width: 0, height: 0, opacity: 0, scale: 1 },
    three: { width: 0, height: 0, opacity: 0, scale: 1 },
    card: { width: 0, height: 0, opacity: 0, scale: 1 },
  } as const;

  const showCrosshair = state === "three";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "difference" }}
    >
      {/* --------------------------------------------------------------- */}
      {/* Outer ring (spring-follow)                                      */}
      {/* --------------------------------------------------------------- */}
      <motion.div
        className="absolute top-0 left-0 border-[color:var(--accent-primary)]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderStyle: "solid",
          willChange: "transform, width, height, border-radius",
        }}
        animate={{
          ...ringStyles[state],
          scale: pressed ? 0.88 : 1,
          opacity: !visible ? 0 : ringStyles[state].opacity,
        }}
        transition={{
          width: { type: "spring", stiffness: 320, damping: 26 },
          height: { type: "spring", stiffness: 320, damping: 26 },
          borderRadius: { type: "spring", stiffness: 320, damping: 26 },
          backgroundColor: { duration: 0.2 },
          borderWidth: { duration: 0.2 },
          scale: { type: "spring", stiffness: 400, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        {/* Card-variant drag arrows */}
        <AnimatePresence>
          {state === "card" && (
            <motion.div
              key="drag-arrows"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-between px-3 text-[color:var(--accent-primary)]"
            >
              <ArrowGlyph direction="left" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Drag
              </span>
              <ArrowGlyph direction="right" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --------------------------------------------------------------- */}
      {/* Inner dot (instant follow)                                      */}
      {/* --------------------------------------------------------------- */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-[color:var(--accent-primary)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform, width, height, opacity",
        }}
        animate={{
          ...dotStyles[state],
          opacity: !visible ? 0 : dotStyles[state].opacity,
        }}
        transition={{
          width: { type: "spring", stiffness: 500, damping: 30 },
          height: { type: "spring", stiffness: 500, damping: 30 },
          opacity: { duration: 0.15 },
          scale: { type: "spring", stiffness: 500, damping: 30 },
        }}
      />

      {/* --------------------------------------------------------------- */}
      {/* 3D crosshair (replaces dot+ring when over 3D canvases)          */}
      {/* --------------------------------------------------------------- */}
      <AnimatePresence>
        {showCrosshair && (
          <motion.div
            key="crosshair"
            className="absolute top-0 left-0"
            style={{
              x: ringX,
              y: ringY,
              translateX: "-50%",
              translateY: "-50%",
              mixBlendMode: "normal",
            }}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Crosshair />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
 * Decorative glyphs
 * ========================================================================== */

function ArrowGlyph({ direction }: { direction: "left" | "right" }) {
  const d =
    direction === "left"
      ? "M9 1 L1 6 L9 11"
      : "M3 1 L11 6 L3 11";
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Crosshair() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "var(--accent-primary)" }}
    >
      {/* Corner brackets */}
      <path d="M4 14 V4 H14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M42 4 H52 V14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M52 42 V52 H42" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 52 H4 V42" stroke="currentColor" strokeWidth="1.5" />
      {/* Crosshair lines */}
      <line x1="28" y1="18" x2="28" y2="26" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="30" x2="28" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1.5" />
      {/* Center dot */}
      <circle cx="28" cy="28" r="1.5" fill="currentColor" />
    </svg>
  );
}
