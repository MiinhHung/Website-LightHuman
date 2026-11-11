/**
 * Two locales. Vietnamese lives at the existing slugs; English pages live
 * under /en with English slugs. The locale is derived from the URL only (no
 * cookie), so every page stays statically prerendered.
 */
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  vi: { short: "VI", name: "Tiếng Việt" },
  en: { short: "EN", name: "English" },
};

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}

/**
 * VI ⇄ EN page pairs. Only pages that have an English version are listed;
 * the switcher sends anything else to the other locale's home page.
 */
const pairs: [vi: string, en: string][] = [["/", "/en"]];

function stripHash(href: string) {
  return href.split("#")[0].split("?")[0] || "/";
}

export function counterpart(pathname: string, target: Locale): string {
  const path = stripHash(pathname).replace(/\/$/, "") || "/";
  const from = localeFromPath(path);
  if (from === target) return path;
  const pair = pairs.find(([vi, en]) => (from === "vi" ? vi : en) === path);
  if (pair) return target === "vi" ? pair[0] : pair[1];
  return target === "vi" ? "/" : "/en";
}

/** True when this exact page has a translation (used to tell the reader before switching). */
export function hasCounterpart(pathname: string): boolean {
  const path = stripHash(pathname).replace(/\/$/, "") || "/";
  return pairs.some(([vi, en]) => vi === path || en === path);
}

/** hreflang alternates for a page pair, for `metadata.alternates`. */
export function alternatesFor(viPath: string) {
  const pair = pairs.find(([vi]) => vi === viPath);
  if (!pair) return undefined;
  return { languages: { vi: pair[0], en: pair[1] } };
}
