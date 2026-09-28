# Auditoría: Falta de Convenciones para Jobs (Hangfire) — 2026-08-12

**Status:** 🔴 CRÍTICA (Sistema de jobs existe pero NO DOCUMENTADO)  
**Alcance:** Backend (`api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/`)  
**Hallazgo:** 15+ jobs implementados, 0 reglas en CONVENTIONS.md  
**Severidad:** 🔴 CRÍTICA (sin guía, nuevos jobs pueden violar patrones)

---

## Resumen Ejecutivo

**Problema:** Sistema robusto de Hangfire jobs existe (29 jobs registrados según logs del startup), pero:
- ❌ CONVENTIONS.md NO menciona jobs/Hangfire
- ❌ Patrón de configuración NO documentado
- ❌ Inyección de tenant/usuario en jobs NO explícita
- ❌ Convenciones de naming/ubicación NO establecidas
- ❌ Lifecycle (registro, ejecución, error handling) NO definido

**Riesgo:** Nuevos developers crean jobs sin patrón uniforme → inconsistencia crítica en tareas automatizadas.

---

## 1. Sistema Actual (Existente pero Oculto)

### 1.1 Estructura Implementada

```
api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/
├─ Catalog/
│  └─ HangfireJobCatalog.cs         ← Catálogo centralizado
├─ Compatibility/
│  └─ LegacyHangfireJobTypes.cs     ← Tipos legacy
└─ Workers/ (15+ jobs)
   ├─ AspelMigrationSchedulerJob.cs
   ├─ BankReconciliationJob.cs
   ├─ CandidatePipelineAutomationJob.cs
   ├─ CollectionEscalationJob.cs
   ├─ ContabilidadMigrationJob.cs
   ├─ DailyLateFeeCalculatorJob.cs
   ├─ DatabaseBackupJob.cs
   ├─ EmployeeDataValidationJob.cs
   ├─ ExpireCredentialsJob.cs
   ├─ ExpireVisitsJob.cs
   ├─ FireInspectionCycleGenerationJob.cs
   ├─ LazySyncJuntasMensualesJob.cs
   ├─ MonthlyChargeGenerationJob.cs
   └─ ... (más)
```

### 1.2 Configuración (en Program.cs)

```csharp
// Startup logs muestran:
// "Jobs recurrentes registrados desde catalogo central. Total: 29"

// Hangfire dashboard en /hangfire (requiere autenticación)
// HangfireExtensions.RegisterRecurringJobsAsync() — registro centralizado
// HangfireAuthorizationFilter — autenticación del dashboard
```

### 1.3 Patrón Actual (Inferido del código)

```csharp
// Workers/DatabaseBackupJob.cs (ejemplo)
public class DatabaseBackupJob(
    ICurrentUserService currentUserService,
    ITenantAccessor tenantAccessor,
    ILogger<DatabaseBackupJob> logger)
{
    public async Task ExecuteAsync()
    {
        // Inyecta tenant/usuario automáticamente para job
        var tenantId = tenantAccessor.GetTenantId();
        var userId = currentUserService.GetUserId();
        
        logger.LogInformation("Backup iniciado para tenant {TenantId}", tenantId);
        // ... lógica
    }
}
```

---

## 2. Falta Crítica: CONVENTIONS.md NO cubre Jobs

### 2.1 Lo que NO está documentado

| Aspecto | ¿Documentado en CONVENTIONS.md? | Ubicación Actual |
|---------|--------------------------------|------------------|
| Ciclo de vida de job | ❌ NO | Solo en código de HangfireJobCatalog |
| Patrón de naming (Xyz**Job**.cs) | ❌ NO | Inferido de Workers/ |
| Ubicación oficial (AdminLuxuryApp/Jobs) | ❌ NO | Hardcodeada en structure |
| Inyección de tenant en jobs | ❌ NO | Línea 94-95 backend-shared-services.md menciona brevemente |
| Manejo de errores en jobs | ❌ NO | Cada job lo decide por su cuenta |
| Retry policy y deadletter | ❌ NO | Configuración de Hangfire omitida |
| Integración con notificaciones (jobs que disparan alertas) | ❌ NO | Ad-hoc |
| Dashboard /hangfire (acceso, autenticación) | ❌ NO | Seguridad NO documentada |

### 2.2 Búsquedas fallidas

```bash
grep -i "job\|hangfire\|background\|scheduled\|recurring" CONVENTIONS.md
# Resultado: 0 matches (solo menciones falsas: "synced job" en contexto de sync)

grep -i "job" conventions/backend/*.md
# Resultado: 0 matches sobre Hangfire jobs
```

---

## 3. Hallazgos Específicos

### A. Patrón de Naming Sin Documentar

**Actual (inferido):**
```csharp
// Nombres consistentes pero no explícitos
DatabaseBackupJob
DailyLateFeeCalculatorJob
MonthlyChargeGenerationJob
CandidatePipelineAutomationJob
// Patrón: [Temporal]?[Concepto]Job
```

**Problema:** Sin doc, un nuevo dev podría crear:
```csharp
BackupDatabaseService  // ❌ Incoherente
BackupJobService       // ❌ Redundante
```

### B. Ubicación Sin Regla

**Actual:** Todos en `AdminLuxuryApp/Infraestructura/Jobs/`

**Problema:** ¿Qué pasa si job es específico del módulo X?
- ¿Va en `XLuxuryApp/Jobs/`?
- ¿Va en `AdminLuxuryApp/Jobs/` (centralizado)?
- ¿Va en `XLuxuryApp/Services/` como método?

Sin documentación → cada dev decide.

### C. Registro de Jobs Sin Patrón Explícito

**Actual (inferido de HangfireExtensions):**
```csharp
RecurringJob.AddOrUpdate<IJobService>(
    "job-id",
    x => x.ExecuteAsync(),
    "0 2 * * *"  // Cron expression
);
```

**Problema:** ¿Quién mantiene el catálogo de IDs? ¿Formato de cron validado? Sin doc.

### D. Inyección de Tenant/Usuario SIN GUÍA

**Línea 94-95 backend-shared-services.md dice:**
> "para jobs o procesos fuera de request, simular o fijar tenant/usuario usando los servicios oficiales segun el caso"

**Problema:** "Según el caso" es vago. Ejemplos:
- ¿Se inyecta en constructor? ¿En método?
- ¿ITenantAccessor.GetTenantId() o ICurrentUserService.GetUserId()?
- ¿Qué pasa si job es sin-tenant (global)?

### E. Error Handling SIN CONVENCIÓN

**Actual (código):** Cada job hace su propio try-catch
```csharp
public async Task ExecuteAsync()
{
    try
    {
        // ...
    }
    catch (Exception ex)
    {
        // Algunos: logger.LogError
        // Otros: catch vacío ❌
        // Otros: disparar alerta
    }
}
```

**Problema:** Sin patrón → error handling inconsistente.

---

## 4. Impacto de la Falta

| Área | Riesgo | Severidad |
|------|--------|-----------|
| **Nuevos jobs** | Dev crea sin patrón consistente | 🔴 CRÍTICA |
| **Mantenimiento** | Diff entre jobs viejos y nuevos | 🔴 CRÍTICA |
| **Debugging** | Sin reglas, difícil encontrar bugs | 🟡 ALTA |
| **Security** | Dashboard /hangfire sin guía de acceso | 🟡 ALTA |
| **Monitoreo** | Sin convención sobre logging/alertas | 🟡 ALTA |

---

## 5. Lo Que Se Necesita Documentar

### 5.1 CONVENTIONS.md — Nueva sección §5.11 (Operación > Jobs)

```markdown
## 5.11 Background Jobs (Hangfire)

🔴 **CRÍTICA:** Jobs recurrentes deben seguir patrón centralizado.

**Ubicación official:**
- Backend: `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/`
- Catálogo: `HangfireJobCatalog.cs` (único registro)
- Registro: `HangfireExtensions.RegisterRecurringJobsAsync()`

**Patrón de naming:**
- Clase: `[Concepto]Job` (e.g., `DailyLateFeeCalculatorJob`)
- Interface: `I[Concepto]JobService` si expone públicamente
- Método: `ExecuteAsync()` (obligatorio)

**Inyección en jobs (out-of-request context):**
- Usar `ITenantAccessor` para obtener tenantId
- Usar `ICurrentUserService` para userId (si aplica)
- Logging obligatorio al inicio/fin del job
- NUNCA hardcodear tenant/usuario

**Error handling:**
- try-catch OBLIGATORIO
- Logging con logger.LogError (con Exception + contexto)
- Disparar alerta si critico (vía INotificationDispatcher)
- NUNCA catch vacío

**Cron expressions:**
- Validar formato con librería oficial
- Documentar horario en comentario de job
- Horarios críticos (>1h) requieren Tech Lead approval

**Dashboard /hangfire:**
- Acceso SOLO a usuarios Admin
- Autenticación via HangfireAuthorizationFilter
- NUNCA exponer públicamente
```

### 5.2 conventions/backend/backend-jobs-hangfire.md (nuevo)

Documentación completa:
- Patrón de configuración (HangfireExtensions, HangfireJobCatalog)
- Ejemplos de jobs (simple, con tenant, con notificaciones)
- Lifecycle (registro, ejecución, error, retry)
- Testing jobs
- Troubleshooting (dead-letter queue, failed jobs dashboard)

---

## 6. Checklist de Remediación

- [ ] Crear §5.11 en CONVENTIONS.md (Jobs)
- [ ] Crear conventions/backend/backend-jobs-hangfire.md
- [ ] Audit jobs existentes (15+): ¿cumplen patrón propuesto?
- [ ] Documentar cada job en su README si es crítico (Backup, MonthlyCharge, etc.)
- [ ] Crear guía de "Agregar nuevo job" (template + checklist)
- [ ] Validar HangfireAuthorizationFilter en todo ambiente (dev/prod)
- [ ] Agregar a conventions-viewer entrada "backend-jobs"

---

## 7. Archivos a Crear/Actualizar

| Archivo | Acción | Secciones |
|---------|--------|-----------|
| `CONVENTIONS.md` | Agregar | §5.11 Jobs |
| `conventions/backend/backend-jobs-hangfire.md` | Crear | Completo (naming, patrón, ciclo de vida, testing) |
| `conventions/backend/backend-jobs-checklist.md` | Crear | Checklist "agregar nuevo job" |
| `HangfireJobCatalog.cs` | Documentar | Comentarios inline de cada job |

---

## 🎯 Recomendación

**Crear documentation urgente para Jobs:**

1. **Inmediato (hoy):** §5.11 CONVENTIONS.md (patrón mínimo)
2. **Esta semana:** docs-conventions backend-jobs-hangfire.md (guía completa)
3. **Antes de Q4:** Auditar 15+ jobs existentes, actualizar si violan patrón

Sin esto, nuevo developer va a crear job sin patrón claro → inconsistencia.

---

**Auditoría completada:** 2026-08-12  
**Hallazgo:** 🔴 Sistema implementado pero 0% documentado  
**Próximo paso:** Crear documentation + template para nuevos jobs

