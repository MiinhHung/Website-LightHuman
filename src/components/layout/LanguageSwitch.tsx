"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { chrome } from "@/content/site";
import { counterpart, hasCounterpart, localeLabels, locales, type Locale } from "@/i18n/config";

/** VI | EN segmented switch. Each option is a real link to the same page in that language. */
export function LanguageSwitch({
  pathname,
  locale,
  label,
  className,
  onSwitch,
}: {
  pathname: string;
  locale: Locale;
  label: string;
  className?: string;
  onSwitch?: () => void;
}) {
  const translated = hasCounterpart(pathname);
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center gap-[2px] h-9 p-[3px] border border-white/20 rounded-full bg-[rgba(10,20,48,0.4)] ${className ?? ""}`}
    >
      <Globe className="ml-1.5 mr-1 text-white/60" size={15} strokeWidth={1.75} aria-hidden="true" />
      {locales.map((l) => {
        const current = l === locale;
        // Untranslated page → the other language's home page; say so before the click, not after.
        const note = !current && !translated ? chrome[locale].untranslated : undefined;
        return (
          <Link
            key={l}
            href={counterpart(pathname, l)}
            hrefLang={l}
            lang={l}
            className={`inline-grid place-items-center min-w-[34px] h-full px-2 rounded-full font-semibold text-xs tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-white ${
              current
                ? "bg-[var(--gold,#f2cf63)] text-[#0d1a3d] font-bold"
                : "text-white/70 hover:text-white"
            }`}
            aria-current={current ? "true" : undefined}
            title={note || localeLabels[l].name}
            onClick={onSwitch}
          >
            <span aria-hidden="true">{localeLabels[l].short}</span>
            <span className="sr-only">{localeLabels[l].name}</span>
          </Link>
        );
      })}
    </div>
  );
}
