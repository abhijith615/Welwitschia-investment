"use client";

import { useEffect, type RefObject } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsapSetup";

/* Shared scroll-reveal vocabulary:
   data-reveal="lines"  -> masked line-by-line rise (SplitText)
   data-reveal="up"     -> soft rise + fade
   data-reveal="fade"   -> slow dissolve
   data-reveal="scale"  -> emerge from depth
   data-reveal-delay    -> optional stagger offset (s)                     */
export function useReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-reveal='lines']").forEach((el) => {
        const split = new SplitText(el, { type: "lines", linesClass: "overflow-hidden" });
        const inner = new SplitText(el, { type: "lines" });
        gsap.set(inner.lines, { yPercent: 115 });
        gsap.to(inner.lines, {
          yPercent: 0,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.09,
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
        return () => {
          inner.revert();
          split.revert();
        };
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='up']").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='fade']").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2,
            ease: "power2.out",
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='scale']").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.94, y: 36, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.6,
            ease: "power3.out",
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
