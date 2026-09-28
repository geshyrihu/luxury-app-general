# TICKET FH-11j — Frontend: migrar `operations.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11i` (ya cerrados y aprobados). Cubre `operations.luxuryapp` — 20 archivos, 34
ocurrencias de `| date` (recontadas con búsqueda multilínea — úsala también en tu verificación
final).

**Regla general:** en 19 de los 20 archivos, `CommonModule` no tiene otro uso además del `| date`
que migras — reemplázalo por `ApiDatePipe`. **Única excepción: Tarea 4
(`announcement-list`)**, que usa `| slice` y necesita conservar `CommonModule`. Un archivo
(`radio-comunicacion-list`) usa `DatePipe` suelto en vez de `CommonModule` — mismo tratamiento,
reemplázalo por `ApiDatePipe`.

**Nota de formato:** varias ocurrencias están envueltas en múltiples líneas — busca por contenido.

## Tarea 1 — `announcements/announcement/announcement-admin-list`

`announcement-admin-list.ts`: `CommonModule` → `ApiDatePipe`.

`announcement-admin-list.html` — 3 ocurrencias:
- `item.publishedAt | date: "dd/MM/yyyy"` → `apiDate: "dd/MM/yyyy"` (2 veces, sin workaround)
- `item.expirationDate | date: "dd/MM/yyyy":"UTC"` → `item.expirationDate | apiDate: "dd/MM/yyyy"`
  (quita el workaround `:"UTC"`)

## Tarea 2 — `announcements/announcement/announcement-analytics`

`announcement-analytics.ts`: `CommonModule` → `ApiDatePipe`.

`announcement-analytics.html`:
`{{ analytic.viewDate | date : "dd/MM/yyyy h:mm a" }}` → `{{ analytic.viewDate | apiDate : "dd/MM/yyyy h:mm a" }}`

## Tarea 3 — `announcements/announcement/announcement-detail`

`announcement-detail.ts`: `imports: [CommonModule, RouterModule, AppIcon, LxImage]` — reemplaza
`CommonModule` por `ApiDatePipe`.

`announcement-detail.html` — 2 ocurrencias, mismo campo, formatos distintos:
- `announcement().publishedAt | date: 'fullDate'` (envuelta) → `apiDate: 'fullDate'`
- `announcement().publishedAt | date: 'mediumDate'` → `apiDate: 'mediumDate'`

## Tarea 4 — `announcements/announcement/announcement-list`

**Caso especial: NO quites `CommonModule`.** `announcement-list.ts`:
`imports: [CommonModule, RouterModule, LxTooltipDirective, AppIcon]` — la plantilla usa `| slice`
(líneas 48 y 94), que depende de `CommonModule` (sin `SlicePipe` importado por separado). Agrega
`ApiDatePipe` sin quitar `CommonModule`.

`announcement-list.html` — 2 ocurrencias, mismo campo y formato:
`{{ anuncio.publishedAt | date: 'dd/MM/yyyy' }}` → `apiDate: 'dd/MM/yyyy'` (en ambas)

## Tarea 5 — `dashboard/unified-pending-dashboard`

`unified-pending-dashboard.ts`: `CommonModule` → `ApiDatePipe`.

`unified-pending-dashboard.html` — 2 ocurrencias, **con workaround `:'UTC'` a quitar**:
- `item.date | date: 'dd MMM' : 'UTC'` → `item.date | apiDate: 'dd MMM'`
- `item.date | date: 'HH:mm' : 'UTC'` (envuelta) → `item.date | apiDate: 'HH:mm'`

## Tarea 6 — `diagrams/diagram/diagram-list/diagram-list`

`diagram-list.ts`: `CommonModule` → `ApiDatePipe`.

`diagram-list.html` — 2 ocurrencias, mismo campo y formato:
`{{ diagram.updateAt | date: 'dd/MM/yyyy HH:mm' }}` → `apiDate: 'dd/MM/yyyy HH:mm'` (en ambas)

## Tarea 7 — `field-service/service-order/resumen-ordenes-servicio`

`resumen-ordenes-servicio.ts`: `imports: [CommonModule, TableModule, ResumenOrdenesServicioGrafico, LxTag]`
— reemplaza `CommonModule` por `ApiDatePipe`.

`resumen-ordenes-servicio.html`, **con workaround `:'UTC'` a quitar**:
`{{ item.executionDate | date:'dd/MM/yyyy':'UTC' }}` → `{{ item.executionDate | apiDate:'dd/MM/yyyy' }}`

## Tarea 8 — `field-service/service-order/soporte-orden-servicio`

`soporte-orden-servicio.ts`: `imports: [AppIcon, CommonModule, SanitizeHtmlPipe]` —
`SanitizeHtmlPipe` es un pipe propio importado aparte (no depende de `CommonModule`) — reemplaza
`CommonModule` por `ApiDatePipe`, conserva `SanitizeHtmlPipe`.

`soporte-orden-servicio.html` — 2 ocurrencias:
- `item.fechaSolicitud | date : "dd-MMM-yyyy"` → `apiDate : "dd-MMM-yyyy"`
- `item.fechaTermino | date : "dd-MMM-yyyy"` → `apiDate : "dd-MMM-yyyy"`

## Tarea 9 — `inventarios-y-almacn/product-entry/product-entry-list`

`product-entry-list.ts`: `CommonModule` → `ApiDatePipe`.

`product-entry-list.html` — 2 ocurrencias, mismo campo/formato, **con workaround `:'UTC'`**:
`{{ item.fechaEntrada | date:'mediumDate':'UTC' }}` → `{{ item.fechaEntrada | apiDate:'mediumDate' }}` (en ambas, una envuelta)

## Tarea 10 — `inventarios-y-almacn/product-exit/product-output-list`

`product-output-list.ts`: `CommonModule` → `ApiDatePipe`.

`product-output-list.html` — 2 ocurrencias, mismo campo/formato, **con workaround `:'UTC'`**:
`{{ item.fechaSalida | date:'mediumDate':'UTC' }}` → `{{ item.fechaSalida | apiDate:'mediumDate' }}` (en ambas, una envuelta)

## Tarea 11 — `inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list`

`radio-comunicacion-list.ts`: `import { DatePipe } from "@angular/common";` (suelto, no
`CommonModule`) → reemplaza por `ApiDatePipe`.

`radio-comunicacion-list.html`, **con workaround `:'UTC'` a quitar**:
`{{ item.fechaCompra | date:'mediumDate':'UTC' }}` → `{{ item.fechaCompra | apiDate:'mediumDate' }}`

## Tarea 12 — `manuals/biblioteca/manuals-and-processes/manuals-and-processes-detail`

`manuals-and-processes-detail.ts`: `CommonModule` → `ApiDatePipe`.

`manuals-and-processes-detail.html`:
`{{ v.fechaCambio | date:'dd/MM/yyyy' }}` → `{{ v.fechaCambio | apiDate:'dd/MM/yyyy' }}`

## Tarea 13 — `manuals/biblioteca/manuals-and-processes/manuals-and-processes-editor/manuals-and-processes-editor`

`manuals-and-processes-editor.ts`: `CommonModule` → `ApiDatePipe`.

`manuals-and-processes-editor.html`:
`{{ v.fechaCambio | date: 'dd/MM/yyyy' }}` → `{{ v.fechaCambio | apiDate: 'dd/MM/yyyy' }}`

## Tarea 14 — `reports/report-client/report-client`

`report-client.ts`: `imports: [CommonModule]` → reemplaza por `ApiDatePipe`.

`report-client.html` — 2 ocurrencias, **sin formato explícito**:
- `{{ inicio | date }}` → `{{ inicio | apiDate }}`
- `{{ final | date }}` → `{{ final | apiDate }}`

## Tarea 15 — `reports/report-meeting/report-meeting`

`report-meeting.ts`: `imports: [CommonModule, SanitizeHtmlPipe, TableModule, AppSpinner]` —
reemplaza `CommonModule` por `ApiDatePipe`, conserva `SanitizeHtmlPipe`.

`report-meeting.html`:
`{{ data.minuta.date | date : "longDate" }}` → `{{ data.minuta.date | apiDate : "longDate" }}`

## Tarea 16 — `reports/reporte-ticket-pendientes-proveedor/reporte-ticket-pendientes-proveedor`

`reporte-ticket-pendientes-proveedor.ts`: `imports: [CommonModule]` → reemplaza por `ApiDatePipe`.

`reporte-ticket-pendientes-proveedor.html`:
`{{ detalles.dateRequest | date : "fullDate" }}` → `{{ detalles.dateRequest | apiDate : "fullDate" }}`

## Tarea 17 — `supervision/supervision/agenda-supervision/agenda-supervision`

`agenda-supervision.ts`: `CommonModule` → `ApiDatePipe`.

`agenda-supervision.html` — 2 ocurrencias, **ambas con workaround `:"UTC"` a quitar**:
- `item.fechaSolicitud | date: "dd/MM/yyyy" : "UTC"` → `item.fechaSolicitud | apiDate: "dd/MM/yyyy"`
- `item.fechaConclusion | date: "dd/MM/yyyy" : "UTC"` → `item.fechaConclusion | apiDate: "dd/MM/yyyy"`

## Tarea 18 — `task-engine/recurring-tasks/instances/daily-task-list/daily-task-list`

`daily-task-list.ts`: `CommonModule` → `ApiDatePipe`.

`daily-task-list.html` — 2 ocurrencias, mismo campo/formato:
`{{ task.scheduledDate | date : "shortTime" }}` → `apiDate : "shortTime"` (en ambas)

## Tarea 19 — `task-engine/recurring-tasks/instances/task-instance-list/task-instance-list`

`task-instance-list.ts`: `CommonModule` → `ApiDatePipe`.

`task-instance-list.html` — 2 ocurrencias, mismo campo/formato:
`{{ task.scheduledDate | date : "medium" }}` → `apiDate : "medium"` (en ambas)

## Tarea 20 — `task-engine/tasks/reports/task-report-resumen`

`task-report-resumen.ts`: `imports: [TaskDateRangeSelector, CommonModule, TableModule]` —
reemplaza `CommonModule` por `ApiDatePipe`.

`task-report-resumen.html` — 2 ocurrencias:
- `ticket.CreatedAt | date: "short"` → `ticket.CreatedAt | apiDate: "short"`
- `ticket.ClosedAt | date: "short"` → `ticket.ClosedAt | apiDate: "short"`

## Lo que NO debes hacer

- No quites `CommonModule` en la Tarea 4 (`announcement-list`, por `| slice`).
- No toques `SanitizeHtmlPipe` (Tareas 8, 15) ni `TaskDateRangeSelector`/`TableModule` (Tarea 20).
- No toques ningún otro archivo de `operations.luxuryapp` más allá de los 20 mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' $(find src/app/apps/operations.luxuryapp -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -n "slice" src/app/apps/operations.luxuryapp/announcements/announcement/announcement-list.html
# Resultado esperado: 2 líneas (confirma que | slice sigue intacto)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 34 ocurrencias migradas a `apiDate`, mismo formato, workarounds `:'UTC'`/`:"UTC"` eliminados.
- `CommonModule` conservado solo en la Tarea 4; reemplazado en el resto.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 20 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 20 archivos `.ts` + 20 `.html`.
2. Salida literal de los 2 comandos de verificación y de `ng build`.
3. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
