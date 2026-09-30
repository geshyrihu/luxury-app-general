# Prompt 23 — Fase 6: 10 archivos más con `TableModule` importado pero nunca usado

Barrido final tras cerrar Grupo 1: quedaban 11 archivos importando
`TableModule` importado y registrado en `imports:`, pero **ningún
`<p-table>` en su plantilla** (ni `.html` separado, ni inline) —
import 100% muerto, nunca migrado porque nunca se usó de verdad. El
11º (`warehouse-stock-add.ts`) solo importa el tipo
`TableLazyLoadEvent`, que sí se usa — **no lo toques**, ese está bien.

## Migrar — retirar el import muerto en los 10

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit/catalog-audit.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-colors/tokens-colors.ts
src/app/modules/collections.luxuryapp/cobranza-online/resumen/cobranza-online-resumen.ts
src/app/modules/maintenance.luxuryapp/logs/bitacoras/medidores/medidores-list.ts
src/app/modules/operations.luxuryapp/manuals/biblioteca/financial-report/informe-financiero-list.ts
src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-organigrama.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/participants/task-group-participant.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/task-read-list.ts
src/app/modules/supplier.luxuryapp/po/purchase-link-manager/purchase-link-manager.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/forms/orden-compra-status.ts
```

En cada uno: quita la línea
y quita `TableModule` del arreglo `imports:`.

**3 tienen el arreglo `imports:` en una sola línea** — cuidado al
quitar solo el token, no la línea completa (los otros imports del
mismo arreglo deben quedarse):

```diff
# cobranza-online-resumen.ts
- imports: [CommonModule, TableModule, SharedModule, PieChart],
+ imports: [CommonModule, SharedModule, PieChart],
```

```diff
# entrega-recepcion-organigrama.ts
- imports: [TableModule],
+ imports: [],
```

```diff
# task-read-list.ts
- imports: [AppIcon, TableModule],
+ imports: [AppIcon],
```

Los otros 7 tienen `TableModule,` en su propia línea dentro de un
arreglo multilínea — solo borra esa línea.

## No tocar

```
src/app/modules/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-add.ts
```

Solo importa el tipo `TableLazyLoadEvent` (sí se usa), no
`TableModule`. Está bien tal cual.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- No hace falta capturas — es retirar imports muertos que nunca
  renderizaban nada, no debería cambiar ninguna pantalla visualmente.

## Listo cuando

- 10 archivos con el import muerto retirado.
- 1 archivo sin tocar (`warehouse-stock-add.ts`).
- `tsc`/build limpios (log completo, no `tail`).
  referenciado por el tipo `TableLazyLoadEvent`, no por ningún
  `TableModule` activo en todo el repo — cierre total de la limpieza
  de imports huérfanos de Fase 6.
