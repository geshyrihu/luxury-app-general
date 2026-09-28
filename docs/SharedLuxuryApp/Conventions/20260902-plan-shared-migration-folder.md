# Plan de Migración Arquitectónica: Consolidación de Persistencia en Application (Vertical Slices)

**Objetivo:** Eliminar el proyecto `LuxuryApp.Infrastructure.Data.csproj`, moviendo toda su infraestructura (DbContext, Migrations, Entities, Configurations) hacia `LuxuryApp.Application.csproj`. Se adoptará una estructura de carpetas de "Cortes Verticales" (Módulo -> Sub-módulo -> Domain/Application/Infrastructure) manteniendo los namespaces intactos para evitar errores de compilación masivos.

---

## Instrucciones Críticas para el Agente Ejecutor (CLI)

1. **Uso de Git:** TODO movimiento de archivos debe hacerse estrictamente usando `git mv` para conservar el historial.
2. **Namespaces Intactos:** ESTÁ ESTRICTAMENTE PROHIBIDO modificar el `namespace` de los archivos que se muevan. Un archivo `.cs` que se mueva a una nueva carpeta conservará su namespace original (ej. `namespace LuxuryApp.Infrastructure.Data.Entities;`).
3. **Versiones de NuGet:** Al mover referencias de paquetes a `LuxuryApp.Application.csproj`, se deben mantener las versiones **exactas** que tenía `Infrastructure.Data`. No actualices ningún paquete.
4. **Bitácora Obligatoria:** Al terminar de ejecutar cualquier fase o tarea, **debes registrar un resumen de los cambios (tipo bitácora) anexando al final del archivo `D:\repos\luxuryapp-api\log.changes.md`**. Si el archivo no existe, créalo. Formato esperado: fecha, fase ejecutada, archivos movidos o modificados, y estado de compilación.

---

## Fases de Migración

### Fase 1: Preparación del Proyecto `LuxuryApp.Application`

**Objetivo:** Dotar a la capa de Aplicación de las dependencias necesarias para hospedar Entity Framework.

1. Abre `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure.Data\LuxuryApp.Infrastructure.Data.csproj`.
2. Copia todo el bloque de `<ItemGroup>` que contiene los `<PackageReference>` (EF Core, Npgsql, Identity, Fiscalapi, etc.) y pégalo en `D:\repos\luxuryapp-api\api\LuxuryApp.Application\LuxuryApp.Application.csproj`. **Respeta las versiones exactas**.
3. Copia todo el bloque de `<ItemGroup>` que contiene los `<Using Include="..." />` (Implicit Global Usings) y pégalo también en `LuxuryApp.Application.csproj`.

### Fase 2: Movimiento Físico del Core de Persistencia

**Objetivo:** Mover el `DbContext`, factorías y migraciones a la capa de Aplicación.

1. Crea la carpeta `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Data`.
2. Usando `git mv`, mueve los siguientes elementos desde `Infrastructure.Data/Data/` hacia `Application/Data/`:
   - `ApplicationDbContext.cs`
   - `ApplicationDbContextFactory.cs`
   - `PostgresDbContext.cs` (si aplica)
   - La carpeta completa `Migrations/`
3. En `Application/Data/ApplicationDbContextFactory.cs`, ajusta el path relativo que busca el `appsettings.json` (probablemente sube un nivel hacia `LuxuryApp.Api`).
4. Revisa si en `ApplicationDbContext.cs` existe algún código que dependa de ubicaciones de archivos estáticos y ajústalo si es necesario.

### Fase 3: Ajuste de la Inyección de Dependencias y Eliminación del Proyecto

**Objetivo:** Actualizar el Host (`Program.cs` / DI) para apuntar al nuevo ensamblado y eliminar el proyecto viejo.

1. Busca en la solución (`LuxuryApp.Api`, `Program.cs` o métodos de extensión de configuración) donde se registra el DbContext (`AddDbContext<ApplicationDbContext>`).
2. Cambia el ensamblado de migraciones:
   - De: `b => b.MigrationsAssembly("LuxuryApp.Infrastructure.Data")`
   - A: `b => b.MigrationsAssembly("LuxuryApp.Application")`
3. Remueve la referencia de proyecto `<ProjectReference Include="..\LuxuryApp.Infrastructure.Data\LuxuryApp.Infrastructure.Data.csproj" />` del archivo `LuxuryApp.Api.csproj` (y de cualquier otro que lo referencie).
4. Ejecuta un `dotnet build` para asegurar que el sistema core compila correctamente.
5. Elimina el archivo `LuxuryApp.Infrastructure.Data.csproj` de la solución (`.sln`).

### Fase 4: Refactorización Progresiva de Módulos (Reubicación de Entidades)

**Objetivo:** Mover Entidades y Configuraciones Fluent API a las carpetas lógicas de Sub-módulos dentro de `Moduls/`.

_Esta fase se ejecutará iterativamente por módulo. Ejemplo para el módulo de Reclutamiento:_

1. Crear la estructura interna del submódulo:
   - `LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Domain/Entities/`
   - `LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Infrastructure/Persistence/`
2. Usando `git mv`, mover los archivos correspondientes (ej. `Candidate.cs`, `CandidateProcess.cs`) desde la antigua carpeta `Data/Entities/...` hacia la nueva ruta.
3. Usando `git mv`, mover las configuraciones de EF Core (ej. `CandidateConfiguration.cs`) hacia la nueva ruta `Infrastructure/Persistence/`.
4. **Validación:** Recordar la regla de oro: **NO TOCAR EL NAMESPACE**.
5. Ejecutar `dotnet build` y asegurar que todo compile.
6. Repetir por cada submódulo/módulo.

### Fase 5: Auditoría y Resolución de Acoplamiento Cruzado (Cross-Module Usage)

**Objetivo:** Una vez que todas las entidades y servicios estén en sus respectivas carpetas lógicas, se debe realizar un barrido estricto para identificar qué módulos están llamando a clases, servicios o enums de *otros* módulos de forma directa.

1. **Escaneo de Referencias Cruzadas:** El agente deberá buscar usings o inyecciones de dependencias que rompan la regla de aislamiento (ej. `Reclutamiento` usando un servicio de `Cobranza`).
2. **Análisis de Reubicación (Shared):**
   - Si la clase/enum cruzado se usa **solo dentro del mismo módulo maestro** (ej. entre sub-módulos de Reclutamiento), se moverá a `Moduls/[Modulo]/Shared/`.
   - Si la clase/enum cruzado se usa **entre diferentes módulos maestros**, se moverá a `Moduls/SharedLuxuryApp/`.
3. **Control Estricto:** Durante esta fase no se crearán nuevos servicios ni se cambiará la lógica. Solo se reubicarán las dependencias compartidas detectadas y se actualizarán sus usings. Esta auditoría garantiza que las fronteras de los módulos sean reales y no solo estéticas.

### Fase 6: Consolidación de Proyectos de Infraestructura Secundarios (Logs, MockAspel, Vault, Data)

**Objetivo:** Agrupar toda la infraestructura restante bajo la carpeta `Infrastructure/` de `LuxuryApp.Application`. Esto incluye eliminar los proyectos periféricos (`Logs`, `MockAspel`, `Vault`) y reubicar el núcleo de persistencia (`Data`) que se movió temporalmente en la Fase 2.

1. **Preparación de Dependencias:** Copiar cualquier `<PackageReference>` y `<Using Include="...">` únicos desde los `.csproj` de estos 3 proyectos periféricos hacia `LuxuryApp.Application.csproj`. Respetar versiones exactas.
2. **Creación de Estructura:** Crear las carpetas:
   - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Logs\`
   - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\MockAspel\`
   - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Vault\`
3. **Movimiento Físico (`git mv`):** 
   - Mover todos los archivos `.cs` (y configuraciones si las hay) de los proyectos periféricos a sus nuevas carpetas.
   - Mover la carpeta completa `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Data\` hacia `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Data\`.
   - **REGLA DE ORO:** Mantener los namespaces originales de cada archivo.
4. **Limpieza de Solución:**
   - Remover las referencias (`<ProjectReference>`) a estos 3 proyectos desde `LuxuryApp.Api.csproj` y cualquier otro proyecto.
   - Eliminar los 3 proyectos de la solución `.sln`.
   - Borrar los archivos `.csproj` y carpetas raíz obsoletas.
5. **Verificación:** Ejecutar `dotnet build` para garantizar que todo siga resolviendo correctamente (dado que los namespaces permanecen intactos).

---

**Nota Final:** El `ApplicationDbContext` registrará automáticamente todas las configuraciones movidas en la Fase 4 siempre y cuando use `builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());` en su método `OnModelCreating`.

### Fase 7: Absorción de `LuxuryApp.Providers` y `LuxuryApp.Shared` (Consolidación Monolítica Final)

**Objetivo:** Eliminar los últimos proyectos periféricos que fungen como infraestructura y código transversal, para consolidar absolutamente todo el backend dentro de `LuxuryApp.Application`, cumpliendo la regla de Arquitectura Monolítica Unificada.

1. **Preparación de Dependencias:** Revisar los archivos `LuxuryApp.Providers.csproj` y `LuxuryApp.Shared.csproj`. Copiar todos los `<PackageReference>` (respetando sus versiones) y `<Using Include="..."/>` (si los hay) hacia `LuxuryApp.Application.csproj`.
2. **Movimiento Físico (`git mv`):**
   - Mover el contenido de `LuxuryApp.Providers/Services/` y `LuxuryApp.Providers/Extensions/` hacia `LuxuryApp.Application/Infrastructure/Providers/`.
   - Mover el contenido de las subcarpetas de `LuxuryApp.Shared/` (Constants, DTOs, Enums, Settings, Utils, etc.) hacia `LuxuryApp.Application/Shared/`.
   - **REGLA DE ORO:** NO modificar los namespaces del texto dentro de los archivos movidos (ej. la línea `namespace LuxuryApp.Shared.DTOs;` debe quedar idéntica). Como `LuxuryApp.Application.csproj` ya incluye esos namespaces como globales, la compilación no se romperá por el cambio de carpeta.
3. **Limpieza de Referencias:**
   - Usar `dotnet remove reference` para eliminar la dependencia de `Providers` y `Shared` desde `LuxuryApp.Api.csproj`, `LuxuryApp.Application.csproj` y `LuxuryApp.Tests.csproj` (según donde estuvieran).
4. **Limpieza de Solución:**
   - Usar `dotnet sln remove` para sacarlos de la solución.
   - Eliminar por completo los archivos `.csproj` obsoletos y sus carpetas raíz.
5. **Verificación:** Ejecutar `dotnet build`. Al mantener los namespaces planos originales, la migración de carpetas debería ser transparente para el compilador.
