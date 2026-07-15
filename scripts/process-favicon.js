/* Keys the white/paper background out of "logo emblem.jpg" (same chroma +
   darkness approach used for the other JPEG logo sources), trims to the
   mark, then renders a square, padded favicon PNG at several sizes and
   packs them into a real multi-size .ico (PNG-in-ICO, supported since
   Windows Vista / all modern browsers). */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "design-source", "logo emblem.jpg");
const PUBLIC = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

async function keyToTransparent(srcPath) {
  const img = sharp(srcPath).removeAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // anchor the sampling window so it never reads past the buffer's edge
  let br = 0, bg = 0, bb = 0, n = 0;
  const corners = [[0, 0], [w - 8, 0], [0, h - 8], [w - 8, h - 8]];
  for (const [x, y] of corners) {
    for (let dy = 0; dy < 8; dy++) for (let dx = 0; dx < 8; dx++) {
      const i = ((y + dy) * w + (x + dx)) * 3;
      br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++;
    }
  }
  br /= n; bg /= n; bb /= n;
  const bgLum = 0.299 * br + 0.587 * bg + 0.114 * bb;

  const alpha = new Float32Array(w * h);
  for (let p = 0; p < w * h; p++) {
    const i = p * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const chroma = mx - mn;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const aChroma = smooth(30, 68, chroma);
    const aDark = smooth(0.34, 0.6, (bgLum - lum) / bgLum);
    alpha[p] = Math.max(aChroma, aDark);
  }

  // dilate to fill specular pinholes in brushed metal
  const dil = new Float32Array(w * h);
  const R = 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let dy = -R; dy <= R; dy++) {
        const yy = y + dy; if (yy < 0 || yy >= h) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx; if (xx < 0 || xx >= w) continue;
          const v = alpha[yy * w + xx]; if (v > m) m = v;
        }
      }
      dil[y * w + x] = Math.min(1, alpha[y * w + x] * 0.35 + m * 0.65);
    }
  }

  const rgba = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    rgba[p * 4] = data[p * 3];
    rgba[p * 4 + 1] = data[p * 3 + 1];
    rgba[p * 4 + 2] = data[p * 3 + 2];
    rgba[p * 4 + 3] = Math.round(dil[p] * 255);
  }

  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 12 })
    .png()
    .toBuffer();
}

async function squareOn(buf, size, pad = 0.14) {
  const inner = Math.round(size * (1 - pad * 2));
  const resized = await sharp(buf)
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, left, top }])
    .png()
    .toBuffer();
}

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  pngBuffers.forEach((buf, i) => {
    const entryOff = 6 + i * 16;
    const size = buf.size; // 0-255, 0 means 256
    header.writeUInt8(size, entryOff); // width
    header.writeUInt8(size, entryOff + 1); // height
    header.writeUInt8(0, entryOff + 2); // color palette
    header.writeUInt8(0, entryOff + 3); // reserved
    header.writeUInt16LE(1, entryOff + 4); // color planes
    header.writeUInt16LE(32, entryOff + 6); // bits per pixel
    header.writeUInt32LE(buf.data.length, entryOff + 8); // byte size
    header.writeUInt32LE(offset, entryOff + 12); // offset
    offset += buf.data.length;
  });

  return Buffer.concat([header, ...pngBuffers.map((b) => b.data)]);
}

(async () => {
  const keyed = await keyToTransparent(SRC);
  const meta = await sharp(keyed).metadata();
  console.log("keyed emblem:", meta.width + "x" + meta.height);

  // navy preview for a quick visual sanity check
  const prevBuf = await sharp(keyed).resize({ width: 600 }).toBuffer();
  const pm = await sharp(prevBuf).metadata();
  await sharp({ create: { width: pm.width + 120, height: pm.height + 120, channels: 4, background: { r: 8, g: 18, b: 26, alpha: 1 } } })
    .composite([{ input: prevBuf, top: 60, left: 60 }])
    .jpeg({ quality: 88 })
    .toFile(path.join(ROOT, "preview-logo-emblem.jpg"));

  // square favicon PNGs
  const sizes = [16, 32, 48, 180];
  const results = {};
  for (const s of sizes) {
    results[s] = await squareOn(keyed, s, s <= 48 ? 0.06 : 0.14);
  }

  fs.writeFileSync(path.join(PUBLIC, "icon-16.png"), results[16]);
  fs.writeFileSync(path.join(PUBLIC, "icon-32.png"), results[32]);
  fs.writeFileSync(path.join(PUBLIC, "apple-icon.png"), results[180]);
  console.log("wrote favicon PNGs");

  const ico = buildIco([
    { size: 16, data: results[16] },
    { size: 32, data: results[32] },
    { size: 48, data: results[48] },
  ]);
  fs.writeFileSync(path.join(APP, "favicon.ico"), ico);
  console.log("wrote src/app/favicon.ico", (ico.length / 1024).toFixed(1) + "KB");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
