"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Check, GripVertical, X } from "lucide-react";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import type { QuoteType } from "@/lib/quote/classify";
import { isValueSelected, valuesForGroup, type SelectedState } from "./selection";

export type CardData = { groupKey: GroupKey; value: string; label: string; from: "pool" | "zone" };

export const zoneId = (g: GroupKey) => `zone:${g}`;
export const poolId = (g: GroupKey) => `pool:${g}`;

type Props = {
  selected: SelectedState;
  dragging: CardData | null;
  suggestion: QuoteType | null;
  onAdd: (groupKey: GroupKey, value: string) => void;
  onRemove: (groupKey: GroupKey, value: string) => void;
};

/**
 * Kanban-style criteria board: one column per catalogue group. Cards move
 * from the column's pool ("Có thể chọn") up into its lane ("Đã chọn") by
 * drag, click or keyboard; dragging a chosen card back to the pool removes it.
 * A card can only land in its own column, and other columns dim while dragging.
 */
export function CriteriaKanban({ selected, dragging, suggestion, onAdd, onRemove }: Props) {
  const missing = CATALOG.filter((g) => g.required && valuesForGroup(selected, g.key).length === 0).map(
    (g) => g.label,
  );
  const multiLanguage = selected.languages.length >= 2;

  return (
    <div className="lh-kanban-wrap">
      <div className="lh-kanban" data-dragging={dragging ? dragging.groupKey : undefined}>
        {CATALOG.map((group) => (
          <Column
            key={group.key}
            groupKey={group.key}
            label={group.label}
            required={group.required}
            multi={group.selectType === "multi"}
            options={group.options}
            selected={selected}
            dragging={dragging}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="lh-kanban-summary" aria-live="polite">
        <p className="lh-kanban-summary__status">
          {missing.length > 0 ? (
            <>
              <span className="lh-kanban-summary__label">{vi.panel.missing}</span> {missing.join(", ")}
            </>
          ) : (
            <>
              <Check size={16} strokeWidth={2.25} aria-hidden="true" /> {vi.panel.complete}
            </>
          )}
          {multiLanguage && <span className="lh-kanban-summary__note"> {vi.panel.multiLanguage}</span>}
        </p>
        <p className="lh-kanban-summary__type">
          <span className="lh-kanban-summary__label">{vi.panel.typeLabel}</span>
          {suggestion ? (
            <span className={`lh-quote-type-badge lh-quote-type-badge--${suggestion}`}>{vi.types[suggestion]}</span>
          ) : (
            <span className="lh-quote-type-badge lh-quote-type-badge--pending">{vi.panel.typePending}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function Column({
  groupKey,
  label,
  required,
  multi,
  options,
  selected,
  dragging,
  onAdd,
  onRemove,
}: {
  groupKey: GroupKey;
  label: string;
  required: boolean;
  multi: boolean;
  options: readonly { value: string; label: string }[];
  selected: SelectedState;
  dragging: CardData | null;
  onAdd: (groupKey: GroupKey, value: string) => void;
  onRemove: (groupKey: GroupKey, value: string) => void;
}) {
  const { setNodeRef: setZoneRef, isOver: overZone } = useDroppable({ id: zoneId(groupKey), data: { groupKey } });
  const { setNodeRef: setPoolRef, isOver: overPool } = useDroppable({ id: poolId(groupKey), data: { groupKey } });
  const chosen = options.filter((o) => isValueSelected(selected, groupKey, o.value));
  const available = options.filter((o) => !isValueSelected(selected, groupKey, o.value));
  const own = dragging?.groupKey === groupKey;
  const done = chosen.length > 0;
  const headId = `kanban-${groupKey}`;

  const rule = [required ? null : vi.group.optional, multi ? vi.group.multi : vi.group.single]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      className="lh-kanban__col"
      data-group={groupKey}
      data-state={dragging ? (own ? "target" : "muted") : undefined}
      aria-labelledby={headId}
    >
      <header className="lh-kanban__head">
        <h5 id={headId} className="lh-kanban__title">
          {label}
          {required && (
            <span className="lh-quote-req" aria-hidden="true">
              *
            </span>
          )}
        </h5>
        <span className="lh-kanban__rule">{rule}</span>
        <span className={done ? "lh-kanban__count lh-kanban__count--done" : "lh-kanban__count"}>
          {done ? <Check size={13} strokeWidth={2.5} aria-hidden="true" /> : null}
          {chosen.length}
        </span>
      </header>

      <div
        ref={setZoneRef}
        className="lh-kanban__lane"
        data-over={overZone && own ? "" : undefined}
        data-empty={chosen.length === 0 ? "" : undefined}
        aria-label={`${label}: ${vi.panel.title}`}
      >
        {chosen.length === 0 ? (
          <p className="lh-kanban__hint">{own ? "Thả vào đây" : multi ? "Kéo thẻ lên đây" : "Kéo 1 thẻ lên đây"}</p>
        ) : (
          chosen.map((o) => (
            <Card
              key={o.value}
              groupKey={groupKey}
              value={o.value}
              label={o.label}
              from="zone"
              onActivate={() => onRemove(groupKey, o.value)}
            />
          ))
        )}
      </div>

      <div
        ref={setPoolRef}
        className="lh-kanban__pool"
        data-over={overPool && own && dragging?.from === "zone" ? "" : undefined}
      >
        <p className="lh-kanban__pool-label">{available.length > 0 ? "Có thể chọn" : "Đã chọn hết"}</p>
        <div className="lh-kanban__cards">
          {available.map((o) => (
            <Card
              key={o.value}
              groupKey={groupKey}
              value={o.value}
              label={o.label}
              from="pool"
              onActivate={() => onAdd(groupKey, o.value)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  groupKey,
  value,
  label,
  from,
  onActivate,
}: {
  groupKey: GroupKey;
  value: string;
  label: string;
  from: "pool" | "zone";
  onActivate: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `card:${groupKey}:${value}`,
    data: { groupKey, value, label, from } satisfies CardData,
  });
  const chosen = from === "zone";
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      className={chosen ? "lh-kcard lh-kcard--chosen" : "lh-kcard"}
      data-dragging={isDragging || undefined}
      onClick={onActivate}
      aria-label={chosen ? `${vi.removeChip} ${label}` : `Chọn ${label}`}
    >
      <GripVertical className="lh-kcard__grip" size={14} strokeWidth={2} aria-hidden="true" />
      <span className="lh-kcard__label">{label}</span>
      {chosen && <X className="lh-kcard__x" size={14} strokeWidth={2.25} aria-hidden="true" />}
    </button>
  );
}

/** Floating copy of the card under the pointer (rendered inside <DragOverlay>). */
export function CardOverlay({ card }: { card: CardData }) {
  return (
    <div className={card.from === "zone" ? "lh-kcard lh-kcard--chosen lh-kcard--overlay" : "lh-kcard lh-kcard--overlay"}>
      <GripVertical className="lh-kcard__grip" size={14} strokeWidth={2} aria-hidden="true" />
      <span className="lh-kcard__label">{card.label}</span>
    </div>
  );
}
