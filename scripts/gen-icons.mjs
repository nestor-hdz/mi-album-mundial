/**
 * Generates public/icons/icon-192.png and icon-512.png.
 * Uses sharp (already in devDependencies).
 * Run once: node scripts/gen-icons.mjs
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");

await mkdir(outDir, { recursive: true });

for (const size of [192, 512]) {
  const r = Math.round(size * 0.18); // rounded corners
  const emoji = size >= 512 ? "280" : "110"; // font-size in px

  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#g)"/>
  <text
    x="50%"
    y="54%"
    font-size="${emoji}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
  >⚽</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(outDir, `icon-${size}.png`));

  console.log(`✓ icon-${size}.png`);
}

console.log("Icons generated in public/icons/");
