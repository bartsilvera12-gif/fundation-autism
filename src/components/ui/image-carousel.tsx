"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion";

export type CarouselSlide = {
  src: string;
  alt: string;
  label: string;
  blurDataURL?: string;
};

/** Carrusel de imágenes accesible: teclado, dots, botones y autoplay pausable. */
export function ImageCarousel({
  slides,
  autoplayMs = 6000,
}: {
  slides: CarouselSlide[];
  autoplayMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const count = slides.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), autoplayMs);
    return () => clearInterval(id);
  }, [reduced, paused, count, autoplayMs]);

  const current = slides[index];

  return (
    <div
      className="group relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Renders del centro de desarrollo integral"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-card-border bg-surface-muted shadow-xl">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              placeholder={current.blurDataURL ? "blur" : "empty"}
              blurDataURL={current.blurDataURL}
              priority={index === 0}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-16">
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                {current.label}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles */}
        {count > 1 && (
          <>
            <CarouselButton side="left" onClick={() => go(-1)} label="Anterior" />
            <CarouselButton side="right" onClick={() => go(1)} label="Siguiente" />
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Seleccionar render">
          {slides.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={s.label}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-7 bg-brand-500" : "w-2.5 bg-border hover:bg-brand-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 ${
        side === "left" ? "left-3" : "right-3"
      } inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink shadow-lg backdrop-blur transition-all hover:bg-white focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {side === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
