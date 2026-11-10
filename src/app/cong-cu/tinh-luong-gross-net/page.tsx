import { Suspense } from "react";
import type { Metadata } from "next";
import { salaryTool } from "@/content/tools";
import { site } from "@/content/site";
import { ToolHero } from "@/components/tools/ToolHero";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { SalaryCalculator, SalaryCalculatorWithQuery } from "@/components/tools/salary/SalaryCalculator";
import { SalaryGuide } from "@/components/tools/salary/SalaryGuide";
import { SalaryCta } from "@/components/tools/salary/SalaryCta";
import { PayslipBadge } from "@/components/tools/salary/PayslipBadge";

export const metadata: Metadata = {
  title: salaryTool.title,
  description: salaryTool.description,
  alternates: { canonical: "/cong-cu/tinh-luong-gross-net" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: salaryTool.title,
      url: `${site.url}/cong-cu/tinh-luong-gross-net`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "vi",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@type": "FAQPage",
      mainEntity: salaryTool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function SalaryToolPage() {
  const { hero, faqHead, faqs } = salaryTool;
  return (
    <div className="lht-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolHero
        crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ", href: "/cong-cu" }, { label: "Tính lương Gross ⇄ Net" }]}
        eyebrow={hero.eyebrow}
        title={
          <>
            Tính lương Gross ⇄ Net <em>chuẩn 2026</em>
          </>
        }
        lede={hero.lede}
        facts={hero.facts}
        image={hero.image}
        badge={<PayslipBadge gross={hero.sampleGross} />}
      />
      <Suspense fallback={<SalaryCalculator />}>
        <SalaryCalculatorWithQuery />
      </Suspense>
      <SalaryGuide />
      <ToolFaq eyebrow={faqHead.eyebrow} helper={faqHead.helper} helperLink={faqHead.helperLink} items={faqs} />
      <SalaryCta />
    </div>
  );
}
