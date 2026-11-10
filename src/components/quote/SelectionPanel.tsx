"use client";

import { useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { CATALOG, labelFor, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import type { QuoteType } from "@/lib/quote/classify";
import { valuesForGroup, type SelectedState } from "./selection";

export const SELECTION_DROP_ID = "zone:selection";

type Props = {
  selected: SelectedState;
  suggestion: QuoteType | null;
  onRemove: (groupKey: GroupKey, value: string) => void;
};

/** Single drop target summarising the selection, what is still missing, and the suggested type. */
export function SelectionPanel({ selected, suggestion, onRemove }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: SELECTION_DROP_ID });

  const groups = CATALOG.map((g) => ({ ...g, values: valuesForGroup(selected, g.key) }));
  const filled = groups.filter((g) => g.values.length > 0);
  const missing = groups.filter((g) => g.required && g.values.length === 0).map((g) => g.label);
  const multiLanguage = selected.languages.length >= 2;

  const classes = [
    "lh-quote-panel",
    filled.length > 0 ? "lh-quote-panel--filled" : "",
    isOver ? "lh-quote-panel--over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside ref={setNodeRef} className={classes} aria-labelledby="quote-panel-title">
      <h4 id="quote-panel-title" className="lh-quote-panel__title">
        {vi.panel.title}
      </h4>

      {filled.length === 0 ? (
        <p className="lh-quote-panel__empty">{vi.panel.empty}</p>
      ) : (
        <dl className="lh-quote-panel__list">
          {filled.map((g) => (
            <div key={g.key}>
              <dt>{g.label}</dt>
              <dd className="lh-quote-chip-row">
                {g.values.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="lh-quote-chip lh-quote-chip--selected"
                    onClick={() => onRemove(g.key, v)}
                    aria-label={`${vi.removeChip} ${labelFor(g.key, v)}`}
                  >
                    {labelFor(g.key, v)}
                    <X size={14} strokeWidth={2} aria-hidden="true" />
                  </button>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="lh-quote-panel__missing" aria-live="polite">
        {missing.length > 0 ? `${vi.panel.missing} ${missing.join(", ")}.` : vi.panel.complete}
        {multiLanguage && ` ${vi.panel.multiLanguage}`}
      </p>

      <div className="lh-quote-panel__type">
        <span className="lh-quote-panel__type-label">{vi.panel.typeLabel}</span>
        <TypeBadge type={suggestion} />
        <span className="lh-quote-note">{vi.panel.typeNote}</span>
      </div>
    </aside>
  );
}

function TypeBadge({ type }: { type: QuoteType | null }) {
  if (!type) {
    return (
      <span className="lh-quote-type-badge lh-quote-type-badge--pending">{vi.panel.typePending}</span>
    );
  }
  return (
    <span className={`lh-quote-type-badge lh-quote-type-badge--${type}`}>{vi.types[type]}</span>
  );
}
