"use client";

import { useMemo, useRef, useState } from "react";
import { useReveal } from "@/lib/useReveal";
import Magnetic from "@/components/Magnetic";

const PHONES = ["+91 94985 02143", "+91 94985 02141", "+91 87784 98208"];

/* deterministic pseudo-random for the dotted world map */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function DottedMap() {
  // abstract dotted globe band — quiet, not literal
  const dots = useMemo(() => {
    const arr: { x: number; y: number; o: number; r: number }[] = [];
    for (let i = 0; i < 420; i++) {
      const x = rand(i) * 100;
      const y = rand(i + 1000) * 100;
      // carve a loose landmass-like density: denser bands, sparse oceans
      const band =
        Math.sin((y / 100) * Math.PI * 2.2 + rand(i + 500) * 1.4) * 0.5 + 0.5;
      if (rand(i + 2000) > band * 0.85) continue;
      // quantize so SSR and client render identical markup
      const q = (v: number) => Math.round(v * 1000) / 1000;
      arr.push({
        x: q(x),
        y: q(y),
        o: q(0.1 + rand(i + 3000) * 0.22),
        r: q(0.22 + rand(i + 4000) * 0.3),
      });
    }
    return arr;
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#1783a0" opacity={d.o * 0.85} />
      ))}
      {/* office beacon */}
      <circle cx="68" cy="58" r="0.9" fill="#b3852f" />
      <circle cx="68" cy="58" r="0.9" fill="none" stroke="#b3852f" strokeWidth="0.28" opacity="0.85">
        <animate attributeName="r" values="0.8;4" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="68" cy="58" r="0.9" fill="none" stroke="#b3852f" strokeWidth="0.22" opacity="0.6">
        <animate attributeName="r" values="0.8;4" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  useReveal(rootRef);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section ref={rootRef} id="contact" className="surface-cream relative overflow-hidden py-36 md:py-48">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 110%, rgba(28,147,183,0.08), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-6 md:px-12">
        <div className="mb-20 text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Private Enquiries
          </p>
          <h2
            className="mx-auto mt-9 max-w-2xl font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] text-white-soft"
            data-reveal="lines"
          >
            Begin a conversation.
          </h2>
          <p className="mx-auto mt-7 max-w-[480px] text-[14px] leading-[1.9] text-ivory/50" data-reveal="up">
            Consultations are private, unhurried, and without obligation.
          </p>
        </div>

        <div
          className="glass relative overflow-hidden rounded-2xl border-gold/20 md:grid md:grid-cols-[1fr_1.15fr]"
          data-reveal="scale"
          style={{ borderColor: "rgba(200,166,90,0.22)" }}
        >
          {/* left — the office */}
          <div className="relative min-h-[320px] border-b border-hair md:border-b-0 md:border-r">
            <div className="absolute inset-0 opacity-80">
              <DottedMap />
            </div>
            <div className="relative flex h-full flex-col justify-end p-10 md:p-14">
              <p className="text-[10.5px] uppercase tracking-[0.35em] text-gold">
                The Private Office
              </p>
              <h3 className="mt-4 font-heading text-2xl text-ivory">
                Welwitschia Investment
                <br />
                Private Limited
              </h3>
              <div className="mt-8 space-y-2.5">
                {PHONES.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="block w-fit text-[15px] tracking-wide text-ivory/70 transition-colors duration-300 hover:text-gold-2"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* right — enquiry form */}
          <div className="p-10 md:p-14">
            {sent ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                <div className="hairline w-24" />
                <h3 className="mt-8 font-heading text-3xl text-gold-2">Thank you.</h3>
                <p className="mt-5 max-w-[380px] text-[14px] leading-[1.9] text-ivory/60">
                  Your enquiry has been received. A member of our private
                  office will be in touch shortly.
                </p>
                <div className="hairline mt-8 w-24" />
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex h-full flex-col gap-9">
                <div className="grid gap-9 sm:grid-cols-2">
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                      Full Name
                    </span>
                    <input required name="name" className="input-lux" placeholder="Your name" autoComplete="name" />
                  </label>
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      className="input-lux"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                </div>
                <label className="field block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                    Area of Interest
                  </span>
                  <select name="interest" className="input-lux bg-transparent" defaultValue="">
                    <option value="" disabled hidden>
                      Select an area
                    </option>
                    {[
                      "Investment Management",
                      "Financial Advisory",
                      "Real Estate Investment",
                      "Private Equity & Business Investments",
                      "Project Financing",
                      "Portfolio Diversification",
                      "Strategic Partnerships",
                      "Other",
                    ].map((o) => (
                      <option key={o} value={o} className="bg-[#f4ebe0] text-[#163038]">
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    className="input-lux resize-none"
                    placeholder="Tell us about your objectives"
                  />
                </label>
                <div className="mt-auto pt-2">
                  <Magnetic>
                    <button type="submit" className="btn-lux btn-gold">
                      Submit Enquiry
                    </button>
                  </Magnetic>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
