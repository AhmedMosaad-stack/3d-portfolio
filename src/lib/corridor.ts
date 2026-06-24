// Corridor state — the spine of the cinematic journey.
//
// Per-frame values (scroll progress, light-wall dissolve) live OUTSIDE React so
// nothing setState's at 60fps. Discrete chapter changes are pushed to a tiny
// pub/sub the ChapterRail subscribes to, so the rail updates only when you
// actually cross into a new chamber — not every frame.

export type Chapter = { id: string; label: string; n: string };

// The five chambers, in corridor order. ids match section anchors + Lenis.
export const CHAPTERS: Chapter[] = [
  { id: "top", label: "Enter", n: "01" },
  { id: "about", label: "Profile", n: "02" },
  { id: "work", label: "Work", n: "03" },
  { id: "skills", label: "Stack", n: "04" },
  { id: "contact", label: "Contact", n: "05" },
];

// Mutable, module-level. Written by ScrollTriggers / timelines, read in useFrame.
export const corridor = {
  /** 0..1 dissolve of the hero light-wall (gate). */
  gate: 0,
  /** 0..1 entrance camera dolly, played once when the loader finishes. */
  intro: 0,
  /** index of the chamber currently held. */
  chapter: 0,
  /** true once the preloader has handed off to the site. */
  entered: false,
};

type ChapterListener = (chapter: number) => void;
const chapterListeners = new Set<ChapterListener>();

export function setChapter(i: number) {
  if (i === corridor.chapter) return;
  corridor.chapter = i;
  for (const l of chapterListeners) l(i);
}

export function onChapter(l: ChapterListener): () => void {
  chapterListeners.add(l);
  return () => chapterListeners.delete(l);
}

// Entrance handoff: the preloader calls markEntered() when it reaches 100%, and
// HeroGate plays the camera dolly-in. onEnter fires immediately if already in.
type EnterListener = () => void;
const enterListeners = new Set<EnterListener>();

export function markEntered() {
  if (corridor.entered) return;
  corridor.entered = true;
  for (const l of enterListeners) l();
}

export function onEnter(l: EnterListener): () => void {
  enterListeners.add(l);
  if (corridor.entered) l();
  return () => enterListeners.delete(l);
}
