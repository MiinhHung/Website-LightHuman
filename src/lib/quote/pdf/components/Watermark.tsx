import { Text, View } from "@react-pdf/renderer";
import { PDF_COLORS, PDF_FONT } from "../theme";

export function Watermark({ text }: { text: string }) {
  return (
    <View
      fixed
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          // Wider than the page so the rotated line is not wrapped/clipped to page width.
          width: 820,
          fontFamily: PDF_FONT.family,
          fontSize: PDF_FONT.watermark,
          fontWeight: 700,
          color: PDF_COLORS.watermark,
          opacity: 0.22,
          transform: "rotate(-35deg)",
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </View>
  );
}
