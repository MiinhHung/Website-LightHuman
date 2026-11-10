import type { QuoteDocument } from "../build-quote-document";
import { Notes, SurchargeBlock } from "./components/Blocks";
import { Plan1Section, Plan2Section, QuoteFrame } from "./components/QuoteFrame";

export function MassQuote({ doc }: { doc: QuoteDocument }) {
  return (
    <QuoteFrame doc={doc}>
      <Plan1Section doc={doc} />
      <Plan2Section doc={doc} />
      <SurchargeBlock block={doc.surcharges} />
      <Notes notes={doc.notes} />
    </QuoteFrame>
  );
}
