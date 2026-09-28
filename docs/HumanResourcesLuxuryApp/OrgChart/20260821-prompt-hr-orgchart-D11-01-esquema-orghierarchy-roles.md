# TICKET D11-01 — Esquema: `OrgHierarchy` de puesto a rol + `CustomerId`

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. **Este ticket es sólo esquema** (entidad + migración EF Core), sin
tocar `WorkPositionOrgChartAppService.cs` ni ningún endpoint — eso es D11-02, después de que este
esquema esté aprobado.

## Contexto

`OrgHierarchy` (`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs`,
tabla `OrganizationHierarchy`) hoy modela jerarquía entre **puestos de trabajo**
(`ParentWorkPositionId`/`ChildWorkPositionId`, ambos FK a `WorkPosition`), y explícitamente
**cross-customer** (el propio comentario del archivo lo dice: "de forma independiente a la
empresa"). Se reemplaza por jerarquía entre **roles** (`ApplicationRole`), con `CustomerId`
obligatorio en cada fila — cada cliente define su propio organigrama de roles, aislado de los
demás.

Esto es la decisión D-11 ya tomada y documentada:
`docs/modulos-existente/alertas-tareas-recurrentes/03-riesgos-dependencias.md:82`, con el esquema
destino especificado en
`docs/modulos-existente/alertas-tareas-recurrentes/04-implementation-plan.md:231-239`.

## Riesgo de datos — obligatorio verificar antes de generar la migración

`OrganizationHierarchy` alimenta hoy un feature de RH en uso (organigrama visual). **Antes de
correr `dotnet ef migrations add`**, conéctate a la base de datos de desarrollo y corre:

```sql
SELECT COUNT(*) FROM OrganizationHierarchy;
```

Reporta el resultado literal. Si el conteo es **cero**, procede con la migración normalmente. Si
es **distinto de cero**, **detente y repórtalo en el reporte de finalización sin generar la
migración** — no inventes una estrategia de conversión de datos (puesto→rol) por tu cuenta; eso
requeriría decidir qué rol le corresponde a cada puesto existente, una decisión de negocio que no
te toca tomar en este ticket.

## Tarea 1 — Reescribir la entidad `OrgHierarchy`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs`

Reemplaza por completo el contenido siguiendo este esquema (ajusta el estilo exacto de
comentarios/XML-doc al que ya usa el archivo, no lo omitas):

```csharp
namespace LuxuryApp.Infrastructure.Data.Entities;

/// <summary>
/// Representa la relación jerárquica entre roles dentro del organigrama de un cliente.
/// Aislada por CustomerId: cada cliente define su propia jerarquía de roles.
/// </summary>
[Index(nameof(CustomerId))]
[Table("OrganizationHierarchy")]
public class OrgHierarchy : GuidIdEntity
{
    /// <summary>Cliente al que pertenece esta relación jerárquica.</summary>
    [Required]
    [Column("CustomerId")]
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }

    /// <summary>
    /// Identificador del rol superior (jefe). Null si el rol es una raíz del organigrama.
    /// </summary>
    [Display(Name = "Rol Superior")]
    [Column("ParentRoleId")]
    public string ParentRoleId { get; set; }
    public ApplicationRole ParentRole { get; set; }

    /// <summary>
    /// Identificador del rol subordinado.
    /// </summary>
    [Display(Name = "Rol Subordinado")]
    [Column("ChildRoleId")]
    [Required]
    public string ChildRoleId { get; set; }
    public ApplicationRole ChildRole { get; set; }

    /// <summary>
    /// Nivel de profundidad en el árbol jerárquico (0 = raíz).
    /// </summary>
    [Display(Name = "Nivel Jerárquico")]
    [Column("HierarchyLevel")]
    public int HierarchyLevel { get; set; }

    /// <summary>
    /// Orden horizontal entre hermanos en el mismo nivel.
    /// </summary>
    [Display(Name = "Orden")]
    [Column("SortOrder")]
    public int SortOrder { get; set; }

    /// <summary>
    /// Indica si la relación jerárquica está activa.
    /// </summary>
    [Display(Name = "Activo")]
    [Column("IsActive")]
    public bool IsActive { get; set; } = true;
}
```

Nota: `ParentRoleId`/`ChildRoleId` son `string` (no `Guid`) porque `ApplicationRole` hereda de
`IdentityRole`, cuyo `Id` es `string` — sigue el mismo tipo que usa el resto del proyecto para
referenciar roles (ej. `RoleId` en `ICurrentUserService`).

## Tarea 2 — Quitar la navegación inversa en `WorkPosition`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/EstructuraOrganizacional/WorkPosition.cs`

Elimina las dos propiedades de navegación que ya no aplican (líneas ~216 y ~221):

```csharp
public virtual HashSet<OrgHierarchy> ParentHierarchies { get; set; } = [];
...
public virtual HashSet<OrgHierarchy> ChildHierarchies { get; set; } = [];
```

`WorkPosition` deja de tener ninguna relación con `OrgHierarchy`.

## Tarea 3 — Actualizar la configuración Fluent API

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs`, bloque
`// Configuración de OrgHierarchy` (línea ~1116-1128). Reemplázalo por:

```csharp
// Configuración de OrgHierarchy
modelBuilder.Entity<OrgHierarchy>(entity =>
{
    entity.HasOne(d => d.Customer)
        .WithMany()
        .HasForeignKey(d => d.CustomerId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(d => d.ParentRole)
        .WithMany()
        .HasForeignKey(d => d.ParentRoleId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(d => d.ChildRole)
        .WithMany()
        .HasForeignKey(d => d.ChildRoleId)
        .OnDelete(DeleteBehavior.Restrict);
});
```

No agregues navegación inversa nueva en `ApplicationRole` ni en `Customer` (`WithMany()` sin
propiedad de colección) — son entidades ya muy usadas en otros módulos, no las satures con
colecciones que sólo le sirven a este feature.

## Lo que NO debes hacer

- No toques `WorkPositionOrgChartAppService.cs`, ningún endpoint, ni el frontend — es D11-02/D11-03.
- No implementes conversión de datos puesto→rol si `OrganizationHierarchy` tiene filas — detente y
  repórtalo (ver sección de riesgo de datos arriba).
- No agregues `CustomerId` a `ApplicationRole` — el catálogo de roles sigue siendo global; sólo
  la arista de jerarquía (`OrgHierarchy`) se vuelve por-cliente.
- No toques `RS-01` en ningún otro lugar del código fuera de lo descrito aquí.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Genera la migración con el mismo mecanismo que las migraciones más recientes del proyecto (revisa
`api/LuxuryApp.Infrastructure.Data/Data/Migrations/` para el patrón exacto). Nómbrala
`OrgHierarchyRoleBased`. Pega la salida literal de `dotnet ef migrations add`. **No ejecutes
`dotnet ef database update`** — igual que en el resto de esta orquestación, la aplicación a una
BD concreta es una decisión separada.

## Criterio de PASO

- `OrgHierarchy` compila con `CustomerId`, `ParentRoleId`/`ParentRole`, `ChildRoleId`/`ChildRole`,
  sin rastro de `ParentWorkPositionId`/`ChildWorkPositionId`.
- `WorkPosition` ya no tiene `ParentHierarchies`/`ChildHierarchies`.
- La migración generada no inventa nombres de tabla/columna — coincide con las anotaciones.
- Si `OrganizationHierarchy` tenía filas, el ticket se detiene ahí y lo reporta, sin generar la
  migración a ciegas.
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Resultado literal de `SELECT COUNT(*) FROM OrganizationHierarchy` — primero que nada
2. Archivos modificados, con una línea de qué cambió en cada uno
3. Salida literal de `dotnet build` y de `dotnet ef migrations add` (si se generó)
4. Decisiones que tomaste por tu cuenta y por qué
5. Lo que NO hiciste del ticket y el motivo
6. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
