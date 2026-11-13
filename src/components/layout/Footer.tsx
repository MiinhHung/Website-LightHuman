"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { chrome, site } from "@/content/site";
import { localeFromPath } from "@/i18n/config";
import { fixCopy } from "@/lib/mk";
import { Ico, MkLink } from "@/components/mk/ui";
import { NotifyForm } from "@/components/mk/NotifyForm";
import { LanguageSwitch } from "./LanguageSwitch";

// Client component only to read the locale from the URL (the root layout renders it on every route).
export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = chrome[locale];
  const c = site.contact;

  return (
    <footer className="site-footer tone-deep" lang={locale}>
      <div className="wrap footer-grid">
        <div className="f-brand">
          <Link className="brand" href={locale === "en" ? "/en" : "/"} aria-label={t.homeLabel}>
            <Image src={site.logo} alt={site.name} />
          </Link>
          <address>
            <a href={c.phoneHref}>
              <Ico name="phone" />
              {c.phone}
            </a>
            <a href={`mailto:${c.email}`}>
              <Ico name="envelope" />
              {c.email}
            </a>
            <span>
              <Ico name="pin" />
              {c.address}
            </span>
          </address>
        </div>
        {t.footer.map((col) => (
          <div key={col.title} className="f-col">
            <h2 className="f-h">{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <MkLink href={l.href}>{fixCopy(l.label)}</MkLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="f-col f-news">
          <h2 className="f-h">Góc nhìn mỗi tuần</h2>
          <NotifyForm inline />
        </div>
      </div>
      <div className="wrap footer-base">
        <p className="legal">{fixCopy(t.legal)}</p>
        <ul className="f-social">
          <li>
            <a href={site.socials.facebook} target="_blank" rel="noopener" aria-label="Facebook Light Human">
              <Ico name="facebook" />
            </a>
          </li>
          <li>
            <a href={site.socials.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn Light Human">
              <Ico name="linkedin" />
            </a>
          </li>
          <li>
            <a href={site.socials.youtube} target="_blank" rel="noopener" aria-label="YouTube Light Human">
              <Ico name="youtube" />
            </a>
          </li>
        </ul>
        <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--footer" />
        <Link className="f-policy" href="/chinh-sach-bao-mat">
          Chính sách bảo mật
        </Link>
      </div>
    </footer>
  );
}
