import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactSplit } from "@/components/sections/contact/ContactSplit";
import { ContactMapRow } from "@/components/sections/contact/ContactMapRow";
import { ContactFaq } from "@/components/sections/contact/ContactFaq";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Gửi tin nhắn hoặc đặt lịch tư vấn miễn phí với đội ngũ tư vấn nhân sự của Light Human.",
};

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
