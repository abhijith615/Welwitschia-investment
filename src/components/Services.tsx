"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const SERVICES = [
  {
    title: "Investment Management",
    body: "Diversified portfolios focused on long-term capital growth, income generation, and effective risk management.",
    img: "/services/investment-management.webp",
  },
  {
    title: "Financial Advisory",
    body: "Strategic financial guidance—informed decisions, optimized portfolios, and clear paths to your objectives.",
    img: "/services/financial-advisory.webp",
  },
  {
    title: "Real Estate Investment",
    body: "High-potential real estate opportunities delivering sustainable returns and long-term asset appreciation.",
    img: "/services/real-estate.webp",
  },
  {
    title: "Private Equity & Business Investments",
    body: "Capital and strategic support for promising businesses with strong growth potential and lasting value.",
    img: "/services/private-equity.webp",
  },
  {
    title: "Project Financing",
    body: "Connecting investors with viable commercial and infrastructure projects that promote sustainable development.",
    img: "/services/project-financing.webp",
  },
  {
    title: "Portfolio Diversification",
    body: "Balanced portfolios across multiple asset classes to reduce risk and enhance long-term performance.",
    img: "/services/portfolio-diversification.webp",
  },
  {
    title: "Investment Research & Market Analysis",
    body: "Comprehensive research and financial analysis identifying emerging opportunities behind every decision.",
    img: "/services/research.webp",
  },
  {
    title: "Strategic Partnerships",
    body: "Collaboration with businesses, developers, entrepreneurs and institutions to create mutually beneficial growth.",
    img: "/services/strategic-partnerships.webp",
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
      {/* transition down from the dark section above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#071e27] to-transparent"
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
              className="service-panel on-dark group relative min-h-[380px] overflow-hidden rounded-xl border border-white/[0.08] will-change-transform"
            >
              {/* image */}
              <Image
                src={s.img}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
              />
              {/* legibility scrim */}
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,26,34,0.12) 0%, rgba(6,25,33,0.52) 52%, rgba(5,20,28,0.94) 100%)",
                }}
              />
              {/* tracked gold light on hover */}
              <div
                aria-hidden
                className="service-sheen pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-screen"
                style={{
                  background:
                    "radial-gradient(circle, rgba(226,194,111,0.18), transparent 65%)",
                }}
              />
              {/* gold top border trace */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-2/80 via-gold/60 to-transparent transition-transform duration-[900ms] ease-out group-hover:scale-x-100"
              />
              <span className="absolute left-7 top-6 font-body text-[11px] tracking-[0.35em] text-gold-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="mb-4 h-px w-9 bg-gradient-to-r from-gold-2 to-transparent transition-all duration-700 group-hover:w-16" />
                <h3 className="font-display text-[19px] leading-snug text-white-soft">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[12.5px] leading-[1.7] text-ivory/75">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
