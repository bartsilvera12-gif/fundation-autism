import { galleryGroups, type GalleryGroup, type GalleryPhoto } from "@/content/gallery";

/**
 * Aplana los grupos intercalándolos (1ª, 2ª, 3ª edición, 1ª, 2ª, …) para que
 * cualquier tramo del pool mezcle fotos de todas las ediciones.
 */
export function interleaveGroups(groups: GalleryGroup[]): GalleryPhoto[] {
  const out: GalleryPhoto[] = [];
  const max = Math.max(0, ...groups.map((g) => g.photos.length));
  for (let i = 0; i < max; i++) {
    for (const g of groups) if (i < g.photos.length) out.push(g.photos[i]);
  }
  return out;
}

/** Todas las fotos (intercaladas por edición), fuente de imágenes para todo el sitio. */
export const allPhotos: GalleryPhoto[] = interleaveGroups(galleryGroups);

/** Devuelve n fotos empezando en offset, con wrap-around si faltan. */
export function pickPhotos(n: number, offset = 0): GalleryPhoto[] {
  if (allPhotos.length === 0) return [];
  const out: GalleryPhoto[] = [];
  for (let i = 0; i < n; i++) {
    out.push(allPhotos[(offset + i) % allPhotos.length]);
  }
  return out;
}

/** Una sola foto por índice (con wrap). */
export function photoAt(i: number): GalleryPhoto | undefined {
  if (allPhotos.length === 0) return undefined;
  return allPhotos[i % allPhotos.length];
}

/**
 * Miniatura liviana de una foto de evento (`.../edicion-1/x.webp` → `.../edicion-1/t/x.webp`).
 * Las fotos subidas desde el admin (Storage) no tienen miniatura y se devuelven tal cual.
 */
export function thumbOf(src: string): string {
  const m = src.match(/^(\/images\/eventos\/[^/]+)\/([^/]+)$/);
  return m ? `${m[1]}/t/${m[2]}` : src;
}
