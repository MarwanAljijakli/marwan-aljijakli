"use client";

/* ==========================================================================
 * GridBackground
 * --------------------------------------------------------------------------
 * CSS-only (no canvas, no JS loops). Renders a 40×40 px grid mesh using
 * two crossed linear-gradients, then fades the grid out at the section
 * edges with a soft radial mask.
 *
 * Opt into a perspective tilt for "floor-of-hangar" aesthetics — the grid
 * recedes into the horizon.
 * ========================================================================== */

interface GridBackgroundProps {
  /** Opacity of the grid lines themselves (0–1). Default 0.06. */
  opacity?: number;
  /** Grid line colour in RGB (hex not supported — we need rgba at runtime). */
  rgb?: string;
  /** Grid cell size in pixels. Default 40. */
  cellSize?: number;
  /** Add a `perspective(800px) rotateX(…)` tilt. Feels best for large
   *  full-bleed backgrounds (Hero). */
  perspective?: boolean;
  /** Extra Tailwind/utility classes forwarded to the root element. */
  className?: string;
  /** Mask style at the edges. "radial" fades out circularly, "bottom"
   *  fades only at the bottom, "none" leaves the grid hard-edged. */
  mask?: "radial" | "bottom" | "vertical" | "none";
}

const DEFAULT_RGB = "0, 212, 255";

export default function GridBackground({
  opacity = 0.06,
  rgb = DEFAULT_RGB,
  cellSize = 40,
  perspective = false,
  mask = "radial",
  className = "",
}: GridBackgroundProps) {
  const lineColor = `rgba(${rgb}, ${opacity})`;
  const strongLineColor = `rgba(${rgb}, ${opacity * 2})`;

  // Overlay every 5th line at double strength — gives depth without
  // doubling the draw cost (it's still just two linear-gradients).
  const backgroundImage = [
    `linear-gradient(${lineColor} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
    `linear-gradient(${strongLineColor} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${strongLineColor} 1px, transparent 1px)`,
  ].join(", ");

  const backgroundSize = [
    `${cellSize}px ${cellSize}px`,
    `${cellSize}px ${cellSize}px`,
    `${cellSize * 5}px ${cellSize * 5}px`,
    `${cellSize * 5}px ${cellSize * 5}px`,
  ].join(", ");

  const maskImage =
    mask === "radial"
      ? "radial-gradient(ellipse at center, black 35%, transparent 90%)"
      : mask === "bottom"
        ? "linear-gradient(180deg, black 65%, transparent 100%)"
        : mask === "vertical"
          ? "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)"
          : undefined;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        perspective: perspective ? "800px" : undefined,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage,
          backgroundSize,
          transform: perspective
            ? "rotateX(55deg) translateY(10%) scale(1.5)"
            : undefined,
          transformOrigin: perspective ? "center bottom" : undefined,
          // Mask the grid so it feathers into the surrounding section.
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      />
    </div>
  );
}
