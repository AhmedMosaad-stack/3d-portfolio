"use client";

// About chamber — editorial, no boxed card. A large serif statement, a short
// paragraph, and the facts woven in as fine-rule rows. The camera cranes down
// onto it (handled by the Chamber wrapper). Clean reveal on scroll.

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { profile } from "@/data/profile";

const ROWS = [
  { k: "Currently", v: "Open to opportunities" },
  { k: "Based in", v: "Alexandria, Egypt" },
  { k: "Focus", v: "Full-stack engineering" },
  { k: "Stack", v: "React · TypeScript · Node · Next.js" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const build = () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        });

        tl.from(".about-eyebrow", {
          opacity: 0,
          y: 20,
          duration: reduce ? 0.2 : 0.7,
          ease: "power3.out",
        });

        if (headlineRef.current) {
          const split = new SplitText(headlineRef.current, { type: "words", mask: "words" });
          tl.from(
            split.words,
            {
              yPercent: 110,
              duration: reduce ? 0.2 : 0.9,
              ease: "expo.out",
              stagger: reduce ? 0 : 0.035,
            },
            "-=0.35"
          );
        }

        tl.from(
          ".about-para",
          { opacity: 0, y: 24, duration: reduce ? 0.2 : 0.7, ease: "power3.out" },
          "-=0.4"
        ).from(
          ".about-row",
          {
            opacity: 0,
            y: 26,
            duration: reduce ? 0.2 : 0.7,
            stagger: reduce ? 0 : 0.09,
            ease: "expo.out",
          },
          "-=0.3"
        );
      };

      if (document.fonts?.ready) document.fonts.ready.then(build);
      else build();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative scroll-mt-24 bg-bg px-6 py-28 md:px-10 md:py-40"
      aria-label="About"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="about-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-accent/50" />
          <span>02 — Profile</span>
        </div>

        <h2
          ref={headlineRef}
          className="mt-10 max-w-[16ch] font-display text-[clamp(40px,7vw,104px)] font-normal leading-[0.98] tracking-[-0.02em] text-text"
        >
          I obsess over <span className="italic text-accent">every layer</span> of
          the stack.
        </h2>

        <p className="about-para mt-10 max-w-2xl text-pretty text-base leading-relaxed text-text-dim md:text-[17px]">
          {profile.about.paragraph}
        </p>

        <dl className="mt-16 border-t border-line">
          {ROWS.map((r) => (
            <div
              key={r.k}
              className="about-row grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-b border-line py-6 md:grid-cols-[220px_1fr] md:py-7"
            >
              <dt className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
                <span className="hidden h-px w-8 bg-accent/60 md:inline-block" />
                {r.k}
              </dt>
              <dd className="font-display text-[clamp(20px,2.6vw,34px)] leading-snug text-text">
                {r.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
