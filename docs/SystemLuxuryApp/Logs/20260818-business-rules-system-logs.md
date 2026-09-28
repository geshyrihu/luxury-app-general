# 02 - Análisis de Reglas de Negocio (FASE 0)

**Módulo:** LuxuryAppLogs
**Fecha:** 2026-08-18
**Formato canónico:** `fase-0-business-rules-discovery.md`

---

## 0.1 Problem Statement + KPIs

> Actualmente, el equipo de operaciones y auditoría sufre de **acoplamiento de datos de auditoría
> (UserActivities y Logs) dentro de la BD transaccional `LuxuryBuildingGroup`**, lo que resulta en
> riesgo de crecimiento descontrolado, complicación de backups/restauraciones y falta de aislamiento
> de datos sensibles (PII en logs de actividad), cuando intenta escalar o cumplir políticas de retención.

### KPIs

| # | KPI | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|---|
| K1 | Filas `UserActivities` (Timestamp ≥ 2026-01-01) migradas sin pérdida | N (a contar en dev) | 100% de N | Cutover | `COUNT` origen == `COUNT` destino (por Id) |
| K2 | Filas `Logs` históricas migradas | — | 0 (por diseño) | Cutover | `COUNT` destino == 0 histórico |
| K3 | Disponibilidad de escritura de Logs post-cutover | Servicio up | 0 downtime de escritura Serilog | Inmediato | Serilog sigue escribiendo en `LuxuryAppLogs` |
| K4 | Latencia p95 de lectura de historial de actividad | actual | mantener (≤ 500 ms) | Post-cutover | prueba de carga endpoint historial |
| K5 | Referencias residuales a `ApplicationDbContext.UserActivity/Log` en código | varias | 0 | Post-remoción | grep + compilación |

---

## 0.2 Matriz de Reglas de Negocio (4 niveles)

### Nivel 1 — Invariantes de Dominio (restricciones inmutables)

| RN | Regla | Código / Ubicación |
|---|---|---|
| RN-LOG-001 | Tras el cutover, `LuxuryAppLogs` es la **única** fuente de verdad para `UserActivities` y `Logs`. | `LuxuryAppLogsDbContext` (nuevo proyecto) |
| RN-LOG-002 | `UserActivity` **no** tiene FK a `ApplicationUser`; `ApplicationUserId` es string denormalizado. | `UserActivity.cs` (movido, sin navegación) |
| RN-LOG-003 | `UserActivity.Id` es Guid y se **preserva** en la migración (trazabilidad). | `GuidIdEntity.Id = Guid.CreateVersion7()` |

### Nivel 2 — Flujo y Estados (ciclo de vida, transiciones válidas)

| RN | Regla | Código / Ubicación |
|---|---|---|
| RN-LOG-004 | La escritura de `UserActivity` ocurre **solo** vía filtros/servicio hacia `LuxuryAppLogsDbContext`. | `LogUserActivityFilter*`, `UserActivityService` |
| RN-LOG-005 | Serilog escribe `Logs` **exclusivamente** en `LuxuryAppLogs` (SQL Server) tras cutover. | `DatabaseProviderServiceExtensions.WriteToConfiguredDatabase` |
| RN-LOG-006 | La migración de `UserActivities` incluye **únicamente** filas con `Timestamp >= 2026-01-01` (UTC). | Script de migración (PASO 4, Fase 3) |
| RN-LOG-007 | Los `Logs` históricos **no** se migran (decisión de negocio). | — |

### Nivel 3 — Seguridad / Autorización (RBAC, protección de datos)

| RN | Regla | Código / Ubicación |
|---|---|---|
| RN-LOG-008 | La lectura de `Logs` y del historial de actividad requiere rol administrativo (RBAC existente). | `LogApp` / `UserActivityHistory` endpoints |
| RN-LOG-009 | `UserActivity` contiene PII (IP, UserAgent, geolocalización, RequestBody) ⇒ sujeto a retención y no debe exponerse sin RBAC. | DTOs de historial |
| RN-LOG-010 | La nueva BD `LuxuryAppLogs` debe tener su propia connection string y no compartir credenciales con `LuxuryBuildingGroup`. | `appsettings.json` (`LuxuryAppLogsConnection`) |

### Nivel 4 — Validación de Datos (formatos, límites, constraints)

| RN | Regla | Código / Ubicación |
|---|---|---|
| RN-LOG-011 | `UserActivity.Timestamp` se almacena siempre en **UTC**. | Conversor en `LuxuryAppLogsDbContext.OnModelCreating` |
| RN-LOG-012 | `Country/Region/City` respetan `MaxLength(100)` al migrar. | `UserActivity.cs` atributos |
| RN-LOG-013 | El esquema de `Logs` en destino debe coincidir exactamente con el que genera Serilog (SQL Server). | `Log.cs` mapping + config sink |
| RN-LOG-015 | `UserActivityHistoryAppService` **no** puede hacer join SQL a `ApplicationUser` (BD distinta): debe resolver usuario vía lookup dual de contexto (`LuxuryAppLogsDbContext` + `ApplicationDbContext`). | `UserActivityHistoryAppService` (reescritura) |

---

## 0.3 Pre-Mortem + Flujos

### Pre-Mortem (asumimos que fue un desastre en producción)

| # | Causa raíz | Señal | Mitigación |
|---|---|---|---|
| PM-1 | Serilog apunta a BD/cadena inexistente ⇒ se pierden logs silenciosamente | `AutoCreateSqlTable` falla o logs no aparecen | Smoke test de escritura + `AutoCreateSqlTable=true` antes del cutover |
| PM-2 | Pérdida de filas por zona horaria en el filtro de fecha | `COUNT` destino < origen en el rango | Filtrar `Timestamp` en UTC; validación por `Id` |
| PM-3 | DROP prematuro de `UserActivities` en `LuxuryBuildingGroup` antes de validar | Irreversible, datos perdidos | Fase de DROP separada y posterior a validación + backup |
| PM-4 | Historial se rompe por FK/navegación eliminada | Endpoint de historial falla o joins rotos | Auditoría de usos de `UserActivity` (grep) + lookup separado de usuario |

### Flujos (Happy / Sad / Edge)

- **F1 (Happy):** Arranque → Serilog crea `Logs` en SQL Server → requests generan `UserActivity` en SQL Server → historial lee de SQL Server. ✅
- **F2 (Sad):** Caída de SQL Server ⇒ escritura `UserActivity` falla → el filtro hace `catch` y `LogError`, **no interrumpe** el request (comportamiento actual preservado). ⚠️
- **F3 (Edge):** Migración parcial por timeout ⇒ reanudable por lotes (`Id` > último migrado); validación `COUNT` detecta el gap. 🔁
- **F4 (Edge):** Usuario consulta historial previo a 2026 ⇒ no existe en nuevo DB (por diseño, RN-LOG-006). 📭
