# README - Módulo: LuxuryAppLogs

**Tipo:** A) Módulo nuevo (infraestructura de datos)
**Estado:** 🟡 Plan en revisión (PASO 5 pendiente de aprobación)
**Fecha:** 2026-08-18

## Objetivo
Separar las tablas de auditoría `UserActivities` y `Logs` de la BD transaccional
`LuxuryBuildingGroup` (SQL Server) hacia una nueva BD aislada **`LuxuryAppLogs` (SQL Server)**,
migrar los datos definidos y eliminarlas de la BD original.

## Documentos del módulo
| Archivo | Contenido |
|---|---|
| `01-discovery-cuestionario.md` | Decisiones aclaradas (solo UserActivities ≥2026-01-01; Logs nada; SQL Server) |
| `01b-entidad-estructura.md` | Reconocimiento de entidades existentes |
| `02-business-rules-analysis.md` | FASE 0 (Problema, KPIs, RN 4 niveles, Pre-Mortem, Flujos) |
| `03-riesgos-dependencias.md` | Matriz de riesgos + dependencias |
| `04-implementation-plan.md` | Plan formal de 11 secciones + §3.5 migración de datos |

## Decisiones clave (dueño)
- ✅ Migrar **solo** `UserActivities` con `Timestamp >= 2026-01-01`.
- ❌ NO migrar datos de `Logs`.
- ✅ `LuxuryAppLogs` = **SQL Server** (catálogo nuevo, mismo servidor); Serilog escribe ahí.

## Tracking
Ver `CHECKLIST.md`.
