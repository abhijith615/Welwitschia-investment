"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

const VALUES = [
  {
    n: "I",
    title: "Integrity",
    body: "Integrity is the foundation of every relationship we build and every decision we make. We uphold the highest standards of honesty, transparency, and ethical conduct in all our interactions. By consistently acting with accountability and fairness, we earn the trust of our clients, partners, and stakeholders. Our commitment to doing what is right ensures sustainable success and long-term credibility.",
  },
  {
    n: "II",
    title: "Resilience",
    body: "We embrace challenges with determination and adaptability, viewing every obstacle as an opportunity to grow. Our resilient mindset enables us to navigate changing market conditions while remaining focused on delivering exceptional outcomes. We learn from every experience, continuously evolve, and respond with confidence to uncertainty. This strength allows us to create lasting value for our clients and our organization.",
  },
  {
    n: "III",
    title: "Innovation",
    body: "Innovation drives our pursuit of better solutions and meaningful progress. We continuously explore new ideas, technologies, and strategies to enhance the value we deliver to our clients. By fostering a culture of creativity and forward thinking, we stay ahead of industry trends and evolving customer needs. Our commitment to innovation ensures we remain agile, competitive, and future-ready.",
  },
  {
    n: "IV",
    title: "Excellence",
    body: "Excellence is reflected in the quality of our work, the standards we uphold, and the results we achieve. We strive for continuous improvement by combining expertise, precision, and attention to detail in everything we do. Our focus on delivering superior outcomes consistently exceeds expectations and builds lasting confidence among our stakeholders. We believe excellence is a journey of continuous refinement rather than a destination.",
  },
  {
    n: "V",
    title: "Partnership",
    body: "We believe the strongest outcomes are built through meaningful collaboration and mutual trust. By working closely with clients, investors, and strategic partners, we create solutions that align with shared goals and long-term success. We value open communication, respect diverse perspectives, and foster relationships based on transparency and accountability. Together, we achieve sustainable growth and create enduring value for everyone involved.",
  },
];

export default function Values() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".value-row",
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".values-list", start: "top 82%" },
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
        <div className="mb-20 text-center">
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

        <div className="values-list mx-auto max-w-[860px]">
          {VALUES.map((v, i) => {
            const open = openIndex === i;
            return (
              <div key={v.title} className="value-row border-b border-hair first:border-t">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                >
                  <span className="flex items-baseline gap-5 md:gap-8">
                    <span className="font-body text-[11px] tracking-[0.3em] text-gold/55">
                      {v.n}
                    </span>
                    <span
                      className={`font-heading text-[1.6rem] leading-tight transition-colors duration-500 md:text-[2.1rem] ${
                        open ? "text-gold-2" : "text-white-soft group-hover:text-gold-2"
                      }`}
                    >
                      {v.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 transition-colors duration-500 group-hover:border-gold/60"
                  >
                    <span
                      className={`absolute inset-0 m-auto h-px w-3.5 bg-gold-2 transition-transform duration-500 ${
                        open ? "rotate-45" : ""
                      }`}
                    />
                    <span
                      className={`absolute inset-0 m-auto h-3.5 w-px bg-gold-2 transition-transform duration-500 ${
                        open ? "-rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[660px] pb-8 text-[14.5px] leading-[1.9] text-ivory/65 md:pb-10">
                      {v.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
