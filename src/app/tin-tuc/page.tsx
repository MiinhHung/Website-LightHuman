import { Suspense } from "react";
import type { Metadata } from "next";
import { insightsPage } from "@/content/posts";
import { PageHeader } from "@/components/sections/PageHeader";
import { InsightsBrowser, InsightsBrowserWithQuery } from "@/components/sections/blog/InsightsBrowser";
import { NewsletterSection } from "@/components/sections/blog/NewsletterSection";

export const metadata: Metadata = {
  title: "Insights",
  description: insightsPage.hero.lede,
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Insights" }]}
        title={insightsPage.hero.title}
        lede={insightsPage.hero.lede}
        image={insightsPage.hero.image}
      />
      <Suspense fallback={<InsightsBrowser />}>
        <InsightsBrowserWithQuery />
      </Suspense>
      <NewsletterSection />
    </>
  );
}
