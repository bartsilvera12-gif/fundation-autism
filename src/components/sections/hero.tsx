"use client";

import { hero } from "@/content/site";
import { pickPhotos } from "@/lib/photos";
import { SplitWords } from "@/components/ui/split-words";
import { PhotoBackdrop } from "@/components/ui/photo-backdrop";
import { PhotoMarquee } from "@/components/ui/photo-marquee";
import { WhatsappIcon } from "@/components/ui/icons";

const HERO_PHOTO = {
  src: "/images/brand/hero.webp",
  alt: "",
  width: 2400,
  height: 1600,
  blurDataURL:
    "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAwBACdASoUAA0APu1iqU2ppaOiMAgBMB2JYwCdMoGv/gPEdDuIbsCS72AAzeXgeQbN8l9wlBq/PZhwMxXLC6e1PEf1mZGlGg7EINW4+WTb1WBVm0bQNdEFHR+9k6QtzMeaYh88CjF3p69LONl/GqnfWekyu/oX79vdicf9aWZo+VZa5aM4SAAA",
};

export function Hero() {
  const strip = pickPhotos(14, 24);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-white">
      {/* Foto de portada con parallax + scrim */}
      <PhotoBackdrop photo={HERO_PHOTO} overlay="dark" priority />

      {/* Scrim extra a la izquierda para legibilidad del titular */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent"
      />

      {/* Glow del espectro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-spectrum)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-32 sm:pb-16">
        <div className="mb-6 flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--gradient-spectrum)" }}
            />
            {hero.eyebrow}
          </span>
        </div>

        <SplitWords
          text={hero.title}
          as="h1"
          className="font-display max-w-4xl text-balance text-[2.5rem] font-black leading-[1.05] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-7xl sm:leading-[1.02] md:text-8xl"
          delay={0.15}
        />

        <p className="mt-7 max-w-2xl text-pretty text-lg text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] sm:text-xl">
          {hero.tagline}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={hero.primaryCta.href}
            className="rounded-full bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            <WhatsappIcon className="h-5 w-5 text-[#4ae08a]" />
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Tira de fotos en movimiento */}
      <div className="relative mt-6 pb-6">
        <PhotoMarquee
          photos={strip}
          height={112}
          speed={70}
          className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        />
      </div>
    </section>
  );
}
