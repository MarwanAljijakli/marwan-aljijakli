"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAdaptiveQuality } from "@/lib/hooks/useAdaptiveQuality";

/* ==========================================================================
 * NeuralNetwork
 * --------------------------------------------------------------------------
 *   • 200 nodes — rendered as a single InstancedMesh of 0.05u spheres.
 *   • Edges    — a single LineSegments whose BufferGeometry is rewritten each
 *                frame. Nodes within CONNECTION_DIST are connected, with edge
 *                brightness proportional to (1 - d / CONNECTION_DIST).
 *   • Drift    — each node wanders around a base position using layered sin
 *                waves (cheap pseudo-Perlin). Max speed is well under 0.3 u/s.
 *   • Pulses   — every PULSE_INTERVAL seconds a random node spawns a "signal"
 *                that propagates outward through the current graph (BFS with
 *                per-hop delay), highlighting nodes and the edges between
 *                them with a Gaussian envelope.
 *   • Mouse    — nodes within 1u of the cursor (projected onto the z=0 plane)
 *                are gently pulled toward it.
 * ========================================================================== */

const BASE_NODE_COUNT = 200;

const BOUNDS_X = 7;
const BOUNDS_Y = 4;
const BOUNDS_Z = 5;

const CONNECTION_DIST = 2;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const MAX_EDGES = 1800;

const PULSE_INTERVAL = 3;        // seconds
const PULSE_HOPS = 5;
const PULSE_HOP_MS = 140;
const PULSE_FADE_MS = 420;

const MOUSE_ATTRACT_RADIUS = 1;
const MOUSE_ATTRACT_RADIUS_SQ = MOUSE_ATTRACT_RADIUS * MOUSE_ATTRACT_RADIUS;
const MOUSE_ATTRACT_STRENGTH = 0.55;

const COLOR_NODE_REST = new THREE.Color("#1a3a5c");
const COLOR_NODE_ACTIVE = new THREE.Color("#00D4FF");
const COLOR_EDGE_REST = new THREE.Color(0.06, 0.38, 0.55);
const COLOR_EDGE_ACTIVE = new THREE.Color("#BFF7FF");

interface Pulse {
  startMs: number;
  /** Map<nodeIdx, delayInMsFromPulseStart> */
  arrivals: Map<number, number>;
}

export default function NeuralNetwork() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Adaptive node count — high-quality desktops get the full 200 nodes,
  // mid-tier hardware 120, low-end phones 60 or fewer. The per-frame cost
  // is O(n²) for edge detection so this compounds massively.
  const { config } = useAdaptiveQuality();
  const NODE_COUNT = Math.max(
    20,
    Math.round(BASE_NODE_COUNT * config.particleCount)
  );

  // --- Per-node state (persistent across frames) ---------------------------
  const basePositions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 2 * BOUNDS_X;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS_Y;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS_Z;
    }
    return arr;
  }, [NODE_COUNT]);

  const seeds = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) arr[i] = Math.random() * 100;
    return arr;
  }, [NODE_COUNT]);

  const positions = useMemo(
    () => new Float32Array(NODE_COUNT * 3),
    [NODE_COUNT]
  );
  const nodeEnergy = useMemo(
    () => new Float32Array(NODE_COUNT),
    [NODE_COUNT]
  );

  // --- Shared edge buffers (pre-allocated, reused every frame) --------------
  const edgePositions = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);
  const edgeColors = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);

  const edgeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));
    g.setDrawRange(0, 0);
    return g;
  }, [edgePositions, edgeColors]);

  // --- Scratch / pulse state ------------------------------------------------
  const pulsesRef = useRef<Pulse[]>([]);
  const lastPulseAtRef = useRef<number>(0);
  const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const tmpScale = useMemo(() => new THREE.Vector3(), []);

  // --- One-time init: make sure instance-color is allocated ----------------
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < NODE_COUNT; i++) {
      mesh.setColorAt(i, COLOR_NODE_REST);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [NODE_COUNT]);

  // Give material access to the shared geometry once.
  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
    };
  }, [edgeGeometry]);

  /** Build a delay-per-node map by BFS-ing from `origin` through the current
   *  position graph. Re-computed on every pulse spawn, so it always reflects
   *  the network's current connectivity. */
  const bfsArrivals = (origin: number): Map<number, number> => {
    const arrivals = new Map<number, number>();
    arrivals.set(origin, 0);
    let frontier: number[] = [origin];

    for (let hop = 1; hop <= PULSE_HOPS; hop++) {
      const next: number[] = [];
      for (let fi = 0; fi < frontier.length; fi++) {
        const from = frontier[fi];
        const fx = positions[from * 3];
        const fy = positions[from * 3 + 1];
        const fz = positions[from * 3 + 2];
        for (let to = 0; to < NODE_COUNT; to++) {
          if (arrivals.has(to)) continue;
          const dx = positions[to * 3] - fx;
          const dy = positions[to * 3 + 1] - fy;
          const dz = positions[to * 3 + 2] - fz;
          if (dx * dx + dy * dy + dz * dz < CONNECTION_DIST_SQ) {
            arrivals.set(to, hop * PULSE_HOP_MS);
            next.push(to);
          }
        }
      }
      if (next.length === 0) break;
      frontier = next;
    }
    return arrivals;
  };

  const { viewport } = useThree();

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    const nowMs = t * 1000;

    // Cursor position projected onto the z=0 plane, in world units.
    const mouseX = state.pointer.x * viewport.width * 0.5;
    const mouseY = state.pointer.y * viewport.height * 0.5;

    /* ---- 1. Node positions (drift + mouse attraction) --------------------- */
    for (let i = 0; i < NODE_COUNT; i++) {
      const s = seeds[i];
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      // Layered sin waves — cheap but visually smooth. Amplitude 0.6 u,
      // temporal derivative peaks well below 0.3 u/s.
      const dx =
        Math.sin(t * 0.27 + s * 1.13) * 0.42 +
        Math.sin(t * 0.11 + s * 2.7) * 0.18;
      const dy =
        Math.sin(t * 0.23 + s * 2.9) * 0.42 +
        Math.sin(t * 0.13 + s * 3.1) * 0.18;
      const dz =
        Math.sin(t * 0.19 + s * 3.7) * 0.42 +
        Math.sin(t * 0.17 + s * 1.7) * 0.18;

      let x = bx + dx;
      let y = by + dy;
      let z = bz + dz;

      // Mouse attraction (within 1u radius of the projected cursor).
      const mdx = mouseX - x;
      const mdy = mouseY - y;
      const mdz = 0 - z;
      const mDistSq = mdx * mdx + mdy * mdy + mdz * mdz;
      if (mDistSq < MOUSE_ATTRACT_RADIUS_SQ) {
        const mDist = Math.sqrt(mDistSq) || 1;
        const falloff =
          (1 - mDist / MOUSE_ATTRACT_RADIUS) * MOUSE_ATTRACT_STRENGTH;
        x += (mdx / mDist) * falloff;
        y += (mdy / mDist) * falloff;
        z += (mdz / mDist) * falloff;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    /* ---- 2. Spawn a new pulse every PULSE_INTERVAL seconds ---------------- */
    if (t - lastPulseAtRef.current > PULSE_INTERVAL) {
      lastPulseAtRef.current = t;
      const origin = Math.floor(Math.random() * NODE_COUNT);
      pulsesRef.current.push({
        startMs: nowMs,
        arrivals: bfsArrivals(origin),
      });
    }

    /* ---- 3. Retire expired pulses ---------------------------------------- */
    const pulseLifespanMs = PULSE_HOPS * PULSE_HOP_MS + PULSE_FADE_MS + 200;
    pulsesRef.current = pulsesRef.current.filter(
      (p) => nowMs - p.startMs < pulseLifespanMs
    );

    /* ---- 4. Compute per-node activation ---------------------------------- */
    nodeEnergy.fill(0);
    for (let p = 0; p < pulsesRef.current.length; p++) {
      const pulse = pulsesRef.current[p];
      const elapsed = nowMs - pulse.startMs;
      for (const [nodeIdx, arrival] of pulse.arrivals) {
        const delta = elapsed - arrival;
        if (delta < 0) continue;
        const norm = delta / PULSE_FADE_MS;
        const energy = Math.exp(-norm * norm * 2);
        if (energy > nodeEnergy[nodeIdx]) nodeEnergy[nodeIdx] = energy;
      }
    }

    /* ---- 5. Update node instances ---------------------------------------- */
    const mesh = meshRef.current;
    if (mesh) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const e = nodeEnergy[i];
        const scale = 1 + e * 1.4; // pop on activation
        tmpScale.set(scale, scale, scale);
        tmpMatrix.compose(
          _setTmpPos(positions, i),
          tmpQuat,
          tmpScale
        );
        mesh.setMatrixAt(i, tmpMatrix);

        tmpColor.copy(COLOR_NODE_REST).lerp(COLOR_NODE_ACTIVE, e);
        mesh.setColorAt(i, tmpColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    /* ---- 6. Rebuild edge buffer ------------------------------------------ */
    let edgeIdx = 0;
    for (let i = 0; i < NODE_COUNT && edgeIdx < MAX_EDGES; i++) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];
      const ei = nodeEnergy[i];
      for (let j = i + 1; j < NODE_COUNT && edgeIdx < MAX_EDGES; j++) {
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const dx = bx - ax;
        const dy = by - ay;
        const dz = bz - az;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq >= CONNECTION_DIST_SQ) continue;

        const dist = Math.sqrt(distSq);
        const proximity = 1 - dist / CONNECTION_DIST; // 0..1
        const ej = nodeEnergy[j];
        const edgeEnergy = Math.min(1, (ei + ej) * 0.5 * 1.3);

        // positions
        const po = edgeIdx * 6;
        edgePositions[po + 0] = ax;
        edgePositions[po + 1] = ay;
        edgePositions[po + 2] = az;
        edgePositions[po + 3] = bx;
        edgePositions[po + 4] = by;
        edgePositions[po + 5] = bz;

        // colors — bake alpha into the RGB so we get inverse-distance fading
        // without needing per-vertex alpha.
        tmpColor.copy(COLOR_EDGE_REST).lerp(COLOR_EDGE_ACTIVE, edgeEnergy);
        const a = proximity * proximity * (0.35 + edgeEnergy * 0.9);
        const r = tmpColor.r * a;
        const g = tmpColor.g * a;
        const b = tmpColor.b * a;
        edgeColors[po + 0] = r;
        edgeColors[po + 1] = g;
        edgeColors[po + 2] = b;
        edgeColors[po + 3] = r;
        edgeColors[po + 4] = g;
        edgeColors[po + 5] = b;

        edgeIdx++;
      }
    }

    const lines = linesRef.current;
    if (lines) {
      const posAttr = edgeGeometry.getAttribute("position") as THREE.BufferAttribute;
      const colAttr = edgeGeometry.getAttribute("color") as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      edgeGeometry.setDrawRange(0, edgeIdx * 2);
    }

    // Avoid unused warning on dt for the sake of docs-readers:
    void dt;
  });

  return (
    <group>
      {/* Re-key on NODE_COUNT so the InstancedMesh reallocates its buffer
         the rare case we hot-swap quality tier at runtime. */}
      <instancedMesh
        key={`nodes-${NODE_COUNT}`}
        ref={meshRef}
        args={[undefined, undefined, NODE_COUNT]}
        frustumCulled={false}
      >
        {/* Octahedron = 8 tris (vs 288 for a 12×12 sphere) — visually
           identical at 0.05u screen size. Huge vertex-count win at 200
           instances. */}
        <octahedronGeometry args={[0.06, 0]} />
        {/* toneMapped:false keeps the cyan punchy without ACES compression. */}
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>

      <lineSegments
        ref={linesRef}
        geometry={edgeGeometry}
        frustumCulled={false}
      >
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

/* ---------- tiny helpers ---------- */

const _scratchVec = new THREE.Vector3();
function _setTmpPos(arr: Float32Array, i: number) {
  _scratchVec.set(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]);
  return _scratchVec;
}
