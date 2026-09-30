# select-item-filtering-rules.md — Reglas de Filtrado y Actualización de SelectItems

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Referencia:** CONVENTIONS.md §6.1 (Regla CRÍTICA - SELECTs Centralización Obligatoria)

---

## 1. Regla de Oro: NUNCA Modificar SelectItem/SelectItemEnum Existente

### ❌ PROHIBIDO
```csharp
// Si necesitas agregar un valor a un enum existente:
public enum Status { Abierto, Cerrado, Liquidado }

// NO hagas esto:
public enum Status { Abierto, Cerrado, Liquidado, Pendiente }  // ROMPE consumidores
```

### ✅ CORRECTO: Crear NUEVO SelectItem con nombre distinto
```csharp
// 1. Crear NUEVO enum/SelectItem extendido
public enum StatusExtended { Abierto, Cerrado, Liquidado, Pendiente }

// 2. Registrarlo en el hub correspondiente (SelectItemEnumEndPoints.cs o SelectItemEndPoints.cs)

// 3. Usarlo SOLO en el módulo que lo necesita
// Los demás módulos siguen usando el original sin cambios
```

### ¿Por qué?
```
ESCENARIO REAL:
- Módulo A lee SelectItem "Status" → valores [Abierto, Cerrado, Liquidado]
- Módulo B valida: "Solo Abierto y Cerrado" (rechaza Liquidado)
- Módulo C espera que exista "Liquidado"

SI modificas "Status" → [Abierto, Cerrado, Liquidado, Pendiente]:
- Módulo A recibe "Pendiente" sin esperarlo → inconsistencia
- Módulo B rechaza "Pendiente" → ERROR de validación
- Módulo C sigue funcionando pero datos contaminados
```

---

## 2. Dónde Vive la Lógica de Filtrado por Rol

### Regla: **En el Service (`ISelectItemAppService`), NO en el Endpoint**

```csharp
// SelectItemAppService.cs - GetRolesForAnnouncementsAsync()
public async Task<ApiResponseDTO<List<SelectItemDTO<string>>>> GetRolesForAnnouncementsAsync()
{
    var userPrimaryRoleName = currentUserService.UserRole;
    
    // Lógica de negocio AQUÍ (service), no en endpoint
    if (userPrimaryRoleName == "SuperUsuario" || userPrimaryRoleName == "Direccion")
    {
        // Ven todos los roles
    }
    else if (userRole.RoleType == RoleType.Corporate)
    {
        // Ven Corporate + Staff
    }
    else if (operationalCreators.Contains(userPrimaryRoleName))
    {
        // Ven solo Staff
    }
}
```

### ¿Por qué en el Service?
| Ubicación | Ventaja |
|-----------|---------|
| **Service** | Reutilizable, testeable, centralizado, cachéable |
| Endpoint | Duplicado si hay múltiples endpoints, no testeable fácilmente |
| Policy/Handler | Solo para autorización binaria (sí/no), no para filtrado de datos |

---

## 3. Tipos de SelectItem y su Filtrado

| Tipo | Filtrado por Rol | Ejemplo |
|------|------------------|---------|
| **Catálogos globales** (Bancos, CFDI, Unidades) | ❌ No | Todos ven lo mismo |
| **Catálogos por cliente** (Empleados, Propiedades) | ✅ Sí (tenant) | `customerId` en query |
| **Roles/Permisos** | ✅ Sí (rol usuario) | `GetRolesForAnnouncementsAsync()` |
| **Enums estáticos** | ❌ No (salvo excepción) | `SelectItemEnumEndPoints` sin filtro |

---

## 4. Patrones de Filtrado Comunes

### A. Por Tenant (CustomerId)
```csharp
// Endpoint
g.MapGet("employees/{customerId:guid}", async (Guid customerId, ISelectItemAppService s) 
    => TypedResults.Ok(await s.SelectItemEmployeesActiveAsync(customerId)));

// Service - aplica filtro tenant automáticamente
public Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> SelectItemEmployeesActiveAsync(Guid customerId)
    => GetOrSetAsync($"si:employees:{customerId}", TtlCatalogoPorCliente, 
        () => dbContext.Employees.Where(e => e.CustomerId == customerId && e.Active)...);
```

### B. Por Rol de Usuario (CurrentUserService)
```csharp
// Service
var userPrimaryRoleName = currentUserService.UserRole;
var userRole = await roleManager.FindByNameAsync(userPrimaryRoleName);
if (userRole.RoleType == RoleType.Corporate) { ... }
```

### C. Por Contexto de Negocio (Matriz de Entrevistadores)
```csharp
// Endpoint con parámetro de negocio
g.MapGet("operations-interviewers/by-request-position/{requestPositionId:guid}", 
    async (Guid requestPositionId, ISelectItemAppService s) 
        => TypedResults.Ok(await s.SelectItemOperationsInterviewersByRequestPositionAsync(requestPositionId)));

// Service - lógica compleja de matriz
public async Task<...> SelectItemOperationsInterviewersByRequestPositionAsync(Guid requestPositionId)
{
    var position = await dbContext.RequestPositions.FindAsync(requestPositionId);
    var interviewers = await dbContext.InterviewerMatrices
        .Where(m => m.RequestPositionId == requestPositionId && m.IsActive)
        .Select(m => m.InterviewerUserId)
        .ToListAsync();
    // ... retorna solo entrevistadores válidos para esa vacante
}
```

---

## 5. Checklist al Agregar/Modificar SelectItem

- [ ] **¿Es enum estático?** → `SelectItemEnumEndPoints.cs` (IMemoryCache 24h)
- [ ] **¿Es dato dinámico?** → `SelectItemEndPoints.cs` + `ISelectItemAppService` (TTL 5-15 min)
- [ ] **¿Requiere filtrado por rol?** → Lógica en **Service**, no en Endpoint
- [ ] **¿Requiere filtrado por tenant?** → Parámetro `customerId` obligatorio
- [ ] **¿Nuevo valor en enum existente?** → **CREAR NUEVO SelectItem** (ej. `StatusExtended`), NO modificar el original
- [ ] **¿SelectItem obsoleto?** → Marcar `// @DEAD: motivo` en endpoint
- [ ] **¿Frontend consumidor?** → Verificar en `enum-select.service.ts` y endpoints constants

---

## 6. Referencias Cruzadas

| Documento | Qué cubre |
|-----------|-----------|
| `select-items-centralization-rule.md` | Hubs únicos, naming, prohibiciones |
| `enum-display-name-extension.md` | `GetDisplayName()` obligatorio en español |
| `select-items-ttl-policy.md` | TTL 15min global vs 5min cliente, `GetOrSetAsync` |
| `enum-select-service.md` | Frontend: servicio centralizado + cache `shareReplay(1)` |
| `iendpointsmodule-pattern.md` | `IEndPointsModule` obligatorio |
| CONVENTIONS.md §6.1 | Regla CRÍTICA completa |
