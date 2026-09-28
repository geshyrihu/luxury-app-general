# Módulos Nuevos: Estructura y Proceso

**Vigencia:** 2026-07-30 en adelante  
**Propósito:** Documentar descubrimiento, análisis y planificación de módulos nuevos  
**Responsable:** Tech Lead (solicita) + Agentes (ejecutan)

---

## 📋 ESTRUCTURA DE UN MÓDULO NUEVO

```
docs/modulos-nuevos/
└── nombreModuloNuevo/
    ├── README.md                              ← Estado y tracking
    ├── 01-discovery-questionnaire.md          ← Cuestionario (respondido)
    ├── ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md          ← FASE 0 (Problem + KPIs + Matriz RN)
    ├── ../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md         ← Decisiones técnicas
    ├── ../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md              ← Plan formal (11 secciones)
    ├── 05-module-documentation.md             ← Documentación técnica
    └── CHECKLIST.md                           ← Tracking de progreso
```

---

## 🎯 QUÉ CONTIENE CADA DOCUMENTO

### 01-discovery-questionnaire.md

**Qué es:** Cuestionario completado por Tech Lead  
**Quién lo crea:** Agente (plantilla) + Tech Lead (respuestas)  
**Tiempo:** 30-60 minutos  
**Contenido:**
- Contexto del negocio
- Reglas de negocio (4 niveles)
- Flujos principales (happy, sad, edge)
- Integraciones
- Restricciones técnicas

**Referencia:** `conventions/operations/discovery-questionnaire-template.md`

---

### ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md

**Qué es:** FASE 0 - Análisis de reglas de negocio  
**Quién lo crea:** Agente (basado en 01-discovery-questionnaire.md)  
**Tiempo:** 1-2 horas  
**Contenido:**
- Problem Statement (formato estructurado)
- KPIs (medibles y rastreables)
- Matriz de Reglas de Negocio (4 niveles con códigos RN-MOD-NNN)
- Pre-Mortem (qué podría fallar)

**Formato:**
```
# Análisis de Reglas de Negocio - [Módulo]

## Problem Statement
[Actualmente, ACTOR sufre PROBLEMA cuando ACCIÓN, resultando en CONSECUENCIA]

## KPIs
| Métrica | Baseline | Target | Timeline |
|:---|:---|:---|:---|
| ... | ... | ... | ... |

## Matriz de Reglas de Negocio

### RN-MOD-001 [Nivel 1: Invariante de Dominio]
Descripción

### RN-MOD-002 [Nivel 2: Flujo y Estados]
Descripción

### RN-MOD-003 [Nivel 3: Seguridad/Autorización]
Descripción

### RN-MOD-004 [Nivel 4: Validación de Datos]
Descripción

## Pre-Mortem
[Técnica: asumimos que salió a prod y fue desastre, ¿qué lo causó?]
```

---

### ../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md

**Qué es:** Decisiones técnicas preliminares  
**Quién lo crea:** Agente (arquitecto)  
**Tiempo:** 1-2 horas  
**Contenido:**
- Stack tecnológico recomendado
- Estructura de backend (DTOs, servicios, endpoints)
- Estructura de frontend (componentes, rutas)
- Decisiones de integración
- Dependencias técnicas

---

### ../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md

**Qué es:** Plan formal de ejecución  
**Quién lo crea:** Agente (basado en ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)  
**Tiempo:** 2-3 horas  
**Contenido:**
- Metadata
- Resumen ejecutivo
- Objetivo y alcance
- Restricciones
- Fases (detalladas)
- Checklist por fase
- Criterios de paso
- Riesgos
- Dependencias
- Cierre esperado

**Referencia:** `conventions/operations/plan-creation-protocol.md`

---

### 05-module-documentation.md

**Qué es:** Documentación técnica del módulo  
**Quién lo crea:** Agente (después de implementar)  
**Tiempo:** 3-4 horas  
**Contenido:**
- README ejecutivo
- Documentación técnica (arquitectura, APIs, flows)
- Guías operativas
- Troubleshooting

**Referencia:** `conventions/operations/module-documentation-instructions.md`

---

### README.md (de cada módulo)

**Contenido:**
```
# Módulo: [Nombre]

## Estado General

| Fase | Estado | Responsable | Fecha |
|:---|:---|:---|:---|
| Descubrimiento (01) | ✅ Completo | Agente X | 2026-07-31 |
| Análisis (02) | ✅ Completo | Agente X | 2026-08-01 |
| Arquitectura (03) | ⏳ En progreso | Agente Y | - |
| Planeación (04) | ⏳ En progreso | Agente Y | - |
| Documentación (05) | ⏳ Pendiente | - | - |

## Documentos
- [01-discovery-questionnaire.md](./01-discovery-questionnaire.md)
- [../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md](./../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)
- [../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md](./../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md)
- [../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md)
- [05-module-documentation.md](./05-module-documentation.md)

## Decisiones Críticas
- [Lista de decisiones importantes]

## Bloqueadores
- [Si los hay]

## Próximos Pasos
- [Qué sigue]
```

---

### CHECKLIST.md

```
# Checklist de Progreso - [Módulo]

## FASE: Descubrimiento
- [ ] Agente crea plantilla de cuestionario
- [ ] Tech Lead completa cuestionario
- [ ] Agente valida respuestas (no hay ambigüedades)

## FASE: Análisis
- [ ] Agente extrae Problem Statement
- [ ] Agente define KPIs
- [ ] Agente crea Matriz de Reglas de Negocio
- [ ] Agente ejecuta Pre-Mortem
- [ ] Tech Lead valida FASE 0

## FASE: Arquitectura
- [ ] Agente propone stack backend
- [ ] Agente propone stack frontend
- [ ] Agente mapea integraciones
- [ ] Tech Lead aprueba arquitectura

## FASE: Planeación
- [ ] Agente crea plan formal (11 secciones)
- [ ] Plan incluye criterios de paso verificables
- [ ] Tech Lead aprueba plan

## FASE: Implementación
- [ ] Agente ejecuta Fase 1 del plan
- [ ] Agente ejecuta Fase 2 del plan
- [ ] Agente ejecuta Fase 3 del plan
- [ ] Tests pasan (>80% cobertura)
- [ ] Code review aprobado

## FASE: Documentación
- [ ] Agente crea documentación técnica
- [ ] Agente crea guías operativas
- [ ] Tech Lead valida documentación

## CIERRE
- [ ] Módulo auditoría contra CONVENTIONS.md (20 capas)
- [ ] 0 violaciones críticas
- [ ] Listo para producción
```

---

## 🚀 FLUJO COMPLETO

```
PASO 1: TÚ SOLICITAS MÓDULO
"Necesito crear sistema para [problema]"

        ↓

PASO 2: AGENTE DESCUBRE
Crea 01-discovery-questionnaire.md
Envía cuestionario a Tech Lead

        ↓

PASO 3: TÚ RESPONDES
Completas cuestionario (30-60 min)

        ↓

PASO 4: AGENTE ANALIZA
Crea ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md (FASE 0)
Traduce respuestas a Problem Statement + KPIs + Matriz RN

        ↓

PASO 5: AGENTE DISEÑA
Crea ../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md

        ↓

PASO 6: AGENTE PLANIFICA
Crea ../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md (basado en FASE 0)

        ↓

PASO 7: TÚ VALIDAS
Apruebas FASE 0 + Arquitectura + Plan

        ↓

PASO 8: AGENTE IMPLEMENTA
Ejecuta plan (PRs pequeños, uno por tema)

        ↓

PASO 9: DOCUMENTAR
Crea 05-module-documentation.md

        ↓

PASO 10: AUDITORIA
Verifica contra CONVENTIONS.md (20 capas)

        ↓

✅ MÓDULO COMPLETADO
```

---

## 📂 EJEMPLO DE ESTRUCTURA

```
docs/modulos-nuevos/
├── README.md (este archivo)
├── ejemplo-registro-entradas-personal/
│   ├── README.md
│   ├── 01-discovery-questionnaire.md (completado)
│   ├── ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md (ejemplo)
│   ├── ../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md (ejemplo)
│   ├── ../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md (ejemplo)
│   └── CHECKLIST.md
└── [Tu módulo nuevo aquí]
    ├── README.md
    ├── 01-discovery-questionnaire.md
    ├── ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md
    └── ...
```

---

## ⚠️ REGLAS OBLIGATORIAS

1. **No saltarse el cuestionario:** Sin descubrimiento = plan incompleto
2. **No asumir respuestas:** Preguntar explícitamente
3. **Documentar TODO:** Cada decisión debe estar registrada
4. **Validar con Tech Lead:** Cada fase requiere aprobación antes de siguiente
5. **Usar nomenclatura exacta:** YYYYMMDD-modulo-tipo.md

---

## 🔗 REFERENCIAS

- [Discovery Questionnaire Template](../../conventions/operations/discovery-questionnaire-template.md)
- [Plan Creation Protocol](../../conventions/operations/plan-creation-protocol.md)
- [Module Documentation Instructions](../../conventions/operations/module-documentation-instructions.md)
- [CONVENTIONS.md § 4.6 - Creación de Módulo Nuevo](../CONVENTIONS.md)

---

*Documento: docs/modulos-nuevos/README.md - 2026-07-30*
