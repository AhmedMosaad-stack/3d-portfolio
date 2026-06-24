"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const build = () => {
        gsap.from(".projects-eyebrow", {
          opacity: 0,
          y: 24,
          duration: reduce ? 0.2 : 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });

        if (titleRef.current) {
          const split = new SplitText(titleRef.current, {
            type: "words",
            mask: "words",
          });
          gsap.from(split.words, {
            yPercent: 110,
            duration: reduce ? 0.2 : 0.9,
            ease: "expo.out",
            stagger: reduce ? 0 : 0.05,
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
          });
        }

        if (reduce) {
          gsap.set(".project-card", { opacity: 1, y: 0 });
          return;
        }

        gsap.set(".project-card", { opacity: 0, y: 60 });
        ScrollTrigger.batch(".project-card", {
          start: "top 85%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.12,
              overwrite: true,
            }),
        });
      };

      if (document.fonts?.ready) document.fonts.ready.then(build);
      else build();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-24 border-t border-line px-6 py-28 md:px-10 md:py-40"
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="projects-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-text-dim/40" />
          <span>(02) Work — selected projects</span>
        </div>
        <h2
          ref={titleRef}
          className="mt-6 max-w-3xl font-display text-[clamp(40px,7vw,110px)] font-normal leading-[0.95] tracking-[-0.03em] text-text"
        >
          Things I&rsquo;ve <span className="italic text-accent">built</span>.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
