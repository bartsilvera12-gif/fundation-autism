import Image from "next/image";
import { board, type BoardMember } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const MEMBER_ACCENTS = ["#e00e1e", "#05acec", "#f7941d", "#6ba428", "#8b5cf6"];

export function Board() {
  return (
    <Section id={board.id} className="bg-surface-muted" containerClassName="max-w-5xl" ambient="b">
      <SectionHeading
        kicker={board.kicker}
        title={<span className="font-display font-black">{board.title}</span>}
        lead={board.lead}
      />

      <div className="flex flex-col items-center">
        {/* Presidente */}
        <Reveal>
          <MemberCard member={board.president} accent="#1f8fd6" featured />
        </Reveal>

        <Connector />

        {/* Vicepresidente */}
        <Reveal delay={0.05}>
          <MemberCard member={board.vice} accent="#8b5cf6" featured />
        </Reveal>

        <Connector />

        {/* Resto de la comisión */}
        <RevealGroup className="grid w-full grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {board.members.map((m, i) => (
            <RevealItem key={m.name}>
              <MemberCard member={m} accent={MEMBER_ACCENTS[i % MEMBER_ACCENTS.length]} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

function Connector() {
  return <div aria-hidden="true" className="my-6 h-8 w-px bg-border" />;
}

function MemberCard({
  member,
  accent,
  featured = false,
}: {
  member: BoardMember;
  accent: string;
  featured?: boolean;
}) {
  return (
    <figure className={`group text-center ${featured ? "mx-auto w-[190px]" : ""}`}>
      <div
        className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl"
        style={{ boxShadow: featured ? `0 10px 40px -12px ${accent}55` : undefined }}
      >
        <Image
          src={member.img}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes={featured ? "190px" : "220px"}
          className="object-cover object-top"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: accent }}
        />
      </div>
      <figcaption className="mt-3">
        <p className="font-display text-base font-black leading-tight">{member.name}</p>
        <p className="text-sm font-bold" style={{ color: accent }}>
          {member.role}
        </p>
      </figcaption>
    </figure>
  );
}
