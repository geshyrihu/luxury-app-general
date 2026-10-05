# Arquitectura — Descarga Masiva de CFDI del SAT

**Módulo:** `AccountingLuxuryApp / CfdiDownload`
**Fecha:** 2026-10-05 (documento de cierre de §4.6; el módulo se construyó el 2026-10-04)
**Nota de ubicación:** por instrucción explícita del Tech Lead, toda la documentación de este módulo (§4.6 y §4.7) vive en `docs/AccountingLuxuryApp/CfdiDownload/`, no en las rutas por-módulo que indica CONVENTIONS.md §4.7 (`api/.../Modules/.../README.md`, `appsweb/.../docs/*.md`).

Este documento consolida la arquitectura real construida (no es un diseño a futuro) descrita informalmente en el plan (§3); aquí queda como documento independiente, con rutas exactas verificadas.

---

## 1. Visión general

El módulo descarga CFDI **recibidos** (D10) del SAT para el RFC del customer en contexto, usando la e.firma cargada por el customer. Cuatro piezas de datos conviven:

1. **Credencial** (`CustomerSatCredential`) — la e.firma, 1:1 con el customer.
2. **Ciclo de descarga** (`SatDownloadRequest` → `SatDownloadPackage`) — el flujo Autenticar→Solicitar→Verificar→Descargar del SAT.
3. **Repositorio** (`SatCfdiRecibido` + `CfdiRelacionado`) — los CFDI ya descargados, deduplicados por UUID.
4. **Padrón EFOS** (`EfosRecord`) — catálogo global, importado manualmente, cruzado contra cada CFDI.

## 2. Entidades (6, todas en `Infrastructure/Data/Entities/AccountingLuxuryApp/CfdiDownload/`)

| Entidad | Archivo | Tabla | Tenant | Único por |
|---|---|---|---|---|
| `CustomerSatCredential` | `CustomerSatCredential.cs` | `CustomerSatCredentials` | `ITenantEntity` | `CustomerId` (índice único) |
| `SatDownloadRequest` | `SatDownloadRequest.cs` | `SatDownloadRequests` | `ITenantEntity` | — |
| `SatDownloadPackage` | `SatDownloadPackage.cs` | `SatDownloadPackages` | `ITenantEntity` (duplicado a propósito, ver nota) | — |
| `SatCfdiRecibido` | `SatCfdiRecibido.cs` | `SatCfdiRecibidos` | `ITenantEntity` | `(CustomerId, UUID)` (índice único) |
| `CfdiRelacionado` | `CfdiRelacionado.cs` | `SatCfdiRelacionados` | `ITenantEntity` (duplicado) | — |
| `EfosRecord` | `EfosRecord.cs` | `EfosRecords` | **Sin tenant** (catálogo global) | `Rfc` (índice único) |

**Nota crítica de arquitectura (verificada leyendo `ApplicationDbContext.cs` en F1):** `ITenantEntity` **no** aplica un filtro global automático de EF Core en este repositorio — es un marcador que cada servicio debe respetar explícitamente con `.Where(x => x.CustomerId == customerId)`. `SatDownloadPackage` y `CfdiRelacionado` duplican `CustomerId` (heredable vía su FK al padre) precisamente para que una consulta directa sobre esas tablas no pueda "olvidar" el filtro de tenant por error.

Todas las entidades (salvo `CfdiRelacionado`) implementan `IAuditable` (`CreatedAt/By`, `UpdatedAt/By`) — y heredan gratis el log de auditoría global por campo que ya aplica `ApplicationDbContext.AplicarCamposAuditoria()` a toda entidad `IAuditable` del sistema.

## 3. Enums (`Shared/Enums/`)

| Enum | Valores | Uso |
|---|---|---|
| `SatDownloadRequestStatus` | Creada, Autenticando, EnProceso, Lista, Fallida, Descargada | Estado de `SatDownloadRequest` |
| `CfdiSatStatus` | Vigente, Cancelado, NoEncontrado | Estado de `SatCfdiRecibido` (en la práctica, siempre `Vigente` — ver §5) |
| `EfosSituacion` | Presunto, Definitivo, Desvirtuado, SentenciaFavorable | Situación de `EfosRecord` |

## 4. Servicios (`Modules/AccountingLuxuryApp/CfdiDownload/Services/`)

| Servicio | Responsabilidad | Dependencias externas clave |
|---|---|---|
| `CustomerSatCredentialAppService` | Cargar/reemplazar e.firma; valida FIEL, vigencia, RFC | `Fiscalapi.Credentials.Core` (Certificate/PrivateKey/Credential), `ISecretProvider` (Vault) |
| `SatDownloadAppService` | Orquesta Autenticar→Solicitar→Verificar→Descargar | `IXmlDownloaderService` (`Fiscalapi.XmlDownloader`) |
| `SatCfdiParser` | Extrae datos de un `Comprobante` (CFDI 4.0) ya deserializado | `Fiscalapi.XmlDownloader.Common.Models` |
| `SatCfdiReconciliationService` | Dedupe por UUID + cruce EFOS al insertar | — |
| `SatCfdiQueryAppService` | Listado/detalle de CFDI | — |
| `SatCfdiPdfExportService` | PDF por CFDI (estático) | `QuestPDF` |
| `SatCfdiExcelExportService` | Excel del listado (estático) | `ClosedXML` |
| `EfosImportAppService` | Importación manual del padrón EFOS (CSV) | — |

## 5. Flujo de descarga (end-to-end)

```
Usuario (8 roles) → POST .../requests/{customerId}
  → SatDownloadAppService.RequestDownloadAsync
    → LoadCredentialAsync (lee .cer de disco + .key/password del Vault)
    → IXmlDownloaderService.AuthenticateAsync
    → IXmlDownloaderService.CreateRequestAsync (QueryType.CFDI, IssuerTin=null → Recibidos, InvoiceStatus=Vigente)
    → Guarda SatDownloadRequest (EstadoSolicitud = EnProceso)

Usuario → GET .../requests/{customerId}/{id}/status (repetible)
  → SatDownloadAppService.CheckStatusAsync
    → Si Descargada/Fallida: regresa tal cual (idempotente)
    → Si no: VerifyAsync al SAT
      → Terminada → DownloadAndReconcilePackagesAsync:
          por cada PackageId: DownloadAsync → GetComprobantesAsync
            por cada CFDI: SatCfdiParser.Parse → guarda RawXml en disco
              → SatCfdiReconciliationService.ReconcileAsync (dedupe + cruce EFOS)
      → EnProceso/Aceptada → regresa "sigue en proceso"
      → Rechazada/Error/Vencida → Fallida
```

**Restricción real del SAT (confirmada contra el código de `QueryService.BuildRecibidosAttributes`, no solo documentación):** una descarga tipo CFDI en modalidad Recibidos **solo** admite `InvoiceStatus = Vigente`. Por eso `CfdiSatStatus` en la práctica solo llega como `Vigente` por este flujo — detectar una cancelación posterior (RN-CFD-011) queda como gap conocido (G8), requiere un mecanismo de metadata o consulta de estatus no construido.

## 6. Endpoints (9, por rol — ver matriz completa en el README)

| Grupo | Ruta base | Archivo |
|---|---|---|
| Credencial | `api/accounting/cfdi-download/credential` | `CustomerSatCredentialEndpoints.cs` |
| Solicitudes | `api/accounting/cfdi-download/requests` | `SatDownloadEndpoints.cs` |
| CFDI (listado/PDF/Excel) | `api/accounting/cfdi-download/cfdi` | `SatCfdiEndpoints.cs` |
| EFOS | `api/accounting/cfdi-download/efos` | `EfosImportEndpoints.cs` |

## 7. Almacenamiento de archivos

Reutiliza `FileDirectories.Modules.SatConfig`/`SatDownloads` (ya reservados antes de este módulo, hallazgo de PASO 0.5) vía `IFileStructureResolver` + raíz privada (`GetRootPath(true)`) — mismo patrón que `InvoiceService` usa para documentos financieros:

- `.cer` → `customers/{customerId}/sat-config/efirma.cer`
- ZIP de paquete → `customers/{customerId}/sat-downloads/{requestId}/{packageId}.zip`
- XML por CFDI → `customers/{customerId}/sat-downloads/{requestId}/xml/{uuid}.xml`

`.key` y contraseña **nunca** tocan `ApplicationDbContext` — solo nombres de secreto (`CfdiDownload:CustomerSatCredential:{customerId}:Key|Password`) resueltos vía `ISecretProvider` contra el Vault.

## 8. Frontend (`appsweb/angular/.../modules/accounting.luxuryapp/cfdi-download/`)

| Componente | Rol |
|---|---|
| `CfdiDownloadHub` | Página principal: credencial + solicitud + tabla |
| `CredentialForm` | Modal de carga/reemplazo de e.firma |
| `CfdiList` (+ desktop/mobile) | Tabla de CFDI con `lux-table` |

Ruteado en `/accounting/cfdi-download` vía `routing/accounting.routing.ts` (no el archivo homónimo huérfano `modules/accounting.luxuryapp/accounting.routes.ts` — ver hallazgo en el plan, fase F6). Descubrible desde una tarjeta en el hub real de Contabilidad (`contabilidad-modules.ts`).

## 9. Diagrama de dependencias externas

```
LuxuryApp
  ├─ Fiscalapi.XmlDownloader 6.0.0 ──► WebService SAT (Descarga Masiva)
  ├─ Fiscalapi.Credentials 4.0.387 ──► parseo de .cer/.key (RFC, vigencia, validación FIEL)
  ├─ Vault (ISecretProvider) ───────► .key / password cifrados
  ├─ QuestPDF ───────────────────────► PDF por CFDI
  ├─ ClosedXML ──────────────────────► Excel del listado
  └─ Padrón EFOS (SAT, manual) ──────► EfosRecord (sin URL automatizable, D16)
```

## 10. Referencias

- [Reconocimiento de entidades (PASO 0.5)](./20261004-entity-recon-accounting-cfdi-download.md)
- [Discovery D1-D17](./20261004-discovery-accounting-cfdi-download.md)
- [FASE 0 — Reglas de negocio](./20261004-business-rules-accounting-cfdi-download.md)
- [Riesgos y dependencias](./20261004-riesgos-dependencias-accounting-cfdi-download.md)
- [Plan de implementación](./20261004-plan-accounting-cfdi-download.md)
