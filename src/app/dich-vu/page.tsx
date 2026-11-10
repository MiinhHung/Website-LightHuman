import type { Metadata } from "next";
import { services, servicesPage } from "@/content/services";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServiceGroups } from "@/components/sections/services/ServiceGroups";
import { CtaBand } from "@/components/sections/services/CtaBand";

export const metadata: Metadata = {
  title: servicesPage.title,
  description: servicesPage.description,
};

export default function ServicesPage() {
  const { hero, cta } = servicesPage;
  return (
    <>
      <ServiceHero hero={hero} />
      <ServiceGroups items={services} />
      <SuccessStories
        title={
          <>
            Khách hàng nói gì về <em>Light Human</em>
          </>
        }
        lede="Năm câu chuyện, kể bằng lời của chính khách hàng và ứng viên."
      />
      <CtaBand cta={cta} />
    </>
  );
}
