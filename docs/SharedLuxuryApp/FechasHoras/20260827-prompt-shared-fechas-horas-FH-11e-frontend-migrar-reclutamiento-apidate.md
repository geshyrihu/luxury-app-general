# TICKET FH-11e — Frontend: migrar `reclutamiento.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11d` (ya cerrados y aprobados). Cubre `reclutamiento.luxuryapp` — 7 archivos, 19
ocurrencias de `| date`.

**Varias plantillas envuelven la expresión en múltiples líneas** (formateo automático de Prettier) —
busca por el contenido semántico (nombre de campo + formato), no por número de línea exacto; el
número de línea es solo referencia aproximada.

En todos los casos de este ticket, `CommonModule`/`DatePipe` se pueden **reemplazar por completo**
por `ApiDatePipe` — verificado por grep que ninguna de las 7 plantillas usa otro miembro de
`CommonModule` (`*ngIf`, `*ngFor`, `ngClass`, `ngStyle`, `| async`, `| number`, etc.), salvo la
Tarea 6, que además usa `| currency` — pero ese pipe viene de `CurrencyPipe` importado por separado
(no de `CommonModule`), así que no cambia el tratamiento.

## Tarea 1 — `candidate/candidate-interview-detail-modal`

`candidate-interview-detail-modal.ts`: `import { CommonModule, DatePipe } from "@angular/common";`
→ reemplaza ambos por `ApiDatePipe` (import y arreglo `imports`).

`candidate-interview-detail-modal.html`:
- Línea 41: `{{ interviewData()?.operationsInterviewAt | date:'dd/MM/yyyy HH:mm' }}` →
  `{{ interviewData()?.operationsInterviewAt | apiDate:'dd/MM/yyyy HH:mm' }}`
- Línea 89: `{{ item.changedAt | date:'dd/MM/yyyy HH:mm' }}` → `{{ item.changedAt | apiDate:'dd/MM/yyyy HH:mm' }}`

## Tarea 2 — `candidate-application/candidate-hiring-documents-modal`

`candidate-hiring-documents-modal.ts`: `import { CommonModule } from "@angular/common";` →
reemplaza por `ApiDatePipe`.

`candidate-hiring-documents-modal.html`:
- Línea 32: `Entregado: {{ row.document?.submittedAt | date: "dd/MM/yyyy HH:mm" }}` →
  `Entregado: {{ row.document?.submittedAt | apiDate: "dd/MM/yyyy HH:mm" }}`
- Línea 41: `{{ row.document?.validatedAt | date: "dd/MM/yyyy HH:mm" }}` →
  `{{ row.document?.validatedAt | apiDate: "dd/MM/yyyy HH:mm" }}`

## Tarea 3 — `candidate-interview/candidate-interview-response`

`candidate-interview-response.ts`: `import { CommonModule, DatePipe }` → reemplaza ambos por
`ApiDatePipe`.

`candidate-interview-response.html`:
- Línea 58: `{{ interviewData()?.operationsInterviewAt | date:'dd/MM/yyyy HH:mm' }}` →
  `{{ interviewData()?.operationsInterviewAt | apiDate:'dd/MM/yyyy HH:mm' }}`
- Línea 150: `{{ item.createdAt | date:'dd/MM/yyyy HH:mm' }}` → `{{ item.createdAt | apiDate:'dd/MM/yyyy HH:mm' }}`

## Tarea 4 — `candidate-interviewer-queue/candidate-interviewer-queue`

`candidate-interviewer-queue.ts`: `import { CommonModule, DatePipe }` → reemplaza ambos por
`ApiDatePipe`.

`candidate-interviewer-queue.html` — 4 ocurrencias, dos dentro de ternarios (cuidado con la
sintaxis, no cambies la estructura del condicional):
- Línea 134: `Proxima cita: {{ vacancy.nextInterviewAt | date:'dd/MM/yyyy HH:mm' }}` →
  `Proxima cita: {{ vacancy.nextInterviewAt | apiDate:'dd/MM/yyyy HH:mm' }}`
- Línea 174: `{{ candidate.operationsInterviewAt ? (candidate.operationsInterviewAt | date:'dd/MM/yyyy HH:mm') : 'Sin fecha programada' }}`
  → cambia solo la parte del pipe: `... | apiDate:'dd/MM/yyyy HH:mm') : ...`
- Línea 260: `{{ selectedCandidate()?.operationsInterviewAt ? (selectedCandidate()?.operationsInterviewAt | date:'dd/MM/yyyy HH:mm') : 'Pendiente de programacion' }}`
  → mismo cambio, solo el pipe.
- Línea 282: `{{ selectedCandidate()?.lastFeedbackAt ? (selectedCandidate()?.lastFeedbackAt | date:'dd/MM/yyyy HH:mm') : 'Sin retroalimentacion' }}`
  → mismo cambio, solo el pipe.

## Tarea 5 — `candidate-recruitment-interviews/candidate-recruitment-interviews`

`candidate-recruitment-interviews.ts`: `import { CommonModule, DatePipe }` → reemplaza ambos por
`ApiDatePipe`.

`candidate-recruitment-interviews.html` — 2 ocurrencias (la plantilla envuelve ambas en varias
líneas, busca por contenido):
- `Proxima cita: {{ vacancy.nextInterviewAt | date: "dd/MM/yyyy HH:mm" }}` (~línea 207) →
  `apiDate: "dd/MM/yyyy HH:mm"`
- Dentro de un `@if (candidate.applicationDate) { ... } @else { ... }` (~línea 244-245):
  `{{ candidate.applicationDate | date: "dd/MM/yyyy" }}` → `{{ candidate.applicationDate | apiDate: "dd/MM/yyyy" }}`
  (campo real: `CandidateProcess.RegisterDate`, `DateOnly` en el backend — este sí es un candidato
  real de desfase de día, no solo consistencia).

## Tarea 6 — `candidate-work-position-candidates/candidate-work-position-candidates`

`candidate-work-position-candidates.ts`:
`import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";` → quita `CommonModule` y
`DatePipe`, agrega `ApiDatePipe`, **conserva `CurrencyPipe`** (la plantilla usa `| currency` en las
líneas 67 y 77, ese pipe se importa aparte de `CommonModule` y no se toca).

`candidate-work-position-candidates.html` — 5 ocurrencias (todas envueltas en varias líneas,
mayoría dentro de bloques `@if (...) { ... } @else { ... }` — busca por contenido, no por línea
exacta):
- `candidate.applicationDate | date: "dd/MM/yyyy"` (~línea 218-219, dentro de "Registro") →
  `apiDate: "dd/MM/yyyy"` (mismo campo `DateOnly` que en la Tarea 5)
- `candidate.recruitmentInterviewAt | date: "dd/MM/yyyy HH:mm"` (~línea 229-231, "Entrevista RH") →
  `apiDate: "dd/MM/yyyy HH:mm"`
- `candidate.operationsInterviewAt | date: "dd/MM/yyyy HH:mm"` (~línea 241-243, "Entrevista
  operaciones") → `apiDate: "dd/MM/yyyy HH:mm"`
- `candidate.applicationDate | date: "dd/MM/yyyy"` (~línea 349-350, segunda vista "Registro") →
  `apiDate: "dd/MM/yyyy"`
- `(candidate.operationsInterviewAt || candidate.recruitmentInterviewAt) | date: "dd/MM/yyyy HH:mm"`
  (~línea 360-363, "Ultima entrevista" — el pipe aplica sobre el resultado del `||`, no sobre un
  solo campo; conserva esa estructura, solo cambia `date` por `apiDate`) →
  `... | apiDate: "dd/MM/yyyy HH:mm" ...`

## Tarea 7 — `recruitment-agenda-list`

`recruitment-agenda-list.ts`: `import { DatePipe } from "@angular/common";` → reemplaza por
`ApiDatePipe`.

`recruitment-agenda-list.html` (~línea 132-133, dentro de `@if (item.scheduledInterviewAt) { ... }`):
`{{ item.scheduledInterviewAt | date: "dd/MM/yyyy HH:mm" }}` →
`{{ item.scheduledInterviewAt | apiDate: "dd/MM/yyyy HH:mm" }}`

## Lo que NO debes hacer

- No toques ningún otro archivo de `reclutamiento.luxuryapp` más allá de los 7 mencionados.
- No cambies la estructura de los ternarios ni de los bloques `@if`/`@else` — solo el nombre del pipe
  (`date` → `apiDate`), deja intacta la lógica condicional.
- En la Tarea 6, no toques `CurrencyPipe` ni el `| currency`.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
grep -rn "| date\b" src/app/apps/reclutamiento.luxuryapp --include="*.html"
# Resultado esperado: 0 líneas

grep -rn "| currency" src/app/apps/reclutamiento.luxuryapp/candidate-work-position-candidates/candidate-work-position-candidates.html
# Resultado esperado: 2 líneas (confirma que | currency sigue intacto)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 19 ocurrencias migradas a `apiDate`, mismo formato y misma estructura condicional/ternaria que
  tenían antes.
- `CommonModule`/`DatePipe` reemplazados por `ApiDatePipe` en los 7 archivos; `CurrencyPipe`
  conservado en la Tarea 6.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 7 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 7 archivos `.ts` + 7 `.html`.
2. Salida literal de los 2 greps de verificación y de `ng build`.
3. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
