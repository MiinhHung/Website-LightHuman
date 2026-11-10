"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { mainNav, quoteHref, site, type NavItem } from "@/content/site";

// Routes that open with a dark cinematic hero; the header sits transparent on top of it.
// Decided per route, not with CSS :has(): cacheComponents keeps previous routes mounted
// (hidden), so a hero from the last page would otherwise still match.
function opensWithDarkHero(pathname: string): boolean {
  return ["/", "/dich-vu", "/case-studies", "/tin-tuc"].includes(pathname) || pathname.startsWith("/dich-vu/");
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.external) return false;
  if (item.children?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))) return true;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  className,
  onClick,
}: {
  item: { label: string; href: string; external?: boolean };
  className: string;
  onClick?: () => void;
}) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {item.label}
        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
        <span className="sr-only"> (mở tab mới)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

/** Sticky navy header: CSS-hover dropdowns on desktop, full-screen drawer on mobile. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [overlay, setOverlay] = useState(() => opensWithDarkHero(pathname));

  // Confirm against the rendered page (e.g. an unknown /dich-vu/* slug renders a 404 with no hero).
  useEffect(() => {
    const expected = opensWithDarkHero(pathname);
    const frame = requestAnimationFrame(() => {
      const hero = Array.from(document.querySelectorAll<HTMLElement>("main .lh-hero--cinematic")).some(
        (el) => el.offsetParent !== null,
      );
      setOverlay(expected && hero);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Over a dark hero the header starts transparent; it turns navy once the
  // top-of-page sentinel scrolls out (IntersectionObserver, no scroll handler).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <>
      <div ref={sentinelRef} className="lh-header-sentinel" aria-hidden="true" />
      <header className="lh-header" data-overlay={overlay || undefined} data-solid={solid || open || undefined}>
        <div className="lh-header__inner">
          <Link href="/" className="lh-wordmark" aria-label={`${site.name} - Trang chủ`} onClick={close}>
            <Image src={site.logo} alt={site.name} className="lh-wordmark__logo" loading="eager" />
          </Link>

          <nav aria-label="Điều hướng chính" className="lh-nav-desktop">
            <ul className="lh-nav">
              {mainNav.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <li
                    key={item.href}
                    className={item.children ? "lh-nav__item lh-nav__item--has-menu" : "lh-nav__item"}
                    data-active={active || undefined}
                  >
                    <NavLink item={item} className="lh-nav__link" />
                    {item.children && (
                      <ul className="lh-nav__submenu">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="lh-nav__sublink"
                              aria-current={pathname === c.href ? "page" : undefined}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lh-header__actions">
            <Link href={quoteHref} className="lh-header__cta">
              Báo giá
            </Link>
            <button
              type="button"
              className="lh-mobile-trigger"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="lh-mobile-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
            {open && (
              <div id="lh-mobile-drawer" className="lh-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu">
                <ul className="lh-mobile-drawer__list">
                  {mainNav.map((item) => (
                    <li key={item.href} className="lh-mobile-drawer__item">
                      <NavLink item={item} className="lh-mobile-drawer__link" onClick={close} />
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
                <Link href={quoteHref} className="lh-header__cta lh-mobile-drawer__cta" onClick={close}>
                  Báo giá
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
