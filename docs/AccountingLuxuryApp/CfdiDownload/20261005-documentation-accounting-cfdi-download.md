# Documentación Técnica (Nivel 2) — Descarga Masiva de CFDI del SAT

**Nivel 2** (CONVENTIONS.md §4.7, doc #2). Ubicación real exigida: `api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/Docs/documentacion-cfdi-download.md`; por instrucción del Tech Lead, vive aquí.

## Resumen ejecutivo

El módulo integra `Fiscalapi.XmlDownloader` (ya instalado, sin uso previo) para hablar con el WebService de Descarga Masiva del SAT. Cada customer carga su e.firma una vez; a partir de ahí puede solicitar descargas de CFDI recibidos por rango de fechas, verificar su avance, y consultar el repositorio resultante con exportación a PDF/Excel. Un padrón EFOS importado manualmente se cruza automáticamente contra cada CFDI nuevo (y retroactivamente contra los existentes cuando se reimporta el padrón).

## Arquitectura técnica

### Modelo de datos (ERD simplificado)

```
Customer (1) ──── (0..1) CustomerSatCredential
Customer (1) ──── (N) SatDownloadRequest ──── (N) SatDownloadPackage ──── (N) SatCfdiRecibido
                                                                              │
                                                                              ├── (N) CfdiRelacionado
                                                                              └── (0..1) Provider  [vínculo opcional por RFC]

EfosRecord (global, sin FK a Customer) ──cruce en memoria por Rfc──> SatCfdiRecibido.EfosEstado
```

### Pipeline de descarga (detalle técnico)

```
RequestDownloadAsync(customerId, dto)
  1. Valida FechaInicio < FechaFin
  2. LoadCredentialAsync(customerId)
     → lee .cer de disco (Base64) + .key/.password del Vault (ISecretProvider.GetSecretAsync, sin restricción de rol)
  3. xmlDownloaderService.AuthenticateAsync(cerBase64, keyBase64, password)
  4. QueryParameters { RequestType=CFDI, RequesterTin=Customer.RFC, IssuerTin=null (⇒ Recibidos),
                        InvoiceStatus=Vigente, StartDate, EndDate }
  5. xmlDownloaderService.CreateRequestAsync(parameters) → SatRequestId
  6. Persiste SatDownloadRequest { EstadoSolicitud = EnProceso | Fallida }

CheckStatusAsync(customerId, satDownloadRequestId)   [idempotente, repetible]
  1. Busca SatDownloadRequest WHERE Id = x AND CustomerId = customerId   ← filtro de tenant obligatorio (R7)
  2. Si Descargada|Fallida → regresa sin reprocesar
  3. Re-autentica (mismo LoadCredentialAsync)
  4. xmlDownloaderService.VerifyAsync(SatRequestId)
  5. switch RequestStatus:
       Rechazada|Error|Vencida → Fallida
       Aceptada|EnProceso      → EnProceso (el cliente debe volver a llamar después)
       Terminada               → DownloadAndReconcilePackagesAsync(...)

DownloadAndReconcilePackagesAsync(request, verifyResponse)
  por cada PackageId en verifyResponse.PackageIds:
    1. xmlDownloaderService.DownloadAsync(packageId) → DownloadResponse (ZIP en memoria)
    2. Escribe el ZIP a disco (trazabilidad/auditoría)
    3. xmlDownloaderService.GetComprobantesAsync(downloadResponse) → IAsyncEnumerable<ComprobanteResult>
       por cada resultado:
         a. Si !Succeeded → package.CfdiConError++
         b. SatCfdiParser.Parse(comprobante) → SatCfdiParsedData
         c. Si parsed.UUID vacío → package.CfdiConError++ (sin Timbre Fiscal Digital)
         d. Escribe comprobanteResult.RawXml a disco (el XML ORIGINAL, no reconstruido)
         e. SatCfdiReconciliationService.ReconcileAsync(...) → Insertado | YaExistia | Error
            → incrementa package.CfdiExitosos / CfdiDuplicados / CfdiConError
  request.EstadoSolicitud = Descargada
```

## Endpoints documentados (los 4 más relevantes)

### `POST api/accounting/cfdi-download/requests/{customerId}`

Body:
```json
{ "fechaInicio": "2026-01-01T00:00:00", "fechaFin": "2026-03-31T00:00:00" }
```
Respuesta (`ApiResponseDTO<SatDownloadRequestDTO>`):
```json
{
  "success": true,
  "message": "Solicitud enviada al SAT. Consulta el estado en unos minutos.",
  "data": { "id": "...", "estadoSolicitud": "EnProceso", "cfdiNuevos": 0, "cfdiYaExistian": 0, "cfdiConError": 0, ... }
}
```

### `GET api/accounting/cfdi-download/requests/{customerId}/{satDownloadRequestId}/status`

Mismo contrato de respuesta que arriba; `estadoSolicitud` avanza según el pipeline descrito. Cuando llega a `"Descargada"`, `cfdiNuevos`/`cfdiYaExistian`/`cfdiConError` reflejan el resultado real agregado de todos los paquetes.

### `GET api/accounting/cfdi-download/cfdi/{customerId}?fechaInicio=...&fechaFin=...`

Respuesta: `ApiResponseDTO<SatCfdiRecibidoDTO[]>` — ver catálogo de campos en el README.

### `POST api/accounting/cfdi-download/credential/{customerId}` (multipart/form-data)

Campos: `CerFile` (archivo), `KeyFile` (archivo), `Password` (texto). Respuesta: `ApiResponseDTO<CustomerSatCredentialDTO>` — nunca incluye el valor de la llave ni la contraseña.

## Entidades y propiedades (resumen — ver arquitectura para el detalle completo)

| Entidad | Propiedades clave |
|---|---|
| `CustomerSatCredential` | `CustomerId` (único), `RfcValidado`, `CertificadoPath`, `LlaveVaultSecretName`, `PasswordVaultSecretName`, `VigenciaDesde/Hasta` |
| `SatDownloadRequest` | `CustomerId`, `FechaInicio/Fin`, `EstadoSolicitud`, `SatRequestId`, `MensajeSat`, `IntentosVerificacion` |
| `SatDownloadPackage` | `SatDownloadRequestId`, `SatPackageId`, `RutaZip`, `CfdiExitosos`, `CfdiDuplicados`, `CfdiConError` |
| `SatCfdiRecibido` | `UUID` (único con `CustomerId`), `RfcEmisor/NombreEmisor`, montos (SubTotal/IVA/Total/Retenciones), `FormaPago/MetodoPago/UsoCFDI`, `EstadoSat`, `EfosEstado`, `XmlPath/PdfPath`, `ProviderId` (opcional) |
| `CfdiRelacionado` | `SatCfdiRecibidoId`, `UuidRelacionado`, `TipoRelacion` |
| `EfosRecord` | `Rfc` (único global), `NombreContribuyente`, `Situacion`, `FechaPublicacion`, `FechaActualizacionImport` |

## Servicios y métodos clave

| Servicio | Método | Qué hace |
|---|---|---|
| `CustomerSatCredentialAppService` | `UploadAsync` | Valida FIEL/vigencia/RFC, guarda Vault→disco→BD en ese orden (evita huérfanos) |
| `SatDownloadAppService` | `RequestDownloadAsync`, `CheckStatusAsync` | Orquestación completa (ver pipeline arriba) |
| `SatCfdiParser` | `Parse` | Extrae ~20 campos de un `Comprobante`, incluye manejo de catálogos numéricos (`c_FormaPago`, `c_TipoRelacion`) vía reflexión de `XmlEnumAttribute` |
| `SatCfdiReconciliationService` | `ReconcileAsync` | Dedupe + cruce EFOS; maneja condición de carrera con `catch (DbUpdateException)` |
| `EfosImportAppService` | `ImportAsync` | Parser CSV propio (no asume layout fijo), re-evaluación retroactiva de CFDI ya guardados |

## Reglas de Negocio en código

Las 13 RN (`RN-CFD-001`-`033`) están mapeadas a ubicación de código real en el [documento de FASE 0](./20261004-business-rules-accounting-cfdi-download.md) — no se duplican aquí.

## Base de datos (índices, relaciones, constraints)

| Tabla | Índice | Tipo |
|---|---|---|
| `CustomerSatCredentials` | `CustomerId` | Único |
| `SatCfdiRecibidos` | `(CustomerId, UUID)` | Único |
| `EfosRecords` | `Rfc` | Único |
| `SatCfdiRecibidos` | `ProviderId`, `SatDownloadPackageId` | No únicos (FK) |

Todas las migraciones son aditivas (`CreateTable`/`CreateIndex`/`AddColumn` — verificado por inspección de cada migración generada). Cero `ALTER`/`DROP` sobre tablas preexistentes.

## Performance y caching

- `ISecretProvider.GetSecretAsync` ya cachea 5 minutos (infraestructura del Vault, no propia de este módulo).
- La importación EFOS procesa en lotes de 1,000 filas por `SaveChangesAsync` (evita un único `SaveChanges` gigante con decenas de miles de filas).
- Sin caching propio del módulo — el volumen esperado (10-11 customers) no lo justificó en v1 (ver R4, pendiente de validar con uso real).

## Checklist de validación

Ver [checklist de cierre](./20261005-checklist-accounting-cfdi-download.md) — cubre backend, frontend, pruebas y seguridad.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-04 | Construcción completa F1-F7 (entidades, servicios, endpoints, frontend, tests, corrección de R7) |
| 2026-10-05 | Documentación §4.6/§4.7 completa (este lote) |
