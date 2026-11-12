import type { Metadata } from "next";
import { ContactQuote } from "@/components/sections/contact/ContactQuote";
import { ContactFaq } from "@/components/sections/contact/ContactFaq";
import { VideoFeature } from "@/components/sections/VideoFeature";
import { Partners } from "@/components/sections/Partners";
import { contactVideo } from "@/content/contact";

export const metadata: Metadata = {
  title: "Liên hệ & Báo giá",
  description: "Nhận báo giá tuyển dụng nhanh chóng và đặt lịch tư vấn miễn phí với đội ngũ nhân sự Light Human.",
};

export const instant = false;

export default function ContactPage() {
  return (
    <>
      <ContactQuote />
      <Partners />
      <VideoFeature {...contactVideo} />
      <ContactFaq />
    </>
  );
}
