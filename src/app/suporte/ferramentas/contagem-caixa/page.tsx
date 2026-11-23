import type { Metadata } from "next";
import Link from "next/link";
import { CashCountTool } from "@/components/CashCountTool";

export const metadata: Metadata = {
  title: "Contagem de caixa",
  description:
    "Conte cédulas e moedas, veja o total e receba sugestão de sangria deixando troco no gaveteiro. Ferramenta pública da DuplexSoft — sem login e sem guardar dados.",
};

export default function ContagemCaixaPage() {
  return (
    <div className="site-shell py-10 md:py-16">
      <nav aria-label="Trilha" className="text-sm text-muted">
        <Link href="/suporte" className="font-medium text-brand-deep underline-offset-4 hover:underline">
          Suporte
        </Link>
        <span aria-hidden="true" className="mx-2 text-muted">
          /
        </span>
        <span>Contagem de caixa</span>
      </nav>

      <div className="mt-5 max-w-xl">
        <h1 className="display-font text-balance text-3xl font-semibold text-brand-deep md:text-4xl">
          Contagem de caixa
        </h1>
        <p className="mt-3 max-w-prose text-pretty leading-relaxed text-muted">
          Informe as quantidades. Digite o fundo do próximo turno para ver o que retirar.
        </p>
      </div>

      <div className="mt-8">
        <CashCountTool />
      </div>
    </div>
  );
}
