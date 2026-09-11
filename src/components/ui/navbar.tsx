"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";
import { WhatsappIcon } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Solo hay hero oscuro detrás en la portada; ahí el navbar va claro arriba.
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 transition-all duration-300 sm:px-5",
          overHero
            ? "border border-transparent py-2.5 text-white"
            : "border border-border bg-surface py-2 text-foreground shadow-[0_8px_30px_rgba(20,47,111,0.10)]",
        )}
      >
        <Link href="/" className="shrink-0 rounded-full" aria-label={`${site.shortName} — inicio`}>
          <BrandMark />
        </Link>

        {/* Links desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors",
                  overHero
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-foreground/75 hover:bg-surface-muted hover:text-brand-600",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle
            className={cn(
              overHero &&
                "border-white/30 bg-white/10 text-white hover:bg-white/20",
            )}
          />

          {/* Botón menú móvil */}
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground lg:hidden"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden"
      >
        <div className="mx-auto mt-2 max-w-6xl px-4">
          <ul className="flex flex-col gap-1 rounded-3xl border border-border bg-surface p-3 shadow-xl">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground/85 transition-colors hover:bg-surface-muted hover:text-brand-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-base font-semibold text-white"
              >
                <WhatsappIcon className="h-5 w-5" />
                {site.whatsapp.cta}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}
