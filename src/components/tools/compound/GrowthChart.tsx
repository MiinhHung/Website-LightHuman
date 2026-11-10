"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { YearRow } from "@/lib/finance/compound";
import { formatMoney } from "@/lib/salary/format";

const PAD = { top: 16, right: 12, bottom: 30, left: 60 };

/** 1.234.000.000 → "1,23 tỷ"; 45.000.000 → "45 tr". */
export function formatCompact(n: number) {
  const f = (v: number, d: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: d }).format(v);
  if (Math.abs(n) >= 1e9) return `${f(n / 1e9, 2)} tỷ`;
  if (Math.abs(n) >= 1e6) return `${f(n / 1e6, n >= 1e8 ? 0 : 1)} tr`;
  return f(n, 0);
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/**
 * Cột chồng theo năm: vốn đã bỏ vào (navy) + lãi lũy kế (vàng), đường nét đứt = lãi đơn.
 * Rê chuột / chạm / phím ←→ để xem từng năm.
 */
export function GrowthChart({ rows, showSimple }: { rows: YearRow[]; showSimple: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  // Vẽ theo đúng chiều rộng thật (px) để chữ trục không bị co nhỏ trên điện thoại.
  const stageRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(800);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 560 ? 240 : 300;
  if (rows.length === 0) return null;

  const idx = active === null ? rows.length - 1 : Math.min(active, rows.length - 1);
  const max = niceMax(Math.max(...rows.map((r) => r.balance)));
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const step = iw / rows.length;
  const bw = Math.max(2, Math.min(36, step * 0.68));
  const x = (i: number) => PAD.left + step * i + step / 2;
  const y = (v: number) => PAD.top + ih - (Math.max(0, v) / max) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const labelEvery = Math.ceil(rows.length / (W < 560 ? 6 : 10));
  const row = rows[idx];

  const pick = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.floor((px - PAD.left) / step);
    if (i >= 0 && i < rows.length) setActive(i);
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft") setActive(Math.max(0, idx - 1));
    else if (e.key === "ArrowRight") setActive(Math.min(rows.length - 1, idx + 1));
    else return;
    e.preventDefault();
  };

  const tipLeft = (x(idx) / W) * 100;

  return (
    <div className="lht-chart">
      <div className="lht-chart__legend" aria-hidden="true">
        <span>
          <i className="lht-dot lht-dot--base" /> Vốn đã bỏ vào
        </span>
        <span>
          <i className="lht-dot lht-dot--net" /> Tiền lãi lũy kế
        </span>
        {showSimple && (
          <span>
            <i className="lht-dash" /> Nếu chỉ tính lãi đơn
          </span>
        )}
      </div>

      <div className="lht-chart__stage" ref={stageRef}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="lht-chart__svg"
          role="img"
          tabIndex={0}
          aria-label={`Biểu đồ tăng trưởng ${rows.length} năm. Năm ${row.year}: số dư ${formatMoney(Math.floor(row.balance))} đồng. Dùng phím mũi tên trái phải để xem từng năm.`}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKey}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="lht-chart__grid" />
              <text x={PAD.left - 10} y={y(t) + 4} className="lht-chart__ylab" textAnchor="end">
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {rows.map((r, i) => {
            const base = y(r.contributed);
            const top = y(r.balance);
            const on = i === idx;
            return (
              <g key={r.year} className={on ? "lht-chart__bar is-on" : "lht-chart__bar"}>
                <rect x={x(i) - bw / 2} y={base} width={bw} height={Math.max(0, PAD.top + ih - base)} className="lht-chart__base" rx={2} />
                <rect x={x(i) - bw / 2} y={top} width={bw} height={Math.max(0, base - top)} className="lht-chart__gain" rx={2} />
                {(i % labelEvery === labelEvery - 1 || i === rows.length - 1 || labelEvery === 1) && (
                  <text x={x(i)} y={H - 10} className="lht-chart__xlab" textAnchor="middle">
                    {r.year}
                  </text>
                )}
              </g>
            );
          })}

          {showSimple && (
            <polyline
              className="lht-chart__simple"
              points={rows.map((r, i) => `${x(i)},${y(r.simpleBalance)}`).join(" ")}
            />
          )}

          <line x1={x(idx)} x2={x(idx)} y1={PAD.top} y2={PAD.top + ih} className="lht-chart__cursor" />
        </svg>

        <div
          className="lht-chart__tip"
          style={{ left: `${tipLeft}%`, transform: `translateX(${tipLeft > 60 ? "-100%" : "0"})` }}
          aria-hidden="true"
        >
          <strong>Năm {row.year}</strong>
          <span>
            Số dư <b>{formatMoney(Math.floor(row.balance))}</b>
          </span>
          <span>Vốn đã bỏ vào {formatMoney(Math.floor(row.contributed))}</span>
          <span>Lãi lũy kế {formatMoney(Math.floor(row.interestTotal))}</span>
          {showSimple && <span className="is-muted">Lãi đơn: {formatMoney(Math.floor(row.simpleBalance))}</span>}
        </div>
      </div>
      <p className="lht-chart__x-title">Năm</p>
    </div>
  );
}
