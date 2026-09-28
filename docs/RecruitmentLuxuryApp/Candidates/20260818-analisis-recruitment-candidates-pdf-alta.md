# Generación de PDF "Formato de Alta del Trabajador"

## Objetivo
Agregar la capacidad de descargar el "Formato de Alta del Trabajador" en formato PDF desde la lista de "Solicitudes de Altas". El PDF será generado en el Backend usando `QuestPDF` y descargado desde el Frontend.

## Referencias y Convenciones
- **Librería de PDF:** Backend usa `QuestPDF` (referenciado en `.csproj`).
- **Endpoint:** Patrón GET `{id}/export-pdf` o `{id}/pdf`.
- **Frontend Download:** Usar `window.location.href` o `window.open` apuntando a la URL del backend, o bien el servicio de descargas (`FileSaver`) si el endpoint requiere Auth Token por Headers.
- **Estructura del Documento:** Estrictamente basada en las 3 imágenes compartidas (Tablas azules, campos de datos personales, médicos, bancarios y datos de la empresa).

## Backend: Extracción de Datos y Generación
El formato se divide en tres partes: Header, Datos del Colaborador, Datos de la Empresa.

### 1. Extracción de Datos (`RequestEmployeeRegisterAppService`)
Crear el método `ExportHiringFormatPdfAsync(Guid id)` que haga un query a `RequestEmployeeRegister` incluyendo las relaciones necesarias:
- `Employee` (o `Candidate` si los datos médicos/bancarios están ahí en etapa de reclutamiento). Específicamente necesitamos:
  - `PersonData` (Nombre, RFC, CURP, NSS, Dirección, Estado Civil).
  - `EmployeeBankData` (Banco, Cuenta, CLABE).
  - `EmployeeEmergencyContact` (Nombre, Tel, Parentesco).
  - `EmployeeClinicalData` (Alergias, Enfermedades).
- `RequestPosition` -> `WorkPosition` -> `Customer` (Empresa), `Address` (Dirección de trabajo), Sueldo, etc.

### 2. Generación con QuestPDF
Crear un generador usando el API fluente de QuestPDF (`Document.Create(container => ...)`).
- **Estilos:** Usar `#0b3164` (Color principal de Luxury) para los headers de las tablas.
- **Estructura:** Construir las tablas (Table) con las columnas correspondientes para emular el layout del "Formato de Alta del Trabajador".
- **Return:** El endpoint devolverá un `FileStreamResult` o un `FileContentResult` con `application/pdf`.

## Frontend: Integración en la UI
En `solicitud-alta-list.html` y `.ts`:
1. En el Action Menu móvil y en los botones de escritorio (`<td class="no-print"> <div class="flex gap-1">`), agregar un botón para descargar PDF.
   - Ejemplo Escritorio: `<iw-button iconClass="material-symbols-light:picture-as-pdf" severity="danger" (clicked)="onDownloadPdf(item)" pTooltip="Descargar Formato de Alta" />`
   - Ejemplo Móvil: `<ili-button (clicked)="onDownloadPdf(item)" label="Descargar Formato" iconClass="material-symbols-light:picture-as-pdf" />`
2. En `solicitud-alta-list.ts`:
   - Implementar `onDownloadPdf(item)` que construya la URL al nuevo endpoint y use `window.open(url, '_blank')` o haga un GET por HttpClient (si requiere Auth) para parsear el Blob y guardarlo con `FileSaver`.
