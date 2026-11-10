import { homeStats } from "@/content/home";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { Partners } from "@/components/sections/Partners";
import { HomeServices } from "@/components/sections/HomeServices";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { quoteHref, site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStats eyebrow="Đối tác nhân sự chiến lược" title="Con số nói lên chính chúng tôi" stats={homeStats} />
      <Partners />
      <HomeServices />
      <ProcessSteps />
      <SuccessStories />
      <FeaturedPosts />
      <ClosingCta
        heading="Bắt đầu với một bản báo giá"
        desc="Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay. Đội BD liên hệ lại trong 24 giờ làm việc."
        action={{ label: "Nhận báo giá", href: quoteHref }}
        secondary={{ label: "Bạn đang tìm việc? Xem việc làm", href: site.jobsUrl }}
      />
    </>
  );
}
