---
name: design-system
description: Mantém tokens e componentes do design system DuplexSoft. Fonte canônica é DESIGN.md; prefira /impeccable document para atualizar a partir do código.
---

# Design System

## Canonical source
- Visual system: `DESIGN.md`
- Tokens in code: `src/app/globals.css`
- Product context: `PRODUCT.md`

## Prefer Impeccable
- Refresh from implementation: `/impeccable document`
- Extract patterns: `/impeccable extract`
- Do not create a competing token document in `docs/design-system.md` (it is a pointer only).

## When editing manually
1. Change tokens in `globals.css` (or components) with intent.
2. Update `DESIGN.md` frontmatter + sections to match.
3. Preserve semantic Tailwind mappings already in use.
4. Do not add a UI kit without an explicit migration plan.

## Guardrails
- Preserve Fraunces + Manrope and the blue brand system unless product leadership changes brand.
- Record intentional detector exceptions via `npx impeccable ignores …` (e.g. brand fonts already ignored).
