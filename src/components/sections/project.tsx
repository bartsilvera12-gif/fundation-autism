import { project } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ImageCarousel } from "@/components/ui/image-carousel";

const ROOM_ICONS = ["🧩", "💬", "💙"] as const;
const ROOM_ACCENTS = [
  "var(--color-spectrum-blue)",
  "var(--color-spectrum-teal)",
  "var(--color-spectrum-purple)",
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

      <RevealGroup className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-3">
        {project.rooms.map((room, i) => (
          <RevealItem key={room.name}>
            <div className="border-t-2 pt-5" style={{ borderColor: ROOM_ACCENTS[i % ROOM_ACCENTS.length] }}>
              <span aria-hidden="true" className="text-3xl">
                {ROOM_ICONS[i % ROOM_ICONS.length]}
              </span>
              <h3 className="font-display mt-3 text-2xl font-black">{room.name}</h3>
              <p className="mt-2 text-pretty text-muted-foreground">{room.description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
