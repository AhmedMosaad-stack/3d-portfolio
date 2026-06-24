// GLSL for the morphing point cloud (spec 05). Morph + scatter + ambient drift
// + mouse warp happen on the GPU. One draw call, additive glow.

export const particleVertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  uniform float uScatter;
  uniform float uPointSize;
  uniform float uActiveNode;
  uniform float uPulse;

  attribute vec3  aTarget;
  attribute vec3  aRandom;
  attribute float aIndex;
  attribute float aNode;

  varying float vIntensity;
  varying float vAlpha;
  varying float vBoost;

  void main() {
    // 1. eased morph from current state -> next state
    float p = smoothstep(0.0, 1.0, uProgress);
    vec3 pos = mix(position, aTarget, p);

    // 2. mid-transition scatter (peaks at progress 0.5)
    float scatter = sin(uProgress * 3.14159265) * uScatter;
    pos += normalize(aRandom + 0.0001) * scatter * (0.5 + 0.5 * aRandom.y);

    // 3. ambient drift so the field always breathes
    float t = uTime * 0.25;
    pos.x += sin(t + aIndex * 0.001 + aRandom.x * 6.28) * 0.12;
    pos.y += cos(t + aIndex * 0.0013 + aRandom.y * 6.28) * 0.12;
    pos.z += sin(t * 0.7 + aRandom.z * 6.28) * 0.10;

    // 4. mouse warp — push points near the projected pointer on the z=0 plane
    vec3 mouseWorld = vec3(uMouse.x * 9.0, uMouse.y * 5.0, 0.0);
    vec3 toPoint = pos - mouseWorld;
    float d = length(toPoint.xy);
    float influence = smoothstep(4.0, 0.0, d) * uMouseStrength;
    pos += normalize(toPoint + 0.0001) * influence * 1.6;

    // node pulse: when the matching project card is hovered (R14), the points
    // of that cluster swell and brighten. uActiveNode = -1 means none.
    float nodeMatch = step(abs(aNode - uActiveNode), 0.5) * uPulse;
    vBoost = nodeMatch;
    pos += normalize(aRandom + 0.0001) * nodeMatch * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // size attenuated by depth + per-particle jitter
    float sizeJitter = 0.6 + 0.8 * (aRandom.x * 0.5 + 0.5);
    gl_PointSize = uPointSize * sizeJitter * (1.0 + nodeMatch * 1.4) * (300.0 / -mvPosition.z);

    vIntensity = aRandom.z * 0.5 + 0.5;
    vAlpha = 0.28 + 0.30 * (aRandom.y * 0.5 + 0.5);
  }
`;

export const particleFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vIntensity;
  varying float vAlpha;
  varying float vBoost;

  void main() {
    // soft round point
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * min(1.0, vAlpha + vBoost * 0.5);

    vec3 col = mix(uColorA, uColorB, vIntensity + vBoost * 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;
