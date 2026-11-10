import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactSplit } from "@/components/sections/contact/ContactSplit";
import { ContactMapRow } from "@/components/sections/contact/ContactMapRow";
import { ContactFaq } from "@/components/sections/contact/ContactFaq";

export const metadata: Metadata = {
  title: "Liên hệ & Báo giá",
  description: "Nhận báo giá tuyển dụng nhanh chóng và đặt lịch tư vấn miễn phí với đội ngũ nhân sự Light Human.",
};

export const instant = false;

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSplit />
      <ContactMapRow />
      <ContactFaq />
    </>
  );
}
