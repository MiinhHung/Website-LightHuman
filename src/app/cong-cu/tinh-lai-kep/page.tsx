import { Suspense } from "react";
import type { Metadata } from "next";
import { compoundTool } from "@/content/tools";
import { site } from "@/content/site";
import { ToolHero } from "@/components/tools/ToolHero";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolCta } from "@/components/tools/ToolCta";
import { CompoundCalculator, CompoundCalculatorWithQuery } from "@/components/tools/compound/CompoundCalculator";
import { CompoundGuide } from "@/components/tools/compound/CompoundGuide";
import { GrowthArt } from "@/components/tools/compound/GrowthArt";

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
  const { hero, faqHead, faqs, cta, disclaimer } = compoundTool;
  return (
    <div className="lht-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolHero
        crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Tính lãi kép" }]}
        eyebrow={hero.eyebrow}
        title={
          <>
            Tính lãi kép & <em>lợi nhuận đầu tư</em>
          </>
        }
        lede={hero.lede}
        facts={hero.facts}
        media={<GrowthArt {...hero.sample} />}
      />
      <Suspense fallback={<CompoundCalculator />}>
        <CompoundCalculatorWithQuery />
      </Suspense>
      <CompoundGuide />
      <ToolFaq eyebrow={faqHead.eyebrow} helper={faqHead.helper} helperLink={faqHead.helperLink} items={faqs} />
      <ToolCta cta={cta} disclaimer={disclaimer} />
    </div>
  );
}
