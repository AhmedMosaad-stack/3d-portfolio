"use client";

// The corridor. No animated background, no full-screen WebGL — the cinematic
// feel comes from the camera traveling through glass chambers on scroll, with a
// single surgical R3F moment at the gate (HeroGate → LightWall).
//
// Cinematic mode (desktop, fine pointer, motion allowed) adds the chapter rail,
// scroll progress, depth fog and the per-chamber depth choreography. Otherwise
// everything degrades to a calm flat scroll with the normal top nav.

import { useLenis } from "@/hooks/useLenis";
import { useCinema } from "@/hooks/useCinema";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/nav/Navbar";
import ConsoleSignature from "@/components/ui/ConsoleSignature";
import HeroGate from "@/components/cinematic/HeroGate";
import Chamber from "@/components/cinematic/Chamber";
import CinematicChrome from "@/components/cinematic/CinematicChrome";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// Width of the left lane the chapter rail lives in (cinematic, lg+). The hero is
// full-bleed (escapes the lane); flowing sections (About/Contact) reserve it so
// the rail never overlaps. Pinned sections (Projects/Skills) detach from this
// lane when pinned, so THEY gutter their own content internally instead.
const LANE = "lg:pl-[150px]";

export default function PortfolioRoot() {
  const cinema = useCinema();
  // Lenis (smooth scroll) loads only on the cinematic path — the flat/mobile
  // bundle never ships it.
  useLenis(cinema);

  return (
    <>
      <Preloader />
      <ConsoleSignature />

      {cinema ? (
        <>
          <CinematicChrome />
          <div className="depth-fog" aria-hidden="true" />
        </>
      ) : (
        <Navbar />
      )}

      <main className="relative z-10">
        {/* Fullscreen, edge-to-edge entrance — no rail lane. */}
        <HeroGate />

        <div className={cinema ? LANE : undefined}>
          {/* move="none": About's arrival IS the hero→about crossfade (HeroGate),
              so no crane here — just chapter tracking + its own content reveal. */}
          <Chamber chapter={1} move="none">
            <About />
          </Chamber>
        </div>

        {/* Pinned, full-bleed cinematic chambers (gutter their own content). */}
        <Projects />
        <Skills />

        <div className={cinema ? LANE : undefined}>
          <Chamber chapter={4} move="pullback">
            <Contact />
          </Chamber>
        </div>
      </main>
      <Footer />
    </>
  );
}
