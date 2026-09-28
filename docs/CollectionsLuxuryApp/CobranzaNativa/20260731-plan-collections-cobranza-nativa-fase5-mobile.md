# Fase 5 - Estrategia Mobile Por Subdominio

**Fecha:** 2026-07-31
**Modulo:** `CobranzaNativa`
**Estado:** Definida con evidencia de componentes reales

## Objetivo

Dejar trazable qué subdominios operativos de `CobranzaNativa` ya cuentan con
variante mobile basada en el catálogo permitido y cuáles requieren todavía
validación funcional específica.

## Criterio rector aplicado

Con base en `CONVENTIONS.md` y
`conventions/modules/cobranza-nativa-module-conventions.md`:

- desktop y mobile son obligatorios para cualquier UI operativa del módulo
- la variante mobile debe reutilizar el catálogo existente, no crear layouts
  paralelos arbitrarios
- una tabla desktop con `custom-table hidden md:block` debe tener contraparte
  explícita `app-data-view-mobile` cuando el flujo sea operativo

## Patrón mobile vigente detectado

Patrón estándar ya repetido en el módulo:

- tabla desktop con `p-table` y `custom-table hidden md:block`
- variante mobile con `app-data-view-mobile`
- item mobile con `ili-list-item`
- acciones mobile con `ili-action-menu`, `ili-button-edit`,
  `ili-button-delete` o `il-button`

## Subdominios revisados con evidencia mobile

- `charges`
  - evidencia en `core/charges/charge-list.html`
  - estado: variante mobile presente y ya cubierta con pruebas de lista
- `payments`
  - evidencia en `core/payments/payment-list.html`
  - estado: variante mobile presente y ya cubierta con pruebas de lista
- `members`
  - evidencia en `core/members/member-list.html`
  - estado: variante mobile presente y ya cubierta con pruebas de lista
- `native-statement`
  - evidencia en `core/native-statement/native-statement.html`
  - estado: variante mobile presente para resumen y movimientos; pruebas ya
    cubren la lógica principal del componente
- `ledger`
  - evidencia en `core/ledger/ledger-viewer.html`
  - estado: variante mobile presente y lógica principal ya cubierta
- `audit`
  - evidencia en `core/audit/financial-audit-log.html`
  - estado: variante mobile presente y lógica principal ya cubierta
- `approvals`
  - evidencia en `core/approvals/approval-inbox.html`
  - estado: variante mobile presente; falta cobertura dedicada
- `period-closures`
  - evidencia en `core/period-closures/period-closure-dashboard.html`
  - estado: variante mobile presente; falta cobertura dedicada

## Subdominios con patrón mobile detectado fuera del bloque prioritario

- `charge-templates`
- `charge-types`
- `collection-cases`
- `initial-balance`
- `invoices`
- `late-fee-policies`
- `property-fines`
- `reconciliation`
- `regulation-articles`

## Decisión operativa

Para cierre de Fase 5, el criterio mobile queda dividido así:

- bloque A ya cubierto funcionalmente:
  - `charges`
  - `payments`
  - `members`
  - `native-statement`
  - `ledger`
  - `audit`
- bloque B pendiente de validación dedicada:
  - `approvals`
  - `period-closures`
- bloque C pendiente de validación secundaria:
  - listados auxiliares restantes detectados con `app-data-view-mobile`

## Regla de ejecución siguiente

- no crear componentes mobile nuevos si el subdominio ya usa
  `app-data-view-mobile`
- validar primero comportamiento y acciones del bloque B
- dejar el bloque C para una pasada de consolidación, no como requisito para
  seguir remediando contratos o backend
