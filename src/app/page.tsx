import type { Metadata } from "next";
import { alternatesFor } from "@/i18n/config";
import {
  CasesStage,
  HomeHero,
  HomeProcess,
  Manifesto,
  PartnersBand,
  PostsIndex,
  QuoteCta,
  ServicesAcc,
  SxFeatures,
  SxTestimonials,
} from "@/components/mk/home/HomeSections";

export const metadata: Metadata = {
  title: { absolute: "Headhunting & tuyển dụng số lượng lớn | Light Human" },
  description:
    "Light Human tuyển nhân sự cấp cao, tuyển số lượng lớn và tư vấn nhân sự cho hơn 800 doanh nghiệp. Nhận báo giá tuyển dụng trong vài phút ngay trên website.",
  alternates: { canonical: "/", ...alternatesFor("/") },
};

// Order and grounds as in the approved mock: photo, deep, navy, paper, navy, paper, layers, why, voices, mist, paper, gold.
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PartnersBand single />
      <Manifesto />
      <ServicesAcc />
      <HomeProcess />
      <CasesStage />
      <SxFeatures />
      <SxTestimonials />
      <PostsIndex />
      <QuoteCta />
    </>
  );
}
