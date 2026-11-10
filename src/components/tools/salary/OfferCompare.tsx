"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { calculate, type SalaryInput, type SalaryResult } from "@/lib/salary/calc";
import type { Region } from "@/lib/salary/rules";
import { formatMoney, formatRate, parseMoney, regionLabel } from "@/lib/salary/format";

type Offer = { name: string; text: string; amount: number; mode: SalaryInput["mode"] };

const INITIAL: [Offer, Offer] = [
  { name: "Công việc hiện tại", text: formatMoney(30_000_000), amount: 30_000_000, mode: "gross-to-net" },
  { name: "Offer mới", text: formatMoney(36_000_000), amount: 36_000_000, mode: "net-to-gross" },
];

const ROWS: { label: string; pick: (r: SalaryResult) => number; strong?: boolean }[] = [
  { label: "Lương Gross", pick: (r) => r.gross },
  { label: "Bảo hiểm NLĐ đóng", pick: (r) => r.employee.total },
  { label: "Thuế TNCN", pick: (r) => r.tax },
  { label: "Lương Net / tháng", pick: (r) => r.net, strong: true },
  { label: "Net / năm (12 tháng)", pick: (r) => r.net * 12 },
  { label: "Chi phí doanh nghiệp / tháng", pick: (r) => r.employerCost },
];

/**
 * So sánh 2 offer (mỗi offer nhập Gross hoặc Net) — dùng khi tư vấn ứng viên chuyển việc:
 * mức tăng thực nhận và mức tăng chi phí doanh nghiệp.
 */
export function OfferCompare({ dependents, region, ruleId }: { dependents: number; region: Region; ruleId: SalaryInput["ruleId"] }) {
  const [offers, setOffers] = useState<[Offer, Offer]>(INITIAL);

  const set = (i: 0 | 1, patch: Partial<Offer>) =>
    setOffers((prev) => {
      const next: [Offer, Offer] = [prev[0], prev[1]];
      next[i] = { ...prev[i], ...patch };
      return next;
    });

  const results = offers.map((o) =>
    o.amount > 0 ? calculate({ amount: o.amount, mode: o.mode, dependents, region, insuranceBase: null, ruleId }) : null,
  );
  const [a, b] = results;
  const netDiff = a && b ? b.net - a.net : 0;
  const pct = a && b && a.net > 0 ? (netDiff / a.net) * 100 : 0;

  return (
    <div className="lht-compare lht-noprint" id="so-sanh-offer">
      <div className="lht-compare__head">
        <span className="lht-compare__icon" aria-hidden="true">
          <Scale size={20} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="lht-compare__title">
            So sánh <em>hai offer</em>
          </h2>
          <p className="lht-compare__lede">
            Nhập từng offer theo Gross hoặc Net — công cụ quy về cùng một thước đo. Áp dụng {dependents} người phụ thuộc,{" "}
            {regionLabel(region)}, đóng bảo hiểm trên lương chính thức.
          </p>
        </div>
      </div>

      <div className="lht-compare__inputs">
        {offers.map((o, i) => (
          <div key={i} className="lht-offer">
            <span className="lht-offer__tag">{i === 0 ? "A" : "B"}</span>
            <input
              className="lht-offer__name"
              aria-label={`Tên offer ${i === 0 ? "A" : "B"}`}
              value={o.name}
              maxLength={40}
              onChange={(e) => set(i as 0 | 1, { name: e.target.value })}
            />
            <div className="lht-money lht-money--sm">
              <input
                className="lht-money__input"
                inputMode="numeric"
                autoComplete="off"
                aria-label={`Mức lương offer ${i === 0 ? "A" : "B"}`}
                value={o.text}
                onChange={(e) => set(i as 0 | 1, { text: e.target.value, amount: parseMoney(e.target.value) })}
                onBlur={() => set(i as 0 | 1, { text: o.amount ? formatMoney(o.amount) : "" })}
              />
              <div className="lht-mini-seg" role="radiogroup" aria-label={`Loại lương offer ${i === 0 ? "A" : "B"}`}>
                {(["gross-to-net", "net-to-gross"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={o.mode === m}
                    onClick={() => set(i as 0 | 1, { mode: m })}
                  >
                    {m === "gross-to-net" ? "Gross" : "Net"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lht-compare__table-wrap">
        <table className="lht-table lht-compare__table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Hạng mục</span>
              </th>
              <th scope="col">{offers[0].name || "Offer A"}</th>
              <th scope="col">{offers[1].name || "Offer B"}</th>
              <th scope="col">Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const va = a ? row.pick(a) : null;
              const vb = b ? row.pick(b) : null;
              const d = va !== null && vb !== null ? vb - va : null;
              return (
                <tr key={row.label} className={row.strong ? "lht-table__total" : undefined}>
                  <th scope="row">{row.label}</th>
                  <td>{va === null ? "—" : formatMoney(va)}</td>
                  <td>{vb === null ? "—" : formatMoney(vb)}</td>
                  <td className={d && d > 0 ? "is-up" : d && d < 0 ? "is-down" : undefined}>
                    {d === null ? "—" : `${d > 0 ? "+" : ""}${formatMoney(d)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {a && b && (
        <p className="lht-compare__verdict">
          {netDiff === 0 ? (
            "Hai offer cho cùng mức thực nhận."
          ) : (
            <>
              <strong>{(netDiff > 0 ? offers[1].name : offers[0].name) || (netDiff > 0 ? "Offer B" : "Offer A")}</strong> thực nhận nhiều hơn{" "}
              <strong>{formatMoney(Math.abs(netDiff))} đ/tháng</strong>
              {netDiff > 0 && a.net > 0 && <> — tăng {formatRate(pct / 100)} so với {offers[0].name || "Offer A"}</>}.
            </>
          )}
        </p>
      )}
    </div>
  );
}
