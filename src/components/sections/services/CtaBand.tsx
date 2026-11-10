import type { CtaBandData } from "@/content/services";
import { ClosingCta } from "../ClosingCta";
import { rich } from "./rich";

/** Closing band for the services pages; `*text*` in the title renders as emphasis. */
export function CtaBand({ cta }: { cta: CtaBandData }) {
  return <ClosingCta heading={rich(cta.title)} desc={cta.desc} action={{ label: cta.label, href: "/lien-he" }} />;
}
