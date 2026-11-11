import type { Metadata } from "next";
import { homeChapters as ch, homeStats, partnerStrip } from "@/content/home";
import { quoteHref, site } from "@/content/site";
import { alternatesFor } from "@/i18n/config";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { HomeServices } from "@/components/sections/HomeServices";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { HomeToolkit } from "@/components/sections/HomeToolkit";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Chapter } from "@/components/sections/Chapter";

export const metadata: Metadata = { alternates: { canonical: "/", ...alternatesFor("/") } };

// Story order: belief → what we do → how → results → where to start.
export default function HomePage() {
  return (
    <div className="lh-home">
      <div className="lh-home__progress" aria-hidden="true" />
      <HomeHero />
      <TrustStats eyebrow="Đối tác nhân sự chiến lược" title="Con số nói lên chính chúng tôi" stats={homeStats} />
      <PartnerStrip label={partnerStrip} />
      <Chapter n={1} label={ch.belief} tone="dark" next={{ prefix: ch.next, label: ch.services }}>
        <Manifesto />
      </Chapter>
      <Chapter n={2} label={ch.services} next={{ prefix: ch.next, label: ch.process }}>
        <HomeServices />
      </Chapter>
      <Chapter n={3} label={ch.process} tone="dark" next={{ prefix: ch.next, label: ch.stories }}>
        <ProcessSteps />
      </Chapter>
      <Chapter n={4} label={ch.stories} next={{ prefix: ch.next, label: ch.start }}>
        <SuccessStories />
      </Chapter>
      <Chapter n={5} label={ch.start}>
        <HomeToolkit />
        <ClosingCta
          heading="Bắt đầu với một bản báo giá"
          desc="Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay. Đội BD liên hệ lại trong 24 giờ làm việc."
          action={{ label: "Nhận báo giá", href: quoteHref }}
          secondary={{ label: "Bạn đang tìm việc? Xem việc làm", href: site.jobsUrl }}
        />
      </Chapter>
    </div>
  );
}
