"use client";

import dynamic from "next/dynamic";
import { hero } from "@/content/site";
import { pickPhotos } from "@/lib/photos";
import { SplitWords } from "@/components/ui/split-words";
import { PhotoMarquee } from "@/components/ui/photo-marquee";
import { WhatsappIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/motion";

// Aurora usa WebGL/OGL → solo en cliente, sin SSR.
const Aurora = dynamic(() => import("@/components/reactbits/Aurora"), {
  ssr: false,
});

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const strip = pickPhotos(14, 24);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-white">
      {/* Base oscura con degradado del espectro */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 0%, #163f97 0%, #0e1524 55%), linear-gradient(135deg, #0e1524 0%, #142f6f 50%, #2a1c5e 100%)",
        }}
      />

      {/* Aurora animada (llamativa, calma) */}
      {!reduced && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-90">
          <Aurora
            colorStops={["#05acec", "#8b5cf6", "#f7941d"]}
            amplitude={1.15}
            blend={0.5}
            speed={0.5}
          />
        </div>
      )}

      {/* Orbes de color flotando */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -left-16 top-24 h-72 w-72 rounded-full opacity-35 blur-3xl ${reduced ? "" : "float-orb"}`}
          style={{ background: "radial-gradient(circle, #e00e1e, transparent 70%)" }}
        />
        <div
          className={`absolute right-[-4rem] top-10 h-80 w-80 rounded-full opacity-35 blur-3xl ${reduced ? "" : "float-orb-slow"}`}
          style={{ background: "radial-gradient(circle, #05acec, transparent 70%)" }}
        />
        <div
          className={`absolute bottom-40 left-1/3 h-64 w-64 rounded-full opacity-30 blur-3xl ${reduced ? "" : "float-orb"}`}
          style={{ background: "radial-gradient(circle, #abcf36, transparent 70%)" }}
        />
      </div>

      {/* Scrim inferior para fundir con la tira de fotos */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#0e1524] to-transparent"
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
          className="font-display max-w-4xl text-balance text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl md:text-8xl"
          delay={0.15}
        />

        <p className="mt-7 max-w-2xl text-pretty text-lg text-white/85 sm:text-xl">
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
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15"
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
