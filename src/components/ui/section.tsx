import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";
import { SectionAmbient } from "./section-ambient";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  ambient?: "a" | "b" | "c" | false;
};

/** Contenedor de sección con espaciado, ancla y fondo con vida. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  ambient = "a",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 overflow-hidden px-5 py-20 sm:py-28", className)}
    >
      {ambient && <SectionAmbient variant={ambient} />}
      <div className={cn("relative mx-auto w-full max-w-6xl", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

/** Encabezado de sección: kicker + título + lead, con reveal. */
export function SectionHeading({
  kicker,
  title,
  lead,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {kicker ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-brand-600">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--gradient-spectrum)" }}
          />
          {kicker}
        </span>
      ) : null}
      <h2 className="max-w-3xl text-balance text-3xl font-extrabold sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {lead ? (
        <p className="max-w-2xl text-pretty text-lg text-muted-foreground">{lead}</p>
      ) : null}
    </Reveal>
  );
}
