import type { Metadata } from "next";
import { homeEn } from "@/content/en/home";
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
  title: { absolute: homeEn.metaTitle },
  description: homeEn.metaDescription,
  alternates: { canonical: "/en", ...alternatesFor("/") },
  openGraph: { locale: "en_US" },
};

export default function HomePageEn() {
  return (
    <>
      {/* 1. Banner */}
      <HomeHero locale="en" />

      {/* 2. About Us */}
      <HomeAbout locale="en" />

      {/* 3. Partner Logos */}
      <PartnersBand locale="en" />

      {/* 4. Services */}
      <ServicesAcc locale="en" />

      {/* 5. Process */}
      <HomeProcess locale="en" />

      {/* 6. Client Feedback */}
      <SxTestimonials locale="en" />

      {/* 7. Insights */}
      <PostsIndex locale="en" />

      {/* Request a quote */}
      <QuoteCta locale="en" />
    </>
  );
}
