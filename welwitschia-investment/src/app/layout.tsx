import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://welwitschiainvestment.com"),
  title: "Welwitschia Investment Private Limited — Rooted in Strength. Built for Growth.",
  description:
    "Welwitschia Investment Private Limited is a private investment firm serving individuals, families, businesses and institutions — investment management, financial advisory, real estate, private equity and strategic partnerships guided by endurance, integrity and long-term growth.",
  keywords: [
    "Welwitschia Investment",
    "private investment firm",
    "wealth management",
    "investment management",
    "private equity",
    "family office",
  ],
  openGraph: {
    title: "Welwitschia Investment Private Limited",
    description:
      "Strong Roots. Strong Returns. Growing Wealth, Naturally. A private investment firm built for generations.",
    type: "website",
    images: [{ url: "/logo-stacked.png" }],
  },
  icons: { icon: "/logo-mark.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain vignette">{children}</body>
    </html>
  );
}
