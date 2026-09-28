# TICKET FH-11d — Frontend: migrar `admin.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`/`FH-11b`/`FH-11c` (ya cerrados y aprobados). Cubre `admin.luxuryapp` — 6 archivos, 9
ocurrencias de `| date`.

**Nota de contexto:** a diferencia de tickets anteriores, aquí los campos (`actualCheckIn`,
`occurredAt`, `changedAt`, `log.date`, `timestamp`) son timestamps de auditoría/bitácora con
componente de hora real (todos los formatos incluyen `HH:mm`/`HH:mm:ss`) — no son casos de
`DateOnly` con riesgo de desfase de día confirmado, pero la regla de `frontend-prohibitions.md`
(FH-10) exige `apiDate` para **cualquier** campo de fecha del API, no solo los de riesgo confirmado
— migra igual, por consistencia y porque `apiDate` maneja ambos casos correctamente.

## Tarea 1 — `admin.luxuryapp/access-control/access-dashboard`

`access-dashboard.ts`: importa `DatePipe` solo — reemplaza por `ApiDatePipe`.

`access-dashboard.html`, línea 56:
`{{ visit.actualCheckIn | date: "dd/MM/yyyy HH:mm" }}` → `{{ visit.actualCheckIn | apiDate: "dd/MM/yyyy HH:mm" }}`

## Tarea 2 — `admin.luxuryapp/access-control/access-events`

`access-events.ts`: importa `DatePipe` solo — reemplaza por `ApiDatePipe`.

`access-events.html`, línea 23:
`{{ e.occurredAt | date: "dd/MM/yyyy HH:mm:ss" }}` → `{{ e.occurredAt | apiDate: "dd/MM/yyyy HH:mm:ss" }}`

## Tarea 3 — `admin.luxuryapp/analisis-registros/audit-entries/audit-entries`

`audit-entries.ts`: importa `CommonModule`, sin otro uso de `CommonModule` en la plantilla —
reemplaza por `ApiDatePipe`.

`audit-entries.html`:
- Línea 117: `{{ item.changedAt | date: 'dd/MM/yyyy h:mm:ss a' }}` → `{{ item.changedAt | apiDate: 'dd/MM/yyyy h:mm:ss a' }}`
- Línea 189: `{{ item.changedAt | date: "dd/MM/yyyy h:mm a" }}` → `{{ item.changedAt | apiDate: "dd/MM/yyyy h:mm a" }}`

## Tarea 4 — `admin.luxuryapp/analisis-registros/brevo/brevo-email-logs`

`brevo-email-logs.ts`: importa `CommonModule`, sin otro uso de `CommonModule` en la plantilla —
reemplaza por `ApiDatePipe`.

`brevo-email-logs.html`, línea 117 (dentro de un ternario):
```html
{{ log.date ? (log.date | date: 'dd/MM/yyyy HH:mm') : '—' }}
```
cámbiala a:
```html
{{ log.date ? (log.date | apiDate: 'dd/MM/yyyy HH:mm') : '—' }}
```

## Tarea 5 — `admin.luxuryapp/analisis-registros/log-api-report/log-api-report`

**Caso especial: NO quites `CommonModule`.** `log-api-report.html` usa `[ngStyle]` en las líneas
122 y 137 (`CommonModule` lo provee) — agrega `ApiDatePipe` al arreglo `imports` sin quitar
`CommonModule`.

`log-api-report.html`:
- Línea 111: `{{ item.timestamp | date: 'dd/MM/yyyy h:mm:ss a' }}` → `{{ item.timestamp | apiDate: 'dd/MM/yyyy h:mm:ss a' }}`
- Línea 178: `{{ item.timestamp | date: "dd/MM/yyyy h:mm a" }}` → `{{ item.timestamp | apiDate: "dd/MM/yyyy h:mm a" }}`

## Tarea 6 — `admin.luxuryapp/analisis-registros/user-activity-history/user-activity-history`

`user-activity-history.ts`: importa `CommonModule`, sin otro uso de `CommonModule` en la plantilla
— reemplaza por `ApiDatePipe`.

`user-activity-history.html`:
- Línea 117: `{{ item.timestamp | date: 'dd/MM/yyyy h:mm:ss a' }}` → `{{ item.timestamp | apiDate: 'dd/MM/yyyy h:mm:ss a' }}`
- Línea 165: `item.timestamp | date: "dd/MM/yyyy h:mm a" }}` → `item.timestamp | apiDate: "dd/MM/yyyy h:mm a" }}`

## Lo que NO debes hacer

- No quites `CommonModule` en la Tarea 5 (`log-api-report`) — rompería los 2 `[ngStyle]`.
- No toques ningún otro archivo de `admin.luxuryapp` más allá de los 6 mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
grep -rn "| date\b" src/app/apps/admin.luxuryapp --include="*.html"
# Resultado esperado: 0 líneas

grep -n "ngStyle" src/app/apps/admin.luxuryapp/analisis-registros/log-api-report/log-api-report.html
# Resultado esperado: 2 líneas (confirma que ngStyle sigue intacto)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 9 ocurrencias migradas a `apiDate`, mismo formato que tenían antes.
- `CommonModule` conservado solo en `log-api-report` (por `ngStyle`); reemplazado en el resto.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 6 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 6 archivos (12 con `.ts` incluidos).
2. Confirmación de que `CommonModule` se conservó solo en Tarea 5.
3. Salida literal de los 2 greps de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
