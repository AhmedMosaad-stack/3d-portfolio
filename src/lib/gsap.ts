"use client";

// Central GSAP setup. Register every plugin ONCE here (spec 07). All GSAP
// plugins are free (Webflow acquisition) — no GreenSock token, no Club.
//
// Only the plugins actually used ship: ScrollTrigger (scroll beats), SplitText
// (hero/About reveals), ScrambleText (nav hover). ScrollToPlugin/TextPlugin/
// CustomEase were dropped — they were registered but never used (dead weight).

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

  // Don't re-pin / re-measure on mobile URL-bar show-hide — that resize is the
  // classic source of scroll-driven layout shift (CLS) on pinned sections.
  ScrollTrigger.config({ ignoreMobileResize: true });

  gsap.defaults({ ease: "power3.out", duration: 0.6 });
}

export { gsap, useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin };
