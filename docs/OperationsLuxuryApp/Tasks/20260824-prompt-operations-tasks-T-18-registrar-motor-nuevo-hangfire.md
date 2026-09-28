# TICKET T-18 — Retirar el job parche y registrar el motor nuevo en Hangfire

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. **Prioridad alta:** corrige un defecto activo en producción.

## Contexto — lo que se descubrió

Investigando el arranque de T-15 se encontró que **el motor de tareas recurrentes de T-08 —
`RecurringTaskGenerationService`, revisado a fondo con 14 puntos de auditoría— nunca se ha
ejecutado en producción**. Nadie lo registró en Hangfire después de aprobarlo. Lo mismo aplica a
`TaskAlertEngineService` (T-09b) y `TaskEscalationService` (T-11): ambos aprobados, con tests, y
**sin ningún job que los dispare**.

Mientras tanto, hay un job que sí corre a diario y que nadie diseñó como solución final:

- **`RecurringTaskSchedulerJob`** (`api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskSchedulerJob.cs`),
  registrado con la clave `"generar-instancias-tareas-recurrentes-legado"`
  (`HangfireJobCatalog.cs:31`, cron `10 0 * * *`, activo desde el 2026-08-21). Pese al nombre
  "legado" en su clave y descripción, su código **sí opera sobre el esquema nuevo**
  (`RecurringTaskTemplate` → `Tasks`) — es un parche que T-03 tuvo que escribir sólo para que el
  build compilara al retirar los campos legados de la plantilla (ver su propia auditoría:
  "necesaria para compilar", nunca pensada como implementación definitiva). Comparado con
  `RecurringTaskGenerationService`, **le faltan**: `CustomerId` en las filas que crea
  (`RecurringTaskSchedulerJob.cs:45-58` — el objeto `Tasks` nuevo nunca asigna `CustomerId`),
  ajuste de festivos, resolución de responsable desde `WorkGroupMembers`
  (usa `template.AssigneeId` directo, que T-03 dejó opcional a propósito), folio vía
  `IGenerateFolioService` (arma `$"REC-{template.Id}-{fecha}"` a mano), e idempotencia real.

**No confundir con la clave `"generar-instancias-tareas-recurrentes"` (sin sufijo) →
`RecurringTaskGenerationJob` → `RecurringTaskGeneratorService`.** Esa es la que sí escribe en
`TaskInstance` (el motor legado de verdad, el de T-15). **Este ticket no la toca** — su retiro
depende del conteo de producción que pide T-15, un ticket aparte.

## Paso 0 — Guardia de datos, obligatoria antes de tocar código

El parche lleva corriendo desde el 2026-08-21. Conéctate a la base de datos de desarrollo y corre:

```sql
SELECT Status, COUNT(*) FROM TaskRecurringTemplates GROUP BY Status;
SELECT COUNT(*) FROM Task WHERE RecurringTemplateId IS NOT NULL AND CustomerId IS NULL;
```

Reporta ambos resultados literales **antes que nada más** en tu reporte de finalización.
**A diferencia de otras guardias de esta orquestación, esto NO detiene el ticket** — el código de
este ticket es correctivo (reemplaza un parche defectuoso por la implementación ya probada), así
que procede con los pasos 1-3 sin importar el resultado. Si la segunda consulta da un número
mayor a cero, sólo repórtalo con detalle — la limpieza de esas filas huérfanas (backfill de
`CustomerId` o borrado) es una decisión de negocio aparte, **no la hagas tú**, no inventes un
`UPDATE`/`DELETE` por tu cuenta.

## Paso 1 — Retirar `RecurringTaskSchedulerJob` de Hangfire

**No borres el archivo `RecurringTaskSchedulerJob.cs`** — sólo deja de registrarlo, por si hace
falta revertir. Tres archivos:

1. `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs`:
   - Quita la entrada `new("generar-instancias-tareas-recurrentes-legado", ...)` del arreglo `Jobs`
     (línea 31).
   - Quita el `case "generar-instancias-tareas-recurrentes-legado":` completo de `Schedule()`
     (líneas 103-105).
2. `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs:559`: quita
   `services.AddScoped<RecurringTaskSchedulerJob>();`.

## Paso 2 — Job classes nuevas para el motor real

Carpeta: `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/` (mismo
namespace `LuxuryApp.Application.Features.Jobs.Workers`, mismo patrón exacto que
`RecurringTaskGenerationJob.cs` — cópialo como plantilla de estilo: constructor primario,
`Stopwatch`, `try/catch` con `logger.LogError` + `throw`, sin capturar la excepción en silencio).

**`RecurringTaskGenerationEngineJob.cs`** — invoca `IRecurringTaskGenerationService.GenerateAsync()`.

**`TaskAlertEngineJob.cs`** — invoca `ITaskAlertEngineService.RunAsync()`.

**`TaskEscalationEngineJob.cs`** — invoca `ITaskEscalationService.RunAsync()`.

Las tres implementan `IJobService` (`Task ExecuteAsync()`), registran inicio/fin con
`ILogger<T>` igual que `RecurringTaskGenerationJob`, y **no atrapan la excepción sin relanzarla**
— Hangfire necesita verla para marcar el job como fallido y reintentar según su política.

## Paso 3 — Registrar los 3 jobs nuevos

`HangfireJobCatalog.cs`, agrega al arreglo `Jobs` (cerca de donde estaba la entrada retirada):

```csharp
new("generar-tareas-recurrentes-motor-nuevo", "Generar tareas recurrentes (motor nuevo)", "Genera instancias de Tasks desde RecurringTaskTemplate con el motor de T-08.", "0 0 * * *"),
new("motor-alertas-tareas-recurrentes", "Motor de alertas de tareas recurrentes", "Envia avisos previos, recordatorios y alertas de vencimiento.", "0 8 * * *"),
new("motor-escalacion-tareas-recurrentes", "Motor de escalacion de tareas recurrentes", "Escala tareas vencidas y marca incumplimiento formal.", "30 8 * * *"),
```

Y en `Schedule()`, tres `case` nuevos, mismo patrón que los existentes:

```csharp
case "generar-tareas-recurrentes-motor-nuevo":
    recurringJobManager.AddOrUpdate(jobKey, Job.FromExpression<RecurringTaskGenerationEngineJob>(service => service.ExecuteAsync()), cronExpression, options);
    return true;
case "motor-alertas-tareas-recurrentes":
    recurringJobManager.AddOrUpdate(jobKey, Job.FromExpression<TaskAlertEngineJob>(service => service.ExecuteAsync()), cronExpression, options);
    return true;
case "motor-escalacion-tareas-recurrentes":
    recurringJobManager.AddOrUpdate(jobKey, Job.FromExpression<TaskEscalationEngineJob>(service => service.ExecuteAsync()), cronExpression, options);
    return true;
```

**Los tres cron son un valor por omisión razonable, no una decisión cerrada de negocio** — el
generador a medianoche (mismo horario que ya usaba el job retirado), alertas a las 8:00 y
escalación a las 8:30, hora de México (`HangfireJobCatalog.DefaultTimeZoneId`). Dilo así en tu
reporte; si el dueño del módulo quiere otro horario, se ajusta después desde el propio catálogo.

`DependencyInjection.Controllers.cs`: agrega los tres `services.AddScoped<...>();` junto a la
línea que retiraste en el paso 1, mismo patrón (`RecurringTaskSchedulerJob` sí estaba registrado
explícitamente ahí; sigue esa convención, no la de `RecurringTaskGenerationJob`, que no lo estaba
— si al compilar ves que Hangfire resuelve la clase igual sin el registro explícito, dilo en el
reporte, pero de todas formas déjalo registrado por claridad y consistencia).

## Lo que NO debes hacer

- No toques la clave `"generar-instancias-tareas-recurrentes"` (sin sufijo), `RecurringTaskGenerationJob.cs`
  ni `RecurringTaskGeneratorService.cs` — es el motor legado real, territorio de T-15.
- No borres `RecurringTaskSchedulerJob.cs` — sólo deja de registrarlo (Paso 1).
- No hagas backfill ni borrado de las filas con `CustomerId` nulo que reporte la guardia del Paso
  0 — repórtalas, no las toques.
- No cambies `RecurringTaskGenerationService.cs`, `TaskAlertEngineService.cs` ni
  `TaskEscalationService.cs` — ya están aprobados, este ticket sólo los conecta.
- No apliques ninguna migración ni cambies el esquema — este ticket es exclusivamente de
  infraestructura de jobs.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 (backend .NET 10)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs
```

Pega la salida literal de los tres. Criterio: compila sin errores nuevos, `audit-conventions.mjs`
no aumenta de 10, mojibake en cero sobre lo tocado.

## Reporte de finalización

1. Resultado literal de las dos consultas del Paso 0 — primero que nada
2. Archivos tocados, con una línea de qué cambió en cada uno
3. Salida literal de los tres comandos de verificación
4. Decisiones que tomaste por tu cuenta y por qué
5. Lo que NO hiciste y el motivo
6. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
