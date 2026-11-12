"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { chrome, site } from "@/content/site";
import { localeFromPath } from "@/i18n/config";
import { LanguageSwitch } from "./LanguageSwitch";

// Client component only to read the locale from the URL (the root layout renders it on every route).
export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = chrome[locale];

  return (
    <footer className="lh-footer" lang={locale}>
      <div className="lh-footer__inner">
        <div className="lh-footer__top">
          <div className="lh-footer__brand">
            <Link href={locale === "en" ? "/en" : "/"} className="lh-wordmark" aria-label={t.homeLabel}>
              <Image src={site.logo} alt={site.name} className="lh-wordmark__logo" />
            </Link>
            <p className="lh-footer__tagline">{t.tagline}</p>
            <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--footer" />
          </div>

          {t.footer.map((col) => (
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
            <div className="lh-footer__col-title">{t.contactTitle}</div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <MapPin size={16} strokeWidth={1.75} />
              </span>
              <span className="lh-footer__contact-text" lang="vi">
                {site.contact.address}
              </span>
            </div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <Phone size={16} strokeWidth={1.75} />
              </span>
              <a className="lh-footer__contact-text" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
            </div>
            <div className="lh-footer__contact-row">
              <span className="lh-footer__contact-icon" aria-hidden="true">
                <Mail size={16} strokeWidth={1.75} />
              </span>
              <a className="lh-footer__contact-text" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
        <div className="lh-footer__bottom">
          <span>{t.legal}</span>
        </div>
      </div>
    </footer>
  );
}
