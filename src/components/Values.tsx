"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const VALUES = [
  {
    n: "I",
    title: "Integrity",
    body: "We uphold the highest ethical standards in every decision.",
  },
  {
    n: "II",
    title: "Resilience",
    body: "We navigate changing markets with confidence and discipline.",
  },
  {
    n: "III",
    title: "Innovation",
    body: "We seek forward-thinking opportunities that drive growth.",
  },
  {
    n: "IV",
    title: "Excellence",
    body: "We are committed to delivering exceptional results.",
  },
  {
    n: "V",
    title: "Partnership",
    body: "We build lasting relationships founded on trust and mutual success.",
  },
];

export default function Values() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".value-card",
        { y: 110, opacity: 0, rotateX: 8, transformPerspective: 900 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".values-row", start: "top 82%" },
        }
      );
      // background hue drifts subtly as you pass through
      gsap.fromTo(
        root,
        { backgroundColor: "#f4ebe0" },
        {
          backgroundColor: "#ece0d1",
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.5 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="values" className="surface-cream relative overflow-hidden py-36 md:py-44">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-24 text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Our Values
          </p>
          <h2
            className="mx-auto mt-9 max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
            data-reveal="lines"
          >
            The principles that govern every decision we make.
          </h2>
        </div>

        <div className="values-row grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {VALUES.map((v) => (
            <article
              key={v.title}
              className="value-card group glass relative flex min-h-[220px] flex-col justify-between gap-6 overflow-hidden rounded-xl p-8 transition-transform duration-700 hover:-translate-y-2.5 lg:min-h-[440px]"
            >
              {/* hover illumination */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(200,166,90,0.13), transparent 65%)",
                }}
              />
              {/* gold outline that brightens */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl border border-gold/0 transition-colors duration-700 group-hover:border-gold/35"
              />
              <span className="font-display text-lg tracking-[0.2em] text-gold/60 transition-colors duration-500 group-hover:text-gold-2">
                {v.n}
              </span>
              <div>
                <h3 className="font-display text-[26px] text-ivory lg:[writing-mode:vertical-rl]">
                  {v.title}
                </h3>
              </div>
              <p className="text-[13px] leading-[1.85] text-ivory/55">{v.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
