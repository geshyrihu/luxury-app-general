
Reverificación completa (2026-09-16) de todos los wrappers
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
y `ButtonModule` del arreglo `imports:` en los 4.

## Grupo 2 — `menu` dead, 2 archivos (ya estaban en Paso 3, no se aplicaron)

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-operation-report.ts
```
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
y `SharedModule` del arreglo `imports:` en los 6. **2 tienen el
arreglo en una sola línea** (`cobranza-online-morosidad-detail-modal.ts`:
`imports: [CommonModule, SharedModule, LxTag, NgClass, LxSpinner, AppIcon]`;
`cobranza-online-resumen.ts`: `imports: [CommonModule, SharedModule, PieChart]`)
— cuidado al quitar solo el token.


```
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-fotos.ts
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-reporte-proveedor.ts
```
El primero ni siquiera inyecta `MessageService` (import muerto puro).
El segundo lo inyecta (`messageS = inject(MessageService)`) pero nunca
llama `.add()`/`.clear()` — confirmado con grep, 0 llamadas. Quita
import + injection en ambos (y del arreglo `providers:` si estuviera
ahí).


aliasado en `app.config.ts` (`{ provide: PrimeMessageService, useExisting: MessageService }`)
así que funcionalmente ya usan el servicio propio en runtime — pero
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
+import { MessageService } from "@core/services/message.service";
```
No cambies nada más — el resto de la clase (injection,
`.add({severity,summary,detail,life})`) funciona idéntico, es la
misma firma.



```
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra.ts
```
`app.html` ya monta un `<app-toast />` global para toda la app — estos
2 toasts locales son redundantes. Quita en ambos:
```diff
```
verifica su forma exacta en cada plantilla).

(`orden-compra-presupuesto.ts` es el mismo archivo del Grupo 5 —
aplica ambos cambios ahí)

## Grupo 7 — `carousel`, 1 archivo — `@ViewChild` muerto

```
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-presentacion.ts
```
El componente **ya usa `<lx-carousel>` (Bootstrap real)** en su
un `@ViewChild` que **nunca se usa en ningún otro lugar del archivo**
(confirmado, 0 referencias a `presentationCarousel` fuera de su propia
declaración):
```diff
```
```diff
-  @ViewChild("presentationCarousel") presentationCarousel?: Carousel;
```
Borra ambas líneas completas (el import y la declaración del
`@ViewChild`) — es código muerto, no reemplaces por otro tipo.

## No tocar

que sigan en otros archivos tras este prompt — son solo tipado, no
componentes, catalogados aparte para cuando se evalúe retirar

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
  todo `src/app/modules` debería ser: tipos `MenuItem`/`TreeNode`/
  `SortEvent` (catalogados, sin bloquear nada) y el tipo
  `TableLazyLoadEvent` en `warehouse-stock-add.ts` (correcto, no
  tocar). Confírmalo con
  y reporta la lista final.
