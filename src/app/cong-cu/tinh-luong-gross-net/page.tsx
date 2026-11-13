import { Suspense } from "react";
import type { Metadata } from "next";
import { salaryTool } from "@/content/tools";
import { site } from "@/content/site";
import { CalcCta, CalcFaq, CalcHero, SalaryGuide } from "@/components/mk/tools/parts";
import { SalaryCalc, SalaryCalcWithQuery } from "@/components/mk/tools/SalaryCalc";

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalcHero tool={salaryTool} />
      <Suspense fallback={<SalaryCalc />}>
        <SalaryCalcWithQuery />
      </Suspense>
      <SalaryGuide />
      <CalcFaq prefix="lg" tool={salaryTool} />
      <CalcCta cta={salaryTool.cta} />
    </>
  );
}
