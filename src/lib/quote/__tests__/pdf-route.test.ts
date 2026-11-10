import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/quote/pdf/route";
import { getQuoteTokenSecret, quotePdfPath, signQuoteToken } from "../token";
import { makeLine, makeSnapshot } from "./fixtures";

function call(path: string) {
  return GET(new NextRequest(new URL(path, "http://localhost")));
}

describe("GET /api/quote/pdf", () => {
  const secret = getQuoteTokenSecret()!;

  it("streams a PDF attachment for a valid token", async () => {
    const snapshot = makeSnapshot();
    const res = await call(quotePdfPath(signQuoteToken(snapshot, secret), "mass"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toBe(`attachment; filename="bao-phi-${snapshot.code}-mass.pdf"`);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    const body = Buffer.from(await res.arrayBuffer());
    expect(body.subarray(0, 4).toString("latin1")).toBe("%PDF");
  }, 60_000);

  it("rejects missing params, forged and expired tokens, and absent types", async () => {
    expect((await call("/api/quote/pdf?type=mass")).status).toBe(400);
    expect((await call("/api/quote/pdf?type=other&t=x.y")).status).toBe(400);
    const token = signQuoteToken(makeSnapshot(), secret);
    expect((await call(quotePdfPath(token.slice(0, -2) + "zz", "mass"))).status).toBe(403);
    const expired = signQuoteToken(makeSnapshot(), secret, new Date("2020-01-01T00:00:00Z"));
    expect((await call(quotePdfPath(expired, "mass"))).status).toBe(410);
    const massOnly = signQuoteToken(makeSnapshot({ lines: [makeLine()] }), secret);
    expect((await call(quotePdfPath(massOnly, "hunt"))).status).toBe(404);
  });
});
