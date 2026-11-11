import { site } from "@/content/site";
import { VideoLightbox } from "./VideoLightbox";

/** Text beside a large poster of the company film (About and Contact pages). */
export function VideoFeature({
  eyebrow,
  title,
  lede,
  play,
  close,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  play: string;
  close: string;
}) {
  const v = site.introVideo;
  return (
    <section className="lh-section lh-video-feature">
      <div className="lh-container lh-video-feature__grid">
        <div className="lh-video-feature__copy">
          <p className="lh-eyebrow">{eyebrow}</p>
          <h2 className="lh-h2">{title}</h2>
          <p className="lh-lede">{lede}</p>
        </div>
        <VideoLightbox
          videoId={v.id}
          title={v.title}
          poster={v.poster}
          duration={v.duration}
          label={play}
          closeLabel={close}
          dialogLabel={v.title}
        />
      </div>
    </section>
  );
}
