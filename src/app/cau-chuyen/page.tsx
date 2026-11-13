import type { Metadata } from "next";
import { storyCta, storyMeta, storyPage } from "@/content/story";
import { HeroPhoto } from "@/components/mk/about/PageHero";
import { StoryOrigin, StoryTimeline } from "@/components/mk/about/StorySections";
import { QuoteCta } from "@/components/mk/home/HomeSections";

export const metadata: Metadata = {
  title: storyMeta.title,
  description: storyMeta.description,
};

export default function StoryPage() {
  return (
    <>
      <HeroPhoto
        image={storyPage.image}
        alt={storyPage.imageAlt}
        crumb={storyPage.crumb}
        kicker={storyPage.kicker}
        title={storyPage.title}
        lede={storyPage.lede}
      />
      <StoryOrigin />
      <StoryTimeline />
      <QuoteCta title={storyCta.heading} desc={storyCta.desc} />
    </>
  );
}
