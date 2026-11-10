import { ClosingCta } from "../ClosingCta";

/** Closing band for About / Case Studies / Story (content-driven heading and action). */
export function CtaBand({
  heading,
  desc,
  action,
}: {
  heading: string;
  desc: string;
  action: { label: string; href: string };
}) {
  return <ClosingCta heading={heading} desc={desc} action={action} />;
}
