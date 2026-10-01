# TICKET T-05 — Ampliar `recurrence-input`: varios días del mes y último día hábil

Trabajas en el repositorio LuxuryApp (Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Es la primera vez que un ticket de esta orquestación toca
frontend — lee este prompt completo antes de empezar, no asumas los mismos comandos de
verificación que usaste en los tickets de backend.

## Contexto

`RecurrenceInput` (`client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/instances/recurrence-input/`)
ya es un constructor guiado de RRULE, bien hecho: frecuencia, intervalo, días de la semana, día
del mes, posición mensual, fecha anual. Lo que le falta, comparado contra un calendario real de
cliente (`../../../docs/OperationsLuxuryApp/Tasks/20260821-auditoria-operations-tasks-validacion-calendario.md`):
15 de 24 obligaciones reales no se pueden capturar hoy porque `monthDay` sólo admite **un** día
del mes, y no existe una opción de "último día hábil del mes" independiente de la posición por
día de la semana.

**Este ticket es sólo el componente de recurrencia.** No construye la pantalla del catálogo
completo (eso es T-06) ni toca nada de backend.

## Qué SÍ entra en este ticket

1. **Varios días del mes en un solo patrón mensual** — por ejemplo, "los días 5 y 20 de cada
   mes" (el calendario real tiene 5 obligaciones así).
2. **"Último día del mes" como opción propia**, independiente de "día específico" — genera
   `BYMONTHDAY=-1`, que es exactamente lo que
   `RecurringTaskGenerationService.IsEndOfMonthPattern` (backend, ya aprobado) detecta para
   invertir la dirección del ajuste por festivo.
3. Corregir el mojibake ya presente en los dos archivos que vas a tocar (ver sección dedicada).

## Qué NO entra en este ticket, y por qué

- **No mezcles "días específicos" con "último día del mes" en la misma regla** (por ejemplo, no
  generes `BYMONTHDAY=5,20,-1`). Aunque `Ical.Net` lo parsearía sin error, el backend
  (`RecurringTaskGenerationService.IsEndOfMonthPattern`) decide la dirección del ajuste por
  festivo **para toda la regla**, no ocurrencia por ocurrencia — con una regla mixta, el ajuste
  del día 5 se movería hacia atrás igual que el del último día, lo cual sería incorrecto.
  Mantenlas como dos modos mutuamente excluyentes dentro de la sección mensual, igual que hoy ya
  son mutuamente excluyentes "día específico" y "posición por día de semana".
- **No implementes "rangos de días" (por ejemplo, "del día 1 al 5")**. No es expresable como
  RRULE — es un concepto de ventana que requeriría un campo nuevo en el backend
  (`RecurringTaskTemplate` no lo tiene). Si lo necesitas mencionar en tu reporte como limitación
  conocida, adelante, pero no construyas UI para algo sin backend detrás.
- **No implementes "presets" ni atajos de un clic.** Es una mejora de UX real (documentada en
  `06-analisis-flujos-simplificacion.md`), pero es una pieza aparte; este ticket se limita a que
  el constructor pueda **expresar** los patrones que hoy no puede.
- No toques `recurrence-input.spec.ts` más allá de lo necesario para que los tests existentes
  sigan pasando y agregar los nuevos que se piden abajo — no reescribas pruebas que ya pasan.

## Tareas de Frontend

Archivos:
`client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/instances/recurrence-input/recurrence-input.ts`
y `recurrence-input.html`.

### 1. Cambia `monthDay` de día único a varios días

En `IRecurrenceForm`, cambia:

```typescript
monthDay: FormControl<number | null>;
```

a:

```typescript
monthDays: FormControl<number[] | null>;
```

Ajusta el `FormGroup` inicial, `writeValue` (reset), `parseRRule` y `generateRRule` en
consecuencia. `generateRRule` para el caso `dayOfMonth` debe producir
`BYMONTHDAY=5,20` (varios valores separados por coma) cuando hay más de uno seleccionado, y
`BYMONTHDAY=5` cuando hay uno solo — mismo formato que ya entiende el backend. `parseRRule` debe
poder leer `rrule["BYMONTHDAY"].split(",").map(Number)` de vuelta a un arreglo.

### 2. Agrega el tercer modo mensual: "Último día del mes"

Hoy `monthlyTypes` tiene dos opciones (`dayOfMonth`, `dayOfWeek`). Agrega una tercera,
`lastDayOfMonth`, que no necesita ningún control adicional — al seleccionarla,
`generateRRule` produce `BYMONTHDAY=-1` directamente, sin combinarlo con `monthDays`.

En el HTML, sigue el mismo patrón visual que ya usan las otras dos opciones (bloque con borde,
`lx-radio-button`, resaltado cuando está seleccionada) — no inventes un estilo nuevo.

### 3. Cambia el selector de `monthDay` a multiselección

En el HTML, donde hoy está:

```html
<custom-input-select-signal
  [control]="recurrenceForm.controls.monthDay"
  [data]="monthNumbers"
  ...
></custom-input-select-signal>
```

Usa `custom-input-multiselect-signal` en su lugar (ya existe en el catálogo compartido,
`client/angular/src/app/shared/ui/inputs/web/custom-input-multiselect-signal.ts`). Su API usa
`[options]` en vez de `[data]` para los datos — no es un alias directo, revisa el componente
antes de usarlo. Agrega el import correspondiente en el `@Component({ imports: [...] })` del
`.ts`.

### 4. Corrige el mojibake existente

En los dos archivos que estás tocando, corrige (son caracteres corruptos, no texto nuevo):

- `.ts`: `"Mió"` → `"Mié"` (línea ~91), `"óltimo"` → `"Último"` (línea ~108), comentarios
  `"aquó"` → `"aquí"` (línea ~212 y donde vuelva a aparecer).
- `.html`: `"se repetiró"` → `"se repetirá"`, `"Dóa especófico"` → `"Día específico"`.

No corrijas mojibake en archivos que no estés tocando por otras razones de este ticket — no es
una limpieza general del repositorio.

## Convenciones aplicables

  respeta el archivo; sigue el mismo patrón para lo nuevo)
- Signals donde el archivo ya los usa; no introduzcas un paradigma distinto (por ejemplo, no
  cambies a RxJS puro donde hoy hay signals)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Estos comandos corren desde `client/angular/`, no desde la raíz del repositorio — confírmalo en
tu reporte si tu terminal ya estaba posicionado ahí o si tuviste que cambiar de directorio.

```bash
npm test -- recurrence-input
node ../../scripts/scan-mojibake.mjs src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/instances/recurrence-input
```

Si el segundo comando no encuentra el script en esa ruta relativa, ajústala y dilo en tu reporte
— no lo omitas.

Pega la salida literal de ambos.

## Criterio de PASO del ticket

Agrega tests (mismo estilo que los existentes en `recurrence-input.spec.ts`, mockeando el
template si hace falta, igual que ya hacen) que prueben:

1. Seleccionar los días 5 y 20 en modo "día específico del mes" produce
   `FREQ=MONTHLY;BYMONTHDAY=5,20`.
2. Seleccionar "último día del mes" produce `FREQ=MONTHLY;BYMONTHDAY=-1`, sin ningún valor de
   `monthDays` mezclado.
3. `parseRRule` con `"FREQ=MONTHLY;BYMONTHDAY=5,20"` reconstruye `monthDays` como `[5, 20]` y dejar `monthlyType` en `dayOfMonth`.
4. `parseRRule` con `"FREQ=MONTHLY;BYMONTHDAY=-1"` reconstruye `monthlyType` en `lastDayOfMonth`.

Los tests que ya existían siguen pasando (ajusta sólo los que dependían directamente de
`monthDay` como control singular).

## Reporte de finalización

1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los dos comandos de verificación, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
