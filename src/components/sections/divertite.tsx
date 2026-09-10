"use client";

import Image from "next/image";
import Link from "next/link";
import { divertite } from "@/content/site";
import { divertiteKids } from "@/content/divertite";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

export function Divertite() {
  const reduced = usePrefersReducedMotion();
  const preview = divertiteKids.slice(0, 16);
  const loop = reduced ? preview : [...preview, ...preview];

  return (
    <Section id={divertite.id} className="bg-background" ambient="c">
      <SectionHeading
        kicker={divertite.kicker}
        title={<span className="font-display font-black text-gradient-festive">{divertite.title}</span>}
        lead={divertite.lead}
      />

      {/* Preview de las tarjetas en movimiento */}
      <Reveal>
        <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            className={`flex w-max gap-4 ${reduced ? "" : "marquee-track"}`}
            style={reduced ? undefined : ({ "--marquee-duration": "60s" } as React.CSSProperties)}
          >
            {loop.map((kid, i) => (
              <div
                key={`${kid.src}-${i}`}
                className="relative aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm sm:w-[180px]"
              >
                <Image
                  src={kid.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="180px"
                  placeholder="blur"
                  blurDataURL={kid.blurDataURL}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA a la galería completa */}
      <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-lg font-semibold text-foreground">
          {divertiteKids.length} protagonistas que hacen de este evento algo inolvidable.
        </p>
        <Link
          href={divertite.href}
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-600"
        >
          {divertite.cta}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </Reveal>
    </Section>
  );
}
