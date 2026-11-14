import type { QuoteType } from "./quote";

export type FeeKind = "vnd" | "salary";

export type PeriodColumn = {
  readonly key: string;
  readonly label: string;
};

export type TypeLayout = {
  readonly unitHeader: string;
  readonly periodColumns: readonly PeriodColumn[];
  readonly showMinimum: boolean;
  readonly feeUnitLabel: string;
};

export type TableLayout = Record<QuoteType, TypeLayout>;

export type QuoteOwner = {
  readonly companyName: string;
  readonly brandName: string;
  readonly legalName: string;
  readonly taxCode: string;
  readonly address: string;
  readonly phone: string;
  readonly email: string;
  readonly website: string;
  readonly representative: string;
  readonly role: string;
};
