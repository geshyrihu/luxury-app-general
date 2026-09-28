# Auditoria de Retiro de FileController

Fecha: 2026-07-13
Estado: Alias legacy retirado
Responsable: Codex

## Resumen Ejecutivo

El contrato canonico de archivos ya fue migrado a `api/files` y el frontend ya consume esa ruta.
El alias legacy `api/file` fue retirado y el contrato activo queda unicamente en `api/files`.

## Evidencia de Preparacion

- Backend canonico en [FilesEndpoints.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application\Common\Endpoints\FilesEndpoints.cs:9).
- Alias legacy retirado de `FileController`.
- Generacion central de URLs en [IFileReadPathService.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Shared\Services\IFileReadPathService.cs:123) usando `api/files/download`.
- Frontend alineado en [shared.endpoints.ts](D:\repos\luxuryapp-api\client\angular\src\app\core\constants\shared.endpoints.ts:3).
- Correos y layouts alineados:
  - [SendEmailAppService.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application\SystemLuxuryApp\Infrastructure\SendEmail\Services\SendEmailAppService.cs:275)
  - [\_EmailLayout.cshtml](D:\repos\luxuryapp-api\api\LuxuryApp.Api\Infrastructure\Email\Templates\Shared\_EmailLayout.cshtml:28)
  - [\_EmailLayoutTable.cshtml](D:\repos\luxuryapp-api\api\LuxuryApp.Api\Infrastructure\Email\Templates\Shared\_EmailLayoutTable.cshtml:27)

## Riesgos Residuales

- Existen snapshots historicos que conservan `api/File/...` y no deben editarse como si fueran estado actual:
  - [end-points-12-07-2026.json](D:\repos\luxuryapp-api\end-points-12-07-2026.json:2111)
  - [end-points-12-07-2026-refactor.json](D:\repos\luxuryapp-api\end-points-12-07-2026-refactor.json:8)
- Si existe algun consumidor externo fuera del repo apuntando a `api/file/...`, dejara de funcionar y debera migrarse a `api/files/...`.

## Criterios Go/No-Go

- [x] El frontend usa `api/files`.
- [x] Los generadores centrales de URL emiten `api/files`.
- [x] Los correos nuevos usan `api/files`.
- [x] El alias `api/file` fue eliminado del backend.
- [x] El build de backend pasa.
- [x] `tsc --noEmit` pasa.
- [x] `scan-mojibake` pasa.
- [ ] No hay consumidores externos observados de `api/file` en logs o monitoreo.
- [ ] Se valida en ambiente que `api/files/download`, `api/files/sidebar-images` y `api/files/comite-home-images` cubren todos los casos.

## Resultado

El alias legacy ya fue retirado. La siguiente vigilancia recomendada es solamente operativa:

1. Confirmar en ambiente que no aparecen 404 de clientes rezagados hacia `api/file`.
2. Validar manualmente las tres rutas canonicas `api/files`.
