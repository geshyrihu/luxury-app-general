# Checklist: Nuevo Job Hangfire

Para asegurar que todos los procesos en segundo plano mantienen un estándar de calidad y observabilidad, todo nuevo Job debe cumplir con el siguiente patrón antes de ser aprobado en un Pull Request:

- [ ] La clase hereda de `IJobService` (`Features.Jobs.Workers.IJobService` o donde haya sido ubicado globalmente).
- [ ] Implementa el método `async Task ExecuteAsync()`.
- [ ] Inyecta al menos `ILogger<TJob>`.
- [ ] Inyecta `ITenantAccessor` si el trabajo opera sobre el contexto de un solo inquilino.
- [ ] Utiliza un bloque `try-catch` capturando `Exception ex`, y NUNCA un catch vacío.
- [ ] Registra log de inicio: `_logger.LogInformation("Job iniciado: {NombreJob}");`
- [ ] Mide la duración con `Stopwatch.StartNew()` y registra log de fin: `_logger.LogInformation("Job completado en {Duration}ms", stopwatch.ElapsedMilliseconds);`
- [ ] Registra logs de error: `_logger.LogError(ex, "Job falló tras {Duration}ms", stopwatch.ElapsedMilliseconds);`
- [ ] Vuelve a lanzar la excepción dentro del catch (`throw;`) para que Hangfire marque la ejecución como fallida y pueda aplicar su política de reintentos (`[AutomaticRetry]`).
- [ ] El Job está documentado en un comentario XML (resumen, duración esperada, criticidad y expresión Cron).
- [ ] El Job está correctamente registrado en `HangfireJobCatalog.cs`.
- [ ] La expresión Cron ha sido validada en crontab.guru u otra herramienta similar.
- [ ] Se incluyeron pruebas unitarias para escenarios de éxito y fracaso.
