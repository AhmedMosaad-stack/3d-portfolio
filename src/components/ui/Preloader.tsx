"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Intro loader (spec R18). Counts to 100 while fonts warm up, then wipes away.
// When the 3D scene lands (Phase 3) this can be wired to drei useProgress.
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const hide = () => {
        gsap.to(ref.current, {
          yPercent: -100,
          duration: reduce ? 0 : 0.9,
          ease: "expo.inOut",
          onComplete: () => setDone(true),
        });
      };

      if (reduce) {
        if (countRef.current) countRef.current.textContent = "100";
        hide();
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();
      tl.to(counter, {
        v: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = String(Math.round(counter.v));
        },
      }).add(hide, "+=0.15");

      // Don't finish before fonts are ready (avoids flash of fallback type).
      document.fonts?.ready.then(() => tl.play());
    },
    { scope: ref }
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex items-end justify-between bg-bg px-6 pb-10 md:px-10"
      aria-hidden="true"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
        Ahmed Mosaad — Portfolio
      </span>
      <span className="font-display text-[clamp(64px,18vw,220px)] leading-none text-text">
        <span ref={countRef}>0</span>
        <span className="text-accent">%</span>
      </span>
    </div>
  );
}
