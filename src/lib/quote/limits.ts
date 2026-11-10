// Kept free of zod so client components can import the limits cheaply.
export const QUANTITY_MAX = 10_000;
export const POSITION_MIN = 2;
export const POSITION_MAX = 100;
// Bounds the snapshot carried inside the PDF download token.
export const QUOTE_LINES_MAX = 5;
