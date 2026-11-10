import Image from "next/image";
import logoOnLight from "@/assets/brand/logo-on-light.png";

/** Route-level fallback: shown while a blocking route (instant = false) loads. */
export default function Loading() {
  return (
    <div className="lh-loading" role="status" aria-live="polite">
      <div className="lh-loading__mark">
        <Image src={logoOnLight} alt="" className="lh-loading__logo" loading="eager" />
        <span className="lh-loading__sweep" aria-hidden="true" />
      </div>
      <span className="lh-loading__track" aria-hidden="true">
        <span className="lh-loading__beam" />
      </span>
      <span className="sr-only">Đang tải trang…</span>
    </div>
  );
}
