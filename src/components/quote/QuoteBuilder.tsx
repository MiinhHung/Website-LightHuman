"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
  type Active,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Image from "next/image";
import { useActionState, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import logo from "@/assets/brand/logo-on-light.png";
import { createQuoteAction } from "@/app/lien-he/quote-action";
import { initialQuoteState } from "@/app/lien-he/quote-state";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { classify, type QuoteType } from "@/lib/quote/classify";
import { POSITION_MAX, POSITION_MIN, QUANTITY_MAX } from "@/lib/quote/limits";
import { CardDeck, CardGhost, DECK_ID, cardKey, type CardData } from "./CardDeck";
import { ContactFields } from "./ContactFields";
import { QuoteResult } from "./QuoteResult";
import { SheetSlots } from "./SheetSlots";
import { EMPTY_SELECTED, applyAdd, applyRemove, valuesForGroup, type SelectedState } from "./selection";
import { useFlight } from "./useFlight";

const SHEET_ID = "sheet";

const LINE_ERROR_KEYS = [
  "lines.0.industries",
  "lines.0.experience",
  "lines.0.region",
  "lines.0.education",
] as const;

const PROGRESS_KEYS = ["position", "industries", "experience", "region", "education", "contact"] as const;

function chipLabel(active: Active): string {
  return (active.data.current as CardData | undefined)?.label ?? String(active.id);
}

// Pointer position decides the target (the sheet is large); keyboard drags fall back to rect overlap.
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
};

/** Next required group still empty after `from`, wrapping around; null when all are filled. */
function nextOpenGroup(s: SelectedState, from: GroupKey): GroupKey | null {
  const i = CATALOG.findIndex((g) => g.key === from);
  const order = [...CATALOG.slice(i + 1), ...CATALOG.slice(0, i + 1)];
  return order.find((g) => g.required && valuesForGroup(s, g.key).length === 0)?.key ?? null;
}

/**
 * Quote builder embedded in /lien-he: a card deck on the left and a printable
 * quote sheet on the right. Cards fly onto the sheet (drag, click or keyboard);
 * client selection is mirrored into hidden inputs and the server re-validates
 * everything. Prices only appear after the Server Action responds.
 */
export function QuoteBuilder() {
  const [selected, setSelected] = useState<SelectedState>(EMPTY_SELECTED);
  const [dragging, setDragging] = useState<CardData | null>(null);
  const [activeGroup, setActiveGroup] = useState<GroupKey>(CATALOG[0].key);
  const [status, setStatus] = useState("");
  const [fields, setFields] = useState({ position: false, contact: false });
  const [dismissed, setDismissed] = useState<string | null>(null);
  // React resets the form after a successful action; keep what was sent so the stamped sheet can show it.
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(createQuoteAction, initialQuoteState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const criteriaErrorRef = useRef<HTMLParagraphElement>(null);
  const flight = useFlight([selected, activeGroup]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Touch: a short press starts the drag so the page can still scroll; a tap is a click.
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const done = state.status === "priced" || state.status === "manual_required";
  const showResult = done && dismissed !== state.code;

  // The result renders at the foot of the sheet; move focus so the outcome is not missed.
  useEffect(() => {
    if (state.status === "idle") return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
    if (state.status === "error") {
      const target =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? criteriaErrorRef.current;
      if (target) {
        target.scrollIntoView({ behavior, block: "center" });
        target.focus({ preventScroll: true });
        return;
      }
    }
    resultRef.current?.scrollIntoView({ behavior, block: "center" });
    resultRef.current?.focus({ preventScroll: true });
  }, [state]);

  function add(g: GroupKey, value: string, label: string, from: DOMRect | null) {
    const group = CATALOG.find((c) => c.key === g);
    const previous = group?.selectType === "single" ? valuesForGroup(selected, g)[0] : undefined;
    const next = applyAdd(selected, g, value);
    setSelected(next);
    flight.launch(`sheet:${cardKey(g, value)}`, from);
    window.setTimeout(() => flight.pulse(`slot:${g}`), 420);
    if (group?.selectType === "single") {
      const open = nextOpenGroup(next, g);
      if (open) setActiveGroup(open);
    }
    const prevLabel = previous ? group?.options.find((o) => o.value === previous)?.label : null;
    setStatus(prevLabel ? `${vi.board.replaced} ${label} (bỏ ${prevLabel})` : `${vi.board.added} ${label}`);
  }

  function remove(g: GroupKey, value: string, label: string, from: DOMRect | null) {
    setSelected((s) => applyRemove(s, g, value));
    setActiveGroup(g);
    flight.launch(`deck:${cardKey(g, value)}`, from);
    setStatus(`${vi.board.removed} ${label}`);
  }

  function handleDragStart(e: DragStartEvent) {
    setDragging((e.active.data.current as CardData | undefined) ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setDragging(null);
    const data = e.active.data.current as CardData | undefined;
    const overId = e.over ? String(e.over.id) : null;
    if (!data || !overId) return;
    const from = (e.active.rect.current.translated as DOMRect | null) ?? null;
    const onSheet = overId === SHEET_ID || overId.startsWith("slot:");
    if (data.from === "deck" && onSheet) add(data.groupKey, data.value, data.label, from);
    else if (data.from === "sheet" && overId === DECK_ID) remove(data.groupKey, data.value, data.label, from);
  }

  function readForm() {
    const f = formRef.current;
    if (!f) return;
    const fd = new FormData(f);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    setFields({
      position: get("line.position").length >= POSITION_MIN,
      contact: Boolean(get("contact.name") && get("contact.company") && (get("contact.email") || get("contact.phone"))),
    });
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

  const progress: Record<(typeof PROGRESS_KEYS)[number], boolean> = {
    position: fields.position || (values["line.position"]?.trim().length ?? 0) >= POSITION_MIN,
    industries: selected.industries.length > 0,
    experience: Boolean(selected.experience),
    region: Boolean(selected.region),
    education: Boolean(selected.education),
    contact: fields.contact,
  };
  const doneCount = PROGRESS_KEYS.filter((k) => progress[k]).length;
  const ready = doneCount === PROGRESS_KEYS.length;

  return (
    <form
      ref={formRef}
      action={formAction}
      onInput={readForm}
      onSubmit={(e) => {
        const fd = new FormData(e.currentTarget);
        setSubmitted(Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)])));
      }}
      className="lh-qb"
      aria-busy={pending || undefined}
    >
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

      <DndContext
        id="quote-builder-dnd"
        sensors={sensors}
        collisionDetection={collision}
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
        <div className="lh-qb__board" data-dragging={dragging ? dragging.from : undefined}>
          <CardDeck
            selected={selected}
            active={activeGroup}
            onTab={setActiveGroup}
            onPick={(g, v, label, el) => add(g, v, label, el.getBoundingClientRect())}
            onNext={() => setActiveGroup(nextOpenGroup(selected, activeGroup) ?? activeGroup)}
            dragging={dragging}
            register={flight.register}
            status={status}
            locked={showResult}
          />

          <Sheet dragging={dragging} printing={pending} stamped={showResult}>
            <header className="lh-qb-sheet__letterhead">
              <Image src={logo} alt="Light Human" className="lh-qb-sheet__logo" sizes="120px" />
              <div className="lh-qb-sheet__doc">
                <p className="lh-qb-sheet__doc-title">{vi.board.sheetTitle}</p>
                <p className="lh-qb-sheet__doc-no">
                  {vi.board.sheetNo}: <span>{showResult ? state.code : `BG-······ (${vi.board.sheetNoPending})`}</span>
                </p>
              </div>
            </header>

            <div className="lh-qb-sheet__meta">
              <span>{vi.board.sheetTo}</span>
              <span>{vi.board.sheetFrom}</span>
            </div>

            <ProgressBar progress={progress} doneCount={doneCount} />

            {showResult ? (
              <dl className="lh-qb-printed">
                <div>
                  <dt>{vi.position}</dt>
                  <dd>{submitted["line.position"]}</dd>
                </div>
                <div>
                  <dt>{vi.quantity}</dt>
                  <dd>{submitted["line.quantity"]}</dd>
                </div>
              </dl>
            ) : (
            <div className="lh-qb-sheet__position">
              <label htmlFor="quote-position" className="lh-qb-line">
                <span className="lh-qb-line__label">
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
                  className="lh-qb-line__input"
                  aria-invalid={positionError ? true : undefined}
                  aria-describedby={positionError ? "quote-position-error" : undefined}
                />
                {positionError && (
                  <span id="quote-position-error" className="lh-quote-error-text">
                    {positionError}
                  </span>
                )}
              </label>
              <label htmlFor="quote-quantity" className="lh-qb-line lh-qb-line--qty">
                <span className="lh-qb-line__label">
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
                  className="lh-qb-line__input"
                  aria-invalid={quantityError ? true : undefined}
                  aria-describedby={quantityError ? "quote-quantity-error" : undefined}
                />
                {quantityError && (
                  <span id="quote-quantity-error" className="lh-quote-error-text">
                    {quantityError}
                  </span>
                )}
              </label>
            </div>
            )}

            <section className="lh-qb-sheet__section" aria-labelledby="qb-req-title">
              <div className="lh-qb-sheet__section-head">
                <h4 id="qb-req-title">{vi.board.requirements}</h4>
                <span
                  className={`lh-quote-type-badge lh-quote-type-badge--${suggestion ?? "pending"}`}
                  title={vi.panel.typeNote}
                >
                  {suggestion ? vi.types[suggestion] : vi.panel.typePending}
                </span>
              </div>
              {criteriaError && (
                <p ref={criteriaErrorRef} tabIndex={-1} className="lh-quote-error-text" role="alert">
                  {criteriaError}
                </p>
              )}
              <SheetSlots
                selected={selected}
                dragging={dragging}
                locked={showResult}
                register={flight.register}
                onRemove={(g, v, label, el) => remove(g, v, label, el.getBoundingClientRect())}
              />
              {selected.languages.length >= 2 && <p className="lh-quote-note">{vi.panel.multiLanguage}</p>}
            </section>

            <section className="lh-qb-sheet__section" aria-labelledby="qb-contact-title">
              <div className="lh-qb-sheet__section-head">
                <h4 id="qb-contact-title">{vi.board.recipient}</h4>
              </div>
              {showResult ? (
                <dl className="lh-qb-printed">
                  {(["name", "company", "email", "phone"] as const).map((k) =>
                    submitted[`contact.${k}`] ? (
                      <div key={k}>
                        <dt>{vi.contact[k]}</dt>
                        <dd>{submitted[`contact.${k}`]}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              ) : (
                <ContactFields errors={errors} values={values} />
              )}
            </section>

            {/* Honeypot: invisible to humans, visible to bots. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

            {!showResult && (
            <div className="lh-qb-sheet__foot">
              <p className="lh-qb-sheet__price-note">{ready ? vi.board.ready : vi.board.priceAfter}</p>
              <button type="submit" className="lh-qb-submit" data-ready={ready ? "" : undefined} disabled={pending}>
                <Sparkles size={17} strokeWidth={2} aria-hidden="true" />
                {pending ? vi.submitting : vi.submit}
              </button>
              {state.status === "error" && state.message && (
                <p className="lh-quote-error-text" role="alert">
                  {state.message}
                </p>
              )}
            </div>
            )}

            {showResult && (
              <div className="lh-qb-stamp" aria-hidden="true">
                <span>{vi.board.stamp}</span>
                <strong>Light Human</strong>
                <span>✦ ✦ ✦</span>
              </div>
            )}
            {showResult && (
              <QuoteResult
                ref={resultRef}
                state={state}
                onReset={() => {
                  setDismissed(state.code);
                  setSelected(EMPTY_SELECTED);
                  setActiveGroup(CATALOG[0].key);
                  setStatus("");
                  formRef.current?.reset();
                  setFields({ position: false, contact: false });
                  formRef.current?.querySelector<HTMLInputElement>("#quote-position")?.focus();
                }}
              />
            )}
          </Sheet>
        </div>

        <DragOverlay dropAnimation={null}>{dragging ? <CardGhost card={dragging} /> : null}</DragOverlay>
      </DndContext>
    </form>
  );
}

/** The paper itself: the whole sheet is one drop target for deck cards. */
function Sheet({
  dragging,
  printing,
  stamped,
  children,
}: {
  dragging: CardData | null;
  printing: boolean;
  stamped: boolean;
  children: ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: SHEET_ID });
  // Slots sit inside the sheet and win the collision, so read the shared `over` instead of isOver.
  const { over } = useDndContext();
  const overId = over ? String(over.id) : "";
  const incoming = dragging?.from === "deck";
  const hovering = overId === SHEET_ID || overId.startsWith("slot:");
  return (
    <div
      ref={setNodeRef}
      className="lh-qb-sheet"
      data-incoming={incoming ? "" : undefined}
      data-over={incoming && hovering ? "" : undefined}
      data-printing={printing ? "" : undefined}
      data-stamped={stamped ? "" : undefined}
    >
      {incoming && (
        <div className="lh-qb-sheet__drop" aria-hidden="true">
          {vi.board.dropHere}
        </div>
      )}
      {children}
    </div>
  );
}

function ProgressBar({
  progress,
  doneCount,
}: {
  progress: Record<(typeof PROGRESS_KEYS)[number], boolean>;
  doneCount: number;
}) {
  return (
    <div className="lh-qb-progress">
      <div className="lh-qb-progress__head">
        <span>{vi.board.progress}</span>
        <strong>
          {doneCount}/{PROGRESS_KEYS.length}
        </strong>
      </div>
      <ol className="lh-qb-progress__steps">
        {PROGRESS_KEYS.map((k) => (
          <li key={k} data-done={progress[k] ? "" : undefined}>
            <span className="lh-qb-progress__bar" aria-hidden="true" />
            <span className="lh-qb-progress__label">{vi.board.progressItems[k]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
