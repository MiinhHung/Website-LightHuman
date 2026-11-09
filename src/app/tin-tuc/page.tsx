import { Suspense } from "react";
import type { Metadata } from "next";
import { insightsPage } from "@/content/posts";
import { CinematicHero } from "@/components/sections/about/CinematicHero";
import { InsightsBrowser, InsightsBrowserWithQuery } from "@/components/sections/blog/InsightsBrowser";
import { NewsletterSection } from "@/components/sections/blog/NewsletterSection";

export const metadata: Metadata = {
  title: "Insights",
  description: insightsPage.hero.lede,
};

export default function InsightsPage() {
  return (
    <>
      <CinematicHero {...insightsPage.hero} />
      <Suspense fallback={<InsightsBrowser />}>
        <InsightsBrowserWithQuery />
      </Suspense>
      <NewsletterSection />
    </>
  );
}
