"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

/* Editorial spread: monumental serif statement on the left,
   floating glass philosophy card on the right, contour lines behind. */
export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // slow drifting contour field
      gsap.to(".about-contours", {
        y: -70,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      // gold line draws itself
      gsap.fromTo(
        ".about-goldline",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.8,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".about-card", start: "top 78%" },
        }
      );
      // philosophy card floats up from depth
      gsap.fromTo(
        ".about-card",
        { y: 90, opacity: 0, rotateX: 6, transformPerspective: 1000 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-card", start: "top 85%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className="surface-cream relative overflow-hidden py-36 md:py-48">
      {/* soft transition down from the teal hero above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0b3340] to-transparent"
      />
      {/* contour lines */}
      <svg
        className="about-contours pointer-events-none absolute -right-40 top-0 h-[130%] w-[900px] opacity-[0.08]"
        viewBox="0 0 900 1200"
        fill="none"
        aria-hidden
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M ${80 + i * 26} 0 C ${240 + i * 30} ${300 + i * 18}, ${60 + i * 34} ${640 - i * 12}, ${300 + i * 28} 1200`}
            stroke="#c8a65a"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="relative mx-auto grid max-w-[1440px] gap-20 px-6 md:px-12 lg:grid-cols-[1.15fr_1fr] lg:gap-28">
        {/* left — editorial statement */}
        <div>
          <p className="eyebrow" data-reveal="fade">
            The House
          </p>
          <h2
            className="mt-10 font-display text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[1.14] text-white-soft"
            data-reveal="lines"
          >
            Sustainable wealth is built through resilience, vision, and
            disciplined decision&#8209;making.
          </h2>
          <div className="mt-12 max-w-[560px] space-y-6 text-[15px] leading-[1.9] text-ivory/60">
            <p data-reveal="up">
              Inspired by the Welwitschia plant—renowned for its remarkable
              ability to thrive in some of the world&rsquo;s harshest
              environments—we embrace the principles of endurance,
              adaptability, and long&#8209;term growth.
            </p>
            <p data-reveal="up" data-reveal-delay="0.1">
              We are committed to identifying strategic investment
              opportunities that create lasting value for our clients,
              partners, and communities. Whether investing in real estate,
              financial markets, private equity, infrastructure, or emerging
              industries, our approach is guided by integrity, innovation, and
              careful risk management.
            </p>
            <p data-reveal="up" data-reveal-delay="0.18">
              At Welwitschia Investment, we don&rsquo;t simply invest in
              assets—<em className="font-serif-alt text-[1.05em] not-italic italic text-gold-2">we invest in futures</em>,
              empowering businesses and individuals to achieve long&#8209;term
              prosperity.
            </p>
          </div>
        </div>

        {/* right — floating philosophy card */}
        <div className="relative flex items-center">
          <div className="about-goldline absolute -left-10 top-[8%] hidden h-[84%] w-px origin-top bg-gradient-to-b from-gold/0 via-gold/70 to-gold/0 lg:block" />
          <div className="about-card glass relative w-full rounded-2xl p-10 md:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at 20% 0%, rgba(200,166,90,0.09), transparent 55%)",
              }}
            />
            <div className="space-y-14">
              <div>
                <h3 className="flex items-baseline gap-4 font-display text-2xl text-gold-2">
                  <span className="text-sm tracking-[0.3em] text-ivory/40">01</span>
                  Our Vision
                </h3>
                <p className="mt-5 text-[14.5px] leading-[1.9] text-ivory/65">
                  To be a trusted investment partner recognized for creating
                  sustainable value, fostering innovation, and building wealth
                  that endures across generations.
                </p>
              </div>
              <div className="hairline" />
              <div>
                <h3 className="flex items-baseline gap-4 font-display text-2xl text-gold-2">
                  <span className="text-sm tracking-[0.3em] text-ivory/40">02</span>
                  Our Mission
                </h3>
                <p className="mt-5 text-[14.5px] leading-[1.9] text-ivory/65">
                  To provide strategic investment solutions that deliver
                  long&#8209;term growth while maintaining integrity,
                  transparency, and responsible stewardship of capital.
                </p>
              </div>
              <div className="hairline" />
              <div>
                <h3 className="flex items-baseline gap-4 font-display text-2xl text-gold-2">
                  <span className="text-sm tracking-[0.3em] text-ivory/40">03</span>
                  Our Promise
                </h3>
                <p className="mt-5 text-[14.5px] leading-[1.9] text-ivory/65">
                  Enduring relationships built on trust, transparency, and
                  consistent performance—tailored investment solutions that
                  support sustainable financial success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
