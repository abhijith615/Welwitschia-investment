"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

/* Black screen -> gold mark emerges from darkness with a light sweep ->
   curtain parts to reveal the hero. Fires "wi:reveal" when done. */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reveal = () => {
      (window as unknown as Record<string, unknown>).__wiRevealed = true;
      window.dispatchEvent(new Event("wi:reveal"));
    };

    if (prefersReducedMotion()) {
      reveal();
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }

    document.documentElement.style.overflow = "hidden";

    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setDone(true);
      },
    });

    tl.set(q(".pre-mark"), { opacity: 0, scale: 0.92, filter: "blur(14px)" })
      .set(q(".pre-line"), { scaleX: 0 })
      .set(q(".pre-word"), { opacity: 0, letterSpacing: "0.9em" })
      .to(q(".pre-mark"), {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.6,
        ease: "power2.out",
        delay: 0.35,
      })
      .to(
        q(".pre-word"),
        { opacity: 0.85, letterSpacing: "0.42em", duration: 1.4, ease: "power2.out" },
        "-=1.0"
      )
      .to(q(".pre-line"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, "-=0.9")
      .add(reveal, "+=0.35")
      .to(q(".pre-panel-top"), {
        yPercent: -100,
        duration: 1.4,
        ease: "power4.inOut",
      })
      .to(
        q(".pre-panel-bottom"),
        { yPercent: 100, duration: 1.4, ease: "power4.inOut" },
        "<"
      )
      .to(
        q(".pre-center"),
        { opacity: 0, scale: 1.06, duration: 0.7, ease: "power2.in" },
        "<"
      );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]" aria-hidden>
      {/* split curtain panels */}
      <div className="pre-panel-top absolute inset-x-0 top-0 h-1/2 bg-[#07242c]" />
      <div className="pre-panel-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#07242c]" />

      <div className="pre-center absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="pre-mark logo-sheen relative w-[210px] md:w-[280px]">
          <Image
            src="/logo-mark.png"
            alt=""
            width={800}
            height={251}
            sizes="280px"
            priority
            className="h-auto w-full"
          />
        </div>
        <div className="pre-line hairline w-56 origin-center" />
        <p className="pre-word text-[10px] uppercase text-aqua-soft">
          Welwitschia Investment
        </p>
      </div>
    </div>
  );
}
