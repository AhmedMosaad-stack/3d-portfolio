"use client";

// The cinematic entrance — kept DARK end to end, no bright flash at any point.
// The camera flies through two dark scenes:
//   scene 1  a wall of near-black glass slats across the corridor (the gate)
//   scene 2  a faint mint wireframe tunnel receding into the dark beyond it
//
// On entrance the camera dollies in from far (corridor.intro). As you scroll
// (corridor.gate 0→1) the slats retract center-out and the camera passes THROUGH
// the wall and on down the tunnel — the scene changes, but the frame stays dark
// (thin mint lines on black, never a bloom or whiteout). Scrolling back re-forms
// the wall and pulls the camera out, symmetrically.
//
// Cost: 14 slats + one LineSegments tunnel (a single draw call) + one dim light.

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { corridor } from "@/lib/corridor";

const ACCENT = "#00ffc8";
const SLATS = 14;
const WALL_W = 11;
const WALL_H = 9.2;

export default function LightWall() {
  const { camera } = useThree();
  const tunnelRef = useRef<THREE.LineSegments>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const slatRefs = useRef<THREE.Mesh[]>([]);
  const eased = useRef(0);
  const t = useRef(0);

  const slats = useMemo(() => {
    const gap = WALL_W / SLATS;
    return Array.from({ length: SLATS }, (_, i) => {
      const x = -WALL_W / 2 + gap / 2 + i * gap;
      const fromCenter = Math.abs(x) / (WALL_W / 2);
      return { x, w: gap * 0.9, stagger: 1 - fromCenter };
    });
  }, []);

  // A wireframe tunnel: concentric rectangle rings receding in -z, plus the four
  // longitudinal edges joining them. Faint mint on black — the dark "scene 2".
  const tunnel = useMemo(() => {
    const RINGS = 9;
    const Z0 = -1.5;
    const ZSTEP = -3.4;
    const hw = 5;
    const hh = 3.4;
    const ring = (z: number): number[][] => [
      [-hw, hh, z],
      [hw, hh, z],
      [hw, -hh, z],
      [-hw, -hh, z],
    ];
    const rings = Array.from({ length: RINGS }, (_, i) => ring(Z0 + i * ZSTEP));
    const pts: number[] = [];
    for (const c of rings) {
      for (let e = 0; e < 4; e++) {
        pts.push(...c[e], ...c[(e + 1) % 4]); // ring edges
      }
    }
    for (let i = 0; i < rings.length - 1; i++) {
      for (let e = 0; e < 4; e++) {
        pts.push(...rings[i][e], ...rings[i + 1][e]); // connectors
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05);
    eased.current = THREE.MathUtils.damp(eased.current, corridor.gate, 6, dt);
    const d = eased.current;
    const intro = corridor.intro; // smoothly tweened by the loader handoff

    // Slats retract (scaleY→0) + fade, center-first.
    for (let i = 0; i < slatRefs.current.length; i++) {
      const mesh = slatRefs.current[i];
      if (!mesh) continue;
      const s = slats[i];
      const local = THREE.MathUtils.smoothstep(d, 1 - s.stagger - 0.15, 1 - s.stagger + 0.4);
      mesh.scale.y = 1 - local;
      (mesh.material as THREE.MeshStandardMaterial).opacity = 1 - local;
    }

    // Tunnel lines: faint at rest, a touch stronger once the wall opens — but
    // always low. No additive bloom, so the scene never turns bright.
    if (tunnelRef.current) {
      const m = tunnelRef.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.06 + d * 0.14;
    }

    // Dim key light so the glass slats read; never ramps into a flash.
    if (lightRef.current) lightRef.current.intensity = 0.08 + d * 0.5;

    // Camera: far→gate on entrance, then through the wall (z=0) and on down the
    // tunnel as you scroll. Stays a dark fly-through.
    const base = THREE.MathUtils.lerp(20, 8.2, intro);
    camera.position.z = THREE.MathUtils.lerp(base, -9, THREE.MathUtils.smoothstep(d, 0, 1));
    camera.position.x = Math.sin(t.current * 0.3) * 0.06;
    camera.position.y = Math.sin(t.current * 0.45) * 0.05;
    camera.lookAt(0, 0, -30);
  });

  return (
    <group>
      <ambientLight intensity={0.05} color="#06201b" />
      <pointLight ref={lightRef} position={[0, 0, 3]} color={ACCENT} intensity={0.08} distance={32} />

      {/* Scene 2 — dark mint wireframe tunnel behind the wall. */}
      <lineSegments ref={tunnelRef} geometry={tunnel}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.06} depthWrite={false} toneMapped={false} />
      </lineSegments>

      {/* Scene 1 — the wall: near-black glass slats with thin mint seams. */}
      <group>
        {slats.map((s, i) => (
          <mesh
            key={i}
            position={[s.x, 0, 0]}
            ref={(el) => {
              if (el) slatRefs.current[i] = el;
            }}
          >
            <planeGeometry args={[s.w, WALL_H]} />
            <meshStandardMaterial
              color="#020403"
              emissive={ACCENT}
              emissiveIntensity={0.01}
              metalness={0.5}
              roughness={0.55}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
