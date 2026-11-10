/**
 * Pure view-model: snapshot → fully resolved document structure (texts, table
 * columns, merged cells, draft flag). PDF components only render this; no
 * business logic lives in them.
 */

import { QUOTE_COMPANY } from "@/content/quote/company";
import { DOCUMENT_TEXT as T, EMPTY_CELL } from "@/content/quote/documentText";
import { TABLE_LAYOUT, type PeriodColumn } from "@/content/quote/tableLayout";
import type { QuoteType } from "./classify";
import { isPricingComplete, type FeeCellValue, type QuoteSnapshot, type SnapshotLine } from "./snapshot";

// ---- Model -------------------------------------------------------------------

export type CellTone = "normal" | "condition";

export type Cell = { readonly lines: readonly string[]; readonly tone?: CellTone };

/**
 * - "group": one cell per position, spanning all its sub-rows (STT, Vị trí…).
 * - "row":   one cell per sub-row.
 * - "table": one cell spanning the whole table body.
 */
export type ColumnSpan = "group" | "row" | "table";

export type TableColumn = {
  readonly key: string;
  readonly header: string;
  /** Header group label; contiguous columns with the same label share a header cell. */
  readonly group: string | null;
  /** Relative width; the renderer normalises weights to the table width. */
  readonly weight: number;
  readonly span: ColumnSpan;
};

export type TableGroup = {
  readonly cells: Readonly<Record<string, Cell>>;
  readonly rows: readonly Readonly<Record<string, Cell>>[];
};

export type TableModel = {
  readonly banner: string;
  /** Percentage of the content width. */
  readonly widthPct: number;
  readonly columns: readonly TableColumn[];
  readonly groups: readonly TableGroup[];
  readonly tableCells: Readonly<Record<string, Cell>>;
  /** Minimum text lines per sub-row, so sibling stacks of sub-rows stay aligned. */
  readonly minRowLines: number;
};

export type HeaderField = { readonly label: string; readonly value: string };

export type QuoteDocument = {
  readonly type: QuoteType;
  readonly code: string;
  readonly title: string;
  readonly header: {
    readonly left: readonly HeaderField[];
    readonly right: readonly HeaderField[];
    readonly date: HeaderField;
  };
  readonly unitNote: string;
  readonly plan1: {
    readonly title: string;
    readonly subtitle: string;
    readonly fee: TableModel;
    readonly warranty: TableModel;
    readonly discountLine: string;
  };
  readonly plan2: {
    readonly title: string;
    readonly subtitle: string;
    readonly fee: TableModel;
    readonly footnote: string;
  };
  readonly minimumFee: {
    readonly title: string;
    readonly rule: string;
    readonly floors: readonly string[];
  } | null;
  readonly surcharges: {
    readonly title: string;
    readonly positions: readonly {
      readonly position: string;
      readonly items: readonly string[];
      readonly afterSurcharge: string;
    }[];
  };
  readonly notes: { readonly title: string; readonly items: readonly string[] };
  readonly footer: {
    readonly website: string;
    readonly email: string;
    readonly address: string;
    readonly pageLabel: string;
  };
  readonly draft: boolean;
  readonly watermark: string;
};

export type DraftMarkMode = "auto" | "off";

export type BuildOptions = { readonly draftMark?: DraftMarkMode };

// ---- Formatting ----------------------------------------------------------------

const vndFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export function formatVnd(amount: number | null): string {
  return amount === null || !Number.isFinite(amount) ? EMPTY_CELL : `${vndFormat.format(amount)} đ`;
}

/** Plain grouped number, for sentences that already say "VNĐ". */
export function formatAmount(amount: number | null): string {
  return amount === null || !Number.isFinite(amount) ? EMPTY_CELL : vndFormat.format(amount);
}

export function formatPct(pct: number | null): string {
  return pct === null || !Number.isFinite(pct) ? EMPTY_CELL : `${pct}%`;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** dd/MM/yyyy in Vietnam time. */
export function formatQuoteDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

export function parseDraftMark(raw: string | undefined): DraftMarkMode {
  return raw?.trim().toLowerCase() === "off" ? "off" : "auto";
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}

function orEmpty(s: string): string {
  return s.trim() === "" ? EMPTY_CELL : s;
}

function feeCell(value: FeeCellValue | undefined): Cell {
  if (!value) return { lines: [EMPTY_CELL] };
  if (value.kind === "vnd") return { lines: [formatVnd(value.amount)] };
  return {
    lines: [
      fill(T.salaryFee.multiple, {
        m: value.multiplier === null ? EMPTY_CELL : String(value.multiplier),
      }),
      T.salaryFee.minimum,
      formatVnd(value.minFee),
    ],
  };
}

// ---- Tables --------------------------------------------------------------------

const W = { index: 5, position: 16, quantity: 8, fees: 46, discount: 10, eligibility: 25 } as const;

function leadingColumns(): TableColumn[] {
  return [
    { key: "index", header: T.columns.index, group: null, weight: W.index, span: "group" },
    { key: "position", header: T.columns.position, group: null, weight: W.position, span: "group" },
    { key: "quantity", header: T.columns.quantity, group: null, weight: W.quantity, span: "group" },
  ];
}

function leadingCells(line: SnapshotLine, i: number): Record<string, Cell> {
  return {
    index: { lines: [String(i + 1)] },
    position: { lines: [line.position] },
    quantity: { lines: [String(line.quantity)] },
  };
}

function feeColumns(cols: readonly PeriodColumn[], group: string | null, total: number): TableColumn[] {
  return cols.map((c) => ({
    key: `fee-${c.key}`,
    header: c.label,
    group,
    weight: total / cols.length,
    span: "row" as const,
  }));
}

function maxLines(groups: readonly TableGroup[]): number {
  let max = 1;
  for (const g of groups) for (const r of g.rows) for (const c of Object.values(r)) max = Math.max(max, c.lines.length);
  return max;
}

function buildPlan1Table(type: QuoteType, lines: readonly SnapshotLine[]): TableModel {
  const layout = TABLE_LAYOUT[type].plan1;
  const fees = feeColumns(layout.feeColumns, layout.feeGroupLabel, W.fees);
  const groups: TableGroup[] = lines.map((line, i) => ({
    cells: leadingCells(line, i),
    rows: [Object.fromEntries(fees.map((col, c) => [col.key, feeCell(line.fees.plan1[c])]))],
  }));
  return {
    banner: T.banners.fee,
    widthPct: 100,
    columns: [
      ...leadingColumns(),
      ...fees,
      { key: "eligibility", header: T.columns.eligibility, group: null, weight: W.eligibility, span: "table" },
    ],
    groups,
    tableCells: { eligibility: { lines: [layout.eligibility], tone: "condition" } },
    minRowLines: maxLines(groups),
  };
}

function buildWarrantyTable(type: QuoteType, pcts: readonly (number | null)[]): TableModel {
  const layout = TABLE_LAYOUT[type].warranty;
  const groups: TableGroup[] = layout.rows.map((row, i) => {
    const pct = pcts[i] ?? null;
    return {
      cells: {},
      rows: [
        {
          index: { lines: [String(i + 1)] },
          period: { lines: [row.label] },
          fee: { lines: [pct === null ? EMPTY_CELL : `${formatPct(pct)}${layout.pctSuffix}`] },
        },
      ],
    };
  });
  return {
    banner: T.banners.warranty,
    widthPct: 63,
    columns: [
      { key: "index", header: T.columns.index, group: null, weight: 8, span: "row" },
      { key: "period", header: T.columns.warrantyPeriod, group: null, weight: 24, span: "row" },
      { key: "fee", header: layout.feeHeader, group: null, weight: 18, span: "row" },
      { key: "anchor", header: T.columns.warrantyAnchor, group: null, weight: 25, span: "table" },
      { key: "success", header: T.columns.warrantySuccess, group: null, weight: 25, span: "table" },
    ],
    groups,
    tableCells: {
      anchor: { lines: [layout.anchor] },
      success: { lines: [layout.success] },
    },
    minRowLines: 1,
  };
}

function buildPlan2Table(
  type: QuoteType,
  lines: readonly SnapshotLine[],
  discount: QuoteSnapshot["discount"],
): TableModel {
  const layout = TABLE_LAYOUT[type].plan2;
  const hasDiscount = discount !== null;
  const fees = feeColumns(layout.feeColumns, layout.feeGroupLabel, hasDiscount ? W.fees - W.discount : W.fees);
  const discountCell: Cell | null = hasDiscount
    ? {
        lines: [
          fill(T.discount.cell, {
            pct: formatPct(discount.pct),
            cap: formatVnd(discount.capPerCandidate),
          }),
        ],
      }
    : null;

  const groups: TableGroup[] = lines.map((line, i) => ({
    cells: discountCell ? { ...leadingCells(line, i), discount: discountCell } : leadingCells(line, i),
    rows: layout.tiers.map((tier, t) => ({
      ...Object.fromEntries(fees.map((col, c) => [col.key, feeCell(line.fees.plan2[t]?.[c])])),
      eligibility: { lines: [tier] },
    })),
  }));

  const columns: TableColumn[] = [...leadingColumns(), ...fees];
  if (hasDiscount) {
    columns.push({ key: "discount", header: T.columns.discount, group: null, weight: W.discount, span: "group" });
  }
  columns.push({ key: "eligibility", header: T.columns.eligibility, group: null, weight: W.eligibility, span: "row" });

  return {
    banner: T.banners.fee,
    widthPct: 100,
    columns,
    groups,
    tableCells: {},
    // Tier labels wrap to two lines in the eligibility column.
    minRowLines: Math.max(2, maxLines(groups)),
  };
}

// ---- Document ------------------------------------------------------------------

export function buildQuoteDocument(
  snapshot: QuoteSnapshot,
  type: QuoteType,
  options: BuildOptions = {},
): QuoteDocument | null {
  const lines = snapshot.lines.filter((l) => l.type === type);
  if (lines.length === 0) return null;

  const layout = TABLE_LAYOUT[type];
  const owner = QUOTE_COMPANY.owner;
  const discountPct = snapshot.discount === null ? "0%" : formatPct(snapshot.discount.pct);

  return {
    type,
    code: snapshot.code,
    title: T.title,
    header: {
      left: [
        { label: T.header.customer, value: orEmpty(snapshot.contact.company) },
        { label: T.header.recipient, value: orEmpty(snapshot.contact.name) },
        { label: T.header.mail, value: orEmpty(snapshot.contact.email) },
      ],
      right: [
        { label: T.header.owner, value: orEmpty(owner.name) },
        { label: T.header.phone, value: orEmpty(owner.phone) },
        { label: T.header.mail, value: orEmpty(owner.email) },
      ],
      date: { label: T.header.date, value: formatQuoteDate(snapshot.createdAt) },
    },
    unitNote: T.unitNote,
    plan1: {
      title: T.plan1.title,
      subtitle: layout.plan1.subtitle,
      fee: buildPlan1Table(type, lines),
      warranty: buildWarrantyTable(type, snapshot.warrantyPct[type]),
      discountLine: fill(T.discount.line, { pct: discountPct }),
    },
    plan2: {
      title: T.plan2.title,
      subtitle: T.plan2.subtitle,
      fee: buildPlan2Table(type, lines, snapshot.discount),
      footnote: T.plan2.footnote,
    },
    minimumFee: layout.showMinimumFee
      ? {
          title: T.minimumFee.title,
          rule: T.minimumFee.rule,
          floors: lines.map((l) => {
            const text = fill(T.minimumFee.floor, {
              below: formatAmount(l.fees.floor?.below ?? null),
              charge: formatAmount(l.fees.floor?.charge ?? null),
            });
            return lines.length > 1 ? `${l.position}: ${text}` : text;
          }),
        }
      : null,
    surcharges: {
      title: T.surcharges.title,
      positions: lines.map((l) => ({
        position: l.position,
        items:
          l.surcharges.length === 0
            ? [T.surcharges.none]
            : l.surcharges.map((s) => `${s.label}: +${formatPct(s.pct)}`),
        afterSurcharge: `${T.surcharges.afterSurcharge} ${EMPTY_CELL}`,
      })),
    },
    notes: { title: T.notes.title, items: T.notes.items },
    footer: {
      website: QUOTE_COMPANY.website,
      email: QUOTE_COMPANY.email,
      address: QUOTE_COMPANY.footerAddress,
      pageLabel: T.pageLabel,
    },
    draft: options.draftMark !== "off" && !isPricingComplete(snapshot, type),
    watermark: T.watermark,
  };
}
