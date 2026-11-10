import { readFileSync } from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";
import { PDF_FONT } from "./theme";

// Resolved from the project root; next.config.ts traces these files into the
// /api/quote/pdf bundle via outputFileTracingIncludes.
const PDF_DIR = path.join(process.cwd(), "src", "lib", "quote", "pdf");
const FONT_DIR = path.join(PDF_DIR, "fonts");

let logo: Buffer | null = null;

// White wordmark of site.logo recoloured to navy (#14285A) via its PNG palette,
// since the CMS only has the dark-background variant.
// A string src like "E:\…" is parsed as a URL with protocol "e:" on Windows,
// so the logo is handed to <Image> as a Buffer.
export function getLogo(): { data: Buffer; format: "png" } {
  logo ??= readFileSync(path.join(PDF_DIR, "assets", "logo.png"));
  return { data: logo, format: "png" };
}

let registered = false;

export function registerPdfFonts(): void {
  if (registered) return;
  Font.register({
    family: PDF_FONT.family,
    fonts: [
      { src: path.join(FONT_DIR, "Tinos-Regular.ttf") },
      { src: path.join(FONT_DIR, "Tinos-Bold.ttf"), fontWeight: 700 },
      { src: path.join(FONT_DIR, "Tinos-Italic.ttf"), fontStyle: "italic" },
      { src: path.join(FONT_DIR, "Tinos-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
  // The default English hyphenation splits Vietnamese syllables mid-word.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
