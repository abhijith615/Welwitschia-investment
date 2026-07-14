"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useReveal } from "@/lib/useReveal";
import CareersModal from "@/components/CareersModal";
import PaymentDetailsModal from "@/components/PaymentDetailsModal";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#values", label: "Values" },
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/welwitschia-investment-private-limited/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/welwitschiainvestment?igsh=MTR6aXdqNDg2cjQ1MQ==",
  },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const [careersOpen, setCareersOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  useReveal(rootRef);

  return (
    <footer ref={rootRef} className="surface-teal relative overflow-hidden pt-32 pb-12">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #08272f 38%), radial-gradient(ellipse 60% 45% at 50% 100%, rgba(226,194,111,0.09), transparent 70%)",
        }}
      />
      {/* soft transition up from the cream Contact above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f4ebe0] to-transparent"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="flex flex-col items-center">
          <div className="w-[300px] md:w-[380px]" data-reveal="scale">
            <Image
              src="/logo-stacked.png"
              alt="Welwitschia Investment Private Limited"
              width={1200}
              height={626}
              sizes="380px"
              className="h-auto w-full opacity-95"
            />
          </div>
          <p className="mt-8 font-serif-alt text-base italic text-ivory/40" data-reveal="fade">
            Strong Roots. Strong Returns. Growing Wealth, Naturally.
          </p>
        </div>

        <div className="hairline mt-16" data-reveal="fade" />

        <div className="mt-12 flex flex-col items-center justify-between gap-10 md:flex-row" data-reveal="up">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="nav-link text-[10.5px] uppercase tracking-[0.26em] text-ivory/55 transition-colors hover:text-ivory"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCareersOpen(true)}
                  className="nav-link text-[10.5px] uppercase tracking-[0.26em] text-ivory/55 transition-colors hover:text-ivory"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPaymentOpen(true)}
                  className="nav-link text-[10.5px] uppercase tracking-[0.26em] text-ivory/55 transition-colors hover:text-ivory"
                >
                  Payment
                </button>
              </li>
            </ul>
          </nav>
          <ul className="flex gap-7">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="nav-link text-[10.5px] uppercase tracking-[0.26em] text-ivory/40 transition-colors hover:text-gold-2"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 text-[10.5px] tracking-[0.18em] text-ivory/30 md:flex-row">
          <p>
            © {new Date().getFullYear()} Welwitschia Investment Private Limited.
            All rights reserved.
          </p>
          <p className="flex gap-6">
            <a href="/privacy-policy" className="transition-colors hover:text-ivory/60">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-ivory/60">
              Terms &amp; Conditions
            </a>
          </p>
        </div>
      </div>

      <CareersModal open={careersOpen} onClose={() => setCareersOpen(false)} />
      <PaymentDetailsModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </footer>
  );
}
