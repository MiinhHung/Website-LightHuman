import { Suspense } from "react";
import type { Metadata } from "next";
import { compoundTool } from "@/content/tools";
import { site } from "@/content/site";
import { CalcCta, CalcFaq, CalcHero, CompoundGuide } from "@/components/mk/tools/parts";
import { CompoundCalc, CompoundCalcWithQuery } from "@/components/mk/tools/CompoundCalc";

export const metadata: Metadata = {
  title: compoundTool.title,
  description: compoundTool.description,
  alternates: { canonical: "/cong-cu/tinh-lai-kep" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: compoundTool.title,
      url: `${site.url}/cong-cu/tinh-lai-kep`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "vi",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@type": "FAQPage",
      mainEntity: compoundTool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function CompoundToolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalcHero tool={compoundTool} />
      <Suspense fallback={<CompoundCalc />}>
        <CompoundCalcWithQuery />
      </Suspense>
      <CompoundGuide />
      <CalcFaq prefix="lk" tool={compoundTool} />
      <CalcCta cta={compoundTool.cta} />
    </>
  );
}
