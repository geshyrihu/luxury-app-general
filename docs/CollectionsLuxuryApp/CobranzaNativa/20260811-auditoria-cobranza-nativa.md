# Auditoria Completa - CobranzaNativa

**Fecha:** 2026-08-11
**Estado:** Requiere plan de reactivacion + decisiones de negocio pendientes
**Modulo:** `CobranzaNativa`
**Backend:** `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa`
**Frontend:** `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa`
**Documento rector:** `conventions/modules/cobranza-nativa-module-conventions.md`
**Auditoria previa:** `docs/reporte_maestro/modulos/20260731-auditoria-cobranza-nativa.md`
**Plan previo:** `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
**Plan derivado:** `docs/plans/20260811-cobranza-nativa-reactivacion-plan.md`
**Modelo de severidad:** `conventions/audit/audit-severity-model.md`

---

## Resumen ejecutivo

El corte del 2026-07-31 dejo al modulo con el diagnostico *"requiere plan de
migracion"* por cuatro problemas estructurales: frontera frontend rota, `core/`
contaminado con contratos de compatibilidad, endpoints gordos y documentacion
desalineada.

**Tres de esos cuatro se cerraron.** La verificacion de este corte confirma que
la frontera frontend, los contratos del `core/` y los endpoints delgados ya
cumplen. Ese trabajo fue real y no debe repetirse.

El problema de este corte es distinto y mas serio: **el modulo tiene los
controles financieros construidos pero desconectados.** Las invariantes que su
propia documentacion declara obligatorias —maker-checker, idempotencia en
pagos, bitacora de auditoria— existen como codigo y **no se ejercen en el flujo
real**. A eso se suma una capa de autorizacion practicamente inexistente y un
webhook publico de pagos cuya validacion de firma esta declarada en el propio
codigo como simulacion.

Resultado formal de este corte: **incumplimiento critico de seguridad y de
invariantes financieras declaradas**. No es un problema de volumen de codigo,
es un problema de cierre.

### Cuadro de mando

| Dimension | Corte 2026-07-31 | Corte 2026-08-11 |
|---|:--:|:--:|
| Incumplimientos criticos | 3 | **7** |
| Incumplimientos altos | 5 | 5 |
| Deuda tecnica | 3 | 6 |
| Riesgo shared/contrato | 1 | 2 |
| Hallazgos cerrados desde el corte anterior | — | **7** |
| Reglas de negocio declaradas | 5 | 5 |
| Reglas verificadas como implementadas | sin medir | **9 de 18** |
| Reglas que requieren decision de negocio | sin medir | **7** |

---

## Alcance auditado

- backend `Core/` completo (17 subdominios) + `Contracts/ExternalCompatibility`
- frontend `entry/`, `core/`, `configuration/`, `contracts/`, `interfaces/`,
  `onboarding/`, `docs/`
- capa de autorizacion: `api/LuxuryApp.API/ServiceExtensions/DependencyInjection.Authorization.cs`
- entidades maestras relacionadas: `Property`, `PropertyMember`, `PropertyOccupant`, `Owner`
- documentacion viva del modulo (`Docs/` backend y `docs/` frontend)
- residuales abiertos del plan `20260731`

**No se modifico codigo durante esta auditoria.**

### Metodo de verificacion

Toda afirmacion de esta auditoria se sostiene sobre lectura de codigo. Criterio
aplicado para el frontend: **una capacidad cuenta como consumida solo si un
componente la invoca**. Las referencias que existen unicamente en
`cobranza-nativa-groups.const.ts` (catalogo documental del wrapper) no cuentan.
Esa distincion mueve el consumo real de 89 a **72 claves de endpoint**.

---

## Parte I. Hallazgos cerrados desde el corte anterior

Verificados como resueltos. Se documentan para que no se vuelvan a abrir.

| Hallazgo 2026-07-31 | Verificacion 2026-08-11 | Estatus |
|---|---|:--:|
| Frontera frontend rota: `properties` cargaba `resident.luxuryapp` | `cobranza-nativa.routing.ts:113-117` carga `property-boundary-placeholder` propio del modulo | ✅ cerrado |
| `core/` consumiendo `contracts/external-compatibility` | Unico consumo restante: `configuration/billing-config/billing-config-modal.ts:29-30`, que es la frontera sancionada por el propio plan | ✅ cerrado |
| `any` en flujos editables (5 archivos) | Queda **1** ocurrencia: `core/approvals/approval-detail-modal.ts:44` (`payload = signal<any>`), justificable por ser payload heterogeneo | ✅ cerrado |
| `CollectionCasesEndpoints` con `ApplicationDbContext` directo | **0** endpoints del modulo inyectan `ApplicationDbContext` | ✅ cerrado |
| `LedgerEndPoints` exponia `FinancialLedgerEntry` (entidad EF) | **0** respuestas exponen entidades EF; existe `FinancialLedgerEntryResponseDTO.cs` | ✅ cerrado |
| DTOs multiples en archivos nombrados (`AdjustmentDTOs.cs`, etc.) | Esos archivos ya no existen; los DTOs estan separados | ✅ cerrado (parcial, ver A-02) |
| `0` pruebas frontend | **12** archivos `*.spec.ts` | ✅ cerrado |

**Residuales del plan `20260731` que siguen abiertos:**

| Fase | Tarea pendiente | Se absorbe en |
|:--:|---|---|
| 0 | clasificar documentos vigentes vs historicos en `Docs/` y `docs/` | S-02 |
| 0 | registrar que piezas publican aun `api/accounting-coi/native-collection/*` | S-02 |
| 2 | tipar `ledger-viewer`, `native-statement`, `financial-audit-log` | cerrado en la practica (0 `any` en esos archivos) |
| 2 | revisar selects, autocomplete y wrappers `@ui/*` en modo edicion | D-06 |
| 2 | definir fallbacks cuando el catalogo no contenga el valor editado | D-06 |

---

## Parte II. Hallazgos de este corte

### 1. Incumplimiento critico

---

#### C-01 · Webhook publico de pagos con validacion de firma simulada

- **Evidencia:**
  `Core/Payments/EndPoints/WebhooksEndPoints.cs:8,25` — `MapGroup` sin
  `RequireAuthorization`, endpoint marcado `.AllowAnonymous()`
  `Core/Payments/Services/WebhookHandlerService.cs:13-19` — comentario literal
  en el codigo: *"1. Validar firma del webhook (simulación)"*
  `Core/Payments/Services/WebhookHandlerService.cs:45-47` — marca
  `PaymentStatus.Verificado` y persiste
- **Hallazgo:**
  el endpoint `POST api/cobranza/payment-webhooks/pasarela` es publico y su
  unica validacion es que el header `X-Signature-Header` o `Stripe-Signature`
  **no venga vacio**. No hay HMAC, no hay secreto compartido, no hay
  verificacion del emisor.
- **Escenario de falla concreto:**
  un tercero que conozca la ruta envia
  `POST /api/cobranza/payment-webhooks/pasarela` con header
  `X-Signature-Header: x` y un `Reference` valido. El sistema marca el pago como
  **Verificado** y lo auto-aplica a los cargos de la propiedad. Se liquida una
  deuda sin que haya entrado dinero.
- **Impacto:**
  escritura financiera no autenticada sobre el ledger.
- **Riesgo:**
  critico. Es la unica ruta del modulo accesible sin sesion.
- **Recomendacion:**
  implementar verificacion HMAC contra secreto por tenant antes de habilitar
  cualquier pasarela; mientras tanto, deshabilitar el mapeo del endpoint.
- **Estatus:** abierto

---

#### C-02 · Autorizacion sin politica de rol en 20 de 21 grupos

- **Evidencia:**
  20 archivos `Core/*/EndPoints/*.cs` con `.RequireAuthorization()` sin argumento
  Unica excepcion: `Core/Reconciliation/EndPoints/ReconciliationsEndpoints.cs:8`
  con `.RequireAuthorization("Finanzas")`
  Contraste: `CobranzaOnline` aplica `"Finanzas"` en todos sus grupos y
  `"SoloSuperUsuario"` en el sync
- **Hallazgo:**
  cualquier usuario autenticado —incluido un `Condomino` o un `Proveedor`—
  alcanza los endpoints financieros del modulo.
- **Escenario de falla concreto:**
  un usuario con rol `Proveedor` con sesion valida ejecuta
  `POST api/cobranza/period-closures/customer/{id}/close` y cierra el periodo
  contable del condominio, o `POST api/cobranza/approvals/{id}/approve` y
  autoriza una condonacion.
- **Impacto:**
  no existe control de acceso efectivo sobre el subsistema financiero.
- **Riesgo:**
  critico.
- **Recomendacion:**
  aplicar `"Finanzas"` como linea base en los 20 grupos. Para el subconjunto
  sensible (cierres, aprobaciones, reaperturas, anulaciones) la politica
  `"Finanzas"` es demasiado amplia: **incluye `Asistente`**. Requiere una
  politica nueva → ver `RN-CN-021`, que es decision de negocio.
- **Estatus:** abierto

---

#### C-03 · La idempotencia declarada obligatoria esta inactiva en aplicacion de pagos

- **Evidencia:**
  `Docs/reglas-negocio-cobranza-nativa.md:135-142` — *"La idempotencia no es
  opcional"*, lista explicitamente "aplicacion de pagos"
  `Core/Payments/DTOs/ApplyPaymentToChargesDTO.cs:14` — `IdempotencyKey` es
  `string` sin `[Required]`
  `Core/Payments/Services/PaymentAllocationService.cs:148-158` — la guarda
  completa esta dentro de `if (!string.IsNullOrWhiteSpace(dto.IdempotencyKey))`
  Frontend: **cero** ocurrencias de `idempotency` en todo el modulo
- **Hallazgo:**
  la proteccion existe y funciona, pero es condicional a que el cliente envie la
  clave, y **el unico cliente del sistema no la envia nunca**.
- **Escenario de falla concreto:**
  el usuario da doble clic en "Aplicar pago" o la red reintenta el POST. Se
  crean dos juegos de `ChargePaymentAllocations` para el mismo pago; el cargo
  queda sobre-aplicado y el ledger registra el doble.
- **Impacto:**
  invariante financiera declarada como obligatoria, incumplida en produccion.
- **Riesgo:**
  critico.
- **Recomendacion:**
  generar la clave en el frontend por operacion, o derivarla en backend de
  (`PaymentId` + hash de asignaciones) y hacerla obligatoria.
- **Nota positiva:** la idempotencia **si** funciona en generacion de cargos
  (`ChargesGeneratorService.cs:73-76`, por plantilla+propiedad+periodo) y en
  recalculo de recargos (`LateFeeCalculatorService.cs:48`).
- **Estatus:** abierto

---

#### C-04 · El maker-checker declarado obligatorio esta inerte

- **Evidencia:**
  `Docs/reglas-negocio-cobranza-nativa.md:130-133` — *"Las operaciones sensibles
  como ajustes, condonaciones, reaperturas o anulaciones aprobables deben
  respetar flujo maker-checker"*
  `IFinancialApprovalService` se inyecta **unicamente** en
  `Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs`. Ningun servicio de
  negocio lo consume.
  `FinancialApprovalService.cs:37` es el unico lugar que instancia
  `FinancialApprovalRequest`
  Frontend: `POST cobranza/approvals` **no lo invoca ninguna pantalla**
- **Hallazgo:**
  no existe ningun camino —ni de codigo ni de UI— por el que se genere una
  solicitud de aprobacion. La bandeja `/cobranza-nativa/approvals` funciona,
  pero solo mostraria registros creados por llamada manual a la API.
- **Impacto:**
  hoy **no hay segunda firma sobre ninguna operacion financiera** del modulo.
- **Riesgo:**
  critico. Es la invariante #4 de su propia documentacion.
- **Recomendacion:**
  invocar `IFinancialApprovalService` desde `AdjustmentService`,
  `CobranzaPaymentAppService.CancelAsync` y `PeriodClosureService.ReopenAsync`.
  **Antes se requiere especificar que operaciones y bajo que umbral** →
  `RN-CN-014` y `RN-CN-015`.
- **Estatus:** abierto

---

#### C-05 · La nota de credito se registra como pago y evade sus propias validaciones

- **Evidencia:**
  `core/payments/credit-note-modal.ts:113,123` — envia a
  `Endpoints.CobranzaCore.Payments.create` con
  `method: EPaymentMethod.DebtForgiveness`
  `Core/Approvals/Services/AdjustmentService.cs:28-38` — la ruta correcta valida
  `AuthorizedBy` obligatorio en condonaciones e impide importe negativo
  `LuxuryApp.Shared/Enums/PaymentMethod.cs:72` — `DebtForgiveness` no recibe
  ningun tratamiento especial en backend
  `Endpoints.CobranzaCore.Adjustments.createCreditNote` **no lo invoca ninguna
  pantalla**
- **Hallazgo:**
  la condonacion entra al sistema como un pago comun. No pasa por
  `AdjustmentService`, no exige autorizante y no queda tipificada como ajuste.
- **Escenario de falla concreto:**
  se condonan $50,000 a una propiedad. El dashboard de metricas y la
  conciliacion los cuentan como **recaudado**. El porcentaje de cobranza del mes
  queda inflado y no hay registro de quien autorizo.
- **Impacto:**
  distorsion de metricas financieras y perdida de trazabilidad de autorizacion.
- **Riesgo:**
  critico.
- **Recomendacion:**
  redirigir el modal a `Adjustments.createCreditNote`. La clasificacion
  contable correcta es decision de negocio → `RN-CN-016`.
- **Estatus:** abierto

---

#### C-06 · Ruta fisica del servidor expuesta al frontend

- **Evidencia:**
  `Core/Fines/Services/PropertyFineAppService.cs:242` — `StoragePath = fullPath`
  `Core/Fines/DTOs/FineEvidenceResponseDTO.cs:8` — el DTO publica `StoragePath`
  `Core/Fines/Services/PropertyFineAppService.cs:309` — se mapea a la respuesta
  `interfaces/property-fine.dto.ts:30` — el frontend recibe `storagePath`
  **Cero** usos de `IFileReadPathService` en todo el modulo
- **Hallazgo:**
  incumple la Regla Critica de Document Handling (`CONVENTIONS.md §6.1`):
  *"NUNCA exponer rutas fisicas al frontend"*. Tampoco se usa el componente
  oficial `WebButtonIconViewPdf`.
- **Impacto:**
  fuga de estructura de directorios del servidor.
- **Riesgo:**
  critico por clasificacion explicita de la regla.
- **Recomendacion:**
  `IFileWritePathService` para escribir (ya se usa), `IFileReadPathService` para
  devolver URL segura `/api/files/download?filePath=...`, y guardar nombre
  legible separado del UUID.
- **Estatus:** abierto

---

#### C-07 · Facturacion CFDI simulada presentada como funcional

- **Evidencia:**
  `Core/Invoices/Services/InvoiceService.cs:24-26` — `simulatedUuid`,
  `mockXml`, `mockPdf` con contenido literal `"%PDF-1.4 Mock Document"`
  `core/invoices/invoice-list.html:84-99` — los botones XML y PDF **no tienen
  handler `(clicked)`**
  `Endpoints.CobranzaCore.Invoices.generate` y `.cancel` **no los invoca
  ninguna pantalla**
- **Hallazgo:**
  el modulo expone en el menu una capacidad de facturacion fiscal que genera un
  UUID falso y archivos vacios, sin integracion con PAC.
- **Escenario de falla concreto:**
  un administrador entra a `/cobranza-nativa/invoices`, ve la pantalla y asume
  que el condominio esta facturando. No hay CFDI ante el SAT.
- **Impacto:**
  riesgo de incumplimiento fiscal por confianza indebida en la herramienta.
- **Riesgo:**
  critico por consecuencia externa.
- **Recomendacion:**
  retirar la ruta del menu o marcarla visiblemente como simulada, hasta que
  exista integracion real con PAC.
- **Estatus:** abierto

---

### 2. Incumplimiento alto

---

#### A-01 · 24 DTOs declaran `Guid Id` sin heredar de `GuidIdEntityDTO`

- **Evidencia:** regla en `CONVENTIONS.md §6.1`. Archivos incumpliendo:

  ```text
  Contracts/ExternalCompatibility/DTOs/  ChargeResponseDTO · CobranzaPaymentResponseDTO
                                         UpdateChargeDTO · UpdateCobranzaPaymentDTO
  Core/Approvals/DTOs/                   AdjustmentResponseDTO · CreditNoteResponseDTO
  Core/ChargeTypes/DTOs/                 ChargeTypeCatalogResponseDTO · UpdateChargeTypeCatalogDTO
  Core/CollectionCases/DTOs/             CollectionActivityDTO · CollectionCaseResponseDTO
                                         UpdateCollectionCaseDTO
  Core/Fines/DTOs/                       FineEvidenceResponseDTO · PropertyFineResponseDTO
                                         RegulationArticleResponseDTO · UpdatePropertyFineDTO
                                         UpdateRegulationArticleDTO
  Core/Invoices/DTOs/                    InvoiceResponseDTO
  Core/LateFees/DTOs/                    LateFeePolicyResponseDTO · UpdateLateFeePolicyDTO
  Core/Notifications/DTOs/               NativeCollectionNotificationSettingsResponseDTO
  Core/Payments/DTOs/                    PendingChargeDTO
  Core/Statements/DTOs/                  LedgerEntryDTO
  Core/Templates/DTOs/                   ChargeTemplateResponseDTO · UpdateChargeTemplateDTO
  ```

- **Impacto:** contrato inconsistente con el resto del sistema.
- **Riesgo:** medio-alto por volumen.
- **Recomendacion:** herencia mecanica por subdominio, un subdominio por PR.
- **Estatus:** abierto

---

#### A-02 · Reincidencia de "1 archivo = 1 DTO" dentro de archivos de interfaz

- **Evidencia:**

  | Archivo | DTOs embebidos |
  |---|:--:|
  | `Core/Members/Interfaces/IPropertyMemberService.cs:77,105,149,165,184,193` | **6** |
  | `Core/Templates/Interfaces/IChargeTemplateAppService.cs:28,48` | 2 |
  | `Core/Ledger/Interfaces/ILedgerIntegrityService.cs:32,43` | 2 |
  | `Core/Approvals/Interfaces/IFinancialApprovalService.cs` | 2 |
  | `Core/Ledger/Interfaces/ILedgerService.cs` | 1 |
  | `Core/PeriodClosures/Interfaces/IPeriodClosureService.cs` | 1 |
  | `Core/Audit/Interfaces/IFinancialAuditService.cs` | 1 |
  | `Core/Approvals/EndPoints/AdjustmentsEndPoints.cs` | 1 |

- **Hallazgo:** la Fase 4 del plan anterior limpio los archivos `*DTOs.cs`, pero
  el barrido no cubrio DTOs escondidos en archivos de interfaz y de endpoint.
- **Impacto:** la regla critica sigue incumplida, ahora en otro lugar.
- **Riesgo:** medio-alto.
- **Estatus:** abierto

---

#### A-03 · La bitacora de auditoria financiera casi no se escribe

- **Evidencia:**
  `IFinancialAuditService` se inyecta solo en
  `Core/Ledger/Services/LedgerIntegrityService.cs` y
  `Core/Notifications/Services/CobranzaNativaNotificationService.cs`
  No se inyecta en `CobranzaPaymentAppService`, `ChargeAppService`,
  `AdjustmentService`, `PaymentAllocationService` ni `PeriodClosureService`
- **Hallazgo:**
  los flujos que mas importa auditar —registrar pago, cancelar pago, crear
  cargo, ajustar, cerrar periodo— **no registran nada** en la bitacora.
- **Impacto:**
  la pantalla `/cobranza-nativa/audit` funciona pero muestra casi nada. El
  modulo se declara "subsistema financiero auditable" sin auditoria efectiva.
- **Riesgo:** alto.
- **Estatus:** abierto

---

#### A-04 · 15 capacidades construidas en backend sin puerta de entrada

- **Evidencia:** endpoints existentes que ningun componente invoca:

  | Endpoint | Capacidad perdida | Prioridad |
  |---|---|:--:|
  | `POST cobranza/adjustments` | Ajuste financiero sobre cargo | Alta |
  | `POST cobranza/adjustments/credit-notes` | Nota de credito formal | Alta |
  | `POST cobranza/adjustments/credit-notes/{id}/cancel` | Cancelar nota de credito | Media |
  | `POST cobranza/approvals` | Crear solicitud de aprobacion | Alta |
  | `POST cobranza/approvals/{id}/cancel` | Cancelar solicitud | Media |
  | `GET cobranza/approvals/property/{id}/customer/{id}` | Aprobaciones por propiedad | Baja |
  | `POST cobranza/collection-cases` | Crear caso de cobranza legal | Alta |
  | `PUT cobranza/collection-cases/{id}` | Editar caso | Media |
  | `POST cobranza/property-fines/{id}/evidences` | Adjuntar evidencia | Media |
  | `DELETE cobranza/property-fines/evidences/{id}` | Eliminar evidencia | Baja |
  | `POST cobranza/invoices` · `POST .../{id}/cancel` | Generar / cancelar CFDI | Alta |
  | `POST cobranza/notifications/receipts/{id}/send` | Enviar recibo de pago | Media |
  | `POST cobranza/ledger/integrity/customer/{id}` | Verificar integridad del ledger | Media |
  | `GET cobranza/ledger/charge/{id}/balance` · `batch/{id}` | Trazabilidad fina | Baja |
  | `POST cobranza/property-members/migrate-from-legacy/customer/{id}` | Migrar personas legacy | Alta |

- **Hallazgo:** ~15 endpoints con logica de negocio real quedaron sin conectar.
- **Impacto:** no es deuda de backend, es **deuda de cableado frontend** — mucho
  mas barata de cerrar que reconstruir.
- **Riesgo:** alto por acumulacion de trabajo invisible.
- **Estatus:** abierto

---

#### A-05 · Doble modelo de personas conviviendo sin migracion ejecutada

- **Evidencia:**
  `Core/Members/Services/PropertyMemberService.cs:494,572-616` —
  `MigrateFromLegacyAsync` lee `Owner` y `PropertyOccupant` y mapea
  `OccupantType` → `MemberRole`
  `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs:7` — `api/owners` con
  CRUD completo, vivo
  `OperationsLuxuryApp/PropertyOccupant/EndPoints/PropertyOccupantEndpoints.cs:7`
  — `api/property-occupant` con CRUD completo, vivo
  El endpoint `migrate-from-legacy` **no lo invoca ninguna pantalla**
- **Hallazgo:**
  `PropertyMember` nacio para sustituir a `Owner` + `PropertyOccupant`, pero las
  tres tablas conviven y la migracion nunca se ejecuto.
- **Escenario de falla concreto:**
  `IsFinancialResponsible` —quien responde ante el ledger— **solo existe en
  `PropertyMember`**. Un condominio que no migro tiene sus propiedades sin
  responsable financiero definido, y con el quedan sin destinatario los avisos
  de cobro y la imputacion de cargos.
- **Impacto:** ambiguedad de ownership de datos entre tres modulos.
- **Riesgo:** alto. **Excede el alcance de CobranzaNativa**: involucra a
  `OperationsLuxuryApp` y `resident.luxuryapp`.
- **Recomendacion:** decision de arquitectura, no de codigo → `RN-CN-033`.
- **Estatus:** abierto

---

### 3. Deuda tecnica

| Id | Hallazgo | Evidencia | Riesgo |
|---|---|---|:--:|
| D-01 | 99 valores hex hardcodeados y uso extendido de utility classes PrimeFlex, contra la Regla Critica de Tokens CSS | `cobranza-nativa-groups.const.ts` (23), `system-flow-map.scss` (22), `cobranza-nativa-wrapper.ts` (16), `.scss` (15) | Medio |
| D-02 | 55 usos de `DateTime.UtcNow`/`DateTime.Now` en 21 archivos, **0** adopcion de `TimeProvider` | barrido en los 17 subdominios | Medio |
| D-03 | Los 4 jobs de `automated-services` solo se disparan a mano; no existe Hangfire, `IHostedService` ni `BackgroundService` | `core/automated-services/automated-services.html:169` declara *"Infraestructura lista, pendiente de activar"* | Medio |
| D-04 | Sin validadores formales: **0** `AbstractValidator` / `IValidator` en el modulo | barrido backend completo | Medio |
| D-05 | 4 usos residuales de `Results.*` donde el resto del modulo usa `TypedResults.*` (117) | `WebhooksEndPoints.cs:22,24`, `NativeStatementsEndpoints.cs:18,25` | Bajo |
| D-06 | Sin variantes `desktop/` ni `mobile/` propias; toda la estrategia mobile descansa en `app-data-view-mobile` (16 usos) | estructura del modulo | Medio |

---

### 4. Riesgo de ruptura por shared o contrato

---

#### S-01 · Aliases legacy de endpoints siguen vivos (reincidencia)

- **Evidencia:**
  `client/angular/src/app/core/constants/endpoints/cobranza.endpoints.ts:399-418`
  expone simultaneamente `CobranzaCore`, `CobranzaNative`, `NativeCollection`,
  `LegacyCollection`, `CobranzaLive`, `CobranzaLocal`
- **Hallazgo:** sigue abierto desde el corte anterior. Tres alias apuntan al
  mismo objeto `cobranzaNativeEndpoints`.
- **Riesgo:** medio-alto. Es contrato transversal frontend, fuera del modulo.
- **Estatus:** abierto desde 2026-07-31

---

#### S-02 · Documentacion que sigue publicando el contrato viejo

- **Evidencia:**
  `Docs/reglas-negocio-cobranza.md` — unico archivo del repositorio que aun
  menciona `api/accounting-coi/native-collection/*`; la ruta real es
  `api/cobranza/*`
  `conventions/modules/cobranza-nativa-module-conventions.md:170` — el
  documento rector del modulo repite el mismo contrato viejo
  Mismo documento, linea 235 — declara
  `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md` como *"no localizado
  actualmente"*, pero **el archivo si existe** en
  `client/angular/.../cobranza-nativa/docs/`
- **Hallazgo:** el codigo esta bien; **la documentacion rectora es la que
  quedo mal**. Un agente que siga el orden de lectura obligatorio recibe hoy un
  contrato inexistente.
- **Riesgo:** medio-alto: induce remediaciones contra un contrato falso.
- **Estatus:** abierto desde 2026-07-31

---

## Parte III. Matriz de reglas de negocio

Clasificacion en 4 niveles segun `plan-creation-protocol.md §0.2`.

**Leyenda de estatus:**

| Estatus | Significado |
|---|---|
| 🟢 Vigente | Declarada en documentacion **y** verificada en codigo |
| 🟡 Sin declarar | Implementada en codigo pero **ausente** de la documentacion de reglas |
| 🔴 Incumplida | Declarada como obligatoria pero **no se ejerce** en el flujo real |
| ⚪ Por especificar | Falta definicion; **requiere decision de negocio antes de codificar** |

### Nivel 1 · Invariantes de dominio

| ID | Regla | Estatus | Evidencia |
|---|---|:--:|---|
| RN-CN-001 | No se permite cruzar `CustomerId` ni `PropertyId` entre cargos, pagos, asignaciones, miembros, expedientes, auditoria y ledger | 🟢 Vigente | `PaymentAllocationService.cs:123-145` rechaza con mensaje explicito |
| RN-CN-002 | Toda operacion financiera relevante deja trazabilidad en el ledger; prohibida la mutacion silenciosa de saldos | 🟢 Vigente | `ILedgerService` consumido por 8 servicios |
| RN-CN-003 | Los cierres de periodo son vinculantes: sin eventos retroactivos ni reaperturas fuera de flujo | 🟢 Vigente | `LedgerService` consulta `IPeriodClosureService` **antes de escribir** — validacion en la capa correcta |
| RN-CN-004 | Un ajuste no puede dejar el cargo con importe negativo | 🟡 Sin declarar | `AdjustmentService.cs:36-38` |
| RN-CN-005 | No se ajusta un cargo en estado terminal `Pagado` | 🟡 Sin declarar | `AdjustmentService.cs:25-27` |
| RN-CN-006 | Una condonacion exige `AuthorizedBy` con nombre del autorizante | 🟡 Sin declarar | `AdjustmentService.cs:29-33` — **evadida** en la practica por C-05 |
| RN-CN-007 | Solo puede haber un responsable financiero activo por propiedad | 🟡 Sin declarar | `PropertyMemberService.cs:268-270` `RevocarResponsableFinancieroPrevioAsync` |

### Nivel 2 · Flujo y estados

| ID | Regla | Estatus | Evidencia |
|---|---|:--:|---|
| RN-CN-010 | Idempotencia en generacion de cargos, por plantilla + propiedad + periodo | 🟢 Vigente | `ChargesGeneratorService.cs:73-76,205-212` |
| RN-CN-011 | Idempotencia en aplicacion de pagos | 🔴 **Incumplida** | Guarda condicional a `IdempotencyKey`; el frontend nunca la envia → **C-03** |
| RN-CN-012 | Idempotencia en recalculo de recargos | 🟢 Vigente | `LateFeeCalculatorService.cs:48` por `OriginalChargeId` + `DueDate` |
| RN-CN-013 | Maker-checker obligatorio en ajustes, condonaciones, reaperturas y anulaciones | 🔴 **Incumplida** | Ningun servicio invoca `IFinancialApprovalService` → **C-04** |
| RN-CN-014 | **¿Que operaciones exactamente requieren aprobacion?** La documentacion dice *"donde aplique"*, que no es especificacion | ⚪ Por especificar | — |
| RN-CN-015 | **¿Existe umbral de monto que dispare la aprobacion?** ¿O toda condonacion la requiere sin importar el importe? | ⚪ Por especificar | — |
| RN-CN-016 | **¿La nota de credito es un pago o un ajuste?** Hoy el codigo hace ambas cosas segun el camino | ⚪ Por especificar | Decision contable, no tecnica → **C-05** |
| RN-CN-017 | **¿Un pago cancelado revierte los recargos ya generados sobre los cargos que liquido?** | ⚪ Por especificar | No hay logica ni documentacion |

### Nivel 3 · Seguridad y autorizacion

| ID | Regla | Estatus | Evidencia |
|---|---|:--:|---|
| RN-CN-020 | Solo perfiles financieros operan el modulo | 🔴 **Incumplida** | 20 de 21 grupos sin politica → **C-02** |
| RN-CN-021 | **¿Que perfil puede cerrar periodo, aprobar y reabrir?** La politica `"Finanzas"` incluye `Asistente`, lo que probablemente es demasiado amplio para estas operaciones | ⚪ Por especificar | `DependencyInjection.Authorization.cs:74-83` |
| RN-CN-022 | Toda operacion financiera deja registro en la bitacora de auditoria | 🔴 **Incumplida** | `IFinancialAuditService` ausente de los flujos criticos → **A-03** |
| RN-CN-023 | El webhook de pasarela valida criptograficamente al emisor | 🔴 **Incumplida** | Validacion declarada como simulacion → **C-01** |
| RN-CN-024 | Nunca exponer rutas fisicas del servidor al frontend | 🔴 **Incumplida** | `StoragePath = fullPath` → **C-06** |
| RN-CN-025 | **¿Un condomino puede consultar su propio estado de cuenta desde este modulo?** Hoy no hay politica que lo distinga de un operador | ⚪ Por especificar | — |

### Nivel 4 · Validacion de datos

| ID | Regla | Estatus | Evidencia |
|---|---|:--:|---|
| RN-CN-030 | Los DTOs con `Id` heredan de `GuidIdEntityDTO` | 🔴 **Incumplida** | 24 DTOs → **A-01** |
| RN-CN-031 | Validacion formal de entrada por DTO | ⚪ Por especificar | 0 validadores en el modulo → **D-04** |
| RN-CN-032 | **¿Como se redondea la cuota calculada por indiviso?** No hay `Math.Round` explicito en `ChargesGeneratorService`; el redondeo queda al tipo `decimal` | ⚪ Por especificar | Contraste: `CobranzaOnline` si fija `MidpointRounding.AwayFromZero` |
| RN-CN-033 | **¿`PropertyMember` sustituye a `Owner` + `PropertyOccupant`, o convive con ellos como capa financiera?** | ⚪ Por especificar | Decision transversal → **A-05** |

### Resumen de la matriz

| Estatus | Cantidad | Accion |
|---|:--:|---|
| 🟢 Vigente | 5 | Preservar. Documentar como criterio de no-regresion. |
| 🟡 Sin declarar | 4 | **Liberar**: elevarlas a `reglas-negocio-cobranza-nativa.md`. No requieren codigo. |
| 🔴 Incumplida | 7 | Remediar. Cada una tiene hallazgo asociado. |
| ⚪ Por especificar | 8 | **Requieren decision de negocio antes de planificar codigo.** |

---

## Casos negativos auditados

- escritura financiera sin autenticacion (webhook)
- endpoints financieros sin politica de rol
- invariante declarada obligatoria sin ejercerse (idempotencia, maker-checker)
- control construido y desconectado (aprobaciones, auditoria, ajustes)
- operacion contable que evade su propio servicio de validacion (nota de credito)
- ruta fisica de disco en contrato publico
- capacidad fiscal simulada expuesta como funcional
- doble modelo de datos maestros sin migracion ejecutada

---

## Impacto global

| Dimension | Nivel |
|---|:--:|
| **Seguridad** | **critico** |
| **Integridad financiera** | **critico** |
| Operacion | media |
| Arquitectura | media (mejoro desde el corte anterior) |
| Contratos | alta |
| Mantenibilidad | media |
| Riesgo de regresion | medio |

---

## Conclusiones

1. **El trabajo estructural del corte anterior se cerro y no debe repetirse.**
   Frontera frontend, contratos del `core/`, endpoints delgados, tipado y
   pruebas base estan resueltos y verificados.

2. **El riesgo se movio de arquitectura a seguridad e integridad financiera.**
   Los siete hallazgos criticos de este corte son todos de esa naturaleza. Dos
   de ellos —C-01 y C-02— permiten escritura financiera sin control efectivo y
   deben cerrarse antes que cualquier funcionalidad nueva.

3. **El modulo no incumple por falta de codigo, sino por falta de cableado.**
   Maker-checker, auditoria, ajustes, notas de credito y migracion de personas
   existen y funcionan; nadie los llama. Cerrar esa brecha es
   significativamente mas barato que construir.

4. **Ocho reglas de negocio no pueden resolverse en codigo.** Requieren decision
   del area financiera antes de planificar implementacion: que operaciones
   requieren aprobacion, bajo que umbral, como se clasifica contablemente una
   condonacion, quien puede cerrar periodo, y si `PropertyMember` sustituye o
   convive con el modelo legacy de personas.

5. **La documentacion rectora del modulo es hoy menos confiable que su codigo.**
   `cobranza-nativa-module-conventions.md` publica un contrato de rutas que no
   existe y declara como "no localizado" un documento que si existe.

**Siguiente paso obligatorio:** ejecutar
`docs/plans/20260811-cobranza-nativa-reactivacion-plan.md`, que absorbe los
residuales del plan `20260731` y organiza estos hallazgos por fases.
