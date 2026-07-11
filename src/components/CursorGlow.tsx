"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

/* A soft gold light that follows the pointer, illuminating glass surfaces. */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const glow = glowRef.current;
    if (!glow) return;

    const xTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(glow, { opacity: 1, duration: 0.4 });
    };
    const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.6 });

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] opacity-0"
      style={{ transform: "translate(-9999px, -9999px)" }}
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(200,166,90,0.07) 0%, rgba(92,205,232,0.03) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 10,
          height: 10,
          background: "radial-gradient(circle, rgba(226,194,111,0.9), rgba(226,194,111,0))",
        }}
      />
    </div>
  );
}
