# Auditoria Completa - SolicitudCompra

**Fecha:** 2026-07-30
**Modulo:** `SolicitudCompra`
**Backend:** [api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra)
**Frontend:** [client/angular/src/app/apps/supplier.luxuryapp/pr/solicitud-compra](../../../../client/angular/src/app/apps/supplier.luxuryapp/pr/solicitud-compra)
**Estado:** Auditoria completa
**Resultado formal:** Requiere plan de correccion por fases

---

## Resumen Ejecutivo

`SolicitudCompra` es un modulo de alta complejidad porque concentra CRUD base,
partidas, cotizaciones, cuadro comparativo, evidencias, PDFs, presupuesto,
presentacion para directivo, IA y vinculo con eventos de comite.

La auditoria confirma incumplimientos reales en contratos backend, estructura de
DTOs, documentacion local, typing frontend, coverage de UI/styles y ausencia de
pruebas visibles del modulo. Tambien confirma una omision importante del sistema
de auditoria: si el agente no revisa explicitamente subservicios internos como
`Detalle/` y `CotizacionProveedor/`, puede declarar el modulo como auditado
cuando en realidad solo reviso la raiz.

---

## Alcance

Se reviso:

- servicio principal, endpoints e interfaz principal
- subservicios `Detalle` y `CotizacionProveedor`
- DTOs y estructura contractual
- documentacion local del modulo
- pantallas frontend principales, detalle, modal de productos, PDF y presentacion
- UI y styles locales del feature
- presencia de pruebas visibles

---

## Hallazgos

### 1. Incumplimiento alto - contratos backend publicos siguen retornando entidades de persistencia en modulo principal y subservicios

**Evidencia**

- [ISolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Interfaces/ISolicitudCompraAppService.cs)
  expone `AddAsync` como `ApiResponseDTO<SolicitudCompra>`
- [ISolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Interfaces/ISolicitudCompraAppService.cs)
  expone `UpdateAsync` como `ApiResponseDTO<SolicitudCompra>`
- [ISolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Interfaces/ISolicitudCompraAppService.cs)
  y [ISolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Interfaces/ISolicitudCompraAppService.cs)
  exponen `UpdatePresentationSelectionAsync` y `UpdateCuadroComparativoAsync`
  devolviendo tambien `SolicitudCompra`
- [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  y [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  implementan esas respuestas con entidad directa
- [CotizacionProveedorAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/CotizacionProveedor/Services/CotizacionProveedorAppService.cs)
  [CotizacionProveedorAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/CotizacionProveedor/Services/CotizacionProveedorAppService.cs)
  y [CotizacionProveedorAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/CotizacionProveedor/Services/CotizacionProveedorAppService.cs)
  retornan `CotizacionProveedor`
- [SolicitudCompraDetalleAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Detalle/Services/SolicitudCompraDetalleAppService.cs)
  [SolicitudCompraDetalleAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Detalle/Services/SolicitudCompraDetalleAppService.cs)
  y [SolicitudCompraDetalleAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Detalle/Services/SolicitudCompraDetalleAppService.cs)
  retornan `SolicitudCompraDetalle`

**Impacto**

- expone forma de persistencia como contrato publico
- dificulta endurecer contratos, documentarlos y sincronizarlos con frontend
- el riesgo no vive solo en la raiz; se replica en subservicios internos

**Recomendacion**

- crear DTOs explicitos de salida para create/update del servicio principal,
  `Detalle` y `CotizacionProveedor`
- formalizar que la regla aplica tambien a subservicios internos del modulo

### 2. Incumplimiento alto - estructura DTO incumple `un archivo por DTO` y existe DTO con `Id` sin heredar de `GuidIdEntityDTO`

**Evidencia**

- [PaginatorPurchaseRequestProductAddDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/PaginatorPurchaseRequestProductAddDTO.cs)
  contiene `PurchaseRequestProductDTO` y `PaginatorPurchaseRequestProductAddDTO`
- [SolicitudesCompraIndexDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/SolicitudesCompraIndexDTO.cs)
  contiene `SolicitudesCompraIndexDTO` y `OrdenCompraRelacionadaDTO`
- [ComiteEventoDTO.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/ComiteEventoDTO.cs)
  declara `Id` pero no hereda de `GuidIdEntityDTO`

**Impacto**

- incumple reglas rectoras ya vigentes para DTOs locales del modulo
- baja trazabilidad contractual y consistencia entre archivos del dominio

**Recomendacion**

- separar DTOs en archivos individuales
- alinear `ComiteEventoDTO` a `GuidIdEntityDTO`

### 3. Incumplimiento alto - documentacion del modulo sigue describiendo arquitectura legacy y rutas que ya no corresponden al stack actual

**Evidencia**

- [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  y [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  siguen documentando `Controller/`
- [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  afirma que cada subservicio tiene su propio controlador
- [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  y [README-solicitud-compra.md](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Docs/README-solicitud-compra.md)
  publican rutas legacy tipo `/api/solicitudcompra`, `/api/solicitudcompradetalle`
  y `/api/cotizacionproveedor`
- [SolicitudCompraEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/EndPoints/SolicitudCompraEndPoints.cs)
  expone realmente `api/solicitud-compra`

**Impacto**

- la documentacion local no es fuente confiable para agentes ni QA
- favorece auditorias falsas positivas si alguien valida contra rutas antiguas

**Recomendacion**

- reescribir el README del modulo en terminos de `EndPoints`, rutas reales y
  estructura actual
- formalizar en auditoria que la documentacion local tambien debe marcarse como
  hallazgo si describe arquitectura o rutas legacy

### 4. Incumplimiento alto - frontend mantiene typing debil extendido en flujo principal, listado, presentacion, PDF y modales

**Evidencia**

- `solicitud-compra.ts`
  `solicitud-compra.ts`
  `solicitud-compra.ts`
  y `solicitud-compra.ts`
  usan `any` en estado principal
- `solicitud-compra-list.ts`
  `solicitud-compra-list.ts`
  y `solicitud-compra-list.ts`
  usan `signal<any[]>`, `result: any` y lectura parcial de respuesta
- `solicitud-compra-presentacion.ts`
  `solicitud-compra-presentacion.ts`
  `solicitud-compra-presentacion.ts`
  y `solicitud-compra-presentacion.ts`
  dependen ampliamente de `any` para slides, payloads y mapeos
- `pdf-solicitud-compra.ts`
  `pdf-solicitud-compra.ts`
  y `pdf-solicitud-compra.ts`
  usan `any` en armado del documento
- `producto-edit.ts`
  y `producto-edit.ts`
  mantienen `data: any` y `result: any`

**Impacto**

- TypeScript deja de proteger integraciones reales en un modulo muy sensible
- aumenta riesgo de errores silenciosos en presentacion, autorizacion y PDF

**Recomendacion**

- introducir interfaces tipadas por pantalla y por flujo
- eliminar `any` productivo de estado, responses y mapeos del modulo

### 5. Incumplimiento alto - operaciones multi-entidad y archivo/BD no muestran frontera transaccional o compensacion documentada

**Evidencia**

- [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  `DeleteSolicitudComplete` mezcla borrado de archivos, presupuestos, evidencias
  y entidad raiz
- [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  y [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  combinan filesystem y persistencia sin rollback visible
- [SolicitudCompraAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/Services/SolicitudCompraAppService.cs)
  `AnalyzeComparativeChartAsync` consume PDFs locales y un servicio IA externo
- [CotizacionProveedorAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/CotizacionProveedor/Services/CotizacionProveedorAppService.cs)
  y [CotizacionProveedorAppService.cs](../../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/SolicitudCompra/CotizacionProveedor/Services/CotizacionProveedorAppService.cs)
  hacen create/update de proveedor con archivo PDF

**Impacto**

- una falla intermedia puede dejar archivos huérfanos o estado parcial
- el modulo combina persistencia local, filesystem, ASPEL, IA y eventos

**Recomendacion**

- documentar y, en remediacion posterior, endurecer estrategia transaccional o
  de compensacion para flujos compuestos

### 6. Deuda tecnica - UI y styles del feature no se limitan a capa global y usan estilos embebidos con `::ng-deep`

**Evidencia**

- `solicitud-compra-presentacion.ts`
  declara `styles: []` embebidos en el componente
- `solicitud-compra-presentacion.ts`
  `solicitud-compra-presentacion.ts`
  `solicitud-compra-presentacion.ts`
  y `solicitud-compra-presentacion.ts`
  usan `::ng-deep`
- `product-add.ts`
  tambien usa `styles: []` embebidos

**Impacto**

- la auditoria de styles puede omitir deuda real si solo mira `src/styles`
- los overrides locales pueden crecer fuera de un control visual uniforme

**Recomendacion**

- auditar tambien estilos locales de componentes y justificar cuando se use
  `::ng-deep`
- evaluar si estos estilos deben migrar a capa controlada o wrapper UI

### 7. Deuda tecnica - no se localizaron pruebas visibles del modulo en backend ni specs frontend del feature

**Evidencia**

- no se localizaron pruebas visibles de `SolicitudCompra` bajo
  `api/LuxuryApp.Tests`
- no se localizaron archivos `*.spec.ts` ni bloques `describe/it` dentro de
  [client/angular/src/app/apps/supplier.luxuryapp/pr/solicitud-compra](../../../../client/angular/src/app/apps/supplier.luxuryapp/pr/solicitud-compra)

**Impacto**

- baja confianza para remediar un modulo con muchos subflujos y estados
- alto riesgo de regresion en listado, autorizacion, presentacion, PDF y archivos

**Recomendacion**

- agregar pruebas backend del servicio principal y subservicios
- agregar pruebas frontend para listado, detalle, presentacion y edicion de partidas

---

## Puntos Nuevos que este modulo obliga a formalizar en convenciones

- la auditoria completa debe revisar tambien subservicios o submodulos internos
  del modulo, no solo la carpeta raiz
- la documentacion tecnica local del modulo debe marcarse como incumplimiento si
  describe arquitectura, carpetas o rutas legacy
- la auditoria de UI/styles debe incluir estilos locales embebidos en
  componentes y uso de `::ng-deep`, no solo `client/angular/src/styles`
- debe formalizarse la prohibicion de `any` productivo en estado, responses y
  mapeos de features cuando el modulo requiere contrato tipado

---

## Riesgos

- **Riesgo contractual:** alto
  - retorno de entidades de persistencia en contratos publicos del modulo y sus subservicios
- **Riesgo de calidad:** alto
  - typing debil en frontend y ausencia de pruebas visibles
- **Riesgo operativo:** alto
  - flujos compuestos con archivos, IA, presupuesto y BD sin compensacion visible
- **Riesgo documental:** alto
  - README local desalineado con arquitectura y rutas reales

---

## Plan de Correccion por Fases

### Fase 1. Contratos backend y DTOs

- [ ] sustituir respuestas de entidad directa en `SolicitudCompra`, `Detalle` y `CotizacionProveedor`
- [ ] separar DTOs que comparten archivo
- [ ] alinear `ComiteEventoDTO` a `GuidIdEntityDTO`

### Fase 2. Frontend typing

- [ ] tipar `solicitud-compra.ts`
- [ ] tipar `solicitud-compra-list.ts`
- [ ] tipar `solicitud-compra-presentacion.ts`
- [ ] tipar `pdf-solicitud-compra.ts`
- [ ] tipar `producto-edit.ts` y modales auxiliares

### Fase 3. Documentacion y styles

- [ ] reescribir README local con estructura y rutas vigentes
- [ ] inventariar estilos embebidos y uso de `::ng-deep`
- [ ] decidir cuales estilos se justifican y cuales migran a capa controlada

### Fase 4. Integridad operativa y pruebas

- [ ] revisar estrategia transaccional o de compensacion para archivos + BD + servicios externos
- [ ] agregar pruebas backend
- [ ] agregar pruebas frontend de flujos criticos




