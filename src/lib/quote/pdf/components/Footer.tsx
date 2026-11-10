import { Link, Text, View } from "@react-pdf/renderer";
import type { QuoteDocument } from "../../build-quote-document";
import { PDF_COLORS, PDF_FONT, PDF_PAGE } from "../theme";

const footerFont = {
  fontFamily: PDF_FONT.family,
  fontSize: PDF_FONT.small,
  fontStyle: "italic" as const,
  color: PDF_COLORS.text,
};

export function Footer({ footer }: { footer: QuoteDocument["footer"] }) {
  const link = { color: PDF_COLORS.link, textDecoration: "underline" as const };
  return (
    <>
      <View
        fixed
        style={[footerFont, { position: "absolute", bottom: 28, right: PDF_PAGE.marginX, alignItems: "flex-end" }]}
      >
        <Link src={`https://${footer.website}`} style={link}>
          {footer.website}
        </Link>
        <Link src={`mailto:${footer.email}`} style={link}>
          {footer.email}
        </Link>
        <Text>{footer.address}</Text>
      </View>
      {/* Separate node with an explicit font: a `render` Text that inherits its
          font from <Page> is silently dropped by @react-pdf 4.9. */}
      <Text
        fixed
        style={[footerFont, { position: "absolute", bottom: 16, right: PDF_PAGE.marginX }]}
        render={({ pageNumber, totalPages }) =>
          footer.pageLabel.replace("{n}", String(pageNumber)).replace("{total}", String(totalPages))
        }
      />
    </>
  );
}
