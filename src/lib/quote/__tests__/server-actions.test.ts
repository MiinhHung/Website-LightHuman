import { describe, expect, it } from "vitest";
import * as quoteAction from "@/app/lien-he/quote-action";

// Next.js rejects a "use server" module that exports anything but async
// functions ("A 'use server' file can only export async functions").
describe('"use server" modules', () => {
  it("quote-action exports only async functions", () => {
    for (const [name, value] of Object.entries(quoteAction)) {
      expect(typeof value, name).toBe("function");
      expect((value as () => unknown).constructor.name, name).toBe("AsyncFunction");
    }
  });
});
