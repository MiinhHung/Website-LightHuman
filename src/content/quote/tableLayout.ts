/**
 * Column / milestone layout of the Mass and Hunt fee tables.
 *
 * Mass follows docs/quote-templates/mass-template.png and the filled example.
 * Hunt follows the spec's "BẢNG PHÍ DỊCH VỤ HUNT" sheet, which differs from
 * hunt-template.png (image: warranty 15/30, plan 2 30/60/90 and one row per position).
 * TODO(BA): chờ BD duyệt layout Hunt.
 */

import type { QuoteType } from "@/lib/quote/classify";

export type FeeKind = "vnd" | "salary";

export type PeriodColumn = { readonly key: string; readonly label: string };

export type TypeLayout = {
  /** "vnd": fixed amount per candidate. "salary": multiple of gross salary + minimum fee. */
  readonly feeKind: FeeKind;
  readonly plan1: {
    readonly subtitle: string;
    /** Null → the single fee column carries the label itself (Hunt image). */
    readonly feeGroupLabel: string | null;
    readonly feeColumns: readonly PeriodColumn[];
    readonly eligibility: string;
  };
  readonly warranty: {
    readonly feeHeader: string;
    /** Appended after the percentage, e.g. "0% Phí dịch vụ" on the Hunt template. */
    readonly pctSuffix: string;
    readonly rows: readonly PeriodColumn[];
    readonly anchor: string;
    readonly success: string;
  };
  readonly plan2: {
    readonly feeGroupLabel: string;
    readonly feeColumns: readonly PeriodColumn[];
    /** One sub-row per tier, all inside one position group. */
    readonly tiers: readonly string[];
  };
  /** Shows the "Phí dịch vụ tối thiểu" block (Hunt template). */
  readonly showMinimumFee: boolean;
};

const days = (n: number): PeriodColumn => ({ key: `d${n}`, label: `${n} ngày` });

const PLAN2_TIERS = [
  "Ngay khi ứng viên on-board",
  "Ngay khi ứng viên on-board đủ 3 ngày",
  "Ngay khi ứng viên on-board đủ 7 ngày",
] as const;

export const TABLE_LAYOUT: Record<QuoteType, TypeLayout> = {
  mass: {
    feeKind: "vnd",
    plan1: {
      subtitle: "(Nếu ứng viên nghỉ việc trước thời gian đủ điều kiện thì không tính phí dịch vụ)",
      feeGroupLabel: "Phí/ứng viên",
      feeColumns: [days(3), days(7), days(14), days(30)],
      eligibility: "Ngay khi ứng viên on-board đủ số ngày quy định",
    },
    warranty: {
      feeHeader: "Phụ phí thêm",
      pctSuffix: "",
      rows: [days(3), days(7), days(14)],
      anchor: "Ngay khi ứng viên on-board đủ số ngày quy định",
      success: "Ngay khi ứng viên thay thế on-board đủ số ngày quy định",
    },
    plan2: {
      feeGroupLabel: "BẢO HÀNH",
      feeColumns: [days(7), days(14), days(30)],
      tiers: PLAN2_TIERS,
    },
    showMinimumFee: false,
  },
  hunt: {
    feeKind: "salary",
    plan1: {
      subtitle: "(Nếu ứng viên nghỉ việc trước 30 ngày thì không tính phí dịch vụ)",
      feeGroupLabel: null,
      feeColumns: [{ key: "d30", label: "Phí/Ứng viên" }],
      eligibility: "Ngay khi ứng viên on-board đủ 30 ngày",
    },
    warranty: {
      feeHeader: "Phí",
      pctSuffix: " Phí dịch vụ",
      rows: [days(15), days(30), days(60)],
      anchor: "Ngay khi ứng viên on-board đủ 30 ngày",
      success: "Ngay khi ứng viên thay thế on-board đủ 30 ngày",
    },
    plan2: {
      feeGroupLabel: "Phí/Ứng viên",
      feeColumns: [days(30), days(60), days(90), days(120)],
      tiers: PLAN2_TIERS,
    },
    showMinimumFee: true,
  },
};
