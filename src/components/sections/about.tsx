"use client";

import Image from "next/image";
import CountUp from "@/components/reactbits/CountUp";
import { about } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { Parallax } from "@/components/ui/parallax";
import { usePrefersReducedMotion } from "@/lib/motion";
import { photoAt } from "@/lib/photos";

export function About() {
  const reduced = usePrefersReducedMotion();
  const pA = photoAt(45);
  const pB = photoAt(30);

  return (
    <Section id={about.id} className="bg-background" containerClassName="max-w-7xl">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Texto */}
        <div>
          <Reveal className="mb-4">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-brand-500">
              {about.kicker}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-balance text-4xl font-black leading-[1.05] sm:text-5xl">
              {about.title}
            </h2>
          </Reveal>

          {/* Número gigante editorial */}
          <Reveal delay={0.08} className="mt-8 flex items-end gap-4 border-y border-border py-6">
            <span className="font-display text-7xl font-black leading-none tracking-tight sm:text-8xl">
              <span className="text-gradient-spectrum">
                {about.stat.from}–
                {reduced ? about.stat.to : <CountUp to={about.stat.to} from={about.stat.from} duration={2} />}
                {about.stat.suffix}
              </span>
            </span>
            <span className="mb-1 max-w-[14rem] text-pretty text-base text-muted-foreground">
              {about.stat.label}
            </span>
          </Reveal>

          <RevealGroup className="mt-6 space-y-4">
            {about.paragraphs.map((p, i) => (
              <RevealItem key={i}>
                <p className="text-pretty text-lg text-muted-foreground">{p}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-7 flex flex-wrap gap-2">
            {about.conditions.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold text-foreground/70"
              >
                {c}
              </span>
            ))}
          </Reveal>
        </div>

        {/* Collage de fotos */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            {pA && (
              <Parallax amount={24} className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl">
                <Image
                  src={pA.src}
                  alt={pA.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  placeholder="blur"
                  blurDataURL={pA.blurDataURL}
                  className="object-cover"
                />
              </Parallax>
            )}
            {pB && (
              <Parallax
                amount={-30}
                className="absolute -bottom-8 -left-8 z-10 aspect-square w-40 overflow-hidden rounded-3xl border-4 border-background shadow-xl sm:w-52"
              >
                <Image
                  src={pB.src}
                  alt={pB.alt}
                  fill
                  sizes="220px"
                  placeholder="blur"
                  blurDataURL={pB.blurDataURL}
                  className="object-cover"
                />
              </Parallax>
            )}
            {/* Chip espectro */}
            <div
              aria-hidden="true"
              className="absolute -right-4 top-8 z-10 h-16 w-16 rounded-2xl opacity-90 shadow-lg"
              style={{ background: "var(--gradient-spectrum)" }}
            />
          </div>
        </Reveal>
      </div>

      {/* Datos clave — fila multicolor */}
      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {about.highlights.map((h) => (
          <RevealItem key={h.title} className="h-full">
            <div
              className="h-full rounded-2xl border border-card-border bg-card p-6 shadow-sm"
              style={{ borderTop: `4px solid ${h.color}` }}
            >
              <span aria-hidden="true" className="text-3xl">
                {h.emoji}
              </span>
              <h3 className={cn("mt-3 text-lg font-extrabold leading-tight")}>{h.title}</h3>
              <p className="mt-1.5 text-pretty text-muted-foreground">{h.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
