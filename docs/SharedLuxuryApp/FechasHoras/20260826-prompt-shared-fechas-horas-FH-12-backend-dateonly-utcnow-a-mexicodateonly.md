# TICKET FH-12 — Backend: `DateOnly.FromDateTime(DateTime.UtcNow)` → `DateTimeExtension.GetMexicoDateOnly()` (25 archivos)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas...", agregada en FH-03). No es continuación de FH-01/02/03/14, aunque usa
exactamente la misma utilidad.

## Contexto

El informe original (`../../../docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`)
estimó "~90 archivos" con este patrón y lo marcó como "✅ OK" — **era un error de esa auditoría**.
`DateOnly.FromDateTime(DateTime.UtcNow)` da el día calendario **UTC**, no el día calendario de
**México**: son distintos durante las 18:00–23:59 hora de México todos los días (6 horas diarias).
Es la misma familia de bug que `DateTime.Now`/`DateTime.Today` (ya corregidos en FH-01/FH-14), solo
que invisible porque usa `UtcNow` y a primera vista "parece" el patrón correcto.

**El conteo real, verificado con grep sobre el código actual (no la estimación original), es 25
archivos / 35 ocurrencias** — no ~90. La diferencia es porque el barrido original contaba archivos
que tenían el patrón en algún punto Y `DateTime.UtcNow` en otro punto no relacionado, sin exigir que
fuera la misma expresión exacta.

**Se leyeron las 35 ocurrencias una por una antes de escribir este prompt** (no es una lista de
grep sin verificar): todas pueblan un campo o variable que representa el día calendario de negocio
en México — vencimiento de contrato/inspección, antigüedad de vacaciones, mora, cartera vencida,
alta de miembro de propiedad, fecha de firma, fecha de resolución de incidente, etc. Ninguna es un
caso técnico donde el día UTC sea indiferente o deliberadamente correcto. Aun así, **si al tocar
alguna encuentras que en realidad no depende del día calendario de México (por ejemplo, se compara
consistentemente contra otro valor que también es UTC por diseño), detente en ese punto específico
y repórtalo en vez de aplicar el cambio a ciegas**.

## Regla de reemplazo

`DateOnly.FromDateTime(DateTime.UtcNow)` → `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`

En cada archivo, agrega `using LuxuryApp.Shared.Extensions;` si no lo tiene ya.

## Archivos y líneas (25 archivos, 35 ocurrencias)

### 1. `UpdateDataBaseService.cs:410` — `Moduls/AdminLuxuryApp/Infraestructura/UpdateDataBase/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 2. `FireInspectionCycleGenerationJob.cs:28` — `Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 3. `EquipmentQrLabelAppService.cs:251` — `Moduls/MantenimientoLuxuryApp/EquipmentInspections/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 4. `EquipmentInspectionExecutionAppService.cs` (3 ocurrencias) — `Moduls/MantenimientoLuxuryApp/EquipmentInspections/Services/`
- 27: `await GeneratePendingExecutionsAsync(customerId, DateOnly.FromDateTime(DateTime.UtcNow));`
- 380: `var today = DateOnly.FromDateTime(DateTime.UtcNow);`
- 459: `return definitions.FirstOrDefault(x => ShouldGenerateForDate(x, DateOnly.FromDateTime(DateTime.UtcNow)));`

### 5. `WorkContractAppService.cs:260` — `Moduls/RecursosHumanosLuxuryApp/Contratos/ContractWork/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 6. `FireInspectionCycleAppService.cs` (2 ocurrencias) — `Moduls/MantenimientoLuxuryApp/FireInspectionPeriods/Services/`
- 151: `var today = DateOnly.FromDateTime(DateTime.UtcNow);`
- 250: `var today = DateOnly.FromDateTime(DateTime.UtcNow);`

### 7. `VacationHelperService.cs` (2 ocurrencias) — `Moduls/RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Services/`
- 105: `=> await GetBalanceRealTimeAsync(userId, DateOnly.FromDateTime(DateTime.UtcNow));`
- 225: `var actualToday = DateOnly.FromDateTime(DateTime.UtcNow);`

### 8. `PaymentAllocationService.cs:27` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```
Ya usa `DateTimeExtension` en otros puntos — confirma que no falta el `using`.

### 9. `ManualPasoDTO.cs:191` — `Moduls/RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs/`
```csharp
public DateOnly FechaCambio { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
```
Es el mismo punto que FH-01 corrigió de `DateTime.Now` a `DateTime.UtcNow` — esta es la siguiente
corrección de ese mismo campo, no un archivo nuevo sin relación.

### 10. `AprobacionVacacionesService.cs:354` — `Moduls/RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/Services/`
```csharp
referenceDate = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 11. `NotificationEngineService.cs:19` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 12. `ContractAddendumAppService.cs:212` — `Moduls/RecursosHumanosLuxuryApp/Contratos/ContractAddendum/Services/`
```csharp
addendum.SignedDate = dto.SignedDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
```

### 13. `SolicitudVacacionesService.cs:392` — `Moduls/RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Services/`
```csharp
referenceDate = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 14. `CobranzaMetricasService.cs:27` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Metrics/Services/`
```csharp
var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 15. `IncidentAppService.cs:299` — `Moduls/RecursosHumanosLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/`
```csharp
incident.ResolutionDate = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 16. `PropertyMemberService.cs` (7 ocurrencias — el archivo con más del ticket) — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Members/Services/`
- 26: `var today = DateOnly.FromDateTime(DateTime.UtcNow);`
- 59: `var today = DateOnly.FromDateTime(DateTime.UtcNow);`
- 100: `MapToDTO(member, DateOnly.FromDateTime(DateTime.UtcNow)));`
- 297: `MapToDTO(created, DateOnly.FromDateTime(DateTime.UtcNow)));`
- 379: `MapToDTO(created, DateOnly.FromDateTime(DateTime.UtcNow)));`
- 426: `MapToDTO(member, DateOnly.FromDateTime(DateTime.UtcNow)));`
- 559: `: DateOnly.FromDateTime(DateTime.UtcNow),` (dentro de un operador ternario, rama `else` de
  `StartDate` — no toques la rama `?` que usa `DateOnly.FromDateTime(owner.StartDate.Value)`, esa
  ya es correcta y no depende de "hoy").

### 17. `LateFeePolicyAppService.cs:82` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Services/`
```csharp
StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
```

### 18. `LateFeeCalculatorService.cs:30` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 19. `FinancialReportAppService.cs:29` — `Moduls/ContabilidadLuxuryApp/FinancialAccounting/Services/`
```csharp
DateOnly fechaActual = DateOnly.FromDateTime(DateTime.UtcNow);
```
Ya usa `DateTimeExtension` en otros puntos — confirma que no falta el `using`.

### 20. `ChargesGeneratorService.cs:253` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Services/`
```csharp
DueDate = DateOnly.FromDateTime(DateTime.UtcNow), // Vence inmediatamente
```
Conserva el comentario `// Vence inmediatamente` tal cual.

### 21. `CollectionManagerService.cs:13` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Services/`
```csharp
var today = DateOnly.FromDateTime(DateTime.UtcNow);
```

### 22. `ChargeAppService.cs:420` — `Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Services/`
```csharp
var dueDate = item.DueDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
```
Ya usa `DateTimeExtension` en otros puntos — confirma que no falta el `using`.

### 23. `AspelCobranzaHausAppService.cs:277` — `Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/`
```csharp
var fechaCorte = request.FechaCorte ?? DateOnly.FromDateTime(DateTime.UtcNow);
```
Es el mismo punto que FH-01 corrigió de `DateTime.Now` a `DateTime.UtcNow` — siguiente corrección
del mismo campo `fechaCorte`, no un hallazgo nuevo sin relación.

### 24. `CandidateNotificationCoordinatorService.cs:604` — `Moduls/ReclutamientoLuxuryApp/Notifications/Services/`
```csharp
ApplicationDate = approvedProcess?.RegisterDate ?? DateOnly.FromDateTime(DateTime.UtcNow),
```

### 25. `OwnerAppService.cs:98` — `Moduls/OperationsLuxuryApp/Owner/Services/`
```csharp
StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
```

## Lo que NO debes hacer

- No toques ningún otro archivo fuera de los 25 listados.
- No toques la rama `?` del operador ternario en `PropertyMemberService.cs:558`
  (`DateOnly.FromDateTime(owner.StartDate.Value)`) — solo la rama `:` en la línea 559.
- No cambies ningún `DateTime.UtcNow` que no esté envuelto en `DateOnly.FromDateTime(...)` — no es
  el patrón de este ticket.
- Si encuentras algún punto de los 35 que, al leerlo con más contexto del que tenías en el prompt,
  no depende del día calendario de México, detente ahí específicamente y repórtalo — no lo cambies.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rc "DateOnly\.FromDateTime(DateTime\.UtcNow)" api/LuxuryApp.Application/ --include="*.cs" \
  | grep -v ":0$"
# Resultado esperado: vacío (0 archivos con el patrón restante)

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- 0 ocurrencias de `DateOnly.FromDateTime(DateTime.UtcNow)` en `LuxuryApp.Application`.
- `dotnet build` sin errores nuevos.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 errores / 68
  ocurrencias a la fecha de este ticket — confírmalo, no lo asumas).
- Exactamente los 25 archivos listados fueron modificados, ninguno más.

## Reporte de finalización

1. Diff exacto de los 25 archivos (las 35 líneas cambiadas).
2. Si encontraste algún punto que no encajaba con "día calendario de México" y lo dejaste sin
   tocar, cuál fue y por qué.
3. Salida literal de los 4 comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
