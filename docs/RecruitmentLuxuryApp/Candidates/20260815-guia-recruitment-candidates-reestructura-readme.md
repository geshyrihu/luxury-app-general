# Reestructuración - Reclutamiento Candidates

## Estado General

| Fase | Estado | Responsable | Fecha |
|:---|:---|:---|:---|
| Descubrimiento (01) | ✅ Completo | Codex | 2026-08-11 |
| Análisis (02) | ✅ Completo | Codex | 2026-08-11 |
| Arquitectura (03) | ✅ Completo | Codex | 2026-08-11 |
| Planeación (04) | ✅ Completo | Codex | 2026-08-11 |
| Documentación objetivo (05) | ⏳ Pendiente de ejecución | Reclutamiento / Tech Lead | - |

## Documentos

- [01-discovery-questionnaire.md](./01-discovery-questionnaire.md)
- [../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md](./../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)
- [../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md](./../../../docs/RecruitmentLuxuryApp/Candidates/20260815-arquitectura-recruitment-candidates-reestructura.md)
- [../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md)
- [../../../docs/RecruitmentLuxuryApp/Candidates/20260815-guia-recruitment-candidates-handoff.md](./../../../docs/RecruitmentLuxuryApp/Candidates/20260815-guia-recruitment-candidates-handoff.md)
- [../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md](./../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md)

## Decisiones Críticas

- La reestructuración se aprueba como cambio mayor de dominio, no como ajuste local.
- Se elimina el modelo actual de entrevista embebida en `CandidateApplication`.
- La nueva fuente de verdad para entrevistas será una entidad dedicada.
- La experiencia laboral del candidato deja de ser texto libre y pasa a estructura hija.
- La UI de Reclutamiento se reordena alrededor de: Candidato -> Vacante -> Entrevistas -> Alta.

## Bloqueadores

- Requiere migraciones de datos y de esquema.
- Requiere actualización coordinada de backend, frontend, notificaciones y plantillas email.
- Requiere validación funcional del flujo completo de Reclutamiento antes de reabrir vistas de entrevistador.

## Próximos Pasos

1. Aprobación del paquete de reestructuración.
2. Ejecución por fases del plan de [../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md).
3. Validación runtime en ambiente local con datos reales.
4. Documentación final del módulo reestructurado.
