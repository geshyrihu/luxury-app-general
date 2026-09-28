# Auditoria Completa - CobranzaNativa

**Fecha:** 2026-07-31
**Estado:** Requiere plan de migracion
**Modulo:** `CobranzaNativa`
**Backend:** `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa`
**Frontend:** `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa`
**Documento rector:** `conventions/modules/cobranza-nativa-module-conventions.md`
**Plan asociado:** `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`

---

## Resumen ejecutivo

`CobranzaNativa` conserva una base funcional amplia y una cobertura backend
relevante en pruebas, pero el modulo todavia no cumple de forma estricta la
frontera, los contratos ni la estructura exigida por el sistema rector
actualizado al 2026-07-30.

El riesgo principal no esta en un bug aislado, sino en la convivencia de cuatro
problemas estructurales:

- el frontend sigue escapando de su bounded context
- el `core/` sigue consumiendo contratos de compatibilidad externa
- el backend mezcla endpoints delgados con endpoints que operan directo sobre
  `ApplicationDbContext` y hasta exponen entidades de persistencia
- la documentacion viva del modulo publica rutas y supuestos que ya no coinciden
  con el codigo real

Resultado formal de este corte: **requiere plan de migracion**.

---

## Alcance auditado

- backend `Core/` completo:
  `Approvals`, `Audit`, `Charges`, `ChargeTypes`, `CollectionCases`, `Fines`,
  `Invoices`, `LateFees`, `Ledger`, `Members`, `Metrics`, `Notifications`,
  `Payments`, `PeriodClosures`, `Reconciliation`, `Statements`, `Templates`
- backend `Contracts/ExternalCompatibility`
- frontend `entry/`, `core/`, `configuration/`, `contracts/`, `interfaces/`,
  `onboarding/`, `docs/`
- documentacion tecnica y operativa del modulo
- pruebas existentes del backend bajo
  `api/LuxuryApp.Tests/Application/Modules/Contabilidad/CobranzaNativa`

No se modifico codigo durante esta auditoria.

---

## Reglas criticas detectadas

- No cruzar `CustomerId` ni `PropertyId` entre cargos, pagos, miembros y casos.
- No permitir que el core nativo dependa de `Aspel`, `COI`, `Live`, `Local` u
  `Online` como motor operativo diario.
- No bypass de ledger, cierres de periodo ni maker-checker.
- No romper contratos publicos sin plan aprobado.
- No usar `core/` para consumir contratos de compatibilidad externa salvo
  frontera temporal controlada.

---

## Hallazgos

### 1. Incumplimiento critico

**Frontera frontend rota por consumo directo de otra app**

- Evidencia:
  `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/cobranza-nativa.routing.ts:113-115`
- Hallazgo:
  la ruta `properties` de `CobranzaNativa` carga
  `resident.luxuryapp/property/propiedades-list` en lugar de una pieza propia o
  encapsulada del modulo.
- Impacto:
  rompe bounded context, mezcla ownership funcional y reintroduce dependencias
  silenciosas entre apps.
- Riesgo:
  alto riesgo de drift de permisos, DTOs, UX y futuros cambios fuera del dominio
  `CobranzaNativa`.
- Recomendacion:
  encapsular esa capacidad dentro del modulo o moverla formalmente a una
  frontera documentada con adaptador explicito.
- Estatus:
  abierto

**El core frontend sigue consumiendo contratos de compatibilidad externa**

- Evidencia:
  `core/charges/charge-form.ts:24`
  `core/payments/payment-form.ts:16`
  `core/charges/charge-list.ts:41`
  `core/payments/payment-list.ts:31`
  `core/charges/bulk-import-modal.ts:16`
  `core/initial-balance/initial-balance.ts:27`
- Hallazgo:
  pantallas operativas del `core/` siguen importando DTOs desde
  `contracts/external-compatibility/interfaces/*`.
- Impacto:
  el dominio nativo no esta realmente separado; el cambio de un contrato
  temporal puede romper cargos, pagos y saldos iniciales del flujo diario.
- Riesgo:
  ruptura por contrato y recontaminacion del core.
- Recomendacion:
  mover el consumo del `core/` a contratos nativos propios y dejar
  `external-compatibility` solo en frontera.
- Estatus:
  abierto

**Deriva mayor entre documentacion contractual y rutas reales**

- Evidencia:
  `api/.../Docs/reglas-negocio-cobranza-nativa.md:155-171`
  `api/.../Docs/reglas-negocio-cobranza-nativa.md:195`
  `client/angular/src/app/core/constants/endpoints/cobranza.endpoints.ts:126-241`
  `api/.../Core/*/EndPoints/*.cs` con base `api/cobranza/*`
- Hallazgo:
  la documentacion publica del modulo sigue declarando
  `api/accounting-coi/native-collection/*`, mientras front y back consumen y
  exponen `api/cobranza/*`.
- Impacto:
  la documentacion ya no es contrato confiable para integracion, auditoria ni
  soporte.
- Riesgo:
  ruptura externa y decisiones de remediacion tomadas contra un contrato viejo.
- Recomendacion:
  inventariar consumidores, definir contrato vigente y actualizar o degradar la
  documentacion legacy de inmediato.
- Estatus:
  abierto

### 2. Incumplimiento alto

**Endpoints del modulo siguen metiendo logica de negocio y acceso directo a DB**

- Evidencia:
  `api/.../Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs:10,53,98,143`
- Hallazgo:
  `CollectionCasesEndpoints` usa `ApplicationDbContext` directo, hace queries,
  mapea responses y persiste entidades desde el endpoint.
- Impacto:
  rompe la separacion endpoint-servicio, complica pruebas, repite logica y hace
  mas fragil la gobernanza del modulo.
- Riesgo:
  alto en mantenimiento y consistencia transaccional.
- Recomendacion:
  mover la logica a servicio de aplicacion y dejar el endpoint como capa thin.
- Estatus:
  abierto

**Ledger expone entidades de persistencia en contrato publico**

- Evidencia:
  `api/.../Core/Ledger/EndPoints/LedgerEndPoints.cs:25-39`
- Hallazgo:
  los endpoints de ledger retornan
  `ApiResponseDTO<List<FinancialLedgerEntry>>` en lugar de DTO explicito.
- Impacto:
  el contrato publico queda acoplado a la entidad EF.
- Riesgo:
  alto por ruptura futura en serializacion, seguridad y evolucion del modelo.
- Recomendacion:
  introducir DTOs locales del modulo para ledger y dejar de exponer entidades.
- Estatus:
  abierto

**DTOs locales agrupados en multiples archivos contra la regla 1 archivo = 1 DTO**

- Evidencia:
  `Core/Approvals/DTOs/AdjustmentDTOs.cs`
  `Core/Charges/DTOs/InitialBalanceDTOs.cs`
  `Core/ChargeTypes/DTOs/ChargeTypeCatalogDTOs.cs`
  `Core/CollectionCases/DTOs/CollectionCaseDTOs.cs`
  `Core/Fines/DTOs/PropertyFineDTOs.cs`
  `Core/Invoices/DTOs/InvoiceDTOs.cs`
  `Core/Statements/DTOs/NativeStatementResponseDTO.cs`
  y otros archivos detectados en el barrido.
- Hallazgo:
  al menos 14 archivos DTO contienen entre 2 y 5 tipos publicos.
- Impacto:
  baja navegabilidad, mayor conflicto en PR y auditoria contractual difusa.
- Riesgo:
  medio-alto.
- Recomendacion:
  separar DTO por archivo en fases controladas.
- Estatus:
  abierto

**Formularios editables del frontend siguen con `any` en flujos criticos**

- Evidencia:
  `configuration/billing-config/billing-config-modal.ts:85,90`
  `core/charges/charge-form.ts:77-78,172,179,194`
  `core/payments/payment-form.ts:109,116`
  `core/members/member-form.ts:150`
  `core/charge-templates/charge-template-form.ts:212`
- Hallazgo:
  `create/edit/loadData` de cargos, pagos, miembros, configuracion y plantillas
  siguen apoyandose en `any`.
- Impacto:
  el modulo no garantiza que `onLoadData -> patchValue -> render` use contrato
  tipado estable.
- Riesgo:
  alto en edicion, selects y adapters `@ui/*`.
- Recomendacion:
  tipar responses y opciones de seleccion por subdominio.
- Estatus:
  abierto

**La documentacion de reportes contradice la frontera vigente del modulo**

- Evidencia:
  `api/.../Docs/documentacion-logica-reportes-cobranza.md:9,15,18,64,80`
- Hallazgo:
  el documento afirma que el modulo se conecta directamente a Aspel COI para
  operar reportes, mientras la frontera vigente del modulo lo clasifica como
  core nativo con compatibilidad externa separada.
- Impacto:
  genera dos narrativas tecnicas incompatibles dentro de la misma carpeta `Docs`.
- Riesgo:
  medio-alto para arquitectura y nuevas remediaciones.
- Recomendacion:
  reclasificar ese documento como historico controlado o reescribirlo contra la
  frontera vigente.
- Estatus:
  abierto

### 3. Deuda tecnica

**No existen pruebas frontend del modulo**

- Evidencia:
  `0` archivos `*.spec.ts` dentro de
  `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa`
- Hallazgo:
  el modulo no tiene cobertura frontend local para create/edit/loadData,
  wrappers, listados ni modales.
- Impacto:
  cada refactor del modulo se valida casi solo por uso manual.
- Riesgo:
  medio.
- Recomendacion:
  crear bateria minima por formularios y listados criticos.
- Estatus:
  abierto

**La cobertura mobile declarada no se refleja en piezas propias del modulo**

- Evidencia:
  no se detectaron archivos `*mobile*.ts` ni `*mobile*.html` dentro del modulo,
  mientras la documentacion tecnica declara cobertura mobile especifica para
  varias vistas.
- Hallazgo:
  la estrategia mobile documentada no es trazable a implementaciones dedicadas
  en el modulo actual.
- Impacto:
  la auditoria de desktop/mobile no puede cerrarse con certeza solo desde la
  estructura real.
- Riesgo:
  medio.
- Recomendacion:
  documentar la estrategia real vigente o materializar las variantes mobile
  faltantes por subdominio.
- Estatus:
  abierto

**Uso extendido de `DateTime.UtcNow` dentro del core**

- Evidencia:
  barrido positivo en servicios de `Approvals`, `Audit`, `Charges`,
  `CollectionCases`, `Fines`, `Invoices`, `LateFees`, `Ledger`, `Members`,
  `Metrics`, `Notifications`, `Payments`, `PeriodClosures`, `Statements`
- Hallazgo:
  el modulo depende fuertemente de reloj estatico en servicios de negocio.
- Impacto:
  baja testabilidad temporal y reglas de fecha no aisladas.
- Riesgo:
  medio.
- Recomendacion:
  migrar gradualmente a `TimeProvider` en flujos de negocio.
- Estatus:
  abierto

### 4. Mejora recomendada

**El wrapper principal sigue abriendo configuracion de facturacion como CTA central**

- Evidencia:
  `entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper.ts:128-135`
- Hallazgo:
  aunque ya se bajo el protagonismo de Aspel, el wrapper sigue exponiendo
  `BillingConfigModal` como accion principal visible.
- Impacto:
  mantiene peso conceptual de compatibilidad temporal en la puerta del modulo.
- Riesgo:
  bajo-medio.
- Recomendacion:
  dejar la configuracion en bloque secundario y priorizar flujos core.
- Estatus:
  abierto

### 5. Riesgo de ruptura por shared o contrato

**Aliases y nombres legacy de endpoints siguen vivos junto al nombre canonico**

- Evidencia:
  `client/angular/src/app/core/constants/endpoints/cobranza.endpoints.ts`
  expone `CobranzaCore`, `CobranzaNative`, `NativeCollection`,
  `CobranzaLive`, `CobranzaLocal`, `AspelCobranza`.
- Hallazgo:
  el archivo de endpoints sigue sosteniendo varias taxonomias para el mismo
  dominio.
- Impacto:
  hace facil que nuevos consumidores vuelvan a crecer contra alias o dominios
  historicos.
- Riesgo:
  medio-alto por contrato transversal frontend.
- Recomendacion:
  congelar aliases legacy y dejar una sola entrada canonica para crecimiento.
- Estatus:
  abierto

---

## Casos negativos auditados

- mezcla de bounded context entre apps
- mezcla de contratos nativos con compatibilidad externa
- edicion con responses `any`
- publicacion de entidades EF en endpoints
- drift entre documentacion y rutas reales
- ausencia de pruebas frontend

---

## Impacto global

- **Operacion:** media
- **Arquitectura:** alta
- **Contratos:** alta
- **Mantenibilidad:** alta
- **Riesgo de regresion:** alto

---

## Conclusiones

- El modulo no debe seguir recibiendo remediaciones aisladas sin cerrar primero
  frontera, contratos y DTOs.
- El plan del 2026-07-30 sigue siendo util como base, pero ya necesita
  precision ejecutable contra los hallazgos reales de este corte.
- El siguiente paso correcto no es codificar al azar, sino ejecutar el plan por
  fases adjunto.

