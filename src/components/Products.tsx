"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const PRODUCTS = [
  {
    roman: "No. 01",
    title: "Equity Investments",
    body: "Carefully selected public and private companies with strong growth potential and long-term value.",
  },
  {
    roman: "No. 02",
    title: "Real Estate",
    body: "Residential, commercial and mixed-use property generating capital appreciation and recurring income.",
  },
  {
    roman: "No. 03",
    title: "Fixed Income",
    body: "Bonds and income-generating securities designed for predictable returns with managed risk.",
  },
  {
    roman: "No. 04",
    title: "Private Equity Funds",
    body: "High-potential private businesses—supporting innovation, expansion, and long-term growth.",
  },
  {
    roman: "No. 05",
    title: "Infrastructure",
    body: "Strategic infrastructure projects contributing to economic development with sustainable returns.",
  },
  {
    roman: "No. 06",
    title: "Sustainable & ESG",
    body: "Environmentally responsible, socially impactful, well-governed businesses creating long-term value.",
  },
  {
    roman: "No. 07",
    title: "Portfolio Solutions",
    body: "Professionally managed portfolios tailored to risk profiles, horizons, and objectives.",
  },
  {
    roman: "No. 08",
    title: "Alternative Investments",
    body: "Selected alternative asset classes that complement traditional holdings and deepen diversification.",
  },
];

export default function Products() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
          stagger: { each: 0.08, grid: [2, 4], from: "start" },
          scrollTrigger: { trigger: ".products-grid", start: "top 85%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="products" className="relative overflow-hidden py-36 md:py-48">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-24 text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Investment Products
          </p>
          <h2
            className="mx-auto mt-9 max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
            data-reveal="lines"
          >
            A private collection of opportunities.
          </h2>
          <p
            className="mx-auto mt-8 max-w-[560px] text-[14.5px] leading-[1.9] text-ivory/55"
            data-reveal="up"
          >
            Investment products designed to help individuals, businesses, and
            institutional investors achieve their financial goals while
            building sustainable, long&#8209;term wealth.
          </p>
        </div>

        <div className="products-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <article
              key={p.title}
              className="product-card corner-ticks group relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#082330]/80 p-8 pt-10 transition-all duration-700 hover:-translate-y-2 hover:border-gold/30 hover:shadow-[0_30px_70px_-20px_rgba(200,166,90,0.22)]"
              style={{ minHeight: 320 }}
            >
              <span className="tick" aria-hidden />
              {/* gold reflection sweep on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-2/[0.07] to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-full"
              />
              <p className="font-serif-alt text-sm italic tracking-wide text-gold/70">
                {p.roman}
              </p>
              <div className="mt-14 mb-6 hairline opacity-60" />
              <h3 className="font-display text-[22px] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-2">
                {p.title}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.85] text-ivory/50 opacity-90 transition-opacity duration-500 group-hover:opacity-100">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
