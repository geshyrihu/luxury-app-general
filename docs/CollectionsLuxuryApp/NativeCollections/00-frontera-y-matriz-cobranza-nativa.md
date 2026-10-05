# Cobranza Nativa - Frontera y Matriz de Separacion

Fecha de actualizacion: 2026-07-26
Estado: Frontera vigente y usada como base de ejecucion
Alcance: Solo `CobranzaNativa`

## Check de vigencia

- [x] La frontera del bounded context quedo congelada para esta ejecucion.
- [x] Se confirma que `CobranzaNativa` no debe absorber operacion de `AspelCobranzaLocal`, `AspelCobranzaLive` ni `CobranzaOnline`.
- [x] La compatibilidad externa se mantendra dentro del modulo, pero solo encapsulada en contratos temporales.
- [x] Existe una regla permanente para impedir nueva contaminacion semantica o contractual.

## Objetivo

Definir con claridad que pertenece al core nativo de cobranza y que solo puede existir como compatibilidad temporal con contratos externos.

Este documento NO autoriza tocar ni mover logica de:

- `AspelCobranzaLocal`
- `AspelCobranzaLive`
- `CobranzaOnline`
- cualquier otro modulo fuera de `CobranzaNativa`

## Regla principal del bounded context

`CobranzaNativa` es el sistema operativo de cobranza del condominio dentro de LuxuryApp.

Su flujo diario debe poder funcionar con:

- propiedades
- miembros
- cargos
- pagos
- ledger
- estado de cuenta
- aprobaciones
- cierres
- auditoria
- notificaciones

sin depender operacionalmente de:

- Aspel COI
- Cobranza Live
- Cobranza Local
- Cobranza Online

## Tipos de dependencia permitidos

### 1. Core nativo

Dependencia propia del modulo, requerida para operar y que debe permanecer dentro de `CobranzaNativa`.

Ejemplos:

- ledger financiero
- cargos
- pagos
- aprobaciones
- cierres
- auditoria

### 2. Contrato externo encapsulado

Dato o referencia externa que hoy existe dentro del modulo, pero que no debe mezclarse con el flujo central.

Se permite solo si cumple esto:

- no dispara logica externa por si mismo
- no obliga a consumir `Live`, `Local` u `Online`
- puede moverse a una zona de compatibilidad sin romper el core

Ejemplos actuales:

- `BillingMode`
- `CoiCobranzaAccountId`
- `CoiPolicyId`

### 3. Fuera de alcance del modulo

Todo consumo operativo de rutas, servicios o dashboards que pertenecen a otros modulos.

Ejemplos:

- `aspel-cobranza/*`
- `cobranza/online/*`
- `cobranza/local/*`
- `accounting-coi/*` como fuente operativa diaria

## Matriz actual backend

### Core nativo puro

Estos archivos hoy pertenecen claramente al core del modulo y no deben salir de `CobranzaNativa`:

- `Services/PaymentAllocationService.cs`
- `Services/NativeStatementService.cs`
- `Services/FinancialApprovalService.cs`
- `Services/PeriodClosureService.cs`
- `Services/ChargeTypeCatalogSupport.cs`
- `Services/ChargesGeneratorService.cs`
- `Services/LedgerService.cs`
- `Services/LedgerIntegrityService.cs`
- `Services/CollectionManagerService.cs`
- `Services/ReconciliationService.cs`
- `Services/PropertyMemberService.cs`
- `Services/PropertyFineAppService.cs`
- `Services/RegulationArticleAppService.cs`
- `Services/FinancialAuditService.cs`

Accion:

- conservar dentro del core
- reagrupar por subdominio funcional
- no contaminarlos con namespaces, DTOs o nombres de Aspel

### Contrato externo encapsulable

Estos archivos contienen huellas de COI/Aspel, pero no obligan hoy a depender operacionalmente de otros modulos:

- `DTOs/CreateChargeDTO.cs`
- `DTOs/UpdateChargeDTO.cs`
- `DTOs/ChargeResponseDTO.cs`
- `DTOs/CreateCobranzaPaymentDTO.cs`
- `DTOs/UpdateCobranzaPaymentDTO.cs`
- `DTOs/CobranzaPaymentResponseDTO.cs`
- `Services/ChargeAppService.cs`
- `Services/CobranzaPaymentAppService.cs`
- `Services/CobranzaNativaNotificationService.cs`
- `Services/InvoiceService.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/ChargeResponseDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CobranzaPaymentResponseDTO.cs`
- `Contracts/ExternalCompatibility/Endpoint/BillingConfigEndPoints.cs`

Huellas detectadas:

- `CoiCobranzaAccountId`
- `CoiPolicyId`
- `BillingMode`
- `BillingConfig`

Accion:

- mover conceptualmente estos contratos a una zona `ExternalCompatibility`
- mantenerlos dentro de `CobranzaNativa`
- evitar que sigan creciendo
- prohibir nuevas propiedades o metodos con prefijos `Aspel`, `Coi`, `Live`, `Local`, `Online` salvo aprobacion explicita

### Documentacion contaminada o legacy

Estos archivos no afectan la ejecucion, pero hoy si contaminan la lectura arquitectonica:

- `Docs/documentacion-logica-reportes-cobranza.md`
- `Docs/reglas-negocio-cobranza-nativa.md`
- `Docs/reglas-negocio-cobranza.md`
- `Docs/documentacion-cuestionario-cobranza-nativa.md`

Problemas detectados:

- presentan a Aspel COI como parte natural del flujo
- mezclan rutas legacy con rutas vigentes
- describen contratos que hoy no coinciden completamente con el codigo

Accion:

- no usarlos como frontera arquitectonica
- reemplazarlos gradualmente por documentacion de contexto delimitado

## Estructura objetivo sugerida para backend

```text
CobranzaNativa/
  Core/
    Charges/
    Payments/
    Statements/
    Ledger/
    Approvals/
    PeriodClosures/
    Members/
    Fines/
    CollectionCases/
    Notifications/
    Audit/
    Analytics/
  Contracts/
    Native/
    ExternalCompatibility/
      BillingMode/
      CoiReferences/
  Docs/
    Architecture/
      00-frontera-y-matriz-cobranza-nativa.md
      01-plan-ejecucion-separacion-cobranza-nativa.md
```

## Regla de separacion para servicios futuros

Antes de agregar o mover un servicio en `CobranzaNativa`, clasificarlo asi:

- `NATIVO_PURO`: opera solo con entidades y reglas del modulo
- `COMPATIBILIDAD_EXTERNA`: conserva referencias externas pero no consume otros modulos
- `FUERA_DE_ALCANCE`: consume o depende de `Live`, `Local`, `Online`, `Aspel` o `COI`

Si cae en `FUERA_DE_ALCANCE`, no debe entrar al core de `CobranzaNativa`.

## Regla de no recontaminacion

Desde esta ejecucion quedan fijadas estas reglas:

- ningun servicio nuevo del core puede introducir prefijos `Aspel`, `Coi`, `Live`, `Local` u `Online`
- todo contrato transitorio con semantica externa debe entrar por `Contracts/ExternalCompatibility/`
- los DTOs y servicios nativos deben vivir bajo `Core/` o `interfaces/` del portal correspondiente segun su naturaleza
- si una necesidad futura requiere tocar `AspelCobranzaLocal`, `AspelCobranzaLive` o `CobranzaOnline`, ese trabajo se trata como iniciativa separada y no como extension del core nativo

## Servicios que SI pueden conservar referencias externas

Solo de manera temporal y encapsulada:

- cargos con referencia contable externa
- pagos con referencia de poliza externa
- configuracion de modo operativo mientras exista transicion
- facturacion si solo usa referencias, no si acopla el flujo nativo a otro modulo

## Servicios que NO deben consumir Aspel

Estos deben permanecer 100% nativos:

- calculo y aplicacion de pagos
- ledger
- estado de cuenta
- aging
- aprobaciones
- cierres de periodo
- auditoria
- multas
- casos de cobranza
- notificaciones nativas

## Plan inicial por fases

### Fase 1 - Delimitacion documental

- congelar esta frontera
- clasificar archivos actuales
- prohibir nueva mezcla semantica en nombres y docs

### Fase 2 - Reorganizacion interna sin cambio funcional

- reagrupar carpetas por `Core` y `Contracts`
- mantener endpoints y comportamiento
- no tocar otros modulos

### Fase 3 - Encapsulacion de compatibilidad externa

- sacar `BillingMode`, `CoiCobranzaAccountId` y `CoiPolicyId` del discurso del core
- dejarlos en contratos/adaptadores claramente marcados

### Fase 4 - Purificacion del lenguaje del modulo

- renombrar documentacion
- limpiar textos de UI
- dejar claro que `CobranzaNativa` no depende de Aspel como motor diario

## Decision vigente

Mientras no exista una instruccion directa distinta:

- `CobranzaNativa` no debe integrar funcionalidad operativa de `AspelCobranzaLocal`
- `CobranzaNativa` no debe integrar funcionalidad operativa de `AspelCobranzaLive`
- `CobranzaNativa` no debe usar `CobranzaOnline` como parte de su flujo diario
- cualquier contrato externo debe vivir encapsulado y etiquetado como compatibilidad temporal
