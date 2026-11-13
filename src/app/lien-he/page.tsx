import type { Metadata } from "next";
import { ContactFaq, ContactHero, ContactMap, ContactVideo, QuoteSection } from "@/components/mk/contact/ContactSections";
import { contactMeta } from "@/content/contact";

export const metadata: Metadata = {
  title: { absolute: contactMeta.title },
  description: contactMeta.description,
};

export const instant = false;

// Order as in the approved mock (lien-he.html): no logo band and no closing CTA here.
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <QuoteSection />
      <ContactMap />
      <ContactVideo />
      <ContactFaq />
    </>
  );
}
