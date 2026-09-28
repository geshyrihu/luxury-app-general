# Trazabilidad - Bloque 1 Agentes y Protocolos

**Fecha:** 2026-07-30
**Bloque:** agentes, auditoria, planes y guias

---

## Archivos revisados

1. `conventions/agent-audit-protocol.md`
2. `conventions/agent-instructions-catalog.md`
3. `conventions/operations/plan-agent-instructions.md`
4. `docs/guides/guide-agent-instructions.md`
5. `conventions/readme-plans.md`
6. `docs/guides/README.md`

---

## Resultado

### 1. `agent-audit-protocol.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado al sistema nuevo:**
  - auditoria completa como unica modalidad valida
  - salida obligatoria de reporte + plan + checklist
  - no cerrar auditoria sin plan cuando hay hallazgos materiales
  - ubicacion oficial de salida
- **Destino nuevo principal:**
  - [audit-module-conventions.md](../audit/audit-module-conventions.md)
- **Pendiente:**
  - revisar si la parte legacy de `20 capas` debe absorberse adicionalmente o
    quedar preservada en `audit-layers-checklist.md`

### 2. `agent-instructions-catalog.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado al sistema nuevo:**
  - catalogo de solicitudes por tipo de trabajo
  - reglas especiales para auditoria y planes
  - referencias oficiales a protocolos nuevos
- **Destino nuevo principal:**
  - [agent-task-catalog.md](../operations/agent-task-catalog.md)
- **Pendiente:**
  - limpiar referencias legacy restantes y degradarlo a apoyo controlado

### 3. `PLAN_AGENT_INSTRUCTIONS.md`

- **Estatus:** apoyo activo controlado
- **Valor migrado al sistema nuevo:**
  - protocolo oficial de creacion de planes
  - estructura minima obligatoria
  - fase de preparacion equivalente a `FASE 0`
- **Destino nuevo principal:**
  - [plan-creation-protocol.md](../operations/plan-creation-protocol.md)
- **Pendiente:**
  - validar que todo formato historico util ya tenga equivalente nuevo antes de
    degradarlo

### 4. `guide-agent-instructions.md`

- **Estatus:** apoyo activo controlado
- **Valor migrado al sistema nuevo:**
  - protocolo oficial para crear guias
  - estructura minima obligatoria
  - checklist y limites de actuacion
- **Destino nuevo principal:**
  - [guides-creation-protocol.md](../operations/guides-creation-protocol.md)
- **Pendiente:**
  - revisar compatibilidad exacta con las guias existentes

### 5. `readme-plans.md`

- **Estatus:** parcialmente absorbido
- **Valor migrado al sistema nuevo:**
  - el sistema nuevo ya tiene protocolo oficial para planes
- **Destino nuevo principal:**
- [../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)
  - [plan-creation-protocol.md](../operations/plan-creation-protocol.md)
- **Pendiente:**
  - limpiar numeracion vieja y dejarlo como indice historico controlado

### 6. `docs/guides/README.md`

- **Estatus:** parcialmente absorbido
- **Valor migrado al sistema nuevo:**
  - diferencia entre guias y otros artefactos
  - necesidad de indexar guias activas
- **Destino nuevo principal:**
  - [guides-creation-protocol.md](../operations/guides-creation-protocol.md)
- **Pendiente:**
  - limpiar referencias a numeracion vieja de `CONVENTIONS.md`

---

## Ambiguedades resueltas en este bloque

- la auditoria oficial no puede cerrarse como `quick audit` o `auditoria rapida`
- crear plan ya tiene protocolo oficial nuevo y no depende solo del documento
  legacy en `docs/plans`
- crear guia ya tiene protocolo oficial nuevo y no depende solo del documento
  legacy en `docs/guides`

---

## Pendientes reales de este bloque

- sanear referencias legacy y numeracion vieja en los documentos historicos
- decidir cuando cada archivo puede pasar de apoyo activo a legacy pasivo
- revisar si conviene crear una capa nueva para `audit protocol` mas detallado o
  si el sistema actual ya quedo suficiente


