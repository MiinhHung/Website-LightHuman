import type { Metadata } from "next";
import { services, servicesPage } from "@/content/services";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { Partners } from "@/components/sections/Partners";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServiceCatalog } from "@/components/sections/services/ServiceCardsGrid";
import { ServiceProcess } from "@/components/sections/services/ServiceProcess";
import { CtaBand } from "@/components/sections/services/CtaBand";

export const metadata: Metadata = {
  title: servicesPage.title,
  description: servicesPage.description,
};

export default function ServicesPage() {
  const { hero, grid, process, cta } = servicesPage;
  return (
    <>
      <ServiceHero hero={hero} />
      <ServiceCatalog
        head={{ eyebrow: grid.eyebrow, title: grid.title, lede: grid.lede, link: { label: grid.linkLabel, href: grid.linkHref } }}
        items={services}
      />
      <ServiceProcess process={process} />
      <SuccessStories
        title={
          <>
            Khách hàng nói gì về <em>Light Human</em>
          </>
        }
        lede="Năm câu chuyện, kể bằng lời của chính khách hàng và ứng viên."
      />
      <Partners />
      <CtaBand cta={cta} />
    </>
  );
}
