"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { formatMoney, parseMoney } from "@/lib/salary/format";

/** Nhóm nút chọn một (radiogroup) kiểu "segmented control". */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  icon,
  wide,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  icon?: ReactNode;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className="lht-field">
      <span className="lht-label" id={id}>
        {label}
      </span>
      <div className={wide ? "lht-seg lht-seg--wide" : "lht-seg"} role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className="lht-seg__btn"
            onClick={() => onChange(o.value)}
          >
            {value === o.value && icon}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Ô nhập tiền: tự chấm phân cách hàng nghìn khi rời ô, hiểu cách gõ tắt "50tr",
 * kèm các mức gợi ý bấm nhanh. Giữ chuỗi người dùng đang gõ, chỉ chuẩn hoá khi blur.
 */
export function MoneyField({
  label,
  hint,
  value,
  onChange,
  presets,
  presetLabel,
  placeholder,
  size,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  presets?: number[];
  presetLabel?: (n: number) => string;
  placeholder?: string;
  size?: "sm";
}) {
  const id = useId();
  const [text, setText] = useState(value ? formatMoney(value) : "");
  const [synced, setSynced] = useState(value);
  // Giá trị đổi từ bên ngoài (đặt lại, link chia sẻ) → cập nhật chuỗi hiển thị.
  if (synced !== value) {
    setSynced(value);
    if (parseMoney(text) !== value) setText(value ? formatMoney(value) : "");
  }
  return (
    <div className="lht-field">
      <label htmlFor={id} className="lht-label">
        {label}
      </label>
      {hint && <span className="lht-sublabel">{hint}</span>}
      <div className={size === "sm" ? "lht-money lht-money--sm" : "lht-money"}>
        <input
          id={id}
          className="lht-money__input"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          placeholder={placeholder ?? "VD: 10.000.000 hoặc 10tr"}
          onChange={(e) => {
            setText(e.target.value);
            onChange(parseMoney(e.target.value));
          }}
          onBlur={() => setText(value ? formatMoney(value) : "")}
        />
        <span className="lht-money__unit">VNĐ</span>
      </div>
      {presets && (
        <div className="lht-presets" aria-label={`Gợi ý ${label.toLowerCase()}`}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className="lht-preset"
              aria-pressed={value === p}
              onClick={() => {
                onChange(p);
                setText(p ? formatMoney(p) : "");
              }}
            >
              {presetLabel ? presetLabel(p) : formatMoney(p)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Thanh trượt + ô số đi kèm (năm, lãi suất…). */
export function RangeField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  marks,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  marks?: number[];
}) {
  const id = useId();
  const pct = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const decimals = step < 1 ? 1 : 0;
  return (
    <div className="lht-field">
      <div className="lht-range__head">
        <label htmlFor={id} className="lht-label">
          {label}
        </label>
        <div className="lht-range__num">
          <input
            type="number"
            inputMode="decimal"
            aria-label={`${label} (${unit})`}
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => {
              const n = parseFloat(e.target.value.replace(",", "."));
              onChange(Number.isFinite(n) ? clamp(n) : 0);
            }}
          />
          <span>{unit}</span>
        </div>
      </div>
      {hint && <span className="lht-sublabel">{hint}</span>}
      <input
        id={id}
        type="range"
        className="lht-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--lht-range-pct": `${pct}%` } as CSSProperties}
        onChange={(e) => onChange(Number(Number(e.target.value).toFixed(decimals)))}
      />
      {marks && (
        <div className="lht-range__marks" aria-hidden="true">
          {marks.map((m) => (
            <button
              key={m}
              type="button"
              tabIndex={-1}
              aria-pressed={value === m}
              style={{ left: `${((m - min) / (max - min)) * 100}%` }}
              onClick={() => onChange(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
