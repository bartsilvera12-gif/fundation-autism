"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { events } from "@/content/site";
import { photoAt } from "@/lib/photos";
import { usePrefersReducedMotion } from "@/lib/motion";

const EVENT_PHOTOS = [20, 27, 35, 42, 45, 22];

export function Events() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [paused, setPaused] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const amount = card ? (card as HTMLElement).offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: reduced ? "auto" : "smooth" });
  };

  // Autoplay: avanza solo y vuelve al inicio al terminar. Pausa al interactuar.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const card = el.querySelector("article");
      const amount = card ? (card as HTMLElement).offsetWidth + 20 : el.clientWidth * 0.8;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + amount, behavior: "smooth" });
    }, 3800);
    return () => clearInterval(id);
  }, [reduced, paused]);

  return (
    <section id={events.id} className="scroll-mt-24 overflow-hidden bg-ink py-20 text-white sm:py-28">
      {/* Encabezado + flechas */}
      <div className="mx-auto mb-8 flex max-w-6xl items-end justify-between gap-6 px-5">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">
            Comunidad en movimiento
          </span>
          <h2 className="font-display mt-2 text-4xl font-black sm:text-5xl">{events.title}</h2>
        </div>
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <ArrowButton dir="prev" onClick={() => scrollByCard(-1)} disabled={!canPrev} />
          <ArrowButton dir="next" onClick={() => scrollByCard(1)} disabled={!canNext} />
        </div>
      </div>

      {/* Track deslizable (no traba el scroll de la página) */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-[max(1.25rem,calc((100vw-72rem)/2))]"
        aria-label="Eventos y programas (deslizá o usá las flechas)"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {events.items.map((ev, i) => {
          const photo = photoAt(EVENT_PHOTOS[i % EVENT_PHOTOS.length]);
          return (
            <article
              key={ev.title}
              className="relative flex aspect-[3/4] w-[80vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[2rem] sm:aspect-[4/5] sm:w-[22rem] md:w-[24rem]"
            >
              {photo && (
                <Image
                  src={photo.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 80vw, 24rem"
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  className="object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,12,22,0.92) 0%, rgba(8,12,22,0.35) 55%, rgba(8,12,22,0.15) 100%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute left-6 top-6 h-1.5 w-14 rounded-full"
                style={{ background: ev.accent }}
              />
              <div className="relative p-6 sm:p-7">
                <h3 className="font-display text-2xl font-black leading-tight sm:text-[1.7rem]">
                  {ev.title}
                </h3>
                <p className="mt-2.5 text-pretty text-white/80">{ev.description}</p>
              </div>
            </article>
          );
        })}
        {/* Espaciador final para que la última card no quede pegada al borde */}
        <div aria-hidden="true" className="w-1 shrink-0" />
      </div>

      {/* Flechas en mobile (debajo) */}
      <div className="mt-6 flex items-center justify-center gap-4 sm:hidden">
        <ArrowButton dir="prev" onClick={() => scrollByCard(-1)} disabled={!canPrev} />
        <ArrowButton dir="next" onClick={() => scrollByCard(1)} disabled={!canNext} />
      </div>
    </section>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Evento anterior" : "Evento siguiente"}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
