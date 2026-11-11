import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { servicesHead } from "@/content/home";
import { homeEn, servicesHeadEn } from "@/content/en/home";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/config";

/** Six services as a numbered, magazine-index grid of photo cards. */
export function EdServices({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const head = en ? servicesHeadEn : servicesHead;
  const items = services.map((s) => ({ ...s, ...(en ? homeEn.services.items[s.slug] : null) }));
  const crossLang = en ? "vi" : undefined;

  return (
    <section className="lh-ed-section lh-ed-services">
      <div className="lh-container">
        <header className="lh-ed-head lh-ed-head--split">
          <div>
            <h2 className="lh-h2">{head.title}</h2>
            <p className="lh-lede">{head.lede}</p>
          </div>
          <Link href="/dich-vu" className="lh-ed-link" hrefLang={crossLang}>
            {head.all}
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </header>

        <ol className="lh-ed-services__grid">
          {items.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/dich-vu/${s.slug}`} className="lh-ed-card" hrefLang={crossLang}>
                <span className="lh-ed-card__media">
                  <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
                </span>
                <span className="lh-ed-card__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="lh-ed-card__title">{s.name}</span>
                <span className="lh-ed-card__desc">{s.summary}</span>
                <ArrowUpRight className="lh-ed-card__go" size={20} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
