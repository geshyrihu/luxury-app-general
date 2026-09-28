# 📋 Análisis del Codebase API — Convenciones Adicionales y Hallazgos

**Fecha:** 2026-07-27
**Propósito:** Identificar convenciones, patrones y reglas en el codebase API que no están documentadas en `CONVENTIONS.md`, así como violaciones de las convenciones existentes.

---

## 1. Convenciones Descubiertas (no documentadas en CONVENTIONS.md)

### 1.1 Estructura de Módulos

| Convención | Detalle |
|------------|---------|
| Carpeta `Moduls` (sin 'e') | La carpeta raíz de módulos es `Moduls` no `Modules` (p. ej. `Application/Moduls/AdminLuxuryApp/...`) |
| Estructura por feature | Cada feature tiene sub carpetas: `Endpoint/`, `Interfaces/`, `Services/`, `DTOs/`, `Mapping/` |
| Archivo de endpoints | Nombre plural con sufijo `Endpoints` (p. ej. `BanksEndpoints.cs`, `AddressEndPoints.cs`) — nota: hay inconsistencia entre `Endpoints` y `EndPoints` |
| Interfaz de servicio | Prefijo `I` + nombre `AppService` (p. ej. `IBankAppService.cs`) |
| Implementación de servicio | Sufijo `AppService` (p. ej. `BankAppService.cs`) |
| Namespace de endpoint | `LuxuryApp.Application.Endpoints` |
| Namespace de interfaces | `LuxuryApp.Application.Interfaces` |
| Namespace de servicios | `LuxuryApp.Application.Interfaces` (same as interfaces!) |
| Namespace de mapping | `LuxuryApp.Application.Mappings` |
| Namespace de filters | `LuxuryApp.Modules.Configuration.Filters` |

**Sugestión para CONVENTIONS.md:** Agregar sección §9.XX "Conventions of Module Structure" que documente la estructura `Moduls/<module>/<feature>/` con sub carpetas estándar.

### 1.2 Patrón de Endpoints Minimal

| Convención | Detalle |
|------------|---------|
| Interfaz `IEndpointModule` | Todos los endpoints implementan `IEndpointModule` con método `MapEndpoints(IEndpointRouteBuilder)` |
| Registro automático por reflexión | `MapAllEndpoints()` registra todos los implementations de `IEndpointModule` sin intervención manual |
| `file-scoped namespace` | Obligatorio en todos los archivos .cs |
| `sealed class` para endpoints | Las clases de endpoints son `sealed` (p. ej. `BankEndpoints : IEndpointModule`) |
| `.WithName()` en cada endpoint | Nombre legible p. ej. `.WithName("GetBank")` |
| `.WithMetadata()` para logging | `LogActivityMetadata` para tracking de actividad |
| `TypedResults` para retornos | `TypedResults.Ok()`, `TypedResults.CreatedAtRoute()`, etc. en lugar de `Results.Ok()` |
| `.AddEndpointFilter<>` para cross-cutting | Filtros de endpoint para logging, auth, etc. |

### 1.3 Patrón de Logging de Actividad

| Convención | Detalle |
|------------|---------|
| `LogActivityMetadata` | POCO con `Action` (string) y `Description` (string) |
| `LogUserActivityAttribute` | Atributo `[AttributeUsage]` que aplica `LogUserActivityFilter` a endpoints |
| `LogUserActivityEndpointFilter` | `IEndpointFilter` que intercepta request/response y registra `UserActivity` entity |
| Logging de actividad | Se guarda en tabla `UserActivity` de `ApplicationDbContext` |
| Metadata en cada endpoint | Cada endpoint tiene `.WithMetadata(new LogActivityMetadata(...))` |

**Sugestión para CONVENTIONS.md:** Documentar el patrón de logging de actividad.

### 1.4 Nomenclatura de DTOs y Entidades

| Convención | Detalle |
|------------|---------|
| DTOs de entidad | `<Entity>DTO.cs` (p. ej. `BankDTO.cs`) |
| DTOs de create/edit | `<Entity>AddOrEditDTO.cs` (p. ej. `BankAddOrEditDTO.cs`) |
| DTOs de request | `<Entity>AddOrEditDTO.cs` (reutilizado para create y edit) |
| Interfaces de servicio | `I<ServiceName>AppService.cs` (p. ej. `IBankAppService.cs`) |
| Implementación de servicio | `<Entity>AppService.cs` (p. ej. `BankAppService.cs`) |
| Mappers | `<Entity>Mapper.cs` extends `Profile` (AutoMapper) |
| Enums | Un enum por archivo, PascalCase, carpeta `Enums/` |
| Constantes | Carpeta `Constants/` (p. ej. `AppConstants.cs`, `CriticalCustomerIds.cs`) |
| Extensions | Carpeta `Extensions/` (p. ej. `BusinessException.cs`) |

### 1.5 BusinessException Pattern

| Convención | Detalle |
|------------|---------|
| Clase `BusinessException` | En `LuxuryApp.Shared.Extensions` |
| Propiedades | `Code` (string), `StatusCode` (int?), `ValidationErrors` (List\<string\>) |
| Uso | Thrown desde services para errores de negocio controlados |
| Códigos | Prefijo de módulo + nombre descriptivo (p. ej. `"BANK_SHORTNAME_REQUIRED"`, `"BANK_NOT_FOUND"`) |
| Mapeo a respuesta | El `GlobalExceptionMiddleware` traduce `BusinessException` a `ApiResponseDTO.ErrorResult()` |

**Sugestión para CONVENTIONS.md:** Documentar el patrón `BusinessException` como convención para manejo de errores.

### 1.6 Spelling `Moduls` (sin 'e')

El proyecto usa `Moduls` en lugar de `Modules` como nombre de carpeta raíz (p. ej. `Application/Moduls/AdminLuxuryApp/`). Esta es una convención de naming que debería estar documentada.

### 1.7 GlobalUsings pattern

Los proyectos usan `GlobalUsings.cs` para centralizar imports compartidos:
```csharp
global using LuxuryApp.Application.DTOs;
global using LuxuryApp.Application.Interfaces;
global using LuxuryApp.Shared.DTOs;
global using LuxuryApp.Shared.Enums;
global using Microsoft.AspNetCore.Builder;
global using Microsoft.AspNetCore.Routing;
```

### 1.8 Endpoint Method Mapping Pattern

```csharp
group.MapGet("{id:guid}", ...)        // GET by ID
group.MapGet("", ...)                  // GET list
group.MapPost("", ...)                 // POST create
group.MapPut("{id:guid}", ...)         // PUT update
group.MapDelete("{id:guid}", ...)      // DELETE
```
Pattern consistente en todos los endpoints.

---

## 2. Violaciones de Convenciones Existentes en el Codebase

### 2.1 🔴 AutoMapper GLOBALMENTE PROHIBIDO (§9)

**CONVENTIONS.md §9:** _"AutoMapper GLOBALMENTE PROHIBIDO (proyecciones `.Select()` y `ToDto()`)."_

**Evidencia en el codebase:**
- `BankMapper.cs` extiende `Profile` y usa `CreateMap<Bank, BankDTO>().ReverseMap()`
- `BankAppService.cs` inyecta `IMapper mapper` en constructor y lo usa para `mapper.Map<Bank>(DTO)` y `mapper.Map<BankDTO>(model)`
- La misma práctica se repite en todos los `*AppService.cs` que tienen un `*Mapper.cs`

**Impacto:** Altísimo. Esta convención se viola de forma sistemática en todo el proyecto.

### 2.2 🔴 `DateTime.UtcNow` Prohibido (§9)

**CONVENTIONS.md §9:** _"NUNCA `DateTime.UtcNow` o `Task.Delay()`. Inyectar `TimeProvider`."_

**Evidencia:**
- `LogUserActivityEndpointFilter.cs` línea 49: `Timestamp = DateTime.UtcNow,`
- `ApiResponseDTO.cs` línea 35: `public DateTime Timestamp { get; set; } = DateTime.UtcNow;`

**Impacto:** Alto. Violación directa de la convención.

### 2.3 🟠 `[AsParameters]` Uso en `PaginationCommonDTO`

**CONVENTIONS.md §9:** _"PROHIBIDO `[AsParameters] PaginationCommonDTO`: trata `Page`/`RecordsNumber` (`int` no-nullable) como obligatorios → 400 'Required parameter int Page' si el cliente los omite"_.

**Evidencia:**
- `PaginationCommonDTO.cs` línea 41 tiene el comentario: _"nullable para que `[AsParameters]` lo trate como opcional"_ pero el DTO real usa `BindAsync` manualmente, lo cual es correcto. El comentario sugiere que el equipo sabe de la convención pero dejó el comentario como documentación de por qué NO usan `[AsParameters]`.

**Impacto:** Bajo. La implementación actual es correcta (usa `BindAsync`), pero el código podría confundir a futuros desarrolladores.

### 2.4 🟡 Inconsistencia en Nomenclatura de Archivos Endpoints

**CONVENTIONS.md no cubre esto explícitamente.** El proyecto usa dos patrones inconsistentes:
- `*Endpoints.cs` (p. ej. `BanksEndpoints.cs`, `PaymentMethodsEndPoints.cs`)
- `*EndPoints.cs` (p. ej. `AddressEndPoints.cs`, `CategoriesEndPoints.cs`, `ConfiguracionEndPoints.cs`)

La diferencia es mayúscula/minúscula en la "P" de EndPoints.

**Impacto:** Medio. La nomenclatura debería ser consistente.

### 2.5 🟡 `SaveChangesAsync()` explícito en endpoints

**CONVENTIONS.md §9 sección de transacciones** dice confiar en `SaveChangesAsync()` implícito por defecto.

**Evidencia:** `BankAppService.cs` llama explícitamente a `await dbContext.SaveChangesAsync()` en los métodos `AddAsync` y `DeleteByIdAsync` y `UpdateAsync`. La convención dice que SaveChanges es implícito y solo se necesita explícito para múltiples operaciones atómicas o transacciones explícitas.

**Impacto:** Bajo. No es un bug, pero es innecesario si la convención de SaveChanges implícito se aplica.

### 2.6 🟡 `Service` class en namespace `Interfaces`

**CONVENTIONS.md §9** dice _"Namespaces por tipo de archivo: `LuxuryApp.Application.{Tipo}`"_.

**Evidencia:** `BankAppService.cs` (una implementación de servicio, no una interfaz) está en namespace `LuxuryApp.Application.Interfaces` — el nombre del namespace sugiere que es solo para interfaces, pero contiene implementaciones.

**Impacto:** Bajo. Confuso pero funcional.

### 2.7 🔴 `[Display]` Attributes con `DateTime.UtcNow` default value

**CONVENTIONS.md §9:** _"NUNCA `DateTime.UtcNow`"_.

**Evidencia:** `ApiResponseDTO.cs` línea 35: `public DateTime Timestamp { get; set; } = DateTime.UtcNow;`

El problema es doble:
1. Usa `DateTime.UtcNow` (prohibido)
2. Como property con default value, inyecta el tiempo de la instanciación del DTO, no el tiempo de creación real de la respuesta

---

## 3. Convenciones Adicionales a Considerar para CONVENTIONS.md

### 3.1 Nuevas Secciones Sugeridas

**Nueva §9.XX — Module & Endpoint Conventions:**
```
- Los endpoints implementan IEndpointModule con MapEndpoints(IEndpointRouteBuilder).
- La estructura de carpetas por módulo es Moduls/<module>/<feature>/ con sub-carpetas:
  Endpoint/, Interfaces/, Services/, DTOs/, Mapping/.
- Los archivos de endpoints usan sufijo Endpoints (no EndPoints), ejemplo: BanksEndpoints.cs.
- Los servicios usan sufijo AppService (ej: BankAppService.cs).
- Las interfaces de servicios usan prefijo I (ej: IBankAppService.cs).
- file-scoped namespaces obligatorio en todos los archivos .cs.
```

**Nueva §9.XX — Error Handling:**
```
- Usar BusinessException (LuxuryApp.Shared.Extensions) para errores de negocio controlados.
- BusinessException incluye Code, StatusCode y ValidationErrors.
- El GlobalExceptionMiddleware traduce BusinessException a ApiResponseDTO.ErrorResult().
- Los códigos de error siguen el patrón "<MODULE>_<DESCRIPTION>" en mayúsculas.
```

**Nueva §9.XX — GlobalUsings:**
```
- Usar GlobalUsings.cs para imports compartidos a nivel de proyecto.
- Ubicación en la raíz del proyecto.
- Incluir global usings para DTOs, Interfaces, Enums, y namespaces de framework.
```

**Nueva §9.XX — Logging & Audit:**
```
- Los endpoints usan .WithMetadata(LogActivityMetadata) para tracking de actividad.
- El atributo [LogUserActivity] aplica el filtro de logging de actividad.
- La tabla UserActivity registra: UserId, Timestamp, Action, Details, IpAddress, Location, UserAgent.
- Los timestamps se generan con TimeProvider (NO DateTime.UtcNow).
```

### 3.2 Convenciones de Naming Existentes a Formalizar

| Elemento | Convención Actual | Ejemplo |
|----------|-------------------|---------|
| Carpeta de módulos | `Moduls` (sin 'e') | `Application/Moduls/AdminLuxuryApp/` |
| Archivo de endpoints | `<Entity>Endpoints.cs` | `BanksEndpoints.cs` |
| Service class | `<Entity>AppService.cs` | `BankAppService.cs` |
| Service interface | `I<Entity>AppService.cs` | `IBankAppService.cs` |
| Mapper class | `<Entity>Mapper.cs` | `BankMapper.cs` |
| DTO (general) | `<Entity>DTO.cs` | `BankDTO.cs` |
| DTO (create/edit) | `<Entity>AddOrEditDTO.cs` | `BankAddOrEditDTO.cs` |
| DTO (paged) | `PagedResultDTO<T>` | En Shared |
| Endpoint metadata | `LogActivityMetadata` | Custom attribute-like pattern |
| Exception class | `BusinessException` | `LuxuryApp.Shared.Extensions` |
| Constants | `AppConstants.cs`, `CriticalCustomerIds.cs` | En `Constants/` |
| GlobalUsings | `GlobalUsings.cs` | En raíz de cada proyecto |

---

## 4. Resumen de Prioridades

| Prioridad | Hallazgo | Estado |
|-----------|----------|--------|
| 🔴 CRÍTICA | AutoMapper GLOBALMENTE PROHIBIDO usado en todo el codebase | Violación |
| 🔴 CRÍTICA | `DateTime.UtcNow` usado en `ApiResponseDTO` y `LogUserActivityEndpointFilter` | Violación |
| 🟠 ALTA | Nomenclatura inconsistente `*Endpoints` vs `*EndPoints` | Convención nueva |
| 🟠 ALTA | Logging de actividad pattern no documentado en CONVENTIONS.md | Convención nueva |
| 🟠 ALTA | Module structure (`Moduls/`) no documentada | Convención nueva |
| 🟡 MEDIA | `BusinessException` pattern no documentado | Convención nueva |
| 🟡 MEDIA | `GlobalUsings.cs` pattern no documentado | Convención nueva |
| 🟡 MEDIA | `[Display]` attributes on DTOs — ya documentado en §9 | OK |
| 🟡 MEDIA | `SaveChangesAsync()` explícito donde debería ser implícito | Violación menor |
| 🟢 BAJA | Namespace `Interfaces` contiene implementaciones de servicio | Convención nueva |

---

## 5. Conclusión

El codebase API tiene:
- **2 violaciones críticas** de convenciones existentes (AutoMapper y `DateTime.UtcNow`)
- **6+ convenciones no documentadas** que deberían agregarse a CONVENTIONS.md
- **1 convención de naming inconsistente** (`Endpoints` vs `EndPoints`)
- **1 convención de folder naming** (`Moduls` vs `Modules`) que debería formalizarse

Se recomienda priorizar la eliminación de AutoMapper (reemplazar con `.Select()`/`ToDto()` projections) y `DateTime.UtcNow` (reemplazar con `TimeProvider` inyectado antes de actualizar CONVENTIONS.md con las nuevas convenciones descubiertas.
