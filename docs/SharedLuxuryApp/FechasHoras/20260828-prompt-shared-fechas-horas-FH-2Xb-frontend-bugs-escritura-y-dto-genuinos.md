# TICKET FH-2Xb — Frontend: bugs reales de escritura (fecha sin formatear) + DTOs genuinos restantes

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Continuación de FH-2Xa
(cerrado). Durante la investigación de los `Date | string` restantes se encontraron **3 bugs
reales** (no solo tipado laxo): formularios que envían un objeto `Date` crudo al API en vez de
formatearlo con `DateService.getDateFormat()` antes de construir el payload — el mismo tipo de
riesgo de desfase de día (UTC vs. local) que motivó toda la Fase 4, pero en el sentido de
**escritura** en vez de lectura. Casi todos los demás formularios de la app ya hacen esta
conversión correctamente (verificado); estos 3 son la excepción.

Además, se identificaron **4 interfaces que son DTOs genuinos de API** (no `FormControl` de
formulario) con campos `Date | string` que deben ser `string`, sin bug asociado — solo tipado.

**No toques ningún `FormControl<Date | string>` fuera de los archivos listados aquí** — la mayoría
ya convierte correctamente antes de enviar y no aporta valor tocarlos (decisión ya tomada, fuera de
alcance de este ticket).

## Tarea 1 — BUG: `recursos-humanos.luxuryapp/employee/employee-personal-data-form.ts`

El campo `birth` se envía sin formatear: `birth: this.form.get("birth")?.value` (línea ~167, dentro
de `onSubmit()`). Este archivo **no inyecta `DateService`** en absoluto.

1. Agrega el import: `import { DateService } from "src/app/core/services/date.service";`
2. Agrega la inyección junto a los demás servicios inyectados: `private dateS = inject(DateService);`
3. En el payload de `onSubmit()`, cambia:
   ```ts
   birth: this.form.get("birth")?.value,
   ```
   por:
   ```ts
   birth: this.dateS.getDateFormat(this.form.get("birth")?.value),
   ```

No toques el resto del payload (`bloodType`, `curp`, etc.) ni la lógica de `onLoadData()`.

## Tarea 2 — BUG: `reclutamiento.luxuryapp/solicitud-modificacion-sueldo/modificacion-salario-form.ts`

`onSubmit()` envía `this.form.getRawValue()` completo sin formatear `executionDate`/`requestDate`
(ambos controles son `Date | null` en tiempo de ejecución, poblados por el datepicker o por
`this.toDate(result.executionDate)` al cargar). Este archivo **no inyecta `DateService`**.

1. Agrega el import: `import { DateService } from "src/app/core/services/date.service";`
2. Agrega la inyección: `private dateS = inject(DateService);`
3. Cambia el `transformPayload` de `onSubmit()`:
   ```ts
   transformPayload: () => this.form.getRawValue(),
   ```
   por:
   ```ts
   transformPayload: () => ({
     ...this.form.getRawValue(),
     executionDate: this.dateS.getDateFormat(this.form.getRawValue().executionDate),
     requestDate: this.dateS.getDateFormat(this.form.getRawValue().requestDate),
   }),
   ```

Además, en la interfaz `RequestSalaryModificationEditDTO` (definida arriba en el mismo archivo),
cambia:
```ts
executionDate: Date | string | null;
requestDate: Date | string | null;
```
por:
```ts
executionDate: string | null;
requestDate: string | null;
```
(Los datos llegan del API como JSON, siempre `string`; `this.toDate(...)` ya acepta `string` en su
firma, así que el `patchValue` de `onLoadData()` sigue compilando sin cambios.)

## Tarea 3 — BUG: `reclutamiento.luxuryapp/solicitud-modificacion-sueldo/status-request-salary-modification-form.ts`

Mismo bug exacto que la Tarea 2, mismo endpoint (`RequestSalaryModification`), formulario paralelo
de cambio de estatus. Este archivo tampoco inyecta `DateService`.

1. Agrega el import y la inyección, igual que en la Tarea 2.
2. Cambia el `transformPayload` de `onSubmit()`:
   ```ts
   transformPayload: () => this.form.getRawValue(),
   ```
   por:
   ```ts
   transformPayload: () => ({
     ...this.form.getRawValue(),
     requestDate: this.dateS.getDateFormat(this.form.getRawValue().requestDate),
     executionDate: this.dateS.getDateFormat(this.form.getRawValue().executionDate),
   }),
   ```
3. En la interfaz `RequestSalaryModificationStatusFormDTO` (definida arriba en el mismo archivo),
   cambia:
   ```ts
   requestDate: Date | string | null;
   executionDate: Date | string | null;
   ```
   por:
   ```ts
   requestDate: string | null;
   executionDate: string | null;
   ```

## Tarea 4 — DTO genuino (sin bug): `operations.luxuryapp/dashboard/interfaces/pending-item.dto.ts`

```ts
lastFollowupDate?: string | Date; // Date from backend comes as string usually unless mapped
```
→
```ts
lastFollowupDate?: string;
```
Quita también el comentario (ya no aplica). Verificado: su único consumo es
`new Date(item.lastFollowupDate || item.date)` en `unified-pending-dashboard.ts`, que funciona
igual con `string`.

## Tarea 5 — DTO genuino (sin bug): `core/interfaces/recurring-tasks/recurring-task-template-catalog.interface.ts`

En `RecurringTaskTemplateCatalogAddOrEdit`:
```ts
startDate: string | Date | null;
endDate: string | Date | null;
```
→
```ts
startDate: string | null;
endDate: string | null;
```
Verificado: `recurring-task-catalog-form.ts` ya convierte con `toDateOnly()` antes de enviar, y
`toDateControlValue()` (usado al recibir datos del API) ya acepta `string` en su firma — ningún
cambio adicional necesario en ese archivo.

## Tarea 6 — DTO genuino (sin bug): `reclutamiento.luxuryapp/solicitud-modificacion-sueldo/solicitud-modificacion-salario-form.ts`

En la interfaz `RequestSalaryModificationSeedDTO` (definida en el mismo archivo):
```ts
executionDate?: Date | string | null;
```
→
```ts
executionDate?: string | null;
```
Verificado: este archivo ya llama `this.dateS.getDateFormat(formValue.executionDate as Date)` antes
de enviar — sin bug, solo tipado impreciso. No toques la lógica de envío.

## Tarea 7 — DTO genuino (sin bug): `reclutamiento.luxuryapp/solicitud-baja/solicitud-baja-form.ts`

En la interfaz `RequestDismissalDraftDTO` (definida en el mismo archivo):
```ts
executionDate?: string | Date | null;
lastdayofwork?: string | Date | null;
```
→
```ts
executionDate?: string | null;
lastdayofwork?: string | null;
```
Verificado: este archivo ya llama `this.dateS.getDateFormat(...)` para ambos campos antes de
enviar — sin bug, solo tipado impreciso. No toques la lógica de envío.

## Lo que NO debes hacer

- No toques ningún otro `FormControl<Date | string>` fuera de las Tareas 1-3 (hay ~15 más en la
  app, ya verificados como seguros/cosméticos — fuera de alcance).
- No toques los controles de filtro de rango de fechas (`fromCtrl`/`toCtrl`/`asOfCtrl` en
  `cobranza.luxuryapp`, `fechaInicio`/`fechaFin` en `contabilidad.luxuryapp`) — son deliberadamente
  flexibles porque el widget compartido de fecha puede emitir `Date` o `string` según el modo.
- No toques `input-date.ts` (ninguna de las 3 variantes: web/mobile/adaptive) ni ninguna función
  utilitaria privada tipo `formatDate`/`toDate`/`parseBusinessDateTime` que ya acepta ambos tipos a
  propósito.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica que `DateService` no esté ya inyectado bajo otro nombre antes de agregarlo (evita
  duplicar la inyección).

## Verificación obligatoria

```bash
cd client/angular
grep -n "DateService\|getDateFormat" \
  src/app/apps/recursos-humanos.luxuryapp/employee/employee-personal-data-form.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/modificacion-salario-form.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/status-request-salary-modification-form.ts
# Resultado esperado: cada archivo con el import, la inyección y al menos 1 llamada a getDateFormat

grep -n "Date | string\|string | Date" \
  src/app/apps/operations.luxuryapp/dashboard/interfaces/pending-item.dto.ts \
  src/app/core/interfaces/recurring-tasks/recurring-task-template-catalog.interface.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/modificacion-salario-form.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/status-request-salary-modification-form.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/solicitud-modificacion-salario-form.ts \
  src/app/apps/reclutamiento.luxuryapp/solicitud-baja/solicitud-baja-form.ts
# Resultado esperado: 0 líneas (las interfaces narrowed, sin residuales)

npx tsc --noEmit -p tsconfig.json 2>&1 | tail -n 80
npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Los 3 bugs de escritura corregidos: cada uno ahora llama `dateS.getDateFormat(...)` antes de
  enviar sus campos de fecha al API.
- Las 4 interfaces DTO narrowed a `string`/`string | null`, sin residuales `Date | string`.
- `tsc --noEmit` y `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 7 archivos.
2. Para cada bug (Tareas 1-3): confirma que antes del fix el payload realmente llevaba un `Date`
   crudo (no solo un tipo laxo) — es decir, que el fix cambia comportamiento real, no solo tipos.
3. Salida literal de los 3 comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
