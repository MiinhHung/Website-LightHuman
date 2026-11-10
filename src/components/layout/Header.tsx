"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/content/site";

/** Header gốc: nền navy, sticky; dropdown Dịch vụ bằng CSS hover; drawer trên mobile. */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="lh-header">
      <div className="lh-header__inner">
        <Link href="/" className="lh-wordmark" aria-label={site.name} onClick={close}>
          <Image
            src={site.logo}
            alt={site.name}
            className="lh-wordmark__logo"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="lh-nav-desktop">
          <ul className="lh-nav">
            {mainNav.map((item) => (
              <li key={item.href} className={item.children ? "lh-nav__item lh-nav__item--has-menu" : "lh-nav__item"}>
                <Link href={item.href} className="lh-nav__link">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="lh-nav__submenu" role="menu">
                    {item.children.map((c) => (
                      <li key={c.href} role="none">
                        <Link href={c.href} className="lh-nav__sublink" role="menuitem">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="lh-header__actions">
          <a href={site.jobsUrl} target="_blank" rel="noopener noreferrer" className="lh-header__cta">
            Tin Tuyển Dụng
          </a>
          <button
            type="button"
            className="lh-mobile-trigger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
          {open && (
            <div className="lh-mobile-drawer" role="dialog" aria-modal="true">
              <ul className="lh-mobile-drawer__list">
                {mainNav.map((item) => (
                  <li key={item.href} className="lh-mobile-drawer__item">
                    <Link href={item.href} className="lh-mobile-drawer__link" onClick={close}>
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="lh-mobile-drawer__sub">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="lh-mobile-drawer__sublink" onClick={close}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
