# Nota técnica — caché de selects y procedimiento de invalidación (T-005)

> **Tipo:** nota técnica (R0, T-005). Implementación mínima + prueba.
> **Fecha:** 2026-09-26
> **Módulo:** `SharedLuxuryApp` / `SelectItem`

## 1. Mecanismo identificado

`SelectItemAppService.GetOrSetAsync` (`api/.../Modules/SharedLuxuryApp/SelectItem/Services/SelectItemAppService.cs`)
usa **`IMemoryCache`** (`Microsoft.Extensions.Caching.Memory`) con `GetOrCreateAsync` y expiración
absoluta por entrada. No hay caché distribuido ni `IDistributedCache`.

- El servicio se registra `AddScoped`, pero `IMemoryCache` es **singleton del proceso**.

| Clave | TTL | Método |
| :--- | :--- | :--- |
| `si:maquinaria:todos:{customerId}` | `TtlCatalogoPorCliente` (5 min) | `SelectItemMachineriesGetAllAsync` |
| `si:maquinaria:activos:{customerId}` | `TtlCatalogoPorCliente` (5 min) | `SelectItemMachineriesActiveAsync` |

`SelectItemEnumEndPoints.GetEnumSelectList` usa la misma `IMemoryCache` con claves
`enum:{TEnum}:{defaultOption}` y TTL 24 h (`TtlEnum`).

## 2. El problema

`IMemoryCache` **no expone enumeración de claves**, por lo que no es posible invalidar "todo lo que
empiece con `si:maquinaria:`" sin un registro de claves. Como el TTL es de 5 min, tras el backfill
(D1) o el cambio de FK (R2) un dropdown podría seguir mostrando datos cacheados hasta 5 min.

## 3. Procedimiento implementado

En `SelectItemAppService` (con su contrato en `ISelectItemAppService`):

- `void InvalidateMachineryCache(Guid customerId)` — invalida las 2 claves de maquinaria del cliente.
- `void InvalidateCacheByPrefix(string prefix)` — invalida cualquier clave registrada que comience
  por el prefijo (por ejemplo `si:maquinaria:activos:{customerId}`).

Mecanismo: `GetOrSetAsync` registra cada clave creada en un `ConcurrentDictionary` estático
(`RegisteredCacheKeys`); la invalidación por prefijo recorre ese registro, hace `cache.Remove(key)` y
lo depura.

```csharp
service.InvalidateMachineryCache(customerId);              // por cliente
service.InvalidateCacheByPrefix("si:maquinaria:");         // por prefijo (todos los clientes)
```

## 4. Uso operativo (D1 / R2)

- **Por cliente:** tras migrar los datos de ese cliente, llamar `InvalidateMachineryCache(customerId)`.
- **Global:** `InvalidateCacheByPrefix("si:maquinaria:")` o reiniciar la API (el caché es de proceso).
- **Enums:** al reiniciar, el caché de 24 h de `inventory-category` se reconstruye con el valor
  `FireProtection` ya excluido (T-003).

## 5. Pruebas

`api/LuxuryApp.Tests/Application/Modules/MaintenanceLuxuryApp/Machinery/MachineryFireProtectionR0Tests.cs`
(`T005_InvalidateMachineryCache_RefreshesCachedSelectAfterDataChange`,
`T005_InvalidateCacheByPrefix_RemovesMatchingKeysOnly`): demuestran que la lectura repetida se sirve
de caché y que, tras invalidar, vuelve a consultar la base; y que el prefijo solo afecta las claves
que coinciden.

## 6. Registro

| Fecha | Actor | Acción |
| :--- | :--- | :--- |
| 2026-09-26 | Agente ejecutor (R0) | Mecanismo identificado; invalidación por cliente y prefijo implementada y probada (T-005). |
