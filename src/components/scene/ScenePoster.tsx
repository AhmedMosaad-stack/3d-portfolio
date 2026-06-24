"use client";

// Static backdrop for the no-WebGL path (spec R24/09). A CSS-only mint glow on
// near-black — no canvas, zero GPU risk. Sits behind content like the live scene.
export default function ScenePoster() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-bg"
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/3 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,255,200,0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
