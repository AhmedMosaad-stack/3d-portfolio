"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { MoveUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { scrollState } from "@/lib/scrollState";

type Props = { project: Project; index: number };

function ProjectCardBase({ project, index }: Props) {
  // Pulse the matching particle node-cluster while this card is focused (R14).
  const activate = useCallback(() => {
    scrollState.activeNode = index % 5;
  }, [index]);
  const deactivate = useCallback(() => {
    scrollState.activeNode = -1;
  }, []);

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      className="project-card group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 backdrop-blur-sm transition-colors hover:border-accent/60"
      aria-label={`${project.name} — open live site`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg">
        <Image
          src={project.screenshot}
          alt={`${project.name} — ${project.category} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
          <span>[{project.number}]</span>
          <span>{project.category}</span>
        </div>

        <h3 className="font-display text-[26px] leading-tight text-text transition-colors group-hover:text-accent">
          {project.name}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-dim">
          {project.brief}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-text-dim"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
          <span className="transition-colors group-hover:text-accent">
            Visit live
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-text-dim transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent">
            <MoveUpRight size={15} />
          </span>
        </div>
      </div>
    </a>
  );
}

export const ProjectCard = memo(ProjectCardBase);
