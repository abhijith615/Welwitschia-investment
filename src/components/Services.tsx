"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const SERVICES = [
  {
    title: "Investment Management",
    body: "Diversified portfolios focused on long-term capital growth, income generation, and effective risk management.",
  },
  {
    title: "Financial Advisory",
    body: "Strategic financial guidance—informed decisions, optimized portfolios, and clear paths to your objectives.",
  },
  {
    title: "Real Estate Investment",
    body: "High-potential real estate opportunities delivering sustainable returns and long-term asset appreciation.",
  },
  {
    title: "Private Equity & Business Investments",
    body: "Capital and strategic support for promising businesses with strong growth potential and lasting value.",
  },
  {
    title: "Project Financing",
    body: "Connecting investors with viable commercial and infrastructure projects that promote sustainable development.",
  },
  {
    title: "Portfolio Diversification",
    body: "Balanced portfolios across multiple asset classes to reduce risk and enhance long-term performance.",
  },
  {
    title: "Investment Research & Market Analysis",
    body: "Comprehensive research and financial analysis identifying emerging opportunities behind every decision.",
  },
  {
    title: "Strategic Partnerships",
    body: "Collaboration with businesses, developers, entrepreneurs and institutions to create mutually beneficial growth.",
  },
];

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      // panels surface from depth, alternating drift
      gsap.utils.toArray<HTMLElement>(".service-panel").forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { opacity: 0, z: -160, y: 70, transformPerspective: 1200, filter: "blur(6px)" },
          {
            opacity: 1,
            z: 0,
            y: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out",
            delay: (i % 2) * 0.12,
            scrollTrigger: { trigger: panel, start: "top 90%" },
          }
        );
      });

      if (fine) {
        // mouse tilt + tracking sheen
        gsap.utils.toArray<HTMLElement>(".service-panel").forEach((panel) => {
          const sheen = panel.querySelector<HTMLElement>(".service-sheen");
          const onMove = (e: MouseEvent) => {
            const r = panel.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(panel, {
              rotateY: nx * 5,
              rotateX: -ny * 5,
              transformPerspective: 900,
              duration: 0.7,
              ease: "power2.out",
            });
            if (sheen)
              gsap.to(sheen, {
                opacity: 1,
                x: nx * r.width * 0.6,
                y: ny * r.height * 0.6,
                duration: 0.5,
              });
          };
          const onLeave = () => {
            gsap.to(panel, { rotateY: 0, rotateX: 0, duration: 1, ease: "power3.out" });
            if (sheen) gsap.to(sheen, { opacity: 0, duration: 0.8 });
          };
          panel.addEventListener("mousemove", onMove);
          panel.addEventListener("mouseleave", onLeave);
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="services" className="surface-cream relative overflow-hidden py-36 md:py-48">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(28,147,183,0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 85%, rgba(200,166,90,0.05), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-24 grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow" data-reveal="fade">
              Our Services
            </p>
            <h2
              className="mt-9 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
              data-reveal="lines"
            >
              Strategic solutions, quietly executed.
            </h2>
          </div>
          <p className="max-w-[480px] text-[14.5px] leading-[1.9] text-ivory/55 lg:justify-self-end" data-reveal="up">
            Strategic investment and advisory solutions designed to create
            sustainable value—tailored to the unique needs of individuals,
            businesses, and institutional investors.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="service-panel group glass relative overflow-hidden rounded-xl p-8 will-change-transform"
              style={{ minHeight: 300 }}
            >
              {/* tracked light */}
              <div
                aria-hidden
                className="service-sheen pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                style={{
                  background:
                    "radial-gradient(circle, rgba(226,194,111,0.10), transparent 65%)",
                }}
              />
              {/* animated border trace */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/70 via-gold-2/60 to-transparent transition-transform duration-[900ms] ease-out group-hover:scale-x-100"
              />
              <span className="text-xs tracking-[0.35em] text-gold/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-16 font-display text-[21px] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-2">
                {s.title}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.85] text-ivory/50">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
