import { Fragment, type ReactNode } from "react";

/** "Chữ *nghiêng* thường" → Chữ <em>nghiêng</em> thường. */
export function rich(text: string): ReactNode {
  return text.split("*").map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}

