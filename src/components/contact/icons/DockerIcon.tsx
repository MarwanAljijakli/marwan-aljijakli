import type { SVGProps } from "react";

/**
 * Custom Docker glyph — Lucide doesn't ship one. Stylised to match the
 * stacked-containers + whale silhouette, simplified into strokes that play
 * well at small sizes.
 */
export default function DockerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Container cells — 2×3 grid of stacked blocks */}
      <rect x="3" y="9" width="2.5" height="2.5" rx="0.3" />
      <rect x="6" y="9" width="2.5" height="2.5" rx="0.3" />
      <rect x="9" y="9" width="2.5" height="2.5" rx="0.3" />
      <rect x="12" y="9" width="2.5" height="2.5" rx="0.3" />
      <rect x="6" y="6" width="2.5" height="2.5" rx="0.3" />
      <rect x="9" y="6" width="2.5" height="2.5" rx="0.3" />
      <rect x="12" y="6" width="2.5" height="2.5" rx="0.3" />
      <rect x="9" y="3" width="2.5" height="2.5" rx="0.3" />

      {/* Whale body + tail above the containers */}
      <path d="M2 13h16c.8 0 2.5-.4 3.5-2-1 .3-2 .1-2.5-.4-.3 1.4-1.6 2.4-3 2.4" />
      <path d="M17.8 10.6c.8-1.2.2-2.5-.6-2.9-.4.8-.3 1.7.3 2.4" />
    </svg>
  );
}
