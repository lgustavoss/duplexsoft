import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WebPostoModulesAccordion } from "@/components/WebPostoModulesAccordion";
import { homeHeroScene, solutions, webPostoModules } from "@/lib/site";

export const metadata: Metadata = {
  title: "Soluções",
  description:
    "WebPosto e DX Web com a DuplexSoft: gestão para postos de combustíveis no Triângulo Mineiro.",
};

const webPostoPanelScene = webPostoModules.find((module) => module.name === "Pista");

export default function SolucoesPage() {
  return (
    <div className="site-shell py-14 md:py-20">
      <div className="max-w-3xl">
        <h1 className="display-font text-4xl font-semibold text-brand-deep md:text-5xl">
          Soluções para o seu posto
        </h1>
        <p className="mt-6 max-w-[65ch] text-pretty text-lg leading-relaxed text-muted">
          A DuplexSoft comercializa o WebPosto (sistema feito para posto) e o DX Web (sistema
          de gestão em nuvem próprio). Sem preços públicos: cada proposta considera o porte da
          operação.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {solutions.map((solution, index) => {
          const panelImage =
            solution.id === "webposto" && webPostoPanelScene && "scene" in webPostoPanelScene
              ? {
                  src: webPostoPanelScene.scene,
                  alt: webPostoPanelScene.sceneAlt,
                }
              : solution.id === "dx-web"
                ? { src: homeHeroScene.src, alt: homeHeroScene.alt }
                : null;

          return (
            <div key={solution.id} className="space-y-4">
              <article
                id={solution.id}
                className={`surface-panel overflow-hidden rounded-[var(--radius)] ${
                  index === 0 ? "ring-1 ring-brand/30" : ""
                }`}
              >
                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  <div className="p-7 md:p-10">
                    <p className="text-sm font-semibold text-brand">{solution.badge}</p>
                    <h2 className="display-font mt-3 text-3xl font-semibold text-brand-deep">
                      {solution.name}
                    </h2>
                    <p className="mt-4 max-w-[65ch] leading-relaxed text-pretty text-muted">
                      {solution.summary}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {solution.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm text-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {solution.primaryCta.href.startsWith("http") ? (
                        <a href={solution.primaryCta.href} className="btn-primary">
                          {solution.primaryCta.label}
                        </a>
                      ) : (
                        <Link href={solution.primaryCta.href} className="btn-primary">
                          {solution.primaryCta.label}
                        </Link>
                      )}
                      {solution.secondaryCta.href.startsWith("http") ? (
                        <a
                          href={solution.secondaryCta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${solution.secondaryCta.label} (abre em nova aba)`}
                          className="btn-secondary"
                        >
                          {solution.secondaryCta.label}
                        </a>
                      ) : (
                        <Link href={solution.secondaryCta.href} className="btn-secondary">
                          {solution.secondaryCta.label}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="relative min-h-[220px] overflow-hidden bg-ink">
                    {panelImage ? (
                      <Image
                        src={panelImage.src}
                        alt={panelImage.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover object-center opacity-80"
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
                      aria-hidden="true"
                    />
                    <div className="relative z-10 flex h-full min-h-[220px] items-end p-7 text-white md:p-10">
                      <p className="display-font text-2xl font-semibold text-balance text-white">
                        {solution.focus}
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {solution.id === "webposto" ? (
                <div className="overflow-hidden rounded-[var(--radius)] border border-line">
                  <WebPostoModulesAccordion />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
