"use client";

// Lenis smooth scroll wired to GSAP (spec 07 §2). Critical handshake:
//  - Lenis tells ScrollTrigger to recompute on scroll.
//  - GSAP ticker drives Lenis (single clock, no double RAF).
//
// Lenis is loaded ONLY on the cinematic path, via a dynamic import, so the flat
// (mobile / reduced-motion) bundle never ships it — those users scroll natively
// and ScrollTrigger listens to native scroll. `scrollToSection` falls back to
// native smooth scroll when Lenis isn't present.

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis(enabled: boolean = true) {
  useEffect(() => {
    // Always boot at the very top (browsers restore the previous scroll on
    // reload). Do this even on the flat path.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (!enabled) return;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let raf = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisInstance = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.scrollTo(0, { immediate: true });

      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Recompute trigger positions after first layout + once fonts settle.
      const refresh = () => ScrollTrigger.refresh();
      raf = requestAnimationFrame(refresh);
      document.fonts?.ready.then(refresh);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
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
