import { cn } from "@/lib/cn";

/**
 * Isotipo: infinito de neurodiversidad en gradiente del espectro.
 * Placeholder tipográfico + símbolo hasta soltar el logo real en public/images/brand.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <InfinityIcon className="h-7 w-7 shrink-0" />
      <span className="flex flex-col leading-none text-current">
        <span className="text-base font-extrabold tracking-tight">
          ATYPICAL <span className="text-brand-500">Py</span>
        </span>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] opacity-60">
          Neurodiversidad
        </span>
      </span>
    </span>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="atypical-infinity" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e4572e" />
          <stop offset="0.2" stopColor="#f4a020" />
          <stop offset="0.4" stopColor="#3fa34d" />
          <stop offset="0.6" stopColor="#17b0a7" />
          <stop offset="0.8" stopColor="#2b6ef2" />
          <stop offset="1" stopColor="#7a5af5" />
        </linearGradient>
      </defs>
      <path
        d="M12 12c0-4 3-7 6-7s5 3 6 7c1 4 3 7 6 7s6-3 6-7-3-7-6-7-5 3-6 7c-1 4-3 7-6 7s-6-3-6-7z"
        stroke="url(#atypical-infinity)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
