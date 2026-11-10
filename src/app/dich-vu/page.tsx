import type { Metadata } from "next";
import { services, servicesPage } from "@/content/services";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { PageHeader } from "@/components/sections/PageHeader";
import { rich } from "@/components/sections/services/rich";
import { quoteHref } from "@/content/site";
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
      <PageHeader
        crumbs={[{ label: "Dịch vụ" }]}
        title={rich(hero.title)}
        lede={hero.lede}
        image={hero.image}
        action={{ label: "Nhận báo giá", href: quoteHref }}
      />
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
