import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-cream flex min-h-screen flex-col">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-hair bg-[#f4ebe0]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="block w-[180px] md:w-[200px]" aria-label="Welwitschia Investment — home">
            <Image
              src="/logo-horizontal.png"
              alt="Welwitschia Investment Private Limited"
              width={1200}
              height={270}
              sizes="200px"
              priority
              className="h-auto w-full"
            />
          </Link>
          <Link
            href="/"
            className="nav-link text-[11px] uppercase tracking-[0.24em] text-ivory/75 transition-colors hover:text-ivory"
          >
            Return to site
          </Link>
        </div>
      </header>

      {/* content */}
      <main className="mx-auto w-full max-w-[820px] flex-1 px-6 py-16 md:px-10 md:py-24">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-6 font-heading text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1] text-white-soft">
          {title}
        </h1>
        <p className="mt-5 text-[12px] uppercase tracking-[0.24em] text-ivory/45">
          Last updated: {updated}
        </p>
        <div className="hairline mt-10" />
        <div className="legal-prose mt-12">{children}</div>
      </main>

      {/* footer */}
      <footer className="surface-teal">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 px-6 py-10 text-[10.5px] tracking-[0.18em] text-ivory/40 md:flex-row md:px-10">
          <p>
            © {new Date().getFullYear()} Welwitschia Investment Private Limited.
            All rights reserved.
          </p>
          <p className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-ivory/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ivory/70">
              Terms &amp; Conditions
            </Link>
            <Link href="/" className="transition-colors hover:text-ivory/70">
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
