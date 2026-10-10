// Optimiza las fotos de public/images/eventos/<edición>/:
//  - original: lado largo máx. 1800px, WebP q82 (se usa en el lightbox y fondos grandes)
//  - miniatura en <edición>/t/: lado largo máx. 800px, WebP q70 (galería y fotos rotativas)
// Es idempotente: salta lo que ya está optimizado. Correr y luego `npm run manifest`.
//
// Uso: node scripts/optimize-images.mjs

import { readdir, mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images", "eventos");
const IMG_RE = /\.(webp|jpe?g|png)$/i;
const FULL = { edge: 1800, quality: 82 };
const THUMB = { edge: 800, quality: 70 };

const encode = (buf, { edge, quality }) =>
  sharp(buf, { failOn: "none" })
    .rotate()
    .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer();

let before = 0;
let after = 0;
let thumbs = 0;

for (const ed of await readdir(ROOT, { withFileTypes: true })) {
  if (!ed.isDirectory()) continue;
  const dir = path.join(ROOT, ed.name);
  const tdir = path.join(dir, "t");
  await mkdir(tdir, { recursive: true });
  for (const f of await readdir(dir)) {
    if (!IMG_RE.test(f)) continue;
    const file = path.join(dir, f);
    const tfile = path.join(tdir, f.replace(IMG_RE, ".webp"));
    const input = await readFile(file);
    before += input.length;

    const meta = await sharp(input, { failOn: "none" }).metadata();
    const big = Math.max(meta.width ?? 0, meta.height ?? 0) > FULL.edge || input.length > 350_000;
    let out = input;
    if (big) {
      out = await encode(input, FULL);
      if (out.length < input.length) await writeFile(file, out);
      else out = input;
    }
    after += out.length;

    if (!existsSync(tfile)) {
      await writeFile(tfile, await encode(input, THUMB));
      thumbs++;
    }
  }
}

const mb = (n) => (n / 1e6).toFixed(1) + " MB";
console.log(`Originales: ${mb(before)} → ${mb(after)} · miniaturas nuevas: ${thumbs}`);
