import { galleryGroups, type GalleryPhoto } from "@/content/gallery";

/** Todas las fotos (aplanadas), fuente de imágenes para todo el sitio. */
export const allPhotos: GalleryPhoto[] = galleryGroups.flatMap((g) => g.photos);

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
