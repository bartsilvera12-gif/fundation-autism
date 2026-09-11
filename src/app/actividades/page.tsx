import type { Metadata } from "next";
import Link from "next/link";
import { activities, site } from "@/content/site";
import { Activities } from "@/components/sections/activities";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Actividades",
  description: activities.lead,
  alternates: { canonical: "/actividades" },
  openGraph: {
    title: `${activities.title} · ${site.shortName}`,
    description: activities.lead,
    url: `${site.url}/actividades`,
  },
};

export default function ActividadesPage() {
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Volver al inicio
          </Link>
        </Reveal>
      </div>
      <Activities />
    </div>
  );
}
