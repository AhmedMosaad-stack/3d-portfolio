"use client";

import { useRef } from "react";
import { MoveRight, Download } from "lucide-react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { MagneticLink } from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/hooks/useLenis";
import { profile } from "@/data/profile";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const metaBotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const build = () => {
        const tl = gsap.timeline({ delay: reduce ? 0 : 0.35 });

        tl.from([metaTopRef.current], {
          opacity: 0,
          y: 12,
          duration: reduce ? 0.2 : 0.8,
          ease: "power3.out",
        });

        [nameRef.current, roleRef.current].forEach((el, i) => {
          if (!el) return;
          const split = new SplitText(el, { type: "chars", mask: "chars" });
          tl.from(
            split.chars,
            {
              yPercent: 115,
              opacity: 0,
              duration: reduce ? 0.2 : 0.9,
              ease: "expo.out",
              stagger: reduce ? 0 : 0.02,
            },
            i === 0 ? "-=0.3" : "-=0.6"
          );
        });

        if (subRef.current) {
          const subSplit = new SplitText(subRef.current, {
            type: "words",
            mask: "words",
          });
          tl.from(
            subSplit.words,
            {
              yPercent: 110,
              opacity: 0,
              duration: reduce ? 0.2 : 0.7,
              ease: "expo.out",
              stagger: reduce ? 0 : 0.03,
            },
            "-=0.5"
          );
        }

        tl.from(
          ctaRef.current?.children ?? [],
          {
            opacity: 0,
            y: 18,
            duration: reduce ? 0.2 : 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.4"
        ).from(
          metaBotRef.current,
          { opacity: 0, y: 16, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        );
      };

      // Split after fonts load to avoid wrong glyph metrics.
      if (document.fonts?.ready) {
        document.fonts.ready.then(build);
      } else {
        build();
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden"
      aria-label="Introduction"
    >
      <div
        ref={metaTopRef}
        className="flex items-center justify-between px-6 pt-24 md:px-10 md:pt-28"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text backdrop-blur-sm">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {profile.status}
        </span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim md:inline">
          {profile.location}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-10">
        <h1 className="font-display text-text">
          <span
            ref={nameRef}
            className="block overflow-hidden text-[clamp(48px,11vw,180px)] font-normal leading-[0.95] tracking-[-0.03em]"
          >
            {profile.name}
          </span>
          <span
            ref={roleRef}
            className="block overflow-hidden text-[clamp(34px,7vw,120px)] font-normal italic leading-[0.98] tracking-[-0.03em] text-text-dim"
          >
            {profile.role}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-10 max-w-xl text-pretty text-base text-text-dim md:text-lg"
        >
          {profile.tagline}
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticLink
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("work");
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-bg transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(0,255,200,0.6)]"
          >
            <span>View My Work</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-bg/15 transition-transform duration-500 group-hover:translate-x-1">
              <MoveRight size={14} />
            </span>
          </MagneticLink>
          <MagneticLink
            href={profile.cvHref}
            download="Ahmed_Mosaad_CV.pdf"
            aria-label="Download Ahmed Mosaad CV"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            <Download size={14} />
            <span>Download CV</span>
          </MagneticLink>
        </div>
      </div>

      <div
        ref={metaBotRef}
        className="grid grid-cols-2 items-start gap-x-4 gap-y-6 border-t border-line px-6 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim md:grid-cols-3 md:items-end md:px-10"
      >
        <div>
          <div className="mb-1 text-text-dim/60">[ Location ]</div>
          <div className="text-text">Alexandria · Egypt</div>
        </div>
        <div>
          <div className="mb-1 text-text-dim/60">[ Focus ]</div>
          <div className="text-text">{profile.focus.join(" · ")}</div>
        </div>
        <div className="hidden md:block">
          <div className="mb-1 text-text-dim/60">[ Status ]</div>
          <div className="text-text">Open to roles</div>
        </div>
      </div>
    </section>
  );
}
