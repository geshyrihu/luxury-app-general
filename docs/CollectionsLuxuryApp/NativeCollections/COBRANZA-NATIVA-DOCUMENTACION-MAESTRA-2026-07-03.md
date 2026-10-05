# Cobranza Nativa - Documentacion Maestra

Fecha de actualizacion: 2026-07-26
Modulo: `client/angular/src/app/modules/collections.luxuryapp/cobranza-nativa`
Estado funcional: Activo, con reorganizacion por frontera ejecutada

## Estado de vigencia

Este documento sigue vigente como referencia maestra del frontend, pero queda
subordinado a la frontera tecnica oficial del modulo.

Orden de lectura recomendado:

1. `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
2. `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/reglas-negocio-cobranza-nativa.md`
3. `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
4. este documento

Reglas de vigencia:

- no usar este documento como contrato primario de rutas o DTOs
- usarlo como explicacion funcional y mapa del frontend del modulo
- la compatibilidad externa sigue permitida solo como zona encapsulada dentro
  del propio modulo

## Objetivo del modulo

Cobranza Nativa administra el ciclo financiero condominial completo dentro de LuxuryApp, sin depender de Aspel como motor operativo diario:

- administra propiedades y responsables financieros
- genera cargos ordinarios, extraordinarios, multas y recargos
- registra pagos, abonos, notas de credito y conciliaciones
- proyecta saldos desde ledger financiero inmutable
- emite estados de cuenta y PDF
- dispara notificaciones, aprobaciones y controles de cierre

## Principios funcionales

### 1. Propiedad como eje financiero

Cada propiedad concentra:

- responsable financiero
- historial de cargos
- historial de pagos
- saldo proyectado
- estado de cuenta
- aging
- posibles multas, notas de credito y caso de cobranza

### 2. Ledger inmutable

El saldo no depende solo de campos mutables en cargos o pagos. El estado de cuenta y la trazabilidad financiera se apoyan en eventos append-only:

- emision de cargo
- aplicacion de pago
- reverso
- recargo
- nota de credito
- ajuste
- cierre

### 3. Operacion manual + automatizada

El modulo mezcla captura operativa y jobs:

- alta de cargos manuales
- registro de pagos manuales
- generacion automatica de cargos
- calculo automatico de mora
- aviso y cobranza preventiva
- escalamiento a cobranza legal

### 4. Control y auditabilidad

Las operaciones sensibles se controlan con:

- bitacora financiera
- ledger
- aprobaciones maker-checker
- cierres de periodo
- conciliacion de pagos sobrantes

## Estado actual consolidado

### Ya implementado

- dashboard funcional del modulo
- catalogo de tipos de cargo con cuenta contable
- plantillas de cargos
- cargos manuales
- pagos y aplicacion FIFO
- saldos iniciales
- miembros de propiedad
- politicas de mora
- ledger financiero
- estado de cuenta ledger-based con fecha de corte
- PDF real del estado de cuenta
- envio manual de estado de cuenta por email
- envio masivo de estados de cuenta por condominio
- configuracion de canales email/push
- auditoria financiera
- bitacora funcional de envio de estados de cuenta
- conciliacion de pagos
- cierres de periodo
- aprobaciones financieras
- servicios automatizados
- multas y articulos de reglamento
- casos de cobranza

### Consolidado en la remediacion 2026-07-31

- frontend critico validado con pruebas automatizadas
- formularios, listados y vistas de consulta prioritarias con cobertura
- refresh extendido validado en flujos criticos con realtime
- estrategia mobile definida por subdominio critico
- `billing-config` mantenido como compatibilidad temporal y no como centro del core

### Requerimientos agregados que deben seguir en roadmap

- listado custom de cargos
- cuotas recurrentes con fecha inicio y fecha fin
- aplicacion automatica de cargos
- cuota fija para todos los deptos o por indiviso
- pena moratoria por anio o por mes
- avisos de cobro
- estados de cuenta enriquecidos
- cargos adicionales eventuales
- socket/signal para reaccionar a aplicacion de cargos y abonos
- reemplazar `EChargeType` por entidad con `AccountNumber`

## Flujo maestro del modulo

### Fase A. Configuracion base

1. Se registran propiedades.
2. Se asignan miembros a la propiedad.
3. Se define el responsable financiero activo.
4. Se configura modo de facturacion y canales de notificacion.
5. Se definen tipos de cargo, plantillas y politicas de mora.

### Fase B. Emision operativa

1. Se generan cargos manuales o automaticos.
2. El cargo nace con importe, vencimiento, tipo y propiedad.
3. Se registra evento financiero en ledger.
4. El cargo queda pendiente o parcial dependiendo de su aplicacion.

### Fase C. Cobro y aplicacion

1. Se registra un pago.
2. El sistema intenta aplicarlo a cargos pendientes.
3. Si sobra dinero, queda saldo no aplicado para conciliacion.
4. Cada paso genera entradas en ledger y eventos de tiempo real.

### Fase D. Mora y regularizacion

1. Si el cargo vence y supera tolerancia, se calculan recargos.
2. Se pueden crear ajustes, condonaciones o notas de credito.
3. Si la deuda madura, puede escalar a caso de cobranza.

### Fase E. Consulta y salida

1. Se proyecta estado de cuenta por fecha de corte.
2. Se calcula aging.
3. Se genera PDF.
4. Se envia por email si el canal esta activo.
5. El equipo revisa auditoria, ledger y cierres.

## Paginas principales del frontend

- `dashboard raiz`: mapa curado de rutas reales del modulo
- `dashboard`: metricas operativas
- `charge-types`: catalogo de tipos de cargo
- `charge-templates`: plantillas de cargos
- `charges`: cargos emitidos
- `payments`: captura y aplicacion de pagos
- `late-fee-policies`: reglas de mora
- `estado-cuenta`: estado de cuenta ledger-based
- `members`: miembros y responsables
- `ledger`: trazabilidad financiera
- `period-closures`: cierres de periodo
- `approvals`: aprobaciones financieras
- `audit`: auditoria financiera
- `reconciliation`: conciliacion de pagos
- `automated-services`: ejecuciones operativas
- `charge-template-coverage`: cuotas vigentes por propiedad
- `property-fines`: multas
- `collection-cases`: cobranza legal
- `system-overview`: explicacion general
- `flow-map`: diagrama visual del flujo completo

### Nota de UX del dashboard raiz

El dashboard principal ya no mezcla conceptos, jobs internos y modales como si todo fueran paginas iguales. Ahora:

- agrupa por flujo funcional real
- organiza la entrada en tabs por bounded context
- evita cards duplicadas o sin ruta
- concentra automatizacion en una sola entrada
- expone la configuracion de facturacion y notificaciones como modal real
- deja las vistas de entendimiento en un bloque separado para onboarding

## Regla de frontera para frontend

El frontend de `cobranza-nativa` queda organizado asi:

- `core/` para operacion nativa
- `configuration/` para configuracion y compatibilidad permitida
- `contracts/external-compatibility/` para semantica externa temporal
- `onboarding/` y `docs/` para explicacion y apoyo visual

No deben volver a entrar a `core/` referencias de lenguaje:

- `Aspel`
- `Coi`
- `Live`
- `Local`
- `Online`

## Entidades y conceptos clave

### Operacion

- `Property`
- `PropertyMember`
- `BillingConfig`
- `NativeCollectionNotificationSetting`
- `ChargeTemplate`
- `ChargeTypeCatalog`
- `Charge`
- `CobranzaPayment`
- `CreditNote`
- `LateFeePolicy`

### Control financiero

- `FinancialLedgerEntry`
- `FinancialApproval`
- `FinancialAudit`
- `PeriodClosure`
- `CollectionCase`

### Salidas y comunicacion

- `NativeStatementResponseDTO`
- PDF de estado de cuenta
- notificaciones email/push
- actualizaciones realtime SignalR

## Eventos que mueven el sistema

### Cuando se crea un cargo

- aumenta deuda
- se registra en ledger
- puede detonar automatizaciones posteriores
- afecta estado de cuenta y aging

### Cuando se registra un pago

- reduce deuda o crea saldo no aplicado
- se aplica a cargos segun reglas
- se registra en ledger
- puede disparar notificaciones y realtime

### Cuando se aplica recargo

- crea nuevo cargo
- incrementa deuda vencida
- actualiza estado de cuenta

### Cuando se crea nota de credito o ajuste

- modifica la posicion financiera sin borrar historia
- queda trazabilidad en ledger
- puede requerir aprobacion segun flujo

### Cuando se cierra periodo

- bloquea movimientos operativos en el periodo
- obliga a seguir flujo de control si hay excepciones

## Integraciones y capas

### Backend

Area principal:

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/`

Capas relevantes:

- controllers
- services
- DTOs
- interfaces

### Datos

Area principal:

- `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Accounting/AR/`

### Frontend

Area principal:

- `client/angular/src/app/modules/collections.luxuryapp/cobranza-nativa/`

## Fase 6 cerrada

La Fase 6 ya deja:

- endpoint PDF real del estado de cuenta
- preview y descarga desde UI
- adjunto PDF en envio manual del estado de cuenta
- pruebas focalizadas y build backend en verde

## Pendientes recomendados

### Arquitectura funcional

- convertir tipos de cargo a catalogo/entidad con `AccountNumber`
- cuotas recurrentes con vigencia
- motor automatico de cargos mas declarativo

### Operacion y UX

- avisos de cobro masivos
- envio masivo de estados de cuenta
- tablero visual de flujo para onboarding
- bitacora de generacion y envio documental

### Integridad y tiempo real

- reforzar eventos SignalR por cargo, abono y conciliacion
- consumidores desacoplados para automatizaciones encadenadas

## Referencia visual recomendada

Para explicar el modulo a UI y negocio, usar la nueva pantalla:

- ruta: `/cobranza-nativa/flow-map`

Esa vista resume visualmente:

- entradas maestras
- eventos operativos
- motor automatico
- salidas
- controles
- interdependencias del modulo
