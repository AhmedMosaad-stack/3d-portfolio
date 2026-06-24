"use client";

// Decides whether the full cinematic corridor runs. It runs ONLY when:
//   - the pointer is fine (real mouse, i.e. desktop),
//   - the viewport is wide (>= 1024px), and
//   - the user has not asked for reduced motion.
//
// SSR + first paint return `false`, so the server renders the calm flat layout
// (the accessible base). On mount we upgrade to cinematic if the device
// qualifies. This is why mobile / reduced-motion users transparently get the
// flat vertical-scroll fallback with no Canvas, no pin, no scrub.

import { useEffect, useState } from "react";

const QUERIES = [
  "(min-width: 1024px)",
  "(pointer: fine)",
  "(prefers-reduced-motion: no-preference)",
];

export function useCinema(): boolean {
  const [cinema, setCinema] = useState(false);

  useEffect(() => {
    const mqs = QUERIES.map((q) => window.matchMedia(q));
    const compute = () => setCinema(mqs.every((m) => m.matches));
    compute();
    mqs.forEach((m) => m.addEventListener("change", compute));
    return () => mqs.forEach((m) => m.removeEventListener("change", compute));
  }, []);

  return cinema;
}
