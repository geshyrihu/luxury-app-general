# TICKET D11-01b — Continuación: truncar `OrganizationHierarchy` y completar el esquema

Continuación directa de D11-01, que se detuvo correctamente porque `OrganizationHierarchy` tenía
46 filas (guardia de datos ya cumplida, reporte recibido y auditado). **El dueño del proyecto
autorizó explícitamente truncar esa tabla** — son datos de desarrollo, no hay riesgo de pérdida de
información real. Con esa autorización, completa las Tareas 1-3 de D11-01 tal como estaban
descritas, más el truncado como paso 0.

## Paso 0 — Truncar `OrganizationHierarchy`

Antes de generar la migración, en la base de datos de desarrollo:

```sql
TRUNCATE TABLE OrganizationHierarchy;
```

Confirma con `SELECT COUNT(*) FROM OrganizationHierarchy;` que queda en 0. Pega ambos resultados
literales en el reporte.

## Paso 1-3 — El resto de D11-01, sin cambios

Con la tabla vacía, ejecuta exactamente lo que ya decía el prompt original de D11-01
(`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-01-esquema-orghierarchy-roles.md`): reescribe la entidad `OrgHierarchy`
(puesto→rol, `CustomerId` obligatorio), quita `ParentHierarchies`/`ChildHierarchies` de
`WorkPosition.cs`, actualiza la configuración Fluent API de `ApplicationDbContext.cs`. No repito
aquí el contenido completo — está en ese archivo, síguelo al pie de la letra.

## Nota sobre `ApplicationRole` — verificado, no cambia nada del ticket

Se confirmó por consulta directa a la base que la tabla física real de `ApplicationRole` es
`AspNetRoles`, no `Roles` (el atributo `[Table("Roles")]` en `ApplicationRole.cs` no coincide con
la tabla física — mismo patrón que ya se vio con `Tasks`/`Task` en T-07 de la otra orquestación).
Esto no debería afectar la migración: EF Core resuelve el nombre real de la tabla desde su
snapshot del modelo, no desde la anotación de la clase. Si al generar la migración con
`dotnet ef migrations add` ves que hace referencia a `Roles` en lugar de `AspNetRoles` como
`principalTable` de la FK de `ParentRoleId`/`ChildRoleId`, **detente y repórtalo** — sería la
misma clase de discrepancia que la de T-07/T-07b, y no debe corregirse a mano sin auditoría.

## Verificación obligatoria (igual que D11-01 original)

```bash
dotnet build api/LuxuryApp.sln
```

Genera la migración `OrgHierarchyRoleBased` con `dotnet ef migrations add`. Pega la salida
literal. No ejecutes `dotnet ef database update`.

## Reporte de finalización

1. Resultado literal del truncado y del conteo posterior (paso 0)
2. Archivos modificados, con una línea de qué cambió en cada uno
3. Salida literal de `dotnet build` y de `dotnet ef migrations add`
4. Qué tabla aparece como `principalTable` para las FK de `ParentRoleId`/`ChildRoleId` en la
   migración generada (`Roles` o `AspNetRoles`) — repórtalo explícitamente
5. Decisiones que tomaste por tu cuenta y por qué
6. Riesgos detectados que no estaban en este prompt

No avances a D11-02. Espera la auditoría.
