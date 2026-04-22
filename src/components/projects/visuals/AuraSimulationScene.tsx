"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useAdaptiveQuality } from "@/lib/hooks/useAdaptiveQuality";

/* ==========================================================================
 * AuraSimulation
 * --------------------------------------------------------------------------
 * A live-running miniature of AURA's mission surface:
 *
 *   • Tilted top-down factory floor (isometric-ish)
 *   • Gray machine boxes at fixed positions
 *   • Two red restricted zones — flash when a worker enters
 *   • Four workers (yellow disks) patrolling waypoint loops
 *   • Each worker carries a PPE status sprite (green ✓ or red ✗)
 *   • Two surveillance cameras, each sweeping a semi-transparent yellow
 *     field-of-view triangle across the floor
 *
 * Speed is scaled by an external ref so the parent card can lean the
 * simulation forward on hover without re-mounting anything.
 * ========================================================================== */

export interface AuraSimulationProps {
  /** Ref whose current value is used as a global speed multiplier. */
  speedRef: RefObject<number>;
  /** Pauses the R3F frameloop when false. */
  visible?: boolean;
}

export default function AuraSimulationScene({
  speedRef,
  visible = true,
}: AuraSimulationProps) {
  const { config } = useAdaptiveQuality();

  return (
    <Canvas
      dpr={[1, config.pixelRatio]}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: config.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 12, 6.5], fov: 35, near: 0.1, far: 50 }}
    >
      <FactoryScene speedRef={speedRef} />
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene constants                                                           */
/* -------------------------------------------------------------------------- */

const FLOOR_W = 16;
const FLOOR_D = 10;

const MACHINES: { x: number; z: number; w: number; d: number; h: number }[] = [
  { x: -5.2, z: -2.4, w: 2.0, d: 1.8, h: 1.1 },
  { x: 5.0, z: -2.8, w: 2.4, d: 1.4, h: 1.4 },
  { x: -2.0, z: 2.8, w: 2.8, d: 1.6, h: 1.0 },
  { x: 4.2, z: 2.2, w: 1.8, d: 2.0, h: 1.25 },
  { x: -6.2, z: 2.5, w: 1.4, d: 1.3, h: 1.5 },
  { x: 0.2, z: -0.6, w: 1.0, d: 1.0, h: 0.8 },
];

interface Zone {
  x: number;
  z: number;
  w: number;
  d: number;
}
const ZONES: Zone[] = [
  { x: 3.6, z: 0.6, w: 2.4, d: 2.4 },
  { x: -4.0, z: 0.0, w: 2.2, d: 2.0 },
];

interface WorkerDef {
  compliant: boolean;
  waypoints: [number, number][];
  speed: number;
  phase: number; // starting offset along waypoint loop
}
const WORKERS: WorkerDef[] = [
  {
    compliant: true,
    speed: 1.1,
    phase: 0,
    waypoints: [
      [-7, -3.5],
      [-2.5, -3.8],
      [-2.5, -0.5],
      [-7, -0.5],
    ],
  },
  {
    compliant: true,
    speed: 1.3,
    phase: 0.35,
    waypoints: [
      // Passes through the right zone periodically
      [0.5, 3.2],
      [4.0, 3.2],
      [4.0, 0.0],
      [2.0, 0.0],
      [0.5, 1.8],
    ],
  },
  {
    compliant: false, // non-compliant PPE
    speed: 1.0,
    phase: 0.2,
    waypoints: [
      [-0.5, -3.8],
      [2.5, -3.8],
      [2.5, -1.5],
      [-0.5, -1.5],
    ],
  },
  {
    compliant: false,
    speed: 1.4,
    phase: 0.6,
    waypoints: [
      // Passes through the left zone
      [-7.0, 3.0],
      [-3.8, 3.0],
      [-3.8, -0.6],
      [-5.2, -0.6],
    ],
  },
];

interface CameraDef {
  x: number;
  z: number;
  y: number;
  baseYaw: number;
  sweepAmp: number;
  sweepSpeed: number;
}
const CAMERAS: CameraDef[] = [
  { x: -7.2, z: 4.0, y: 1.6, baseYaw: -Math.PI * 0.8, sweepAmp: 0.7, sweepSpeed: 0.6 },
  { x: 7.2, z: -4.0, y: 1.6, baseYaw: Math.PI * 0.2, sweepAmp: 0.7, sweepSpeed: 0.5 },
];

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

function FactoryScene({ speedRef }: { speedRef: RefObject<number> }) {
  /* -- PPE sprite textures (one per variant, shared across workers) ------- */
  const ppeTextures = useMemo(() => {
    return { ok: makePpeTexture(true), bad: makePpeTexture(false) };
  }, []);
  useEffect(() => {
    return () => {
      ppeTextures.ok.dispose();
      ppeTextures.bad.dispose();
    };
  }, [ppeTextures]);

  /* -- FOV triangle geometry (flat on floor, tip at origin, base at -z) --- */
  const fovGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts = new Float32Array([
      0, 0.02, 0,
      -1.6, 0.02, -3.2,
      1.6, 0.02, -3.2,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.setIndex([0, 1, 2]);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => fovGeometry.dispose(), [fovGeometry]);

  /* -- Worker runtime state (positions + current leg) --------------------- */
  const workerState = useMemo(() => {
    return WORKERS.map((w) => ({
      pos: new THREE.Vector2(w.waypoints[0][0], w.waypoints[0][1]),
      legIdx: 0,
      def: w,
    }));
  }, []);

  const workerGroupsRef = useRef<(THREE.Group | null)[]>([]);
  const ppeSpritesRef = useRef<(THREE.Sprite | null)[]>([]);
  const zoneRefs = useRef<(THREE.Mesh | null)[]>([]);
  const fovGroupRefs = useRef<(THREE.Group | null)[]>([]);

  /* -- Per-zone flash energy (smoothed) ----------------------------------- */
  const zoneEnergy = useMemo(() => new Float32Array(ZONES.length), []);

  /* ---------------------------------------------------------------------- */
  useFrame((state, rawDt) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(0.05, rawDt) * (speedRef.current ?? 1);

    /* --- 1. Move workers along their patrol loops ----------------------- */
    for (let wi = 0; wi < workerState.length; wi++) {
      const ws = workerState[wi];
      const wp = ws.def.waypoints;
      const target = wp[ws.legIdx];

      const tx = target[0];
      const tz = target[1];
      const dx = tx - ws.pos.x;
      const dz = tz - ws.pos.y;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.08) {
        ws.legIdx = (ws.legIdx + 1) % wp.length;
      } else {
        const step = Math.min(dist, ws.def.speed * dt);
        ws.pos.x += (dx / dist) * step;
        ws.pos.y += (dz / dist) * step;
      }

      const g = workerGroupsRef.current[wi];
      if (g) {
        g.position.set(ws.pos.x, 0.28, ws.pos.y);
        // Face the direction of travel (yaw).
        if (dist > 0.001) {
          const yaw = Math.atan2(dx, dz);
          g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 6, dt);
        }
      }

      // Bobbing PPE sprite
      const sprite = ppeSpritesRef.current[wi];
      if (sprite) {
        sprite.position.set(ws.pos.x, 1.2 + Math.sin(t * 2 + wi) * 0.05, ws.pos.y);
      }
    }

    /* --- 2. Detect workers inside zones (flash) ------------------------- */
    for (let zi = 0; zi < ZONES.length; zi++) {
      const z = ZONES[zi];
      let inside = false;
      for (let wi = 0; wi < workerState.length; wi++) {
        const ws = workerState[wi];
        if (
          Math.abs(ws.pos.x - z.x) < z.w * 0.5 &&
          Math.abs(ws.pos.y - z.z) < z.d * 0.5
        ) {
          inside = true;
          break;
        }
      }

      const target = inside ? 1 : 0;
      zoneEnergy[zi] = THREE.MathUtils.damp(zoneEnergy[zi], target, inside ? 14 : 4, dt);

      const mesh = zoneRefs.current[zi];
      if (mesh) {
        const flash =
          zoneEnergy[zi] *
          (0.75 + Math.sin(t * 8) * 0.25); // flash pulse
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.1 + flash * 0.5;
        mat.color.setRGB(1, 0.18 * (1 - flash * 0.5), 0.25 * (1 - flash * 0.6));
      }
    }

    /* --- 3. Sweep camera FOV cones -------------------------------------- */
    for (let ci = 0; ci < CAMERAS.length; ci++) {
      const cam = CAMERAS[ci];
      const group = fovGroupRefs.current[ci];
      if (!group) continue;
      group.rotation.y =
        cam.baseYaw + Math.sin(t * cam.sweepSpeed) * cam.sweepAmp;
    }
  });

  /* ---------------------------------------------------------------------- */
  return (
    <group>
      {/* Ambient lift for the matte materials */}
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[6, 10, 8]}
        intensity={0.9}
        color="#ffffff"
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[FLOOR_W, FLOOR_D]} />
        <meshBasicMaterial color="#0b1a2d" />
      </mesh>

      {/* Floor grid lines (cyan, subtle) */}
      <gridHelper
        args={[FLOOR_W, 16, "#1b4570", "#12334e"]}
        position={[0, 0.01, 0]}
      />

      {/* Machines */}
      {MACHINES.map((m, i) => (
        <group key={i} position={[m.x, m.h / 2, m.z]}>
          <mesh castShadow={false} receiveShadow={false}>
            <boxGeometry args={[m.w, m.h, m.d]} />
            <meshStandardMaterial
              color="#2c3d55"
              roughness={0.85}
              metalness={0.2}
            />
          </mesh>
          {/* Top highlight rim */}
          <mesh position={[0, m.h / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[m.w * 0.94, m.d * 0.94]} />
            <meshBasicMaterial color="#4c6684" />
          </mesh>
        </group>
      ))}

      {/* Restricted zones */}
      {ZONES.map((z, i) => (
        <group key={i} position={[z.x, 0, z.z]}>
          <mesh
            ref={(el) => {
              zoneRefs.current[i] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.015, 0]}
          >
            <planeGeometry args={[z.w, z.d]} />
            <meshBasicMaterial
              color="#ff2f48"
              transparent
              opacity={0.12}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Dashed-ish corners (4 small lines at each corner) */}
          <ZoneOutline w={z.w} d={z.d} />
        </group>
      ))}

      {/* Workers */}
      {WORKERS.map((w, i) => (
        <group
          key={i}
          ref={(el) => {
            workerGroupsRef.current[i] = el;
          }}
        >
          {/* Body disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.08, 16]} />
            <meshStandardMaterial
              color="#ffce3c"
              emissive="#ffce3c"
              emissiveIntensity={0.25}
              roughness={0.5}
            />
          </mesh>
          {/* Direction cone */}
          <mesh position={[0, 0.02, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.13, 0.22, 12]} />
            <meshBasicMaterial color="#fff1a0" />
          </mesh>
          {/* Shadow disc */}
          <mesh position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.32, 16]} />
            <meshBasicMaterial color="#000" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* PPE sprites — billboards that always face the camera */}
      {WORKERS.map((w, i) => (
        <sprite
          key={i}
          ref={(el) => {
            ppeSpritesRef.current[i] = el;
          }}
          scale={[0.55, 0.55, 0.55]}
        >
          <spriteMaterial
            attach="material"
            map={w.compliant ? ppeTextures.ok : ppeTextures.bad}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}

      {/* Surveillance cameras + FOV cones */}
      {CAMERAS.map((cam, i) => (
        <group key={i} position={[cam.x, cam.y, cam.z]}>
          {/* Pole */}
          <mesh position={[0, -cam.y / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, cam.y, 8]} />
            <meshStandardMaterial color="#3a4e68" metalness={0.3} roughness={0.6} />
          </mesh>
          {/* Camera body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.35, 0.22, 0.45]} />
            <meshStandardMaterial color="#0d1a2c" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Lens dot */}
          <mesh position={[0, 0, 0.23]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#00D4FF" toneMapped={false} />
          </mesh>
          {/* FOV cone (child group rotates on Y to sweep) */}
          <group
            ref={(el) => {
              fovGroupRefs.current[i] = el;
            }}
            position={[0, -cam.y + 0.02, 0]}
          >
            <mesh geometry={fovGeometry}>
              <meshBasicMaterial
                color="#ffd93c"
                transparent
                opacity={0.14}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Edge lines for crispness */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      0, 0.03, 0,
                      -1.6, 0.03, -3.2,
                      1.6, 0.03, -3.2,
                      0, 0.03, 0,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#ffd93c"
                transparent
                opacity={0.45}
                toneMapped={false}
              />
            </line>
          </group>
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function ZoneOutline({ w, d }: { w: number; d: number }) {
  const hw = w / 2;
  const hd = d / 2;
  const tick = 0.25;
  const y = 0.025;
  const segs = [
    // top-left L
    [-hw, y, -hd, -hw + tick, y, -hd],
    [-hw, y, -hd, -hw, y, -hd + tick],
    // top-right L
    [hw, y, -hd, hw - tick, y, -hd],
    [hw, y, -hd, hw, y, -hd + tick],
    // bottom-left L
    [-hw, y, hd, -hw + tick, y, hd],
    [-hw, y, hd, -hw, y, hd - tick],
    // bottom-right L
    [hw, y, hd, hw - tick, y, hd],
    [hw, y, hd, hw, y, hd - tick],
  ];
  return (
    <>
      {segs.map((s, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(s), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ff3b5c" transparent opacity={0.85} toneMapped={false} />
        </line>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function makePpeTexture(compliant: boolean): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, size, size);

  // Outer soft halo
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, compliant ? "rgba(16,220,120,0.9)" : "rgba(255,70,90,0.9)");
  grad.addColorStop(0.55, compliant ? "rgba(16,220,120,0.15)" : "rgba(255,70,90,0.15)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Core disc
  ctx.fillStyle = compliant ? "#10dc78" : "#ff405a";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.34, 0, Math.PI * 2);
  ctx.fill();

  // Glyph
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (compliant) {
    ctx.moveTo(size * 0.34, size * 0.52);
    ctx.lineTo(size * 0.46, size * 0.64);
    ctx.lineTo(size * 0.70, size * 0.38);
  } else {
    ctx.moveTo(size * 0.36, size * 0.36);
    ctx.lineTo(size * 0.64, size * 0.64);
    ctx.moveTo(size * 0.64, size * 0.36);
    ctx.lineTo(size * 0.36, size * 0.64);
  }
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
