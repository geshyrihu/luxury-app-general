# TICKET FH-11n — Frontend: migrar clúster "vacaciones/permisos" de `recursos-humanos.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11m` (ya cerrados y aprobados). Cubre el clúster **vacaciones/permisos** dentro de
`recursos-humanos.luxuryapp` — 9 archivos, **24 ocurrencias** de `| date` (recontadas con búsqueda
multilínea — úsala también en tu verificación final). Es el cuarto de varios tickets para terminar
`recursos-humanos.luxuryapp` (quedan 50 ocurrencias / 21 archivos tras FH-11m; con este ticket
bajan a 26 / 12).

**Importante:** 2 de los 9 archivos (`shared/generic-approval-panel.ts`,
`shared/modal-approval-confirmation.ts`) usan `template:` **inline** (no `templateUrl`) — no hay
`.html` separado, el marcado está dentro del string del decorador `@Component`. Búscalo y edítalo
ahí mismo.

Ningún archivo de este clúster tiene el workaround `:'UTC'`/`:"UTC"` — no busques quitarlo, no
está presente.

## Tarea 1 — `vacation-balance-admin/vacaciones-admin-auditoria`

`vacaciones-admin-auditoria.ts`: `imports: [...]` contiene `CommonModule` **y** `DatePipe` por
separado (redundante) — quita ambos, agrega solo `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`vacaciones-admin-auditoria.html` — 4 ocurrencias:
- `balance()?.employeeAdmissionDate | date: 'dd/MM/yyyy'` → `apiDate: 'dd/MM/yyyy'`
- `req.startDate | date: 'dd/MM/yyyy'` → `apiDate: 'dd/MM/yyyy'`
- `req.endDate | date: 'dd/MM/yyyy'` → `apiDate: 'dd/MM/yyyy'`
- `req.requestDate ? (req.requestDate | date: 'dd/MM/yyyy') : '—'` (envuelta en 2 líneas) →
  `apiDate: 'dd/MM/yyyy'` dentro del mismo operador `?:`

## Tarea 2 — `vacation-balance-admin/vacaciones-saldo`

`vacaciones-saldo.ts`: mismo caso — `CommonModule` y `DatePipe` redundantes en `imports:` — quita
ambos, agrega `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`vacaciones-saldo.html` — 1 ocurrencia:
`{{ balance()?.employeeAdmissionDate | date: 'longDate' }}` → `apiDate: 'longDate'`

## Tarea 3 — `past-vacations/vacaciones-pasadas-registro`

`vacaciones-pasadas-registro.ts`: `CommonModule` sin otro uso en la plantilla — reemplázalo por
`ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`vacaciones-pasadas-registro.html` — 3 ocurrencias:
- `request.requestDate | date: 'dd/MM/yyyy'` → `apiDate: 'dd/MM/yyyy'`
- `request.startDate | date: 'dd/MM/yyyy'` → `apiDate: 'dd/MM/yyyy'`
- `request.endDate | date: 'dd/MM/yyyy'` (envuelta en 2 líneas) → `apiDate: 'dd/MM/yyyy'`

## Tarea 4 — `my-vacation-requests/vacaciones-form`

`vacaciones-form.ts`: `CommonModule` sin otro uso — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`vacaciones-form.html` — 1 ocurrencia (envuelta en 2 líneas):
`{{ balance.employeeAdmissionDate | date: "dd/MM/yyyy" }}` → `apiDate: "dd/MM/yyyy"`

## Tarea 5 — `admin-vacaciones-balance/admin-vacaciones-balance`

`admin-vacaciones-balance.ts`: `CommonModule` sin otro uso — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`admin-vacaciones-balance.html` — 2 ocurrencias, mismo campo/formato (vista desktop + mobile):
`{{ item.hireDate | date: "dd/MM/yyyy" }}` → `apiDate: "dd/MM/yyyy"` (en ambas)

## Tarea 6 — `leave-request/mis-permisos-listado`

`mis-permisos-listado.ts`: `CommonModule` sin otro uso — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`mis-permisos-listado.html` — 2 ocurrencias:
- `item.startDate | date: "dd/MM/yyyy"` → `apiDate: "dd/MM/yyyy"`
- `item.endDate | date: "dd/MM/yyyy"` (envuelta en 2 líneas) → `apiDate: "dd/MM/yyyy"`

## Tarea 7 — `historial-solicitudes/solicitudes-historial`

**Caso especial — lee con cuidado.** `solicitudes-historial.ts` tiene **dos usos distintos e
independientes** de fecha:

1. En `imports: [...]` tiene `CommonModule` (sin otro uso en la plantilla más allá de `| date`) —
   **reemplázalo por `ApiDatePipe`**.
2. Por separado, `providers: [DatePipe]` + `private datePipe = inject(DatePipe);` +
   dos llamadas `this.datePipe.transform(formValues.startDate, "yyyy-MM-dd")` /
   `this.datePipe.transform(formValues.endDate, "yyyy-MM-dd")` dentro de `onSearch()` (líneas
   ~249 y ~253). **Esto NO lo toques.** `formValues.startDate`/`endDate` vienen de un selector de
   fecha del formulario de filtro (ya son objetos `Date` nativos, no strings del API) y se
   formatean para enviarlos como query param — es el caso legítimo de uso directo de `DatePipe`
   sobre un `Date` ya construido, no sobre un campo del API. Dejar `providers: [DatePipe]` y el
   `inject(DatePipe)` exactamente como están.

Import a agregar: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`solicitudes-historial.html` — 6 ocurrencias (todas sobre campos de la lista de resultados, `item.*`,
no relacionadas con el `onSearch()` de arriba):
- `item.startDate | date: "dd/MM/yyyy"` → `apiDate: "dd/MM/yyyy"`
- `item.endDate | date: "dd/MM/yyyy"` → `apiDate: "dd/MM/yyyy"`
- `item.requestDate | date: "dd/MM/yyyy HH:mm"` → `apiDate: "dd/MM/yyyy HH:mm"`
- `item.approvalDate ? (item.approvalDate | date: "dd/MM/yyyy HH:mm") : '—'` (envuelta en 2 líneas)
  → `apiDate: "dd/MM/yyyy HH:mm"` dentro del mismo operador `?:`
- `item.startDate | date: "dd/MM/yy"` (vista mobile, formato distinto de 2 dígitos de año) →
  `apiDate: "dd/MM/yy"`
- `item.endDate | date: "dd/MM/yy"` (vista mobile, misma sección que la anterior) →
  `apiDate: "dd/MM/yy"`

## Tarea 8 — `shared/generic-approval-panel.ts` (plantilla inline)

`CommonModule` sin otro uso en el `template:` — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

Dentro del `template:` inline, 1 ocurrencia:
`{{ request[col.field] | date: "dd/MM/yyyy" }}` → `{{ request[col.field] | apiDate: "dd/MM/yyyy" }}`

**No toques** los comentarios con mojibake preexistente (`GENóRICO`, `esténdar`, `óptima`,
`automíticamente`) — corrupción ya conocida, sin relación con este ticket.

## Tarea 9 — `shared/modal-approval-confirmation.ts` (plantilla inline)

`imports: [...]` contiene `CommonModule` **y** `DatePipe` por separado (redundante) — quita ambos,
agrega `ApiDatePipe`. Sin otro uso de `CommonModule` en el `template:` (usa `@if`/`@for`, no
`*ngIf`/`*ngFor`).
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

Dentro del `template:` inline, 4 ocurrencias — **2 bloques idénticos** (uno para
`request.requestType === "Permiso"`, otro para `"Vacaciones"`, cada uno con 2 ocurrencias — no te
confundas, son 2 secciones separadas del `@if`, migra ambas):
```
(req.startDate | date: 'dd MMM') + ' - ' + (req.endDate | date: 'dd MMM')
```
→
```
(req.startDate | apiDate: 'dd MMM') + ' - ' + (req.endDate | apiDate: 'dd MMM')
```

**No toques** el comentario con mojibake preexistente (`óltimos 3 meses`) — corrupción ya
conocida, sin relación con este ticket.

## Lo que NO debes hacer

- No toques `providers: [DatePipe]`, `inject(DatePipe)`, ni las 2 llamadas
  `this.datePipe.transform(...)` en `onSearch()` de `solicitudes-historial.ts` (Tarea 7) — es uso
  legítimo sobre un `Date` nativo del formulario, no un campo del API.
- No toques los comentarios con mojibake preexistente en Tareas 8 y 9.
- No toques ningún otro archivo — el resto de `recursos-humanos.luxuryapp` son tickets aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena (los 9 archivos están al mismo
  nivel de profundidad — 5 niveles arriba — pero confírmalo tú mismo contando carpetas, no asumas).

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' \
  $(find src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/vacation-balance-admin \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/past-vacations \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/my-vacation-requests \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/admin-vacaciones-balance \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/leave-request \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/historial-solicitudes \
         -name "*.html") \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/shared/generic-approval-panel.ts \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/shared/modal-approval-confirmation.ts
# Resultado esperado: sin salida (0 residuales)

grep -n "datePipe.transform\|providers: \[DatePipe\]" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/historial-solicitudes/solicitudes-historial.ts
# Resultado esperado: 3 líneas, intactas (providers + 2 llamadas transform)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 24 ocurrencias migradas a `apiDate`, mismo formato cada una.
- `CommonModule`/`DatePipe` redundantes en `imports:` limpiados en Tareas 1, 2 y 9.
- `providers: [DatePipe]` y las 2 llamadas `this.datePipe.transform(...)` de
  `solicitudes-historial.ts` intactas, sin tocar.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 9 archivos (7 pares `.ts`+`.html`, más los 2 `.ts` con plantilla inline).
2. Confirmación de que el uso legítimo de `DatePipe` en `solicitudes-historial.ts` (`onSearch()`)
   quedó intacto.
3. Salida literal de los 2 comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
