"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsapSetup";
import { useReveal } from "@/lib/useReveal";

type Item = {
  kicker: string;
  title: string;
  body: string;
  motif: MotifKind;
};

type MotifKind =
  | "growth"
  | "transparency"
  | "experience"
  | "risk"
  | "client"
  | "sustainable";

const ITEMS: Item[] = [
  {
    kicker: "Patience as strategy",
    title: "Long-term investment focus",
    body: "Capital measured in decades, not quarters. We build positions designed to compound quietly and endure every cycle — the discipline of the long view.",
    motif: "growth",
  },
  {
    kicker: "Nothing concealed",
    title: "Transparent & ethical practices",
    body: "Every engagement is governed by clarity. Full visibility into how your capital is deployed, and an ethical standard that never bends to convenience.",
    motif: "transparency",
  },
  {
    kicker: "Seasoned judgment",
    title: "Experienced professionals",
    body: "Specialists who have navigated markets across asset classes and cycles. Conviction earned through experience, not borrowed from consensus.",
    motif: "experience",
  },
  {
    kicker: "Preservation first",
    title: "Strategic risk management",
    body: "Discipline before opportunity. We model downside before upside, because the first mandate of enduring wealth is never to lose it.",
    motif: "risk",
  },
  {
    kicker: "Composed around you",
    title: "Client-focused solutions",
    body: "No standardised portfolios. Every strategy is composed around your objectives, your horizon, and the legacy you intend to leave.",
    motif: "client",
  },
  {
    kicker: "Wealth that regenerates",
    title: "Sustainable value creation",
    body: "Growth that renews itself — commitments that create lasting value for clients, partners and communities alike, season after season.",
    motif: "sustainable",
  },
];

const STATES = ITEMS.length;

/* ---------------- bespoke aqua / gold line motifs ---------------- */
function Motif({ kind }: { kind: MotifKind }) {
  const common = {
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  /* deeper tones so the line-art reads on the cream surface */
  const GOLD = "#bd8836";
  const GOLD_D = "#a9853f";
  const AQUA = "#1783a0";
  const AQUA_D = "#0f6178";

  switch (kind) {
    case "growth":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <line className="wm-draw" x1="24" y1="164" x2="176" y2="164" stroke={AQUA_D} strokeWidth="1.5" opacity="0.5" {...common} />
          {[24, 62, 100, 138, 176].map((x) => (
            <line key={x} className="wm-draw" x1={x} y1="164" x2={x} y2="170" stroke={AQUA_D} strokeWidth="1.5" opacity="0.5" {...common} />
          ))}
          <path className="wm-draw" d="M24 150 C 66 146, 84 108, 108 92 S 156 52, 176 34" stroke={GOLD} strokeWidth="2.5" {...common} />
          {[[24, 150], [76, 118], [124, 80], [176, 34]].map(([x, y], i) => (
            <circle key={i} className="wm-dot" cx={x} cy={y} r="3.5" fill={GOLD} />
          ))}
        </svg>
      );
    case "transparency":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {[86, 62, 40, 20].map((r, i) => (
            <circle key={r} className="wm-draw" cx="100" cy="100" r={r} stroke={i % 2 ? AQUA : GOLD} strokeWidth={i % 2 ? 1.5 : 2} opacity={i % 2 ? 0.6 : 1} {...common} />
          ))}
          <circle className="wm-dot" cx="100" cy="100" r="5" fill={GOLD} />
        </svg>
      );
    case "experience":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path className="wm-draw" d="M22 100 C 52 52, 84 52, 100 100 S 148 148, 178 100" stroke={GOLD} strokeWidth="2.5" {...common} />
          <path className="wm-draw" d="M22 100 C 52 148, 84 148, 100 100 S 148 52, 178 100" stroke={AQUA} strokeWidth="2.5" opacity="0.85" {...common} />
          <circle className="wm-dot" cx="100" cy="100" r="4" fill={GOLD} />
        </svg>
      );
    case "risk":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path className="wm-draw" d="M100 26 L162 54 L162 108 C162 150, 132 172, 100 180 C68 172, 38 150, 38 108 L38 54 Z" stroke={GOLD} strokeWidth="2.5" {...common} />
          <path className="wm-draw" d="M74 104 L94 126 L130 78" stroke={AQUA} strokeWidth="2.5" {...common} />
        </svg>
      );
    case "client":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x1 = 100 + Math.cos(a) * 84;
            const y1 = 100 + Math.sin(a) * 84;
            const x2 = 100 + Math.cos(a) * 44;
            const y2 = 100 + Math.sin(a) * 44;
            return <line key={i} className="wm-draw" x1={x1} y1={y1} x2={x2} y2={y2} stroke={AQUA} strokeWidth="1.6" opacity="0.75" {...common} />;
          })}
          <circle className="wm-draw" cx="100" cy="100" r="30" stroke={GOLD} strokeWidth="2" {...common} />
          <circle className="wm-dot" cx="100" cy="100" r="7" fill={GOLD} />
        </svg>
      );
    case "sustainable":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path className="wm-draw" d="M100 182 L100 74" stroke={GOLD_D} strokeWidth="2.5" {...common} />
          <path className="wm-draw" d="M100 118 C 70 116, 40 96, 34 60 C 74 58, 98 82, 100 118 Z" stroke={AQUA} strokeWidth="2" {...common} />
          <path className="wm-draw" d="M100 96 C 130 94, 160 74, 166 40 C 126 38, 102 60, 100 96 Z" stroke={GOLD} strokeWidth="2" {...common} />
          <path className="wm-draw" d="M100 108 C 88 100, 74 92, 58 88" stroke={GOLD_D} strokeWidth="1.3" opacity="0.7" {...common} />
          <path className="wm-draw" d="M100 86 C 116 80, 130 70, 140 58" stroke={AQUA_D} strokeWidth="1.3" opacity="0.7" {...common} />
        </svg>
      );
  }
}

export default function WhyUs() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useReveal(rootRef);

  // desktop: map scroll progress through the tall driver to an active index
  useEffect(() => {
    const driver = driverRef.current;
    if (!driver) return;
    let lastIdx = -1;

    const st = ScrollTrigger.create({
      trigger: driver,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (railRef.current) gsap.set(railRef.current, { scaleY: self.progress });
        const idx = Math.min(STATES - 1, Math.floor(self.progress * STATES));
        if (idx !== lastIdx) {
          lastIdx = idx;
          setActive(idx);
        }
      },
    });
    return () => st.kill();
  }, []);

  // bespoke entrance for whichever panel becomes active
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const panel = panelsRef.current[active];
    if (!panel) return;
    const ctx = gsap.context(() => {
      const draws = panel.querySelectorAll<SVGGeometryElement>(".wm-draw");
      draws.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" });
      });
      gsap.fromTo(panel.querySelectorAll(".wm-dot"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.6, ease: "back.out(2.4)", delay: 0.5, stagger: 0.06 });
      gsap.fromTo(panel.querySelector(".wm-kicker"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(panel.querySelector(".wm-title"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.08 });
      gsap.fromTo(panel.querySelector(".wm-body"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.16 });
      gsap.fromTo(panel.querySelector(".wm-ghost"), { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" });
    }, panel);
    return () => ctx.revert();
  }, [active]);

  return (
    <section ref={rootRef} id="why" className="surface-cream relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 78% 18%, rgba(28,147,183,0.07), transparent 62%), radial-gradient(ellipse 50% 40% at 12% 88%, rgba(226,194,111,0.05), transparent 66%)",
        }}
      />

      {/* header */}
      <div className="relative mx-auto max-w-[1440px] px-6 pt-32 md:px-12 md:pt-44">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow" data-reveal="fade">
              Why Welwitschia
            </p>
            <h2
              className="mt-9 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.12] text-white-soft"
              data-reveal="lines"
            >
              The standard behind
              <br />
              every decision.
            </h2>
          </div>
          <p className="max-w-[440px] text-[14.5px] leading-[1.95] text-ivory/55 lg:justify-self-end" data-reveal="up">
            Six commitments define how we steward capital. Not features — the
            principles that make Welwitschia the partner chosen by those who
            think in generations.
          </p>
        </div>
      </div>

      {/* ---------- desktop interactive showcase ---------- */}
      <div ref={driverRef} className="relative hidden lg:block" style={{ height: `${STATES * 90}vh` }}>
        {/* scroll anchors for the index navigation */}
        {ITEMS.map((_, i) => (
          <span
            key={i}
            id={`why-${i}`}
            className="pointer-events-none absolute"
            style={{ top: `${((i + 0.5) / STATES) * 100}%` }}
            aria-hidden
          />
        ))}

        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[0.85fr_1.15fr] items-center gap-20 px-12">
            {/* left — interactive index */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 bottom-1 w-px bg-[color:var(--hair)]" />
              <div
                ref={railRef}
                className="absolute left-0 top-1 w-px origin-top bg-gradient-to-b from-gold-2 via-aqua to-transparent"
                style={{ height: "calc(100% - 0.5rem)", transform: "scaleY(0)" }}
              />
              <ul className="space-y-6">
                {ITEMS.map((it, i) => {
                  const on = active === i;
                  return (
                    <li key={i}>
                      <a
                        href={`#why-${i}`}
                        className={`group flex items-baseline gap-5 transition-all duration-500 ${
                          on ? "translate-x-1" : "opacity-45 hover:opacity-80"
                        }`}
                      >
                        <span
                          className={`font-body text-[11px] tracking-[0.3em] transition-colors duration-500 ${
                            on ? "text-gold-2" : "text-ivory/50"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className={`font-display leading-tight transition-all duration-500 ${
                            on
                              ? "text-[1.55rem] text-white-soft"
                              : "text-[1.35rem] text-ivory/70"
                          }`}
                        >
                          {it.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* right — active stage */}
            <div className="relative h-[440px]">
              {ITEMS.map((it, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    panelsRef.current[i] = el;
                  }}
                  className={`absolute inset-0 transition-all duration-700 ${
                    active === i
                      ? "opacity-100 blur-0"
                      : "pointer-events-none opacity-0 blur-[6px]"
                  }`}
                >
                  <span className="wm-ghost pointer-events-none absolute -top-24 right-0 font-display text-[13rem] leading-none text-[#173a44]/[0.07]">
                    0{i + 1}
                  </span>
                  <div className="relative flex items-start gap-10">
                    <div className="h-[128px] w-[128px] shrink-0">
                      <Motif kind={it.motif} />
                    </div>
                    <div className="pt-2">
                      <p className="wm-kicker eyebrow">{it.kicker}</p>
                      <h3 className="wm-title mt-6 font-display text-[clamp(2rem,2.8vw,2.9rem)] leading-[1.1] text-white-soft">
                        {it.title}
                      </h3>
                      <p className="wm-body mt-6 max-w-[460px] text-[15px] leading-[1.95] text-ivory/62">
                        {it.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- mobile stacked cards ---------- */}
      <div className="relative mx-auto mt-20 max-w-[640px] space-y-5 px-6 pb-32 lg:hidden">
        {ITEMS.map((it, i) => (
          <article
            key={i}
            data-reveal="up"
            className="glass relative overflow-hidden rounded-2xl p-8"
          >
            <span className="pointer-events-none absolute -top-6 right-2 font-display text-[6rem] leading-none text-[#173a44]/[0.07]">
              0{i + 1}
            </span>
            <div className="relative flex items-start gap-6">
              <div className="h-[76px] w-[76px] shrink-0">
                <Motif kind={it.motif} />
              </div>
              <div>
                <p className="eyebrow">{it.kicker}</p>
                <h3 className="mt-4 font-display text-[1.7rem] leading-tight text-white-soft">
                  {it.title}
                </h3>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] leading-[1.85] text-ivory/58">
              {it.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
