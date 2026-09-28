# 01 - Cuestionario de Discovery (PASO 1)

**Módulo:** LuxuryAppLogs
**Fecha:** 2026-08-18
**Facilitador:** Agente de planeación (skill planeacion-modulos)

---

## Identificación del trabajo

| Ítem | Valor |
|---|---|
| Tipo | **A) Crear módulo nuevo** (infraestructura de datos: nueva BD `LuxuryAppLogs`) |
| Backend (nuevo proyecto) | `api/LuxuryApp.Infrastructure.Logs/` (contexto `LuxuryAppLogsDbContext`) |
| Backend (consumidores existentes) | `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/System-AuditLogs/*` |
| Frontend | Sin cambios de contrato (endpoints/DTOs se conservan); revisar `client/angular` en PASO 3 |
| Objetivo (1 frase) | Separar las tablas `UserActivities` y `Logs` de la BD `LuxuryBuildingGroup` hacia una nueva BD `LuxuryAppLogs` (SQL Server), migrar datos y eliminarlas de la BD original. |

---

## Respuestas del dueño del módulo (1 pregunta a la vez)

### Q1 — Alcance de migración de datos (tabla `Logs`)
**Pregunta:** "migrar los datos de las tablas actuales UserActivities y Logs, de logs no importar nada" — ¿qué significa para `Logs`?
**Respuesta del dueño:** *"Solo migrar datos de la tabla `UserActivities` con fechas de enero 2026 en adelante; lo demás no, y de `Logs` nada."*

**Interpretación registrada:**
- ✅ Migrar **solo** filas de `UserActivities` donde `Timestamp >= 2026-01-01` (00:00 UTC).
- ❌ NO migrar ningún dato de la tabla `Logs` (se crea vacía en `LuxuryAppLogs` para nuevos registros de Serilog).
- ❌ NO migrar filas de `UserActivities` anteriores a enero 2026.

### Q2 — Proveedor y redireccionamiento de Serilog
**Pregunta:** ¿Cómo se configura la nueva BD `LuxuryAppLogs` y a dónde debe apuntar Serilog?
**Respuesta del dueño (revisada):** *"SQL Server (en lugar de PostgreSQL)."*

**Interpretación registrada:**
- ✅ `LuxuryAppLogs` es **SQL Server** (nueva connection string `LuxuryAppLogsConnection`, SQL Server; mismo servidor que `LuxuryBuildingGroup`).
- ✅ Serilog escribe `Logs` en `LuxuryAppLogs` (sink `MSSqlServer`, `AutoCreateSqlTable`).
- 💡 Al ser el mismo proveedor, la migración de `UserActivities` puede hacerse con T-SQL `INSERT...SELECT` entre catálogos (origen `LuxuryBuildingGroup` → destino `LuxuryAppLogs`).

---

## Supuestos del agente (a validar por Tech Lead)

- La BD `LuxuryBuildingGroup` actual es SQL Server; `LuxuryAppLogs` será SQL Server (mismo servidor) ⇒ migración entre catálogos SQL Server (más simple que cross-provider).
- El esquema de `UserActivity` se conserva idéntico (mismo `Id` Guid para trazabilidad).
- El esquema de `Logs` lo define Serilog; se replica la configuración de columnas actual al sink SQL Server.
- El filtro de fecha se aplica en **UTC** para evitar pérdida por zona horaria.

---

## GAPs / observaciones para FASE 0

- La navegación `UserActivity.ApplicationUser` (FK) **no puede existir** en la nueva BD ⇒ se elimina; se conserva `ApplicationUserId` (string).
- La eliminación física de `UserActivities` en `LuxuryBuildingGroup` es **irreversible** (DROP) ⇒ requiere validación previa y backup.
- `Logs` en `LuxuryBuildingGroup` hoy no es tabla EF (Serilog la crea) ⇒ su eliminación se hace por SQL fuera de migraciones EF, tras confirmar que Serilog ya no escribe ahí.
