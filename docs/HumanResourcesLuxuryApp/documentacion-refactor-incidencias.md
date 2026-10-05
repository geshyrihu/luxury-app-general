# Refactor: IncidenciasAdministrativas — Abril 2026

Documento de referencia para retomar el trabajo en sesiones futuras.

---

## Resumen del cambio

Refactor completo del módulo de **Incidencias Administrativas** (backend .NET 10 + frontend Angular 22):

1. Limpieza del modelo `IncidentWitness` (eliminación de campos obsoletos)
2. Nueva entidad `SuspensionDay` con servicio y endpoints CRUD
3. Reescritura del PDF del acta administrativa (QuestPDF, Century Gothic, formato ejecutivo)
4. Campo `NumberEmployee` en datos laborales del empleado
5. Dos acciones de PDF en la lista: vista previa (sin persistir) y generación oficial (persiste)

---

## Cambios en entidades (Infrastructure)

### `IncidentWitness`
**Eliminados:** `Relationship`, `Email`, `DigitalSignaturePath`, `SignatureDate`  
**Conservados:** `FullName`, `Position`, `Phone`, `Statement`

### `Incident`
**Agregados:**
```csharp
public string? AdministrativeActPdfPath { get; set; }
public bool IsActGenerated { get; set; } = false;
public HashSet<SuspensionDay> SuspensionDays { get; set; } = [];
```

### `SuspensionDay` (NUEVA)
Archivo: `Infrastructure/Data/Entities/HR/IncidenciasAdministrativas/SuspensionDay.cs`
```csharp
[Table("SuspensionDay")]
public class SuspensionDay : GuidIdEntity, IAuditable
{
    public Guid IncidentId { get; set; }
    public Incident Incident { get; set; } = null!;
    public DateTime SuspensionDate { get; set; }  // almacenado a medianoche (fecha.Date)
    public string? Notes { get; set; }
}
```

### `EmployeeLaboralData` (vía DTO)
Archivo: `Features/Employees/Employees/DTOs/EmployeeLaboralDataEditDTO.cs`  
**Agregado:** `[Range(1, 9999)] public int? NumberEmployee { get; set; }`

---

## Migración EF Core

Nombre: `20260408020134_RefactorIncidencias`  
Aplica: eliminación de columnas de `IncidentWitness`, columnas nuevas en `Incident`, tabla nueva `SuspensionDay`.

---

## DTOs nuevos/modificados (Application)

| Archivo | Cambio |
|---|---|
| `IncidentWitnessAddOrEditDTO` | Eliminados: `Relationship`, `Email`, `DigitalSignatureBase64` |
| `IncidentWitnessListDTO` | Eliminados: `Relationship`, `Email`, `HasSignature`, `SignatureDate` |
| `IncidentWitnessDetailDTO` | Eliminado: `DigitalSignatureUrl` |
| `IncidentDetailDTO` | Agregados: `IsActGenerated`, `AdministrativeActPdfPath` |
| `SuspensionDayAddDTO` _(nuevo)_ | `IncidentId`, `List<DateTime> SuspensionDates`, `Notes?` |
| `SuspensionDayDetailDTO` _(nuevo)_ | `Id`, `IncidentId`, `SuspensionDate`, `Notes`, `CreatedAt` |

---

## Servicios nuevos/modificados (Application)

### `ISuspensionDayAppService` / `SuspensionDayAppService` (NUEVOS)
```csharp
Task<List<SuspensionDayDetailDTO>> GetByIncidentAsync(Guid incidentId);
Task AddBulkAsync(SuspensionDayAddDTO dto);
Task DeleteAsync(Guid id);
```
**Nota crítica EF Core:** las fechas se normalizan a medianoche en `AddBulkAsync` con `fecha.Date`. La consulta de duplicados usa `.Contains(x.SuspensionDate)` directamente — NO `.Contains(x.SuspensionDate.Date)` porque EF Core no puede traducir `.Date` dentro de `Contains()`.

### `IIncidentPdfService` / `IncidentPdfService`
**Métodos:**
- `GeneratePdfAsync(Guid incidentId)` → `byte[]` — genera PDF sin persistir
- `SavePdfAsync(Guid incidentId, string userId, byte[] pdfBytes)` → `string` (ruta relativa) — escribe en disco

**PDF ejecutivo 6 secciones:**
1. Encabezado con logo y datos de la empresa
2. Datos del empleado
3. Descripción de la incidencia
4. Testigos
5. Días de suspensión (agrupados por mes en español con formato "1, 2 y 3 de abril de 2026")
6. Firmas

**Configuración:** Century Gothic 10pt, títulos 14pt negrita, `CultureInfo("es-MX")`, `LicenseType.Community`.

### `IIncidentAppService` / `IncidentAppService`
**Agregado:** `Task<byte[]> GenerateActAsync(Guid id)`  
Genera PDF + guarda en disco + actualiza `Incident.IsActGenerated = true` + `Incident.AdministrativeActPdfPath`.

### `IncidentWitnessAppService`
Reescrito: eliminados `IFileWritePathService`, `IFileReadPathService`, toda lógica de firma digital.

### `EmployeeInternalAppService`
`GetLaboralDataAsync` y `UpdateLaboralDataAsync` manejan `NumberEmployee`.

---

## Controlador

### `IncidentController`
Nuevos endpoints:

| Método | Ruta | Acción |
|---|---|---|
| GET | `{id}/export-pdf` | Genera PDF en memoria, devuelve bytes (sin persistir) |
| GET | `{id}/generate-act` | Genera PDF, persiste en disco, descarga |
| GET | `{incidentId}/suspension-days` | Lista días de suspensión |
| POST | `{incidentId}/suspension-days` | Agrega días en bulk |
| DELETE | `suspension-days/{id}` | Elimina un día |

**Constructor:** agrega `ISuspensionDayAppService suspensionDayService`.

---

## DI Registration

Archivo: `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`
```csharp
services.AddScoped<ISuspensionDayAppService, SuspensionDayAppService>();
```

---

## Correcciones de compilación aplicadas

- **`OrdenCompraIndividualDTO.cs`**: texto `public HashSet<` huérfano dentro de comentario XML — eliminado.
- **`IncidentWitnessMigrator.cs`**: asignaciones a `Relationship`, `Email`, `DigitalSignaturePath`, `SignatureDate` — eliminadas (campos ya no existen en la entidad).

---

## Frontend Angular

### Interfaces (`incident.interfaces.ts`)
- `IncidentWitnessListDTO`, `IncidentWitnessDetailDTO`, `IncidentWitnessAddOrEditDTO`: eliminados campos de firma/relación/email
- `IncidentDetailDTO`: agregados `isActGenerated: boolean`, `administrativeActPdfPath?: string`
- `SuspensionDayDetailDTO` y `SuspensionDayAddDTO`: interfaces nuevas

### Endpoints (`endpoints.ts`)
```typescript
HR.Incident.exportPdf: (id) => `hr/incidents/${id}/export-pdf`
HR.Incident.generateAct: (id) => `hr/incidents/${id}/generate-act`
HR.Incident.suspensionDays.getByIncident: (incidentId) => ...
HR.Incident.suspensionDays.addBulk: (incidentId) => ...
HR.Incident.suspensionDays.delete: (id) => ...
```

### `ApiResponseService`
**Agregado:** `onPreviewPdf(urlApi: string): void`  
Obtiene el blob vía `dataConnectorS.getFile()`, crea `URL.createObjectURL(blob)` y lo abre con `window.open(url, '_blank')`. Revoca la URL después de 30 segundos.

### Componente `SuspensionDaysManager` (NUEVO)
Ruta: `features/employees/incident/components/suspension-days-manager/`

- `incidentId = input.required<string>()`
- `custom-input-date-signal` con `[mode]="'multiple'"` y `[disable]="disabledDates()"`
- `disabledDates` es un `computed()` que mapea los días ya registrados para bloquearlos en el picker
- En `addDays()`: valida duplicados localmente antes de llamar a la API; verifica `result !== false` antes de resetear el formulario

Insertado en `incident-form.html` dentro de `@if (id())`:
```html
<p-divider align="left"><span class="text-sm text-500">Días de Suspensión</span></p-divider>
<app-suspension-days-manager [incidentId]="id()" />
```

### `incident-witness-form.html` / `.ts`
Eliminados campos: "Relación con el Empleado", "Email", sección de firma digital.

### `employee-laboral-data-form.ts` / `.html`
Agregado campo `numberEmployee` con `custom-input-number-signal`, `[min]="1"`, `[max]="9999"`, `[useGrouping]="false"`.

### `incident-list.html` / `.ts`
Dos botones de PDF:
- **"Ver Acta"** → `onPreviewAct(item)` → `apiResponseS.onPreviewPdf(exportPdf endpoint)` — abre en pestaña nueva, no persiste
- **"Generar Acta"** → `onGenerateAct(item)` → `apiResponseS.onDownloadFile(generateAct endpoint)` — persiste en disco y descarga

---

## Notas para retomar

- La migración ya fue aplicada. No re-ejecutar `Add-Migration`.
- El PDF usa la ruta de archivos configurada en `IFileWritePathService` / `IFileReadPathService` — verificar que el directorio destino exista en el servidor.
- `custom-input-date-signal` soporta `mode="multiple"` y `disable: Date[]` (FlatpickrDirective).
- En `SuspensionDayAppService.AddBulkAsync`, las fechas se normalizan con `fecha.Date` para eliminar la parte de hora antes de insertarlas.
