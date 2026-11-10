
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Website portfolio for Light Human (headhunting + mass hiring). Vietnamese slugs for routes; Vietnamese for UI copy and conversation; English for code and technical comments.

## Commands

Dự án sử dụng **`npm`** làm package manager chuẩn (không dùng pnpm, không dùng corepack). File khoá chính là `package-lock.json`.

Các lệnh phổ biến:

| Nhiệm vụ | Lệnh |
| --- | --- |
| Dev server | `npm run dev` (Turbopack qua `@tailwindcss/turbopack`) |
| Production build | `npm run build` |
| Lint (flat config, `eslint-config-next@16`) | `npm run lint` |
| Typecheck (no emit) | `npm run typecheck` |
| Full test run (Vitest) | `npm test` |
| Watch tests | `npm run test:watch` |
| Single test file | `npx vitest run src/lib/quote/__tests__/classify.test.ts` |
| Single test by name | `npx vitest run -t 'returns hunt'` |
| Thêm shadcn component | `npx shadcn@latest add <component>` |

Vitest config đặt tại `vitest.config.mts` (`.mts` do loader native của Vite cần ESM). Tests được đặt colocated dưới `src/**/__tests__/*.test.ts`.

Nguồn chân lý về dependencies là `package-lock.json`. Toàn bộ quy trình cài đặt và thực thi chạy hoàn toàn qua `npm` và `npx`.

## This is Next.js 16

The `AGENTS.md` block at the repo root (auto-maintained by `next dev` — do NOT strip it from diffs) warns that APIs changed. Before writing anything that touches Next behavior, read the relevant page under `node_modules/next/dist/docs/01-app/`. In particular:

- **`cacheComponents: true` + `partialPrefetching: true`** are enabled in `next.config.ts`. This makes PPR the default and bans `export const runtime = 'nodejs' | 'edge'` in route segments and Route Handlers — the build will fail. Node.js runtime is still what runs; just don't declare it.
- `headers()`, `cookies()`, `params`, and `searchParams` are **async** (await them).
- Do **not** mark the quote request path (Server Action or any future `/api/quote/...` Route Handler) with `"use cache"`.
- Route Handlers are not cached by default; a `GET` that calls `headers()` is dynamic — fine.

## Architecture

### Routes and slugs

App Router under `src/app/`. Route folders use Vietnamese slugs (`/gioi-thieu`, `/dich-vu`, `/dich-vu/[slug]`, `/tin-tuc`, `/blog/[slug]`, `/case-studies`, `/lien-he`). Dynamic `[slug]` routes are prebuilt via `generateStaticParams()` from the `src/content/*.ts` arrays. `next.config.ts` 308-redirects `/blog` → `/tin-tuc`. `src/app/quan-tri/{bai-viet,case-studies,dich-vu,tin-tuc}` (admin) are empty placeholder folders — no admin UI or auth exists yet. Root layout (`src/app/layout.tsx`) hardcodes `data-theme="lighthuman"` and `data-color-scheme="light"` on `<html>` and loads three `next/font/google` variables: Inter (body), Merriweather (heading), JetBrains Mono (numerals/code-ish text — use via `var(--font-jetbrains-mono)`).

### Styling: Kết hợp Tailwind CSS và shadcn UI cùng stylesheet Light Human

- Dự án tích hợp **Tailwind CSS v4** và **shadcn UI** kết hợp song song với hệ thống stylesheet nhận diện gốc `src/styles/lighthuman.css` (các class `.lh-*` scoped theo `[data-theme="lighthuman"]`).
- `src/app/globals.css` cấu hình token `@theme inline` và `:root` variables cho shadcn UI, đồng bộ màu sắc với nhận diện thương hiệu Light Human (`--primary: #14285a`, `--radius: 0.625rem`, ...).
- File tiện ích `cn()` nằm tại `src/lib/utils.ts` (sử dụng `clsx` + `tailwind-merge`), tương thích với shadcn UI. `src/lib/cn.ts` re-export lại từ `utils.ts`.
- Thêm component shadcn mới: `npx shadcn@latest add <component>`. `components.json` dùng style `base-nova` → primitives là **`@base-ui/react`**, không phải Radix; đừng import `@radix-ui/*`.
- Các biến CSS tái sử dụng: `--brand-navy`, `--brand-gold`, `--ink-{400..900}`, `--bg-{page,surface}`, `--border-1`, `--ease-out`, `--font-jetbrains-mono`.
- Theme là single-light mặc định theo bản thiết kế thương hiệu Light Human.

### Content / data layer

Each top-level page has a dedicated data file under `src/content/` (`about.ts`, `services.ts`, `contact.ts`, `posts.ts`, `case-studies.ts`, `partners.ts`, `faq.ts`, `home.ts`, `site.ts`). Section components under `src/components/sections/<page>/` are mostly dumb renderers that read from these. When adding or editing page content, edit the `src/content/*.ts` file — do not inline copy into components. Shared site strings and navigation (`mainNav`, `footerNav`, `serviceNav`, contact info) live in `src/content/site.ts`.

**There is no database or ORM.** All content is static TypeScript; form submissions (contact + quote) are not persisted — contact optionally POSTs to `CONTACT_WEBHOOK_URL`, the quote action only computes and returns a result (quote code `BG-YYMMDD-XXXX` from `src/lib/quote/quote-code.ts` is random, not stored). Adding persistence is a new decision, not an existing pattern to follow.

The `CMS` constant in `site.ts` points at `https://blog.lighthuman.vn/uploads` and `next.config.ts` has a matching `remotePatterns` allowance — add new remote image hosts in both places.

### Forms: Server Actions + custom state, not react-hook-form

The contact form (`src/app/lien-he/actions.ts` + `src/lib/contact-schema.ts` + `src/components/sections/contact/ContactForm.tsx`) is the canonical pattern:

- `"use server"` action receives `(_prev, formData)` and returns a typed state object (`status`, `message`, `errors`, `values`).
- Validator is a plain function over `Partial<Record<Field, string>>` — regex for email/phone VN.
- Client renders via `useActionState`; errors are keyed by field name and anchored with `aria-describedby`.
- Honeypot field is `name="website"` (`.sr-only`); the action short-circuits when it's non-empty.
- Optional webhook: `CONTACT_WEBHOOK_URL`. When unset the action just `console.info`s.

The Vietnamese phone regex worth reusing verbatim: `/^(\+?84|0)[\d\s.-]{8,12}$/`.

### Feature: drag-and-drop quote builder (Phase 1–4 in place)

Currently embedded inside `/lien-he` (replaces the old `<ContactForm />` on the right of `<ContactSplit />`). Four layers, each isolated so Phase 5+ (PDF, HMAC-signed download token, BD webhook, rate limit) can slot in without touching UI:

- **Catalog** — `src/content/quote/catalog.ts` is the *single source of truth* for both UI (chip options) and server (zod enum). `labels.vi.ts` holds the UI copy. `classification.ts` and `pricing.seed.ts` are data only; when BA hands over the real price book, bump `PRICING_SEED.version` (format `YYYY-MM-draft-N`). Industries intentionally missing from `baseByIndustry` (e.g. `POD`) exercise the "no-match → manual_required" path by design.
- **Pure logic** — `src/lib/quote/{classify,normalize}.ts` + `src/lib/quote/pricing/{mass,hunt}.ts` behind an `index.ts` router. Classifier and pricing strategies are injectable (take rules/seed as parameter) and never throw — pricing returns a tagged union `PriceMatch | PriceNoMatch`.
- **Schema** — `src/lib/quote/schema.ts` (zod v4) is shared between client preview and server. The server re-parses whatever the form sends and *ignores* any client-sent `type`.
- **Orchestrator + Server Action** — `src/lib/quote/create-quote.ts` stitches normalize → classify → price; `src/app/lien-he/quote-action.ts` wraps it. Error paths from zod are flattened with `.` as separator (`contact.email`, `lines.0.quantity`) and the UI looks them up by that exact key.
- **UI** — `src/components/quote/` holds a `QuoteBuilder` client component (`DndContext` with `PointerSensor` + `KeyboardSensor`, Vietnamese drag announcements, click + keyboard fallback) composed of `CriteriaPalette`, `CriteriaBoard`, `ContactFields`, `QuoteResult`. Client state (`selected`) is mirrored into hidden inputs before submit — never trusted on the server.

What's intentionally NOT done yet: PDF (`@react-pdf/renderer`, static `.ttf` fonts), HMAC-signed download token, BD webhook notifier, rate limit, Turnstile. The orchestrator returns `pricingVersion` and shapes its result so those layers plug in without changing the Server Action contract.

### When to use TypeScript `as const` vs enums

The catalog exports `_VALUES` arrays `as const` (tuple of literal types) so zod's `z.enum(TUPLE)` keeps the literal types, and labels live in a separate `_LABELS: Record<Value, string>` map. Follow this shape when adding another catalogue group — don't define objects of `{value, label}` first; zod's enum needs the tuple.

## Conventions worth preserving

- Keep comments short and about **why** (hidden invariants, references to BA assumptions, workarounds). The repo deliberately has very few comments — don't add narration of what the code does.
- Mass vs Hunt classification, pricing formulas, and contact-field choices still carry `TODO(BA)` markers. If you touch one, leave the TODO in place and surface it to the user instead of silently deciding.
- ESLint ignores `ClaudeMD/` and `.claude/` (per `eslint.config.mjs`). Put scratch/reference material there, not in `src/`.
