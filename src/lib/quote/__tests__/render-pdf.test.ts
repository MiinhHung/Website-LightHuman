import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildQuoteDocument } from "../build-quote-document";
import { renderQuotePdf } from "../pdf/render";
import type { QuoteType } from "../classify";
import type { QuoteSnapshot } from "../snapshot";
import { MASS_SAMPLE_FEES, MASS_SAMPLE_WARRANTY, filledHuntFees, makeLine, makeSnapshot } from "./fixtures";

// QUOTE_WRITE_SAMPLES=1 npx vitest run render-pdf → tmp/quote-samples/*.pdf (gitignored)
const WRITE_SAMPLES = process.env.QUOTE_WRITE_SAMPLES === "1";
const SAMPLE_DIR = path.join(process.cwd(), "tmp", "quote-samples");

const huntLine = (position: string) =>
  makeLine({ type: "hunt", position, industries: ["CNTT", "TAI_CHINH"], languages: ["NHAT"], experience: "OVER_3" });

const CASES: { name: string; type: QuoteType; snapshot: QuoteSnapshot }[] = [
  { name: "mass-draft", type: "mass", snapshot: makeSnapshot() },
  {
    name: "mass-filled-like-example",
    type: "mass",
    snapshot: makeSnapshot({ warrantyPct: MASS_SAMPLE_WARRANTY, lines: [makeLine({ fees: MASS_SAMPLE_FEES })] }),
  },
  {
    name: "mass-5-positions-discount",
    type: "mass",
    snapshot: makeSnapshot({
      discount: { pct: null, capPerCandidate: null },
      lines: [
        makeLine({ position: "Công nhân lắp ráp linh kiện điện tử", quantity: 120, industries: ["SAN_XUAT"] }),
        makeLine({ position: "Nhân viên kho", quantity: 25, industries: ["VAN_TAI", "TMDT"] }),
        makeLine({ position: "Telesale tài chính", quantity: 8 }),
        makeLine({ position: "Phục vụ nhà hàng", quantity: 40, industries: ["NHA_HANG_KHACH_SAN"] }),
        makeLine({
          position: "Nhân viên chăm sóc khách hàng tổng đài ca xoay, làm việc tại trung tâm BPO quận 7",
          quantity: 60,
          industries: ["BPO"],
        }),
      ],
    }),
  },
  { name: "hunt-draft", type: "hunt", snapshot: makeSnapshot({ lines: [huntLine("Trưởng phòng Công nghệ thông tin")] }) },
  {
    name: "hunt-filled-3-positions",
    type: "hunt",
    snapshot: makeSnapshot({
      warrantyPct: MASS_SAMPLE_WARRANTY,
      lines: ["Kế toán trưởng", "Kỹ sư phần mềm", "Giám đốc tài chính"].map((p) => ({
        ...huntLine(p),
        fees: filledHuntFees(),
      })),
    }),
  },
];

describe("renderQuotePdf (smoke)", () => {
  if (WRITE_SAMPLES) mkdirSync(SAMPLE_DIR, { recursive: true });

  it.each(CASES)("$name renders a PDF buffer", async ({ name, type, snapshot }) => {
    const doc = buildQuoteDocument(snapshot, type);
    expect(doc).not.toBeNull();
    const pdf = await renderQuotePdf(doc!);
    expect(pdf.subarray(0, 4).toString("latin1")).toBe("%PDF");
    // Fonts are subset-embedded; a broken render is tiny, a runaway one is huge.
    expect(pdf.length).toBeGreaterThan(10_000);
    expect(pdf.length).toBeLessThan(2_000_000);
    if (WRITE_SAMPLES) writeFileSync(path.join(SAMPLE_DIR, `${name}.pdf`), pdf);
  }, 60_000);
});
