"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsapSetup";
import Magnetic from "@/components/Magnetic";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#values", label: "Values" },
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { yPercent: -120 });
    const show = () =>
      gsap.to(el, { yPercent: 0, duration: 1.4, ease: "power4.out", delay: 0.6 });
    window.addEventListener("wi:reveal", show, { once: true });

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("wi:reveal", show);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[70] transition-[background,border,backdrop-filter] duration-700 ${
        scrolled
          ? "border-b border-hair bg-[#f4ebe0]/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="relative block w-[190px] md:w-[225px]" aria-label="Welwitschia Investment — home">
          <Image
            src="/logo-horizontal.png"
            alt="Welwitschia Investment Private Limited"
            width={1200}
            height={267}
            sizes="225px"
            priority
            // brighten over the dark hero; keep natural on the cream scrolled bar
            className={`h-auto w-full transition-[filter] duration-500 ${
              scrolled ? "" : "[filter:brightness(1.45)_saturate(1.2)]"
            }`}
          />
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`nav-link text-[11px] uppercase tracking-[0.24em] transition-colors duration-300 ${
                  scrolled
                    ? "text-[#163038]/75 hover:text-[#0e262c]"
                    : "text-ivory/75 hover:text-ivory"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className={`btn-lux btn-outline !px-6 !py-3 !text-[10px] ${
                  scrolled ? "" : "!text-[color:var(--color-ivory)]"
                }`}
              >
                Request Consultation
              </a>
            </Magnetic>
          </li>
        </ul>

        {/* mobile toggle */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-7 bg-gold transition-transform duration-500 ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-px w-7 bg-gold transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`overflow-hidden bg-[#f4ebe0]/97 backdrop-blur-xl transition-[max-height] duration-700 ease-in-out lg:hidden ${
          open ? "max-h-[420px] border-b border-hair" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-8 py-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-xl text-[#163038]/85"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
