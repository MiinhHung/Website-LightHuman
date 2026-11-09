---
name: design-system-light-human-i-t-c-nh-n-s-chi-n-l-c-cho-doanh-ngh
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Light Human — Đối tác nhân sự chiến lược cho doanh nghiệp Việt

## Mission
Deliver implementation-ready design-system guidance for Light Human — Đối tác nhân sự chiến lược cho doanh nghiệp Việt that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Light Human — Đối tác nhân sự chiến lược cho doanh nghiệp Việt
- URL: https://lighthuman.vn/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, Inter Fallback, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=25.6px`
- Typography scale: `font.size.xs=11px`, `font.size.sm=12px`, `font.size.md=12.5px`, `font.size.lg=13px`, `font.size.xl=14px`, `font.size.2xl=14.5px`, `font.size.3xl=15px`, `font.size.4xl=15.5px`
- Color palette: `color.text.primary=#14171f`, `color.text.secondary=#ffffff`, `color.text.tertiary=#3f4555`, `color.text.inverse=#f2cf63`, `color.surface.base=#000000`, `color.surface.raised=#f8f9fb`, `color.border.strong=#dde1ea`
- Spacing scale: `space.1=4px`, `space.2=6px`, `space.3=8px`, `space.4=10px`, `space.5=11px`, `space.6=12px`, `space.7=14px`, `space.8=16px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=14px`, `radius.md=20px`, `radius.lg=24px`, `radius.xl=50px`, `radius.2xl=999px` | `shadow.1=rgba(20, 40, 90, 0.06) 0px 2px 6px 0px, rgba(20, 40, 90, 0.04) 0px 1px 2px 0px`, `shadow.2=rgba(20, 40, 90, 0.08) 0px 8px 24px 0px, rgba(20, 40, 90, 0.05) 0px 2px 6px 0px`, `shadow.3=rgba(20, 40, 90, 0.1) 0px 8px 24px 0px, rgba(20, 40, 90, 0.05) 0px 2px 6px 0px`, `shadow.4=rgba(234, 184, 128, 0.26) 0px 10px 30px 0px` | `motion.duration.instant=140ms`, `motion.duration.fast=150ms`, `motion.duration.normal=220ms`, `motion.duration.slow=420ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
