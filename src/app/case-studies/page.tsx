import type { Metadata } from "next";
import { caseStudiesPage } from "@/content/case-studies";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBand } from "@/components/sections/about/CtaBand";
import { CaseStudiesBrowser } from "@/components/sections/case-studies/CaseStudiesBrowser";

export const metadata: Metadata = {
  title: "Case Studies",
  description: caseStudiesPage.hero.lede,
};

export default function CaseStudiesPage() {
  const { hero, allLabel, cta } = caseStudiesPage;
  return (
    <>
      <PageHeader crumbs={[{ label: "Case Studies" }]} title={hero.title} lede={hero.lede} image={hero.image} />
      <CaseStudiesBrowser allLabel={allLabel} />
      <CtaBand {...cta} />
    </>
  );
}
