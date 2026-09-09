// Convierte imágenes de origen (JPG/HEIC/PNG) a WebP de alta calidad
// y las deposita en public/images/eventos/<año>/.
//
// Uso:  node scripts/ingest-images.mjs <carpeta-origen> <año>
// Ej.:  node scripts/ingest-images.mjs "C:/tmp/zip2025" 2025
//
// Calidad priorizada: WebP q=90, esfuerzo máximo, cap de lado largo 2400px
// (evita archivos gigantes sin degradar lo perceptible). No recomprime si ya existe.

import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import heicConvert from "heic-convert";

const [, , srcDir, year] = process.argv;

if (!srcDir || !year) {
  console.error("Uso: node scripts/ingest-images.mjs <carpeta-origen> <año>");
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), "public", "images", "eventos", year);
const MAX_EDGE = 2400;
const QUALITY = 90;

const IMG_RE = /\.(jpe?g|png|heic|heif|webp)$/i;

async function toRgbBuffer(file) {
  const ext = path.extname(file).toLowerCase();
  const input = await readFile(file);
  if (ext === ".heic" || ext === ".heif") {
    // sharp no decodifica HEIC por defecto → convertir a JPEG en memoria primero
    const jpg = await heicConvert({ buffer: input, format: "JPEG", quality: 1 });
    return Buffer.from(jpg);
  }
  return input;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = (await readdir(srcDir)).filter((f) => IMG_RE.test(f));
  entries.sort();

  console.log(`Ingestando ${entries.length} imágenes → ${OUT_DIR}`);
  let done = 0;

  for (const name of entries) {
    const base = path.parse(name).name.replace(/[^\w.-]+/g, "_");
    const outName = `${base}.webp`;
    const outPath = path.join(OUT_DIR, outName);

    if (existsSync(outPath)) {
      done++;
      continue;
    }

    try {
      const buf = await toRgbBuffer(path.join(srcDir, name));
      await sharp(buf, { failOn: "none" }) // tolera JPEGs no estándar / truncados
        .rotate() // respeta orientación EXIF
        .resize({
          width: MAX_EDGE,
          height: MAX_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outPath);
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${entries.length}`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
    }
  }

  console.log(`✓ Listo: ${done}/${entries.length} en ${year}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
