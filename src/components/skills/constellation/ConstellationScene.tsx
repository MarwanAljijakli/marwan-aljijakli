"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  STARS,
  buildEdges,
  positionFor,
  CATEGORIES,
  type Star,
} from "./starData";

/* ==========================================================================
 * ConstellationScene
 * --------------------------------------------------------------------------
 * The R3F scene for SkillConstellation. Renders:
 *   - A Group that slowly rotates on Y
 *   - All connecting edges (LineSegments with per-vertex color)
 *   - A sphere + sprite halo per star, labelled with a canvas-drawn sprite
 *   - Pulse on the hovered star
 *
 * Hover events are piped out via `onHoverChange` so the wrapper can render
 * an HTML tooltip positioned at the pointer.
 * ========================================================================== */

interface Props {
  hoveredName: string | null;
  onHoverChange: (star: Star | null) => void;
}

export default function ConstellationScene({
  hoveredName,
  onHoverChange,
}: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.8, 13], fov: 55, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Constellation hoveredName={hoveredName} onHoverChange={onHoverChange} />
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */

function Constellation({ hoveredName, onHoverChange }: Props) {
  const rootRef = useRef<THREE.Group>(null);

  /* ---- Shared textures: a soft white halo + one label per star --------- */
  const haloTexture = useMemo(() => makeHaloTexture(), []);
  const labelTextures = useMemo(() => {
    const map = new Map<string, THREE.Texture>();
    for (const s of STARS) {
      map.set(s.name, makeLabelTexture(s.name, CATEGORIES[s.category].color));
    }
    return map;
  }, []);

  useEffect(() => {
    return () => {
      haloTexture.dispose();
      for (const tex of labelTextures.values()) tex.dispose();
    };
  }, [haloTexture, labelTextures]);

  /* ---- Static edge geometry (positions never change within the group) -- */
  const edges = useMemo(() => buildEdges(STARS), []);

  const { edgeGeometry } = useMemo(() => {
    const positions = new Float32Array(edges.length * 2 * 3);
    const colors = new Float32Array(edges.length * 2 * 3);
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const pa = positionFor(e.a);
      const pb = positionFor(e.b);
      const o = i * 6;
      positions[o + 0] = pa[0];
      positions[o + 1] = pa[1];
      positions[o + 2] = pa[2];
      positions[o + 3] = pb[0];
      positions[o + 4] = pb[1];
      positions[o + 5] = pb[2];

      const c = new THREE.Color(e.color);
      const alpha = e.strong ? 1 : 0.25;
      for (let k = 0; k < 2; k++) {
        const co = o + k * 3;
        colors[co + 0] = c.r * alpha;
        colors[co + 1] = c.g * alpha;
        colors[co + 2] = c.b * alpha;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { edgeGeometry: g };
  }, [edges]);

  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  /* ---- Rotate the whole constellation on Y ----------------------------- */
  useFrame((_, dt) => {
    const g = rootRef.current;
    if (!g) return;
    g.rotation.y += dt * 0.12; // ~7°/sec
    // Breathing lift on hover so interaction feels alive.
    const lift = hoveredName ? 0.35 : 0.25;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, lift, 2.5, dt);
  });

  return (
    <group ref={rootRef}>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#BFF7FF" />

      {/* Edges */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* Stars */}
      {STARS.map((star) => (
        <StarNode
          key={star.name}
          star={star}
          haloTexture={haloTexture}
          labelTexture={labelTextures.get(star.name) ?? null}
          isHovered={hoveredName === star.name}
          onHoverChange={onHoverChange}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */

function StarNode({
  star,
  haloTexture,
  labelTexture,
  isHovered,
  onHoverChange,
}: {
  star: Star;
  haloTexture: THREE.Texture;
  labelTexture: THREE.Texture | null;
  isHovered: boolean;
  onHoverChange: (s: Star | null) => void;
}) {
  const [x, y, z] = positionFor(star);
  const color = CATEGORIES[star.category].color;

  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);

  // Pulse scaling driven directly in useFrame (keeps hover snappy).
  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    const core = coreRef.current;
    const halo = haloRef.current;
    if (!core || !halo) return;

    const pulse =
      1 +
      Math.sin(t * 2 + star.angle * 3) * 0.08 +
      (isHovered ? 0.4 + Math.sin(t * 8) * 0.08 : 0);
    const target = pulse;
    core.scale.setScalar(THREE.MathUtils.damp(core.scale.x, target, 10, dt));

    const haloScale = star.size * 8 * (isHovered ? 1.35 : 1);
    halo.scale.setScalar(
      THREE.MathUtils.damp(halo.scale.x, haloScale, 6, dt)
    );
  });

  return (
    <group
      position={[x, y, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverChange(star);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHoverChange(null);
      }}
    >
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[star.size, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Halo sprite */}
      <sprite ref={haloRef} scale={star.size * 8}>
        <spriteMaterial
          attach="material"
          map={haloTexture}
          color={color}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          opacity={star.ring === 0 ? 0.9 : 0.55}
        />
      </sprite>

      {/* Label — always visible for core + ring 1, slightly faded for inner rings */}
      {labelTexture && (
        <sprite
          position={[0, star.size + 0.35, 0]}
          scale={[1.2, 0.3, 1]}
          center-x={0.5}
        >
          <spriteMaterial
            attach="material"
            map={labelTexture}
            transparent
            depthWrite={false}
            toneMapped={false}
            opacity={star.ring <= 1 ? 0.95 : isHovered ? 1 : 0.6}
          />
        </sprite>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Procedural textures                                                       */
/* -------------------------------------------------------------------------- */

function makeHaloTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(c);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.6)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.15)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function makeLabelTexture(name: string, color: string): THREE.CanvasTexture {
  const w = 256;
  const h = 64;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(c);

  ctx.clearRect(0, 0, w, h);

  // Slight shadow halo so the label stays readable over the stars.
  ctx.shadowColor = "rgba(5,10,15,0.8)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = 'bold 22px "Space Mono", ui-monospace, monospace';
  ctx.fillText(name.toUpperCase(), w / 2, h / 2);

  // Small under-score in the category color.
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.fillRect(w / 2 - 20, h / 2 + 18, 40, 2);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  return tex;
}
