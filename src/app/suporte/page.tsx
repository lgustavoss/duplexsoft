import type { Metadata } from "next";
import Link from "next/link";
import {
  duplexSuporteDownload,
  resolveSupportHref,
  siteConfig,
  supportResources,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Suporte",
  description:
    "Contagem de caixa, acesso remoto Duplex Suporte e canais de ajuda da DuplexSoft no Triângulo Mineiro.",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.97.52 3.89 1.51 5.58L2 22l4.75-1.55a10 10 0 0 0 5.29 1.51h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.07c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.2-4.93-4.39-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.49.24.56.81 1.94.88 2.08.07.14.12.3.02.49-.1.19-.14.3-.28.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

export default function SuportePage() {
  const primary = supportResources.find((r) => r.id === "contagem-caixa");
  const remote = supportResources.find((r) => r.id === "acesso-remoto");
  const upcoming = supportResources.filter(
    (r) => r.id !== "contagem-caixa" && r.id !== "acesso-remoto",
  );
  const primaryHref = primary ? resolveSupportHref(primary) : "";
  const remoteHref = remote ? resolveSupportHref(remote) : "";
  const duplexSuporte = duplexSuporteDownload;

  return (
    <div className="site-shell py-14 md:py-20">
      <div className="max-w-xl">
        <h1 className="display-font text-balance text-4xl font-semibold text-brand-deep md:text-5xl">
          Suporte
        </h1>
        <p className="mt-4 max-w-prose text-pretty leading-relaxed text-muted">
          Ferramentas do turno, acesso remoto e canais de ajuda.
        </p>
      </div>

      {primary && primaryHref ? (
        <section
          aria-labelledby="tool-heading"
          className="mt-10 rounded-[var(--radius)] border border-brand/25 bg-surface p-6 sm:p-8"
        >
          <h2
            id="tool-heading"
            className="display-font text-2xl font-semibold text-brand-deep md:text-3xl"
          >
            {primary.title}
          </h2>
          <p className="mt-3 max-w-prose text-pretty leading-relaxed text-muted">
            {primary.description}
          </p>
          <div className="mt-6">
            <Link href={primaryHref} className="btn-primary">
              Abrir contagem de caixa
            </Link>
          </div>
        </section>
      ) : null}

      {remote && remoteHref ? (
        <section
          aria-labelledby="remote-heading"
          className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-6 sm:p-8"
        >
          <h2
            id="remote-heading"
            className="display-font text-2xl font-semibold text-brand-deep md:text-3xl"
          >
            {remote.title}
          </h2>
          <p className="mt-3 max-w-prose text-pretty leading-relaxed text-muted">
            {remote.description}
          </p>
          <p className="mt-3 text-sm text-muted">
            {duplexSuporte.name} · {duplexSuporte.platform} · versão {duplexSuporte.version}
          </p>
          <div className="mt-6">
            <a
              href={remoteHref}
              className="btn-primary inline-flex items-center gap-2"
              aria-label={`Baixar ${duplexSuporte.name} para ${duplexSuporte.platform}`}
            >
              <DownloadIcon className="h-4 w-4 shrink-0" />
              Baixar {duplexSuporte.name}
            </a>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="upcoming-heading" className="mt-14">
        <h2 id="upcoming-heading" className="text-sm font-semibold text-muted">
          Em breve
        </h2>
        <ul className="mt-4 space-y-4">
          {upcoming.map((resource) => {
            const href = resolveSupportHref(resource);
            const ready = Boolean(href);

            return (
              <li key={resource.id} className="max-w-xl">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-medium text-brand-deep">{resource.title}</h3>
                  {!ready ? (
                    <span className="text-xs font-medium text-muted">Em breve</span>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
                      aria-label={`${resource.title} (abre em nova aba)`}
                    >
                      Abrir
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {resource.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="help-heading"
        className="mt-14 border-t border-line pt-8"
      >
        <h2 id="help-heading" className="text-sm font-semibold text-muted">
          Precisa de ajuda agora?
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
          DuplexSoft em {siteConfig.location.city} — {siteConfig.location.region}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={siteConfig.phone.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${siteConfig.phone.display} (abre em nova aba)`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            WhatsApp {siteConfig.phone.display}
          </a>
          <Link href="/contato" className="btn-secondary">
            Formulário de contato
          </Link>
        </div>
      </section>
    </div>
  );
}
