# Plan de Remediación: Jobs Hangfire — 4 Fases

**Fecha:** 2026-08-12  
**Alcance:** 15+ jobs existentes, audit + actualización a patrón centralizado  
**Duración estimada:** 3 sprints (6 semanas)  
**Severidad:** 🔴 CRÍTICA (sin patrón, nuevos jobs pueden violar normas)

---

## Resumen Ejecutivo

Hangfire jobs existe (29 registrados) pero sin documentación ni patrón claro. Plan:
1. **Fase 1** (1-2 sem): Auditar 15+ jobs existentes
2. **Fase 2** (2-3 sem): Refactorizar jobs que violen patrón
3. **Fase 3** (1 sem): Template + checklist para nuevos jobs
4. **Fase 4** (Permanente): Gobernanza + validación en PR

---

## Fase 1 — Auditoría (1-2 semanas)

### Objetivo
Catalogar 15+ jobs existentes, identificar cuáles violan el nuevo patrón.

### Tareas

**1.1 Enumerar y clasificar todos los jobs**

```bash
find api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers -name "*.cs" \
  | xargs -I {} basename {} .cs
```

Crear tabla en `docs/plans/20260812-jobs-audit-results.md`:

| Job Name | Ubicación | Patrón Naming | Error Handling | Logging | Tenant Injection | Status |
|----------|-----------|---------------|----------------|---------|------------------|--------|
| DatabaseBackupJob | Workers/ | ✅ OK | ⚠️ Review | ✅ OK | ✅ OK | 🟡 Review |
| DailyLateFeeCalculatorJob | Workers/ | ✅ OK | ⚠️ Review | ✅ OK | ✅ OK | 🟡 Review |
| ... (13 más) | | | | | | |

**1.2 Validar cada job contra patrón**

Checklist por job:
- [ ] Hereda `IJobService`
- [ ] Método `async Task ExecuteAsync()`
- [ ] Inyecta `ILogger<TJob>`
- [ ] Inyecta `ITenantAccessor` si aplica
- [ ] Try-catch en ExecuteAsync (no catch vacío)
- [ ] Logging de inicio/fin
- [ ] Documentación en comentario (cron, duración, criticidad)
- [ ] Registrado en HangfireJobCatalog.cs
- [ ] Cron validado (crontab.guru)

**1.3 Crear matriz de remediación**

| Job | Violación | Severidad | Esfuerzo |
|-----|-----------|-----------|----------|
| XyzJob | Catch vacío | 🔴 CRÍTICA | 15 min |
| AbcJob | Sin logging inicio | 🟡 IMPORTANTE | 10 min |
| DefJob | No inyecta ITenantAccessor | 🔴 CRÍTICA | 30 min |

**Deliverable:** `docs/plans/20260812-jobs-audit-results.md` (tabla + matriz)

---

## Fase 2 — Refactorización (2-3 semanas)

### Objetivo
Actualizar jobs que violen patrón.

### Tareas

**2.1 Priorizar por severidad**

```
🔴 CRÍTICA (semana 1):
  - Catch vacío → agregar logging + re-throw
  - Sin inyección tenant → agregar ITenantAccessor
  - Sin logging → agregar inicio/fin

🟡 IMPORTANTE (semana 2):
  - Naming inconsistente → renombrar clase
  - Método no async → hacer async
  - Cron sin documentación → documentar
```

**2.2 Refactorizar por grupo**

**Grupo A — Error Handling (5 jobs, 1.5 horas)**
```csharp
// Antes
catch { }

// Después
catch (Exception ex)
{
    _logger.LogError(ex, "Job falló: {Message}", ex.Message);
    throw;
}
```

**Grupo B — Logging (4 jobs, 1 hora)**
```csharp
// Antes
await Process();

// Después
_logger.LogInformation("Job iniciado");
var sw = Stopwatch.StartNew();
await Process();
sw.Stop();
_logger.LogInformation("Job completado en {Duration}ms", sw.ElapsedMilliseconds);
```

**Grupo C — Tenant Injection (3 jobs, 1.5 horas)**
```csharp
// Antes (no inyectado)
var tenantId = Guid.Parse(config["DefaultTenant"]);

// Después (inyectado)
var tenantId = _tenantAccessor.GetTenantId();
```

**2.3 Testing**

Crear tests para cada job remediado:
- [ ] Success case (completa sin error)
- [ ] Failure case (captura exception y loguea)
- [ ] Tenant scope (obtiene tenant correctamente)

**Deliverable:** PR con refactor de todos los jobs + tests

---

## Fase 3 — Template + Gobernanza (1 semana)

### Objetivo
Crear artifacts que prevengan que nuevos jobs violen patrón.

### Tareas

**3.1 Crear backend-jobs-checklist.md**

Checklist copiar-pegar para nuevo job (ubicación: `conventions/backend/backend-jobs-checklist.md`):

```markdown
# Checklist: Nuevo Job

- [ ] Clase hereda `IJobService`
- [ ] Método `async Task ExecuteAsync()`
- [ ] Inyecciones: `ILogger<TJob>`, `ITenantAccessor`, servicios
- [ ] Try-catch + logging de error
- [ ] Documentación en comentario (cron, duración, criticidad)
- [ ] Registrado en `HangfireJobCatalog.cs`
- [ ] Cron validado en crontab.guru
- [ ] Tests: success + error cases
- [ ] Code review: verifica patrón antes de merge
```

**3.2 Template de job (snippet)**

Crear snippet en IDE/editor que expanda a:
```csharp
namespace LuxuryApp.Application.Moduls.AdminLuxuryApp.Infraestructura.Jobs.Workers;

/// <summary>
/// Job: [DESCRIPCIÓN]
/// Cron: [EXPRESIÓN] (HH:MM descripción)
/// Duración esperada: [TIEMPO]
/// Criticidad: [BAJA|MEDIA|ALTA]
/// </summary>
public class ${1:JobName}Job : IJobService
{
    private readonly ILogger<${1:JobName}Job> _logger;
    private readonly ITenantAccessor _tenantAccessor;

    public ${1:JobName}Job(
        ILogger<${1:JobName}Job> logger,
        ITenantAccessor tenantAccessor)
    {
        _logger = logger;
        _tenantAccessor = tenantAccessor;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Job iniciado: ${1:JobName}Job");
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var tenantId = _tenantAccessor.GetTenantId();

            // TODO: Lógica aquí

            stopwatch.Stop();
            _logger.LogInformation("Job completado en {Duration}ms", stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Job falló tras {Duration}ms", stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
```

**3.3 Agregar a PR template**

Actualizar `.github/PULL_REQUEST_TEMPLATE.md` o instrucciones de PR con:
```markdown
## ¿Incluye jobs nuevos?
- [ ] Sí → verifica checklist en conventions/backend/backend-jobs-checklist.md
- [ ] No
```

**Deliverable:** 
- `conventions/backend/backend-jobs-checklist.md`
- Snippet en settings.json (IDE)
- PR template updated

---

## Fase 4 — Gobernanza Permanente (Ongoing)

### Objetivo
Asegurar que nuevos jobs sigan patrón.

### Tareas

**4.1 Code Review Checklist**

En cada PR con job nuevo:
- [ ] Hereda `IJobService`
- [ ] Implementa `async Task ExecuteAsync()`
- [ ] Inyecciona `ILogger<TJob>` + `ITenantAccessor`
- [ ] Try-catch con logging (sin catch vacío)
- [ ] Documentado en HangfireJobCatalog.cs
- [ ] Cron validado + documentado
- [ ] Tests incluidos (success + error)

**4.2 Audit Trimestral**

Cada 3 meses:
```bash
# Scan para catch vacío en jobs
grep -r "catch\s*{" api/*/Infraestructura/Jobs/ | grep -v "logger\|throw"
# Debe retornar 0 matches
```

**4.3 Dashboard Monitoring**

- Revisar `/hangfire` semanalmente
- Alertar si failed jobs > 5 en 24h
- Investigar jobs lentos (duración > esperada)

**Deliverable:** 
- Documentación de audit trimestral
- Scripts de validación automática
- SLA de monitoreo dashboard

---

## Cronograma

```
Semana 1 (2026-08-19 a 2026-08-25):
  └─ Fase 1: Auditoría 15+ jobs
     └─ Entregable: Matriz de remediación

Semana 2-3 (2026-08-26 a 2026-09-08):
  └─ Fase 2: Refactor jobs (5 x Grupo A, 4 x Grupo B, 3 x Grupo C)
     └─ Entregable: PR con refactor + tests

Semana 4 (2026-09-09 a 2026-09-15):
  └─ Fase 3: Template + gobernanza
     └─ Entregable: Checklist, snippet, PR template

Semana 5+ (Permanente):
  └─ Fase 4: Validación en PRs + audit trimestral
```

---

## Recursos Requeridos

| Recurso | Cantidad | Fase |
|---------|----------|------|
| Developer (refactor) | 1 FTE | Fases 1-2 |
| Tech Lead (review) | 0.5 FTE | Fases 2-3 |
| Automation/Scripts | 8 horas | Fase 3-4 |

---

## Validación de Éxito

✅ **Todos los jobs:**
- [ ] Heredan `IJobService`
- [ ] Implementan `async Task ExecuteAsync()`
- [ ] Tienen try-catch sin catch vacío
- [ ] Loguean inicio/fin/error
- [ ] Inyectan `ITenantAccessor`
- [ ] Documentados en comentario
- [ ] Registrados en HangfireJobCatalog.cs

✅ **Nuevos jobs (post-remediación):**
- [ ] Siguen template
- [ ] Pasan checklist
- [ ] Tienen tests
- [ ] Cumplen patrón antes de merge

✅ **Dashboard:**
- [ ] Acceso solo Admin
- [ ] Monitoreo semananal activo
- [ ] Alertas configuradas para failed jobs

---

## Riesgos y Mitigación

| Riesgo | Severidad | Mitigación |
|--------|-----------|-----------|
| Refactor rompe jobs | 🔴 CRÍTICA | Code review + test en staging |
| Nuevos jobs ignoran patrón | 🟡 IMPORTANTE | Template obligatorio en PR |
| Dashboard falla en prod | 🔴 CRÍTICA | Validar acceso antes de deploy |

---

## Dependencias

- CONVENTIONS.md §5.9.2 (documentación patrón) ✅ DONE
- backend-jobs-hangfire.md ✅ DONE
- backend-jobs-checklist.md 🟡 Fase 3
- Snippet en IDE 🟡 Fase 3

---

**Plan aprobado:** Pendiente Tech Lead  
**Próximo paso:** Iniciar Fase 1 semana 19 (2026-08-19)

