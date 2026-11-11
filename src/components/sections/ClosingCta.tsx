import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * The one closing call-to-action used at the bottom of every page: a navy band
 * whose only decoration is the fan of light rays taken from the logo crest.
 */
export function ClosingCta({
  heading,
  desc,
  action,
  secondary,
  newTab = "(mở tab mới)",
}: {
  newTab?: string;
  heading: ReactNode;
  desc: string;
  action: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="lh-section lh-closing">
      <div className="lh-container">
        <div className="lh-closing__band">
          <span className="lh-closing__rays" aria-hidden="true" />
          <div className="lh-closing__copy">
            <h2 className="lh-closing__heading">{heading}</h2>
            <p className="lh-closing__desc">{desc}</p>
          </div>
          <div className="lh-closing__actions">
            <Link href={action.href} className="lh-closing__primary">
              {action.label}
            </Link>
            {secondary && (
              <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="lh-closing__secondary">
                {secondary.label}
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only"> {newTab}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
