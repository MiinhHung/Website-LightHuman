import type { Metadata } from "next";
import { aboutCta, aboutHero } from "@/content/about";
import { PageHeader } from "@/components/sections/PageHeader";
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
      <PageHeader
        crumbs={[{ label: "Giới thiệu" }]}
        title={aboutHero.title}
        lede={aboutHero.lede}
        image={aboutHero.image}
        action={aboutHero.cta}
      />
      <AboutIntro />
      <AboutStats />
      <CoreValues />
      <TeamGrid />
      <CtaBand {...aboutCta} />
    </>
  );
}
