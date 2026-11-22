---
name: visual-quality-audit
description: Auditoria visual/UX independente após trabalho de interface. Prefira Impeccable critique/audit/detect primeiro; use esta skill ou visual-reviewer para uma segunda opinião sem duplicar o mesmo checklist.
---

# Visual Quality Audit

## Prefer Impeccable first
1. `/impeccable critique [target]` — scored UX review
2. `/impeccable audit [target]` — technical quality
3. Optional: `npx impeccable detect src/` or a rendered URL

Then, if a second opinion is needed, invoke `visual-reviewer` **or** continue with this skill — not both unless the user asks.

## Independence
Act as a skeptical reviewer. Do not rewrite the whole interface for taste. Build on Impeccable findings when present.

## Evidence
1. Inspect changed files and components against `DESIGN.md` / `PRODUCT.md`.
2. Run the app and inspect browser output when available.
3. Separate verified browser findings from code-level hypotheses.

## DuplexSoft focus
- Conversion clarity (contato / WhatsApp / app)
- Brand coherence (not generic SaaS purple / cream template)
- Marketing density — not operational dashboard patterns

## Output
Severity-ranked findings with location, evidence, impact, and concrete fix. State what Impeccable already covered.
