import { Image, Text, View } from "@react-pdf/renderer";
import type { HeaderField, QuoteDocument } from "../../build-quote-document";
import { getLogo } from "../fonts";
import { PDF_FONT, PDF_SPACE } from "../theme";

function Field({ field }: { field: HeaderField }) {
  return (
    <Text style={{ fontWeight: 700, marginBottom: 2 }}>
      {field.label} {field.value}
    </Text>
  );
}

export function Header({ doc }: { doc: QuoteDocument }) {
  return (
    <View style={{ marginBottom: PDF_SPACE.blockGap }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image has no alt prop */}
      <Image src={getLogo()} style={{ width: 84, marginLeft: -6, marginTop: -8, marginBottom: -2 }} />
      <Text style={{ fontSize: PDF_FONT.title, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
        {doc.title}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "58%" }}>
          {doc.header.left.map((f, i) => (
            <Field key={i} field={f} />
          ))}
        </View>
        <View style={{ width: "42%" }}>
          {doc.header.right.map((f, i) => (
            <Field key={i} field={f} />
          ))}
        </View>
      </View>
      <Text style={{ fontWeight: 700, textAlign: "right", marginTop: 2 }}>
        {doc.header.date.label} {doc.header.date.value}
      </Text>
    </View>
  );
}
