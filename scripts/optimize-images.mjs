/**
 * Optimiza las imágenes de marca de assets-src/ hacia public/img/ y genera
 * src/content/images.gen.ts con rutas, srcset y dimensiones.
 *
 * - Fotos: WebP, sin agrandar nunca por sobre el tamaño original.
 * - Wordmark: se elimina el fondo blanco (la luminancia pasa a canal alfa) y se
 *   exporta en tinta y en papel, sin tocar las formas del logo.
 *
 * Uso: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-src";
const OUT = "public/img";
const WIDTHS = [480, 960, 1600];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const manifest = {};

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(SRC, file);

  if (name === "wordmark") {
    // 2x con lanczos para bordes más limpios; el alfa sale de la luminancia invertida
    const meta = await sharp(input).metadata();
    const { data, info } = await sharp(input)
      .resize({ width: meta.width * 2, kernel: "lanczos3" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (const [tone, rgb] of [
      ["ink", [23, 21, 19]],
      ["paper", [245, 241, 234]],
    ]) {
      const px = Buffer.alloc(info.width * info.height * 4);
      for (let i = 0; i < info.width * info.height; i++) {
        const lum = data[i * info.channels];
        // blanco (>=235) transparente, negro (<=60) opaco, rampa suave entre medio
        const a = Math.max(0, Math.min(255, Math.round(((235 - lum) / (235 - 60)) * 255)));
        px[i * 4] = rgb[0];
        px[i * 4 + 1] = rgb[1];
        px[i * 4 + 2] = rgb[2];
        px[i * 4 + 3] = a;
      }
      const out = `${OUT}/wordmark-${tone}.png`;
      const trimmed = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
        .trim({ threshold: 1 })
        .png({ compressionLevel: 9 })
        .toFile(out);
      manifest[`wordmark-${tone}`] = { src: `/img/wordmark-${tone}.png`, srcSet: "", w: trimmed.width, h: trimmed.height };
    }
    continue;
  }

  const meta = await sharp(input).metadata();
  const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])];
  const set = [];
  for (const w of widths) {
    const out = `${OUT}/${name}-${w}.webp`;
    await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(out);
    set.push(`/img/${name}-${w}.webp ${w}w`);
  }
  manifest[name] = {
    src: `/img/${name}-${widths[widths.length - 1]}.webp`,
    srcSet: set.join(", "),
    w: meta.width,
    h: meta.height,
  };
}

const ts = `// Generado por scripts/optimize-images.mjs. No editar a mano.
export type ImageAsset = { src: string; srcSet: string; w: number; h: number };
export const images = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, ImageAsset>;
export type ImageName = keyof typeof images;
`;
await writeFile("src/content/images.gen.ts", ts);
console.log(`${Object.keys(manifest).length} imágenes procesadas`);
