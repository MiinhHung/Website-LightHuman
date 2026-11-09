import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/gioi-thieu", "/dich-vu", "/case-studies", "/tin-tuc", "/lien-he"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...services.map((s) => ({ url: `${site.url}/dich-vu/${s.slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
  ];
}
