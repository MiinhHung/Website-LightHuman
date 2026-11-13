import imgMap from "@/content/mk/img-map.json";
import imgDims from "@/content/mk/img-dims.json";

/**
 * Helpers for the components ported from the approved static mock
 * (E:/ClaudeMD/website/LightHuman, tools/build.js). Same rules as its build step.
 */

const MAP = imgMap as Record<string, string>;
const DIMS = imgDims as unknown as Record<string, [number, number]>;

/** CMS image URL → local webp copy in /public/img (falls back to the CMS URL). */
export function imgSrc(url: string | undefined | null): string {
  if (!url) return "";
  return MAP[url] ?? url;
}

export function imgSize(src: string): [number, number] | undefined {
  return DIMS[src];
}

// Copy edits the mock applies to every content string (README "Copy đã chỉnh"); not to client quotes or article bodies.
const COPY_FIX: [RegExp, string][] = [
  [/Đồng hành cùng/g, "Làm việc cùng"],
  [/đồng hành cùng/g, "làm việc cùng"],
  [/headhunting hàng đầu Việt Nam/g, "headhunting tại Việt Nam"],
  [/ngân hàng TMCP hàng đầu Việt Nam/g, "ngân hàng TMCP tại Việt Nam"],
  [/ & /g, " và "],
  [/giải pháp tối ưu/g, "giải pháp phù hợp"],
  [/dẫn đầu xu hướng phát triển/gi, "phát triển nhanh"],
];

export function fixCopy(text: string): string {
  const dashed = text.replace(/\s?[–—]\s?/g, (m) => (m.trim() === m ? "-" : " - "));
  return COPY_FIX.reduce((acc, [re, to]) => acc.replace(re, to), dashed);
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** "Chữ *nghiêng*" → segments; `em` marks the starred parts. */
export function richParts(text: string): { text: string; em: boolean }[] {
  return text.split("*").map((t, i) => ({ text: t, em: i % 2 === 1 })).filter((p) => p.text);
}
