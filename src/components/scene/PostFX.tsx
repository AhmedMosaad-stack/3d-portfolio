"use client";

// Selective bloom + subtle vignette (spec R16). Only mounted on capable
// desktop tiers — the parent decides whether to render this at all.

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.3} darkness={0.85} />
    </EffectComposer>
  );
}
