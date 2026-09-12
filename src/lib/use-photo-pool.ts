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

/** Toma n fotos del pool empezando en offset, con wrap-around. */
export function pickFrom(pool: GalleryPhoto[], n: number, offset = 0): GalleryPhoto[] {
  if (pool.length === 0) return [];
  const out: GalleryPhoto[] = [];
  for (let i = 0; i < n; i++) out.push(pool[(offset + i) % pool.length]);
  return out;
}
