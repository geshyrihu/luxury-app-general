# Cobranza Nativa - Matriz Operativa de Consumos Permitidos y Prohibidos

Fecha de actualizacion: 2026-07-26
Estado: Auditada con evidencia local
Alcance: Solo `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa`

## Objetivo

Dejar por escrito que servicios y contratos del modulo nativo:

- si pueden conservar compatibilidad externa temporal
- no deben consumir Aspel o modulos live/local
- ya fueron auditados para confirmar que no existe acoplamiento operativo directo

## Evidencia de auditoria ejecutada

Revision textual aplicada el 2026-07-26 sobre `CobranzaNativa`:

- busqueda de `Aspel`
- busqueda de `Live`
- busqueda de `HausLive`
- busqueda de `Local`
- busqueda de `CobranzaLive`
- busqueda de `CobranzaLocal`

Resultado:

- no se encontraron referencias textuales activas dentro de `CobranzaNativa`
- no se detectaron imports, endpoints ni nombres de servicios que apunten a otros modulos de cobranza

## Regla central

`CobranzaNativa` puede conservar contratos de compatibilidad externa solo cuando:

- viven dentro de `Contracts/ExternalCompatibility/`
- no importan servicios de `AspelCobranzaLocal`
- no importan servicios de `AspelCobranzaLive`
- no importan servicios de `CobranzaOnline`
- no convierten a Aspel en motor operativo diario del modulo

Si un requerimiento nuevo necesita consumir operacion real de esos modulos, ese trabajo queda fuera de este bounded context.

## Matriz por tipo de pieza

### NATIVO_PURO

Estas piezas son parte del flujo diario y no deben depender de Aspel:

- `Core/Charges/Services/ChargesGeneratorService.cs`
- `Core/Payments/Services/PaymentAllocationService.cs`
- `Core/Statements/Services/NativeStatementService.cs`
- `Core/Statements/Services/NativeStatementPdfExportService.cs`
- `Core/Ledger/Services/LedgerService.cs`
- `Core/Ledger/Services/LedgerIntegrityService.cs`
- `Core/Approvals/Services/FinancialApprovalService.cs`
- `Core/Approvals/Services/AdjustmentService.cs`
- `Core/PeriodClosures/Services/PeriodClosureService.cs`
- `Core/Audit/Services/FinancialAuditService.cs`
- `Core/Reconciliation/Services/ReconciliationService.cs`
- `Core/CollectionCases/Services/CollectionManagerService.cs`
- `Core/Fines/Services/PropertyFineAppService.cs`
- `Core/Fines/Services/RegulationArticleAppService.cs`
- `Core/Members/Services/PropertyMemberService.cs`
- `Core/Metrics/Services/CobranzaMetricasService.cs`
- `Core/Notifications/Services/NativeCollectionRealTimeService.cs`
- `Core/Notifications/Services/NotificationEngineService.cs`
- `Core/Notifications/Services/NativeCollectionNotificationSettingsService.cs`

Consumo permitido:

- entidades del propio modulo
- ledger, notificaciones, PDF, auditoria y reglas internas

Consumo prohibido:

- servicios live/local
- jobs o APIs de otros modulos de cobranza
- semantica `Aspel*`, `Coi*`, `Live`, `Local`, `Online` en nuevas clases del core

### COMPATIBILIDAD_EXTERNA_ENCAPSULADA

Estas piezas si pueden existir, pero solo como compatibilidad temporal:

- `Contracts/ExternalCompatibility/Endpoint/BillingConfigEndPoints.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/ChargeResponseDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CobranzaPaymentResponseDTO.cs`
- cualquier DTO futuro que exponga `BillingMode`
- cualquier DTO futuro que exponga `CoiCobranzaAccountId`
- cualquier DTO futuro que exponga `CoiPolicyId`

Huellas actualmente permitidas:

- `BillingMode`
- `CoiCobranzaAccountId`
- `CoiPolicyId`

Motivo de permanencia:

- preservan compatibilidad contractual del modulo
- no implican por si mismos consumo operativo de Aspel
- funcionan como frontera temporal y no como centro del core

### FUERA_DE_ALCANCE

Estas dependencias no deben entrar al modulo:

- cualquier servicio de `AspelCobranzaLocal`
- cualquier servicio de `AspelCobranzaLive`
- cualquier servicio de `CobranzaOnline`
- cualquier endpoint que viva fuera de `CobranzaNativa` y represente operacion diaria de esos modulos

Si una historia requiere esto, abrir iniciativa separada.

## Decision por servicio sensible

### BillingConfig

Estado:

- permitido
- clasificacion `COMPATIBILIDAD_EXTERNA_ENCAPSULADA`

Motivo:

- administra `BillingMode`
- hoy concentra la transicion entre modo nativo y compatibilidad externa
- no consume operacion live/local desde este modulo

### Charge DTOs con `CoiCobranzaAccountId`

Estado:

- permitido temporalmente
- clasificacion `COMPATIBILIDAD_EXTERNA_ENCAPSULADA`

Motivo:

- preservan referencia externa
- no obligan a que `ChargesGeneratorService` dependa de Aspel

### Payment DTOs con `CoiPolicyId`

Estado:

- permitido temporalmente
- clasificacion `COMPATIBILIDAD_EXTERNA_ENCAPSULADA`

Motivo:

- preservan referencia de poliza externa
- no convierten el flujo de pagos nativos en flujo de Aspel

### Statements, Ledger, PeriodClosures, Audit, Reconciliation

Estado:

- 100% nativos
- clasificacion `NATIVO_PURO`

Motivo:

- resuelven operacion diaria interna
- no requieren compatibilidad externa para operar

## Checklist permanente

- [x] No se detectan referencias textuales activas a `AspelCobranzaLocal`.
- [x] No se detectan referencias textuales activas a `AspelCobranzaLive`.
- [x] No se detectan referencias textuales activas a `CobranzaOnline`.
- [x] La compatibilidad visible del modulo se concentra en `Contracts/ExternalCompatibility/`.
- [x] El core del modulo sigue leyendo como bounded context nativo.

## Regla para futuras tareas

Antes de agregar un servicio o DTO nuevo en `CobranzaNativa`, decidir explicitamente:

1. `NATIVO_PURO`
2. `COMPATIBILIDAD_EXTERNA_ENCAPSULADA`
3. `FUERA_DE_ALCANCE`

Si cae en `FUERA_DE_ALCANCE`, no debe vivir en este modulo.
