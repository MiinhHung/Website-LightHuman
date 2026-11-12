import type { Metadata } from "next";
import { caseStudiesPage } from "@/content/case-studies";
import { CinematicHero } from "@/components/sections/about/CinematicHero";
import { CtaBand } from "@/components/sections/about/CtaBand";
import { CaseStudiesBrowser } from "@/components/sections/case-studies/CaseStudiesBrowser";
import { Partners } from "@/components/sections/Partners";

export const metadata: Metadata = {
  title: "Case Studies",
  description: caseStudiesPage.hero.lede,
};

export default function CaseStudiesPage() {
  const { hero, allLabel, cta } = caseStudiesPage;
  return (
    <>
      <CinematicHero {...hero} />
      <CaseStudiesBrowser allLabel={allLabel} />
      <Partners showLink={false} />
      <CtaBand {...cta} />
    </>
  );
}
