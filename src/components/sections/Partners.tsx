import Image from "next/image";
import { partners } from "@/content/partners";

/** Dải logo khách hàng chạy vô tận (CSS gốc tạo animation; danh sách được nhân đôi). */
export function Partners({ eyebrow = "Được tin tưởng bởi" }: { eyebrow?: string }) {
  return (
    <section className="lh-section lh-section--compact lh-partners">
      <div className="lh-container">
        <div className="lh-partners__head">
          <span className="lh-eyebrow">{eyebrow}</span>
          <h2 className="lh-h2 lh-partners__heading">
            Khách hàng <em>tiêu biểu</em>
          </h2>
        </div>
        <div className="lh-partners__marquee">
          <div className="lh-partners__track">
            {[0, 1].map((copy) =>
              partners.map((p) => (
                <span key={`${copy}-${p.logo}`} className="lh-partner-logo" aria-hidden={copy === 1 || undefined}>
                  <Image src={p.logo} alt={copy === 1 ? "" : p.name} width={200} height={80} />
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
