# TICKET FH-11o — Frontend: migrar clúster final "contratos/entrevistas/evaluaciones" de `recursos-humanos.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11n` (ya cerrados y aprobados). Cubre el **último** clúster de
`recursos-humanos.luxuryapp` — 12 archivos, **26 ocurrencias** de `| date` (recontadas con
búsqueda multilínea — úsala también en tu verificación final, e incluye una búsqueda de bindings
`[algo]="...| date"` sin `{{ }}`, por si acaso — en el ticket anterior (FH-11n) apareció una
ocurrencia así que el grep de `{{ }}` no detectaba). **Con este ticket se completa toda la Fase 4**
(las 14 apps con `| date` quedan migradas a `apiDate`).

Ningún archivo de este clúster tiene mojibake tipo mensaje corrupto salvo 2 textos de respaldo
`'é'` (ver Tareas 1 y 3 — no tocar, ya reportado en tickets previos como corrupción preexistente
de guion largo).

**Hallazgo aparte, sin relación con este ticket — NO lo toques:** `work-contract-list.ts` (Tarea
1) usa `| currency` en su plantilla (línea ~38) pero **no importa `CurrencyPipe`** — mismo tipo de
bug preexistente ya visto en tickets anteriores (pipe usado sin importar, sin causar error de
build). Solo repórtalo.

## Tarea 1 — `recursos-humanos/work-contract/work-contract-list`

`work-contract-list.ts`: `import { DatePipe } from "@angular/common";` (suelto) → reemplaza por
`ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`work-contract-list.html` — 4 ocurrencias, **sin workaround**:
- `item.startDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'` (vista desktop)
- `item.endDate ? (item.endDate | date:'dd/MM/yyyy') : 'é'` → `apiDate:'dd/MM/yyyy'` dentro del
  mismo `?:` (el fallback `'é'` es mojibake preexistente de un guion largo — no lo toques)
- `item.startDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'` (vista mobile, otra sección)
- `item.endDate ? (item.endDate | date:'dd/MM/yyyy') : 'Indefinido'` (envuelta en 2 líneas) →
  `apiDate:'dd/MM/yyyy'` dentro del mismo `?:`

## Tarea 2 — `recursos-humanos/work-contract/work-contract-detail`

`work-contract-detail.ts`: `import { CurrencyPipe, DatePipe } from "@angular/common";` —
**`CurrencyPipe` ya está importado por separado** (no depende de `CommonModule`). Quita solo
`DatePipe`, agrega `ApiDatePipe`, conserva `CurrencyPipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`work-contract-detail.html` — 2 ocurrencias, **sin workaround**:
- `item()!.startDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `item()!.endDate ? (item()!.endDate | date:'dd/MM/yyyy') : 'Indefinido'` (envuelta en 2 líneas) →
  `apiDate:'dd/MM/yyyy'` dentro del mismo `?:`

## Tarea 3 — `recursos-humanos/contract-addendum/contract-addendum-list`

`contract-addendum-list.ts`: `DatePipe` suelto → reemplaza por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`contract-addendum-list.html` — 3 ocurrencias, **sin workaround**:
- `item.effectiveDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `item.signedDate ? (item.signedDate | date:'dd/MM/yyyy') : 'é'` → `apiDate:'dd/MM/yyyy'` dentro
  del mismo `?:` (el `'é'` es el mismo tipo de mojibake preexistente, no lo toques)
- `item.effectiveDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'` (otra sección)

## Tarea 4 — `recursos-humanos/contract-template/contract-template-list`

`contract-template-list.ts`: `DatePipe` suelto → reemplaza por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`contract-template-list.html` — 2 ocurrencias, mismo campo/formato:
`{{ item.createdAt | date:'dd/MM/yyyy' }}` → `apiDate:'dd/MM/yyyy'` (en ambas)

## Tarea 5 — `recursos-humanos/addendum-template/addendum-template-list`

`addendum-template-list.ts`: `DatePipe` suelto → reemplaza por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`addendum-template-list.html` — 2 ocurrencias, mismo campo/formato:
`{{ item.createdAt | date:'dd/MM/yyyy' }}` → `apiDate:'dd/MM/yyyy'` (en ambas)

## Tarea 6 — `recursos-humanos/employee-file/employee-onboarding-checklist/employee-onboarding-checklist`

`employee-onboarding-checklist.ts`: `DatePipe` suelto → reemplaza por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";` (nota: 6
niveles arriba, un nivel más que los demás por estar anidado dentro de `employee-file/`)

`employee-onboarding-checklist.html` — 1 ocurrencia:
`{{ task.completedAt | date:'dd/MM/yyyy HH:mm' }}` → `apiDate:'dd/MM/yyyy HH:mm'`

## Tarea 7 — `employees/employee-interviewer-queue/employee-interviewer-queue`

`employee-interviewer-queue.ts`: `imports: [CommonModule, DatePipe, WebButtonLabel, AppAvatar]` —
`CommonModule` y `DatePipe` redundantes (sin otro uso de `CommonModule` en la plantilla) — quita
ambos, agrega `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`employee-interviewer-queue.html` — 2 ocurrencias:
- `vacancy.requestDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `vacancy.nextInterviewAt | date:'dd/MM/yyyy HH:mm'` (envuelta en 2 líneas) →
  `apiDate:'dd/MM/yyyy HH:mm'`

## Tarea 8 — `employees/employee-interviewer-queue/employee-interview-response`

`employee-interview-response.ts`: `CommonModule` y `DatePipe` redundantes en `imports:` — quita
ambos, agrega `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`employee-interview-response.html` — 2 ocurrencias:
- `interviewData()?.operationsInterviewAt | date:'dd/MM/yyyy HH:mm'` →
  `apiDate:'dd/MM/yyyy HH:mm'`
- `item.createdAt | date:'dd/MM/yyyy HH:mm'` → `apiDate:'dd/MM/yyyy HH:mm'`

## Tarea 9 — `employees/employee-interviewer-queue/employee-queue-candidate-detail-modal`

`employee-queue-candidate-detail-modal.ts`: `CommonModule` y `DatePipe` redundantes en `imports:`
— quita ambos, agrega `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`employee-queue-candidate-detail-modal.html` — 3 ocurrencias:
- `detail()?.birthDate ? (detail()?.birthDate | date:'dd/MM/yyyy') : "Sin registrar"` (envuelta en
  2 líneas) → `apiDate:'dd/MM/yyyy'` dentro del mismo `?:`
- `exp.startDate | date:'MM/yyyy'` → `apiDate:'MM/yyyy'`
- `exp.endDate ? (exp.endDate | date:'MM/yyyy') : 'Actual'` (envuelta en 2 líneas) →
  `apiDate:'MM/yyyy'` dentro del mismo `?:`

## Tarea 10 — `employees/employee-interviewer-queue/vacancy-candidates-timeline-modal`

`vacancy-candidates-timeline-modal.ts`: `imports: [CommonModule, DatePipe, LxAvatar, LxTag,
TimelineModule, AppIcon]` — `CommonModule` y `DatePipe` redundantes — quita ambos, agrega
`ApiDatePipe`, conserva el resto.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`vacancy-candidates-timeline-modal.html` — 2 ocurrencias:
- `(candidate.createdAt || candidate.registerDate) | date: "mediumDate"` →
  `apiDate: "mediumDate"`
- `(event.createdAt || event.eventDate) | date: "mediumDate"` → `apiDate: "mediumDate"`

## Tarea 11 — `evaluaciones-de-desempeo/evaluation-template/performance-evaluation/resultado-evaluacion`

**Caso especial: NO quites `CommonModule`.** `resultado-evaluacion.ts`: `CommonModule` sin
`DatePipe` separado; la plantilla usa `| number` (2 puntos, líneas ~91 y ~136) sin `DecimalPipe`
importado por separado — depende de `CommonModule`. Agrega `ApiDatePipe` sin quitar `CommonModule`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`resultado-evaluacion.html` — 2 ocurrencias:
- `evaluationResult()!.evaluationDate | date: "dd/MM/yyyy" : "UTC"` (envuelta en 2 líneas) —
  **quitar el workaround `:"UTC"`** → `apiDate: "dd/MM/yyyy"`
- `today() | date: "dd/MM/yyyy HH:mm"` — sin workaround → `apiDate: "dd/MM/yyyy HH:mm"`

**No arregles** el `| number` sin `DecimalPipe` importado — repórtalo, no lo toques.

## Tarea 12 — `evaluaciones-de-desempeo/evaluation-template/performance-evaluation/lista-evaluacion-realizada`

`lista-evaluacion-realizada.ts`: `DatePipe` suelto → reemplaza por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

`lista-evaluacion-realizada.html` — 1 ocurrencia, **con workaround `:"UTC"` a quitar**:
`{{ item.evaluationDate | date: "dd/MM/yyyy" : "UTC" }}` → `{{ item.evaluationDate | apiDate: "dd/MM/yyyy" }}`

## Lo que NO debes hacer

- No quites `CommonModule` en la Tarea 11 (`resultado-evaluacion`, por `| number`).
- No toques `CurrencyPipe` en la Tarea 2 (`work-contract-detail`).
- No arregles el `| currency` sin `CurrencyPipe` en `work-contract-list.ts` (Tarea 1) ni el
  `| number` sin `DecimalPipe` en `resultado-evaluacion.ts` (Tarea 11) — repórtalos, no los toques.
- No toques los fallbacks `'é'` (mojibake preexistente de guion largo) en Tareas 1 y 3.
- No toques ningún otro archivo — no hay más clústers después de este, así que cualquier archivo
  fuera de esta lista de 12 está fuera de alcance sin excepción.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena (5 niveles en la mayoría, 6 en la
  Tarea 6 — cuenta las carpetas, no asumas).

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' \
  $(find src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/work-contract \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/contract-addendum \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/contract-template \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/addendum-template \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-onboarding-checklist \
         src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue \
         src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/evaluation-template/performance-evaluation \
         -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -rn '\[.*\]="[^"]*| date' \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/work-contract \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/contract-addendum \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/contract-template \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/addendum-template \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-onboarding-checklist \
  src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue \
  src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/evaluation-template/performance-evaluation
# Resultado esperado: sin salida (0 bindings residuales fuera de {{ }})

grep -rn "'UTC'\|\"UTC\"" src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo --include="*.html"
# Resultado esperado: 0 líneas

grep -n "currency" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/work-contract/work-contract-list.html src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/work-contract/work-contract-detail.html
# Resultado esperado: siguen presentes en ambos, sin cambios

grep -n "number" src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/evaluation-template/performance-evaluation/resultado-evaluacion.html
# Resultado esperado: 2 líneas, sin cambios

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 26 ocurrencias migradas a `apiDate`, mismo formato cada una, los 2 workarounds `:"UTC"`
  eliminados (Tareas 11 y 12).
- `CommonModule` conservado solo en la Tarea 11; `CurrencyPipe` conservado en la Tarea 2;
  `CommonModule`/`DatePipe` redundantes limpiados en Tareas 7, 8, 9 y 10.
- Los hallazgos de `| currency` (Tarea 1) y `| number` (Tarea 11) sin importar, reportados, no
  tocados.
- Los fallbacks `'é'` intactos.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 12 archivos `.ts` + 12 `.html`.
2. Confirmación de los 2 hallazgos de pipe sin importar (`| currency`, `| number`), sin tocar.
3. Salida literal de los 5 comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.
5. Confirma que, con este ticket, ya no queda ningún `| date` sin migrar en las 14 apps de la Fase
   4 (puedes correr `grep -rn "| date" client/angular/src/app/apps --include="*.html"` como
   verificación final de todo el proyecto, no solo de este ticket).

No avances a ningún otro ticket. Espera la auditoría.
