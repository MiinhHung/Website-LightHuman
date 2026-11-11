import { Suspense } from "react";
import type { Metadata } from "next";
import { insightsPage } from "@/content/posts";
import { InsightsHub, InsightsHubWithQuery } from "@/components/sections/blog/InsightsHub";
import { NewsletterSection } from "@/components/sections/blog/NewsletterSection";

export const metadata: Metadata = {
  title: "Insights",
  description: insightsPage.hero.lede,
};

export default function InsightsPage() {
  return (
    <>
      <Suspense fallback={<InsightsHub />}>
        <InsightsHubWithQuery />
      </Suspense>
      <NewsletterSection />
    </>
  );
}
