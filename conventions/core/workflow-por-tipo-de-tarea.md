# Workflow por Tipo de Tarea

**Ultima revision:** 2026-07-31

## Objetivo

Evitar que cada agente lea documentos diferentes o improvise el flujo de trabajo.

## Relacion con CONVENTIONS.md

Este documento es el **espejo operativo** de `CONVENTIONS.md` §4. Debe mantenerse
**sincronizado** con esa seccion. Si hay diferencia, **gana** `CONVENTIONS.md` §4.

Rutas relativas a partir de `conventions/`.

---

## 4.1 Implementacion backend

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `backend/backend-rules.md`
4. `catalogs/naming-conventions.md`
5. `catalogs/folder-structure-conventions.md`
6. `backend/backend-module-structure.md`
7. `backend/backend-generic-services-catalog.md`
8. Documento del modulo si existe

## 4.2 Implementacion frontend

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `frontend/frontend-rules.md`
4. `ui/ui-desktop-rules.md`
5. `ui/ui-mobile-rules.md`
6. `styles/styles-rules.md`
7. `catalogs/naming-conventions.md`
8. `frontend/frontend-feature-structure.md`
9. `frontend/frontend-api-endpoints.md`
10. `frontend/frontend-generic-services-catalog.md`
11. Documento del modulo o feature si existe

## 4.3 Implementacion flutter

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `flutter/flutter-rules.md`
4. `catalogs/naming-conventions.md`
5. `flutter/flutter-feature-structure.md`
6. `flutter/flutter-generic-services-catalog.md`
7. Documento del modulo si existe

## 4.4 Auditoria de modulo

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `audit/audit-module-conventions.md`
4. `audit/audit-checklist.md`
5. `audit/audit-by-role.md`
6. Documento del stack correspondiente
7. Documentos de naming, estructura, UI y styles que apliquen
8. Documento del modulo si existe
9. `operations/agent-task-catalog.md`
10. `operations/audit-agent-instructions.md` — guia operativa de ejecucion
11. Plan derivado obligatorio si hay hallazgos relevantes

## 4.5 Documentacion, remediacion y migracion

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `core/compliance-protocol.md`
4. Documento especializado del stack
5. Documentos de estructura y naming aplicables
6. Documento del modulo si existe
7. Si hay conflicto con legacy: crear o seguir plan de migracion aprobado
8. `operations/agent-task-catalog.md`
9. Si la tarea es crear plan: `operations/plan-creation-protocol.md`
10. Si la tarea es crear guia: `operations/guides-creation-protocol.md`
11. Si la tarea es documentar modulo: `operations/module-documentation-instructions.md`

## 4.6 Creacion de modulo nuevo

1. `CONVENTIONS.md`
2. `core/workflow-por-tipo-de-tarea.md`
3. `operations/discovery-questionnaire-template.md`
4. `operations/business-rules-discovery-phase-0.md` — lectura obligatoria antes de cualquier plan
5. Estructura plana de docs por modulo nuevo: `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md` (ver `CONVENTIONS.md` §6ter)
6. `operations/application-roles-catalog.md`
7. `operations/plan-creation-protocol.md`
8. `operations/plan-agent-instructions.md`
9. `operations/data-migration-protocol.md`
10. `operations/module-documentation-instructions.md`

Diagrama de flujo y regla FASE 0: ver `CONVENTIONS.md` §5.9.

---

## Solicitud de trabajo a agentes

Flujo auxiliar cuando el Tech Lead delega tareas sin especificar el tipo exacto:

1. `CONVENTIONS.md`
2. `operations/agent-task-catalog.md`
3. Documento especializado del stack o del tipo de tarea (segun §4.1–§4.6)
4. Documentacion del modulo si existe

