"use client";

import dynamic from "next/dynamic";

const EarthGlobe = dynamic(
  () => import("@/features/earth-viewer").then((m) => m.EarthGlobe),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="w-screen h-screen bg-canvas-dark overflow-hidden">
      <EarthGlobe />
    </main>
  );
}
