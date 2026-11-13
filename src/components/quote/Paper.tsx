"use client";

import { useDroppable } from "@dnd-kit/core";
import { Ico } from "@/components/mk/ui";
import { CATALOG, type Group, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { fixCopy } from "@/lib/mk";
import { Req, cardKey, ruleText } from "./Deck";
import { isValueSelected, type SelectedState } from "./selection";

export const rowId = (g: GroupKey) => `row:${g}`;

type Props = {
  selected: SelectedState;
  /** Group of the card being dragged, if any. */
  dragGroup: GroupKey | null;
  locked: boolean;
  errors: Record<string, string>;
  register: (key: string) => (el: HTMLElement | null) => void;
  onRemove: (g: GroupKey, value: string, label: string, el: HTMLElement) => void;
};

/** One `.qd-row` per catalogue group: the drop slot on the paper sheet. */
export function SlotRows(props: Props) {
  return (
    <>
      {CATALOG.map((g) => (
        <SlotRow key={g.key} group={g} {...props} />
      ))}
    </>
  );
}

function SlotRow({ group: g, selected, dragGroup, locked, errors, register, onRemove }: Props & { group: Group }) {
  const { setNodeRef, isOver } = useDroppable({ id: rowId(g.key), data: { groupKey: g.key } });
  const chosen = g.options.filter((o) => isValueSelected(selected, g.key, o.value)).map((o) => ({ ...o, label: fixCopy(o.label) }));
  const error = errors[`lines.0.${g.key}`];
  const target = dragGroup === g.key;
  const cls = ["qd-row", target && "is-target", target && isOver && "is-over", error && "has-error"].filter(Boolean).join(" ");
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        register(`row:${g.key}`)(el);
      }}
      className={cls}
    >
      <div className="qd-row-k">
        <span id={`qd-s-${g.key}`}>
          {g.label}
          {g.required && <Req />}
        </span>
        <small>{ruleText(g)}</small>
      </div>
      <div
        ref={register(`slot:${g.key}`)}
        className={`qd-slot${chosen.length ? " is-filled" : ""}`}
        role="group"
        aria-labelledby={`qd-s-${g.key}`}
        aria-describedby={`qd-e-${g.key}`}
      >
        <span className="qd-slot-empty" aria-hidden="true">
          {g.selectType === "multi" ? vi.board.slotEmptyMulti : vi.board.slotEmptySingle}
        </span>
        <span className="qd-chips">
          {chosen.map((o) => (
            <button
              key={o.value}
              ref={register(`chip:${cardKey(g.key, o.value)}`)}
              type="button"
              className="qd-chip"
              disabled={locked}
              aria-label={`${vi.removeChip} ${o.label}`}
              onClick={(e) => onRemove(g.key, o.value, o.label, e.currentTarget)}
            >
              <span className="qd-chip-l">{o.label}</span>
              <Ico name="x" />
            </button>
          ))}
        </span>
      </div>
      <p className="qd-err" id={`qd-e-${g.key}`}>
        {error}
      </p>
    </div>
  );
}
