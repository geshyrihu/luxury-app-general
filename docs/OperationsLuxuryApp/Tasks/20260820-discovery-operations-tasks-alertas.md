# ALERTAS DE TAREAS RECURRENTES - AMPLIACIÓN DE MÓDULO EXISTENTE

**Tipo de trabajo:** B (Agregar funcionalidad a un módulo que ya existe)
**Fecha de inicio:** 2026-08-15
**Versión del plan:** 1.0
**Estado:** EN CURSO — Cuestionario de descubrimiento

---

## 📁 RUTAS DEL MÓDULO

| Capa | Ruta |
| --- | --- |
| **Backend (motor actual)** | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/` |
| **Backend (jobs)** | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskGenerationJob.cs` |
| **Backend (catálogo de jobs)** | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs` |
| **Frontend** | `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/` |
| **Interfaces frontend** | `client/angular/src/app/core/interfaces/recurring-tasks/` |
| **Documentación** | `docs/modulos-existente/alertas-tareas-recurrentes/` |

**Nota de arquitectura:** el motor vive hoy bajo `ReclutamientoLuxuryApp`, módulo con el que no tiene relación
funcional. El frontend, en cambio, ya está en `operations.luxuryapp/task-engine/`. Es una incoherencia a resolver
como decisión abierta (ver sección de Gaps).

---

## 🎯 OBJETIVO

Que ninguna tarea recurrente obligatoria se pierda por olvido: que el sistema insista con alertas mientras la
tarea siga pendiente, escale cuando se vence, y permita confirmar su cumplimiento paso a paso.

**Origen de la idea:** casos reales de contadores que olvidaron realizar pagos al IMSS y otras obligaciones
periódicas. Nadie se enteró hasta que el daño ya estaba hecho.

---

## 🔎 ESTADO ACTUAL VERIFICADO EN CÓDIGO (2026-08-15)

> Levantamiento hecho leyendo el código, no por supuestos.

### Lo que YA funciona

| Pieza | Ubicación | Qué hace |
| --- | --- | --- |
| `TaskTemplate` | `RecurringTasks/DTOs/TaskTemplateDTO.cs` | Plantilla asignada a un rol (`RoleId`) y a varios clientes (`CustomerIds`) |
| `TaskTemplateItem` | `RecurringTasks/DTOs/TaskTemplateItemDTO.cs` | Tarea individual con `RecurrenceRule` (RRULE iCal), `TimeWindowStart/End`, `Priority` |
| `CustomerTaskItemConfig` | `RecurringTasks/DTOs/CustomerTaskItemConfigDTO.cs` | Activación de cada tarea por cliente |
| `TaskInstance` | `RecurringTasks/DTOs/TaskInstanceDTO.cs` | Instancia generada: `Status`, `AssigneeId`, `ScheduledDate`, `DueDate`, `CompletedAt`, `CompletedBy`, comentarios, adjuntos |
| `RecurringTaskGenerationJob` | `Jobs/Workers/RecurringTaskGenerationJob.cs` | Job Hangfire, cron `0 0 * * *` (diario a medianoche) |
| `RecurringTaskGeneratorService` | `RecurringTasks/Services/RecurringTaskGeneratorService.cs` | Genera instancias a 7 días vista, respeta festivos mexicanos (`IHolidayService`), evita duplicados |
| Frontend plantillas | `task-engine/recurring-tasks/templates/` | Alta/edición de plantillas, items, reordenamiento, configuración por cliente |
| Frontend instancias | `task-engine/recurring-tasks/instances/` | Lista de tareas, tareas del día, formulario de completado |

### El hueco crítico

`RecurringTaskGeneratorService.cs` líneas 164-178: al crear la instancia se despacha **una única** notificación
(`NotificationCategory.NewTask`, canales `InApp` + `Push` + `PushWeb`) hacia el responsable.

**No existe:**

- Recordatorio mientras la tarea sigue pendiente
- Aviso de "por vencer" antes del `DueDate`
- Detección y alerta de tarea **vencida** (`DueDate` pasado sin `CompletedAt`)
- Escalación a un supervisor o jefe
- Tablero de cumplimiento / quién trae pendientes
- Checklist de confirmación **dentro** de una tarea (hoy `CompleteTaskInstanceDTO` sólo acepta un comentario
  opcional de 500 caracteres; no obliga a confirmar nada)

Existe `NotificationCleanupJob` (`limpiar-notificaciones-leidas`) pero es de limpieza, no de seguimiento.

---

## 📝 PASO 1: CUESTIONARIO DE DESCUBRIMIENTO

### SECCIÓN 1.1: EL PROBLEMA

#### P1.1.1 — ¿Qué problema o necesidad se quiere resolver?

**Respuesta:**

Caso disparador: un contador olvidó realizar los pagos de **ISR**. Nadie lo detectó a tiempo. Se enteraron
**hasta que llegó la multa**.

- **Frecuencia:** es frecuente. El área contable es sólo un ejemplo; hay más áreas que incurren en el mismo
  patrón de olvido de obligaciones periódicas.
- **Costo:** multa económica + cliente molesto + tiempo perdido rehaciendo/corrigiendo.
- **Causa raíz identificada por el usuario:** el contador **sí sabía** que tenía la obligación. Se le pasó
  porque *"su control no fue lo suficientemente claro"*.

**Naturaleza del problema (análisis del agente):** no es un problema de desconocimiento ni de falta de aviso
inicial. Es un problema de **control y visibilidad sostenida**:

1. La persona responsable no tiene un lugar claro donde ver qué le falta y qué tan urgente es.
2. Nadie externo al responsable está vigilando el cumplimiento. El olvido de una persona no dispara ninguna
   señal hacia arriba.
3. La detección es **reactiva**: el sistema de aviso real fue la multa, es decir, un tercero externo.

**Implicación de diseño:** más notificaciones al mismo responsable no resuelven el caso por sí solas. La
solución requiere (a) un control claro y persistente para el responsable, y (b) **escalación automática** hacia
un supervisor cuando la tarea se vence.

#### P1.1.2 — ¿Qué se espera lograr? Métricas concretas

**Respuesta:**

- **Multas incurridas:** 6
- **Costo unitario:** $5,000 MXN aproximado por multa
- **Costo total identificado:** **$30,000 MXN**
- **Plazo requerido:** lo antes posible (no hay fecha dura de corte; sí hay urgencia)

**KPIs derivados (borrador para FASE 0):**

| Métrica | Baseline | Meta | Plazo | Cómo se verifica |
| --- | --- | --- | --- | --- |
| Multas por obligación olvidada | 6 (histórico) | 0 | 6 meses post-liberación | Registro contable de multas |
| Costo por multas evitadas | $30,000 MXN perdidos | $0 | 6 meses post-liberación | Registro contable |
| Quién detecta el incumplimiento | Un tercero (llega la multa) | El sistema, antes del `DueDate` | Fase 1 | Log de alertas vs. fecha de multa |
| Tiempo entre vencimiento y enterarse | Semanas | Mismo día | Fase 1 | Timestamp de alerta de escalación |
| Tareas vencidas sin cerrar al cierre de mes | **PENDIENTE — medir en BD** | Definir tras baseline | Fase 1 | Consulta sobre `TaskInstance` |

**Dato faltante:** el baseline de "tareas vencidas sin cerrar" existe hoy en la tabla `TaskInstance`
(`DueDate < ahora AND CompletedAt IS NULL`). Requiere acceso a BD o que el Tech Lead ejecute la consulta.
Sin ese número, la meta de esa fila queda sin definir.

#### P1.1.3 — ¿Qué NO debe hacer este módulo?

**Respuesta:**

**Aclaración de alcance del usuario:** *"no todo es multa, pero sí es un problema operativo"*. El módulo NO se
limita a obligaciones fiscales. Aplica a cualquier tarea recurrente cuyo incumplimiento genere daño operativo,
aunque no haya sanción económica.

**DENTRO del alcance (confirmado):**

| # | Funcionalidad | Estado |
| --- | --- | --- |
| 1 | Alertas por WhatsApp / SMS | ✅ Va |
| 2 | Alertas por correo electrónico | ✅ Va |
| 3 | Reasignación de tarea vencida por el supervisor | ✅ Va |
| 4 | Posponer / justificar una tarea | ✅ Va |
| 5 | Comprobante obligatorio al cerrar la tarea | ✅ Va |
| 6 | Tablero de cumplimiento por área y por persona | ✅ Va |
| 7 | Escalación multinivel (si el jefe tampoco responde, sube) | ✅ Va |

**FUERA del alcance (v2 o nunca):**

| # | Funcionalidad | Motivo |
| --- | --- | --- |
| 8 | Calcular o predecir el monto de multa evitada | No todo incumplimiento genera multa; el valor del módulo es operativo, no sólo económico |

**Riesgo de alcance detectado por el agente:** los 7 puntos aprobados más el motor de alertas base constituyen
un alcance amplio frente al plazo declarado ("lo antes posible"). Se recomienda fasear la entrega para que el
valor llegue en la primera fase y no al final. Propuesta de corte en la sección de decisiones abiertas (D3).

---

### SECCIÓN 1.2: LOS USUARIOS

#### P1.2.1 — ¿Quiénes lo van a usar y qué hace cada uno?

**Respuesta:**

**Alcance por tipo de rol** (`RoleType`, ver `api/LuxuryApp.Shared/Enums/RoleType.cs`):

| RoleType | Valor | Descripción | ¿Recibe tareas? |
| --- | --- | --- | --- |
| `System` | 0 | Rol técnico con acceso absoluto (SuperUsuario) | ❌ No |
| `Executive` | 1 | Alta gerencia / Dirección | ❌ No |
| `Corporate` | 2 | Áreas internas: RR.HH., Legal, Sistemas, Contabilidad | ✅ Sí |
| `Staff` | 3 | Personal operativo del edificio | ✅ Sí |
| `Client` | 4 | Condóminos, comité | ❌ No |
| `Contractor` | 5 | Proveedores externos: jardinería, limpieza, seguridad | ✅ Sí |

**Modelo de responsabilidad (cambio respecto al motor actual):**

Hoy `RecurringTaskGeneratorService` hace *fan-out* automático: toma el `RoleId` de la plantilla y genera una
instancia para **cada** usuario con ese rol en ese cliente. Nadie es dueño señalado de la tarea.

El usuario define un modelo distinto: al configurar una tarea recurrente, el sistema debe **buscar a las
personas que tienen ese rol** y permitir **asignar explícitamente a uno o varios responsables** de esa tarea.

> El rol pasa de ser el asignatario a ser el **filtro de búsqueda** de candidatos.

Esto es un cambio de contrato en la generación de instancias y requiere una entidad de asignación explícita.
Ver decisión abierta D4.

**Principio rector declarado:** *"se busca autonomía en la gestión de las tareas"*. La alerta va **primero al
responsable**. El superior no se entera de entrada; se entera sólo si el mecanismo de escalación se dispara.

**Nota:** `Executive` queda fuera de recibir tareas, pero eso **no** define si puede recibir escalaciones o
ver el tablero de cumplimiento. Son cosas distintas y se resuelven en la sección 1.3.

#### P1.2.2 — ¿Cuándo se informa al superior? (política de escalación)

**Respuesta: HÍBRIDO POR CRITICIDAD.**

- Al configurar la tarea recurrente se clasifica como **CRÍTICA** (multa, riesgo legal o económico) o **NORMAL**.
- **Crítica vencida** → escala al superior **el mismo día**.
- **Normal vencida** → se acumula en un **digest semanal** por área.
- En ambos casos, la primera alerta y la insistencia van **siempre al responsable** (principio de autonomía).

**Justificación:** con digest semanal puro, una obligación que vence el día 17 podría escalarse hasta el día 23.
En el caso ISR eso equivale a 6 días de recargos ya corriendo. Con escalación inmediata universal, el superior
se satura de pendientes menores y deja de leer las alertas, lo que reintroduce el problema original.

---

#### P1.2.2.b — Hallazgos técnicos que condicionan el diseño

**Hallazgo 1 — `PriorityLevel` no sirve como criticidad y NO debe modificarse.**

`api/LuxuryApp.Shared/Enums/PriorityLevel.cs` sólo tiene `High` / `Low`, y es un enum **compartido por todo el
sistema**. Agregarle valores o reinterpretarlo como "criticidad" afectaría a consumidores ajenos a este módulo.

> Aplica la regla crítica del proyecto: **nunca modificar un enum/SelectItem existente; si se necesita algo
> distinto, se crea uno nuevo.** Ver `critical-rule-selectitem-never-modify` y CONVENTIONS.md §6.

**Acción:** crear un enum nuevo y propio del módulo (ej. `TaskCriticality`), con `DisplayName` en español, y
registrarlo en el hub centralizado `SharedLuxuryApp/SelectItemEnumEndPoints`.

**Hallazgo 2 — No existe el estado "Vencida" y `Status` tampoco debe modificarse.**

`TaskInstance.Status` usa el enum global `Status` (`Pendiente`, `Concluido`, `noAutorizado`, `Proceso`,
`Cancelado`). No hay estado de vencimiento, y `Status` es compartido por múltiples módulos.

**Opciones:** (a) derivar el vencimiento por cálculo (`DueDate < ahora && CompletedAt == null`) sin tocar el
enum, o (b) crear un enum de estado propio del módulo. Se resuelve en la decisión abierta D5.

**Hallazgo 3 — El organigrama YA EXISTE. La escalación tiene a dónde ir.**

| Entidad | Ubicación | Rol |
| --- | --- | --- |
| `OrgHierarchy` | `Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs` | Relación jefe↔subordinado entre puestos (`ParentWorkPositionId` / `ChildWorkPositionId`), con `HierarchyLevel` e `IsActive` |
| `WorkPosition` | mismo directorio | Puesto de trabajo; enlaza `EmployeeId`, `CustomerId` y `ApplicationRoleId` |

Cadena para resolver el superior de un responsable:

```
ApplicationUser → Employee → WorkPosition → OrgHierarchy.ParentWorkPositionId
                → WorkPosition (jefe) → Employee → ApplicationUser (jefe)
```

`ApplicationUser.ReportsToId` está **deprecado y comentado** en el código; la jerarquía vive en el puesto, no en
el usuario. La escalación multinivel (punto 7 del alcance) puede recorrer `OrgHierarchy` hacia arriba.

**Riesgo asociado:** la escalación sólo funciona si los puestos y sus relaciones jerárquicas están capturados.
Si un responsable no tiene `WorkPosition`, o su puesto no tiene padre en `OrgHierarchy`, la alerta crítica
**no tiene destinatario y se pierde en silencio**. Va directo al Pre-Mortem.

#### P1.2.3 — ¿Cómo se resuelve el destinatario de la escalación?

**Respuesta: ORGANIGRAMA + RESPALDO OBLIGATORIO.**

1. El sistema resuelve el superior recorriendo `OrgHierarchy` desde el puesto del responsable.
2. Si no encuentra superior (sin `WorkPosition`, sin padre, o relación inactiva), usa un **responsable de
   respaldo** definido al crear la tarea recurrente.
3. El respaldo es **campo obligatorio** en toda tarea marcada como CRÍTICA.

**Invariante derivada:** ninguna tarea crítica puede existir en el sistema sin un destinatario de escalación
resoluble. Esto se valida al guardar la plantilla, no al momento de escalar.

**Roles sin acceso al módulo:** `Client` (Condómino, Comité) queda fuera tanto de recibir tareas como de ver
el tablero de cumplimiento. `System` y `Executive` no reciben tareas asignadas, pero sí pueden recibir
escalaciones y consultar el tablero.

---

### SECCIÓN 1.3: LAS REGLAS

#### P1.3.1 — Cadencia de alertas

**Respuesta: se aprueba la cadencia completa propuesta.**

| Momento | Destinatario | Canales |
| --- | --- | --- |
| N días antes del `DueDate` (configurable) | Responsable | InApp + Push |
| 1 día antes | Responsable | InApp + Push + Email |
| Mismo día, por la mañana | Responsable | InApp + Push + WhatsApp |
| Vencida — CRÍTICA | Responsable + superior | Todos |
| Vencida — NORMAL | Responsable | InApp + Email |
| Sigue vencida, cada 24 h | Responsable | InApp + Push |
| 3 días vencida — CRÍTICA | Siguiente nivel de `OrgHierarchy` | Email + WhatsApp |
| Lunes 08:00 | Cada superior, digest de su área | Email |

**Decisiones confirmadas:**

- **Canales solicitados:** InApp (campanita) + Push + WhatsApp + **SMS** + Email.
- **Días de aviso previo:** **configurables por tarea**, no globales.
- **Fin de la insistencia:** hasta **30 días** vencida, o hasta que exista una **justificación válida**.
  > ⚠️ **SUPERADO el 2026-08-20:** el dueño redujo la tolerancia a **5 días máximo** y la insistencia dejó de apagarse. Ver `RN-ALT-014`, `RN-ALT-051` y `RN-ALT-053`.
  Esto implica que la justificación requiere aprobación (una justificación no validada no detiene el ciclo).
- **WhatsApp:** requerido **desde el arranque**.

---

#### P1.3.1.b — Estado real de los canales (verificado en código)

| Canal | Enum | ¿Existe? | Estado real |
| --- | --- | --- | --- |
| InApp | `NotificationChannel.InApp` (3) | ✅ | Funciona: persiste en `NotificationUser` + SignalR |
| Push App | `Push` (1) | ✅ | Funciona vía OneSignal |
| Push Web | `PushWeb` (4) | ✅ | Funciona vía OneSignal Web |
| Email | `Email` (0) | ✅ | Funciona; **exige** `EmailTemplate` y destinatarios en `To` |
| WhatsApp | `WhatsApp` (2) | ⚠️ | Existe el enum, pero `NotificationDispatcher` **lanza `NotSupportedException`** |
| SMS | — | ❌ | **No existe** en `NotificationChannel` |

**Bloqueante 1 — WhatsApp no está integrado al despachador.**

`NotificationDispatcher.cs:34-39` lanza excepción explícita si se le pasa el canal WhatsApp: *"aún no está
soportado (Fase 3 del estándar de mensajería). Usa IWhatsAppService directamente mientras tanto."*

Peor: `IWhatsAppService` (`api/LuxuryApp.Shared/Services/IWhatsAppService.cs`) usa **Twilio con Content
Templates aprobados** por Meta (categoría Utility, es-MX) y expone **sólo métodos específicos por caso de uso**
(ticket legal, solicitud recibida, solicitud terminada). **No hay método genérico de envío.**

> Consecuencia: enviar "tu tarea venció" por WhatsApp requiere **dar de alta y aprobar plantillas nuevas ante
> Meta**. Ese trámite es externo, tarda días o semanas, y no depende del equipo de desarrollo.

**Bloqueante 2 — El SMS es un placeholder que MIENTE.**

`api/LuxuryApp.Providers/Services/SmsService.cs` no envía nada: hace `await Task.Delay(500)`, escribe en el log
*"SMS enviado exitosamente"* y **retorna `SuccessResult(true)`**. El código real de Twilio está comentado.

> Consecuencia crítica: si se conectan alertas a este servicio, el sistema **reportará que avisó al responsable
> y no habrá avisado a nadie**. Es exactamente el modo de falla que el módulo busca eliminar, pero con
> confianza falsa encima. Ver Pre-Mortem.

**Bloqueante 3 — SMS no existe como canal.** Requiere agregar miembro al final de `NotificationChannel`
(el enum lo permite explícitamente: *"Sólo se agregan miembros al final"*, los valores 0-2 se persisten en
`NotificationLog.Channel`), más contratar e integrar proveedor real.

#### P1.3.1.c — Decisión sobre canales

**Respuesta: los 4 canales operativos + WhatsApp. SMS queda FUERA del alcance.**

- **Fase 1:** InApp, Push, PushWeb, Email. Todos funcionan hoy, sin dependencias externas.
- **Fase 2:** WhatsApp, en cuanto Meta apruebe las plantillas nuevas. El trámite se inicia **en paralelo** a la
  Fase 1 para no bloquear la entrega.
- **SMS:** descartado. Correo y WhatsApp cubren al usuario que no abre la app; el SMS agregaría proveedor,
  costo por mensaje y un punto de falla adicional sin beneficio incremental claro.

**Deuda técnica señalada (fuera de este módulo):** `SmsService` seguirá existiendo como placeholder que
reporta éxito falso. No lo consume este módulo, pero es una trampa activa para cualquier otro que lo use.
Se recomienda levantar ticket independiente: implementarlo de verdad o hacer que falle explícitamente.

---

#### P1.3.2 — ¿Qué estados y transiciones tiene el proceso?

**Respuesta: se aprueba la máquina de estados propuesta.**

| Estado | Cómo se llega | Quién lo provoca |
| --- | --- | --- |
| `Pendiente` | Generación nocturna del job | Sistema |
| `EnProceso` | El responsable la inicia | Responsable |
| `Reasignada` | El superior la transfiere | Superior (organigrama) |
| `Justificada` | El responsable solicita excusa | Responsable (queda **en espera de aprobación**) |
| `JustificacionAprobada` | Visto bueno | **Jefe del organigrama** |
| `JustificacionRechazada` | Se niega la excusa | Jefe del organigrama → vuelve a `Pendiente` |
| `Completada` | Checklist cerrado (+ comprobante si es crítica) | Responsable |
| ~~`Abandonada`~~ → `Incumplimiento` | **5 días** vencida sin cierre ni justificación aprobada (antes 30). No detiene las alertas: baja su cadencia y se arrastra | Sistema |

**`Vencida` es estado DERIVADO, no persistido:** se calcula como `DueDate < ahora && CompletedAt == null`.
Evita tocar el enum global `Status` (ver Hallazgo 2) y elimina el riesgo de que un registro quede con estado
desincronizado respecto al reloj.

**Reglas confirmadas:**

- **RN — Aprobación de justificación:** sólo el **jefe resuelto vía `OrgHierarchy`** puede aprobar o rechazar.
  El responsable **no puede auto-justificarse**. Una justificación pendiente de aprobación **no detiene** el
  ciclo de alertas.
- **RN — Corte de tolerancia a 5 días** (antes 30, cambiado el 2026-08-20): al marcarse el incumplimiento se notifica a `Direccion`, `SuperUsuario` y
  `SupervisionOperativa`, y el registro **permanece visible en el tablero como incumplimiento definitivo**.
  No desaparece del historial.
- **RN — Comprobante:** obligatorio **sólo en tareas CRÍTICAS**. Las normales se cierran con el checklist.
- **RN — Reasignación:** **conserva la `DueDate` original**. Si ya estaba vencida, el nuevo responsable la
  recibe vencida. Reasignar no es una forma de resetear el reloj.

**Nota de coherencia:** `Direccion` (Executive) y `SuperUsuario` (System) **no reciben tareas asignadas**
(ver P1.2.1) pero **sí reciben escalaciones y ven el tablero**. Son capacidades distintas y así se modelan.

#### P1.3.3 — ¿Qué validaciones debe tener cada campo?

**Respuesta:** _(pendiente)_

---

### SECCIÓN 1.4: LOS RIESGOS

#### P1.4.1 — Pre-Mortem: salió a producción y fue un desastre, ¿qué falló?

**Respuesta del usuario: los 7 supuestos fallidos YA OCURRIERON en otros módulos.**

> Todos se califican con probabilidad **Alta**. Ninguno es hipotético: son modos de falla observados.

| ID | Supuesto fallido | Impacto | Prob. | Mitigación | Responsable |
| --- | --- | --- | --- | --- | --- |
| PM-01 | La obligación nunca se dio de alta como tarea recurrente | El módulo es irrelevante: no alerta lo que no existe | **Alta** | Tarea explícita de carga inicial de obligaciones por área, con responsable nombrado y fecha, dentro del plan. No es supuesto | Tech Lead + responsables de área |
| PM-02 | El responsable no tiene puesto en `OrgHierarchy` | La escalación crítica no encuentra jefe y muere en silencio | **Alta** | Respaldo obligatorio en toda tarea crítica + validación al guardar plantilla + reporte de responsables sin puesto | Backend |
| PM-03 | Cierran la tarea sin haberla hecho | Tablero en verde con incumplimiento real | **Alta** | Comprobante obligatorio en críticas + checklist por pasos + auditoría de quién cerró y cuándo | Backend |
| PM-04 | El jefe aprueba toda justificación sin leerla | La escalación se vuelve trámite; el control se erosiona | **Alta** | Métrica de tasa de aprobación por jefe, visible en tablero de Dirección. Justificación exige motivo escrito | Backend + Frontend |
| PM-05 | Nadie abre el tablero de cumplimiento | Se construye una pantalla que nadie consulta | **Alta** | El digest semanal por correo **empuja** la información; el tablero no es el único canal | Backend |
| PM-06 | Saturación: todo se marca como crítico | El ruido entierra las alertas que importan | **Alta** | Límite o revisión de cuántas tareas críticas puede tener un área; reporte de proporción crítica/normal | Tech Lead |
| PM-07 | El job de generación falla y nadie lo nota | Un día sin tareas generadas, sin señal de alarma | **Alta** | Monitoreo del job: alertar a `SistemasGeneral` si no completó su corrida diaria | DevOps + Backend |
| PM-08 | Se conecta el canal SMS al placeholder actual | El sistema reporta "SMS enviado" sin enviar nada: falsa confianza | **Alta** | **Bloqueante:** implementar `SmsService` con proveedor real antes de habilitar el canal | Backend |

#### P1.4.2 / P1.4.3 — Riesgos más graves y mitigación

**Requisito reafirmado por el usuario:** las alertas deben salir por **todos los medios** — SMS, WhatsApp,
Email, notificación en app y OneSignal (push app y push web). La redundancia de canales es, en sí misma, la
mitigación contra el riesgo de que el responsable no vea el aviso.

**DECISIÓN FINAL (2026-08-17): SMS queda FUERA del alcance por el momento.**

Canales aprobados para este módulo:

| Canal | Enum | Estado |
| --- | --- | --- |
| Notificación en app (campanita) | `InApp` (3) | ✅ Operativo |
| Push App (OneSignal) | `Push` (1) | ✅ Operativo |
| Push Web (OneSignal) | `PushWeb` (4) | ✅ Operativo |
| Correo electrónico | `Email` (0) | ✅ Operativo |
| WhatsApp | `WhatsApp` (2) | ⚠️ Requiere habilitar en `NotificationDispatcher` + plantillas Meta |
| SMS | — | ❌ **Fuera del alcance** |

**Efecto sobre el riesgo PM-08:** queda **neutralizado por exclusión**. Al no consumir `SmsService`, el
módulo no puede reportar entregas falsas por ese canal.

**Deuda técnica que permanece abierta fuera de este módulo:** `SmsService` sigue siendo un placeholder que
retorna `SuccessResult(true)` sin enviar nada (`Providers/Services/SmsService.cs:9-32`). Es una trampa para
cualquier otro módulo que lo consuma. Se recomienda ticket independiente. Si algún día se incorpora SMS aquí,
`RN-ALT-006` lo bloquea hasta implementar proveedor real.

#### P1.4.2 — ¿Cuáles riesgos son los más graves?

**Respuesta:** _(pendiente)_

#### P1.4.3 — ¿Cómo minimizamos cada riesgo grave?

**Respuesta:** _(pendiente)_

---

### SECCIÓN 1.5: LAS INTEGRACIONES

#### P1.5.1 — ¿Con qué otros módulos o sistemas se conecta?

**Respuesta:** _(pendiente)_

#### P1.5.2 — ¿Qué pasa si un módulo del que depende no está disponible?

**Respuesta:** _(pendiente)_

---

### SECCIÓN 1.6: CASOS ESPECIALES

#### P1.6.1 — ¿Qué casos raros pueden ocurrir?

**Respuesta:**

**Caso 1 — Responsable de vacaciones o incapacitado.**

La tarea **se asigna igual** (no se salta ni se reasigna automáticamente), pero el sistema **notifica al jefe**
que una tarea importante está siendo asignada a un colaborador que se encuentra en vacaciones.

- El aviso al jefe es **en el momento de la asignación**, no al vencer. Es preventivo, no reactivo.
- Requiere consultar el estado de vacaciones del usuario al generar la instancia (existe módulo de vacaciones;
  hay job `notificar-vacaciones-por-vencer`). Falta identificar la entidad concreta de periodo vacacional.

**Caso 2 — El responsable renuncia o cambia de puesto.**

Las tareas **pasan a quien ocupe el puesto**. No quedan huérfanas ni requieren reasignación manual.

> **Consecuencia de diseño (a confirmar):** la asignación debe anclarse al **puesto (`WorkPosition`)**, no al
> usuario. El responsable efectivo se resuelve al generar la instancia, como el ocupante actual del puesto
> (`WorkPosition.EmployeeId` → `Employee` → `ApplicationUser`).
>
> Esto es compatible con lo definido en P1.2.1 (elegir uno o varios responsables por nombre): al seleccionar a
> la persona, lo que se guarda es **su puesto**. El rol filtra candidatos, la persona identifica el puesto, y
> el puesto es lo que persiste.
>
> Las instancias **ya generadas** conservan a su responsable original (histórico auditable); el cambio afecta
> a las instancias **futuras**.

**Caso 3 — El cliente (condominio) se da de baja.**

Sus tareas recurrentes **se detienen automáticamente**. No se siguen generando instancias para clientes
inactivos, y las pendientes dejan de alertar.

#### P1.6.2 — ¿Hay datos históricos que migrar?

**Respuesta: NO. Hoy no existe información registrada en ningún lado.**

No hay Excel, calendario ni sistema previo con las obligaciones recurrentes. Se arranca capturando todo
desde cero.

**Consecuencia para el plan:**

- **No hay migración de datos.** La sección de migración del plan se limita a los cambios de estructura del
  propio módulo; no hay carga de datos históricos ni riesgo de pérdida de información previa.
- **Refuerza el riesgo PM-01 al máximo.** Si nadie captura las obligaciones, no hay absolutamente nada que
  alertar. La carga inicial deja de ser "deseable" y se convierte en **condición de existencia del módulo**.
  Debe ir en el plan como fase con responsable nombrado y criterio de paso propio.

---

#### P1.6.3 — Anclaje de la asignación (cierre del GAP G-04)

**Respuesta: se ancla al ROL, no al `WorkPosition`.**

Cadena de resolución declarada por el usuario:

```
Tarea recurrente → RoleId (ApplicationRole) + CustomerId
                 → se buscan los ApplicationUser con ese rol en ese cliente
                 → de esos candidatos se designa a uno o varios responsables
```

**Precisión técnica registrada:** "puesto" y "rol" **no son la misma entidad** en este sistema.

| Concepto | Entidad | Característica |
| --- | --- | --- |
| Rol | `ApplicationRole` | Varios usuarios pueden compartirlo. **No tiene jerarquía** |
| Puesto | `WorkPosition` | Un ocupante a la vez (`EmployeeId`). **Cuelga del organigrama** vía `OrgHierarchy` |

**Consecuencia de diseño — los dos caminos conviven:**

1. **Para ASIGNAR:** `RoleId` + `CustomerId` → candidatos → responsables designados.
   Al anclar al rol, si un responsable deja de tener ese rol en ese cliente, la tarea vuelve al conjunto de
   quien ocupe el rol. Cumple "pasan al que ocupe su puesto" (P1.6.1, caso 2).
2. **Para ESCALAR:** se necesita el `WorkPosition` del responsable, porque `OrgHierarchy` sólo conoce puestos.
   El rol por sí solo **no permite resolver al jefe**.

> Por eso el **respaldo obligatorio** definido en P1.2.3 sigue siendo indispensable: es la red que cubre a
> los responsables que tienen rol pero no tienen puesto en el organigrama.

---

#### P1.6.4 — Rol vacante en un cliente

**Respuesta: GENERA la tarea, la ASIGNA de todos modos y AVISA AL JEFE.**

Si al momento de generar no hay ningún usuario con ese rol en ese cliente, la tarea **se crea igual** (no se
suspende ni se salta) y **se le asigna a alguien**. Nunca queda sin dueño.

**Cadena de resolución del responsable (corrección del 2026-08-17):**

```
1. ¿Hay usuario con ese rol en ese cliente?     → se le asigna a él
2. ¿No hay? → jefe vía OrgHierarchy             → se le asigna al jefe
3. ¿Tampoco hay jefe? → responsable de respaldo → se le asigna al respaldo
```

Se detiene en el primer nivel que resuelva. Cuando la asignación ocurre en el nivel 2 o 3, se marca como
**asignación por excepción** y el jefe recibe aviso explícito de que hay obligaciones sin titular.

**Justificación:** el caso ISR lo exige. Si el contador renuncia en marzo y contratan en mayo, la obligación
fiscal de abril **sigue existiendo**. Y una tarea sin dueño es una tarea que nadie hace: asignarla al jefe
garantiza que alguien la vea.

**Implicación técnica (favorable):** `TaskInstance.AssigneeId` **permanece obligatorio** (`[Required]`, ver
`Entities/Tenant/Operations/TaskEngine/TaskInstance.cs:49-50`). **No se requiere cambio de esquema** sobre
la tabla existente, lo que elimina una migración riesgosa del plan.

---

## 🔍 DECISIONES ABIERTAS (se resuelven antes del plan)

| ID | Decisión | Opciones | Recomendación | Estado |
| --- | --- | --- | --- | --- |
| D1 | Ubicación del motor en backend | (a) Dejarlo en `ReclutamientoLuxuryApp` (b) Mover a `OperationsLuxuryApp` | (b), para alinear con el frontend que ya vive en `operations.luxuryapp` | Pendiente |
| D2 | Checklist de confirmación | (a) Nueva entidad de pasos por instancia (b) Reusar los items de plantilla | Pendiente de cuestionario | Pendiente |

---

*Documento generado siguiendo `skills/skill-planeacion-modulos.md` — PASO 0 completado, PASO 1 en curso.*
