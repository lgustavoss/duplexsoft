import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, sobreHeroScene } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a DuplexSoft em Uberaba-MG: empresa de sistemas, revenda autorizada WebPosto e DX Web para o Triângulo Mineiro.",
};

export default function SobrePage() {
  return (
    <div className="pb-14 md:pb-20">
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={sobreHeroScene.src}
          alt={sobreHeroScene.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_42%] opacity-90 md:object-[82%_38%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/65 to-transparent md:via-ink/55"
          aria-hidden="true"
        />
        <div className="site-shell relative py-16 md:py-24">
          <div className="max-w-xl">
            <h1 className="display-font text-4xl font-semibold md:text-5xl">Quem somos</h1>
            <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-white/92 sm:max-w-[48ch]">
              A {siteConfig.legalName} é uma empresa de sistemas em Uberaba-MG. Atendemos o
              Triângulo Mineiro com implantação, treinamento e suporte próximos da rotina —
              WebPosto para postos e DX Web quando o negócio precisa da nossa plataforma.
            </p>
            <p className="mt-4 max-w-[48ch] text-pretty text-base leading-relaxed text-white/78">
              {siteConfig.location.label} — presença local para quem opera com a gente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contato" className="btn-primary">
                Falar conosco
              </Link>
              <a
                href={siteConfig.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (abre em nova aba)"
                className="btn-ghost-light"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="site-shell mt-12 space-y-12 md:mt-16 md:space-y-14">
        <article className="max-w-[65ch]">
          <h2 className="display-font text-2xl font-semibold text-brand-deep md:text-3xl">
            WebPosto com atendimento local
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            O WebPosto é o sistema em nuvem feito para postos — pista, conveniência, frota,
            serviços e gestão. A DuplexSoft é revenda autorizada: cuida da implantação e do
            acompanhamento na região, para a tecnologia funcionar no dia a dia da operação.
          </p>
          <Link
            href="/solucoes#webposto"
            className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Ver o WebPosto
          </Link>
        </article>

        <article className="max-w-[65ch]">
          <h2 className="display-font text-2xl font-semibold text-brand-deep md:text-3xl">
            DX Web da DuplexSoft
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            O DX Web é a plataforma própria da DuplexSoft (PDV, fiscal, estoque, financeiro e
            relatórios). Use quando o negócio precisa da nossa solução em nuvem — e não do
            sistema de posto WebPosto.
          </p>
          <Link
            href="/solucoes#dx-web"
            className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Ver o DX Web
          </Link>
        </article>

        <div className="surface-panel max-w-3xl rounded-[var(--radius)] p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="max-w-xl">
            <h2 className="display-font text-2xl font-semibold text-brand-deep">Como trabalhamos</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Cada operação tem realidade diferente. Por isso as propostas nascem de conversa —
              não de tabela genérica. O site apresenta a empresa e as soluções; o Instagram
              mostra o dia a dia.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Link href="/contato" className="btn-primary">
              Falar conosco
            </Link>
            <a
              href={siteConfig.phone.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp (abre em nova aba)"
              className="btn-secondary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
