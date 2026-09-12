"use client";

import { useEffect, useState } from "react";
import type { GalleryPhoto } from "@/content/gallery";
import { allPhotos } from "@/lib/photos";
import { fetchGalleryGroups } from "@/lib/data";

/**
 * Pool de fotos para las rotaciones decorativas (Quiénes somos, Historia,
 * Misión y Visión, Eventos). Arranca con el pool estático y, si hay datos en
 * Supabase (galería editable), lo reemplaza — así lo que se sube en el /admin
 * también alimenta las fotos que rotan.
 */
export function usePhotoPool(): GalleryPhoto[] {
  const [pool, setPool] = useState<GalleryPhoto[]>(allPhotos);
  useEffect(() => {
    let alive = true;
    fetchGalleryGroups().then((groups) => {
      if (!alive || !groups) return;
      const flat = groups.flatMap((g) => g.photos);
      if (flat.length) setPool(flat);
    });
    return () => {
      alive = false;
    };
  }, []);
  return pool;
}

/**
 * Toma n fotos del pool empezando en offset, con wrap-around.
 * `orient` filtra por orientación para que la foto calce con el marco y se
 * recorte lo mínimo (retratos en marcos verticales, apaisadas en horizontales).
 */
export function pickFrom(
  pool: GalleryPhoto[],
  n: number,
  offset = 0,
  orient?: "portrait" | "landscape",
): GalleryPhoto[] {
  let src = pool;
  if (orient) {
    const filtered = pool.filter((p) =>
      orient === "portrait" ? p.height >= p.width : p.width >= p.height,
    );
    if (filtered.length) src = filtered;
  }
  if (src.length === 0) return [];
  const out: GalleryPhoto[] = [];
  for (let i = 0; i < n; i++) out.push(src[(offset + i) % src.length]);
  return out;
}
