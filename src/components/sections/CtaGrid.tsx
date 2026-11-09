import Link from "next/link";
import { site } from "@/content/site";
import { ArrowLineIcon, CtaDecor } from "@/components/icons/BrandIcons";

/** Hai thẻ cuối trang: "Tìm việc" (sáng) và "Yêu cầu tư vấn" (tối). */
export function CtaGrid() {
  return (
    <section className="lh-section lh-cta lh-cta--grid">
      <div className="lh-container">
        <div className="lh-cta">
          <div className="lh-cta__grid">
            <div className="lh-cta__grid-card lh-cta__grid-card--light">
              <CtaDecor tone="light" />
              <div className="lh-cta__grid-body">
                <h3 className="lh-cta__grid-heading">Tìm việc</h3>
                <p className="lh-cta__grid-desc">Khám phá ngay công việc lý tưởng dành cho bạn!</p>
                <a href={`${site.jobsUrl}/`} target="_blank" rel="noopener noreferrer" className="lh-cta__grid-btn">
                  Việc làm
                  <ArrowLineIcon />
                </a>
              </div>
            </div>
            <div className="lh-cta__grid-card lh-cta__grid-card--dark">
              <CtaDecor tone="dark" />
              <div className="lh-cta__grid-body">
                <h3 className="lh-cta__grid-heading">Yêu cầu tư vấn</h3>
                <p className="lh-cta__grid-desc">
                  Vui lòng cung cấp thông tin tuyển dụng của bạn, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
                <Link href="/lien-he" className="lh-cta__grid-btn">
                  Liên hệ chúng tôi
                  <ArrowLineIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
