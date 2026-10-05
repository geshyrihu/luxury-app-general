# Cobranza Nativa - Plan Completo de Ejecucion para Separacion

Fecha de actualizacion: 2026-07-26
Estado: En ejecucion por fases
Alcance: Solo backend `CobranzaNativa` y frontend `cobranza-nativa`

## Tablero de avance

- [x] Fase 0 - Frontera congelada y documentada
- [x] Fase 1 - Inventario ejecutable y clasificacion por grupos
- [x] Fase 2 - Reordenamiento fisico base backend/frontend sin cambio funcional
- [x] Fase 3 - Encapsulacion real de compatibilidad externa
- [x] Fase 4 - Limpieza inicial del wrapper y arquitectura visual
- [x] Fase 5 - Limpieza semantica y documental
- [x] Fase 6 - Endurecimiento de reglas para evitar recontaminacion
- [x] Fase 7 - Auditoria operativa de consumos permitidos y prohibidos

## Estado actual auditado

- Backend `CobranzaNativa` ya fue reordenado por subdominios principales dentro de `Core/` y `Contracts/ExternalCompatibility/`.
- Los remanentes de backend (`BulkChargeImport`, `FeePreview`, `InitialBalance` y `Webhooks`) ya fueron absorbidos en `Core/Charges` y `Core/Payments`.
- Frontend `cobranza-nativa` ya separo `entry/`, `configuration/`, `contracts/`, `core/`, `onboarding/` y `docs/`.
- El wrapper principal ya bajo el protagonismo de Aspel y reubico `billing-config` como compatibilidad temporal.
- Sigue en curso la encapsulacion final de contratos del frontend y algunos remanentes documentales del backend.
- Las pantallas funcionales del frontend ya quedaron reagrupadas fisicamente bajo `core/` sin cambiar los `path` publicos del modulo.
- En frontend, `interfaces/` queda como zona nativa del portal y `contracts/external-compatibility/` como frontera contractual externa.
- Backend verificado con `dotnet build` en verde y frontend validado a nivel TypeScript con `npx tsc -p tsconfig.app.json --noEmit`.

## Objetivo del plan

Separar completamente el bounded context de `CobranzaNativa` para que:

- opere como modulo nativo puro en su flujo diario
- deje encapsulados los contratos externos temporales
- no mezcle semantica ni estructura con `AspelCobranzaLocal`
- no mezcle semantica ni estructura con `AspelCobranzaLive`
- no mezcle semantica ni estructura con `CobranzaOnline`

Sin tocar:

- otros modulos del backend
- otras apps del frontend
- rutas o logica de `AspelCobranzaLocal`
- rutas o logica de `AspelCobranzaLive`

## Resultado esperado al terminar

### Backend

- `CobranzaNativa` queda ordenado por subdominios del core
- los contratos externos quedan aislados en una zona clara de compatibilidad
- los servicios del core ya no hablan en lenguaje Aspel/COI salvo donde sea estrictamente temporal
- la documentacion del modulo deja clara la frontera

### Frontend

- `cobranza-nativa` queda ordenado por `core`, `configuration`, `contracts`, `onboarding`
- el `wrapper` deja de mezclar el home nativo con configuracion hibrida
- las interfaces y enums de compatibilidad quedan separadas del core
- la UI deja de presentar Aspel como parte natural del flujo nativo

## Principios de ejecucion

1. Primero ordenar y etiquetar.
2. Despues mover sin cambiar comportamiento.
3. Luego encapsular contratos externos.
4. Al final limpiar lenguaje, docs y nombres.

## Fuera de alcance en esta ejecucion

No entra en este plan:

- migrar o reescribir `AspelCobranzaLocal`
- migrar o reescribir `AspelCobranzaLive`
- cambiar contratos publicos de otros modulos
- reemplazar integraciones contables reales
- rehacer toda la facturacion CFDI

## Fases del plan

### Fase 0 - Congelamiento de frontera `[x]`

Objetivo:

- validar y aprobar la frontera ya documentada
- usar esa frontera como regla para todo el refactor

Entradas:

- `Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
- `ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md`

Salida:

- decision aprobada de que `CobranzaNativa` no consumira operacion de `Live`, `Local` u `Online`

Criterio de aceptacion:

- equipo acepta la clasificacion `core`, `compatibilidad externa`, `fuera de alcance`

---

### Fase 1 - Inventario ejecutable de archivos a mover `[x]`

Objetivo:

- preparar la lista exacta de archivos que van a reordenarse
- separar lo que es cambio estructural de lo que es cambio semantico

#### Backend - grupos objetivo

`Core/Charges`

- `Services/ChargeAppService.cs`
- `Services/ChargesGeneratorService.cs`
- `DTOs/CreateChargeDTO.cs`
- `DTOs/UpdateChargeDTO.cs`
- `DTOs/ChargeResponseDTO.cs`
- `Endpoint/ChargesEndPoints.cs`

`Core/Payments`

- `Services/CobranzaPaymentAppService.cs`
- `Services/PaymentAllocationService.cs`
- `DTOs/CreateCobranzaPaymentDTO.cs`
- `DTOs/UpdateCobranzaPaymentDTO.cs`
- `DTOs/CobranzaPaymentResponseDTO.cs`
- `DTOs/ApplyPaymentToChargesDTO.cs`
- `Endpoint/CobranzaPaymentsEndPoints.cs`

`Core/Statements`

- `Services/NativeStatementService.cs`
- `Services/NativeStatementPdfExportService.cs`
- `DTOs/NativeStatementResponseDTO.cs`
- `Endpoint/NativeStatementsEndpoints.cs`

`Core/Ledger`

- `Services/LedgerService.cs`
- `Services/LedgerIntegrityService.cs`
- `DTOs/LedgerDTOs` o equivalentes
- `Endpoint/LedgerEndPoints.cs`

`Core/Approvals`

- `Services/FinancialApprovalService.cs`
- `Services/AdjustmentService.cs`
- `DTOs/AdjustmentDTOs.cs`
- `DTOs/FinancialApprovalDTOs` o equivalentes
- `Endpoint/AdjustmentsEndPoints.cs`
- `Endpoint/FinancialApprovalsEndPoints.cs`

`Core/PeriodClosures`

- `Services/PeriodClosureService.cs`
- `DTOs/PeriodClosureDTOs` o equivalentes
- `Endpoint/PeriodClosuresEndPoints.cs`

`Core/Members`

- `Services/PropertyMemberService.cs`
- `DTOs/PropertyMemberDTOs`
- `Endpoint/PropertyMembersEndPoints.cs`

`Core/Notifications`

- `Services/CobranzaNativaNotificationService.cs`
- `Services/NotificationEngineService.cs`
- `Services/NativeCollectionNotificationSettingsService.cs`
- `DTOs/NotificationSettingsDTOs.cs`
- `DTOs/NotificationOperationsDTOs.cs`
- `Endpoint/NativeCollectionNotificationsEndpoints.cs`
- `Endpoint/NotificationSettingsEndPoints.cs`

`Core/Audit`

- `Services/FinancialAuditService.cs`
- `DTOs/FinancialAuditDTOs`
- `Endpoint/FinancialAuditEndPoints.cs`

`Core/Fines`

- `Services/PropertyFineAppService.cs`
- `Services/RegulationArticleAppService.cs`
- `DTOs/PropertyFineDTOs.cs`
- `DTOs/RegulationArticleDTOs.cs`
- `Endpoint/PropertyFinesEndpoints.cs`
- `Endpoint/RegulationArticlesEndPoints.cs`

`Core/CollectionCases`

- `Services/CollectionManagerService.cs`
- `DTOs/CollectionCaseDTOs.cs`
- `Endpoint/CollectionCasesEndpoints.cs`

`Core/Reconciliation`

- `Services/ReconciliationService.cs`
- `Endpoint/ReconciliationsEndpoints.cs`

`Core/Invoices`

- `Services/InvoiceService.cs`
- `DTOs/InvoiceDTOs.cs`
- `Endpoint/InvoicesEndpoints.cs`

`Contracts/ExternalCompatibility`

- `Endpoint/BillingConfigEndPoints.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateChargeDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/ChargeResponseDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CreateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/UpdateCobranzaPaymentDTO.cs`
- `Contracts/ExternalCompatibility/DTOs/CobranzaPaymentResponseDTO.cs`
- `Contracts/ExternalCompatibility/Endpoint/BillingConfigEndPoints.cs`
- `DTOs/BillingConfigDTOs` si existen fuera del modulo
- cualquier DTO o response que exponga `CoiCobranzaAccountId`
- cualquier DTO o response que exponga `CoiPolicyId`

#### Frontend - grupos objetivo

`core`

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

`configuration`

- `billing-config`

`contracts/external-compatibility`

- `interfaces/enums.ts`
- `interfaces/billing-config.dto.ts`
- `interfaces/charge.dto.ts`
- `interfaces/cobranza-payment.dto.ts`

`onboarding`

- `system-overview`
- `system-flow-map`

`entry`

- `cobranza-nativa-wrapper`
- `cobranza-nativa.routing.ts`

Criterio de aceptacion:

- existe lista cerrada de archivos por grupo
- no aparecen archivos de otros modulos

---

### Fase 2 - Reordenamiento fisico sin cambiar comportamiento `[x]`

Objetivo:

- mover carpetas y archivos a la estructura nueva
- mantener imports, rutas y comportamiento

#### Backend

Crear esta estructura:

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
    Notifications/
    Audit/
    Fines/
    CollectionCases/
    Reconciliation/
    Invoices/
  Contracts/
    Native/
    ExternalCompatibility/
  Docs/
```

Reglas:

- primero mover servicios, DTOs y endpoints por subdominio
- dejar namespaces compatibles temporalmente si mover namespaces rompe demasiado
- no renombrar todavia contratos publicos

#### Frontend

Crear esta estructura:

```text
cobranza-nativa/
  cobranza-nativa-wrapper/
  core/
  configuration/
  contracts/
    native/
    external-compatibility/
  onboarding/
  docs/
```

Reglas:

- mantener la misma `routing` al inicio
- mover primero componentes y despues imports
- no cambiar UX todavia

Criterio de aceptacion:

- build compila igual que antes
- rutas existentes siguen funcionando
- no hay referencias nuevas a otros modulos

---

### Fase 3 - Encapsulacion real de compatibilidad externa `[~]`

Objetivo:

- aislar la compatibilidad COI/Aspel sin romper el modulo

#### Backend

Acciones:

- crear una zona `Contracts/ExternalCompatibility`
- mover ahi los DTOs con:
  `CoiCobranzaAccountId`
  `CoiPolicyId`
  `BillingMode`

- introducir wrappers semanticos si hace falta, por ejemplo:
  `ExternalChargeReference`
  `ExternalPolicyReference`
  `NativeBillingOperationMode`

- evitar que `ChargeAppService` y `CobranzaPaymentAppService` sigan exponiendo lenguaje COI de forma directa al core

Nota:

- no eliminar todavia los campos si eso rompe contrato con el front
- primero encapsular, despues evaluar deprecacion

#### Frontend

Acciones:

- mover DTOs e interfaces con `coi*` a `contracts/external-compatibility`
- mover `EBillingMode` a `contracts/external-compatibility`
- dejar el resto de enums realmente nativos en `interfaces/`

Avance actual:

- `billing-config.dto.ts`, `charge.dto.ts` y `cobranza-payment.dto.ts` ya viven en `contracts/external-compatibility/interfaces/`
- `EBillingMode` ya vive en `contracts/external-compatibility/interfaces/billing-mode.enum.ts`
- `notification-settings.dto.ts` ya vive en `interfaces/`

Criterio de aceptacion:

- el core del modulo ya no depende visualmente de archivos de compatibilidad externa
- las referencias externas quedan en una sola zona

---

### Fase 4 - Limpieza del wrapper y de la arquitectura visual `[x]`

Objetivo:

- convertir el `wrapper` en puerta arquitectonica limpia del modulo

Archivos principales:

- `cobranza-nativa-wrapper/cobranza-nativa-wrapper.ts`
- `cobranza-nativa-wrapper/cobranza-nativa-wrapper.html`
- `cobranza-nativa-wrapper/cobranza-nativa-groups.const.ts`

Cambios:

- separar bloques visuales en:
  `Core Nativo`
  `Configuracion`
  `Cobranza Extendida`
  `Onboarding`

- marcar `billing-config` como:
  `Compatibilidad temporal / configuracion`

- dejar de presentar Aspel o COI como parte del discurso central del home

- si conviene, mover el acceso a `BillingConfigModal` fuera del spotlight principal

Criterio de aceptacion:

- el wrapper comunica primero flujo nativo y despues configuracion
- no parece un modulo hibrido en su entrada principal

---

### Fase 5 - Limpieza semantica y documental `[x]`

Objetivo:

- corregir lenguaje, ayudas y documentacion para reflejar el nuevo bounded context

#### Backend docs

Intervenir:

- `Docs/documentacion-logica-reportes-cobranza.md`
- `Docs/reglas-negocio-cobranza-nativa.md`
- `Docs/reglas-negocio-cobranza.md`
- `Docs/documentacion-cuestionario-cobranza-nativa.md`

Acciones:

- marcar lo legacy como legacy
- corregir rutas o etiquetarlas como historicas
- eliminar afirmaciones donde Aspel aparezca como motor operativo diario del modulo

#### Frontend textos

Intervenir:

- `billing-config/billing-config-modal.html`
- `system-flow-map/system-flow-map.ts`
- `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`

Ejemplo de correccion:

- hoy: "Define si LuxuryApp genera cargos, o si los extrae de Aspel COI."
- futuro: "Define el modo operativo del modulo. El modo nativo es el flujo principal; cualquier compatibilidad externa se considera transicion temporal."

Criterio de aceptacion:

- el lenguaje del modulo ya no induce a pensar que depende de Aspel para operar

---

### Fase 6 - Endurecimiento de reglas para que no se vuelva a mezclar `[x]`

Objetivo:

- dejar candados arquitectonicos

Acciones sugeridas:

- agregar una seccion en docs del modulo con reglas:
  - no agregar nuevos campos `Aspel*`
  - no agregar nuevos campos `Coi*` en el core
  - no importar endpoints `CobranzaLive`, `CobranzaLocal`, `CobranzaOnline` desde `cobranza-nativa`
  - cualquier compatibilidad externa solo entra por `contracts/external-compatibility`

- si despues se desea, agregar auditoria simple via script o checklist manual

Criterio de aceptacion:

- existe una regla clara para futuras tareas del equipo

---

### Fase 7 - Auditoria operativa de consumos permitidos y prohibidos `[x]`

Objetivo:

- comprobar con evidencia local que el modulo nativo no consume operacion real de `AspelCobranzaLocal`, `AspelCobranzaLive` o `CobranzaOnline`
- dejar por escrito que piezas si conservan compatibilidad temporal

Evidencia consolidada:

- `Docs/Architecture/02-matriz-operativa-consumos-permitidos-y-prohibidos.md`
- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/02-matriz-operativa-front-cobranza-nativa.md`

Resultado auditado:

- no se detectaron referencias textuales activas a `Aspel`, `Live`, `HausLive`, `Local`, `CobranzaLive` o `CobranzaLocal` dentro del modulo nativo
- la compatibilidad visible queda concentrada en `BillingConfig`, `EBillingMode`, `CoiCobranzaAccountId` y `CoiPolicyId`

Criterio de aceptacion:

- el equipo puede identificar que entra al core, que queda encapsulado y que esta prohibido sin re-auditar el repo manualmente

## Orden recomendado de ejecucion real

1. Fase 2 backend
2. Fase 2 frontend
3. Fase 3 backend
4. Fase 3 frontend
5. Fase 4 wrapper
6. Fase 5 docs y textos
7. Fase 6 reglas finales

Motivo:

- primero movemos
- despues encapsulamos
- luego limpiamos semantica

## Riesgos principales

### Riesgo 1 - rotura de imports por movimientos fisicos

Mitigacion:

- mover por grupo
- compilar despues de cada subfase

### Riesgo 2 - confundir contrato temporal con logica externa

Mitigacion:

- no eliminar campos `Coi*` al principio
- solo encapsularlos

### Riesgo 3 - romper rutas o lazy loading del frontend

Mitigacion:

- no cambiar `path` en `routing`
- conservar nombres de componentes mientras se mueve estructura

### Riesgo 4 - mezclar refactor estructural con refactor funcional

Mitigacion:

- prohibido cambiar reglas de negocio en estas fases
- este plan es de separacion y organizacion, no de rediseño funcional

## Verificacion por fase

### Backend

- `dotnet build`
- revisar que `CobranzaNativa` compile sin tocar otros modulos

### Frontend

- build del proyecto Angular
- smoke test de rutas:
  - `/cobranza-nativa`
  - `/cobranza-nativa/charges`
  - `/cobranza-nativa/payments`
  - `/cobranza-nativa/estado-cuenta`
  - `/cobranza-nativa/approvals`
  - `/cobranza-nativa/ledger`
  - `/cobranza-nativa/period-closures`

### Revision manual

- el wrapper refleja la frontera nueva
- no aparece Aspel como flujo base del modulo
- la compatibilidad externa queda visible y separada

## Definition of done

Se considera terminada la separacion cuando:

- la estructura fisica del backend y frontend ya refleja `core` y `compatibilidad`
- no hay dependencias operativas de `Live`, `Local` u `Online` dentro del core nativo
- los contratos externos quedan encapsulados y etiquetados
- el wrapper comunica correctamente la frontera del modulo
- la documentacion ya no contradice la arquitectura objetivo

## Propuesta para el siguiente paso de ejecucion

Si este plan se aprueba, la implementacion deberia arrancar asi:

### Paso de ejecucion 1

Reordenamiento fisico minimo sin cambio funcional:

- backend:
  - crear `Core/` y `Contracts/`
  - mover primero `Charges`, `Payments`, `Statements`, `Ledger`

- frontend:
  - crear `core/`, `configuration/`, `contracts/`, `onboarding/`
  - mover primero `charges`, `payments`, `native-statement`, `approvals`, `ledger`, `period-closures`

### Paso de ejecucion 2

Encapsular contratos externos:

- mover `BillingMode`, `coiCobranzaAccountId`, `coiPolicyId`

### Paso de ejecucion 3

Limpiar wrapper y textos.

Ese orden minimiza riesgo y permite validar progreso rapido.
