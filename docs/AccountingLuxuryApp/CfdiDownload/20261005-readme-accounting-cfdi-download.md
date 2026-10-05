# README — Módulo Descarga Masiva de CFDI del SAT

**Nivel 1** (CONVENTIONS.md §4.7, doc #1). Ubicación real exigida por convención: `api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/README.md`; por instrucción del Tech Lead, vive aquí en su lugar.

## Propósito funcional

Cada customer (condominio) descarga los CFDI que sus proveedores le emitieron, directamente del SAT, usando su e.firma. El módulo reemplaza la dependencia de herramientas externas (ContadorMx, SAT Fácil, etc.) que los customers usaban hoy (D1) para ese mismo propósito. Guarda cada CFDI (XML original + PDF generado), permite exportarlos a Excel, y cruza automáticamente al proveedor emisor contra el padrón de empresas en lista negra del SAT (EFOS, artículo 69-B). Es explícitamente **solo lectura de CFDI recibidos**: el customer no emite facturas (D10), y el módulo no hace nada con cuentas por pagar — eso es "otro proceso que no se toca acá" (D7), que podría construirse después consumiendo este repositorio.

## Endpoints principales

| Método | Ruta | Rol(es) | Qué hace |
|---|---|---|---|
| GET | `api/accounting/cfdi-download/credential/{customerId}` | 8 roles | Estado de la e.firma |
| POST | `api/accounting/cfdi-download/credential/{customerId}` | SuperUsuario, Direccion | Cargar/reemplazar e.firma |
| POST | `api/accounting/cfdi-download/requests/{customerId}` | 8 roles | Solicitar descarga (rango de fechas) |
| GET | `api/accounting/cfdi-download/requests/{customerId}/{id}/status` | 8 roles | Verificar/avanzar una solicitud |
| GET | `api/accounting/cfdi-download/cfdi/{customerId}` | 8 roles | Listado de CFDI (filtro de fecha opcional) |
| GET | `api/accounting/cfdi-download/cfdi/{customerId}/{cfdiId}/pdf` | 8 roles | PDF de un CFDI |
| GET | `api/accounting/cfdi-download/cfdi/{customerId}/export-excel` | 8 roles | Excel del listado |
| POST | `api/accounting/cfdi-download/efos/import` | SuperUsuario, Direccion | Importar padrón EFOS (CSV) |

Los "8 roles": `SuperUsuario`, `Administrador`, `Contador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `GerenteMantenimiento`, `SupervisionOperativa`.

## Actores y responsabilidades

| Actor | Responsabilidad |
|---|---|
| `SuperUsuario` / `Direccion` | Cargar y reemplazar la e.firma; importar el padrón EFOS |
| Los 8 roles | Disparar descargas, consultar el repositorio, exportar PDF/Excel |
| Resto del catálogo (34 roles) | Sin acceso al módulo (confirmado explícitamente, D6) |

## Dependencias con otros módulos

**Consume (sin modificar sus contratos):** Vault (`ISecretProvider`), resolvedores de rutas de archivos (`IFileStructureResolver`), `Customer.RFC`, `Providers` (vínculo opcional por RFC), `HangfireJobCatalog` (reservado, sin job actual).

**No depende de, ni es consumido por:** `Invoice`/`InvoiceService` (cobranza), `OrdenCompraFactura` (Compras), `CfdiXmlParser` (Compras — tiene su propio parser, `SatCfdiParser`), `Funding`/`sat-funding` (confirmado fuera de alcance, D9).

Detalle completo: [Riesgos y dependencias](./20261004-riesgos-dependencias-accounting-cfdi-download.md).

## Reglas de Negocio principales

13 reglas (`RN-CFD-001` a `RN-CFD-033`) en 4 niveles — ver el detalle completo en [FASE 0](./20261004-business-rules-accounting-cfdi-download.md). Las más relevantes:

- **RN-CFD-001** — Un CFDI es único por `(CustomerId, UUID)`; re-descargar no duplica.
- **RN-CFD-002** — Toda operación está acotada a un único customer; nunca multi-customer.
- **RN-CFD-003** — El RFC del certificado debe coincidir con `Customer.RFC`.
- **RN-CFD-004** — `.key`/contraseña nunca en la base de datos principal, solo en Vault.
- **RN-CFD-020/021** — Permisos por rol (ver tabla de endpoints arriba).

## Estructura de carpetas

```
Infrastructure/Data/Entities/AccountingLuxuryApp/CfdiDownload/   (6 entidades)
Modules/AccountingLuxuryApp/CfdiDownload/
  ├── DTOs/           (7 archivos)
  ├── Interfaces/      (6 archivos)
  ├── Services/        (8 archivos)
  └── EndPoints/        (4 archivos)
Shared/Enums/           (3 enums nuevos: SatDownloadRequestStatus, CfdiSatStatus, EfosSituacion)
```

## Validaciones principales

- Certificado debe ser FIEL, no CSD (`Certificate.IsFiel()`)
- Certificado debe estar vigente (`Certificate.IsValid()`)
- RFC del certificado = `Customer.RFC`
- Llave privada + contraseña deben corresponder al certificado (`Credential.IsValidFiel()`)
- Fecha inicial < fecha final en toda solicitud de descarga

## Permisos y seguridad

Ver tabla de endpoints arriba. Aislamiento multi-tenant verificado explícitamente con pruebas (`CfdiDownloadMultiTenantIsolationTests`) — **importante:** `ITenantEntity` no aplica filtro automático en este repositorio, cada query filtra `CustomerId` a mano.

## Referencias a CONVENTIONS.md

§4.6 (creación de módulo nuevo), §4.7 (documentación de módulo existente), §5.9 (operación/flujo), Catálogo de Roles (`application-roles-catalog.md`).
