"use client";

import Image from "next/image";
import type { GalleryPhoto } from "@/content/gallery";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Tira de fotos en movimiento continuo (marquee CSS). Pausable al hover.
 * Con prefers-reduced-motion queda estática (scroll manual).
 */
export function PhotoMarquee({
  photos,
  direction = "left",
  speed = 60,
  height = 200,
  className,
  onPhotoClick,
}: {
  photos: GalleryPhoto[];
  direction?: "left" | "right";
  speed?: number; // segundos por vuelta
  height?: number;
  className?: string;
  onPhotoClick?: (photo: GalleryPhoto) => void;
}) {
  const reduced = usePrefersReducedMotion();
  if (photos.length === 0) return null;

  // Duplicamos para loop sin cortes
  const loop = [...photos, ...photos];

  return (
    <div
      className={cn(
        "group relative w-full overflow-y-hidden",
        reduced ? "overflow-x-auto" : "overflow-x-hidden",
        className,
      )}
      role="list"
      aria-label="Fotos de la comunidad"
    >
      <div
        className={cn(
          "flex w-max gap-3 sm:gap-4",
          !reduced && "marquee-track",
        )}
        style={
          reduced
            ? undefined
            : ({
                "--marquee-duration": `${speed}s`,
                animationDirection: direction === "right" ? "reverse" : "normal",
              } as React.CSSProperties)
        }
      >
        {(reduced ? photos : loop).map((photo, i) => {
          const dims = {
            height,
            width: Math.round((height * photo.width) / photo.height),
          };
          const inner = (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="360px"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              loading="lazy"
              className="object-cover"
            />
          );
          return onPhotoClick ? (
            <button
              key={`${photo.src}-${i}`}
              role="listitem"
              onClick={() => onPhotoClick(photo)}
              aria-label="Ampliar foto"
              className="relative shrink-0 overflow-hidden rounded-2xl transition-transform hover:scale-[1.03]"
              style={dims}
            >
              {inner}
            </button>
          ) : (
            <div
              key={`${photo.src}-${i}`}
              role="listitem"
              className="relative shrink-0 overflow-hidden rounded-2xl"
              style={dims}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
