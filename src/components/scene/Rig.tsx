"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";

// Camera keyframes per section (spec 05). Position + lookAt; lerped from
// scrollState each frame. Adds gentle mouse parallax (separate from particle warp).
const KEYS: { pos: [number, number, number]; look: [number, number, number] }[] =
  [
    { pos: [0, 0, 13], look: [0, 0, 0] }, // hero
    { pos: [2.5, 1, 12], look: [0, 0, 0] }, // about (orbit)
    { pos: [0, 0, 17], look: [0, 0, 0] }, // projects (pull back)
    { pos: [-3, 0.5, 13], look: [0, 0, 0] }, // skills (drift)
    { pos: [0, 0, 8], look: [0, 0, -3] }, // contact (dolly in)
  ];

type Props = { animate?: boolean };

export default function Rig({ animate = true }: Props) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 13));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const tmpLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, dt) => {
    if (!animate) {
      camera.position.set(0, 0, 13);
      camera.lookAt(0, 0, 0);
      return;
    }

    const section = Math.min(Math.max(scrollState.section, 0), 4);
    const next = Math.min(section + 1, 4);
    const t = section === 4 ? 0 : scrollState.local;

    const a = KEYS[section];
    const b = KEYS[next];

    targetPos.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
    );
    targetLook.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], t),
      THREE.MathUtils.lerp(a.look[1], b.look[1], t),
      THREE.MathUtils.lerp(a.look[2], b.look[2], t)
    );

    // mouse parallax
    targetPos.current.x += scrollState.mouse.x * 0.8;
    targetPos.current.y += scrollState.mouse.y * 0.5;

    const k = 1 - Math.pow(0.0015, dt);
    camera.position.lerp(targetPos.current, k);
    tmpLook.current.lerp(targetLook.current, k);
    camera.lookAt(tmpLook.current);
  });

  return null;
}
