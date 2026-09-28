# CHECKLIST - Módulo LuxuryAppLogs

**Estado:** 🟡 En planificación
**Última actualización:** 2026-08-18

## PASO 0 — Identificación
- [x] Tipo A (módulo nuevo) registrado
- [x] Rutas registradas (backend nuevo proyecto `LuxuryApp.Infrastructure.Logs`)

## PASO 0.5 — Reconocimiento de entidades
- [x] `UserActivity` documentada (`01b`)
- [x] `Log` documentada (`01b`)
- [x] GAPs detectados (FK cruzada, Serilog)

## PASO 1 — Discovery
- [x] Q1 alcance Logs respondida (nada se migra)
- [x] Q2 proveedor respondido (SQL Server)

## PASO 2 — FASE 0
- [x] Problem Statement + KPIs (K1–K5)
- [x] Matriz RN 4 niveles (RN-LOG-001…013)
- [x] Pre-Mortem (PM-1…4) + Flujos (F1–F4)

## PASO 3 — Riesgos
- [x] Matriz de riesgos (R-01…R-09)
- [x] Matriz de dependencias
- [x] Verificación de usos de `UserActivity` — **HECHA**: `UserActivityHistoryAppService` usa `Include(ApplicationUser)` + filtros CustomerId/TypePerson ⇒ reescritura con lookup dual (ver 03 §3.3, RN-LOG-015)

## PASO 4 — Plan
- [x] 11 secciones mínimas
- [x] §3.5 migración de datos

## PASO 5 — Aprobación
- [ ] Dueño revisa y aprueba el plan
- [ ] Gate objetivo: `node scripts/audit-conventions.mjs` + `node scripts/check-agent-rules.mjs` (al generar código)

## Ejecución (post-aprobación)
- [x] Fase 0: proyecto `LuxuryApp.Infrastructure.Logs` + `LuxuryAppLogsDbContext` + migración `InitialLuxuryAppLogs` + registro en `Program.cs`/`.sln`/connection string ✅
- [x] Fase 1: Serilog → LuxuryAppLogs (sink MSSqlServer, `LuxuryAppLogsConnection`) ✅
- [x] Fase 2: redirigir escritura/lectura UserActivity (filtros, `UserActivityService`, `AuthAppService`) y `LogService`; `UserActivityHistoryAppService` con lookup dual ✅ (compila 0 errores)
- [x] **Auto-creación en arranque:** `Program.cs` ahora ejecuta `logsDb.Database.MigrateAsync()` → al publicar/iniciar la API se crea `LuxuryAppLogs` + `UserActivities` sola; Serilog crea `Logs`.
- [x] Fase 3 (estrategia cambiada): migración por lotes (200 en 200) vía endpoint `POST admin/system-maintenance/migrate-user-activities-to-logs-db` → `UpdateDataBaseAppService.MigrateUserActivitiesToLogsDbAsync` (lee de `LuxuryBuildingGroup`, escribe en `LuxuryAppLogs`, preserva Id, omite duplicados). Disparable desde `herramientas-dev/update-data-base` (botón "Migrar UserActivities a LuxuryAppLogs"). Reversible (truncar destino). Script SQL `docs/migraciones/20260818-luxuryapplogs-useractivities.sql` queda como alternativa.
- [ ] Fase 4: validación K1–K5 tras ejecutar el endpoint (COUNT por Id origen == destino; K2 == 0 Logs históricos)
- [ ] Fase 5: DROP de `LuxuryBuildingGroup.dbo.UserActivities` (+ `Logs`) + limpieza de código (entidades/DbSet originales). **Irreversible**: ejecutar manualmente (SQL `DROP` o migración aplicada a dedo), NO vía `MigrateAsync` de arranque, tras validación + backup.
