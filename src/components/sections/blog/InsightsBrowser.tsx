"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { insightsPage, posts } from "@/content/posts";
import { ReviewTile } from "@/components/sections/FeaturedPosts";
import { FilterBar } from "@/components/sections/case-studies/FilterBar";
import { Reveal } from "@/components/ui/Reveal";

const { allLabel, filters, featured } = insightsPage;
const options = [{ id: "all", label: allLabel }, ...filters.map((f) => ({ id: f, label: f }))];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

/** Bộ lọc chuyên mục + lưới "Bài viết nổi bật" của trang Insights. `query` lọc thêm theo từ khoá (từ ô tìm kiếm ở trang bài viết). */
export function InsightsBrowser({ query = "" }: { query?: string }) {
  const [active, setActive] = useState("all");
  const q = normalize(query.trim());
  const items = posts.filter(
    (p) =>
      (active === "all" || p.category === active) &&
      (!q || normalize(`${p.title} ${p.excerpt}`).includes(q)),
  );

  return (
    <>
      <FilterBar options={options} active={active} onChange={setActive} />
      <section className="lh-section lh-featured">
        <div className="lh-container">
          <div className="lh-featured__head">
            <div>
              <h2 className="lh-h2 lh-mt-md">{featured.title}</h2>
            </div>
          </div>
          {items.length > 0 ? (
            <div className="lh-featured__grid">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <ReviewTile post={p} lead={i === 0} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lh-lede">{featured.empty}</p>
          )}
        </div>
      </section>
    </>
  );
}

/** Bản đọc `?q=` từ URL — đặt trong <Suspense> (fallback: InsightsBrowser không có query). */
export function InsightsBrowserWithQuery() {
  const query = useSearchParams().get("q") ?? "";
  return <InsightsBrowser key={query} query={query} />;
}
