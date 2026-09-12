"use client";

"use client";

import { history } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { RotatingPhoto } from "@/components/ui/rotating-photo";
import { usePhotoPool, pickFrom } from "@/lib/use-photo-pool";
import { cn } from "@/lib/cn";

export function History() {
  const pool = usePhotoPool();
  return (
    <Section id={history.id} className="bg-background" containerClassName="max-w-6xl" ambient="b">
      <SectionHeading
        kicker="De dónde venimos"
        title={<span className="font-display font-black">{history.title}</span>}
        lead={history.lead}
        align="left"
      />

      <div className="mt-6 space-y-16 sm:space-y-24">
        {history.timeline.map((item, i) => {
          const HISTORY_PHOTOS = [17, 19, 22, 48];
          const photos = pickFrom(pool, 4, HISTORY_PHOTOS[i % HISTORY_PHOTOS.length], "landscape");
          const flip = i % 2 === 1;
          return (
            <div
              key={i}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              {/* Foto */}
              <Reveal className={cn(flip && "md:order-2")}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
                  <Parallax amount={22} className="absolute inset-0">
                    <RotatingPhoto
                      photos={photos}
                      interval={6000}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      alt={`Momento de la historia de la Fundación: ${item.title}`}
                    />
                  </Parallax>
                </div>
              </Reveal>

              {/* Texto */}
              <Reveal delay={0.08} className={cn(flip && "md:order-1")}>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500">
                  {item.year}
                </span>
                <h3 className="font-display mt-2 text-3xl font-black leading-tight sm:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-pretty text-lg text-muted-foreground">
                  {item.text}
                </p>
              </Reveal>
            </div>
          );
        })}
      </div>

      <Reveal className="mt-14">
        <a
          href="/nuestra-historia"
          className="group inline-flex items-center gap-2 text-lg font-bold text-brand-600"
        >
          Leé nuestra historia completa
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </Reveal>
    </Section>
  );
}
