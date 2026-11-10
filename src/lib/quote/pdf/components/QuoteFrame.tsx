import { Document, Page, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { QuoteDocument } from "../../build-quote-document";
import { PDF_COLORS, PDF_FONT, PDF_PAGE, PDF_SPACE } from "../theme";
import { ItalicLine, PlanHeading, UnitNote } from "./Blocks";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PdfTable } from "./Table";
import { Watermark } from "./Watermark";

export function QuoteFrame({ doc, children }: { doc: QuoteDocument; children: ReactNode }) {
  return (
    <Document title={`Báo phí ${doc.code}`} author="Light Human" language="vi">
      {/* Font styles live on the content View, not on <Page>: fixed `render`
          nodes inheriting a registered font from <Page> are dropped. */}
      <Page
        size="A4"
        style={{
          paddingTop: PDF_PAGE.marginTop,
          paddingBottom: PDF_PAGE.marginBottom,
          paddingHorizontal: PDF_PAGE.marginX,
        }}
      >
        {doc.draft && <Watermark text={doc.watermark} />}
        <View
          style={{
            fontFamily: PDF_FONT.family,
            fontSize: PDF_FONT.base,
            lineHeight: PDF_FONT.lineHeight,
            color: PDF_COLORS.text,
          }}
        >
          <Header doc={doc} />
          {children}
        </View>
        <Footer footer={doc.footer} />
      </Page>
    </Document>
  );
}

export function Plan1Section({ doc }: { doc: QuoteDocument }) {
  const { plan1 } = doc;
  return (
    <View>
      <PlanHeading title={plan1.title} subtitle={plan1.subtitle} />
      <UnitNote text={doc.unitNote} table={plan1.fee} />
      <PdfTable table={plan1.fee} />
      <View wrap={false} style={{ marginTop: PDF_SPACE.sectionGap }}>
        <PdfTable table={plan1.warranty} />
        <ItalicLine text={plan1.discountLine} />
      </View>
    </View>
  );
}

export function Plan2Section({ doc }: { doc: QuoteDocument }) {
  const { plan2 } = doc;
  return (
    <View>
      <PlanHeading title={plan2.title} subtitle={plan2.subtitle} />
      <UnitNote text={doc.unitNote} table={plan2.fee} />
      <PdfTable table={plan2.fee} />
      <ItalicLine text={plan2.footnote} />
    </View>
  );
}
