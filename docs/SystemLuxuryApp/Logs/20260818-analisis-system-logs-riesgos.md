# 03 - Riesgos y Dependencias

**Módulo:** LuxuryAppLogs
**Fecha:** 2026-08-18

---

## 3.1 Matriz de Riesgos (técnica + seguridad)

| ID | Riesgo | Prob. | Impacto | Mitigación | Owner |
|---|---|---|---|---|---|
| R-01 | FK cruzada `UserActivity→ApplicationUser` imposible en BD separada | Alta | Alto | Eliminar navegación; conservar `ApplicationUserId` (RN-LOG-002). **CONFIRMADO**: `UserActivityHistoryAppService` hace `Include(a => a.ApplicationUser)` y filtra por `a.ApplicationUser.CustomerId`/`TypePerson` ⇒ reescribir con lookup dual de contexto (ver §3.3). | Tech Lead |
| R-02 | Pérdida de filas en migración por zona horaria | Media | Alto | Filtrar `Timestamp >= 2026-01-01` en UTC; validar por `Id` (K1). | Agentes + TL |
| R-03 | DROP irreversible de `UserActivities` antes de validar | Baja | Crítico | Fase de DROP separada, posterior a validación + `BACKUP`/snapshot de `LuxuryBuildingGroup`. | Tech Lead |
| R-04 | Serilog no escribe en nuevo DB (cadena/schema) | Baja | Alto | `AutoCreateSqlTable=true` (sink MSSqlServer); smoke test de escritura pre-cutover (PM-1). | Agentes |

| R-05 | Esquema `Logs` destino no coincide con Serilog (SQL Server) | Baja | Alto | Reutilizar `CreateSqlServerLogColumnOptions` ya existente; alinear `Log.cs` (RN-LOG-013). | Agentes |

| R-06 | Degradación de latencia de lectura de historial | Baja | Media | `UserActivityHistoryAppService` usa `LuxuryAppLogsDbContext`; índices en `Timestamp`, `ApplicationUserId`. (K4) | Agentes |
| R-07 | Exposición de PII en listados sin RBAC | Baja | Alto | Mantener RBAC existente en endpoints (RN-LOG-008/009). | Tech Lead |
| R-08 | Acoplamiento innecesario de migraciones | Baja | Medio | Nuevo proyecto `LuxuryApp.Infrastructure.Logs` con **sus propias** migraciones (aislamiento de catálogo, patrón `VaultDbContext`). Ambos BD son SQL Server ⇒ sin riesgo de mezcla de proveedor. | Agentes |

| R-09 | Referencias residuales a `ApplicationDbContext.UserActivity/Log` post-remoción | Media | Medio | grep + compilación obligatoria; actualizar filtros/servicios a nuevo contexto (K5). | Agentes |

---

## 3.2 Matriz de Dependencias / Impactos

| Dependencia | Afecta a | Plan de contingencia |
|---|---|---|
| `ApplicationDbContext` (SQL Server) | Debe dejar de referenciar `UserActivity`/`Log` | Nueva migración `DropUserActivities`; `Logs` se elimina por SQL fuera de EF. |
| `DatabaseProviderServiceExtensions` (Serilog) | Repuntear sink a `LuxuryAppLogsConnection` (SQL Server) | Método dedicado que lea connection string de logs; fallback a `LoggingProvider`. |
| `LogUserActivityFilter` / `LogUserActivityEndPointsFilter` | Inyectar `LuxuryAppLogsDbContext` | Cambio de constructor; registración de dependencia en `Program.cs`. |
| `UserActivityService` / `AuthAppService` | Inyectar `LuxuryAppLogsDbContext` | Actualizar firmas. |
| `UserActivityHistoryAppService` / `LogService` | Lectura desde nuevo contexto | Si requiere nombre de usuario, lookup vía `ApplicationDbContext` por `ApplicationUserId`. |
| Frontend (`client/angular`) | Contrato de endpoints/DTOs se conserva ⇒ **sin cambios**; verificar en PASO 3 | Si algún endpoint cambia forma, actualizar servicio Angular. |
| `appsettings.json` (dev/staging/prod) | Nueva `LuxuryAppLogsConnection` (SQL Server) | Coordinar con infra; secretos en vault. |

---

## 3.3 Verificación de usos de `UserActivity` — RESULTADO (crítico)

Ejecutado: **sí hay uso de la navegación**. En `UserActivityHistoryAppService.cs`:

```csharp
// Líneas 24-27 (proyección DTO)
UserId    = a.ApplicationUser.Id,
PhotoPath = a.ApplicationUser.PhotoPath,
a.ApplicationUser.FullName,
UserType  = a.ApplicationUser.TypePerson.GetDisplayName(),

// Línea 66
.Include(a => a.ApplicationUser)

// Líneas 71, 76 (filtros)
query = query.Where(a => a.ApplicationUser.CustomerId == customerId.Value);
query = query.Where(a => a.ApplicationUser.TypePerson == userType.Value);
```

**Impacto:** al mover `UserActivity` a `LuxuryAppLogsDbContext` (SQL Server, catálogo distinto) y eliminar la FK,
este servicio **no puede** hacer join SQL a `ApplicationUser` (está en `LuxuryBuildingGroup`,
SQL Server). Debe reescribirse con **lookup dual de contexto**:

1. Si `customerId` o `userType` vienen en el request → primero resolver los `ApplicationUserId`
   que cumplen el filtro desde `ApplicationDbContext.ApplicationUsers`; luego filtrar
   `UserActivity` (nuevo contexto) por ese conjunto de IDs.
2. Para la proyección DTO (`FullName`, `PhotoPath`, `TypePerson`, `CustomerId`) → cargar un
   diccionario `ApplicationUserId → UserDto` desde `ApplicationDbContext` y enriquecer en memoria.
3. Si no hay filtros de usuario → paginar directo desde `LuxuryAppLogsDbContext` y enriquecer
   con lookup en lote.

Esto es **obligatorio antes de la Fase 5** y debe quedar cubierto por pruebas (K4 latencia).
