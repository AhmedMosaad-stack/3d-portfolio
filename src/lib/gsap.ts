"use client";

// Central GSAP setup. Register every plugin ONCE here (spec 07). All GSAP
// plugins are free (Webflow acquisition) — no GreenSock token, no Club.

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    CustomEase
  );

  // Signature ease for hero assemble / display reveals.
  if (!CustomEase.get("hop")) {
    CustomEase.create("hop", "M0,0 C0.16,1 0.3,1 1,1");
  }

  gsap.defaults({ ease: "power3.out", duration: 0.6 });
}

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
  CustomEase,
};
