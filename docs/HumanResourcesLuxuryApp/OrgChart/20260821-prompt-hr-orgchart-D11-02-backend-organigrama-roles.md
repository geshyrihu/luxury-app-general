# TICKET D11-02 — Backend: organigrama sobre roles + arreglo de `EmployeeFileAppService`

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. El esquema de `OrgHierarchy` (puesto→rol, `CustomerId`
obligatorio) ya está aprobado (D11-01b). **Ahora mismo el repo completo no compila** — este ticket
es lo que lo arregla. Dos consumidores rotos, dos tareas independientes:

1. `WorkPositionOrgChartAppService.cs` — reescritura real, es el grueso del ticket.
2. `EmployeeFileAppService.cs:380` — arreglo pequeño y acotado (quitar un campo).

No toques frontend — es D11-03, después de que este backend esté aprobado.

## ⚠️ El riesgo #1 de este ticket: no reintroducir la fuga cross-cliente

`ApplicationRole` es **global** (sin `CustomerId`, un mismo rol como "Administrador" existe para
todos los clientes). El algoritmo original operaba sobre `WorkPosition`, cuyo `Id` ya estaba
implícitamente atado a un cliente — nunca necesitó filtrar por `CustomerId` en las consultas
internas de `OrgHierarchy`. Ahora sí hace falta, en **cada** consulta a `OrgHierarchy` dentro del
servicio (detección de ciclos, recálculo de niveles, búsqueda del padre actual, todo) — si se te
olvida el filtro `CustomerId` en una sola de esas consultas, dos clientes distintos que usan el
mismo rol (ej. ambos tienen "Administrador") **mezclarían sus jerarquías silenciosamente** — es
exactamente la fuga cross-cliente (RS-01) que todo este rediseño existe para cerrar. Este es el
error más fácil de cometer al traducir el algoritmo mecánicamente; revísalo con cuidado en cada
método.

## Tarea 1 — Reescribir `WorkPositionOrgChartAppService`

Archivo: `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/Employees/EmployeeOrganigrama/Services/WorkPositionOrgChartAppService.cs`
(288 líneas, ya lo conoces si lo leíste — si no, léelo completo primero). Mismo algoritmo
estructural (detección de ciclos, recálculo de niveles BFS, reordenamiento de hermanos, buckets
por padre), traducido de `WorkPosition`/`Guid` a `ApplicationRole`/`string`, con `CustomerId` como
filtro obligatorio agregado en todo.

### DTOs nuevos

Reemplaza `WorkPositionOrgChartNodeDto` por dos DTOs (un nodo de rol ahora puede tener varios
miembros — esto es lo que reemplaza al agrupamiento sintético que hacía el frontend con
`org-chart-grouping.ts`, ver D11-03 después):

```csharp
public record RoleOrgChartNodeDto
{
    public string RoleId { get; set; }
    public string RoleDisplayName { get; set; }
    public string DepartmentName { get; set; }
    public int HierarchyLevel { get; set; }
    public int SortOrder { get; set; }
    public List<RoleOrgChartMemberDto> Members { get; set; } = [];
    public List<RoleOrgChartNodeDto> Children { get; set; } = [];
}

public record RoleOrgChartMemberDto
{
    public Guid WorkPositionId { get; set; }
    public string Folio { get; set; }
    public bool HasEmployee { get; set; }
    public string EmployeeName { get; set; }
    public string EmployeeEmail { get; set; }
    public string EmployeePhone { get; set; }
    public string EmployeePhoto { get; set; }
    public string State { get; set; }
}
```

Y el DTO de reasignación, mismo shape que antes con los IDs cambiados de tipo:

```csharp
public record RoleOrgChartReassignRequest
{
    public string RoleId { get; set; }
    public string NewReportsToRoleId { get; set; }
    public int SortOrder { get; set; }
}
```

(`WorkPositionReassignResponse` no cambia, se reutiliza tal cual.)

### `GetTreeAsync(Guid customerId)`

**El universo de nodos NO sale de `OrgHierarchy`, sale de qué roles están realmente en uso por
ese cliente** — mismo criterio que el algoritmo original anclaba en `WorkPosition` activos, no en
las aristas de jerarquía (así un rol sin jerarquía asignada todavía aparece como raíz suelta, en
vez de no aparecer). Concretamente:

1. Trae los roles distintos en uso: `dbContext.WorkPosition.Where(x => x.CustomerId == customerId && x.State == State.Activo).Select(x => x.ApplicationRoleId).Distinct()`, con su `ApplicationRole` incluido (`DisplayName`, `Departament`).
2. Trae las aristas de jerarquía del cliente: `dbContext.OrgHierarchy.Where(h => h.CustomerId == customerId && h.IsActive)`.
3. Arma un nodo `RoleOrgChartNodeDto` por cada rol del paso 1, usando la arista del paso 2 que
   tenga `ChildRoleId == role.Id` para resolver `HierarchyLevel`/`SortOrder`/a qué padre reporta
   (si no hay arista, es una raíz suelta — `HierarchyLevel = 0`, sin padre, igual que el
   comportamiento original para un puesto sin jerarquía).
4. Llena `Members` de cada nodo con **todos** los `WorkPosition` activos de ese cliente con ese
   `ApplicationRoleId` (`Include(x => x.Employee).ThenInclude(e => e.User)`), mapeando
   `HasEmployee`/`EmployeeName`/`Email`/`Phone`/`Photo` igual que hacía el nodo original por
   puesto individual.
5. Arma el árbol (raíz = nodos sin `ReportsToRoleId` resuelto o cuyo padre no está en el mapa de
   nodos), ordena por `SortOrder`, igual que el algoritmo original.

### `ReassignAsync(RoleOrgChartReassignRequest request, Guid customerId)`

**Cambia la firma para recibir `customerId` explícito** (antes no hacía falta, ahora es
obligatorio para no mezclar jerarquías entre clientes — pásalo también desde el endpoint, ver
Tarea 2). Traduce el algoritmo tal cual, con estos reemplazos:

- Toda consulta a `dbContext.OrgHierarchy` agrega `&& h.CustomerId == customerId`.
- La búsqueda/creación de la arista existente se hace por `(CustomerId, ChildRoleId)`, no sólo por
  `ChildRoleId` — recuerda que el mismo rol puede tener aristas independientes en clientes
  distintos.
- `WouldCreateCycleAsync`, `RecalculateLevelsAsync`, `GetParentBucketKey` — misma lógica, cambia
  `Guid` por `string` y agrega el filtro de cliente donde consulten `OrgHierarchy`.
- Ya no hace falta validar que el `WorkPosition` exista (`dbContext.WorkPosition.FindAsync(...)`)
  — ahora valida que el **rol** exista: `dbContext.ApplicationRole.FindAsync(request.RoleId)` /
  `FindAsync(request.NewReportsToRoleId)`.

## Tarea 2 — Endpoint

Archivo del endpoint de este servicio (búscalo — es el que mapea
`work-position-org-chart/tree/{customerId}` y `work-position-org-chart/reassign`, confirmado en
D11-03 de la investigación previa vía `EndpointsReclutamiento.OrgChart`). Actualiza las firmas para
los DTOs nuevos. La ruta de reasignación debe tomar `customerId` de algún lado consistente con el
resto del servicio (revisa cómo otros endpoints de este mismo módulo resuelven el cliente en
contexto — cuerpo del request, o `ICurrentUserService`, sigue el patrón ya establecido, no
inventes uno).

## Tarea 3 — Arreglar `EmployeeFileAppService.cs` (quitar `ManagerName`)

**Decisión del producto (2026-08-21): el campo "Jefe Directo" se retira de la ficha del
empleado** — con rol→rol un rol puede tener varias personas, "quién es tu jefe" deja de resolverse
como un solo nombre sin ambigüedad, y no es el alcance de este ticket diseñar esa resolución.

- `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/EmployeeFile/DTOs/EmployeeFileWorkPositionDTO.cs:16`
  — quita la propiedad `ManagerName`.
- `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs:380`
  — quita la línea `ManagerName = x.ParentHierarchies.Select(...)` de la proyección (esto es lo
  que rompe el build, ya que `ParentHierarchies` ya no existe en `WorkPosition`).
- Misma clase, línea ~427 — quita `ManagerName = position?.ManagerName ?? string.Empty,` del
  mapeo al DTO final.

No toques el resto del método ni ningún otro campo de la ficha del empleado.

## Lo que NO debes hacer

- No toques nada de frontend (`org-chart.ts` y sus 4 helpers siguen sin compilar contra el nuevo
  contrato hasta D11-03 — es esperado, no lo arregles aquí).
- No le agregues `CustomerId` a `ApplicationRole` — sigue siendo global.
- No implementes ninguna forma de "elegir un jefe específico" para `ManagerName` — se retira, no
  se reemplaza (ver Tarea 3).
- No toques la migración ni la entidad `OrgHierarchy` — ya están aprobadas.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Esta vez debe pasar **sin errores** — cierra el estado roto que dejó D11-01b. Si algún error
persiste fuera de los dos archivos de este ticket, repórtalo, no lo arregles a ciegas sin
entenderlo primero.

Agrega o adapta tests del servicio (revisa si ya existen tests para
`WorkPositionOrgChartAppService`; si no, no es obligatorio crearlos desde cero en este ticket dado
el tamaño ya grande — pero si el proyecto tiene convención de probar servicios de este tipo,
al menos cubre: construcción del árbol con roles sin jerarquía asignada aparecen como raíz;
reasignar detecta ciclos; reasignar no mezcla clientes distintos con el mismo rol). Corre
`dotnet test` filtrando lo que agregues y pega la salida literal.

## Criterio de PASO

- `dotnet build api/LuxuryApp.sln` pasa sin errores.
- `GetTreeAsync` arma el árbol anclado en roles realmente usados por el cliente (no sólo los que
  ya tienen arista de jerarquía).
- `ReassignAsync` nunca consulta/modifica `OrgHierarchy` sin filtrar por `CustomerId`.
- `EmployeeFileAppService` compila sin `ManagerName`, y la ficha del empleado ya no expone ese
  campo en el DTO.

## Reporte de finalización

1. Archivos modificados, con una línea de qué cambió en cada uno
2. Salida literal de `dotnet build` (debe estar en 0 errores) y de los tests si agregaste
3. Decisiones que tomaste por tu cuenta y por qué (en particular: cómo resolviste el endpoint de
   `customerId` para `ReassignAsync`, y si encontraste el endpoint en una ubicación distinta a la
   esperada)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances a D11-03. Espera la auditoría.
