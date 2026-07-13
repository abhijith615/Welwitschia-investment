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
      // slow parallax drift on the architectural backdrop
      gsap.to(".values-bg", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="values" className="surface-teal relative overflow-hidden py-36 md:py-44">
      {/* architectural backdrop */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="values-bg absolute -top-[8%] left-0 h-[116%] w-full bg-cover will-change-transform"
          style={{ backgroundImage: "url(/values-bg.webp)", backgroundPosition: "center right" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,31,40,0.88) 0%, rgba(9,36,46,0.74) 42%, rgba(7,29,38,0.93) 100%)",
          }}
        />
      </div>
      {/* transition down from the cream section above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#efe3d5] to-transparent"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-24 text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Our Values
          </p>
          <h2
            className="mx-auto mt-9 max-w-3xl font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
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
              <div>
                <h3 className="font-heading text-[26px] text-ivory lg:[writing-mode:vertical-rl]">
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
