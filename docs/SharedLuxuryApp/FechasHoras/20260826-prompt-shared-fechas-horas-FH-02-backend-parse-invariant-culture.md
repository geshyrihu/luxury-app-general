# TICKET FH-02 — Backend: `.Parse(` sin cultura → `.ParseExact(..., InvariantCulture)`

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket toca 5 archivos (8 llamadas a `.Parse(` en total) —
sin relación entre sí salvo el mismo patrón de riesgo. No es continuación de FH-01/FH-01b/FH-01c.

## Contexto

El informe `docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`
(sección 2.2) confirmó 8 llamadas a `DateOnly.Parse(`/`DateTime.Parse(` sin `CultureInfo`
explícito. Sin cultura invariante, el parseo depende de la cultura del hilo de ASP.NET Core en el
momento de la petición — normalmente invariant por defecto, pero no garantizado si en algún punto
se configura `RequestLocalization`. El patrón correcto ya existe en el propio proyecto
(`FundingAppService.cs`/`FundingMapper.cs`): `DateTime.ParseExact(valor, "yyyy-MM-dd",
CultureInfo.InvariantCulture)`.

**Antes de escribir el prompt se verificó, para cada uno de los 5 archivos, si el string de origen
representa un día calendario (sin ambigüedad de zona horaria) o un instante que además necesitaría
`DateTimeExtension.GetMexicoTime()` en vez de una hora arbitraria** — la misma pregunta que causó
la regresión de FH-01b. Resultado: 4 de los 5 son solo `DateOnly` (sin husos horarios posibles); el
quinto (`FundingAppService.cs:730`) sí tiene una nota adicional, ver Tarea 5.

## Tarea 1 — `VacationRequestApprovalEndPoints.cs:53`

```csharp
DateOnly.Parse(startDate), DateOnly.Parse(endDate)
```

`startDate`/`endDate` llegan como `[FromQuery] string` desde el frontend, que los construye con
`DateService.getDateFormat()` (Angular) — formato `"yyyy-MM-dd"` confirmado. Cambia a:

```csharp
DateOnly.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
DateOnly.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture)
```

Agrega `using System.Globalization;` si el archivo no lo tiene ya.

## Tarea 2 — `LeaveRequestApprovalEndPoints.cs:45`

Mismo patrón, mismos nombres de parámetro (`startDate`/`endDate`), mismo origen frontend. Aplica
el mismo cambio que la Tarea 1.

## Tarea 3 — `RequestSalaryModificationAppService.cs:58`

```csharp
ExecutionDate = DateOnly.Parse(DTO.ExecutionDate),
```

`DTO` es `GetDataForModificacionSalarioDTO`, cuyo `ExecutionDate` es `string`. Confirmado en el
frontend (`solicitud-modificacion-salario-form.ts:322`): se construye con
`this.dateS.getDateFormat(formValue.executionDate as Date)` — mismo formato `"yyyy-MM-dd"`. Cambia
a:

```csharp
ExecutionDate = DateOnly.ParseExact(DTO.ExecutionDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
```

## Tarea 4 — `RecurringTaskGeneratorService.cs:82,88`

```csharp
.Select(h => DateTime.Parse(h.Start).Date).ToHashSet();
```

(dos apariciones idénticas, líneas 82 y 88). `h.Start` viene de `IHolidayService.GetMexicanHolidaysAsync`
(`api/LuxuryApp.Shared/Services/IHolidayService.cs`), que siempre lo construye con
`.ToString("yyyy-MM-dd")` — confirmado leyendo la implementación completa, sin excepción en
ninguno de los 8 festivos que genera. Cambia ambas apariciones a:

```csharp
.Select(h => DateOnly.ParseExact(h.Start, "yyyy-MM-dd", CultureInfo.InvariantCulture)).ToHashSet();
```

Esto cambia el tipo del `HashSet` resultante de `HashSet<DateTime>` a `HashSet<DateOnly>` — sigue
la variable `holidays` (declarada `new HashSet<DateTime>()` unas líneas antes, línea ~80) y
cualquier comparación posterior contra `holidays` en el resto del método/clase, ajustando esos
puntos para comparar contra `DateOnly` en vez de `DateTime` (probablemente vía `.Date` sobre algún
`DateTime` de negocio — usa `DateOnly.FromDateTime(...)` ahí, no cambies la fuente de ese otro
valor).

**No toques `var today = DateTime.Today;` (línea ~77) en este ticket** — es un patrón distinto
(`DateTime.Today`, no `.Parse(`) que se detectó de paso al revisar este archivo y que se audita
por separado (ver `docs/plans/20260826-fechas-horas-orquestacion.md`, ticket FH-14). Si al cambiar
`holidays` a `HashSet<DateOnly>` el compilador te obliga a tocar la línea de `today` para que el
código siga compilando (por ejemplo, en una comparación `holidays.Contains(...)`), hazlo de la
forma mínima que compile (ej. `DateOnly.FromDateTime(today)`) sin cambiar `DateTime.Today` en sí, y
repórtalo explícitamente en el reporte de finalización.

## Tarea 5 — `FundingAppService.cs:730`

```csharp
result.InvoiceDate = DateTime.Parse(comprobante?.Attribute("Fecha")?.Value ?? DateTime.UtcNow.ToString());
```

Esto parsea el atributo `Fecha` de un CFDI (factura fiscal mexicana), dentro de
`ContabilidadLuxuryApp/Fondeos/Services/FundingAppService.cs`. Dos problemas, no uno:

1. **Cultura**: mismo riesgo que el resto del ticket — sin `InvariantCulture`, el parseo depende
   del hilo.
2. **El fallback usa la función equivocada**: `Fecha` en un CFDI (esquema SAT `tdCFDI:t_FechaH`) es
   una hora **local del emisor** en formato `AAAA-MM-DDThh:mm:ss`, sin offset de zona horaria — es
   decir, es del mismo tipo de valor que causó la regresión de FH-01b: un "ahora" de negocio en
   México, no un instante UTC. El fallback actual (`DateTime.UtcNow.ToString()`) usa la función
   equivocada por la misma razón que `DateTime.Now` estaba mal en FH-01, solo que en dirección
   opuesta.

**Antes de aplicar el cambio, verifica el formato real** — busca si hay algún XML de CFDI de
muestra en `api/LuxuryApp.Tests/` (fixtures de prueba) y confirma que el atributo `Fecha` sigue el
patrón `AAAA-MM-DDThh:mm:ss` sin milisegundos ni offset. Si encuentras una muestra real con un
formato distinto, usa ese formato en el `ParseExact` y repórtalo — no asumas el formato estándar de
SAT sin verificarlo contra algo real si hay una muestra disponible.

Cambia a:

```csharp
result.InvoiceDate = DateTime.ParseExact(
    comprobante?.Attribute("Fecha")?.Value ?? DateTimeExtension.GetMexicoTime().ToString("yyyy-MM-ddTHH:mm:ss"),
    "yyyy-MM-ddTHH:mm:ss",
    CultureInfo.InvariantCulture);
```

Agrega `using LuxuryApp.Shared.Extensions;` si el archivo no lo tiene ya (revisa que no choque con
otro `using` del mismo namespace corto).

## Lo que NO debes hacer

- No toques el archivo `FundingMapper.cs` ni ningún otro `.ParseExact(` que ya esté correcto — son
  la referencia, no el objetivo.
- No toques `DateTime.Today` en `RecurringTaskGeneratorService.cs` salvo el ajuste mínimo de
  compilación descrito en la Tarea 4, y repórtalo si lo hiciste.
- No cambies el tipo de ningún DTO (`GetDataForModificacionSalarioDTO.ExecutionDate` sigue siendo
  `string`; el ajuste es solo en cómo se parsea dentro del servicio).
- No agregues manejo de zona horaria adicional en `VacationRequestApprovalEndPoints.cs`,
  `LeaveRequestApprovalEndPoints.cs` ni `RequestSalaryModificationAppService.cs` — son `DateOnly`
  puro, sin ambigüedad de huso horario, no necesitan `DateTimeExtension`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "DateOnly\.Parse(\|DateTime\.Parse(" \
  api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs \
  api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/SalaryModification/Services/RequestSalaryModificationAppService.cs \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Services/RecurringTaskGeneratorService.cs \
  api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/Fondeos/Services/FundingAppService.cs
# Resultado esperado: 0 líneas (todas deben quedar como .ParseExact(...))

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- `dotnet build` sin errores nuevos (usa `-o .tmp-audit-build` si el build normal falla por
  bloqueo de archivos del proceso de desarrollo corriendo — es un problema conocido, no de tu
  código; bórralo al terminar).
- El grep del paso 2 devuelve 0 líneas.
- `audit-conventions.mjs` no sube respecto al baseline (10 errores conocidos a la fecha de este
  ticket — repórtalo si es distinto, no lo asumas).
- Ningún archivo fuera de los 5 listados fue modificado.

## Reporte de finalización

1. Diff exacto de los 5 archivos (las 8 líneas cambiadas, no un resumen).
2. Qué encontraste al verificar el formato real de `Fecha` en CFDI (Tarea 5) — muestra real
   encontrada o no, y qué formato usaste.
3. Si tocaste la línea de `DateTime.Today` en la Tarea 4 por necesidad de compilación, qué cambio
   exacto hiciste ahí.
4. Salida literal de los 4 comandos de verificación.
5. Decisiones que tomaste por tu cuenta y por qué.

No avances a FH-03. Espera la auditoría.
