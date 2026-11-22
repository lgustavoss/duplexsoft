import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-ink text-white">
      <div className="site-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo variant="dark" size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {siteConfig.tagline}. De {siteConfig.location.city}-{siteConfig.location.state},
            atendemos todo o{" "}
            <span className="whitespace-nowrap">{siteConfig.location.region}</span>.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href={siteConfig.phone.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${siteConfig.phone.display} (abre em nova aba)`}
              className="font-medium text-accent-soft hover:text-white"
            >
              WhatsApp {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="@duplexsoft no Instagram (abre em nova aba)"
              className="font-medium text-accent-soft hover:text-white"
            >
              @duplexsoft no Instagram
            </a>
          </div>
        </div>

        <nav aria-labelledby="footer-nav-heading">
          <h2 id="footer-nav-heading" className="text-sm font-semibold text-white/60">
            Navegação
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-channels-heading">
          <h2 id="footer-channels-heading" className="text-sm font-semibold text-white/60">
            Canais
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/contato" className="hover:text-accent-soft">
                Formulário de contato
              </Link>
            </li>
            <li>
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acessar DX Web (abre em nova aba)"
                className="hover:text-accent-soft"
              >
                Acessar DX Web
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (abre em nova aba)"
                className="hover:text-accent-soft"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="site-shell flex flex-col gap-2 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos reservados.
          </p>
          <p>{siteConfig.location.label} · Valores sob consulta</p>
        </div>
      </div>
    </footer>
  );
}
