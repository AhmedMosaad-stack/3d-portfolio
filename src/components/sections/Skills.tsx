"use client";

// Stack chamber — three domain planes (Front-End / Back-End / Tools) at
// increasing depth. The camera pushes FORWARD through them: each plane rushes in
// from the distance, fills the frame and holds to be read (each skill carries a
// one-line descriptor of how it's used), then passes the camera. One pinned
// section, a single scrubbed timeline. GPU-only transforms, no Canvas.
//
// Flat fallback: the same planes stacked as a calm vertical list.

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skillPlanes, skillsClosingLine, type SkillPlane } from "@/data/skills";
import { setChapter } from "@/lib/corridor";
import { useCinema } from "@/hooks/useCinema";

function Plane({ plane, i, total }: { plane: SkillPlane; i: number; total: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[880px]">
      {/* big faint domain index watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 right-0 font-display text-[clamp(120px,22vw,300px)] leading-none text-text"
        style={{ opacity: 0.04 }}
      >
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
        <span className="flex items-center gap-3">
          <span className="h-px w-10 bg-accent/60" />
          {plane.title}
        </span>
        <span className="text-accent">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-5 max-w-xl font-display text-[clamp(22px,3.4vw,42px)] leading-tight text-text">
        {plane.blurb}
      </p>

      <ul className="mt-10 border-t border-line">
        {plane.items.map((s) => (
          <li
            key={s.name}
            className="grid grid-cols-[1fr] items-baseline gap-x-6 border-b border-line py-4 sm:grid-cols-[200px_1fr]"
          >
            <span className="font-display text-[20px] text-text">{s.name}</span>
            <span className="font-mono text-[12px] leading-relaxed tracking-[0.03em] text-text-dim">
              {s.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const planeRefs = useRef<HTMLElement[]>([]);
  const cinema = useCinema();
  const N = skillPlanes.length;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!cinema || reduce) {
        gsap.from(".skills-eyebrow, .skills-plane", {
          opacity: 0,
          y: 40,
          duration: reduce ? 0.2 : 0.8,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        });
        return;
      }

      const pin = pinRef.current;
      const planes = planeRefs.current.filter(Boolean);
      if (!pin || planes.length === 0) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setChapter(3);
          },
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: `+=${N * 85}%`,
          pin: true,
          pinType: "transform", // pin via transform, not fixed → no CLS during scroll
          anticipatePin: 1,
          scrub: 1,
        },
      });

      // Spacing > the per-plane span so only ONE plane is readable at a time
      // (no ghost overlap), while still crossing through depth.
      const S = 1.3;
      planes.forEach((el, i) => {
        const t0 = i * S;
        gsap.set(el, { z: -1500, autoAlpha: 0, scale: 0.92, rotationX: 6 });
        tl.to(el, { z: 0, autoAlpha: 1, scale: 1, rotationX: 0, ease: "power2.out", duration: 0.5 }, t0)
          .to(el, { z: 0, duration: 0.35 }, t0 + 0.5)
          .to(el, { z: 820, autoAlpha: 0, scale: 1.08, rotationX: -5, ease: "power2.in", duration: 0.45 }, t0 + 0.85);
      });
    },
    { dependencies: [cinema, N], scope: sectionRef }
  );

  // ── Cinematic depth planes ─────────────────────────────────────────────
  if (cinema) {
    return (
      <section ref={sectionRef} id="skills" aria-label="Skills and tooling" className="relative">
        <div ref={pinRef} className="stage relative h-[100svh] w-full overflow-hidden bg-bg">
          {/* lg:pl clears the fixed chapter rail — the pin detaches this section
              from main's lane, so it must gutter its own content. */}
          <div className="absolute inset-x-0 top-0 z-20 px-6 pt-24 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim md:px-12 lg:pl-[176px]">
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent/50" />
              04 — Stack
            </span>
          </div>

          {skillPlanes.map((plane, i) => (
            <div key={plane.id} className="absolute inset-0 grid place-items-center px-6 md:px-12 lg:pl-[176px]">
              <article
                ref={(el) => {
                  if (el) planeRefs.current[i] = el;
                }}
                className="depth-layer w-full"
              >
                <Plane plane={plane} i={i} total={N} />
              </article>
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-10 px-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim md:px-12 lg:pl-[176px]">
            {skillsClosingLine}
          </div>
        </div>
      </section>
    );
  }

  // ── Flat stack ─────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills and tooling"
      className="relative scroll-mt-24 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[880px]">
        <div className="skills-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-accent/50" />
          <span>04 — Stack</span>
        </div>
        <div className="mt-16 flex flex-col gap-24">
          {skillPlanes.map((plane, i) => (
            <div key={plane.id} className="skills-plane">
              <Plane plane={plane} i={i} total={N} />
            </div>
          ))}
        </div>
        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          {skillsClosingLine}
        </p>
      </div>
    </section>
  );
}
