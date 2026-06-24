"use client";

// Work chamber — a horizontal reel of full-frame PRESENTATION panels, not a list
// of articles. The camera TRUCKS sideways: an intro title, then one designed
// panel per project. Each project owns a distinct hue, a drifting gradient mesh,
// a huge ghost index and a tactile tilt — so the work looks art-directed even
// without a single screenshot. One pinned section, a single scrubbed translateX.
// GPU-only (transforms + CSS gradients), no Canvas, no images.
//
// Flat fallback: a calm vertical column of the same panels.

import { useRef } from "react";
import { MoveUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";
import { setChapter } from "@/lib/corridor";
import { useCinema } from "@/hooks/useCinema";
import { useTilt } from "@/hooks/useTilt";

// Cool, on-brand hues (mint sits at ~168) — one per project so each frame reads
// as its own identity while staying inside the corridor's palette.
const HUES = [168, 188, 150, 202, 174];

function PanelContent({ project, total }: { project: Project; total: number }) {
  return (
    <>
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
        <span>{project.category}</span>
        <span className="text-accent">
          [ {project.number} / {String(total).padStart(2, "0")} ]
        </span>
      </div>

      <h3 className="mt-5 font-display text-[clamp(40px,7vw,96px)] font-normal leading-[0.95] tracking-[-0.03em] text-text">
        {project.name}
      </h3>

      <div className="mt-7 h-px w-full bg-gradient-to-r from-accent/70 via-line to-transparent" />

      <p className="mt-7 max-w-2xl text-pretty text-[15px] leading-relaxed text-text-dim md:text-base">
        {project.brief}
      </p>

      <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] tracking-[0.05em] text-text-dim">
        {project.stack.map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            {s}
          </li>
        ))}
      </ul>

      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-text transition-colors hover:text-accent"
        aria-label={`${project.name} — open live site`}
      >
        Visit live
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent">
          <MoveUpRight size={15} />
        </span>
      </a>
    </>
  );
}

// A full-frame designed panel: drifting mesh + ghost index behind, tactile-tilt
// content in front. `hue` drives the whole identity via the --h CSS var.
function ProjectPanel({
  project,
  hue,
  total,
}: {
  project: Project;
  hue: number;
  total: number;
}) {
  const tiltRef = useTilt<HTMLDivElement>(5);
  return (
    <div className="relative h-full w-full bg-bg" style={{ ["--h" as string]: String(hue) }}>
      <span className="ghost-index" aria-hidden="true">
        {project.number}
      </span>

      <div className="relative z-10 grid h-full place-items-center px-6 md:px-12 lg:pl-[176px]">
        <div ref={tiltRef} className="depth-layer w-full max-w-[780px]">
          <PanelContent project={project} total={total} />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const cinema = useCinema();
  const N = projects.length;
  const frames = N + 1; // intro title frame + one per project

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!cinema || reduce) {
        gsap.from(".work-eyebrow, .work-title, .work-card", {
          opacity: 0,
          y: 40,
          duration: reduce ? 0.2 : 0.8,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        });
        return;
      }

      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      // Report the Work chapter while the pin owns the screen.
      gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setChapter(2);
          },
        },
      });

      const endPct = -((frames - 1) * 100) / frames;
      gsap.to(track, {
        xPercent: endPct,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: `+=${frames * 62}%`,
          pin: true,
          pinType: "transform", // pin via transform, not fixed → no CLS during scroll
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            const frame = Math.round(self.progress * (frames - 1));
            const idx = Math.max(1, frame); // 1..N
            const label = String(idx).padStart(2, "0");
            const el = counterRef.current;
            if (el && el.textContent !== label) el.textContent = label;
          },
        },
      });
    },
    { dependencies: [cinema, frames], scope: sectionRef }
  );

  // ── Cinematic side-truck reel ──────────────────────────────────────────
  if (cinema) {
    return (
      <section ref={sectionRef} id="work" aria-label="Selected work" className="relative">
        <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden bg-bg">
          {/* compact persistent header — guttered so it clears the chapter rail */}
          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-24 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim md:px-12 lg:pl-[176px]">
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent/50" />
              03 — Work
            </span>
            <span>
              <span ref={counterRef} className="tabular-nums text-accent">
                01
              </span>
              <span> / {String(N).padStart(2, "0")}</span>
            </span>
          </div>

          {/* horizontal reel */}
          <div ref={trackRef} className="flex h-full" style={{ width: `${frames * 100}%` }}>
            {/* intro title frame */}
            <div className="relative h-full shrink-0 bg-bg" style={{ width: `${100 / frames}%` }}>
              <div className="relative z-10 grid h-full place-items-center px-6 md:px-12 lg:pl-[176px]">
                <div className="w-full max-w-[780px]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
                    Selected work — {String(N).padStart(2, "0")} projects
                  </span>
                  <h2 className="mt-5 font-display text-[clamp(48px,10vw,150px)] font-normal leading-[0.92] tracking-[-0.03em] text-text">
                    Things I&rsquo;ve <span className="italic text-accent">built</span>.
                  </h2>
                  <p className="mt-7 max-w-md text-pretty text-text-dim">
                    Keep scrolling — they slide past one at a time. Pick one, open it, judge for
                    yourself.
                  </p>
                </div>
              </div>
            </div>

            {projects.map((p, i) => (
              <div key={p.id} className="relative h-full shrink-0" style={{ width: `${100 / frames}%` }}>
                <ProjectPanel project={p} hue={HUES[i % HUES.length]} total={N} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Flat column ────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      className="relative scroll-mt-24 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[960px]">
        <div className="work-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-accent/50" />
          <span>03 — Work</span>
        </div>
        <h2 className="work-title mt-4 font-display text-[clamp(40px,8vw,84px)] font-normal leading-[0.95] tracking-[-0.03em] text-text">
          Things I&rsquo;ve <span className="italic text-accent">built</span>.
        </h2>

        <div className="mt-16 flex flex-col gap-10">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="work-card relative overflow-hidden rounded-3xl border border-line bg-surface/30"
              style={{ ["--h" as string]: String(HUES[i % HUES.length]) }}
            >
              <span className="ghost-index" aria-hidden="true">
                {p.number}
              </span>
              <div className="relative z-10 p-8 md:p-12">
                <PanelContent project={p} total={N} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
