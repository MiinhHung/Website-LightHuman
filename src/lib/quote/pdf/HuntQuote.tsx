import type { QuoteDocument } from "../build-quote-document";
import { MinimumFeeBlock, Notes, SurchargeBlock } from "./components/Blocks";
import { Plan1Section, Plan2Section, QuoteFrame } from "./components/QuoteFrame";

// TODO(BA): chờ BD duyệt layout Hunt (see content/quote/tableLayout.ts).
export function HuntQuote({ doc }: { doc: QuoteDocument }) {
  return (
    <QuoteFrame doc={doc}>
      <Plan1Section doc={doc} />
      {doc.minimumFee && <MinimumFeeBlock block={doc.minimumFee} />}
      <Plan2Section doc={doc} />
      {doc.minimumFee && <MinimumFeeBlock block={doc.minimumFee} />}
      <SurchargeBlock block={doc.surcharges} />
      <Notes notes={doc.notes} />
    </QuoteFrame>
  );
}
