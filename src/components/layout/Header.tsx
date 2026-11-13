"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { chrome, quoteHref, site, type NavItem } from "@/content/site";
import { localeFromPath } from "@/i18n/config";
import { fixCopy } from "@/lib/mk";
import { BtnIco, Ico } from "@/components/mk/ui";
import { LanguageSwitch } from "./LanguageSwitch";

const matches = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

// Only the most specific match is active: /dich-vu/gioi-thieu marks "Giới thiệu", not "Dịch vụ" too.
function activeHref(pathname: string, nav: NavItem[]): string | undefined {
  const hrefs = nav.flatMap((i) => (i.external ? [] : [i.href, ...(i.children?.map((c) => c.href) ?? [])]));
  return hrefs.filter((h) => matches(pathname, h)).sort((a, b) => b.length - a.length)[0];
}

const isCurrent = (best: string | undefined, item: NavItem) =>
  !!best && !item.external && (item.href === best || !!item.children?.some((c) => c.href === best));

/**
 * Fixed header from the mock: transparent over a photo hero (`data-mode="over"`),
 * navy-900 once the sentinel scrolls out; solid from the start on pages without one.
 */
export function Header() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = chrome[locale];
  const best = activeHref(pathname, t.nav);
  const home = locale === "en" ? "/en" : "/";

  const [mode, setMode] = useState<"over" | "solid">("solid");
  const [solid, setSolid] = useState(false);
  const [panel, setPanel] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [menuIn, setMenuIn] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // A new route closes any open menu (state reset during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPanel(null);
    setMenu(false);
    setMenuIn(false);
  }

  // The page decides: a photo hero (.hero-home / .hero-page) lets the header float over it.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMode(document.querySelector(".hero-home, .hero-page") ? "over" : "solid"));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || mode !== "over") return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [mode, pathname]);

  useEffect(() => {
    if (panel === null) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-panel]")) setPanel(null);
    };
    document.addEventListener("click", onDown as EventListener);
    return () => document.removeEventListener("click", onDown as EventListener);
  }, [panel]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    // Open on the next frame so the staggered items transition in.
    const id = requestAnimationFrame(() => setMenuIn(true));
    return () => cancelAnimationFrame(id);
  }, [menu]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const closeMenu = () => {
    setMenu(false);
    setMenuIn(false);
  };

  const fine = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const open = (i: number) => {
    window.clearTimeout(timer.current);
    setPanel(i);
  };
  const leave = () => {
    timer.current = window.setTimeout(() => setPanel(null), 160);
  };

  let k = 0;

  return (
    <>
      <header
        className={`site-header${mode === "over" && solid ? " is-solid" : ""}${menu ? " menu-open" : ""}`}
        data-header=""
        data-mode={mode}
        lang={locale}
      >
        <div className="wrap header-inner">
          <Link className="brand" href={home} aria-label={t.homeLabel}>
            <Image src={site.logo} alt={site.name} preload />
          </Link>
          <nav className="nav" aria-label={t.mainNavLabel}>
            <ul className="nav-list">
              {t.nav.map((n, i) => {
                const on = isCurrent(best, n);
                if (!n.children) {
                  return (
                    <li key={n.href}>
                      {n.external ? (
                        <a className="nav-link" href={n.href} target="_blank" rel="noopener">
                          {n.label}
                          <Ico name="arrow-up-right" className="ico-xs" />
                        </a>
                      ) : (
                        <Link className="nav-link" href={n.href} aria-current={on ? "page" : undefined}>
                          {n.label}
                        </Link>
                      )}
                    </li>
                  );
                }
                const isOpen = panel === i;
                return (
                  <li
                    key={n.href}
                    className={`has-panel${isOpen ? " is-open" : ""}`}
                    data-panel=""
                    onPointerEnter={() => fine() && open(i)}
                    onPointerLeave={() => fine() && leave()}
                    onKeyDown={(e) => e.key === "Escape" && setPanel(null)}
                    onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPanel(null)}
                  >
                    <button
                      className="nav-link"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`panel-${i}`}
                      data-current={on ? "true" : undefined}
                      onClick={() => (isOpen ? setPanel(null) : open(i))}
                    >
                      {n.label}
                      <Ico name="caret-down" className="ico-xs" />
                    </button>
                    <div className={`nav-panel${n.promo ? " nav-panel-wide" : ""}`} id={`panel-${i}`}>
                      <ul>
                        {n.children.map((c) => (
                          <li key={c.href + c.label}>
                            <Link href={c.href} aria-current={c.href === best ? "page" : undefined} onClick={() => setPanel(null)}>
                              <span className="np-ico">
                                <Ico name={c.icon ?? "arrow-right"} />
                              </span>
                              <span>
                                <strong>{c.label}</strong>
                                {c.desc && <small>{fixCopy(c.desc)}</small>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {n.promo && (
                        <Link className="nav-promo" href={n.promo.href} onClick={() => setPanel(null)}>
                          <strong>{n.promo.title}</strong>
                          <span>{n.promo.body}</span>
                          <em>
                            {n.promo.cta}
                            <Ico name="arrow-right" />
                          </em>
                        </Link>
                      )}
                      {n.overview && (
                        <Link className="np-all" href={n.href} onClick={() => setPanel(null)}>
                          {n.overview}
                          <Ico name="arrow-right" />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="header-cta">
            <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--bar" />
            <Link className="btn btn-gold btn-sm" href={quoteHref} data-magnetic="">
              <span>{t.quote}</span>
              <BtnIco />
            </Link>
            <button
              className="burger"
              type="button"
              aria-expanded={menu}
              aria-controls="menu-di-dong"
              onClick={() => (menu ? closeMenu() : setMenu(true))}
            >
              <span className="sr-only">{menu ? t.closeMenu : t.openMenu}</span>
              <i />
              <i />
            </button>
          </div>
        </div>
        <div
          className={`mobile-menu${menuIn ? " is-open" : ""}`}
          id="menu-di-dong"
          hidden={!menu}
          onKeyDown={(e) => e.key === "Escape" && closeMenu()}
        >
          <nav aria-label={t.mainNavLabel}>
            <ul className="mm-list">
              {t.nav.map((n) => {
                const groupK = k++;
                const sub = n.children?.map((c) => ({ c, k: k++ })) ?? [];
                return (
                  <li key={n.href} className="mm-group" style={{ "--k": groupK } as CSSProperties}>
                    {n.external ? (
                      <a className="mm-top" href={n.href} target="_blank" rel="noopener">
                        {n.label}
                        <Ico name="arrow-up-right" />
                      </a>
                    ) : (
                      <Link className="mm-top" href={n.href} aria-current={n.href === best ? "page" : undefined} onClick={closeMenu}>
                        {n.label}
                      </Link>
                    )}
                    {sub.length > 0 && (
                      <ul className="mm-sub">
                        {sub.map(({ c, k: ck }) => (
                          <li key={c.href + c.label} style={{ "--k": ck } as CSSProperties}>
                            <Link href={c.href} aria-current={c.href === best ? "page" : undefined} onClick={closeMenu}>
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
          <div className="mm-foot">
            <Link className="btn btn-gold" href={quoteHref} onClick={closeMenu}>
              <span>{t.quote}</span>
              <BtnIco />
            </Link>
            <a className="mm-contact" href={site.contact.phoneHref}>
              <Ico name="phone" />
              {site.contact.phone}
            </a>
            <a className="mm-contact" href={`mailto:${site.contact.email}`}>
              <Ico name="envelope" />
              {site.contact.email}
            </a>
            <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--drawer" onSwitch={closeMenu} />
          </div>
        </div>
      </header>
      <div className="header-sentinel" ref={sentinel} aria-hidden="true" />
    </>
  );
}
