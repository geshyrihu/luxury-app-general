# Prompt 7 — Fase 6: rollout de `collections.luxuryapp` (30 archivos)

Lote más grande hasta ahora (el doble del anterior). Mismo
procedimiento ya probado 3 veces. Ya se descartaron de antemano 2
archivos que no forman parte de este lote:

- `aspel-cobranza-haus/aspel-cobranza-reglas-negocio/aspel-cobranza-reglas-negocio.html`
  — usa `pTemplate=`, ya catalogado, no lo toques.
- `cobranza-online/resumen/cobranza-online-resumen.bak.html` — archivo
  de backup huérfano (ningún `.ts` lo referencia como `templateUrl`,
  Angular no lo compila), no lo toques ni lo borres.

## Lote (30 archivos)

```
src/app/modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus-debt-detail-modal.html
src/app/modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/approvals/approval-inbox.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/audit/financial-audit-log.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/charge-template-coverage/charge-template-coverage.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/charge-templates/charge-template-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/charge-types/charge-type-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/charges/charge-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/collection-cases/collection-case-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/initial-balance/initial-balance.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/invoices/invoice-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/late-fee-policies/late-fee-policy-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/ledger/ledger-viewer.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/members/member-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/native-statement/native-statement.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/payments/payment-detail-modal.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/payments/payment-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/payments/payments.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/period-closures/period-closure-dashboard.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/property-fines/property-fine-list.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/reconciliation/reconciliation-dashboard.html
src/app/modules/collections.luxuryapp/cobranza-nativa/core/regulation-articles/regulation-article-list.html
src/app/modules/collections.luxuryapp/cobranza-online/detalle-condominos/cobranza-online-detalle-condominos.html
src/app/modules/collections.luxuryapp/cobranza-online/exclusions/cobranza-online-exclusions.html
src/app/modules/collections.luxuryapp/cobranza-online/inspection/cobranza-online-inspection-history-modal.html
src/app/modules/collections.luxuryapp/cobranza-online/inspection/cobranza-online-inspection.html
src/app/modules/collections.luxuryapp/cobranza-online/movimientos/cobranza-online-movimientos.html
src/app/modules/collections.luxuryapp/cobranza-online/otros-cargos/cobranza-online-otros-cargos.html
src/app/modules/collections.luxuryapp/cobranza-online/resumen/cobranza-online-clasificacion-detail.ts
src/app/modules/collections.luxuryapp/cobranza-online/towers/cobranza-online-towers.html
```

Verifica tú mismo con
`grep -rl "<p-table" src/app/modules/collections.luxuryapp --include="*.html" --include="*.ts"`
que el total (este lote de 30 + los 2 excluidos arriba) coincide con
lo que existe en el repo; si tu conteo da un archivo más o menos que
el mío, detente y repórtalo antes de continuar — no asumas cuál de los
dos tiene razón.

## Procedimiento

1. `node scripts/migrate-p-table-standard.mjs --dry-run <los archivos del lote>`.
2. El reporte debería dar todos transformados, 0 excluidos, 0
   advertencias (ya se descartaron los 2 casos conocidos de antemano).
   Si sale distinto — cualquier exclusión/advertencia no esperada, o
   un conteo de archivos distinto al que armaste en el paso 1 — **
   detente y repórtalo sin escribir**, no seas héroe con un patrón que
   no calza.
3. Si calza, corre con `--write`.
4. `npx tsc --noEmit` → limpio.
5. **`ng build` o `ng serve` compilando sin ningún error de plantilla**
   (`NG8002`, `NG0303`, o binding inválido tipo `[class.]` como el que
   apareció en el lote anterior) — no te quedes solo con `tsc`, ya
   sabemos que no alcanza. Si encuentras algo así, aplica el mismo
   criterio que la vez pasada: si hay evidencia de contexto para
   reconstruir el valor correcto, hazlo; si no la hay, es más seguro
   borrar el binding roto que inventar un valor.
   0 resultados reales (recuerda: un import de `TableModule` sin
   ningún `<p-table>` en el mismo componente no es un residual real,
   es un import muerto preexistente — no lo cuentes como error, pero
   anótalo si lo ves).

## Verificación visual

Elige **6-7 pantallas** representativas, cubriendo los 3 sub-módulos
(`aspel-cobranza-haus`, `cobranza-nativa/core`, `cobranza-online`) —
por ejemplo `invoice-list.html`, `payment-list.html`,
`member-list.html`, `charge-list.html`,
`cobranza-online-movimientos.html`,
`cobranza-online-detalle-condominos.html`. Capturas reales guardadas
como archivo (`docs/migration-template/fase6-rollout-7-<nombre>.png`).

## Listo cuando

- Los ~30 archivos migrados, diff coherente con el dry-run.
- `tsc` y `ng build`/`ng serve` limpios de errores de plantilla.
- 6-7 capturas reales, completas (sidebar y contenido cargados, no a
  medio renderizar — si una se ve incompleta como pasó antes, repítela
  antes de reportarla).
- `git diff --stat` completo del lote.
- Cualquier hallazgo ajeno documentado con precisión (archivo:línea o
  endpoint).
