import type { Metadata } from "next";
import { ContactQuote } from "@/components/sections/contact/ContactQuote";
import { ContactFaq } from "@/components/sections/contact/ContactFaq";

export const metadata: Metadata = {
  title: "Liên hệ & Báo giá",
  description: "Nhận báo giá tuyển dụng nhanh chóng và đặt lịch tư vấn miễn phí với đội ngũ nhân sự Light Human.",
};

export const instant = false;

export default function ContactPage() {
  return (
    <>
      <ContactQuote />
      <ContactFaq />
    </>
  );
}
