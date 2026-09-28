# iendpointsmodule-pattern.md — Patrón IEndPointsModule Obligatorio

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Implementación real:** Todos los endpoints en `api/LuxuryApp.Application/Modules/*/EndPoints/`

---

## 1. Interfaz Obligatoria

**Ubicación:** `api/LuxuryApp.Application/Shared/EndPoints/IEndPointsModule.cs`

```csharp
namespace LuxuryApp.Application.Shared.EndPoints;

public interface IEndPointsModule
{
    /// <summary>
    /// Registra los endpoints del módulo en el pipeline de routing.
    /// </summary>
    void MapEndPoints(IEndpointRouteBuilder app);
}
```

> **Regla:** **TODO módulo que exponga endpoints HTTP DEBE implementar `IEndPointsModule`.**

---

## 2. Estructura Estándar de Implementación

```csharp
namespace MiModulo.SubModulo.EndPoints;

public sealed class MiModuloEndPoints : IEndPointsModule
{
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        // 1. Grupo base con prefijo /api
        var group = app.MapGroup("api/mi-modulo")
                       .RequireAuthorization()           // Obligatorio: auth
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>(); // Obligatorio: auditoría

        // 2. Mapear endpoints con patrones estándar
        group.MapGet("entidad", async (IService s) => TypedResults.Ok(await s.GetAllAsync()))
             .WithMetadata(new LogActivityMetadata("Entidad_GetList", "Lista de entidades"));

        group.MapGet("entidad/{id:guid}", async (Guid id, IService s) => TypedResults.Ok(await s.GetByIdAsync(id)))
             .WithMetadata(new LogActivityMetadata("Entidad_GetById", "Detalle de entidad"));

        group.MapPost("entidad", async ([FromForm] CreateEntidadDTO dto, IService s) => 
             TypedResults.Ok(await s.CreateAsync(dto)))
             .WithMetadata(new LogActivityMetadata("Entidad_Create", "Crear entidad"));

        group.MapPut("entidad/{id:guid}", async (Guid id, [FromForm] UpdateEntidadDTO dto, IService s) => 
             TypedResults.Ok(await s.UpdateAsync(id, dto)))
             .WithMetadata(new LogActivityMetadata("Entidad_Update", "Actualizar entidad"));

        group.MapDelete("entidad/{id:guid}", async (Guid id, IService s) => 
             TypedResults.Ok(await s.DeleteAsync(id)))
             .WithMetadata(new LogActivityMetadata("Entidad_Delete", "Eliminar entidad"));
    }
}
```

---

## 3. Elementos Obligatorios en Cada Endpoint

| Elemento | Obligatorio | Ejemplo |
|----------|-------------|---------|
| **Grupo base** | ✅ | `app.MapGroup("api/mi-modulo")` |
| **Autorización** | ✅ | `.RequireAuthorization()` |
| **Filtro auditoría** | ✅ | `.AddEndpointFilter<LogUserActivityEndPointsFilter>()` |
| **Metadata actividad** | ✅ | `.WithMetadata(new LogActivityMetadata("Acción", "Descripción"))` |
| **Tipado respuesta** | ✅ | `TypedResults.Ok(ApiResponseDTO<T>.SuccessResult(...))` |
| **Parámetros ruta** | ✅ | `{id:guid}`, `{customerId:guid}` |
| **FromForm para archivos** | ✅ | `([FromForm] CreateDTO dto)` |

---

## 4. Registro en ServiceExtensions (Startup)

**Ubicación:** `api/LuxuryApp.Api/ServiceExtensions/EndPointsModuleRegistration.cs`

```csharp
public static class EndPointsModuleRegistration
{
    public static IEndpointRouteBuilder MapAllEndPointsModules(this IEndpointRouteBuilder app)
    {
        // Obtener todas las implementaciones de IEndPointsModule registradas en DI
        var modules = app.ServiceProvider.GetServices<IEndPointsModule>();
        
        foreach (var module in modules)
        {
            module.MapEndPoints(app);
        }
        
        return app;
    }
}
```

**En Program.cs / Startup:**
```csharp
// Registrar módulos en DI (en cada módulo su ServiceCollectionExtensions)
services.AddScoped<IEndPointsModule, MiModuloEndPoints>();
services.AddScoped<IEndPointsModule, OtroModuloEndPoints>();

// En app:
app.MapAllEndPointsModules();
```

---

## 5. Ejemplos Reales en el Proyecto

| Módulo | Archivo | Endpoints |
|--------|---------|-----------|
| **SharedLuxuryApp.SelectItem** | `SelectItemEndPoints.cs` | 100+ endpoints dinámicos |
| **SharedLuxuryApp.Catalogs.SelectItems** | `SelectItemEnumEndPoints.cs` | 80+ enums estáticos |
| **RecruitmentLuxuryApp.Candidates** | `CandidateEndPoints.cs` | CRUD candidatos |
| **AdminLuxuryApp** | `AdminEndPoints.cs` | Admin, catálogos, diagnósticos |
| **SystemLuxuryApp** | `SystemEndPoints.cs` | Configuración, tenants |

---

## 6. Checklist al Crear Nuevo Módulo de Endpoints

- [ ] Crear `MiModuloEndPoints.cs` implementando `IEndPointsModule`
- [ ] Usar `MapGroup("api/mi-modulo")` con prefijo `/api`
- [ ] Aplicar `.RequireAuthorization()` al grupo
- [ ] Aplicar `.AddEndpointFilter<LogUserActivityEndPointsFilter>()`
- [ ] Cada endpoint con `.WithMetadata(new LogActivityMetadata("Acción", "Descripción"))`
- [ ] Respuestas con `TypedResults.Ok(ApiResponseDTO<T>.SuccessResult(...))`
- [ ] Parámetros de ruta tipados: `{id:guid}`, `{customerId:guid}`
- [ ] `[FromForm]` obligatorio si recibe `IFormFile`
- [ ] Registrar en DI: `services.AddScoped<IEndPointsModule, MiModuloEndPoints>()`
- [ ] Verificar que `MapAllEndPointsModules()` lo incluye

---

## 7. Filtros y Metadata de Auditoría

### LogUserActivityEndPointsFilter
```csharp
// Filtro global que registra actividad de usuario en cada request
public class LogUserActivityEndPointsFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        // Extrae metadata LogActivityMetadata del endpoint
        // Registra: usuario, acción, timestamp, parámetros
        return await next(context);
    }
}
```

### LogActivityMetadata
```csharp
// Metadatos obligatorios en cada endpoint
public record LogActivityMetadata(string Action, string Description);
```

**Uso:**
```csharp
.WithMetadata(new LogActivityMetadata("Candidate_Create", "Crear nuevo candidato"));
```

---

## 7. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `select-items-centralization-rule.md` | Hubs SelectItems |
| `api-method-naming-conventions.md` | 6 patrones: CreateAsync, GetByIdAsync, GetListAsync, UpdateAsync, DeleteByIdAsync, DeleteRangeAsync |
| `backend-rules.md` | Reglas generales backend |
| `SelectItemEndPoints.cs` | Implementación real completa |
| `LogUserActivityEndPointsFilter.cs` | Filtro de auditoría |