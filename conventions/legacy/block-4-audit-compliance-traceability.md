# Trazabilidad Block 4 - Audit, Compliance y Servicios Compartidos

**Fecha:** 2026-07-30
**Estado:** absorbido con trazabilidad activa

## Objetivo

Registrar como se absorbio el bloque legacy centrado en auditoria por rol,
checklist exhaustivo, protocolo de compliance, documentacion de modulos y
servicios compartidos backend.

## Matriz de absorcion

| Documento legacy | Estado | Destino oficial principal | Nota |
|---|---|---|---|
| `conventions/auditoria-por-rol.md` | absorbido funcionalmente | `conventions/audit/audit-by-role.md` | se integraron verificaciones, comandos, criterios y cierres por rol |
| `conventions/audit-layers-checklist.md` | absorbido funcionalmente | `conventions/audit/audit-checklist.md` + `conventions/audit/audit-module-conventions.md` | se consolidaron capas minimas, evidencia obligatoria e invariantes |
| `conventions/module-documentation-instructions.md` | absorbido funcionalmente | `conventions/operations/module-documentation-instructions.md` | se formalizaron niveles README y documentacion tecnica |
| `conventions/PROTOCOLO_COMPLIANCE_CONVENCIONES.md` | absorbido funcionalmente | `conventions/core/compliance-protocol.md` | el ciclo oficial ahora vive en la taxonomia nueva |
| `conventions/PLAN_REVISION_SERVICIOS_COMPARTIDOS.md` | absorbido parcialmente con reglas operativas | `conventions/backend/backend-shared-services-catalog.md` | se absorbieron arquitectura, uso y servicios sensibles; el inventario historico sigue como apoyo |

## Cobertura lograda

- auditoria por rol ya no depende del legacy para operar
- el checklist oficial ya no deja fuera evidencia minima ni capas clave
- la documentacion de modulo ya tiene niveles, ubicaciones y reglas de
  actualizacion
- el ciclo de compliance ya existe en documento oficial de la estructura nueva
- el catalogo backend de servicios compartidos ya incluye arquitectura, DI,
  reglas de uso y servicios heredados sensibles

## Pendiente controlado

- `PLAN_REVISION_SERVICIOS_COMPARTIDOS.md` conserva valor historico como
  inventario detallado de estado puntual; no debe usarse como autoridad primaria
  pero aun puede consultarse como apoyo hasta que el catalogo oficial requiera
  un nivel de detalle equivalente
