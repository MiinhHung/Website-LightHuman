import Image from "next/image";
import Link from "next/link";
import { homeServices } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { GhostLink } from "./GhostLink";

/** Lưới 3 dịch vụ nổi bật có chữ đè lên ảnh (trang chủ). */
export function HomeServices() {
  return (
    <section className="lh-section lh-section--surface lh-services-grid--overlay">
      <div className="lh-container">
        <div className="lh-services-grid">
          <div className="lh-services-grid__head">
            <div>
              <span className="lh-eyebrow lh-eyebrow--with-spark">
                <span className="lh-spark" aria-hidden="true" />
                Dịch vụ
              </span>
              <h2 className="lh-h2 lh-mt-md">
                Giải pháp nhân sự <em>toàn diện</em> từ Light Human
              </h2>
              <p className="lh-lede lh-mt-md">
                Light Human thấu hiểu rằng nhân sự là yếu tố then chốt cho sự phát triển của doanh nghiệp. Chúng tôi cung
                cấp các giải pháp chuyên nghiệp và toàn diện.
              </p>
            </div>
            <GhostLink href="/dich-vu">Xem tất cả dịch vụ</GhostLink>
          </div>
          <div className="lh-services-grid__items">
            {homeServices.map((s, i) => (
              <Reveal key={s.href} delay={i * 80}>
                <Link href={s.href} className="lh-service-card">
                  <div className="lh-service-card__media">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="lh-service-card__photo"
                    />
                    <div className="lh-service-card__media-overlay">
                      <span className="lh-mono lh-service-card__idx">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="lh-service-card__title">{s.title}</h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
