import type { Metadata } from "next";
import { storyCta, storyMeta, storyPage } from "@/content/story";
import { HeroText } from "@/components/mk/about/PageHero";
import { StoryOrigin, StoryRecord, StoryTimeline } from "@/components/mk/about/StorySections";
import { QuoteCta } from "@/components/mk/home/HomeSections";

export const metadata: Metadata = {
  title: storyMeta.title,
  description: storyMeta.description,
};

// Text hero on purpose: /dich-vu/gioi-thieu owns the team photo hero, this page reads as a chronicle.
export default function StoryPage() {
  return (
    <>
      <HeroText crumb={storyPage.crumb} kicker={storyPage.kicker} title={storyPage.title} lede={storyPage.lede} />
      <StoryOrigin />
      <StoryTimeline />
      <StoryRecord />
      <QuoteCta title={storyCta.heading} desc={storyCta.desc} />
    </>
  );
}
