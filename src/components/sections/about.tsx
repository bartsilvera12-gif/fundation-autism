"use client";

import CountUp from "@/components/reactbits/CountUp";
import { about } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { Parallax } from "@/components/ui/parallax";
import { RotatingPhoto } from "@/components/ui/rotating-photo";
import { usePrefersReducedMotion } from "@/lib/motion";
import { pickPhotos } from "@/lib/photos";

const HL_GRADIENTS = [
  "linear-gradient(135deg, #e00e1e, #f7941d)",
  "linear-gradient(135deg, #05acec, #1f8fd6)",
  "linear-gradient(135deg, #abcf36, #05acec)",
  "linear-gradient(135deg, #8b5cf6, #e00e1e)",
];

export function About() {
  const reduced = usePrefersReducedMotion();
  const mainPhotos = pickPhotos(6, 5);
  const sidePhotos = pickPhotos(5, 31);

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
            <Parallax amount={24} className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl">
              <RotatingPhoto
                photos={mainPhotos}
                sizes="(max-width: 1024px) 90vw, 40vw"
                alt="Familias y comunidad de la Fundación ATYPICAL Py"
              />
            </Parallax>
            <Parallax
              amount={-30}
              className="absolute -bottom-8 -left-8 z-10 aspect-square w-40 overflow-hidden rounded-3xl border-4 border-background shadow-xl sm:w-52"
            >
              <RotatingPhoto
                photos={sidePhotos}
                interval={6200}
                sizes="220px"
                alt=""
              />
            </Parallax>
            {/* Chip espectro */}
            <div
              aria-hidden="true"
              className="absolute -right-4 top-8 z-10 h-16 w-16 rounded-2xl opacity-90 shadow-lg"
              style={{ background: "var(--gradient-spectrum)" }}
            />
          </div>
        </Reveal>
      </div>

      {/* Datos clave — tira editorial (sin cajas), separada por líneas */}
      <RevealGroup className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {about.highlights.map((h, i) => (
          <RevealItem key={h.title}>
            <div className={cn(i > 0 && "lg:border-l lg:border-border lg:pl-10")}>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-md"
                style={{ background: HL_GRADIENTS[i % HL_GRADIENTS.length] }}
              >
                {h.emoji}
              </span>
              <p className="font-display mt-4 text-xl font-black leading-tight">{h.title}</p>
              <p className="mt-1.5 text-pretty text-muted-foreground">{h.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
