import type { Metadata } from "next";
import { homeEn } from "@/content/en/home";
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
  SxParallax,
  SxTestimonials,
  Toolkit,
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
      <HomeHero locale="en" />
      <PartnersBand locale="en" />
      <Manifesto locale="en" />
      <ServicesAcc locale="en" />
      <HomeProcess locale="en" />
      <CasesStage locale="en" />
      <SxParallax locale="en" />
      <SxFeatures locale="en" />
      <SxTestimonials locale="en" />
      <Toolkit locale="en" />
      <PostsIndex locale="en" />
      <QuoteCta locale="en" />
    </>
  );
}
