import type { Metadata } from "next";
import { Fragment } from "react";
import { privacyHero, privacyMeta, privacySections } from "@/content/privacy";
import { HeroText } from "@/components/mk/about/PageHero";
import { MkLink } from "@/components/mk/ui";

export const metadata: Metadata = {
  title: privacyMeta.title,
  description: privacyMeta.description,
};

export default function PrivacyPage() {
  return (
    <>
      <HeroText crumb={privacyHero.crumb} kicker={privacyHero.kicker} title={privacyHero.title} />
      <section className="tone-paper legal-page">
        <div className="wrap-narrow mk-prose">
          {privacySections.map((s) => (
            <Fragment key={s.id}>
              <h2 id={s.id}>{s.title}</h2>
              <p>
                {s.body.map((part, i) =>
                  typeof part === "string" ? (
                    part
                  ) : (
                    <MkLink key={i} href={part.href}>
                      {part.label}
                    </MkLink>
                  ),
                )}
              </p>
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
}
