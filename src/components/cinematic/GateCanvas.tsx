"use client";

// The R3F gate canvas, isolated so it can be code-split with next/dynamic. This
// keeps three.js / @react-three/fiber OUT of the initial bundle — the flat
// (mobile / reduced-motion) path never downloads them, and the cinematic path
// only loads them once the gate is near the viewport.

import { Canvas } from "@react-three/fiber";
import LightWall from "./LightWall";

export default function GateCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <LightWall />
    </Canvas>
  );
}
