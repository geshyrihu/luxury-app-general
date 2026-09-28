# Módulo: Registro de Entradas del Personal

**Código:** REP (Registro Entradas Personal)  
**Estado:** 🟡 En Fase de Análisis  
**Tech Lead:** [Usuario]  
**Fecha Inicio:** 2026-07-30

---

## 📊 ESTADO GENERAL

| Fase | Estado | Responsable | Fecha | Entregable |
|:---|:---|:---|:---|:---|
| 1️⃣ Descubrimiento | ✅ Completo | Tech Lead | 2026-07-30 | [01-discovery-questionnaire.md](./01-discovery-questionnaire.md) |
| 2️⃣ Análisis (FASE 0) | ✅ Completo | Claude Code | 2026-07-30 | [../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md](./../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md) |
| 3️⃣ Arquitectura Preliminar | ⏳ En progreso | Claude Code | 2026-07-31 | [../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md](./../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md) |
| 4️⃣ Plan de Implementación | ⏳ Pendiente | Claude Code | 2026-08-01 | [../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md) |
| 5️⃣ Documentación del Módulo | ⏳ Pendiente | Claude Code | Después impl. | [05-module-documentation.md](./05-module-documentation.md) |

---

## 📁 DOCUMENTOS

- **[01-discovery-questionnaire.md](./01-discovery-questionnaire.md)** — Cuestionario respondido (fuente de verdad)
- **[../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md](./../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)** — FASE 0 completa (Problem + KPIs + Matriz RN + Pre-Mortem)
- **[../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md](./../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md)** — Decisiones técnicas (EN PROGRESO)
- **[../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md)** — Plan formal 11 secciones (PENDIENTE)
- **[05-module-documentation.md](./05-module-documentation.md)** — Documentación técnica (PENDIENTE)
- **[../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md](./../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md)** — Tracking de progreso

---

## 🎯 RESUMEN EJECUTIVO

**Problema:** Registros manuales de asistencia → errores, retrasos, inconsistencias con nómina

**Solución:** Sistema automatizado de registro de entradas/salidas via QR + API, integrado con AccessControl

**Beneficios:**
- Reducir tiempo de registro de 5 min → 30 seg
- Eliminar errores de asistencia
- Sincronización automática con nómina
- Auditoría completa de cambios

**Complejidad:** Media  
**Timeline:** Q3 2026 (6-8 semanas)  
**Recursos:** 1 Backend + 1 Frontend + 1 QA

---

## 🔑 DECISIONES CRÍTICAS

### D1: Método de Registro
**Decisión:** QR + PIN fallback  
**Justificación:** AccessControl ya tiene infraestructura de QR  
**Riesgo:** Si AccesControl no está disponible → fallback a PIN

### D2: Integración con Nómina
**Decisión:** Batch diario a las 23:59  
**Justificación:** Nómina procesa daily, no necesita tiempo real  
**Riesgo:** Si empleado registra entrada después de cierre, se pierde un día

### D3: Almacenamiento de Datos Sensibles
**Decisión:** NO almacenar razones de ausencia en DB principal, archivo separado  
**Justificación:** Privacidad de datos (GDPR-like)  
**Riesgo:** Complejidad de consultas cruzadas

---

## 🚨 BLOQUEADORES ACTUALES

🟢 **NINGUNO** — AccessControl está disponible, Nómina puede recibir datos

---

## ✅ PRÓXIMOS PASOS

1. **Hoy:** Validar FASE 0 (../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md) con Tech Lead
2. **Mañana:** Crear Arquitectura Preliminar (../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md)
3. **Al otro día:** Crear Plan de Implementación (../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md)
4. **Semana 1:** Tech Lead aprueba Plan
5. **Semana 2:** Iniciar Fase 1 del Plan (Backend básico)

---

## 📞 CONTACTO

**Agente:** Claude Code  
**Tech Lead:** [Usuario]  
**Canal:** chat.agentes.md (para debates)

---

*Documento: docs/modulos-nuevos/registro-entradas-personal/README.md - 2026-07-30*
