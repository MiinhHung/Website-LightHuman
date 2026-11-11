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
    <div role="group" aria-label={label} className={`lh-lang ${className ?? ""}`}>
      <Globe className="lh-lang__globe" size={15} strokeWidth={1.75} aria-hidden="true" />
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
            className="lh-lang__opt"
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
