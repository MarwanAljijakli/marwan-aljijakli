"use client";

import dynamic from "next/dynamic";
import GridBackground from "@/components/backgrounds/GridBackground";
import MathBackground from "@/components/backgrounds/MathBackground";
import { useLazySection } from "@/lib/hooks/useLazySection";
import HeroContent from "./HeroContent";

/**
 * The WebGL scene touches the DOM during construction (CanvasTextures,
 * WebGLRenderer) so it must never be rendered on the server. `dynamic` with
 * `ssr: false` also lets Next split it into its own chunk so the initial HTML
 * response stays lean.
 */
const HeroScene = dynamic(() => import("./scene/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * The full-viewport hero. Mounts as the first section of the page and stacks:
 *   1. A WebGL canvas (neural network + math particles + grid floor)
 *   2. A subtle vignette + gradient overlay for text legibility
 *   3. The absolute-positioned foreground (reveal animations + typewriter)
 *
 * The hero is above the fold, so we mount the Canvas immediately — but we
 * still flip `frameloop` to "never" once the user has scrolled away, so the
 * GPU isn't burning watts rendering a scene nobody's looking at.
 */
export default function Hero() {
  const { ref, isVisible } = useLazySection<HTMLElement>({
    rootMargin: "0px",
    threshold: 0.01,
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Marwan Aljijakli — CTO & AI/ML Engineer"
      className="relative isolate h-[100svh] min-h-[680px] w-full overflow-hidden bg-[color:var(--bg-primary)]"
    >
      {/* --- Layer 0a: perspective grid floor ------------------------ */}
      <GridBackground perspective opacity={0.05} mask="radial" />

      {/* --- Layer 0b: drifting math glyphs -------------------------- */}
      <MathBackground opacity={0.75} density={80} className="z-0" />

      {/* --- Layer 1: WebGL canvas ---------------------------------- */}
      <div
        data-three-canvas
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
      >
        <HeroScene visible={isVisible} />
      </div>

      {/* --- Layer 2: Readability overlay ---
         A darker gradient hugging the left side so the text always stays
         punchy, plus a vignette to focus attention. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[10]"
        style={{
          background: `
            linear-gradient(90deg, rgba(5,10,15,0.88) 0%, rgba(5,10,15,0.5) 38%, rgba(5,10,15,0) 62%, rgba(5,10,15,0) 100%),
            radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,10,15,0.55) 95%)
          `,
        }}
      />

      {/* --- Layer 3: Subtle top/bottom fades for edge integration --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,15,0.9) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,10,15,0.95) 0%, transparent 100%)",
        }}
      />

      {/* --- Layer 4: Foreground content --- */}
      <HeroContent />
    </section>
  );
}
