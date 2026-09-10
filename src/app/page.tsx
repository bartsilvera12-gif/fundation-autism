import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Concepts } from "@/components/sections/concepts";
import { MissionVision } from "@/components/sections/mission-vision";
import { Objectives } from "@/components/sections/objectives";
import { Board } from "@/components/sections/board";
import { History } from "@/components/sections/history";
import { Project } from "@/components/sections/project";
import { Events } from "@/components/sections/events";
import { Divertite } from "@/components/sections/divertite";
import { Gallery } from "@/components/sections/gallery";
import { Quote } from "@/components/sections/quote";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Concepts />
      <MissionVision />
      <Objectives />
      <Board />
      <History />
      <Project />
      <Events />
      <Divertite />
      <Gallery />
      <Quote />
      <CTA />
    </>
  );
}
