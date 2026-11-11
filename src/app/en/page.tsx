import type { Metadata } from "next";
import { homeEn } from "@/content/en/home";
import { alternatesFor } from "@/i18n/config";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { Partners } from "@/components/sections/Partners";
import { HomeServices } from "@/components/sections/HomeServices";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { ClosingCta } from "@/components/sections/ClosingCta";

export const metadata: Metadata = {
  title: { absolute: homeEn.metaTitle },
  description: homeEn.metaDescription,
  alternates: { canonical: "/en", ...alternatesFor("/") },
  openGraph: { locale: "en_US" },
};

export default function HomePageEn() {
  const { stories, process, partners, closing } = homeEn;
  return (
    <>
      <HomeHero locale="en" />
      <TrustStats title={homeEn.statsTitle} stats={homeEn.stats} />
      <Partners
        heading={
          <>
            {partners.heading.before}
            <em>{partners.heading.em}</em>
          </>
        }
        lede={partners.lede}
      />
      <HomeServices locale="en" />
      <SuccessStories
        locale="en"
        title={
          <>
            {stories.title.before}
            <em>{stories.title.em}</em>
          </>
        }
        lede={stories.lede}
      />
      <ProcessSteps title={process.title} lede={process.lede} steps={process.steps} stepLabel={process.stepLabel} />
      <FeaturedPosts locale="en" />
      <ClosingCta
        heading={closing.heading}
        desc={closing.desc}
        action={closing.action}
        secondary={closing.secondary}
        newTab="(opens in a new tab)"
      />
    </>
  );
}
