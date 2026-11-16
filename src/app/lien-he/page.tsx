import type { Metadata } from "next";
import { ContactFaq, ContactHero, ContactMap, QuoteSection } from "@/components/mk/contact/ContactSections";
import { contactMeta } from "@/content/contact";

export const metadata: Metadata = {
  title: { absolute: contactMeta.title },
  description: contactMeta.description,
};

export const instant = false;

// Mock order minus the company film, which now lives on /dich-vu/gioi-thieu. No logo band or closing CTA here.
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <QuoteSection />
      <ContactMap />
      <ContactFaq />
    </>
  );
}
