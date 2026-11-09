import { contactMap, contactWhyUs } from "@/content/contact";
import { ContactIcon } from "./ContactIcon";

const STROKE = "var(--lh-map-stroke, #dcd6c4)";
const roads = [
  { d: "M0 80 L500 60", w: 22 },
  { d: "M0 180 L500 200", w: 14 },
  { d: "M0 290 L500 270", w: 18 },
  { d: "M120 0 L100 400", w: 16 },
  { d: "M260 0 L280 400", w: 12 },
  { d: "M380 0 L400 400", w: 18 },
];

/** Hàng 2 cột: bản đồ minh hoạ + thẻ "Vì sao chọn Light Human?". */
export function ContactMapRow() {
  return (
    <div className="lh-contact-map-row">
      <section className="lh-section">
        <div className="lh-container">
          <div className="lh-location-map">
            <div className="lh-location-map">
              <svg className="lh-location-map__svg" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="500" height="400" fill="var(--lh-map-bg, #eee8d8)" />
                {roads.map((r) => (
                  <path key={r.d} d={r.d} stroke={STROKE} strokeWidth={r.w} fill="none" />
                ))}
                <rect x="60" y="120" width="120" height="80" fill="var(--lh-map-park, #cfe3c8)" opacity="0.7" />
                <rect x="320" y="220" width="140" height="100" fill="var(--lh-map-park, #cfe3c8)" opacity="0.5" />
                <rect x="380" y="340" width="120" height="60" fill="var(--lh-map-water, #bdd8e8)" opacity="0.6" />
              </svg>
              <div className="lh-location-map__pin" aria-hidden="true">
                <ContactIcon name="map-pin" />
              </div>
              <div className="lh-location-map__pill">
                <div className="lh-location-map__pill-title">{contactMap.title}</div>
                <div className="lh-location-map__pill-body">
                  {contactMap.lines.map((line) => (
                    <span key={line} className="lh-location-map__pill-line">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="lh-section lh-feature-rows--compact">
        <div className="lh-container">
          <div className="lh-feature-rows">
            <div className="lh-feature-rows__compact-card">
              <div className="lh-feature-rows__compact-head">
                <h3 className="lh-feature-rows__compact-heading">{contactWhyUs.heading}</h3>
              </div>
              <div className="lh-feature-rows__compact-list">
                {contactWhyUs.rows.map((row) => (
                  <div key={row.title} className="lh-feature-rows__compact-row">
                    <span className="lh-feature-rows__compact-icon" aria-hidden="true">
                      <ContactIcon name={row.icon} />
                    </span>
                    <div>
                      <div className="lh-feature-rows__compact-title">{row.title}</div>
                      <p className="lh-feature-rows__compact-desc">{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
