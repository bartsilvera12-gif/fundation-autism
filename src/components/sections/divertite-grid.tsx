"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { divertiteKids, type KidPhoto } from "@/content/divertite";
import { fetchDivertiteKids } from "@/lib/data";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export function DivertiteGrid() {
  const [kids, setKids] = useState<KidPhoto[]>(divertiteKids);

  useEffect(() => {
    let alive = true;
    fetchDivertiteKids().then((d) => {
      if (alive && d && d.length) setKids(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {kids.map((kid, i) => (
        <RevealItem key={kid.src}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <Image
              src={kid.src}
              alt="Protagonista de DIVERtite picoTEAndo 4ª edición"
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
              placeholder={kid.blurDataURL ? "blur" : "empty"}
              blurDataURL={kid.blurDataURL || undefined}
              loading={i < 10 ? "eager" : "lazy"}
              className="object-contain"
            />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
