# Protocolo de Migración de Datos y Prevención de Pérdida

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Aplica a:** Planes de implementación, refactorización, saneación y migración de datos  
**Responsable:** Tech Lead (crear y aplicar migraciones), Agentes (documentar en plan)

---

## Propósito

Este protocolo asegura que:

✅ Cualquier cambio que afecte datos tiene migración documentada  
✅ Riesgos de pérdida de datos están identificados ANTES de aplicar  
✅ Tech Lead es responsable explícito de crear y ejecutar migraciones  
✅ Post-migración hay validación verificable  
✅ Rollback es posible si la migración falla

---

## Cuándo Necesitas Migración de Datos

### ✅ SIEMPRE Necesita Migración:

- [ ] Cambio de estructura de tabla (nueva columna, remover campo, rename)
- [ ] Cambio de tipo de dato (string → int, decimal → money)
- [ ] Cambio de restricción (nullable → NOT NULL, unique constraint)
- [ ] Cambio de normalización (desnormalizar tabla, refactorizar relaciones)
- [ ] Migración de datos entre tablas (consolidación)
- [ ] Cambio de validación que afecta datos existentes (ej: email format)
- [ ] Refactorización de lógica de negocio que transforma datos

### ❌ NO Necesita Migración (pero requiere validación):

- [ ] Agregar índice (no cambia datos)
- [ ] Agregar columna con default value (automático)
- [ ] Cambio en lógica de lectura solamente (no toca BD)
- [ ] Refactorización puro código (no datos)

---

## Estructura en el Plan (Sección Nueva: 3.5)

### PLAN - Sección 3.5: Migración de Datos

**Obligatoria si hay cambios de datos.**

```markdown
## 3.5 Migración de Datos & Prevención de Pérdida

### 3.5.1 Cambios de Estructura

| Tabla | Cambio | Tipo | Riesgo | Mitigación |
|:---|:---|:---|:---|:---|
| Reservas | Agregar `estado_anterior` (string) | Agregar columna | Bajo | Default NULL, sin validación |
| Reservas | Rename `status` → `estado` | Rename | CRÍTICO | Migracion + alias en queries |
| Reservas | `created_at` nullable → NOT NULL | Constraint | ALTO | Backfill con GETDATE() |
| Pagos | Desnormalizar `monto_pendiente` | Desnormalizar | CRÍTICO | Validar coherencia post-migración |

### 3.5.2 Análisis de Pérdida de Datos

**Pregunta clave:** ¿Qué datos pueden perderse?

```
RENAME status → estado:
  - Riesgo: Queries viejas fallan (pero NO se pierden datos)
  - Mitigación: Crear alias SQL (CREATE SYNONYM) durante transición

AGREGAR NOT NULL a created_at:
  - Riesgo: Si existen NULLs, migración falla
  - Mitigación: Backfill con GETDATE() ANTES de agregar constraint

DESNORMALIZAR monto_pendiente:
  - Riesgo: CRÍTICO - Si cálculo es incorrecto, números inconsistentes
  - Mitigación: Validación post-migración (SUM(pagos) debe = monto_pendiente)
```

### 3.5.3 Plan de Migración (Ejecutado por Tech Lead)

**Responsable:** Tech Lead (crear SQL, ejecutar, validar)

**Pasos:**

```sql
-- Step 1: Backup
BACKUP DATABASE [LuxuryApp] TO DISK = 'backup-20260730.bak'

-- Step 2: Agregar columna nueva
ALTER TABLE Reservas ADD estado_anterior NVARCHAR(50) NULL

-- Step 3: Copiar datos (si es rename o transformación)
UPDATE Reservas SET estado_anterior = status WHERE status IS NOT NULL

-- Step 4: Agregar constraint si es necesario
ALTER TABLE Reservas ALTER COLUMN estado_anterior NVARCHAR(50) NOT NULL

-- Step 5: Validar integridad
SELECT COUNT(*) as total,
       SUM(CASE WHEN estado_anterior IS NULL THEN 1 ELSE 0 END) as nulls
FROM Reservas
-- ESPERADO: nulls = 0 (si NOT NULL)

-- Step 6: Drop vieja columna (si es rename)
ALTER TABLE Reservas DROP COLUMN status

-- Step 7: Crear alias para compatibilidad (transitorio)
CREATE SYNONYM status FOR estado_anterior
```

### 3.5.4 Validación Post-Migración (Checklist)

**Ejecutado ANTES de ir a producción:**

- [ ] Backup completado y verificado
- [ ] Migración ejecutada sin errores
- [ ] COUNT(filas) antes = COUNT(filas) después
- [ ] No hay NULLs inesperados (si hay constraint)
- [ ] Validaciones de negocio pasan (ej: monto_pendiente = SUM(pagos))
- [ ] Queries críticas retornan datos correctos
- [ ] Performance: índices siguen siendo eficientes
- [ ] Logs de auditoría están intactos (no borrados)

### 3.5.5 Rollback Plan

**Si validación falla:**

```
RESTORE DATABASE [LuxuryApp] FROM DISK = 'backup-20260730.bak'
-- Notificar a Tech Lead
-- Investigar qué falló
-- Ajustar migración
-- Reintentar
```

### 3.5.6 Comunicación Post-Migración

- [ ] Tech Lead confirma: "Migración exitosa, validación PASS"
- [ ] Log de migración archivado (para auditoría)
- [ ] Devs notificados si hay cambios en modelo (.NET)
- [ ] Frontend actualizado si hay cambios en API/DTO

---

## Responsabilidades Explícitas

### 👨‍💼 Tech Lead (Create & Execute)

| Tarea | Cuándo | Entregable |
|:---|:---|:---|
| Crear script SQL | Antes de sprint de implementación | archivo `.sql` en `docs/migraciones/` |
| Testear en dev | Después de crear script | Validación log |
| Ejecutar en staging | 1 día antes de producción | Confirmación de éxito |
| Ejecutar en producción | Go-live | Backup + log completo |
| Validar integridad | Inmediato post-migración | Checklist completado |

### 🤖 Agentes (Document in Plan)

| Tarea | Cuándo | Entregable |
|:---|:---|:---|
| Identificar cambios de datos | FASE 0 / Sección 3 del plan | Lista de tablas/campos afectados |
| Documentar riesgos | Sección 3.5.2 | Análisis de pérdida posible |
| Proponer mitigaciones | Sección 3.5.2 | Validaciones específicas |
| Crear borrador SQL | Sección 3.5.3 | Pseudocódigo SQL (Tech Lead refina) |

---

## Análisis de Pérdida de Datos: Matriz de Riesgos

### Tipos de Cambio × Severidad

| Cambio | Riesgo | Evidencia de Pérdida | Mitigación |
|:---|:---|:---|:---|
| **Agregar columna** | Bajo | Ninguna (se agrega NULL) | Usar default value |
| **Rename columna** | Bajo | Ninguna (solo rename) | Crear alias transitorio |
| **Remover columna** | 🔴 CRÍTICO | Datos borrados permanentemente | Backup, validar antes de DROP |
| **Cambiar tipo dato** | Alto | Conversión fallida, truncado | Test conversión, validar rango |
| **Agregar NOT NULL** | Alto | NULL existentes rechazan INSERT | Backfill, validar post-migración |
| **Desnormalizar tabla** | 🔴 CRÍTICO | Inconsistencia si cálculo falla | Validación exhaustiva post-migración |
| **Consolidar tablas** | 🔴 CRÍTICO | Datos huérfanos si FK falla | Verificar integridad referencial |
| **Cambiar restricción unique** | Alto | Duplicados rechazados | Identificar duplicados, resolver antes |

---

## Ejemplos de Migración por Caso

### Caso 1: Agregar Columna (Bajo Riesgo)

```sql
-- PLAN Sección 3.5:
Tabla: Reservas
Cambio: Agregar `created_by_user_id` (GUID, nullable)
Riesgo: Bajo (no toca datos existentes)
Validación: NULL es permitido, llenar después

-- SCRIPT SQL:
ALTER TABLE Reservas ADD created_by_user_id UNIQUEIDENTIFIER NULL
-- Llenar después con datos de auditoría (async batch)
```

---

### Caso 2: Rename Columna (Medio Riesgo)

```sql
-- PLAN Sección 3.5:
Tabla: Reservas
Cambio: Rename `status` → `estado` (compatibilidad con español)
Riesgo: Código viejo falla si no usa alias
Validación: Queries antiguas siguen funcionando vía alias

-- SCRIPT SQL (ejecuta Tech Lead):
-- Step 1: Crear alias
EXEC sp_rename 'Reservas.status', 'estado'

-- Step 2: Crear synonym para compatibilidad
CREATE SYNONYM Reservas.status FOR Reservas.estado

-- Step 3: Validar
SELECT * FROM Reservas WHERE status IS NOT NULL -- Debe funcionar

-- Step 4: Remover alias después (cuando todo está actualizado)
DROP SYNONYM Reservas.status
```

---

### Caso 3: Desnormalizar Tabla (CRÍTICO)

```sql
-- PLAN Sección 3.5:
Tabla: Reservas + Pagos
Cambio: Agregar `monto_pendiente` calculado en Reservas
Riesgo: 🔴 CRÍTICO - Si cálculo falla, números inconsistentes
Validación: POST-MIGRACIÓN DEBE verificar integridad

-- SCRIPT SQL:
ALTER TABLE Reservas ADD monto_pendiente DECIMAL(10,2) NULL

-- Calcular valores iniciales
UPDATE Reservas 
SET monto_pendiente = (
  SELECT ISNULL(SUM(monto), 0) 
  FROM Pagos 
  WHERE Pagos.reserva_id = Reservas.id
)

-- VALIDACIÓN POST-MIGRACIÓN (CRÍTICA):
SELECT r.id, r.monto_total, r.monto_pendiente,
       ISNULL(SUM(p.monto), 0) as suma_pagos,
       CASE WHEN r.monto_pendiente = r.monto_total - ISNULL(SUM(p.monto), 0) 
            THEN 'OK' ELSE 'FALLA' END as estado
FROM Reservas r
LEFT JOIN Pagos p ON p.reserva_id = r.id
GROUP BY r.id
HAVING CASE WHEN r.monto_pendiente = r.monto_total - ISNULL(SUM(p.monto), 0) 
            THEN 'OK' ELSE 'FALLA' END = 'FALLA'

-- Si hay filas, ROLLBACK inmediato
```

---

## Checklist para Plan (Sección 3.5)

Antes de completar el plan, verificar:

### Si hay cambios de datos:

- [ ] Sección 3.5 está presente y completa
- [ ] Tabla de cambios documenta cada modificación
- [ ] Tabla de análisis de pérdida identifica riesgos
- [ ] Cada riesgo tiene mitigación específica (no genérica)
- [ ] Script SQL existe (en `docs/migraciones/YYYYMMDD-*.sql`)
- [ ] Script tiene Step 1-7 (backup, cambio, validación, rollback)
- [ ] Checklist post-migración es verificable (no "parece correcto")
- [ ] Tech Lead está asignado explícitamente

### Si NO hay cambios de datos:

- [ ] Sección 3.5 dice: "No aplica (código-only refactorización)"
- [ ] O sección 3.5 describe qué será validado (ej: performance)

---

## Integración en el Plan Formal

### Ubicación en Secciones 1-11:

| Sección | Contenido | Referencia 3.5 |
|:---|:---|:---|
| 3. Arquitectura | Nuevas tablas, campos | "Ver 3.5 para migración" |
| 4. Backlog | Tarea "Create migration" | "Ver 3.5 para SQL exacto" |
| 5. Fases Ejecución | Sprint con BD changes | "Incluye ejecutar 3.5" |
| 7. Riesgos | Riesgo de pérdida datos | "Mitigado por 3.5" |
| 10. Rollback Plan | Cómo revertir datos | Referencia backup 3.5 |

---

## FAQ

**P: ¿Siempre necesito migración si agrego una columna?**  
R: Solo si la columna tiene `NOT NULL` o datos existentes necesitan transformación. Si es nullable, no necesita migración formal.

**P: ¿Puedo crear la migración durante la implementación?**  
R: No. Migración se crea ANTES (parte del plan), se testea en dev, se ejecuta en producción. Crear durante es arriesgado.

**P: ¿Quién escribe el SQL?**  
R: Tech Lead. Los agentes documentan QUÉ cambiar (en 3.5.1-2), Tech Lead escribe CÓMO (3.5.3).

**P: ¿Qué pasa si la migración falla en producción?**  
R: Rollback inmediato usando backup (3.5.5). Investigar falla, ajustar, testear nuevamente.

**P: ¿Dónde archivamos la migración?**  
R: El SQL en `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-plan-[modulo]-[submodulo]-migracion.sql` y el log de ejecución `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-changelog-[modulo]-[submodulo]-migracion.md` (estructura plana §6ter).

---

## Plantilla Rápida para Sección 3.5

```markdown
## 3.5 Migración de Datos & Prevención de Pérdida

**Responsable:** Tech Lead (crear SQL, ejecutar, validar)

### Cambios de Estructura

| Tabla | Cambio | Riesgo | Mitigación |
|---|---|---|---|
| [Tabla] | [Cambio] | [Riesgo] | [Cómo evitar pérdida] |

### Análisis de Pérdida

[Describir qué datos podrían perderse y cómo evitarlo]

### Script de Migración

[Pseudocódigo SQL o referencia a docs/migraciones/]

### Validación Post-Migración

- [ ] Backup verificado
- [ ] Migración ejecutada sin errores
- [ ] COUNT(filas) igual antes y después
- [ ] Validaciones de negocio pasan
- [ ] Performance aceptable
```

---

## Referencias

- [Plan Agent Instructions](./plan-agent-instructions.md) — Sección 3.5 integrada
- [CONVENTIONS.md](../CONVENTIONS.md) — Reglas transversales
- Auditoría post-migración: reporte en `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo]-migracion.md` (estructura plana §6ter)

---

*Protocolo: DATA_MIGRATION_PROTOCOL.md*  
*Versión: 1.0*  
*Vigente desde: 2026-07-30*

