# CHANGELOG: Integración FASE 0 al Flujo de Planes (2026-07-30)

**Fecha:** 2026-07-30  
**Estado:** Vigente  
**Afecta a:** Todos los agentes que crean planes o auditan módulos  
**Aprobado por:** Tech Lead

---

## Resumen Ejecutivo

Se ha **formalizado FASE 0 (Business Rules Discovery)** como una etapa **obligatoria y documentada** que debe preceder a cualquier plan de módulo nuevo.

**Impacto:**
- ✅ Todos los planes deben incluir FASE 0
- ✅ FASE 0 debe completarse ANTES de escribir las secciones 1-11 del plan
- ✅ Las reglas de negocio (RN-MOD-NNN) se clasifican en 4 niveles jerárquicos (no planos)
- ✅ Auditoría verifica que el código cumple cada regla de FASE 0

---

## Qué Cambió

### 1. Nuevo Documento: `fase-0-business-rules-discovery.md`

**Ubicación:** `./operations/fase-0-business-rules-discovery.md`

**Contenido:**
- Propósito y cuándo aplicar FASE 0
- 3 sub-bloques: Problem Statement, Matriz RN (4 niveles), Pre-Mortem + Flujos
- Guía operativa (20 + 45 + 45 = 2 horas)
- Checklist de completitud
- Mapeo de FASE 0 → Secciones 1-11 del plan

**Lectura obligatoria:** Todos los agentes que creen planes.

---

### 2. Actualización: `plan-creation-protocol.md`

**Cambio:** Reemplacé la vaga "Fase de preparación" por una sección formal y detallada de FASE 0.

**Antes:**
```
"Antes de cerrar un plan, el agente debe dejar identificado:
- problema o necesidad concreta
- reglas de negocio sensibles..."
```

**Después:**
```
## FASE 0: Pre-Planeación Obligatoria

### 0.1 Problem Statement + KPIs
### 0.2 Matriz de Reglas de Negocio (4 Niveles Jerárquicos)
### 0.3 Riesgos + Pre-Mortem + Flujos

[Detalles completos...]

Tiempo estimado: ~2 horas
```

---

### 3. Verificación: `plan-agent-instructions.md`

✅ **YA TENÍA FASE 0 INTEGRADA** (desde 2026-07-28)

- Secciones 0.1, 0.2, 0.3 están presentes
- Mapeo a plan formal está documentado
- Estructura de 4 niveles de RN está activa

**Conclusión:** No necesitó cambios (ya estaba adelantado).

---

### 4. Verificación: `AUDIT_AGENT_INSTRUCTIONS.md`

✅ **YA TENÍA TAXONOMÍA DE 4 NIVELES** (desde sesión anterior)

- Nivel 1: Invariante Dominio
- Nivel 2: Flujo/Estados
- Nivel 3: Seguridad/RBAC
- Nivel 4: Validación Datos

**Conclusión:** Auditoría y plan ahora usan la MISMA taxonomía → trazabilidad garantizada.

---

### 5. Actualización: `CONVENTIONS.md §5.8 (Auditoría)`

**Agregué:**
- Referencia clara a los 4 niveles de RN
- Énfasis en que auditoría verifica que cada RN está en código
- Link a AUDIT_AGENT_INSTRUCTIONS.md

**Antes:**
```
## 5.8 Auditoria
- [Audit Module Conventions]
- [Audit Checklist]
```

**Después:**
```
## 5.8 Auditoria

**Regla clave:** Toda auditoría de módulo verifica Reglas de Negocio (RN-MOD-NNN) 
clasificadas en 4 niveles jerárquicos:

1. Nivel 1: Invariantes de Dominio
2. Nivel 2: Flujo y Estados
3. Nivel 3: Seguridad/Autorización
4. Nivel 4: Validación de Datos

Estos 4 niveles **deben originarse en FASE 0** y **verificarse en auditoría**.
```

---

### 6. Actualización: `CONVENTIONS.md §5.9 (Operación)`

**Agregué:** Flujo completo y explícito

```
## 5.9 Operacion

### Flujo Obligatorio: Módulo Nuevo → FASE 0 → Plan → Auditoría

1. Discovery Questionnaire
   ↓
2. FASE 0: Pre-Planeación
   ├─ 0.1 Problem Statement + KPIs
   ├─ 0.2 Matriz Reglas de Negocio (4 niveles jerárquicos)
   └─ 0.3 Pre-Mortem + Flujos
   ↓
3. Plan Formal (11 secciones)
   ├─ Secciones 1-3: alimentadas por FASE 0
   └─ Secciones 4-11: implementación detallada
   ↓
4. Auditoría de Módulo (con trazabilidad RN)
```

**Regla clave:** "Ningún plan puede iniciarse sin completar FASE 0."

---

## Flujo de Trabajo Completo (ANTES vs DESPUÉS)

### ANTES (desorganizado)

```
Solicitud módulo
   ↓
Plan directo (sin contexto completo)
   ↓
Implementación (muchas idas y vueltas)
   ↓
Auditoría (descubre reglas faltantes)
   ↓
Remediación (costo alto)
```

### DESPUÉS (riguroso)

```
Solicitud módulo
   ↓
Discovery Questionnaire (15-30 min)
   ↓
FASE 0: Business Rules Discovery (2 horas)
   ├─ Problem Statement + KPIs (claros, medibles)
   ├─ Matriz RN (4 niveles, mapeadas a código)
   └─ Pre-Mortem + Flujos (riesgos identificados)
   ↓
Plan Formal (3 horas, basado en FASE 0)
   ├─ Secciones 1-3 (copian/expanden FASE 0)
   └─ Secciones 4-11 (detalles de implementación)
   ↓
Implementación (siguiendo plan)
   ↓
Auditoría (verifica trazabilidad FASE 0 → código)
   ├─ Cada RN está en código (RN-MOD-NNN)
   ├─ 4 niveles respetados
   └─ 0 sorpresas
   ↓
✅ Producción (confianza, sin remediación)
```

---

## Checklist de Adopción para Agentes

### ✅ Cuando creo un plan nuevo:

- [ ] Antes de nada, completo **FASE 0** (no empiezo con secciones 1-11)
- [ ] Leo `./operations/fase-0-business-rules-discovery.md`
- [ ] Lleno los 3 sub-bloques (Problem, RN, Pre-Mortem)
- [ ] Cada RN numerada `RN-[MOD]-NNN` y clasificada en Nivel 1-4
- [ ] Mapeo cada RN a ubicación de código (backend/frontend)
- [ ] Defino criterios de PASO para flujos (Happy/Sad/Edge)
- [ ] Secciones 1-11 del plan se basan en FASE 0 (no van por otro lado)

### ✅ Cuando audito un módulo:

- [ ] Leo `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`
- [ ] Busco matriz RN con 4 niveles
- [ ] Verifico cada RN está en código (archivo:línea)
- [ ] Valido que FASE 0 existe (documento `02-business-rules-analysis.md` o similar)
- [ ] Creo trazabilidad: RN-MOD-NNN → Sección 3 Plan → Código verificado

### ✅ Comunicación:

- Si plan NO tiene FASE 0 documentada → **RECHAZA** (no continúes)
- Si auditoría encuentra RN sin ubicación de código → **FALLO** (plan remediation)
- Si veas contradicción entre FASE 0 y código → **ESCALA** (Tech Lead)

---

## Archivos Modificados / Creados

### Creados:

| Archivo | Tipo | Ubicación | Status |
|:---|:---|:---|:---|
| `fase-0-business-rules-discovery.md` | Documento oficial | `./operations/` | ✅ |
| `changelog-fase-0-integration.md` | Este archivo | `./` | ✅ |

### Modificados:

| Archivo | Sección | Cambio | Status |
|:---|:---|:---|:---|
| `plan-creation-protocol.md` | FASE 0 | Reemplazó vago por formal | ✅ |
| `CONVENTIONS.md` | §5.8 Auditoría | Agregó 4 niveles, link a AUDIT_AGENT_INSTRUCTIONS | ✅ |
| `CONVENTIONS.md` | §5.9 Operación | Agregó flujo completo, link a fase-0-*.md | ✅ |

### Ya actualizados (sin cambios):

| Archivo | Razón | Status |
|:---|:---|:---|
| `plan-agent-instructions.md` | Ya tenía FASE 0 desde 2026-07-28 | ✅ |
| `AUDIT_AGENT_INSTRUCTIONS.md` | Ya tenía 4 niveles de RN | ✅ |

---

## Próximos Pasos para Agentes

### 1. Lectura Requerida (hoy)

- [ ] `CONVENTIONS.md` completo (10 min)
- [ ] `CONVENTIONS.md §5.9` específicamente (5 min)
- [ ] `fase-0-business-rules-discovery.md` completo (30 min)
- [ ] `plan-agent-instructions.md` completo (20 min)

### 2. Primer Plan Nuevo (aplicar FASE 0)

Cuando se solicite un módulo nuevo, seguir flujo:
```
1. Completa 01-discovery-questionnaire.md
2. Completa 02-business-rules-analysis.md (FASE 0)
3. Espera aprobación Tech Lead
4. Completa 03-preliminary-architecture.md
5. Completa 04-implementation-plan.md (11 secciones)
6. Genera 05-module-documentation.md
7. Auditoría verifica trazabilidad FASE 0 → código
```

### 3. Auditoría de Módulo Existente (nuevo enfoque)

Si auditas un módulo que no tiene FASE 0:
```
1. Busca qué documentación existe
2. Si no hay, propón crear FASE 0 retroactivamente
3. Extrae de código (reglas de negocio que ya existen)
4. Mapea a 4 niveles
5. Crea plan de remediación si hay brechas
```

---

## Preguntas Frecuentes

### ¿FASE 0 es obligatorio para TODOS los cambios?

**NO.** Solo para:
- ✅ Módulos nuevos
- ✅ Migraciones mayores
- ✅ Características transversales

**NO aplica:**
- ❌ Bug fixes aislados
- ❌ Refactoring local
- ❌ Actualización de dependencias

### ¿Qué pasa si NO completo FASE 0?

Plan será **rechazado** por Tech Lead. Deberás:
1. Completar FASE 0
2. Resubmitir plan
3. Tech Lead revalida

### ¿FASE 0 toma mucho tiempo?

~2 horas para un módulo mediano. Ahorra:
- 5-10 horas en plan confuso
- 20-40 horas en implementación errática
- 10-15 horas en remediación

**ROI:** 2 horas ahora = 35-65 horas ahorradas después.

### ¿Los 4 niveles de RN son obligatorios?

**SÍ.** Todo módulo tiene reglas en los 4 niveles:
- Nivel 1: siempre hay restricciones inmutables
- Nivel 2: siempre hay estados y flujos
- Nivel 3: siempre hay seguridad/RBAC
- Nivel 4: siempre hay validaciones de datos

Si un nivel parece vacío, probablemente te falta contexto → vuelve al descubrimiento.

---

## Validación Técnica

### Verificar que los cambios están en vigor:

```bash
# Verificar FASE 0 existe
ls -la ./operations/fase-0-business-rules-discovery.md

# Verificar que plan-creation-protocol.md tiene FASE 0
grep -n "FASE 0: Pre-Planeación Obligatoria" ./operations/plan-creation-protocol.md

# Verificar CONVENTIONS.md §5.8 tiene 4 niveles
grep -n "Nivel 1: Invariantes de Dominio" CONVENTIONS.md

# Verificar CONVENTIONS.md §5.9 tiene flujo completo
grep -n "Flujo Obligatorio" CONVENTIONS.md
```

---

## Impacto en Herramientas

### conventions-viewer

El viewer debe actualizarse para mostrar:
- [ ] FASE 0 como etapa principal (no subsección)
- [ ] Los 4 niveles de RN como taxonomía oficial
- [ ] Ejemplos de RN-MOD-NNN numeración
- [ ] Link a `fase-0-business-rules-discovery.md`

*Acción pendiente: Actualizar conventions-viewer después de esta integración.*

---

## Aprobación y Vigencia

- **Aprobado por:** Tech Lead
- **Vigente desde:** 2026-07-30
- **Próxima revisión:** Cuando se integre un nuevo agente o cambio mayor a FASE 0
- **Contacto para preguntas:** Tech Lead

---

## Resumen de Trazabilidad

**Arquitectura del cambio:**

```
CONVENTIONS.md
  ├─ §5.8 Auditoría (4 niveles RN)
  └─ §5.9 Operación (Flujo: Discovery → FASE 0 → Plan → Auditoría)
       └─ fase-0-business-rules-discovery.md (NUEVA - fuente oficial)
            └─ plan-creation-protocol.md (ACTUALIZADO - referencias FASE 0)
                 └─ plan-agent-instructions.md (YA VIGENTE - implementación detallada)
                      └─ AUDIT_AGENT_INSTRUCTIONS.md (YA VIGENTE - verifica FASE 0)
```

**Garantía:** Si sigues cada documento en el orden correcto, todas las reglas se cumplen sin excepciones.

---

*Documento: changelog-fase-0-integration.md*  
*Versión: 1.0*  
*Fecha: 2026-07-30*  
*Estado: Vigente*

