import Image from "next/image";
import { cn } from "@/lib/cn";

// Colores del espectro, elegidos para leerse sobre cremita y sobre fondo oscuro.
const LETTER_COLORS = [
  "#e00e1e", // A
  "#f7941d", // T
  "#e0a800", // Y
  "#6ba428", // P
  "#05acec", // I
  "#1f8fd6", // C
  "#8b5cf6", // A
  "#e00e1e", // L
];

/**
 * Marca: logo real (corazón de piezas de rompecabezas) + wordmark ATYPICAL
 * en multicolor (espectro de neurodiversidad) + bajada.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/brand/logo.svg"
        alt=""
        aria-hidden="true"
        width={38}
        height={26}
        className="h-8 w-auto shrink-0"
        priority
      />
      <span className="flex flex-col leading-none text-current">
        <span className="text-base font-extrabold tracking-tight">
          {"ATYPICAL".split("").map((ch, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i % LETTER_COLORS.length] }}>
              {ch}
            </span>
          ))}
          <span className="ml-1 align-super text-[0.6em] text-current opacity-80">Py</span>
        </span>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] opacity-60">
          Fundación · Neurodiversidad
        </span>
      </span>
    </span>
  );
}
