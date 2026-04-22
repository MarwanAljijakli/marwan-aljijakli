"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ==========================================================================
 * MathParticles
 * --------------------------------------------------------------------------
 * 80 THREE.Sprites carrying canvas-drawn mathematical symbols, drifting up
 * through the scene. Each texture is drawn once and shared across particles
 * that display the same glyph; each particle owns its own SpriteMaterial
 * (cheap) so rotations don't bleed between them.
 * ========================================================================== */

const SYMBOLS = [
  "∇", "Σ", "∫", "θ", "λ", "∂",
  "π", "ε", "σ", "μ", "β", "α",
  "Δ", "∞", "⊗", "ℝ",
] as const;

const PARTICLE_COUNT = 80;
const BOUNDS_X = 9;
const BOUNDS_Y = 5.5;
const BOUNDS_Z = 5;
const DRIFT_MIN = 0.12;
const DRIFT_MAX = 0.32;

/** Draw a glyph into an offscreen canvas and return a THREE.CanvasTexture. */
function makeSymbolTexture(symbol: string): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Will never happen in a real browser; satisfy TS.
    return new THREE.Texture();
  }

  ctx.clearRect(0, 0, size, size);

  // Soft violet glow halo
  ctx.shadowColor = "rgba(123, 47, 190, 0.9)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#7B2FBE";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font =
    'bold 92px "JetBrains Mono", "Space Mono", "Cambria Math", "STIX Two Math", Georgia, serif';
  ctx.fillText(symbol, size / 2, size / 2 + 4);

  // Subtle highlight pass (no shadow) to firm up the glyph
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(200, 140, 240, 0.5)";
  ctx.fillText(symbol, size / 2, size / 2 + 4);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  return tex;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  scale: number;
  seed: number;
  symbolIdx: number;
  material: THREE.SpriteMaterial;
}

export default function MathParticles() {
  // 16 shared textures (one per symbol).
  const textures = useMemo(() => SYMBOLS.map(makeSymbolTexture), []);

  // 80 particle records — each with its own (cheap) SpriteMaterial using a
  // shared texture.
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const symbolIdx = i % SYMBOLS.length;
      const material = new THREE.SpriteMaterial({
        map: textures[symbolIdx],
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        toneMapped: false,
      });
      return {
        symbolIdx,
        x: (Math.random() - 0.5) * 2 * BOUNDS_X,
        y: (Math.random() - 0.5) * 2 * BOUNDS_Y,
        z: (Math.random() - 0.5) * 2 * BOUNDS_Z,
        vy: DRIFT_MIN + Math.random() * (DRIFT_MAX - DRIFT_MIN),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.35,
        scale: 0.45 + Math.random() * 0.55,
        seed: Math.random() * 100,
        material,
      };
    });
  }, [textures]);

  const spritesRef = useRef<(THREE.Sprite | null)[]>([]);

  // Dispose GPU resources on unmount.
  useEffect(() => {
    return () => {
      particles.forEach((p) => p.material.dispose());
      textures.forEach((t) => t.dispose());
    };
  }, [particles, textures]);

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    const frameClampedDt = Math.min(dt, 0.05);

    for (let i = 0; i < particles.length; i++) {
      const sprite = spritesRef.current[i];
      if (!sprite) continue;
      const p = particles[i];

      p.y += p.vy * frameClampedDt;
      if (p.y > BOUNDS_Y) {
        p.y = -BOUNDS_Y;
        p.x = (Math.random() - 0.5) * 2 * BOUNDS_X;
        p.z = (Math.random() - 0.5) * 2 * BOUNDS_Z;
      }

      p.rotation += p.rotSpeed * frameClampedDt;

      // Lateral sway so they don't look like they're on rails.
      const swayX = Math.sin(t * 0.35 + p.seed) * 0.18;
      const swayZ = Math.cos(t * 0.28 + p.seed * 1.7) * 0.15;

      sprite.position.set(p.x + swayX, p.y, p.z + swayZ);
      p.material.rotation = p.rotation;

      // Depth-based fade to help layering with the neural network.
      const depth = Math.abs(p.z) / BOUNDS_Z;
      p.material.opacity = 0.62 * (1 - depth * 0.35);
      sprite.scale.setScalar(p.scale);
    }
  });

  return (
    <group>
      {particles.map((p, i) => (
        <sprite
          key={i}
          ref={(el) => {
            spritesRef.current[i] = el;
          }}
          position={[p.x, p.y, p.z]}
          scale={p.scale}
          material={p.material}
        />
      ))}
    </group>
  );
}
