"use client";

import {
  Component,
  type ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import ParticleField from "./ParticleField";
import Rig from "./Rig";
import PostFX from "./PostFX";
import ScenePoster from "./ScenePoster";

type Quality = {
  live: boolean;
  reducedLive: boolean;
  staticFrame: boolean;
  particleCount: number;
  bloom: boolean;
  dpr: number;
};

// If the WebGL context dies at runtime, fall back to the poster instead of a
// blank canvas (spec 09).
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <ScenePoster />;
    return this.props.children;
  }
}

export default function SceneRoot({ quality }: { quality: Quality }) {
  const animate = quality.live || quality.reducedLive;
  const [contextLost, setContextLost] = useState(false);
  const [visible, setVisible] = useState(true);

  // Stop the render loop while the tab is hidden — no point burning CPU/GPU on
  // a backdrop nobody can see (gsap-performance: kill off-screen work).
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // If the GPU drops the context (driver reset, tab backgrounded too long),
  // fall back to the poster rather than a frozen/blank canvas (spec 09, webgl).
  if (contextLost) return <ScenePoster />;

  return (
    <SceneErrorBoundary>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Canvas
          dpr={[1, quality.dpr]}
          frameloop={animate && visible ? "always" : "demand"}
          camera={{ position: [0, 0, 13], fov: 50 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                setContextLost(true);
              },
              { once: true }
            );
          }}
        >
          <color attach="background" args={["#0a0a0a"]} />
          <Suspense fallback={null}>
            <ParticleField
              count={quality.particleCount}
              animate={animate}
              mouseStrength={quality.live ? 1 : 0.5}
            />
            <Rig animate={animate} />
            {quality.bloom && <PostFX />}
            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated={false} />
          <AdaptiveEvents />
        </Canvas>

        {/* readability scrim + edge fades so text always reads over the field */}
        <div className="absolute inset-0 bg-bg/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-bg" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-bg/80" />
      </div>
    </SceneErrorBoundary>
  );
}
