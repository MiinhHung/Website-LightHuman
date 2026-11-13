import type { Metadata } from "next";
import { aboutCta, aboutHero, aboutMeta, aboutVideo } from "@/content/about";
import { AboutIntro, AboutStats, CoreValues, Team, VideoFeature } from "@/components/mk/about/AboutSections";
import { HeroPhoto } from "@/components/mk/about/PageHero";
import { PartnersBand } from "@/components/mk/home/HomeSections";
import { Btn, BtnIco, CtaBand } from "@/components/mk/ui";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
};

export const instant = false;

export default function AboutPage() {
  return (
    <>
      <HeroPhoto
        image={aboutHero.image}
        alt={aboutHero.imageAlt}
        crumb={aboutHero.crumb}
        kicker={aboutHero.eyebrow}
        title={aboutHero.title}
        lede={aboutHero.lede}
        actions={
          <>
            <Btn label={aboutHero.cta.label} href={aboutHero.cta.href} kind="gold" />
            <button className="btn btn-ghost" type="button" data-video-open="">
              <span>{aboutVideo.play}</span>
              <BtnIco name="play" />
            </button>
          </>
        }
      />
      <AboutIntro />
      <VideoFeature />
      <AboutStats />
      <CoreValues />
      <Team />
      <PartnersBand />
      <CtaBand title={aboutCta.heading} desc={aboutCta.desc} action={aboutCta.action} secondary={aboutCta.secondary} />
    </>
  );
}
