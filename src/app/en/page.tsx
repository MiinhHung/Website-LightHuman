import type { Metadata } from "next";
import { homeChaptersEn as ch, homeEn, partnerStripEn } from "@/content/en/home";
import { alternatesFor } from "@/i18n/config";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { HomeServices } from "@/components/sections/HomeServices";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { HomeToolkit } from "@/components/sections/HomeToolkit";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Chapter } from "@/components/sections/Chapter";

export const metadata: Metadata = {
  title: { absolute: homeEn.metaTitle },
  description: homeEn.metaDescription,
  alternates: { canonical: "/en", ...alternatesFor("/") },
  openGraph: { locale: "en_US" },
};

export default function HomePageEn() {
  const { stories, process, closing } = homeEn;
  return (
    <div className="lh-home">
      <div className="lh-home__progress" aria-hidden="true" />
      <HomeHero locale="en" />
      <TrustStats title={homeEn.statsTitle} stats={homeEn.stats} />
      <PartnerStrip label={partnerStripEn} />
      <Chapter n={1} label={ch.belief} tone="dark" next={{ prefix: ch.next, label: ch.services }}>
        <Manifesto locale="en" />
      </Chapter>
      <Chapter n={2} label={ch.services} next={{ prefix: ch.next, label: ch.process }}>
        <HomeServices locale="en" />
      </Chapter>
      <Chapter n={3} label={ch.process} tone="dark" next={{ prefix: ch.next, label: ch.stories }}>
        <ProcessSteps title={process.title} lede={process.lede} steps={process.steps} stepLabel={process.stepLabel} />
      </Chapter>
      <Chapter n={4} label={ch.stories} next={{ prefix: ch.next, label: ch.start }}>
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
      <Chapter n={5} label={ch.start}>
        <HomeToolkit locale="en" />
        <ClosingCta
          heading={closing.heading}
          desc={closing.desc}
          action={closing.action}
          secondary={closing.secondary}
          newTab="(opens in a new tab)"
        />
      </Chapter>
    </div>
  );
}
