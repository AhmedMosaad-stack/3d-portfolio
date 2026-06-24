"use client";

import { ArrowUp } from "lucide-react";
import { scrollToSection } from "@/hooks/useLenis";
import { UniqueLogo } from "@/components/icons/UniqueLogo";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-6 py-12 md:px-10">
      {/* 3 columns on desktop: brand left, build-credit centered, copyright right —
          all on one baseline so nothing floats out of alignment. */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
        <div className="flex flex-col gap-2">
          <UniqueLogo width={36} height={36} />
          <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            {profile.role} · {profile.location}
          </p>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim md:text-center">
          Built with Next.js · Three.js · GSAP
        </p>

        <div className="flex items-center gap-6 md:justify-end">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            © {year} {profile.name}
          </span>
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            aria-label="Back to top"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-text-dim transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
