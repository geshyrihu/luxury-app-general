# 02b — Enmienda a la FASE 0: anclaje a Grupos de Trabajo

**Fecha:** 2026-08-20 · **Origen:** aclaración del dueño del módulo sobre cómo opera hoy el sistema de tareas
**Estado:** aprobada · **Reemplaza:** decisión #9 (anclaje a `ApplicationRole`)
**Alcance:** modifica reglas de `02-business-rules-analysis.md`. Ese documento sigue vigente en todo lo que esta enmienda no toca.

---

## 1. Qué cambia

La FASE 0 ancló la asignación de tareas al **rol** (`ApplicationRole` + `CustomerId`). El código
del sistema de tareas en producción trabaja de otra forma, y esa forma es la correcta para el
negocio: **la tarea pertenece a un grupo de trabajo, y los responsables son los administradores
de ese grupo**.

### Evidencia

| Hecho | Ubicación |
| --- | --- |
| `WorkGroup` es multi-cliente (`ITenantEntity`), tiene `Active` y `Visibility` | `Entities/.../TaskEngine/WorkGroup.cs` |
| Los responsables del grupo se marcan con `IsAdmin` (la UI los muestra como "Administrador") | `WorkGroupMembers.cs`; `WorkGroupMemberAppService.cs:56` |
| Una tarea se asigna a **un solo** responsable | `Tasks.cs:137-138` — `AssigneeId`, **sin `[Required]`** |
| **Ya existe la convención**: si no se indica responsable, se asigna al primer administrador del grupo | `TaskAppService.cs:616-624` (`GetAdministratorGroupAsync`), `:663-665`, `:685` |
| Los administradores ya ven y controlan todas las tareas de su grupo | `TaskAppService.cs:483-499`, `:1308-1309` |
| `Tasks` ya trae andamiaje de recurrencia | `Tasks.cs:214-248` — `RecurringTemplateId`, `IsRecurring`, `ParentRecurringTaskId` |

### Consecuencia sobre los dos motores

El motor etiquetado `-legado` en el catálogo de Hangfire (`RecurringTaskTemplate` → `Tasks`, con
`WorkGroupId` obligatorio) es **el que coincide con el modelo de negocio**. El motor tratado como
vigente (`TaskTemplate` → `TaskInstance`, anclado a `RoleId`) es el que no coincide. La etiqueta
apunta al revés.

---

## 2. Decisión

**Un solo motor de tareas recurrentes, anclado al grupo de trabajo, que genera `Tasks`.**

Se le portan las virtudes del motor que se retira: RRULE de iCalendar, días festivos,
`CustomerId` y notificaciones por `INotificationDispatcher`.

```text
CATÁLOGO DE TAREAS RECURRENTES
  cliente (del contexto, customer-id.service.ts)
  + grupo(s) de trabajo activo(s)
  + título, descripción, recurrencia (RRULE), criticidad, aviso previo
        │
        ▼  job diario
  Tasks dentro del grupo
    ├── responsable: administrador del grupo (RN-ALT-041)
    ├── folio generado por el generador oficial (RN-ALT-045)
    ├── CustomerId heredado del grupo (RN-ALT-046)
    └── notificación por el dispatcher unificado
        │
        ▼  motor de alertas
  aviso previo → recordatorio → vencida → escalación → incumplimiento (día 5) → arrastre
```

**Se retira** `TaskTemplate` / `TaskTemplateItem` / `TaskInstance` y su job. La forma y el
momento del retiro los define el PASO 4, previa medición de cuántos datos vivos tienen.

---

## 3. Mapeo de campos: lo que NO existe en el destino

El motor que se retira tenía campos que el destino no tiene. Cada renglón sin equivalente es
trabajo real, no un cambio de nombre.

| Concepto | `TaskInstance` (se retira) | `Tasks` (destino) | Situación |
| --- | --- | --- | --- |
| Responsable | `AssigneeId` `[Required]` | `AssigneeId` **sin `[Required]`** | ⚠️ Validar en el módulo: una tarea sin responsable es el fallo que combatimos |
| Fecha límite | `DueDate` | `PlannedEndDate` / `ScheduledDate` | ⚠️ **No hay `DueDate`**. Definir cuál manda para "vencida" |
| Cierre | `CompletedAt` | `ClosedDate` + `ClosedById` + `Status` | ✅ Más completo |
| Estado | `Status` (global) | `GanttStatus` (global) | ⚠️ Tampoco tiene `Vencida` ni `Abandonada`, y **tampoco se puede modificar** |
| Cliente | `CustomerId`, `ITenantEntity` | `CustomerId` **`Guid?`**, `Tasks` **no** es `ITenantEntity` | 🔴 Retroceso de aislamiento. Ver RN-ALT-047 |
| Comentarios | `TaskComment` | `TaskFollowUp` | ✅ Equivalente |
| **Adjuntos** | `TaskAttachment` | `TaskAttachment` **reapuntada** a `Tasks` | ✅ La entidad se conserva; lo que muere es su padre. Sólo cambia la FK. (`Tasks` trae además `BeforeWork`/`AfterWork`, dos rutas de imagen que no admiten PDF: no se usan para el comprobante) |
| Prioridad | `PriorityLevel` | `PriorityLevel` | Mismo enum global; sigue sin servir para criticidad |
| Recurrencia | `TaskTemplateItem.RecurrenceRule` (RRULE) | `RecurringTemplateId`, `IsRecurring`, `ParentRecurringTaskId` | ✅ Andamiaje ya existe, pero la plantilla actual no usa RRULE |
| Folio | — | `Folio` `[StringLength(20)]` con generador | ✅ Reutilizar el generador oficial |
| Bitácora | — | `TaskChangeLog` | ✅ Gana trazabilidad |
| Lecturas | — | `TaskMessageReads` | ✅ Permite saber si lo vieron |

---

## 4. Reglas que se retiran

| Regla | Por qué muere |
| --- | --- |
| `RN-ALT-020` | Definía qué `RoleType` recibe tareas. El destinatario ya no depende del rol sino de la pertenencia al grupo |
| `RN-ALT-016` | Hablaba del cambio de ocupante del rol. Ahora aplica el cambio de administradores del grupo (`RN-ALT-042`) |

## 5. Reglas que se reescriben

| Regla | Antes | Ahora |
| --- | --- | --- |
| `RN-ALT-001` | La obligación existe como `TaskTemplateItem` con RRULE | Existe como **plantilla recurrente anclada a un `WorkGroup`**, con RRULE válida |
| `RN-ALT-003` | Toda tarea crítica necesita destinatario de escalación resoluble | El **grupo** debe tener al menos un administrador activo al guardar la plantilla (`RN-ALT-042`) |
| `RN-ALT-005` | Toda tarea tiene siempre responsable | Se mantiene, pero el destino **no** obliga por esquema: lo valida el módulo (`RN-ALT-041`) |
| `RN-ALT-007` | Reasignar no modifica `DueDate` | Reasignar no modifica la fecha límite, que ahora vive en `PlannedEndDate` |
| `RN-ALT-010` / `RN-ALT-011` | Estados sobre `Status`; `Vencida` derivada de `DueDate`/`CompletedAt` | Estados sobre `GanttStatus`; `Vencida` derivada de la fecha límite y `ClosedDate` |
| `RN-ALT-018` / `RN-ALT-019` | Cadena rol → jefe → respaldo | Cadena **administrador del grupo → otro administrador del grupo → usuarios del rol jefe (`OrgHierarchy` por rol, filtrado por `CustomerId`) → respaldo** |
| `RN-ALT-021` | Crear plantillas por cliente | Crear plantillas por cliente **y grupo**; sólo grupos activos del cliente en contexto |
| `RN-ALT-025` / `026` / `027` | Tableros por organigrama y responsable | Tableros por **grupo**; el administrador ve su grupo, el responsable ve lo suyo |
| `RN-ALT-030` | RRULE en `TaskTemplateItem` | RRULE en la plantilla recurrente nueva |
| `RN-ALT-034` | Comprobante como `TaskAttachment` | **Sin destino hoy.** Ver GAP G-15 |
| `RN-ALT-038` | No duplicar por (fecha, ítem, responsable) | No duplicar por **(fecha de recurrencia, plantilla, grupo)** |
| `RN-ALT-039` | No alertar en festivos | Se corrige además la generación: la tarea **se recorre** al siguiente día hábil, no se omite (RT-02) |

## 6. Reglas nuevas

| Regla | Enunciado | Por qué |
| --- | --- | --- |
| `RN-ALT-040` | Una obligación recurrente es **una sola tarea** con responsable principal y corresponsables; no una copia por persona | Evita multiplicar alertas y distorsionar los KPIs (RT-04) |
| `RN-ALT-041` | El responsable de una tarea generada es un **administrador del grupo**. Si el grupo tiene varios, se elige de forma **determinista** y los demás quedan como corresponsables | Hoy `TaskAppService.cs:665` toma `.First()` sin ordenar: la asignación es arbitraria |
| `RN-ALT-042` | Una plantilla recurrente **no puede guardarse contra un grupo sin administradores**, y si el grupo se queda sin ellos se avisa explícitamente | Equivalente al rol vacante (RT-03). El silencio es el modo de falla del módulo |
| `RN-ALT-043` | Si el grupo se **desactiva** (`Active = false`), la generación se detiene y se avisa; las tareas vivas no se borran | Hoy nada valida el estado del grupo al generar |
| `RN-ALT-044` | Una obligación recurrente **no puede anclarse a un grupo con `Visibility = Public`** | Los grupos públicos se listan a través de clientes distintos (`TaskGroupAppService.cs:65`): la obligación no tendría dueño claro |
| `RN-ALT-045` | El folio de una tarea generada se produce con el **generador oficial**, nunca concatenando identificadores | El job actual arma `REC-{Guid}-{fecha}` = 49 caracteres contra `[StringLength(20)]`: **el guardado falla** |
| `RN-ALT-046` | Toda tarea generada hereda el `CustomerId` **del grupo** | El job actual no lo asigna y `Tasks.CustomerId` es `Guid?`: quedarían tareas sin cliente |
| `RN-ALT-047` | Ninguna consulta del módulo puede devolver tareas de otro cliente, aunque `Tasks` no implemente `ITenantEntity` | El destino tiene menos aislamiento que el origen. Se compensa en el módulo o se corrige la entidad |

---

## 7. GAPs nuevos

| # | Necesidad | Situación en el destino |
| --- | --- | --- |
| **G-15** | Comprobante documental al cerrar una tarea crítica | ✅ **Resuelto sin entidad nueva:** se reapunta `TaskAttachment` (tabla `TaskFiles`) a `Tasks`. Conserva el patrón documental del proyecto |
| **G-16** | Checklist de pasos dentro de una tarea | 🔴 Sigue sin existir. `TaskWorkPlan` es plan semanal por persona, no checklist. `TaskFollowUp` es seguimiento libre |
| **G-17** | Estados `Vencida` y `Abandonada` | ⚠️ `GanttStatus` no los tiene y es global: no se modifica. `Vencida` se deriva; `Abandonada` necesita campo propio del módulo |
| **G-18** | Aislamiento por cliente en `Tasks` | 🔴 `CustomerId` nullable y sin `ITenantEntity`. Decidir en el PASO 4 si se corrige la entidad o se compensa en cada consulta |

---

## 8. Qué se reutiliza (actualiza la tabla del `01b`)

| Necesidad | Se reutiliza | Veredicto |
| --- | --- | --- |
| Grupos y sus responsables | `WorkGroup` + `WorkGroupMembers.IsAdmin` | ✅ Tal cual |
| Asignar al administrador del grupo | `GetAdministratorGroupAsync` (`TaskAppService.cs:616`) | ✅ Reutilizar, agregando orden determinista |
| Permisos sobre la tarea | Verificación de administrador (`TaskAppService.cs:1308`) | ✅ Tal cual |
| Folio | Generador oficial de folios por grupo | ✅ Obligatorio (`RN-ALT-045`) |
| Seguimiento y bitácora | `TaskFollowUp`, `TaskChangeLog`, `TaskMessageReads` | ✅ Tal cual |
| Recurrencia | RRULE con `Ical.Net` del motor que se retira | ✅ Portar |
| Festivos | `IHolidayService` | ✅ Portar, con la corrección de RT-02 |
| Notificaciones | `INotificationDispatcher` | ✅ Portar |
| Andamiaje de recurrencia en el ticket | `RecurringTemplateId`, `IsRecurring`, `ParentRecurringTaskId` | ✅ Ya existe |
| Criticidad | `PriorityLevel` | ❌ Sigue sin servir. Catálogo propio (`RN-ALT-031`) |
| Comprobante | `TaskAttachment` | ✅ Reutilizar reapuntando la FK a `Tasks` |

---

## 9. Impacto en los riesgos del PASO 3

| Riesgo | Efecto de la enmienda |
| --- | --- |
| **RT-04** (fan-out) | ✅ **Resuelto.** La obligación pertenece al grupo; los administradores son responsables |
| **RT-11** (dos motores) | 🔄 **Se invierte.** El "legado" era el modelo correcto. Se resuelve con motor único |
| **RT-03** (rol vacante) | 🔄 Se convierte en grupo sin administradores o desactivado (`RN-ALT-042`, `RN-ALT-043`) |
| **RS-01** (`OrgHierarchy` sin cliente) | ✅ **Cerrado el 2026-08-20:** el organigrama pasa a definirse por `ApplicationRole` con `CustomerId` obligatorio. Ya no puede cruzar clientes |
| **D-05** (calidad del organigrama) | ⬇️ **Baja de gravedad** por lo mismo. La dependencia se traslada a que los grupos tengan administradores, dato que operación ya mantiene |
| **RT-05** (índices) | 🔄 Cambia de tabla: los índices van sobre `Tasks`, no sobre `TaskInstances` |
| **RS-07** (motor legado sin tenencia) | ⬆️ **Sube.** Ya no es un motor ajeno: es el destino. Se atiende con `RN-ALT-046` y `RN-ALT-047` |
| **RT-17** (nuevo) | Folio de 49 caracteres contra un límite de 20: el guardado falla (`RN-ALT-045`) |
| **RT-18** (nuevo) | Tareas generadas sin `CustomerId` (`RN-ALT-046`) |
| **RT-19** (nuevo) | Grupo desactivado o sin administradores después de crear la plantilla |
| **RS-09** (nuevo) | Grupos `Public` visibles entre clientes (`RN-ALT-044`) |

---

## 10. Pendientes que abre esta enmienda

1. **¿Cuántos datos vivos tiene el motor que se retira?** Define si el retiro es apagado simple o migración con datos.
   ```sql
   SELECT COUNT(*) FROM TaskInstances;
   SELECT COUNT(*) FROM TaskTemplates WHERE IsActive = 1;
   SELECT COUNT(*) FROM TaskRecurringTemplates;
   ```
2. **¿`PlannedEndDate` o `ScheduledDate` manda para "vencida"?** Decisión del PASO 4.
3. **G-15 y G-16** (comprobante y checklist) necesitan diseño: son requisitos originales del módulo y hoy no tienen destino.
4. **G-18:** corregir la tenencia de `Tasks` o compensarla en cada consulta.
