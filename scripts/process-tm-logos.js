/* The "transparent" TM logo exports actually have the checkerboard pattern
   baked into their RGB pixels (no real alpha channel) — both checker tones
   are neutral grey, so we key by chroma/brightness the same way as the
   solid-background sources, just with a slightly wider neutral band to
   catch both the light and dark checker squares. */
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

async function keyChecker(srcPath) {
  const { data, info } = await sharp(srcPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, N = w * h;

  // soft alpha purely from chroma: the checkerboard (both tones, and any
  // blurred blend between them) is neutral grey; the art (gold + aqua) is
  // strongly saturated. Genuine specular highlights on the metal still
  // carry enough chroma to pass this on their own -- nothing legitimate
  // is lost by treating every neutral pixel here as background.
  const aSoft = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    aSoft[p] = smooth(22, 55, chroma);
  }

  const rgba = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    rgba[p * 4] = data[p * 3];
    rgba[p * 4 + 1] = data[p * 3 + 1];
    rgba[p * 4 + 2] = data[p * 3 + 2];
    rgba[p * 4 + 3] = Math.round(Math.min(1, aSoft[p]) * 255);
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
  const horiz = await keyChecker(path.join(SRC, "Logo horizontal transparent.png"));
  const horizOut = await sharp(horiz).resize({ width: 1200 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "logo-horizontal.png"), horizOut);
  const hm = await sharp(horizOut).metadata();
  console.log("logo-horizontal.png", hm.width + "x" + hm.height, (horizOut.length / 1024).toFixed(0) + "KB");
  await navyPreview(horizOut, "logo-horizontal");

  const stacked = await keyChecker(path.join(SRC, "Logo stacked transparent.png"));
  const stackedOut = await sharp(stacked).resize({ width: 1200 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "logo-stacked.png"), stackedOut);
  const sm = await sharp(stackedOut).metadata();
  console.log("logo-stacked.png", sm.width + "x" + sm.height, (stackedOut.length / 1024).toFixed(0) + "KB");
  await navyPreview(stackedOut, "logo-stacked");

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
