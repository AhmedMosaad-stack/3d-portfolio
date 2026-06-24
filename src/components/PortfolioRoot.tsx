"use client";

import dynamic from "next/dynamic";
import { useLenis } from "@/hooks/useLenis";
import { useSceneScroll } from "@/hooks/useSceneScroll";
import { useCapabilities, sceneQuality } from "@/hooks/useCapabilities";
import ScenePoster from "@/components/scene/ScenePoster";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// WebGL scene is client-only and code-split so its JS never blocks LCP (spec 08).
const SceneRoot = dynamic(() => import("@/components/scene/SceneRoot"), {
  ssr: false,
  loading: () => <ScenePoster />,
});

export default function PortfolioRoot() {
  const caps = useCapabilities();
  const quality = sceneQuality(caps);
  const usesCanvas = caps.ready && caps.webgl;

  useLenis();
  useSceneScroll(usesCanvas);

  return (
    <>
      {/* Backdrop: poster until caps resolve / when no WebGL; live scene otherwise. */}
      {!caps.ready || quality.poster ? (
        <ScenePoster />
      ) : (
        <SceneRoot quality={quality} />
      )}

      <Preloader />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
