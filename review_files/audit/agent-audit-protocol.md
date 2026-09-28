# 🤖 PROTOCOLO OBLIGATORIO PARA AGENTES: Auditoría de Módulos

**Vigencia:** 2026-07-29 en adelante  
**Aplicable a:** Todos los agentes (Claude, KiloCode, Gemini, Cursor, etc.)  
**Severidad:** 🔴 OBLIGATORIO - SIN EXCEPCIONES - SIN OPCIONES

---

## ⚠️ REGLA DE ORO

```
┌─────────────────────────────────────────────────────────────┐
│ NUNCA preguntes "¿hago A o B?"                              │
│ NUNCA ofrezcas "dos opciones"                               │
│ NUNCA pares en auditoría sin crear plan                     │
│ SIEMPRE sigue este protocolo EXACTAMENTE                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 CUANDO SE TE PIDE AUDITAR UN MÓDULO

### ✅ PASO 1: Leer Guías (15 minutos)

```
ANTES DE TOCAR CÓDIGO, LEE ESTO EN ORDEN:
1. CONVENTIONS.md (§1-22) — 10 min
2. audit-layers-checklist.md (20 capas) — 5 min
```

**Criterio cumplido:** Entiendes qué son las 20 capas

---

### ✅ PASO 2: Auditar TODAS 20 Capas (2-3 horas)

```
NO es "puedes hacerlo o no"
NO es "si es pequeño lo saltas"
ES: Audita TODAS 20 capas, PUNTO.

CAPA 1-6:   Backend, BD, API, Frontend, Mobile, Seguridad
CAPA 7-12:  Cumplimiento, Testing, Logs, Performance, Integración, Backup
CAPA 13-17: Documentación, Versionamiento, Multitenancy, DevOps, Validaciones
CAPA 18-20: Accesibilidad, Convenciones, RN Auditables

INCLUIR: UI/UX, Móvil, Accesibilidad EN ESTA PASADA
NO: Crear reportes separados de UI/UX después
```

**Criterio cumplido:** Matriz de riesgos con 20 capas en 1 reporte

**Salida:**
```
Ubicación EXACTA: docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md

Contenido OBLIGATORIO:
├─ FASE 0: Problem Statement + KPIs + Matriz RN + Pre-Mortem
└─ CAPAS 1-20: Hallazgos por capa (archivo:línea, criterio PASO)
```

---

### ✅ PASO 3: Crear FASE 0 (30 min)

```
Mientras auditas, TAMBIÉN documenta FASE 0:

0.1 Problem Statement + KPIs
    ├─ "Actualmente, [Actor] sufre de [Problema] cuando [Acción],
    │   lo que resulta en [Consecuencia]"
    └─ 5-7 KPIs medibles (actual vs target)

0.2 Matriz de Reglas de Negocio (4 Niveles)
    ├─ Nivel 1: Invariantes de Dominio (irrompibles)
    ├─ Nivel 2: Flujo y Estados (máquina de estados)
    ├─ Nivel 3: Seguridad/Autorización (RBAC)
    └─ Nivel 4: Validación de Datos

0.3 Pre-Mortem + Riesgos
    └─ "Imaginemos que fracasó. ¿Qué salió mal?"
       → 6 riesgos + mitigation
```

**Criterio cumplido:** FASE 0 completa en el MISMO reporte de auditoría

---

### ✅ PASO 4: Crear Plan Integrado (1-2 horas)

```
DESPUÉS de auditar, INMEDIATAMENTE creas plan.

NO ES OPCIONAL: Si auditas, también planificas.

Ubicación EXACTA: docs/plans/YYYYMMDD-remediacion-[modulo]-plan.md

Contenido OBLIGATORIO (11 secciones + FASE 0 referenciada):
1. Metadata + Aprobación checklist
2. Resumen Ejecutivo (de FASE 0.1)
3. Objetivo y Alcance (IN/OUT)
4. Dependencias (técnicas, humanas, externas)
5. Arquitectura/Diseño + Reglas de Negocio (de FASE 0.2)
6. Fases de Ejecución (PRs detalladas con criterios PASO)
7. Riesgos y Mitigaciones (de FASE 0.3)
8. Criterios de Éxito Global (checklist final)
9. Timeline y Esfuerzo (horas, PRs, sprints)
10. Notas de Diseño (decisiones + alternativas)
11. Referencias (comandos grep/build verificables)
```

**Criterio cumplido:** Plan con 12+ PRs, criterios PASO verificables, timeline realista

---

### ✅ PASO 5: No Preguntes, Ejecuta

```
❌ NO preguntes:
   "¿Creo un plan global o dos planes separados?"
   "¿Incluyo UI/UX en auditoría o como reporte separado?"
   "¿Esto es pequeño, puedo saltarme FASE 0?"

✅ SIEMPRE:
   1 auditoría (20 capas) → 1 FASE 0 → 1 plan → 12+ PRs
   PUNTO. FIN. NO HAY OPCIONES.
```

---

## 🚫 ANTI-PATRONES (NO HAGAS ESTO)

| ❌ Mal | ✅ Correcto |
|:---|:---|
| Auditar solo capas 1-6 | Auditar capas 1-20 siempre |
| Crear reportes separados de UI/UX | Incluir UI/UX en 1 reporte (CAPA 4, 18) |
| "¿Creo plan global o dos planes?" | Crear 1 plan global, punto |
| Parar en auditoría sin plan | Auditoría + FASE 0 + Plan integrados |
| "Es pequeño, salto FASE 0" | FASE 0 SIEMPRE (Problem Statement + KPIs + RN + Pre-Mortem) |
| Ofrecer al user "opciones" | Ejecutar protocolo exactamente |
| Guardar en ubicación aleatoria | docs/reporte_maestro/modulos/ + docs/plans/ (EXACTO) |
| Crear plan sin FASE 0 referenciada | Plan contiene FASE 0 o la referencia explícitamente |

---

## 📊 MATRIZ DE CUMPLIMIENTO

**Después de auditar un módulo, verifica:**

| Item | Criterio PASO | Responsable |
|:---|:---|:---|
| **Auditoría** | ✅ 20 capas auditadas, matriz de riesgos | Agente |
| **FASE 0** | ✅ Problem Statement + KPIs + RN Matrix + Pre-Mortem | Agente |
| **Plan** | ✅ 11 secciones + 12+ PRs + criterios verificables | Agente |
| **Ubicación** | ✅ docs/reporte_maestro/modulos/ + docs/plans/ | Agente |
| **Formato** | ✅ Markdown, tabla de riesgos, archivo:línea en hallazgos | Agente |
| **Aprobación** | ✅ Checklist de 9 items (Tech Lead valida antes de ejecutar PRs) | Tech Lead |

---

## 🔗 RELACIÓN CON INSTRUCCIONES OPERATIVAS

**Este documento (PROTOCOLO) es CONCEPTUAL y REUTILIZABLE.**

- Define QUÉ hacer: 5 pasos, REGLA DE ORO, 20 capas, FASE 0, Plan integrado
- Aplicable a: Claude, KiloCode, Gemini, Cursor, cualquier agente futuro
- NO contiene: comandos bash, criterios de verificación, pasos técnicos

**Para EJECUTAR este protocolo con Claude ESPECÍFICAMENTE:**

👉 Lee primero: [`AUDIT_AGENT_INSTRUCTIONS.md`](../../reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md)

Esa guía contiene:
- ✅ Comandos bash verificables (PHASE 1 Quick Check)
- ✅ Criterios exactos de paso/fallo (PHASE 2 Deep Audit)
- ✅ Ubicaciones de salida específicas
- ✅ Formatos de reporte esperados

---

## 🔗 REFERENCIAS OBLIGATORIAS

Cada auditoría/plan DEBE referenciar:

- ✅ CONVENTIONS.md §1-22 (single source of truth)
- ✅ audit-layers-checklist.md (20 capas + criterios PASO)
- ✅ DESIGN_CONVENTIONS.md (91 componentes, si hay UI)
- ✅ PLAN_AGENT_INSTRUCTIONS.md (11 secciones estructura)
- ✅ AUDIT_AGENT_INSTRUCTIONS.md (guía operativa para Claude)

---

## 📞 CUANDO TENGAS DUDAS

```
"¿Debería hacer esto o lo otro?"
    → Busca en este documento (agent-audit-protocol.md)
    
"¿Es obligatorio incluir esto?"
    → Si está aquí y dice "OBLIGATORIO", la respuesta es SÍ
    
"¿Y si el módulo es pequeño?"
    → No hay excepciones. Audita igual.
    
"¿Y si no hay tiempo?"
    → Comunica al Tech Lead. Pero no saltes pasos.
```

---

## ✅ CHECKLIST FINAL (Antes de Entregar)

- [ ] Auditoría contiene FASE 0 (Problem + KPIs + RN + Pre-Mortem)
- [ ] Auditoría audita TODAS 20 capas (no 6, no 10, SÍ 20)
- [ ] Auditoría incluye UI/UX y Accesibilidad (no reportes separados)
- [ ] Plan contiene 11 secciones OBLIGATORIAS
- [ ] Plan especifica 12+ PRs con criterios PASO verificables
- [ ] Plan tiene timeline realista (horas, sprints, fecha)
- [ ] Hallazgos incluyen archivo:línea exacta
- [ ] Criterios PASO son verificables (grep, test, build)
- [ ] Referencias a CONVENTIONS.md correctas (§XX)
- [ ] Guardado en ubicación exacta: docs/reporte_maestro/modulos/ + docs/plans/

**Si alguno está vacío → NO ENTREGUES, completa primero**

---

## 📝 EJEMPLO: Flujo Correcto

```
PASO 1 (15 min): Leer CONVENTIONS.md + audit-layers-checklist.md
PASO 2 (2-3 h): Auditar 20 capas + crear FASE 0
PASO 3 (1-2 h): Crear Plan integrado (11 secciones)
PASO 4: Guardar en ubicación exacta
PASO 5: NO PREGUNTAR, entregar

ARCHIVO 1: docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
ARCHIVO 2: docs/plans/YYYYMMDD-remediacion-[modulo]-plan.md

TECH LEAD VALIDA AMBOS → Si cumple 9 checkboxes, aprueba
TECH LEAD APRUEBA → Otro agente ejecuta PRs (Fase 1, 2, 3)
```

---

**Vigencia:** 2026-07-29 — ∞  
**Aplicable a:** TODOS los agentes, SIN EXCEPCIONES  
**No hay opciones. Punto.**
