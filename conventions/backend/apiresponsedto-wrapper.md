# apiresponsedto-wrapper.md — ApiResponseDTO<T> Obligatorio en Todos los Endpoints

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Implementación real:** `api/LuxuryApp.Application/Shared/DTOs/ApiResponseDTO.cs`

---

## 1. Regla: Envoltorio Obligatorio

**TODOS** los endpoints HTTP DEBEN retornar respuesta envuelta en `ApiResponseDTO<T>`.

```csharp
// ✅ CORRECTO
return TypedResults.Ok(ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(data));

// ❌ PROHIBIDO - Respuesta "plana"
return TypedResults.Ok(data);
return Results.Ok(data);
```

---

## 2. Estructura de `ApiResponseDTO<T>`

**Archivo:** `api/LuxuryApp.Application/Shared/DTOs/ApiResponseDTO.cs`

```csharp
public record ApiResponseDTO<T>
{
    /// <summary>Indica si la operación fue exitosa (HTTP 2xx).</summary>
    public bool Success { get; init; }

    /// <summary>Datos de respuesta (null si error).</summary>
    public T? Data { get; init; }

    /// <summary>Mensaje legible para usuario (éxito o error).</summary>
    public string Message { get; init; } = string.Empty;

    /// <summary>Código de error interno (opcional, para debugging).</summary>
    public string? ErrorCode { get; init; }

    /// <summary>Detalles técnicos (stack trace solo en Development).</summary>
    public string? Details { get; init; }

    // Factory methods
    public static ApiResponseDTO<T> SuccessResult(T data, string message = "Operación exitosa")
        => new() { Success = true, Data = data, Message = message };

    public static ApiResponseDTO<T> ErrorResult(string message, string? errorCode = null, string? details = null)
        => new() { Success = false, Message = message, ErrorCode = errorCode, Details = details };
}
```

---

## 3. Patrones de Respuesta Estándar

### A. Éxito con Datos (GET, POST, PUT)
```csharp
// GET List
return TypedResults.Ok(ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(data));

// GET ById
return TypedResults.Ok(ApiResponseDTO<CandidateDetailDto>.SuccessResult(candidate));

// POST Create
return TypedResults.Ok(ApiResponseDTO<CandidateResponseDto>.SuccessResult(created, "Candidato creado"));

// PUT Update
return TypedResults.Ok(ApiResponseDTO<CandidateResponseDto>.SuccessResult(updated, "Candidato actualizado"));
```

### B. Éxito Sin Datos (DELETE)
```csharp
return TypedResults.Ok(ApiResponseDTO<bool>.SuccessResult(true, "Eliminado correctamente"));
```

### C. Error Controlado (BusinessException)
```csharp
// En GlobalExceptionMiddleware / filtros
return TypedResults.BadRequest(ApiResponseDTO<T>.ErrorResult(
    message: "Validación fallida",
    errorCode: "VALIDATION_ERROR",
    details: "Campo 'Email' es requerido"
));
```

### D. Error 404
```csharp
if (entity == null)
    return TypedResults.NotFound(ApiResponseDTO<T>.ErrorResult("No encontrado", "NOT_FOUND"));
```

---

## 4. Códigos de Error Estándar (ErrorCode)

| Código | HTTP Status | Cuándo Usar |
|--------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | DTO inválido, reglas de negocio |
| `NOT_FOUND` | 404 | Recurso no existe |
| `UNAUTHORIZED` | 401 | Token inválido/expirado |
| `FORBIDDEN` | 403 | Sin permisos (rol/tenant) |
| `CONFLICT` | 409 | Duplicado, violación unique |
| `INTERNAL_ERROR` | 500 | Excepción no controlada |
| `EXTERNAL_SERVICE_ERROR` | 502 | Aspel, OneSignal, WhatsApp fallan |

---

## 5. Tipado Genérico en Endpoints

```csharp
// Endpoint tipado con ApiResponseDTO<T>
group.MapGet("entidad/{id:guid}", async (Guid id, IService s) => 
{
    var result = await s.GetByIdAsync(id);
    return result is null
        ? TypedResults.NotFound(ApiResponseDTO<EntidadDto>.ErrorResult("No encontrado", "NOT_FOUND"))
        : TypedResults.Ok(ApiResponseDTO<EntidadDto>.SuccessResult(result));
})
.WithMetadata(new LogActivityMetadata("Entidad_GetById", "Detalle de entidad"));
```

---

## 6. Frontend: Consumo Estándar

**Servicio base:** `ApiResponseService` (`core/http/services/api-response.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class ApiResponseService {
  // Extrae Data del wrapper, lanza error si Success=false
  onGetList<T>(url: string): Observable<T[]> {
    return this.http.get<ApiResponseDTO<T[]>>(url).pipe(
      map(response => {
        if (!response.success) throw new Error(response.message);
        return response.data ?? [];
      })
    );
  }
}
```

**Componentes consumen `Observable<T[]>` directo**, sin saber del wrapper.

---

## 7. Checklist al Crear Endpoint

- [ ] Retorna `TypedResults.Ok(ApiResponseDTO<T>.SuccessResult(...))` en éxito
- [ ] Retorna `TypedResults.NotFound/BadRequest(ApiResponseDTO<T>.ErrorResult(...))` en error
- [ ] `T` es el tipo de datos real (no `object`, no `dynamic`)
- [ ] `Message` legible para usuario final
- [ ] `ErrorCode` estándar si aplica
- [ ] Frontend usa `ApiResponseService` para desempaquetar

---

## 8. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `iendpointsmodule-pattern.md` | Patrón `IEndPointsModule` + `TypedResults` |
| `api-method-naming-conventions.md` | 6 patrones estándar |
| `backend-rules.md` | Reglas generales backend |
| `ApiResponseDTO.cs` | Implementación real |
| `GlobalExceptionMiddleware.cs` | Manejo global de errores → wrapper |
