# Modulo SolicitudCompra

Primer paso del ciclo de compras. El personal operativo registra una necesidad de bienes o servicios (solicitud), la enriquece con cotizaciones de hasta tres proveedores, construye un cuadro comparativo, y lo somete a autorizacion. Una vez autorizada, la solicitud puede convertirse en una Orden de Compra.

---

## Estructura del modulo

```
SolicitudCompra/
  Controller/
    SolicitudCompraController.cs
    SolicitudCompraDetalleController.cs
  Services/
    SolicitudCompraAppService.cs
  Interfaces/
    ISolicitudCompraAppService.cs
  Mapping/
    SolicitudCompraMapper.cs
  DTOs/                              (22 archivos)
  Detalle/
    Controller/  (dentro de Controller/)
    Services/
      SolicitudCompraDetalleAppService.cs
    Interfaces/
      ISolicitudCompraDetalleAppService.cs
  CotizacionProveedor/
    Controller/
      CotizacionProveedorController.cs
    Services/
      CotizacionProveedorAppService.cs
    Interfaces/
      ICotizacionProveedorAppService.cs
    DTOs/                            (8 archivos)
```

Los tres sub-servicios son autonomos. Cada uno tiene su propia interfaz, implementacion y controlador.

---

## Entidades del dominio

Las entidades viven en `LuxuryApp.Infrastructure/Data/Entities/Operaciones/SolicitudCompra/`.

### SolicitudCompra (cabecera)

| Campo | Tipo | Descripcion |
|---|---|---|
| Id | Guid | PK |
| CustomerId | Guid | Aislamiento multi-tenant |
| Folio | string | Generado automaticamente por `IGenerateFolioService` |
| FechaSolicitud | DateOnly? | Semantica: solo fecha |
| Solicita | string | Nombre/puesto del solicitante |
| EquipoOInstalacion | string | Ubicacion o equipo donde se usara el bien |
| JustificacionGasto | string | Motivo del gasto |
| Estatus | EStatusOrdenCompra | Pendiente=2, Autorizado=0, Denegado=1 |
| AutorizadaPor | EAutorizacionCuadroComparativo? | Rol que autorizo |
| FechaAutorizacion | DateOnly? | Se asigna con hora de Mexico al autorizar |
| HoraAutorizacion | TimeOnly? | Se asigna con hora de Mexico al autorizar |
| MotivoNoAutorizacion | string | Solo aplica cuando Estatus=Denegado |
| SelectedForPresentation | bool | Flag para modo presentacion al directivo |
| SortOrder | int | Orden en presentacion; se calcula como max(SortOrder)+1 al crear |
| ApplicationUserId | string | Usuario que realizo la ultima accion de autorizacion |

Relaciones: `SolicitudCompraDetalle` (1:N), `CotizacionProveedor` (1:N max 3), `SolicitudCompraEvidence` (1:N max 4), `SolicitudCompraBudget` (1:N).

### SolicitudCompraDetalle (partidas)

| Campo | Tipo | Descripcion |
|---|---|---|
| Id | Guid | PK |
| SolicitudCompraId | Guid | FK cabecera |
| ProductoId | Guid | FK catalogo de productos |
| UnidadMedidaId | Guid | FK unidades de medida |
| Cantidad | decimal(18,4) | Cantidad solicitada |
| ApplicationUserId | string | Usuario que agrego la partida |

Relacion: `CotizacionDetalle` (1:N) - una entrada por cada cotizacion de proveedor que incluya precio para esta partida.

### CotizacionProveedor

| Campo | Tipo | Descripcion |
|---|---|---|
| Id | Guid | PK |
| SolicitudCompraId | Guid | FK cabecera |
| PosicionCotizacion | int | 1, 2 o 3. Se asigna automaticamente como primera posicion libre |
| NameProvider | string | Nombre del proveedor |
| FechaCotizacion | DateOnly | Semantica: solo fecha |
| NumeroCotizacion | string | Numero de referencia del proveedor |
| FilePath | string | Nombre del archivo PDF guardado en disco |
| Garantia | string | Max 100 chars |
| Entrega | string | Max 100 chars |
| PoliticaPago | string | Max 100 chars |
| AutorizadaPor | EAutorizacionCuadroComparativo? | Rol que autorizo esta cotizacion especifica |
| ApplicationUserId | string | Usuario que registro la cotizacion |

Relaciones: `CotizacionDetalle` (1:N), `CotizacionProveedorEvidence` (1:N).

### CotizacionDetalle (precios por partida por proveedor)

| Campo | Tipo | Descripcion |
|---|---|---|
| Id | Guid | PK |
| CotizacionProveedorId | Guid | FK cotizacion |
| SolicitudCompraDetalleId | Guid | FK partida |
| Precio | decimal(18,4) | Precio unitario |
| Descuento | decimal(18,4) | Porcentaje de descuento |
| IvaAplicado | decimal(18,4) | Default 16 |
| Cantidad | decimal(18,4) | Sincronizada con la partida al guardar |
| Observaciones | string | Notas libres |

Propiedades calculadas en entidad:
- `SubTotal = (Precio * Cantidad) * (1 - Descuento / 100)`
- `Iva = SubTotal * IvaAplicado / 100`
- `Total = SubTotal + Iva`

### SolicitudCompraEvidence (fotos de la solicitud)

| Campo | Tipo | Nota |
|---|---|---|
| SolicitudCompraId | Guid | FK |
| FilePath | string | Nombre de archivo en disco |
| FileName | string | Nombre original |
| ContentType | string | Solo image/jpeg, image/jpg, image/png |
| Descripcion | string | |
| ApplicationUserId | string | |
| CreatedAt | DateTime | Timestamp UTC de auditoria |

Limite: 4 fotos por solicitud. Validado en servicio antes de guardar.

### SolicitudCompraBudget (cuentas presupuestales)

| Campo | Tipo | Nota |
|---|---|---|
| SolicitudCompraId | Guid | FK |
| FiscalYear | string | Año fiscal (max 10 chars) |
| AccountNumber | string | Numero de cuenta contable (max 30 chars) |
| AccountName | string | Descripcion de la cuenta (max 150 chars) |
| Amount | decimal(18,4) | Monto a usar de esta cuenta |
| PresupuestoMensualSnapshot | decimal(18,4) | Snapshot al momento de agregar |
| PresupuestoAnualSnapshot | decimal(18,4) | Snapshot al momento de agregar |
| GastadoEjecutadoSnapshot | decimal(18,4) | Snapshot al momento de agregar |
| GastosPendientesSnapshot | decimal(18,4) | Snapshot al momento de agregar |
| PresupuestoRestanteSnapshot | decimal(18,4) | Snapshot al momento de agregar |

Restriccion unica: `(SolicitudCompraId, AccountNumber, FiscalYear)`. No se puede agregar la misma cuenta dos veces a la misma solicitud en el mismo año.

### CotizacionProveedorEvidence (fotos por cotizacion)

Misma estructura que `SolicitudCompraEvidence` pero con FK a `CotizacionProveedorId`. Sin limite de cantidad.

---

## Servicios y logica de negocio

### SolicitudCompraAppService

Dependencias inyectadas:
- `ApplicationDbContext` - acceso a datos
- `IMapper` - mapeos AutoMapper
- `IGenerateFolioService` - genera el folio al crear
- `IFileReadPathService` - resuelve URLs publicas de archivos
- `IFileWritePathService` - resuelve rutas fisicas para guardar
- `ISecureFileStorageService` - persistencia y borrado de archivos
- `IAiAssistantService` - analisis IA del cuadro comparativo
- `IAspelQuotationService` - consulta presupuestos desde ASPEL

#### Metodos de lectura

**GetSolicitudCompraIndexDTO(customerId, estatus)**
Carga la lista filtrada por cliente y estatus. Ordenada por `SortOrder ASC`, luego `FechaSolicitud DESC`. Ademas de la cabecera, resuelve en una segunda query las ordenes de compra relacionadas (por `SolicitudCompraId`) y las incluye en `OrdenesRelacionadas`.

**GetSelectedForPresentationAsync(customerId)**
Identico al anterior pero filtra por `SelectedForPresentation = true`. Se usa para cargar el carrusel de presentacion al directivo.

**GetIdSolicitudCompraAsync(folio, customerId)**
Busqueda por folio textual. Retorna solo el `Guid` de la solicitud.

**GetSolicitudCompraIndividual(id)**
Carga la solicitud con sus partidas, productos, unidades de medida, cotizaciones y el proveedor de cada cotizacion. Usa `AsSplitQuery()`. Mapea con AutoMapper a `SolicitudCompraIndividualDTO`.

**GetSCDTO(id)**
Misma carga profunda que el anterior pero proyecta manualmente a `SCDTO`. Incluye propiedades legacy por compatibilidad: `Precio`, `Descuento`, `IvaAplicado` para posicion 1; `Precio2`, `Descuento2`, `IvaAplicado2` para posicion 2; `Precio3`, `Descuento3`, `IvaAplicado3` para posicion 3. Estas se extraen de la lista `Cotizaciones` buscando por `PosicionCotizacion`.

**GetSolicitudCompraCuadroComparativoDTOAsync(id)**
Carga la solicitud con cotizaciones, budgets, evidencias y toda la cadena de precios. Construye `SolicitudCompraCuadroComparativoDTO` que incluye:
- URLs publicas de PDFs de cotizacion (via `fileReadPathService.GetPurchaseRequestQuotationFilePath`)
- URLs publicas de evidencias (via `fileReadPathService.GetPurchaseRequestEvidenceFilePath`)
- Totales por partida para cada posicion de proveedor (`Total`, `Total2`, `Total3`)
- Snapshots del presupuesto tal como estaban al momento de agregarlos

#### Metodos de escritura

**AddAsync(dto)**
1. Mapea DTO a entidad con AutoMapper.
2. Genera folio via `generateFolioService.OnGenerateFolioSC(customerId)`.
3. Fuerza `SelectedForPresentation = false`.
4. Calcula `SortOrder` como `MAX(SortOrder) + 1` del cliente, o 0 si no hay registros.
5. Guarda y retorna la entidad.

**UpdateAsync(id, dto)**
Carga la entidad, mapea el DTO encima con AutoMapper, guarda.

**DeleteSolicitudComplete(id)**
Eliminacion en cascada manual:
1. Carga cabecera con `Evidencias` y `Budgets`.
2. Elimina archivos fisicos de evidencias del disco.
3. Elimina registros `SolicitudCompraEvidence` del contexto.
4. Elimina registros `SolicitudCompraBudget` del contexto.
5. Elimina la cabecera.
6. Nota: las `CotizacionProveedor` y sus `CotizacionDetalle` deben eliminarse por configuracion de cascada en EF o por `DeleteProvider`.

**DeleteProvider(solicitudCompraId, cotizacionProveedorId)**
Elimina un proveedor del cuadro comparativo:
1. Borra explicitamente todos los `CotizacionDetalle` relacionados (la cascada no es confiable en este punto segun comentario en codigo).
2. Borra el archivo PDF fisico si existe.
3. Borra las evidencias fisicas del directorio de la cotizacion.
4. Borra registros `CotizacionProveedorEvidence`.
5. Borra el `CotizacionProveedor`.

**UpdatePresentationSelectionAsync(id, dto)**
Activa o desactiva el flag `SelectedForPresentation`. Al activar, calcula un `SortOrder` apropiado si el actual es 0 o si ya existe otro registro con el mismo valor.

**UpdatePresentationOrderAsync(dto)**
Recibe una lista ordenada de IDs. Asigna `SortOrder = index` a cada entidad segun su posicion en la lista.

**UpdateCuadroComparativoAsync(id, dto)**
Gestiona el flujo de autorizacion:
- Si `Estatus = Autorizado`: requiere `AutorizadaPor`; registra `FechaAutorizacion` y `HoraAutorizacion` con la hora de Mexico (`DateTimeExtension.GetMexicoTime()`); limpia `MotivoNoAutorizacion`.
- Si `Estatus = Denegado`: requiere `MotivoNoAutorizacion`; limpia `AutorizadaPor` y fechas.
- Cualquier otro estatus: limpia `AutorizadaPor`, fechas y motivo.

**AddEvidenceAsync(solicitudCompraId, dto)**
1. Valida que existan menos de 4 evidencias para la solicitud.
2. Valida que el `ContentType` sea `image/jpeg`, `image/jpg` o `image/png` (via `ValidateEvidenceFile`; lanza `BusinessException` si falla).
3. Guarda el archivo en disco via `fileStorageService.SaveOrigExt` (conserva extension original).
4. Crea registro `SolicitudCompraEvidence` y retorna el DTO con la URL publica.

**DeleteEvidenceAsync(evidenceId)**
Borra el archivo fisico y luego el registro de base de datos.

**GetAvailableBudgetsAsync(solicitudCompraId)**
Delega a `aspelQuotationService.ToPurchaseOrderSelectAsync`. Usa el año de `FechaSolicitud` o el año actual de Mexico como fallback.

**AddBudgetAsync(solicitudCompraId, dto)**
1. Valida duplicado por `(AccountNumber, FiscalYear)` en los budgets existentes de la solicitud.
2. Valida `Amount > 0`.
3. Valida que `FiscalYear` sea un entero valido.
4. Consulta el estado del presupuesto en ASPEL via `aspelQuotationService.GetAccountBudgetStatusAsync`.
5. Valida que `Amount <= PresupuestoRestante`.
6. Captura snapshot de todos los campos de estado del presupuesto en el momento del registro.

**AnalyzeComparativeChartAsync(solicitudCompraId)**
1. Carga la solicitud con todas sus partidas y cotizaciones.
2. Para cada `CotizacionProveedor` extrae el texto del PDF usando `UglyToad.PdfPig`:
   - Agrupa palabras por linea usando `BoundingBox.Bottom` con tolerancia de un decimal.
   - Si el documento esta escaneado (sin texto seleccionable) devuelve una advertencia.
   - Trunca el texto a 4000 caracteres para no saturar el contexto de la IA.
3. Construye un `ComparativeChartAnalysisInputDTO` con partidas, cotizaciones y el texto de cada PDF.
4. Llama a `aiAssistantService.AnalyzeComparativeChartAsync` y retorna el resultado como `string`.

---

### SolicitudCompraDetalleAppService

Dependencias: `ApplicationDbContext`, `IMapper`, `IFileReadPathService`.

**GetProductListAddDTO(paginator, solicitudCompraId)**
Lista paginada de productos. Excluye los que ya estan en la solicitud (consulta los `ProductoId` ya agregados a la SC y los filtra con `NOT IN`). Filtra por `NombreProducto`, `Marca` o `Modelo`. Ordena por `Marca`, `NombreProducto`, `Modelo`.

**SearchToAddRequest(solicitudCompraId, param)**
Busqueda rapida (autocomplete). Filtra por texto en `NombreProducto`, `Marca` o `Modelo`. Excluye los productos ya en la solicitud. Retorna lista ordenada alfabeticamente.

**AddAsync(dto)**
Mapea y guarda un `SolicitudCompraDetalle`. No crea `CotizacionDetalle`; esos se crean al actualizar precios.

**UpdateCantidadUnidadAsync(id, dto)**
Actualiza solo `Cantidad` y `UnidadMedidaId` de la partida.

**UpdatePriceAsync(id, dto)**
Logica central del precio tri-proveedor:
1. Carga todos los `CotizacionProveedor` de la solicitud.
2. Carga los `CotizacionDetalle` existentes para esta partida.
3. Para cada posicion (1, 2, 3): si hay proveedor en esa posicion, busca o crea el `CotizacionDetalle` correspondiente y actualiza `Precio`, `Descuento`, `IvaAplicado`, `Cantidad`.
4. Si no hay proveedor en una posicion, la omite sin error.

**DeleteByIdAsync(id)**
Borra primero todos los `CotizacionDetalle` asociados a la partida (FK explicitamente), luego borra la partida.

---

### CotizacionProveedorAppService

Dependencias: `ApplicationDbContext`, `IMapper`, `ISecureFileStorageService`, `IFileWritePathService`, `IFileReadPathService`.

**GetProviders(solicitudCompraId)**
Retorna la lista de proveedores activos del catalogo (`Provider` con `Activo = true`, `NameComercial != null`, `NameProvider != null`). No filtra por los ya usados en la SC.

**GetPosicionCotizacion(solicitudCompraId, posicion)**
Busca sincrono (no async) la cotizacion en la posicion indicada. Si no existe, retorna un DTO vacio (no error). Resuelve la URL del PDF y las evidencias.

**AddAsync(dto)**
1. Valida que la solicitud no tenga ya 3 cotizaciones.
2. Determina la primera posicion libre entre {1, 2, 3}.
3. Si se adjunta archivo, valida que sea `.pdf` y lo guarda en disco.
4. Guarda la entidad con la posicion asignada automaticamente.

**UpdateAsync(id, dto)**
Actualiza `NameProvider`, `FechaCotizacion`, `NumeroCotizacion`, `Garantia`, `Entrega`, `PoliticaPago`, `AutorizadaPor`. Si se envia nuevo archivo PDF, elimina el anterior y guarda el nuevo.

**UpdateProviderAsync(id, dto)**
Similar a `UpdateAsync` pero orientado a cambiar el proveedor. Actualiza los mismos campos incluyendo el archivo PDF si se envia.

**DeleteByIdAsync(id)**
1. Elimina explicitamente todos los `CotizacionDetalle` relacionados.
2. Elimina el PDF fisico.
3. Elimina los archivos de evidencias fisicos.
4. Elimina los registros `CotizacionProveedorEvidence`.
5. Elimina el registro `CotizacionProveedor`.

**RemoveFileAsync(id)**
Borra solo el PDF fisico y limpia `FilePath` en la entidad. No elimina la cotizacion ni sus datos.

**AddEvidenceAsync / DeleteEvidenceAsync**
Mismo patron que en `SolicitudCompraAppService` pero referenciando el directorio de cotizacion del proveedor. Sin limite de cantidad de fotos.

---

## Rutas de almacenamiento de archivos

Los metodos de `IFileWritePathService` / `IFileReadPathService` usados en este modulo:

| Metodo | Uso |
|---|---|
| `PurchaseRequestDirectory(customerId, solicitudId)` | Directorio raiz de la solicitud (PDF firmado) |
| `PurchaseRequestQuotationDirectory(customerId, solicitudId)` | PDFs de cotizaciones de proveedores |
| `PurchaseRequestEvidenceDirectory(customerId, solicitudId)` | Fotos de evidencia de la solicitud |
| `PurchaseRequestQuotationEvidenceDirectory(customerId, solicitudId, cotizacionId)` | Fotos de evidencia por cotizacion |

El PDF de la solicitud firmada se guarda con nombre fijo `Solicitud_{Folio}.pdf` (sobreescritura intencional en cada subida).

---

## Endpoints de la API

Todos los controladores estan bajo `[Authorize]` y decoran cada endpoint con `[LogUserActivity]`.

### SolicitudCompraController `/api/solicitudcompra`

| Metodo | Ruta | Accion |
|---|---|---|
| GET | `list/{customerId}/{estatus}` | Lista filtrada por estatus |
| GET | `GetIdSolicitudCompra/{folio}/{customerId}` | Obtiene ID por folio |
| GET | `GetSolicitudCompraIndividual/{id}` | Detalle completo (formulario) |
| GET | `{id}` | Detalle tecnico `SCDTO` |
| GET | `CuadroComparativo/{id}` | Datos del cuadro comparativo |
| GET | `Presentation/{customerId}` | SCs seleccionadas para presentacion |
| POST | `/` | Crear nueva SC |
| PUT | `{id}` | Actualizar SC |
| PUT | `Presentation/{id}/Selection` | Activar/desactivar flag de presentacion |
| PUT | `Presentation/Order` | Reordenar SCs en presentacion |
| PUT | `CuadroComparativo/{id}` | Actualizar autorizacion |
| POST | `CuadroComparativo/{id}/Evidences` | Subir foto de evidencia |
| DELETE | `CuadroComparativo/Evidences/{evidenceId}` | Eliminar foto de evidencia |
| GET | `CuadroComparativo/{id}/Budgets` | Consultar presupuestos disponibles (ASPEL) |
| POST | `CuadroComparativo/{id}/Budgets` | Asignar cuenta presupuestal |
| DELETE | `CuadroComparativo/Budgets/{budgetId}` | Quitar cuenta presupuestal |
| DELETE | `{id}` | Eliminar SC completa |
| DELETE | `DeleteProvider/{solicitudCompraId}/{cotizacionProveedorId}` | Quitar proveedor del cuadro |
| POST | `analyze-comparative-chart/{id}` | Analisis IA del cuadro comparativo |

### SolicitudCompraDetalleController `/api/solicitudcompradetalle`

| Metodo | Ruta | Accion |
|---|---|---|
| GET | `{id}` | Obtener partida por ID |
| GET | `EditProduct/{id}` | Partida para formulario de edicion |
| GET | `AddProduct/{solicitudCompraId}` | Lista paginada de productos a agregar (`[FromQuery] PaginationCommonDTO`) |
| GET | `SearchToAddRequest/{solicitudCompraId}` | Busqueda rapida de productos (`[FromQuery] string param`) |
| POST | `/` | Agregar partida a la SC |
| PUT | `{id}` | Actualizar cantidad y unidad |
| PUT | `UpdatePrice/{id}` | Actualizar precios para los 3 proveedores |
| DELETE | `{id}` | Eliminar partida (y sus precios) |

### CotizacionProveedorController `/api/cotizacionproveedor`

| Metodo | Ruta | Accion |
|---|---|---|
| GET | `/` | Lista todas las cotizaciones |
| GET | `{id}` | Cotizacion por ID |
| GET | `posicionCotizacion/{solicitudCompraId}/{posicion}` | Cotizacion por posicion (1, 2 o 3) |
| GET | `provider/{solicitudCompraId}` | Proveedores disponibles (dropdown) |
| POST | `/` | Crear cotizacion (`[FromForm]` - incluye PDF) |
| PUT | `{id}` | Actualizar cotizacion (`[FromForm]`) |
| PUT | `update-provider/{id}` | Cambiar proveedor (`[FromForm]`) |
| DELETE | `{id}` | Eliminar cotizacion completa |
| DELETE | `remove-file/{id}` | Eliminar solo el PDF |
| POST | `{id}/evidences` | Subir foto a cotizacion (`[FromForm]`) |
| DELETE | `evidences/{evidenceId}` | Eliminar foto de cotizacion |

---

## DTOs principales

### Lectura

| DTO | Descripcion |
|---|---|
| `SolicitudesCompraIndexDTO` | Fila del listado: folio, fecha, solicita, equipo, justificacion, estatus (texto), conteo de cotizaciones, flags de presentacion, ordenes relacionadas |
| `SolicitudCompraIndividualDTO` | Formulario completo: todos los campos de cabecera + lista de `SolicitudCompraDetalleIndividualDTO` con precios por posicion |
| `SCDTO` | Vista tecnica: cabecera + lista de `SCDetalleDTO` que incluye la lista `Cotizaciones` (una por proveedor) y las propiedades legacy `Precio`/`Precio2`/`Precio3` |
| `SolicitudCompraCuadroComparativoDTO` | Vista del cuadro: cabecera + autorizacion + evidencias con URL + budgets con snapshots + detalles con `Total`/`Total2`/`Total3` + cotizaciones con URL de PDF |
| `CotizacionProveedorDTO` | Cotizacion completa con URL de PDF y lista de evidencias con URL |
| `GetPosicionCotizacionDTO` | Cotizacion en una posicion especifica; puede estar vacia si no existe |

### Escritura

| DTO | Campos clave |
|---|---|
| `SolicitudCompraAddOrEditDTO` | `Folio`, `FechaSolicitud (DateOnly?)`, `Solicita`, `EquipoOInstalacion`, `JustificacionGasto`, `Estatus`, `CustomerId`, `ApplicationUserId` |
| `SolicitudCompraCuadroComparativoUpdateDTO` | `Estatus`, `AutorizadaPor?`, `MotivoNoAutorizacion`, `ApplicationUserId` |
| `SolicitudCompraPresentationSelectionDTO` | `SelectedForPresentation (bool)` |
| `SolicitudCompraPresentationOrderDTO` | `SolicitudCompraIds (List<Guid>)` - orden deseado |
| `SolicitudCompraDetalleAddProductDTO` | `ProductoId`, `SolicitudCompraId`, `Cantidad`, `UnidadMedidaId`, `ApplicationUserId` |
| `SolicitudCompraDetalleEditProductDTO` | `ProductoId`, `Cantidad`, `UnidadMedidaId`, `NombreProducto` (readonly) |
| `SolicitudCompraDetalleEditPriceDTO` | `SolicitudCompraId`, `Cantidad`, `Precio`/`Descuento`/`IvaAplicado` x3 (posiciones 1, 2, 3) |
| `CotizacionProveedorAddOrEditDTO` | `SolicitudCompraId`, `NameProvider`, `FechaCotizacion (DateOnly)`, `NumeroCotizacion`, `File (IFormFile)`, `Garantia/Entrega/PoliticaPago (max 100)`, `AutorizadaPor?` |
| `SolicitudCompraEvidenceCreateDTO` | `File (IFormFile)`, `Descripcion`, `ApplicationUserId` |
| `SolicitudCompraBudgetCreateDTO` | `FiscalYear`, `AccountNumber`, `AccountName`, `Amount (min 0.01)` |

---

## Mapeos AutoMapper (SolicitudCompraMapper)

| Origen | Destino | Notas |
|---|---|---|
| `SolicitudCompraAddOrEditDTO` | `SolicitudCompra` | Directo |
| `SolicitudCompra` | `SolicitudCompraIndividualDTO` | Bidireccional via `ReverseMap` |
| `SolicitudCompra` | `SolicitudCompraDTO` | Bidireccional |
| `SolicitudCompraDetalle` | `SolicitudCompraDetalleDTO` | Bidireccional |
| `SolicitudCompraDetalleAddProductDTO` | `SolicitudCompraDetalle` | Bidireccional |
| `SolicitudCompraDetalleEditPriceDTO` | `SolicitudCompraDetalle` | Bidireccional |
| `SolicitudCompraDetalleAddOrEditDTO` | `SolicitudCompraDetalle` | Unidireccional |
| `SolicitudCompraDetalle` | `SolicitudCompraDetalleIndividualDTO` | Extrae precios de `Cotizaciones` por posicion (1, 2, 3). Default IVA=16 si no hay cotizacion en esa posicion |
| `CotizacionProveedorAddOrEditDTO` | `CotizacionProveedor` | Unidireccional |
| `CotizacionProveedor` | `CotizacionProveedorDTO` | Bidireccional; ignora `SolicitudCompra` y `Evidencias` en la vuelta |
| `CotizacionProveedorEvidence` | `CotizacionProveedorEvidenceDTO` | Unidireccional |
| `SolicitudCompraEvidence` | `SolicitudCompraEvidenceDTO` | Unidireccional |
| `SolicitudCompraBudget` | `SolicitudCompraBudgetDTO` | Renombra campos `*Snapshot` a nombres sin sufijo |

Los mapeos de `SolicitudCompraDetalleIndividualDTO` no usan AutoMapper en `GetSCDTO` ni en `GetSolicitudCompraCuadroComparativoDTOAsync`; esos flujos proyectan manualmente para evitar la restriccion de no usar AutoMapper en consultas.

---

## Flujos de negocio completos

### Creacion de una solicitud nueva con productos

1. Frontend crea cabecera via `POST /api/solicitudcompra` -> recibe el `Id` generado.
2. Para cada producto: `POST /api/solicitudcompradetalle` con `SolicitudCompraId` ya conocido.
3. El folio es generado en el backend; el frontend no lo controla.

### Construccion del cuadro comparativo

1. Agregar proveedores: `POST /api/cotizacionproveedor` con PDF adjunto (`multipart/form-data`). El backend asigna posicion 1, 2 o 3 automaticamente. Maximo 3.
2. Cargar precios por partida: `PUT /api/solicitudcompradetalle/UpdatePrice/{detalleId}` con los precios para las 3 posiciones. El backend crea o actualiza `CotizacionDetalle` segun los proveedores existentes en cada posicion.
3. Ver el cuadro: `GET /api/solicitudcompra/CuadroComparativo/{id}` retorna todo consolidado con totales calculados.

### Autorizacion

1. El directivo consulta `GET /api/solicitudcompra/Presentation/{customerId}` para ver el carrusel de SCs marcadas.
2. Autoriza o rechaza via `PUT /api/solicitudcompra/CuadroComparativo/{id}` con `Estatus`, `AutorizadaPor` (si autoriza) o `MotivoNoAutorizacion` (si rechaza).
3. El backend registra automaticamente la fecha y hora de Mexico si el estatus es `Autorizado`.

### Analisis con IA

1. `POST /api/solicitudcompra/analyze-comparative-chart/{id}`
2. El backend extrae texto de los PDFs de cotizacion con PdfPig.
3. Construye un DTO de analisis y lo envia a `IAiAssistantService`.
4. Retorna la recomendacion como texto libre.

---

## Reglas de negocio criticas

- **Multi-tenant**: toda query filtra por `CustomerId`. Nunca mezclar datos entre clientes.
- **Maximo 3 cotizaciones** por SC. La posicion se asigna automaticamente; no se puede repetir.
- **Maximo 4 evidencias** por SC (a nivel de cabecera). Sin limite en evidencias por cotizacion de proveedor.
- **Solo PDF** en cotizaciones de proveedor. Solo JPG/PNG en evidencias.
- **Autorizacion requiere campo segun estatus**: `Autorizado` requiere `AutorizadaPor`; `Denegado` requiere `MotivoNoAutorizacion`.
- **FechaAutorizacion y HoraAutorizacion** se registran con hora de Mexico (no UTC) y solo cuando el estatus es `Autorizado`.
- **Snapshot de presupuesto**: al vincular una cuenta ASPEL, el estado del presupuesto se congela en ese momento. El snapshot no se actualiza despues.
- **Precio en `CotizacionDetalle`**: solo se crea si existe un proveedor en esa posicion. Si se elimina el proveedor, los detalles deben borrarse explicitamente (no hay cascada confiable configurada segun codigo).
- **SortOrder en presentacion**: al activar el flag de una SC para presentacion, se asigna `MAX(SortOrder) + 1` si el valor actual es 0 o ya esta tomado.
- **FechaSolicitud** es `DateOnly`; semantica de solo fecha, no timestamp.
- **FechaCotizacion** en cotizacion de proveedor es `DateOnly`.
- **FechaAutorizacion** es `DateOnly`; `HoraAutorizacion` es `TimeOnly`. Son campos separados, no duplicar en `DateTime`.
