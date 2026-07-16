/* Keys the dark background out of the trademark logo JPEGs (gold monogram +
   aqua wordmark on near-black). The art is saturated and/or bright while the
   background is dark and neutral, so alpha = max(chroma, brightness-above-bg):
     - chroma keeps the gold and the aqua type
     - brightness keeps the bright metal highlights (no interior mottling)
     - the dark ground, the letter counters and the centre gap all drop out
   Edge anti-aliasing blends toward black, which vanishes on the dark site. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "design-source");
const PUBLIC = path.join(ROOT, "public");

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

async function keyDark(srcPath) {
  const { data, info } = await sharp(srcPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, N = w * h;

  // background luminance from the four corners
  let bl = 0, n = 0;
  const corners = [[0, 0], [w - 8, 0], [0, h - 8], [w - 8, h - 8]];
  for (const [x, y] of corners) {
    for (let dy = 0; dy < 8; dy++) for (let dx = 0; dx < 8; dx++) {
      const i = ((y + dy) * w + (x + dx)) * 3;
      bl += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; n++;
    }
  }
  bl /= n;

  const rgba = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    const i = p * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const aChroma = smooth(28, 70, chroma);
    const aBright = smooth(bl + 55, bl + 115, lum);
    rgba[p * 4] = r;
    rgba[p * 4 + 1] = g;
    rgba[p * 4 + 2] = b;
    rgba[p * 4 + 3] = Math.round(Math.min(1, Math.max(aChroma, aBright)) * 255);
  }
  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 16 }).png().toBuffer();
}

async function navyPreview(buf, name) {
  const b = await sharp(buf).resize({ width: 900 }).toBuffer();
  const m = await sharp(b).metadata();
  await sharp({ create: { width: m.width + 160, height: m.height + 160, channels: 4, background: { r: 8, g: 18, b: 26, alpha: 1 } } })
    .composite([{ input: b, top: 80, left: 80 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(ROOT, "preview-" + name + ".jpg"));
}

(async () => {
  // horizontal
  const horiz = await keyDark(path.join(SRC, "Logo horizontal TM dark.jpeg"));
  const horizOut = await sharp(horiz).resize({ width: 1200 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "logo-horizontal.png"), horizOut);
  const hm = await sharp(horizOut).metadata();
  console.log("logo-horizontal.png", hm.width + "x" + hm.height, (horizOut.length / 1024).toFixed(0) + "KB");
  await navyPreview(horizOut, "logo-horizontal");

  // stacked
  const stacked = await keyDark(path.join(SRC, "Logo stacked TM dark.jpeg"));
  const stackedOut = await sharp(stacked).resize({ width: 1200 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "logo-stacked.png"), stackedOut);
  const sm = await sharp(stackedOut).metadata();
  console.log("logo-stacked.png", sm.width + "x" + sm.height, (stackedOut.length / 1024).toFixed(0) + "KB");
  await navyPreview(stackedOut, "logo-stacked");

  // monogram mark = top (monogram) region of the keyed stacked lockup, re-trimmed
  const meta = await sharp(stacked).metadata();
  const mark = await sharp(stacked)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.52) })
    .trim({ threshold: 16 })
    .resize({ width: 800 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "logo-mark.png"), mark);
  const mm = await sharp(mark).metadata();
  console.log("logo-mark.png", mm.width + "x" + mm.height, (mark.length / 1024).toFixed(0) + "KB");
  await navyPreview(mark, "logo-mark");
})().catch((e) => { console.error(e); process.exit(1); });
