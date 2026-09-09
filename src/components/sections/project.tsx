import { project } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ImageCarousel } from "@/components/ui/image-carousel";

const ROOM_ICONS = ["🧩", "💬", "💙"] as const;
const ROOM_GRADIENTS = [
  "linear-gradient(135deg, #05acec, #8b5cf6)",
  "linear-gradient(135deg, #abcf36, #05acec)",
  "linear-gradient(135deg, #f7941d, #e00e1e)",
];

export function Project() {
  return (
    <Section id={project.id} className="bg-surface-muted" containerClassName="max-w-6xl">
      <SectionHeading
        kicker="Nuestro sueño"
        title={<span className="font-display font-black">{project.title}</span>}
        lead={project.lead}
        align="left"
      />

      <Reveal>
        <ImageCarousel slides={project.renders} />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-3">
        {project.rooms.map((room, i) => (
          <RevealItem key={room.name} className="h-full">
            <div className="group h-full rounded-3xl border border-card-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{ background: ROOM_GRADIENTS[i % ROOM_GRADIENTS.length] }}
              >
                {ROOM_ICONS[i % ROOM_ICONS.length]}
              </span>
              <h3 className="font-display mt-5 text-2xl font-black">{room.name}</h3>
              <p className="mt-2.5 text-pretty text-muted-foreground">{room.description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
