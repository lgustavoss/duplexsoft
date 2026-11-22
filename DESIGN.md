---
name: DuplexSoft
description: Cartão de visita B2B — WebPosto no Triângulo Mineiro
colors:
  brand: "#2E5BFF"
  brand-deep: "#0A1B3A"
  ink: "#050B18"
  ink-mid: "#071025"
  mask: "#000000"
  accent: "#2E5BFF"
  accent-soft: "#8DA4FF"
  background: "#F7F8FC"
  foreground: "#0A1B3A"
  muted: "#5B6B86"
  surface: "#FFFFFF"
  surface-soft: "#EEF1F8"
  line: "rgba(10, 27, 58, 0.12)"
  glow: "rgba(46, 91, 255, 0.28)"
typography:
  display:
    fontFamily: "Sora, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontWeight: 400
rounded:
  panel: "0.875rem"
  button: "0.75rem"
  input: "0.75rem"
spacing:
  shell-max: "1120px"
  shell-gutter: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "0.75rem 1.25rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.brand-deep}"
    rounded: "{rounded.button}"
    padding: "0.75rem 1.25rem"
---

# Design System — DuplexSoft

## Overview

Sistema visual pós-redesign do site institucional. Modo Persuade: cartão de visita digital, WebPosto como carro-chefe, logos oficiais (azul elétrico + ink). Tokens em `src/app/globals.css`. Tipografia em `src/app/layout.tsx` (Sora + Manrope). Conteúdo em `src/lib/site.ts`.

## Colors

| Role | Token | Valor | Uso |
| --- | --- | --- | --- |
| Primary | `--brand` / `--accent` | `#2E5BFF` | CTAs, Soft no wordmark, destaques |
| Deep / text | `--brand-deep` / `--foreground` | `#0A1B3A` | Títulos em superfície clara |
| Ink | `--ink` | `#050B18` | Hero e footer |
| Soft | `--accent-soft` | `#8DA4FF` | Links em fundo escuro |
| Background | `--background` | `#F7F8FC` | Corpo das páginas |
| Surface | `--surface` | `#FFFFFF` | Painéis |
| Muted | `--muted` | `#5B6B86` | Texto secundário |
| Line | `--line` | `rgba(10, 27, 58, 0.12)` | Bordas |

## Typography

- **Display / wordmark:** Sora
- **Body:** Manrope
- Sem eyebrows/kickers; títulos carregam o peso sozinhos

## Layout

- Shell `.site-shell` max 1120px
- Hero full-bleed ink; corpo claro; footer ink
- WebPosto em destaque assimétrico nas soluções; DX Web secundário
- CTAs: `.btn-primary` / `.btn-secondary` / `.btn-ghost-light` (cantos 0.75rem, não pílula infinita)

## Elevation & Depth

- `.surface-panel`: branco + borda + sombra suave offset
- Hero: radial glow brand + grid sutil
- Evitar side-stripe em cards; evitar glass decorativo

## Shapes

- `--radius: 0.875rem` painéis
- Botões e inputs: `0.75rem`

## Components

- `Header` — Falar conosco primário; DX Web terciário com alvo ≥44px; foco do menu só restaura se o drawer estava aberto; em `/contato`, Falar conosco some do chrome
- `Footer` — ink; colunas em `<nav>` com headings; canais sem KB
- `BrandLogo` / `BrandMark` — marks transparentes; lockup empilhado; mark decorativo quando há wordmark
- `ContactForm` — interesse default WebPosto; labels obrigatório/opcional; foco no primeiro erro; scroll respeita reduced-motion
- Skip link — “Ir para o conteúdo” → `#conteudo` no `<main>`
- Home CTA final — prova WebPosto (sem card intermediário)

## Do's and Don'ts

**Do:** priorizar WebPosto; usar `#2E5BFF` + ink; Sora/Manrope; copy real pt-BR  
**Don't:** Fraunces/cream legado; três cards iguais; KB no menu; inventar preços/cases; side-bar accent em cards
