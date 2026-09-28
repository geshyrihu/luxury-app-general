# Auditoría de Jobs Hangfire (Fase 1)

**Fecha:** 2026-08-12

Esta matriz documenta el estado de los 19 jobs encontrados en `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/`.

## Matriz de Auditoría

| Job Name | Ubicación | Patrón Naming | Error Handling | Logging | Tenant/Global | IJobService | Método ExecuteAsync |
|----------|-----------|---------------|----------------|---------|---------------|-------------|---------------------|
| AspelMigrationSchedulerJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | 🔴 Sin inicio/fin | 🟡 Global | 🔴 NO | 🔴 QueueActive... |
| BankReconciliationJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| CandidatePipelineAutomationJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| CollectionEscalationJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| ContabilidadMigrationJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | 🟡 Parcial | 🟡 Global | 🔴 NO | 🔴 SyncCompleta... |
| DailyLateFeeCalculatorJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| DatabaseBackupJob | Workers/ | ✅ OK | 🟡 No propaga error (rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| EmployeeDataValidationJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| ExpireCredentialsJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | 🔴 Sin inicio/fin | 🟡 Global | 🔴 NO | ✅ OK |
| ExpireVisitsJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | 🔴 Sin inicio/fin | 🟡 Global | 🔴 NO | ✅ OK |
| FireInspectionCycleGenerationJob| Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| LazySyncJuntasMensualesJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| MonthlyChargeGenerationJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| NotificationEngineJob | Workers/ | ✅ OK | ✅ OK (try-catch, rethrow) | ✅ OK | 🟡 Global | 🔴 NO | ✅ OK |
| NotifyExpiringVacationsJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | ✅ OK | 🟡 Global | 🔴 NO | 🔴 Execute() |
| OverstayDetectionJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | 🔴 Sin inicio/fin | 🟡 Global | 🔴 NO | ✅ OK |
| RecurringTaskGenerationJob | Workers/ | ✅ OK | 🔴 Sin try-catch global | ✅ OK | 🟡 Global | 🔴 NO | 🔴 GenerateTasksAsync |
| RecurringTaskSchedulerService | Workers/ | 🔴 Service | 🔴 Sin try-catch global | 🔴 Sin logging | 🟡 Global | 🔴 NO | 🔴 Generate... |
| VacationUpdater | Workers/ | 🔴 Updater | 🔴 Sin try-catch global | 🔴 Sin logging | 🟡 Global | 🔴 NO | 🔴 Update... |

## Matriz de Remediación Priorizada (Fase 2)

| Grupo de Trabajo | Descripción | Severidad | Esfuerzo |
|------------------|-------------|-----------|----------|
| **Grupo 1: Interfaz y Método** | Implementar `IJobService` en los 19 jobs, y renombrar o adaptar el método principal a `async Task ExecuteAsync()`. | 🔴 CRÍTICA | 2.5 horas |
| **Grupo 2: Error Handling** | Agregar `try { ... } catch (Exception ex) { _logger.LogError(ex, "..."); throw; }` en la capa superior de los jobs que no lo tengan. | 🔴 CRÍTICA | 1.5 horas |
| **Grupo 3: Logging (Inicio/Fin)**| Estandarizar `logger.LogInformation("Job iniciado: ...");` y medir tiempo con `Stopwatch` para el log de fin. | 🟡 IMPORTANTE | 1.0 hora |
| **Grupo 4: Naming** | Renombrar `RecurringTaskSchedulerService` a `RecurringTaskSchedulerJob` y `VacationUpdater` a `VacationUpdaterJob`. | 🟡 IMPORTANTE | 0.5 horas |

*Nota sobre Tenant Injection:* La gran mayoría de estos jobs iteran sobre todos los clientes (Customer) o configuraciones. Parecen ser jobs globales que no operan bajo el contexto de un Tenant único inyectado por `ITenantAccessor`, por lo que esa validación requiere aplicarse solo a los que operen sobre un tenant específico. Durante la refactorización, evaluaremos si alguno requiere `ITenantAccessor`.
