"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useActionState, useMemo, useState } from "react";
import {
  createQuoteAction,
  initialQuoteState,
} from "@/app/lien-he/quote-action";
import {
  type EducationValue,
  type ExperienceValue,
  type GroupKey,
  type IndustryValue,
  type LanguageValue,
  type RegionValue,
} from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { classify, type QuoteType } from "@/lib/quote/classify";
import { POSITION_MAX, POSITION_MIN } from "@/lib/quote/limits";
import { ContactFields } from "./ContactFields";
import { CriteriaBoard } from "./CriteriaBoard";
import { CriteriaPalette } from "./CriteriaPalette";
import { QuoteResult } from "./QuoteResult";

type SelectedState = {
  industries: IndustryValue[];
  languages: LanguageValue[];
  experience: ExperienceValue | null;
  region: RegionValue | null;
  education: EducationValue | null;
};

const EMPTY_SELECTED: SelectedState = {
  industries: [],
  languages: [],
  experience: null,
  region: null,
  education: null,
};

const LINE_ERROR_KEYS = [
  "lines.0.industries",
  "lines.0.experience",
  "lines.0.region",
  "lines.0.education",
] as const;

/**
 * Root client component for the drag-and-drop quote builder embedded in
 * /lien-he (`<ContactSplit />`). Holds selection state, wires DndContext with
 * keyboard+click fallbacks, and submits via a React 19 Server Action.
 */
export function QuoteBuilder() {
  const [selected, setSelected] = useState<SelectedState>(EMPTY_SELECTED);
  const [state, formAction, pending] = useActionState(
    createQuoteAction,
    initialQuoteState,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over) return;
    const activeData = e.active.data.current as
      | { groupKey: GroupKey; value: string }
      | undefined;
    const overData = e.over.data.current as { groupKey: GroupKey } | undefined;
    if (!activeData || !overData) return;
    if (activeData.groupKey !== overData.groupKey) return;
    setSelected((s) => applyAdd(s, activeData.groupKey, activeData.value));
  }

  function toggle(groupKey: GroupKey, value: string) {
    setSelected((s) => applyToggle(s, groupKey, value));
  }
  function remove(groupKey: GroupKey, value: string) {
    setSelected((s) => applyRemove(s, groupKey, value));
  }

  // Suggested type (client-side preview). Server re-computes and is the source of truth.
  const suggestion: QuoteType | null = useMemo(() => {
    if (!selected.education || !selected.experience) return null;
    return classify({
      education: selected.education,
      experience: selected.experience,
      languages: selected.languages,
    });
  }, [selected.education, selected.experience, selected.languages]);

  const multiLanguage = selected.languages.length >= 2;

  const errors: Record<string, string> = state.status === "error" ? state.errors : {};
  const values =
    state.status === "error"
      ? state.values
      : ({} as Partial<Record<string, string>>);
  const boardInlineError = LINE_ERROR_KEYS.map((k) => errors[k]).find(Boolean);

  const showResult =
    state.status === "priced" ||
    state.status === "manual_required" ||
    state.status === "error";

  return (
    <div className="lh-quote-builder">
      {/* Polite live region for SR users. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state.status === "priced" && `Đã có báo giá ${state.code}.`}
        {state.status === "manual_required" &&
          `Yêu cầu ${state.code} đã được chuyển cho đội BD.`}
        {state.status === "error" && state.message}
      </div>

      <DndContext
        id="quote-builder-dnd"
        sensors={sensors}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) => `Đã nhấc thẻ ${String(active.id)}.`,
            onDragOver: ({ active, over }) =>
              over
                ? `Thẻ ${String(active.id)} đang ở trên nhóm ${String(over.id)}.`
                : `Thẻ ${String(active.id)} đang kéo.`,
            onDragEnd: ({ active, over }) =>
              over
                ? `Đã thả thẻ ${String(active.id)} vào nhóm ${String(over.id)}.`
                : `Đã huỷ kéo.`,
            onDragCancel: ({ active }) => `Đã huỷ kéo thẻ ${String(active.id)}.`,
          },
        }}
      >
        <div className="lh-quote-grid">
          <CriteriaPalette selected={selected} onToggle={toggle} />
          <CriteriaBoard
            selected={selected}
            onRemove={remove}
            multiLanguage={multiLanguage}
            inlineError={boardInlineError}
          />
        </div>
      </DndContext>

      <div className="lh-quote-summary">
        <div className="lh-quote-summary__row">
          <span className="lh-quote-summary__label">{vi.typeSuggestion}</span>
          <TypeBadge type={suggestion} />
        </div>
        <span className="lh-quote-note">{vi.typeNote}</span>
      </div>

      <form
        action={formAction}
        className="lh-quote-form"
        aria-busy={pending || undefined}
      >
        {/* Hidden mirrors of client state → server. */}
        {selected.industries.map((v) => (
          <input
            key={`i-${v}`}
            type="hidden"
            name="line.industries"
            value={v}
          />
        ))}
        {selected.languages.map((v) => (
          <input key={`l-${v}`} type="hidden" name="line.languages" value={v} />
        ))}
        {selected.experience && (
          <input
            type="hidden"
            name="line.experience"
            value={selected.experience}
          />
        )}
        {selected.region && (
          <input type="hidden" name="line.region" value={selected.region} />
        )}
        {selected.education && (
          <input
            type="hidden"
            name="line.education"
            value={selected.education}
          />
        )}

        <label htmlFor="quote-position" className="lh-field">
          <span className="lh-field__label">{vi.position} *</span>
          <input
            id="quote-position"
            type="text"
            name="line.position"
            minLength={POSITION_MIN}
            maxLength={POSITION_MAX}
            required
            placeholder={vi.positionPlaceholder}
            defaultValue={values["line.position"] ?? ""}
            className="lh-field__input"
            aria-invalid={errors["lines.0.position"] ? true : undefined}
            aria-describedby={
              errors["lines.0.position"] ? "quote-position-error" : "quote-position-hint"
            }
          />
          {errors["lines.0.position"] && (
            <span id="quote-position-error" className="lh-quote-error-text">
              {errors["lines.0.position"]}
            </span>
          )}
          <span id="quote-position-hint" className="lh-quote-note">
            {vi.positionHint}
          </span>
        </label>

        <label htmlFor="quote-quantity" className="lh-field">
          <span className="lh-field__label">{vi.quantity} *</span>
          <input
            id="quote-quantity"
            type="number"
            name="line.quantity"
            min={1}
            max={10000}
            step={1}
            required
            defaultValue={values["line.quantity"] ?? "1"}
            className="lh-field__input"
            aria-invalid={errors["lines.0.quantity"] ? true : undefined}
            aria-describedby={
              errors["lines.0.quantity"] ? "quote-quantity-error" : undefined
            }
          />
          {errors["lines.0.quantity"] && (
            <span id="quote-quantity-error" className="lh-quote-error-text">
              {errors["lines.0.quantity"]}
            </span>
          )}
          <span className="lh-quote-note">{vi.quantityHint}</span>
        </label>

        <ContactFields errors={errors} values={values} />

        {/* Honeypot — invisible to humans, visible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        {state.status === "error" && state.message && (
          <p className="lh-quote-error-text" role="alert">
            {state.message}
          </p>
        )}

        <button type="submit" className="lh-btn lh-btn--lg" disabled={pending}>
          {pending ? vi.submitting : vi.submit}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      {showResult && (
        <QuoteResult state={state} onReset={() => setSelected(EMPTY_SELECTED)} />
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: QuoteType | null }) {
  if (type === "mass") {
    return (
      <span className="lh-quote-type-badge lh-quote-type-badge--mass">
        {vi.types.mass}
      </span>
    );
  }
  if (type === "hunt") {
    return (
      <span className="lh-quote-type-badge lh-quote-type-badge--hunt">
        {vi.types.hunt}
      </span>
    );
  }
  return (
    <span className="lh-quote-type-badge lh-quote-type-badge--pending">
      Chưa đủ thông tin
    </span>
  );
}

// ---- Pure selected-state transforms ----------------------------------------

function applyAdd(s: SelectedState, groupKey: GroupKey, value: string): SelectedState {
  switch (groupKey) {
    case "industries": {
      const v = value as IndustryValue;
      if (s.industries.includes(v)) return s;
      return { ...s, industries: [...s.industries, v] };
    }
    case "languages": {
      const v = value as LanguageValue;
      if (s.languages.includes(v)) return s;
      return { ...s, languages: [...s.languages, v] };
    }
    case "experience":
      return { ...s, experience: value as ExperienceValue };
    case "region":
      return { ...s, region: value as RegionValue };
    case "education":
      return { ...s, education: value as EducationValue };
  }
}

function applyRemove(s: SelectedState, groupKey: GroupKey, value: string): SelectedState {
  switch (groupKey) {
    case "industries":
      return { ...s, industries: s.industries.filter((v) => v !== value) };
    case "languages":
      return { ...s, languages: s.languages.filter((v) => v !== value) };
    case "experience":
      return { ...s, experience: null };
    case "region":
      return { ...s, region: null };
    case "education":
      return { ...s, education: null };
  }
}

function applyToggle(s: SelectedState, groupKey: GroupKey, value: string): SelectedState {
  switch (groupKey) {
    case "industries": {
      const v = value as IndustryValue;
      return s.industries.includes(v)
        ? { ...s, industries: s.industries.filter((x) => x !== v) }
        : { ...s, industries: [...s.industries, v] };
    }
    case "languages": {
      const v = value as LanguageValue;
      return s.languages.includes(v)
        ? { ...s, languages: s.languages.filter((x) => x !== v) }
        : { ...s, languages: [...s.languages, v] };
    }
    case "experience":
      return {
        ...s,
        experience: s.experience === value ? null : (value as ExperienceValue),
      };
    case "region":
      return {
        ...s,
        region: s.region === value ? null : (value as RegionValue),
      };
    case "education":
      return {
        ...s,
        education: s.education === value ? null : (value as EducationValue),
      };
  }
}
