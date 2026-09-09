"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { GalleryPhoto } from "@/content/gallery";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Foto a sangre completa como fondo, con parallax suave (zoom + desplazamiento)
 * y un scrim para contraste del texto encima.
 */
export function PhotoBackdrop({
  photo,
  overlay = "dark",
  priority = false,
  className,
}: {
  photo: GalleryPhoto;
  overlay?: "dark" | "brand" | "soft";
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const scrim =
    overlay === "brand"
      ? "linear-gradient(120deg, rgba(16,31,71,0.85), rgba(30,86,201,0.55) 60%, rgba(122,90,245,0.5))"
      : overlay === "soft"
        ? "linear-gradient(to top, rgba(8,12,22,0.75) 0%, rgba(8,12,22,0.25) 45%, rgba(8,12,22,0.35) 100%)"
        : "linear-gradient(to top, rgba(8,12,22,0.82) 0%, rgba(8,12,22,0.35) 50%, rgba(8,12,22,0.55) 100%)";

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-0 -top-[8%] h-[116%] w-full"
      >
        <Image
          src={photo.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: scrim }} />
    </div>
  );
}
