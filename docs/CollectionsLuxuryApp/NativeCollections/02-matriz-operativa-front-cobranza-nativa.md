# Cobranza Nativa Frontend - Matriz Operativa de Frontera

Fecha de actualizacion: 2026-07-26
Estado: Auditada con evidencia local
Alcance: Solo `appsweb/angular/src/app/modules/collections.luxuryapp/cobranza-nativa`

## Objetivo

Dejar claro que pantallas, contratos y textos del frontend:

- son nativos del modulo
- son compatibilidad externa temporal
- no deben mezclar Aspel o modulos live/local en el flujo principal

## Evidencia de auditoria ejecutada

Revision textual aplicada el 2026-07-26 sobre `cobranza-nativa`:

- busqueda de `Aspel`
- busqueda de `Live`
- busqueda de `HausLive`
- busqueda de `Local`
- busqueda de `CobranzaLive`
- busqueda de `CobranzaLocal`

Resultado:

- no se encontraron referencias textuales activas en pantallas o templates del portal nativo
- la compatibilidad restante esta concentrada en `billing-config` y en `contracts/external-compatibility`

## Matriz por zona

### Core nativo

Pantallas nativas puras:

- `core/charges`
- `core/payments`
- `core/native-statement`
- `core/ledger`
- `core/approvals`
- `core/period-closures`
- `core/audit`
- `core/reconciliation`
- `core/charge-types`
- `core/charge-templates`
- `core/charge-template-coverage`
- `core/late-fee-policies`
- `core/initial-balance`
- `core/members`
- `core/property-fines`
- `core/collection-cases`
- `core/invoices`
- `core/automated-services`

Regla:

- aqui no deben volver a aparecer enums o DTOs de compatibilidad externa
- aqui no deben aparecer textos que presenten a Aspel como motor diario

### Compatibilidad externa encapsulada

Piezas permitidas solo como frontera temporal:

- `configuration/billing-config`
- `contracts/external-compatibility/interfaces/billing-config.dto.ts`
- `contracts/external-compatibility/interfaces/billing-mode.enum.ts`
- `contracts/external-compatibility/interfaces/charge.dto.ts`
- `contracts/external-compatibility/interfaces/cobranza-payment.dto.ts`

Huellas permitidas:

- `EBillingMode.AspelCoiSync`
- `coiCobranzaAccountId`
- `coiPolicyId`

Regla:

- su presencia no autoriza llevar esa semantica al wrapper ni al core
- cualquier nueva compatibilidad externa debe entrar por esta zona

### Entry y onboarding

Piezas de explicacion y acceso:

- `entry/cobranza-nativa-wrapper`
- `onboarding/system-overview`
- `onboarding/system-flow-map`

Regla:

- el wrapper presenta primero el flujo nativo
- la configuracion queda como compatibilidad temporal
- onboarding no define el contrato tecnico del modulo

## Decision operativa por pieza sensible

### `billing-config`

Estado:

- permitido
- clasificacion `Compatibilidad externa encapsulada`

Motivo:

- concentra `billingMode`
- ya comunica que el modo nativo es el principal y que la compatibilidad externa es transicion temporal

### `billing-mode.enum.ts`

Estado:

- permitido temporalmente

Motivo:

- preserva el valor `AspelCoiSync`
- ya esta fuera de `interfaces/` y dentro de `contracts/external-compatibility`

### `notification-settings.dto.ts`

Estado:

- nativo puro

Motivo:

- no expresa semantica externa
- pertenece al portal nativo y debe permanecer en `interfaces/`

## Checklist permanente

- [x] El wrapper ya no presenta Aspel como flujo principal.
- [x] `billing-config` ya queda como configuracion y compatibilidad temporal.
- [x] Los contratos `coi*` y `EBillingMode` ya no viven en `interfaces/`.
- [x] No se detectan referencias textuales activas a live/local en el portal nativo.

## Regla para futuras pantallas

Toda pantalla nueva de `cobranza-nativa` debe caer solo en una de estas zonas:

1. `core/`
2. `configuration/`
3. `contracts/external-compatibility/`
4. `interfaces/`
5. `onboarding/`
6. `docs/`

Si necesita hablar en lenguaje `Aspel`, `Coi`, `Live`, `Local` u `Online`, no puede entrar a `core/`.
