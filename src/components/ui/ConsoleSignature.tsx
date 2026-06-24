"use client";

// Easter egg — a styled greeting for anyone who opens DevTools. Renders nothing;
// it just signs the console once. Discoverable, never in the way.

import { useEffect } from "react";
import { profile } from "@/data/profile";

export default function ConsoleSignature() {
  useEffect(() => {
    const big =
      "color:#00ffc8;font-size:22px;font-weight:600;font-family:Georgia,serif;text-shadow:0 0 18px rgba(0,255,200,.5)";
    const dim = "color:#9a9a9a;font-family:ui-monospace,monospace;font-size:12px";
    const accent = "color:#00ffc8;font-family:ui-monospace,monospace;font-size:12px";

    console.log("%cLooking under the hood?", big);
    console.log("%cYou found the corridor's blueprints. I like you already.", dim);
    console.log(
      "%cBuilt with Next.js · R3F · GSAP — by hand, no template.\nWant to build something? %c" + profile.email,
      dim,
      accent
    );
  }, []);

  return null;
}
