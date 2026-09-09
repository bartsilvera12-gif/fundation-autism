// Copia el export estático (out/) a dist/ para subir a Hostinger.
// Se ejecuta después de `next build` (ver script build:hostinger en package.json).

import { rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const DIST = path.join(ROOT, "dist");

if (!existsSync(OUT)) {
  console.error("✗ No existe out/. Corré `next build` primero (con output: 'export').");
  process.exit(1);
}

await rm(DIST, { recursive: true, force: true });
await cp(OUT, DIST, { recursive: true });
console.log("✓ dist/ listo — subí su contenido a public_html en Hostinger.");
