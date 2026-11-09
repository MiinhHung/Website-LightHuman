import { homeStats } from "@/content/home";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { Partners } from "@/components/sections/Partners";
import { HomeServices } from "@/components/sections/HomeServices";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CaseStudiesGrid } from "@/components/sections/CaseStudiesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { CtaGrid } from "@/components/sections/CtaGrid";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStats eyebrow="Đối tác nhân sự chiến lược" title="Con số nói lên chính chúng tôi" stats={homeStats} />
      <Partners />
      <HomeServices />
      <ProcessSteps />
      <CaseStudiesGrid />
      <Testimonials />
      <FeaturedPosts />
      <CtaGrid />
    </>
  );
}
