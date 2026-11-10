import Image from "next/image";
import { teamSection } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

/** First sentence always visible; the rest of the bio behind a native disclosure. */
function BioSummary({ bio }: { bio: string }) {
  const cut = bio.indexOf(". ");
  if (cut === -1) return <p className="lh-team-card__bio">{bio}</p>;
  return (
    <div className="lh-team-card__bio">
      <p>{bio.slice(0, cut + 1)}</p>
      <details className="lh-team-card__more">
        <summary>Xem tiểu sử</summary>
        <p>{bio.slice(cut + 2)}</p>
      </details>
    </div>
  );
}

/** "Đội ngũ" — thẻ chân dung ban lãnh đạo. */
export function TeamGrid() {
  const { title, lede, members } = teamSection;
  return (
    <section className="lh-section" id="doi-ngu">
      <div className="lh-container">
        <div className="lh-team-grid">
          <div className="lh-team-grid__head">
            <h2 className="lh-h2 lh-mt-md">{title}</h2>
            <p className="lh-lede lh-mt-md">{lede}</p>
          </div>
          <div className="lh-team-grid__items">
            {members.map((m, i) => (
              <Reveal key={m.name} as="article" className="lh-team-card" delay={i * 80}>
                <div className="lh-team-card__photo">
                  <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
                <h3 className="lh-team-card__name">{m.name}</h3>
                <div className="lh-team-card__role">{m.role}</div>
                <BioSummary bio={m.bio} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
