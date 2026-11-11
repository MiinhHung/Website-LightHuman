import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Ảnh nội dung lấy từ CMS của Light Human (giống site production).
    remotePatterns: [
      { protocol: "https", hostname: "blog.lighthuman.vn", pathname: "/uploads/**" },
      // Poster of the company film (site.introVideo).
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  // Fonts and logo are read from disk at request time by the quote PDF route.
  outputFileTracingIncludes: {
    "/api/quote/pdf": ["./src/lib/quote/pdf/fonts/*.ttf", "./src/lib/quote/pdf/assets/*"],
  },
  async redirects() {
    // Site gốc dùng cả /blog và /tin-tuc; gom về một nơi.
    return [
      { source: "/blog", destination: "/tin-tuc", permanent: true },
      // The About page moved under /dich-vu; keep old links and search results working.
      { source: "/gioi-thieu", destination: "/dich-vu/gioi-thieu", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
