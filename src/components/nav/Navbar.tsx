"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToSection } from "@/hooks/useLenis";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.from(navRef.current, {
        y: -24,
        opacity: 0,
        duration: reduce ? 0.2 : 0.9,
        delay: 0.2,
        ease: "power3.out",
      });

      if (reduce || !contextSafe) return;

      const links =
        navRef.current?.querySelectorAll<HTMLElement>("[data-scramble]") ?? [];
      links.forEach((link) => {
        const text = link.dataset.scramble ?? link.textContent ?? "";
        const onEnter = contextSafe(() => {
          gsap.to(link, {
            duration: 0.5,
            scrambleText: { text, chars: "01<>/", speed: 0.4 },
          });
        });
        link.addEventListener("mouseenter", onEnter);
      });
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10"
    >
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("top");
        }}
        className="font-display text-xl tracking-tight text-text transition-colors hover:text-accent"
        aria-label={`${profile.name} — back to top`}
      >
        AM<span className="text-accent">.</span>
      </a>

      <div className="flex items-center gap-1 md:gap-2">
        <ul className="mr-2 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                data-scramble={l.label}
                onClick={() => scrollToSection(l.id)}
                className="rounded-full px-3 py-2 font-mono text-[12px] uppercase tracking-[0.15em] text-text-dim transition-colors hover:text-accent"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/AhmedMosaad-stack"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-dim transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon width={15} height={15} />
        </a>
        <a
          href="https://www.linkedin.com/in/ahmed-mosaad-mohamed-690234364"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-dim transition-colors hover:border-accent hover:text-accent"
        >
          <LinkedinIcon width={15} height={15} />
        </a>
        <a
          href={profile.cvHref}
          download="Ahmed_Mosaad_CV.pdf"
          className="ml-1 hidden rounded-full border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-[0.15em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block"
        >
          CV
        </a>
      </div>
    </nav>
  );
}
