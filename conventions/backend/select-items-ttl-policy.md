# select-items-ttl-policy.md — Política de Caché (TTL) para SelectItems

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Implementación real:** `SelectItemAppService.cs:16-30`

---

## 1. Dos Niveles de TTL (Time To Live)

| Categoría | TTL | Clave de Caché | Ejemplos |
|-----------|-----|----------------|----------|
| **Catálogos Globales** | **15 minutos** | `si:{nombre}:global` | Bancos, CFDI, Unidades medida, Roles app, Categorías, Tipos pago, Profesiones |
| **Catálogos por Cliente (Tenant)** | **5 minutos** | `si:{nombre}:{customerId}` | Empleados, Propiedades, Maquinarias, Almacenes, Vacantes, Entrevistadores |

---

## 2. Constantes Definidas en Código

```csharp
// SelectItemAppService.cs:16-19
private static readonly TimeSpan TtlCatalogoGlobal = TimeSpan.FromMinutes(15);
private static readonly TimeSpan TtlCatalogoPorCliente = TimeSpan.FromMinutes(5);
```

---

## 3. Patrón Obligatorio: `GetOrSetAsync<T>`

**Ubicación:** `SelectItemAppService.cs:25-30`

```csharp
/// <summary>
/// Helper genérico de caché. Si la clave existe, devuelve el valor almacenado;
/// si no, ejecuta la consulta y guarda el resultado en caché con el TTL indicado.
/// </summary>
private Task<T> GetOrSetAsync<T>(string cacheKey, TimeSpan ttl, Func<Task<T>> factory)
    => cache.GetOrCreateAsync(cacheKey, entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = ttl;
        return factory();
    })!;
```

### Uso Estándar en Métodos del Service

```csharp
// Catálogo global (15 min)
public Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> SelectItemBankAsync()
    => GetOrSetAsync("si:banks:global", TtlCatalogoGlobal, async () =>
    {
        var data = await dbContext.Banks
            .Where(b => b.IsActive)
            .Select(b => new SelectItemDTO<Guid> { Value = b.Id, Label = b.Name })
            .ToListAsync();
        return ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(data);
    });

// Catálogo por cliente (5 min)
public Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> SelectItemEmployeesActiveAsync(Guid customerId)
    => GetOrSetAsync($"si:employees:{customerId}", TtlCatalogoPorCliente, async () =>
    {
        var data = await dbContext.Employees
            .Where(e => e.CustomerId == customerId && e.IsActive)
            .Select(e => new SelectItemDTO<Guid> { Value = e.Id, Label = e.FullName })
            .ToListAsync();
        return ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(data);
    });
```

---

## 4. Reglas de Nomenclatura de Claves de Caché

| Patrón | Formato | Ejemplo |
|--------|---------|---------|
| Global | `si:{entidad}:global` | `si:banks:global`, `si:roles:aplicacion` |
| Por Cliente | `si:{entidad}:{customerId}` | `si:employees:abc-123-guid` |
| Con Parámetros | `si:{entidad}:{param1}:{param2}` | `si:property-accounts:guid:2026` |

> **Regla:** Prefijo obligatorio `si:` (SelectItem) para evitar colisiones con otros cachés.

---

## 5. Invalidez de Caché (Cuándo Limpia)

| Evento | Acción |
|--------|--------|
| **Expiración natural (TTL)** | Automática por `AbsoluteExpirationRelativeToNow` |
| **Creación/Edición/Eliminación de registro** | **NO se invalida automáticamente** → espera TTL (máx 15 min) |
| **Reinicio de aplicación** | Limpia todo (MemoryCache es in-process) |
| **Deploy nuevo** | Limpia todo (nuevo proceso) |

> **Nota:** No hay invalidación proactiva por simplicidad. TTLs cortos (5-15 min) aceptables para catálogos de selección.

---

## 6. Endpoints de Enums (SelectItemEnumEndPoints) — TTL Distinto

```csharp
// SelectItemEnumEndPoints.cs:6-16
private static readonly TimeSpan TtlEnum = TimeSpan.FromHours(24);

private static IResult GetEnumSelectList<TEnum>(IMemoryCache cache, bool? defaultOption) 
    where TEnum : Enum
{
    var cacheKey = $"enum:{typeof(TEnum).Name}:{defaultOption}";
    var result = cache.GetOrCreate(cacheKey, entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TtlEnum;  // 24 HORAS
        return EnumExtensions.GetSelectListForEnum<TEnum>(defaultOption);
    });
    return TypedResults.Ok(ApiResponseDTO<List<SelectItemDTO<int?>>>.SuccessResult(result));
}
```

| Tipo | TTL | Justificación |
|------|-----|---------------|
| Enums estáticos | **24 horas** | Solo cambian al recompilar (deploy) |
| Datos dinámicos (BD) | **5-15 min** | Cambian en runtime por usuarios |

---

## 7. Decisiones de Diseño

| Decisión | Justificación |
|----------|---------------|
| **MemoryCache in-process** | Simple, sin dependencia externa (Redis), suficiente para catálogos |
| **TTL fijo (no sliding)** | Predecible, evita "caché eterno" si hay tráfico constante |
| **Sin invalidación proactiva** | Complejidad > beneficio para TTLs de 5-15 min |
| **Clave con prefijo `si:`** | Evita colisiones con otros cachés del sistema |

---

## 8. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `select-item-filtering-rules.md` | Dónde vive lógica de filtrado por rol/tenant |
| `enum-select-service.md` | Frontend: cache `shareReplay(1)` paralelo |
| `select-items-centralization-rule.md` | Hubs únicos, naming |
| `SelectItemAppService.cs` | Implementación real (líneas 16-30) |