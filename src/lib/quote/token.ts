/**
 * Signed, self-contained PDF download token: base64url(deflate(JSON)) + "." +
 * base64url(HMAC-SHA256). No database — the snapshot IS the token payload.
 *
 * The token carries the customer's contact details, so download URLs must be
 * treated as private (served with no-store / noindex, never logged in full).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { deflateRawSync, inflateRawSync } from "node:zlib";
import type { QuoteType } from "./classify";
import { SNAPSHOT_VERSION, type QuoteSnapshot } from "./snapshot";

// Matches "Báo phí có hiệu lực trong vòng 07 ngày kể từ ngày gửi."
export const QUOTE_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const DOMAIN = "lh-quote-pdf.v1.";
const MAX_TOKEN_LENGTH = 16_384;
// Guards against decompression bombs in forged-but-unverified payloads.
const MAX_PAYLOAD_BYTES = 64 * 1024;
const DEV_FALLBACK_SECRET = "dev-only-insecure-quote-token-secret";

type Payload = { readonly s: QuoteSnapshot; readonly exp: number };

export type VerifyResult =
  | { readonly ok: true; readonly snapshot: QuoteSnapshot; readonly expiresAt: Date }
  | { readonly ok: false; readonly reason: "malformed" | "bad_signature" | "expired" | "unsupported_version" };

function sign(body: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(DOMAIN + body).digest();
}

export function signQuoteToken(
  snapshot: QuoteSnapshot,
  secret: string,
  now: Date = new Date(),
  ttlSeconds: number = QUOTE_TOKEN_TTL_SECONDS,
): string {
  const payload: Payload = { s: snapshot, exp: Math.floor(now.getTime() / 1000) + ttlSeconds };
  const body = deflateRawSync(Buffer.from(JSON.stringify(payload), "utf8")).toString("base64url");
  return `${body}.${sign(body, secret).toString("base64url")}`;
}

export function verifyQuoteToken(token: string, secret: string, now: Date = new Date()): VerifyResult {
  if (token.length === 0 || token.length > MAX_TOKEN_LENGTH) return { ok: false, reason: "malformed" };
  const dot = token.indexOf(".");
  if (dot <= 0 || dot !== token.lastIndexOf(".")) return { ok: false, reason: "malformed" };
  const body = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1), "base64url");
  const expected = sign(body, secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: "bad_signature" };
  }

  let payload: Payload;
  try {
    const json = inflateRawSync(Buffer.from(body, "base64url"), { maxOutputLength: MAX_PAYLOAD_BYTES });
    payload = JSON.parse(json.toString("utf8")) as Payload;
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (typeof payload?.exp !== "number" || typeof payload.s !== "object" || payload.s === null) {
    return { ok: false, reason: "malformed" };
  }
  if (payload.s.v !== SNAPSHOT_VERSION) return { ok: false, reason: "unsupported_version" };
  if (Math.floor(now.getTime() / 1000) >= payload.exp) return { ok: false, reason: "expired" };
  return { ok: true, snapshot: payload.s, expiresAt: new Date(payload.exp * 1000) };
}

let warnedFallback = false;

/**
 * `QUOTE_TOKEN_SECRET`, or a fixed dev-only fallback outside production.
 * Returns null in production when unset — callers then skip the PDF link.
 */
export function getQuoteTokenSecret(): string | null {
  const secret = process.env.QUOTE_TOKEN_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") return null;
  if (!warnedFallback) {
    warnedFallback = true;
    console.warn("[quote] QUOTE_TOKEN_SECRET is not set — using an insecure dev-only secret.");
  }
  return DEV_FALLBACK_SECRET;
}

export const QUOTE_PDF_ROUTE = "/api/quote/pdf";

export function quotePdfPath(token: string, type: QuoteType): string {
  return `${QUOTE_PDF_ROUTE}?${new URLSearchParams({ type, t: token }).toString()}`;
}

export function quotePdfFilename(code: string, type: QuoteType): string {
  return `bao-phi-${code}-${type}.pdf`;
}
