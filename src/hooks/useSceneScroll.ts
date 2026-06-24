"use client";

// Bridges scroll + pointer into the mutable scrollState the R3F scene reads
// (spec 02/07). Creates one ScrollTrigger per section that writes the active
// section index and the local 0..1 progress through it. No React state — these
// fire every frame and must not re-render.

import { useEffect } from "react";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { scrollState, SECTION_IDS } from "@/lib/scrollState";

export function useSceneScroll(enabled: boolean = true) {
  // Section triggers (GSAP-managed, auto-cleaned by useGSAP).
  useGSAP(
    () => {
      if (!enabled) return;

      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onUpdate: (self) => {
            scrollState.section = i;
            scrollState.local = self.progress;
          },
          onEnter: () => {
            scrollState.section = i;
          },
          onEnterBack: () => {
            scrollState.section = i;
          },
        });
      });

      // Ensure positions are correct once fonts/layout settle.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
    },
    { dependencies: [enabled] }
  );

  // Pointer → normalized mouse (-1..1), throttled via rAF.
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);
}
