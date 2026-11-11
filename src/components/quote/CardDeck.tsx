"use client";

import type { CSSProperties } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ArrowRight, Check } from "lucide-react";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { isValueSelected, valuesForGroup, type SelectedState } from "./selection";

export type CardData = { groupKey: GroupKey; value: string; label: string; from: "deck" | "sheet" };

export const DECK_ID = "deck";
export const cardKey = (g: GroupKey, v: string) => `${g}:${v}`;

type Props = {
  selected: SelectedState;
  active: GroupKey;
  onTab: (g: GroupKey) => void;
  onPick: (g: GroupKey, value: string, label: string, el: HTMLElement) => void;
  onNext: () => void;
  dragging: CardData | null;
  register: (key: string) => (el: HTMLElement | null) => void;
  status: string;
  /** Quote already stamped: the deck rests until "Tạo báo giá khác". */
  locked?: boolean;
};

/**
 * Left column: one tab per catalogue group and the cards still available in
 * it. Cards already on the sheet stay out of the deck; dropping a sheet chip
 * back onto the deck removes it.
 */
export function CardDeck({ selected, active, onTab, onPick, onNext, dragging, register, status, locked = false }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: DECK_ID });
  const group = CATALOG.find((g) => g.key === active) ?? CATALOG[0];
  const available = group.options.filter((o) => !isValueSelected(selected, group.key, o.value));
  const chosenCount = valuesForGroup(selected, group.key).length;
  const returning = dragging?.from === "sheet";

  return (
    <div
      ref={setNodeRef}
      className="lh-qb-deck"
      data-over={isOver && returning ? "" : undefined}
      data-returning={returning ? "" : undefined}
      data-locked={locked ? "" : undefined}
      inert={locked}
    >
      {locked && <div className="lh-qb-deck__locked">{vi.board.locked}</div>}
      <header className="lh-qb-deck__head">
        <h3 className="lh-qb-deck__title">{vi.board.deckTitle}</h3>
        <p className="lh-qb-deck__hint">
          <span className="lh-qb-only-fine">{vi.board.deckHint}</span>
          <span className="lh-qb-only-coarse">{vi.board.deckHintTouch}</span>
        </p>
      </header>

      <div className="lh-qb-tabs" role="tablist" aria-label={vi.board.deckTitle}>
        {CATALOG.map((g) => {
          const n = valuesForGroup(selected, g.key).length;
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              id={`qb-tab-${g.key}`}
              aria-selected={g.key === active}
              aria-controls="qb-deck-panel"
              className="lh-qb-tab"
              data-done={n > 0 ? "" : undefined}
              onClick={() => onTab(g.key)}
            >
              <span className="lh-qb-tab__label">
                {g.label}
                {g.required && <span className="lh-quote-req" aria-hidden="true">*</span>}
              </span>
              <span className="lh-qb-tab__count" aria-label={`${n} đã chọn`}>
                {n > 0 ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : null}
                {n > 0 ? n : g.options.length}
              </span>
            </button>
          );
        })}
      </div>

      <div id="qb-deck-panel" role="tabpanel" aria-labelledby={`qb-tab-${group.key}`} className="lh-qb-deck__panel">
        <p className="lh-qb-deck__rule">
          {group.selectType === "multi" ? vi.group.multi : vi.group.single}
          {!group.required && ` · ${vi.group.optional}`}
        </p>
        {available.length > 0 ? (
          <div className="lh-qb-cards" key={group.key}>
            {available.map((o, i) => (
              <DeckCard
                key={o.value}
                groupKey={group.key}
                value={o.value}
                label={o.label}
                index={i}
                register={register}
                onPick={onPick}
              />
            ))}
          </div>
        ) : (
          <p className="lh-qb-deck__empty">{vi.board.deckEmpty}</p>
        )}

        {chosenCount > 0 && (
          <button type="button" className="lh-qb-next" onClick={onNext}>
            {vi.board.next}
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="lh-qb-deck__status" aria-live="polite">
        {status}
      </p>
      {returning && <div className="lh-qb-deck__return" aria-hidden="true">{vi.board.dropBack}</div>}
    </div>
  );
}

function DeckCard({
  groupKey,
  value,
  label,
  index,
  register,
  onPick,
}: {
  groupKey: GroupKey;
  value: string;
  label: string;
  index: number;
  register: (key: string) => (el: HTMLElement | null) => void;
  onPick: Props["onPick"];
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `deck:${cardKey(groupKey, value)}`,
    data: { groupKey, value, label, from: "deck" } satisfies CardData,
  });
  const key = cardKey(groupKey, value);
  return (
    <button
      ref={(el) => {
        setNodeRef(el);
        register(`deck:${key}`)(el);
      }}
      {...attributes}
      {...listeners}
      type="button"
      className="lh-qb-card"
      style={{ "--i": index } as CSSProperties}
      data-dragging={isDragging || undefined}
      onClick={(e) => onPick(groupKey, value, label, e.currentTarget)}
      aria-label={`Thêm ${label} vào báo giá`}
    >
      <span className="lh-qb-card__suit" aria-hidden="true">✦</span>
      <span className="lh-qb-card__label">{label}</span>
    </button>
  );
}

/** Floating copy under the pointer (rendered inside <DragOverlay>). */
export function CardGhost({ card }: { card: CardData }) {
  return (
    <div className={card.from === "sheet" ? "lh-qb-card lh-qb-card--ghost lh-qb-card--chip" : "lh-qb-card lh-qb-card--ghost"}>
      <span className="lh-qb-card__suit" aria-hidden="true">✦</span>
      <span className="lh-qb-card__label">{card.label}</span>
    </div>
  );
}
