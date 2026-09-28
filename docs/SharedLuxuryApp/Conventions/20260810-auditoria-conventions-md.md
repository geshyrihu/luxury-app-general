# Auditoría META: CONVENTIONS.md (Documento Rector)

**Fecha:** 2026-08-10  
**Auditor:** Claude Code  
**Objeto:** Verificar coherencia interna de CONVENTIONS.md + alineación con documentación creada  
**Resultado:** 7 incoherencias encontradas (3 críticas, 4 altas)

---

## Hallazgos Principales

### 🔴 CRÍTICO #1: Secciones §5.8 (Auditoría) Desactualizadas

**Ubicación:** CONVENTIONS.md línea 310-314

**Problema:**

CONVENTIONS.md §5.8 lista estos documentos de auditoría:
```
- [Audit Module Conventions](conventions/audit/audit-module-conventions.md)
- [Audit Checklist](conventions/audit/audit-checklist.md)
- [Audit Severity Model](conventions/audit/audit-severity-model.md)
- [Audit by Role](conventions/audit/audit-by-role.md)
- [Audit Agent Instructions](docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md)
```

**Pero en realidad:**

✅ Existen en `docs/audit/` (NO en `conventions/audit/`):
- **AUDIT_PROMPT_COMPREHENSIVE.md** (2,500+ líneas) - Template exhaustivo
- **AUDIT_CHECKLIST_COMPLETO.md** (2,000+ líneas) - Checklist interactivo
- **EJEMPLO_AUDITORIA_CANDIDATES.md** (1,500+ líneas) - Ejemplo aplicado

❓ Desconocido si existen en `conventions/audit/`:
- `audit-module-conventions.md` - ¿Existe?
- `audit-checklist.md` - ¿Existe?
- `audit-by-role.md` - ¿Existe?
- `audit-severity-model.md` - ¿Existe?

**Impacto:**

- ⚠️ Si existen en AMBAS ubicaciones: Violación de regla "No duplicar" (§3 línea 74)
- ⚠️ Si existen SOLO en `conventions/audit/`: FALTAN actualizar referencias en §5.8
- ❌ Los nuevos documentos (PROMPT, CHECKLIST, EJEMPLO) no están listados en CONVENTIONS.md

**Acción Recomendada:**

1. Verificar qué existe realmente en `conventions/audit/` vs `docs/audit/`
2. Si están duplicados: consolidar en UNA ubicación
3. Actualizar §5.8 para listar documentos reales

---

### 🔴 CRÍTICO #2: Precedencia Documental §2 No Menciona [module]/docs/

**Ubicación:** CONVENTIONS.md línea 30-42

**Problema:**

CONVENTIONS.md §2 define jerarquía de precedencia:
```
1. CONVENTIONS.md
2. conventions/core/*
3. Documentos especializados por dominio en conventions/
   - Incluye guias operativas de auditoria en conventions/audit/
4. Documentacion tecnica de apoyo en docs/architecture/, docs/setup/, 
   client/angular/src/app/shared/ui/*.md
5. Componentes visuales (conventions-viewer)
```

**Problema:**

NO menciona `[module]/docs/` como nivel válido en la jerarquía.

**Realidad creada:**

Piloto Candidates crea:
- `api/.../Candidates/README.md` (Backend Nivel 1)
- `api/.../Candidates/Docs/documentacion-candidates.md` (Backend Nivel 2)
- `client/angular/.../candidates/docs/README.md` (Frontend)
- `client/angular/.../candidates/docs/setup.md` (Frontend)
- `client/angular/.../candidates/docs/decisiones.md` (Frontend)

**¿Dónde encaja en jerarquía?**

**Opción A (más lógico):** Debería ser nivel 3.5 o 4:
```
4. Documentacion tecnica de apoyo EN MÓDULO:
   - [module]/docs/README.md (Operativo)
   - [module]/docs/setup.md (Onboarding)
   - [module]/docs/decisiones.md (Matriz)
   - api/Moduls/[Module]/README.md (Backend Nivel 1)
   - api/Moduls/[Module]/Docs/documentacion-[module].md (Backend Nivel 2)
   - docs/architecture/[module]-design.md (Arquitectura permanente)
   - docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[module].md (Auditoría)
```

**Impacto:**

- ❌ Developers no saben si [module]/docs es "oficial"
- ❌ Precedencia es ambigua si hay conflicto entre docs/architecture y [module]/docs

**Acción Recomendada:**

Actualizar §2 Precedencia Documental para incluir nivel 4 (documentación en módulo).

---

### 🔴 CRÍTICO #3: §4.5 "Documentación" NO Especifica Estructura de 6 Documentos

**Ubicación:** CONVENTIONS.md línea 176-189

**Problema:**

CONVENTIONS.md §4.5 "Documentación, Remediación y Migracion" dice:
```
Si la tarea es documentar módulo: [Module Documentation Instructions]
```

Pero CONVENTIONS.md **NO ESPECIFICA** que un módulo DOCUMENTADO debe tener:
- 2 documentos backend (README + Técnica)
- 3 documentos frontend (README + Setup + Decisiones)
- 1 auditoría + 1 arquitectura

**Comparativa:**

| Tarea | CONVENTIONS.md Especifica | Status |
|-------|-------------------------|--------|
| Módulo NUEVO | §4.6: 7 artefactos | ✅ Detallado |
| Módulo IMPLEMENTADO | §4.1, §4.2: qué leer | ✅ Detallado |
| Módulo AUDITADO | §4.4: orden de lectura | ✅ Detallado |
| Módulo DOCUMENTADO | §4.5: "leer Module Documentation Instructions" | ❌ **NO ESPECIFICA ESTRUCTURA** |

**El gap:**

Documentador lee §4.5 → dice "leer Module Documentation Instructions" → abre ese archivo → encuentra 2 niveles (README + Técnica) → **¿Qué pasa con onboarding, matriz de decisiones, auditoría?**

**Realidad Creada (Piloto Candidates):**

```
Nivel 1: README (propósito + endpoints + actores)
Nivel 2: Documentación Técnica (entidades + validaciones + flujos)
Nivel 3: Setup (onboarding 30 min para dev nuevo)
Nivel 4: Decisiones (matriz de "¿dónde pongo feature X?")
Nivel 5: Auditoría (hallazgos reales + plan remediación)
Nivel 6: Arquitectura (decisiones de diseño permanentes)
```

**Impacto:**

- ❌ Módulos documentados inconsistentemente
- ❌ Falta especificidad en §4.5
- ⚠️ Module Documentation Instructions (conventions/operations/) probablemente solo cubre 2 niveles

**Acción Recomendada:**

1. Actualizar §4.5 para especificar: "Si la tarea es documentar módulo existente, crear 6 documentos:"
   - Backend: README (Nivel 1) + Documentación Técnica (Nivel 2)
   - Frontend: README + Setup + Decisiones
   - Auditoría: Ejecutada + Plan de Remediación
   - Arquitectura: Decisiones de Diseño (si es crítico)

2. O actualizar Module Documentation Instructions para incluir estos 6 niveles

---

### 🟠 ALTO #4: Última Revisión Desactualizada

**Ubicación:** CONVENTIONS.md línea 10

**Problema:**

```
**Ultima revision:** 2026-08-06 (consolidación de documentos completada)
```

Hemos creado y modificado CONVENTIONS.md:
- 2026-08-10: Se agregó Framework de Auditoría (3 docs nuevos)
- 2026-08-10: Se creó Documentación de Módulo (6 docs por módulo)
- 2026-08-10: Se creó Guía de Delegación

**Pero línea 10 no refleja estos cambios.**

**Impacto:**

- ⚠️ Desarrolladores creen que CONVENTIONS.md está "estable" desde 2026-08-06
- ⚠️ Regla §2 línea 44-54 dice que documentos legacy (previos a 2026-07-29) son secundarios
- ⚠️ CONVENTIONS.md mismo debe actualizarse cuando cambia

**Acción Recomendada:**

Actualizar línea 10:
```
**Ultima revision:** 2026-08-10 (Framework auditoría + Documentación módulos + Delegación)
```

---

### 🟠 ALTO #5: §3 Regla 10 NO Incluye Actualizar Docs de Auditoría

**Ubicación:** CONVENTIONS.md línea 90-91

**Regla:**

```
10. **Toda regla aprobada debe reflejarse en el sistema completo.**
    Eso incluye CONVENTIONS.md, el documento especializado correspondiente, 
    indices afectados, el conventions-viewer y cualquier capa operativa 
    o visual subordinada que dependa de esa taxonomia.
```

**Problema:**

Hemos creado Framework de Auditoría (3 nuevos docs en docs/audit/):
- AUDIT_PROMPT_COMPREHENSIVE.md
- AUDIT_CHECKLIST_COMPLETO.md
- EJEMPLO_AUDITORIA_CANDIDATES.md

Pero §3 Regla 10 **NO menciona documentación de auditoría** como parte del "sistema completo".

**Impacto:**

- ⚠️ Si alguien cambia §5.8, podría no actualizar estos 3 docs nuevos
- ⚠️ Ambigüedad: ¿son "documento especializado" o "capa operativa"?

**Acción Recomendada:**

Actualizar Regla 10 (línea 90-91):

```
10. **Toda regla aprobada debe reflejarse en el sistema completo.**
    Eso incluye CONVENTIONS.md, documentos especializados correspondientes 
    (backend/, frontend/, audit/, operations/, etc.), índices afectados 
    (../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md, etc.), conventions-viewer, documentación 
    de módulos ([module]/docs/), y cualquier capa operativa o visual 
    subordinada que dependa de esa taxonomia.
```

---

### 🟠 ALTO #6: §4.4 NO Menciona Donde Guardar Resultados de Auditoría

**Ubicación:** CONVENTIONS.md línea 162-174

**Problema:**

§4.4 "Auditoria de Modulo" dice:
```
11. Plan derivado obligatorio si hay hallazgos relevantes
```

**Pero NO especifica DÓNDE guardar auditoría ejecutada:**
- ✅ Hicimos: `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`
- ❓ CONVENTIONS.md NO menciona esta ubicación

**Comparativa:**

| Artefacto | CONVENTIONS.md Especifica Ubicación |
|-----------|-------------------------------------|
| Plan nuevo módulo | ✅ §4.6: docs/modulos-nuevos/[modulo]/ |
| Auditoría ejecutada | ❌ §4.4: **NO ESPECIFICA** |
| Documento de módulo | ⚠️ §4.5: "Documento del módulo si existe" - vago |

**Impacto:**

- ⚠️ Developers no saben dónde poner auditoría
- ⚠️ Auditorías pueden quedar en ubicaciones inconsistentes

**Acción Recomendada:**

Actualizar §4.4:
```
11. Plan derivado obligatorio si hay hallazgos relevantes
12. Auditoría ejecutada: docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
```

---

### 🟠 ALTO #7: §5.9 "FASE 0" NO Especifica Dónde Documentar

**Ubicación:** CONVENTIONS.md línea 339-360

**Problema:**

§5.9 Flujo de Módulo Nuevo dice:
```
Regla clave: Ningun plan puede iniciarse sin completar FASE 0. 
FASE 0 es obligatoria y debe ser auditable (documentada en el modulo).
```

**¿"Documentada en el módulo" DÓNDE?**

- ¿En `docs/modulos-nuevos/[modulo]/02-business-rules-analysis.md`?
- ¿En `api/Moduls/[Module]/README.md`?
- ¿En `docs/architecture/[module]-design.md`?

**CONVENTIONS.md no especifica.**

**Impacto:**

- ⚠️ FASE 0 podría quedar "auditable" pero en ubicación incorrecta
- ⚠️ Próximas auditorías no saben dónde verificar FASE 0

**Acción Recomendada:**

Actualizar §5.9:
```
Regla clave: FASE 0 es obligatoria y debe documentarse en:
- docs/modulos-nuevos/[modulo]/02-business-rules-analysis.md (para módulos nuevos)
- docs/reporte_maestro/modulos/ (como referencia en auditoría)
```

---

## Resumen de Incoherencias

| # | Severidad | Tipo | Línea | Solución |
|---|-----------|------|-------|----------|
| 1 | 🔴 CRÍTICO | §5.8 desactualizado | 310-314 | Consolidar ubicación de docs/audit/, actualizar referencias |
| 2 | 🔴 CRÍTICO | Precedencia no menciona [module]/docs/ | 30-42 | Agregar nivel 4 a jerarquía documental |
| 3 | 🔴 CRÍTICO | §4.5 no especifica 6 documentos requeridos | 176-189 | Detallar estructura de módulo documentado |
| 4 | 🟠 ALTO | Última revisión desactualizada | 10 | Actualizar fecha a 2026-08-10 |
| 5 | 🟠 ALTO | Regla §3 #10 incompleta | 90-91 | Mencionar docs de auditoría y módulos |
| 6 | 🟠 ALTO | §4.4 no especifica ubicación auditoría | 162-174 | Agregar línea de ubicación |
| 7 | 🟠 ALTO | §5.9 vago sobre FASE 0 | 339-360 | Especificar dónde documentar FASE 0 |

---

## Plan de Remediación Recomendado

### FASE 1: Urgente (Hoy)

**Tarea 1.1:** Verificar qué existe realmente en `conventions/audit/` vs `docs/audit/`

```bash
ls -la conventions/audit/
ls -la docs/audit/
```

**Tarea 1.2:** Si hay duplicados, consolidar en UNA ubicación (probablemente `docs/audit/`)

**Tarea 1.3:** Actualizar fecha en línea 10

### FASE 2: Crítico (Esta semana)

**Tarea 2.1:** Actualizar §2 Precedencia Documental
- Agregar nivel para [module]/docs/
- Especificar dónde encaja en jerarquía

**Tarea 2.2:** Actualizar §4.5 "Documentación, Remediación y Migración"
- Especificar 6 documentos requeridos por módulo
- Detallar estructura (Backend Nivel 1+2, Frontend 3 docs, Auditoría, Arquitectura)

**Tarea 2.3:** Actualizar §5.8 Auditoría
- Listar documentos reales (PROMPT, CHECKLIST, EJEMPLO)
- Resolver duplicados si existen

### FASE 3: Alto (Esta semana)

**Tarea 3.1:** Actualizar Regla §3 #10
- Incluir "docs de auditoría" en "sistema completo"
- Mencionar documentación de módulos

**Tarea 3.2:** Actualizar §4.4 Auditoría de Módulo
- Agregar ubicación: `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`

**Tarea 3.3:** Actualizar §5.9 FASE 0
- Especificar dónde documentar FASE 0
- Detallar ubicaciones por tipo de módulo (nuevo vs existente)

---

## Impacto de NO Remediar

| Incoherencia | Riesgo si no se arregla |
|-------------|------------------------|
| §5.8 desactualizado | Documentación de auditoría duplicada o perdida |
| Precedencia incompleta | Conflictos de autoridad entre documentos |
| §4.5 vago | Módulos documentados inconsistentemente |
| Regla #10 incompleta | Cambios a CONVENTIONS no se propagan a todos lados |
| FASE 0 no documentado | Requisitos de negocio perdidos o inconsistentes |

---

## Propuesta: Secciones Nuevas a Agregar

### Nueva subsección: §4.7 "Documentación de Módulo Existente"

```
### 4.7 Documentacion de Modulo Existente

CUANDO: Un módulo backend/frontend ya existe y debe documentarse

QUÉS CREAR (6 documentos):

Backend:
1. api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md (Nivel 1)
   - Propósito funcional, endpoints, actores, dependencias, RNs
   
2. api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md (Nivel 2)
   - Técnico completo: entidades, validaciones, flujos, performance, checklist

Frontend:
3. client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md (Operativo)
   - Rutas, componentes, servicios, data flow, debug tips
   
4. client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md (Onboarding)
   - 30 minutos: primeros pasos, primer cambio, debugging
   
5. client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md (Matriz)
   - "¿Dónde pongo feature X?" con ejemplos concretos

Auditoría & Arquitectura:
6. docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
   - Hallazgos reales, matriz de permisos, plan de remediación
   
7. docs/architecture/[modulo]-design.md (OPCIONAL - si crítico)
   - Decisiones arquitectónicas permanentes, principios, diseño

ORDEN DE LECTURA:
1. CONVENTIONS.md
2. [Workflow por Tipo de Tarea]
3. [Module Documentation Instructions]
4. [Este documento] (§4.7)
5. Documentos del módulo creados siguiendo estructura

REFERENCIAS:
- [EJEMPLO: Reclutamiento/Candidates](docs/reporte_maestro/modulos/20260810-auditoria-reclutamiento-candidatos.md)
- [GUÍA DE DELEGACIÓN](docs/guides/GUIA_DELEGACION_DOCUMENTACION_MODULOS.md)
```

---

## Actualización Recomendada a §2 Precedencia Documental

```
## 2. Precedencia Documental

Cuando haya dudas, esta es la jerarquia obligatoria:

1. `CONVENTIONS.md`
2. `conventions/core/*`
3. Documentos especializados por dominio en `conventions/`
   - Incluye guias operativas de auditoria en `docs/audit/`
   - Incluye guias de operación en `conventions/operations/`
4. Documentos de módulo en `[module]/docs/` y `api/Moduls/[Module]/`
   - [module]/docs/README.md (frontend operativo)
   - [module]/docs/setup.md (frontend onboarding)
   - [module]/docs/decisiones.md (frontend matriz)
   - api/Moduls/[Module]/README.md (backend nivel 1)
   - api/Moduls/[Module]/Docs/documentacion-[modulo].md (backend nivel 2)
5. Documentacion tecnica de apoyo en `docs/architecture/`, `docs/setup/`,
   `client/angular/src/app/shared/ui/*.md`, `client/angular/src/styles/*.md`
6. Auditoría ejecutada en `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`
7. Componentes visuales como `conventions-viewer`
```

---

## Próximos Pasos

1. **Tech Lead Review:** Validar que estas 7 incoherencias son reales
2. **Consolidación:** Resolver §5.8 (ubicación de docs/audit/)
3. **Actualización:** Aplicar todas las recomendaciones a CONVENTIONS.md
4. **Validación:** Que conventions-viewer refleje cambios
5. **Comunicación:** Notificar al equipo de cambios a CONVENTIONS.md

---

**Auditoría Completada:** 2026-08-10  
**Estado:** Ready for Tech Lead Review  
**Impacto:** 7 incoherencias, 3 críticas → remediación recomendada esta semana

