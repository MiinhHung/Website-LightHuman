import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services, servicesMk } from "@/content/services";
import { site } from "@/content/site";
import { fixCopy } from "@/lib/mk";
import { PartnersBand, QuoteCta } from "@/components/mk/home/HomeSections";
import {
  RelatedServices,
  ServiceCaseStrip,
  ServiceFaq,
  ServiceFeatures,
  ServiceHero,
  ServiceScope,
  ServiceSubnav,
  ServiceTimeline,
} from "@/components/mk/services/ServiceDetail";

// Every slug is prebuilt via generateStaticParams, but the page body depends on
// `params`, so a navigation can't show a shared shell first; allow it to block.
export const instant = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const plain = (t: string) => fixCopy(t).replace(/\*/g, "").replace(/\n/g, " ");

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return service ? { title: fixCopy(service.name), description: plain(service.description).slice(0, 160) } : {};
}

export default async function ServiceDetailPage({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const url = `${site.url}/dich-vu/${s.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.name,
        description: plain(s.description),
        serviceType: s.name,
        url,
        provider: { "@type": "EmploymentAgency", name: site.name, url: site.url },
        areaServed: "VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: servicesMk.crumbs.home, item: site.url },
          { name: servicesMk.crumbs.services, item: `${site.url}/dich-vu` },
          { name: s.name, item: url },
        ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceHero s={s} />
      <ServiceSubnav s={s} />
      {s.partners && <PartnersBand single />}
      {s.scope && <ServiceScope scope={s.scope} />}
      <ServiceFeatures features={s.features} />
      <ServiceTimeline process={s.process} />
      <ServiceCaseStrip cases={s.cases} />
      <ServiceFaq faq={s.faq} />
      <RelatedServices current={s.slug} />
      <QuoteCta title={s.cta.title} desc={s.cta.desc} />
    </>
  );
}
