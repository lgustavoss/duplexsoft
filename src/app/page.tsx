import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  homeHeroScene,
  siteConfig,
  webPostoModuleGroups,
  webPostoModules,
} from "@/lib/site";

const photoScenes = webPostoModules.filter((module) => module.sceneRole === "photo");
const operationNotes = webPostoModules.filter(
  (module) => module.group === "operacao" && module.sceneRole === "text",
);
const backOfficeGroup = webPostoModuleGroups.find((group) => group.id === "retaguarda");

export default function HomePage() {
  return (
    <>
      <section className="hero-ink hero-ink--photo hero-ink--brand">
        <Image
          src={homeHeroScene.src}
          alt={homeHeroScene.alt}
          fill
          priority
          sizes="100vw"
          className="hero-ink__media object-cover object-[72%_center] sm:object-[78%_center]"
        />
        <div className="hero-ink__veil" aria-hidden="true" />
        <div className="site-shell relative z-10 flex min-h-[78vh] flex-col justify-center py-16 lg:py-20">
          <div className="fade-up w-full max-w-xl text-left md:max-w-lg">
            <BrandLogo variant="dark" size="xl" lockup className="items-start" />
            <h1 className="display-font mt-8 text-3xl font-semibold leading-tight text-white sm:mt-10 sm:text-4xl md:text-[2.75rem]">
              Sistemas e suporte local para o seu posto.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/92 sm:text-lg">
              A DuplexSoft, em Uberaba, é a empresa de sistemas que implanta o WebPosto no
              Triângulo Mineiro — com treinamento e acompanhamento da operação.
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

      <section className="site-shell py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="display-font max-w-2xl text-balance text-3xl font-semibold text-brand-deep md:text-4xl">
            O que o WebPosto atende no seu posto
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-muted">
            A DuplexSoft comercializa e implanta o WebPosto. Abaixo, as áreas da operação que
            o sistema cobre — da pista ao escritório.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {photoScenes.map((module) =>
            "scene" in module ? (
              <li key={module.name}>
                <Image
                  src={module.scene}
                  alt={module.sceneAlt}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full rounded-[var(--radius)] object-cover"
                />
                <p className="display-font mt-3 text-lg font-semibold text-brand-deep">
                  {module.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{module.text}</p>
              </li>
            ) : null,
          )}
        </ul>

        <div className="mt-12 border-t border-line pt-8">
          <h3 className="display-font text-lg font-semibold text-brand-deep">
            Também cobertos pelo WebPosto
          </h3>
          <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted">
            {[...operationNotes.map((m) => m.name), ...(backOfficeGroup?.modules.map((m) => m.name) ?? [])].join(
              " · ",
            )}
            . Detalhes em{" "}
            <Link
              href="/solucoes#webposto"
              className="font-semibold text-brand-deep underline-offset-4 hover:underline"
            >
              Soluções
            </Link>
            .
          </p>
          <div className="mt-6">
            <Link href="/solucoes#webposto" className="btn-primary">
              Ver áreas e detalhes
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="site-shell py-16 md:py-20">
          <div className="surface-panel rounded-[var(--radius)] p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
            <div className="max-w-xl">
              <h2 className="display-font text-balance text-2xl font-semibold text-brand-deep md:text-3xl">
                Quer implantar o WebPosto na sua operação?
              </h2>
              <p className="mt-3 text-pretty text-muted">
                Revenda autorizada com implantação e suporte em Uberaba e no Triângulo
                Mineiro. Valores sob consulta — formulário ou WhatsApp{" "}
                {siteConfig.phone.display}.
              </p>
              <Link
                href="/sobre"
                className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Sobre a DuplexSoft
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
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
      </section>
    </>
  );
}
