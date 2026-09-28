# TICKET FH-11c — Frontend: migrar `direccion`/`contabilidad`/`system`/`legal` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`/`FH-11b` (ya cerrados y aprobados) — úsalos de referencia de estilo. Este ticket cubre 4
apps medianas: `direccion.luxuryapp` (3 archivos), `contabilidad.luxuryapp` (3), `system.luxuryapp`
(4), `legal.luxuryapp` (4) — 14 archivos, 21 ocurrencias de `| date` en total.

**Cada archivo es distinto — lee cada tarea completa, no repliques el mismo patrón a ciegas.** En
particular: 2 archivos de `legal.luxuryapp` inyectan `DatePipe` de forma **programática** (no solo
en la plantilla) para una función que formatea objetos `Date` ya nativos (de un selector de rango de
fechas), no strings del API — ahí `DatePipe` **se queda**, no se toca.

## Tarea 1 — `direccion.luxuryapp/juntas-comite/junta-comite-minutas/resumen-minuta`

`resumen-minuta.ts`: usa `CommonModule` (la plantilla también tiene `| uppercase` en la línea 94) —
**conserva `CommonModule`**, agrega `ApiDatePipe` al arreglo `imports` y al import.

`resumen-minuta.html`:
- Línea 117-118: `{{ item.meetingDertailsSeguimientos[0].fecha | date: 'mediumDate' }}` →
  `{{ item.meetingDertailsSeguimientos[0].fecha | apiDate: 'mediumDate' }}`
- Línea 155: `{{ item.deliveryDate | date: 'shortDate' }}` → `{{ item.deliveryDate | apiDate: 'shortDate' }}`

## Tarea 2 — `direccion.luxuryapp/juntas-comite/juntas-mensuales-session/junta-mensual-session-checklist-dialog`

`junta-mensual-session-checklist-dialog.ts`: importa `CommonModule` y `DatePipe` juntos
(`import { CommonModule, DatePipe } from "@angular/common";`) — verificado que la plantilla no usa
ningún otro miembro de `CommonModule` (sin `*ngIf`/`*ngFor`/`ngClass`/otros pipes). Reemplaza ambos
por `ApiDatePipe` (import y arreglo `imports`).

`junta-mensual-session-checklist-dialog.html`:
- Línea 78: `{{ item.dueDate | date: "dd/MM/yyyy" }}` → `{{ item.dueDate | apiDate }}`
- Línea 81: `Completado: {{ item.completedAt | date: "dd/MM/yyyy HH:mm" }}` →
  `Completado: {{ item.completedAt | apiDate: "dd/MM/yyyy HH:mm" }}`

## Tarea 3 — `direccion.luxuryapp/juntas-comite/juntas-mensuales-session/juntas-mensuales-session`

Mismo patrón que la Tarea 2: `import { CommonModule, DatePipe }`, sin otro uso de `CommonModule` —
reemplaza ambos por `ApiDatePipe`.

`juntas-mensuales-session.html`:
- Línea 182: `Junta: {{ detail.presentation.fechaJunta | date: "dd/MM/yyyy" }}` →
  `Junta: {{ detail.presentation.fechaJunta | apiDate }}`

## Tarea 4 — `contabilidad.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-detail`

`sat-funding-detail.ts`: usa `CommonModule` (plantilla también tiene `| uppercase` línea 93 y
`| number` línea 141) — **conserva `CommonModule`**, agrega `ApiDatePipe`.

`sat-funding-detail.html`:
- Línea 139: `{{ invoice.fechaEmision | date: 'short' }}` → `{{ invoice.fechaEmision | apiDate: 'short' }}`

## Tarea 5 — `contabilidad.luxuryapp/general-ledger/dynamic-reports/report-catalog/report-catalog`

`report-catalog.ts`: usa `CommonModule`, sin otros pipes/directivas de `CommonModule` en la
plantilla — reemplaza `CommonModule` por `ApiDatePipe`.

`report-catalog.html`:
- Línea 52: `{{ r.createdAt | date: 'dd/MM/yyyy' }}` → `{{ r.createdAt | apiDate }}`
- Línea 94: `{{ r.createdAt | date: 'dd/MM/yyyy' }}` → `{{ r.createdAt | apiDate }}`

## Tarea 6 — `contabilidad.luxuryapp/general-ledger/presupuesto-propuesta/budget-history-dialog`

`budget-history-dialog.ts`: usa `CommonModule` (plantilla tiene `| number` en líneas 35-36) —
**conserva `CommonModule`**, agrega `ApiDatePipe`.

`budget-history-dialog.html`:
- Línea 33: `{{ record.changedAt | date: "short" }}` → `{{ record.changedAt | apiDate: "short" }}`

## Tarea 7 — `system.luxuryapp/configuracion-sistema/database-backup/database-backup-list`

`database-backup-list.ts`: importa `DatePipe` solo (sin `CommonModule`) — reemplaza por
`ApiDatePipe`.

`database-backup-list.html`:
- Línea 71: `{{ item.lastRunAt | date: "dd-MMM-yy HH:mm" }}` → `{{ item.lastRunAt | apiDate: "dd-MMM-yy HH:mm" }}`

## Tarea 8 — `system.luxuryapp/configuracion-sistema/eleven-labs/eleven-labs-settings`

`eleven-labs-settings.ts`: usa `CommonModule` (plantilla tiene `| number` línea 170) — **conserva
`CommonModule`**, agrega `ApiDatePipe`.

`eleven-labs-settings.html`, línea 174 (dentro de una expresión ternaria, cuidado con la sintaxis):
```html
{{ sub.nextBillingDate ? (sub.nextBillingDate | date: "mediumDate") : "N/D" }}
```
cámbiala a:
```html
{{ sub.nextBillingDate ? (sub.nextBillingDate | apiDate: "mediumDate") : "N/D" }}
```

## Tarea 9 — `system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill`

`juntas-mensuales-backfill.ts`: importa `CommonModule` y `DatePipe` juntos, sin otro uso de
`CommonModule` en la plantilla — reemplaza ambos por `ApiDatePipe`.

`juntas-mensuales-backfill.html`:
- Línea 101: `{{ item.scheduledAt | date: "dd/MM/yyyy HH:mm" }}` → `{{ item.scheduledAt | apiDate: "dd/MM/yyyy HH:mm" }}`
- Línea 120: `{{ presentation.relevantDate | date: "dd/MM/yyyy" }}` → `{{ presentation.relevantDate | apiDate }}`
- Línea 143: `{{ meeting.relevantDate | date: "dd/MM/yyyy" }}` → `{{ meeting.relevantDate | apiDate }}`

## Tarea 10 — `system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list`

`vault-secrets-list.ts`: importa `DatePipe` solo — reemplaza por `ApiDatePipe`.

`vault-secrets-list.html`:
- Línea 61: `{{ item.lastAccessedAt | date: "short" }}` → `{{ item.lastAccessedAt | apiDate: "short" }}`

## Tarea 11 — `legal.luxuryapp/asuntos-legales-y-seguros/committee/poliza-seguro-edificio/poliza-seguro-edificio`

**Ojo: es un archivo DISTINTO al `committee.luxuryapp/poliza-seguro-edificio` ya migrado en FH-11b**
— mismo nombre, ruta y módulo distintos, no lo confundas ni asumas que ya está hecho.

`poliza-seguro-edificio.ts` (dentro de `legal.luxuryapp/`): usa `CommonModule`, sin otro uso en la
plantilla — reemplaza `CommonModule` por `ApiDatePipe`.

`poliza-seguro-edificio.html` (dentro de `legal.luxuryapp/`):
- Línea 33: `{{ policy.startDate | date: 'dd/MM/yyyy' }}` → `{{ policy.startDate | apiDate }}`
- Línea 41: `{{ policy.endDate | date: 'dd/MM/yyyy' }}` → `{{ policy.endDate | apiDate }}`

## Tarea 12 — `legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-externos`

**Caso especial: NO quites `DatePipe`.** `ticket-legal-reportes-externos.ts` tiene
`datePipe = inject(DatePipe)` (línea 42) usado dentro de un método `formatDate(date: Date): string`
(línea 161-163) que se llama con objetos `Date` ya nativos (de un selector de rango de fechas —
`startDate`/`endDate` construidos con aritmética de `Date` o recibidos de un evento del picker, no
son strings del API). Ese uso es legítimo y no tiene el riesgo de ambigüedad que resuelve `apiDate`
— **conserva `DatePipe` (import, inyección y arreglo `imports`) tal cual**, y **agrega**
`ApiDatePipe` solo para el uso en plantilla sobre `ticket.fecha` (que sí viene del API). También
conserva `CommonModule` (la plantilla usa `| uppercase` en las líneas 15-16).

`ticket-legal-reportes-externos.html`:
- Línea 118: `{{ ticket.fecha | date: "dd/MM/yyyy" }}` → `{{ ticket.fecha | apiDate }}`
- Línea 269: `{{ ticket.fecha | date: "dd/MM/yyyy" }} — ...` → `{{ ticket.fecha | apiDate }} — ...`

## Tarea 13 — `legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-internos`

**Mismo caso especial que la Tarea 12** — `ticket-legal-reportes-internos.ts` también tiene
`datePipe = inject(DatePipe)` usado en un `formatDate(date: Date)` alimentado por objetos `Date`
nativos del selector de rango (confirmado, líneas 115-118 y 235-238). Mismo tratamiento: conserva
`DatePipe` y `CommonModule` (por `| uppercase`), agrega `ApiDatePipe` solo para `ticket.fecha` en
plantilla.

`ticket-legal-reportes-internos.html`:
- Línea 143: `{{ ticket.fecha | date: "dd/MM/yyyy" }}` → `{{ ticket.fecha | apiDate }}`
- Línea 294: `{{ ticket.fecha | date: "dd/MM/yyyy" }} — ...` → `{{ ticket.fecha | apiDate }} — ...`

## Tarea 14 — `legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-pendientes`

`ticket-legal-reportes-pendientes.ts`: importa `CommonModule` y `DatePipe` juntos, sin uso
programático (`inject(DatePipe)` fuera del arreglo `imports`) ni otro pipe/directiva de
`CommonModule` en la plantilla — reemplaza ambos por `ApiDatePipe`.

`ticket-legal-reportes-pendientes.html` — 6 ocurrencias, todas del mismo campo `ticket.requestDate`,
mismo formato:
- Línea 38: `{{ ticket.requestDate | date: "dd/MM/yyyy" }}` → `{{ ticket.requestDate | apiDate }}`
- Línea 88: ídem
- Línea 138: ídem
- Línea 187: `{{ ticket.requestDate | date: "dd/MM/yyyy" }}` (dentro de un `<strong>Fecha:</strong>`) → ídem
- Línea 249: ídem
- Línea 311: ídem

## Lo que NO debes hacer

- No toques `DatePipe`/`CommonModule` en las Tareas 12 y 13 (`ticket-legal-reportes-externos`/
  `internos`) — el uso programático sobre objetos `Date` nativos es legítimo, no lo migres.
- No confundas el `poliza-seguro-edificio` de `legal.luxuryapp` (Tarea 11) con el de
  `committee.luxuryapp` (ya migrado en FH-11b) — son archivos distintos.
- No quites `CommonModule` en los archivos que también usan `| uppercase`/`| number` (Tareas 1, 4, 6,
  8, 12, 13).
- No toques ningún otro archivo fuera de los 14 mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena — no asumas que las 14 rutas son
  idénticas solo porque lo fueron en FH-11a/FH-11b.

## Verificación obligatoria

```bash
cd client/angular
grep -rn "| date\b" src/app/apps/direccion.luxuryapp src/app/apps/contabilidad.luxuryapp src/app/apps/system.luxuryapp src/app/apps/legal.luxuryapp --include="*.html"
# Resultado esperado: 0 líneas

grep -rn "datePipe = inject(DatePipe)" src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/
# Resultado esperado: 2 líneas (externos e internos) — confirma que NO se tocó ese uso programático

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 21 ocurrencias de `| date` en los 14 archivos migradas a `apiDate`, con el mismo string de
  formato que tenían antes (cuando no era el default `dd/MM/yyyy`).
- `CommonModule` conservado exactamente en las Tareas 1, 4, 6, 8, 12, 13 (por `| uppercase`/
  `| number`); reemplazado por `ApiDatePipe` en el resto.
- `DatePipe` conservado (import + inyección + `imports`) en las Tareas 12 y 13 (uso programático
  legítimo); reemplazado en todo el resto.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 14 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 14 archivos.
2. Confirmación explícita, tarea por tarea, de si `CommonModule`/`DatePipe` se conservaron o se
   quitaron, y por qué.
3. Salida literal de los 2 greps de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
