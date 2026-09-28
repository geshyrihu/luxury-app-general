Actúa como un arquitecto senior de software especializado en .NET 10, C#, ASP.NET Core Web API, Minimal APIs, Entity Framework Core, inyección de dependencias, análisis estático, refactorización segura y limpieza de código legado.

OBJETIVO
Necesito que analices de forma exhaustiva, segura y conservadora todos los componentes y archivos dentro de:

D:\repos\luxuryapp-api\api

El objetivo es identificar clases, interfaces, controladores, endpoints, servicios, middlewares, handlers, DTOs, modelos, entidades, configuraciones, utilidades, extensiones, archivos de soporte o cualquier otro archivo que NO esté siendo invocado, registrado, referenciado, descubierto por el framework o utilizado de ninguna forma por la API.

REGLA PRINCIPAL
NO debes eliminar, mover, renombrar, modificar ni limpiar ningún archivo automáticamente.
El análisis debe ser SOLO LECTURA.
Tu salida debe ser un informe técnico con candidatos seguros, candidatos dudosos y archivos que deben conservarse.

CONDICIONES IMPORTANTES

1. No confíes únicamente en una búsqueda simple por nombre de archivo.
2. Debes considerar referencias directas, indirectas, dinámicas, por reflexión, por DI, por routing, por convención de ASP.NET Core, por EF Core, por configuración o por escaneo de assemblies.
3. Un archivo solo debe marcarse como “eliminable con alta confianza” si existe evidencia suficiente de que no se usa en ninguna parte.
4. Si hay duda, clasifícalo como “REVISIÓN MANUAL” o “BAJA CONFIANZA”.
5. Debes validar especialmente falsos positivos comunes en .NET / ASP.NET Core.
6. Debes entregar evidencia por cada archivo candidato.
7. No debes proponer limpieza definitiva sin antes entregar un plan de validación.
8. Debes tener especial cuidado con controllers, minimal APIs, middlewares, hosted services, handlers, validadores, perfiles de mapeo, migraciones EF Core y clases descubiertas por reflexión o assembly scanning.

ALCANCE DEL ANÁLISIS
Analiza todo lo que esté dentro de:

D:\repos\luxuryapp-api\api

Incluye, si existe:

- Controllers.
- Minimal API endpoints.
- Endpoints agrupados con MapGroup.
- Services, repositories, units of work.
- Interfaces.
- DTOs, requests, responses, commands, queries, events.
- Models, entities, value objects.
- Entity Framework Core entities.
- DbContext.
- Migrations.
- IEntityTypeConfiguration<T>.
- Design-time factories.
- Middlewares.
- Filters.
- Exception handlers.
- Hosted services.
- Background services.
- Health checks.
- Validators.
- AutoMapper profiles.
- MediatR handlers.
- Behaviors.
- Notification handlers.
- Authorization handlers.
- Authentication handlers.
- Policies.
- Claims transformations.
- Swagger/OpenAPI filters.
- Extension methods.
- Options/configuration classes.
- Helpers, utils, constants, enums.
- appsettings\*.json.
- launchSettings.json.
- .csproj.
- Archivos de bootstrap: Program.cs, Startup.cs si existe.
- DependencyInjection.cs, ServiceCollectionExtensions, etc.
- Archivos de logging, tracing, observabilidad.
- Archivos de infraestructura: cache, message bus, email, storage, external APIs.
- Tests locales dentro de la carpeta api, si existen.
- Scripts, seeders, fixtures, resources, templates.
- Cualquier archivo .cs, .json, .xml, .config, .props, .targets, .sql, .txt, .md relevante.

FUENTES DE REFERENCIA QUE DEBES REVISAR
Debes buscar referencias en, como mínimo:

- Archivos .cs.
- Archivos .csproj.
- solution files .sln si existen en D:\repos\luxuryapp-api.
- appsettings\*.json.
- launchSettings.json.
- Program.cs.
- Startup.cs si existe.
- DependencyInjection extensions.
- Configuración de routing.
- MapControllers, MapGet, MapPost, MapPut, MapDelete, MapPatch, MapMethods, MapGroup.
- AddControllers, AddEndpointsApiExplorer, AddSwaggerGen.
- AddScoped, AddTransient, AddSingleton, TryAddScoped, TryAddTransient, TryAddSingleton.
- AddHostedService.
- AddHttpClient.
- AddDbContext.
- AddOptions, Configure<TOptions>, Bind.
- UseMiddleware, MapMiddleware, Run, Use.
- Filters y endpoint filters.
- Reflection: Type.GetType, Activator.CreateInstance, Assembly.Load, GetTypes, IsAssignableTo, GetCustomAttributes.
- Assembly scanning: FromAssembly, AddClasses, RegisterServicesFromAssembly, AddMediatR, AddValidatorsFromAssembly, AddAutoMapper, AddProfiles, Scrutor, etc.
- Attributes: [ApiController], [Route], [HttpGet], [HttpPost], [HttpPut], [HttpDelete], [HttpPatch], [Authorize], [AllowAnonymous], [ProducesResponseType], [Consumes], [Produces], [ApiExplorerSettings].
- EF Core: DbSet<T>, OnModelCreating, ApplyConfiguration, ApplyConfigurationsFromAssembly, migrations, ModelSnapshot, design-time factory.
- Configuración por nombre: GetSection, GetValue<T>, IConfiguration, options names.
- Swagger/OpenAPI: OperationFilter, DocumentFilter, SchemaFilter, AddSecurityDefinition, AddSecurityRequirement.
- Health checks: AddCheck, AddTypeActivatedCheck, IHealthCheck.
- Authentication/Authorization: AddAuthentication, AddScheme, AddPolicy, RequireAuthorization, IAuthorizationHandler.
- Hosted services: IHostedService, BackgroundService.
- gRPC, SignalR, Quartz, MassTransit, MediatR, FluentValidation, AutoMapper u otras librerías que descubran tipos automáticamente.
- Tests, integration tests, e2e tests o proyectos que referencien la API.

CRITERIOS PARA CONSIDERAR QUE ALGO “SÍ SE USA”
Marca como KEEP si el archivo cumple al menos una de estas condiciones:

- Es Program.cs, Startup.cs, appsettings principal, launchSettings, .csproj, global.json, Directory.Build.props u otro archivo esencial del proyecto.
- Es un controller público descubrible por MapControllers o por application parts.
- Es un endpoint minimal API registrado mediante MapGet/MapPost/MapPut/MapDelete/MapPatch/MapMethods/MapGroup.
- Es un servicio registrado en DI mediante AddScoped, AddTransient, AddSingleton, TryAdd\*, AddHostedService, AddHttpClient, AddDbContext u otro mecanismo.
- Es una entidad EF Core referenciada por DbContext, DbSet, OnModelCreating, IEntityTypeConfiguration, migrations o relational mapping.
- Es una migración EF Core existente, salvo análisis muy especial.
- Es middleware registrado en el pipeline.
- Es filter registrado globalmente, por controller, por endpoint o por convención.
- Es hosted service registrado.
- Es handler descubierto por MediatR, FluentValidation, AutoMapper, Scrutor u otro scanner.
- Es un validador, perfil de mapeo, behavior o notification handler registrado por assembly scanning.
- Es un authorization handler o authentication handler registrado.
- Es una clase usada por Swagger/OpenAPI filters, schema filters, operation filters o document filters.
- Es una clase de configuración usada por Options pattern, Bind, GetSection o Configure<T>.
- Es usada por tests, proyectos externos, tools, scripts o generación de documentación.
- Existe evidencia de uso por reflexión, dynamic, expression trees, source generators, serialization, JSON converters, custom model binders o custom binding.
- Es parte de infraestructura necesaria aunque no se invoque explícitamente desde un controller.
- Es un DTO usado en requests/responses, aunque solo aparezca en firmas o contratos.
- Es un archivo de soporte de build, configuración, deployment, migrations o tooling.
- No hay certeza suficiente para eliminarlo.

CRITERIOS PARA CONSIDERAR QUE ALGO “PODRÍA NO USARSE”
Marca como CANDIDATO si:

- No tiene referencias estáticas desde ningún archivo activo.
- No está registrado en DI.
- No está referenciado por routing, controllers, minimal APIs, middlewares, filters, hosted services, handlers o EF Core.
- No es descubrible por convención de ASP.NET Core.
- No es descubrible por assembly scanning.
- No es usado por tests, tools, scripts o configuración.
- No es un DTO, entity, model, enum, interface o helper referenciado indirectamente.
- No es un archivo esencial de proyecto.
- Solo es referenciado por otros archivos que también parecen no usados.
- No forma parte de migraciones EF Core críticas.
- No es una clase pública expuesta por SDK/librería interna, salvo que se demuestre lo contrario.

CLASIFICACIÓN OBLIGATORIA
Para cada archivo analizado, define uno de estos estados:

1. KEEP
   - Se usa o no hay certeza suficiente para eliminarlo.

2. REVIEW_MANUAL
   - Parece no usado, pero hay riesgo de falso positivo.
   - Ejemplos: reflexión, DI por scanning, endpoints expuestos, configuración dinámica, tests, migraciones, entidades EF Core, DTOs usados por serialización, posibles consumidores externos.

3. QUARANTINE_CANDIDATE
   - Hay bastantes indicios de no uso, pero aún se recomienda validación con build/tests antes de decidir.

4. SAFE_TO_REMOVE_HIGH_CONFIDENCE
   - Existe evidencia fuerte de que no se usa.
   - Solo puede marcarse así si pasaste todas las validaciones y no hay señales de uso directo, indirecto, dinámico, por routing, por DI, por EF Core o por reflexión.

NIVELES DE CONFIANZA
Asigna un nivel de confianza por candidato:

- HIGH
- MEDIUM
- LOW

No uses HIGH si:

- Solo hiciste búsqueda por nombre de archivo.
- No revisaste Program.cs.
- No revisaste registros DI.
- No revisaste routing/endpoints.
- No revisaste controllers.
- No revisaste assembly scanning.
- No revisaste reflexión.
- No revisaste EF Core.
- No revisaste appsettings.
- No revisaste tests/proyectos que referencien la API.
- No verificaste si la clase es pública y podría ser usada por consumidores externos.

FASES DEL ANÁLISIS

FASE 1 — INVENTARIO
Genera un inventario completo de archivos dentro de:

D:\repos\luxuryapp-api\api

Incluye:

- Ruta completa.
- Extensión.
- Tipo probable: controller, minimal endpoint, service, repository, interface, dto, entity, migration, dbcontext, middleware, filter, hosted-service, handler, validator, mapper-profile, extension, config, util, model, enum, test, asset, other.
- Si parece clase pública.
- Si parece interna.
- Si parece abstracta.
- Si parece genérica.
- Si implementa interfaz conocida.
- Si hereda de ControllerBase, Controller, BackgroundService, IHostedService, IEntityTypeConfiguration<T>, DbContext, etc.
- Si parece registrada por DI.
- Si parece descubrible por routing.
- Si parece usada por reflexión/scanning.

FASE 2 — PUNTOS DE ENTRADA
Analiza los entry points del proyecto:

- Program.cs.
- Startup.cs si existe.
- Métodos Main/CreateHostBuilder/CreateWebHostBuilder si existen.
- WebApplication.CreateBuilder.
- builder.Services.
- app.UseRouting.
- app.MapControllers.
- app.MapGet/MapPost/etc.
- app.MapGroup.
- app.UseMiddleware.
- app.UseAuthentication/UseAuthorization.
- app.UseSwagger/UseSwaggerUI.
- app.MapHealthChecks.
- app.MapHub, MapGrpcService si existen.
- Configuración de application parts.
- Configuración de controllers.
- Configuración de JSON serialization.
- Configuración de API versioning si existe.
- Configuración de CORS, rate limiting, caching, logging, exception handling.

FASE 3 — GRAFO DE DEPENDENCIAS
Construye mentalmente o explícitamente un grafo de dependencias desde:

- Program.cs.
- Controllers alcanzables.
- Minimal endpoints alcanzables.
- Servicios registrados en DI.
- Middlewares registrados.
- Hosted services registrados.
- DbContext y entidades alcanzables.
- Filters registrados.
- Handlers registrados.
- Validators registrados.
- AutoMapper profiles registrados.
- Configuraciones cargadas desde appsettings.

Luego identifica archivos no alcanzables desde ese grafo.

FASE 4 — ANÁLISIS DE CONTROLLERS
Para controllers:

- Verifica si heredan de ControllerBase/Controller o tienen [ApiController]/[Route].
- Verifica si son públicos.
- Verifica si están en un assembly incluido por AddControllers/AddApplicationPart.
- Verifica si MapControllers está activo.
- Verifica si sus rutas están excluidas o ignoradas.
- No marques un controller como no usado solo porque no tenga instanciación directa; ASP.NET Core puede invocarlo por routing.
- Si un controller está expuesto pero parece no usado por clientes, márcalo como REVIEW_MANUAL, no como SAFE_TO_REMOVE, salvo que haya evidencia adicional.
- Revisa [ApiExplorerSettings(IgnoreApi = true)], [NonAction], rutas deshabilitadas o características apagadas.

FASE 5 — ANÁLISIS DE MINIMAL APIs
Para minimal APIs:

- Busca MapGet, MapPost, MapPut, MapDelete, MapPatch, MapMethods, MapGroup.
- Identifica delegates, extension methods endpoint builder y route handlers.
- Verifica si los endpoints están registrados condicionalmente.
- Verifica si usan RequireAuthorization, WithTags, WithName, WithOpenApi, Produces, etc.
- No marques como no usado un endpoint registrado solo porque no se llame explícitamente desde código; puede ser invocado por HTTP.
- Si parece endpoint muerto pero está registrado, márcalo como REVIEW_MANUAL salvo evidencia externa.

FASE 6 — ANÁLISIS DE INYECCIÓN DE DEPENDENCIAS
Para servicios y dependencias:

- Busca AddScoped, AddTransient, AddSingleton, TryAdd\*, AddHostedService, AddHttpClient, AddDbContext, AddOptions, Configure.
- Busca registrations por tipo, por interfaz, por factory, por named options, por typed client.
- Busca assembly scanning: AddClasses, FromAssembly, RegisterServicesFromAssembly, AddMediatR, AddValidatorsFromAssembly, AddAutoMapper, Scrutor, etc.
- Busca uso por constructor injection, property injection, method injection, ActivatorUtilities, IServiceProvider, GetRequiredService, GetService.
- Si una clase no está registrada ni referenciada, puede ser candidata.
- Si una clase podría registrarse automáticamente por scanning, márcala como REVIEW_MANUAL.

FASE 7 — ANÁLISIS DE MIDDLEWARES Y PIPELINE
Para middlewares:

- Busca UseMiddleware<T>.
- Busca extensiones IApplicationBuilder.
- Busca middlewares funcionales: app.Run, app.Use, app.Map, app.MapWhen.
- Busca IMiddleware registrado en DI.
- Busca exception handlers, status code pages, developer exception page, custom error handlers.
- Si un middleware no está registrado, puede ser candidato.
- Si está registrado, márcalo KEEP salvo que esté condicionalmente deshabilitado y se demuestre.

FASE 8 — ANÁLISIS DE ENTITY FRAMEWORK CORE
Para EF Core:

- Analiza DbContext.
- Analiza DbSet<T>.
- Analiza OnModelCreating.
- Analiza ApplyConfiguration y ApplyConfigurationsFromAssembly.
- Analiza IEntityTypeConfiguration<T>.
- Analiza migrations.
- Analiza ModelSnapshot.
- Analiza design-time factory.
- No marques entidades como no usadas solo porque no aparecen en controllers; pueden ser usadas por DbContext, migrations, seeding, queries dinámicas o proyecciones.
- Las migraciones deben tratarse con mucho cuidado. Por defecto, márcalas KEEP o REVIEW_MANUAL.
- Solo marca una migración como candidata si hay evidencia clara de que no aplica al entorno, está duplicada o fue reemplazada, y aun así requiere revisión humana.

FASE 9 — ANÁLISIS DE HANDLERS, VALIDATORS, MAPPER PROFILES Y SCANNING
Para MediatR, FluentValidation, AutoMapper u otros:

- Busca IRequestHandler<T>, INotificationHandler<T>, IPipelineBehavior<T>, IValidator<T>, Profile, CreateMap.
- Busca AddMediatR, AddValidatorsFromAssembly, AddAutoMapper, AddProfiles, RegisterServicesFromAssembly.
- Si la clase se registra por scanning, puede ser usada aunque no tenga referencias directas.
- Si no hay scanning ni registro explícito, puede ser candidata.
- Si hay scanning genérico, marca REVIEW_MANUAL si la clase implementa interfaz registrable.

FASE 10 — ANÁLISIS DE REFLEXIÓN Y USO DINÁMICO
Busca patrones de uso dinámico:

- Type.GetType.
- Activator.CreateInstance.
- Assembly.Load.
- Assembly.GetExecutingAssembly.
- GetTypes.
- IsAssignableTo.
- IsSubclassOf.
- GetCustomAttributes.
- MakeGenericType.
- CreateDelegate.
- Expression trees.
- JsonSerializer con tipos dinámicos.
- Custom JSON converters.
- Model binders.
- Source generators.
- Scripts o configuración que carguen tipos por string.
- Strings que coincidan con nombres de clases, namespaces, endpoints o handlers.

Si existe posibilidad real de uso dinámico, marca REVIEW_MANUAL.

FASE 11 — ANÁLISIS DE APPSETTINGS Y CONFIGURACIÓN
Para appsettings\*.json:

- No elimines claves automáticamente.
- Identifica claves usadas mediante IConfiguration, GetSection, GetValue<T>, Bind, Configure<TOptions>.
- Identifica secciones usadas por logging, authentication, connection strings, JWT, external services, Swagger, CORS, caching, health checks, feature flags.
- Si una clave no se usa en código, puede ser candidata a revisión, pero no a eliminación directa.
- Las connection strings pueden ser usadas por infraestructura aunque no aparezcan explícitamente en código.
- Feature flags pueden ser evaluadas dinámicamente.

FASE 12 — ANÁLISIS DE TESTS Y PROYECTOS CONSUMIDORES
Si existe una solución en:

D:\repos\luxuryapp-api

o proyectos que referencien la API:

- Revisa proyectos de tests.
- Revisa integration tests.
- Revisa e2e tests.
- Revisa proyectos tools/scripts.
- Revisa referencias de proyecto hacia la API.
- Si una clase es usada solo por tests, márcala como REVIEW_MANUAL.
- Si una clase es usada por otro proyecto externo, márcala KEEP.
- Si no puedes revisar proyectos externos, indícalo y reduce la confianza.

FASE 13 — VALIDACIÓN ANTI FALSOS POSITIVOS
Para cada candidato, ejecuta o simula estas verificaciones:

1. Búsqueda por nombre de archivo sin extensión.
2. Búsqueda por nombre de clase.
3. Búsqueda por nombre de interfaz implementada.
4. Búsqueda por métodos públicos relevantes.
5. Búsqueda por atributos routing: [Route], [HttpGet], [HttpPost], etc.
6. Búsqueda por registro DI: AddScoped, AddTransient, AddSingleton.
7. Búsqueda por MapControllers/MapGet/MapPost/MapMethods.
8. Búsqueda por UseMiddleware.
9. Búsqueda por AddHostedService.
10. Búsqueda por AddMediatR/AddValidatorsFromAssembly/AddAutoMapper/RegisterServicesFromAssembly.
11. Búsqueda por DbSet<T>, OnModelCreating, ApplyConfiguration, migrations.
12. Búsqueda en appsettings\*.json.
13. Búsqueda en .csproj y solution.
14. Búsqueda en tests.
15. Búsqueda por strings que coincidan con nombres de tipos o rutas.
16. Búsqueda por reflexión/Activator/Assembly.
17. Búsqueda por Swagger/OpenAPI filters.
18. Búsqueda por health checks/authorization handlers/authentication schemes.

Si no tienes acceso directo al sistema de archivos, indica exactamente qué comandos debo ejecutar y cómo interpretar la salida.

FASE 14 — VALIDACIÓN SEGURA PREVIA A LIMPIEZA
No propongas borrar directamente. Debes proponer este flujo seguro:

1. Crear una rama nueva:
   git checkout -b chore/unused-api-files-analysis

2. Generar un informe con candidatos.

3. Para proyectos SDK-style de .NET, recuerda que normalmente todos los archivos .cs dentro de la carpeta del proyecto se incluyen automáticamente en la compilación.
   Por tanto, para sacar temporalmente un archivo de compilación, no basta moverlo a una subcarpeta si sigue siendo .cs.
   Debes proponer una de estas opciones:

   Opción A:
   - Renombrar archivos candidatos a extensión no compilable:
     archivo.cs.disabled
     o
     archivo.cs.bak

   Opción B:
   - Mover archivos fuera del proyecto compilable, por ejemplo:
     D:\repos\luxuryapp-api_quarantine\api

4. Ejecutar validaciones:
   - dotnet restore
   - dotnet build --no-incremental
   - dotnet test, si hay tests
   - dotnet publish -c Release, si se quiere una validación más exigente

5. Si el build o los tests fallan:
   - Revertir cambios.
   - Marcar el archivo como KEEP o REVIEW_MANUAL.
   - Registrar la referencia que causó el fallo.

6. Si el build y los tests pasan:
   - Mantener el archivo como candidato validado.
   - Aun así, no eliminarlo sin aprobación explícita.

7. Para endpoints HTTP expuestos, no basta con que compilen. Se debe validar consumo externo mediante:
   - Logs.
   - Métricas.
   - API Gateway.
   - Swagger.
   - Contratos de clientes.
   - Integration tests.
   - Repositorios frontend/clientes conocidos.
     Si no existe esa información, marcar REVIEW_MANUAL.

ENTREGABLE FINAL
Debes entregar un informe con estas secciones:

SECCIÓN 1 — RESUMEN EJECUTIVO

- Total de archivos analizados.
- Total KEEP.
- Total REVIEW_MANUAL.
- Total QUARANTINE_CANDIDATE.
- Total SAFE_TO_REMOVE_HIGH_CONFIDENCE.
- Riesgos detectados.
- Nivel de certeza global.
- Limitaciones del análisis.

SECCIÓN 2 — TABLA DE RESULTADOS
Genera una tabla Markdown con columnas:

| Archivo | Tipo | Estado | Confianza | Motivo | Referencias encontradas | Posible uso dinámico | Recomendación |

Ejemplo de estados:

- KEEP
- REVIEW_MANUAL
- QUARANTINE_CANDIDATE
- SAFE_TO_REMOVE_HIGH_CONFIDENCE

SECCIÓN 3 — CANDIDATOS DETALLADOS
Para cada candidato no KEEP, incluye:

- Ruta completa.
- Tipo de archivo.
- Clase/interface principal.
- Razón por la que parece no usado.
- Búsquedas realizadas.
- Referencias encontradas: 0 o lista.
- Si está registrado en DI.
- Si está expuesto por routing.
- Si es descubrible por convención.
- Si es descubrible por scanning.
- Si es usado por EF Core.
- Si es usado por tests.
- Si es usado por configuración.
- Si existe riesgo de uso dinámico.
- Validación recomendada.
- Nivel de confianza.

SECCIÓN 4 — ARCHIVOS QUE NO DEBEN BORRARSE
Lista explícita de archivos que deben conservarse aunque parezcan no usados, por ser:

- Entry points.
- Program.cs / Startup.cs.
- appsettings.
- launchSettings.
- .csproj.
- Migraciones EF Core.
- DbContext.
- Configuración DI.
- Middlewares registrados.
- Controllers expuestos.
- Endpoints expuestos.
- Hosted services.
- Archivos de soporte de build.
- Archivos de tests críticos.
- Archivos con posible consumo externo.

SECCIÓN 5 — FALSOS POSITIVOS DETECTADOS
Explica qué archivos inicialmente parecían no usados, pero fueron descartados por:

- Routing.
- DI.
- Assembly scanning.
- Reflexión.
- EF Core.
- Middlewares.
- Filters.
- Hosted services.
- Tests.
- Configuración.
- Swagger/OpenAPI.
- Uso por serialización.
- Posible consumo externo.

SECCIÓN 6 — PLAN DE LIMPIEZA SEGURA
Propón un plan por fases:

- Fase 1: solo reporte.
- Fase 2: cuarentena de archivos de alta confianza.
- Fase 3: build + tests.
- Fase 4: revisión manual de endpoints expuestos.
- Fase 5: revisión manual de reflexión/scanning.
- Fase 6: eliminación definitiva opcional.

No ejecutes ninguna fase destructiva.

SECCIÓN 7 — COMANDOS DE VALIDACIÓN SUGERIDOS
Entrega comandos PowerShell seguros para validar referencias y compilación, por ejemplo:

Listar archivos:
Get-ChildItem -Path "D:\repos\luxuryapp-api\api" -Recurse -File | Select-Object FullName

Buscar texto recursivamente si existe ripgrep:
rg -n "texto_a_buscar" "D:\repos\luxuryapp-api\api"

Buscar con PowerShell:
Get-ChildItem -Path "D:\repos\luxuryapp-api\api" -Recurse -Include _.cs,_.json,_.csproj,_.props,\*.sql | Select-String -Pattern "texto_a_buscar"

Compilar:
dotnet restore "D:\repos\luxuryapp-api\api"
dotnet build "D:\repos\luxuryapp-api\api" --no-incremental

Tests, si aplican:
dotnet test "D:\repos\luxuryapp-api\api"

Publicación de validación:
dotnet publish "D:\repos\luxuryapp-api\api" -c Release -o "D:\repos\luxuryapp-api_publish_validation"

SECCIÓN 8 — SALIDA ESTRUCTURADA OPCIONAL
Además del informe Markdown, genera una versión JSON o CSV con esta estructura mínima:

{
"filePath": "...",
"fileType": "...",
"status": "KEEP | REVIEW_MANUAL | QUARANTINE_CANDIDATE | SAFE_TO_REMOVE_HIGH_CONFIDENCE",
"confidence": "HIGH | MEDIUM | LOW",
"reason": "...",
"referencesFound": [],
"registeredInDI": true/false,
"exposedByRouting": true/false,
"discoveredByConvention": true/false,
"discoveredByScanning": true/false,
"usedByEFCore": true/false,
"usedByReflection": true/false,
"usedByTests": true/false,
"usedByConfiguration": true/false,
"externalConsumptionPossible": true/false,
"validationSuggested": "..."
}

RESTRICCIONES ADICIONALES

- No inventes referencias.
- No asumas que un archivo no se usa solo porque no tiene instanciación directa.
- No asumas que un controller no se usa solo porque no está referenciado explícitamente.
- No asumas que un endpoint minimal API no se usa solo porque no se llama desde código.
- No ignores MapControllers.
- No ignores AddControllers.
- No ignores registros DI.
- No ignores assembly scanning.
- No ignores reflexión.
- No ignores EF Core migrations.
- No ignores appsettings.
- No ignores hosted services.
- No ignores middlewares.
- No ignores filters.
- No ignores tests/proyectos consumidores.
- No marques como HIGH un candidato si no comprobaste routing, DI, EF Core, scanning, reflexión y configuración.
- Si el repositorio es grande, prioriza exactitud sobre velocidad.
- Si no puedes verificar algo, márcalo como REVIEW_MANUAL.

IMPORTANTE
El objetivo no es solo encontrar archivos huérfanos, sino evitar eliminar accidentalmente código necesario.
La decisión final de limpieza debe tomarse con base en evidencia, compilación, tests, análisis de consumo externo y revisión humana.

Comienza ahora el análisis y entrega primero el resumen ejecutivo y luego la tabla completa de resultados.
