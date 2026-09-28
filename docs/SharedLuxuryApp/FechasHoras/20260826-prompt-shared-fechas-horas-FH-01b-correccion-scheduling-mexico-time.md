# TICKET FH-01b — Corrección: 2 comparaciones de agendado deben usar hora de México, no UTC

Continuación de FH-01. El ticket anterior reemplazó `DateTime.Now` por `DateTime.UtcNow` en 13
puntos, incluyendo dos líneas de `CandidateProcessAppService.cs` que **no debían recibir ese
reemplazo**: introdujo una regresión real, no solo una imperfección.

## Qué pasó

`api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs`,
líneas 1258 y 2524, comparan un `scheduledDateTime`/`scheduledAt` construido así:

```csharp
var scheduledDateTime = request.ScheduledDate.Value.ToDateTime(request.ScheduledTime.Value);
```

`DateOnly.ToDateTime(TimeOnly)` produce un `DateTime` con `Kind = Unspecified` que contiene
exactamente lo que el reclutador capturó en el formulario — hora de pared de México, sin ninguna
conversión. FH-01 cambió la comparación de `DateTime.Now.AddMinutes(-30)` a
`DateTime.UtcNow.AddMinutes(-30)`. Eso es incorrecto: ahora se compara hora de pared de México
contra hora UTC, 6 horas desfasadas sin conversión — la regla "no se puede agendar una entrevista
con más de 30 minutos de antelación" queda mal en cualquier configuración de servidor.

Existe ya en el proyecto `LuxuryApp.Shared.Extensions.DateTimeExtension.GetMexicoTime()`, que
convierte `DateTime.UtcNow` a la zona horaria de Ciudad de México correctamente (con fallback
Windows/Linux). Es la función correcta para comparar contra un valor de hora de pared capturado del
usuario.

## Tarea

1. Verifica primero el estado real de las dos líneas (puede que el ejecutor de FH-01 ya las haya
   tocado, o que no haya llegado todavía — no asumas):
   ```bash
   grep -n "scheduledDateTime < DateTime\|scheduledAt.Value < DateTime" \
     api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs
   ```

2. Asegúrate de que el archivo tiene `using LuxuryApp.Shared.Extensions;` (revisa los `using` al
   inicio del archivo; si ya está, no lo dupliques).

3. Línea ~1258:
   ```csharp
   if (scheduledDateTime < DateTime.UtcNow.AddMinutes(-30))
   ```
   cámbiala a:
   ```csharp
   if (scheduledDateTime < DateTimeExtension.GetMexicoTime().AddMinutes(-30))
   ```

4. Línea ~2524:
   ```csharp
   if (scheduledAt.Value < DateTime.UtcNow.AddMinutes(-30))
   ```
   cámbiala a:
   ```csharp
   if (scheduledAt.Value < DateTimeExtension.GetMexicoTime().AddMinutes(-30))
   ```

## Lo que NO debes hacer

- No toques ningún otro `DateTime.UtcNow` de este archivo (los de `ClosedAt`, KPIs con
  `thirtyDaysAgo`/`sevenDaysAgo`, `HiringRequestedAt`, `SubmittedAt`, `ValidatedAt`, `ChangedAt`,
  etc. están bien: comparan contra campos que sí son UTC real).
- No cambies la firma de `EnsureInterviewSchedulingAllowedAsync` ni el tipo de `scheduledAt`.
- No agregues manejo de zona horaria en ningún otro archivo — este ticket es solo estas 2 líneas.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln

grep -n "DateTimeExtension.GetMexicoTime().AddMinutes(-30)" \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs
# Resultado esperado: 2 líneas (1258 y 2524)

grep -c "DateTime.UtcNow" \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs
# Resultado esperado: el mismo conteo que tenía el archivo tras FH-01, menos 2
```

## Criterio de PASO

- Las 2 líneas usan `DateTimeExtension.GetMexicoTime()`, no `DateTime.UtcNow`.
- Ningún otro `DateTime.UtcNow` del archivo fue tocado.
- `dotnet build` sin errores nuevos.

## Reporte de finalización

1. Estado en el que encontraste las 2 líneas al empezar (¿ya estaban en UtcNow por FH-01, o
   seguían en `DateTime.Now`?).
2. Diff exacto de las 2 líneas.
3. Salida literal de los 3 comandos de verificación.

No avances a FH-02. Espera la auditoría.
