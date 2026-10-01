# Prompt 9b — Fase 6: 7 archivos de `accounting.luxuryapp` con nombres no estándar

El dry-run del Prompt 9 encontró 10 advertencias en 9 archivos.
Investigadas todas contra el código real — se agrupan en 2 causas
distintas, ninguna es un archivo huérfano de verdad:

## Grupo A — 4 archivos: el `.ts` no tiene el mismo nombre base que el `.html`

El script asume que `X.html` lo usa `X.ts` — estos 4 rompen esa
asunción, pero **sí están en uso real**, confirmado por
`templateUrl` en su `.ts` real:

| `.html` (visto por el script) | `.ts` real que lo usa |
|---|---|
| `fondeos-y-reporteo/funding/funding-group-files/funding-group-files.html` | `funding-group-files/funding-group-files..ts` (⚠️ nombre real con doble punto, typo preexistente — no lo renombres, solo úsalo tal cual está) |
| `fondeos-y-reporteo/funding/funding-upload-invoices-modal.html` | `fondeos-y-reporteo/funding/modal-funding-upload-invoices.ts` |
| `general-ledger/pendientes-minuta/minuta-pendientes-list.html` | `general-ledger/pendientes-minuta/cont-list-minuta-pendientes.ts` |
| `general-ledger/presupuesto-propuesta/budget-execution-details-modal.html` | `general-ledger/presupuesto-propuesta/modal-budget-execution-details.ts` |

**Trátalos a mano** (no con el script, que no los va a encontrar):
aplica exactamente el mismo patrón mecánico de siempre a cada par
(`<p-table>`→`<app-table>`, `pSortableColumn`→`appSortableColumn`,
`<p-sorticon>`→`<app-sorticon>`, `<ng-template caption/header/body/
emptymessage/paginatorleft>` sin `#` → con `#` si aplica, e import de
`TableModule` → `AppTable`/`AppSortableColumn`/`AppSorticon` en el
`.ts` real de la tabla de arriba, no en el que comparte nombre con el
`.html`).

## Grupo B — 3 archivos: el `.ts` importa `Table` además de `TableModule`

```
general-ledger/dynamic-reports/report-catalog/report-catalog.ts
general-ledger/presupuesto-propuesta/presupuesto-propuesta.ts
general-ledger/presupuesto-web-aspel/espejo-aspel-presupuesto.ts
```

Los 3 tienen `import { Table, TableModule } from
`dt = viewChild<Table>("dt")` (o `"table"`) — una referencia tipada al
componente de tabla vía `viewChild` con signals. El script no toca
este patrón porque no coincide exactamente con el import esperado.

**Trátalos a mano** — el `.html` de estos 3 **sí lo puede procesar el
script normalmente** (sácalos del lote automático solo por el `.ts`,
o edítalos a mano también, como prefieras, pero no los dejes a medias:
o los dos archivos por el script si lo ajustas, o los dos a mano).
Cambio exacto en el `.ts`:

```diff
+ import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

y más abajo:

```diff
- dt = viewChild<Table>("dt");
+ dt = viewChild<AppTable>("dt");
```

(usa el nombre real del template ref que cada archivo use — `"dt"` en
`presupuesto-propuesta.ts`/`espejo-aspel-presupuesto.ts`, `"table"` en
`report-catalog.ts`, ya confirmado). No olvides also actualizar el
array `imports: [...]` del `@Component` (quitar `TableModule`, agregar
`AppTable`/`AppSortableColumn`/`AppSorticon`) y el HTML
(`<p-table>`→`<app-table>` etc.) si decides hacerlo a mano en vez de
con el script.

## Resto del lote (44 archivos)

Los 51 del Prompt 9 **menos estos 7** siguen el procedimiento normal
del script (dry-run → si calza 44/44 sin advertencias → `--write`).
No cambia nada más de lo ya indicado en `prompt-fase6-rollout-9-modulo-accounting.md`
(las 6 exclusiones completas y los 2 fixes de `virtualScrollItemSize`
siguen igual).

## Verificación y listo cuando

Igual que el Prompt 9 original: `tsc`/`ng build` limpios, 0 residuales
reales, capturas de las pantallas ya sugeridas más al menos 2 de los 7
archivos especiales de este prompt (confirma que `funding-group-files`,
`presupuesto-propuesta` o `report-catalog` cargan y ordenan bien).
`git diff --stat` del lote completo (51 archivos en total, contando
los 7 de este prompt).
