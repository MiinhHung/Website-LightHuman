import type { Metadata } from "next";
import { services, servicesPage } from "@/content/services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Partners } from "@/components/sections/Partners";
import { CtaGrid } from "@/components/sections/CtaGrid";
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
      <Testimonials />
      <Partners />
      <CtaBand cta={cta} />
      <CtaGrid />
    </>
  );
}
