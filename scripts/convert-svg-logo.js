/* The supplied "no background" logos are SVGs that composite a colour image
   through a luminance mask (feColorMatrix). resvg/sharp ignore that mask and
   render the opaque colour layer on white. So we do the masking ourselves:
     alpha(out) = luminance(mask image)   RGB(out) = colour image
   Each SVG embeds exactly two base64 PNGs: [0] = mask source, [1] = colour. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..", "design-source");
const OUT = path.resolve(__dirname, "..", "public");

function extractPngs(svgText) {
  const re = /data:image\/png;base64,([A-Za-z0-9+/=]+)/g;
  const out = [];
  let m;
  while ((m = re.exec(svgText))) out.push(Buffer.from(m[1], "base64"));
  return out;
}

async function buildLogo(svgName, outName, targetW) {
  const svg = fs.readFileSync(path.join(SRC, svgName), "utf8");
  const pngs = extractPngs(svg);
  if (pngs.length < 2) throw new Error(`${svgName}: expected 2 images, got ${pngs.length}`);

  const maskImg = sharp(pngs[0]);
  const colourImg = sharp(pngs[1]);

  const maskMeta = await maskImg.metadata();
  const colMeta = await colourImg.metadata();
  const w = colMeta.width;
  const h = colMeta.height;

  // luminance of the mask image -> single channel alpha
  let alpha = await sharp(pngs[0])
    .resize(w, h, { fit: "fill" })
    .removeAlpha()
    .grayscale()
    .raw()
    .toBuffer();

  // colour layer RGB
  const rgb = await sharp(pngs[1]).removeAlpha().raw().toBuffer();

  // join alpha as 4th channel
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  const trimmed = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 6 })
    .resize({ width: targetW })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT, outName), trimmed);
  const mm = await sharp(trimmed).metadata();
  console.log(outName, mm.width + "x" + mm.height, (trimmed.length / 1024).toFixed(0) + "KB", `(mask ${maskMeta.width}x${maskMeta.height})`);

  await navyPreview(trimmed, outName);
  return trimmed;
}

async function navyPreview(buf, name) {
  const m = await sharp(buf).metadata();
  const prev = await sharp({
    create: { width: m.width + 160, height: m.height + 160, channels: 4, background: { r: 8, g: 18, b: 26, alpha: 1 } },
  })
    .composite([{ input: buf, top: 80, left: 80 }])
    .jpeg({ quality: 86 })
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, "..", "preview-" + name + ".jpg"), prev);
}

(async () => {
  await buildLogo("Logo horizontal  no background.svg", "logo-horizontal.png", 1200);
  const stackedBuf = await buildLogo("Logo stacked no background.svg", "logo-stacked.png", 1200);

  // monogram mark = top region of the stacked logo
  const meta = await sharp(stackedBuf).metadata();
  const mark = await sharp(stackedBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.46) })
    .trim({ threshold: 6 })
    .resize({ width: 800 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT, "logo-mark.png"), mark);
  const mm = await sharp(mark).metadata();
  console.log("logo-mark.png", mm.width + "x" + mm.height);
  await navyPreview(mark, "logo-mark.png");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
