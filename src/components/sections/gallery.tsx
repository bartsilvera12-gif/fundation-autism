"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { galleryGroups, type GalleryPhoto } from "@/content/gallery";
import { gallerySection } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { PhotoMarquee } from "@/components/ui/photo-marquee";

export function Gallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (galleryGroups.length === 0) return null;
  const group = galleryGroups[active];
  const photos = group.photos;

  const half = Math.ceil(photos.length / 2);
  const rowA = photos.slice(0, half);
  const rowB = photos.slice(half);

  const openLightbox = (photo: GalleryPhoto) =>
    setLightbox(photos.findIndex((p) => p.src === photo.src));

  return (
    <section id={gallerySection.id} className="relative scroll-mt-24 overflow-hidden bg-surface-muted py-24 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mesh-animated" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-brand-500">Galería</span>
          <h2 className="font-display mt-2 text-balance text-4xl font-black sm:text-5xl">
            {gallerySection.title}
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-lg text-muted-foreground">
            {gallerySection.lead}
          </p>
        </Reveal>

        {/* Selector de año */}
        <Reveal className="mt-8">
          {galleryGroups.length === 1 ? (
            // Un solo año: etiqueta elegante, sin botón
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground/80">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--gradient-spectrum)" }}
              />
              Edición {galleryGroups[0].year}
              <span className="font-normal text-muted-foreground">· {galleryGroups[0].label}</span>
            </div>
          ) : (
            // Varios años: selector editorial con subrayado del espectro
            <div
              role="tablist"
              aria-label="Filtrar galería por año"
              className="flex flex-wrap items-end gap-x-8 gap-y-2 border-b border-border"
            >
              {galleryGroups.map((g, i) => (
                <button
                  key={g.year}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`relative -mb-px pb-3 text-lg font-bold transition-colors sm:text-xl ${
                    i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g.year}
                  <span className="ml-2 hidden text-sm font-normal text-muted-foreground sm:inline">
                    {g.label}
                  </span>
                  {i === active && (
                    <motion.span
                      layoutId="gallery-underline"
                      className="absolute inset-x-0 bottom-0 h-[3px] rounded-full"
                      style={{ background: "var(--gradient-spectrum)" }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </Reveal>
      </div>

      {/* Marquees vivos (a sangre completa) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={group.year}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 space-y-4"
        >
          <PhotoMarquee photos={rowA} direction="left" speed={80} height={220} onPhotoClick={openLightbox} />
          {rowB.length > 0 && (
            <PhotoMarquee photos={rowB} direction="right" speed={90} height={220} onPhotoClick={openLightbox} />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pasá el cursor para pausar · tocá una foto para ampliar
      </p>

      <Lightbox
        photos={photos}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNav={(dir) => setLightbox((v) => (v === null ? v : (v + dir + photos.length) % photos.length))}
      />
    </section>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onNav,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={onClose}
        >
          <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <NavBtn side="left" onClick={onNav} />
          <NavBtn side="right" onClick={onNav} />
          <motion.div key={index} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="relative max-h-[85vh] w-auto" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[index].src}
              alt={photos[index].alt}
              width={photos[index].width}
              height={photos[index].height}
              sizes="90vw"
              placeholder="blur"
              blurDataURL={photos[index].blurDataURL}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavBtn({ side, onClick }: { side: "left" | "right"; onClick: (dir: number) => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(side === "left" ? -1 : 1);
      }}
      aria-label={side === "left" ? "Foto anterior" : "Foto siguiente"}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-4" : "right-4"} inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25`}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {side === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
