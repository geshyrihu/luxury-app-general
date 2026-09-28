# Auditoría de Módulo: Work Position Schedules

**Fecha:** 2026-09-13
**Módulo:** SharedLuxuryApp / CatalogosGenerales / WorkPositionSchedules
**Auditor:** Agente Orquestador Antigravity (QA Automático y Arquitectura)
**Estado del Código:** Implementado (Backend & Frontend Angular)

## 1. Resumen Ejecutivo
Se ejecutó un análisis "Punta a Punta" sobre la administración de Horarios de Puesto. El módulo exhibe un buen diseño base con uso extensivo de `IsolationLevel.Serializable` para concurrencia en edición. Sin embargo, existen severas brechas en la eliminación lógica y mutación concurrente, con comportamientos destructivos acoplados al borrado HTTP DELETE estándar.

## 2. Matriz de Reglas de Negocio (4 Niveles)

| Nivel | Tipo | Regla | Estado en Código | Cumplimiento |
|-------|------|-------|------------------|--------------|
| Nivel 1 | Invariante | Un horario debe tener días congruentes con el ciclo (7 x dur. sem.) | Validado en `EnsureScheduleIsConsistent`. | 🟡 Parcial (no valida duplicados de un mismo día/semana en la request) |
| Nivel 2 | Flujo / Estado | Reasignación de Puestos ante eliminación de un Horario. | `DeleteWithReplacementAsync` permite transición sana. | 🔴 CRÍTICO (`DeleteAsync` tradicional intercepta y migra a todos en silencio al default schedule). |
| Nivel 3 | Seguridad | El usuario necesita permisos. | `RequireAuthorization("RequireRecruitmentRole")` en API. | ✅ Cumplido (Rutas protegidas) |
| Nivel 4 | Validación | Un día laboral no debe tener propiedades vacías de horas. | Frontend y Backend validan nulos mutuamente. | 🟡 Parcial (Falta comprobación semántica de horas cruzadas si no se soportan nocturnos) |

## 3. Hallazgos (Brechas)

### 🔴 CRÍTICOS (Arquitectura, Integridad y Concurrencia)
1. **Side-Effect Destructivo Oculto en `DeleteAsync`:** La eliminación común y corriente migra a todos los usuarios/puestos al `_defaultScheduleId` sin preguntar. Se debe bloquear el DELETE si hay usos e instruir el uso de `DeleteWithReplacementAsync`.
2. **Race-Condition TOCTOU en `CreateAsync`:** `EnsureNameIsUniqueAsync` corre antes de abrir la transacción `Serializable`. Pueden crearse duplicados bajo alta carga.

### 🟡 ALTOS (Lógica de Negocio y Data)
3. **Peligro de Data Huérfana (Orphaned Constraints):** `DeleteAsync` no incluye los hijos `DiasDeTrabajo` al intentar eliminar. Podría romperse con una FK exception.
4. **Validación Débil de Matriz de Días:** El conteo absoluto `dto.DiasDeTrabajo.Count == expected` no previene arreglos corruptos con días idénticos repetidos (ej: enviar siete Lunes en la semana 1).
5. **Máscara General de Concurrencia (DB Constraint Catch):** Cualquier fallo de índice único en UPDATE es digerido como conflicto de actualización del mismo horario, ocultando al usuario si el nombre enviado colisionó con otro existente.

## 4. Plan de Remediación Priorizado

### Fase 1: Prevención de Corrupción (Backend)
1. Extraer la migración ciega de `DeleteAsync` y lanzar error tipo 409 si `JobPositions` está en uso.
2. Mover la comprobación de nombre (`EnsureNameIsUniqueAsync`) dentro del `using var transaction` en `CreateAsync`.
3. Validar con `.Distinct()` en `EnsureScheduleIsConsistent` para que no puedan enviarse días de la misma semana y número duplicados en el array JSON.

### Fase 2: Consistencia y UX (Frontend & Backend)
1. Incluir el `.Include(x => x.DiasDeTrabajo)` en el método `DeleteAsync` para prevenir Foreign Key Violations asumiendo soft deletes inexistentes o cascade behaviors dependientes del ORM.
2. Afinar la detección de Constraint `2601/2627` en `UpdateAsync` para diferenciar el índice duplicado de nombres de los índices de la propia entidad, retornando los mensajes adecuados.

---
*Este reporte debe ser aprobado por el Tech Lead o el desarrollador usuario antes de que el agente ejecutor CLI implemente el parche.*
