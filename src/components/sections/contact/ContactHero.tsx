import Image from "next/image";
import { contactHero } from "@/content/contact";
import { ContactIcon } from "./ContactIcon";

/** Hero chia đôi (chữ + ảnh có thẻ "Sứ mệnh") của trang Liên hệ. */
export function ContactHero() {
  return (
    <section className="lh-hero lh-hero--split-card">
      <div className="lh-container lh-hero__split-card-grid">
        <div className="lh-hero__split-card-copy">
          <span className="lh-hero__eyebrow-mono">{contactHero.eyebrow}</span>
          <h1 className="lh-hero__split-card-title">
            Đồng hành cùng bạn{"\n"}kiến tạo <em>đội ngũ vững mạnh</em>
            {"\n"}và <em>bền vững</em>
          </h1>
          <p className="lh-hero__split-card-lede">{contactHero.lede}</p>
          <div className="lh-hero__chips">
            {contactHero.chips.map((chip) => (
              <div key={chip.title} className="lh-hero__chip">
                <span className="lh-hero__chip-icon" aria-hidden="true">
                  <ContactIcon name={chip.icon} size={16} />
                </span>
                <div>
                  <div className="lh-hero__chip-title">{chip.title}</div>
                  <div className="lh-hero__chip-desc">{chip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lh-hero__split-card-media">
          <div className="lh-hero__split-card-photo">
            <Image
              src={contactHero.image}
              alt=""
              fill
              preload
              sizes="(min-width: 980px) 50vw, 100vw"
              className="lh-hero__split-card-img"
            />
          </div>
          <div className="lh-hero__split-card-overlay">
            <span className="lh-hero__split-card-spark" aria-hidden="true">
              ✦
            </span>
            <div>
              <div className="lh-hero__split-card-overlay-title">{contactHero.overlay.title}</div>
              <p className="lh-hero__split-card-overlay-body">{contactHero.overlay.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
