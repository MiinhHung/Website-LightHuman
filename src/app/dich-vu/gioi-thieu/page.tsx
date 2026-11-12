import type { Metadata } from "next";
import { aboutCta, aboutHero, aboutVideo } from "@/content/about";
import { CinematicHero } from "@/components/sections/about/CinematicHero";
import { AboutIntro } from "@/components/sections/about/AboutIntro";
import { AboutStats } from "@/components/sections/about/AboutStats";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { TeamGrid } from "@/components/sections/about/TeamGrid";
import { CtaBand } from "@/components/sections/about/CtaBand";
import { VideoFeature } from "@/components/sections/VideoFeature";
import { Partners } from "@/components/sections/Partners";

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
      <VideoFeature {...aboutVideo} />
      <AboutStats />
      <Partners />
      <CoreValues />
      <TeamGrid />
      <CtaBand {...aboutCta} />
    </>
  );
}
