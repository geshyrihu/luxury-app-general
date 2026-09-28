# TICKET FH-14 — Backend: `DateTime.Today` → `DateTimeExtension.GetMexicoDateOnly()` (15 archivos)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. No es continuación de FH-01/FH-02 — es un patrón nuevo, detectado
al auditar FH-02.

## Contexto

`DateTime.Today` es el mismo problema de fondo que `DateTime.Now` (corregido en FH-01): devuelve
la fecha según el reloj/zona horaria del **servidor**, no la fecha calendario de México. El grep
original del informe (`../../../docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`)
solo buscaba `DateTime\.Now\b` y no detectó este patrón — se encontró de paso al auditar FH-02.

El proyecto ya tiene la utilidad correcta: `LuxuryApp.Shared.Extensions.DateTimeExtension`:
- `GetMexicoDateOnly()` devuelve un `DateTime` a medianoche, en la fecha calendario de México
  (equivalente exacto a lo que `DateTime.Today` pretende hacer, pero con la zona horaria correcta).
- Se usa ya en ~40 archivos con el patrón `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`.

**Se leyeron los 27 puntos de este ticket uno por uno antes de escribir este prompt** (no es una
lista de grep sin verificar): todos alimentan cálculos de fecha de negocio — alta de empleado,
fecha de corte de cobranza, quincena de nómina, vencimiento de contrato, rango de agenda semanal.
Ninguno es un caso técnico donde la hora del servidor sea indiferente. Aun así, **si al tocar
alguno encuentras que en realidad no depende de "hoy calendario de México" (por ejemplo, algo que
compara contra otro valor ya en hora de servidor de forma consistente), detente en ese punto
específico y repórtalo en vez de aplicar el cambio a ciegas** — mismo criterio que evitó que FH-01
se aplicara mal en `CandidateProcessAppService.cs`.

## Regla general de reemplazo

- `DateOnly.FromDateTime(DateTime.Today)` → `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`
- `DateOnly.FromDateTime(DateTime.Today.AddDays(N))` → `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly().AddDays(N))`
- `DateTime.Today` usado directamente como `DateTime` (sin envolver en `DateOnly.FromDateTime`) →
  `DateTimeExtension.GetMexicoDateOnly()` directamente (ya devuelve `DateTime` a medianoche, es el
  reemplazo exacto, no hace falta `.Date` adicional).

En cada archivo, agrega `using LuxuryApp.Shared.Extensions;` si no lo tiene ya (revisa que no
choque con otro `using` de namespace corto ya presente, como pasó en `CandidateProcessAppService.cs`
durante FH-01b).

## Archivos y líneas

### 1. `CandidateProcessAppService.cs` (6 ocurrencias) — `Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/`
- 333: `requestPosition.EntryDate = DateOnly.FromDateTime(DateTime.Today);`
- 1092: `RegisterDate = dto.RegisterDate ?? DateOnly.FromDateTime(DateTime.Today),`
- 1129: `RegisterDate = dto.ApplicationDate ?? DateOnly.FromDateTime(DateTime.Today),`
- 1422: `if (dto.NewPresentationDate.Value < DateOnly.FromDateTime(DateTime.Today))`
- 2841: `ExecutionDate = process.HiredEntryDate ?? DateOnly.FromDateTime(DateTime.Today),`
- 3169: `process.RequestPosition.EntryDate = process.HiredEntryDate ?? DateOnly.FromDateTime(DateTime.Today);`

Este archivo **no tiene** `using LuxuryApp.Shared.Extensions;` (ya se agregó una vez en FH-01b para
otro fin — verifica que no quede duplicado).

### 2. `WorkPositionAppService.cs:103` — `Moduls/ReclutamientoLuxuryApp/WorkPosition/Services/`
```csharp
var yesterday = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));
```

### 3. `RecurringTaskSchedulerJob.cs:20` — `Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/`
```csharp
var today = DateOnly.FromDateTime(DateTime.Today);
```

### 4. `AspelCobranzaHausLocalDetalleAppService.cs:14` — `Moduls/CobranzaLuxuryApp/AspelCobranzaHausLocal/Services/`
```csharp
var fechaFin = DateOnly.FromDateTime(DateTime.Today);
```

### 5. `AspelCobranzaHausLocalAppService.cs:174` — `Moduls/CobranzaLuxuryApp/AspelCobranzaHausLocal/Services/`
```csharp
var fechaCorte = request.FechaCorte ?? DateOnly.FromDateTime(DateTime.Today);
```

### 6. `AspelCobranzaHausDetalleAppService.cs` (2 ocurrencias, mismo texto en 2 métodos distintos) — `Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/`
- 22: `var fechaFin = DateOnly.FromDateTime(DateTime.Today);`
- 46: `var fechaFin = DateOnly.FromDateTime(DateTime.Today);`

Este es el mismo archivo que FH-01 ya tocó (línea 243, `FechaCargo`) — no toques esa línea ni el
`TODO(FH-01)` que ya tiene.

### 7. `RecurringTaskGeneratorService.cs:78` — `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Services/`
```csharp
var today = DateTime.Today;
```
Reemplaza por `DateTimeExtension.GetMexicoDateOnly()` (mantiene el tipo `DateTime`, sigue
funcionando con `.Year` y `.AddDays(7)` en las líneas siguientes sin más cambios). Este es
exactamente el punto que FH-02 dejó explícitamente sin tocar para no mezclar ámbitos.

### 8. `RequestEmployeeRegisterAppService.cs` (5 ocurrencias) — `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/Services/`
- 882: `employee.DateAdmission = requestPosition.EntryDate ?? DateOnly.FromDateTime(DateTime.Today);`
- 895: `requestAlta.ExecutionDate ??= DateOnly.FromDateTime(DateTime.Today);`
- 901: `process.SelectedAt ??= DateOnly.FromDateTime(DateTime.Today);`
- 903: `process.HiredEntryDate = requestPosition.EntryDate ?? DateOnly.FromDateTime(DateTime.Today);`
- 1393: `?? DateOnly.FromDateTime(DateTime.Today);`

Este archivo ya usa `DateTimeExtension` en otros puntos (confirmado) — probablemente ya tiene el
`using`, solo confírmalo.

### 9. `TaskInstancesEndPoints.cs:19` — `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Endpoints/`
```csharp
var targetDate = date ?? DateTime.Today;
```
`date` es `DateTime?` (parámetro de query) y `targetDate` se pasa a
`taskInstanceAppService.GetForUserByDateAsync(userId, targetDate)`, que espera `DateTime` — no
cambies el tipo. Reemplaza a `date ?? DateTimeExtension.GetMexicoDateOnly()`.

### 10. `RecurringTaskGenerationService.cs:24` — `Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.Today);
```

### 11. `PersonalAusenteAppService.cs:17` — `Moduls/OperationsLuxuryApp/DireccionDashboard/PersonalAusente/Services/`
```csharp
var hoy = DateOnly.FromDateTime(DateTime.Today);
```

### 12. `ContratosLegalAppService.cs` (2 ocurrencias, mismo texto en 2 métodos) — `Moduls/OperationsLuxuryApp/DireccionDashboard/ContratosLegal/Services/`
- 11: `var hoy = DateOnly.FromDateTime(DateTime.Today);`
- 56: `var hoy = DateOnly.FromDateTime(DateTime.Today);`

### 13. `AgendaSemanalAppService.cs` (2 ocurrencias) — `Moduls/OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/Services/`
- 13: `var (inicio, fin) = CalcularDosSemanas(fechaReferencia ?? DateTime.Today);` — `fechaReferencia`
  es `DateTime?` (parámetro), reemplaza a `fechaReferencia ?? DateTimeExtension.GetMexicoDateOnly()`.
- 29: `var inicio = DateTime.Today;` — reemplaza directo a `DateTimeExtension.GetMexicoDateOnly()`
  (sigue usándose como `DateTime` en `.AddMonths(...)` de la línea siguiente, sin más cambios).

### 14. `EmployeeInternalAppService.cs:271` — `Moduls/RecursosHumanosLuxuryApp/Employee/Services/`
```csharp
var yesterday = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));
```

### 15. `PeriodoNominaAppService.cs:288` — `Moduls/RecursosHumanosLuxuryApp/Nomina/PeriodoNomina/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.Today);
```
**Este es el de mayor impacto del ticket**: `today.Day <= 15` (línea siguiente) decide si el
período de nómina actual es la primera o segunda quincena. Cerca de medianoche, con el bug
original, un servidor mal configurado podía calcular la quincena equivocada.

## Lo que NO debes hacer

- No toques ningún otro archivo de los 15 (no "aproveches el viaje" para tocar más ocurrencias que
  encuentres de paso — ya se cubrió el universo completo de `DateTime.Today` en `LuxuryApp.Application`).
- No toques la línea 243 ni el `TODO(FH-01)` de `AspelCobranzaHausDetalleAppService.cs` (son de
  FH-01, no de este ticket).
- No cambies el tipo de ningún parámetro ni de `targetDate`/`inicio`/`fin`/`hoy`/`yesterday`/`today`
  — todos mantienen el tipo que ya tenían (`DateTime` o `DateOnly` según el caso descrito arriba).
- Si encuentras algún punto de los 27 que, al leerlo, no depende de "hoy calendario de México",
  detente ahí específicamente y repórtalo — no lo cambies ni lo dejes sin decisión.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rln "DateTime\.Today\b" api/LuxuryApp.Application/ \
  | grep -v "AspelCobranzaHausLive/Docs\|RecurringTaskGeneratorService.cs"
# Resultado esperado tras el cambio: vacío, EXCEPTO que confirmes por separado que
# RecurringTaskGeneratorService.cs (línea 78, Tarea 7) también quedó en 0 — ese archivo se excluye
# del grep de arriba solo para no confundir con el `TODO` de documentación de Docs/, no porque
# quede sin tocar.

grep -c "DateTime\.Today\b" api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Services/RecurringTaskGeneratorService.cs
# Resultado esperado: 0

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- 0 ocurrencias de `DateTime.Today` en código de `LuxuryApp.Application` (el único match permitido
  es el texto descriptivo en `AspelCobranzaHausLive/Docs/documentacion-endpoints-aspel-cobranza.md`,
  que es documentación, no código — no lo toques, describe el comportamiento previo a este ticket;
  si quieres, puedes actualizar esa nota para reflejar el cambio, pero no es obligatorio).
- `dotnet build` sin errores nuevos.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline conocido (10
  errores / 68 ocurrencias a la fecha de este ticket — confírmalo, no lo asumas).
- Exactamente los 15 archivos listados fueron modificados, ninguno más.

## Reporte de finalización

1. Diff exacto de los 15 archivos (las 27 líneas cambiadas).
2. Si encontraste algún punto que no encajaba con "hoy calendario de México" y lo dejaste sin
   tocar, cuál fue y por qué.
3. Salida literal de los 4 comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
