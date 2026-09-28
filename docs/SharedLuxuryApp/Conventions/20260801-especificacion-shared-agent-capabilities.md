# Agent Capabilities Matrix

**Propósito:** Definir qué agente hace qué, evitando desvíos y errores de delegación.

**Última revisión:** 2026-08-10

---

## 🧠 AGENTES DE ALTA CAPACIDAD (PLANNING + AUDITING + ANALYSIS)

### Claude (Principal)
**Rol:** Arquitecto + Auditor + Planificador

**Capacidades verificadas:**
- ✅ Análisis exhaustivo de módulos (estructura + flujos + errores)
- ✅ Diseño de frameworks (AUDIT_PROMPT_COMPREHENSIVE.md)
- ✅ Auditoría de código (6 tipos de errores)
- ✅ Detección de incoherencias (CONVENTIONS.md audit)
- ✅ Aprobaciones finales (go/no-go para merge)
- ✅ Feedback específico (línea + contexto + fix)
- ✅ Creación de guías de delegación

**Usar para:**
- ✅ Crear PLAN (docs/plans/YYYYMMDD-*.md)
- ✅ Auditar resultado de agente bajo (AUDIT_PROMPT_COMPREHENSIVE.md)
- ✅ Code review de archivos generados
- ✅ Validaciones intermedias (pasos críticos del plan)
- ✅ Aprobar/rechazar con fundamento

**NO usar para:**
- ❌ Crear ≥10 archivos en paralelo (consume contexto)
- ❌ Tareas repetitivas (grep + reemplazo)
- ❌ Escribir código boilerplate sin análisis

---

## ⚙️ AGENTES DE BAJA CAPACIDAD (EXECUTION + IMPLEMENTATION)

### OpenCode (Ejecutor Principal)
**Rol:** Implementador de planes paso a paso

**Capacidades esperadas:**
- ✅ Leer plan detallado y ejecutar pasos
- ✅ Crear archivos desde plantillas
- ✅ Buscar código (grep, glob)
- ✅ Generar documentación tipo boilerplate
- ✅ Reportar resultados de forma estructurada
- ✅ Detener si criterio de validación falla

**Usar para:**
- ✅ Crear 6 documentos de módulo (FASE 1-4)
- ✅ Ejecutar pasos 1.1 → 1.2 → 1.3 (con paradas)
- ✅ Generar tablas y matrices desde código real
- ✅ Crear archivos de auditoría (siguiendo template)

**Limitaciones conocidas:**
- ⚠️ Puede no entender "documentación viva" vs "permanente"
- ⚠️ Puede copy-paste ciego de Candidates
- ⚠️ No debería hacer análisis profundos
- ⚠️ Requiere aprobación Claude entre fases

**Mitigaciones:**
- Dar ejemplo concreto NO abstracto: "usa .../Candidates/README.md línea 30-50 como plantilla"
- Incluir checklist post-generación en el plan
- Claude audita 100% del trabajo

### KiloCode (Ejecutor Secundario - Opcional)
**Rol:** Ediciones menores + iteraciones

**Usar para:**
- ✅ Aplicar feedback de Claude (fix específico)
- ✅ Re-generar 1 archivo tras auditoría
- ✅ Cambios formativos (typos, indentación)

**Limitaciones:**
- ⚠️ Máximo 2 re-intentos por archivo
- ⚠️ Si falla 2 veces → Claude hace manualmente

---

## 🎯 MATRIZ DE DECISIÓN: ¿QUIÉN HACE QUÉ?

| Tarea | Claude | OpenCode | Notas |
|-------|--------|----------|-------|
| **Crear PLAN** | ✅ | ❌ | Requiere análisis arquitectónico |
| **Ejecutar FASE 1** (auditoría) | ❌ | ✅ | Sigue pasos del plan, Claude audita resultado |
| **Ejecutar FASE 2** (backend docs) | ❌ | ✅ | Crea archivos, Claude valida |
| **Ejecutar FASE 3** (frontend docs) | ❌ | ✅ | Crea archivos, Claude valida |
| **Ejecutar FASE 4** (validar) | ❌ | ✅ | Corre comandos de validación, reporta |
| **Auditoría intermedia (paso X)** | ✅ | ❌ | After each VALIDAR checkpoint |
| **Auditoría final exhaustiva** | ✅ | ❌ | AUDIT_PROMPT_COMPREHENSIVE.md |
| **Crear CONTROL_LOG** | ✅ | ✅ | Claude inicia + cierra, OpenCode reporta |
| **Aplicar feedback** | ❌ | ✅ | Si falla 2 veces → Claude hace |
| **Actualizar MEMORY.md** | ✅ | ❌ | Análisis crítico |
| **Commit + merge** | ✅ | ❌ | Aprobación final |

---

## 📋 CHECKLIST DE DELEGACIÓN A OPENCODE

**Antes de delegar a OpenCode, verificar:**

```markdown
□ Plan tiene ≥8 pasos numerados (1.1, 1.2, etc.)
□ Cada paso tiene CRITERIO DE VALIDACIÓN explícito
□ Ejemplos concretos, NO abstracciones ("usa README.md línea 30-50")
□ Rollback definido (¿qué si falla 1.5?)
□ OpenCode tiene acceso a:
  □ Plantillas (Candidates: 6 archivos)
  □ AUDIT_PROMPT_COMPREHENSIVE.md
  □ AUDIT_CHECKLIST_COMPLETO.md
  □ CONVENTIONS.md §4.5, §4.7
□ CONTROL_LOG creado y linkado en plan
□ Tiempo estimado por fase documentado
□ Punto de contacto si OpenCode tiene duda
```

---

## 🔄 FLUJO DE CONTROL TÍPICO

```
INICIO
  ↓
PASO 1: Claude crea PLAN (docs/plans/YYYYMMDD-*.md)
  - ≥8 pasos detallados
  - Criterios de validación claros
  - Ejemplos concretos
  ↓
PASO 2: Yo apruebo plan (o feedback si falla)
  - ¿Plan es claro?
  - ¿Pasos son ejecutables?
  - ¿Criterios son verificables?
  ↓
PASO 3: OpenCode ejecuta FASE 1
  - Lee plan
  - Ejecuta paso 1.1, 1.2, 1.3, ...
  - Reporta resultado después cada paso
  ↓
PASO 4A: Si paso FALLA (validación NO)
  - OpenCode reporta error
  - Claude analiza y da feedback
  - OpenCode re-intenta mismo paso
  - Si falla 2da vez → Claude hace manualmente
  ↓
PASO 4B: Si paso PASA (validación SÍ)
  - OpenCode reporta éxito
  - Claude audita resultado (10 min)
  - Aprueba → continuar a siguiente fase
  ↓
PASO 5: OpenCode ejecuta FASE 2, 3, 4 (mismo flujo)
  ↓
PASO 6: Claude auditoría final exhaustiva
  - Usa AUDIT_PROMPT_COMPREHENSIVE.md
  - Verifica: 6 archivos ✅, contenido ✅, cross-checks ✅
  - Aprueba con/sin correcciones menores
  ↓
PASO 7: Si correcciones menores → OpenCode/KiloCode fix + re-submit
  ↓
PASO 8: Claude commit + actualiza MEMORY.md
  ↓
FIN ✅
```

---

## ⏱️ TIEMPOS ESTIMADOS

| Fase | OpenCode | Claude Auditor | Total |
|------|----------|---|-------|
| FASE 1 (Auditoría Real) | 4h | 1h | 5h |
| FASE 2 (Backend Docs) | 2h | 30min | 2.5h |
| FASE 3 (Frontend Docs) | 2h | 30min | 2.5h |
| FASE 4 (Validación) | 1h | 30min | 1.5h |
| **Total por módulo** | **9h** | **2.5h** | **11.5h** |

**Optimización:** Si OpenCode es eficiente → -25% tiempo (8.6h total)

---

## 🚨 Reglas Irrompibles

1. **Auditoría intermedia OBLIGATORIA después de cada VALIDAR**
   - Sin excepción, sin "confiar en OpenCode"
   - Claude revisa 100% del resultado antes de siguiente fase

2. **Criterios de validación deben ser VERIFICABLES**
   - NO: "documentación completa"
   - SÍ: "grep 'RN-' api/.../README.md retorna ≥10 líneas"

3. **Si falla 2 veces → Claude toma el relevo**
   - OpenCode no itera infinitamente
   - Límite: 2 intentos, luego escalada

4. **Control_log es AUDITORIA**
   - Registro de cada paso + resultado + timestamp
   - Para auditoría en 3 meses

5. **Ejemplos concretos en planes, NO abstracciones**
   - "crea documentación" ❌
   - "copia .../Candidates/README.md, línea 30-50, y adapta para Nomina" ✅

---

## 📞 Si OpenCode Pregunta...

| Pregunta | Respuesta |
|----------|-----------|
| "¿Cómo hago X?" | "Ve paso 2.5 del plan, tiene ejemplo" |
| "¿Está bien esto?" | "Valida vs criterio de validación de paso X" |
| "¿Qué sigue?" | "Plan dice paso siguiente: Y.Z" |
| "No entiendo" | "Contacta a Claude (me), necesito clarificar paso" |
| "Falla el comando" | "Reporta error exacto, Claude lo revisa" |

---

**Última actualización:** 2026-08-10  
**Próxima revisión:** Después de piloto Nomina
