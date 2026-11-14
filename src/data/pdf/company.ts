import { site } from "@/content/site";

export type QuoteOwner = {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
};

export type PdfCompany = {
  readonly website: string;
  readonly email: string;
  readonly footerAddress: string;
  readonly owner: QuoteOwner;
};

export const PDF_COMPANY: PdfCompany = {
  website: new URL(site.url).host,
  email: site.contact.email,
  footerAddress: "213 Chu Văn An, Bình Thạnh, TP.Hồ Chí Minh",
  owner: { name: "", phone: "", email: "" },
} as const;

export function getPdfCompany(): PdfCompany {
  return PDF_COMPANY;
}
