# Prompt 17 — Fase 6: 4 archivos de `accounting.luxuryapp` que se escaparon del conteo original

Al hacer un barrido repo-wide para catalogar los casos especiales
restantes, encontré 4 archivos de `accounting.luxuryapp` que **nunca
entraron en los prompts 9/9b/9c/9d** — error de conteo mío, no un
caso especial. Son de antes de esta sesión (último commit
`05dd221fd`, 2026-09-14), y el dry-run los confirma limpios ahora
mismo: **4 transformados, 0 exclusiones, 0 advertencias**.

## Lote automático — 4 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/accounting.luxuryapp/budgeting/expense-catalog-detail/gasto-fijo-servicios.html \
  src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-list/sat-funding-list.html \
  src/app/modules/accounting.luxuryapp/general-ledger/expense-catalog-detail/gasto-fijo-servicios.html \
  src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-forecast-dialog.html
```

Nota: `gasto-fijo-servicios.html` existe en 2 copias (`budgeting/` y
`general-ledger/`), mismo patrón de duplicación ya visto con
`catalogo-gastos-fijos-list.html` en el Prompt 9c — son archivos
independientes, aplica el cambio a ambos.

**`budget-forecast-dialog.html` tiene además `<p-tablecheckbox>`/
`<p-tableheadercheckbox>`** (selección de filas por checkbox) —
hallazgo nuevo, no catalogado antes. El script no los toca (no son
`<p-table>` ni estándar), pero **confírmalo explícitamente**: después
de migrar el `<p-table>` principal, revisa si esos checkboxes de
selección siguen funcionando o si quedan huérfanos/rotos (no
deberían romper nada porque no dependen de `TableModule`, pero
verifica visualmente si puedes).

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos.
- `git diff --stat`: 4 `.html` + 4 `.ts` = 8 archivos.
- Capturas reales si tu herramienta de navegador lo permite esta vez;
  si sigue sin poder persistir PNG, repórtalo igual que las rondas
  anteriores (sin fabricar archivos) y cerramos por verificación de
  código, mismo criterio que `management`/`shared`.

## Listo cuando

- 4 archivos migrados y verificados.
- Confirmación sobre el estado de los checkboxes de selección en
  `budget-forecast-dialog`.
- `tsc`/build limpios.
- Con esto, `accounting.luxuryapp` pasa de 51 a **55/55** y el total
  del rollout pasa de 288 a **292 de 336**.
