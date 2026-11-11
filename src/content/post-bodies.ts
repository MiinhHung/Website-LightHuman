import cmsBodies from "./generated/cms-bodies.json";
import { getPost } from "./posts";

/**
 * Article HTML for /blog/[slug]. Server-only by convention: the CMS bodies are ~1.7 MB,
 * so keep this module out of client components (they import posts.ts summaries instead).
 */
export function getPostBody(slug: string): string | undefined {
  return getPost(slug)?.bodyHtml ?? (cmsBodies as Record<string, string>)[slug];
}
