import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="lh-hero lh-hero--dark" style={{ minHeight: 480 }}>
      <div className="lh-container lh-hero__stage">
        <div className="lh-hero__copy">
          <span className="lh-hero__eyebrow">
            <span className="lh-hero__spark" aria-hidden="true">
              ✦
            </span>
            404
          </span>
          <h1 className="lh-hero__title">
            Không tìm thấy <em>trang</em>
          </h1>
          <p className="lh-hero__lede">Trang bạn tìm có thể đã được đổi địa chỉ hoặc không còn tồn tại.</p>
          <div className="lh-hero__ctas">
            <Link href="/" className="lh-hero__cta-primary">
              Về trang chủ
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
