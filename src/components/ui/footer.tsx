import Image from "next/image";
import { site } from "@/content/site";
import { BrandMark } from "./brand-mark";
import { InstagramIcon, TiktokIcon, WhatsappIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface">
      {/* Línea de acento del espectro */}
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: "var(--gradient-spectrum)" }}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <BrandMark />
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-600">
                WhatsApp {site.whatsapp.number}
              </a>
            </li>
            <li>
              <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-600">
                Instagram {site.social.instagram.handle}
              </a>
            </li>
            <li>
              <a href={site.social.tiktok.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-600">
                TikTok {site.social.tiktok.handle}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Seguinos</h3>
          <div className="flex gap-3">
            <SocialLink href={site.whatsapp.href} label="WhatsApp">
              <WhatsappIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.social.instagram.href} label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.social.tiktok.href} label="TikTok">
              <TiktokIcon className="h-5 w-5" />
            </SocialLink>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-1.5 px-5 py-6 text-center text-sm text-muted-foreground">
          <span>{site.footer} ·</span>
          <span className="inline-flex items-center gap-1.5">
            {site.credit.madeWith}
            <Image
              src="/images/brand/logo.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={13}
              className="inline-block h-4 w-auto"
            />
            por
            <a
              href={site.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground transition-colors hover:text-brand-600 hover:underline"
            >
              {site.credit.by}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition-colors hover:border-brand-400 hover:text-brand-500"
    >
      {children}
    </a>
  );
}
