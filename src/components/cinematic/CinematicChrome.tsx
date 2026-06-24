"use client";

// Wayfinding chrome (chapter rail + scroll progress) that stays HIDDEN during the
// fullscreen hero entrance and fades in only once you cross into About — so the
// entrance is pure, edge-to-edge cinema with no UI furniture on screen.
//
// The fade is driven by a single ScrollTrigger on the hero, not React state.

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import ChapterRail from "./ChapterRail";
import ScrollProgress from "./ScrollProgress";

export default function CinematicChrome() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0 });

    // Reveal once About is genuinely on screen (not mid hero-dissolve); hide
    // again if you scroll back into the fullscreen entrance.
    const st = ScrollTrigger.create({
      trigger: "#about",
      start: "top 55%",
      onEnter: () => gsap.to(el, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref}>
      <ScrollProgress />
      <ChapterRail />
    </div>
  );
}
