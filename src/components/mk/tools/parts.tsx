import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { site } from "@/content/site";
import { compoundTool, pitTool, salaryTool, tools, toolsHub } from "@/content/tools";
import { fixCopy } from "@/lib/mk";
import { compound } from "@/lib/finance/compound";
import { formatMillions, formatMoney, formatRate } from "@/lib/salary/format";
import { CURRENT_RULE, salaryRules } from "@/lib/salary/rules";
import { BtnIco, CtaBand, Ico, MkImg, Rich, SecHead } from "../ui";

/* Static sections of /cong-cu and the three calculator pages (mock tools/calc-section.js + sections.js). */

type Crumb = { label: string; href?: string };

export function Crumbs({ list }: { list: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Đường dẫn">
      <ol>
        {list.map((c, i) =>
          i === list.length - 1 || !c.href ? (
            <li key={c.label} aria-current="page">
              {c.label}
            </li>
          ) : (
            <li key={c.label}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

const toolCrumbs = (label: string): Crumb[] => [
  { label: "Trang chủ", href: "/" },
  { label: "Công cụ", href: "/cong-cu" },
  { label },
];

/** Hero title literals keep "&" (the mock does not copy-fix them). */
function HeroTitle({ text }: { text: string }) {
  return (
    <h1 className="h1" data-lines="" data-split-done="1">
      <Rich text={text} split fix={false} />
    </h1>
  );
}

/* ------------------------------------------------------------------ hub */
export function ToolsHero() {
  return (
    <section className="hero hero-page" data-hero="">
      <div className="hero-media" data-hero-media="">
        <MkImg url={toolsHub.image.src} alt={toolsHub.image.alt} eager className="hero-img" />
      </div>
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Crumbs list={[{ label: "Trang chủ", href: "/" }, { label: "Công cụ" }]} />
        <p className="kicker">{fixCopy(toolsHub.eyebrow)}</p>
        <HeroTitle text={`${toolsHub.title} *${toolsHub.titleEm}*`} />
        <p className="hero-lede">
          <Rich text={toolsHub.lede} />
        </p>
      </div>
    </section>
  );
}

export function ToolsHub() {
  const s = toolsHub.suggest;
  return (
    <section className="tools-hub tone-paper" aria-labelledby="ds-cong-cu">
      <div className="wrap">
        <h2 className="sr-only" id="ds-cong-cu">
          {toolsHub.listLabel}
        </h2>
        <div className="tool-grid">
          {tools.map((t, i) => (
            <Link key={t.slug} className="tool-card shell" href={`/cong-cu/${t.slug}`} style={{ "--i": i } as CSSProperties}>
              <div className="core">
                <span className="tool-ico">
                  <Ico name={t.icon} />
                </span>
                <p className="cell-tag">{fixCopy(t.tag)}</p>
                <h3 className="h3">{fixCopy(t.name)}</h3>
                <p>{fixCopy(t.desc)}</p>
                <p className="fine">{fixCopy(t.forWho)}</p>
                <span className="link-line">
                  {toolsHub.openLabel}
                  <Ico name="arrow-right" />
                </span>
              </div>
            </Link>
          ))}
          <a className="tool-card tool-suggest" href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Đề xuất công cụ")}`}>
            <h3 className="h3">{fixCopy(s.title)}</h3>
            <p>{fixCopy(s.body)}</p>
            <span className="link-line">
              {fixCopy(s.cta)}
              <Ico name="envelope" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ calculator pages */
type ToolCopy = {
  heroTitle: string;
  crumb: string;
  hero: { eyebrow: string; lede: string; facts: { value: string; label: string }[] };
};

export function CalcHero({ tool }: { tool: ToolCopy }) {
  const badge = toolsHub.badge;
  return (
    <section className="hero hero-text tone-navy" data-hero="">
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Crumbs list={toolCrumbs(tool.crumb)} />
        <p className="kicker">{fixCopy(tool.hero.eyebrow)}</p>
        <HeroTitle text={tool.heroTitle} />
        <p className="hero-lede">
          <Rich text={tool.hero.lede} />
        </p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#may-tinh">
            <span>{toolsHub.startLabel}</span>
            <BtnIco />
          </a>
          <p className="calc-badge">
            <strong>{badge.title}</strong>
            <span>
              {badge.body}. {toolsHub.badgeNote}
            </span>
          </p>
        </div>
        <dl className="calc-facts">
          {tool.hero.facts.map((f) => (
            <div key={f.label}>
              <dt>{fixCopy(f.label)}</dt>
              <dd>{fixCopy(f.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function CalcFaq({
  prefix,
  tool,
}: {
  prefix: string;
  tool: { faqHead: { eyebrow: string; helper: string; helperLink: string }; faqs: { q: string; a: string }[] };
}) {
  const h = tool.faqHead;
  return (
    <section className="faq-sec tone-paper" aria-labelledby={`${prefix}-faq-h`}>
      <div className="wrap faq-grid">
        <div className="faq-head">
          <p className="eyebrow">{h.eyebrow}</p>
          <h2 className="h2" id={`${prefix}-faq-h`} data-split="" data-split-done="1">
            <Rich text={toolsHub.faqTitle} split />
          </h2>
          <p className="lede">
            {fixCopy(h.helper)}{" "}
            <Link className="link-line" href="/lien-he">
              {fixCopy(h.helperLink)}
            </Link>
          </p>
        </div>
        <div className="faq" data-faq="">
          {tool.faqs.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                <span>{fixCopy(f.q)}</span>
                <span className="faq-ico">
                  <Ico name="plus" />
                </span>
              </summary>
              <div className="faq-a">
                <p>
                  <Rich text={f.a} />
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaCopy = {
  title: string;
  titleEm: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

export function CalcCta({ cta }: { cta: CtaCopy }) {
  // Titles end in a dash ("Thuế đã rõ —"); the mock turns it into a comma before the italic part.
  const title = `${fixCopy(cta.title).replace(/\s*-\s*$/, ",")} *${cta.titleEm.trim()}*`;
  return <CtaBand title={title} desc={cta.body} action={cta.primary} secondary={cta.secondary} />;
}

/* ------------------------------------------------------------------ guide pieces */
type Step = { n: string; title: string; body: string };

export function HowTo({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={className ? `calc-howto ${className}` : "calc-howto"}>
      {steps.map((s) => (
        <li key={s.n}>
          <span className="calc-howto-n">{s.n}</span>
          <h3 className="h4">{fixCopy(s.title)}</h3>
          <p>{fixCopy(s.body)}</p>
        </li>
      ))}
    </ol>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="calc-checklist">
      {items.map((c) => (
        <li key={c}>
          <Ico name="check" />
          <span>{fixCopy(c)}</span>
        </li>
      ))}
    </ul>
  );
}

export function RateCard({ children }: { children?: ReactNode }) {
  const rules = salaryRules[CURRENT_RULE];
  return (
    <div className="calc-ratecard shell">
      <div className="core">
        <h3 className="h4">Biểu thuế TNCN từ kỳ tính thuế 2026</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th scope="col">Thu nhập tính thuế / tháng</th>
              <th scope="col">Thuế suất</th>
            </tr>
          </thead>
          <tbody>
            {rules.brackets.map((b, i) => {
              const from = i === 0 ? 0 : rules.brackets[i - 1].upTo;
              const l =
                from === 0
                  ? `Đến ${formatMillions(b.upTo)}`
                  : b.upTo === Infinity
                    ? `Trên ${formatMillions(from)}`
                    : `Trên ${formatMillions(from)} đến ${formatMillions(b.upTo)}`;
              return (
                <tr key={l}>
                  <th scope="row">{l}</th>
                  <td>{formatRate(b.rate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {children}
      </div>
    </div>
  );
}

type Advice = { eyebrow: string; title: string; titleEm: string; paragraphs: string[]; checklist: string[] };

export function AdviceBox({ a }: { a: Advice }) {
  return (
    <div className="calc-advice">
      <p className="eyebrow">{fixCopy(a.eyebrow)}</p>
      <h3 className="h3">
        <Rich text={`${a.title.trim()} *${a.titleEm.trim()}*`} />
      </h3>
      {a.paragraphs.map((p) => (
        <p key={p}>{fixCopy(p)}</p>
      ))}
      <Checklist items={a.checklist} />
    </div>
  );
}

/** Simple vs compound for 100tr at 8%/year, computed with the tool's own maths. */
export function CompoundCompareTable({ example }: { example: string }) {
  const rows = [1, 5, 10, 20, 30].map((y) => {
    const r = compound({ principal: 100_000_000, monthly: 0, years: y, ratePct: 8, frequency: "year", timing: "end", inflationPct: 0 });
    return { y, simple: r.simpleValue, comp: r.futureValue };
  });
  const maxComp = rows[rows.length - 1].comp;
  return (
    <div className="calc-ratecard shell">
      <div className="core">
        <table className="calc-table calc-vs">
          <caption className="sr-only">So sánh lãi đơn và lãi kép (VNĐ)</caption>
          <thead>
            <tr>
              <th scope="col">Sau</th>
              <th scope="col">Lãi đơn</th>
              <th scope="col">Lãi kép</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.y}>
                <th scope="row">{r.y} năm</th>
                <td>{formatMoney(Math.floor(r.simple))}</td>
                <td>
                  <strong>{formatMoney(Math.floor(r.comp))}</strong>
                  <span className="calc-vs-bar" aria-hidden="true">
                    <span style={{ width: `${((r.comp / maxComp) * 100).toFixed(1)}%` }} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fine">{example}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ guides */
export function SalaryGuide() {
  const t = salaryTool;
  return (
    <section className="calc-guide tone-mist" aria-labelledby="lg-guide-h">
      <div className="wrap">
        <SecHead id="lg-guide-h" title={t.guide.title} kicker={t.guide.kicker} />
        <HowTo steps={t.steps} />
        <div className="calc-guide-split">
          <RateCard />
          <AdviceBox a={t.advice} />
        </div>
      </div>
    </section>
  );
}

const PIT_CASES = ["resident", "short", "nonresident"] as const;

export function PitGuide() {
  const t = pitTool;
  const ex = t.exemptList;
  return (
    <section className="calc-guide tone-mist" aria-labelledby="tt-guide-h">
      <div className="wrap">
        <SecHead id="tt-guide-h" title={t.guide.title} kicker={t.guide.kicker} />
        <ul className="calc-cases">
          {PIT_CASES.map((c) => (
            <li key={c}>
              <p className="calc-cases-rate">{t.cases[c].short}</p>
              <h3 className="h4">{t.cases[c].label}</h3>
              <p>{fixCopy(t.cases[c].desc)}</p>
            </li>
          ))}
        </ul>
        <h3 className="h3 calc-guide-sub">{t.guide.stepsTitle}</h3>
        <HowTo steps={t.steps} />
        <div className="calc-guide-split">
          <RateCard>
            <h3 className="h4 calc-sub-h">{fixCopy(ex.title)}</h3>
            <Checklist items={ex.items} />
            <p className="fine">{fixCopy(ex.source)}</p>
          </RateCard>
          <AdviceBox a={t.advice} />
        </div>
      </div>
    </section>
  );
}

export function CompoundGuide() {
  const t = compoundTool;
  const c = t.compare;
  return (
    <section className="calc-guide tone-mist" aria-labelledby="lk-guide-h">
      <div className="wrap">
        <div className="calc-guide-split calc-guide-top">
          <SecHead id="lk-guide-h" title={`${c.title.trim()} *${c.titleEm.trim()}*`} kicker={c.eyebrow} lede={c.body} />
          <CompoundCompareTable example={c.example} />
        </div>
        <HowTo className="calc-tips" steps={t.tips.map((x, i) => ({ n: String(i + 1).padStart(2, "0"), ...x }))} />
      </div>
    </section>
  );
}
