# Auditoria Completa - OrdenCompra

**Fecha:** 2026-07-30
**Modulo:** `OrdenCompra`
**Backend:** [api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra)
**Frontend:** [client/angular/src/app/apps/supplier.luxuryapp/po/purchase-order](../../../../client/angular/src/app/apps/supplier.luxuryapp/po/purchase-order)
**Estado:** Auditoria completa
**Resultado formal:** Requiere plan de correccion por fases

---

## Resumen Ejecutivo

`OrdenCompra` es un modulo de alta complejidad funcional y resulta util como
modulo detector de brechas del sistema de auditoria. La revision confirma
incumplimientos reales en contratos backend, typing frontend, estructura DTO,
documentacion y cobertura de pruebas.

Adicionalmente, este modulo revela puntos que el sistema rector de auditoria no
estaba exigiendo con suficiente precision: integridad transaccional en
operaciones multi-entidad, validacion de estado repartido entre varios forms,
signals y servicios compartidos, y auditoria de flujos multi-step con archivos,
PDFs y modales encadenados.

---

## Alcance

Se reviso:

- estructura backend
- DTOs y contratos
- endpoints y servicio principal
- estructura frontend
- wizard, modales, formularios y pantalla de detalle
- UI y estado compartido
- documentacion local del modulo
- presencia de pruebas locales

---

## Hallazgos

### 1. Incumplimiento alto - contratos backend debiles o anonimos en operaciones clave

**Evidencia**

- [IOrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Interfaces/IOrdenCompraAppService.cs)
  expone `GetForEdit(Guid id)` como `ApiResponseDTO<object>`
- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  devuelve un objeto anonimo en `GetForEdit`
- [IOrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Interfaces/IOrdenCompraAppService.cs)
  expone `CotizacionesRelacionadasAsync` como `ApiResponseDTO<List<object>>`
- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  proyecta lista anonima de objetos
- [IOrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Interfaces/IOrdenCompraAppService.cs)
  y [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  retornan entidad `OrdenCompra` en altas y variantes complejas

**Impacto**

- el contrato publico del modulo no queda tipado de forma estable
- dificulta auditoria, evolucion, documentacion y sincronizacion con frontend
- aumenta riesgo de drift en flows de edicion y creacion compleja

**Recomendacion**

- crear DTOs explicitos para `GetForEdit`, `CotizacionesRelacionadas` y
  respuestas de create/update/progressive/fuera-fondeo
- evitar `object`, listas anonimas y retorno de entidad directa en contratos
  publicos

### 2. Incumplimiento alto - multiples DTOs concentrados en un solo archivo

**Evidencia**

- [BudgetToPurchaseOrderDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/DTOs/BudgetToPurchaseOrderDTO.cs)
  contiene `BudgetToPurchaseOrderDTO` y `BudgetToPurchaseOrderDetailDTO`
- [OrdenesCompraDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/DTOs/OrdenesCompraDTO.cs)
  contiene `OrdenesCompraDTO` y `OrdenesCompraBudgetsDTO`
- [PurchaseDetailDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/DTOs/PurchaseDetailDTO.cs)
  contiene `PurchaseDetailAsyncDTO`, `PurchaseLineItemDTO` y `PurchaseBudgetDTO`

**Impacto**

- incumple la regla oficial `un archivo por DTO`
- complica trazabilidad contractual y mantenimiento del modulo

**Recomendacion**

- separar cada DTO en su propio archivo

### 3. Incumplimiento alto - typing frontend debil y extendido en pantallas principales

**Evidencia**

- `orden-compra-list.ts`
  usa `data = signal<any[]>([])`
- `orden-compra-list.ts`
  consume `.then((result: any) => {`
- `orden-compra.ts`
  usa `ordenCompra: WritableSignal<any>`
- `orden-compra.ts`
  consume `onGetItem<any>`
- `create-orden-compra.ts`
  mantiene `solicitudCompra: any`
- `create-orden-compra-wizard.ts`
  mantiene varios `signal<any>` y handlers `item: any`

**Impacto**

- baja la capacidad de detectar errores de integracion por TypeScript
- dificulta validar contratos reales en un modulo con muchos flujos cruzados

**Recomendacion**

- tipar listados, detalle, wizard, payloads intermedios y parciales del modulo
- eliminar `any` productivos del flujo principal

### 4. Incumplimiento alto - documentacion del modulo desalineada con rutas reales

**Evidencia**

- `README.md`
  documenta rutas `api/OrdenCompra/*`
- [OrdenCompraEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/EndPoints/OrdenCompraEndPoints.cs)
  expone `api/orden-compra`
- el `README` menciona rutas o formas no coincidentes como `Pagadas`,
  `PendientesPorPagar` y `GenerarOrdenCompraFijos` en shape distinto al real

**Impacto**

- la documentacion local no es autoridad confiable
- induce a agentes o QA a consumir rutas equivocadas

**Recomendacion**

- alinear `README.md` con rutas y operaciones reales del endpoint group

### 5. Incumplimiento alto - operaciones multi-entidad sin frontera transaccional explicita

**Evidencia**

- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  en `AddAsync` persiste orden y entidades hijas por fases
- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  `AddProgressiveAsync` hace multiples `SaveChangesAsync`
- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  `AddFueraFondeoAsync` persiste orden, datos pago, auth, status, detalle y
  presupuesto en fases separadas
- [OrdenCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra/Services/OrdenCompraAppService.cs)
  `CreateFromInvoicesAsync` mezcla BD, filesystem y agrupacion de facturas
  sin estrategia de rollback integral visible

**Impacto**

- si una fase intermedia falla, el modulo puede dejar estados parciales
- aumenta riesgo operativo en procesos contables y de compras

**Recomendacion**

- envolver operaciones multi-entidad en transaccion explicita o documentar
  estrategia de compensacion/rollback aprobada

### 6. Incumplimiento alto - estado critico repartido fuera del FormGroup principal

**Evidencia**

- `create-orden-compra.ts`
  usa `providerControl` y `providerId` fuera del `form`
- `create-orden-compra-wizard.ts`
  usa `providerControl`, `selectedProductControl`, `selectedAccountForAutocomplete`,
  `itemsSignal`, `uploadedFiles` y `fundingId` como estado critico externo
- el `submit` final del wizard arma payload desde varios orÃ­genes separados en
  `create-orden-compra-wizard.ts`

**Impacto**

- dificulta auditar obligatoriedad real de campos
- complica reproducir y validar integridad del payload final
- aumenta riesgo de desincronizacion entre UI, validacion y submit

**Recomendacion**

- consolidar estado critico en forms tipados o documentar explicitamente el
  contrato de estado externo y su validacion

### 7. Deuda tecnica - falta de pruebas backend visibles del modulo y cobertura frontend incompleta para su complejidad

**Evidencia**

- no se identificaron pruebas backend locales de `OrdenCompra` bajo
  `api/LuxuryApp.Tests`
- en frontend solo se observan pruebas visibles para el wizard y el detalle
  modal, no para el flujo completo de detalle, listado, pagos, facturas,
  presupuesto o PDFs

**Impacto**

- baja confianza para remediaciones en un modulo con muchos subflujos
- riesgo de regresion alto en create/edit/linking/invoices/funding

**Recomendacion**

- agregar pruebas backend y ampliar cobertura frontend por escenarios criticos

### 8. Mejora recomendada - naming y consistencia de archivos con typos visibles

**Evidencia**

- existe la ruta `orden-compra-edit-presupusto-utilizado.*` en frontend

**Impacto**

- afecta discoverability y consistencia de naming
- puede inducir errores de referencia o duplicacion futura

**Recomendacion**

- registrar el rename en plan de migracion o correccion controlada

---

## Puntos Nuevos que este modulo obliga a formalizar en convenciones

- auditar integridad transaccional de operaciones que crean o actualizan varias
  entidades y archivos en una sola accion de negocio
- auditar formularios multi-step donde el payload final se construye desde
  varios `FormGroup`, `signals`, controles sueltos y servicios de estado
- auditar modulos con doble entrada por ruta y por modal cuando comparten estado
  en servicios como `OrdenCompraService`
- auditar flujos de archivos emparejados o derivados como `PDF/XML`,
  actualizacion de facturas y generacion de PDFs
- auditar uso de IDs o defaults hardcodeados de catalogos en backend

---

## Riesgos

- **Riesgo de calidad:** alto
  - typing debil y cobertura incompleta en un modulo muy amplio
- **Riesgo operativo:** alto
  - operaciones multi-entidad sin frontera transaccional visible
- **Riesgo contractual:** alto
  - contratos `object` y retorno de entidad directa en endpoints sensibles

---

## Plan de Correccion por Fases

### Fase 1. Contratos y DTOs

- [ ] tipar `GetForEdit`
- [ ] tipar `CotizacionesRelacionadasAsync`
- [ ] dejar de retornar entidad `OrdenCompra` en contratos publicos de create/update
- [ ] separar DTOs que hoy comparten archivo

### Fase 2. Frontend typing y estado

- [ ] reemplazar `any` en listado, detalle, wizard, forms y parcials
- [ ] documentar o consolidar estado critico que hoy vive fuera del `FormGroup`
- [ ] revisar entry points duales ruta/modal y precedencia de estado compartido

### Fase 3. Integridad operativa

- [ ] revisar transaccion o compensacion en create/update progresivo/fuera-fondeo/xml
- [ ] revisar hardcodes de catalogos y defaults de pago
- [ ] validar flujo de archivos y PDFs relacionados

### Fase 4. Cobertura y documentacion

- [ ] alinear `README.md` con rutas reales
- [ ] agregar pruebas backend del modulo
- [ ] ampliar pruebas frontend sobre subflujos criticos

---

## Checklist por Tarea

- [x] se valido backend real del modulo
- [x] se valido frontend real del modulo
- [x] se reviso UI y flujo complejo del modulo
- [x] se reviso documentacion local del modulo
- [x] se identificaron brechas nuevas para convenciones
- [ ] se ejecuto remediacion
- [ ] se ejecutaron builds o tests del modulo

---

## Estatus Final de la Auditoria

`OrdenCompra` requiere remediacion por fases y sirve como modulo de referencia
para fortalecer el sistema rector de auditoria. No solo tiene hallazgos
propios; tambien evidencia reglas que el proyecto debe exigir de ahora en
adelante para modulos con wizard, archivos, PDFs, estado compartido y procesos
multi-entidad.



