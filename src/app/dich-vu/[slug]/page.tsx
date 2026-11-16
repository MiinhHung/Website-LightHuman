import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services, servicesMk } from "@/content/services";
import { quoteHref, site } from "@/content/site";
import { fixCopy } from "@/lib/mk";
import { Crumbs } from "@/components/mk/insights/parts";
import { Ico, MkImg } from "@/components/mk/ui";
import { QuoteCta } from "@/components/mk/home/HomeSections";
import { RelatedServices } from "@/components/mk/services/ServiceDetail";
import { FaqList } from "@/components/mk/services/parts";

export const instant = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const plain = (t: string) => fixCopy(t).replace(/\*/g, "").replace(/\n/g, " ");
// Two-line display titles ("Năng lực *khác biệt*\nTạo nên…") read as one clause in prose.
// A lowercase second line is a mid-phrase break ("Góc nhìn từ\nphía…"), not a second clause.
const headingText = (t: string) =>
  plain(t.replace(/\n(\S)/g, (_, c: string) => (c === c.toLowerCase() ? ` ${c}` : `, ${c.toLowerCase()}`)));
// hero.lede and description often restate the same sentence.
const sameStart = (a: string, b: string) => plain(a).slice(0, 40).toLowerCase() === plain(b).slice(0, 40).toLowerCase();

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return service
    ? {
        title: fixCopy(service.name),
        description: plain(service.description).slice(0, 160),
        openGraph: {
          type: "article",
          title: fixCopy(service.name),
          description: plain(service.description).slice(0, 160),
          images: [service.image],
        },
      }
    : {};
}

export default async function ServiceDetailPage({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const url = `${site.url}/dich-vu/${s.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.name,
        description: plain(s.description),
        serviceType: s.name,
        url,
        provider: { "@type": "EmploymentAgency", name: site.name, url: site.url },
        areaServed: "VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: servicesMk.crumbs.home, item: site.url },
          { name: servicesMk.crumbs.services, item: `${site.url}/dich-vu` },
          { name: s.name, item: url },
        ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
      },
    ],
  };

  const title = fixCopy(s.name);
  const headline = plain(s.hero.title);

  const toc: [string, string][] = [
    ["tong-quan", "Tổng quan giải pháp"],
    ...(s.scope ? ([["pham-vi", headingText(s.scope.title || "Phạm vi triển khai")]] as [string, string][]) : []),
    ["khac-biet", "Năng lực & Lợi thế"],
    ["quy-trinh", headingText(s.process.title || s.process.eyebrow || "Quy trình triển khai")],
    ...(s.cases.items.length > 0 ? ([["du-an", headingText(s.cases.title || "Dự án thực tế")]] as [string, string][]) : []),
    ...(s.faq.items.length > 0 ? ([["hoi-dap", "Câu hỏi thường gặp"]] as [string, string][]) : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="article" aria-labelledby="service-h1">
        {/* Header dạng bài viết */}
        <header className="article-head tone-navy">
          <div className="wrap-narrow">
            <Crumbs
              items={[
                { label: servicesMk.crumbs.home, href: "/" },
                { label: servicesMk.crumbs.services, href: "/dich-vu" },
                { label: title },
              ]}
            />
            <p className="kicker">{s.hero.eyebrow || "Dịch vụ nhân sự"}</p>
            <h1 className="h1 h1-article" id="service-h1" data-lines="">
              {title}: {headline}
            </h1>
            <p className="article-meta">
              Chuyên gia tư vấn Light Human · Cập nhật giải pháp 2026 · 5 phút đọc
            </p>
          </div>
        </header>

        {/* Ảnh bìa đại diện lớn */}
        <div className="article-cover wrap" data-clip-reveal="">
          <MkImg url={s.image} alt={title} eager sizes="(max-width: 1280px) 100vw, 1280px" />
        </div>

        {/* Thân bài viết với lưới mk-prose và mục lục TOC bên cạnh */}
        <div className="wrap article-grid">
          <div className="mk-prose">
            {/* Lời mở đầu & bối cảnh */}
            <div id="tong-quan">
              <p className="lede">{plain(s.hero.lede)}</p>
              {!sameStart(s.description, s.hero.lede) && <p>{plain(s.description)}</p>}
            </div>

            {/* 1. Phạm vi triển khai nếu có */}
            {s.scope && (
              <section id="pham-vi">
                <h2>{headingText(s.scope.title)}</h2>
                <p>
                  Khung dịch vụ của Light Human được chuẩn hoá chuyên biệt cho từng bài toán nhân sự, đảm bảo tính phù hợp cao nhất với mô hình vận hành của từng doanh nghiệp:
                </p>
                <ul>
                  {s.scope.items.map((it) => (
                    <li key={it.title}>
                      <strong>{fixCopy(it.title)}:</strong> {fixCopy(it.desc)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 2. Năng lực & Giá trị khác biệt */}
            <section id="khac-biet">
              <h2>{headingText(s.features.title)}</h2>
              {s.features.lede && <p>{plain(s.features.lede)}</p>}
              <dl className="service-prose-features">
                {s.features.items.map((feat) => (
                  <div key={feat.title}>
                    <dt>
                      <Ico name={feat.icon} />
                      {fixCopy(feat.title)}
                    </dt>
                    <dd>{fixCopy(feat.desc)}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 3. Quy trình thực hiện */}
            <section id="quy-trinh">
              <h2>{headingText(s.process.title || s.process.eyebrow || "Quy trình triển khai dịch vụ")}</h2>
              {s.process.lede && <p>{plain(s.process.lede)}</p>}
              <ol className="service-prose-steps">
                {s.process.steps.map((step) => (
                  <li key={step.title}>
                    <strong>{fixCopy(step.title)}</strong>
                    <span>{fixCopy(step.desc)}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* 4. Dự án & Tình huống thực tế */}
            {s.cases.items.length > 0 && (
              <section id="du-an">
                <h2>{headingText(s.cases.title)}</h2>
                <p>
                  Những câu chuyện hợp tác tiêu biểu minh chứng cho năng lực thực thi và cam kết đồng hành dài lâu của Light Human:
                </p>
                <ul>
                  {s.cases.items.map((cs) => (
                    <li key={cs.headline}>
                      <strong>{fixCopy(cs.brand)} ({fixCopy(cs.industry)}):</strong> {fixCopy(cs.headline)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 5. Câu hỏi thường gặp */}
            {s.faq.items.length > 0 && (
              <section id="hoi-dap">
                <h2>Câu hỏi thường gặp</h2>
                <FaqList items={s.faq.items} />
                {s.faq.helper && (
                  <p className="mt-4 italic">
                    {fixCopy(s.faq.helper.text)}{" "}
                    <Link href="/lien-he">
                      {fixCopy(s.faq.helper.linkLabel)}
                    </Link>
                  </p>
                )}
              </section>
            )}
          </div>

          {/* Cột mục lục bên phải */}
          <aside className="article-aside">
            <nav className="toc" aria-label="Mục lục bài viết">
              <p className="aside-h">Mục lục nội dung</p>
              <ol>
                {toc.map(([id, text]) => (
                  <li key={id}>
                    <a href={`#${id}`}>{text}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Khối liên hệ nhanh bên cạnh TOC */}
            <div className="service-aside-card">
              <span className="aside-card-badge">Tư vấn trực tiếp</span>
              <h4 className="aside-card-title">Cần tư vấn cho vị trí này?</h4>
              <p className="aside-card-desc">
                Liên hệ ngay đội ngũ tư vấn Light Human để nhận hồ sơ ứng viên và phương án tối ưu.
              </p>
              <Link href={quoteHref} className="aside-card-quote">
                <span>Nhận bảng báo giá</span>
                <Ico name="arrow-right" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Các dịch vụ liên quan & CTA */}
        <RelatedServices current={s.slug} />
        <QuoteCta title={s.cta.title} desc={s.cta.desc} />
      </article>
    </>
  );
}
