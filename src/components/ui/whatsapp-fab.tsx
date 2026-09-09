"use client";

import { site } from "@/content/site";
import { WhatsappIcon } from "./icons";

/** Botón flotante de WhatsApp, siempre visible. */
export function WhatsappFab() {
  return (
    <a
      href={site.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={site.whatsapp.cta}
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-0 rounded-full bg-[#25D366] p-4 text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:gap-2 hover:pr-5 focus-visible:gap-2 focus-visible:pr-5"
    >
      <WhatsappIcon className="h-6 w-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[10rem] group-focus-visible:max-w-[10rem]">
        Escribinos
      </span>
    </a>
  );
}
