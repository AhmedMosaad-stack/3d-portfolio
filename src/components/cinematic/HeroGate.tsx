"use client";

// Hero AND gate, unified. You open already inside the corridor: your name stands
// on a dark glass light-wall. When the loader hits 100% the camera dollies IN
// (corridor.intro) and the name resolves — that is the entrance. Scroll then
// dissolves the wall into mint light and hands off to About.
//
// Flat fallback: a calm static hero with the same content, no Canvas / pin.

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MoveRight, Download } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { corridor, onEnter } from "@/lib/corridor";
import { useCinema } from "@/hooks/useCinema";
import { scrollToSection } from "@/hooks/useLenis";
import { MagneticLink } from "@/components/ui/MagneticButton";
import { profile } from "@/data/profile";

// Code-split: three.js loads only when the gate canvas actually mounts.
const GateCanvas = dynamic(() => import("./GateCanvas"), { ssr: false });

export default function HeroGate() {
  const cinema = useCinema();
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useGSAP(
    () => {
      if (!cinema) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pin = pinRef.current;
      if (!pin) return;

      // Hide the name until the camera arrives.
      // aria:"none" stops SplitText from putting an aria-label on the <span>
      // (prohibited ARIA on a roleless span). The accessible name comes from the
      // sr-only line in the markup instead.
      const splits = [nameRef.current, roleRef.current]
        .filter(Boolean)
        .map((el) => new SplitText(el as HTMLElement, { type: "chars", mask: "chars", aria: "none" }));
      gsap.set(
        splits.flatMap((s) => s.chars),
        { yPercent: 120, opacity: 0 }
      );
      gsap.set(cueRef.current, { autoAlpha: 0 });

      // Entrance: camera dollies in (corridor.intro), name + cue resolve.
      const reveal = () => {
        gsap.to(corridor, { intro: 1, duration: reduce ? 0 : 1.7, ease: "power2.out" });
        const tl = gsap.timeline({ delay: reduce ? 0 : 0.35 });
        splits.forEach((s, i) => {
          tl.to(
            s.chars,
            {
              yPercent: 0,
              opacity: 1,
              duration: reduce ? 0.2 : 0.9,
              ease: "expo.out",
              stagger: reduce ? 0 : 0.025,
            },
            i === 0 ? 0 : "-=0.6"
          );
        });
        tl.to(cueRef.current, { autoAlpha: 1, duration: reduce ? 0.2 : 0.7, ease: "power3.out" }, "-=0.3");
      };
      const off = onEnter(reveal);

      // Mount the Canvas while the gate could be on screen. The generous bottom
      // margin keeps it mounted a little into About, so scrolling BACK up re-forms
      // the lit wall immediately instead of flashing black on a remount.
      ScrollTrigger.create({
        trigger: pin,
        start: "top bottom",
        end: "bottom top-=80%",
        onToggle: (self) => setNear(self.isActive),
      });

      // Pin the gate and scrub the wall dissolve across ~0.9 viewport — short, so
      // you are not scrolling through darkness to get in.
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=90%",
        pin: true,
        pinType: "transform", // pin via transform, not fixed → no CLS during scroll
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          corridor.gate = self.progress;
        },
      });

      // Overlay blooms forward + fades as the wall dissolves.
      gsap.fromTo(
        contentRef.current,
        { scale: 1, autoAlpha: 1 },
        {
          scale: 1.4,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: "+=60%", scrub: true },
        }
      );
      gsap.fromTo(
        cueRef.current,
        { y: 0 },
        {
          y: -24,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: "+=18%", scrub: true },
        }
      );

      return () => off();
    },
    { dependencies: [cinema], scope: pinRef }
  );

  // ── Flat fallback ────────────────────────────────────────────────────────
  if (!cinema) {
    return (
      <section
        id="top"
        aria-label="Introduction"
        className="relative flex min-h-[100svh] flex-col justify-center px-6 py-28 md:px-10"
      >
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {profile.status}
        </span>

        <h1 className="mt-10 font-display text-text">
          <span className="block text-[clamp(48px,12vw,120px)] font-normal leading-[0.95] tracking-[-0.03em]">
            {profile.name}
          </span>
          <span className="block text-[clamp(30px,7vw,72px)] font-normal italic leading-[1] tracking-[-0.03em] text-text-dim">
            {profile.role}
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-pretty text-base text-text-dim">{profile.tagline}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("work");
            }}
            className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-bg"
          >
            View My Work <MoveRight size={14} />
          </a>
          <a
            href={profile.cvHref}
            download="Ahmed_Mosaad_CV.pdf"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-text"
          >
            <Download size={14} /> Download CV
          </a>
        </div>
      </section>
    );
  }

  // ── Cinematic gate ───────────────────────────────────────────────────────
  return (
    <section id="top" aria-label="Introduction — enter the work" className="relative">
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden bg-bg">
        {near && <GateCanvas />}

        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="mb-6 font-mono text-[11px] uppercase tracking-[0.4em] text-text-dim">
            {profile.role}
          </span>
          <h1 className="font-display text-text">
            <span className="sr-only">{profile.name} — come see what I build</span>
            <span
              ref={nameRef}
              aria-hidden="true"
              className="block overflow-hidden text-[clamp(60px,12vw,200px)] font-normal leading-[0.9] tracking-[-0.03em]"
              style={{ textShadow: "0 0 38px color-mix(in oklab, var(--color-accent) 14%, transparent)" }}
            >
              {profile.name}
            </span>
            <span
              ref={roleRef}
              aria-hidden="true"
              className="mt-2 block overflow-hidden font-display text-[clamp(16px,2.4vw,30px)] font-normal italic tracking-[0.02em] text-text-dim"
            >
              come see what I build
            </span>
          </h1>
        </div>

        <div ref={cueRef} className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-4">
          <div className="pointer-events-auto flex items-center gap-3">
            <MagneticLink
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("work");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
            >
              View Work <MoveRight size={13} />
            </MagneticLink>
            <MagneticLink
              href={profile.cvHref}
              download="Ahmed_Mosaad_CV.pdf"
              aria-label="Download CV"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim"
            >
              <Download size={13} /> CV
            </MagneticLink>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
            Scroll to enter
          </span>
          <span className="h-10 w-px animate-pulse bg-accent/60" />
        </div>
      </div>
    </section>
  );
}
