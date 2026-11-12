import { Suspense } from "react";
import type { Metadata } from "next";
import { pitTool } from "@/content/tools";
import { site } from "@/content/site";
import { CURRENT_RULE, salaryRules } from "@/lib/salary/rules";
import { ToolHero } from "@/components/tools/ToolHero";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolCta } from "@/components/tools/ToolCta";
import { PitCalculator, PitCalculatorWithQuery } from "@/components/tools/pit/PitCalculator";
import { PitGuide } from "@/components/tools/pit/PitGuide";
import { PitBadge } from "@/components/tools/pit/PitBadge";

const PATH = "/cong-cu/tinh-thue-thu-nhap-ca-nhan";

export const metadata: Metadata = {
  title: pitTool.title,
  description: pitTool.description,
  alternates: { canonical: PATH },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: pitTool.title,
      url: `${site.url}${PATH}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "vi",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@type": "FAQPage",
      mainEntity: pitTool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PitToolPage() {
  const { hero, faqHead, faqs, cta, disclaimer } = pitTool;
  return (
    <div className="lht-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolHero
        crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Tính thuế TNCN" }]}
        eyebrow={hero.eyebrow}
        title={
          <>
            Tính thuế thu nhập cá nhân <em>chuẩn 2026</em>
          </>
        }
        lede={hero.lede}
        facts={hero.facts}
        image={hero.image}
        badge={<PitBadge income={hero.sample.income} dependents={hero.sample.dependents} />}
      />
      <Suspense fallback={<PitCalculator />}>
        <PitCalculatorWithQuery />
      </Suspense>
      <PitGuide />
      <ToolFaq eyebrow={faqHead.eyebrow} helper={faqHead.helper} helperLink={faqHead.helperLink} items={faqs} />
      <ToolCta
        cta={cta}
        legal={[
          ...salaryRules[CURRENT_RULE].legalBasis.slice(0, 2),
          "Thông tư 111/2013/TT-BTC — khấu trừ 10% với hợp đồng dưới 3 tháng; thuế suất 20% với cá nhân không cư trú",
        ]}
        disclaimer={disclaimer}
      />
    </div>
  );
}
