"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildMorphStates } from "./morphTargets";
import { particleVertexShader, particleFragmentShader } from "./shaders";
import { scrollState } from "@/lib/scrollState";

type Props = {
  count: number;
  /** false = render a single static frame (reduced-motion). */
  animate?: boolean;
  /** 0 disables mouse warp. */
  mouseStrength?: number;
};

export default function ParticleField({
  count,
  animate = true,
  mouseStrength = 1,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const sectionRef = useRef(-1);

  const { states, random, index, node } = useMemo(
    () => buildMorphStates(count),
    [count]
  );

  // Geometry is created once per particle set (pure). Per-section attribute
  // swaps happen in useFrame via the points ref, which is the allowed place to
  // perform imperative mutation (refs are mutable; memo returns are not).
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(states[0], 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(states[1], 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(random, 3));
    geo.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
    geo.setAttribute("aNode", new THREE.BufferAttribute(node, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return geo;
  }, [states, random, index, node]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: animate ? mouseStrength : 0 },
      uScatter: { value: animate ? 1.6 : 0 },
      uPointSize: { value: 2.2 },
      uActiveNode: { value: -1 },
      uPulse: { value: 0 },
      uColorA: { value: new THREE.Color("#00c9a0") },
      uColorB: { value: new THREE.Color("#3affe0") },
    }),
    [animate, mouseStrength]
  );

  useFrame((_, dt) => {
    const mat = matRef.current;
    const geo = pointsRef.current?.geometry;
    if (!mat || !geo) return;

    if (!animate) {
      mat.uniforms.uProgress.value = 0;
      return;
    }

    mat.uniforms.uTime.value += dt;

    const section = Math.min(Math.max(scrollState.section, 0), 4);
    const next = Math.min(section + 1, 4);

    if (section !== sectionRef.current) {
      sectionRef.current = section;
      geo.setAttribute("position", new THREE.BufferAttribute(states[section], 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(states[next], 3));
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aTarget.needsUpdate = true;
    }

    // At the final section there is no "next", so freeze progress.
    mat.uniforms.uProgress.value = section === 4 ? 0 : scrollState.local;

    // Smooth the mouse into the uniform.
    const m = mat.uniforms.uMouse.value as THREE.Vector2;
    m.x = THREE.MathUtils.damp(m.x, scrollState.mouse.x, 4, dt);
    m.y = THREE.MathUtils.damp(m.y, scrollState.mouse.y, 4, dt);

    // Pulse the hovered project node (R14). The index is set directly (no
    // interpolation, so we never flash neighbouring clusters); only the pulse
    // intensity ramps in/out.
    mat.uniforms.uActiveNode.value = scrollState.activeNode;
    const target = scrollState.activeNode >= 0 ? 1 : 0;
    const up = mat.uniforms.uPulse;
    up.value = THREE.MathUtils.damp(up.value, target, 8, dt);
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
