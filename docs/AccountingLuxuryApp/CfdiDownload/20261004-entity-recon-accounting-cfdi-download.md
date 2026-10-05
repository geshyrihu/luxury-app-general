# PASO 0.5 — Reconocimiento de entidades: "Descarga Masiva de CFDI del SAT"

**Fecha:** 2026-10-04
**Tipo de trabajo:** **A — Módulo nuevo** (a confirmar en PASO 0)
**Ubicación propuesta (a confirmar):** `AccountingLuxuryApp / CfdiDownload`
**Backend propuesto:** `api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/`
**Frontend propuesto:** `appsweb/angular/src/app/modules/accounting.luxuryapp/cfdi-download/`
**Referencia funcional:** herramienta "CFDI Descarga Masiva" de ContadorMx (descarga emitidos/recibidos del SAT con e.firma, validación de vigencia, EFOS, XML→PDF, Excel, organización por RFC/año/mes).

> Nota de rutas: la skill `planeacion-modulos` aún cita `LuxuryApp.Infrastructure.Data/Data/Entities/` y `Moduls/`. Las rutas reales hoy son `api/LuxuryApp.Application/Infrastructure/Data/Entities/` y `api/LuxuryApp.Application/Modules/`. La estructura de documentos sigue `CONVENTIONS.md §4.6` (plana, por fecha), no la carpeta `docs/modulos-nuevos/` de la skill.

## Resumen ejecutivo

**No existe ninguna entidad ni servicio que modele el ciclo de Descarga Masiva del SAT.** Pero la parte difícil (el cliente SOAP del SAT) **ya está instalada y registrada, y nadie la usa**:

- `Fiscalapi.XmlDownloader 6.0.0` está en `LuxuryApp.Application.csproj:36` y `services.AddXmlDownloader()` está registrado en `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Services.cs:44`. Cero consumidores en el código.
- Ya existen el parser de CFDI, el Vault cifrado (AES-GCM), el resolvedor de rutas de archivos, los generadores de Excel/PDF y el catálogo de jobs Hangfire.

Corrección a mi análisis previo: dije que no había visto servicios; al revisarlos, **varias piezas del pipeline sí existen** (ver §3). Lo que falta es el modelo de datos del ciclo solicitud→paquete→CFDI (el RFC ya existe en `Customer.RFC`), el registro de e.firma por empresa, el catálogo EFOS y la orquestación.

---

## 1. Dónde vive cada cosa (verificado)

| Capa | Ruta | Estado |
|---|---|---|
| Entidades | `api/LuxuryApp.Application/Infrastructure/Data/Entities/{Área}LuxuryApp/` | Área contable: `AccountingLuxuryApp/` (6 subcarpetas, 0 relacionadas con CFDI) |
| `DbSet<>` | `api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs` | `Invoices` (l.352), `BillingConfigs` (l.276), `PurchaseOrderInvoices` (l.1343) activos |
| Vault (secretos) | `api/LuxuryApp.Application/Infrastructure/Vault/` | DbContext **propio** (`VaultDbContext`), separado del principal |
| Servicios existentes | `Modules/PurchasesLuxuryApp/.../Helpers/CfdiXmlParser.cs`, `Modules/CollectionsLuxuryApp/.../Invoices/Services/InvoiceService.cs` | Ver §3 |
| Jobs | `Modules/AdminLuxuryApp/Infrastructure/Jobs/Catalog/HangfireJobCatalog.cs` | 31 jobs, ninguno de CFDI/SAT |
| Documentación del módulo | `docs/AccountingLuxuryApp/` | Existe; no hay carpeta `CfdiDownload` (creada con este documento) |

---

## 2. Entidades existentes relacionadas (traducción a negocio)

### 2.1 `Invoice` — tabla `Invoices` (`Collections/NativeCollections/Core/Invoices/Invoice.cs`)

| Propiedad | Qué es en negocio |
|---|---|
| `CustomerId` / `Customer` | Empresa (tenant) dueña de la factura. `ITenantEntity`. |
| `ChargeId` / `Charge` | Cargo de cobranza que originó la factura (obligatorio: atada a cobranza). |
| `UUID` | Folio fiscal SAT (36 caracteres). |
| `Serie`, `Folio` | Serie y folio interno del emisor. |
| `Status` (`InvoiceStatus`: Vigente/Cancelado) | Estado del CFDI. |
| `XmlFilePath`, `PdfFilePath` | Rutas relativas de los archivos. |
| `TimbreAt` | Fecha de timbrado. |

**Es una factura EMITIDA por LuxuryApp a un cobro propio. No sirve como repositorio general de CFDI** (exige `ChargeId`, no guarda RFC emisor/receptor, ni montos, ni tipo de comprobante). Además `InvoiceService.GenerateInvoiceAsync` es **simulación**: UUID aleatorio, XML/PDF falsos, mensaje "Simulación PAC". No hay timbrado real ni cancelación real ante el SAT.

### 2.2 `OrdenCompraFactura` — tabla `PurchaseOrderInvoices` (`Purchases/.../PurchaseOrders/OrdenCompraFactura.cs`)

| Propiedad | Qué es en negocio |
|---|---|
| `OrdenCompraId` | Orden de compra a la que se asocia la factura del proveedor. |
| `FolioFiscal` | UUID del CFDI recibido. |
| `Factura` | Serie+folio del proveedor. |
| `FechaFactura` | Fecha de emisión (**guardada como `string`**, `MaxLength 250`). |
| `RfcEmisor`, `NombreEmisor`, `RfcReceptor` | Partes del CFDI. |
| `Monto` | Total (`decimal?`). |
| `TipoComprobante` | I/E/etc. |
| `MetodoPago`, `FormaPago` | PUE/PPD y forma de pago. |
| `XmlFile`, `PdfFile` | Rutas de archivos. |

Es el modelo **más cercano a un CFDI recibido**, pero: sin `ITenantEntity` (no tiene `CustomerId` propio, hereda por la orden), sin estado de vigencia, sin subtotal/impuestos, y está acoplado a una orden de compra. **No se reutiliza como tabla central**; sí es candidato a **vincularse** por `UUID` al repositorio nuevo.

### 2.3 `Provider` — tabla `Providers` (`Operations/Providers/Provider.cs`)

Tiene `Rfc` (columna `TaxId`) y `ConstanciaFiscal` (ruta del PDF). Útil para **cruzar el RFC del emisor de un CFDI recibido contra proveedores registrados** (conciliación). No guarda e.firma.

### 2.4 `BillingConfig` — tabla `BillingConfigs` (`Collections/.../ExternalCompatibility/BillingConfig.cs`)

Config de **cobranza** por empresa (modo Nativo/COI, días de vencimiento, mora). **No tiene RFC ni datos fiscales.** El nombre engaña: no es el lugar para la e.firma.

### 2.5 `Customer` — `AdminLuxuryApp/Customers/Customers/Customer.cs`

**Corrección (2026-10-04):** sí tiene RFC. `Customer.RFC` (columna `RFC`, `[Required]`, `[StringLength(13)]`, `Customer.cs:32-34`). Mi búsqueda inicial distinguía mayúsculas (`Rfc`) y no lo encontró. Confirmado por el Tech Lead: cada customer tiene un solo RFC. No hay razón social fiscal separada de `NameCustomer` (máx. 50 caracteres); si el módulo la necesita, queda como pregunta abierta.

### 2.6 `UsoCFDI` — tabla `TaxUsages`

Catálogo de uso de CFDI (G01, P01...). Reutilizable como catálogo de referencia.

### 2.7 Catálogos SAT relacionados (en `Collections/.../Payments/`)

`FormaPago.cs`, `MetodoDePago.cs` — catálogos SAT ya existentes. Reutilizables para interpretar los CFDI descargados.

### 2.8 Vault — `VaultSecret` (tabla `VaultSecrets`, `VaultDbContext` separado)

Almacena secretos **cifrados AES-256-GCM** por tenant (`TenantId`), con `KeyVersion` (rotación), `ExpiresAt`, `IsRevoked`, contador de accesos y `VaultAccessLog`. Acceso único vía `ISecretProvider` (`GetSecretAsync/StoreSecretAsync/RotateSecretAsync/RevokeSecretAsync`).
**Es el lugar natural para guardar `.cer`, `.key` y contraseña de la e.firma**, en lugar de crear columnas cifradas nuevas.

---

## 3. Servicios/infraestructura ya disponibles (reutilizables)

| Capacidad que pide el módulo | Ya existe | Dónde | Observación |
|---|---|---|---|
| Cliente SOAP del SAT (Auth → Solicitud → Verificación → Descarga) | ✅ Instalado, **sin uso** | `Fiscalapi.XmlDownloader 6.0.0`, `AddXmlDownloader()` | Soporta CFDI 3.3/4.0, metadata, límite 200k CFDI / 1M metadata por solicitud, `CorruptPackageException`. Depende de `Fiscalapi.Credentials`. |
| Parseo de XML CFDI | ✅ | `CfdiXmlParser` (`Purchases/Shared/Helpers`) | Declarado "fuente única" **pero vive en Purchases** y solo extrae un subconjunto (sin UUID de relacionados, sin complementos, sin conceptos). |
| Cifrado de secretos | ✅ | `ISecretProvider` / `VaultEncryptionService` | Ver §2.8. |
| Rutas y almacenamiento por tenant | ✅ | `IFileStructureResolver.GetCustomerPath(customerId, ...)` | `InvoiceService` ya organiza por `{customer}/facturas/{yyyy/MM}/`. Falta el esquema RFC/año/mes. |
| Exportar a Excel | ✅ | `ClosedXML 0.105.0`, `ReportExcelExportService` | Reutilizable. |
| Generar PDF | ✅ | `QuestPDF 2026.7.2`, `PdfSharpCore`, `MergePdfService`, `EstadosFinancierosPdfService` | **No hay** representación impresa de CFDI (XML→PDF) todavía. |
| Procesos recurrentes | ✅ | Hangfire + `HangfireJobCatalog` (zona `America/Mexico_City`) | El ciclo "verificar hasta que esté listo" encaja como job. |
| Notificaciones | ✅ | §5.9.1 CONVENTIONS | Para avisar "solicitud lista / falló". |

---

## 4. GAPs — qué NO tiene "hogar" hoy

| # | GAP | Detalle |
|---|---|---|
| G1 | ~~RFC del contribuyente~~ (**resuelto**) | `Customer.RFC` ya existe (1 RFC por customer). No se crea perfil fiscal para el RFC. Solo se valida que el RFC de la e.firma coincida con `Customer.RFC`. |
| G2 | **Referencia a la e.firma** | Solo se guarda en Vault; falta la entidad que ligue `CustomerId` (1:1, el RFC se toma de `Customer.RFC`) + nombres de secretos en Vault + vigencia (`NotAfter` del `.cer`) + estado. **El `.key` y la contraseña nunca van en la BD principal.** |
| G3 | **Solicitud de descarga** | Falta entidad (RFC solicitante, emitidos/recibidos, rango de fechas, tipo CFDI/Metadata, estado de comprobantes, `RequestId` SAT, estado SAT, código SAT, intentos, fecha de última verificación, usuario que la creó). |
| G4 | **Paquete descargado** | Falta entidad (`PackageId` SAT, solicitud padre, ruta del ZIP, hash, tamaño, fecha de descarga, resultado de lectura). |
| G5 | **Repositorio neutral de CFDI** | Falta tabla de CFDI descargados: UUID (único por tenant), emisor/receptor RFC+nombre, fecha, tipo, subtotal/total/moneda/TC, método/forma pago, uso CFDI, estado SAT (vigente/cancelado + fecha cancelación), dirección (emitido/recibido), rutas XML/PDF, vínculo opcional a `OrdenCompraFactura`/`Invoice`/`Provider`. |
| G6 | **Catálogo EFOS (69-B)** | No existe. Requiere tabla (RFC, situación: presunto/definitivo/desvirtuado/sentencia favorable, fechas de publicación) + fuente y frecuencia de actualización (decisión de negocio/legal). |
| G7 | **XML → PDF** | Hay QuestPDF pero no plantilla de representación impresa CFDI. |
| G8 | **Validación de vigencia** | La librería descarga con estado, pero la verificación puntual (consulta de estatus SAT por UUID) no está cubierta; definir si se resuelve con re-descarga de metadata o con el servicio de consulta. |
| G9 | **Job de verificación/descarga** | Ninguno en `HangfireJobCatalog`. |
| G10 | **Permisos** | No hay rol/permisos definidos; hay que cruzar con `application-roles-catalog.md` (el acceso a una e.firma es altamente sensible). |

---

## 5. Hallazgos a decidir (afectan el diseño)

1. **`Invoice.InvoiceStatus` solo tiene Vigente/Cancelado.** Los CFDI descargados pueden estar además "no encontrado" o con cancelación en proceso (pendiente de aceptación). No reutilizar este enum tal cual.
2. **`OrdenCompraFactura.FechaFactura` es `string`.** Modelo nuevo debe usar `DateTime`; el vínculo se hace por UUID, no migrando datos.
3. **`CfdiXmlParser` está en el módulo Purchases.** Para uso transversal habría que moverlo a `Shared` (regla "no tocar shared sin control especial") o crear un parser nuevo y dejar el existente intacto. Decisión pendiente.
4. **Dos `DbContext` distintos** (principal y Vault): guardar e.firma implica coordinar consistencia entre ambos (no hay transacción compartida).
5. **`InvoiceService` simulado**: el módulo nuevo no debe confundirse con timbrado/emisión; es **solo descarga/consulta**.

---

## 6. Conteo declarado

- Carpeta `AccountingLuxuryApp/` de entidades: 6 subcarpetas, 27 archivos → **0 relacionados** con CFDI (se revisaron los nombres; ninguno es fiscal-electrónico). `ContabilidadFiscalPeriod`/`CoiFiscalPeriod` son **periodos fiscales contables**, no CFDI: excluidos con justificación.
- Entidades relacionadas leídas completas: `Invoice`, `OrdenCompraFactura`, `Provider`, `BillingConfig`, `UsoCFDI`, `VaultSecret`.
- No leídas por no aplicar: `Charge`, `CreditNote`, `CobranzaPayment` (cobranza interna).

## 7. Acoplamientos con otros módulos y reglas de no-ruptura (verificado)

| Pieza | Quién la usa hoy | Riesgo para producción | Regla para el plan |
|---|---|---|---|
| `Fiscalapi.XmlDownloader` / `AddXmlDownloader()` | Nadie (0 consumidores) | Nulo | Consumir libremente. No quitar el paquete (limpiezas previas lo marcaron como candidato). |
| `CfdiXmlParser` | `OrdenCompraStatusAppService`, `OrdenCompraAppService` + 3 tests | Alto si se modifica o se mueve | **No tocar ni mover.** Parser propio del módulo nuevo, o consumo de solo lectura. |
| `ISecretProvider` / Vault | `JwtService` (login), Twilio, Brevo, ElevenLabs, AiAssistant, Aspel (2) | **Crítico** | Solo `StoreSecretAsync` con nombres nuevos y prefijo propio por tenant. Prohibido rotar/revocar/cambiar `KeyVersion` global ni modificar los servicios del Vault. |
| `IFileStructureResolver`, `IFileWritePathService`, `IFileReadPathService` | Decenas de módulos | Medio (shared) | Ya existen `SatDownloads`, `SatFundings`, `SatConfig` y `GetSatDownloadZipDirectory(customerId, historyId)`: **reutilizarlos, sin agregar métodos a las interfaces**. |
| `Invoice` / `InvoiceService` / `InvoicesEndpoints` | Cobranza nativa + `InvoiceServiceTests` | Alto si se modifica | No tocar. Vínculo solo por UUID desde tabla nueva. |
| `OrdenCompraFactura` | Compras (órdenes) | Alto si se modifica | No tocar. Vínculo solo por UUID desde tabla nueva. |
| `ReportExcelExportService` | Reportes dinámicos de contabilidad | Medio | No reutilizar la clase; usar ClosedXML directo en servicio propio. |
| `HangfireJobCatalog` | `HangfireExtensions` registra todo el catálogo al arrancar | Bajo-medio | Agregar 1-2 entradas es aditivo (sin tests sobre el conteo), pero es un archivo compartido de AdminLuxuryApp: cambio mínimo y revisado. |
| `ApplicationDbContext` + migraciones | Toda la app | Medio | Solo tablas nuevas (aditivo, reversible). Cero `ALTER` a tablas existentes; el RFC va en tabla nueva, no en `Customer`. |

### Hallazgo: restos de una funcionalidad SAT anterior

- **Frontend vivo:** `appsweb/angular/.../accounting.luxuryapp/fundings/sat-funding/` (lista, detalle, edición) con ruta `sat-funding` en `accounting.routes.ts:122` y endpoints en `contabilidad.endpoints.ts:274-280` (`sat-funding/request-download`, `update-detail`, `update-order`, `bulk-update-tipo-gasto`).
- **Backend inexistente:** no hay entidad, servicio ni endpoint `SatFunding` en `api/`. Solo quedan `FileDirectories` (`sat-downloads`, `sat-fundings`, `sat-config`), helpers de ruta y un job comentado en `Program.cs:376` (`SatFundingCreationJob`).
- **Decisión (usuario, 2026-10-04):** `sat-funding` **no se usa hoy**. El módulo nuevo no depende de ella ni la preserva; su eliminación o reemplazo se decide en el plan (fase aparte, no se borra durante la construcción).
- **Implicación original:** esa pantalla hoy llamaría endpoints que no existen. Hay que decidir si el módulo nuevo la **reemplaza**, la **alimenta** o se mantiene **aparte**. No se debe borrar ni reactivar sin esa decisión. Pendiente: confirmar si la ruta es alcanzable desde el menú y si hay datos históricos en BD.

---

## 8. Siguiente paso

Revisión de este reporte. Luego **PASO 0** (confirmar tipo A, nombre y ubicación del módulo) y **PASO 1** (cuestionario de discovery, una pregunta a la vez).
