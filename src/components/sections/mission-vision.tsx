import Image from "next/image";
import { missionVision } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { photoAt } from "@/lib/photos";

export function MissionVision() {
  const { mission, vision } = missionVision;
  const blocks = [
    { ...mission, photo: photoAt(33) },
    { ...vision, photo: photoAt(29) },
  ];

  return (
    <section
      id={missionVision.id}
      className="relative scroll-mt-24 overflow-hidden py-24 text-white sm:py-28"
    >
      {/* Fondo degradado limpio (sin foto detrás del texto) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #101f47 0%, #1e56c9 55%, #4a2f9e 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-spectrum)" }}
      />

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          {blocks.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.1}>
              <article className="flex h-full flex-col">
                {/* Foto contenida, limpia */}
                {block.photo && (
                  <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-white/15">
                    <Image
                      src={block.photo.src}
                      alt={block.photo.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      placeholder="blur"
                      blurDataURL={block.photo.blurDataURL}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white/70">
                  {block.label}
                </span>
                <div
                  aria-hidden="true"
                  className="mt-3 mb-5 h-1 w-16 rounded-full"
                  style={{ background: "var(--gradient-spectrum)" }}
                />
                <p className="font-display text-balance text-xl font-bold leading-snug sm:text-2xl">
                  {block.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
