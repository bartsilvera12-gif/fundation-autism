import { cta, site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionAmbient } from "@/components/ui/section-ambient";
import { InstagramIcon, TiktokIcon, WhatsappIcon } from "@/components/ui/icons";

const WAY_ICONS = ["🤝", "💛", "🌱"] as const;
const WAY_GRADIENTS = [
  "linear-gradient(135deg, #05acec, #8b5cf6)",
  "linear-gradient(135deg, #f7941d, #e00e1e)",
  "linear-gradient(135deg, #abcf36, #05acec)",
];

export function CTA() {
  return (
    <section id={cta.id} className="relative scroll-mt-24 overflow-hidden py-24 text-white sm:py-32">
      {/* Fondo degradado limpio */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #101f47 0%, #1e56c9 48%, #6d28d9 100%)",
        }}
      />
      <SectionAmbient variant="c" />
      {/* Franja del espectro arriba */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: "var(--gradient-spectrum)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">Sumate</span>
          <h2 className="font-display mt-2 text-balance text-5xl font-black leading-[1.03] sm:text-6xl">
            {cta.title}
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-lg text-white/85">{cta.lead}</p>
        </Reveal>

        {/* Formas de sumar */}
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-3">
          {cta.ways.map((way, i) => (
            <RevealItem key={way.title} className="h-full">
              <div className="h-full rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg"
                  style={{ background: WAY_GRADIENTS[i % WAY_GRADIENTS.length] }}
                >
                  {WAY_ICONS[i % WAY_ICONS.length]}
                </span>
                <h3 className="font-display mt-4 text-2xl font-black">{way.title}</h3>
                <p className="mt-2 text-pretty text-white/80">{way.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Acción */}
        <Reveal delay={0.1} className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
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
