"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/gallery";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  photos: GalleryPhoto[];
  /** ms entre cambios (default 5500) */
  interval?: number;
  sizes?: string;
  /** clases para la <Image> (ej: object-cover) */
  imgClassName?: string;
  priority?: boolean;
  /** alt para accesibilidad; si se omite usa el de cada foto */
  alt?: string;
};

/**
 * Foto que va rotando con un crossfade lento y calmo.
 * - Respeta prefers-reduced-motion (queda fija en la primera).
 * - Se pausa cuando está fuera de pantalla o la pestaña no está visible.
 * - Cada instancia arranca con una fase aleatoria para no cambiar todas a la vez
 *   (importante para no generar parpadeos molestos).
 * - Apila las fotos y solo alterna opacidad (sin montar/desmontar → sin fugas).
 * Se coloca a sangre completa dentro de un contenedor posicionado (relative/absolute).
 */
export function RotatingPhoto({
  photos,
  interval = 5500,
  sizes,
  imgClassName = "object-cover",
  priority,
  alt,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);

  const rotate = !reduced && photos.length > 1;

  useEffect(() => {
    if (!rotate) return;
    const el = ref.current;
    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([e]) => {
          inView.current = e.isIntersecting;
        },
        { threshold: 0.05 },
      );
      io.observe(el);
    }
    // Fase aleatoria para desincronizar varias fotos rotando en la misma vista.
    const phase = Math.random() * interval;
    let intervalId: ReturnType<typeof setInterval>;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (document.hidden || !inView.current) return;
        setI((v) => (v + 1) % photos.length);
      }, interval);
    }, phase);
    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
      io?.disconnect();
    };
  }, [rotate, interval, photos.length]);

  if (photos.length === 0) return null;

  if (!rotate) {
    const p = photos[0];
    return (
      <Image
        src={p.src}
        alt={alt ?? p.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={p.blurDataURL}
        className={imgClassName}
        priority={priority}
      />
    );
  }

  return (
    <div ref={ref} className="absolute inset-0">
      {photos.map((p, idx) => (
        <Image
          key={p.src}
          src={p.src}
          alt={idx === i ? (alt ?? p.alt) : ""}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={p.blurDataURL}
          priority={priority && idx === 0}
          className={cn(
            imgClassName,
            "transition-opacity duration-1000 ease-in-out",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
