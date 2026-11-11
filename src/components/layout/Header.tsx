"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  Clock,
  Compass,
  Crown,
  GraduationCap,
  Mail,
  Megaphone,
  Menu,
  Phone,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { chrome, quoteHref, site, type Chrome, type NavIcon, type NavItem, type NavLink as NavEntry } from "@/content/site";
import { localeFromPath, type Locale } from "@/i18n/config";
import { LanguageSwitch } from "./LanguageSwitch";

const ICONS: Record<NavIcon, ReactNode> = {
  company: <Building2 size={18} strokeWidth={1.75} />,
  story: <BookOpen size={18} strokeWidth={1.75} />,
  executive: <Crown size={18} strokeWidth={1.75} />,
  mass: <Users size={18} strokeWidth={1.75} />,
  temporary: <Clock size={18} strokeWidth={1.75} />,
  training: <GraduationCap size={18} strokeWidth={1.75} />,
  career: <Compass size={18} strokeWidth={1.75} />,
  branding: <Megaphone size={18} strokeWidth={1.75} />,
  salary: <Calculator size={18} strokeWidth={1.75} />,
  compound: <TrendingUp size={18} strokeWidth={1.75} />,
};

// Routes that open with a dark cinematic hero; the header sits transparent on top of it.
// Decided per route, not with CSS :has(): cacheComponents keeps previous routes mounted
// (hidden), so a hero from the last page would otherwise still match.
function opensWithDarkHero(pathname: string): boolean {
  return (
    ["/", "/en", "/dich-vu", "/case-studies", "/tin-tuc"].includes(pathname) || pathname.startsWith("/dich-vu/")
  );
}

const matches = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

// Only the most specific match is active: /dich-vu/gioi-thieu marks "Giới thiệu", not "Dịch vụ" too.
function activeHref(pathname: string, nav: NavItem[]): string | undefined {
  const hrefs = nav.flatMap((i) => (i.external ? [] : [i.href, ...(i.children?.map((c) => c.href) ?? [])]));
  return hrefs.filter((h) => matches(pathname, h)).sort((a, b) => b.length - a.length)[0];
}

function isActive(best: string | undefined, item: NavItem): boolean {
  if (!best || item.external) return false;
  return item.href === best || !!item.children?.some((c) => c.href === best);
}

/** A link that leads out of the current locale (English menu → Vietnamese-only page). */
function crossesLocale(href: string, locale: Locale) {
  return locale === "en" && !href.startsWith("http") && localeFromPath(href) !== "en";
}

function LangTag({ href, locale, t }: { href: string; locale: Locale; t: Chrome }) {
  if (!crossesLocale(href, locale)) return null;
  return (
    <span className="lh-nav__lang" title={t.otherLang}>
      VI
    </span>
  );
}

function ExternalLink({ item, className, t, onClick }: { item: NavItem; className: string; t: Chrome; onClick?: () => void }) {
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {item.label}
      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
      <span className="sr-only"> {t.newTab}</span>
    </a>
  );
}

function PanelLink({
  link,
  current,
  locale,
  t,
  onNavigate,
}: {
  link: NavEntry;
  current: boolean;
  locale: Locale;
  t: Chrome;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      className="lh-mega__link"
      aria-current={current ? "page" : undefined}
      hrefLang={crossesLocale(link.href, locale) ? "vi" : undefined}
      onClick={onNavigate}
    >
      {link.icon && (
        <span className="lh-mega__icon" aria-hidden="true">
          {ICONS[link.icon]}
        </span>
      )}
      <span className="lh-mega__text">
        <span className="lh-mega__label">
          {link.label}
          <LangTag href={link.href} locale={locale} t={t} />
        </span>
        {link.desc && <span className="lh-mega__desc">{link.desc}</span>}
      </span>
    </Link>
  );
}

/** Desktop dropdown: opens on hover (mouse), click, or keyboard; Escape closes it. */
function MenuItem({
  item,
  active,
  best,
  open,
  locale,
  t,
  onOpen,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  best: string | undefined;
  open: boolean;
  locale: Locale;
  t: Chrome;
  onOpen: (key: string | null, delay?: number) => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const children = item.children ?? [];
  const wide = !!item.promo;

  function onKeyDown(e: KeyboardEvent<HTMLLIElement>) {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      onClose();
      triggerRef.current?.focus();
    }
  }

  function onBlur(e: FocusEvent<HTMLLIElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onOpen(null);
  }

  return (
    <li
      className={wide ? "lh-nav__item lh-nav__item--wide" : "lh-nav__item"}
      data-active={active || undefined}
      data-open={open || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(item.href, 60)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onOpen(null, 160)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className="lh-nav__link"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpen(open ? null : item.href)}
      >
        {item.label}
        <ChevronDown className="lh-nav__chevron" size={15} strokeWidth={2.25} aria-hidden="true" />
      </button>
      <div id={panelId} className={wide ? "lh-mega lh-mega--wide" : "lh-mega"} hidden={!open}>
        <div className="lh-mega__body">
          <ul className={children.length > 3 ? "lh-mega__grid lh-mega__grid--2" : "lh-mega__grid"}>
            {children.map((c) => (
              <li key={c.href + c.label}>
                <PanelLink link={c} current={c.href === best} locale={locale} t={t} onNavigate={onClose} />
              </li>
            ))}
          </ul>
          {item.promo && (
            <Link href={item.promo.href} className="lh-mega__promo" onClick={onClose}>
              <span className="lh-mega__promo-rays" aria-hidden="true" />
              <span className="lh-mega__promo-title">{item.promo.title}</span>
              <span className="lh-mega__promo-body">{item.promo.body}</span>
              <span className="lh-mega__promo-cta">
                {item.promo.cta}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
        {item.overview && (
          <Link href={item.href} className="lh-mega__overview" onClick={onClose}>
            {item.overview}
            <LangTag href={item.href} locale={locale} t={t} />
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
      </div>
    </li>
  );
}

function MobileGroup({
  item,
  best,
  locale,
  t,
  onNavigate,
}: {
  item: NavItem;
  best: string | undefined;
  locale: Locale;
  t: Chrome;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(() => isActive(best, item));
  const listId = useId();
  return (
    <li className="lh-drawer__item">
      <button
        type="button"
        className="lh-drawer__link"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded((v) => !v)}
      >
        {item.label}
        <ChevronDown className="lh-drawer__chevron" size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <ul id={listId} className="lh-drawer__sub" hidden={!expanded}>
        {item.children?.map((c) => (
          <li key={c.href + c.label}>
            <Link
              href={c.href}
              className="lh-drawer__sublink"
              aria-current={c.href === best ? "page" : undefined}
              onClick={onNavigate}
            >
              {c.icon && (
                <span className="lh-drawer__icon" aria-hidden="true">
                  {ICONS[c.icon]}
                </span>
              )}
              {c.label}
              <LangTag href={c.href} locale={locale} t={t} />
            </Link>
          </li>
        ))}
        {item.overview && (
          <li>
            <Link href={item.href} className="lh-drawer__overview" onClick={onNavigate}>
              {item.overview}
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
        )}
      </ul>
    </li>
  );
}

/** Sticky navy header: dropdown panels on desktop, full-screen drawer on mobile. */
export function Header() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = chrome[locale];
  const best = activeHref(pathname, t.nav);
  const home = locale === "en" ? "/en" : "/";

  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [solid, setSolid] = useState(false);
  const [overlay, setOverlay] = useState(() => opensWithDarkHero(pathname));
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  function openMenu(key: string | null, delay = 0) {
    window.clearTimeout(timer.current);
    if (delay) timer.current = window.setTimeout(() => setMenu(key), delay);
    else setMenu(key);
  }
  const closeMenu = () => openMenu(null);
  const closeAll = () => {
    closeMenu();
    setDrawer(false);
  };

  // <html lang> is rendered once by the root layout; keep it in step with the page language.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (!drawer) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      <div ref={sentinelRef} className="lh-header-sentinel" aria-hidden="true" />
      <header
        ref={headerRef}
        lang={locale}
        className="lh-header"
        data-overlay={overlay || undefined}
        data-solid={solid || drawer || !!menu || undefined}
      >
        <div className="lh-header__inner">
          <Link href={home} className="lh-wordmark" aria-label={t.homeLabel} onClick={closeAll}>
            <Image src={site.logo} alt={site.name} className="lh-wordmark__logo" loading="eager" />
          </Link>

          <nav aria-label={t.mainNavLabel} className="lh-nav-desktop">
            <ul className="lh-nav">
              {t.nav.map((item) => {
                const active = isActive(best, item);
                if (item.children) {
                  return (
                    <MenuItem
                      key={item.href}
                      item={item}
                      active={active}
                      best={best}
                      open={menu === item.href}
                      locale={locale}
                      t={t}
                      onOpen={openMenu}
                      onClose={closeMenu}
                    />
                  );
                }
                return (
                  <li key={item.href} className="lh-nav__item" data-active={active || undefined}>
                    {item.external ? (
                      <ExternalLink item={item} className="lh-nav__link" t={t} />
                    ) : (
                      <Link
                        href={item.href}
                        className="lh-nav__link"
                        aria-current={active ? "page" : undefined}
                        hrefLang={crossesLocale(item.href, locale) ? "vi" : undefined}
                        title={crossesLocale(item.href, locale) ? t.otherLang : undefined}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lh-header__actions">
            <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--bar" />
            <Link href={quoteHref} className="lh-header__cta">
              {t.quote}
            </Link>
            <button
              type="button"
              className="lh-mobile-trigger"
              aria-label={drawer ? t.closeMenu : t.openMenu}
              aria-expanded={drawer}
              aria-controls="lh-mobile-drawer"
              onClick={() => setDrawer((v) => !v)}
            >
              {drawer ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {drawer && (
          <div id="lh-mobile-drawer" className="lh-drawer" role="dialog" aria-modal="true" aria-label={t.mainNavLabel}>
            <nav aria-label={t.mainNavLabel}>
              <ul className="lh-drawer__list">
                {t.nav.map((item) =>
                  item.children ? (
                    <MobileGroup key={item.href} item={item} best={best} locale={locale} t={t} onNavigate={closeAll} />
                  ) : (
                    <li key={item.href} className="lh-drawer__item">
                      {item.external ? (
                        <ExternalLink item={item} className="lh-drawer__link" t={t} onClick={closeAll} />
                      ) : (
                        <Link
                          href={item.href}
                          className="lh-drawer__link"
                          aria-current={isActive(best, item) ? "page" : undefined}
                          onClick={closeAll}
                        >
                          {item.label}
                          <LangTag href={item.href} locale={locale} t={t} />
                        </Link>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <div className="lh-drawer__foot">
              <LanguageSwitch pathname={pathname} locale={locale} label={t.language} className="lh-lang--drawer" onSwitch={closeAll} />
              <Link href={quoteHref} className="lh-header__cta lh-drawer__cta" onClick={closeAll}>
                {t.quote}
              </Link>
              <div className="lh-drawer__contact">
                <a href={site.contact.phoneHref}>
                  <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.phone}
                </a>
                <a href={`mailto:${site.contact.email}`}>
                  <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
