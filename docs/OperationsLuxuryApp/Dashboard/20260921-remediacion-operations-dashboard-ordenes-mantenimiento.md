# Remediación 4 — Fase 1.3 (órdenes de mantenimiento): 500 del endpoint y fallos de la vista

Plan padre: `20260921-plan-operations-dashboard-ordenes-mantenimiento.md`. Revisión del orquestador con la API reiniciada (16:57), usuario SuperUsuario, cliente La Jolla, navegador real.

Regla de trabajo: solo lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes nada que no hayas verificado leyendo código o corriendo un comando.

## Hallazgos verificados

1. **El endpoint devuelve 500.** `GET /api/dashboard/metrics/maintenance-orders?customerId=<La Jolla>` → `500 Internal Server Error` (2 llamadas seguidas). El endpoint sí está registrado (un 404 significaría lo contrario) y la validación de rol/cliente pasó (no es 403/400): falla dentro de `GetMaintenanceOrdersByCategoryAsync`, muy probablemente en la consulta EF (o en el nombre del mes). El `GlobalExceptionMiddleware` oculta el mensaje; la causa real solo se ve en la consola de la API.
2. **La página falla en silencio.** `dashboard-metrics.html` solo muestra la sección si hay datos; cuando el servicio devuelve `null` (así responde `ApiResponseService` ante un 500) no cae en la rama de error: la sección de órdenes de mantenimiento simplemente no aparece.
3. **Iconos inválidos.** `components/maintenance-category-card.ts` → `getIcon()` devuelve textos sueltos (`'settings'`, `'star'`, `'chair'`, `'box'`, `'activity'`, `'cpu'`, `'tool'`, `'users'`) que no son iconos del catálogo `AppIcon` (`shared/ui/shared/app-icon/app-icon.catalog.ts`, valores tipo `material-symbols-light:...`). No se renderizarán.
4. **Recargas innecesarias.** En `dashboard-metrics.ts` el `effect` del constructor llama a `loadMaintenanceMetrics` en la misma ejecución que lee `currentFilter()`. Cada cambio en los filtros de fecha/tipo (que no aplican a mantenimiento) vuelve a llamar al endpoint de mantenimiento.
5. **Modificaste el método existente.** Se pidió no tocar `GetOperationalMetricsAsync`; se extrajo `ValidateAccessAndGetCustomerId(Guid? ...)`. El comportamiento resulta equivalente y se acepta, pero repórtalo como desviación y sin `Guid?` innecesario (el DTO ya trae `Guid`).
6. **Sin verificación de cifras.** El reporte dice que no fue posible comparar con datos reales; eso lo hará el orquestador. No lo presentes como verificado.

## Cambios requeridos

### Backend (`api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/Services/DashboardMetricsAppService.cs`)

A. **Encuentra y corrige la causa real del 500.** Lee la sección "Excepción capturada" al final de este documento (el Tech Lead pegará ahí el mensaje de la consola de la API). Si está vacía, PARA y repórtalo: no adivines. Corrige solo la causa raíz, sin cambiar las reglas RN-DASH-040 a 044. Verifica que la consulta se traduzca a SQL y siga siendo agregada en base de datos (nada de traer órdenes a memoria).
B. Quita `Guid?` de `ValidateAccessAndGetCustomerId` si no es necesario, sin cambiar su comportamiento.

### Frontend (`appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/`)

C. **Estado de error explícito.** En `dashboard-metrics.ts`: si `getMaintenanceOrdersByCategory` devuelve `null`, `maintenanceHasError` debe ponerse en `true` (además del `catch`), para que se muestre el mensaje "Error al cargar las órdenes de mantenimiento".
D. **Iconos del catálogo.** En `components/maintenance-category-card.ts` usa `AppIcon.<Nombre>` del catálogo, uno por categoría (Equipos=1, Amenidades=2, Mobiliarios=3, Equipamiento=4, Gimnasio=5, Sistemas=6, BodegasCuartosMaquinas=7, AreasComunes=8). Verifica que cada valor exista en `app-icon.catalog.ts` (busca opciones como `Tools`, `Wrench`, `Domain`, `Building`, `AccountGroup`, `Cog`; no inventes nombres). El método debe devolver el tipo `AppIconName`.
E. **Efectos separados.** Divide el `effect`: uno para las métricas operativas (depende del filtro y del cliente) y otro solo para mantenimiento que dependa únicamente de `CustomerIdService.customerId()` (patrón de `dashboard/unified-pending-dashboard.ts`), de modo que cambiar los filtros no vuelva a llamar a mantenimiento. Lee `canViewMaintenance()` sin volverlo dependencia innecesaria si puedes (por ejemplo con `untracked`).

## Verificación obligatoria (pega salidas reales)

1. `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto).
2. `npx ng build --configuration development` en `appsweb/angular`.
3. Greps sobre `dashboard/metrics/` que deben dar 0 en archivos nuevos/modificados: `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}\b|console\.`.
4. Explica con evidencia (mensaje de excepción o código) cuál era la causa del 500 y por qué tu corrección la resuelve.
5. Lista de archivos que tocaste.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve (puntos A-E, verificación, desviaciones reales). No copies el reporte anterior.

## Excepción capturada (la llena el Tech Lead)

_(Pegar aquí el mensaje y el stack trace que la consola de la API muestra como "Excepción no controlada" al abrir /dashboard/metrics con cliente La Jolla.)_
Usuario conectado: 63f5fe75-4fbb-4328-a2dd-b7224778752e - ConnectionId: H9GHFr1cCDuxBV5wHHvXug
[17:51:54 ERR] Excepción no controlada: Required parameter "int Month" was not provided from query string.
Microsoft.AspNetCore.Http.BadHttpRequestException: Required parameter "int Month" was not provided from query string.
at lambda_method7624(Closure, Object, HttpContext)
at Microsoft.AspNetCore.Builder.Extensions.MapMiddleware.Invoke(HttpContext context)
at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
at LuxuryApp.Api.Middleware.LogUserNameMiddleware.InvokeAsync(HttpContext context, ICurrentUserService currentUserService) in D:\repos\luxuryapp-api\api\LuxuryApp.Api\Middleware\LogUserNameMiddleware.cs:line 26
at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
at Microsoft.AspNetCore.Localization.RequestLocalizationMiddleware.Invoke(HttpContext context)
at LuxuryApp.Api.Middleware.GlobalExceptionMiddleware.InvokeAsync(HttpContext context) in D:\repos\luxuryapp-api\api\LuxuryApp.Api\Middleware\GlobalExceptionMiddleware.cs:line 19
[17:51:54 ERR] Excepción no controlada: Required parameter "int Month" was not provided from query string.
Microsoft.AspNetCore.Http.BadHttpRequestException: Required parameter "int Month" was not provided from query string.
at lambda_method7624(Closure, Object, HttpContext)
at Microsoft.AspNetCore.Builder.Extensions.MapMiddleware.Invoke(HttpContext context)
at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
at LuxuryApp.Api.Middleware.LogUserNameMiddleware.InvokeAsync(HttpContext context, ICurrentUserService currentUserService) in D:\repos\luxuryapp-api\api\LuxuryApp.Api\Middleware\LogUserNameMiddleware.cs:line 26
at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
at Microsoft.AspNetCore.Localization.RequestLocalizationMiddleware.Invoke(HttpContext context)
at LuxuryApp.Api.Middleware.GlobalExceptionMiddleware.InvokeAsync(HttpContext context) in D:\repos\luxuryapp-api\api\LuxuryApp.Api\Middleware\GlobalExceptionMiddleware.cs:line 19
[17:51:54 WRN] Intento de obtener archivo no existente: public/Administration/accounts/019fa465-1920-7772-a948-76a01e8ab76c.png
[17:51:54 INF] Archivo obtenido localmente: public/administration/customer/019e6205-5cdd-7f0d-8ee9-5e7310366790.png
[17:51:54 WRN] Archivo no encontrado al intentar descargar: public/Administration/accounts/019fa465-1920-7772-a948-76a01e8ab76c.png
System.IO.FileNotFoundException: El archivo no fue encontrado.
File name: 'C:\LuxuryAppFiles\public\Administration\accounts\019fa465-1920-7772-a948-76a01e8ab76c.png'
at Shared.Services.LocalFileProvider.GetFileStreamAsync(String relativePath, CancellationToken cancellationToken) in D:\repos\luxuryapp-api\api\LuxuryApp.Application\Shared\Services\LocalFileProvider.cs:line 56
at Shared.Services.SecureFileStorageService.GetFileAsync(String relativePath) in D:\repos\luxuryapp-api\api\LuxuryApp.Application\Shared\Services\ISecureFileStorageService.cs:line 376
at SharedLuxuryApp.Files.Services.FileEndpointSupport.DownloadFileAsync(String filePath, ISecureFileStorageService fileStorageService) in D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\SharedLuxuryApp\Files\Services\FileEndpointSupport.cs:line 33
at SharedLuxuryApp.Files.EndPoints.FilesEndpoints.<>c.<<MapEndPoints>b\_\_0_0>d.MoveNext() in D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\SharedLuxuryApp\Files\EndPoints\FilesEndpoints.cs:line 18
Usuario conectado: 63f5fe75-4fbb-4328-a2dd-b7224778752e - ConnectionId: WtigwIlbNiFKdp26XEgF6w
