import type { Metadata } from "next";
import Link from "next/link";
import { members, site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { WhatsappIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Socios y Padrinos",
  description: members.lead,
  alternates: { canonical: "/socios" },
  openGraph: {
    title: `${members.title} · ${site.shortName}`,
    description: members.lead,
    url: `${site.url}/socios`,
  },
};

const WHATSAPP_TEXT = encodeURIComponent(
  "Hola, quiero saber cómo ser socio, aliado o padrino de la Fundación ATYPICAL Py.",
);

export default function SociosPage() {
  return (
    <div className="px-5 pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Volver al inicio
          </Link>
        </Reveal>

        <Reveal className="mt-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500">Fundación ATYPICAL Py</p>
          <h1 className="font-display mt-3 text-balance text-4xl font-black sm:text-5xl">{members.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">{members.lead}</p>
        </Reveal>

        <RevealGroup className="mt-12 space-y-6">
          {members.kinds.map((k) => (
            <RevealItem key={k.title}>
              <article className="relative overflow-hidden rounded-[2rem] border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-2"
                  style={{ background: k.accent }}
                />
                <h2 className="font-display text-2xl font-black sm:text-3xl">{k.title}</h2>
                <p className="mt-3 max-w-3xl text-pretty text-muted-foreground sm:text-lg">{k.summary}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: k.accent }}>
                      Derechos
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {k.rights.map((r) => (
                        <li key={r} className="flex gap-3 text-pretty text-sm sm:text-base">
                          <Dot color={k.accent} />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: k.accent }}>
                      Obligaciones
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {k.duties.map((d) => (
                        <li key={d} className="flex gap-3 text-pretty text-sm sm:text-base">
                          <Dot color={k.accent} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <div className="rounded-[2rem] bg-surface-muted p-8 text-center sm:p-10">
            <h2 className="font-display text-3xl font-black">{members.cta.title}</h2>
            <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">{members.cta.text}</p>
            <a
              href={`${site.whatsapp.href}?text=${WHATSAPP_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <WhatsappIcon className="h-5 w-5" />
              {members.cta.label}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />;
}
