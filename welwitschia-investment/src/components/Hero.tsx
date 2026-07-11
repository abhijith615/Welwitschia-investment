"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsapSetup";
import Magnetic from "@/components/Magnetic";
import RibbonField from "@/components/RibbonField";

const STATS = [
  { value: 20, suffix: "+", label: "Investment Strategies" },
  { value: 100, suffix: "%", label: "Transparency" },
  { value: null, word: "Global", label: "Investment Outlook" },
  { value: null, word: "Long-term", label: "Value Creation" },
] as const;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.set(q(".hero-logo"), { opacity: 0, y: 30, scale: 0.94, filter: "blur(10px)" });
      gsap.set(q(".hero-tag-line"), { opacity: 0, y: 18 });
      gsap.set(q(".hero-cta"), { opacity: 0, y: 24 });
      gsap.set(q(".hero-stat"), { opacity: 0, y: 26 });
      gsap.set(q(".hero-scroll-hint"), { opacity: 0 });

      const h1 = root.querySelector(".hero-h1") as HTMLElement;
      const split = new SplitText(h1, { type: "lines,chars", linesClass: "overflow-hidden" });
      gsap.set(split.chars, { yPercent: 110, opacity: 0, filter: "blur(6px)" });
      // gradient text doesn't render on transformed char wrappers, so the
      // chars animate in solid gold; once whole again, the sheen takes over
      const restore = () => {
        split.revert();
        // revert() swaps the DOM back in — the old span reference is detached
        h1.querySelector(".gold-line")?.classList.add("text-gold-sheen");
      };

      const play = () => {
        if (reduced) {
          gsap.set(
            [q(".hero-logo"), split.chars, q(".hero-tag-line"), q(".hero-cta"), q(".hero-stat"), q(".hero-scroll-hint")],
            { opacity: 1, y: 0, yPercent: 0, scale: 1, filter: "blur(0px)" }
          );
          restore();
          countUp(true);
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(q(".hero-logo"), { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.8 }, 0.2)
          .to(
            split.chars,
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.3,
              stagger: 0.022,
              onComplete: restore,
            },
            0.75
          )
          .to(q(".hero-tag-line"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.22 }, 1.7)
          .to(q(".hero-cta"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.14 }, 2.1)
          .to(q(".hero-stat"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 2.4)
          .add(() => countUp(false), 2.4)
          .to(q(".hero-scroll-hint"), { opacity: 0.55, duration: 1.2 }, 3.1);
      };

      const countUp = (instant: boolean) => {
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (instant) {
            el.textContent = String(target);
            return;
          }
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });
      };

      // preloader may already have finished (e.g. fast navigation, HMR)
      if ((window as unknown as Record<string, unknown>).__wiRevealed) play();
      else window.addEventListener("wi:reveal", play, { once: true });

      // gentle scroll parallax out
      if (!reduced) {
        gsap.to(q(".hero-center"), {
          yPercent: -12,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // mouse parallax on the logo
      const onMouse = (e: MouseEvent) => {
        if (reduced || !logoRef.current) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        gsap.to(logoRef.current, {
          x: nx * 26,
          y: ny * 18,
          rotateY: nx * 6,
          rotateX: -ny * 5,
          transformPerspective: 900,
          duration: 1.4,
          ease: "power3.out",
        });
      };
      window.addEventListener("mousemove", onMouse);

      return () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("wi:reveal", play);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative flex min-h-[120vh] flex-col overflow-hidden"
    >
      {/* ambient glows */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(28,147,183,0.12), transparent 65%), radial-gradient(ellipse 55% 45% at 72% 78%, rgba(226,194,111,0.08), transparent 70%), linear-gradient(180deg, #04161e 0%, #05171f 45%, #071f29 100%)",
        }}
      />
      <RibbonField className="absolute inset-0 h-full w-full opacity-90" />

      <div className="hero-center relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 pt-40 pb-24 text-center">
        <div ref={logoRef} className="hero-logo logo-sheen w-[300px] will-change-transform md:w-[420px]">
          <Image
            src="/logo-stacked.png"
            alt="Welwitschia Investment Private Limited"
            width={1200}
            height={626}
            sizes="(max-width: 768px) 300px, 420px"
            priority
            className="h-auto w-full drop-shadow-[0_30px_60px_rgba(200,166,90,0.18)]"
          />
        </div>

        <h1 className="hero-h1 mt-14 font-display text-[clamp(2.6rem,6.5vw,5.4rem)] leading-[1.08] tracking-tight text-white-soft">
          Rooted in Strength.
          <br />
          <span className="gold-line text-gold-2">Built for Growth.</span>
        </h1>

        <div className="mt-9 flex flex-col items-center gap-1.5 font-serif-alt text-[clamp(1.05rem,2vw,1.45rem)] italic text-ivory/70">
          <p className="hero-tag-line">Strong Roots. Strong Returns.</p>
          <p className="hero-tag-line">Growing Wealth, Naturally.</p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
          <Magnetic className="hero-cta">
            <a href="#contact" className="btn-lux btn-gold">
              Request Consultation
            </a>
          </Magnetic>
          <Magnetic className="hero-cta">
            <a href="#products" className="btn-lux btn-outline">
              Explore Opportunities
            </a>
          </Magnetic>
        </div>
      </div>

      {/* stats */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-20">
        <div className="hairline mb-12" />
        <dl className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat text-center md:text-left">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl text-gold-2 md:text-5xl">
                {s.value !== null ? (
                  <>
                    <span data-count={s.value}>0</span>
                    {s.suffix}
                  </>
                ) : (
                  s.word
                )}
              </dd>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ivory/50">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-scroll-hint pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <div className="mx-auto h-12 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </div>
    </section>
  );
}
