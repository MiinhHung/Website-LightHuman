import type { Metadata } from "next";
import { homeChapters as ch, partnerStrip } from "@/content/home";
import { quoteHref, site } from "@/content/site";
import { alternatesFor } from "@/i18n/config";
import { EdHero } from "@/components/home/EdHero";
import { EdServices } from "@/components/home/EdServices";
import { EdProcess } from "@/components/home/EdProcess";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { HomeToolkit } from "@/components/sections/HomeToolkit";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Chapter } from "@/components/sections/Chapter";

export const metadata: Metadata = { alternates: { canonical: "/", ...alternatesFor("/") } };

// Editorial story: belief → what we do → how → results → where to start.
export default function HomePage() {
  return (
    <div className="lh-home lh-ed">
      <div className="lh-home__progress" aria-hidden="true" />
      <EdHero />
      <PartnerStrip label={partnerStrip} />
      <Chapter n={1} label={ch.belief} next={{ prefix: ch.next, label: ch.services }}>
        <Manifesto />
      </Chapter>
      <Chapter n={2} label={ch.services} next={{ prefix: ch.next, label: ch.process }}>
        <EdServices />
      </Chapter>
      <Chapter n={3} label={ch.process} next={{ prefix: ch.next, label: ch.stories }}>
        <EdProcess />
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
