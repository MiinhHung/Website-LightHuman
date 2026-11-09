import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Ảnh nội dung lấy từ CMS của Light Human (giống site production).
    remotePatterns: [{ protocol: "https", hostname: "blog.lighthuman.vn", pathname: "/uploads/**" }],
  },
  async redirects() {
    // Site gốc dùng cả /blog và /tin-tuc; gom về một nơi.
    return [{ source: "/blog", destination: "/tin-tuc", permanent: true }];
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
