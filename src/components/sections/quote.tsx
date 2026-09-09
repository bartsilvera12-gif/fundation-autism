import { quote } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { PhotoBackdrop } from "@/components/ui/photo-backdrop";
import { photoAt } from "@/lib/photos";

export function Quote() {
  const bg = photoAt(22);

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-24 text-white">
      {bg ? <PhotoBackdrop photo={bg} overlay="dark" /> : <div className="absolute inset-0 bg-brand-900" />}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-spectrum)" }}
      />

      <Reveal className="relative mx-auto max-w-4xl text-center">
        <span
          aria-hidden="true"
          className="font-display mx-auto mb-2 block text-7xl leading-none text-white/40"
        >
          “
        </span>
        <blockquote className="font-display text-balance text-3xl font-black leading-[1.1] sm:text-5xl md:text-6xl">
          {quote.text}
        </blockquote>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-1 w-24 rounded-full"
          style={{ background: "var(--gradient-spectrum)" }}
        />
      </Reveal>
    </section>
  );
}
