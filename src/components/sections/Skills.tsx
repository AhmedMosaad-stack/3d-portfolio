"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skillGroups, skillsMarquee, skillsClosingLine } from "@/data/skills";
import Marquee from "./Marquee";

const DOT_COLORS = ["var(--color-accent)", "#0ea5e9", "#ff8a3d"];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.from(".skills-eyebrow, .skills-title, .skills-sub", {
        opacity: 0,
        y: 40,
        duration: reduce ? 0.2 : 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.from(".skill-tag", {
        opacity: 0,
        y: 20,
        duration: reduce ? 0.2 : 0.6,
        stagger: { each: reduce ? 0 : 0.03, from: "start" },
        ease: "power3.out",
        scrollTrigger: { trigger: ".skill-grid", start: "top 80%" },
      });

      if (reduce) return;

      const tags = gsap.utils.toArray<HTMLElement>(".skill-tag", sectionRef.current);
      tags.forEach((t) => {
        t.addEventListener("mouseenter", () =>
          gsap.to(t, { y: -3, scale: 1.06, duration: 0.7, ease: "elastic.out(1, 0.4)" })
        );
        t.addEventListener("mouseleave", () =>
          gsap.to(t, { y: 0, scale: 1, duration: 0.5, ease: "power3.out" })
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-28 md:py-36"
      aria-label="Skills and tooling"
    >
      <div className="mx-auto mb-16 max-w-[1400px] px-6 md:px-10">
        <div className="skills-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-text-dim/40" />
          <span>(03) Stack — what I reach for daily</span>
        </div>
        <h2 className="skills-title mt-6 font-display text-[clamp(40px,7.5vw,120px)] font-normal leading-[0.95] tracking-[-0.03em] text-text">
          Toolkit, tuned for <span className="italic text-accent">motion</span>.
        </h2>
        <p className="skills-sub mt-6 max-w-xl text-pretty text-text-dim">
          Front-end is where I live, but I&rsquo;m equally fluent on the server
          when a project calls for it.
        </p>
      </div>

      <div className="space-y-2">
        <Marquee items={skillsMarquee} direction="left" speed={45} />
        <Marquee items={skillsMarquee} direction="right" speed={36} />
      </div>

      <div className="skill-grid mx-auto mt-24 grid max-w-[1400px] grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {skillGroups.map((g, gi) => (
          <div key={g.title} className="bg-bg p-8 md:p-10">
            <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: DOT_COLORS[gi] }}
              />
              <span>{g.title}</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="skill-tag cursor-default rounded-full border border-line bg-surface px-4 py-2 font-mono text-[12px] tracking-[0.05em] text-text transition-colors hover:border-accent hover:text-accent"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] px-6 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim md:px-10">
        {skillsClosingLine}
      </div>
    </section>
  );
}
