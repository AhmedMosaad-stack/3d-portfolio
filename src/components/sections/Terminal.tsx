"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Line = { prompt: string; out: string };

const LINES: Line[] = [
  { prompt: "whoami", out: "ahmed_mosaad — full-stack developer" },
  { prompt: "cat focus.txt", out: "front-end · back-end · motion" },
  { prompt: "stack --list", out: "React · Next.js · TypeScript · Node.js" },
  { prompt: "status", out: "available for work ✓" },
];

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const outs = gsap.utils.toArray<HTMLElement>(".term-out", ref.current);
      const prompts = gsap.utils.toArray<HTMLElement>(
        ".term-prompt",
        ref.current
      );

      if (reduce) {
        gsap.set([...outs, ...prompts], { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });

      LINES.forEach((line, i) => {
        tl.set(prompts[i], { opacity: 1, text: "" })
          .to(prompts[i], {
            duration: 0.5,
            text: { value: `$ ${line.prompt}` },
            ease: "none",
          })
          .to(
            outs[i],
            { opacity: 1, duration: 0.3, ease: "power2.out" },
            "+=0.1"
          );
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-line bg-surface font-mono text-[13px] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] text-text-dim">— ahmed@portfolio</span>
      </div>
      <div className="space-y-3 p-5">
        {LINES.map((line) => (
          <div key={line.prompt}>
            <div className="term-prompt text-accent opacity-0">
              $ {line.prompt}
            </div>
            <div className="term-out mt-1 pl-3 text-text-dim opacity-0">
              {line.out}
            </div>
          </div>
        ))}
        <div className="flex items-center text-accent">
          $&nbsp;<span className="inline-block h-4 w-2 animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  );
}
