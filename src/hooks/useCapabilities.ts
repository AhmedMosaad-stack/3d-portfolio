"use client";

// Resolves device capabilities once (spec 02/08/09): WebGL support, GPU tier,
// reduced-motion preference, and coarse/mobile pointer. Drives the render-path
// branch (full live scene / reduced / static / no-canvas).

import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

export type Capabilities = {
  ready: boolean;
  webgl: boolean;
  gpuTier: number; // 0..3
  reducedMotion: boolean;
  isMobile: boolean;
};

const DEFAULT: Capabilities = {
  ready: false,
  webgl: false,
  gpuTier: 0,
  reducedMotion: false,
  isMobile: false,
};

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function useCapabilities(): Capabilities {
  const [caps, setCaps] = useState<Capabilities>(DEFAULT);

  useEffect(() => {
    let cancelled = false;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 1023px), (pointer: coarse)");

    const webgl = detectWebGL();

    const resolve = async () => {
      let gpuTier = 0;
      if (webgl) {
        try {
          const result = await getGPUTier();
          gpuTier = result.tier ?? 0;
        } catch {
          gpuTier = 1; // assume a low-but-usable tier if detection fails
        }
      }
      if (cancelled) return;
      setCaps({
        ready: true,
        webgl,
        gpuTier,
        reducedMotion: reduceMq.matches,
        isMobile: mobileMq.matches,
      });
    };

    resolve();

    const onReduce = () =>
      setCaps((c) => ({ ...c, reducedMotion: reduceMq.matches }));
    const onMobile = () => setCaps((c) => ({ ...c, isMobile: mobileMq.matches }));
    reduceMq.addEventListener("change", onReduce);
    mobileMq.addEventListener("change", onMobile);

    return () => {
      cancelled = true;
      reduceMq.removeEventListener("change", onReduce);
      mobileMq.removeEventListener("change", onMobile);
    };
  }, []);

  return caps;
}

/** Quality decisions derived from capabilities (spec 08). */
export function sceneQuality(caps: Capabilities) {
  const live = caps.webgl && caps.gpuTier >= 2 && !caps.reducedMotion;
  const reducedLive = caps.webgl && caps.gpuTier < 2 && !caps.reducedMotion;
  // Counts tuned for main-thread + GPU headroom. The field reads as a dense
  // nebula well below 150k, so we stay conservative (spec 08).
  const particleCount =
    caps.gpuTier >= 3 ? 90_000 : caps.gpuTier === 2 ? 55_000 : 24_000;
  return {
    /** Full animated scene with morph + camera. */
    live,
    /** Lower-fidelity live scene (fewer particles, no bloom). */
    reducedLive,
    /** Show one static frame instead of animating. */
    staticFrame: caps.webgl && caps.reducedMotion,
    /** No canvas at all — poster fallback. */
    poster: !caps.webgl,
    particleCount,
    bloom: live && !caps.isMobile,
    dpr: caps.isMobile ? 1 : 2,
  };
}
