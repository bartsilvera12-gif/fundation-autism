"use client";

import { Fragment } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Revela un título palabra por palabra (fade + subida) con animación CSS,
 * que siempre completa (animation-fill-mode: both) y es a prueba de balas.
 * Con prefers-reduced-motion se muestra estático (la media query global anula la animación).
 */
export function SplitWords({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  stagger = 0.09,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  stagger?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className="word-rise"
              style={{ animationDelay: `${delay + i * stagger}s` }}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
