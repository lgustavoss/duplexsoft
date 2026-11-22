# Workflows — DuplexSoft + Impeccable

Fluxo proporcional: tarefas pequenas pulam etapas de planejamento/auditoria completa.

## Papéis

| Responsabilidade | Quem |
| --- | --- |
| Produto, tarefas, fluxos, IA, handoff | `ui-ux-designer` + `/ui-discovery` |
| Direção/composição/tipografia/cores/crítica visual / AI slop | **Impeccable** (`/impeccable …`) |
| Implementação React/TS, qualidade técnica | `senior-frontend-engineer` |
| Revisão independente renderizada | `visual-reviewer` (não duplicar detector) |
| Acessibilidade profunda | `accessibility-reviewer` (após `/impeccable audit` se usado) |

## Fluxo completo (feature ou redesign)

1. Analisar produto: ler `PRODUCT.md`; se faltar contexto → `/impeccable init` ou `ui-ux-designer`
2. Experiência e IA: `ui-ux-designer` e/ou `/impeccable shape`
3. Direção visual: `DESIGN.md`; se ausente/stale → `/impeccable document`
4. Planejar interface: `/impeccable shape` ou skill `interface-composition` (fallback)
5. Implementar: `senior-frontend-engineer` (stack Next/Tailwind existente)
6. Avaliar renderizado: browser + `/impeccable critique`
7. UX/design/a11y: `/impeccable audit` + opcionalmente `visual-reviewer` / `accessibility-reviewer`
8. Corrigir findings
9. Testes técnicos: `npm run lint` / build conforme o repo
10. Relatório: o que mudou, o que foi verificado, o que ficou aberto

## Fluxo curto (ajuste pontual)

Implementar → (opcional) `npx impeccable detect` no arquivo tocado → lint → pronto.

## Comandos Impeccable úteis

```text
/impeccable init
/impeccable document
/impeccable shape [feature]
/impeccable critique [target]
/impeccable audit [target]
/impeccable polish [target]
/impeccable layout|typeset|distill|bolder|quieter [target]
/impeccable doctor
/impeccable hooks status
```

CLI:

```bash
npx impeccable detect src/
npx impeccable detect http://localhost:3000
npx impeccable update
```

## Hook de design

`.cursor/hooks.json` roda o detector após `Write` em arquivos de UI. Em Cursor: Settings → Hooks; confiar no workspace. No Windows o comando aponta para `impeccable.cmd`. Desligar: `/impeccable hooks off`.

## Idioma do menu `/`

As `description` das skills/agents do projeto (e do Impeccable local) estão em português para o menu `/`.  
Atenção: `npx impeccable update` pode restaurar textos do Impeccable em inglês — nesse caso, reaplicar a tradução em `.cursor/skills/impeccable/SKILL.md` e `scripts/command-metadata.json`.
