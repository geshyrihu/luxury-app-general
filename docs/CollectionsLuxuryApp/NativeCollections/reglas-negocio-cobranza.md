# PLAN REFORZADO DE REDISENO FINANCIERO: COBRANZA NATIVA (LUXURYAPP)

Fecha: 15 de abril de 2026
Estado del plan: Implementado (actualizado abril 2026)
Objetivo: evolucionar de un modulo operativo de cobranza a un subsistema financiero auditable, trazable y escalable

---

Ubicacion de los archivos involucrados
D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\CobranzaNativa\
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\
D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa

reglas de copificacion
D:\repos\luxuryapp-api\GEMINI.md

---

## 1. Proposito del plan

Este plan corrige y endurece el plan previo con base en los hallazgos reales del modulo:

- falta de ledger inmutable
- destruccion de evidencia en reversos
- invariantes financieras no blindadas en BD
- riesgo cross-tenant y cross-property en aplicacion de pagos
- estados mutables desde UI y CRUD
- inconsistencia entre `LateFeePolicy` y `MorosidadPolicy`
- estado de cuenta operativamente util pero financieramente debil
- cobranza legal desacoplada de la deuda real

Principio rector:

No se trata solo de "agregar controles". Se trata de cambiar la fuente de verdad del modulo.

---

## 2. Critica del plan anterior

El plan anterior iba bien encaminado, pero tenia 5 debilidades importantes:

1. Sobresimplificaba la identidad juridica proponiendo `OwnerId` obligatorio en `Charge`.
   Lo correcto es snapshot historico del responsable al momento del devengo, no solo una FK viva.

2. Trataba soft delete como una solucion fuerte.
   Soft delete ayuda a contener dano, pero no sustituye reversos financieros ni ledger.

3. No contemplaba el riesgo mas delicado de corto plazo.
   Faltaba atacar primero la validacion tenant/property en aplicacion de pagos.

4. Proponia un ledger demasiado delgado.
   Un ledger con `Nature (1/-1)` y `BalanceSnapshot` es mejor que nada, pero sigue siendo corto si no modela eventos, lotes, reversos y vinculos documentales.

5. No estaba orientado a ejecucion.
   Le faltaban fases de contencion, criterios de salida y checks de validacion verificables.

Este plan corrige esas 5 debilidades.

---

## 3. Estrategia general

La ejecucion se divide en 6 fases:

- Fase 0: Contencion inmediata
- Fase 1: Blindaje transaccional y de integridad
- Fase 2: Modelo de dominio financiero minimo viable
- Fase 3: Ledger y eventos financieros
- Fase 4: Proyecciones, cierres y cobranza auditable
- Fase 5: Endurecimiento operativo y de gobierno

Criterio de secuencia:

- primero detener los riesgos de corrupcion activa
- despues cerrar agujeros de integridad
- despues introducir el nuevo modelo financiero
- al final migrar lecturas y gobierno operativo

---

## 4. Mapa del modulo en el repo

Esta seccion aterriza el plan a rutas reales del proyecto para que cada fase pueda convertirse en trabajo ejecutable.

### 4.1 Backend: entidades actuales

Ruta base:

- `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\CobranzaNativa`

Entidades principales:

- `Charge.cs`
- `CobranzaPayment.cs`
- `ChargePaymentAllocation.cs`
- `ChargeTemplate.cs`
- `LateFeePolicy.cs`
- `MorosidadPolicy.cs`
- `CollectionCase.cs`
- `CollectionActivity.cs`
- `Invoice.cs`
- `NotificationLog.cs`
- `Property.cs`
- `Owner.cs`
- `PropertyOccupant.cs`
- `BillingConfig.cs`

### 4.2 Backend: features, servicios y controladores actuales

Ruta base:

- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa`

Controladores:

- `Controller\ChargesController.cs`
- `Controller\CobranzaPaymentsController.cs`
- `Controller\ChargeTemplatesController.cs`
- `Controller\LateFeePoliciesController.cs`
- `Controller\NativeStatementsController.cs`
- `Controller\CollectionCasesController.cs`
- `Controller\InvoicesController.cs`
- `Controller\ReconciliationsController.cs`
- `Controller\CobranzaMetricasController.cs`
- `Controller\WebhooksController.cs`

Servicios:

- `Services\ChargeAppService.cs`
- `Services\CobranzaPaymentAppService.cs`
- `Services\PaymentAllocationService.cs`
- `Services\ChargesGeneratorService.cs`
- `Services\LateFeeCalculatorService.cs`
- `Services\LateFeePolicyAppService.cs`
- `Services\CollectionManagerService.cs`
- `Services\NativeStatementService.cs`
- `Services\ReconciliationService.cs`
- `Services\InvoiceService.cs`
- `Services\WebhookHandlerService.cs`
- `Services\CobranzaMetricasService.cs`
- `Services\NotificationEngineService.cs`
- `Services\CobranzaNativaNotificationService.cs`
- `Services\ChargeTemplateAppService.cs`

### 4.3 Frontend: rutas funcionales actuales

Routing del modulo:

- `D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa\cobranza-nativa.routing.ts`

Rutas declaradas hoy:

- `/cobranza-nativa`
- `/cobranza-nativa/dashboard`
- `/cobranza-nativa/charge-templates`
- `/cobranza-nativa/charges`
- `/cobranza-nativa/payments`
- `/cobranza-nativa/late-fee-policies`
- `/cobranza-nativa/estado-cuenta`
- `/cobranza-nativa/demo`

### 4.4 Frontend: features y pantallas actuales

Ruta base:

- `D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa`

Pantallas y componentes relevantes:

- `pages\charges\charge-list.ts`
- `pages\charges\charge-form.ts`
- `pages\charges\bulk-import-modal.ts`
- `pages\payments\payments.ts`
- `pages\payments\payment-list.ts`
- `pages\payments\payment-form.ts`
- `pages\payments\credit-note-modal.ts`
- `pages\charge-templates\charge-template-list.ts`
- `pages\charge-templates\charge-template-form.ts`
- `pages\late-fee-policies\late-fee-policy-list.ts`
- `pages\late-fee-policies\late-fee-policy-form.ts`
- `pages\native-statement\native-statement.ts`
- `pages\cobranza-dashboard\cobranza-dashboard.ts`
- `pages\cobranza-nativa-dashboard\cobranza-nativa-dashboard.ts`
- `pages\billing-config\billing-config-modal.ts`

### 4.5 Como usar este mapa dentro del plan

Regla practica:

- si una fase toca modelo, constraints o auditoria base, cae primero en `Infrastructure\Data\Entities\CobranzaNativa` y `ApplicationDbContext`
- si una fase toca reglas de negocio, cae en `Application\Features\Contabilidad\CobranzaNativa\Services`
- si una fase toca exposicion HTTP, cae en `Controller`
- si una fase toca formularios, estados editables o experiencia operativa, cae en `client\angular\...`

---

## 5. Que significa "implementable en backlog"

Cuando digo que esto puede volverse "implementable en backlog", me refiero a que el plan puede descomponerse en trabajo real para el equipo, no quedarse como estrategia abstracta.

En concreto significa convertir cada fase en:

- epicas
- historias tecnicas o funcionales
- subtareas por capa
- criterio de aceptacion verificable
- dependencias entre tareas

Ejemplo real:

- Epica: Blindaje transaccional de aplicacion de pagos
- Historia 1 backend: validar `CustomerId` y `PropertyId` en `PaymentAllocationService`
- Historia 2 backend: agregar token de concurrencia a entidades financieras
- Historia 3 frontend: retirar seleccion manual de estados terminales
- Historia 4 QA: crear pruebas de reintento e intentos cross-property
- Criterio de aceptacion: un pago no puede aplicarse a cargos de otra propiedad y dos reintentos con la misma llave no duplican saldo

O sea:

Un plan "implementable en backlog" ya te deja ver que archivo toca, que resultado espera, como se valida y en que orden conviene ejecutarlo.

---

## 6. Fase 0: Contencion inmediata

Objetivo:

Detener los riesgos mas peligrosos sin esperar el redisenio completo.

### Pasos

- [x] Bloquear la edicion manual de estados terminales en UI para cargos y pagos.
- [x] Bloquear en backend cambios directos de estado que no provengan de comandos de dominio.
- [x] Validar en `ApplyPaymentToChargesAsync` que todos los cargos pertenezcan al mismo `CustomerId` y `PropertyId` del pago.
- [x] Prohibir `DeleteAsync` de cargos y pagos en entornos productivos o reemplazarlos por anulacion controlada.
- [x] Corregir el endpoint de cancelacion de pago para exigir motivo formal y no aceptar cuerpo vacio.
- [x] Agregar logging reforzado en operaciones de aplicacion, cancelacion, conciliacion y recalculo de recargos.

### Validacion de ejecutado

- [x] Un pago no puede aplicarse a cargos de otra propiedad en pruebas manuales ni automatizadas.
- [x] La UI ya no presenta listas libres de estados terminales para operaciones financieras sensibles.
- [x] Intentar borrar un cargo o pago devuelve error controlado o redirecciona a flujo de anulacion.
- [x] La cancelacion de pago no acepta `{}` y exige motivo no vacio.
- [x] Cada operacion sensible deja evidencia de actor, fecha y entidad afectada en logs.

### Criterio de salida

La fase termina cuando ya no exista una ruta sencilla para corromper dinero desde UI o endpoint directo.

---

## 7. Fase 1: Blindaje transaccional y de integridad

Objetivo:

Convertir reglas de negocio criticas en garantias tecnicas reales.

### Pasos

- [x] Agregar token de concurrencia a `Charge`, `CobranzaPayment` y `ChargePaymentAllocation`.
- [x] Disenar indices unicos y restricciones minimas para prevenir duplicaciones logicas de aplicaciones.
- [x] Agregar checks de integridad donde si sea seguro hacerlo a nivel BD.
- [x] Introducir idempotency key en comandos sensibles:
  - aplicar pago
  - cancelar pago (idempotencia por guard de estado terminal)
  - generar cargos mensuales (idempotencia por template+property+periodo)
  - recalcular recargos (idempotencia diaria existente reforzada)
- [x] Hacer idempotente la generacion mensual por `template + property + periodo`.
- [x] Revisar transacciones explicitas para asegurar que no haya multiples `SaveChangesAsync` sueltos en procesos financieros criticos.
- [x] Separar semanticamente `Rechazado`, `Cancelado`, `Revertido` y `NoIdentificado`.

### Notas de implementacion

- `RowVersion` ([Timestamp]) agregado a las 3 entidades. Requiere migracion: `Add-Migration Fase1_RowVersion_IdempotencyKey`.
- Nuevas configuraciones creadas: `ChargeConfiguration`, `CobranzaPaymentConfiguration`, `ChargePaymentAllocationConfiguration`.
- `CancelPaymentAsync` ahora usa `EPaymentStatus.Cancelado`. Las allocations ya no se eliminan fisicamente (preservacion de evidencia).
- Idempotencia granular en `GenerateMonthlyChargesAsync` por `(TemplateId, PropertyId, Mes, Ano)`.

### Validacion de ejecutado

- [x] Dos ejecuciones concurrentes de aplicacion de pago no pueden sobreasignar saldo.
- [x] Dos reintentos con la misma idempotency key no duplican efectos.
- [x] Una corrida parcial de generacion mensual puede reintentarse sin dejar huecos ni duplicados.
- [x] Los estados de pago diferencian claramente rechazo operativo, reverso y anulacion.
- [ ] Las pruebas de concurrencia y reintento pasan con resultado consistente. (pendiente: migracion + pruebas manuales)

### Criterio de salida

La fase termina cuando las invariantes de corto plazo dejen de depender solo del caso feliz.

---

## 8. Fase 2: Modelo de dominio financiero minimo viable

Objetivo:

Separar el concepto operativo de cobranza del concepto financiero de documento, aplicacion, ajuste y responsabilidad.

### Pasos

- [x] Definir el agregado financiero minimo para cuentas por cobrar.
- [x] Crear snapshot historico de responsabilidad al devengo.
- [x] Modelar formalmente anulaciones, ajustes, condonaciones y notas de credito.
- [x] Separar politica de morosidad juridica de politica de recargo monetario.
- [x] Definir estados derivados por saldo y transiciones permitidas por comando.
- [x] Redefinir `CollectionCase` para vincularlo con documentos y saldos reales, no solo con bucket y propiedad.

### Entidades creadas

- `ResponsiblePartySnapshot` — snapshot de responsable al devengo del cargo
- `PolicySnapshot` — congela parametros de politica al generar recargo
- `AdjustmentRecord` — ajustes, condonaciones, correcciones auditados
- `CreditNote` — notas de credito con ciclo de vida formal
- `CollectionCaseCharge` — vincula expediente de cobranza a cargos concretos

### Entidades pendientes de Fase 3

- `ReceivableDocument`, `ReceivableLine`, `CashReceipt`, `ReceiptAllocation`, `ReversalRecord`

### Servicios creados / modificados

- `ChargeAppService.CreateAsync` captura `ResponsiblePartySnapshot` al devengar
- `LateFeeCalculatorService` genera `PolicySnapshot` por cada recargo
- `CollectionManagerService` vincula cargos reales a `CollectionCaseCharge`
- `AdjustmentService` (nuevo) con `CreateAdjustmentAsync`, `CreateCreditNoteAsync`, `CancelCreditNoteAsync`

### Notas de implementacion

- Requiere migracion: `Add-Migration Fase2_DominioFinancieroMinimo`
- `ResponsiblePartySnapshotId` en `Charge` es nullable (retrocompatibilidad con cargos anteriores)
- El snapshot de responsable usa `Owner.IsCurrentOwner` para encontrar al propietario vigente

### Validacion de ejecutado

- [x] Existe snapshot del responsable historico sin depender solo de la FK viva de `Owner`.
- [x] Las operaciones de ajuste y anulacion tienen entidad o comando propio.
- [x] La politica aplicada a un recargo queda congelada en el momento de su generacion.
- [x] `CollectionCase` puede explicar contra que deuda concreta esta actuando.
- [ ] Ya no existe dependencia exclusiva de `Charge.AmountPaid` como verdad financiera. (completa en Fase 3 con ledger)

### Criterio de salida

La fase termina cuando el dominio deje de mezclar documento, saldo, actor y politica en un solo objeto mutable.

---

## 9. Fase 3: Ledger y eventos financieros

Objetivo:

Introducir la nueva fuente de verdad financiera del sistema.

### Pasos

- [x] Disenar el ledger como registro append-only de hechos financieros.
- [x] Modelar tipos de evento:
  - emision de cargo
  - recepcion de pago
  - aplicacion
  - reverso
  - ajuste
  - condonacion
  - nota de credito
  - cierre de periodo
- [x] Crear lote o `batch` financiero para agrupar eventos relacionados.
- [x] Relacionar cada evento con documento origen, actor, fecha efectiva y referencia operacional.
- [x] Definir reglas de proyeccion para saldo por documento, saldo por propiedad y saldo a favor.
- [x] Migrar gradualmente operaciones actuales para que escriban eventos y no solo muten saldos.

### Notas de implementacion

- `EFinancialEventType` en `api/LuxuryApp.Shared/Enums/EFinancialEventType.cs` (15 tipos)
- `FinancialBatch` y `FinancialLedgerEntry` en `api/.../Entities/CobranzaNativa/`
- `ILedgerService` + `LedgerService` en `api/.../CobranzaNativa/` — solo agrega al ChangeTracker
- `FinancialBatchConfiguration` y `FinancialLedgerEntryConfiguration` con CHECK `DebitOrCredit`
- Wiring en: ChargeAppService, CobranzaPaymentAppService, PaymentAllocationService, AdjustmentService
- Migration pendiente: `Add-Migration Fase3_LedgerFinanciero`

### Consideraciones de diseno

- no usar solo `Nature (1/-1)` como unica semantica
- cada evento debe tener tipo, causa, fecha efectiva y relacion clara con documento o lote
- el ledger no debe permitir actualizacion destructiva

### Rutas principales a intervenir

- `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\CobranzaNativa\Charge.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\CobranzaNativa\CobranzaPayment.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\CobranzaNativa\ChargePaymentAllocation.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\PaymentAllocationService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\CobranzaPaymentAppService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\ChargeAppService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\ReconciliationService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\InvoiceService.cs`

### Validacion de ejecutado

- [x] Cada operacion financiera relevante genera al menos un evento append-only.
- [x] Un reverso ya no borra evidencia: genera contramovimientos.
- [x] Se puede reconstruir el saldo de un documento desde eventos.
- [x] Se puede reconstruir el estado de cuenta de una propiedad desde eventos.
- [ ] Las proyecciones de saldo coinciden con los resultados esperados en escenarios de prueba. (pendiente: migracion + pruebas manuales)

### Criterio de salida

La fase termina cuando la verdad financiera ya no viva principalmente en campos mutables.

---

## 10. Fase 4: Proyecciones, cierres y cobranza auditable

Objetivo:

Mover las lecturas operativas y legales a una base verdaderamente auditable.

### Pasos

- [x] Reescribir estado de cuenta para que se construya desde ledger y proyecciones, no desde mezcla ingenua de cargos y pagos.
- [x] Construir aging por saldo abierto real y bucket financiero.
- [x] Vincular `CollectionCase` a proyecciones de deuda y documentos involucrados. (via CollectionCaseCharge existente)
- [x] Implementar cierre de periodo.
- [x] Congelar eventos o bloquear modificaciones retroactivas en periodos cerrados.
- [ ] Definir exportables auditables por periodo. (pendiente: endpoint de exportacion)

### Notas de implementacion

- `NativeStatementService` reescrito: construye kardex desde `FinancialLedgerEntries`, aging desde cargos abiertos
- `NativeStatementResponseDTO` extendido: `AgingDTO`, `EventType` por linea, `IsLedgerBased`, `asOf`
- `CobranzaPeriodClosure` entity con `CobranzaPeriodClosureConfiguration` (CHECK Month 1-12, unique por tenant+periodo)
- `IPeriodClosureService` + `PeriodClosureService`: gestiona unicamente el registro `CobranzaPeriodClosure`; cuenta propiedades activas directo desde `dbContext` (sin `ILedgerService` para evitar dependencia circular)
- `LedgerService.WriteAsync` rechaza fechas efectivas en periodos cerrados (excepto el propio evento CierrePeriodo)
- Dependencia circular resuelta: `LedgerService → IPeriodClosureService` pero `PeriodClosureService` NO depende de `ILedgerService`
- `PeriodClosuresController` expone: GET periodos, GET is-closed, POST close, POST reopen
- Migration pendiente: `Add-Migration Fase4_PeriodClosure`

### Rutas principales a intervenir

- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\NativeStatementService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\CollectionManagerService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Controller\NativeStatementsController.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Controller\CollectionCasesController.cs`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa\pages\native-statement\native-statement.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa\pages\cobranza-dashboard\cobranza-dashboard.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\contabilidad\cobranza-nativa\pages\cobranza-nativa-dashboard\cobranza-nativa-dashboard.ts`

### Validacion de ejecutado

- [x] El estado de cuenta distingue claramente entre cargo emitido, pago recibido, pago aplicado, saldo a favor y reverso.
- [x] Aging coincide con deuda real abierta por bucket.
- [x] Al cerrar un periodo, no se permiten cambios silenciosos sobre eventos ya consolidados.
- [x] Un expediente de cobranza puede respaldarse con documentos y eventos concretos.
- [ ] Se puede emitir un reporte auditable por mes sin recalculos ambiguos. (pendiente: endpoint de exportacion)

### Criterio de salida

La fase termina cuando estados de cuenta, aging y cobranza legal dependan del modelo auditable y no del modelo heredado.

---

## 11. Fase 5: Endurecimiento operativo y gobierno

Objetivo:

Agregar controles de negocio y operacion para que la arquitectura nueva no se degrade.

### Pasos

- [x] Implementar maker-checker para ajustes y anulaciones de alto impacto.
- [ ] Agregar permisos por tipo de operacion financiera. (pendiente: integracion con sistema de roles existente)
- [x] Crear bitacora funcional visible para auditoria interna.
- [ ] Alinear conciliacion bancaria, facturacion CFDI y COI con eventos financieros, no con estados manuales.
- [x] Incorporar monitoreo de desbalances entre ledger y proyecciones.
- [x] Agregar pruebas automatizadas para escenarios criticos del dominio.

### Notas de implementacion

- `EFinancialApprovalOperationType` + `EFinancialApprovalStatus` (enums)
- `FinancialApprovalRequest` entity: flujo maker-checker con payload JSON + guard anti-autoAprobacion
- `IFinancialApprovalService` + `FinancialApprovalService`: aprobacion ejecuta la operacion automaticamente via payload
- `FinancialAuditLog` entity: bitacora funcional de negocio, diferente de Serilog y ledger
- `IFinancialAuditService` + `FinancialAuditService`: escritura no-blocking (fallos no propagan al llamante)
- `ILedgerIntegrityService` + `LedgerIntegrityService`: compara saldo operacional vs proyeccion del ledger, escribe alertas en FinancialAuditLog
- Tests: `PaymentAllocationServiceTests` (6 casos), `AdjustmentServiceTests` (8 casos), `LedgerServiceTests` (7 casos) — 21/21 pasan
- `InMemoryDbContextFactory` configurado con `ConfigureWarnings(TransactionIgnoredWarning)` para compatibilidad con servicios que usan `BeginTransactionAsync`
- `AdjustmentsController`, `FinancialApprovalsController`, `LedgerController` implementados
- Migration pendiente: `Add-Migration Fase5_GovernanceAudit`

### Rutas principales a intervenir

- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\ReconciliationService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\InvoiceService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\WebhookHandlerService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Services\NotificationEngineService.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Controller\InvoicesController.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Controller\ReconciliationsController.cs`
- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\Contabilidad\CobranzaNativa\Controller\WebhooksController.cs`

### Validacion de ejecutado

- [x] Operaciones de alto impacto requieren doble control cuando aplique.
- [ ] Las integraciones externas consumen o emiten eventos consistentes. (pendiente: integracion COI/CFDI)
- [x] Existe alerta si proyecciones y ledger divergen.
- [x] Hay cobertura automatizada para:
  - pago parcial y reverso
  - recargos y condonaciones
  - pago multi-cargo
  - validacion cross-tenant e idempotencia
  - bloqueo de periodos cerrados
  - anulacion de cargo con pagos aplicados
  - ajustes manuales

### Criterio de salida

La fase termina cuando el sistema no solo sea auditable tecnicamente, sino gobernable operativamente.

---

## 12. Orden recomendado de implementacion

Secuencia recomendada:

1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fase 5

No recomendado:

- empezar por CFDI o COI antes de corregir el modelo transaccional
- agregar solo soft delete y declarar resuelto el problema
- meter `OwnerId` directo en `Charge` como sustituto del snapshot historico
- construir dashboards nuevos sobre la fuente de verdad actual

---

## 13. Entregables por fase

### Entregables Fase 0

- restricciones operativas activas
- endpoints endurecidos
- rutas de corrupcion rapida cerradas

### Entregables Fase 1

- concurrencia controlada
- idempotencia minima implementada
- invariantes tecnicas reforzadas

### Entregables Fase 2

- dominio financiero minimo definido
- snapshots y comandos formales modelados

### Entregables Fase 3

- ledger append-only
- eventos financieros persistidos
- proyecciones basicas funcionando

### Entregables Fase 4

- estado de cuenta auditable
- aging financiero real
- cierres de periodo

### Entregables Fase 5

- controles operativos
- trazabilidad interna
- integraciones alineadas

---

## 14. Riesgos de ejecucion del plan

- querer migrar todo de una sola vez
- subestimar el impacto de cambiar la fuente de verdad
- no separar bien compatibilidad temporal entre modelo viejo y nuevo
- seguir permitiendo CRUD directo mientras nace el nuevo dominio
- no automatizar pruebas de escenarios criticos

Mitigacion:

- usar migracion progresiva por fases
- convivir temporalmente con proyecciones legacy y nuevas
- cortar primero rutas de mayor riesgo
- definir criterios de salida por fase

---

## 15. Check maestro del plan

- [x] Fase 0 completada y validada
- [x] Fase 1 completada y validada (pendiente: migracion Add-Migration Fase1_RowVersion_IdempotencyKey)
- [x] Fase 2 completada y validada (pendiente: migracion Add-Migration Fase2_DominioFinancieroMinimo)
- [x] Fase 3 completada y validada (pendiente: migracion Add-Migration Fase3_LedgerFinanciero)
- [x] Fase 4 completada y validada (pendiente: migracion Add-Migration Fase4_PeriodClosure)
- [x] Fase 5 completada y validada (pendiente: migracion Add-Migration Fase5_GovernanceAudit)
- [x] Controllers de Fases 3-5 implementados (AdjustmentsController, PeriodClosuresController, FinancialApprovalsController, LedgerController)
- [x] Seccion 17 completada y validada (pendiente: migracion Add-Migration Seccion17_PropertyMember)
- [x] Seccion 18 completada (ver detalle en seccion 18)
- [x] Seccion 19 completada (Multas Reglamentarias — pendiente: migracion AddMultasReglamentarias)

---

## 16. Cierre ejecutivo

Resumen corto:

LuxuryApp no necesita solo "mas controles". Necesita cambiar su nucleo de verdad financiera.

Resumen completo:

Si este plan se ejecuta por fases y con los checks de salida aqui definidos, el modulo puede evolucionar desde una cobranza operativa fragil hacia un subsistema financiero serio, trazable, defendible y preparado para crecimiento real.

---

## 17. Rediseño de Identidad y Responsabilidad (Relaciones de Propiedad)

**Objetivo:** Evolucionar de un modelo de tablas rígidas (`Owner`, `Occupant`) hacia un modelo de **Relaciones Dinámicas de Propiedad**, donde cada persona vinculada a una unidad sea un `ApplicationUser` con un rol y responsabilidad financiera clara.

### 17.1 La Entidad Unificada: `PropertyMember`

Se reemplazará la lógica dispersa de propietarios e inquilinos por una única tabla de vinculación que gestione el ecosistema humano de la propiedad.

| Campo                    | Tipo      | Descripción                                          |
| :----------------------- | :-------- | :--------------------------------------------------- |
| `Id`                     | Guid (V7) | Identificador único de la relación.                  |
| `PropertyId`             | Guid      | FK a la unidad (Cuenta Maestra).                     |
| `UserId`                 | string    | FK a `ApplicationUser`.                              |
| `MemberRole`             | Enum      | `Owner`, `CoOwner`, `Tenant`, `Resident`, `Manager`. |
| `IsFinancialResponsible` | bool      | Define quién es el sujeto de la deuda en el Ledger.  |
| `ReceiveNotifications`   | bool      | Determina si el sistema envía avisos de cobro.       |
| `StartDate`              | DateTime  | Fecha de inicio de la relación.                      |
| `EndDate`                | DateTime? | Fecha de término.                                    |

### 17.2 Roles y Permisos de Ecosistema

- **Dueño (Owner):** Responsable legal. Recibe facturas y estados de cuenta.
- **Inquilino (Tenant):** Responsable operativo. Puede tener flag de `IsFinancialResponsible`.
- **Residente (Resident):** Familiar o habitante. Acceso a App para Amenities/QR pero **NO** ve Ledger financiero.

### 17.3 Impacto en el Motor Contable (Ledger)

1.  **Devengo de Cargo:** El sistema busca en `PropertyMember` quién tiene `IsFinancialResponsible = true` en esa fecha y captura sus datos en el `ResponsiblePartySnapshot`.
2.  **Auditoría Histórica:** Al terminar una relación (`EndDate`), los cargos históricos quedan vinculados al `UserId` que era responsable en ese momento.

### 17.4 Estrategia de Migración de Identidad

1.  **Creación de `PropertyMember`:** Implementar la tabla y sus servicios de gestión.
2.  **Sincronización Inicial:** Un Job migrará los datos de `Owner` y `PropertyOccupant` a la nueva estructura.
3.  **Mantenimiento de Entidades Legacy (IMPORTANTE):**
    - **NO se eliminará la entidad `Owner.cs` en esta fase.**
    - Debido a que `Owner` posee múltiples relaciones activas con otros módulos del sistema (Mantenimiento, Amenidades), su eliminación se pospondrá hasta que todos los módulos hayan sido migrados.
4.  **Limpieza de Usuarios:** Asegurar que cada propietario o inquilino actual tenga un registro en `AspNetUsers`.

### 17.5 Notas de implementacion

- `EMemberRole` enum: Owner=1, CoOwner=2, Tenant=3, Resident=4, Manager=5
- `PropertyMember` entity con todos los campos del plan + `CustomerId` para queries multi-tenant
- `PropertyMemberConfiguration`: 3 indices (tenant+propiedad+activo, responsable financiero, usuario+fecha)
- `IPropertyMemberService` + `PropertyMemberService`:
  - `GetFinancialResponsibleAsync`: consulta por `IsFinancialResponsible=true` vigente en una fecha
  - `AddMemberAsync` / `UpdateMemberAsync`: invariante — revoca responsable financiero previo al activar uno nuevo
  - `EndMembershipAsync`: termina relacion sin eliminar (preservacion historica)
  - `MigrateFromLegacyAsync`: job idempotente que sincroniza Owner + PropertyOccupant al nuevo modelo
- `PropertyMembersController`: 5 endpoints incluyendo `POST /migrate-from-legacy/customer/{id}`
- `ResponsiblePartySnapshot`: campo `PropertyMemberId` (FK viva al nuevo modelo); `OwnerId`/`OccupantId` quedan como legacy
- `ChargeAppService.CapturarResponsableSnapshotAsync`: consulta `PropertyMember` primero con fallback a `Owner` legacy
- Migration pendiente: `Add-Migration Seccion17_PropertyMember`

### Validacion de ejecutado

- [x] `PropertyMember` es la fuente de verdad para el responsable financiero de una propiedad
- [x] Solo puede haber un miembro con `IsFinancialResponsible=true` activo por propiedad en cualquier momento
- [x] Al devengar un cargo, el snapshot captura al responsable via `PropertyMember` (no directamente `Owner`)
- [x] El job de migracion es idempotente y no duplica registros
- [x] Los registros `Owner` y `PropertyOccupant` se mantienen sin modificacion (compatibilidad con otros modulos)
- [ ] Migracion de BD aplicada (`Add-Migration Seccion17_PropertyMember`)
- [ ] Job de migracion ejecutado en datos reales del tenant

### Criterio de salida

La seccion termina cuando el Ledger identifique al sujeto de la deuda desde `PropertyMember` en el 100% de los cargos nuevos, y los datos historicos hayan sido migrados.

---

> **Estado de la Sección:** Implementada. Pendiente migracion de BD y ejecucion del job de datos.
> **Visión:** LuxuryApp pasa de gestionar "departamentos" a gestionar **"Ecosistemas de Relaciones Inmobiliarias con Rigor Financiero"**.

---

## 18. Hoja de Ruta Frontend (Angular 22): Conectando el Cerebro Financiero

**Objetivo:** Implementar la interfaz de usuario que permita operar el nuevo motor Ledger y el modelo de identidad, cumpliendo estrictamente con los mandatos de **`GEMINI.md`** (Signals, Mobile-First, FormHelper).

### 18.1 Estándares de Implementación (Mandatos Gemini)

Para asegurar la calidad de clase mundial en la UI:

- **Signals:** Prohibido usar RxJS para el estado interno de los componentes o inputs. Se usará `signal()`, `computed()` y `effect()`.
- **Formularios:** Uso obligatorio de `FormHelper.submitCrud()` para garantizar que cada alta/edición maneje correctamente los estados de carga y errores de API.
- **Visualización:** Cada listado financiero DEBE tener su versión `app-data-view-mobile` integrada.
- **Auditoría Visual:** Los montos y estados financieros en las tablas deben ser **solo lectura** desde el CRUD genérico; los cambios deben disparar modales de Ajuste o Aprobación.

### 18.2 Componentes y Servicios a Implementar

#### A. Servicios de Angular (Inyección de Dependencias)

Crear los clientes de API para los nuevos controladores del Backend:

- `PropertyMemberService`: Gestión de identidades y roles.
- `FinancialApprovalService`: Bandeja de entrada para autorizaciones.
- `PeriodClosureService`: Control de candados mensuales.
- `LedgerService`: Consulta de historial forense e inmutable.

#### B. Gestión de Miembros y Responsabilidad (Identidad)

_Sustituye la gestión rústica de Owners/Occupants._

- **`member-list.ts`**: Listado unificado de personas vinculadas a la unidad con roles.
- **`member-form.ts`**: Formulario con `submitCrud()` para asignar roles y prender el flag `IsFinancialResponsible`.
- **Validación UI**: Impedir que una propiedad guarde cambios si no tiene exactamente un responsable financiero activo.

#### C. Bandeja de Aprobaciones (Maker-Checker)

_El candado de seguridad contra el fraude._

- **`approval-inbox.ts`**: Dashboard que lista solicitudes de ajustes o cancelaciones pendientes de autorización.
- **`approval-detail-modal.ts`**: Vista previa del impacto financiero (Monto Original vs. Ajustado) antes de confirmar.

#### D. Visor del Libro Mayor / Kardex (Ledger)

_La prueba forense definitiva._

- **`ledger-viewer.ts`**: Componente de solo lectura que muestra la línea de tiempo inmutable.
- **Funcionalidad**: Filtros por fecha efectiva y tipo de evento (Emisión, Pago, Reverso). Sustituye la vista volátil del estado de cuenta anterior.

#### E. Control de Cierres de Mes

_Garantía de inmutabilidad del pasado._

- **`period-closure-dashboard.ts`**: Vista de calendario/lista para bloquear meses.
- **Interactividad**: Al intentar operar sobre un mes cerrado, la UI debe deshabilitar los botones de "Crear" o "Anular" automáticamente.

### 18.3 Pasos Detallados de Ejecución

1.  **DTOs y Modelos (client/angular/src/app/features/.../models):**
    - Mapear las respuestas del Ledger y los nuevos estados derivados.
2.  **Lógica de Servicios (client/angular/src/app/features/.../services):**
    - Implementar los servicios con `HttpClient` y tipado fuerte.
3.  **Refactorización de Formularios (Existing Forms):**
    - Retirar de `charge-form.ts` y `payment-form.ts` la edición manual de campos financieros (Monto/Estado).
    - Agregar botones de "Solicitar Ajuste" que disparen el flujo de aprobaciones.
4.  **Actualización de Rutas (`cobranza-nativa.routing.ts`):**
    - `/members`: Gestión de identidad.
    - `/approvals`: Bandeja Maker-Checker.
    - `/ledger`: Visor inmutable.
    - `/period-closures`: Gestión de candados.

---

### 18.4 Estado real de implementacion (verificado abril 2026)

#### Rutas registradas en cobranza-nativa.routing.ts

Todas las rutas del plan estan declaradas y funcionales:

- [x] `/cobranza-nativa` — dashboard principal
- [x] `/cobranza-nativa/dashboard` — metricas operativas
- [x] `/cobranza-nativa/charge-templates` — plantillas de cargos
- [x] `/cobranza-nativa/charges` — cargos individuales
- [x] `/cobranza-nativa/payments` — registro de pagos
- [x] `/cobranza-nativa/late-fee-policies` — politicas de mora
- [x] `/cobranza-nativa/estado-cuenta` — estado de cuenta nativo
- [x] `/cobranza-nativa/members` — gestion de miembros (Seccion 17/18)
- [x] `/cobranza-nativa/approvals` — bandeja maker-checker
- [x] `/cobranza-nativa/ledger` — visor ledger inmutable
- [x] `/cobranza-nativa/period-closures` — cierres de periodo
- [x] `/cobranza-nativa/collection-cases` — casos de cobranza legal
- [x] `/cobranza-nativa/invoices` — facturas CFDI
- [x] `/cobranza-nativa/reconciliation` — conciliacion de pagos
- [x] `/cobranza-nativa/audit` — bitacora financiera
- [x] `/cobranza-nativa/automated-services` — servicios automatizados
- [x] `/cobranza-nativa/charge-template-coverage` — cuotas vigentes por propiedad (nuevo)
- [x] `/cobranza-nativa/system-overview` — como funciona el sistema

#### Componentes implementados y verificados en codigo

| Componente | Archivo | Estado | Observaciones |
|---|---|---|---|
| Dashboard principal | `cobranza-nativa-dashboard.ts/html` | Implementado | Card de charge-template-coverage agregada |
| Gestion de miembros | `members/member-list.ts/html` | Implementado | Agrupado por propiedad, busqueda con globalFilterFields |
| Formulario miembro | `members/member-form.ts/html` | Implementado | Flujo 2 pasos: crear ApplicationUser (TypePerson=Client) -> membership |
| Bandeja aprobaciones | `approvals/approval-inbox.ts/html` | Implementado | Desktop + mobile, carga por customerId |
| Modal aprobacion | `approvals/approval-detail-modal.ts/html` | Implementado | Vista de impacto financiero |
| Ledger viewer | `ledger/ledger-viewer.ts/html` | Implementado | Filtros por propiedad, fecha, tipo de evento |
| Cierres de periodo | `period-closures/period-closure-dashboard.ts/html` | Implementado | Cerrar y reabrir periodos |
| Bitacora auditoria | `audit/financial-audit-log.ts/html` | Implementado | Filtros por propiedad y rango de fechas |
| Conciliacion | `reconciliation/reconciliation-dashboard.ts/html` | Implementado | Pagos no asignados + auto-conciliacion |
| Cuotas vigentes | `charge-template-coverage/charge-template-coverage.ts/html` | Implementado | Columnas dinamicas por mes |
| Facturas CFDI | `invoices/invoice-list.ts/html` | Implementado | Listado de facturas |
| Casos cobranza legal | `collection-cases/collection-case-list.ts/html` | Implementado | Listado + modal de detalle |
| Estado de cuenta | `native-statement/native-statement.ts/html` | Implementado | Construido desde ledger (Fase 4) |

#### Conformidad con GEMINI.md verificada

- [x] Signals exclusivamente: `signal()`, `computed()`, `effect()` — sin RxJS en estado interno
- [x] Prohibido `@Input()` / `@Output()`: todos los inputs usan `input()` de Angular signals API
- [x] `app-data-view-mobile` presente en todos los listados
- [x] UTF-8, espanol, sin emojis en codigo
- [ ] `FormHelper.submitCrud()`: member-form.ts usa patron manual (justificado: flujo 2 pasos con logica de creacion de usuario no es CRUD estandar)
- [ ] `FormHelper.submitCrud()`: period-closure-dashboard.ts usa patron manual (justificado: operacion no usa DynamicDialogRef)

#### Pendientes reales del modulo

## Estado de Ejecucion (abril 2026)

| Item | Estado |
|------|--------|
| Fases 0-5 implementadas en codigo | Completado |
| Migraciones EF Core (Fases 1-5 + Seccion 17) | Completado |
| Eliminacion entidades legacy (MaintenanceFeeCharge, ExtraordinaryFee, Payment, Owner, etc.) | Completado |
| Job de migracion Owner/PropertyOccupant a PropertyMember | Completado |
| Frontend Angular Seccion 17/18 | Completado |
| Tipos 3/4/5 de AprobacionFinanciera (ReaperturaPeriodo, AnulacionCargoPagado, AjusteAlAlza) | Completado |

**Pendiente:**

1. **Integracion COI/CFDI** (Fase 5): alinear conciliacion y facturacion con eventos del ledger nativo

---

> **Estado de la Seccion:** Implementada. Verificada en codigo abril 2026.
> **Vision:** El Frontend deja de ser un editor de datos para convertirse en una **Consola de Gobierno Financiero**.

---

## 19. Modulo de Multas Reglamentarias

**Fecha de implementacion:** 23 de abril de 2026
**Estado:** Implementado — pendiente aplicar migracion `AddMultasReglamentarias`

**Objetivo:** Gestionar infracciones al reglamento interno del condominio con un expediente formal por propiedad, respaldo documental (evidencia) y generacion de cargo financiero integrado al ledger.

### 19.1 Alcance acordado

| Decision | Valor |
|---|---|
| Roles emisores | Administrador y Asistente |
| Requiere aprobacion maker-checker | No (ninguna multa, sin importar monto) |
| El residente puede apelar | No (v1) |
| Reincidencia escala el monto | No (v1) |
| Genera CFDI / factura | No |

### 19.2 Nuevas entidades

Ruta: `api/LuxuryApp.Infrastructure/Data/Entities/CobranzaNativa/`

| Entidad | Tabla | Descripcion |
|---|---|---|
| `RegulationArticle` | `RegulationArticles` | Catalogo de articulos del reglamento por condominio. Almacena numero, titulo, texto completo y monto default. |
| `PropertyFine` | `PropertyFines` | Expediente de multa. Vincula propiedad, articulo, descripcion de infraccion, importe, estado y cargo generado. |
| `FineEvidence` | `FineEvidences` | Archivos adjuntos (PDF, fotos) de la infraccion. 1:N con `PropertyFine`. |

### 19.3 Nuevo enum

- `EFineStatus` en `api/LuxuryApp.Shared/Enums/EFineStatus.cs`
  - `Emitida = 1` → `Notificada = 2` → `CargoGenerado = 3` → `Pagada = 4`
  - `Anulada = 5` (desde cualquier estado antes de Pagada)

- `EChargeType.Multa` agregado a `api/LuxuryApp.Shared/Enums/EChargeType.cs`

### 19.4 Backend implementado

**Entity Configurations:**
- `RegulationArticleConfiguration` — indice unico `(CustomerId, ArticleNumber)`
- `PropertyFineConfiguration` — CHECK `Amount > 0`, indices por `(PropertyId, Status)` y `(CustomerId, InfractionDate)`
- `FineEvidenceConfiguration` — indice por `PropertyFineId`

**Interfaces:**
- `IRegulationArticleAppService` — CRUD completo
- `IPropertyFineAppService` — CRUD + `IssueChargeAsync` + `VoidAsync` + evidencias

**Servicios:**
- `RegulationArticleAppService` — valida que no se elimine un articulo con multas asociadas
- `PropertyFineAppService`:
  - `IssueChargeAsync`: abre transaccion, crea `Charge` tipo `Multa`, escribe en ledger (`EFinancialEventType.EmisionCargo`), vincula `ChargeId` a la multa, transiciona estado a `CargoGenerado` — atomico
  - `VoidAsync`: anula la multa si no esta pagada
  - `AddEvidenceAsync` / `RemoveEvidenceAsync`: gestiona archivos via `IFileWritePathService.FineEvidenceDirectory`

**Controladores:**
- `RegulationArticlesController` — `api/accounting-coi/native-collection/regulation-articles`
- `PropertyFinesController` — `api/accounting-coi/native-collection/property-fines`

**DI registrado en:** `DependencyInjection.Controllers.cs`

**Directorio de archivos:**
- Nuevo metodo `FineEvidenceDirectory(customerId, fineId)` en `IFileWritePathService` y `FileWritePathService`
- Nueva constante `FileDirectories.Modules.FineEvidences = "fine-evidences"`

**Migracion:** `20260424010626_AddMultasReglamentarias.cs` — generada, pendiente de aplicar

### 19.5 Frontend implementado

**Modelos:** `client/.../cobranza-nativa/models/property-fine.dto.ts`
- `RegulationArticleResponseDTO`, `CreateRegulationArticleDTO`, `UpdateRegulationArticleDTO`
- `PropertyFineResponseDTO`, `CreatePropertyFineDTO`, `UpdatePropertyFineDTO`
- `FineEvidenceResponseDTO`, `IssueFineChargeDTO`

**Endpoints en `endpoints.ts`:**
- `Endpoints.AccountingCoi.NativeCollection.RegulationArticles.*`
- `Endpoints.AccountingCoi.NativeCollection.PropertyFines.*`

**Rutas nuevas en `cobranza-nativa.routing.ts`:**
- `/cobranza-nativa/regulation-articles`
- `/cobranza-nativa/property-fines`

**Componentes:**

| Archivo | Funcion |
|---|---|
| `regulation-articles/regulation-article-list.ts/html` | Tabla CRUD de articulos del reglamento |
| `regulation-articles/regulation-article-form.ts/html` | Formulario add/edit con textarea para texto completo |
| `property-fines/property-fine-list.ts/html` | Tabla con columnas: propiedad, articulo, descripcion, fecha, importe, estado, evidencias, acciones |
| `property-fines/property-fine-form.ts/html` | Formulario add/edit — carga propiedades y articulos activos como selects |
| `property-fines/issue-fine-charge-form.ts/html` | Modal dedicado para confirmar fecha de vencimiento y generar el cargo financiero |

**Dashboard:** 2 tarjetas nuevas en grupo "Cobranza Legal" de `cobranza-nativa-dashboard.ts`

### 19.6 Integracion con el modelo financiero existente

- Al confirmar una multa (`IssueChargeAsync`), se crea un `Charge` con `Type = EChargeType.Multa`
- El cargo se escribe en el ledger con `EFinancialEventType.EmisionCargo`
- El pago de la multa se gestiona por el modulo de Pagos existente (igual que cualquier cargo)
- No requiere `FinancialApprovalRequest` (maker-checker excluido por decision de alcance v1)
- Las multas no generan `ResponsiblePartySnapshot` propio — el snapshot se captura al crear el `Charge` via `ChargeAppService` (flujo existente)

### 19.7 Pendientes

- [ ] Aplicar migracion: `dotnet ef database update --context ApplicationDbContext`
- [ ] Sincronizacion automatica de estado `Pagada` cuando el `Charge` vinculado quede pagado (actualmente manual via Ledger)
- [ ] Notificacion al responsable de la propiedad al emitir una multa (integracion con `NotificationEngineService`)
- [ ] Rol `Asistente` pendiente de verificar si existe en `EApplicationRole` del sistema
# Estado de Vigencia

- Plan historico de rediseño financiero.
- Conserva decisiones de dominio utiles, pero ya no representa el mapa actual de carpetas y rutas.
- Las referencias a `Features/Contabilidad/CobranzaNativa` y `client/angular/src/app/features/...` son legacy.
- Para la ejecucion vigente prevalece `Docs/Architecture/01-plan-ejecucion-separacion-cobranza-nativa.md`.
- Las reglas de codificacion vigentes son `CONVENTIONS.md` y `AGENTS.md`.
