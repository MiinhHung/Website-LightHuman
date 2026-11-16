import type { Metadata } from "next";
import { alternatesFor } from "@/i18n/config";
import {
  HomeAbout,
  HomeHero,
  HomeProcess,
  PartnersBand,
  PostsIndex,
  QuoteCta,
  ServicesAcc,
  SxTestimonials,
} from "@/components/mk/home/HomeSections";

export const metadata: Metadata = {
  title: { absolute: "Headhunting & tuyển dụng số lượng lớn | Light Human" },
  description:
    "Light Human tuyển nhân sự cấp cao, tuyển số lượng lớn và tư vấn nhân sự cho hơn 800 doanh nghiệp. Nhận báo giá tuyển dụng trong vài phút ngay trên website.",
  alternates: { canonical: "/", ...alternatesFor("/") },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Banner trước */}
      <HomeHero />

      {/* 2. Giới thiệu về chúng tôi */}
      <HomeAbout />

      {/* 3. Chạy đối tác doanh nghiệp (ngay dưới Giới thiệu về chúng tôi) */}
      <PartnersBand />

      {/* 4. Dịch vụ */}
      <ServicesAcc />

      {/* 5. Quy trình */}
      <HomeProcess />

      {/* 6. Feedback KH */}
      <SxTestimonials />

      {/* 7. Bản tin */}
      <PostsIndex />

      {/* Nhận báo giá */}
      <QuoteCta />
    </>
  );
}
