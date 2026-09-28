# TICKET T-07 — Campos e índices nuevos en `Tasks`

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

## Contexto

`Tasks` (tabla `Tasks`, `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/Tasks.cs`)
es la entidad de tickets que el motor de alertas va a usar como destino único (T-08 la reescribe
para que genere ahí en vez de en `TaskInstance`). Hoy le faltan tres campos que el motor de
alertas necesita, y **no tiene ningún índice** sobre las columnas por las que se va a filtrar
varias veces al día una vez que el motor de alertas esté corriendo.

Este ticket, igual que T-03, **es sólo esquema**: la entidad, su migración, y nada más. No toca
ningún servicio, no implementa el barrido de vencidas ni la escalera de incumplimiento — eso es
T-09 y T-11.

## Tareas de Backend

### 1. Campos nuevos en `Tasks`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/Tasks.cs`

Agrega, cerca de los campos de fecha existentes (`CreateDate`, `ClosedDate`, `ScheduledDate`,
`PlannedEndDate` — todos `DateTime?` o `DateTime`, sigue ese mismo tipo):

```csharp
[Column("BreachedAt")]
public DateTime? BreachedAt { get; set; }

[Column("LastAlertAt")]
public DateTime? LastAlertAt { get; set; }

[Column("RecurrenceSourceDate")]
public DateTime? RecurrenceSourceDate { get; set; }
```

Con comentarios XML de una línea cada uno:
- `BreachedAt`: fecha en que la tarea cruzó la tolerancia de 5 días vencida y se marcó como
  incumplimiento formal (`RN-ALT-014`, ver `docs/modulos-existente/alertas-tareas-recurrentes/02-business-rules-analysis.md`).
- `LastAlertAt`: última vez que se envió una alerta sobre esta tarea. Existe para no re-alertar
  de más y permitir cadencia decreciente.
- `RecurrenceSourceDate`: cuando la fecha de recurrencia se recorrió por caer en festivo, aquí
  queda la fecha original, para trazabilidad.

**No agregues ningún campo relacionado con "arrastre" o "periodo anterior".** Esa pieza
(`CarriedOverFrom` o su forma final) se decide en T-11, cuando se diseñe el mecanismo real de
arrastre — agregarla ahora con un tipo adivinado arriesga una migración que haya que corregir
después, el mismo error que ya se dio con el nombre `AbandonedAt` en una versión anterior del
plan (se corrigió a `BreachedAt`).

### 2. `CustomerId` se queda como está

`Tasks.CustomerId` es `Guid?` y `Tasks` **no** implementa `ITenantEntity`. Es una decisión ya
tomada en el plan (`RN-ALT-047`, GAP G-18): se compensa con filtro explícito en cada consulta del
módulo, no se corrige la entidad en este ticket. **No cambies su nulabilidad ni agregues
`ITenantEntity` a `Tasks`** — sería un cambio de mayor alcance que afecta a todo el sistema de
tickets, no sólo a este módulo, y no está decidido así.

### 3. Índices

Sin atributos `[Index]` hoy en `Tasks` (verifícalo tú mismo antes de tocar nada). Agrega, con el
mismo patrón `[Index(nameof(...), ...)]` que ya se usó en `RecurringTaskTemplate` (T-03) y que es
convención establecida en el repo (ve ejemplos en
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Accounting/AR/`):

- `(CustomerId, Status, PlannedEndDate)` — es el filtro principal del barrido de vencidas que
  vendrá en T-09.
- `(RecurringTemplateId, PlannedEndDate)` — para la verificación de idempotencia del generador
  (T-08): no duplicar una tarea ya generada para la misma plantilla y fecha.
- `(WorkGroupId, Status)` — para el tablero de cumplimiento por grupo (T-14).

`RecurringTemplateId` y `WorkGroupId` ya existen en la entidad; no los toques, sólo agrégales
índice si no lo tienen.

### 4. Migración

Genera la migración de EF Core. Mismo proyecto (`LuxuryApp.Infrastructure.Data`), mismo startup
project (`LuxuryApp.Api`) que en T-03. Nombra la migración de forma descriptiva, por ejemplo
`TasksAlertFieldsAndIndices`.

**Reglas, igual que en T-03:**

- 100% aditiva. Los tres campos nuevos son `DateTime?` (nullable): no necesitan backfill.
- Los tres índices son aditivos, sin impacto en datos existentes.
- Revisa la migración generada a mano antes de darla por buena: no debe haber ningún cambio sobre
  `CustomerId`, `Status`, `PlannedEndDate` ni ninguna otra columna existente — sólo `AddColumn` y
  `CreateIndex`.

### 5. `ApplicationDbContext`

Igual que en T-03: si las anotaciones de la entidad ya cubren los índices, no agregues Fluent API
adicional en `OnModelCreating`.

## Tareas de Frontend

Ninguna en este ticket.

## Lo que NO debes hacer

- No toques ningún servicio: ni `TaskAppService.cs`, ni `RecurringTaskCatalogAppService.cs`, ni
  `RecurringTaskGeneratorService.cs`, ni `RecurringTaskSchedulerJob.cs`.
- No implementes el barrido de vencidas, la escalera de incumplimiento ni el arrastre.
- No agregues el campo de arrastre (ver punto 1).
- No cambies `CustomerId` ni agregues `ITenantEntity` a `Tasks` (ver punto 2).
- No toques `RecurringTaskTemplate` ni su migración de T-03.
- Si al implementar esto descubres que algo fuera de esta lista deja de compilar por una
  dependencia real, corrígelo de forma mínima y decláralo explícitamente en tu reporte — no lo
  dejes roto por seguir la letra de esta lista (mismo criterio aplicado desde T-03).

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET, entidades y migraciones
- `conventions/operations/data-migration-protocol.md`
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Si tienes base de datos de desarrollo accesible, intenta `dotnet ef database update` y pega el
resultado. Si no, dilo explícitamente en tu reporte, como en T-03.

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste
- La migración generada, revisada a mano, sólo contiene `AddColumn` y `CreateIndex`

## Criterio de PASO del ticket

Debe quedar demostrado en tu reporte:

1. `Tasks` compila con los 3 campos nuevos y ningún otro cambio de propiedad
2. Los 3 índices existen con las columnas exactas especificadas
3. La migración es 100% aditiva: pega el contenido de `Up()`

## Reporte de finalización

1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los comandos de verificación
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
