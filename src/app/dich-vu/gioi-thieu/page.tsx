import type { Metadata } from "next";
import { aboutCta, aboutHero } from "@/content/about";
import { CinematicHero } from "@/components/sections/about/CinematicHero";
import { AboutIntro } from "@/components/sections/about/AboutIntro";
import { AboutStats } from "@/components/sections/about/AboutStats";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { TeamGrid } from "@/components/sections/about/TeamGrid";
import { CtaBand } from "@/components/sections/about/CtaBand";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: aboutHero.lede,
};

export const instant = false;

export default function AboutPage() {
  return (
    <>
      <CinematicHero {...aboutHero} />
      <AboutIntro />
      <AboutStats />
      <CoreValues />
      <TeamGrid />
      <CtaBand {...aboutCta} />
    </>
  );
}
