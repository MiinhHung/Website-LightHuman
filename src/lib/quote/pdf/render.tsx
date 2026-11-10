import { renderToBuffer } from "@react-pdf/renderer";
import type { QuoteDocument } from "../build-quote-document";
import { registerPdfFonts } from "./fonts";
import { HuntQuote } from "./HuntQuote";
import { MassQuote } from "./MassQuote";

export async function renderQuotePdf(doc: QuoteDocument): Promise<Buffer> {
  registerPdfFonts();
  return renderToBuffer(doc.type === "mass" ? <MassQuote doc={doc} /> : <HuntQuote doc={doc} />);
}
