# TICKET FH-11f — Frontend: migrar `supplier.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11e` (ya cerrados y aprobados). Cubre `supplier.luxuryapp` — **7 archivos** (no 8: ver
nota de exclusión abajo), 12 ocurrencias de `| date`.

**Nota de exclusión:** `supplier.luxuryapp/po/provider-quotation/cuadro-comparativo-list.html`
(sin el prefijo `quotes/`) es código huérfano — verificado que no está referenciado en ningún
routing ni import de todo el proyecto (`quotes/provider-quotation/cuadro-comparativo-list` sí lo
está, es el que se usa realmente). **No lo toques**, no está en el alcance de este ticket.

**Nota de formato:** varias plantillas envuelven la expresión `| date` en múltiples líneas — busca
por contenido, no por número de línea exacto.

## Tarea 1 — `po/purchase-link-manager/purchase-link-manager`

`purchase-link-manager.ts`: `import { CommonModule } from "@angular/common";`, sin otro uso de
`CommonModule` en la plantilla — reemplaza por `ApiDatePipe`.

`purchase-link-manager.html` — 2 ocurrencias, ambas con el workaround `:'UTC'` (quítalo, `apiDate`
no lo necesita):
- (~línea 109) `sc.fechaSolicitud | date:'dd-MMM-yy':'UTC'` → `sc.fechaSolicitud | apiDate:'dd-MMM-yy'`
- (~línea 233) `oc.fechaSolicitud | date:'dd-MMM-yy':'UTC'` → `oc.fechaSolicitud | apiDate:'dd-MMM-yy'`

## Tarea 2 — `po/purchase-order/orden-compra-list`

`orden-compra-list.ts`: usa `CommonModule` (la plantilla tiene `| number` en las líneas 204 y 344)
— **conserva `CommonModule`**, agrega `ApiDatePipe`.

`orden-compra-list.html` — **3 ocurrencias** (dos con workaround `:'UTC'` a quitar, una sin él):
- (~línea 182) `item.fechaSolicitud | date : 'd MMM yyyy' : 'UTC'` → `item.fechaSolicitud | apiDate : 'd MMM yyyy'`
- (~línea 212) `item.fechaAutorizacion | date : 'short'` → `item.fechaAutorizacion | apiDate : 'short'`
- (~línea 344-345, envuelta en 2 líneas, junto a `item.total | number:'1.2-2'` que no se toca):
  `item.fechaSolicitud | date:'d MMM yyyy':'UTC'` → `item.fechaSolicitud | apiDate:'d MMM yyyy'`

## Tarea 3 — `po/purchase-order/payment-voucher-modal/payment-voucher-modal`

`payment-voucher-modal.ts`: `CommonModule`, sin otro uso en la plantilla — reemplaza por
`ApiDatePipe`.

`payment-voucher-modal.html`, línea 15:
`{{ item.uploadDate | date: "short" }}` → `{{ item.uploadDate | apiDate: "short" }}`

## Tarea 4 — `pr/purchase-request/purchase-request-list`

`purchase-request-list.ts`: `CommonModule`, sin otro uso en la plantilla — reemplaza por
`ApiDatePipe`.

`purchase-request-list.html` — 2 ocurrencias, **sin formato explícito** (usan el formato por
defecto de Angular):
- Línea 95: `{{ item.requestDate | date }}` → `{{ item.requestDate | apiDate }}`
- Línea 148: `{{ item.requestDate | date }}` → `{{ item.requestDate | apiDate }}`

## Tarea 5 — `pr/purchase-request/purchase-request`

`purchase-request.ts`: usa `CommonModule` (la plantilla tiene `| json` en la línea 122) —
**conserva `CommonModule`**, agrega `ApiDatePipe`.

`purchase-request.html`, línea 24:
`{{ data.requestDate | date: "dd-MMM-yy HH:mm" }}` → `{{ data.requestDate | apiDate: "dd-MMM-yy HH:mm" }}`

## Tarea 6 — `pr/solicitud-compra/solicitud-compra-list`

`solicitud-compra-list.ts`: `CommonModule`, sin otro uso en la plantilla — reemplaza por
`ApiDatePipe`.

`solicitud-compra-list.html` — 2 ocurrencias, sin formato explícito:
- Línea 123: `{{ item.fechaSolicitud | date }}` → `{{ item.fechaSolicitud | apiDate }}`
- Línea 212: `{{ item.fechaSolicitud | date }}` → `{{ item.fechaSolicitud | apiDate }}`

## Tarea 7 — `quotes/provider-quotation/cuadro-comparativo-list`

**Ojo: NO confundir con el archivo huérfano de la misma carpeta padre sin `quotes/` — este SÍ es el
que está en uso.**

`cuadro-comparativo-list.ts` (dentro de `quotes/`): usa `CommonModule` (la plantilla tiene
`| uppercase` y `| number` en múltiples líneas) — **conserva `CommonModule`**, agrega `ApiDatePipe`.

`cuadro-comparativo-list.html` (dentro de `quotes/`), línea 174:
`{{ solicitudCompra.comiteEvento.startAt | date:'dd MMM yyyy' }}` → `{{ solicitudCompra.comiteEvento.startAt | apiDate:'dd MMM yyyy' }}`

## Lo que NO debes hacer

- No toques `supplier.luxuryapp/po/provider-quotation/cuadro-comparativo-list.html` (el huérfano
  sin `quotes/`) — no está en el alcance.
- No quites `CommonModule` en las Tareas 2, 5, 7 (por `| number`/`| json`/`| uppercase`).
- No toques `item.total | number` ni ningún otro pipe que no sea `date`.
- No toques ningún otro archivo de `supplier.luxuryapp` más allá de los 7 mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

**Usa una búsqueda que detecte ocurrencias envueltas en varias líneas** (el `grep` simple de una
sola línea puede no detectar casos donde el `|` y `date` quedan en líneas distintas — pasó en la
Tarea 2 de este mismo ticket al redactarlo):

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' src/app/apps/supplier.luxuryapp/po/purchase-link-manager/purchase-link-manager.html src/app/apps/supplier.luxuryapp/po/purchase-order/orden-compra-list.html src/app/apps/supplier.luxuryapp/po/purchase-order/payment-voucher-modal/payment-voucher-modal.html src/app/apps/supplier.luxuryapp/pr/purchase-request/purchase-request-list.html src/app/apps/supplier.luxuryapp/pr/purchase-request/purchase-request.html src/app/apps/supplier.luxuryapp/pr/solicitud-compra/solicitud-compra-list.html src/app/apps/supplier.luxuryapp/quotes/provider-quotation/cuadro-comparativo-list.html
# Resultado esperado: sin salida (0 coincidencias residuales)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 12 ocurrencias migradas a `apiDate`, mismo formato (o sin formato, cuando no lo tenían) que
  antes, workarounds `:'UTC'` eliminados.
- `CommonModule` conservado en Tareas 2, 5, 7; reemplazado en el resto.
- El archivo huérfano no fue tocado.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 7 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 7 archivos `.ts` + 7 `.html`.
2. Confirmación de que el archivo huérfano no fue tocado.
3. Salida literal de la búsqueda multilínea de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
