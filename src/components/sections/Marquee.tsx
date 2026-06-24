"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = { items: string[]; direction?: "left" | "right"; speed?: number };

export default function Marquee({
  items,
  direction = "left",
  speed = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return; // static row when reduced-motion

      const track = ref.current?.querySelector<HTMLElement>(".marquee-track");
      if (!track) return;
      const distance = track.scrollWidth / 2; // two copies rendered
      const from = direction === "left" ? 0 : -distance;
      const to = direction === "left" ? -distance : 0;

      gsap.fromTo(
        track,
        { x: from },
        {
          x: to,
          duration: distance / speed,
          ease: "none",
          repeat: -1,
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="overflow-hidden" aria-hidden="true">
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap will-change-transform">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-[clamp(28px,5vw,64px)] italic text-text-dim/40"
          >
            {item}
            <span className="px-4 not-italic text-accent/50">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
