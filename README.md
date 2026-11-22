# DuplexSoft — site institucional

Site de marketing da [DuplexSoft](https://www.duplexsoft.com.br) (Uberaba-MG / Triângulo Mineiro): cartão de visita online complementar ao Instagram.

**Revenda autorizada WebPosto** com implantação, treinamento e suporte local · **DX Web** (sistema de gestão em nuvem próprio) · conversão para formulário e WhatsApp.

> App operacional: [app.duplexsoft.com.br](https://app.duplexsoft.com.br) · este repositório é só o site institucional.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Formulário de contato via [Resend](https://resend.com)
- Deploy: Cloudflare Workers (`@opennextjs/cloudflare`)

## Páginas

| Rota | Função |
|------|--------|
| `/` | Hero da marca + o que o WebPosto atende + CTA |
| `/sobre` | Quem somos, presença local |
| `/solucoes` | WebPosto (áreas cobertas) e DX Web |
| `/contato` | WhatsApp (QR) + formulário |

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `RESEND_API_KEY` | API key do [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | Caixa que recebe os leads |
| `CONTACT_FROM_EMAIL` | Remetente verificado no Resend |
| `NEXT_PUBLIC_DESKRUDDER_CHAT_SRC` | URL do script do chat flutuante (opcional) |
| `NEXT_PUBLIC_DESKRUDDER_KB_URL` | URL da base de conhecimento (opcional; fora do menu nesta fase) |

Veja `.env.example` para o modelo completo.

## Design

- Tokens e componentes: `DESIGN.md` + `src/app/globals.css`
- Conteúdo canônico: `src/lib/site.ts`
- Contexto de produto: `PRODUCT.md`
- Tipografia: **Sora** (display) + **Manrope** (corpo)
- Marca: azul elétrico `#2E5BFF` · navy `#0A1B3A` · logos em `/public/brand`

## Deploy na Cloudflare

```bash
npx wrangler login
npm run deploy
```

Configure os secrets do Worker com as mesmas variáveis do `.env.example`.

**Domínio**

- `www.duplexsoft.com.br` → Worker/Pages
- Apex `duplexsoft.com.br` → redireciona para `www`
- `app.duplexsoft.com.br` permanece no app operacional

## Estrutura

```
src/app/          # rotas App Router
src/components/   # Header, Footer, ContactForm, …
src/lib/site.ts   # copy e configuração do site
public/           # brand, scenes, QR
.cursor/          # regras e skills do time (Impeccable)
```

## Licença

Código privado da DuplexSoft Sistemas. Todos os direitos reservados.
