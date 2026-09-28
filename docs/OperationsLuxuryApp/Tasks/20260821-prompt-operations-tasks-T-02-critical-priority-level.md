# TICKET T-02 — Agregar `Critical` a `PriorityLevel` y corregir sus 3 consumidores

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

## Contexto

El módulo de tareas recurrentes necesita marcar una obligación como "crítica": si no se cumple,
hay una consecuencia real (multa, sanción). Existe un enum compartido `PriorityLevel` con dos
valores (`High`, `Low`) que hoy sirve para ordenar el día a día, no para esto.

**Decisión ya tomada por el dueño del módulo:** no se crea un enum paralelo. Se agrega `Critical`
al final de `PriorityLevel` existente. Es una **adición**, no una modificación: los valores `High`
y `Low` no cambian su nombre ni su posición numérica. Hay precedente de esta práctica en el mismo
repositorio: `NotificationChannel` (`api/LuxuryApp.Shared/Enums/NotificationChannel.cs`) documenta
explícitamente "sólo se agregan miembros al final".

**Por qué este ticket es obligatorio antes de tocar cualquier otra cosa del módulo:** agregar el
valor sin corregir sus consumidores actuales es peligroso. Verificado en código: existe un botón
que **alterna** la prioridad entre alta y baja
(`TaskAppService.cs:962` — `OnUpdatePriority`). Sin la corrección de este ticket, cualquier
usuario que lo presione sobre una tarea crítica la degradaría en silencio a `Low`, sin registro
de que ocurrió.

## Tareas de Backend

### 1. Agregar el valor al enum

Archivo: `api/LuxuryApp.Shared/Enums/PriorityLevel.cs`

```csharp
public enum PriorityLevel
{
    [Display(Name = "Alta")]
    High,

    [Display(Name = "Baja")]
    Low,

    [Display(Name = "Crítica")]
    Critical
}
```

No cambies `High` ni `Low`. `Critical` va al final, sin asignarle un valor numérico explícito
(hereda el siguiente entero disponible). No toques `SelectItemEnumEndPoints.cs`: el registro es
por reflexión genérica (`Map<PriorityLevel>`, línea 66) y recoge el valor nuevo solo.

### 2. Bloquear el toggle sobre tareas críticas

Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/Tasks/Services/TaskAppService.cs`,
método `OnUpdatePriority` (línea 956).

Hoy el método alterna sin condición entre `High` y `Low`. Corrígelo así:

- Si `TaskMessage.Priority == PriorityLevel.Critical`, el método debe **rechazar el cambio** y
  devolver `ApiResponseDTO<bool>.ErrorResult(...)` con un mensaje claro (algo como "No se puede
  cambiar la prioridad de una tarea crítica desde este control"). No debe llegar a
  `SaveChangesAsync`.
- Si la prioridad no es `Critical`, el toggle sigue funcionando exactamente igual que hoy entre
  `High` y `Low`. No lo alteres.

No implementes en este ticket quién puede marcar `Critical` por primera vez ni la inmutabilidad
en tareas generadas por plantilla — eso es de un ticket posterior del catálogo (F1). Aquí sólo se
protege el toggle existente para que agregar el valor no sea peligroso hoy mismo.

### 3. Corregir el ordenamiento del tablero de Dirección

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/DireccionDashboard/TareasLegal/Services/TareasLegalAppService.cs`,
línea 48.

Hoy: `.OrderBy(r => r.Priority == PriorityLevel.High ? 0 : 1)` — pone `High` primero y todo lo
demás después. Con el valor nuevo, una tarea `Critical` quedaría mezclada con las `Low`, al final.

Corrige el criterio de orden para que sea: `Critical` primero, luego `High`, luego `Low`. Usa un
`switch` expression o un diccionario de peso, no una cadena de ternarios — debe quedar legible y
fácil de extender si en el futuro hay más niveles.

También ajusta `EsAltaPrioridad = r.Priority == PriorityLevel.High` (unas líneas abajo, mismo
archivo) para que sea `true` también cuando `Priority == PriorityLevel.Critical`. Revisa el DTO
`TareaLegalItemDTO` por si el nombre de esa propiedad debería reflejar mejor "es prioritaria",
pero **no renombres la propiedad en este ticket** si eso rompe algo que la consuma en el frontend;
si detectas ese riesgo, repórtalo en tu entrega en vez de renombrar.

### 4. Corregir el filtro del reporte de supervisión

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Supervision/SupervisionReport/Services/SupervisionReportsAppService.cs`,
línea 119.

Hoy: `tm.Priority == PriorityLevel.High`. Este es el más grave de los tres: con un filtro de
igualdad exacta, una tarea `Critical` **no aparece en el reporte de supervisión**. Es
precisamente la tarea que más importa vigilar, y quedaría invisible.

Corrige a `(tm.Priority == PriorityLevel.High || tm.Priority == PriorityLevel.Critical)`. Verifica
si esta expresión se traduce correctamente a SQL por Entity Framework (debería, es una consulta
LINQ estándar), y confírmalo en tu reporte.

### 5. Búsqueda de otros consumidores

Antes de dar por cerrado el ticket, corre una búsqueda de todos los usos de `PriorityLevel` en el
repositorio (excluyendo `bin/` y `obj/`) y confirma que no quedó ningún otro punto que compare
por igualdad exacta contra `High` o que asuma que sólo existen dos valores. Si encuentras alguno
que este prompt no mencionó, corrígelo con el mismo criterio (`Critical` se trata como al menos
tan importante como `High`) y decláralo explícitamente en tu reporte.

## Tareas de Frontend

Ninguna en este ticket. La captura de criticidad en el catálogo es de un ticket posterior (F1).
Si algún componente de Angular ya consume `priority-level` como select y renderiza los valores
por iteración (no por nombre hardcodeado), no necesita cambios: el valor nuevo aparece solo. Si
encuentras un componente que hardcodea "Alta"/"Baja" como las dos únicas opciones visibles,
repórtalo — no lo corrijas en este ticket, es UI y no está en el alcance de T-02.

## Lo que NO debes hacer

- No renombres ni reordenes `High` o `Low`.
- No crees un enum `TaskCriticality` ni ningún enum paralelo.
- No implementes la inmutabilidad de criticidad en tareas generadas por plantilla.
- No implementes la restricción de quién puede marcar `Critical` por primera vez.
- No toques `Status` ni `GanttStatus`.
- No toques el módulo de tareas recurrentes (`ReclutamientoLuxuryApp/.../RecurringTasks/`).

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET
- Enums compartidos: sólo se agrega al final, nunca se renumera ni se renombra
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos `.cs` que tocaste (nota: este scanner no cubre
  `.md`; si tocas algún markdown, no cuentes con él para verificarlo)

## Criterio de PASO del ticket

Debe quedar demostrado en tu reporte, con razonamiento sobre el código (no hace falta ejecutar
la aplicación):

1. Una tarea con `Priority = Critical` sujeta al toggle de `OnUpdatePriority` **no cambia** y el
   endpoint devuelve error.
2. En el tablero de Dirección, una tarea `Critical` ordena **antes** que una `High`.
3. En el reporte de supervisión, una tarea `Critical` **aparece** en el resultado.

## Reporte de finalización

Al terminar entrega:
1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt (incluye aquí cualquier otro consumidor de
   `PriorityLevel` que hayas encontrado en el paso 5)

No avances al siguiente ticket. Espera la auditoría.
