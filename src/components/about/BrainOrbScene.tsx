"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAdaptiveQuality } from "@/lib/hooks/useAdaptiveQuality";

/* ==========================================================================
 * BrainOrbScene
 * --------------------------------------------------------------------------
 * Self-contained 3D scene for the About section:
 *   • Wireframe geodesic sphere (the "skull")
 *   • 150 surface nodes distributed via Fibonacci lattice
 *   • K-nearest neighbour connection graph (static, precomputed once)
 *   • Every 2 seconds, a new "thought" pulse spawns at a random node and
 *     expands as a spherical wavefront (ring of light) across the surface
 *   • Breathing — scale oscillates 0.95 ↔ 1.05 over 3 s
 *   • Hover — rotation speed ramps from 0.3 → 1.2 rad/s (damped)
 *   • Mouse  — sphere tilts toward the cursor (Canvas-local pointer, ±20°)
 * ========================================================================== */

const NODE_COUNT = 150;
const RADIUS = 2;
const KNN = 3;

const PULSE_INTERVAL_S = 2;
const PULSE_DURATION_S = 1.8;
const PULSE_WIDTH = 0.18; // radians — width of the geodesic band

const COLOR_NODE_REST = new THREE.Color("#1a3a5c");
const COLOR_NODE_ACTIVE = new THREE.Color("#bff7ff");
const COLOR_EDGE_REST = new THREE.Color(0.06, 0.38, 0.55);
const COLOR_EDGE_ACTIVE = new THREE.Color("#BFF7FF");

interface SceneProps {
  hoveredRef: React.MutableRefObject<boolean>;
  visible?: boolean;
}

export default function BrainOrbScene({
  hoveredRef,
  visible = true,
}: SceneProps) {
  const { config } = useAdaptiveQuality();

  return (
    <Canvas
      dpr={[1, config.pixelRatio]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 5.8], fov: 45, near: 0.1, far: 30 }}
      gl={{
        alpha: true,
        antialias: config.antialias,
        powerPreference: "high-performance",
        stencil: false,
      }}
    >
      <BrainNetwork hoveredRef={hoveredRef} />
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */

function BrainNetwork({ hoveredRef }: SceneProps) {
  const tiltRef = useRef<THREE.Group>(null); // mouse tilt + breathing
  const spinRef = useRef<THREE.Group>(null); // continuous Y rotation

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const rotSpeedRef = useRef(0.3);

  /* ---- Fibonacci sphere surface positions (unit then scaled to RADIUS) --- */
  const nodePositions = useMemo(() => {
    const out: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      out.push(
        new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r
        ).multiplyScalar(RADIUS)
      );
    }
    return out;
  }, []);

  /* ---- Undirected k-nearest-neighbour graph (deduped) -------------------- */
  const edges = useMemo(() => {
    const edgeSet = new Set<number>();
    const list: [number, number][] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < NODE_COUNT; j++) {
        if (i === j) continue;
        dists.push({
          j,
          d: nodePositions[i].distanceToSquared(nodePositions[j]),
        });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < KNN; k++) {
        const j = dists[k].j;
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        const key = a * NODE_COUNT + b;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          list.push([a, b]);
        }
      }
    }
    return list;
  }, [nodePositions]);

  /* ---- Static edge geometry (positions never change — the lattice is     */
  /*      rigid on the sphere). Vertex colours are rewritten each frame.   */
  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 2 * 3);
    const colors = new Float32Array(edges.length * 2 * 3);
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      const pa = nodePositions[a];
      const pb = nodePositions[b];
      const o = e * 6;
      positions[o + 0] = pa.x;
      positions[o + 1] = pa.y;
      positions[o + 2] = pa.z;
      positions[o + 3] = pb.x;
      positions[o + 4] = pb.y;
      positions[o + 5] = pb.z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [edges, nodePositions]);

  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
    };
  }, [edgeGeometry]);

  /* ---- Per-frame working buffers ---------------------------------------- */
  const nodeEnergy = useMemo(() => new Float32Array(NODE_COUNT), []);
  const pulsesRef = useRef<{ startS: number; originIdx: number }[]>([]);
  const lastPulseAtRef = useRef(0);

  const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);

  /* ---- One-time: initialise per-instance colour attribute --------------- */
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < NODE_COUNT; i++) mesh.setColorAt(i, COLOR_NODE_REST);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  /* ---- Seed one pulse on mount so the orb doesn't look static for 2s ---- */
  useEffect(() => {
    pulsesRef.current.push({
      startS: 0.2,
      originIdx: Math.floor(Math.random() * NODE_COUNT),
    });
  }, []);

  /* ---- Frame loop ------------------------------------------------------- */
  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    const spin = spinRef.current;
    const tilt = tiltRef.current;

    if (!spin || !tilt) return;

    /* --- Rotation speed ramps up on hover, eases back when idle --------- */
    const targetSpeed = hoveredRef.current ? 1.2 : 0.3;
    rotSpeedRef.current = THREE.MathUtils.damp(
      rotSpeedRef.current,
      targetSpeed,
      4,
      dt
    );
    spin.rotation.y += rotSpeedRef.current * dt;

    /* --- Mouse tilt (canvas-local pointer, ±~20°) ----------------------- */
    const targetTiltX = -state.pointer.y * 0.35;
    const targetTiltZ = state.pointer.x * 0.25;
    tilt.rotation.x = THREE.MathUtils.damp(
      tilt.rotation.x,
      targetTiltX,
      3.5,
      dt
    );
    tilt.rotation.z = THREE.MathUtils.damp(
      tilt.rotation.z,
      targetTiltZ,
      3.5,
      dt
    );

    /* --- Breathing scale ------------------------------------------------- */
    const breathe = 1 + Math.sin(t * ((Math.PI * 2) / 3)) * 0.05;
    tilt.scale.setScalar(breathe);

    /* --- Pulse scheduling ------------------------------------------------ */
    if (t - lastPulseAtRef.current > PULSE_INTERVAL_S) {
      lastPulseAtRef.current = t;
      pulsesRef.current.push({
        startS: t,
        originIdx: Math.floor(Math.random() * NODE_COUNT),
      });
    }

    // Retire expired pulses
    pulsesRef.current = pulsesRef.current.filter(
      (p) => t - p.startS < PULSE_DURATION_S + 0.4
    );

    /* --- Per-node activation from geodesic wavefront -------------------- */
    nodeEnergy.fill(0);
    for (let p = 0; p < pulsesRef.current.length; p++) {
      const pulse = pulsesRef.current[p];
      const elapsed = t - pulse.startS;
      if (elapsed < 0) continue;

      // Wavefront geodesic radius — 0 → π over PULSE_DURATION_S.
      const wavefront = (elapsed / PULSE_DURATION_S) * Math.PI;

      // Decay the whole pulse intensity toward the end so we fade out.
      const life = 1 - Math.min(1, elapsed / PULSE_DURATION_S);
      const pulseAmp = Math.pow(life, 1.8);

      const origin = nodePositions[pulse.originIdx];
      const invR2 = 1 / (RADIUS * RADIUS);

      for (let i = 0; i < NODE_COUNT; i++) {
        const pi = nodePositions[i];
        // dot product of unit vectors = cos(angle).
        const cosA = (origin.x * pi.x + origin.y * pi.y + origin.z * pi.z) * invR2;
        const angle = Math.acos(Math.max(-1, Math.min(1, cosA)));
        const dist = Math.abs(angle - wavefront);
        const e = Math.exp(-((dist / PULSE_WIDTH) ** 2) * 2) * pulseAmp;
        if (e > nodeEnergy[i]) nodeEnergy[i] = e;
      }
    }

    /* --- Update instanced node transforms + colours --------------------- */
    const mesh = meshRef.current;
    if (mesh) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const e = nodeEnergy[i];
        const s = 1 + e * 2.2; // pop out on activation
        tmpScale.set(s, s, s);
        tmpVec.copy(nodePositions[i]);
        tmpMatrix.compose(tmpVec, tmpQuat, tmpScale);
        mesh.setMatrixAt(i, tmpMatrix);

        tmpColor.copy(COLOR_NODE_REST).lerp(COLOR_NODE_ACTIVE, e);
        mesh.setColorAt(i, tmpColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    /* --- Update edge colours (positions are static) --------------------- */
    const lines = linesRef.current;
    if (lines) {
      const colorAttr = edgeGeometry.getAttribute("color") as THREE.BufferAttribute;
      const arr = colorAttr.array as Float32Array;
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        const edgeE = Math.min(1, (nodeEnergy[a] + nodeEnergy[b]) * 0.5 * 1.4);
        tmpColor.copy(COLOR_EDGE_REST).lerp(COLOR_EDGE_ACTIVE, edgeE);
        const a8 = 0.5 + edgeE * 0.5;
        const r = tmpColor.r * a8;
        const g = tmpColor.g * a8;
        const b2 = tmpColor.b * a8;
        const o = e * 6;
        arr[o + 0] = r;
        arr[o + 1] = g;
        arr[o + 2] = b2;
        arr[o + 3] = r;
        arr[o + 4] = g;
        arr[o + 5] = b2;
      }
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        {/* Wireframe geodesic skull */}
        <mesh>
          {/* detail=3 → 320 tris; detail=4 → 1280 tris. At this size the
             silhouette difference is invisible but we cut 75 % off the
             wireframe's rasterisation cost. */}
          <icosahedronGeometry args={[RADIUS, 3]} />
          <meshBasicMaterial
            color="#00D4FF"
            wireframe
            transparent
            opacity={0.12}
            toneMapped={false}
          />
        </mesh>

        {/* Faint inner glow sphere */}
        <mesh>
          <sphereGeometry args={[RADIUS * 0.97, 16, 12]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        {/* Neighbour edges */}
        <lineSegments ref={linesRef} geometry={edgeGeometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>

        {/* Surface nodes */}
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, NODE_COUNT]}
          frustumCulled={false}
        >
          {/* 150 instances × octahedron (8 tris) = 1.2k tris total
             instead of 24k. Indistinguishable at this scale. */}
          <octahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
}
