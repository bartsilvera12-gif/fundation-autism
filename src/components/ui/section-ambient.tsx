"use client";

import { usePrefersReducedMotion } from "@/lib/motion";

type Variant = "a" | "b" | "c";

const VARIANTS: Record<Variant, { color: string; className: string; float: string }[]> = {
  a: [
    { color: "#05acec", className: "-left-24 top-10 h-72 w-72", float: "float-orb" },
    { color: "#f7941d", className: "-right-20 bottom-0 h-64 w-64", float: "float-orb-slow" },
  ],
  b: [
    { color: "#abcf36", className: "-right-24 top-16 h-72 w-72", float: "float-orb-slow" },
    { color: "#8b5cf6", className: "-left-16 bottom-8 h-60 w-60", float: "float-orb" },
  ],
  c: [
    { color: "#e00e1e", className: "-left-20 top-1/3 h-56 w-56", float: "float-orb" },
    { color: "#05acec", className: "-right-24 top-4 h-72 w-72", float: "float-orb-slow" },
    { color: "#f9d70f", className: "right-1/4 bottom-0 h-52 w-52", float: "float-orb" },
  ],
};

/**
 * Orbes de color suaves y en movimiento lento a los costados de una sección.
 * Dan vida al fondo sin ruido; se detienen con prefers-reduced-motion.
 */
export function SectionAmbient({ variant = "a" }: { variant?: Variant }) {
  const reduced = usePrefersReducedMotion();
  const orbs = VARIANTS[variant];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-[0.14] blur-3xl dark:opacity-[0.18] ${o.className} ${reduced ? "" : o.float}`}
          style={{ background: `radial-gradient(circle, ${o.color}, transparent 70%)` }}
        />
      ))}
    </div>
  );
}
