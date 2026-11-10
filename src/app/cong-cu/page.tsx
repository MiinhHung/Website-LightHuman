import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calculator, Lightbulb, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

const TOOL_ICONS: Record<string, LucideIcon> = {
  "tinh-luong-gross-net": Calculator,
  "tinh-lai-kep": TrendingUp,
};
import { tools, toolsHub } from "@/content/tools";
import { ToolHero } from "@/components/tools/ToolHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { quoteHref, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Công cụ nhân sự",
  description: toolsHub.lede,
};

export default function ToolsHubPage() {
  return (
    <div className="lht-page">
      <ToolHero
        crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ" }]}
        eyebrow={toolsHub.eyebrow}
        title={
          <>
            {toolsHub.title} <em>{toolsHub.titleEm}</em>
          </>
        }
        lede={toolsHub.lede}
        image={toolsHub.image}
        badge={
          <div className="lht-hero__note">
            <span className="lht-hero__note-icon" aria-hidden="true">
              <Sparkles size={18} strokeWidth={1.75} />
            </span>
            <div>
              <strong>{toolsHub.badge.title}</strong>
              <p>{toolsHub.badge.body}</p>
            </div>
          </div>
        }
      />
      <section className="lh-section">
        <div className="lh-container">
          <ul className="lht-tools">
            {tools.map((t) => {
              const Icon = TOOL_ICONS[t.slug] ?? Calculator;
              return (
              <li key={t.slug}>
                <Link href={`/cong-cu/${t.slug}`} className="lht-tool">
                  <span className="lht-tool__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <span className="lht-tool__tag">{t.tag}</span>
                  <h2 className="lht-tool__name">{t.name}</h2>
                  <p className="lht-tool__desc">{t.desc}</p>
                  <span className="lht-tool__meta">{t.forWho}</span>
                  <span className="lht-tool__go">
                    Mở công cụ <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              </li>
              );
            })}
            <li>
              <Link href="/lien-he" className="lht-tool lht-tool--suggest">
                <span className="lht-tool__icon" aria-hidden="true">
                  <Lightbulb size={22} strokeWidth={1.75} />
                </span>
                <h2 className="lht-tool__name">{toolsHub.suggest.title}</h2>
                <p className="lht-tool__desc">{toolsHub.suggest.body}</p>
                <span className="lht-tool__go">
                  {toolsHub.suggest.cta} <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <ClosingCta
        heading="Cần tuyển người cho vị trí vừa tính lương?"
        desc="Chọn vị trí và yêu cầu ứng viên để nhận báo giá tuyển dụng. Đội BD liên hệ lại trong 24 giờ làm việc."
        action={{ label: "Nhận báo giá", href: quoteHref }}
        secondary={{ label: "Bạn đang tìm việc? Xem việc làm", href: site.jobsUrl }}
      />
    </div>
  );
}
