import type { Metadata } from "next";
import { servicesMk, servicesPage } from "@/content/services";
import { QuoteCta } from "@/components/mk/home/HomeSections";
import { ServicesCasesStage, ServicesHero, ServicesIndex, StepsRow } from "@/components/mk/services/ServicesOverview";

export const metadata: Metadata = {
  title: servicesMk.meta.title,
  description: servicesMk.meta.description,
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesIndex />
      <StepsRow process={servicesPage.process} />
      <ServicesCasesStage />
      <QuoteCta title={servicesPage.cta.title} desc={servicesPage.cta.desc} />
    </>
  );
}
