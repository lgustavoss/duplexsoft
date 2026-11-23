/** Contagem de caixa em espécie (BRL). Tudo em centavos para evitar float. */

export type DenomKind = "note" | "coin";

export type Denomination = {
  id: string;
  label: string;
  cents: number;
  kind: DenomKind;
};

export const DENOMINATIONS: readonly Denomination[] = [
  { id: "200", label: "R$ 200", cents: 20_000, kind: "note" },
  { id: "100", label: "R$ 100", cents: 10_000, kind: "note" },
  { id: "50", label: "R$ 50", cents: 5_000, kind: "note" },
  { id: "20", label: "R$ 20", cents: 2_000, kind: "note" },
  { id: "10", label: "R$ 10", cents: 1_000, kind: "note" },
  { id: "5", label: "R$ 5", cents: 500, kind: "note" },
  { id: "2", label: "R$ 2", cents: 200, kind: "note" },
  { id: "1", label: "R$ 1", cents: 100, kind: "coin" },
  { id: "050", label: "R$ 0,50", cents: 50, kind: "coin" },
  { id: "025", label: "R$ 0,25", cents: 25, kind: "coin" },
  { id: "010", label: "R$ 0,10", cents: 10, kind: "coin" },
  { id: "005", label: "R$ 0,05", cents: 5, kind: "coin" },
] as const;

/** Menor → maior: para montar o fundo com o máximo de troco. */
const DENOMS_ASCENDING: readonly Denomination[] = [...DENOMINATIONS].reverse();

export type QuantityMap = Record<string, number>;

export function emptyQuantities(): QuantityMap {
  return Object.fromEntries(DENOMINATIONS.map((d) => [d.id, 0]));
}

export function clampQty(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.floor(value), 99_999);
}

export function lineTotalCents(denomCents: number, qty: number): number {
  return denomCents * clampQty(qty);
}

export function inventoryTotalCents(quantities: QuantityMap): number {
  return DENOMINATIONS.reduce(
    (sum, denom) => sum + lineTotalCents(denom.cents, quantities[denom.id] ?? 0),
    0,
  );
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function cloneQuantities(quantities: QuantityMap): QuantityMap {
  const next = emptyQuantities();
  for (const denom of DENOMINATIONS) {
    next[denom.id] = clampQty(quantities[denom.id] ?? 0);
  }
  return next;
}

/**
 * Monta um fundo exatamente igual a `floatCents`, preferindo moedas e notas menores.
 * Se não der para fechar no troco, completa com notas maiores (ainda tentando
 * preservar o máximo de troco possível). Retorna null se for impossível fechar.
 */
function composeFloatPreferringChange(
  quantities: QuantityMap,
  floatCents: number,
): QuantityMap | null {
  if (floatCents === 0) return emptyQuantities();

  const available = cloneQuantities(quantities);
  const remain = emptyQuantities();
  let need = floatCents;

  // 1) Encher o fundo com o menor troco possível (sem estourar).
  for (const denom of DENOMS_ASCENDING) {
    const availableQty = available[denom.id] ?? 0;
    if (availableQty <= 0 || need < denom.cents) continue;
    const take = Math.min(availableQty, Math.floor(need / denom.cents));
    if (take <= 0) continue;
    remain[denom.id] = take;
    available[denom.id] = availableQty - take;
    need -= take * denom.cents;
  }

  if (need === 0) return remain;

  // 2) Completar o que falta com a menor nota/moeda restante que caiba.
  for (const denom of DENOMS_ASCENDING) {
    while ((available[denom.id] ?? 0) > 0 && denom.cents <= need) {
      remain[denom.id] = (remain[denom.id] ?? 0) + 1;
      available[denom.id] = (available[denom.id] ?? 0) - 1;
      need -= denom.cents;
    }
    if (need === 0) return remain;
  }

  // 3) Se ainda falta, “quebra” uma peça maior: inclui a menor peça > need
  //    e devolve o troco excedente a partir do que já estava no fundo / disponível.
  if (need > 0) {
    for (const larger of DENOMS_ASCENDING) {
      if ((available[larger.id] ?? 0) <= 0 || larger.cents <= need) continue;

      // Tenta adicionar `larger` e remover `overshoot` do próprio remain (do maior para o menor).
      const overshoot = larger.cents - need;
      const trialRemain = { ...remain };
      trialRemain[larger.id] = (trialRemain[larger.id] ?? 0) + 1;

      let toRemove = overshoot;
      let ok = true;
      for (const denom of DENOMINATIONS) {
        if (toRemove <= 0) break;
        if (denom.id === larger.id) continue;
        const have = trialRemain[denom.id] ?? 0;
        if (have <= 0 || denom.cents > toRemove) continue;
        const removeQty = Math.min(have, Math.floor(toRemove / denom.cents));
        if (removeQty <= 0) continue;
        trialRemain[denom.id] = have - removeQty;
        toRemove -= removeQty * denom.cents;
      }

      if (toRemove !== 0) {
        ok = false;
      }

      if (ok) {
        // Confere total
        const trialTotal = inventoryTotalCents(trialRemain);
        if (trialTotal === floatCents) return trialRemain;
      }
    }
  }

  // 4) Fallback: retirar o excedente pelas maiores (preserva troco quando possível).
  return composeFloatByWithdrawingLarge(quantities, floatCents);
}

/**
 * Fallback clássico: parte do inventário inteiro e retira o excedente (T − F)
 * pelas cédulas/moedas maiores primeiro.
 */
function composeFloatByWithdrawingLarge(
  quantities: QuantityMap,
  floatCents: number,
): QuantityMap | null {
  const totalCents = inventoryTotalCents(quantities);
  if (floatCents > totalCents) return null;

  const remain = cloneQuantities(quantities);
  let toWithdraw = totalCents - floatCents;

  for (const denom of DENOMINATIONS) {
    const available = remain[denom.id] ?? 0;
    if (available <= 0 || toWithdraw < denom.cents) continue;
    const take = Math.min(available, Math.floor(toWithdraw / denom.cents));
    if (take <= 0) continue;
    remain[denom.id] = available - take;
    toWithdraw -= take * denom.cents;
  }

  if (toWithdraw !== 0) return null;
  if (inventoryTotalCents(remain) !== floatCents) return null;
  return remain;
}

export type WithdrawalSuggestion = {
  withdrawQty: QuantityMap;
  remainQty: QuantityMap;
  totalCents: number;
  floatTargetCents: number;
  withdrawTargetCents: number;
  withdrawActualCents: number;
  remainCents: number;
  /** Centavos que faltam para fechar o fundo exato com o inventário atual. */
  shortfallCents: number;
  status: "idle" | "ok" | "float-above-total" | "inexact" | "nothing-to-withdraw";
};

/**
 * Sugere sangria para deixar exatamente o fundo informado, priorizando
 * permanecer com o máximo de dinheiro trocado no gaveteiro.
 *
 * `floatTargetCents === null` → ainda não informou fundo (idle).
 */
export function suggestWithdrawal(
  quantities: QuantityMap,
  floatTargetCents: number | null,
): WithdrawalSuggestion {
  const totalCents = inventoryTotalCents(quantities);
  const inventory = cloneQuantities(quantities);
  const empty = emptyQuantities();

  if (floatTargetCents === null) {
    return {
      withdrawQty: empty,
      remainQty: inventory,
      totalCents,
      floatTargetCents: 0,
      withdrawTargetCents: 0,
      withdrawActualCents: 0,
      remainCents: totalCents,
      shortfallCents: 0,
      status: "idle",
    };
  }

  const float = Math.max(0, Math.floor(floatTargetCents));

  if (totalCents === 0 && float === 0) {
    return {
      withdrawQty: empty,
      remainQty: empty,
      totalCents,
      floatTargetCents: float,
      withdrawTargetCents: 0,
      withdrawActualCents: 0,
      remainCents: 0,
      shortfallCents: 0,
      status: "idle",
    };
  }

  if (float > totalCents) {
    return {
      withdrawQty: empty,
      remainQty: inventory,
      totalCents,
      floatTargetCents: float,
      withdrawTargetCents: 0,
      withdrawActualCents: 0,
      remainCents: totalCents,
      shortfallCents: 0,
      status: "float-above-total",
    };
  }

  const withdrawTargetCents = totalCents - float;

  if (withdrawTargetCents === 0) {
    return {
      withdrawQty: empty,
      remainQty: inventory,
      totalCents,
      floatTargetCents: float,
      withdrawTargetCents: 0,
      withdrawActualCents: 0,
      remainCents: totalCents,
      shortfallCents: 0,
      status: "nothing-to-withdraw",
    };
  }

  const remainQty = composeFloatPreferringChange(inventory, float);
  if (!remainQty) {
    return {
      withdrawQty: empty,
      remainQty: inventory,
      totalCents,
      floatTargetCents: float,
      withdrawTargetCents,
      withdrawActualCents: 0,
      remainCents: totalCents,
      shortfallCents: float,
      status: "inexact",
    };
  }

  const withdrawQty = emptyQuantities();
  for (const denom of DENOMINATIONS) {
    const have = inventory[denom.id] ?? 0;
    const keep = remainQty[denom.id] ?? 0;
    withdrawQty[denom.id] = Math.max(0, have - keep);
  }

  const remainCents = inventoryTotalCents(remainQty);
  const withdrawActualCents = totalCents - remainCents;
  const exact = remainCents === float;

  return {
    withdrawQty,
    remainQty,
    totalCents,
    floatTargetCents: float,
    withdrawTargetCents,
    withdrawActualCents,
    remainCents,
    shortfallCents: exact ? 0 : Math.max(0, float - remainCents),
    status: exact ? "ok" : "inexact",
  };
}

export function buildCashSummaryText(
  quantities: QuantityMap,
  floatTargetCents: number | null,
  suggestion: WithdrawalSuggestion,
): string {
  const lines: string[] = ["Contagem de caixa — DuplexSoft", ""];

  lines.push("Inventário:");
  for (const denom of DENOMINATIONS) {
    const qty = clampQty(quantities[denom.id] ?? 0);
    if (qty === 0) continue;
    lines.push(
      `  ${denom.label}: ${qty} × = ${formatBRL(lineTotalCents(denom.cents, qty))}`,
    );
  }
  lines.push(`Total em caixa: ${formatBRL(suggestion.totalCents)}`);

  if (floatTargetCents === null || suggestion.status === "idle") {
    lines.push("Fundo desejado: (não informado)");
  } else {
    lines.push(`Fundo desejado: ${formatBRL(Math.max(0, Math.floor(floatTargetCents)))}`);
  }

  if (suggestion.status === "ok" || suggestion.status === "inexact") {
    lines.push(`A retirar: ${formatBRL(suggestion.withdrawActualCents)}`);
    lines.push(`Fica no caixa: ${formatBRL(suggestion.remainCents)}`);
    lines.push("");
    lines.push("Sugestão de retirada (fundo exato, prioriza deixar troco):");
    for (const denom of DENOMINATIONS) {
      const qty = suggestion.withdrawQty[denom.id] ?? 0;
      if (qty === 0) continue;
      lines.push(
        `  ${denom.label}: ${qty} · ${formatBRL(lineTotalCents(denom.cents, qty))}`,
      );
    }
    lines.push("Fica no caixa:");
    for (const denom of DENOMINATIONS) {
      const qty = suggestion.remainQty[denom.id] ?? 0;
      if (qty === 0) continue;
      lines.push(
        `  ${denom.label}: ${qty} · ${formatBRL(lineTotalCents(denom.cents, qty))}`,
      );
    }
    if (suggestion.shortfallCents > 0) {
      lines.push(
        `Atenção: não foi possível fechar exatamente o fundo; faltam ${formatBRL(suggestion.shortfallCents)}.`,
      );
    }
  } else if (suggestion.status === "float-above-total") {
    lines.push("O fundo informado é maior que o total em caixa.");
  } else if (suggestion.status === "nothing-to-withdraw") {
    lines.push("Nada a retirar — o total já corresponde ao fundo.");
  }

  lines.push("");
  lines.push("Cálculo local — nada foi enviado ou armazenado.");
  return lines.join("\n");
}
