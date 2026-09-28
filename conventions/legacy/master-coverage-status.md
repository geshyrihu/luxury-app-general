# Estado Maestro de Cobertura Legacy

**Fecha:** 2026-07-30
**Objetivo:** concentrar en un solo lugar el estado real de absorcion de los
documentos historicos revisados durante la migracion al sistema rector nuevo.

## Criterios de estado

- `absorbido funcionalmente`
  - la regla ya vive en documentos oficiales vigentes
- `alineado`
  - el documento fue actualizado para subordinarse al sistema rector
- `apoyo controlado`
  - conserva valor historico o de detalle, pero ya no es autoridad primaria
- `pendiente fino`
  - existe absorcion parcial, pero aun puede requerir consolidacion adicional

## Bloques ejecutados

| Bloque | Evidencia |
|---|---|
| Block 1 - agentes y protocolos | `conventions/legacy/20260730-block-1-agent-protocol-traceability.md` |
| Block 2 - onboarding, hooks y encoding | `conventions/legacy/20260730-block-2-operations-traceability.md` |
| Block 3 - gobernanza, viewer y UI | `conventions/legacy/20260730-block-3-governance-ui-traceability.md` |
| Block 4 - audit, compliance y shared services | `conventions/legacy/block-4-audit-compliance-traceability.md` |
| Block 5 - guides y plantillas operativas | `conventions/legacy/20260730-block-5-guides-traceability.md` |

## Estado por documento historico

| Documento | Estado | Destino rector o control principal |
|---|---|---|
| `conventions/agent-audit-protocol.md` | absorbido funcionalmente / apoyo controlado | `conventions/audit/*` |
| `conventions/agent-instructions-catalog.md` | alineado / apoyo controlado | `conventions/operations/agent-task-catalog.md` |
| `conventions/auditoria-por-rol.md` | absorbido funcionalmente / apoyo controlado | `conventions/audit/audit-by-role.md` |
| `conventions/audit-layers-checklist.md` | absorbido funcionalmente / apoyo controlado | `conventions/audit/audit-checklist.md` + `audit-module-conventions.md` |
| `conventions/AVAILABLE_FEATURES.md` | absorbido funcionalmente / apoyo controlado | `conventions/operations/available-features.md` |
| `conventions/changelog.md` | vigente oficial | `conventions/changelog.md` |
| `conventions/conventions-viewer-guide.md` | alineado / apoyo controlado | `conventions/ui/conventions-viewer-governance.md` |
| `conventions/decision-tree-components.md` | absorbido parcialmente / apoyo controlado | `conventions/ui/ui-usage-catalog.md` |
| `conventions/DESIGN_CONVENTIONS.md` | absorbido parcialmente / apoyo controlado | `conventions/ui/*` + `conventions/styles/*` |
| `conventions/DEVELOPER_ONBOARDING.md` | absorbido funcionalmente | `conventions/operations/developer-onboarding.md` |
| `conventions/encoding-stricto.md` | alineado / apoyo controlado | `conventions/operations/encoding-rules.md` |
| `conventions/git-hooks-setup.md` | absorbido funcionalmente / apoyo controlado | `conventions/operations/git-hooks-and-audits.md` |
| `conventions/gobernanza-convenciones.md` | absorbido funcionalmente / apoyo controlado | `conventions/core/governance.md` + `governance-by-role.md` |
| `conventions/IMPLEMENTATION_CHECKLIST.md` | alineado / apoyo controlado | `conventions/operations/implementation-checklist.md` |
| `conventions/module-documentation-instructions.md` | absorbido funcionalmente / apoyo controlado | `conventions/operations/module-documentation-instructions.md` |
| `conventions/onboarding-git-hooks.md` | absorbido funcionalmente / apoyo controlado | `conventions/operations/developer-onboarding.md` + `git-hooks-and-audits.md` |
| `conventions/PLAN_REVISION_SERVICIOS_COMPARTIDOS.md` | absorbido parcialmente / apoyo controlado | `conventions/backend/backend-shared-services-catalog.md` |
| `conventions/PROTOCOLO_COMPLIANCE_CONVENCIONES.md` | alineado / apoyo controlado | `conventions/core/compliance-protocol.md` |
| `conventions/README.md` | vigente oficial | `conventions/README.md` |
| `conventions/readme-plans.md` | alineado / apoyo controlado | `docs/plans/*` + `conventions/operations/plan-creation-protocol.md` + `plan-agent-instructions.md` |
| `conventions/roles-y-perfiles.md` | absorbido funcionalmente / apoyo controlado | `conventions/core/governance-by-role.md` |
| `conventions/scripts-auditoria.md` | absorbido funcionalmente | `conventions/operations/git-hooks-and-audits.md` |
| `conventions/tech-lead-onboarding-guide.md` | absorbido funcionalmente | `conventions/operations/tech-lead-onboarding.md` |
| `conventions/TECH_LEAD_TRAINING.md` | alineado / apoyo controlado | `conventions/core/tech-lead-training.md` |
| `docs/guides/README.md` | alineado | `conventions/operations/guides-creation-protocol.md` |
| `docs/guides/guide-agent-instructions.md` | alineado / apoyo controlado | `conventions/operations/guides-creation-protocol.md` |
| `docs/guides/20260715-guia-agente-soporte-errores-refactor.md` | alineado / apoyo controlado | `conventions/operations/guides-creation-protocol.md` |
| `conventions/operations/plan-agent-instructions.md` | vigente oficial | `conventions/operations/plan-agent-instructions.md` |

## Hallazgos pendientes de consolidacion fina

- `conventions/DESIGN_CONVENTIONS.md`
  - ya no manda y su criterio principal ya fue absorbido parcialmente
  - quedo reconstruido como apoyo controlado legible
- `conventions/PLAN_REVISION_SERVICIOS_COMPARTIDOS.md`
  - el catalogo oficial ya absorbio reglas operativas, pero el inventario
    puntual de estado por servicio sigue siendo historico util
- `conventions/readme-plans.md`
  - ya no debe operar como autoridad, pero puede seguir aportando contexto
    historico sobre planes anteriores
- `conventions/decision-tree-components.md`
  - su criterio principal ya vive en `ui/ui-usage-catalog.md`
  - quedo reconstruido como apoyo controlado legible

## Hallazgos operativos detectados durante la ejecucion

- `conventions/README.md`
  - mezclaba enlaces a documentos oficiales nuevos con archivos legacy en raiz
  - se corrigio para priorizar `operations/*` y mandar la trazabilidad a
    `legacy/*`
- `conventions/legacy/README.md`
  - apuntaba a rutas antiguas para la propia matriz y el coverage status
  - se corrigieron los enlaces para que la transicion quede navegable desde el
    indice legacy
- `conventions/readme-plans.md`
  - seguia presentandose como autoridad operativa y usando referencias viejas
  - se alineo como apoyo controlado y ahora remite al protocolo y a la guia
    operativa vigentes
- `conventions/conventions-viewer-guide.md`
  - seguia describiendo el viewer como si fuera autoridad primaria vigente
  - se alineo como apoyo controlado subordinado a
    `ui/conventions-viewer-governance.md`
- `conventions/TECH_LEAD_TRAINING.md`
  - fue reconstruido como apoyo controlado legible y subordinado al sistema
    rector actual
- `conventions/PROTOCOLO_COMPLIANCE_CONVENCIONES.md`
  - fue reconstruido como apoyo controlado y enlazado al compliance vigente
- `conventions/agent-instructions-catalog.md`
  - fue reconstruido como apoyo controlado y subordinado al catalogo operativo
    actual de agentes
- `conventions/DESIGN_CONVENTIONS.md`
  - seguia concentrando reglas finas de UI y styles no totalmente visibles en
    el catalogo oficial
  - se absorbieron reglas adicionales en `ui/ui-usage-catalog.md`
- `conventions/decision-tree-components.md`
  - seguia reteniendo detalle operativo del arbol de seleccion de componentes
  - su criterio principal ya quedo cubierto por `ui/ui-usage-catalog.md`
- `conventions/PLAN_REVISION_SERVICIOS_COMPARTIDOS.md`
  - seguia conservando reglas finas de uso de servicios compartidos
  - se absorbieron reglas operativas adicionales en
    `backend/backend-shared-services-catalog.md`

## Pendiente tecnico menor

Persisten residuos menores de encoding o maquetacion en algunos documentos no
rectores y en evidencia legacy. Ese pendiente ya no representa una brecha
normativa, sino un ajuste de presentacion documental.

## Siguiente barrido recomendado

Prioridad media de saneamiento adicional:

- continuar reduciendo mojibake residual en documentos no rectores
- revisar evidencia legacy que aun conserve texto viejo o referencias visuales
- decidir si se reconstruyen otros historicos menores como apoyo controlado

## Lectura del estado

El sistema ya tiene cobertura fuerte en gobernanza, auditoria, compliance,
onboarding, guides, planes y shared services. Lo que queda no es una ausencia
global del modelo, sino consolidacion fina de documentos de apoyo historico que
todavia conservan detalle util.


