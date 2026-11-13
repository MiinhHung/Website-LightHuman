"use client";

import { useState, type KeyboardEvent } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CATALOG, type Group, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { fixCopy } from "@/lib/mk";
import { isValueSelected, valuesForGroup, type SelectedState } from "./selection";

export type CardData = { groupKey: GroupKey; value: string; label: string };

export const cardKey = (g: GroupKey, v: string) => `${g}:${v}`;

export const ruleText = (g: Group) =>
  (g.selectType === "multi" ? vi.group.multi : vi.group.single) + (g.required ? "" : `, ${vi.group.optional}`);

export const Req = () => (
  <span className="qd-req" aria-hidden="true">
    *
  </span>
);

type Props = {
  selected: SelectedState;
  locked: boolean;
  /** A drag is running: arrow keys belong to dnd-kit, not to the roving focus. */
  dragging: boolean;
  register: (key: string) => (el: HTMLElement | null) => void;
  onPick: (g: GroupKey, value: string, label: string, el: HTMLElement) => void;
};

/** Mock `.qd-deck`: every group's card pool; cards on the sheet stay mounted but hidden. */
export function Deck({ selected, locked, dragging, register, onPick }: Props) {
  // Roving tabindex per pool: one Tab stop per group, arrows move inside it.
  const [roving, setRoving] = useState<Partial<Record<GroupKey, string>>>({});

  function onPoolKey(e: KeyboardEvent<HTMLDivElement>, g: GroupKey) {
    if (dragging) return;
    const list = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-card]:not([hidden])")];
    const i = list.indexOf(e.target as HTMLButtonElement);
    if (i < 0) return;
    let to = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % list.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + list.length) % list.length;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = list.length - 1;
    if (to < 0) return;
    e.preventDefault();
    setRoving((r) => ({ ...r, [g]: list[to].dataset.value }));
    list[to].focus();
  }

  return (
    <aside className="qd-deck" aria-labelledby="qd-deck-title">
      <div className="qd-deck-head">
        <h3 className="h4" id="qd-deck-title">
          {vi.board.deckTitle}
        </h3>
        <p className="qd-fine">
          <span className="qd-only-fine">{vi.sheet.hintFine}</span>
          <span className="qd-only-touch">{vi.sheet.hintTouch}</span> {vi.sheet.hintChip}
        </p>
      </div>
      {CATALOG.map((g) => {
        const chosen = valuesForGroup(selected, g.key).length;
        const visible = g.options.filter((o) => !isValueSelected(selected, g.key, o.value));
        const stop = visible.some((o) => o.value === roving[g.key]) ? roving[g.key] : visible[0]?.value;
        return (
          <section key={g.key} className="qd-group" aria-labelledby={`qd-g-${g.key}`}>
            <header className="qd-group-head">
              <h4 id={`qd-g-${g.key}`}>
                {g.label}
                {g.required && <Req />}
              </h4>
              <span className="qd-rule">{ruleText(g)}</span>
              <span className={`qd-count${chosen ? " has" : ""}`} aria-hidden="true">
                {chosen}/{g.options.length}
              </span>
            </header>
            <div
              className={`qd-pool${visible.length ? "" : " is-empty"}`}
              role="group"
              aria-labelledby={`qd-g-${g.key}`}
              data-pool={g.key}
              onKeyDown={(e) => onPoolKey(e, g.key)}
              onFocus={(e) => {
                const v = (e.target as HTMLElement).dataset.value;
                if (v && v !== roving[g.key]) setRoving((r) => ({ ...r, [g.key]: v }));
              }}
            >
              {g.options.map((o) => (
                <DeckCard
                  key={o.value}
                  groupKey={g.key}
                  value={o.value}
                  label={fixCopy(o.label)}
                  hidden={isValueSelected(selected, g.key, o.value)}
                  tabStop={o.value === stop}
                  locked={locked}
                  register={register}
                  onPick={onPick}
                />
              ))}
            </div>
          </section>
        );
      })}
    </aside>
  );
}

function DeckCard({
  groupKey,
  value,
  label,
  hidden,
  tabStop,
  locked,
  register,
  onPick,
}: {
  groupKey: GroupKey;
  value: string;
  label: string;
  hidden: boolean;
  tabStop: boolean;
  locked: boolean;
  register: Props["register"];
  onPick: Props["onPick"];
}) {
  const key = cardKey(groupKey, value);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `card:${key}`,
    data: { groupKey, value, label } satisfies CardData,
    disabled: locked || hidden,
    attributes: { roleDescription: "thẻ" },
  });
  return (
    <button
      ref={(el) => {
        setNodeRef(el);
        register(`card:${key}`)(el);
      }}
      {...attributes}
      {...listeners}
      type="button"
      className={`qd-card${isDragging ? " is-dragging" : ""}`}
      data-card=""
      data-value={value}
      hidden={hidden}
      disabled={locked}
      tabIndex={tabStop ? 0 : -1}
      onClick={(e) => onPick(groupKey, value, label, e.currentTarget)}
    >
      {label}
    </button>
  );
}

/** Floating copy under the pointer (inside <DragOverlay>). */
export function CardGhost({ label }: { label: string }) {
  return (
    <div className="qd-ghost" aria-hidden="true" style={{ position: "static", transform: "rotate(3deg) scale(1.04)" }}>
      {label}
    </div>
  );
}
