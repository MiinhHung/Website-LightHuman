"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { postPageCopy } from "@/content/posts";
import { SearchIcon } from "./ArticleIcons";

/** Ô tìm kiếm ở sidebar — chuyển sang trang Insights đã lọc theo từ khoá (?q=). */
export function AsideSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/tin-tuc?q=${encodeURIComponent(term)}` : "/tin-tuc");
  }

  return (
    <form className="lh-article-aside__search" role="search" onSubmit={onSubmit}>
      <span className="lh-article-aside__search-icon" aria-hidden="true">
        <SearchIcon />
      </span>
      <input
        type="search"
        placeholder={postPageCopy.aside.searchPlaceholder}
        className="lh-article-aside__search-input"
        aria-label="Tìm kiếm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </form>
  );
}
