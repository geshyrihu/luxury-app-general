# TICKET FH-01 — Backend: `DateTime.Now` → `DateTime.UtcNow` (13 archivos confirmados)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket es **solo el reemplazo mecánico** de `DateTime.Now`
por `DateTime.UtcNow` en los puntos ya confirmados por auditoría — no toca lógica de negocio, no
renombra nada, no toca entidades ni migraciones.

## Contexto

El informe `docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`
(sección 2.2) confirmó, leyendo el código real (no solo grep), que estos 13 archivos usan
`DateTime.Now` (hora local del **servidor**) donde el resto del proyecto usa `DateTime.UtcNow` de
forma consistente. Esto es un riesgo real: si el servidor no está configurado en UTC, o si migra a
un servidor con otra zona horaria, estos puntos generan desfases de horas en comparaciones de
negocio, cortes de fecha y timestamps — sin ningún error visible, el cálculo simplemente sale mal.

`ApplicationDbContext.SaveChangesAsync` ya usa `DateTime.UtcNow` correctamente para los campos
`IAuditable` (no forma parte de este ticket, es la referencia de qué patrón seguir).

## Tarea — reemplazar en los 13 archivos

Para cada archivo, cambia **únicamente** las ocurrencias de `DateTime.Now` por `DateTime.UtcNow`
en las líneas indicadas. No toques ninguna otra línea del archivo.

1. `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs:243`
   `FechaCargo = DateTime.Now.ToString("dd/MM/yyyy"), // Usamos la fecha de emisión o actual`

2. `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausAppService.cs:277`
   `var fechaCorte = request.FechaCorte ?? DateOnly.FromDateTime(DateTime.Now);`

3. `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SystemTenant/Notification/Services/NotificationUserAppService.cs:117-118`
   `var readCutoff = DateTime.Now.AddDays(-readDays);` / `var unreadCutoff = DateTime.Now.AddDays(-unreadDays);`

4. `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs`
   Líneas **265, 790, 994, 1638, 1912** (5 ocurrencias en este archivo). Nota: en este mismo archivo
   `LastErrorAt` ya usa `DateTime.UtcNow` correctamente (líneas 1270, 1914) — no las toques, ya
   están bien; el ticket es sobre las 5 líneas de `DateTime.Now`.

5. `api/LuxuryApp.Application/Moduls/CommitteeLuxuryApp/Services/CommitteeCobranzaAppService.cs:20-21,65`
   `int year = request.Year ?? DateTime.Now.Year;` / `int month = request.Month ?? DateTime.Now.Month;`
   / `FechaCorte = dashboard.SyncMetadata?.LastSyncAt?.ToString(...) ?? DateTime.Now.ToString("dd/MM/yyyy HH:mm"),`

6. `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/ContabilidadOnline/Services/ProyectosAprobadosService.cs:42-43`
   `int currentMonth = DateTime.Now.Month;` / `int currentYear = DateTime.Now.Year;`

7. `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/DynamicReports/Services/ReportPdfExportService.cs:35`
   `col.Item().Text($"Generado: {DateTime.Now.ToString("dd/MM/yyyy HH:mm", EsMx)}")`

8. `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/DatabaseBackupJob.cs:70`
   `var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");`

9. `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/AspelMigrationSchedulerJob.cs:31`
   `var yearTo = DateTime.Now.Year;`

10. `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs/ManualPasoDTO.cs:191`
    `public DateOnly FechaCambio { get; set; } = DateOnly.FromDateTime(DateTime.Now);`

11. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateApplication/Services/CandidateAutomationService.cs:15`
    `var now = DateTime.Now;`

12. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs`
    Líneas **22, 650, 679, 708, 757, 815, 1258, 1770, 2524** (9 ocurrencias en este archivo — es el
    de mayor concentración). Incluye `if (scheduledDateTime < DateTime.Now.AddMinutes(-30))` (líneas
    1258 y 2524, la misma regla de negocio repetida dos veces).

13. `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/AccessControl/Services/AccessScanService.cs:74`
    `!IsRecurrenceSatisfied(credential.RecurrenceRule, DateTime.Now))`

## Marca los 4 puntos donde el valor se muestra directamente a un humano

En 4 de los 13 puntos, el valor de `DateTime.Now` no solo se usa en lógica interna: se formatea y
se entrega **tal cual** como texto que un humano lee (un PDF, un mensaje de estado), sin que ningún
otro paso vuelva a convertir la hora a la zona horaria del sitio antes de mostrarla. Cambiar a
`DateTime.UtcNow` sigue siendo la corrección correcta (elimina la dependencia de la zona horaria
del servidor), pero el texto que verá el usuario pasará de mostrar la hora local del servidor a
mostrar la hora UTC — sin que el frontend o el generador de PDF sepan que ahora es UTC.

Para estos 4 puntos, además del reemplazo, agrega un comentario `// TODO(FH-01): ...` en la línea
inmediatamente anterior indicando que el texto ahora muestra hora UTC y que falta decidir si debe
convertirse a la hora local del sitio antes de formatear (fuera del alcance de este ticket — es una
decisión de producto, no técnica):

- Punto 1 (`AspelCobranzaHausDetalleAppService.cs:243`) — `FechaCargo` es un valor de negocio, no
  solo texto de UI; el TODO debe decir explícitamente que además de la hora, revisar si el *día*
  correcto para "FechaCargo" es el día UTC o el día calendario del sitio.
- Punto 5 (`CommitteeCobranzaAppService.cs:65`) — el fallback de `FechaCorte` mostrado al comité.
- Punto 7 (`ReportPdfExportService.cs:35`) — el pie de página "Generado: ..." del PDF.
- Los 5 puntos de `CobranzaOnlineDashboardAppService.cs` que arman el texto `SyncMessage` (líneas
  790, 994, 1638, 1912 — no la 265, que es un cálculo interno de `lastDay`/`selectedDay`, no texto
  mostrado) — un solo TODO por archivo basta si las líneas quedan juntas en el diff.

No conviertas tú mismo estos 4 puntos a hora local del sitio ni agregues `TimeZoneInfo` — eso
requeriría decidir cuál es "la zona horaria del sitio" (¿por tenant? ¿fija a México?) y no es una
decisión que te corresponda tomar en este ticket.

## Lo que NO debes hacer

- No toques `AplicarCamposAuditoria()` en `ApplicationDbContext.cs` — ya está correcto, es la
  referencia, no el objetivo.
- No toques ningún `DateTime.UtcNow` existente.
- No toques `.Parse(`/`.ParseExact(` — es el ticket FH-02, no este.
- No renombres variables, no reformatees líneas que no cambian, no "de paso" arregles otra cosa que
  veas en estos archivos aunque te parezca relacionado — repórtalo en el reporte de finalización en
  vez de tocarlo.
- No agregues manejo de zona horaria (`TimeZoneInfo`, conversión a hora local) en ningún punto —
  eso es explícitamente lo que los 4 TODO dejan pendiente para un ticket futuro con decisión de
  producto.

## Verificación obligatoria

```bash
# 1) Build completo
dotnet build api/LuxuryApp.sln

# 2) Cero DateTime.Now restantes en los 13 archivos (excepto dentro de comentarios TODO)
grep -rn "DateTime\.Now\b" \
  api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs \
  api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausAppService.cs \
  api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SystemTenant/Notification/Services/NotificationUserAppService.cs \
  api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs \
  api/LuxuryApp.Application/Moduls/CommitteeLuxuryApp/Services/CommitteeCobranzaAppService.cs \
  api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/ContabilidadOnline/Services/ProyectosAprobadosService.cs \
  api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/DynamicReports/Services/ReportPdfExportService.cs \
  api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/DatabaseBackupJob.cs \
  api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/AspelMigrationSchedulerJob.cs \
  api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs/ManualPasoDTO.cs \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateApplication/Services/CandidateAutomationService.cs \
  api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs \
  api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/AccessControl/Services/AccessScanService.cs
# Resultado esperado: 0 líneas

# 3) Confirmar que quedaron exactamente 4 TODO nuevos
grep -rn "TODO(FH-01)" api/LuxuryApp.Application/ | wc -l
# Resultado esperado: 4 (o menos si agrupaste varias líneas del mismo archivo bajo un TODO)

# 4) Sin regresiones de convenciones
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- `dotnet build api/LuxuryApp.sln` → 0 errores nuevos.
- El grep del paso 2 devuelve 0 líneas.
- Los 4 TODO están presentes, cada uno en el archivo/línea correcto de la lista de arriba.
- `audit-conventions.mjs` no sube su conteo de errores respecto al valor actual (repórtalo, no lo
  asumas — corre el script antes de tocar nada y compara).
- Ningún archivo fuera de los 13 listados fue modificado.

## Reporte de finalización

1. Confirmación línea por línea: para cada uno de los 13 puntos, qué línea quedó exactamente
   (pega el diff, no lo resumas).
2. Salida literal de los 4 comandos de verificación.
3. Conteo de `audit-conventions.mjs` antes y después.
4. Cualquier ocurrencia de `DateTime.Now` que hayas visto en estos archivos y que **no** estuviera
   en esta lista de 13 puntos (si el barrido original se le escapó algo, repórtalo, no lo toques).
5. Decisiones que tomaste por tu cuenta y por qué.

No avances al ticket FH-02. Espera la auditoría.
