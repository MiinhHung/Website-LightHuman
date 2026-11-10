"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Active,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createQuoteAction } from "@/app/lien-he/quote-action";
import { initialQuoteState } from "@/app/lien-he/quote-state";
import { vi } from "@/content/quote/labels.vi";
import { classify, type QuoteType } from "@/lib/quote/classify";
import { POSITION_MAX, POSITION_MIN, QUANTITY_MAX } from "@/lib/quote/limits";
import { ContactFields } from "./ContactFields";
import { CardOverlay, CriteriaKanban, poolId, zoneId, type CardData } from "./CriteriaKanban";
import { QuoteResult } from "./QuoteResult";
import { EMPTY_SELECTED, applyAdd, applyRemove, type SelectedState } from "./selection";

const LINE_ERROR_KEYS = [
  "lines.0.industries",
  "lines.0.experience",
  "lines.0.region",
  "lines.0.education",
] as const;

function chipLabel(active: Active): string {
  return (active.data.current as CardData | undefined)?.label ?? String(active.id);
}

/**
 * Quote builder embedded in /lien-he (`<ContactSplit />`): position, candidate
 * criteria (click, keyboard or drag into the selection panel), contact. Client
 * selection is mirrored into hidden inputs; the server re-validates everything.
 */
export function QuoteBuilder() {
  const [selected, setSelected] = useState<SelectedState>(EMPTY_SELECTED);
  const [dragging, setDragging] = useState<CardData | null>(null);
  const [state, formAction, pending] = useActionState(createQuoteAction, initialQuoteState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const criteriaErrorRef = useRef<HTMLParagraphElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  // The result renders below a long form; move focus so the outcome is not missed.
  useEffect(() => {
    if (state.status === "idle") return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
    if (state.status === "error") {
      const target =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        criteriaErrorRef.current;
      if (target) {
        target.scrollIntoView({ behavior, block: "center" });
        target.focus({ preventScroll: true });
        return;
      }
    }
    resultRef.current?.scrollIntoView({ behavior, block: "start" });
    resultRef.current?.focus({ preventScroll: true });
  }, [state]);

  function handleDragStart(e: DragStartEvent) {
    setDragging((e.active.data.current as CardData | undefined) ?? null);
  }

  // A card only lands in its own column: pool -> lane adds, lane -> pool removes.
  function handleDragEnd(e: DragEndEvent) {
    setDragging(null);
    const data = e.active.data.current as CardData | undefined;
    if (!data || !e.over) return;
    if (data.from === "pool" && e.over.id === zoneId(data.groupKey)) {
      setSelected((s) => applyAdd(s, data.groupKey, data.value));
    } else if (data.from === "zone" && e.over.id === poolId(data.groupKey)) {
      setSelected((s) => applyRemove(s, data.groupKey, data.value));
    }
  }

  const suggestion: QuoteType | null = useMemo(() => {
    if (!selected.education || !selected.experience) return null;
    return classify({
      education: selected.education,
      experience: selected.experience,
      languages: selected.languages,
    });
  }, [selected.education, selected.experience, selected.languages]);

  const errors: Record<string, string> = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : ({} as Partial<Record<string, string>>);
  const criteriaError = LINE_ERROR_KEYS.map((k) => errors[k]).find(Boolean);
  const positionError = errors["lines.0.position"];
  const quantityError = errors["lines.0.quantity"];

  return (
    <div className="lh-quote-builder">
      <form ref={formRef} action={formAction} className="lh-quote-form" aria-busy={pending || undefined}>
        {/* Hidden mirrors of client state → server. */}
        {selected.industries.map((v) => (
          <input key={`i-${v}`} type="hidden" name="line.industries" value={v} />
        ))}
        {selected.languages.map((v) => (
          <input key={`l-${v}`} type="hidden" name="line.languages" value={v} />
        ))}
        {selected.experience && <input type="hidden" name="line.experience" value={selected.experience} />}
        {selected.region && <input type="hidden" name="line.region" value={selected.region} />}
        {selected.education && <input type="hidden" name="line.education" value={selected.education} />}

        <section className="lh-quote-step" aria-labelledby="quote-step-1">
          <StepHead id="quote-step-1" n={1} title={vi.steps.position.title} desc={vi.steps.position.desc} />
          <div className="lh-quote-position">
            <label htmlFor="quote-position" className="lh-field">
              <span className="lh-field__label">
                {vi.position}
                <span className="lh-quote-req" aria-hidden="true">*</span>
              </span>
              <input
                id="quote-position"
                type="text"
                name="line.position"
                minLength={POSITION_MIN}
                maxLength={POSITION_MAX}
                required
                autoComplete="organization-title"
                placeholder={vi.positionPlaceholder}
                defaultValue={values["line.position"] ?? ""}
                className="lh-field__input"
                aria-invalid={positionError ? true : undefined}
                aria-describedby={positionError ? "quote-position-error" : "quote-position-hint"}
              />
              {positionError ? (
                <span id="quote-position-error" className="lh-quote-error-text">{positionError}</span>
              ) : (
                <span id="quote-position-hint" className="lh-quote-note">{vi.positionHint}</span>
              )}
            </label>

            <label htmlFor="quote-quantity" className="lh-field">
              <span className="lh-field__label">
                {vi.quantity}
                <span className="lh-quote-req" aria-hidden="true">*</span>
              </span>
              <input
                id="quote-quantity"
                type="number"
                inputMode="numeric"
                name="line.quantity"
                min={1}
                max={QUANTITY_MAX}
                step={1}
                required
                defaultValue={values["line.quantity"] ?? "1"}
                className="lh-field__input"
                aria-invalid={quantityError ? true : undefined}
                aria-describedby={quantityError ? "quote-quantity-error" : undefined}
              />
              {quantityError && (
                <span id="quote-quantity-error" className="lh-quote-error-text">{quantityError}</span>
              )}
            </label>
          </div>
        </section>

        <section className="lh-quote-step" aria-labelledby="quote-step-2">
          <StepHead id="quote-step-2" n={2} title={vi.steps.criteria.title} desc={vi.steps.criteria.desc} />
          {criteriaError && (
            <p ref={criteriaErrorRef} tabIndex={-1} className="lh-quote-error-text" role="alert">
              {criteriaError}
            </p>
          )}
          <DndContext
            id="quote-builder-dnd"
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setDragging(null)}
            accessibility={{
              announcements: {
                onDragStart: ({ active }) => `Đã nhấc thẻ ${chipLabel(active)}.`,
                onDragOver: ({ active, over }) =>
                  over ? `Thẻ ${chipLabel(active)} đang ở trên vùng thả.` : `Đang kéo thẻ ${chipLabel(active)}.`,
                onDragEnd: ({ active, over }) =>
                  over ? `Đã thả thẻ ${chipLabel(active)}.` : `Đã huỷ kéo ${chipLabel(active)}.`,
                onDragCancel: ({ active }) => `Đã huỷ kéo ${chipLabel(active)}.`,
              },
            }}
          >
            <CriteriaKanban
              selected={selected}
              dragging={dragging}
              suggestion={suggestion}
              onAdd={(g, v) => setSelected((s) => applyAdd(s, g, v))}
              onRemove={(g, v) => setSelected((s) => applyRemove(s, g, v))}
            />
            <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
              {dragging ? <CardOverlay card={dragging} /> : null}
            </DragOverlay>
          </DndContext>
        </section>

        <section className="lh-quote-step" aria-labelledby="quote-step-3">
          <StepHead id="quote-step-3" n={3} title={vi.steps.contact.title} desc={vi.steps.contact.desc} />
          <ContactFields errors={errors} values={values} />
        </section>

        {/* Honeypot: invisible to humans, visible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        <div className="lh-quote-submit">
          <button type="submit" className="lh-btn lh-btn--lg" disabled={pending}>
            {pending ? vi.submitting : vi.submit}
          </button>
          {state.status === "error" && state.message && (
            <p className="lh-quote-error-text" role="alert">
              {state.message}
            </p>
          )}
        </div>
      </form>

      {(state.status === "priced" || state.status === "manual_required") && (
        <QuoteResult
          ref={resultRef}
          state={state}
          onReset={() => {
            setSelected(EMPTY_SELECTED);
            formRef.current?.querySelector<HTMLInputElement>("#quote-position")?.focus();
          }}
        />
      )}
    </div>
  );
}

function StepHead({ id, n, title, desc }: { id: string; n: number; title: string; desc: string }) {
  return (
    <div className="lh-quote-step__head">
      <span className="lh-quote-step__num" aria-hidden="true">{n}</span>
      <div>
        <h4 id={id} className="lh-quote-step__title">{title}</h4>
        <p className="lh-quote-step__desc">{desc}</p>
      </div>
    </div>
  );
}
