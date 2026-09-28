# Checklist de Delegación a OpenCode (o KiloCode)

**Propósito:** Verificar que TODO está listo ANTES de entregar plan a agente bajo.

**Cómo usar:** Revisar esta checklist antes de enviar plan a OpenCode.

---

## PRE-DELEGACIÓN (Antes de entregar plan)

### Documentos Listos

- [ ] **Plan escrito** (docs/plans/YYYYMMDD-[modulo]-implementation-plan.md)
  - [ ] ≥12 pasos numerados (1.1, 1.2, ... 4.3)
  - [ ] Cada paso tiene CRITERIO DE VALIDACIÓN explícito
  - [ ] Ejemplos concretos (NO "busca endpoints", SÍ "grep -r 'public.*Async'...")
  - [ ] Tiempo estimado por paso

- [ ] **Control Log creado** (docs/implementation-control/[MODULO]_YYYYMMDD_CONTROL_LOG.md)
  - [ ] Timeline template con todos pasos
  - [ ] Campos para llenar resultados intermedios
  - [ ] Sección de rollback definida

- [ ] **Referencias a plantillas disponibles:**
  - [ ] AUDIT_PROMPT_COMPREHENSIVE.md (accesible)
  - [ ] AUDIT_CHECKLIST_COMPLETO.md (accesible)
  - [ ] EJEMPLO_AUDITORIA_CANDIDATES.md (accesible)
  - [ ] Ejemplos de 6 documentos Candidates (accesibles)

- [ ] **AGENT_CAPABILITIES.md actualizado**
  - [ ] Roles de OpenCode/KiloCode claros
  - [ ] Limitaciones documentadas
  - [ ] Procedimiento si falla agente

- [ ] **CONVENTIONS.md referencias verificadas**
  - [ ] §4.5 (Documentación de módulo)
  - [ ] §4.7 (Estructura de 6 documentos)
  - [ ] §5.8 (Auditoría exhaustiva)

---

### OpenCode Tiene Acceso

- [ ] Puede leer: docs/audit/AUDIT_PROMPT_COMPREHENSIVE.md
- [ ] Puede leer: docs/audit/AUDIT_CHECKLIST_COMPLETO.md
- [ ] Puede leer: docs/audit/EJEMPLO_AUDITORIA_CANDIDATES.md
- [ ] Puede leer: 6 documentos piloto (Candidates)
- [ ] Puede leer: CONVENTIONS.md
- [ ] Puede ejecutar: comandos bash/grep/find
- [ ] Puede crear: archivos en api/, client/, docs/
- [ ] Puede escribir: en control_log

---

### Plan es Claro

- [ ] Cada paso tiene:
  - [ ] Título descriptivo
  - [ ] Tiempo estimado
  - [ ] Comandos exactos (NO abstractos)
  - [ ] Resultado esperado
  - [ ] Criterio de validación SÍ/NO
  - [ ] Qué hacer si falla

- [ ] Ejemplos concretos incluidos:
  - [ ] Plantilla a copiar: "usa .../Candidates/README.md línea 30-50"
  - [ ] Estructura esperada: tablas/enums/diagramas ASCII
  - [ ] Búsquedas específicas: grep patterns con módulo correcto

- [ ] Rollback definido:
  - [ ] Si falla paso X: qué hacer
  - [ ] Máximo 2 intentos por archivo
  - [ ] Escalada a Claude después 2 fallos

---

## DURANTE EJECUCIÓN (Mientras OpenCode trabaja)

### OpenCode Reporta Después Cada Paso

- [ ] Status: ✅ COMPLETADO / ⏳ IN_PROGRESS / ❌ FALLÓ
- [ ] Resultado: qué hizo exactamente
- [ ] Validación: cumple criterio SÍ/NO
- [ ] Problema (si falló): error exacto

**Formato esperado:**
```
FASE 1 Paso 1.1 - COMPLETADO

Comando ejecutado:
  grep -r "public.*Async" api/LuxuryApp.Application/Moduls/[Modulo]/

Resultado:
  [Primeras 5 líneas de output]

Endpoints encontrados: [número]

Validación: [SÍ/NO]
  - Criterio 1: [SÍ/NO]
  - Criterio 2: [SÍ/NO]

Próximo paso: 1.2

Guardado en control_log: NOMINA_20260810_CONTROL_LOG.md
```

### Claude Revisa Después Cada VALIDAR

Después que OpenCode completa un paso VALIDAR (⏳ → ✅):

- [ ] **Claude abre archivo generado**
- [ ] **Claude verifica criterios de validación:**
  - [ ] Cumple meta (≥N items)
  - [ ] Datos son específicos (no genéricos)
  - [ ] Calidad es aceptable
- [ ] **Claude da feedback:**
  - [ ] ✅ APROBADO → OpenCode continúa
  - [ ] ⚠️ APROBADO CON COMENTARIOS → OpenCode ajusta 1-2 puntos
  - [ ] ❌ RECHAZADO → OpenCode vuelve al paso fallido

**Claude NO verifica:**
- Pasos intermedios sin VALIDAR
- Solo verifica VALIDAR checkpoints

---

## POST-EJECUCIÓN (Después que OpenCode completa todas fases)

### Auditoría Final Exhaustiva (Claude)

Ejecutar AUDIT_PROMPT_COMPREHENSIVE.md sobre todos 6 archivos:

- [ ] **Estructura (15 min):**
  - [ ] 6 archivos existen ✅
  - [ ] Ubicaciones correctas ✅
  - [ ] Nombres están datados (YYYYMMDD) ✅

- [ ] **Contenido Auditoría (20 min):**
  - [ ] Matriz de RNs: ≥6, bien jerarquizada ✅
  - [ ] Matriz de permisos: ≥8 endpoints × ≥3 roles ✅
  - [ ] Hallazgos: ≥2, con línea de código ✅
  - [ ] Severidad asignada a cada hallazgo ✅
  - [ ] Diagramas ASCII presentes ✅
  - [ ] Plan remediación: 3 fases + ≥6 acciones ✅

- [ ] **Contenido Backend Docs (20 min):**
  - [ ] README.md: ≥10 RNs específicas del módulo ✅
  - [ ] README.md: ≥5 endpoints en tabla ✅
  - [ ] Documentación técnica: ≥3 endpoints documentados ✅
  - [ ] Documentación técnica: ≥3 entidades con propiedades ✅
  - [ ] Documentación técnica: ≥5 servicios documentados ✅
  - [ ] Entidades y relaciones (1:N, FK) documentadas ✅
  - [ ] Índices de BD documentados ✅

- [ ] **Contenido Frontend Docs (20 min):**
  - [ ] README.md: ≥3 rutas con URLs ✅
  - [ ] README.md: data flow diagram ASCII ✅
  - [ ] README.md: componentes principales listados ✅
  - [ ] README.md: smoke test (happy path 15+ pasos) ✅
  - [ ] setup.md: walkthrough de 5 pasos ✅
  - [ ] setup.md: debugging flowchart ASCII ✅
  - [ ] setup.md: ≥4 common mistakes con soluciones ✅
  - [ ] decisiones.md: matriz ASCII "¿dónde va?" ✅
  - [ ] decisiones.md: ≥4 ejemplos específicos del módulo ✅
  - [ ] decisiones.md: ≥7 reglas irrompibles ✅

- [ ] **Coherencia Cross-Files (15 min):**
  - [ ] Backend README referencia auditoría ✅
  - [ ] Frontend README referencia backend ✅
  - [ ] setup.md dice "leer en orden: setup → README → decisiones" ✅
  - [ ] decisiones.md tiene ejemplos del mismo módulo (no Candidates) ✅
  - [ ] Todos archivos tienen "Última revisión: YYYYMMDD" ✅

- [ ] **Calidad (10 min):**
  - [ ] No hay copy-paste ciego de Candidates (datos genéricos) ✅
  - [ ] Líneas de código referenciadas existen ✅
  - [ ] Diagramas son útiles y claros ✅
  - [ ] Texto no tiene placeholders ([[TODO]], etc.) ✅

**Resultado:**
- [ ] ✅ APROBADO
- [ ] ⚠️ APROBADO CON CORRECCIONES MENORES (OpenCode/KiloCode fix 2 puntos específicos)
- [ ] ❌ RECHAZADO (volver a fase específica)

---

### Si APROBADO CON CORRECCIONES

- [ ] Claude identifica ≤2 puntos para corregir
- [ ] Claude especifica línea + qué cambiar
- [ ] OpenCode/KiloCode aplica correcciones (max 30 min)
- [ ] OpenCode re-submit archivo corregido
- [ ] Claude re-audita (10 min) → ✅ APROBADO

---

### Si RECHAZADO

- [ ] Claude identifica qué falló (FASE específica)
- [ ] Claude cita criterios no cumplidos
- [ ] OpenCode vuelve a ese paso
- [ ] Re-ejecuta con feedback de Claude
- [ ] Nueva auditoría

---

### Actualizar Memoria

- [ ] Crear: memory/audit-[modulo]-YYYYMMDD.md
  - [ ] name: audit-[modulo]
  - [ ] description: [X hallazgos, Y RNs]
  - [ ] Contenido: resumen ejecutivo + plan

- [ ] Actualizar: memory/MEMORY.md
  - [ ] Agregar línea: "- [Auditoría [Módulo]](audit-[modulo]-YYYYMMDD.md) — X hallazgos, Y RNs, plan (YYYYMMDD)"

---

### Commit Final

- [ ] Commit message referencia plan + auditoría:
  ```
  Documentar [Módulo]: 6 documentos + auditoría integral
  
  - Auditoría: docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
  - Backend: api/.../[Módulo]/{README.md, Docs/documentacion-[modulo].md}
  - Frontend: client/angular/...docs/{README, setup, decisiones}.md
  - Plan: docs/plans/YYYYMMDD-[modulo]-implementation-plan.md
  - Hallazgos: X (Severidad: crítico/alto/medio)
  - Plan remediación: 3 fases
  
  Ref: CONVENTIONS.md §4.5, §4.7, §5.8
  ```

- [ ] 6 archivos en commit
- [ ] memory/audit-[modulo]-*.md en commit
- [ ] memory/MEMORY.md actualizado en commit

---

## ❌ Si Algo Sale Mal

### Agente Bajo Falla Mismo Paso 2 Veces

- [ ] Escalada a Claude (pausar plan)
- [ ] Claude: analiza error
- [ ] Claude: reescribe paso con más claridad/ejemplos
- [ ] Claude: re-delega a OpenCode (o hace manualmente)

### Auditoría Intermedia Rechaza

- [ ] Claude: cita criterios específicos no cumplidos
- [ ] Claude: propone qué corregir
- [ ] OpenCode vuelve a paso fallido
- [ ] Máximo 2 re-intentos, si sigue fallando → Claude lo hace

### Auditoría Final Rechaza Completamente

- [ ] Revert (git reset --hard) a último ✅
- [ ] Pausar plan
- [ ] Claude: análisis de qué falló
- [ ] Redefinir paso/fase
- [ ] Re-delegar

---

## 🎯 Resumen: Qué Hacen Quién

| Tarea | OpenCode | Claude | Cuándo |
|-------|----------|--------|--------|
| **Crear PLAN** | ❌ | ✅ | Antes de delegar |
| **Ejecutar FASE 1-4** | ✅ | ❌ | En paralelo |
| **Auditoría intermedia** | ❌ | ✅ | Después cada VALIDAR |
| **Auditoría final** | ❌ | ✅ | Al cierre |
| **Feedback** | ❌ | ✅ | Si falló algo |
| **Re-intentar** | ✅ | ❌ | Máx 2 veces |
| **Commit** | ❌ | ✅ | Al cierre |
| **Escalada** | ✅ (reportar) | ✅ (resolver) | Si ≥2 fallos |

---

## 📋 Lista Final (Copiar-pegar antes de enviar a OpenCode)

```markdown
# CHECKLIST PRE-ENVÍO A OPENCODE

- [ ] Plan está en: docs/plans/20260810-nomina-implementation-plan.md
- [ ] Control log está en: docs/implementation-control/NOMINA_20260810_CONTROL_LOG.md
- [ ] Plan tiene ≥12 pasos con criterios explícitos
- [ ] Ejemplos concretos en plan (grep patterns específicas)
- [ ] AUDIT_PROMPT_COMPREHENSIVE.md accesible
- [ ] 6 documentos Candidates accesibles como referencia
- [ ] OpenCode sabe: criterios = SÍ/NO, si NO → reportar
- [ ] OpenCode sabe: máx 2 intentos, luego Claude
- [ ] Contacto claro: si duda → Claude
- [ ] Control log abierto y listo

LISTO PARA OPENCODE ✅
```

---

**Última revisión:** 2026-08-10
