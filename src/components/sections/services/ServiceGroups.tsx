import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/services";

const FOR_INDIVIDUALS = new Set(["huong-nghiep-va-tu-van-ca-nhan"]);

function ServiceTile({ s, wide = false }: { s: Service; wide?: boolean }) {
  return (
    <Link href={`/dich-vu/${s.slug}`} className={wide ? "lh-svc-tile lh-svc-tile--wide" : "lh-svc-tile"}>
      <div className="lh-svc-tile__media">
        <Image src={s.image} alt="" fill sizes={wide ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 768px) 50vw, 100vw"} />
      </div>
      <div className="lh-svc-tile__body">
        <h3 className="lh-svc-tile__name">{s.name}</h3>
        <p className="lh-svc-tile__summary">{s.summary}</p>
        <span className="lh-svc-tile__more">
          Xem chi tiết
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/** /dich-vu catalogue split by who the service is for; the first business service leads wide. */
export function ServiceGroups({ items }: { items: Service[] }) {
  const business = items.filter((s) => !FOR_INDIVIDUALS.has(s.slug));
  const individuals = items.filter((s) => FOR_INDIVIDUALS.has(s.slug));
  const [lead, ...rest] = business;

  return (
    <section className="lh-section lh-svc-groups">
      <div className="lh-container">
        <div className="lh-svc-group">
          <h2 className="lh-h2">Cho doanh nghiệp</h2>
          <p className="lh-lede">Tuyển dụng, xây dựng đội ngũ và nâng năng lực HR cho tổ chức của bạn.</p>
          <div className="lh-svc-group__grid">
            {lead && <ServiceTile s={lead} wide />}
            {rest.map((s) => (
              <ServiceTile key={s.slug} s={s} />
            ))}
          </div>
        </div>
        {individuals.length > 0 && (
          <div className="lh-svc-group">
            <h2 className="lh-h2">Cho cá nhân</h2>
            <p className="lh-lede">Định hướng nghề nghiệp và kết nối công việc phù hợp với bạn.</p>
            <div className="lh-svc-group__grid">
              {individuals.map((s) => (
                <ServiceTile key={s.slug} s={s} wide />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
