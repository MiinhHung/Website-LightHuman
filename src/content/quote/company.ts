/**
 * Company block printed on the quote PDF (header "Người phụ trách" + footer).
 */

import { site } from "@/content/site";

export type QuoteOwner = {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
};

export const QUOTE_COMPANY = {
  website: new URL(site.url).host,
  email: site.contact.email,
  // Verbatim from the BD template; intentionally differs from site.contact.address.
  footerAddress: "213 Chu Văn An, Bình Thạnh, TP.Hồ Chí Minh",
  // TODO(BA): is the owner fixed, the BD handling the lead, or entered on the form?
  // Empty strings render as "—". Never copy the names from the template images here.
  owner: { name: "", phone: "", email: "" } satisfies QuoteOwner,
} as const;
