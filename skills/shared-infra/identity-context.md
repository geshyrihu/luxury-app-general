# 🏗️ Identity Context & Current User Service

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §18.3 (Identity Context). Este archivo contiene ejemplos detallados.

## 4.7. ICurrentUserService
Inyectar este servicio en cualquier servicio que necesite datos del usuario autenticado.
**Prohibido**: Acceder a `IHttpContextAccessor` directamente en servicios de negocio.

### Propiedades Disponibles
- `UserId`: string (Claim "sub" del JWT).
- `UserName`: string (Claim "username").
- `FullName`: firstName + " " + lastName.
- `Email`: claim "email".
- `CustomerId`: **Guid?** (null para usuarios admin sin cliente).
- `UserRole`: string.
- `RoleId`: string.

### Notas de Nullabilidad
- **Importante**: Siempre verificar `currentUser.CustomerId` antes de usarlo como filtro.
- Si el usuario es **Admin Global**, `CustomerId` es `null`. Omitir el filtro por cliente en ese caso.

```csharp
// Patrón correcto para filtros con CustomerId opcional
var query = context.Equipos.AsNoTracking();
if (currentUser.CustomerId.HasValue)
    query = query.Where(e => e.CustomerId == currentUser.CustomerId.Value);
```
