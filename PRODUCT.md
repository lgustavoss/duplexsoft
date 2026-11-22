# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Donos e gestores de postos de combustíveis e operações relacionadas no Triângulo Mineiro (Uberaba-MG e região). Perfil operacional/comercial; nem sempre técnico de software. Usam desktop no escritório e mobile para contato rápido (WhatsApp).

## Product Purpose

Site institucional da DuplexSoft (`www.duplexsoft.com.br`) — cartão de visita online complementar ao Instagram: quem somos, o que fazemos, onde estamos e como falar conosco. Explica o WebPosto (o que atende no posto) e apresenta o DX Web. Converte para contato (formulário / WhatsApp).

Sucesso = visitante reconhece a marca, entende o WebPosto e o papel da DuplexSoft na implantação/suporte local, conhece o DX Web, e consegue agir.

## Positioning

Revenda autorizada WebPosto com presença local em Uberaba; DX Web como solução própria. Tom institucional (sem jargão interno tipo “carro-chefe” na copy pública). Implantação, treinamento e suporte no Triângulo Mineiro.

## Copy notes

- Priorizar o que o WebPosto faz (pista, conveniência, frota, oil, restaurante, administrativo, financeiro) — referência: https://www.webposto.com.br/
- Não inventar números de clientes/bandeiras da DuplexSoft; métricas oficiais pertencem ao WebPosto
- Evitar frases internas (“carro-chefe”, “oferta própria”) na interface

## Operating Context

- Páginas: Início (`/`), Sobre (`/sobre`), Soluções (`/solucoes`), Contato (`/contato`)
- Fluxos: home (WebPosto-first) → soluções → contato; WhatsApp; formulário; chat DeskRudder quando configurado
- Instagram: canal paralelo (não espelhar o feed no site)
- Base de conhecimento: ideia futura — **fora do site nesta fase**
- App operacional é produto separado

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, OpenNext + Cloudflare
- Conteúdo em `src/lib/site.ts`
- Contato via `src/app/api/contact` + Resend
- Idioma: pt-BR
- Vitrine: WebPosto (prioritário) + DX Web; DropDesk fora
- Não inventar preços, depoimentos ou páginas de KB

## Brand Commitments

- Logos oficiais recentes (lockup escuro: monograma elétrico + Duplex branco / Soft azul; lockup claro: navy monócromo) em `public/brand/` e assets do usuário
- Primário elétrico ≈ `#2E5BFF`; fundos ink/navy profundos; tipografia sans geométrica (Sora + Manrope)
- Personalidade: profissional, técnica, regional, confiável
- Evitar: template SaaS serifado/cream, “roxo AI”, feed-clone do Instagram

## Evidence on Hand

- Implementação em `src/`
- Logos em `public/brand/logo-dark.png`, `logo-light.png`, marks existentes
- Copy e soluções em `src/lib/site.ts`
- Brief de shape confirmado (redesign total; WebPosto carro-chefe; sem KB no menu)

## Product Principles

1. WebPosto lidera a narrativa; DX Web complementa.
2. Cartão de visita claro: empresa, oferta, região, contato.
3. Marca oficial das logos novas — não o sistema visual legado.
4. Conteúdo real; nada inventado.
5. Processo proporcional: redesign completo nesta entrega.

## Accessibility & Inclusion

Contraste legível em dark e light, labels e estados no formulário, foco visível, WhatsApp fácil no mobile, `prefers-reduced-motion`. Meta prática WCAG 2.2 AA onde aplicável.
