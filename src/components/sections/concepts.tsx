"use client";

import { concepts } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const ACCENTS = [
  "var(--color-spectrum-blue)",
  "var(--color-spectrum-teal)",
  "var(--color-spectrum-green)",
  "var(--color-spectrum-purple)",
];

export function Concepts() {
  return (
    <Section id={concepts.id} className="bg-surface-muted" containerClassName="max-w-6xl">
      <SectionHeading
        kicker="Para entendernos"
        title={<span className="font-display font-black">{concepts.title}</span>}
        lead="Cuatro ideas que cambian la forma de mirar la diversidad humana."
        align="left"
      />

      <RevealGroup className="mt-4">
        {concepts.items.map((item, i) => (
          <RevealItem key={item.term}>
            <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-t border-border py-8 sm:grid-cols-[5rem_minmax(0,14rem)_1fr] sm:gap-x-8">
              {/* Índice */}
              <span
                className="font-display text-3xl font-black tabular-nums transition-colors sm:text-4xl"
                style={{ color: ACCENTS[i % ACCENTS.length] }}
              >
                0{i + 1}
              </span>

              {/* Término */}
              <h3 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                {item.term}
              </h3>

              {/* Definición */}
              <p className="col-span-2 max-w-2xl text-pretty text-lg text-muted-foreground sm:col-span-1">
                {item.definition}
              </p>
            </div>
          </RevealItem>
        ))}
        <div className="border-t border-border" />
      </RevealGroup>
    </Section>
  );
}
