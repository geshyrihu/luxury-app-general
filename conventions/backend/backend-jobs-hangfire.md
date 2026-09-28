# Backend Jobs — Hangfire Pattern & Conventions

**Última revisión:** 2026-08-12  
**Status:** Documentación de patrón implementado + guía para nuevos jobs

---

## 1. Propósito

Documentar el patrón centralizado de Hangfire para jobs recurrentes, asegurando:
- Consistencia en naming, estructura y ciclo de vida
- Manejo correcto de tenant/usuario en contexto sin-request
- Error handling y logging obligatorios
- Seguridad del dashboard

---

## 2. Ciclo de Vida

```
1. DEFINICIÓN (developer)
   ↓ Crear clase XyzJob heredando IJobService
   ↓ Implementar ExecuteAsync()
   ↓ Inyectar servicios (tenant, logger, etc.)

2. REGISTRO (programa principal)
   ↓ Agregar entrada a HangfireJobCatalog.cs
   ↓ Crear cron expression
   ↓ Llamar en HangfireExtensions.RegisterRecurringJobsAsync()

3. EJECUCIÓN (Hangfire scheduler)
   ↓ Invoca ExecuteAsync() según cron
   ↓ Captura exception si falla
   ↓ Logging automático (con error si exception)
   ↓ Retry según configuración (por defecto: 1 reintentos)

4. MONITOREO (dashboard /hangfire)
   ↓ Ver histórico de ejecuciones
   ↓ Navegar failed jobs, re-enqueue si necesario
   ↓ Acceso solo Admin
```

---

## 3. Patrón de Naming

**Clase:**
```csharp
// ✅ CORRECTO
public class DailyLateFeeCalculatorJob : IJobService
public class DatabaseBackupJob : IJobService
public class MonthlyChargeGenerationJob : IJobService

// ❌ INCORRECTO
public class BackupDatabaseService
public class DailyLateFeesCalculator
public class MonthlyCharges
```

**Método:**
```csharp
// ✅ OBLIGATORIO
public async Task ExecuteAsync()

// ❌ INCORRECTO
public void Execute()
public async Task Run()
```

**ID en catálogo:**
```csharp
// ✅ CORRECTO (kebab-case)
RecurringJob.AddOrUpdate("daily-late-fee-calculator", ...)
RecurringJob.AddOrUpdate("database-backup", ...)

// ❌ INCORRECTO
RecurringJob.AddOrUpdate("DailyLateFeeCalculator", ...)
RecurringJob.AddOrUpdate("backup_db", ...)
```

---

## 4. Estructura Obligatoria

```csharp
namespace AdminLuxuryApp.Infraestructura.Jobs.Workers;

/// <summary>
/// Job: Descripción breve de qué hace.
/// Cron: 0 2 * * * (2:00 AM diariamente)
/// Duración esperada: ~5 minutos
/// Criticidad: ALTA (si falla, X servicio no funciona)
/// </summary>
public class XyzJob : IJobService
{
    private readonly ITenantAccessor _tenantAccessor;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<XyzJob> _logger;
    private readonly IXyzAppService _xyzAppService;

    public XyzJob(
        ITenantAccessor tenantAccessor,
        ICurrentUserService currentUserService,
        ILogger<XyzJob> logger,
        IXyzAppService xyzAppService)
    {
        _tenantAccessor = tenantAccessor;
        _currentUserService = currentUserService;
        _logger = logger;
        _xyzAppService = xyzAppService;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Job iniciado: XyzJob");
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var tenantId = _tenantAccessor.GetTenantId();
            var userId = _currentUserService.GetUserId();

            _logger.LogInformation("Procesando XyzJob para tenant {TenantId}", tenantId);

            // Lógica del job
            await _xyzAppService.ProcessAsync(tenantId);

            stopwatch.Stop();
            _logger.LogInformation("XyzJob completado en {Duration}ms", stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "XyzJob falló tras {Duration}ms", stopwatch.ElapsedMilliseconds);
            // Opcional: disparar alerta crítica si necesario
            throw; // Re-throw para que Hangfire intente retry
        }
    }
}
```

---

## 5. Inyección de Tenant/Usuario

### En contexto out-of-request:

```csharp
// ✅ CORRECTO
public class XyzJob : IJobService
{
    private readonly ITenantAccessor _tenantAccessor;

    public async Task ExecuteAsync()
    {
        var tenantId = _tenantAccessor.GetTenantId();
        // Procesar solo para este tenant
    }
}

// ❌ INCORRECTO (hardcodeado)
public async Task ExecuteAsync()
{
    var tenantId = new Guid("12345678-1234-1234-1234-123456789abc");
}

// ❌ INCORRECTO (no inyectado)
var service = new XyzAppService();
```

### Si job es multi-tenant (itera todos):

```csharp
// ✅ PATRÓN PARA JOBS GLOBALES
public class GlobalDataSyncJob : IJobService
{
    private readonly IApplicationDbContext _dbContext;

    public async Task ExecuteAsync()
    {
        var allTenants = await _dbContext.Tenants.ToListAsync();

        foreach (var tenant in allTenants)
        {
            _logger.LogInformation("Procesando tenant {TenantId}", tenant.Id);
            // Usa ITenantAccessor.SetTenantId(tenant.Id) o pasa como parámetro
        }
    }
}
```

---

## 6. Error Handling (Obligatorio)

```csharp
// ❌ PROHIBIDO: catch vacío
try { ... }
catch { }

// ❌ PROHIBIDO: silent failure
try { ... }
catch (Exception ex) { /* nada */ }

// ✅ OBLIGATORIO: logging + re-throw
try { ... }
catch (Exception ex)
{
    _logger.LogError(ex, "Error en XyzJob: {Message}", ex.Message);
    throw; // Hangfire lo captura y reintenta
}

// ✅ OPCIONAL: alerta si crítico
try { ... }
catch (Exception ex)
{
    _logger.LogError(ex, "XyzJob falló (CRÍTICO)");
    await _notificationDispatcher.DispatchAsync(new NotificationRequest(
        Title: "XyzJob falló",
        Body: $"Error: {ex.Message}",
        Category: NotificationCategory.System,
        Channels: [NotificationChannel.Email]
    ));
    throw;
}
```

---

## 7. Cron Expressions

**Formato:** `<minute> <hour> <day-of-month> <month> <day-of-week>`

```csharp
// Ejemplos
"0 2 * * *"         // 2:00 AM diariamente
"*/5 * * * *"       // Cada 5 minutos
"0 */2 * * *"       // Cada 2 horas
"0 9 * * MON"       // Lunes a las 9:00 AM
"0 0 1 * *"         // Primer día del mes a medianoche
"0 9-17 * * *"      // Cada hora de 9 AM a 5 PM
```

**Herramienta de validación:** crontab.guru

**Gobernanza:** todo cambio de horario de un job existente requiere aprobación del Tech Lead. El dashboard `/hangfire` es accesible solo para usuarios Admin (vía `HangfireAuthorizationFilter`) y nunca se expone públicamente.

```csharp
// Siempre documentar en comentario del job
/// <summary>
/// Job: Calcula comisiones diarias
/// Cron: 0 2 * * * (2:00 AM diariamente)
/// </summary>
public class DailyCommissionCalculationJob : IJobService
```

---

## 8. Registro en HangfireJobCatalog.cs

```csharp
// HangfireJobCatalog.cs (único punto de registro)
public static class HangfireJobCatalog
{
    public static async Task RegisterAllRecurringJobsAsync(
        IRecurringJobManager recurringJobManager,
        IServiceProvider serviceProvider)
    {
        // Formato: nombre-id, cron, descripción
        recurringJobManager.AddOrUpdate<XyzJob>(
            "xyz-job",
            x => x.ExecuteAsync(),
            "0 2 * * *",
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc,
                Queue = "default"
            });

        // Otro job
        recurringJobManager.AddOrUpdate<DatabaseBackupJob>(
            "database-backup",
            x => x.ExecuteAsync(),
            "0 1 * * *",
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc,
                Queue = "default"
            });
    }
}
```

---

## 9. Testing

```csharp
// Test: job sin error
[Fact]
public async Task ExecuteAsync_Success_LogsCompletion()
{
    // Arrange
    var mockTenantAccessor = new Mock<ITenantAccessor>();
    mockTenantAccessor.Setup(x => x.GetTenantId()).Returns(Guid.NewGuid());

    var mockLogger = new Mock<ILogger<XyzJob>>();
    var job = new XyzJob(mockTenantAccessor.Object, mockLogger.Object, ...);

    // Act
    await job.ExecuteAsync();

    // Assert
    mockLogger.Verify(x => x.Log(
        It.Is<LogLevel>(l => l == LogLevel.Information),
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("completado")),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception, string>>()),
        Times.Once);
}

// Test: job con error
[Fact]
public async Task ExecuteAsync_Failure_LogsError()
{
    // Arrange
    var mockService = new Mock<IXyzAppService>();
    mockService.Setup(x => x.ProcessAsync(It.IsAny<Guid>()))
        .ThrowsAsync(new InvalidOperationException("Test error"));

    var job = new XyzJob(..., mockService.Object);

    // Act & Assert
    await Assert.ThrowsAsync<InvalidOperationException>(() => job.ExecuteAsync());

    // Verificar que se loguea el error
}
```

---

## 10. Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Job no se ejecuta | No registrado en HangfireJobCatalog | Agregar entrada + reiniciar app |
| Job falla con "Tenant is null" | `ITenantAccessor.GetTenantId()` retorna null | Verificar que job tiene tenant scope |
| Job ejecuta pero logging vacío | Logger no inyectado correctamente | Verificar inyección en constructor |
| Dashboard 404 | Hangfire middleware no configurado | Verificar Program.cs `app.UseHangfireDashboard()` |
| Failed job queue crece | Jobs fallan sin retry exitoso | Revisar logs en `/hangfire` → Failed jobs |

---

## 11. Dashboard /hangfire

**URL:** `https://localhost:5001/hangfire` (solo ambiente local)

**En producción:** Requiere autenticación via `HangfireAuthorizationFilter`

```csharp
// Acceso: Solo usuarios con rol Admin
app.UseHangfireDashboard(
    "/hangfire",
    new DashboardOptions
    {
        Authorization = new[] { new HangfireAuthorizationFilter() }
    });
```

**Qué ver en dashboard:**
- Recurring jobs: lista de jobs + próxima ejecución
- Enqueued: jobs pendientes
- Processing: jobs en ejecución ahora
- Succeeded: jobs completados exitosamente
- Failed: jobs con error (permite re-enqueue)
- Deleted: jobs descartados

---

## 12. Checklist: Agregar Nuevo Job

- [ ] Crear clase `XyzJob : IJobService` en `Workers/`
- [ ] Implementar `async Task ExecuteAsync()`
- [ ] Inyectar `ITenantAccessor`, `ILogger<XyzJob>`, servicios necesarios
- [ ] Agregar try-catch + logging (inicio, fin, error)
- [ ] Documentar cron en comentario de clase
- [ ] Registrar en `HangfireJobCatalog.cs`
- [ ] Escribir test (success + error cases)
- [ ] Validar cron en crontab.guru
- [ ] Test en ambiente local: `/hangfire` dashboard
- [ ] Agregar descripción en README del módulo si es crítico

---

**Referencia:** CONVENTIONS.md §5.9.2

