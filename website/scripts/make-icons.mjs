#!/usr/bin/env node
/**
 * Regenerates the full icon set + OG card from public/brand/aurum-mark.png.
 *
 *   npm run icons
 */
import { access, copyFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/brand/aurum-mark.png";
const INK = { r: 9, g: 9, b: 10, alpha: 1 };

const exists = (p) => access(p).then(() => true).catch(() => false);

async function main() {
  if (!(await exists(SRC))) {
    console.error(`\n  Missing ${SRC}\n  Put your square master logo there first.\n`);
    process.exit(1);
  }
  await mkdir("public/brand", { recursive: true });

  for (const size of [16, 32, 48, 180, 192, 512]) {
    await sharp(SRC)
      .resize(size, size, { fit: "contain", background: INK })
      .flatten({ background: INK })
      .png()
      .toFile(`public/brand/icon-${size}.png`);
    console.log(`  ✓ icon-${size}.png`);
  }

  const mark = await sharp(SRC).resize(300, 300, { fit: "contain", background: INK }).toBuffer();
  const card = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#09090a"/>
    <text x="600" y="450" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="#ece7dc" letter-spacing="14">AURUM BESPOKE</text>
    <text x="600" y="510" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#c8a45c" letter-spacing="8">FIT THAT SPEAKS BEFORE YOU DO</text>
    <rect x="400" y="545" width="400" height="1" fill="#c8a45c" opacity="0.5"/>
    <text x="600" y="590" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#9a958b" letter-spacing="6">BESPOKE MENSWEAR · BENGALURU</text>
  </svg>`);
  await sharp(card)
    .composite([{ input: mark, top: 60, left: 450 }])
    .jpeg({ quality: 88 })
    .toFile("public/brand/og-image.jpg");
  console.log("  ✓ og-image.jpg");

  await copyFile("public/brand/icon-192.png", "src/app/icon.png");
  await copyFile("public/brand/icon-180.png", "src/app/apple-icon.png");
  console.log("  ✓ src/app/icon.png + apple-icon.png\n  Done.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
