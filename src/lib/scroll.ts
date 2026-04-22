import type Lenis from "lenis";

/**
 * Smooth-scroll helpers that prefer the global Lenis instance (exposed as
 * `window.__lenis` from SmoothScroll.tsx) and fall back to the native API.
 */

type WithLenis = Window & typeof globalThis & { __lenis?: Lenis };

export function getLenis(): Lenis | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as WithLenis).__lenis;
}

export function scrollToTop(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Smooth-scrolls to the element with the given id, accounting for fixed
 * nav height via the `offset` parameter (negative = push below the
 * viewport top).
 */
export function scrollToId(id: string, offset = -72): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.1, offset });
    return;
  }
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
