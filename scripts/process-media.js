/* Optimises the supplied brand media into public/:
   - hero videos copied as-is (no ffmpeg available)
   - dark section backgrounds -> wide webp
   - service illustrations -> square webp cards */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..", "design-source", "media-raw");
const PUB = path.resolve(__dirname, "..", "public");
const SVC = path.join(PUB, "services");
fs.mkdirSync(SVC, { recursive: true });

const copy = (from, to) => {
  fs.copyFileSync(path.join(SRC, from), path.join(PUB, to));
  const mb = (fs.statSync(path.join(PUB, to)).size / 1048576).toFixed(1);
  console.log("copied", to, mb + "MB");
};

async function bg(from, to, width) {
  const buf = await sharp(path.join(SRC, from))
    .resize({ width, height: width, fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer();
  fs.writeFileSync(path.join(PUB, to), buf);
  console.log("bg", to, (buf.length / 1024).toFixed(0) + "KB");
}

async function card(from, to) {
  const buf = await sharp(path.join(SRC, from))
    .resize({ width: 900, height: 900, fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();
  fs.writeFileSync(path.join(SVC, to), buf);
  console.log("card", to, (buf.length / 1024).toFixed(0) + "KB");
}

const CARDS = [
  ["Investment Management.jpeg", "investment-management.webp"],
  ["Financial Advisory.jpeg", "financial-advisory.webp"],
  ["Real Estate Investment.jpeg", "real-estate.webp"],
  ["Private Equity & Business Investments.jpeg", "private-equity.webp"],
  ["Project Financing.jpeg", "project-financing.webp"],
  ["Portfolio Diversification.jpeg", "portfolio-diversification.webp"],
  ["Investment Research & Market Analysis.jpeg", "research.webp"],
  ["Strategic Partnerships.jpeg", "strategic-partnerships.webp"],
];

(async () => {
  copy("Hero section backgroung video desktop view.mp4", "hero-desktop.mp4");
  copy("Hero section backgroung video mobile view.mp4", "hero-mobile.mp4");
  await bg("Our Values Section backgroung.jpeg", "values-bg.webp", 1700);
  await bg("Investment products section background.jpeg", "products-bg.webp", 1700);
  for (const [from, to] of CARDS) await card(from, to);
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
