"use client";

import { useRef, useCallback } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { profile } from "@/data/profile";
import Terminal from "./Terminal";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const terminalWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shimmerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // quickTo setters per card — reused across mousemove instead of a fresh tween
  // each frame (gsap-performance). Built once after mount.
  type CardSetters = {
    rx: gsap.QuickToFunc;
    ry: gsap.QuickToFunc;
    sc: gsap.QuickToFunc;
    shx: gsap.QuickToFunc;
    shy: gsap.QuickToFunc;
    sho: gsap.QuickToFunc;
  };
  const settersRef = useRef<CardSetters[]>([]);

  useGSAP(() => {
    settersRef.current = cardRefs.current.map((card, i) => {
      const shimmer = shimmerRefs.current[i];
      return {
        rx: gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" }),
        ry: gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" }),
        sc: gsap.quickTo(card, "scale", { duration: 0.4, ease: "power2.out" }),
        shx: gsap.quickTo(shimmer, "x", { duration: 0.3 }),
        shy: gsap.quickTo(shimmer, "y", { duration: 0.3 }),
        sho: gsap.quickTo(shimmer, "opacity", { duration: 0.3 }),
      };
    });
  }, { scope: sectionRef });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, i: number) => {
      const card = cardRefs.current[i];
      const s = settersRef.current[i];
      if (!card || !s) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      s.ry(x * 8);
      s.rx(y * -6);
      s.sc(1.03);
      s.shx(e.clientX - rect.left);
      s.shy(e.clientY - rect.top);
      s.sho(1);
    },
    []
  );

  const handleMouseLeave = useCallback((_e: React.MouseEvent, i: number) => {
    const s = settersRef.current[i];
    if (!s) return;
    s.rx(0);
    s.ry(0);
    s.sc(1);
    s.sho(0);
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const build = () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });

        tl.from(eyebrowRef.current, {
          opacity: 0,
          y: 20,
          duration: reduce ? 0.2 : 0.7,
          ease: "power3.out",
        });

        if (headlineRef.current) {
          const split = new SplitText(headlineRef.current, {
            type: "words",
            mask: "words",
          });
          tl.from(
            split.words,
            {
              yPercent: 110,
              duration: reduce ? 0.2 : 0.9,
              ease: "expo.out",
              stagger: reduce ? 0 : 0.04,
            },
            "-=0.4"
          );
        }

        tl.from(
          paraRef.current,
          { opacity: 0, y: 24, duration: reduce ? 0.2 : 0.7, ease: "power3.out" },
          "-=0.4"
        )
          .from(
            cardRefs.current.filter(Boolean),
            {
              opacity: 0,
              y: 40,
              scale: 0.92,
              duration: reduce ? 0.2 : 0.8,
              stagger: reduce ? 0 : 0.12,
              ease: "expo.out",
            },
            "-=0.3"
          )
          .from(
            terminalWrapRef.current,
            { opacity: 0, y: 40, duration: reduce ? 0.2 : 0.9, ease: "expo.out" },
            "-=0.6"
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
      className="relative scroll-mt-24 border-t border-line px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 md:grid-cols-12 md:gap-12">
        <div ref={eyebrowRef} className="md:col-span-12">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
            <span className="h-px w-10 bg-text-dim/40" />
            <span>(01) About — Profile</span>
          </div>
        </div>

        <div className="md:col-span-7">
          <h2
            ref={headlineRef}
            className="font-display text-[clamp(34px,5.4vw,76px)] font-normal leading-[1.04] tracking-[-0.02em] text-text"
          >
            {profile.about.headline}
          </h2>

          <p
            ref={paraRef}
            className="mt-10 max-w-2xl text-pretty text-base leading-relaxed text-text-dim md:text-[17px]"
          >
            {profile.about.paragraph}
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3"
            style={{ perspective: "800px" }}
          >
            {profile.about.facts.map((f, i) => (
              <div
                key={f.k}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7"
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={(e) => handleMouseLeave(e, i)}
              >
                <div
                  ref={(el) => {
                    shimmerRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                  style={{
                    width: 180,
                    height: 180,
                    background:
                      "radial-gradient(circle, rgba(0,255,200,0.12) 0%, transparent 70%)",
                  }}
                />
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-text-dim/50">
                    {f.idx}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/40 transition-colors duration-300 group-hover:bg-accent" />
                </div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                  {f.k}
                </dt>
                <dd className="mt-2 font-display text-[22px] leading-snug text-text">
                  {f.v}
                </dd>
                <div className="mt-6 h-px w-full bg-line">
                  <div className="h-full w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div ref={terminalWrapRef} className="md:col-span-5">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
