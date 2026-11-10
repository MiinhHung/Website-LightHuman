import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { Partners } from "@/components/sections/Partners";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServiceScope } from "@/components/sections/services/ServiceCardsGrid";
import { FeatureRows } from "@/components/sections/services/FeatureRows";
import { ServiceProcess } from "@/components/sections/services/ServiceProcess";
import { ServiceCases } from "@/components/sections/services/ServiceCases";
import { ServiceFaq } from "@/components/sections/services/ServiceFaq";
import { CtaBand } from "@/components/sections/services/CtaBand";

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
  const faqBlock = <ServiceFaq helper={faq.helper} items={faq.items} />;

  return (
    <div className="lh-service-detail">
      <ServiceHero hero={hero} />
      {service.partners && <Partners eyebrow="Được tin tưởng bởi" />}
      {scope && <ServiceScope head={{ eyebrow: scope.eyebrow, title: scope.title }} items={scope.items} />}
      <FeatureRows {...features} />
      <ServiceProcess process={process} />
      <ServiceCases {...cases} />
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
