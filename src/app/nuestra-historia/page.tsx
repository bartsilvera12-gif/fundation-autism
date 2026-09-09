import type { Metadata } from "next";
import Link from "next/link";
import { historyPage, quote, site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { WhatsappIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "La historia de la Fundación ATYPICAL Py: un viaje que nació del amor, la escucha y la comunidad para acompañar a familias neurodivergentes en Paraguay.",
  alternates: { canonical: "/nuestra-historia" },
  openGraph: {
    title: `Nuestra historia · ${site.shortName}`,
    description: historyPage.lead,
    url: `${site.url}/nuestra-historia`,
  },
};

export default function NuestraHistoriaPage() {
  return (
    <article className="px-5 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Link
            href="/#historia"
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
            Fundación ATYPICAL Py
          </p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold sm:text-5xl">
            {historyPage.title}
          </h1>
          <p className="mt-4 text-pretty text-xl text-muted-foreground">
            {historyPage.lead}
          </p>
        </Reveal>

        <div className="mt-12 space-y-12">
          {historyPage.sections.map((sec) => (
            <Reveal key={sec.heading} as="section">
              <h2 className="text-2xl font-bold">{sec.heading}</h2>
              <div className="mt-3 space-y-4">
                {sec.paragraphs.map((p, i) => (
                  <p key={i} className="text-pretty text-lg leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <blockquote className="rounded-[2rem] border-l-4 border-brand-500 bg-surface-muted p-8 text-balance text-2xl font-semibold leading-snug">
            «{quote.text}»
          </blockquote>
        </Reveal>

        <Reveal className="mt-12">
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <WhatsappIcon className="h-5 w-5" />
            {site.whatsapp.cta}
          </a>
        </Reveal>
      </div>
    </article>
  );
}
