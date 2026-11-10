import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { Partners } from "@/components/sections/Partners";
import { PageHeader } from "@/components/sections/PageHeader";
import { rich } from "@/components/sections/services/rich";
import { quoteHref } from "@/content/site";
import { ServiceScope } from "@/components/sections/services/ServiceCardsGrid";
import { FeatureRows } from "@/components/sections/services/FeatureRows";
import { ServiceProcess } from "@/components/sections/services/ServiceProcess";
import { ServiceCases } from "@/components/sections/services/ServiceCases";
import { ServiceFaq } from "@/components/sections/services/ServiceFaq";
import { CtaBand } from "@/components/sections/services/CtaBand";
import { ServiceSubnav } from "@/components/sections/services/ServiceSubnav";

// Every slug is prebuilt via generateStaticParams, but the page body depends on
// `params`, so a navigation can't show a shared shell first; allow it to block.
export const instant = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return service ? { title: service.name, description: service.description } : {};
}

export default async function ServiceDetailPage({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const { hero, scope, features, process, cases, faq, cta } = service;
  const ctaBand = <CtaBand cta={cta} />;
  const faqBlock = (
    <div id="hoi-dap" className="lh-anchor">
      <ServiceFaq helper={faq.helper} items={faq.items} />
    </div>
  );
  const subnav = [
    ...(scope ? [{ id: "pham-vi", label: "Phạm vi" }] : []),
    { id: "giai-phap", label: "Giải pháp" },
    { id: "quy-trinh", label: "Quy trình" },
    { id: "case-study", label: "Case study" },
    { id: "hoi-dap", label: "Hỏi đáp" },
  ];

  return (
    <div className="lh-service-detail">
      <PageHeader
        crumbs={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: service.name }]}
        title={rich(hero.title)}
        lede={hero.lede}
        image={hero.image}
        action={{ label: hero.cta ?? "Nhận báo giá", href: quoteHref }}
      />
      <ServiceSubnav items={subnav} />
      {service.partners && <Partners eyebrow="Được tin tưởng bởi" />}
      {scope && (
        <div id="pham-vi" className="lh-anchor">
          <ServiceScope head={{ eyebrow: scope.eyebrow, title: scope.title }} items={scope.items} />
        </div>
      )}
      <div id="giai-phap" className="lh-anchor">
        <FeatureRows {...features} />
      </div>
      <div id="quy-trinh" className="lh-anchor">
        <ServiceProcess process={process} />
      </div>
      <div id="case-study" className="lh-anchor">
        <ServiceCases {...cases} />
      </div>
      {service.ctaBeforeFaq ? (
        <>
          {ctaBand}
          {faqBlock}
        </>
      ) : (
        <>
          {faqBlock}
          {ctaBand}
        </>
      )}
    </div>
  );
}
