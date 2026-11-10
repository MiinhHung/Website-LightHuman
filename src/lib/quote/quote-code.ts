/**
 * Quote code generator — `BG-YYMMDD-XXXX`.
 *
 * `XXXX` is 2 bytes of CSPRNG output rendered as uppercase hex (65 536 values
 * per day). Shared across the Mass and Hunt PDFs of one request (Phase 5+).
 */

import { randomBytes } from "node:crypto";

export const QUOTE_CODE_REGEX = /^BG-\d{6}-[0-9A-F]{4}$/;

export function generateQuoteCode(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `BG-${yy}${mm}${dd}-${suffix}`;
}

export function isQuoteCode(s: string): boolean {
  return QUOTE_CODE_REGEX.test(s);
}
