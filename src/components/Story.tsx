"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

const CHAPTERS = [
  {
    k: "Endurance",
    body: "In the Namib—the oldest desert on Earth—the Welwitschia lives for more than a thousand years. It survives not by chance, but by design: roots that reach deep, and patience that outlasts every drought.",
  },
  {
    k: "Growth",
    body: "It grows only two leaves, and never stops growing them. Not the fastest growth — the most persistent. This is how we believe capital should behave: continuously, deliberately, without interruption.",
  },
  {
    k: "Legacy",
    body: "What endures the harshest seasons becomes permanent. We build wealth the same way — measured not in quarters, but in generations.",
  },
];

/* roots + two eternal leaves, drawn by scroll */
const ROOTS = [
  "M400 470 C 392 550, 412 630, 386 758",
  "M400 470 C 428 545, 418 655, 447 738",
  "M400 470 C 372 528, 352 606, 330 692",
  "M400 470 C 414 538, 458 612, 492 676",
  "M400 472 C 398 520, 376 560, 362 596",
];
const LEAVES_L = [
  "M392 452 C 300 428, 198 458, 88 378",
  "M392 458 C 288 458, 178 500, 58 468",
  "M394 464 C 308 490, 218 560, 118 562",
];
const LEAVES_R = [
  "M408 452 C 502 424, 612 440, 718 358",
  "M408 458 C 520 458, 632 502, 744 462",
  "M406 464 C 500 494, 590 562, 688 572",
];
const CROWN = "M356 458 Q 400 428 444 458 Q 400 476 356 458 Z";

export default function Story() {
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const strokes = svg.querySelectorAll<SVGPathElement>("[data-draw]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });

      if (reduced) {
        strokes.forEach((p) => (p.style.strokeDashoffset = "0"));
        gsap.set(".story-chapter", { opacity: 1, position: "relative" });
        return;
      }

      const leafPaths = [
        ...svg.querySelectorAll<SVGPathElement>(".story-leaf"),
      ];
      const particles = [
        ...svg.querySelectorAll<SVGCircleElement>(".story-particle"),
      ];
      const assignments = particles.map((_, i) => ({
        path: leafPaths[i % leafPaths.length],
        offset: (i * 0.37) % 1,
        speed: 0.55 + (i % 3) * 0.3,
      }));

      const placeParticles = (prog: number) => {
        particles.forEach((c, i) => {
          const { path, offset, speed } = assignments[i];
          const len = path.getTotalLength();
          const t = (prog * speed + offset) % 1;
          const pt = path.getPointAtLength(t * len);
          c.setAttribute("cx", String(pt.x));
          c.setAttribute("cy", String(pt.y));
          // fade in mid-journey, out near tip
          const fade = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
          c.setAttribute("opacity", String(0.85 * fade * Math.min(1, prog * 3)));
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => placeParticles(self.progress),
        },
        defaults: { ease: "none" },
      });

      // phase 1 — roots reach down
      tl.to(".story-root", { strokeDashoffset: 0, duration: 2.4, stagger: 0.25 }, 0)
        .to(".story-crown", { opacity: 1, duration: 1.2 }, 1.6)
        // phase 2 — the two eternal leaves unfurl
        .to(".story-leaf", { strokeDashoffset: 0, duration: 4.4, stagger: 0.4 }, 2.2)
        // ambient glow blooms
        .to(".story-glow", { opacity: 0.85, duration: 3 }, 4)
        // chapters
        .fromTo(".story-ch-0", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4)
        .to(".story-ch-0", { opacity: 0, y: -30, duration: 1 }, 3.0)
        .fromTo(".story-ch-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, 4.2)
        .to(".story-ch-1", { opacity: 0, y: -30, duration: 1 }, 6.6)
        .fromTo(".story-ch-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, 7.8)
        .to(".story-quote", { opacity: 1, duration: 1.4 }, 8.6);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="story"
      className="surface-teal relative flex h-screen items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 100%, #0e3c49 0%, #082730 58%, #061f27 100%)",
      }}
    >
      {/* soft transition down from the cream section above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#ece0d1] to-transparent"
      />
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 md:px-12 lg:grid-cols-[1fr_1.2fr]">
        {/* chapters */}
        <div className="relative z-10 order-2 h-[290px] lg:order-1 lg:h-[360px]">
          <p className="eyebrow mb-6 lg:mb-10">The Welwitschia Principle</p>
          {CHAPTERS.map((c, i) => (
            <div key={c.k} className={`story-chapter story-ch-${i} absolute mt-4 max-w-[460px] opacity-0 lg:mt-16`}>
              <h3 className="font-display text-[clamp(1.7rem,3.6vw,3.2rem)] text-gold-2">{c.k}</h3>
              <p className="mt-4 text-[13.5px] leading-[1.85] text-ivory/65 lg:mt-6 lg:text-[15px] lg:leading-[2]">{c.body}</p>
            </div>
          ))}
          <p className="story-quote absolute bottom-0 font-serif-alt text-lg italic text-ivory/40 opacity-0">
            &ldquo;Rooted in strength. Built for growth.&rdquo;
          </p>
        </div>

        {/* the plant */}
        <div className="relative order-1 lg:order-2">
          <div
            aria-hidden
            className="story-glow absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(ellipse, rgba(200,166,90,0.10) 0%, rgba(28,147,183,0.05) 45%, transparent 70%)",
            }}
          />
          <svg
            ref={svgRef}
            viewBox="0 0 800 800"
            className="relative mx-auto h-[46vh] w-auto max-w-full lg:h-auto lg:w-full lg:max-w-[720px]"
            fill="none"
            aria-label="An illustration of the Welwitschia plant growing — roots deepening, leaves unfurling"
          >
            <defs>
              <linearGradient id="leafGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#8a6f3c" />
                <stop offset="0.5" stopColor="#c8a65a" />
                <stop offset="1" stopColor="#e2c26f" />
              </linearGradient>
              <linearGradient id="rootFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c8a65a" stopOpacity="0.7" />
                <stop offset="1" stopColor="#1c93b7" stopOpacity="0.25" />
              </linearGradient>
              <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* soil line */}
            <path
              data-draw
              className="story-root"
              d="M120 470 H 680"
              stroke="rgba(248,245,238,0.12)"
              strokeWidth="1"
            />

            {ROOTS.map((d, i) => (
              <path
                key={`r${i}`}
                data-draw
                className="story-root"
                d={d}
                stroke="url(#rootFade)"
                strokeWidth={i < 2 ? 2.5 : 1.5}
                strokeLinecap="round"
              />
            ))}

            <path className="story-crown" d={CROWN} fill="rgba(200,166,90,0.16)" stroke="#c8a65a" strokeWidth="1.5" opacity="0" />

            {[...LEAVES_L, ...LEAVES_R].map((d, i) => (
              <path
                key={`l${i}`}
                data-draw
                className="story-leaf"
                d={d}
                stroke="url(#leafGold)"
                strokeWidth={i % 3 === 0 ? 4 : 2.5}
                strokeLinecap="round"
                filter="url(#softGlow)"
              />
            ))}

            {Array.from({ length: 9 }).map((_, i) => (
              <circle
                key={`p${i}`}
                className="story-particle"
                r={i % 3 === 0 ? 3 : 2}
                cx="-10"
                cy="-10"
                fill="#e2c26f"
                opacity="0"
                filter="url(#softGlow)"
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
