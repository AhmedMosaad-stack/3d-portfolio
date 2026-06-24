"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Mail, MoveUpRight, Copy, Check } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";

const ROWS = [
  {
    label: "GitHub",
    handle: "AhmedMosaad-stack",
    href: "https://github.com/AhmedMosaad-stack",
    Icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    handle: "in/ahmed-mosaad-mohamed-690234364",
    href: "https://www.linkedin.com/in/ahmed-mosaad-mohamed-690234364",
    Icon: LinkedinIcon,
  },
  {
    label: "Facebook",
    handle: "ahmed.mosad.397948",
    href: "https://www.facebook.com/ahmed.mosad.397948",
    Icon: FacebookIcon,
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      gsap.from(".contact-eyebrow, .contact-title, .contact-sub", {
        opacity: 0,
        y: 40,
        duration: reduce ? 0.2 : 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".contact-row", {
        opacity: 0,
        y: 30,
        duration: reduce ? 0.2 : 0.7,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-list", start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-line px-6 py-28 md:px-10 md:py-40"
      aria-label="Contact"
    >
      <div
        className="pointer-events-none absolute -bottom-1/2 left-1/2 -z-0 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl md:h-[80vw] md:w-[80vw]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,255,200,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="contact-eyebrow flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span className="h-px w-10 bg-text-dim/40" />
          <span>(04) Contact — direct lines</span>
        </div>

        <h2 className="contact-title mt-8 font-display text-[clamp(64px,15vw,240px)] font-normal leading-[0.92] tracking-[-0.04em] text-text">
          Let&rsquo;s
          <br />
          <span
            className="italic"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #00ffc8 10%, #f0f0f0 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            connect.
          </span>
        </h2>
        <p className="contact-sub mt-6 max-w-xl text-pretty text-base text-text-dim md:text-lg">
          Open to new roles, freelance projects, and collaborations. The inbox is
          quiet, fast, and friendly.
        </p>

        <ul className="contact-list mt-16 divide-y divide-line border-y border-line">
          <li className="contact-row group relative">
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email ${profile.email}`}
              className="flex w-full items-center justify-between gap-4 py-7 text-left md:py-9"
            >
              <span className="flex min-w-0 flex-1 items-center gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent md:h-12 md:w-12">
                  <Mail size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                    Email · click to copy
                  </span>
                  <span className="mt-1 block break-all font-display text-[clamp(22px,4.5vw,64px)] text-text transition-colors group-hover:text-accent">
                    {profile.email}
                  </span>
                </span>
              </span>
              <span
                aria-live="polite"
                className="hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim transition-transform duration-500 group-hover:-translate-x-2 sm:flex"
              >
                {copied ? (
                  <span className="flex items-center gap-2 text-accent">
                    <Check size={14} /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy size={14} /> Copy
                  </span>
                )}
              </span>
            </button>
          </li>

          {ROWS.map(({ label, handle, href, Icon }) => (
            <li key={label} className="contact-row group relative">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 py-7 md:py-9"
              >
                <span className="flex min-w-0 flex-1 items-center gap-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent md:h-12 md:w-12">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                      {label}
                    </span>
                    <span className="mt-1 block break-words font-display text-[clamp(22px,3.6vw,48px)] text-text transition-colors group-hover:text-accent">
                      {handle}
                    </span>
                  </span>
                </span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-text-dim transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent md:h-14 md:w-14">
                  <MoveUpRight size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
          <span>
            Currently in <span className="text-text">Alexandria, Egypt</span> —
            UTC+3
          </span>
          <span className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for projects
          </span>
        </div>
      </div>
    </section>
  );
}
