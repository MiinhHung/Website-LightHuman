/**
 * PDF-only design tokens. Colours approximated from docs/quote-templates/*.png;
 * the site CSS tokens do not apply inside @react-pdf.
 */

import type { Styles } from "@react-pdf/renderer";

export { EMPTY_CELL } from "@/content/quote/documentText";

export type PdfStyle = Styles[string];

const A4_WIDTH = 595.28;

export const PDF_PAGE = {
  marginX: 28,
  marginTop: 24,
  // Leaves room for the fixed footer.
  marginBottom: 70,
} as const;

export const CONTENT_WIDTH = A4_WIDTH - PDF_PAGE.marginX * 2;

export const PDF_COLORS = {
  text: "#000000",
  navy: "#1F2150",
  onNavy: "#FFFFFF",
  headerFill: "#D9D9D9",
  red: "#E00000",
  condition: "#1F4E9A",
  link: "#1F4E9A",
  border: "#000000",
  watermark: "#9CA3AF",
} as const;

export const PDF_FONT = {
  family: "Tinos",
  base: 8.5,
  small: 8,
  section: 9.5,
  title: 14,
  watermark: 36,
  lineHeight: 1.2,
} as const;

export const PDF_TABLE = {
  border: 0.6,
  padV: 2,
  padH: 3,
} as const;

export const PDF_SPACE = {
  sectionGap: 12,
  blockGap: 6,
} as const;
