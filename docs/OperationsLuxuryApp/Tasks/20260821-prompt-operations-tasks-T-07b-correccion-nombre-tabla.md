# TICKET T-07b — Corrección: la migración de T-07 apunta a una tabla que no existe

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-07. No es un
defecto que tú hayas introducido: es una inconsistencia que ya existía en el repositorio antes de
que empezara esta orquestación, y que T-07 fue el primer ticket en exponer porque fue el primero
en volver a generar una migración sobre la entidad `Tasks`.

## Qué está mal

La migración `20260821132331_TasksAlertFieldsAndIndices.cs` que generaste en T-07 apunta a una
tabla llamada `"Task"` (singular) en cada `AddColumn` y `CreateIndex`. La entidad real dice:

```csharp
[Table("Tasks")]
public class Tasks : GuidIdEntity
```

**`Tasks` (plural) es el nombre correcto.** Verificación, sin necesidad de acceso a base de
datos:

1. No existe en todo el repositorio ningún `[Table("Task")]` en singular — es la única entidad
   con ese nombre en el snapshot.
2. No existe ninguna migración `CreateTable` para esta entidad en todo el historial de
   `LuxuryApp.Infrastructure.Data/Data/Migrations/` — la tabla se creó fuera de EF Core, y el
   snapshot nunca capturó correctamente su origen.
3. Es la **única** entidad de todo `ApplicationDbContextModelSnapshot.cs` (~200 entidades) con la
   forma `b.ToTable("Task", (string)null);`. Sus entidades hermanas del mismo módulo
   (`TaskFiles`, `TaskComments`, `TaskInstances`, `TaskWorkGroups`, `TaskTemplates`, etc.) usan
   todas la forma simple `b.ToTable("NombrePlural");`, coincidiendo con su atributo `[Table]`.
4. No hay ninguna `Fluent API` en `ApplicationDbContext.OnModelCreating` que sobreescriba el
   nombre de tabla de `Tasks` — nada compite con el atributo `[Table("Tasks")]`.
5. Decenas de servicios activos (`TaskAppService` y otros) consultan `dbContext.Tasks` en
   producción sin que nadie haya reportado un error de "objeto no encontrado". Si la tabla real
   fuera `"Task"`, esas consultas fallarían siempre.

**Conclusión con alta confianza, no absoluta:** el nombre real de la tabla es `Tasks`. El
snapshot lleva ese error arrastrado desde antes de esta orquestación, dormido porque nadie había
vuelto a tocar el esquema de esta entidad hasta ahora.

> ⚠️ **Esto no reemplaza la verificación real.** Antes de que cualquiera ejecute
> `dotnet ef database update` con estas migraciones acumuladas contra una base de datos real, el
> equipo debe confirmar el nombre exacto de la tabla con una consulta directa (por ejemplo,
> `SELECT name FROM sys.tables WHERE name IN ('Task','Tasks')` en SQL Server). Este ticket corrige
> el código para que coincida con lo que el análisis indica que es correcto; no sustituye esa
> confirmación.

## Tarea

Corrige la cadena `"Task"` a `"Tasks"` en los tres archivos donde aparece como nombre de tabla de
esta entidad, sin tocar ninguna otra cosa:

### 1. `20260821132331_TasksAlertFieldsAndIndices.cs`

Los tres `AddColumn` y los tres `CreateIndex` en `Up()`, y sus contrapartes en `Down()` (tres
`DropIndex`, tres `DropColumn`) — cambia `table: "Task"` a `table: "Tasks"` en las 12 ocurrencias.

### 2. `20260821132331_TasksAlertFieldsAndIndices.Designer.cs`

La línea `b.ToTable("Task", (string)null);` en el bloque de la entidad
`LuxuryApp.Infrastructure.Data.Entities.Tasks` — cámbiala a `b.ToTable("Tasks");`, la forma simple
que usan las entidades hermanas (sin el segundo argumento `(string)null`, que no aparece en
ninguna otra entidad del mismo módulo).

### 3. `ApplicationDbContextModelSnapshot.cs`

La misma línea, mismo cambio: busca `b.ToTable("Task", (string)null);` (debe haber exactamente
una ocurrencia en todo el archivo — confírmalo) y cámbiala a `b.ToTable("Tasks");`.

## Verificación adicional obligatoria

Después del cambio, confirma con una búsqueda que no quedó ninguna referencia residual a la tabla
`"Task"` en singular relacionada con esta entidad:

```bash
grep -rn '"Task"' api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260821132331_TasksAlertFieldsAndIndices.cs api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260821132331_TasksAlertFieldsAndIndices.Designer.cs api/LuxuryApp.Infrastructure.Data/Data/Migrations/ApplicationDbContextModelSnapshot.cs
```

Debe devolver cero resultados (salvo, si acaso, coincidencias parciales dentro de otra palabra
como `"TaskAttachment"` — revisa manualmente cada línea que el grep devuelva, no asumas que todas
son el mismo bug).

## Lo que NO debes hacer

- No toques ninguna otra migración ni ningún otro `ToTable` del snapshot — sólo el de `Tasks`.
- No regeneres la migración desde cero con `dotnet ef migrations add`: edítala a mano. Regenerarla
  podría arrastrar de nuevo el mismo error si la causa raíz sigue latente en algún otro lugar que
  no hayamos identificado.
- No apliques la migración a ninguna base de datos en este ticket.
- No investigues ni corrijas el origen histórico de por qué el snapshot decía "Task" — ya está
  explicado arriba; sólo corrige el efecto en estos tres archivos.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
node scripts/scan-mojibake.mjs api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260821132331_TasksAlertFieldsAndIndices.cs api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260821132331_TasksAlertFieldsAndIndices.Designer.cs api/LuxuryApp.Infrastructure.Data/Data/Migrations/ApplicationDbContextModelSnapshot.cs
```

Pega la salida literal de ambos, más la búsqueda de verificación de la sección anterior.

## Criterio de PASO del ticket

Los tres archivos usan `"Tasks"` de forma consistente para esta entidad, la compilación no se
rompe (los archivos de migración no participan en la compilación de tipos, pero deben seguir
siendo C# válido), y la búsqueda de verificación no encuentra ninguna ocurrencia residual de
`"Task"` singular referida a esta entidad.

## Reporte de finalización

1. Las 3 líneas/bloques exactos cambiados por archivo
2. Salida literal de los comandos
3. Resultado de la búsqueda de verificación, completo
4. Cualquier otra ocurrencia de `"Task"` en singular que hayas encontrado en el repositorio al
   buscar, aunque no la hayas tocado por estar fuera del alcance de este ticket

No avances al siguiente ticket. Espera la auditoría.
