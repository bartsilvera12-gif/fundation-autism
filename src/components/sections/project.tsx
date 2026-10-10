"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { project } from "@/content/site";
import { fetchProjectMedia, type ProjectMedia } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ImageCarousel } from "@/components/ui/image-carousel";

const ROOM_ICONS = ["💙", "💬", "🧩", "📚", "🧠", "🌱", "🍎"] as const;
const ROOM_GRADIENTS = [
  "linear-gradient(135deg, #f7941d, #e00e1e)",
  "linear-gradient(135deg, #abcf36, #05acec)",
  "linear-gradient(135deg, #05acec, #8b5cf6)",
  "linear-gradient(135deg, #8b5cf6, #e00e1e)",
  "linear-gradient(135deg, #05acec, #abcf36)",
  "linear-gradient(135deg, #e00e1e, #f7941d)",
  "linear-gradient(135deg, #abcf36, #f7941d)",
];

export function Project() {
  const [renders, setRenders] = useState<ProjectMedia[]>(project.renders);
  const [plans, setPlans] = useState<ProjectMedia[]>(project.plans);

  useEffect(() => {
    let alive = true;
    fetchProjectMedia().then((d) => {
      if (!alive || !d) return;
      if (d.renders.length) setRenders(d.renders);
      if (d.plans.length) setPlans(d.plans);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Section id={project.id} className="bg-surface-muted" containerClassName="max-w-6xl">
      <SectionHeading
        kicker="Nuestro sueño"
        title={<span className="font-display font-black">{project.title}</span>}
        lead={project.lead}
        align="left"
      />

      <Reveal>
        <ImageCarousel slides={renders} />
      </Reveal>

      {/* Planos arquitectónicos */}
      <Reveal className="mt-14">
        <h3 className="font-display text-2xl font-black">Los planos</h3>
        <p className="mt-1 text-muted-foreground">La propuesta arquitectónica del centro.</p>
      </Reveal>
      <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <RevealItem key={plan.src}>
            <figure className="overflow-hidden rounded-3xl border border-card-border bg-white shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image
                  src={plan.src}
                  alt={plan.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-contain p-3"
                />
              </div>
              <figcaption className="border-t border-card-border px-5 py-3 text-sm font-semibold text-foreground/80">
                {plan.label}
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-14">
        <h3 className="font-display text-2xl font-black">Los servicios del centro</h3>
        <p className="mt-1 text-muted-foreground">
          Psicología, fonoaudiología, terapia ocupacional, psicopedagogía, neurología, psiquiatría y nutrición.
        </p>
      </Reveal>
      <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {project.rooms.map((room, i) => (
          <RevealItem key={room.name} className="h-full">
            <div className="group flex h-full items-start gap-4 rounded-3xl border border-card-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:block sm:p-6">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl"
                style={{ background: ROOM_GRADIENTS[i % ROOM_GRADIENTS.length] }}
              >
                {ROOM_ICONS[i % ROOM_ICONS.length]}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-black sm:mt-4 sm:text-xl">{room.name}</h3>
                <p className="mt-1.5 text-pretty text-sm text-muted-foreground sm:mt-2">{room.description}</p>
              </div>
            </div>
          </RevealItem>
        ))}
        {/* Espacio reservado para el plantel profesional */}
        <RevealItem className="h-full">
          <div className="flex h-full flex-col justify-center rounded-3xl border-2 border-dashed border-brand-500/40 bg-brand-500/5 p-6">
            <span aria-hidden="true" className="text-3xl">👩‍⚕️👨‍⚕️</span>
            <h3 className="font-display mt-3 text-xl font-black">{project.team.title}</h3>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">{project.team.text}</p>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
