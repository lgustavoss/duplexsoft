import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a DuplexSoft em Uberaba-MG. Atendemos o Triângulo Mineiro por WhatsApp ou formulário.",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.97.52 3.89 1.51 5.58L2 22l4.75-1.55a10 10 0 0 0 5.29 1.51h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.07c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.2-4.93-4.39-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.49.24.56.81 1.94.88 2.08.07.14.12.3.02.49-.1.19-.14.3-.28.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

export default function ContatoPage() {
  const chatActive = Boolean(siteConfig.links.chatSrc);

  return (
    <div className="site-shell py-14 md:py-20">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-12 lg:gap-y-8">
        <div>
          <h1 className="display-font text-balance text-4xl font-semibold text-brand-deep md:text-5xl">
            Vamos conversar
          </h1>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted">
            Estamos em Uberaba e atendemos o Triângulo Mineiro. O caminho mais rápido é o
            WhatsApp; se preferir registrar o pedido, use o formulário.
          </p>

          <div className="mt-6 flex flex-col gap-3 lg:hidden">
            <a
              href={siteConfig.phone.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${siteConfig.phone.display} (abre em nova aba)`}
              className="btn-primary inline-flex w-full items-center justify-center gap-2.5"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              <span>WhatsApp {siteConfig.phone.display}</span>
            </a>
            <p className="text-center text-sm text-muted">
              Dia a dia no{" "}
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @duplexsoft (abre em nova aba)"
                className="font-semibold text-brand-deep underline-offset-4 hover:underline"
              >
                Instagram @duplexsoft
              </a>
            </p>
          </div>

          <div className="mt-10 hidden lg:block">
            <figure className="sticky top-24 flex max-w-md flex-col items-start rounded-[var(--radius)] border border-brand/25 bg-surface p-6 shadow-[0_12px_32px_rgba(10,27,58,0.08)]">
              <div className="rounded-[calc(var(--radius)-0.25rem)] border border-line bg-white p-4">
                <Image
                  src={siteConfig.qr.whatsapp}
                  alt="QR Code para o WhatsApp da DuplexSoft"
                  width={200}
                  height={200}
                  className="h-auto w-full max-w-[200px]"
                  priority
                />
              </div>
              <figcaption className="display-font mt-5 text-xl font-semibold text-brand-deep">
                WhatsApp — caminho mais rápido
              </figcaption>
              <p className="mt-1 text-sm text-muted">Aponte a câmera do celular ou abra o chat.</p>
              <a
                href={siteConfig.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${siteConfig.phone.display} (abre em nova aba)`}
                className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {siteConfig.phone.display}
              </a>
              <p className="mt-5 text-sm text-muted">
                Dia a dia no{" "}
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @duplexsoft (abre em nova aba)"
                  className="font-semibold text-brand-deep underline-offset-4 hover:underline"
                >
                  Instagram @duplexsoft
                </a>
              </p>
            </figure>
          </div>
        </div>

        <div>
          <p className="mb-3 hidden text-sm font-medium text-muted lg:block">
            Ou registre o pedido pelo formulário
          </p>
          <Suspense
            fallback={
              <div
                className="surface-panel flex h-80 items-center justify-center rounded-[var(--radius)] motion-safe:animate-pulse"
                role="status"
              >
                <span className="text-sm text-muted">Carregando formulário…</span>
              </div>
            }
          >
            <ContactForm />
          </Suspense>
        </div>

        <div className="space-y-3 border-t border-line pt-6 text-sm">
          <div>
            <p className="font-semibold text-brand-deep">Localização</p>
            <p className="mt-1 text-muted">{siteConfig.location.label}</p>
          </div>
          {chatActive ? (
            <div>
              <p className="font-semibold text-brand-deep">Chat</p>
              <p className="mt-1 text-muted">
                O atendimento online está disponível no canto da tela.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
