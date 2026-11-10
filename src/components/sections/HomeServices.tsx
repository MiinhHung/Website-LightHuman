"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";

/**
 * All six services as a list beside one large photo. Hovering or focusing a
 * row swaps the photo (crossfade; every image stays mounted so nothing flashes).
 */
export function HomeServices() {
  const [active, setActive] = useState(0);

  return (
    <section className="lh-section lh-showcase">
      <div className="lh-container">
        <div className="lh-showcase__head">
          <h2 className="lh-h2">Sáu dịch vụ, một đầu mối nhân sự</h2>
          <p className="lh-lede">
            Từ tìm lãnh đạo cấp cao đến tuyển hàng trăm người cho dây chuyền mới, Light Human lo trọn quy trình.
          </p>
        </div>

        <div className="lh-showcase__body">
          <div className="lh-showcase__media" aria-hidden="true">
            {services.map((s, i) => (
              <Image
                key={s.slug}
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className={i === active ? "is-active" : undefined}
              />
            ))}
            <p className="lh-showcase__caption">{services[active].summary}</p>
          </div>

          <ol className="lh-showcase__list">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className="lh-showcase__row"
                  data-active={i === active || undefined}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="lh-showcase__name">{s.name}</span>
                  <ArrowUpRight className="lh-showcase__arrow" size={20} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
