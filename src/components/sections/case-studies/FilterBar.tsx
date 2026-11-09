"use client";

/** Thanh lọc dính (lh-filter-bar--sticky) với các nút "pill" — dùng ở Case Studies và Insights. */
export function FilterBar<T extends string>({
  options,
  active,
  onChange,
}: {
  options: readonly { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <section className="lh-filter-bar lh-filter-bar--sticky">
      <div className="lh-container">
        <div className="lh-filter-bar__pills" role="tablist">
          {options.map((o) => {
            const selected = o.id === active;
            return (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? "lh-filter-pill lh-filter-pill--active" : "lh-filter-pill"}
                onClick={() => onChange(o.id)}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
