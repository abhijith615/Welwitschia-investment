"use client";

import { useEffect, useRef, useState } from "react";
import Magnetic from "@/components/Magnetic";

const ROLES = [
  "Investment Analyst",
  "Portfolio Manager",
  "Financial Advisory",
  "Research & Market Analysis",
  "Operations",
  "Client Relations",
  "Internship",
  "Speculative / Other",
];

export default function CareersModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // mount/unmount with an enter+exit transition window
  // (setState deferred into rAF/timeout so it isn't called synchronously in the effect)
  useEffect(() => {
    if (open) {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        setMounted(true);
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    const raf = requestAnimationFrame(() => setVisible(false));
    const t = setTimeout(() => {
      setMounted(false);
      setSent(false);
    }, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [open]);

  // scroll lock + escape to close
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto p-4 py-[6vh] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Careers enquiry"
    >
      {/* scrim */}
      <div
        className={`absolute inset-0 bg-[#04141b]/80 backdrop-blur-md transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* card */}
      <div
        ref={cardRef}
        className={`surface-cream relative w-full max-w-[720px] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-[0.97]"
        }`}
        style={{ background: "var(--color-cream)" }}
      >
        {/* ambient corner glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 0%, rgba(200,166,90,0.12), transparent 45%), radial-gradient(circle at 100% 100%, rgba(28,147,183,0.10), transparent 45%)",
          }}
        />

        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-hair text-[#163038]/70 transition-colors hover:border-gold/50 hover:text-[#163038]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative p-8 sm:p-12">
          {sent ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="hairline w-24" />
              <h3 className="mt-8 font-heading text-3xl text-gold-deep">Thank you.</h3>
              <p className="mt-5 max-w-[420px] text-[14px] leading-[1.9] text-ivory/70">
                Your details have reached our People &amp; Talent office. If your
                profile aligns with an opportunity, a member of our team will be
                in touch in confidence.
              </p>
              <div className="hairline mt-8 w-24" />
              <button
                onClick={onClose}
                className="mt-9 text-[11px] uppercase tracking-[0.28em] text-gold-deep transition-colors hover:text-[#163038]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">Careers</p>
              <h2 className="mt-5 font-heading text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] text-white-soft">
                Build a career that endures.
              </h2>
              <p className="mt-4 max-w-[520px] text-[14px] leading-[1.9] text-ivory/65">
                We are always interested in exceptional people. Share your
                details with our People &amp; Talent office and we will reach out
                should the right opportunity arise.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-9 flex flex-col gap-8"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                      Full Name
                    </span>
                    <input required name="name" className="input-lux" placeholder="Your name" autoComplete="name" />
                  </label>
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                      Email
                    </span>
                    <input required type="email" name="email" className="input-lux" placeholder="you@example.com" autoComplete="email" />
                  </label>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                      Phone
                    </span>
                    <input name="phone" className="input-lux" placeholder="Optional" autoComplete="tel" />
                  </label>
                  <label className="field block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                      Area of Interest
                    </span>
                    <select name="role" className="input-lux bg-transparent" defaultValue="">
                      <option value="" disabled hidden>
                        Select an area
                      </option>
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="bg-[#f4ebe0] text-[#163038]">
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="field block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                    LinkedIn / Portfolio / CV link
                  </span>
                  <input name="link" className="input-lux" placeholder="https://" inputMode="url" />
                </label>

                <label className="field block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                    A note about you
                  </span>
                  <textarea required name="message" rows={3} className="input-lux resize-none" placeholder="Tell us where you would add value" />
                </label>

                <div className="pt-1">
                  <Magnetic>
                    <button type="submit" className="btn-lux btn-gold">
                      Send to HR
                    </button>
                  </Magnetic>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
