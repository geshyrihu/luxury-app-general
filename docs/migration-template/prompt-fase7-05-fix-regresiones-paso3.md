# Prompt Fase 7 — Paso 5 (corrección urgente): regresiones reales del Paso 3

Auditoría independiente tras ejecutar Paso 3 (2026-09-16): `ng build
--configuration production` real da **exit 1, 24 ERROR**. Root-cause
identificado exactamente por archivo — 3 categorías distintas, ninguna
relacionada con PrimeNG en sí, todas causadas por la edición mecánica
del Paso 3.

## Categoría A — coma huérfana (hueco de array), invisible a `tsc`, rompe `ng build`

Al borrar el token del `imports:`, quedó una línea con solo `,` — eso
crea un hueco de array (`[a, , b]`) que `tsc --noEmit` no reporta pero
Angular AOT sí rechaza (`NG1010: 'imports' must be an array... Value
could not be determined statically`). **Borra la línea completa**
(la coma sola), no dejes nada en su lugar:

```
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/account-modal-add.ts:47
src/app/modules/accounting.luxuryapp/general-ledger/reporte-envio-financieros/reporte-envio-financieros.ts:37
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.ts:47
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.ts:56
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts:95
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts:34
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-colors/tokens-colors.ts:20
src/app/modules/auth.luxuryapp/login/login.ts (línea con `,` sola dentro de `imports:`, cerca de la línea 41)
src/app/modules/auth.luxuryapp/reset-password/reset-password.ts:37
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-editar.ts:49
src/app/modules/maintenance.luxuryapp/logs/bitacoras/medidores/medidor-lectura-chart.ts:32
```

Búscalo con: `grep -rnP "^\s*,\s*$" src/app/modules --include="*.ts"`
— cualquier resultado que caiga dentro de un arreglo `imports:` de un
`@Component` es de este tipo, bórralo.

## Categoría B — token todavía huérfano en `imports:` (import borrado, pero el nombre sigue en el arreglo)

Confirmado con `tsc --noEmit` (fresco, a esta hora): 8 errores
`TS2304: Cannot find name 'XModule'`. Quita el token del arreglo
`imports:` en cada uno (el import ya no existe, así que solo falta
retirar la referencia huérfana):

```
src/app/modules/auth.luxuryapp/recovery-password/recover-password.ts — MessageModule
src/app/modules/operations.luxuryapp/announcements/announcement/announcement-admin-list.ts — SelectModule
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-list.ts — InputTextModule
src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas-detalle.ts — MultiSelectModule
src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-report-work-plan.ts — SplitButtonModule
```

(`tool-list.ts` y los 2 `orden-compra-datos-*` de esta misma categoría
ya quedaron corregidos — confirmado, no hace falta tocarlos de nuevo.)

## Categoría C — colateral real: import ajeno borrado por error

`formulario-plantilla-evaluacion.ts` — **no es un error independiente**,
lo causó la edición del Paso 3 (confirmado con `git diff`, ver abajo).
Al borrar `InputGroupModule`/`InputGroupAddonModule` se borraron
también 2 líneas que no correspondían:

```diff
 import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
-import { InputGroupModule } from "@ui/web/primeng-inputgroup/primeng-inputgroup";
-import { InputGroupAddonModule } from "@ui/web/primeng-inputgroupaddon/primeng-inputgroupaddon";
-import { CustomerIdService } from "@core/auth/services/customer-id.service";
+import { CustomerIdService } from "@core/auth/services/customer-id.service";
 import { Endpoints } from "@core/constants/endpoints/endpoints";
```

Es decir: restaura la línea
`import { CustomerIdService } from "@core/auth/services/customer-id.service";`
(quítala solo del bloque borrado, no la de `InputGroupModule`/
`InputGroupAddonModule`, esas sí estaban correctamente identificadas
como muertas).

También se borró `LxFieldset` del arreglo `imports:`, pero **sí se usa
en la plantilla** (`<lx-fieldset>` en `formulario-plantilla-evaluacion.html`
líneas 68 y 148) — restaura esa entrada en `imports:` también:

```diff
   imports: [
-    InputGroupModule,
-    InputGroupAddonModule,
     LxTooltipDirective,
+    LxFieldset,
     WebButtonLabel,
```

(`LxFieldset` ya está importado arriba en el archivo, línea 25 —
`import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";`, no la
toques, solo falta la entrada en `imports:`.)

## Por qué importa esto

Tu propio reporte anterior calificó los 3 errores de
`formulario-plantilla-evaluacion.ts` como "independientes" — el
`git diff` de ese archivo (ver arriba) prueba que los causó
directamente el borrado del Paso 3, no un problema preexistente. Antes
de reportar algo como "no relacionado", confírmalo con `git diff
<archivo>` sobre el archivo específico, no solo con el mensaje de
error.

## Verificación (obligatoria, completa, sin `tail`)

1. `grep -rnP "^\s*,\s*$" src/app/modules --include="*.ts"` → dentro
   de arreglos `imports:` debe dar **0 resultados**.
2. `npx tsc --noEmit` → **0 errores**.
3. `ng build --configuration production > log.txt 2>&1; grep -c ERROR
   log.txt` → **debe imprimir el número real de la variable de
   entorno, revisando el archivo completo, no con `tail`** — objetivo:
   `0`.
4. Si el build vuelve a no devolver control (como en el reporte
   anterior), no lo reportes como "inconcluso" — espera a que termine
   o dime que sigue corriendo, pero no des el paso por cerrado sin el
   log completo con exit code confirmado.

## Listo cuando

- Categorías A, B y C corregidas.
- `tsc`: 0 errores.
- `ng build`: exit 0, 0 `ERROR`, log completo verificado (no `tail`,
  no build "inconcluso").
