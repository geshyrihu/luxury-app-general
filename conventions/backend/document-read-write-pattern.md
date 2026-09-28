# Document Read/Write Pattern

**Ultima revision:** 2026-08-05

---

## Objetivo

Definir el patrón canónico y obligatorio para leer, escribir y acceder a documentos
en toda la arquitectura backend y frontend. Evitar exposición de rutas físicas,
hardcoding, y reutilizar servicios compartidos oficiales.

---

## Regla Base

**Separación estricta:**

- **Lectura (IFileReadPathService):** genera URLs seguras para el frontend
- **Escritura (IFileWritePathService):** genera rutas físicas para almacenamiento
- **Almacenamiento (ISecureFileStorageService):** persiste archivos físicamente

**Nunca exponer rutas físicas al frontend.** El frontend solo consume URLs seguras.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (Angular)                  │
│  - Consume URLs seguras: /api/files/download?filePath=.. │
│  - NO ve rutas físicas: C:\private\customer\...          │
│  - PdfViewerModal, ImageViewer aceptan solo URLs         │
└─────────────────────────────────────────────────────────┘
                           ↑ (URL segura)
                           │
┌─────────────────────────────────────────────────────────┐
│                      BACKEND (.NET)                      │
│                                                          │
│  IFileReadPathService       IFileWritePathService        │
│  ├─ GetDocumentTypeDirectoryPath()                       │
│  ├─ GetToolPhotoPath()      ├─ DocumentTypeDirectory()   │
│  └─ 50+ métodos URL         └─ 40+ métodos path         │
│       ↓ (URL segura)             ↓ (ruta física)        │
│   GET /api/files/download   ISecureFileStorageService   │
│       ↓                          ↓                       │
│   (AuthZ check)             SaveAsync()                 │
│   (Lee de disco)            DeleteFile()                │
│                             (Modifica disco)            │
└─────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  File System  │
                    │  /private/    │
                    │  /public/     │
                    └──────────────┘
```

---

## Familia de Servicios Compartidos

### IFileReadPathService

**Ubicación:** `api/LuxuryApp.Application/Shared/Services/IFileReadPathService.cs`

**Responsabilidad:** Genera URLs seguras para acceso de lectura.

**Métodos canónicos por caso de uso:**

| Caso de Uso | Método |
|---|---|
| Documentos por tipo (ActaConstitutiva, Asambleas, etc.) | `GetDocumentTypeDirectoryPath(customerId, DocumentType, docName)` |
| Fotos de herramientas | `GetToolPhotoPath(customerId, photoPath)` |
| Fotos de maquinaria | `GetMachineyPhotoPath(customerId, photoPath)` |
| Documentos de pólizas | `GetContratoPolizaFilePath(customerId, docName)` |
| Documentos generales | `GetDocumentosFilePath(customerId, docName)` |
| Fotos de perfil (usuario, cliente, proveedor) | `GetApplicationUserPhotoPath()`, `GetCustomerPhotoPath()`, `GetProviderPhotoPath()` |
| Imágenes de inspección | `GetInspectionImagePhotoPath(customerId, photoPath)` |
| Attachments de comunicados | `GetAnnoucementFilePath(annoncementId, fileName)` |
| Archivos de compra | `GetPurchaseRequestFilePath(customerId, purchaseRequestId, fileName)` |
| Evidencias de nómina | `GetNominaEvidenceFilePath(userId, fileName)` |

**Comportamiento interno:**

```csharp
public string GetDocumentTypeDirectoryPath(Guid customerId, DocumentType type, string documentName)
{
    // 1. Mapear enum a carpeta
    var folder = type.ToFolderName();  // "asambleas", "building-documents", etc.
    
    // 2. Resolver ruta relativa usando IFileStructureResolver
    var relativePath = resolver.GetCustomerPath(customerId, FileDirectories.Modules.Library, folder, documentName);
    
    // 3. Generar URL segura mediante endpoint de descarga
    return GetSecureFileUrl(relativePath);
    // Resultado: /api/files/download?filePath=%2Fclient%2Fasambleas%2F...
}

private string GetSecureFileUrl(string relativePath)
{
    if (string.IsNullOrEmpty(relativePath)) return string.Empty;
    
    var urlRelativePath = relativePath.Replace("\\", "/");
    var encodedPath = HttpUtility.UrlEncode(urlRelativePath);
    return $"{BaseUrl}/api/files/download?filePath={encodedPath}";
}
```

**Ventajas:**

- ✅ URL segura: encodificada y validada por endpoint
- ✅ Sin exposición de estructura de carpetas físicas
- ✅ Permite auditoría de acceso centralizada
- ✅ Cambiar estructura física sin romper frontend

---

### IFileWritePathService

**Ubicación:** `api/LuxuryApp.Application/Shared/Services/IFileWritePathService.cs`

**Responsabilidad:** Genera rutas físicas para escritura/borrado en disco.

**Métodos canónicos:**

| Caso de Uso | Método |
|---|---|
| Ruta física de documentos por tipo | `DocumentTypeDirectory(customerId, DocumentType)` |
| Ruta física de fotos de herramientas | `ToolDirectory(customerId)` |
| Ruta física de pólizas | `ContratoPolizaDirectory(customerId)` |
| Ruta física de archivos de compra | `PurchaseRequestDirectory(customerId, purchaseRequestId)` |

**Comportamiento interno:**

```csharp
public string DocumentTypeDirectory(Guid customerId, DocumentType documentType)
{
    var folder = documentType.ToFolderName();
    return Path.Combine(
        _settings.PrivatePath,           // C:\private\ o /var/private/
        "customers",
        customerId.ToString(),
        "library",
        folder
    );
}
```

**Uso:** Solo en servicios de almacenamiento (ISecureFileStorageService).

---

### ISecureFileStorageService

**Ubicación:** `api/LuxuryApp.Application/Shared/Services/FileStorageService.cs` (implementa la interfaz `ISecureFileStorageService`, misma carpeta)

**Responsabilidad:** Persiste archivos en disco. Valida, crea carpetas, maneja errores.

**Métodos:**

```csharp
public async Task<string> SaveAsync(IFormFile file, string directory)
{
    // 1. Validar archivo
    if (file == null || file.Length == 0)
        throw new BusinessException("Archivo requerido.", "FILE_REQUIRED", 400);
    
    // 2. Generar nombre único
    var fileName = GenerateUniqueFileName(file.FileName);
    
    // 3. Crear directorio si no existe
    Directory.CreateDirectory(directory);
    
    // 4. Escribir archivo
    var filePath = Path.Combine(directory, fileName);
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    // 5. Retornar nombre relativo guardado en BD
    return fileName;
}

public void DeleteFile(string directory, string fileName)
{
    var filePath = Path.Combine(directory, fileName);
    if (File.Exists(filePath))
        File.Delete(filePath);
}
```

---

## Patrón de Lectura: Backend → Frontend

### Paso 1: Backend obtiene documento de BD

```csharp
// CustomDocumentAppService.cs
public async Task<ApiResponseDTO<List<object>>> GetAllByCustomerAsync(Guid customerId, DocumentType documentType)
{
    var documents = await dbContext.CustomDocument
        .Where(d => d.CustomerId == customerId && d.DocumentType == documentType)
        .ToListAsync();
    
    // Solo el nombre/ruta relativa está en BD
    return documents;
}
```

**Lo que se almacena en BD:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acta Asamblea 2026",
  "path": "acta-2026-02-15.pdf",        // ← Solo nombre relativo
  "folio": "ASM-2026-001",
  "createdAt": "2026-02-15",
  "customerId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Paso 2: Backend construye URL segura

```csharp
// En el mismo GetAllByCustomerAsync o servicio de respuesta
var result = documents.Select(d => new
{
    d.Id,
    d.Name,
    d.Folio,
    path: fileReadPathService.GetDocumentTypeDirectoryPath(
        d.CustomerId,
        d.DocumentType,
        d.Path  // Pasar nombre relativo
    ),
    d.CreatedAt
}).ToList();

return ApiResponseDTO<List<object>>.SuccessResult(result);
```

**Lo que se envía al frontend:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acta Asamblea 2026",
  "folio": "ASM-2026-001",
  "createdAt": "2026-02-15",
  "path": "/api/files/download?filePath=%2Fclient%2F123e%2Flib%2Fasambleas%2Facta-2026-02-15.pdf"
                                                      ↑ URL segura, codificada
}
```

### Paso 3: Frontend consume URL directamente

```typescript
// biblioteca-consejo-directivo-detalle.ts
onLoadData() {
  const urlApi = Endpoints.Committee.Library.customDocumentsByType(customerId, documentType);
  
  this.apiResponseS.onGetList(urlApi).then((result: any[]) => {
    const mappedData = result.map((x: any) => ({
      id: x.id,
      name: x.name,
      path: x.path,  // ← URL segura del backend
      folio: x.folio,
      date: x.createAt
    }));
    this.dataSignal.set(mappedData);
  });
}

viewPdf(url: string, fileName: string): void {
  // Abrir en modal con URL segura
  this.dialogHandlerS.openDialog(
    PdfViewerModal,
    { pdfSrc: url, fileName: fileName },  // url = URL segura
    fileName,
    this.dialogHandlerS.sizeFull,
    true
  );
}
```

**Frontend NUNCA:**
- ❌ Construye rutas `/customer/123/private/...`
- ❌ Hace `fetch('/file?path=C:\\private\\customer\\...')`
- ❌ Accede a `/api/storage/{customerId}/{type}/{name}`

---

## Patrón de Escritura: Frontend → Backend → Disco

### Paso 1: Frontend envía archivo (IFormFile)

> 🔴 **REQUISITO PREVIO — endpoint con `[FromForm]`:** El endpoint Minimal API
> que recibe este FormData DEBE declarar `[FromForm]` en su parámetro DTO
> (desde .NET 7; obligatorio en este stack). Sin `[FromForm]`, ASP.NET Core
> asume cuerpo JSON y responde **HTTP 415 Unsupported Media Type** con
> `content-length: 0`, aunque la petición multipart esté perfectamente formada.
> Añadir también `.DisableAntiforgery()`. Ver regla crítica en
> `backend-rules.md` (§ Multipart/form-data presupone [FromForm]).

```typescript
// formulario-document-add.component.ts
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validación básica en frontend (UX, no seguridad)
  if (file.size > 10 * 1024 * 1024) { // 10MB
    this.dialogHandler.openNotification('Archivo muy grande', 'error');
    return;
  }
  
  // Enviar a backend
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', this.documentType);
  
  this.apiResponseService.onPost(
    Endpoints.Committee.Library.addCustomDocument(this.customerId),
    formData
  ).then(() => {
    this.loadDocuments();
  });
}
```

### Paso 2: Backend recibe, valida y almacena

```csharp
// CustomDocumentAppService.cs
public async Task<ApiResponseDTO<DocumentLegalRecordCreatedDTO>> AddAsync(
    DocumentLegalRecordAddOrEditDTO dto)
{
    // 1. Validar archivo
    if (dto.Document is null)
        throw new BusinessException("El documento es requerido.", "DOCUMENT_REQUIRED", 400);
    
    // 2. Obtener ruta física de escritura
    var directory = fileWritePathService.DocumentTypeDirectory(
        dto.CustomerId,
        dto.DocumentType
    );
    // Resultado: C:\private\customers\123e4567\library\asambleas
    
    // 3. Almacenar archivo en disco
    var fileName = await fileStorageService.SaveAsync(dto.Document, directory);
    // Resultado: "acta-2026-02-15-uuid.pdf"
    
    // 4. Guardar SOLO nombre relativo en BD
    var document = new CustomDocument
    {
        CustomerId = dto.CustomerId,
        Name = dto.Name,
        DocumentType = dto.DocumentType,
        Path = fileName,  // Solo nombre, no ruta completa
        Folio = await generateFolioService.OnGenerateDocumentLegalRecord(dto.CustomerId)
    };
    
    await dbContext.CustomDocument.AddAsync(document);
    await dbContext.SaveChangesAsync();
    
    return ApiResponseDTO<DocumentLegalRecordCreatedDTO>.SuccessResult(
        new { Id = document.Id, Name = document.Name, Folio = document.Folio },
        "Documento creado con éxito."
    );
}
```

---

## Patrón de Actualización: Frontend → Backend → Reemplazo

### Caso 1: Reemplazar archivo existente (UpdateAsync)

```csharp
// MachineryAppService.cs - Actualizar entidad que ya tiene imagen
public async Task<ApiResponseDTO<Equipment>> UpdateAsync(Guid id, MachineryAddOrEditDTO DTO)
{
    var entity = await dbContext.Equipment.FirstOrDefaultAsync(x => x.Id == id);
    if (entity == null) return ApiResponseDTO<Equipment>.ErrorResult("No encontrado", 404);

    if (DTO.PhotoPath != null)
    {
        string path = fileWritePathService.MachineryDirectory(DTO.CustomerId);
        string nameFile = imageRepository.Save(DTO.PhotoPath, path, 600, 600);
        
        // ✅ CRÍTICO: Eliminar archivo anterior si existe
        if (entity.PhotoPath != null)
        {
            await imageRepository.DeleteAsync(path, entity.PhotoPath);
        }
        
        entity.PhotoPath = nameFile;
    }

    dbContext.Equipment.Update(entity);
    await dbContext.SaveChangesAsync();
    return ApiResponseDTO<Equipment>.SuccessResult(entity);
}
```

**Orden crítico:**
1. Generar nuevo nombre único
2. Guardar nuevo archivo
3. Eliminar antiguo (si existe)
4. Actualizar BD

Si cambias orden → archivo orfano en disco o error.

---

### Caso 2: Agregar archivo a entidad existente (AddFileAsync)

**Para módulos con múltiples archivos (Presentación: Portada, Contabilidad, Conclusiones, etc.):**

```csharp
// PresentacionJuntaComiteAppService.cs - Agregar archivo a entidad por área
public async Task<ApiResponseDTO<PresentacionJuntaComite>> AddFileAsync(PresentacionJuntaComiteAddPdf DTO)
{
    var entity = await dbContext.PresentacionJuntaComite.FirstOrDefaultAsync(x => x.Id == DTO.Id);
    if (entity is null) return ApiResponseDTO<PresentacionJuntaComite>.ErrorResult("No encontrada", 404);

    if (DTO.Area == "Portada" && DTO.Archivo != null)
    {
        // 1. Eliminar anterior si existe
        if (entity.ArchivoPortada != null)
        {
            string pathFile = fileWritePathService.PresentacionDirectory(
                entity.CustomerId, 
                entity.Id.ToString()
            );
            fileStorageService.DeleteFile(pathFile, entity.ArchivoPortada);
        }

        // 2. Guardar nuevo
        string path = fileWritePathService.PresentacionDirectory(
            entity.CustomerId, 
            entity.Id.ToString()
        );
        string nameFile = await fileStorageService.SaveAsync(DTO.Archivo, path, DTO.Area);
        
        // 3. Actualizar propiedades de la entidad
        entity.ArchivoPortada = nameFile;
        entity.ApplicationUserPortadaId = DTO.ApplicationUserId;
        entity.FechaCargaPortada = DateTime.UtcNow;
    }

    // Similar para DTO.Area == "Contabilidad", "Conclusiones", etc.

    dbContext.PresentacionJuntaComite.Update(entity);
    await dbContext.SaveChangesAsync();
    return ApiResponseDTO<PresentacionJuntaComite>.SuccessResult(entity);
}
```

---

## Patrón de Eliminación: DeleteAsync (entidad + archivo en disco)

🔴 **CRÍTICA:** borrar una entidad con archivo implica SIEMPRE borrar el archivo de disco. Sin eso queda basura.

**Orden obligatorio:** Transacción → Dependencias → BD → Commit → Archivo → Logging. El archivo se borra **después** del commit para que, si la BD falla, no se pierda el archivo.

```csharp
// ✅ CORRECTO (CustomDocumentAppService)
public async Task<ApiResponseDTO<bool>> DeleteAsync(Guid id)
{
    // 1. Transacción
    await using var transaction = await dbContext.Database.BeginTransactionAsync();

    try
    {
        var document = await dbContext.CustomDocument.FindAsync(id);
        if (document == null) throw new BusinessException("No encontrado", 404);

        // 2. Borrar dependencias (FK)
        var roles = await dbContext.CustomDocumentRole
            .Where(x => x.DocumentId == id).ToListAsync();
        if (roles.Count != 0) dbContext.CustomDocumentRole.RemoveRange(roles);

        // 3. Borrar entidad
        dbContext.CustomDocument.Remove(document);
        await dbContext.SaveChangesAsync();

        // 4. Commit (BD limpia antes de tocar disco)
        await transaction.CommitAsync();

        // 5. DESPUÉS de la transacción, borrar archivo
        var filePath = fileWritePathService.DocumentTypeDirectory(
            document.CustomerId, document.DocumentType
        );
        fileStorageService.DeleteFile(filePath, document.Path);

        return ApiResponseDTO<bool>.SuccessResult(true, "Eliminado");
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        logger.LogError(ex, "Error eliminar {Id}", id);  // Logging CRÍTICO
        throw;
    }
}
```

❌ **Catch vacío:** prohibido. Hallazgo real: `MachineryAppService.DeleteAsync` (catch vacío y sin transacción).

## Diferencia: IImageStorageService vs ISecureFileStorageService

| Aspecto | IImageStorageService | ISecureFileStorageService |
|---|---|---|
| Tipo archivo | Imágenes (.jpg, .png, .webp) | Cualquier documento (.pdf, .xlsx, .doc, etc.) |
| Procesamiento | Redimensiona (e.g., 600x600) | No procesa, guarda como está |
| Métodos | `Save()`, `DeleteAsync()` | `SaveAsync()`, `DeleteFile()` |
| Validación | MIME type imagen | MIME type genérico |
| Uso | Machinery, Inspection, Profiles | CustomDocument, Presentación, Purchases |

**Regla:** Si el módulo trata IMÁGENES con redimensionamiento → `IImageStorageService`. Si trata DOCUMENTOS genéricos → `ISecureFileStorageService`.

---

## Prohibiciones Explícitas

### ❌ No hardcodear rutas físicas

```csharp
// PROHIBIDO
var path = $"C:\\private\\customers\\{customerId}\\documents\\{fileName}";

// ✅ CORRECTO
var path = fileWritePathService.DocumentTypeDirectory(customerId, documentType);
```

### ❌ No exponer rutas físicas al frontend

```typescript
// PROHIBIDO: Backend devuelve ruta física
{
  "path": "C:\\private\\customer\\123\\library\\asambleas\\acta.pdf"
}

// ✅ CORRECTO: Backend devuelve URL segura
{
  "path": "/api/files/download?filePath=%2Fclient%2F123%2Flib%2Fasambleas%2Facta.pdf"
}
```

### ❌ No crear métodos paralelos de IFileReadPathService

```csharp
// PROHIBIDO: Crear nuevo método ad-hoc
public string GetCustomDocumentPath(Guid customerId, string docName)
{
    return $"/api/custom-document-download/{customerId}/{docName}";
}

// ✅ CORRECTO: Usar o extender servicio oficial
fileReadPathService.GetDocumentTypeDirectoryPath(customerId, DocumentType.Asambleas, docName);
```

### ❌ No mezclar lectura y escritura en un mismo servicio

```csharp
// PROHIBIDO: Un servicio que hace ambas cosas
public class FileService
{
    public string GetPath() { ... }      // Lectura
    public void SaveFile() { ... }       // Escritura
}

// ✅ CORRECTO: Separar interfaces
IFileReadPathService    // Solo lectura → URLs
IFileWritePathService   // Solo escritura → rutas físicas
ISecureFileStorageService  // Almacenamiento
```

### ❌ No validar tipos de archivo en frontend sin backend

```typescript
// INSUFICIENTE: Validar solo en JavaScript
if (!file.name.endsWith('.pdf')) {
  // Rechazar
}

// ✅ CORRECTO: Backend valida también
IFileValidatorService.ValidateFileAsync(file);
```

---

## Checklist de Implementación

Cuando creés un nuevo módulo que maneja documentos:

- [ ] ¿Usas `IFileReadPathService` para generar URLs?
- [ ] ¿Usas `IFileWritePathService` para rutas de escritura?
- [ ] ¿Usas `ISecureFileStorageService` para persistencia?
- [ ] ¿Guardas en BD solo nombre relativo, no ruta completa?
- [ ] ¿El frontend recibe URL segura, no ruta física?
- [ ] ¿Validás archivos en backend con `IFileValidatorService`?
- [ ] ¿Los enums `DocumentType` mapean correctamente con `ToFolderName()`?
- [ ] ¿Seguís nomenclatura de carpetas existentes (kebab-case)?

---

## Auditoría

Marcadores críticos de incumplimiento:

| Hallazgo | Severidad | Referencia |
|---|---|---|
| Endpoint que devuelve `Path = "C:\..."` | CRÍTICA | §2 Prohibiciones |
| Método `Get*Path()` que no usa servicios oficiales | CRÍTICA | §3.1 / §3.2 |
| Documento guardado en BD con ruta completa | CRÍTICA | §4 Patrón Lectura |
| Frontend que construye URL de acceso directo | CRÍTICA | §4.3 |
| Múltiples métodos `GetDocumentPath()` en módulos | ALTA | §5.2 Prohibición |
| `IFormFile` validado solo en frontend | ALTA | §5.3 Prohibición |

---

## Referencias

- [Document Display Pattern](../frontend/document-display-pattern.md) — **LECTURA OBLIGATORIA**: cómo mostrar documentos en UI (WebButtonIconViewPdf, PdfViewerModal, nombres legibles)
- Backend Shared Services Catalog — ver [`CONVENTIONS_FOLDER_API.MD`](../CONVENTIONS_FOLDER_API.MD) §12 (documento eliminado 2026-09-09, asumía proyectos separados que ya no existen)
- [Backend Prohibitions](./backend-prohibitions.md) — patrones no permitidos
- [Backend Rules](./backend-rules.md) — reglas generales de codificación
- [CONVENTIONS.md](../CONVENTIONS.md) — Sistema rector

---

## Cambios Recientes

| Fecha | Cambio |
|---|---|
| 2026-08-05 | Creación inicial: patrón lectura/escritura documentos |

