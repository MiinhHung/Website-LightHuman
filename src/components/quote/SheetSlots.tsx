"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { isValueSelected, type SelectedState } from "./selection";
import { cardKey, type CardData } from "./CardDeck";

export const slotId = (g: GroupKey) => `slot:${g}`;

type Props = {
  selected: SelectedState;
  dragging: CardData | null;
  /** Stamped sheet: chips become plain print, no drag or remove. */
  locked?: boolean;
  register: (key: string) => (el: HTMLElement | null) => void;
  onRemove: (g: GroupKey, value: string, label: string, el: HTMLElement) => void;
};

/**
 * The "Yêu cầu ứng viên" table printed on the quote sheet: one row per group.
 * Every row is a drop target, but a card dropped anywhere on the sheet is
 * routed to its own row — the row only lights up to show where it will land.
 */
export function SheetSlots({ selected, dragging, locked = false, register, onRemove }: Props) {
  return (
    <dl className="lh-qb-slots">
      {CATALOG.map((g) => (
        <Slot
          key={g.key}
          groupKey={g.key}
          label={g.label}
          required={g.required}
          multi={g.selectType === "multi"}
          chosen={g.options.filter((o) => isValueSelected(selected, g.key, o.value))}
          target={dragging?.from === "deck" && dragging.groupKey === g.key}
          locked={locked}
          register={register}
          onRemove={onRemove}
        />
      ))}
    </dl>
  );
}

function Slot({
  groupKey,
  label,
  required,
  multi,
  chosen,
  target,
  locked,
  register,
  onRemove,
}: {
  groupKey: GroupKey;
  label: string;
  required: boolean;
  multi: boolean;
  chosen: readonly { value: string; label: string }[];
  target: boolean;
  locked: boolean;
  register: Props["register"];
  onRemove: Props["onRemove"];
}) {
  const { setNodeRef } = useDroppable({ id: slotId(groupKey), data: { groupKey } });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        register(`slot:${groupKey}`)(el);
      }}
      className="lh-qb-slot"
      data-target={target ? "" : undefined}
      data-filled={chosen.length > 0 ? "" : undefined}
    >
      <dt className="lh-qb-slot__label">
        {label}
        {required && <span className="lh-quote-req" aria-hidden="true">*</span>}
      </dt>
      <dd className="lh-qb-slot__value">
        {chosen.length === 0 ? (
          <span className="lh-qb-slot__empty">{multi ? vi.board.slotEmptyMulti : vi.board.slotEmptySingle}</span>
        ) : (
          chosen.map((o) =>
            locked ? (
              <span key={o.value} className="lh-qb-card lh-qb-card--chip" data-locked="">
                <span className="lh-qb-card__label">{o.label}</span>
              </span>
            ) : (
              <Chip key={o.value} groupKey={groupKey} value={o.value} label={o.label} register={register} onRemove={onRemove} />
            ),
          )
        )}
      </dd>
    </div>
  );
}

function Chip({
  groupKey,
  value,
  label,
  register,
  onRemove,
}: {
  groupKey: GroupKey;
  value: string;
  label: string;
  register: Props["register"];
  onRemove: Props["onRemove"];
}) {
  const key = cardKey(groupKey, value);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sheet:${key}`,
    data: { groupKey, value, label, from: "sheet" } satisfies CardData,
  });
  return (
    <button
      ref={(el) => {
        setNodeRef(el);
        register(`sheet:${key}`)(el);
      }}
      {...attributes}
      {...listeners}
      type="button"
      className="lh-qb-card lh-qb-card--chip"
      data-dragging={isDragging || undefined}
      onClick={(e) => onRemove(groupKey, value, label, e.currentTarget)}
      aria-label={`${vi.removeChip} ${label}`}
    >
      <span className="lh-qb-card__label">{label}</span>
      <X className="lh-qb-card__x" size={13} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
