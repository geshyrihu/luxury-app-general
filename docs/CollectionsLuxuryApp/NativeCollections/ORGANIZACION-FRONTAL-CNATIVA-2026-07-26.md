# Cobranza Nativa Frontend - Organizacion y Frontera

Fecha de actualizacion: 2026-07-26
Estado: En ejecucion y con reorganizacion base aplicada
Alcance: Solo `appsweb/angular/src/app/modules/collections.luxuryapp/cobranza-nativa`

## Checklist de avance

- [x] Separacion fisica inicial de `entry`, `configuration`, `onboarding` y `docs`
- [x] Reubicacion del `cobranza-nativa-wrapper` como puerta del modulo
- [x] Movimiento de DTOs externos base a `contracts/external-compatibility/interfaces/`
- [x] Separacion de contratos nativos del portal vs `external-compatibility`
- [x] Limpieza inicial del discurso del wrapper
- [x] Reordenamiento fisico de pantallas del `core/`
- [x] Regla final para evitar nueva mezcla en el frontend

## Estado actual

- `EBillingMode` ya se considera compatibilidad externa y sale de `interfaces/enums.ts`.
- `notification-settings.dto.ts` ya se considera contrato nativo del portal y permanece en `interfaces/`.
- Las pantallas funcionales ya fueron reagrupadas bajo `core/` sin tocar otras apps ni cambiar rutas publicas.
- La regla final ya queda fijada: los contratos nativos viven en `interfaces/` y la compatibilidad externa en `contracts/external-compatibility/`.

## Objetivo

Ordenar el frontend de `CobranzaNativa` para que el equipo distinga con rapidez:

- que pantallas son core nativo
- que piezas son configuracion o compatibilidad externa
- que elementos son solo onboarding o documentacion visual

Sin tocar:

- `aspel-cobranza-haus`
- `cobranza-online`
- cualquier otra app o modulo fuera de `cobranza-nativa`

## Clasificacion actual del frontend

### 1. Core nativo

Pantallas funcionales del modulo:

- `charges`
- `payments`
- `native-statement`
- `approvals`
- `ledger`
- `period-closures`
- `members`
- `property-fines`
- `collection-cases`
- `audit`
- `reconciliation`
- `charge-types`
- `charge-templates`
- `charge-template-coverage`
- `late-fee-policies`
- `initial-balance`
- `invoices`
- `automated-services`

Regla:

- aqui no deben aparecer textos, enums o ayudas que sugieran dependencia operativa de Aspel

### 2. Configuracion y compatibilidad externa

Piezas que hoy contienen mezcla conceptual:

- `billing-config`
- `contracts/external-compatibility/interfaces/billing-config.dto.ts`
- `contracts/external-compatibility/interfaces/billing-mode.enum.ts`
- `contracts/external-compatibility/interfaces/charge.dto.ts`
- `contracts/external-compatibility/interfaces/cobranza-payment.dto.ts`

Huellas detectadas:

- `EBillingMode.AspelCoiSync`
- `coiCobranzaAccountId`
- `coiPolicyId`
- textos como "extrae de Aspel COI"

Regla:

- estas piezas no deben presentarse como parte del core
- deben vivir en un bloque separado de compatibilidad temporal

### 3. Wrapper y onboarding

Piezas de entrada y explicacion:

- `cobranza-nativa-wrapper`
- `onboarding/system-overview`
- `onboarding/system-flow-map`
- `docs/COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`

Regla:

- el wrapper debe ser la puerta arquitectonica del modulo
- onboarding y docs visuales no deben definir la frontera tecnica

## Organizacion objetivo sugerida

```text
cobranza-nativa/
  entry/
    cobranza-nativa-wrapper/
  core/
    charges/
    payments/
    native-statement/
    approvals/
    ledger/
    period-closures/
    members/
    property-fines/
    collection-cases/
    audit/
    reconciliation/
    charge-types/
    charge-templates/
    charge-template-coverage/
    late-fee-policies/
    initial-balance/
    invoices/
    automated-services/
  configuration/
    billing-config/
  contracts/
    external-compatibility/
      interfaces/
  interfaces/
  onboarding/
    system-overview/
    system-flow-map/
  docs/
```

## Regla especifica para `cobranza-nativa-wrapper`

El wrapper debe organizar las entradas en este orden:

### Bloque A - Core nativo

Entradas principales del sistema:

- cargos
- pagos
- estado de cuenta
- ledger
- approvals
- cierres
- auditoria

### Bloque B - Configuracion del modulo

Solo ajustes propios del contexto nativo:

- reglas de cargo
- politicas de mora
- canales de notificacion

Nota:

- mientras exista `BillingMode`, este bloque debe etiquetarse como `Configuracion y compatibilidad`
- no debe venderse como parte del flujo puro

### Bloque C - Cobranza extendida

- multas
- casos
- facturacion
- conciliacion

### Bloque D - Onboarding y entendimiento

- mapa visual
- overview
- documentacion de apoyo

## Regla de contenido para el wrapper

El wrapper no debe:

- mezclar el core nativo con lenguaje de Aspel
- presentar compatibilidad externa como si fuera flujo base
- usar el modal de `billing-config` como centro conceptual del modulo

El wrapper si debe:

- mostrar la frontera del bounded context
- decir que el modulo opera de forma nativa
- marcar la compatibilidad externa como temporal y separada

## Etiquetas recomendadas para cards del wrapper

Cada tarjeta del wrapper deberia caer en una sola etiqueta:

- `Nativo`
- `Nativo con compatibilidad temporal`
- `Onboarding`

Nunca usar:

- `Live`
- `Local`
- `Online`
- `Aspel`

dentro de tarjetas del core nativo.

## Interfaces que deben moverse conceptualmente a compatibilidad

Estas interfaces hoy no son parte limpia del core:

- `contracts/external-compatibility/interfaces/billing-config.dto.ts`
- `contracts/external-compatibility/interfaces/charge.dto.ts` por `coiCobranzaAccountId`
- `contracts/external-compatibility/interfaces/cobranza-payment.dto.ts` por `coiPolicyId`
- `contracts/external-compatibility/interfaces/billing-mode.enum.ts` por `EBillingMode.AspelCoiSync`

Accion recomendada:

- dejarlas vivas por compatibilidad
- reagruparlas en una zona `contracts/external-compatibility`
- no seguir extendiendolas con mas campos de Aspel o COI

## Textos de UI que deben corregirse en la siguiente fase

Textos detectados hoy:

- "Define si LuxuryApp genera cargos, o si los extrae de Aspel COI"

Direccion correcta futura:

- describir el modo nativo como predeterminado
- dejar cualquier compatibilidad externa como transicion temporal

## Plan inicial de ordenamiento frontend

### Fase 1 - Delimitacion visual

- congelar esta clasificacion
- usar el wrapper como mapa del bounded context

### Fase 2 - Reagrupacion fisica sin cambio funcional

- separar `core`, `configuration`, `contracts` y `onboarding`
- mantener rutas y componentes funcionando

### Fase 3 - Limpieza semantica

- corregir textos de UI
- marcar compatibilidad externa como temporal
- sacar Aspel del discurso del core

## Regla operativa para cambios nuevos

Todo archivo nuevo dentro de `cobranza-nativa` debe caer en una sola de estas zonas:

- `core/` para pantallas, flujos y piezas operativas del modulo nativo
- `configuration/` para configuracion propia o compatibilidad temporal visible
- `interfaces/` para DTOs, enums e interfaces nativas del portal
- `contracts/external-compatibility/` para DTOs, enums o referencias transitorias con semantica externa
- `onboarding/` para material explicativo
- `docs/` para documentacion

Queda prohibido para tareas futuras:

- volver a crear pantallas funcionales en la raiz de `cobranza-nativa`
- meter `Aspel*`, `Coi*`, `Live`, `Local` u `Online` dentro de `core/`
- agregar enums de compatibilidad externa dentro de `interfaces/enums.ts`

## Decision vigente

Hasta nueva instruccion:

- el frontend de `CobranzaNativa` no debe consumir pantallas ni contratos de `aspel-cobranza-haus`
- el frontend de `CobranzaNativa` no debe consumir pantallas ni contratos de `cobranza-online`
- toda compatibilidad externa debe quedar separada del core y visible como tal
