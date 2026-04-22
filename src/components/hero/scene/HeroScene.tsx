"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

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
 */
export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="always"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
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
