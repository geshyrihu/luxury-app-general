# RECONOCIMIENTO DE ESTRUCTURA DE ENTIDADES

**Módulo:** Alertas de Tareas Recurrentes (ampliación del motor `TaskEngine`)
**Tipo de trabajo:** B — Ampliar módulo existente
**Fecha:** 2026-08-17
**Paso:** 0.5 según `skills/planeacion-modulos/SKILL.md`
**Estado:** EN REVISIÓN — requiere aprobación antes de continuar

> Este documento **sólo describe lo que ya existe**. No propone cambios, no inventa
> propiedades. Traduce el código (inglés) al lenguaje del negocio (español).

---

## 📍 UBICACIÓN REAL DEL MOTOR

Corrección importante respecto al levantamiento inicial: el motor **no está todo mal ubicado**.
Está partido en dos capas que viven en lugares distintos.

| Capa | Ubicación real | ¿Coherente? |
| --- | --- | --- |
| **Entidades (datos)** | `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/` | ✅ Sí — bajo `Operations` |
| **Servicios / DTOs / Endpoints** | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/` | ❌ No — bajo `Reclutamiento` |
| **Frontend** | `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/` | ✅ Sí — bajo `operations` |
| **Job de generación** | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskGenerationJob.cs` | ⚠️ Aceptable — todos los jobs viven ahí |

**Conclusión:** las entidades y el frontend ya están donde deben. **Sólo la capa de aplicación
está fuera de lugar**, bajo un módulo (Reclutamiento) con el que no tiene relación funcional.

> ⚠️ Existe además un **segundo motor de recurrencia legado** en la misma carpeta de entidades.
> Ver la sección "Segundo motor de recurrencia".

---

## 🗂️ ENTIDADES DEL MOTOR ACTUAL (TaskEngine)

### 1. `TaskTemplate` — Plantilla de tareas

**Tabla:** `TaskTemplates`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskTemplate.cs`
**Qué representa:** el "checklist maestro". Agrupa un conjunto de tareas recurrentes y las
amarra a un rol de la aplicación. Es el molde, no la tarea real.

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `Id` | Guid | Identificador único de la plantilla |
| `Name` | string(100), obligatorio | Nombre visible, ej. "Obligaciones fiscales mensuales" |
| `Description` | string(500) | Explicación de para qué sirve la plantilla |
| `RoleId` | string, obligatorio | **Rol al que aplica.** Define quién es candidato a ejecutar estas tareas |
| `Role` | `ApplicationRole` | Navegación al rol |
| `IsActive` | bool (default `true`) | Si está apagada, ninguna de sus tareas se genera |
| `CreatedAt` | DateTime (UTC) | Cuándo se creó. **Ojo:** el motor la usa como fecha de arranque del calendario de recurrencia |
| `CreatedBy` | string | Quién la creó |
| `Items` | colección | Las tareas que contiene |
| `TemplateCustomers` | colección | Los clientes a los que se asignó |

---

### 2. `TaskTemplateItem` — Tarea individual de la plantilla

**Tabla:** `TaskTemplateItems`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskTemplateItem.cs`
**Qué representa:** cada tarea concreta dentro del checklist maestro. **Aquí vive la regla de
repetición.** Es el corazón del motor.

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `Id` | Guid | Identificador de la tarea-molde |
| `TaskTemplateId` | Guid, obligatorio | A qué plantilla pertenece |
| `Title` | string(150), obligatorio | Nombre de la tarea, ej. "Pagar ISR" |
| `Description` | string(1000) | Instrucciones de qué hay que hacer |
| `Priority` | `PriorityLevel` (default `Low`) | Prioridad. **Sólo admite Alta o Baja** |
| `SortOrder` | int | Orden en que se muestra dentro de la plantilla |
| `RecurrenceRule` | string, obligatorio | **Cada cuándo se repite**, en formato RRULE del estándar iCalendar (ej. mensual el día 17) |
| `TimeWindowStart` | TimeSpan? | Hora a partir de la cual se puede hacer |
| `TimeWindowEnd` | TimeSpan? | Hora límite del día. Si va vacía, el motor asume 23:59 |
| `IsActive` | bool (default `true`) | Apagar esta tarea sin borrar la plantilla |
| `CustomerConfigs` | colección | En qué clientes está encendida |
| `Instances` | colección | Todas las tareas reales que ha generado |

---

### 3. `TaskTemplateCustomer` — Plantilla asignada a cliente

**Tabla:** `TaskCustomerTemplates`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskTemplateCustomer.cs`
**Qué representa:** tabla puente. Permite que una plantilla global se use en varios condominios.

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `TaskTemplateId` | Guid | Qué plantilla |
| `CustomerId` | Guid | A qué cliente se le asignó |

Implementa `ITenantEntity` — participa del filtro multi-cliente.

---

### 4. `CustomerTaskItemConfig` — Tarea encendida por cliente

**Tabla:** `TaskCustomerItemConfigs`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/CustomerTaskItemConfig.cs`
**Qué representa:** el interruptor fino. Dice qué tarea específica está activa en qué cliente.
**Es la tabla que el job lee primero** para decidir qué generar.

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `CustomerId` | Guid | Cliente |
| `TaskTemplateItemId` | Guid | Tarea-molde encendida para ese cliente |

Clave compuesta (`CustomerId` + `TaskTemplateItemId`). No tiene `Id` propio.

---

### 5. `TaskInstance` — La tarea real, la que alguien tiene que hacer

**Tabla:** `TaskInstances`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskInstance.cs`
**Qué representa:** la tarea ya generada, con fecha y con dueño. **Es sobre esta entidad que
va a operar todo el módulo de alertas.**

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `Id` | Guid | Identificador de la tarea real |
| `TaskTemplateItemId` | Guid, obligatorio | De qué molde salió |
| `CustomerId` | Guid, obligatorio | De qué condominio es |
| `Title` | string | Nombre, **copiado del molde al momento de crearse** (si luego cambia el molde, esta no cambia) |
| `Description` | string | Instrucciones, también copiadas |
| `Priority` | `PriorityLevel` | Prioridad heredada del molde |
| `AssigneeId` | string, obligatorio | **Quién tiene que hacerla.** Apunta a un usuario, no a un puesto |
| `Assignee` | `ApplicationUser` | Navegación al responsable |
| `Status` | `Status` (default `Pendiente`) | En qué va. Usa el catálogo **global** de estados |
| `ScheduledDate` | DateTime | Cuándo toca hacerla |
| `DueDate` | DateTime? | **Fecha y hora límite.** El campo clave para detectar vencimiento |
| `CompletedAt` | DateTime? | Cuándo se cerró. Vacío = sigue abierta |
| `CompletedBy` | string | Quién la cerró |
| `CreatedAt` | DateTime (UTC) | Cuándo la generó el sistema |
| `CreatedFromRecurrenceDate` | DateTime? | De qué fecha del calendario de repetición salió. Sirve para no duplicar |
| `Comments` | colección | Comentarios |
| `Attachments` | colección | Archivos adjuntos |

**Índices existentes:** `AssigneeId`, `CustomerId`, `TaskTemplateItemId`.

> ⚠️ **No hay índice sobre `DueDate` ni sobre `Status`.** El motor de alertas va a consultar
> constantemente "dame todo lo vencido y sin cerrar", que filtra justo por esos dos campos.
> Sin índice, esa consulta se degrada conforme crece la tabla. Va al plan como tarea explícita.

---

### 6. `TaskComment` — Comentario en una tarea

**Tabla:** `TaskComments`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskComment.cs`

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `Id` | Guid | Identificador |
| `TaskInstanceId` | Guid | En qué tarea se comentó |
| `AuthorId` | string | Quién comentó |
| `Author` | `ApplicationUser` | Navegación al autor |
| `Text` | string | El texto del comentario |
| `CreatedAt` | DateTime (UTC) | Cuándo |

---

### 7. `TaskAttachment` — Archivo adjunto

**Tabla:** `TaskFiles`
**Archivo:** `Entities/Tenant/Operations/TaskEngine/TaskAttachment.cs`
**Qué representa:** archivos subidos a una tarea. **Es el candidato natural para el comprobante
obligatorio** de las tareas críticas.

| Propiedad | Tipo | Qué significa para el negocio |
| --- | --- | --- |
| `Id` | Guid | Identificador |
| `TaskInstanceId` | Guid | A qué tarea pertenece |
| `TaskTemplateId` | Guid | A qué plantilla pertenece |
| `FilePath` | string | Dónde quedó guardado el archivo |
| `MimeType` | string | Tipo de archivo (PDF, imagen…) |
| `FileName` | string | Nombre original que subió el usuario |
| `CreatedAt` | DateTime (UTC) | Cuándo se subió |
| `CreatedBy` | string | Quién lo subió |

> **Nota:** ambos identificadores (`TaskInstanceId` y `TaskTemplateId`) son obligatorios, sin
> nulabilidad. Habrá que verificar en el plan cómo se llena `TaskTemplateId` al adjuntar a una
> instancia, porque la instancia apunta a un *item*, no a la plantilla directamente.

---

## ⚠️ SEGUNDO MOTOR DE RECURRENCIA (LEGADO) — hallazgo 2026-08-20

Revisión posterior del PASO 0.5: en la MISMA carpeta `TaskEngine/` conviven **dos motores de
recurrencia distintos**, ambos registrados en Hangfire. El levantamiento inicial sólo documentó
uno.

| | Motor vigente | Motor legado |
| --- | --- | --- |
| Plantilla | `TaskTemplate` + `TaskTemplateItem` | `RecurringTaskTemplate` (tabla `TaskRecurringTemplates`) |
| Qué genera | `TaskInstance` | `Tasks` (tickets operativos) |
| Job | `RecurringTaskGenerationJob` | `RecurringTaskSchedulerJob` |
| Clave en catálogo | `generar-instancias-tareas-recurrentes` | `generar-instancias-tareas-recurrentes-legado` |
| Repetición | RRULE iCal (`Ical.Net`) | Aritmética propia (`Daily/Weekly/Monthly/Yearly` + intervalo) |
| Días festivos | ✅ `IHolidayService` | ❌ No los considera |
| Multi-cliente | ✅ `TaskInstance : ITenantEntity` | ❌ Ni `RecurringTaskTemplate` ni `Tasks` implementan `ITenantEntity` |
| Notifica al crear | ✅ Una vez | ❌ **Nunca notifica** |

### 13. `RecurringTaskTemplate` — Plantilla recurrente del motor legado

`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/RecurringTaskTemplate.cs`
· Tabla `TaskRecurringTemplates` · `DbSet` en `ApplicationDbContext.cs:487`

| Propiedad | Función en el negocio |
| --- | --- |
| `Title` / `Description` | Qué hay que hacer, se copia tal cual al ticket generado |
| `Pattern` | Cada cuánto se repite: diaria, semanal, mensual, anual |
| `Interval` | Cada cuántos periodos (1 = cada mes, 3 = trimestral) |
| `DayOfWeek` / `DayOfMonth` | Día fijo; `DayOfMonth = -1` significa "último día del mes" |
| `StartDate` / `EndDate` | Vigencia de la plantilla |
| `WorkGroupId` | Grupo de trabajo dueño del ticket generado (obligatorio) |
| `AssigneeId` | Responsable heredado por cada ticket generado |
| `Status` | Activa / inactiva (`RecurringTemplateStatus`) |
| `GeneratedTasks` | Tickets ya generados por esta plantilla |

**Por qué importa para el módulo de alertas:** si un cliente cargó sus obligaciones recurrentes
en este motor, las alertas construidas sobre `TaskInstance` **no lo cubrirían**, y el olvido
seguiría ocurriendo sin que nadie lo note. Además este motor no notifica absolutamente nada.

**Sin resolver:** la activación de los jobs vive en base de datos, no en código. No se puede
determinar desde el repositorio si `generar-instancias-tareas-recurrentes-legado` está encendido
ni si hay plantillas activas. Ver bloqueador B6.

**Fuera de alcance documentado:** las demás entidades de la carpeta (`TaskChangeLog`,
`TaskFollowUp`, `TaskMessageReads`, `TaskServiceOrder`, `TaskWeeklyWork`, `TaskWorkPlan`,
`WorkGroup`, `WorkGroupMembers`) pertenecen al sistema de tickets operativos, no al motor de
tareas recurrentes vigente.

---

## 🔗 ENTIDADES TRANSVERSALES QUE EL MÓDULO NECESITA

### 8. `ApplicationUser` — Usuario del sistema

**Tabla:** `Users` · **Archivo:** `Entities/System/Access/ApplicationUser.cs`

Extiende `IdentityUser`. Lo relevante para este módulo:

| Propiedad | Qué significa para el negocio |
| --- | --- |
| `CustomerId` | A qué condominio pertenece el usuario |
| `Active` | Si la cuenta está viva |
| `UserStatus` | Estado del usuario |
| `LastSeen` | Última conexión |
| `PhoneNumber` (obligatorio) | **Necesario para WhatsApp y SMS** |
| `FirstName` / `LastName` / `FullName` | Nombre para mostrar en alertas y tablero |
| `HierarchyLevel` | Nivel en el organigrama |

> ⚠️ `ReportsToId` y `Subordinates` están **comentados y marcados como deprecados** en el código.
> La jerarquía **ya no vive en el usuario**. Vive en el puesto. No usarlos.

---

### 9. `WorkPosition` — Puesto de trabajo

**Tabla:** `JobPositions` · **Archivo:** `Entities/Tenant/Recruitment/EstructuraOrganizacional/WorkPosition.cs`

**Qué representa:** el puesto, no la persona. Es la pieza que permite que las tareas "pasen al
que ocupe el puesto" cuando alguien renuncia.

| Propiedad | Qué significa para el negocio |
| --- | --- |
| `EmployeeId` (nullable) | **Quién ocupa el puesto hoy. Si va vacío, el puesto está vacante** |
| `Employee` | Navegación al empleado |
| `CustomerId` | En qué condominio existe el puesto |
| `ApplicationRoleId` | Qué rol de aplicación le corresponde |
| `Folio` | Folio del puesto |
| `State` | Si el puesto está activo |
| `ParentHierarchies` | Relaciones donde este puesto **es el subordinado** (por aquí se llega al jefe) |
| `ChildHierarchies` | Relaciones donde este puesto **es el jefe** |

Incluye además horarios por día de la semana, turno, sueldo y descripción del puesto —
no relevantes para alertas, pero presentes.

---

### 10. `OrgHierarchy` — Organigrama

> 🔄 **CAMBIA (decisión del 2026-08-20).** La jerarquía deja de definirse entre `WorkPosition` y
> pasa a definirse entre `ApplicationRole`, con `CustomerId` **obligatorio**. `WorkPosition`
> sigue siendo la fuente de qué roles son elegibles en cada cliente
> (`WorkPosition.ApplicationRoleId` + `WorkPosition.CustomerId`), pero ya no es el nodo del
> organigrama. Ver `04-implementation-plan.md` §3.1.2.


**Tabla:** `OrganizationHierarchy` · **Archivo:** `Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs`

**Qué representa:** quién le reporta a quién, entre puestos. **Es la fuente de verdad para saber
a quién escalar.** Funciona entre clientes distintos (cross-customer).

| Propiedad | Qué significa para el negocio |
| --- | --- |
| `ParentWorkPositionId` (nullable) | El puesto del jefe. **Vacío = es la punta del organigrama** |
| `ChildWorkPositionId` (obligatorio) | El puesto subordinado |
| `HierarchyLevel` | Qué tan abajo está en el árbol (0 = raíz) |
| `SortOrder` | Orden entre puestos del mismo nivel |
| `IsActive` | Si la relación jefe-subordinado sigue vigente |

**Cadena completa para resolver el jefe de un responsable:**

```
ApplicationUser → Employee → WorkPosition
   → OrgHierarchy (donde ChildWorkPositionId = ese puesto)
   → ParentWorkPositionId → WorkPosition del jefe
   → Employee → ApplicationUser del jefe
```

Para la escalación multinivel, se repite el salto subiendo por `ParentWorkPositionId`.

---

### 11. `Customer` — Cliente / condominio

Marca el alcance multi-cliente de todo el motor. Las entidades que implementan `ITenantEntity`
(`TaskInstance`, `TaskTemplateCustomer`) se filtran automáticamente por cliente.

### 12. `ApplicationRole` — Rol de aplicación

Catálogo de los 43 roles. Ver `conventions/operations/application-roles-catalog.md`
y `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs`.

---

## 🎚️ CATÁLOGOS (ENUMS) QUE EL MÓDULO TOCA

| Enum | Archivo | Valores | Restricción |
| --- | --- | --- | --- |
| `Status` | `Shared/Enums/Status.cs` | Pendiente, Concluido, noAutorizado, Proceso, Cancelado | **Global.** No tiene "Vencida". No modificar |
| `PriorityLevel` | `Shared/Enums/PriorityLevel.cs` | Alta, Baja | **Global.** Sólo dos valores. No sirve como criticidad. No modificar |
| `NotificationChannel` | `Shared/Enums/NotificationChannel.cs` | Email(0), Push(1), WhatsApp(2), InApp(3), PushWeb(4) | Se persiste en `NotificationLog.Channel`. **Sólo se agregan miembros al final** |
| `NotificationCategory` | `Shared/Enums/NotificationCategory.cs` | 13 valores, incluye `NewTask`(5) | Los nombres coinciden con literales ya guardados en BD |
| `RoleType` | `Shared/Enums/RoleType.cs` | System(0), Executive(1), Corporate(2), Staff(3), Client(4), Contractor(5) | Define quién recibe tareas |

---

## 🧩 SERVICIOS EXISTENTES QUE SE REUTILIZAN

| Servicio | Ubicación | Qué aporta | Estado |
| --- | --- | --- | --- |
| `INotificationDispatcher` | `SystemLuxuryApp/SystemTenant/Notification/Services/NotificationDispatcher.cs` | Envío unificado a InApp, Push, PushWeb, Email | ✅ Operativo. **Rechaza WhatsApp con excepción** |
| `IRecurringTaskGeneratorService` | `RecurringTasks/Services/RecurringTaskGeneratorService.cs` | Genera instancias a 7 días, respeta festivos, evita duplicados | ✅ Operativo |
| `IHolidayService` | — | Días festivos mexicanos | ✅ Operativo |
| `IWhatsAppService` | `Shared/Services/IWhatsAppService.cs` | WhatsApp vía Twilio | ⚠️ Sólo métodos fijos por caso de uso. Sin envío genérico |
| `ISmsService` | `Providers/Services/SmsService.cs` | SMS | ❌ **Placeholder. Reporta éxito sin enviar** |
| `HangfireJobCatalog` | `AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs` | Registro central de los 30 jobs programados | ✅ Operativo. Aquí se dan de alta los jobs nuevos |

---

## 🕳️ GAPS: QUÉ NECESITA EL OBJETIVO Y NO TIENE HOGAR

| # | Necesidad del negocio | ¿Ya tiene dónde vivir? | Qué falta |
| --- | --- | --- | --- |
| G-01 | Marcar una tarea como **crítica** | ❌ No | `PriorityLevel` sólo tiene Alta/Baja y es global. Se requiere catálogo propio del módulo |
| G-02 | **Días de aviso previo** configurables por tarea | ❌ No | `TaskTemplateItem` no tiene campo de anticipación |
| G-03 | **Responsable de respaldo** para escalación | ❌ No | No existe en ninguna entidad |
| G-04 | Asignación anclada al **rol** en vez de a la persona | ⚠️ Parcial | Decidido: se ancla a `ApplicationRole` + `CustomerId`. `TaskInstance.AssigneeId` seguirá apuntando a usuario (resuelto por cadena). Falta la entidad de asignación por rol |
| G-05 | **Checklist de confirmación** dentro de una tarea | ❌ No | Hoy el checklist es la plantilla (varias tareas), no pasos dentro de una tarea |
| G-06 | **Justificación** con aprobación del jefe | ❌ No | No existe entidad de justificación ni flujo de aprobación |
| G-07 | **Bitácora de alertas enviadas** (qué se mandó, a quién, por qué canal, cuándo) | ⚠️ Parcial | Existe `NotificationLog`, pero falta la liga con la tarea y el motivo de la alerta |
| G-08 | Estado **Vencida** | ⚠️ Derivable | Se calcula (`DueDate < ahora && CompletedAt == null`). No requiere entidad |
| G-09 | Estado de **incumplimiento formal** a los 5 días, con arrastre | ❌ No | `Status` global no lo contempla. Requiere campo propio del módulo |
| G-10 | **Comprobante obligatorio** en críticas | ⚠️ Parcial | `TaskAttachment` existe; falta la regla de obligatoriedad y su validación |
| G-11 | **Tablero de cumplimiento** por área y persona | ❌ No | No hay consultas ni pantalla |
| G-12 | Canal **SMS** | 🚫 Fuera de alcance | Descartado por decisión del usuario. Canales: InApp, Push, PushWeb, Email, WhatsApp |
| G-13 | Aviso al jefe cuando se asigna tarea a alguien **de vacaciones** | ⚠️ Parcial | Existe módulo de vacaciones; falta identificar la entidad de periodo vacacional y conectarla |
| G-14 | Índices para consultar vencidos | ❌ No | `TaskInstances` no indexa `DueDate` ni `Status` |

---

## ♻️ TABLA DE REUTILIZACIÓN (obligatoria antes de crear nada)

| Lo que se necesita | ¿Se reutiliza algo existente? | Veredicto preliminar |
| --- | --- | --- |
| Repetición de tareas | `TaskTemplateItem.RecurrenceRule` (RRULE) | ✅ Reutilizar tal cual |
| Generación diaria | `RecurringTaskGenerationJob` + `RecurringTaskGeneratorService` | ✅ Extender, no reescribir |
| Días festivos | `IHolidayService` | ✅ Reutilizar |
| Envío de alertas | `INotificationDispatcher` | ✅ Reutilizar |
| Adjuntos / comprobante | `TaskAttachment` | ✅ Reutilizar, agregar regla de obligatoriedad |
| Comentarios / justificación escrita | `TaskComment` | ⚠️ Evaluar: puede servir de base, pero la justificación necesita estado de aprobación |
| Jerarquía para escalar | `OrgHierarchy` + `WorkPosition` | ✅ Reutilizar |
| Multi-cliente | `ITenantEntity` | ✅ Reutilizar |
| Programación de jobs | `HangfireJobCatalog` | ✅ Reutilizar |
| Criticidad | `PriorityLevel` | ❌ NO reutilizar. Crear catálogo propio |
| Estados de tarea | `Status` | ❌ NO modificar. Definir estrategia en el plan |

---

## ✅ QUÉ SIGUE

Este documento requiere **aprobación** antes de pasar a la FASE 0
(`../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md`), según el gate del PASO 0.5.

**Pendientes de respuesta del usuario** (arrastrados del cuestionario):

1. Confirmar que la asignación se ancla al **puesto** y no a la persona (GAP G-04).
2. Qué hacer cuando un **puesto queda vacante** y sus tareas no tienen a quién asignarse.
3. Si hay **obligaciones ya registradas** en otro lado (Excel, calendario) que valga la pena
   migrar, o si se captura todo desde cero (P1.6.2).

---

*Generado siguiendo `skills/planeacion-modulos/SKILL.md` — PASO 0.5.*
