import { Suspense } from "react";
import type { Metadata } from "next";
import { pitTool } from "@/content/tools";
import { site } from "@/content/site";
import { CalcCta, CalcFaq, CalcHero, PitGuide } from "@/components/mk/tools/parts";
import { PitCalc, PitCalcWithQuery } from "@/components/mk/tools/PitCalc";

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalcHero tool={pitTool} />
      <Suspense fallback={<PitCalc />}>
        <PitCalcWithQuery />
      </Suspense>
      <PitGuide />
      <CalcFaq prefix="tt" tool={pitTool} />
      <CalcCta cta={pitTool.cta} />
    </>
  );
}
