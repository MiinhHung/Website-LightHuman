/**
 * Discount program chosen by BD (never by the customer).
 *
 * `null` = no program: the PDF prints "Chương trình chiết khấu: 0% …" and hides
 * the discount column. Example from the Hunt sheet: 25%, capped at
 * 1.000.000 VND/candidate. All numbers stay null until BA confirms them.
 */

export type DiscountProgram = {
  readonly pct: number | null;
  readonly capPerCandidate: number | null;
};

export const ACTIVE_DISCOUNT: DiscountProgram | null = null;
