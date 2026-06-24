// Module-level mutable store (spec 02/07). Written by the GSAP/ScrollTrigger
// layer + pointer listener, read inside useFrame. NEVER drive per-frame values
// through React state — that would re-render the tree 60x/s.

export type ScrollState = {
  /** Active morph state index 0..4 (hero..contact). */
  section: number;
  /** 0..1 progress within the current section transition (feeds uProgress). */
  local: number;
  /** Normalized pointer, -1..1 on each axis, origin center. */
  mouse: { x: number; y: number };
  /** Project node cluster (0..4) currently hovered, or -1 for none (R14). */
  activeNode: number;
};

export const scrollState: ScrollState = {
  section: 0,
  local: 0,
  mouse: { x: 0, y: 0 },
  activeNode: -1,
};

export const SECTION_IDS = [
  "top",
  "about",
  "work",
  "skills",
  "contact",
] as const;
