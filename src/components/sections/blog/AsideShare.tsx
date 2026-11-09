"use client";

import type { ReactNode } from "react";
import { postPageCopy } from "@/content/posts";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "./ArticleIcons";

type Target = { label: string; icon: ReactNode; url: (u: string, t: string) => string };

const targets: Target[] = [
  {
    label: "Chia sẻ qua LinkedIn",
    icon: <LinkedinIcon />,
    url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  {
    label: "Chia sẻ qua Facebook",
    icon: <FacebookIcon />,
    url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  {
    label: "Chia sẻ qua Twitter",
    icon: <TwitterIcon />,
    url: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
  },
];

/** Thẻ "Chia sẻ bài viết" — mở cửa sổ chia sẻ với URL trang hiện tại. */
export function AsideShare({ title }: { title: string }) {
  const a = postPageCopy.aside;

  function share(build: Target["url"]) {
    const href = build(encodeURIComponent(window.location.href), encodeURIComponent(title));
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=560");
  }

  return (
    <div className="lh-article-aside__card">
      <h3 className="lh-article-aside__title">{a.shareTitle}</h3>
      <p className="lh-article-aside__desc">{a.shareDesc}</p>
      <div className="lh-article-aside__share-row">
        {targets.map((t) => (
          <button
            key={t.label}
            type="button"
            aria-label={t.label}
            className="lh-article-aside__share-btn"
            onClick={() => share(t.url)}
          >
            {t.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
