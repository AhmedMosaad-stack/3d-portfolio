"use client";

// Slim fixed-left wayfinding rail (01–05). Shows where you are in the corridor
// and lets you fast-fly to any chamber. Only mounts in cinematic mode; the flat
// fallback uses the normal top nav instead.
//
// It subscribes to discrete chapter changes (onChapter) rather than scroll
// progress, so it re-renders a handful of times across the whole journey — not
// every frame.

import { useEffect, useState } from "react";
import { CHAPTERS, corridor, onChapter } from "@/lib/corridor";
import { scrollToSection } from "@/hooks/useLenis";

export default function ChapterRail() {
  const [active, setActive] = useState(corridor.chapter);

  useEffect(() => {
    setActive(corridor.chapter);
    return onChapter(setActive);
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-1">
        {CHAPTERS.map((c, i) => {
          const isActive = i === active;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => scrollToSection(c.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3 py-1.5 text-left"
              >
                {/* tick mark — grows + glows when active */}
                <span
                  className="relative block h-px transition-all duration-500 ease-out"
                  style={{
                    width: isActive ? 34 : 16,
                    background: isActive
                      ? "var(--color-accent)"
                      : "color-mix(in oklab, var(--color-text-dim) 60%, transparent)",
                    boxShadow: isActive
                      ? "0 0 12px color-mix(in oklab, var(--color-accent) 70%, transparent)"
                      : "none",
                  }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-300"
                  style={{
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-text-dim)",
                  }}
                >
                  <span className="tabular-nums">{c.n}</span>
                  <span
                    className="ml-2 inline-block overflow-hidden align-middle transition-all duration-500"
                    style={{
                      maxWidth: isActive ? 90 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {c.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
