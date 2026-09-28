# TICKET FH-11g — Frontend: migrar `cobranza.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11f` (ya cerrados y aprobados). Cubre `cobranza.luxuryapp` (todo bajo
`cobranza-nativa/core/`) — **19 archivos, 34 ocurrencias** de `| date` (recontadas con búsqueda
multilínea — usa ese método también para tu verificación final, no un grep de una sola línea).

**Dos hallazgos preexistentes, sin relación con este ticket — NO los toques, son de otro ticket:**
- `core/approvals/approval-detail-modal.html:31` usa `{{ payload() | json }}` pero
  `approval-detail-modal.ts` nunca importa `JsonPipe` (solo `DatePipe`). Parece un bug preexistente.
- `core/invoices/invoice-list.html:129` usa `{{ inv.uuid | slice:0:18 }}` pero `invoice-list.ts`
  nunca importa `SlicePipe` (solo `DatePipe`). Mismo tipo de bug preexistente.

No los arregles, no los menciones como error tuyo — repórtalos tal cual en el reporte de
finalización para que quede registrado, y sigue con tu ticket normalmente (agregar `ApiDatePipe` no
empeora ni mejora esos dos casos, son independientes).

## Regla general para este ticket

En **todos** los archivos, `DatePipe` se importa por separado (no vía `CommonModule`), junto a
otros pipes de `@angular/common` (`CurrencyPipe`, `DecimalPipe`, `NgClass`) que también se importan
por separado — **no dependen de `CommonModule`, así que se conservan intactos** en todos los casos.
Reemplaza `DatePipe` por `ApiDatePipe` en el import y en el arreglo `imports`, sin tocar los demás
pipes. **Excepciones marcadas explícitamente en las Tareas 12, 13 y 15** (usan `CommonModule`).

## Tarea 1 — `core/approvals/approval-detail-modal`

`approval-detail-modal.ts`: `DatePipe` → `ApiDatePipe`.

`approval-detail-modal.html`, línea ~1:
`{{ req.requestedAt | date:'dd/MM/yyyy HH:mm' }}` → `{{ req.requestedAt | apiDate:'dd/MM/yyyy HH:mm' }}`

## Tarea 2 — `core/approvals/approval-inbox`

`approval-inbox.ts`: `DatePipe` → `ApiDatePipe`.

`approval-inbox.html` — 2 ocurrencias (una envuelta en 2 líneas):
- `item.requestedAt | date:'dd/MM/yyyy HH:mm'` → `apiDate:'dd/MM/yyyy HH:mm'`
- `item.requestedAt | date:'dd/MM/yyyy'` (envuelta) → `apiDate:'dd/MM/yyyy'`

## Tarea 3 — `core/audit/financial-audit-log`

`financial-audit-log.ts`: `DatePipe` → `ApiDatePipe`.

`financial-audit-log.html` — 2 ocurrencias, mismo campo y formato (vista tabla + vista tarjeta):
`{{ log.occurredAt | date:'dd/MM/yyyy HH:mm' }}` → `apiDate:'dd/MM/yyyy HH:mm'` (en ambas)

## Tarea 4 — `core/automated-services/automated-services`

`automated-services.ts`: `DatePipe` → `ApiDatePipe`.

`automated-services.html`:
`{{ r.executedAt | date:'HH:mm:ss' }}` → `{{ r.executedAt | apiDate:'HH:mm:ss' }}`

## Tarea 5 — `core/charge-templates/charge-template-list`

`charge-template-list.ts`: `import { CurrencyPipe, DatePipe, NgClass }` — quita solo `DatePipe`,
agrega `ApiDatePipe`, **conserva `CurrencyPipe` y `NgClass`** (usados en `| currency` y `ngClass`).

`charge-template-list.html` — 4 ocurrencias (2 vistas × campo simple + ternario), **todas con
workaround `:'UTC'` a quitar**:
- `item.startDate | date:'dd/MM/yyyy':'UTC'` → `item.startDate | apiDate:'dd/MM/yyyy'`
- `item.endDate ? (item.endDate | date:'dd/MM/yyyy':'UTC') : 'Indefinido'` → cambia solo el pipe:
  `... | apiDate:'dd/MM/yyyy') : 'Indefinido'`
- (segunda vista) `item.startDate | date:'dd/MM/yyyy':'UTC'` → ídem
- (segunda vista, envuelta) `item.endDate ? (item.endDate | date:'dd/MM/yyyy':'UTC') : 'Indefinido'` → ídem

## Tarea 6 — `core/charges/charge-list`

`charge-list.ts`: `import { DatePipe, DecimalPipe }` — quita solo `DatePipe`, agrega `ApiDatePipe`,
**conserva `DecimalPipe`** (usado en `| number`).

`charge-list.html` — 2 ocurrencias, **con workaround `:"UTC"` a quitar**:
- `item.dueDate | date: "dd/MM/yyyy":"UTC"` → `item.dueDate | apiDate: "dd/MM/yyyy"`
- `item.dueDate | date:"dd/MM/yyyy":"UTC"` (segunda vista) → `item.dueDate | apiDate:"dd/MM/yyyy"`

## Tarea 7 — `core/collection-cases/collection-case-detail-modal`

`collection-case-detail-modal.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`,
agrega `ApiDatePipe`, conserva `CurrencyPipe`.

`collection-case-detail-modal.html` — 2 ocurrencias:
- `act.activityDate | date:'dd/MM/yyyy HH:mm'` → `apiDate:'dd/MM/yyyy HH:mm'`
- `act.promisedDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`

## Tarea 8 — `core/collection-cases/collection-case-list`

`collection-case-list.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`, agrega
`ApiDatePipe`, conserva `CurrencyPipe`.

`collection-case-list.html`:
`{{ item.lastContactAt | date:"dd/MM/yyyy" }}` → `{{ item.lastContactAt | apiDate:"dd/MM/yyyy" }}`

## Tarea 9 — `core/invoices/invoice-list`

`invoice-list.ts`: `DatePipe` → `ApiDatePipe`.

`invoice-list.html` — 2 ocurrencias, mismo campo, formatos distintos (vista tabla + tarjeta):
- `inv.timbreAt | date:'dd/MM/yyyy HH:mm'` → `apiDate:'dd/MM/yyyy HH:mm'`
- `inv.timbreAt | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`

## Tarea 10 — `core/ledger/ledger-viewer`

`ledger-viewer.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`, agrega
`ApiDatePipe`, conserva `CurrencyPipe`.

`ledger-viewer.html` — 2 ocurrencias, mismo campo y formato:
`{{ entry.effectiveDate | date:"dd/MM/yyyy" }}` → `apiDate:"dd/MM/yyyy"` (en ambas)

## Tarea 11 — `core/members/member-list`

`member-list.ts`: `DatePipe` → `ApiDatePipe`.

`member-list.html` — 2 ocurrencias, **con workaround `:"UTC"` a quitar**:
`{{ item.startDate | date:"dd/MM/yyyy":"UTC" }}` → `{{ item.startDate | apiDate:"dd/MM/yyyy" }}` (en ambas)

## Tarea 12 — `core/native-statement/native-statement`

**Caso especial: NO quites `CommonModule`.** `native-statement.ts` importa
`CommonModule, CurrencyPipe, DatePipe` juntos — la plantilla usa `| uppercase` (líneas 159 y 241),
que depende de `CommonModule` (no hay `UpperCasePipe` importado por separado). Quita solo
`DatePipe`, agrega `ApiDatePipe`, **conserva `CommonModule` y `CurrencyPipe`**.

`native-statement.html` — 2 ocurrencias, **formatos distintos entre sí**:
- `entry.date | date:'dd/MMM/yyyy'` → `entry.date | apiDate:'dd/MMM/yyyy'`
- `entry.date | date:'dd MMM yyyy'` → `entry.date | apiDate:'dd MMM yyyy'`

## Tarea 13 — `core/payments/payment-detail-modal`

`payment-detail-modal.ts` importa `CommonModule, CurrencyPipe, DatePipe` juntos, pero verificado
que la plantilla **no usa ningún otro miembro de `CommonModule`** (solo `| currency`, que ya viene
de `CurrencyPipe` importado aparte) — quita `CommonModule` y `DatePipe`, agrega `ApiDatePipe`,
conserva `CurrencyPipe`.

`payment-detail-modal.html` — 2 ocurrencias, una con workaround `:'UTC'`:
- `payment()!.paymentDate | date:'dd/MM/yyyy':'UTC'` → `payment()!.paymentDate | apiDate:'dd/MM/yyyy'`
- `item.appliedAt | date:'dd/MM/yyyy HH:mm'` → `item.appliedAt | apiDate:'dd/MM/yyyy HH:mm'`

## Tarea 14 — `core/payments/payment-list`

`payment-list.ts`: `import { DatePipe, DecimalPipe }` — quita solo `DatePipe`, agrega `ApiDatePipe`,
conserva `DecimalPipe`.

`payment-list.html` — 2 ocurrencias, **con workaround `:"UTC"` a quitar**:
- `item.paymentDate | date: "dd/MM/yyyy":"UTC"` → `item.paymentDate | apiDate: "dd/MM/yyyy"`
- `item.paymentDate | date:"dd/MM/yyyy":"UTC"` → `item.paymentDate | apiDate:"dd/MM/yyyy"`

## Tarea 15 — `core/payments/payments`

`payments.ts` importa `CommonModule, CurrencyPipe, DatePipe` en el arreglo `imports`, **y además**
`providers: [DatePipe]` (línea ~79) — verificado que ese `DatePipe` de `providers` no se inyecta
programáticamente en ninguna parte del archivo (no hay `inject(DatePipe)` ni uso de una variable
`datePipe`); parece código muerto, **no lo toques, déjalo exactamente como está** (no es parte de
este ticket limpiarlo). Verificado también que la plantilla no usa ningún otro miembro de
`CommonModule` fuera de `| currency` (ya viene de `CurrencyPipe` aparte) — quita `CommonModule` y
`DatePipe` del arreglo `imports` (no toques `providers`), agrega `ApiDatePipe`, conserva
`CurrencyPipe`.

`payments.html`:
`{{ charge.dueDate | date:'dd/MMM/yyyy' }}` → `{{ charge.dueDate | apiDate:'dd/MMM/yyyy' }}`

## Tarea 16 — `core/period-closures/period-closure-dashboard`

`period-closure-dashboard.ts`: `DatePipe` → `ApiDatePipe`.

`period-closure-dashboard.html` — 2 ocurrencias, mismo campo y formato:
`{{ item.closedAt | date:'dd/MM/yyyy HH:mm' }}` → `apiDate:'dd/MM/yyyy HH:mm'` (en ambas)

## Tarea 17 — `core/property-fines/issue-fine-charge-form`

`issue-fine-charge-form.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`, agrega
`ApiDatePipe`, conserva `CurrencyPipe`.

`issue-fine-charge-form.html`, **con workaround `:'UTC'` a quitar**:
`{{ fine()!.infractionDate | date: 'dd/MM/yyyy' : 'UTC' }}` → `{{ fine()!.infractionDate | apiDate: 'dd/MM/yyyy' }}`

## Tarea 18 — `core/property-fines/property-fine-list`

`property-fine-list.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`, agrega
`ApiDatePipe`, conserva `CurrencyPipe`.

`property-fine-list.html`, **con workaround `:'UTC'` a quitar**:
`{{ item.infractionDate | date: 'dd/MM/yyyy' : 'UTC' }}` → `{{ item.infractionDate | apiDate: 'dd/MM/yyyy' }}`

## Tarea 19 — `core/reconciliation/reconciliation-dashboard`

`reconciliation-dashboard.ts`: `import { CurrencyPipe, DatePipe }` — quita solo `DatePipe`, agrega
`ApiDatePipe`, conserva `CurrencyPipe`.

`reconciliation-dashboard.html` — 2 ocurrencias, mismo campo y formato:
`{{ pay.paymentDate | date:'dd/MM/yyyy' }}` → `apiDate:'dd/MM/yyyy'` (en ambas)

## Lo que NO debes hacer

- No toques `core/approvals/approval-detail-modal.html:31` (`| json` sin `JsonPipe`) ni
  `core/invoices/invoice-list.html:129` (`| slice` sin `SlicePipe`) — son bugs preexistentes sin
  relación con `apiDate`, repórtalos, no los arregles.
- No toques `providers: [DatePipe]` en `payments.ts` — solo el arreglo `imports`.
- No quites `CommonModule` en la Tarea 12 (`native-statement`, por `| uppercase`).
- No toques `CurrencyPipe`/`DecimalPipe`/`NgClass` en ningún archivo — todos se conservan.
- No toques ningún otro archivo de `cobranza.luxuryapp` más allá de los 19 mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

**Usa búsqueda multilínea, no grep simple de una línea** (varias ocurrencias de este ticket están
envueltas entre líneas):

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' $(find src/app/apps/cobranza.luxuryapp -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -rn "'UTC'" src/app/apps/cobranza.luxuryapp --include="*.html"
# Resultado esperado: 0 líneas

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 34 ocurrencias migradas a `apiDate`, mismo formato, workarounds `:'UTC'`/`:"UTC"` eliminados.
- `CommonModule` conservado solo en Tarea 12; quitado en Tareas 13 y 15; nunca estuvo presente en
  las demás (ya usaban `DatePipe` suelto).
- `CurrencyPipe`/`DecimalPipe`/`NgClass` intactos en todos los archivos que los usan.
- `providers: [DatePipe]` de `payments.ts` intacto.
- Los 2 bugs preexistentes (`| json`, `| slice`) sin tocar, reportados.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 19 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 19 archivos `.ts` + 19 `.html`.
2. Confirmación explícita de los 2 bugs preexistentes encontrados (aunque no los toques).
3. Salida literal de los 2 comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
