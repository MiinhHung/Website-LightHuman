import { homeChapters as ch, homeStats } from "@/content/home";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { Partners } from "@/components/sections/Partners";
import { HomeServices } from "@/components/sections/HomeServices";
import { HomeToolkit } from "@/components/sections/HomeToolkit";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Chapter } from "@/components/sections/Chapter";
import { Manifesto } from "@/components/sections/Manifesto";
import type { Metadata } from "next";
import { quoteHref, site } from "@/content/site";
import { alternatesFor } from "@/i18n/config";

export const metadata: Metadata = { alternates: { canonical: "/", ...alternatesFor("/") } };

export default function HomePage() {
  return (
    <div className="lh-home">
      <div className="lh-home__progress" aria-hidden="true" />
      <HomeHero />
      <TrustStats eyebrow="Đối tác nhân sự chiến lược" title="Con số nói lên chính chúng tôi" stats={homeStats} />
      <Chapter n={1} label={ch.partners}>
        <Partners />
      </Chapter>
      <Manifesto />
      <Chapter n={2} label={ch.services}>
        <HomeServices />
      </Chapter>
      <Chapter n={3} label={ch.toolkit}>
        <HomeToolkit />
      </Chapter>
      <Chapter n={4} label={ch.stories}>
        <SuccessStories />
      </Chapter>
      <Chapter n={5} label={ch.process} tone="dark">
        <ProcessSteps />
      </Chapter>
      <Chapter n={6} label={ch.insights}>
        <FeaturedPosts />
      </Chapter>
      <ClosingCta
        heading="Bắt đầu với một bản báo giá"
        desc="Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay. Đội BD liên hệ lại trong 24 giờ làm việc."
        action={{ label: "Nhận báo giá", href: quoteHref }}
        secondary={{ label: "Bạn đang tìm việc? Xem việc làm", href: site.jobsUrl }}
      />
    </div>
  );
}
