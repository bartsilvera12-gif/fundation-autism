import type { Metadata } from "next";
import Link from "next/link";
import { divertite, site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { DivertiteGrid } from "@/components/sections/divertite-grid";

export const metadata: Metadata = {
  title: "DIVERtite picoTEAndo 4ª edición",
  description: divertite.galleryLead,
  alternates: { canonical: "/divertite-picoteando" },
  openGraph: {
    title: `${divertite.galleryTitle}`,
    description: divertite.galleryLead,
    url: `${site.url}/divertite-picoteando`,
  },
};

export default function DivertitePage() {
  return (
    <div className="px-5 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Volver al inicio
          </Link>
        </Reveal>

        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500">
            DIVERtite picoTEAndo · 4ª edición
          </p>
          <h1 className="font-display mt-3 text-balance text-4xl font-black leading-[1.08] sm:text-5xl md:text-6xl">
            <span className="text-gradient-festive">{divertite.galleryTitle}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            {divertite.galleryLead}
          </p>
        </Reveal>

        {/* Grilla de protagonistas (lee de Supabase) */}
        <DivertiteGrid />

        <Reveal className="mt-14 text-center">
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-600"
          >
            Sumate a la próxima edición
          </a>
        </Reveal>
      </div>
    </div>
  );
}
