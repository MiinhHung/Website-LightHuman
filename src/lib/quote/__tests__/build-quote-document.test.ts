import { describe, expect, it } from "vitest";
import { EMPTY_CELL } from "@/content/quote/documentText";
import {
  buildQuoteDocument,
  formatQuoteDate,
  formatVnd,
  parseDraftMark,
  type QuoteDocument,
  type TableModel,
} from "../build-quote-document";
import { computeSurcharges } from "../surcharges";
import {
  MASS_SAMPLE_FEES,
  MASS_SAMPLE_WARRANTY,
  filledHuntFees,
  makeLine,
  makeSnapshot,
} from "./fixtures";

function build(...args: Parameters<typeof buildQuoteDocument>): QuoteDocument {
  const doc = buildQuoteDocument(...args);
  if (!doc) throw new Error("expected a document");
  return doc;
}

function headers(t: TableModel, span?: string) {
  return t.columns.filter((c) => !span || c.span === span).map((c) => c.header);
}

function allCellText(t: TableModel): string[] {
  const out: string[] = [];
  for (const g of t.groups) {
    for (const c of Object.values(g.cells)) out.push(...c.lines);
    for (const r of g.rows) for (const c of Object.values(r)) out.push(...c.lines);
  }
  return out;
}

describe("buildQuoteDocument — layout", () => {
  it("Mass: plan 1 has 3/7/14/30 ngày, warranty 3/7/14, plan 2 has 7/14/30 with 3 tiers", () => {
    const doc = build(makeSnapshot(), "mass");
    expect(headers(doc.plan1.fee, "row")).toEqual(["3 ngày", "7 ngày", "14 ngày", "30 ngày"]);
    expect(doc.plan1.fee.columns.find((c) => c.span === "row")?.group).toBe("Phí/ứng viên");
    expect(doc.plan1.warranty.groups.map((g) => g.rows[0].period.lines[0])).toEqual([
      "3 ngày",
      "7 ngày",
      "14 ngày",
    ]);
    expect(headers(doc.plan2.fee).slice(3, 6)).toEqual(["7 ngày", "14 ngày", "30 ngày"]);
    expect(doc.plan2.fee.groups[0].rows.map((r) => r.eligibility.lines[0])).toEqual([
      "Ngay khi ứng viên on-board",
      "Ngay khi ứng viên on-board đủ 3 ngày",
      "Ngay khi ứng viên on-board đủ 7 ngày",
    ]);
    expect(doc.minimumFee).toBeNull();
  });

  it("Hunt: plan 1 single 30-day column, warranty 15/30/60, plan 2 30/60/90/120, minimum-fee block", () => {
    const doc = build(makeSnapshot({ lines: [makeLine({ type: "hunt" })] }), "hunt");
    expect(headers(doc.plan1.fee, "row")).toEqual(["Phí/Ứng viên"]);
    expect(doc.plan1.fee.tableCells.eligibility.lines[0]).toBe("Ngay khi ứng viên on-board đủ 30 ngày");
    expect(doc.plan1.warranty.groups.map((g) => g.rows[0].period.lines[0])).toEqual([
      "15 ngày",
      "30 ngày",
      "60 ngày",
    ]);
    expect(headers(doc.plan2.fee, "row").slice(0, 4)).toEqual(["30 ngày", "60 ngày", "90 ngày", "120 ngày"]);
    expect(doc.plan2.fee.groups[0].rows).toHaveLength(3);
    expect(doc.minimumFee?.floors).toEqual([`Mức sàn: nếu kết quả thấp hơn ${EMPTY_CELL} VNĐ thì tính ${EMPTY_CELL} VNĐ/ứng viên`]);
  });

  it("returns null when the snapshot has no line of that type", () => {
    expect(buildQuoteDocument(makeSnapshot(), "hunt")).toBeNull();
  });

  it("renders one group per position and only lines of the requested type", () => {
    const snapshot = makeSnapshot({
      lines: [
        makeLine({ position: "Công nhân" }),
        makeLine({ type: "hunt", position: "Trưởng phòng" }),
        makeLine({ position: "Kho vận" }),
      ],
    });
    const doc = build(snapshot, "mass");
    expect(doc.plan1.fee.groups.map((g) => g.cells.position.lines[0])).toEqual(["Công nhân", "Kho vận"]);
    expect(doc.plan1.fee.groups.map((g) => g.cells.index.lines[0])).toEqual(["1", "2"]);
    expect(doc.plan2.fee.groups).toHaveLength(2);
    expect(doc.surcharges.positions.map((p) => p.position)).toEqual(["Công nhân", "Kho vận"]);
  });
});

describe("buildQuoteDocument — empty cells and draft flag", () => {
  it("renders every null amount as EMPTY_CELL and never 0/NaN/null", () => {
    for (const type of ["mass", "hunt"] as const) {
      const doc = build(makeSnapshot({ lines: [makeLine({ type })] }), type);
      const text = [doc.plan1.fee, doc.plan1.warranty, doc.plan2.fee].flatMap(allCellText).join("|");
      expect(text).toContain(EMPTY_CELL);
      expect(text).not.toMatch(/\bNaN\b|\bnull\b|\bundefined\b|(^|\|)0( đ)?(\||$)/);
    }
  });

  it("is a draft when any value is null and not when all are filled", () => {
    expect(build(makeSnapshot(), "mass").draft).toBe(true);
    const filled = makeSnapshot({ warrantyPct: MASS_SAMPLE_WARRANTY, lines: [makeLine({ fees: MASS_SAMPLE_FEES })] });
    expect(build(filled, "mass").draft).toBe(false);
  });

  it("Hunt is complete only when the floor is filled too", () => {
    const huntFilled = makeSnapshot({
      warrantyPct: MASS_SAMPLE_WARRANTY,
      lines: [makeLine({ type: "hunt", fees: filledHuntFees() })],
    });
    expect(build(huntFilled, "hunt").draft).toBe(false);
    const noFloor = makeSnapshot({
      warrantyPct: MASS_SAMPLE_WARRANTY,
      lines: [makeLine({ type: "hunt", fees: { ...filledHuntFees(), floor: { below: null, charge: 1 } } })],
    });
    expect(build(noFloor, "hunt").draft).toBe(true);
  });

  it("draftMark=off suppresses the watermark", () => {
    expect(build(makeSnapshot(), "mass", { draftMark: "off" }).draft).toBe(false);
    expect(parseDraftMark(undefined)).toBe("auto");
    expect(parseDraftMark(" OFF ")).toBe("off");
    expect(parseDraftMark("anything")).toBe("auto");
  });

  it("formats filled amounts like the template", () => {
    const doc = build(
      makeSnapshot({ warrantyPct: MASS_SAMPLE_WARRANTY, lines: [makeLine({ fees: MASS_SAMPLE_FEES })] }),
      "mass",
    );
    expect(doc.plan1.fee.groups[0].rows[0]["fee-d3"].lines[0]).toBe("3.690.000 đ");
    expect(doc.plan1.warranty.groups[2].rows[0].fee.lines[0]).toBe("50%");
    expect(formatVnd(null)).toBe(EMPTY_CELL);
    expect(formatVnd(Number.NaN)).toBe(EMPTY_CELL);
  });

  it("Hunt salary cells keep their three-line structure while empty", () => {
    const doc = build(makeSnapshot({ lines: [makeLine({ type: "hunt" })] }), "hunt");
    expect(doc.plan1.fee.groups[0].rows[0]["fee-d30"].lines).toEqual([
      `${EMPTY_CELL} x tháng lương gross`,
      "Phí tối thiểu:",
      EMPTY_CELL,
    ]);
    expect(doc.plan1.fee.minRowLines).toBe(3);
  });
});

describe("buildQuoteDocument — discount", () => {
  it("no program: 0% line and no discount column", () => {
    const doc = build(makeSnapshot(), "mass");
    expect(doc.plan1.discountLine).toBe("Chương trình chiết khấu: 0% phí dịch vụ/ứng viên");
    expect(doc.plan2.fee.columns.some((c) => c.key === "discount")).toBe(false);
  });

  it("program with null numbers: shows the column, stays a draft", () => {
    const snapshot = makeSnapshot({
      discount: { pct: null, capPerCandidate: null },
      warrantyPct: MASS_SAMPLE_WARRANTY,
      lines: [makeLine({ fees: MASS_SAMPLE_FEES })],
    });
    const doc = build(snapshot, "mass");
    const discount = doc.plan2.fee.columns.find((c) => c.key === "discount");
    expect(discount?.span).toBe("group");
    expect(doc.plan2.fee.groups[0].cells.discount.lines[0]).toBe(`${EMPTY_CELL}, tối đa ${EMPTY_CELL}/ứng viên`);
    expect(doc.plan1.discountLine).toBe(`Chương trình chiết khấu: ${EMPTY_CELL} phí dịch vụ/ứng viên`);
    expect(doc.draft).toBe(true);
    const weights = doc.plan2.fee.columns.reduce((s, c) => s + c.weight, 0);
    expect(weights).toBeCloseTo(100);
  });

  it("filled program renders like the Hunt sheet example", () => {
    const doc = build(makeSnapshot({ discount: { pct: 25, capPerCandidate: 1_000_000 } }), "mass");
    expect(doc.plan2.fee.groups[0].cells.discount.lines[0]).toBe("25%, tối đa 1.000.000 đ/ứng viên");
  });
});

describe("buildQuoteDocument — header", () => {
  it("formats the quote date in Asia/Ho_Chi_Minh", () => {
    // 17:30 UTC on 9 Nov is already 10 Nov in Vietnam (UTC+7).
    expect(formatQuoteDate("2026-11-09T17:30:00.000Z")).toBe("10/11/2026");
    expect(formatQuoteDate("2026-11-09T16:59:59.000Z")).toBe("09/11/2026");
    const doc = build(makeSnapshot({ createdAt: "2026-11-09T17:30:00.000Z" }), "mass");
    expect(doc.header.date).toEqual({ label: "Ngày báo phí:", value: "10/11/2026" });
  });

  it("maps contact to the left column and shows — for empty owner/email", () => {
    const doc = build(makeSnapshot({ contact: { name: "Ms. May", company: "HD SAIGON", email: "", phone: "0901" } }), "mass");
    expect(doc.header.left.map((f) => f.value)).toEqual(["HD SAIGON", "Ms. May", EMPTY_CELL]);
    expect(doc.header.right.map((f) => f.value)).toEqual([EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]);
  });
});

describe("computeSurcharges", () => {
  const base = { type: "mass" as const, industries: [] as never[], languages: [] as never[] };

  it.each([
    [1, 8],
    [9, 8],
    [10, 5],
    [49, 5],
  ])("Mass quantity %i → +%i%%", (quantity, pct) => {
    expect(computeSurcharges({ ...base, quantity })).toEqual([expect.objectContaining({ pct })]);
  });

  it("Mass ≥ 50 has no quantity surcharge; Hunt never has one", () => {
    expect(computeSurcharges({ ...base, quantity: 50 })).toEqual([]);
    expect(computeSurcharges({ ...base, type: "hunt", quantity: 1 })).toEqual([]);
  });

  it("industry groups: +10% and +15%, listing each hit group once", () => {
    const out = computeSurcharges({
      type: "hunt",
      quantity: 1,
      industries: ["SAN_XUAT", "GIAO_DUC", "CNTT"],
      languages: [],
    });
    expect(out).toEqual([
      { id: "industry-10", label: "Chuyên ngành (Sản xuất, Giáo dục)", pct: 10 },
      { id: "industry-15", label: "Chuyên ngành (CNTT)", pct: 15 },
    ]);
  });

  it("any language triggers +15%", () => {
    const out = computeSurcharges({ type: "hunt", quantity: 1, industries: [], languages: ["HAN", "NHAT"] });
    expect(out).toEqual([{ id: "language", label: "Ngôn ngữ (Hàn, Nhật)", pct: 15 }]);
  });

  it("surcharge block shows 'none' text and an empty after-surcharge line", () => {
    const doc = build(
      makeSnapshot({ lines: [makeLine({ quantity: 60, industries: [], surcharges: [] })] }),
      "mass",
    );
    expect(doc.surcharges.positions[0].items).toEqual(["Không có phụ phí áp dụng."]);
    expect(doc.surcharges.positions[0].afterSurcharge).toBe(`Phí/ứng viên sau phụ phí: ${EMPTY_CELL}`);
    const withSurcharge = build(makeSnapshot(), "mass");
    expect(withSurcharge.surcharges.positions[0].items).toEqual([
      "Số lượng dưới 10 nhân sự: +8%",
      "Chuyên ngành (Tài chính): +15%",
    ]);
  });
});
