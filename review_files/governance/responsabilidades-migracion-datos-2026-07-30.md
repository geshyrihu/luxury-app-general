# Responsabilidades en Migración de Datos (2026-07-30)

**Versión:** 1.0  
**Estado:** Vigente  
**Aplica a:** Planes de implementación, refactorización, saneación  
**Objetivo:** Explicitar quién crea, ejecuta y valida migraciones de datos

---

## El Problema

Antes no estaba explícito:
- ❌ ¿Cuándo hay migración de datos?
- ❌ ¿Quién la crea (agentes o Tech Lead)?
- ❌ ¿Dónde va documentada?
- ❌ ¿Quién la ejecuta?
- ❌ ¿Cómo se valida que no hay pérdida de datos?

---

## La Solución: Responsabilidades Claras

### 🤖 AGENTES (Claude, Codex, etc.)

**Tarea: Documentar en el Plan (Sección 3.5)**

Cuándo:
- Identificar cambios de estructura/datos durante análisis
- Documentar en plan ANTES de empezar a codificar

Qué documentar en Sección 3.5:

```markdown
### 3.5.1 Cambios de Estructura
[Tabla: qué tabla, qué cambio, qué riesgo, cómo mitigar]

### 3.5.2 Análisis de Pérdida
[Describir qué datos podrían perderse y cómo evitarlo]

### 3.5.3 Script de Migración (Pseudocódigo)
[Borrador SQL o descripción — Tech Lead lo refina]

### 3.5.4 Validación Post-Migración
[Checklist de qué verificar después]

### 3.5.5 Rollback Plan
[Cómo revertir si falla]
```

**Checklist de agentes:**

- [ ] ¿Hay cambios de estructura? → Sección 3.5 OBLIGATORIA
- [ ] ¿Qué tablas se modifican?
- [ ] ¿Qué riesgos de pérdida hay?
- [ ] ¿Cómo se valida integridad post-migración?
- [ ] ¿Tech Lead asignado explícitamente?

---

### 👨‍💼 TECH LEAD (Tú)

**Tarea: Crear, Testear, Ejecutar, Validar Migraciones**

Cuándo:
- Después de que plan con sección 3.5 está aprobado
- ANTES del sprint de implementación

Qué hacer:

| Paso | Cuándo | Entregable | Validación |
|:---|:---|:---|:---|
| **1. Crear SQL** | Después plan aprobado | `docs/migraciones/YYYYMMDD-*.sql` | Script ejecutable |
| **2. Testear en dev** | Antes sprint | Log de ejecución | Sin errores |
| **3. Validar integridad** | Inmediato post-test | Checklist completado | COUNT, FK, constraints OK |
| **4. Ejecutar en staging** | 1 día antes producción | Confirmación de éxito | Mismo resultado que dev |
| **5. Ejecutar en producción** | Go-live | Backup + log completo | Validación post-ejecución |
| **6. Confirmar PASS** | Inmediato post-ejecución | "Migración exitosa" | Checklist 3.5.4 completado |

**Responsabilidades Tech Lead:**

✅ **Creas el SQL** (basado en borrador de agentes + tu expertise)  
✅ **Creas backup** (antes de cualquier cambio)  
✅ **Ejecutas en dev first** (no directo a producción)  
✅ **Validas integridad** (COUNT, constraints, validaciones negocio)  
✅ **Ejecutas en producción** (solo después de validación)  
✅ **Documentas log** (para auditoría)  
✅ **Armas rollback** (si algo falla)  

---

## Matriz de Responsabilidad

### ¿Quién Identifica Cambios de Datos?

**AMBOS:**
- Agentes: Leen código/requisitos, proponen cambios en plan
- Tech Lead: Valida propuestas, sugiere cambios alternos

---

### ¿Quién Escribe el SQL de Migración?

**TECH LEAD:**
- Agentes pueden escribir pseudocódigo o borrador
- Tech Lead refina, optimiza, agrega validaciones

```
MAL:
Agente escribe SQL → Tech Lead lo ejecuta directamente

BIEN:
Agente documenta "Cambio: Agregar columna X" en sección 3.5
Tech Lead escribe SQL completo con backup, validación, rollback
Tech Lead lo testea en dev
Tech Lead lo ejecuta en producción
```

---

### ¿Quién Ejecuta la Migración?

**SOLO TECH LEAD:**
- NO agentes (no tienen acceso a BD producción)
- NO developers automáticamente
- Tech Lead es responsable único

```
RESPONSABILIDAD EXPLÍCITA EN PLAN:

## Sección 3.5.6 - Comunicación Post-Migración

Tech Lead confirma: "✅ Migración exitosa"
  - Backup realizado
  - Script ejecutado sin errores
  - Validación completa: PASS
  - Integridad datos: OK
```

---

### ¿Quién Valida Que No Hay Pérdida de Datos?

**TECH LEAD:**
- Después de ejecutar, antes de ir a producción

```sql
-- CHECKLIST OBLIGATORIO (Tech Lead):
[ ] Backup completado
[ ] COUNT(filas antes) = COUNT(filas después)
[ ] No hay NULLs inesperados
[ ] Validaciones de negocio: PASS
[ ] Integridad referencial: PASS
[ ] Performance: OK
[ ] Logs de auditoría: intactos
```

---

## Ubicación de Migraciones en el Proyecto

### Dónde se guardan scripts SQL:

```
docs/migraciones/
  ├── YYYYMMDD-[modulo]-[cambio].sql
  ├── 20260730-reservas-agregar-estado-anterior.sql
  ├── 20260730-pagos-desnormalizar-monto.sql
  └── README.md (índice de todas las migraciones)
```

### Dónde se guardan logs de ejecución:

```
docs/reporte_maestro/migraciones/
  ├── 20260730-migracion-log.md
  ├── [contiene: fecha, script, resultado, validaciones, Tech Lead]
```

### Dónde se documenta en el plan:

```
docs/plans/YYYYMMDD-[modulo]-plan.md
  └── Sección 3.5: Migración de Datos
      ├── 3.5.1 Cambios
      ├── 3.5.2 Análisis pérdida
      ├── 3.5.3 Script
      ├── 3.5.4 Validación
      ├── 3.5.5 Rollback
      └── 3.5.6 Comunicación
```

---

## Ejemplos de Responsabilidad

### Escenario 1: Agregar Columna NOT NULL

```
AGENTE (Plan Sección 3.5.1-2):
  "Tabla Users, agregar email_verificado NOT NULL"
  "Riesgo: registros sin email rechazan constraint"
  "Mitigación: backfill con email_verificado=0"

TECH LEAD (Ejecuta):
  1. Crea SQL:
     ALTER TABLE Users ADD email_verificado BIT NOT NULL DEFAULT 0
  2. Testea en dev → PASS
  3. Ejecuta en staging → PASS
  4. Ejecuta en producción → PASS
  5. Valida: COUNT, constraints, lógica de negocio
  6. Confirma: "Migración exitosa"
```

---

### Escenario 2: Desnormalizar Tabla (CRÍTICO)

```
AGENTE (Plan Sección 3.5.1-2):
  "Tabla Reservas, agregar monto_pendiente calculado"
  "Riesgo: CRÍTICO - si cálculo falla, números inconsistentes"
  "Mitigación: validar post-migración que SUM(pagos) = monto_pendiente"
  "Validación: query que identifique filas inconsistentes"

TECH LEAD (Ejecuta):
  1. Crea SQL con validación:
     UPDATE Reservas SET monto_pendiente = (SELECT SUM(monto) FROM Pagos...)
     
  2. Escribe query de validación:
     SELECT * FROM Reservas WHERE monto_pendiente != ...  -- Debe retornar 0 filas
  
  3. Testea en dev:
     - Query de validación retorna 0 filas ✓
     - Performance OK ✓
  
  4. Ejecuta en staging:
     - Mismo resultado que dev ✓
  
  5. Ejecuta en producción:
     - Backup ✓
     - SQL ejecutado ✓
     - Validación retorna 0 filas ✓
  
  6. Confirma: "Migración exitosa, validación PASS, no hay inconsistencias"
```

---

### Escenario 3: Refactorización sin cambios de datos

```
AGENTE (Plan Sección 3.5):
  "No hay cambios de estructura ni datos"
  "Solo refactorización de código"
  "Sección 3.5: No aplica"

TECH LEAD:
  No necesita crear migración
  (Pero SÍ ejecuta tests después de despliegue)
```

---

## Validación: Ejemplos de BIEN vs MAL

### ❌ MAL: Sin Documentar Migración

```
Plan:
  Sección 3: "Agregar tabla Auditoría"
  Sección 4: "Crear migration"
  [SIN SECCIÓN 3.5]

Problema: No hay análisis de pérdida, Tech Lead no sabe qué esperar
```

---

### ✅ BIEN: Migración Documentada Explícitamente

```
Plan Sección 3.5:

3.5.1 Cambios:
  Tabla: Auditoría (nueva)
  Cambio: Crear
  Riesgo: Bajo (creación)

3.5.2 Análisis:
  No hay datos existentes que perder

3.5.3 Script:
  CREATE TABLE Auditoría (...)
  CREATE INDEX idx_usuario ON Auditoría (usuario_id)

3.5.4 Validación:
  - COUNT(Auditoría) = 0 (nueva tabla)
  - Índice existe y funciona

3.5.5 Rollback:
  DROP TABLE Auditoría

3.5.6 Responsable: Tech Lead
```

---

## Checklist: ¿Está Explícito en el Plan?

- [ ] ¿Sección 3.5 existe si hay cambios de datos?
- [ ] ¿Identifica CADA tabla que se modifica?
- [ ] ¿Documenta riesgo de pérdida (específico, no genérico)?
- [ ] ¿Tiene script SQL (o pseudocódigo)?
- [ ] ¿Tiene validación post-migración verificable?
- [ ] ¿Tiene rollback plan?
- [ ] ¿Tech Lead está asignado explícitamente?
- [ ] ¿Sección 10 (Rollback general) referencia backup de 3.5?

---

## FAQ

**P: ¿Agentes pueden escribir SQL de migración?**  
R: Pueden escribir pseudocódigo o borrador en sección 3.5.3. Tech Lead refina y ejecuta.

**P: ¿Puedo ejecutar migración en producción sin testear en dev?**  
R: No. Siempre: dev → staging → producción. Backup en cada paso.

**P: ¿Qué pasa si validación post-migración falla?**  
R: Rollback inmediato. Investigar, ajustar SQL, testear nuevamente.

**P: ¿Se archiva el log de migración?**  
R: Sí, en `docs/reporte_maestro/migraciones/YYYYMMDD-*.md`

**P: ¿Si no hay cambios de datos, necesito sección 3.5?**  
R: No, pero documenta "Sección 3.5: No aplica (código-only)" para dejar explícito.

---

## Referencias

- [Data Migration Protocol](../conventions/operations/data-migration-protocol.md)
- [Plan Agent Instructions - Sección 3.5](../conventions/operations/plan-agent-instructions.md)
- [CONVENTIONS.md §5.9](CONVENTIONS.md)

---

*Documento: responsabilidades-migracion-datos-2026-07-30.md*  
*Versión: 1.0*  
*Vigente desde: 2026-07-30*

