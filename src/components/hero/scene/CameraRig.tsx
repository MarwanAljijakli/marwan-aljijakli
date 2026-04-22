"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ==========================================================================
 * CameraRig
 * --------------------------------------------------------------------------
 * Continuously orbits the camera around the origin at 0.3 deg/sec on the Y
 * axis, then adds a damped ±5° tilt driven by the cursor. All values are
 * smoothed with THREE.MathUtils.damp so the motion reads as "weighted" rather
 * than reactive.
 * ========================================================================== */

const ORBIT_DEG_PER_SEC = 0.3;
const RADIUS = 8;
const MAX_TILT_DEG = 5;

export default function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const tiltXRef = useRef(0); // orbit-axis offset (driven by pointer.x)
  const tiltYRef = useRef(0); // vertical offset       (driven by pointer.y)

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();

    const baseAngle = t * ORBIT_DEG_PER_SEC * THREE.MathUtils.DEG2RAD;

    const targetTiltX =
      state.pointer.x * MAX_TILT_DEG * THREE.MathUtils.DEG2RAD;
    const targetTiltY =
      -state.pointer.y * MAX_TILT_DEG * THREE.MathUtils.DEG2RAD;

    // Damped follow — ~200 ms to close most of the distance.
    tiltXRef.current = THREE.MathUtils.damp(
      tiltXRef.current,
      targetTiltX,
      3.5,
      dt
    );
    tiltYRef.current = THREE.MathUtils.damp(
      tiltYRef.current,
      targetTiltY,
      3.5,
      dt
    );

    const angle = baseAngle + tiltXRef.current;

    camera.position.x = Math.sin(angle) * RADIUS;
    camera.position.z = Math.cos(angle) * RADIUS;
    camera.position.y = Math.sin(tiltYRef.current) * RADIUS * 0.8;

    camera.lookAt(target);
  });

  return null;
}
