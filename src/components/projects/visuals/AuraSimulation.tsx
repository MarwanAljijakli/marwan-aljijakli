"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";

export interface AuraSimulationProps {
  speedRef: RefObject<number>;
}

/**
 * Thin wrapper that defers the heavy R3F scene (Canvas + meshes + materials +
 * PPE canvas textures) into its own lazy chunk. The scene file never enters
 * the route's initial JS bundle.
 */
const AuraSimulation = dynamic<AuraSimulationProps>(
  () => import("./AuraSimulationScene"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default AuraSimulation;
