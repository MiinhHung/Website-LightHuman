import type { Metadata } from "next";
import { homeChaptersEn as ch, homeEn } from "@/content/en/home";
import { alternatesFor } from "@/i18n/config";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { Partners } from "@/components/sections/Partners";
import { HomeServices } from "@/components/sections/HomeServices";
import { HomeToolkit } from "@/components/sections/HomeToolkit";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Chapter } from "@/components/sections/Chapter";
import { Manifesto } from "@/components/sections/Manifesto";

export const metadata: Metadata = {
  title: { absolute: homeEn.metaTitle },
  description: homeEn.metaDescription,
  alternates: { canonical: "/en", ...alternatesFor("/") },
  openGraph: { locale: "en_US" },
};

export default function HomePageEn() {
  const { stories, process, partners, closing } = homeEn;
  return (
    <div className="lh-home">
      <div className="lh-home__progress" aria-hidden="true" />
      <HomeHero locale="en" />
      <TrustStats title={homeEn.statsTitle} stats={homeEn.stats} />
      <Chapter n={1} label={ch.partners}>
        <Partners
          heading={
            <>
              {partners.heading.before}
              <em>{partners.heading.em}</em>
            </>
          }
          lede={partners.lede}
        />
      </Chapter>
      <Manifesto locale="en" />
      <Chapter n={2} label={ch.services}>
        <HomeServices locale="en" />
      </Chapter>
      <Chapter n={3} label={ch.toolkit}>
        <HomeToolkit locale="en" />
      </Chapter>
      <Chapter n={4} label={ch.stories}>
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
      </Chapter>
      <Chapter n={5} label={ch.process} tone="dark">
        <ProcessSteps title={process.title} lede={process.lede} steps={process.steps} stepLabel={process.stepLabel} />
      </Chapter>
      <Chapter n={6} label={ch.insights}>
        <FeaturedPosts locale="en" />
      </Chapter>
      <ClosingCta
        heading={closing.heading}
        desc={closing.desc}
        action={closing.action}
        secondary={closing.secondary}
        newTab="(opens in a new tab)"
      />
    </div>
  );
}
