# TICKET FH-2Xa — Frontend: tipado estricto de DTOs (`Date | string` → `string`) en `cobranza.luxuryapp`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Este es el primer ticket de
la Fase FH-2X+ (tipado estricto de DTOs), posterior a la Fase 4 (migración de `apiDate`, ya
completa). Cubre **7 archivos de interfaces** en `cobranza.luxuryapp/cobranza-nativa/interfaces/`
y su duplicado en `contracts/external-compatibility/interfaces/` — todos con campos de fecha
tipados como `Date | string` (o `string | Date`), cuando en realidad **nunca reciben un `Date`
real**: los datos que llegan del API son siempre JSON (por tanto `string`), y los formularios que
construyen los DTOs de request (`Create*DTO`/`Update*DTO`) ya convierten explícitamente el valor
del `FormControl<Date>` a `string` vía `this.dateS.getDateFormat(...)` antes de armar el payload
(verificado en `charge-form.ts`, `payment-form.ts`, `payments.ts`, `charge-template-form.ts`).

**El objetivo es que TypeScript deje de aceptar silenciosamente un `Date` sin formatear** — si
después de este cambio queda algún error de compilación en un archivo no listado aquí, es una
señal real de un lugar que está pasando un `Date` sin convertir (repórtalo, no fuerces el tipo de
vuelta a `Date | string` para "arreglarlo").

## Tarea 1 — `interfaces/charge.dto.ts`

Cambia en `ChargeResponseDTO`, `CreateChargeDTO` y `UpdateChargeDTO` (los 3 tienen los mismos 4
campos):
- `dueDate: Date | string;` → `dueDate: string;`
- `periodStart?: Date | string | null;` → `periodStart?: string | null;`
- `periodEnd?: Date | string | null;` → `periodEnd?: string | null;`
- `discountDeadline?: Date | string | null;` → `discountDeadline?: string | null;`

Y en `SetInitialBalanceItemDTO`:
- `dueDate?: Date | string | null;` → `dueDate?: string | null;`

## Tarea 2 — `interfaces/cobranza-payment.dto.ts`

- `CobranzaPaymentResponseDTO.paymentDate: Date | string;` → `paymentDate: string;`
- `CobranzaPaymentAllocationDetailDTO.appliedAt: string | Date;` → `appliedAt: string;`
- `CreateCobranzaPaymentDTO.paymentDate: Date | string;` → `paymentDate: string;`
- `UpdateCobranzaPaymentDTO.paymentDate: Date | string;` → `paymentDate: string;`

## Tarea 3 — `interfaces/native-statement.dto.ts`

- `LedgerEntryDTO.date: Date | string;` → `date: string;`

## Tarea 4 — `interfaces/charge-allocation.dto.ts`

En `PendingChargeDTO`:
- `dueDate: string | Date;` → `dueDate: string;`
- `periodStart?: string | Date;` → `periodStart?: string;`
- `periodEnd?: string | Date;` → `periodEnd?: string;`
- `discountDeadline?: string | Date;` → `discountDeadline?: string;`

## Tarea 5 — `interfaces/charge-template.dto.ts`

`ChargeTemplateResponseDTO` **ya está correcto** (usa `string`/`string | null`) — no lo toques.

En `CreateChargeTemplateDTO` y `UpdateChargeTemplateDTO` (mismos 3 campos en ambos):
- `startDate: string | Date;` → `startDate: string;`
- `endDate?: string | Date | null;` → `endDate?: string | null;`
- `retroactiveStartDate?: string | Date | null;` → `retroactiveStartDate?: string | null;`

## Tarea 6 — `contracts/external-compatibility/interfaces/charge.dto.ts`

Duplicado casi idéntico de la Tarea 1 (mismas interfaces `ChargeResponseDTO`, `CreateChargeDTO`,
`UpdateChargeDTO`, `SetInitialBalanceItemDTO`, con un import relativo distinto) — aplica los
mismos cambios de tipo.

## Tarea 7 — `contracts/external-compatibility/interfaces/cobranza-payment.dto.ts`

Duplicado casi idéntico de la Tarea 2 (mismas interfaces) — aplica los mismos cambios de tipo.

## Lo que NO debes hacer

- No toques ningún `FormControl<...>` ni la lógica de los formularios (`charge-form.ts`,
  `payment-form.ts`, `payments.ts`, `charge-template-form.ts`) — ya hacen la conversión correcta
  con `dateS.getDateFormat(...)`. Si el build falla en alguno de estos archivos después de tu
  cambio, repórtalo en detalle en vez de tocarlo por tu cuenta.
- No toques `ChargeTemplateResponseDTO` (Tarea 5) — ya está bien tipado.
- No toques ningún otro archivo `.dto.ts` fuera de los 7 listados — el resto de módulos
  (`recursos-humanos.luxuryapp`, `operations.luxuryapp`, etc.) son tickets aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.

## Verificación obligatoria

```bash
cd client/angular
grep -n "Date | string\|string | Date" \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/interfaces/charge.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/interfaces/cobranza-payment.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/interfaces/native-statement.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/interfaces/charge-allocation.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/interfaces/charge-template.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/contracts/external-compatibility/interfaces/charge.dto.ts \
  src/app/apps/cobranza.luxuryapp/cobranza-nativa/contracts/external-compatibility/interfaces/cobranza-payment.dto.ts
# Resultado esperado: 0 líneas (ningún campo con unión Date|string restante)

npx tsc --noEmit -p tsconfig.json 2>&1 | tail -n 80
# Revisa la salida completa: cualquier error de tipo es una señal real de un lugar sin convertir.

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Los 7 archivos con los campos narrowed a `string`/`string | null` (sin `Date`).
- `ChargeTemplateResponseDTO` sin tocar.
- `ng build` sin errores nuevos. Si aparece algún error de tipo en un archivo no listado aquí, NO
  lo arregles tú mismo — repórtalo con el mensaje completo de TypeScript, el archivo y la línea,
  para que se evalúe si el fix correcto es agregar `dateS.getDateFormat(...)` en el call site.

## Reporte de finalización

1. Diff exacto de los 7 archivos.
2. Salida literal del grep de verificación y de `ng build` (o `tsc --noEmit` si lo corriste
   aparte).
3. Si hubo algún error de compilación inesperado: archivo, línea, mensaje completo, y tu
   diagnóstico de si es un caso legítimo de `Date` sin convertir.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
