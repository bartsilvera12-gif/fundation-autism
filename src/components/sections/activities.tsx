"use client";

import { useEffect, useState } from "react";
import { activities, site, type Activity } from "@/content/site";
import { fetchActivities } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RegistrationModal } from "./registration-modal";

const STATUS_LABEL: Record<NonNullable<Activity["status"]>, string> = {
  open: "Inscribirme",
  soon: "Próximamente",
  full: "Cupos llenos",
};

export function Activities() {
  // Arranca con el contenido estático (fallback) y trae los datos reales de Supabase.
  const [items, setItems] = useState<Activity[]>(activities.items);
  const [regFor, setRegFor] = useState<Activity | null>(null);

  useEffect(() => {
    let alive = true;
    fetchActivities().then((data) => {
      if (alive && data) setItems(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Section id={activities.id} className="bg-background" ambient="b">
      <SectionHeading
        kicker={activities.kicker}
        title={<span className="font-display font-black text-gradient-festive">{activities.title}</span>}
        lead={activities.lead}
      />

      {items.length === 0 ? (
        <Reveal className="mx-auto max-w-xl rounded-3xl border border-dashed border-card-border bg-card/60 px-6 py-14 text-center">
          <p className="text-5xl" aria-hidden="true">📅</p>
          <p className="mt-4 text-xl font-bold text-foreground">
            Pronto anunciaremos nuevas actividades
          </p>
          <p className="mt-2 text-muted-foreground">
            Estamos preparando charlas, talleres y encuentros. Seguinos o escribinos por
            WhatsApp para enterarte primero.
          </p>
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md"
          >
            Quiero que me avisen
          </a>
        </Reveal>
      ) : (
      <RevealGroup className="flex flex-col gap-4">
        {items.map((a) => {
          const status = a.status ?? "open";
          const isOpen = status === "open";
          const label = STATUS_LABEL[status];
          return (
            <RevealItem key={a.id}>
              <article
                className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-card-border bg-card p-6 transition-shadow hover:shadow-[0_14px_40px_rgba(20,47,111,0.10)] sm:flex-row sm:items-center sm:gap-7 sm:p-7"
              >
                {/* Barra de acento */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ background: a.accent }}
                />

                {/* Fecha / hora */}
                <div className="flex shrink-0 flex-col gap-1 sm:w-52">
                  <span
                    className="text-lg font-black leading-tight"
                    style={{ color: a.accent }}
                  >
                    {a.date}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {a.time} · {a.modality}
                  </span>
                </div>

                {/* Detalle */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-black leading-tight sm:text-2xl">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-pretty text-muted-foreground">{a.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-foreground/70">
                    <span className="inline-flex items-center gap-1.5">
                      <PinIcon className="h-4 w-4 shrink-0" style={{ color: a.accent }} />
                      {a.location}
                    </span>
                    {a.seats ? (
                      <span className="inline-flex items-center gap-1.5">
                        <SeatIcon className="h-4 w-4 shrink-0" style={{ color: a.accent }} />
                        {a.seats}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Inscripción */}
                <div className="shrink-0">
                  {isOpen ? (
                    <button
                      type="button"
                      onClick={() => setRegFor(a)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md sm:w-auto"
                    >
                      {label}
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  ) : (
                    <span className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface-muted px-6 py-3 text-base font-bold text-muted-foreground sm:w-auto">
                      {label}
                    </span>
                  )}
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
      )}

      <Reveal delay={0.1} className="mt-8 text-center text-muted-foreground">
        <p>
          ¿Querés proponer una actividad o consultar por cupos?{" "}
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Escribinos por WhatsApp
          </a>
          .
        </p>
      </Reveal>

      <RegistrationModal activity={regFor} onClose={() => setRegFor(null)} />
    </Section>
  );
}

function PinIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SeatIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
