# Manual de Implementación: Creación de OC desde Facturas (XML/PDF)

Este documento describe el plan técnico para implementar la funcionalidad de creación masiva de Órdenes de Compra (OC) a partir de la carga de archivos de facturas (XML y PDF) dentro del módulo de Fondeo.

## 1. Resumen de la Funcionalidad

El objetivo es permitir a un usuario, dentro de la vista de detalles de un fondeo, cargar múltiples archivos XML y PDF. El sistema analizará estos archivos, presentará una previsualización de las OC que se pueden crear y, tras la confirmación y ajuste por parte del usuario, creará dichas OC y las asociará al fondeo actual.

---

## 2. Plan de Implementación del Backend

### 2.1. Nuevo Endpoint en `FundingController`

**Estado:** PENDIENTE. El controlador `FundingFileController.cs` existe, pero el endpoint específico `analyze-invoices` no está implementado.

Se creará un nuevo endpoint para manejar la carga y el análisis de los archivos.

- **Controlador**: `FundingFileController.cs` (ya que se relaciona con archivos).
- **Endpoint**: `POST /api/fundingfile/analyze-invoices`
- **Request**: `IFormFileCollection` (para recibir múltiples archivos) y el `customerId`.
- **Response**: `ApiResponseDTO<List<AnalyzedInvoiceDTO>>`

Este endpoint no guardará nada en la base de datos inicialmente. Su única función es recibir los archivos, orquestar su análisis y devolver un resultado estructurado al frontend.

### 2.2. Nuevo DTO: `AnalyzedInvoiceDTO`

**Estado:** PENDIENTE. Ni el DTO `AnalyzedInvoiceDTO` ni su enumeración `AnalysisStatus` asociada se encontraron.

Este DTO representará el resultado del análisis de cada factura y será lo que el frontend reciba para mostrar en la previsualización.

```csharp
// Ubicación: LuxuryApp.Application.DTOs

public class AnalyzedInvoiceDTO
{
    public Guid TempId { get; set; } // Un ID temporal para que el frontend pueda rastrear cada item.
    public string XmlFileName { get; set; }
    public string PdfFileName { get; set; }
    public AnalysisStatus Status { get; set; }
    public string StatusMessage { get; set; }

    // --- Datos extraídos del XML ---
    public string ProviderName { get; set; }
    public string ProviderRfc { get; set; }
    public decimal Total { get; set; }
    public decimal SubTotal { get; set; }
    public decimal Iva { get; set; }
    public string Uuid { get; set; }
    public string Serie { get; set; }
    public string Folio { get; set; }
    public DateTime InvoiceDate { get; set; }

    // --- Datos requeridos por el usuario ---
    public ETipoGasto TipoGasto { get; set; } = ETipoGasto.Variable; // Valor por defecto
    public string JustificacionGasto { get; set; } = "Dato Pendiente";

    // --- Datos de validación interna ---
    public bool ProviderExists { get; set; }
    public Guid? ProviderId { get; set; }
    public string RawXmlContent { get; set; } // El contenido del XML en base64 para no tener que volverlo a subir.
}

public enum AnalysisStatus
{
    ReadyToCreate,
    ProviderNotFound,
    InvalidXml,
    NoXmlFound,
    InvoiceAlreadyExists
}
```

### 2.3. Nuevo Servicio de Lógica: `InvoiceAnalysisService`

**Estado:** PENDIENTE. Ni el servicio `InvoiceAnalysisService` ni su interfaz `IInvoiceAnalysisService` se encontraron.

Este nuevo servicio contendrá la lógica principal para analizar los archivos. Será inyectado en `FundingFileController`.

- **Interfaz**: `IInvoiceAnalysisService`
- **Implementación**: `InvoiceAnalysisService`
- **Ubicación**: `LuxuryApp.Application.Features.Funding.Services`

**Métodos Principales:**

1. **`Task<List<AnalyzedInvoiceDTO>> AnalyzeUploadedFilesAsync(IFormFileCollection files, Guid customerId)`**:
   - Itera sobre cada archivo subido.
   - Separa los XML de los PDF.
   - Para cada XML:
     - Lee y parsea el contenido. Utilizar `System.Xml.Linq`.
     - Extrae los datos clave (UUID, Emisor, Receptor, Conceptos, Impuestos, Total).
     - Valida el `customerId` contra el RFC del `Receptor` en el XML.
     - Busca el proveedor en la BD por `Rfc` y `CustomerId`.
     - Busca si ya existe una OC con el mismo `UUID` para evitar duplicados.
     - Intenta encontrar un PDF coincidente usando los últimos 5 dígitos del `UUID`.
     - Construye y añade un `AnalyzedInvoiceDTO` a la lista de resultados con el estado correspondiente.
   - Devuelve la lista de DTOs.

### 2.4. Nuevo Endpoint para la Creación de OC

**Estado:** PENDIENTE. Este endpoint no existe en `FundingController.cs`, aunque el frontend ya espera su existencia.

Se necesita un segundo endpoint para recibir la confirmación del usuario y crear las OC.

- **Controlador**: `FundingController.cs`
- **Endpoint**: `POST /api/funding/create-orders-from-invoices`
- **Request**: `CreateOrdersFromInvoicesRequestDTO`
- **Response**: `ApiResponseDTO<bool>`

**DTO de la Petición:**

```csharp
// Ubicación: LuxuryApp.Application.DTOs

public class CreateOrdersFromInvoicesRequestDTO
{
    public string FundingId { get; set; }
    public List<ConfirmedInvoiceDTO> InvoicesToCreate { get; set; }
}

public class ConfirmedInvoiceDTO
{
    // Hereda o contiene las propiedades de AnalyzedInvoiceDTO
    // que el usuario pudo haber modificado.
    public string RawXmlContent { get; set; } // Base64
    public Guid ProviderId { get; set; }
    public ETipoGasto TipoGasto { get; set; }
    public string JustificacionGasto { get; set; }
    public string PdfFileName { get; set; }
}
```

### 2.5. Modificación del `OrdenCompraAppService`

**Estado:** IMPLEMENTADO. El método `CreateFromInvoiceAsync` ha sido implementado, y el `AddAsync` también fue ajustado para poblar `ProductName`.

El método `AddAsync` actual no es adecuado para este nuevo flujo. Se creará un nuevo método.

- **Servicio**: `OrdenCompraAppService.cs`
- **Nuevo Método**: `Task<OrdenCompra> CreateFromInvoiceAsync(ConfirmedInvoiceDTO invoiceDTO, string fundingId, Guid customerId, string userId)`
  - Decodifica el `RawXmlContent` (Base64) a string.
  - Crea la entidad `OrdenCompra` principal.
  - Crea el `OrdenCompraDatosPago` con la información del `ProviderId` y los datos del XML (método de pago, forma de pago, etc.).
  - **Lógica de Conceptos (Simplificada)**:
    - Crea un único `OrdenCompraDetalle` genérico.
    - `Descripcion`: "Conceptos agrupados del XML".
    - `Total`: El total extraído del XML.
    - `ProductoId` se deja nulo o se asocia a un producto genérico si existe.
  - Crea el `OrdenCompraAuth` y lo marca como `Autorizado` automáticamente (a discutir, pero parece lógico si viene de una factura ya timbrada).
  - Asocia la OC al `FundingId` a través de un nuevo `FundingDetail`.
  - Si hay un `PdfFileName`, lo guarda en la entidad `Factura` junto con el `UUID`.
  - Guarda todos los cambios en la BD.

---

## 3. Plan de Implementación del Frontend

### 3.1. Nuevo Botón en `funding-detail.html`

**Estado:** IMPLEMENTADO PARCIALMENTE. Existe un `p-button` con `icon="pi pi-upload"` y `(onClick)="onOpenUploadModal()"` en `ClientAngular/src/app/features/funding/funding-detail.html`. Sin embargo, no es el `custom-button` propuesto y el texto de la etiqueta es "Cargar XMLs" en lugar de "Crear OC desde Facturas". La funcionalidad para abrir el modal está presente.

Añadir un botón en la barra de acciones.

```html
<custom-button
  label="Crear OC desde Facturas"
  iconClass="pi pi-upload"
  customClass="mr-1 border-2 border-surface-200"
  size="small"
  (clicked)="onOpenUploadModal()"
/>
```

### 3.2. Nuevo Componente: Modal de Carga y Previsualización

**Estado:** COMPLETAMENTE IMPLEMENTADO. Los archivos `funding-upload-invoices-modal.ts` y `funding-upload-invoices-modal.html` existen en `ClientAngular/src/app/features/funding/components/` y la lógica (TypeScript) y la interfaz de usuario (HTML) corresponden estrechamente con la descripción del plan.

- **Nombre**: `FundingUploadInvoicesModal`
- **Ubicación**: `ClientAngular/src/app/features/funding/components/`

**Funcionalidad del Componente (`.ts`):**

1. **Estado de Carga**: Manejará varios estados: `initial`, `uploading`, `analyzing`, `preview`, `creating`.
2. **Manejo de Archivos**:
   - Un input de tipo `file` que acepta `multiple` y restringe a `.xml, .pdf`.
   - Un método `onFilesSelected(event)` que inicia el proceso.
3. **Llamada a la API de Análisis**:
   - Al seleccionar los archivos, construye un `FormData`.
   - Llama al nuevo endpoint `POST /api/fundingfile/analyze-invoices`.
   - Muestra un spinner o indicador mientras el backend analiza.
4. **Renderizado de la Previsualización**:
   - Al recibir la respuesta (`AnalyzedInvoiceDTO[]`), cambia al estado `preview`.
   - La lista de resultados se guarda en una `signal`.
   - El template (`.html`) renderiza una tabla `p-table` con esta lista.
5. **Interacción del Usuario**:
   - La tabla tendrá las columnas propuestas (checkbox, proveedor, total, tipo de gasto editable, justificación editable, estado).
   - Un checkbox maestro en la cabecera para seleccionar/deseleccionar todo lo que esté "Listo para Crear".
6. **Llamada a la API de Creación**:
   - Un botón "Confirmar y Crear OC" se habilita si hay al menos un ítem seleccionado.
   - Al hacer clic, se filtra la lista para obtener solo los ítems seleccionados y listos.
   - Se construye el `CreateOrdersFromInvoicesRequestDTO`.
   - Se llama al endpoint `POST /api/funding/create-orders-from-invoices`.
   - Se muestra un spinner de "Creando...".
7. **Finalización**:
   - Al recibir la respuesta exitosa, se cierra el modal y se emite un evento `(success)="true"`.
   - El componente `FundingDetail` recibirá este evento y recargará sus datos con `onLoadData()`.

**Template del Modal (`.html`):**

- Utilizará `@switch` para mostrar diferentes vistas según el estado (`initial` muestra el botón de carga, `analyzing` muestra un spinner, `preview` muestra la tabla).
- La tabla de `p-table` utilizará `ng-template` para definir las celdas, incluyendo el `p-dropdown` para el tipo de gasto y el `input` para la justificación.
- Se usarán `p-tag` con diferentes `severity` para mostrar el `Status` de cada fila.

---

## 4. Diagrama de Flujo de la Interacción

````mermaid
sequenceDiagram
    participant User as Usuario
    participant FD as FundingDetail View
    participant UIM as UploadInvoicesModal
    participant API as Backend API
    participant DB as Base de Datos

    User->>FD: Clic en "Crear OC desde Facturas"
    FD->>UIM: Abre el modal
    User->>UIM: Selecciona archivos (XML, PDF)
    UIM->>API: POST /api/fundingfile/analyze-invoices (con archivos)
    API->>API: Analiza XML, busca Proveedor, asocia PDF
    API->>DB: Lee Proveedores
    API-->>UIM: Responde con List<AnalyzedInvoiceDTO>
    UIM->>User: Muestra tabla de previsualización
    User->>UIM: Selecciona [✓], ajusta Tipo Gasto, Justificación
    User->>UIM: Clic en "Confirmar y Crear OC"
    UIM->>API: POST /api/funding/create-orders-from-invoices (con datos confirmados)
    API->>DB: Inicia Transacción
    loop Para cada OC confirmada
        API->>DB: Crea OrdenCompra, Detalles, etc.
    end
    DB-->>API: Confirma Transacción
    API-->>UIM: Responde { success: true }
    UIM->>FD: Cierra modal y emite evento (success)
    FD->>API: GET /api/funding/details/{id} (recarga datos)
    API->>DB: Lee datos actualizados
    DB-->>API: Responde con datos
    API-->>FD: Actualiza la vista con las nuevas OC

---

## 5. Refactorización de `OrdenCompraDetalle` y Job de Actualización

Este apartado detalla los cambios adicionales necesarios en las entidades y servicios para mejorar la flexibilidad en la gestión de productos, especialmente en el contexto de la creación de órdenes de compra desde facturas XML.

### 5.1. Cambios en la Entidad `OrdenCompraDetalle.cs`
**Estado:** COMPLETAMENTE IMPLEMENTADO. Tanto `ProductoId` como `ProductName` han sido ajustados según la descripción.

Se modificará la entidad `OrdenCompraDetalle` para permitir que el ID del producto sea opcional y para incluir una descripción de producto de texto libre.

-   **Propiedad `ProductoId`**: Se hará `nullable`.
    ```csharp
    // Antes: public Guid ProductoId { get; set; }
    public Guid? ProductoId { get; set; }
    ```
-   **Nueva Propiedad `ProductName`**: Se añadirá una propiedad para almacenar el nombre del producto como texto.
    ```csharp
    public string ProductName { get; set; }
    ```

**Racional**: Esta modificación permitirá que los detalles de una Orden de Compra contengan una descripción del producto incluso si no está directamente asociado a un producto preexistente en el catálogo (por ejemplo, cuando se parsean conceptos de XML). Para las órdenes creadas manualmente con un `ProductoId`, esta propiedad almacenará la descripción legible del producto asociada a ese ID.

### 5.2. Actualizaciones en `OrdenCompraAppService.cs`
**Estado:** COMPLETAMENTE IMPLEMENTADO. Tanto `AddAsync` como `CreateFromInvoicesAsync` han sido actualizados para poblar `ProductName` según lo especificado.

Los métodos de creación de órdenes de compra se ajustarán para reflejar los cambios en `OrdenCompraDetalle`.

-   **Método `AddAsync` (creación manual)**:
    *   Cuando se selecciona un `ProductoId`, el `ProductName` se poblará automáticamente copiando la información relevante del producto (ej. `"${Producto.Marca} ${Producto.NombreProducto} ${Producto.Modelo}"`) desde la base de datos.
-   **Método `CreateFromInvoicesAsync` (creación desde XML)**:
    *   El `ProductoId` se establecerá como `null`.
    *   El `ProductName` se asignará con el texto del concepto extraído del XML o, si no está disponible, con la `JustificacionGasto` de la factura.

### 5.3. Job de Migración/Actualización de Datos Existentes
**Estado:** COMPLETAMENTE IMPLEMENTADO. El job `UpdateOrdenCompraDetalleProductNameAsync` ha sido implementado, incluyendo su interfaz, implementación y endpoint de controlador.

Para asegurar la consistencia de los datos existentes tras la refactorización, se creará un método de actualización en los servicios de `UpdateDataBase`.

-   **Servicio**: `UpdateDataBaseService.cs`
-   **Interfaz**: `IUpdateDataBaseService.cs`
-   **Método Propuesto**: `Task<ApiResponseDTO<bool>> UpdateOrdenCompraDetalleProductNameAsync();`
-   **Lógica**:
    *   Este método iterará por todos los registros de `OrdenCompraDetalle`.
    *   Para cada registro donde `ProductoId` no es `null` y `ProductName` es `null` o vacío, cargará el `Producto` asociado.
    *   Construirá la cadena `ProductName` (ej. `"${Producto.Marca} ${Producto.NombreProducto} ${Producto.Modelo}"`) y la asignará al `OrdenCompraDetalle`.
    *   Guardará los cambios en la base de datos en lotes para optimizar el rendimiento.
    *   El proceso se realizará por bloques de `Customers` para manejar grandes volúmenes de datos.

### 5.4. Interfaz de Usuario para el Job de Actualización
**Estado:** COMPLETAMENTE IMPLEMENTADO. Se ha añadido un botón en `update-data-base.html` y la lógica correspondiente en `update-data-base.ts` para ejecutar manualmente el job.

Se añadirá una opción en el frontend para ejecutar manualmente este job de actualización.

-   **Vista**: `ClientAngular/src/app/features/configuration/test/update-data-base/update-data-base.html`
-   **Controlador**: `ClientAngular/src/app/features/configuration/test/update-data-base/update-data-base.ts`
-   **Acción**: Se añadirá un botón que, al ser pulsado, llamará al nuevo endpoint del `UpdateDataBaseController` para ejecutar el job de migración.

## Cambios Adicionales de `ProductName` (No en el Plan Original)

Durante la implementación del plan inicial, se realizaron los siguientes cambios y correcciones adicionales para asegurar la consistencia y correcta funcionalidad de la propiedad `ProductName` en toda la aplicación:

*   **`ProductAppService.cs` (`UpdateAsync`)**: El método `UpdateAsync` en `ProductAppService.cs` fue modificado para actualizar automáticamente la propiedad `ProductName` en todos los registros `OrdenCompraDetalle` asociados cuando se actualiza un `Producto`.
*   **`OrdenCompraDetalleAppService.cs` (`UpdateAsync` y `AddAsync`)**: Se modificaron los métodos `UpdateAsync` y `AddAsync` en `OrdenCompraDetalleAppService.cs` para poblar automáticamente la propiedad `ProductName` de `OrdenCompraDetalle` basándose en su `ProductoId`.
*   **Flujo de `OrdenCompraPdfDTO`**: Se actualizaron los DTOs (`OrdenCompraIndividualDetalleDTO.cs`, `OrdenCompraDetallePdfDTO.cs`) y el perfil de AutoMapper (`PurchaseOrderBudgetMapping.cs`) para utilizar la nueva propiedad `ProductName`. Los componentes frontend (`orden-compra-pdf.ts` y `pdf-generation.service.ts`) también fueron ajustados para reflejar este cambio.
*   **Gestión de `ProductName` en `CatalogoGastosFijosDetalles`**:
    *   La entidad `CatalogoGastosFijosDetalles.cs` fue confirmada con `ProductoId` nullable y `ProductName` existente.
    *   El DTO `CatalogoGastosFijosDetallesDTO.cs` se modificó, renombrando `ProductoDescription` a `ProductName`.
    *   El DTO `CatalogoGastosFijosDetalleAddOrEditDTO.cs` se ajustó haciendo `ProductoId` nullable.
    *   `CatalogoGastosFijosDetallesAppService.cs` (`GetDetallesOrdenCompraFijosAsync`, `AddAsync`, `UpdateAsync`) fueron actualizados para el correcto manejo de `ProductName`.
    *   Los componentes frontend del catálogo de gastos fijos (`catalogo-gasto-fijo-form.html`, `gasto-fijo-servicios.html`) se actualizaron para mostrar `ProductName`.
*   **Job de Migración para `CatalogoGastosFijosDetalles`**: Se implementó un nuevo job `UpdateCatalogoGastosFijosDetalleProductNameAsync` en `UpdateDataBaseService.cs`, con su correspondiente firma en `IUpdateDataBaseService.cs`, endpoint en `UpdateDataBaseController.cs` y botón en la interfaz de usuario (`update-data-base.html` y `update-data-base.ts`).
*   **`GenerarOrdenCompraFijosAsync` (`OrdenCompraAppService.cs`)**: El método `GenerarOrdenCompraFijosAsync` en `OrdenCompraAppService.cs` fue modificado para poblar correctamente `ProductName` para cada `OrdenCompraDetalle` creado a partir de `CatalogoGastosFijosDetalles`.
*   **Corrección de Errores de Compilación**: Se resolvió el error `CS0103` (`retencionIsrCalculada`, `retencionIvaCalculada`) en `OrdenCompraAppService.cs` (`GetSolicitudPagoPdf`) mediante la declaración adecuada de las variables.
*   **Corrección de Error en Frontend**: Se implementó una solución para el error `ExpressionChangedAfterItHasBeenCheckedError` en `cuadro-comparativo-cotizacion.ts` utilizando `setTimeout` para las asignaciones asíncronas de propiedades.

---

## 6. Plan de Acción Detallado para Refactorización y Job

**Backend:**

*   **Tarea R1**: Modificar `OrdenCompraDetalle.cs`:
    *   Cambiar `public Guid ProductoId { get; set; }` a `public Guid? ProductoId { get; set; }`.
    *   Añadir `public string ProductName { get; set; }`.
*   **Tarea R2**: Modificar `OrdenCompraAppService.cs` (método `AddAsync`):
    *   Cuando `ProductoId` se asigna, también poblar `ProductName` con el nombre completo del producto.
*   **Tarea R3**: Modificar `OrdenCompraAppService.cs` (método `CreateFromInvoicesAsync`):
    *   Establecer `ProductoId = null`.
    *   Asignar `ProductName = invoiceDTO.JustificacionGasto` (o el concepto del XML, si se puede extraer).
*   **Tarea R4**: Modificar `IUpdateDataBaseService.cs`:
    *   Añadir la firma `Task<ApiResponseDTO<bool>> UpdateOrdenCompraDetalleProductNameAsync();`.
*   **Tarea R5**: Modificar `UpdateDataBaseService.cs`:
    *   Implementar `UpdateOrdenCompraDetalleProductNameAsync()` para rellenar `ProductName` para los registros existentes.
*   **Tarea R6**: Modificar `UpdateDataBaseController.cs`:
    *   Añadir un nuevo endpoint `POST /api/update-database/update-ordencompra-detalle-productname` que llame al método del servicio.

**Frontend:**

*   **Tarea F1**: Modificar `update-data-base.html`:
    *   Añadir un nuevo botón para ejecutar el job de actualización.
*   **Tarea F2**: Modificar `update-data-base.ts`:
    *   Añadir un método para llamar al nuevo endpoint del `UpdateDataBaseController`.
````
