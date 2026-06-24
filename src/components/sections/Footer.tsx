"use client";

import { ArrowUp } from "lucide-react";
import { scrollToSection } from "@/hooks/useLenis";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="font-display text-2xl text-text">
            AM<span className="text-accent">.</span>
          </div>
          <p className="mt-2 max-w-xs font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            {profile.role} · {profile.location}
          </p>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
          Built with Next.js · Three.js · GSAP
        </p>

        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            © {year} {profile.name}
          </span>
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            aria-label="Back to top"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-dim transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
