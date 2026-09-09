"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { objectives } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

const ACCENTS = [
  "var(--color-spectrum-blue)",
  "var(--color-spectrum-teal)",
  "var(--color-spectrum-orange)",
];

export function Objectives() {
  const [open, setOpen] = useState(0);
  const reduced = usePrefersReducedMotion();

  return (
    <Section id={objectives.id} className="bg-background" containerClassName="max-w-6xl" ambient="c">
      <Reveal>
        <span className="text-sm font-bold uppercase tracking-[0.22em] text-brand-500">
          Hacia dónde vamos
        </span>
      </Reveal>

      {/* Objetivo general como declaración display */}
      <Reveal delay={0.05} className="mt-4 max-w-4xl">
        <p className="font-display text-balance text-3xl font-black leading-[1.12] sm:text-[2.6rem]">
          <span
            aria-hidden="true"
            className="mr-3 inline-block h-3 w-3 translate-y-[-0.2em] rounded-full align-middle"
            style={{ background: "var(--gradient-spectrum)" }}
          />
          {objectives.general}
        </p>
      </Reveal>

      {/* Objetivos específicos — acordeón editorial */}
      <div className="mt-14">
        {objectives.specific.map((obj, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={obj.title} delay={i * 0.05}>
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-baseline gap-4 py-7 text-left sm:gap-6"
                >
                  <span
                    className="font-display shrink-0 text-2xl font-black tabular-nums sm:text-3xl"
                    style={{ color: ACCENTS[i % ACCENTS.length] }}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-display flex-1 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                    {obj.title}
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="grid gap-3 pb-8 sm:grid-cols-2 sm:pl-[3.5rem]">
                        {obj.methods.map((m) => (
                          <li key={m} className="flex items-start gap-3 text-lg text-muted-foreground">
                            <CheckIcon />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-45" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-1.5 h-4 w-4 shrink-0 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
