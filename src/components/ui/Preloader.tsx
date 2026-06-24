"use client";

// Intro loader. A real progress bar locked to the percentage counter, with
// status tags that tick over as it fills. At 100% it does NOT wipe up — it
// fades and hands off to the camera (markEntered), so the gate dollies you into
// the site. That handoff is the entrance.

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markEntered } from "@/lib/corridor";

const TAGS = [
  [0, "Initializing"],
  [22, "Loading assets"],
  [48, "Warming type"],
  [70, "Building corridor"],
  [88, "Calibrating camera"],
  [100, "Enter"],
] as const;

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        markEntered();
        gsap.to(ref.current, {
          autoAlpha: 0,
          duration: reduce ? 0 : 0.7,
          ease: "power2.inOut",
          onComplete: () => setDone(true),
        });
      };

      const apply = (v: number) => {
        const n = Math.round(v);
        if (countRef.current) countRef.current.textContent = String(n).padStart(2, "0");
        if (barRef.current) gsap.set(barRef.current, { scaleX: v / 100 });
        let label: string = TAGS[0][1];
        for (const [t, l] of TAGS) if (n >= t) label = l;
        if (tagRef.current && tagRef.current.textContent !== label)
          tagRef.current.textContent = label;
      };

      if (reduce) {
        apply(100);
        finish();
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();
      tl.to(counter, {
        v: 100,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => apply(counter.v),
      }).add(finish, "+=0.1");
    },
    { scope: ref }
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      className="preloader-overlay fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-10 md:px-10"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
        <span>Ahmed Mosaad — Portfolio</span>
        <span ref={tagRef} className="text-accent">
          Initializing
        </span>
      </div>

      {/* Counter + bar grouped at the bottom, so the percentage always sits
          DIRECTLY above the progress line (on mobile it used to float in the
          vertical middle, far from the bar). */}
      <div>
        <div className="flex items-end justify-between gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
            Full-Stack Developer
          </span>
          <span className="font-display text-[clamp(64px,18vw,220px)] leading-none text-text">
            <span ref={countRef}>00</span>
            <span className="text-accent">%</span>
          </span>
        </div>

        {/* Progress bar — locked to the counter */}
        <div className="mt-6 h-px w-full bg-line">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-accent"
            style={{
              transform: "scaleX(0)",
              boxShadow: "0 0 10px color-mix(in oklab, var(--color-accent) 80%, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
