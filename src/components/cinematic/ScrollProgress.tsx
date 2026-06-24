"use client";

// A 1px mint line across the top that fills with overall scroll progress.
// Driven by a single ScrollTrigger writing scaleX — no React state per frame.
// Cinematic chrome only.

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
    });
    return () => st.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full"
        style={{
          background: "var(--color-accent)",
          boxShadow: "0 0 10px color-mix(in oklab, var(--color-accent) 80%, transparent)",
        }}
      />
    </div>
  );
}
