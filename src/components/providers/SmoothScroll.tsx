"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth-scroll, wired up with GSAP's ScrollTrigger so scroll-driven
 * animations and Lenis stay in sync.
 *
 * Rendered once inside the root layout — it listens globally and augments
 * native scrolling. Components and hooks are free to use window.scroll*
 * listeners as usual.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user preferences.
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    // Expose for debugging / section-specific control.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      // Lenis expects milliseconds; gsap.ticker passes seconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
