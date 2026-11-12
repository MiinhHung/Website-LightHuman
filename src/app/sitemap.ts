import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/dich-vu/gioi-thieu",
    "/cau-chuyen",
    "/dich-vu",
    "/case-studies",
    "/tin-tuc",
    "/lien-he",
    "/cong-cu",
    "/cong-cu/tinh-luong-gross-net",
    "/cong-cu/tinh-thue-thu-nhap-ca-nhan",
    "/cong-cu/tinh-lai-kep",
    "/en",
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...services.map((s) => ({ url: `${site.url}/dich-vu/${s.slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
  ];
}
