"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const FIGURES = [
  { value: 20, suffix: "+", label: "Investment Strategies" },
  { value: 8, suffix: "", label: "Investment Products" },
  { value: 100, suffix: "%", label: "Transparency" },
  { value: 1000, suffix: "+", label: "Years of Inspiration" },
];

export default function Trust() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        if (reduced) {
          el.textContent = target.toLocaleString();
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString()),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="commitment" className="surface-cream relative overflow-hidden py-36 md:py-44">
      {/* soft transition down from the teal Story above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0c3541] to-transparent"
      />
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Our Commitment
          </p>
          <h2
            className="mx-auto mt-9 max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.18] text-white-soft"
            data-reveal="lines"
          >
            Rigorous research. Disciplined risk. Unconditional transparency.
          </h2>
          <p
            className="mx-auto mt-8 max-w-[620px] text-[14.5px] leading-[1.95] text-ivory/55"
            data-reveal="up"
          >
            Every investment product is guided by rigorous research,
            disciplined risk management, and a commitment to transparency. We
            strive to deliver solutions that preserve capital, generate
            sustainable returns, and support our clients&rsquo; long&#8209;term
            financial success.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-y-16 md:grid-cols-4" data-reveal="fade">
          {FIGURES.map((f, i) => (
            <div
              key={f.label}
              className={`px-6 text-center ${i > 0 ? "md:border-l md:border-hair" : ""}`}
            >
              <p className="font-display text-[clamp(2.6rem,4.5vw,4rem)] leading-none text-gold-2">
                <span data-count={f.value}>0</span>
                {f.suffix}
              </p>
              <div className="hairline mx-auto my-5 w-10" />
              <p className="text-[10.5px] uppercase tracking-[0.32em] text-ivory/45">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
