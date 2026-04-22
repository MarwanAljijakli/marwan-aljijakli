"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ==========================================================================
 * GridFloor
 * --------------------------------------------------------------------------
 * A large plane placed at y = -3, rotated flat. Custom ShaderMaterial paints
 * a cyan grid with:
 *   • two grid resolutions (fine + coarse) for depth
 *   • `fwidth`-driven anti-aliasing so lines stay crisp at grazing angles
 *   • a radial fade toward the horizon (matches the fog)
 *   • a scanning band that sweeps forward every ~4 seconds
 * ========================================================================== */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform vec3  uLineColor;
  uniform vec3  uSweepColor;

  /**
   * Anti-aliased grid — returns 1 on line pixels and 0 elsewhere, with smooth
   * transitions driven by screen-space derivatives (fwidth).
   */
  float aaGrid(vec2 uv, float cell, float lineWidth) {
    vec2 coord = uv / cell;
    vec2 deriv = fwidth(coord) * lineWidth;
    vec2 gridUV = abs(fract(coord - 0.5) - 0.5) / deriv;
    float line = min(gridUV.x, gridUV.y);
    return 1.0 - min(line, 1.0);
  }

  void main() {
    // Two scales stacked — fine gridlines + stronger coarse divisions.
    float fine   = aaGrid(vUv, 0.025, 1.0);
    float coarse = aaGrid(vUv, 0.125, 1.4);

    float grid = max(fine * 0.35, coarse * 0.9);

    // Radial fade from center out toward the horizon.
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;
    float fade = 1.0 - smoothstep(0.15, 1.0, dist);

    // Scan sweep — a thin Gaussian band that travels in +Z (local UV.y)
    // every 4 seconds.
    float sweepPos = fract(uTime / 4.0);
    float bandDist = abs(vUv.y - sweepPos);
    float sweep = exp(-pow(bandDist * 14.0, 2.0));

    // Mix grid body with sweep pulse.
    vec3 color = uLineColor * grid;
    color += uSweepColor * sweep * 0.9;

    float alpha = grid * fade * 0.55 + sweep * fade * 0.6;
    if (alpha < 0.001) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function GridFloor() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLineColor: { value: new THREE.Color(0x00d4ff) },
      uSweepColor: { value: new THREE.Color(0xbff7ff) },
    }),
    []
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh
      position={[0, -3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      frustumCulled={false}
    >
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
