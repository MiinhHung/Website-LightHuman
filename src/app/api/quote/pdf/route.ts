import type { NextRequest } from "next/server";
import { buildQuoteDocument, parseDraftMark } from "@/lib/quote/build-quote-document";
import { renderQuotePdf } from "@/lib/quote/pdf/render";
import { getQuoteTokenSecret, quotePdfFilename, verifyQuoteToken } from "@/lib/quote/token";

// Never "use cache" here: every response is a per-customer, signed snapshot.

const STATUS_BY_REASON = {
  malformed: 400,
  unsupported_version: 400,
  bad_signature: 403,
  expired: 410,
} as const;

const MESSAGE_BY_REASON = {
  malformed: "Liên kết tải báo phí không hợp lệ.",
  unsupported_version: "Liên kết tải báo phí đã cũ, vui lòng tạo báo phí mới.",
  bad_signature: "Liên kết tải báo phí không hợp lệ.",
  expired: "Liên kết tải báo phí đã hết hạn (hiệu lực 07 ngày). Vui lòng tạo báo phí mới.",
} as const;

function textResponse(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams;
  const token = params.get("t");
  const type = params.get("type");
  if (!token || (type !== "mass" && type !== "hunt")) {
    return textResponse(400, MESSAGE_BY_REASON.malformed);
  }

  const secret = getQuoteTokenSecret();
  if (!secret) return textResponse(503, "Tính năng tải báo phí đang tạm ngưng.");

  const verified = verifyQuoteToken(token, secret);
  if (!verified.ok) {
    return textResponse(STATUS_BY_REASON[verified.reason], MESSAGE_BY_REASON[verified.reason]);
  }

  const doc = buildQuoteDocument(verified.snapshot, type, {
    draftMark: parseDraftMark(process.env.QUOTE_PDF_DRAFT_MARK),
  });
  if (!doc) return textResponse(404, "Báo phí không có vị trí thuộc loại này.");

  const pdf = await renderQuotePdf(doc);
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quotePdfFilename(doc.code, type)}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
