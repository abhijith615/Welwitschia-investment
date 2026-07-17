/* Replace logo-horizontal.png and logo-stacked.png from the new transparent
   sources (the stacked one already had its white background-fill glow
   removed in a prior pass). Deliberately does NOT touch logo-mark.png,
   which is the preloader-only monogram crop. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DESIGN_SRC = path.join(ROOT, "design-source");
const PUBLIC = path.join(ROOT, "public");
const LOGO_DESIGN = "C:/Users/Abjith/Desktop/LOGO DESIGN/Welwitschia";

async function process(srcPath, outName, targetWidth) {
  const trimmed = await sharp(srcPath).trim({ threshold: 10 }).png().toBuffer();
  const out = await sharp(trimmed).resize({ width: targetWidth }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(PUBLIC, outName), out);
  const m = await sharp(out).metadata();
  console.log(outName, m.width + "x" + m.height, (out.length / 1024).toFixed(0) + "KB");
  return m;
}

(async () => {
  await process(path.join(LOGO_DESIGN, "New Logo horizontal transparent.png"), "logo-horizontal.png", 1200);
  await process(path.join(LOGO_DESIGN, "New Logo stacked transparent - deglow.png"), "logo-stacked.png", 1200);

  // keep a copy of the sources actually used, alongside the other brand assets
  fs.copyFileSync(
    path.join(LOGO_DESIGN, "New Logo horizontal transparent.png"),
    path.join(DESIGN_SRC, "New Logo horizontal transparent.png")
  );
  fs.copyFileSync(
    path.join(LOGO_DESIGN, "New Logo stacked transparent - deglow.png"),
    path.join(DESIGN_SRC, "New Logo stacked transparent - deglow.png")
  );
  console.log("copied sources into design-source/");
})().catch((e) => { console.error(e); process.exit(1); });
