"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type Active,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
  type Over,
} from "@dnd-kit/core";
import Image from "next/image";
import { createPortal, flushSync } from "react-dom";
import { useActionState, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import logo from "@/assets/brand/logo-on-light.png";
import { createQuoteAction } from "@/app/lien-he/quote-action";
import { initialQuoteState, type QuoteFormState, type QuoteFormValues } from "@/app/lien-he/quote-state";
import { BtnIco, Ico } from "@/components/mk/ui";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { RULES } from "@/content/quote/classification";
import { vi } from "@/content/quote/labels.vi";
import { site } from "@/content/site";
import { classify, type QuoteType } from "@/lib/quote/classify";
import { POSITION_MAX, POSITION_MIN, QUANTITY_MAX } from "@/lib/quote/limits";
import { contactSchema, quoteInputSchema } from "@/lib/quote/schema";
import { ContactFields } from "./ContactFields";
import { CardGhost, Deck, Req, cardKey, type CardData } from "./Deck";
import { SlotRows } from "./Paper";
import { QuoteResult, type ResultState } from "./QuoteResult";
import { EMPTY_SELECTED, applyAdd, applyRemove, isValueSelected, valuesForGroup, type SelectedState } from "./selection";
import { fill } from "./text";
import { useFlight } from "./useFlight";

type Snap = { position: string; quantity: string; name: string; company: string; email: string; phone: string };
const EMPTY_SNAP: Snap = { position: "", quantity: "1", name: "", company: "", email: "", phone: "" };

function readSnap(form: HTMLFormElement): Snap {
  const fd = new FormData(form);
  const get = (k: string) => String(fd.get(k) ?? "");
  return {
    position: get("line.position"),
    quantity: get("line.quantity"),
    name: get("contact.name"),
    company: get("contact.company"),
    email: get("contact.email"),
    phone: get("contact.phone"),
  };
}

const asValues = (s: Snap): QuoteFormValues => ({
  "line.position": s.position,
  "line.quantity": s.quantity,
  "contact.name": s.name,
  "contact.company": s.company,
  "contact.email": s.email,
  "contact.phone": s.phone,
});

/** Same zod schema and key flattening as the Server Action, so client and server errors share keys. */
function validate(s: Snap, sel: SelectedState): Record<string, string> {
  const parsed = quoteInputSchema.safeParse({
    contact: { name: s.name, company: s.company, email: s.email, phone: s.phone },
    lines: [
      {
        position: s.position,
        industries: sel.industries,
        languages: sel.languages,
        experience: sel.experience ?? "",
        region: sel.region ?? "",
        education: sel.education ?? "",
        quantity: s.quantity,
      },
    ],
  });
  if (parsed.success) return {};
  const out: Record<string, string> = {};
  for (const iss of parsed.error.issues) {
    const k = iss.path.join(".");
    if (!(k in out)) out[k] = iss.message;
  }
  return localize(out);
}

// zod's enum message is generic English; the slot gets the mock's wording instead.
function localize(errors: Record<string, string>): Record<string, string> {
  const out = { ...errors };
  for (const g of CATALOG) {
    const k = `lines.0.${g.key}`;
    if (out[k]) out[k] = fill(g.selectType === "multi" ? vi.sheet.slotErrorMulti : vi.sheet.slotErrorSingle, { group: g.label.toLowerCase() });
  }
  return out;
}

const ERROR_ORDER = [
  "lines.0.position",
  "lines.0.quantity",
  ...CATALOG.map((g) => `lines.0.${g.key}`),
  "contact.name",
  "contact.company",
  "contact.email",
  "contact.phone",
];
const FIELD_ID: Record<string, string> = {
  "lines.0.position": "bg-position",
  "lines.0.quantity": "bg-quantity",
  "contact.name": "bg-name",
  "contact.company": "bg-company",
  "contact.email": "bg-email",
  "contact.phone": "bg-phone",
};

/** Badge on the sheet: Hunt as soon as any Hunt rule is met, Mass only once both deciding groups are known. */
function previewType(s: SelectedState): QuoteType | null {
  if (
    (s.education && RULES.huntEducation.includes(s.education)) ||
    (s.experience && RULES.huntExperience.includes(s.experience)) ||
    (RULES.huntOnAnyLanguage && s.languages.length > 0)
  ) {
    return "hunt";
  }
  if (!s.education || !s.experience) return null;
  return classify({ education: s.education, experience: s.experience, languages: s.languages });
}

const PROGRESS_KEYS = ["position", "industries", "experience", "region", "education", "contact"] as const;

const cardData = (a: Active | null | undefined) => a?.data.current as CardData | undefined;
const groupLabel = (g: GroupKey) => CATALOG.find((c) => c.key === g)?.label ?? g;
const overGroup = (over: Over | null) => (over ? (String(over.id).replace(/^row:/, "") as GroupKey) : null);

// Pointer drags follow the pointer like the mock's elementFromPoint; keyboard drags use rect overlap.
const collision: CollisionDetection = (args) => (args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args));

// Keyboard: Right arrow jumps the lifted card straight onto its own group's row.
const coordinateGetter: KeyboardCoordinateGetter = (event, { active, context }) => {
  if (event.code !== "ArrowRight") return undefined;
  const g = String(active).split(":")[1];
  const rect = context.droppableRects.get(`row:${g}`);
  if (!rect) return undefined;
  event.preventDefault();
  const h = context.collisionRect?.height ?? 0;
  return { x: rect.left + rect.width * 0.4, y: rect.top + rect.height / 2 - h / 2 };
};

const noop = () => () => {};
const today = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/**
 * Mock "tờ báo giá" board (lien-he.html#bao-gia): card deck on the left, a
 * paper sheet with one slot per group on the right. Cards go onto the sheet
 * by drag, click or keyboard; the selection is mirrored into hidden inputs and
 * the Server Action re-parses everything.
 */
export function QuoteBuilder() {
  const [selected, setSelected] = useState<SelectedState>(EMPTY_SELECTED);
  const [drag, setDrag] = useState<CardData | null>(null);
  const [snap, setSnap] = useState<Snap>(EMPTY_SNAP);
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState("");
  // Server errors stay visible until the customer touches the form again.
  const [seen, setSeen] = useState<QuoteFormState | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(createQuoteAction, initialQuoteState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<string | null>(null);
  const flight = useFlight([selected]);
  const date = useSyncExternalStore(noop, today, () => "");
  const client = useSyncExternalStore(noop, () => true, () => false);
  const getNode = flight.get;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Touch: hold, then drag (the page still scrolls); a tap is a click.
    useSensor(TouchSensor, { activationConstraint: { delay: 260, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
      coordinateGetter,
    }),
  );

  const done = state.status === "priced" || state.status === "manual_required";
  const locked = done && dismissed !== state.code;
  const result = locked ? (state as ResultState) : null;

  useEffect(() => {
    if (state.status === "idle") return;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (state.status === "error") {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      target?.scrollIntoView({ behavior, block: "center" });
      target?.focus({ preventScroll: true });
      return;
    }
    resultRef.current?.scrollIntoView({ behavior, block: "nearest" });
    resultRef.current?.focus({ preventScroll: true });
  }, [state]);

  // Cards hide once placed; keep keyboard focus on the board instead of losing it to <body>.
  useLayoutEffect(() => {
    const key = focusNext.current;
    focusNext.current = null;
    if (key) getNode(key)?.focus({ preventScroll: true });
  }, [selected, getNode]);

  function touched() {
    setSeen(state);
  }

  function add(g: GroupKey, value: string, label: string, from: DOMRect | null) {
    if (locked || isValueSelected(selected, g, value)) return;
    const group = CATALOG.find((c) => c.key === g)!;
    const prev = group.selectType === "single" ? valuesForGroup(selected, g)[0] : undefined;
    const next = applyAdd(selected, g, value);
    setSelected(next);
    touched();
    flight.launch(`chip:${cardKey(g, value)}`, from);
    if (prev) flight.launch(`card:${cardKey(g, prev)}`, flight.get(`chip:${cardKey(g, prev)}`)?.getBoundingClientRect());
    flight.pulse(`slot:${g}`);
    const left = group.options.filter((o) => !isValueSelected(next, g, o.value));
    const after = group.options.findIndex((o) => o.value === value);
    const stay = left.find((o) => group.options.indexOf(o) > after) ?? left[0];
    focusNext.current = stay ? `card:${cardKey(g, stay.value)}` : `chip:${cardKey(g, value)}`;
    setStatus(fill(vi.sheet.announce, { verb: prev ? vi.board.replaced : vi.board.added, label, group: group.label }));
  }

  function remove(g: GroupKey, value: string, label: string, el: HTMLElement) {
    if (locked) return;
    setSelected((s) => applyRemove(s, g, value));
    touched();
    flight.launch(`card:${cardKey(g, value)}`, el.getBoundingClientRect());
    focusNext.current = `card:${cardKey(g, value)}`;
    setStatus(`${vi.board.removed} ${label}.`);
  }

  function handleDragStart(e: DragStartEvent) {
    setDrag(cardData(e.active) ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setDrag(null);
    const data = cardData(e.active);
    if (!data) return;
    const from = (e.active.rect.current.translated as DOMRect | null) ?? null;
    const target = overGroup(e.over);
    if (target === data.groupKey) {
      add(data.groupKey, data.value, data.label, from);
      if (e.activatorEvent instanceof KeyboardEvent) flight.get(`slot:${target}`)?.scrollIntoView({ block: "nearest" });
    } else if (target) {
      setStatus(fill(vi.sheet.wrongSlot, { group: groupLabel(data.groupKey) }));
      flight.shake(`row:${target}`);
    } else {
      flight.flyNow(`card:${cardKey(data.groupKey, data.value)}`, from);
    }
  }

  function readForm() {
    if (locked || !formRef.current) return;
    setSnap(readSnap(formRef.current));
    touched();
  }

  function stepQuantity(delta: number) {
    const input = formRef.current?.elements.namedItem("line.quantity");
    if (locked || !(input instanceof HTMLInputElement)) return;
    const n = parseInt(input.value, 10) || 1;
    input.value = String(Math.max(1, Math.min(QUANTITY_MAX, n + delta)));
    readForm();
  }

  function focusFirst(errs: Record<string, string>) {
    const form = formRef.current;
    const k = ERROR_ORDER.find((key) => errs[key]);
    if (!form || !k) return;
    const g = k.startsWith("lines.0.") && !FIELD_ID[k] ? k.slice(8) : null;
    const target = g
      ? form.querySelector<HTMLElement>(`[data-pool="${g}"] [data-card]:not([hidden])`)
      : form.querySelector<HTMLElement>(`#${FIELD_ID[k]}`);
    if (!target) return;
    target.focus({ preventScroll: true });
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (locked || pending) {
      e.preventDefault();
      return;
    }
    const s = readSnap(e.currentTarget);
    setSnap(s);
    setTried(true);
    const errs = validate(s, selected);
    if (Object.keys(errs).length > 0) {
      // Cancels the Server Action; the server would answer with the same keys.
      e.preventDefault();
      focusFirst(errs);
    }
  }

  function print() {
    const root = document.documentElement;
    const title = document.title;
    if (result) document.title = `BaoGia-${result.code}`;
    root.classList.add("qd-printing");
    const clean = () => {
      root.classList.remove("qd-printing");
      document.title = title;
      window.removeEventListener("afterprint", clean);
    };
    window.addEventListener("afterprint", clean);
    window.print();
  }

  function reset() {
    flushSync(() => {
      setDismissed(state.status === "priced" || state.status === "manual_required" ? state.code : null);
      setSelected(EMPTY_SELECTED);
      setSnap(EMPTY_SNAP);
      setTried(false);
      setSeen(state);
    });
    formRef.current?.reset();
    setStatus(vi.sheet.reset);
    formRef.current?.querySelector<HTMLInputElement>("#bg-position")?.focus();
  }

  const serverActive = state.status === "error" && seen !== state;
  const clientErrors = tried ? validate(snap, selected) : {};
  const errors: Record<string, string> = locked
    ? {}
    : { ...(serverActive && state.status === "error" ? localize(state.errors) : {}), ...clientErrors };
  const clientCount = Object.keys(clientErrors).length;
  const formMessage =
    tried && clientCount > 0
      ? fill(vi.sheet.formErrors, { n: clientCount })
      : serverActive && state.status === "error"
        ? state.message
        : "";

  const posLen = snap.position.trim().length;
  const progress: Record<(typeof PROGRESS_KEYS)[number], boolean> = {
    position: posLen >= POSITION_MIN && posLen <= POSITION_MAX,
    industries: selected.industries.length > 0,
    experience: Boolean(selected.experience),
    region: Boolean(selected.region),
    education: Boolean(selected.education),
    contact: contactSchema.safeParse({ name: snap.name, company: snap.company, email: snap.email, phone: snap.phone }).success,
  };
  const doneCount = PROGRESS_KEYS.filter((k) => progress[k]).length;
  const ready = doneCount === PROGRESS_KEYS.length;
  const count = `${doneCount}/${PROGRESS_KEYS.length}`;
  const type = previewType(selected);

  const picked = (g: GroupKey) =>
    CATALOG.find((c) => c.key === g)!.options.filter((o) => isValueSelected(selected, g, o.value)).map((o) => o.label);
  const summary =
    `${snap.position.trim()} x ${snap.quantity} ${vi.sheetResult.unit}` +
    CATALOG.filter((g) => picked(g.key).length)
      .map((g) => ` · ${g.label}: ${picked(g.key).join(", ")}`)
      .join("");
  const mailHref = result ? buildMail(result, snap, picked) : "";

  const formCls = ["qd-board", drag && "is-dragging", ready && "is-ready", locked && "is-locked"].filter(Boolean).join(" ");
  const posError = errors["lines.0.position"];
  const qtyError = errors["lines.0.quantity"];

  return (
    <form ref={formRef} className={formCls} action={formAction} onSubmit={onSubmit} onInput={readForm} noValidate aria-busy={pending || undefined}>
      <div className="qd-dock">
        <span>
          <b>{count}</b> {vi.sheet.dockRequired}
        </span>
        <a href="#qd-paper">
          {vi.sheet.dockLink}
          <Ico name="arrow-right" />
        </a>
      </div>

      <DndContext
        id="quote-board-dnd"
        sensors={sensors}
        collisionDetection={collision}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDrag(null)}
        accessibility={{
          screenReaderInstructions: { draggable: vi.sheet.drag.instructions },
          announcements: {
            onDragStart: ({ active }) => {
              const d = cardData(active);
              return d ? fill(vi.sheet.drag.start, { label: d.label, group: groupLabel(d.groupKey) }) : undefined;
            },
            onDragOver: ({ active, over }) => {
              const d = cardData(active);
              if (!d) return undefined;
              const g = overGroup(over);
              return g ? fill(vi.sheet.drag.over, { label: d.label, row: groupLabel(g) }) : fill(vi.sheet.drag.move, { label: d.label });
            },
            // add()/handleDragEnd already report the outcome through the board's own live region.
            onDragEnd: () => undefined,
            onDragCancel: ({ active }) => {
              const d = cardData(active);
              return d ? fill(vi.sheet.drag.cancel, { label: d.label }) : undefined;
            },
          },
        }}
      >
        <Deck selected={selected} locked={locked} dragging={drag !== null} register={flight.register} onPick={(g, v, label, el) => add(g, v, label, el.getBoundingClientRect())} />

        <div className="qd-desk">
          <div className="qd-progress">
            <p className="qd-progress-head">
              <span>{vi.board.progress}</span>
              <strong>{count}</strong>
            </p>
            <ol className="qd-progress-steps">
              {PROGRESS_KEYS.map((k) => (
                <li key={k} className={progress[k] ? "is-done" : undefined}>
                  <span className="qd-bar" aria-hidden="true" />
                  <span>{vi.board.progressItems[k]}</span>
                </li>
              ))}
            </ol>
          </div>

          <article className="qd-paper" id="qd-paper" aria-labelledby="qd-paper-title" data-stamped={locked ? "" : undefined}>
            <div className="qd-stamp-box" aria-hidden="true">
              <div className="qd-stamp">
                <span>{vi.board.stamp}</span>
                <strong>{vi.sheet.stampBrand}</strong>
              </div>
            </div>
            <header className="qd-letter">
              <Image src={logo} alt="Light Human" sizes="120px" />
              <div className="qd-doc">
                <p className="qd-doc-title" id="qd-paper-title">
                  {vi.board.sheetTitle}
                </p>
                <p className="qd-doc-no">
                  {vi.board.sheetNo}: <b>{result ? result.code : vi.sheet.codePending}</b>
                </p>
                <p className="qd-doc-date">
                  {vi.sheet.date} {date}
                </p>
              </div>
            </header>
            <p className="qd-to">
              {vi.sheet.to} <b>{snap.company.trim() || vi.sheet.toFallback}</b>
            </p>

            <div className="qd-rows">
              <div className="qd-row qd-row-pos">
                <label className="qd-row-k" htmlFor="bg-position">
                  <span>
                    {vi.position}
                    <Req />
                  </span>
                  <small>{vi.positionHint}</small>
                </label>
                <div className="qd-line">
                  <input
                    className="qd-input"
                    id="bg-position"
                    name="line.position"
                    type="text"
                    maxLength={POSITION_MAX}
                    autoComplete="organization-title"
                    placeholder={vi.positionPlaceholder}
                    defaultValue={snap.position}
                    readOnly={locked}
                    aria-invalid={posError ? true : undefined}
                    aria-describedby="qd-e-position"
                  />
                  <div className="qd-qty">
                    <button type="button" className="qd-qty-btn" aria-label={vi.sheet.qtyMinus} aria-controls="bg-quantity" disabled={locked} onClick={() => stepQuantity(-1)}>
                      <Ico name="minus" />
                    </button>
                    <input
                      className="qd-input"
                      id="bg-quantity"
                      name="line.quantity"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={QUANTITY_MAX}
                      step={1}
                      defaultValue={snap.quantity}
                      readOnly={locked}
                      aria-label={vi.quantity}
                      aria-invalid={qtyError ? true : undefined}
                      aria-describedby="qd-e-quantity"
                    />
                    <button type="button" className="qd-qty-btn" aria-label={vi.sheet.qtyPlus} aria-controls="bg-quantity" disabled={locked} onClick={() => stepQuantity(1)}>
                      <Ico name="plus" />
                    </button>
                    <span className="qd-qty-unit">{vi.sheet.qtyUnit}</span>
                  </div>
                </div>
                <p className="qd-err" id="qd-e-position">
                  {posError}
                </p>
                <p className="qd-err" id="qd-e-quantity">
                  {qtyError}
                </p>
              </div>
              <SlotRows
                selected={selected}
                dragGroup={drag?.groupKey ?? null}
                locked={locked}
                errors={errors}
                register={flight.register}
                onRemove={remove}
              />
            </div>

            <div className="qd-sum">
              <p className="qd-type">
                <span className="qd-type-k">{vi.panel.typeLabel}</span>
                <strong className="qd-badge" data-quote-type={type ?? "pending"}>
                  {type ? vi.types[type] : vi.panel.typePending}
                </strong>
              </p>
              <p className="qd-fee">
                <span className="qd-type-k">{vi.sheet.feeLabel}</span>
                <strong>{vi.sheet.feeValue}</strong>
              </p>
              <p className="qd-fine">
                {vi.panel.typeNote} {vi.sheet.feeNote}
              </p>
            </div>

            <ContactFields errors={errors} values={asValues(snap)} locked={locked} />
            {/* Honeypot: invisible to humans, filled by bots. */}
            <input className="sr-only" id="bg-website" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="qd-actions" hidden={locked}>
              <p className={`qd-ready${ready ? " is-ready" : ""}`}>{ready ? vi.sheet.ready : vi.sheet.notReady}</p>
              <button className="btn btn-gold" type="submit" disabled={pending}>
                <span>{pending ? vi.submitting : vi.submit}</span>
                <BtnIco />
              </button>
              <p className="qd-form-err" role="alert">
                {formMessage}
              </p>
            </div>

            <footer className="qd-paper-foot">
              <p>{vi.sheet.footCompany}</p>
              <p>
                {site.contact.address} · {site.contact.phone} · {site.contact.email}
              </p>
            </footer>
          </article>

          {result && <QuoteResult ref={resultRef} state={result} summary={summary} mailHref={mailHref} onPrint={print} onReset={reset} />}
        </div>

        {/* Portalled: a transformed ancestor would offset the fixed overlay. */}
        {client &&
          createPortal(<DragOverlay dropAnimation={null}>{drag ? <CardGhost label={drag.label} /> : null}</DragOverlay>, document.body)}
      </DndContext>

      {/* Mirrors of client state for the Server Action, which re-parses them. */}
      {selected.industries.map((v) => (
        <input key={`i-${v}`} type="hidden" name="line.industries" value={v} />
      ))}
      {selected.languages.map((v) => (
        <input key={`l-${v}`} type="hidden" name="line.languages" value={v} />
      ))}
      {selected.experience && <input type="hidden" name="line.experience" value={selected.experience} />}
      {selected.region && <input type="hidden" name="line.region" value={selected.region} />}
      {selected.education && <input type="hidden" name="line.education" value={selected.education} />}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </form>
  );
}

function buildMail(result: ResultState, s: Snap, picked: (g: GroupKey) => string[]): string {
  const t = vi.sheetResult;
  const lines = [
    `- ${vi.position}: ${s.position.trim()} (${s.quantity} ${t.unit})`,
    ...CATALOG.map((g) => `- ${g.label}: ${picked(g.key).join(", ") || t.none}`),
    `- ${t.mailType}: ${vi.types[result.type]}`,
  ];
  const body = [
    t.mailGreeting,
    "",
    t.mailIntro,
    ...lines,
    "",
    `${t.mailCode}: ${result.code}`,
    `${t.mailPerson}: ${s.name.trim()} - ${s.company.trim()}`,
    `${t.mailEmail}: ${s.email.trim()}`,
    `${t.mailPhone}: ${s.phone.trim()}`,
  ].join("\n");
  const subject = fill(t.mailSubject, { code: result.code, position: s.position.trim() });
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
