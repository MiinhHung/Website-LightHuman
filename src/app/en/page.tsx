import type { Metadata } from "next";
import { homeChaptersEn as ch, homeEn, partnerStripEn } from "@/content/en/home";
import { alternatesFor } from "@/i18n/config";
import { EdHero } from "@/components/home/EdHero";
import { EdServices } from "@/components/home/EdServices";
import { EdProcess } from "@/components/home/EdProcess";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { Manifesto } from "@/components/sections/Manifesto";
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
  const { stories, closing } = homeEn;
  return (
    <div className="lh-home lh-ed">
      <div className="lh-home__progress" aria-hidden="true" />
      <EdHero locale="en" />
      <PartnerStrip label={partnerStripEn} />
      <Chapter n={1} label={ch.belief} next={{ prefix: ch.next, label: ch.services }}>
        <Manifesto locale="en" />
      </Chapter>
      <Chapter n={2} label={ch.services} next={{ prefix: ch.next, label: ch.process }}>
        <EdServices locale="en" />
      </Chapter>
      <Chapter n={3} label={ch.process} next={{ prefix: ch.next, label: ch.stories }}>
        <EdProcess locale="en" />
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
