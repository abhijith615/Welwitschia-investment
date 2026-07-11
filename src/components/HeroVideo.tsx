"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsapSetup";

/* Background hero video — a separate desktop / mobile encode is chosen once,
   client-side, so only the right file is fetched. Skipped entirely when the
   viewer prefers reduced motion (the teal surface shows instead). */
export default function HeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const raf = requestAnimationFrame(() =>
      setSrc(mobile ? "/hero-mobile.mp4" : "/hero-desktop.mp4")
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!src) return null;

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms] ease-out"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onCanPlay={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
