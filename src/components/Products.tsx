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
      // slow parallax on the crystalline backdrop
      gsap.to(".products-bg", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="products" className="surface-teal relative overflow-hidden py-36 md:py-48">
      {/* crystalline backdrop */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="products-bg absolute -top-[8%] left-0 h-[116%] w-full bg-cover bg-center will-change-transform"
          style={{ backgroundImage: "url(/products-bg.webp)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,26,34,0.90) 0%, rgba(8,32,42,0.76) 44%, rgba(6,24,32,0.94) 100%)",
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
            Investment Products
          </p>
          <h2
            className="mx-auto mt-9 max-w-3xl font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
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
              className="product-card corner-ticks group relative overflow-hidden rounded-lg border border-white/[0.09] bg-[#0a2734]/60 p-8 pt-10 backdrop-blur-md transition-all duration-700 hover:-translate-y-2 hover:border-gold/40 hover:bg-[#0c2c3a]/70 hover:shadow-[0_36px_80px_-24px_rgba(200,166,90,0.32)]"
              style={{ minHeight: 320 }}
            >
              <span className="tick" aria-hidden />
              {/* gold reflection sweep on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-2/[0.07] to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-full"
              />
              <div className="mb-6 hairline w-12 opacity-70" />
              <h3 className="font-heading text-[22px] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-2">
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
