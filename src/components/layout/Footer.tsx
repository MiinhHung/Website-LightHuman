import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerNav, site } from "@/content/site";


export function Footer() {
  return (
    <footer className="lh-footer">
      <div className="lh-footer__inner">
        <div className="lh-footer__top">
          <div className="lh-footer__brand">
            <Link href="/" className="lh-wordmark" aria-label={site.name}>
              <Image
                src={site.logo}
                alt={site.name}
                className="lh-wordmark__logo"
              />
            </Link>
            <p className="lh-footer__tagline">{site.description}</p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="lh-footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lh-footer__col lh-footer__col--contact">
            <div className="lh-footer__col-title">Liên hệ</div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <MapPin size={16} strokeWidth={1.75} />
              </span>
              <span className="lh-footer__contact-text">{site.contact.address}</span>
            </div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <Phone size={16} strokeWidth={1.75} />
              </span>
              <span className="lh-footer__contact-text">{site.contact.phone}</span>
            </div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <Mail size={16} strokeWidth={1.75} />
              </span>
              <span className="lh-footer__contact-text">{site.contact.email}</span>
            </div>
          </div>
        </div>
        <div className="lh-footer__bottom">
          <span>{site.legal}</span>
        </div>
      </div>
    </footer>
  );
}
