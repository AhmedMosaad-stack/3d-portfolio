"use client";

// Lenis smooth scroll wired to GSAP (spec 07 §2). Critical handshake:
//  - Lenis tells ScrollTrigger to recompute on scroll.
//  - GSAP ticker drives Lenis (single clock, no double RAF).
// Also writes global scroll progress into scrollState each scroll.

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);
}

/** Smooth-scroll to a section id via Lenis (fallback to native). */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth" });
}
