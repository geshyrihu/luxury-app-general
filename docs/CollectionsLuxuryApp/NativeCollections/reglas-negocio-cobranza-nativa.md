# Cobranza Nativa - Reglas De Negocio Vigentes

**Fecha de actualizacion:** 2026-07-31
**Estado:** Vigente
**Alcance:** `CobranzaNativa`

## Objetivo

Definir la narrativa tecnica vigente del modulo `CobranzaNativa` despues de la
remediacion estructural, contractual y funcional ejecutada durante julio de
2026.

Este documento sustituye cualquier lectura operativa que mezcle el flujo nativo
con `AspelCobranzaLocal`, `AspelCobranzaLive` o `CobranzaOnline`.

## Fuentes primarias complementarias

Este documento debe leerse junto con:

- `Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
- `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
- `docs/plans/20260731-cobranza-nativa-fase-5-baseline.md`
- `docs/plans/20260731-cobranza-nativa-fase-5-mobile-strategy.md`

## Definicion del modulo

`CobranzaNativa` es el subsistema financiero auditable del condominio dentro de
LuxuryApp.

Su operacion diaria cubre:

- propiedades
- miembros de propiedad
- cargos
- pagos
- ledger
- estado de cuenta
- recargos
- aprobaciones financieras
- cierres de periodo
- auditoria financiera
- conciliacion operativa
- multas
- casos de cobranza
- notificaciones nativas

## Regla de frontera

`CobranzaNativa` no debe absorber operacion diaria de:

- `AspelCobranzaLocal`
- `AspelCobranzaLive`
- `CobranzaOnline`

La compatibilidad externa solo puede existir:

- dentro del propio modulo
- encapsulada en `Contracts/ExternalCompatibility/`
- sin contaminar el core operativo ni la semantica principal del frontend

## Subdominios vigentes del backend

La organizacion vigente del backend se reconoce por subdominio:

- `Approvals`
- `Audit`
- `Charges`
- `ChargeTypes`
- `CollectionCases`
- `Fines`
- `Invoices`
- `LateFees`
- `Ledger`
- `Members`
- `Metrics`
- `Notifications`
- `Payments`
- `PeriodClosures`
- `Reconciliation`
- `Statements`
- `Templates`

## Subdominios vigentes del frontend

La organizacion vigente del frontend se reconoce por zonas:

- `entry/`
- `core/`
- `configuration/`
- `contracts/`
- `interfaces/`
- `onboarding/`
- `docs/`

Regla:

- `core/` contiene operacion nativa
- `configuration/` solo contiene configuracion o compatibilidad permitida
- `contracts/external-compatibility/` concentra semantica externa temporal
- `interfaces/` es zona nativa del portal

## Invariantes financieras obligatorias

### 1. No cruces de tenant o propiedad

Nunca se permite mezclar `CustomerId` o `PropertyId` entre:

- cargos
- pagos
- asignaciones
- miembros
- expedientes
- auditoria
- ledger

### 2. El ledger es la fuente auditable

Toda operacion financiera relevante debe dejar trazabilidad coherente en el
ledger o en su bitacora asociada. No se permite resolver el flujo con mutacion
silenciosa de saldos.

### 3. Los cierres de periodo son vinculantes

No se debe bypass de cierres de periodo para:

- registrar eventos retroactivos
- reescribir operacion cerrada
- simular reaperturas por fuera del flujo del modulo

### 4. Las aprobaciones financieras son obligatorias donde aplique

Las operaciones sensibles como ajustes, condonaciones, reaperturas o
anulaciones aprobables deben respetar flujo maker-checker.

### 5. La idempotencia no es opcional

Comandos sensibles deben conservar proteccion contra repeticion, en especial:

- generacion de cargos
- aplicacion de pagos
- cancelacion de pagos
- recalculo de recargos

## Contratos y rutas publicas sensibles

La remediacion interna del modulo no autoriza por si sola renombrar contratos
publicados o rutas sensibles sin inventario de consumidores.

Mientras no exista migracion aprobada:

- la estructura publica vigente se trata como contrato sensible
- los responses sensibles no deben cambiar por conveniencia
- la reorganizacion interna no justifica romper consumo externo

## Compatibilidad externa permitida

Hoy se consideran huellas temporales permitidas, siempre encapsuladas:

- `BillingMode`
- `coiCobranzaAccountId`
- `coiPolicyId`

Reglas:

- no introducir nuevas referencias `Aspel`, `Coi`, `Live`, `Local` u `Online`
  en el core sin aprobacion explicita
- no expandir contratos externos dentro de `core/`
- si una necesidad futura depende de otro modulo, se trata como iniciativa
  separada

## Reglas de frontend vigentes

### 1. Desktop y mobile son obligatorios

La UI operativa del modulo debe funcionar en desktop y mobile para los
subdominios criticos.

### 2. El catalogo `@ui/*` es la base

No deben introducirse componentes paralelos si el catalogo actual ya resuelve
el patron.

### 3. El patron mobile vigente es explicito

La variante mobile ya validada en la fase actual se basa en:

- `app-data-view-mobile`
- `ili-list-item`
- `ili-action-menu`
- botones del catalogo `il*` e `iw*`

### 4. El wrapper no manda sobre el contrato tecnico

El `wrapper` y el onboarding explican el sistema, pero no definen por si solos
la frontera tecnica del modulo.

## Capacidades funcionales vigentes

### Operacion diaria

- crear y editar cargos
- registrar y cancelar pagos
- administrar miembros de propiedad
- consultar estado de cuenta
- consultar ledger
- consultar auditoria financiera

### Gobierno financiero

- revisar aprobaciones
- cerrar y reabrir periodos
- controlar recargos y politicas

### Trazabilidad y soporte

- conciliacion operativa
- multas
- expedientes de cobranza
- notificaciones nativas

## Documentos historicos o subordinados

No deben usarse como contrato tecnico primario:

- `documentacion-logica-reportes-cobranza.md`
- `documentacion-cuestionario-cobranza-nativa.md`
- diagnosticos o cuestionarios previos sin clasificacion de vigencia

## Regla de lectura para futuras remediaciones

Antes de tocar `CobranzaNativa`, el orden minimo debe ser:

1. `CONVENTIONS.md`
2. `conventions/modules/cobranza-nativa-module-conventions.md`
3. `Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
4. este documento
5. plan y evidencia tecnica vigente

## Estado actual resumido

- el modulo quedo separado del flujo operativo de otros modulos de cobranza
- el frontend critico ya cuenta con cobertura automatizada y validacion
  mobile/desktop en sus subdominios prioritarios
- la deuda principal restante ya no es de frontera, sino de consolidacion
  documental y endurecimiento secundario
