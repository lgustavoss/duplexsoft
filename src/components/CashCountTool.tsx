"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DENOMINATIONS,
  buildCashSummaryText,
  clampQty,
  emptyQuantities,
  formatBRL,
  inventoryTotalCents,
  lineTotalCents,
  suggestWithdrawal,
  type QuantityMap,
  type WithdrawalSuggestion,
} from "@/lib/cash-count";

const fieldClass =
  "w-full min-w-0 rounded-xl border border-line bg-white px-3 py-2.5 text-right text-base text-foreground tabular-nums caret-[var(--brand)] outline-none ring-brand/30 placeholder:text-brand-deep/55 focus:ring-2 md:text-sm";

function parseQtyInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return clampQty(Number(digits));
}

function parseMoneyToCents(raw: string): number {
  const normalized = raw.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 100);
}

function hasAnyQuantity(quantities: QuantityMap): boolean {
  return DENOMINATIONS.some((d) => (quantities[d.id] ?? 0) > 0);
}

const QTY_INPUT_IDS = DENOMINATIONS.map((d) => `qty-${d.id}`);

function focusQtyField(inputId: string) {
  const node = document.getElementById(inputId);
  if (!(node instanceof HTMLInputElement)) return;
  node.focus();
  node.select();
}

function moveQtyFocus(currentId: string, direction: 1 | -1) {
  const index = QTY_INPUT_IDS.indexOf(currentId);
  if (index < 0) return;

  const nextIndex = index + direction;
  if (nextIndex >= 0 && nextIndex < QTY_INPUT_IDS.length) {
    focusQtyField(QTY_INPUT_IDS[nextIndex]!);
    return;
  }

  if (direction > 0) {
    const floatNode = document.getElementById("float-input");
    if (floatNode instanceof HTMLInputElement) {
      floatNode.focus();
      floatNode.select();
    }
  }
}

function remainDisplayCents(suggestion: WithdrawalSuggestion): number {
  if (suggestion.status === "float-above-total") return suggestion.remainCents;
  if (
    suggestion.status === "ok" ||
    suggestion.status === "nothing-to-withdraw"
  ) {
    return suggestion.floatTargetCents;
  }
  return suggestion.remainCents;
}

function SummaryActions({
  onClear,
  onCopy,
  copyState,
  compact = false,
}: {
  onClear: () => void;
  onCopy: () => void;
  copyState: "idle" | "ok" | "error";
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "w-full"}`}>
      <button
        type="button"
        className={`btn-primary ${compact ? "h-10 px-3 text-sm" : "flex-1"}`}
        onClick={onClear}
      >
        Limpar
      </button>
      <button
        type="button"
        className={`btn-secondary ${compact ? "h-10 px-3 text-sm" : "flex-1"}`}
        onClick={onCopy}
      >
        {copyState === "ok"
          ? "Copiado"
          : copyState === "error"
            ? "Falha ao copiar"
            : "Copiar resumo"}
      </button>
    </div>
  );
}

export function CashCountTool() {
  const [quantities, setQuantities] = useState<QuantityMap>(() => emptyQuantities());
  const [floatInput, setFloatInput] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "ok" | "error">("idle");
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [mobileChromeReady, setMobileChromeReady] = useState(false);

  const inventoryRef = useRef<HTMLDivElement>(null);
  const floatSectionRef = useRef<HTMLElement>(null);

  const floatProvided = floatInput.trim() !== "";
  const floatCents = useMemo(
    () => (floatProvided ? parseMoneyToCents(floatInput) : null),
    [floatInput, floatProvided],
  );
  const totalCents = useMemo(() => inventoryTotalCents(quantities), [quantities]);
  const suggestion = useMemo(
    () => suggestWithdrawal(quantities, floatCents),
    [quantities, floatCents],
  );

  const notes = DENOMINATIONS.filter((d) => d.kind === "note");
  const coins = DENOMINATIONS.filter((d) => d.kind === "coin");
  const withdrawLines = DENOMINATIONS.filter(
    (d) => (suggestion.withdrawQty[d.id] ?? 0) > 0,
  );
  const remainLines = DENOMINATIONS.filter(
    (d) => (suggestion.remainQty[d.id] ?? 0) > 0,
  );
  const showBreakdown =
    (suggestion.status === "ok" || suggestion.status === "inexact") &&
    suggestion.withdrawActualCents > 0;

  useEffect(() => {
    setMobileChromeReady(true);
  }, []);

  useEffect(() => {
    if (!mobileChromeReady) return;

    const inventory = inventoryRef.current;
    const floatSection = floatSectionRef.current;
    if (!inventory || !floatSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const floatEntry = entries.find((e) => e.target === floatSection);
        const inventoryEntry = entries.find((e) => e.target === inventory);

        if (floatEntry?.isIntersecting && floatEntry.intersectionRatio > 0.12) {
          setShowMobileBar(false);
          return;
        }
        if (inventoryEntry) {
          setShowMobileBar(inventoryEntry.isIntersecting);
        }
      },
      { threshold: [0, 0.12, 0.35], rootMargin: "0px 0px -18% 0px" },
    );

    observer.observe(inventory);
    observer.observe(floatSection);
    return () => observer.disconnect();
  }, [mobileChromeReady]);

  function setQty(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: clampQty(qty) }));
  }

  function bumpQty(id: string, delta: number) {
    setQty(id, (quantities[id] ?? 0) + delta);
  }

  function clearAll() {
    const dirty = hasAnyQuantity(quantities) || floatProvided;
    if (dirty && !window.confirm("Limpar toda a contagem e o fundo informado?")) {
      return;
    }
    setQuantities(emptyQuantities());
    setFloatInput("");
    setCopyState("idle");
  }

  async function copySummary() {
    const text = buildCashSummaryText(quantities, floatCents, suggestion);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("ok");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 3500);
    }
  }

  function renderDenomRows(items: typeof DENOMINATIONS) {
    return (
      <ul className="divide-y divide-line">
        {items.map((denom) => {
          const qty = quantities[denom.id] ?? 0;
          const line = lineTotalCents(denom.cents, qty);
          const inputId = `qty-${denom.id}`;
          return (
            <li
              key={denom.id}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(5rem,5.75rem)_minmax(5rem,6.5rem)] items-center gap-2 py-2.5 sm:gap-3"
            >
              <label htmlFor={inputId} className="font-medium text-brand-deep">
                {denom.label}
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  tabIndex={-1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-lg text-brand-deep hover:bg-surface-soft disabled:opacity-40"
                  aria-label={`Diminuir ${denom.label}`}
                  onClick={() => bumpQty(denom.id, -1)}
                  disabled={qty <= 0}
                >
                  −
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-lg text-brand-deep hover:bg-surface-soft"
                  aria-label={`Aumentar ${denom.label}`}
                  onClick={() => bumpQty(denom.id, 1)}
                >
                  +
                </button>
              </div>
              <input
                id={inputId}
                inputMode="numeric"
                pattern="[0-9]*"
                className={fieldClass}
                value={qty === 0 ? "" : String(qty)}
                placeholder="0"
                aria-label={`Quantidade de ${denom.label}`}
                onChange={(event) => setQty(denom.id, parseQtyInput(event.target.value))}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  moveQtyFocus(inputId, event.shiftKey ? -1 : 1);
                }}
                onFocus={(event) => event.currentTarget.select()}
              />
              <p
                className="text-right text-sm tabular-nums text-muted"
                aria-live="polite"
              >
                {qty > 0 ? formatBRL(line) : "—"}
              </p>
            </li>
          );
        })}
      </ul>
    );
  }

  const panelFloatReady =
    floatProvided &&
    suggestion.status !== "idle" &&
    suggestion.status !== "float-above-total";

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-10">
      <div className="min-w-0 space-y-8">
        <p className="text-sm text-muted">
          Cálculo só neste aparelho — nada é enviado ou guardado.
        </p>

        <div ref={inventoryRef} className="grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="notes-heading">
            <h2
              id="notes-heading"
              className="display-font text-xl font-semibold text-brand-deep"
            >
              Cédulas
            </h2>
            <div className="mt-3 border-t border-line">{renderDenomRows(notes)}</div>
          </section>

          <section aria-labelledby="coins-heading">
            <h2
              id="coins-heading"
              className="display-font text-xl font-semibold text-brand-deep"
            >
              Moedas
            </h2>
            <div className="mt-3 border-t border-line">{renderDenomRows(coins)}</div>
          </section>
        </div>

        {/* Espaço para a barra mobile não cobrir o fim do inventário */}
        <div className="h-16 lg:hidden" aria-hidden="true" />

        <section
          ref={floatSectionRef}
          aria-labelledby="float-heading"
          className="rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6"
        >
          <h2
            id="float-heading"
            className="display-font text-xl font-semibold text-brand-deep"
          >
            Fundo e sangria
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Quanto deve ficar no gaveteiro para o próximo turno?
          </p>

          <div className="mt-5 max-w-xs">
            <label htmlFor="float-input" className="text-sm font-medium text-brand-deep">
              Fundo desejado (R$)
            </label>
            <input
              id="float-input"
              inputMode="decimal"
              className={`${fieldClass} mt-1.5 text-left`}
              value={floatInput}
              placeholder="Ex.: 200,00"
              onChange={(event) => setFloatInput(event.target.value)}
            />
          </div>

          {/* Resumo inline no mobile (substitui sticky quando a sangria está à vista) */}
          <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3 lg:hidden">
            <div>
              <p className="text-sm text-muted">Total</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-brand-deep">
                {formatBRL(totalCents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">A retirar</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-brand-deep">
                {formatBRL(
                  !floatProvided || suggestion.status === "float-above-total"
                    ? 0
                    : suggestion.withdrawActualCents,
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Fica</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-brand-deep">
                {formatBRL(
                  !floatProvided
                    ? totalCents
                    : remainDisplayCents(suggestion),
                )}
              </p>
            </div>
          </div>

          {!floatProvided ? (
            <p className="mt-5 text-sm text-muted" role="status">
              Digite o fundo para ver o que retirar.
            </p>
          ) : (
            <>
              {suggestion.status === "float-above-total" ? (
                <p className="mt-5 text-sm text-red-700" role="alert">
                  O fundo é maior que o total em caixa. Ajuste as quantidades ou o valor.
                </p>
              ) : null}

              {suggestion.status === "inexact" ? (
                <p className="mt-5 text-sm text-amber-800" role="status">
                  Não dá para deixar exatamente {formatBRL(suggestion.floatTargetCents)}
                  {suggestion.shortfallCents > 0
                    ? ` (faltam ${formatBRL(suggestion.shortfallCents)})`
                    : ""}
                  . Revise a contagem ou o fundo.
                </p>
              ) : null}

              {suggestion.status === "nothing-to-withdraw" && totalCents > 0 ? (
                <p className="mt-5 text-sm text-muted" role="status">
                  Nada a retirar: o total já é o fundo.
                </p>
              ) : null}

              {suggestion.status === "ok" ? (
                <p className="mt-5 text-sm font-medium text-brand-deep" role="status">
                  Fundo fechado em {formatBRL(suggestion.floatTargetCents)}.
                </p>
              ) : null}

              {showBreakdown ? (
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-deep">Retire isto</h3>
                    <ul className="mt-3 space-y-2 md:hidden">
                      {withdrawLines.map((denom) => {
                        const qty = suggestion.withdrawQty[denom.id] ?? 0;
                        return (
                          <li
                            key={denom.id}
                            className="flex items-baseline justify-between gap-3 border-b border-line/70 py-2.5"
                          >
                            <span className="font-medium text-brand-deep">
                              {qty}× {denom.label}
                            </span>
                            <span className="tabular-nums text-muted">
                              {formatBRL(lineTotalCents(denom.cents, qty))}
                            </span>
                          </li>
                        );
                      })}
                      <li className="flex justify-between gap-3 pt-2 font-semibold text-brand-deep">
                        <span>Total a retirar</span>
                        <span className="tabular-nums">
                          {formatBRL(suggestion.withdrawActualCents)}
                        </span>
                      </li>
                    </ul>

                    <div className="mt-3 hidden overflow-x-auto md:block">
                      <table className="w-full text-left text-sm">
                        <caption className="sr-only">Notas e moedas a retirar</caption>
                        <thead>
                          <tr className="border-b border-line text-muted">
                            <th scope="col" className="py-2 font-medium">
                              Denominação
                            </th>
                            <th scope="col" className="py-2 text-right font-medium">
                              Qtd
                            </th>
                            <th scope="col" className="py-2 text-right font-medium">
                              Valor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawLines.map((denom) => {
                            const qty = suggestion.withdrawQty[denom.id] ?? 0;
                            return (
                              <tr key={denom.id} className="border-b border-line/70">
                                <th
                                  scope="row"
                                  className="py-2.5 font-medium text-brand-deep"
                                >
                                  {denom.label}
                                </th>
                                <td className="py-2.5 text-right tabular-nums font-semibold text-brand-deep">
                                  {qty}
                                </td>
                                <td className="py-2.5 text-right tabular-nums text-muted">
                                  {formatBRL(lineTotalCents(denom.cents, qty))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-brand-deep/20">
                            <th
                              scope="row"
                              className="py-3 font-semibold text-brand-deep"
                            >
                              Total
                            </th>
                            <td className="py-3 text-right text-muted">—</td>
                            <td className="py-3 text-right tabular-nums font-semibold text-brand-deep">
                              {formatBRL(suggestion.withdrawActualCents)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <details className="group rounded-xl border border-line bg-surface-soft/60 open:bg-surface-soft">
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-brand-deep marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-2">
                        O que fica no gaveteiro
                        <span
                          aria-hidden="true"
                          className="text-muted transition group-open:rotate-90"
                        >
                          ›
                        </span>
                      </span>
                    </summary>
                    <ul className="space-y-2 border-t border-line px-4 py-3">
                      {remainLines.map((denom) => {
                        const qty = suggestion.remainQty[denom.id] ?? 0;
                        return (
                          <li
                            key={denom.id}
                            className="flex items-baseline justify-between gap-3 text-sm"
                          >
                            <span className="text-brand-deep">
                              {qty}× {denom.label}
                            </span>
                            <span className="tabular-nums text-muted">
                              {formatBRL(lineTotalCents(denom.cents, qty))}
                            </span>
                          </li>
                        );
                      })}
                      <li className="flex justify-between gap-3 border-t border-line pt-2 text-sm font-semibold text-brand-deep">
                        <span>Total que fica</span>
                        <span className="tabular-nums">
                          {formatBRL(suggestion.remainCents)}
                        </span>
                      </li>
                    </ul>
                  </details>

                  <details className="group rounded-xl border border-line open:bg-surface-soft/40">
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-muted marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-2">
                        Como calculamos?
                        <span
                          aria-hidden="true"
                          className="transition group-open:rotate-90"
                        >
                          ›
                        </span>
                      </span>
                    </summary>
                    <p className="max-w-prose border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">
                      O valor que fica no gaveteiro é exatamente o fundo informado. A
                      retirada prioriza notas maiores para sobrar o máximo de troco
                      possível. Se as notas e moedas atuais não permitirem fechar o
                      fundo, avisamos para você ajustar a contagem.
                    </p>
                  </details>
                </div>
              ) : null}
            </>
          )}

          <div className="mt-6 lg:hidden">
            <SummaryActions
              onClear={clearAll}
              onCopy={copySummary}
              copyState={copyState}
            />
          </div>
        </section>
      </div>

      {/* Painel desktop — sticky lateral, não cobre a sangria */}
      <aside
        className="sticky top-24 hidden rounded-[var(--radius)] border border-brand/25 bg-surface p-5 shadow-[0_12px_32px_rgba(10,27,58,0.08)] lg:block"
        aria-label="Resumo da contagem"
      >
        <div role="status" aria-live="polite">
          <p className="text-sm text-muted">Total em caixa</p>
          <p className="display-font mt-1 text-3xl font-semibold tabular-nums text-brand-deep">
            {formatBRL(totalCents)}
          </p>

          {panelFloatReady ? (
            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">A retirar</dt>
                <dd className="font-semibold tabular-nums text-brand-deep">
                  {formatBRL(suggestion.withdrawActualCents)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Fica</dt>
                <dd className="font-semibold tabular-nums text-brand-deep">
                  {formatBRL(remainDisplayCents(suggestion))}
                </dd>
              </div>
            </dl>
          ) : floatProvided && suggestion.status === "float-above-total" ? (
            <p className="mt-4 text-sm text-red-700">Fundo maior que o total.</p>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Informe o fundo para calcular a sangria.
            </p>
          )}
        </div>

        <div className="mt-6">
          <SummaryActions
            onClear={clearAll}
            onCopy={copySummary}
            copyState={copyState}
          />
        </div>
      </aside>

      {/* Barra compacta mobile — só após mount; some quando a sangria está em foco */}
      {mobileChromeReady && showMobileBar ? (
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(10,27,58,0.08)] backdrop-blur-sm lg:hidden"
          role="status"
          aria-live="polite"
        >
          <div className="site-shell flex items-center justify-between gap-3 !px-0">
            <div className="min-w-0 shrink">
              <p className="text-xs text-muted">Total</p>
              <p className="text-base font-semibold tabular-nums text-brand-deep sm:text-lg">
                {formatBRL(totalCents)}
              </p>
            </div>
            <SummaryActions
              onClear={clearAll}
              onCopy={copySummary}
              copyState={copyState}
              compact
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
