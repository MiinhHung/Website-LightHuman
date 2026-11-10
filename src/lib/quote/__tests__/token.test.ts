import { describe, expect, it } from "vitest";
import { INDUSTRY_VALUES, LANGUAGE_VALUES } from "@/content/quote/catalog";
import { POSITION_MAX, QUOTE_LINES_MAX } from "../limits";
import { quotePdfPath, signQuoteToken, verifyQuoteToken, QUOTE_TOKEN_TTL_SECONDS } from "../token";
import { makeLine, makeSnapshot } from "./fixtures";

const SECRET = "test-secret-0123456789abcdef0123456789";
const NOW = new Date("2026-11-09T03:00:00.000Z");

describe("quote token", () => {
  it("round-trips the snapshot", () => {
    const snapshot = makeSnapshot();
    const r = verifyQuoteToken(signQuoteToken(snapshot, SECRET, NOW), SECRET, NOW);
    expect(r.ok && r.snapshot).toEqual(snapshot);
  });

  it("rejects a tampered body or signature, and a different secret", () => {
    const token = signQuoteToken(makeSnapshot(), SECRET, NOW);
    const [body, sig] = token.split(".");
    const flipped = body.slice(0, -2) + (body.at(-2) === "A" ? "B" : "A") + body.at(-1);
    expect(verifyQuoteToken(`${flipped}.${sig}`, SECRET, NOW)).toEqual({ ok: false, reason: "bad_signature" });
    expect(verifyQuoteToken(`${body}.${sig.slice(1)}`, SECRET, NOW)).toEqual({ ok: false, reason: "bad_signature" });
    expect(verifyQuoteToken(token, "another-secret", NOW)).toEqual({ ok: false, reason: "bad_signature" });
  });

  it("rejects malformed tokens", () => {
    for (const t of ["", "abc", "a.b.c", ".sig", "x".repeat(20_000)]) {
      expect(verifyQuoteToken(t, SECRET, NOW)).toMatchObject({ ok: false });
    }
  });

  it(`expires after ${QUOTE_TOKEN_TTL_SECONDS / 86_400} days`, () => {
    const token = signQuoteToken(makeSnapshot(), SECRET, NOW);
    const justBefore = new Date(NOW.getTime() + (QUOTE_TOKEN_TTL_SECONDS - 1) * 1000);
    const atExpiry = new Date(NOW.getTime() + QUOTE_TOKEN_TTL_SECONDS * 1000);
    expect(verifyQuoteToken(token, SECRET, justBefore).ok).toBe(true);
    expect(verifyQuoteToken(token, SECRET, atExpiry)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects another snapshot version", () => {
    const token = signQuoteToken({ ...makeSnapshot(), v: 2 as 1 }, SECRET, NOW);
    expect(verifyQuoteToken(token, SECRET, NOW)).toEqual({ ok: false, reason: "unsupported_version" });
  });

  it(`stays small with ${QUOTE_LINES_MAX} worst-case positions`, () => {
    const position = "Trưởng phòng Kinh doanh Khu vực Đồng bằng sông Cửu Long – Bất động sản nghỉ dưỡng ".repeat(3).slice(0, POSITION_MAX);
    const lines = Array.from({ length: QUOTE_LINES_MAX }, (_, i) =>
      makeLine({
        type: i % 2 ? "mass" : "hunt",
        position,
        quantity: 10_000,
        industries: [...INDUSTRY_VALUES],
        languages: [...LANGUAGE_VALUES],
      }),
    );
    const snapshot = makeSnapshot({
      contact: {
        name: "Nguyễn Thị Phương Thảo".padEnd(120, "ạ"),
        company: "Công ty Cổ phần Đầu tư Phát triển Bất động sản".padEnd(200, "ệ"),
        email: `${"a".repeat(180)}@example.com`,
        phone: "+84 901 234 567".padEnd(32, "0"),
      },
      discount: { pct: 25, capPerCandidate: 1_000_000 },
      lines,
    });
    const url = quotePdfPath(signQuoteToken(snapshot, SECRET, NOW), "hunt");
    // ~1.5 KB measured; comfortably below common URL limits (~8 KB in browsers/CDNs).
    expect(url.length).toBeLessThan(4_096);
  });
});
