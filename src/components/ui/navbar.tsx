"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, navDesktop, site, type NavLink } from "@/content/site";
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
    // Marca para ocultar el botón flotante de WhatsApp mientras el menú está abierto
    document.body.toggleAttribute("data-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 transition-all duration-300 sm:px-4",
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
          {navDesktop.map((item) => {
            const linkCls = cn(
              "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors",
              overHero
                ? "text-white/85 hover:bg-white/10 hover:text-white"
                : "text-foreground/75 hover:bg-surface-muted hover:text-brand-600",
            );
            return (
              <li key={item.label}>
                {item.children ? (
                  <DropdownLink label={item.label} items={item.children} className={linkCls} />
                ) : (
                  <Link href={item.href!} className={linkCls}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Divisor sutil para agrupar el toggle con la barra */}
          <span
            aria-hidden="true"
            className={cn(
              "hidden h-6 w-px lg:block",
              overHero ? "bg-white/25" : "bg-border",
            )}
          />
          <ThemeToggle
            className={cn(
              overHero && "text-white/85 hover:bg-white/10 hover:text-white",
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
        <div className="mx-auto mt-2 max-w-6xl">
          <ul className="flex max-h-[calc(100dvh-6rem)] flex-col gap-1 overflow-y-auto overscroll-contain rounded-3xl border border-border bg-surface p-3 shadow-xl">
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

/** Desplegable del menú de escritorio: abre al pasar el mouse, con foco o al tocar. */
function DropdownLink({
  label,
  items,
  className,
}: {
  label: string;
  items: NavLink[];
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(className, "inline-flex items-center gap-1")}
      >
        {label}
        <svg
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {/* El padding superior hace de puente para no perder el hover al bajar el mouse */}
      <div
        className={cn(
          "absolute left-0 top-full z-10 w-60 pt-3 transition-all duration-150",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="rounded-3xl border border-border bg-surface p-2 text-foreground shadow-xl">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-surface-muted hover:text-brand-600"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
