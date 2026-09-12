"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Oculta el "chrome" público (navbar, footer, FAB, progreso) en las rutas del
 * panel /admin, sin necesidad de otro root layout. Recibe los componentes como
 * children (pueden ser server components) y decide si renderizarlos.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
