import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerNav, site } from "@/content/site";
import { FacebookOutlineIcon, LinkedinOutlineIcon, YoutubeOutlineIcon } from "@/components/icons/BrandIcons";

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
                width={site.logoSize.width}
                height={site.logoSize.height}
                className="lh-wordmark__logo"
              />
            </Link>
            <p className="lh-footer__tagline">{site.description}</p>
            <div className="lh-footer__socials">
              <a href={site.socials.youtube} aria-label="youtube" target="_blank" rel="noopener noreferrer">
                <YoutubeOutlineIcon />
              </a>
              <a href={site.socials.facebook} aria-label="facebook" target="_blank" rel="noopener noreferrer">
                <FacebookOutlineIcon />
              </a>
              <a href={site.socials.linkedin} aria-label="linkedin" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlineIcon />
              </a>
            </div>
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
