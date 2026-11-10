import Image from "next/image";
import logoOnDark from "@/assets/brand/logo-on-dark.png";

/**
 * Route-level fallback while a blocking route (instant = false) loads.
 * Navy splash that slides under the transparent header: the logo rises into
 * view while the crest's light rays open behind it and slowly turn.
 */
export default function Loading() {
  return (
    <div className="lh-loading" role="status" aria-live="polite">
      <span className="lh-loading__rays" aria-hidden="true" />
      <span className="lh-loading__glow" aria-hidden="true" />
      <div className="lh-loading__center">
        <div className="lh-loading__mark">
          <Image src={logoOnDark} alt="" className="lh-loading__logo" loading="eager" />
          {/* The logo itself masks the sweep, so the light only crosses the wordmark and crest. */}
          <span
            className="lh-loading__shine"
            aria-hidden="true"
            style={{ maskImage: `url(${logoOnDark.src})`, WebkitMaskImage: `url(${logoOnDark.src})` }}
          >
            <span className="lh-loading__sweep" />
          </span>
        </div>
        <span className="lh-loading__track" aria-hidden="true">
          <span className="lh-loading__beam" />
        </span>
      </div>
      <span className="sr-only">Đang tải trang…</span>
    </div>
  );
}
