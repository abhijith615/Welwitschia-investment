"use client";

import { useEffect, useState } from "react";

const BANK_DETAILS = [
  { label: "Account Name", value: "WELWITSCHIA INVESTMENT PRIVATE LIMITED" },
  { label: "Bank Name", value: "Federal Bank" },
  { label: "Account Number", value: "13240200036942" },
  { label: "Type of Account", value: "Current" },
  { label: "IFSC Code", value: "FDRL0001324" },
];

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 15H4.6A1.6 1.6 0 0 1 3 13.4V4.6A1.6 1.6 0 0 1 4.6 3h8.8A1.6 1.6 0 0 1 15 4.6V6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the value is still visible to select manually */
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-hair py-4 last:border-b-0">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</p>
        <p className="mt-1.5 font-heading text-[17px] tracking-wide text-white-soft">{value}</p>
      </div>
      <button
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
          copied
            ? "border-gold-2 text-gold-2"
            : "border-hair text-ivory/50 hover:border-gold/50 hover:text-gold-2"
        }`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

export default function PaymentDetailsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

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
    const t = setTimeout(() => setMounted(false), 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [open]);

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
      className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto p-4 py-[8vh] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Payment / bank details"
    >
      <div
        className={`absolute inset-0 bg-[#04141b]/80 backdrop-blur-md transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`surface-teal relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-[0.97]"
        }`}
        style={{ background: "var(--color-teal)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 0%, rgba(226,194,111,0.10), transparent 45%), radial-gradient(circle at 100% 100%, rgba(28,147,183,0.12), transparent 45%)",
          }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-hair text-ivory/70 transition-colors hover:border-gold/50 hover:text-ivory"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative p-8 sm:p-12">
          <p className="eyebrow">Payment</p>
          <h2 className="mt-5 font-heading text-[clamp(1.7rem,3.6vw,2.3rem)] leading-[1.15] text-white-soft">
            Bank Account Details
          </h2>
          <p className="mt-4 max-w-[420px] text-[13.5px] leading-[1.8] text-ivory/55">
            For remittances to Welwitschia Investment Private Limited, please
            use the account details below.
          </p>

          <div className="mt-8">
            {BANK_DETAILS.map((d) => (
              <CopyRow key={d.label} label={d.label} value={d.value} />
            ))}
          </div>

          <p className="mt-7 text-[12px] leading-[1.8] text-ivory/40">
            Please verify these details independently before initiating any
            transfer. For any discrepancy, contact us at{" "}
            <a
              href="mailto:inquiry@welwitschiainvestment.com"
              className="text-gold-2 underline-offset-2 hover:underline"
            >
              inquiry@welwitschiainvestment.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
