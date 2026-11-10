import { Text, View } from "@react-pdf/renderer";
import type { QuoteDocument, TableModel } from "../../build-quote-document";
import { PDF_COLORS, PDF_FONT, PDF_SPACE } from "../theme";
import { tableWidth } from "./Table";

const blockTitle = { fontWeight: 700, fontStyle: "italic" as const, marginBottom: 2 };
const blockLine = { color: PDF_COLORS.condition, fontStyle: "italic" as const, marginBottom: 1.5 };

export function PlanHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View minPresenceAhead={80} style={{ marginTop: PDF_SPACE.sectionGap }}>
      <Text style={{ color: PDF_COLORS.red, fontWeight: 700, fontSize: PDF_FONT.section }}>{title}</Text>
      <Text style={{ fontStyle: "italic" }}>{subtitle}</Text>
    </View>
  );
}

export function UnitNote({ text, table }: { text: string; table: TableModel }) {
  return (
    <Text style={{ width: tableWidth(table), textAlign: "right", fontStyle: "italic", marginBottom: 1 }}>
      {text}
    </Text>
  );
}

export function ItalicLine({ text }: { text: string }) {
  return <Text style={{ fontStyle: "italic", marginTop: 2 }}>{text}</Text>;
}

export function MinimumFeeBlock({ block }: { block: NonNullable<QuoteDocument["minimumFee"]> }) {
  return (
    <View wrap={false} style={{ marginTop: PDF_SPACE.blockGap }}>
      <Text style={blockTitle}>{block.title}</Text>
      <Text style={blockLine}>- {block.rule}</Text>
      {block.floors.map((f, i) => (
        <Text key={i} style={blockLine}>
          - {f}
        </Text>
      ))}
    </View>
  );
}

export function SurchargeBlock({ block }: { block: QuoteDocument["surcharges"] }) {
  return (
    <View style={{ marginTop: PDF_SPACE.sectionGap }}>
      <Text style={blockTitle} minPresenceAhead={50}>
        {block.title}
      </Text>
      {block.positions.map((p, i) => (
        <View key={i} wrap={false} style={{ marginBottom: 3 }}>
          <Text style={{ fontWeight: 700 }}>{p.position}</Text>
          {p.items.map((item, j) => (
            <Text key={j} style={blockLine}>
              - {item}
            </Text>
          ))}
          <Text style={blockLine}>- {p.afterSurcharge}</Text>
        </View>
      ))}
    </View>
  );
}

export function Notes({ notes }: { notes: QuoteDocument["notes"] }) {
  return (
    <View wrap={false} style={{ marginTop: PDF_SPACE.sectionGap }}>
      <Text style={{ color: PDF_COLORS.red, fontWeight: 700, fontSize: PDF_FONT.section, marginBottom: 2 }}>
        {notes.title}
      </Text>
      {notes.items.map((item, i) => (
        <Text key={i} style={{ fontSize: PDF_FONT.small, marginBottom: 1 }}>
          - {item}
        </Text>
      ))}
    </View>
  );
}
