import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type CtaLink = { label: string; href: string };

const isExternal = (href: string) => href.startsWith("http");

function SmartLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return isExternal(href) ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Dải kêu gọi hành động cuối trang công cụ + căn cứ (thu gọn) + lưu ý miễn trừ. */
export function ToolCta({
  cta,
  legal,
  legalTitle = "Căn cứ pháp lý",
  disclaimer,
}: {
  cta: { title: string; titleEm: string; body: string; primary: CtaLink; secondary: CtaLink };
  legal?: string[];
  legalTitle?: string;
  disclaimer: string;
}) {
  return (
    <section className="lh-section lht-noprint">
      <div className="lh-container">
        <div className="lht-cta">
          <div className="lht-cta__copy">
            <h2 className="lht-cta__title">
              {cta.title} <em>{cta.titleEm}</em>
            </h2>
            <p>{cta.body}</p>
          </div>
          <div className="lht-cta__actions">
            <SmartLink href={cta.primary.href} className="lh-hero__cta-primary">
              {cta.primary.label}
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </SmartLink>
            <SmartLink href={cta.secondary.href} className="lht-cta__ghost">
              {cta.secondary.label}
            </SmartLink>
          </div>
        </div>

        {legal && (
          <details className="lht-legal">
            <summary>{legalTitle}</summary>
            <ul>
              {legal.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </details>
        )}
        <p className="lht-disclaimer">{disclaimer}</p>
      </div>
    </section>
  );
}
