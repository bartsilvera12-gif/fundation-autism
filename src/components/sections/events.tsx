"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { events } from "@/content/site";
import { photoAt } from "@/lib/photos";
import { usePrefersReducedMotion } from "@/lib/motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Events() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || reduced) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
      });
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      });
      return () => {
        st.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [mounted, reduced]);

  const usePin = mounted && !reduced;

  return (
    <section
      id={events.id}
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-ink text-white"
    >
      {/* Encabezado flotante */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 mx-auto max-w-6xl px-5 pt-10">
        <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">
          Comunidad en movimiento
        </span>
        <h2 className="font-display mt-2 text-4xl font-black sm:text-5xl">{events.title}</h2>
      </div>

      <div
        className={
          usePin
            ? "flex min-h-[100svh] items-center"
            : "flex snap-x snap-mandatory overflow-x-auto scroll-smooth py-28 [scrollbar-width:none]"
        }
      >
        <div
          ref={trackRef}
          className={
            usePin
              ? "flex gap-5 px-5 pt-24 will-change-transform"
              : "flex gap-5 px-5"
          }
        >
          {events.items.map((ev, i) => {
            const EVENT_PHOTOS = [20, 27, 35, 42, 45, 22];
            const photo = photoAt(EVENT_PHOTOS[i % EVENT_PHOTOS.length]);
            return (
              <article
                key={ev.title}
                className="relative flex aspect-[3/4] w-[78vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[2rem] sm:aspect-[4/5] sm:w-[24rem] md:w-[26rem]"
              >
                {photo && (
                  <Image
                    src={photo.src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 768px) 78vw, 26rem"
                    placeholder="blur"
                    blurDataURL={photo.blurDataURL}
                    className="object-cover transition-transform duration-700 hover:scale-105"
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
                <span className="absolute right-6 top-5 font-display text-5xl font-black text-white/25">
                  0{i + 1}
                </span>
                <div className="relative p-6 sm:p-7">
                  <h3 className="font-display text-2xl font-black leading-tight sm:text-[1.7rem]">
                    {ev.title}
                  </h3>
                  <p className="mt-2.5 text-pretty text-white/80">{ev.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
