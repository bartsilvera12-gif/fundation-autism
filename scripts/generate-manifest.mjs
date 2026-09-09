// Recorre public/images/eventos/<año>/ y genera src/content/gallery.ts
// con { src, width, height, alt, blurDataURL } por foto, agrupado por año.
// Permite agregar fotos sin tocar componentes: soltá archivos y corré `npm run manifest`.

import { readdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const EVENTS_DIR = path.join(ROOT, "public", "images", "eventos");
const OUT_FILE = path.join(ROOT, "src", "content", "gallery.ts");
const IMG_RE = /\.(webp|jpe?g|png|avif)$/i;

// Etiquetas legibles por año (editable)
const YEAR_LABELS = {
  2025: "Picoteando por Lean",
  2026: "DiverTITE PicoTEAndo",
};

async function blurFor(file) {
  const buf = await sharp(file)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function processYear(year) {
  const dir = path.join(EVENTS_DIR, year);
  if (!existsSync(dir)) return null;
  const files = (await readdir(dir)).filter((f) => IMG_RE.test(f)).sort();
  if (files.length === 0) return null;

  const photos = [];
  for (const name of files) {
    const file = path.join(dir, name);
    const meta = await sharp(file).metadata();
    photos.push({
      src: `/images/eventos/${year}/${name}`,
      width: meta.width ?? 1600,
      height: meta.height ?? 1200,
      alt: `Momento del evento ${YEAR_LABELS[year] ?? year} de la Fundación ATYPICAL Py`,
      blurDataURL: await blurFor(file),
    });
  }
  return { year, label: YEAR_LABELS[year] ?? year, photos };
}

async function main() {
  const years = existsSync(EVENTS_DIR)
    ? (await readdir(EVENTS_DIR, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
    : [];

  const groups = [];
  for (const year of years) {
    const g = await processYear(year);
    if (g) groups.push(g);
  }

  const header = `/**
 * AUTOGENERADO por scripts/generate-manifest.mjs — no editar a mano.
 * Para regenerar: npm run manifest
 */

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
};

export type GalleryGroup = {
  year: string;
  label: string;
  photos: GalleryPhoto[];
};

export const galleryGroups: GalleryGroup[] = ${JSON.stringify(groups, null, 2)};

export const galleryYears = galleryGroups.map((g) => g.year);
`;

  await writeFile(OUT_FILE, header, "utf8");
  const total = groups.reduce((n, g) => n + g.photos.length, 0);
  console.log(`✓ gallery.ts: ${total} fotos en ${groups.length} año(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
