import { cta, site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PhotoBackdrop } from "@/components/ui/photo-backdrop";
import { photoAt } from "@/lib/photos";
import { InstagramIcon, TiktokIcon, WhatsappIcon } from "@/components/ui/icons";

const WAY_ICONS = ["🤝", "💙", "🌱"] as const;

export function CTA() {
  const bg = photoAt(48);

  return (
    <section id={cta.id} className="relative scroll-mt-24 overflow-hidden py-24 text-white sm:py-32">
      {bg ? <PhotoBackdrop photo={bg} overlay="brand" /> : <div className="absolute inset-0 bg-brand-700" />}

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">Sumate</span>
          <h2 className="font-display mt-2 text-balance text-5xl font-black leading-[1.03] sm:text-6xl">
            {cta.title}
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-lg text-white/85">{cta.lead}</p>
        </Reveal>

        {/* Formas de sumar — editorial */}
        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-3">
          {cta.ways.map((way, i) => (
            <RevealItem key={way.title}>
              <div className="border-t border-white/25 pt-5">
                <span aria-hidden="true" className="text-3xl">
                  {WAY_ICONS[i % WAY_ICONS.length]}
                </span>
                <h3 className="font-display mt-3 text-2xl font-black">{way.title}</h3>
                <p className="mt-2 text-pretty text-white/80">{way.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Acción */}
        <Reveal delay={0.1} className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
          >
            <WhatsappIcon className="h-6 w-6 text-[#25D366]" />
            {site.whatsapp.cta}
          </a>
          <div className="flex items-center gap-3">
            <SocialPill href={site.social.instagram.href} label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </SocialPill>
            <SocialPill href={site.social.tiktok.href} label="TikTok">
              <TiktokIcon className="h-5 w-5" />
            </SocialPill>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 text-sm text-white/70">
            WhatsApp {site.whatsapp.number} · Instagram {site.social.instagram.handle} · TikTok {site.social.tiktok.handle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function SocialPill({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
    >
      {children}
    </a>
  );
}
