"use client";

// Tactile 3D tilt — the element leans toward the cursor like a held card, then
// springs back on leave. gsap.quickTo reuses one tween per axis (gsap-performance),
// so mousemove stays cheap. Auto-disabled under reduced-motion / coarse pointer.
//
// Returns a ref. Put it on a transform-safe element (its own layer). Keep `max`
// small (4–7deg) so it reads as "alive", not as a gimmick.

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function useTilt<T extends HTMLElement>(max: number = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      rotY(px * max);
      rotX(-py * max);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);

  return ref;
}
