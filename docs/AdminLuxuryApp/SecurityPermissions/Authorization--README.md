# Authorization (Servicio de Roles de Usuario)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Servicio utilitario `UserRoleService` (sin endpoints propios). Expone `IUserRoleService.GetUsersInRoleAsync(string roleName, Guid? customerId)` para obtener usuarios por rol, con filtro opcional por cliente.

Usado internamente por otros modulos. No tiene controller.
