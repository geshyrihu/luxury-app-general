# Prompt Fase 7 — Reverificación final: 23 archivos con residuos reales de PrimeNG

Reverificación completa (2026-09-16) de todos los wrappers
`@ui/web/primeng-*` tras cerrar catálogo + ConfirmDialog. La mayoría
del árbol ya está limpio; quedan 23 archivos en 7 grupos — algunos son
del propio Paso 3 que quedaron sin aplicar pese a estar en ese prompt
(verifica cada uno con `grep` antes de tocar, no asumas).

## Grupo 1 — `button` dead, 4 archivos (ya estaban en Paso 3, no se aplicaron)

Confirmado con `grep -c "<p-button\|pButton\b"` → 0 en los 4 (ni en
`.ts` ni en su plantilla resuelta):

```
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-auth-parcial.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-cotizacion.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-pago-parcial.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-status-parcial.ts
```
Quita `import { ButtonModule } from "@ui/web/primeng-button/primeng-button";`
y `ButtonModule` del arreglo `imports:` en los 4.

## Grupo 2 — `menu` dead, 2 archivos (ya estaban en Paso 3, no se aplicaron)

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-operation-report.ts
```
Quita el import de `@ui/web/primeng-menu/primeng-menu` (`Menu` en el
primero, `MenuModule` en el segundo) y su entrada en `imports:`.

## Grupo 3 — `SharedModule`/`pTemplate` dead, 6 archivos (hallazgo nuevo)

Confirmado: 0 uso de `pTemplate` en ninguno de los 6 — el import se
registra pero nunca se usa:

```
src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel-full/espejo-aspel-full.ts
src/app/modules/collections.luxuryapp/cobranza-online/detalle-condominos/cobranza-online-detalle-condominos.ts
src/app/modules/collections.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad-detail-modal.ts
src/app/modules/collections.luxuryapp/cobranza-online/movimientos/cobranza-online-movimientos.ts
src/app/modules/collections.luxuryapp/cobranza-online/otros-cargos/cobranza-online-otros-cargos.ts
src/app/modules/collections.luxuryapp/cobranza-online/resumen/cobranza-online-resumen.ts
```
Quita `import { SharedModule } from "@ui/web/primeng-api/primeng-api";`
y `SharedModule` del arreglo `imports:` en los 6. **2 tienen el
arreglo en una sola línea** (`cobranza-online-morosidad-detail-modal.ts`:
`imports: [CommonModule, SharedModule, LxTag, NgClass, LxSpinner, AppIcon]`;
`cobranza-online-resumen.ts`: `imports: [CommonModule, SharedModule, PieChart]`)
— cuidado al quitar solo el token.

## Grupo 4 — `MessageService` (de `primeng-api`) dead, 2 archivos

```
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-fotos.ts
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-reporte-proveedor.ts
```
El primero ni siquiera inyecta `MessageService` (import muerto puro).
El segundo lo inyecta (`messageS = inject(MessageService)`) pero nunca
llama `.add()`/`.clear()` — confirmado con grep, 0 llamadas. Quita
import + injection en ambos (y del arreglo `providers:` si estuviera
ahí).

## Grupo 5 — `MessageService` (de `primeng-api`) REAL, 6 archivos — redirigir import

Estos SÍ llaman `.add()` de verdad. El token de PrimeNG ya está
aliasado en `app.config.ts` (`{ provide: PrimeMessageService, useExisting: MessageService }`)
así que funcionalmente ya usan el servicio propio en runtime — pero
importan el TIPO desde el wrapper de PrimeNG, lo cual bloquea poder
borrar `@ui/web/primeng-api` más adelante. Redirige el import
directo al servicio real, sin tocar la lógica de las llamadas:

```
src/app/modules/accounting.luxuryapp/general-ledger/pendientes-minuta/cont-list-minuta-pendientes.ts
src/app/modules/human-resources.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance.ts
src/app/modules/operations.luxuryapp/diagrams/diagram/diagram-editor/diagram-editor.ts
src/app/modules/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/manual-flowchart-editor/manual-flowchart-editor.ts
src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/org-chart/org-chart.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.ts
```
```diff
-import { MessageService } from "@ui/web/primeng-api/primeng-api";
+import { MessageService } from "@core/services/message.service";
```
No cambies nada más — el resto de la clase (injection,
`.add({severity,summary,detail,life})`) funciona idéntico, es la
misma firma.

## Grupo 6 — `primeng-custom-toast` real, 2 archivos

`PrimeNgCustomToast` (`@ui/web/primeng-custom-toast/primeng-custom-toast`)
renderiza literalmente `<p-toast>` de `primeng/toast` por dentro —
PrimeNG real, no un wrapper Bootstrap con nombre heredado.

```
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra.ts
```
`app.html` ya monta un `<app-toast />` global para toda la app — estos
2 toasts locales son redundantes. Quita en ambos:
```diff
-import { PrimeNgCustomToast } from "@ui/web/primeng-custom-toast/primeng-custom-toast";
```
y `PrimeNgCustomToast` del arreglo `imports:`, y en el `.html` de cada
uno quita el `<primeng-custom-toast />` (o `<primeng-custom-toast>...`,
verifica su forma exacta en cada plantilla).

(`orden-compra-presupuesto.ts` es el mismo archivo del Grupo 5 —
aplica ambos cambios ahí)

## Grupo 7 — `carousel`, 1 archivo — `@ViewChild` muerto

```
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-presentacion.ts
```
El componente **ya usa `<lx-carousel>` (Bootstrap real)** en su
plantilla — el import de `primeng-carousel` sobrevive solo para tipar
un `@ViewChild` que **nunca se usa en ningún otro lugar del archivo**
(confirmado, 0 referencias a `presentationCarousel` fuera de su propia
declaración):
```diff
-import { Carousel } from "@ui/web/primeng-carousel/primeng-carousel";
```
```diff
-  @ViewChild("presentationCarousel") presentationCarousel?: Carousel;
```
Borra ambas líneas completas (el import y la declaración del
`@ViewChild`) — es código muerto, no reemplaces por otro tipo.

## No tocar

Los tipos `MenuItem`/`TreeNode`/`SortEvent` de `@ui/web/primeng-api/primeng-api`
que sigan en otros archivos tras este prompt — son solo tipado, no
componentes, catalogados aparte para cuando se evalúe retirar
`primeng/api` del todo (no bloquean nada por ahora).

`warehouse-stock-add.ts` (solo usa el tipo `TableLazyLoadEvent`) — ya
confirmado correcto en una auditoría anterior, no tocar.

## Verificación

- Recorre cada grupo y confirma con tu propio `grep` antes de borrar
  (la instrucción ya viene verificada, pero si encuentras uso real en
  algún archivo que esta lista no capturó, detente y repórtalo en vez
  de tocarlo).
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`** — esta vez espera a
  que el proceso termine de verdad antes de reportar, no reportes
  "inconcluso".
- Capturas: los 2 toasts locales retirados (Grupo 6) deberían seguir
  mostrando notificaciones vía el `<app-toast />` global — dispara una
  acción que llame `.add()` en `orden-compra-presupuesto.ts` para
  confirmarlo.

## Listo cuando

- Los 23 archivos de los 7 grupos limpios.
- `tsc`/build limpios (log completo, build terminado de verdad).
- Con esto, el único uso restante de wrappers `@ui/web/primeng-*` en
  todo `src/app/modules` debería ser: tipos `MenuItem`/`TreeNode`/
  `SortEvent` (catalogados, sin bloquear nada) y el tipo
  `TableLazyLoadEvent` en `warehouse-stock-add.ts` (correcto, no
  tocar). Confírmalo con
  `grep -rlo "@ui/web/primeng-[a-zA-Z-]*/" src/app/modules --include="*.ts" | sort -u`
  y reporta la lista final.
