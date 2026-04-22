"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { useAdaptiveQuality } from "@/lib/hooks/useAdaptiveQuality";

import NeuralNetwork from "./NeuralNetwork";
import MathParticles from "./MathParticles";
import GridFloor from "./GridFloor";
import CameraRig from "./CameraRig";

/**
 * The full-screen WebGL scene that sits behind the hero text.
 *
 * Three layers:
 *   1. Neural-network mesh (instanced nodes + dynamic edges + BFS pulses)
 *   2. Floating math symbol sprites
 *   3. Animated grid floor with a scanning sweep
 *
 * CameraRig wires up the slow orbit + mouse tilt.
 *
 * `visible` is forwarded from the wrapper so we can drop the Canvas's
 * frameloop to "never" once the hero scrolls off-screen — killing GPU cost
 * for the rest of the session.
 */
interface HeroSceneProps {
  visible?: boolean;
}

export default function HeroScene({ visible = true }: HeroSceneProps) {
  const { config } = useAdaptiveQuality();

  return (
    <Canvas
      dpr={[1, config.pixelRatio]}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: config.antialias,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 60 }}
    >
      {/* Leave the canvas transparent so DOM layers (grid floor, math glyphs)
          show through behind the neural network. Fog still attenuates distant
          meshes against the section background colour. */}
      <fog attach="fog" args={["#050a0f", 8, 22]} />

      <CameraRig />

      <Suspense fallback={null}>
        <NeuralNetwork />
        <MathParticles />
        <GridFloor />
      </Suspense>
    </Canvas>
  );
}
