"use client";

// A corridor chamber. Wraps a content section so the "camera" travels into it,
// HOLDS still while you read, then lets it leave as the next arrives. Each
// section can specify a DIFFERENT camera move so the journey never feels the
// same twice:
//   push     — dolly straight in from depth (default)
//   crane    — camera cranes DOWN onto the section (enters from above, tilted)
//   pullback — camera pulls BACK to reveal (section starts close, recedes to rest)
//
// The hold is free: arrival finishes high in the viewport, departure starts low,
// leaving a calm static band where the content sits at rest and is readable.
// Pure transform + opacity (translateZ / scale / rotateX). No blur on these
// full-height layers — that is the 60fps killer. Off when not cinematic.

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setChapter } from "@/lib/corridor";
import { useCinema } from "@/hooks/useCinema";

// "none" = no camera move at all (content sits at rest); used by About, whose
// arrival is the hero→about crossfade, so a crane on top would be a second,
// competing camera move. Chapter tracking still runs.
type Move = "push" | "crane" | "pullback" | "none";

type Props = {
  children: ReactNode;
  chapter: number;
  move?: Move;
  depth?: number;
};

const REST = { autoAlpha: 1, scale: 1, y: 0, z: 0, rotationX: 0 };

function arrive(move: Move, depth: number): gsap.TweenVars {
  switch (move) {
    case "crane":
      return { autoAlpha: 0.1, scale: 0.92, y: -120 * depth, z: -120 * depth, rotationX: -16 * depth, transformOrigin: "center top" };
    case "pullback":
      return { autoAlpha: 0.2, scale: 1.2, y: 0, z: 150 * depth, rotationX: 0, transformOrigin: "center center" };
    default:
      return { autoAlpha: 0.12, scale: 0.82, y: 130 * depth, z: -260 * depth, rotationX: 8 * depth, transformOrigin: "center 32%" };
  }
}

function depart(move: Move, depth: number): gsap.TweenVars {
  switch (move) {
    case "crane":
      return { autoAlpha: 0.18, scale: 0.95, y: 90 * depth, z: -140 * depth, rotationX: 10 * depth, transformOrigin: "center bottom" };
    case "pullback":
      return { autoAlpha: 0.14, scale: 0.78, y: -40 * depth, z: -240 * depth, rotationX: -4 * depth, transformOrigin: "center center" };
    default:
      return { autoAlpha: 0.18, scale: 0.9, y: -80 * depth, z: -180 * depth, rotationX: -6 * depth, transformOrigin: "center 68%" };
  }
}

export default function Chamber({ children, chapter, move = "push", depth = 1 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cinema = useCinema();

  useGSAP(
    () => {
      const inner = innerRef.current;
      const wrap = wrapRef.current;
      if (!cinema || !inner || !wrap) return;

      if (move !== "none") {
        gsap.fromTo(
          inner,
          { ...arrive(move, depth), transformPerspective: 1600 },
          {
            ...REST,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top 96%", end: "top 44%", scrub: 1 },
          }
        );

        gsap.fromTo(
          inner,
          { ...REST },
          {
            ...depart(move, depth),
            transformPerspective: 1600,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "bottom 62%", end: "bottom 4%", scrub: 1 },
          }
        );
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setChapter(chapter);
          },
        },
      });
    },
    { dependencies: [cinema, chapter, move, depth], scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className={cinema ? "stage" : undefined}>
      <div ref={innerRef} className={cinema ? "depth-layer" : undefined}>
        {children}
      </div>
    </div>
  );
}
