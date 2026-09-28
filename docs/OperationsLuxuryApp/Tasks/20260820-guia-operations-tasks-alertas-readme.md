# Módulo: Alertas de Tareas Recurrentes

**Tipo de trabajo:** B — Ampliación de módulo existente (`TaskEngine`)
**Inicio:** 2026-08-15
**Skill aplicada:** `skills/planeacion-modulos/SKILL.md`

---

## Estado General

| Fase | Documento | Estado | Fecha |
| --- | --- | --- | --- |
| PASO 0 — Tipo y rutas | `../../../docs/SystemLuxuryApp/AiChat/20260801-discovery-system-ai-chat.md` (cabecera) | ✅ Completo | 2026-08-15 |
| PASO 0.5 — Reconocimiento de entidades | `../../../docs/SystemLuxuryApp/AiChat/20260801-arquitectura-system-ai-chat-entidad.md` | ✅ Completo | 2026-08-17 |
| PASO 1 — Discovery | `../../../docs/SystemLuxuryApp/AiChat/20260801-discovery-system-ai-chat.md` | ✅ Completo | 2026-08-17 |
| PASO 2 — FASE 0 | `../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md` | ✅ Aprobada | 2026-08-17 |
| PASO 2b — Enmienda: anclaje a grupos | `../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-anclaje-grupos.md` | ✅ Aprobada | 2026-08-20 |
| PASO 3 — Riesgos y dependencias | `../../../docs/SystemLuxuryApp/Logs/20260818-analisis-system-logs-riesgos.md` | ✅ Completo (ajustar por enmienda) | 2026-08-20 |
| PASO 4 — Plan de implementación | `../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md` | ✅ Propuesto | 2026-08-20 |
| Validación con calendario real | `../../../docs/OperationsLuxuryApp/Tasks/20260821-auditoria-operations-tasks-validacion-calendario.md` | ✅ Completa | 2026-08-20 |
| Análisis de flujos y simplificación | `../../../docs/OperationsLuxuryApp/Tasks/20260821-analisis-operations-tasks-flujos.md` | ✅ Completo (consolidado con `06b`) | 2026-08-20 |
| Orquestación de implementación | `docs/plans/20260820-alertas-tareas-recurrentes-orquestacion.md` | ▶️ T-01 listo | 2026-08-20 |
| PASO 5 — Aprobación con gate objetivo | — | ⏳ Pendiente (ajustar plan con C1–C7) | — |

---

## Objetivo

Que ninguna tarea recurrente obligatoria se pierda por olvido: que el sistema insista con
alertas mientras la tarea siga pendiente, escale cuando se vence, y permita confirmar su
cumplimiento paso a paso.

**Origen:** contadores que olvidaron pagos de ISR. 6 multas, ~$5,000 MXN cada una.
Se detectó hasta que llegó la multa.

---

## Rutas

| Capa | Ruta |
| --- | --- |
| Entidades | `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/` |
| Aplicación (mal ubicada) | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/` |
| Job (vigente) | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskGenerationJob.cs` |
| Job (legado) | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskSchedulerJob.cs` |
| Frontend | `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/` |
| **Destino (sistema de tareas)** | `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/` — grupos, miembros, seguimientos, reportes |

---

## Decisiones Críticas Tomadas

| # | Decisión | Detalle |
| --- | --- | --- |
| 1 | Ampliar, no crear de cero | El motor `TaskEngine` ya existe y funciona; falta la capa de alertas y seguimiento |
| 2 | ~~Escalación híbrida: normales en digest semanal~~ | ⚠️ **SUSTITUIDA 2026-08-20:** con tolerancia de 5 días un digest semanal llega tarde. Escalera comprimida día 0/1/3/5 (`RN-ALT-053`); el digest queda sólo como resumen de arrastradas |
| 3 | Destinatario: **organigrama + respaldo obligatorio** | Ninguna tarea crítica sin destinatario de escalación resoluble |
| 4 | Justificación la aprueba **el jefe del organigrama** | El responsable no puede auto-justificarse |
| 5 | `Vencida` es estado **derivado**, no persistido | Evita modificar el enum global `Status` |
| 6 | Reasignar **conserva la fecha límite original** | Reasignar no resetea el reloj |
| 7 | ~~Comprobante obligatorio sólo en críticas~~ | ⚠️ **REVISAR (2026-08-20):** el calendario real tiene entregable en las 24 actividades. Debe ser configurable por plantilla y con nombre propio. Ver `05` §3.4 |
| 8 | **Tolerancia de 5 días** (antes 30), notifica a `Direccion`, `SuperUsuario`, `SupervisionOperativa` | Cambiado el 2026-08-20: no se puede dejar pasar más tiempo. Al día 5 se marca incumplimiento formal y **la tarea se arrastra, no se apaga** |
| 9 | ~~Tareas pasan a quien ocupe el ROL~~ | ❌ **SUSTITUIDA 2026-08-20** por la decisión #14. Ver `../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-anclaje-grupos.md` |
| 14 | **Anclaje al GRUPO DE TRABAJO** | La tarea pertenece a un `WorkGroup`; los responsables son sus administradores (`WorkGroupMembers.IsAdmin`). Es como ya opera el sistema de tareas |
| 16 | **Las obligaciones se encadenan** | Validado con calendario real: alertar río arriba cuando la obligación previa se atrasa. `Tasks.DependsOnTaskId` ya existe y no se usaba |
| 15 | **Motor único que genera `Tasks`** | Se retira `TaskTemplate`/`TaskInstance`. Se portan al motor único: RRULE, festivos, `CustomerId` y notificaciones |
| 10 | **SMS fuera del alcance** | Canales: InApp, Push App, Push Web, Email y WhatsApp. Neutraliza el riesgo del `SmsService` falso |
| 23 | **`TaskAttachment` se reapunta, no se duplica** | Corregido el 2026-08-20: se había propuesto un `TaskDocument` nuevo. Lo que muere es `TaskInstance`, no la entidad de archivos. Sólo cambia la FK |
| 21 | **`Critical` se agrega a `PriorityLevel`, sin enum paralelo** | Un solo campo, más simple. Adición al final, no modificación. Obliga a corregir 3 lecturas que asumen que `High` es lo importante (RT-21) |
| 22 | **Criticidad inmutable en tareas generadas** | Ni el administrador del grupo puede bajarla. Sin esto, el *toggle* de prioridad existente la degradaría con un clic |
| 20 | **Un usuario, un rol** | Convención vigente, no restricción de esquema. Vuelve inequívoca la escalación por organigrama. Si aparecen dos roles, el módulo reporta la anomalía en vez de elegir uno |
| 19 | **Organigrama por ROL, no por puesto** | `OrgHierarchy` pasa a `ApplicationRole` padre/hijo con `CustomerId` **obligatorio**. Los roles elegibles salen de los `WorkPosition` vivos del cliente. Cierra RS-01 y elimina la dependencia del expediente de empleado |
| 18 | **La insistencia nunca se apaga** | El sistema deja de dar por perdida una tarea. Pasado el día 5 baja la cadencia a semanal y la arrastra con explicación (`RN-ALT-051`) |
| 17 | **WhatsApp tiene proveedor operativo** | Twilio Content Templates con 4 plantillas aprobadas. Falta habilitarlo en el dispatcher unificado (B1) y confirmar entrega real (B9) |
| 13 | **Una obligación = una tarea con varios responsables** | Responsable principal + corresponsables. Cerrarla la cierra para todos. Los KPIs cuentan obligaciones, no copias. Cambia el fan-out actual (RT-04) |
| 12 | **Dos motores de recurrencia conviven** | El vigente (`TaskInstance`) y el legado (`Tasks`). El plan debe decidir: migrar, cubrir ambos o apagar el legado |
| 11 | **Toda tarea tiene siempre responsable** | Cadena: usuario con el rol → jefe (`OrgHierarchy`) → respaldo. `AssigneeId` sigue obligatorio, **sin cambio de esquema** |

---

## Bloqueadores

| # | Bloqueador | Impacto | Estado |
| --- | --- | --- | --- |
| B1 | `NotificationDispatcher` rechaza WhatsApp con excepción (`NotificationDispatcher.cs:34-38`, verificado 2026-08-20) | El canal unificado sigue sin poder enviar WhatsApp, aunque el proveedor funcione | **Abierto** |
| B2 | ~~Plantillas aprobadas por Meta~~ | — | **Cerrado 2026-08-20:** Twilio Content Templates operativo con 4 plantillas y sus Content SID configurados. Ya no hay trámite externo pendiente |
| B8 | La plantilla `AlertaTareaUrgente` clava el enlace al módulo legal (`TicketPath` → `legal/list-ticket-legal/{id}`) y sólo cubre el tono "urgente" | El módulo necesita 5 tipos de alerta y una ruta propia | Abierto |
| B9 | No hay confirmación real de entrega: Twilio devuelve `queued`/`accepted` al crear, no `delivered`. No existe webhook de estado | `RN-ALT-006` prohíbe reportar entregado sin confirmación real | Abierto |
| B3 | `SmsService` es placeholder que reporta éxito falso | — | **Cerrado por exclusión:** SMS salió del alcance. Queda como deuda técnica de otro ticket |
| B4 | Baseline de "tareas vencidas sin cerrar" sin medir | Un KPI queda sin meta definida | Abierto |
| B10 | El refactor de `OrgHierarchy` a roles es de otro equipo | F4 (escalación nivel 2) depende de él. Si no está, se libera con nivel 1 + respaldo | Abierto |
| B5 | `audit-conventions.mjs` reporta 10 errores **pre-existentes** (skills `luxuryapp-core` fuera de sincronía + 2 referencias fantasma a la ruta legacy `docs` + `conventions`) | Bloquea el gate objetivo del PASO 5. No lo causa este módulo | Abierto |
| B7 | ~~Volumen de datos vivos en el motor viejo~~ | — | **Cerrado 2026-08-20:** el dueño confirmó que no está en uso. Retiro sin migración de datos (con verificación y respaldo, F0/F7) |
| B6 | Motor de recurrencia **legado** (`RecurringTaskTemplate` → `Tasks`) activo en el catálogo de Hangfire, sin notificaciones ni multi-tenant. **Corregido 2026-08-21:** no se apaga por configuración — `RegisterRecurringJobsAsync` (`HangfireExtensions.cs:34-49`) re-registra todos los jobs del arreglo en cada arranque, así que apagarlo de forma permanente **exige tocar código** | Si hay obligaciones cargadas ahí, las alertas no las cubrirían. Cambia la forma de T-15 | Abierto |

---

## Próximos Pasos

1. ~~PASO 3 — `../../../docs/SystemLuxuryApp/Logs/20260818-analisis-system-logs-riesgos.md`~~ ✅
2. ~~PASO 4 — `../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md`~~ ✅
3. PASO 5 — revisión final + gate objetivo
4. **Ejecución por tickets** ← aquí vamos: `docs/plans/20260820-alertas-tareas-recurrentes-orquestacion.md`, 16 tickets, uno a la vez

**En paralelo, sin bloquear la planeación:**

- Definir plantillas por tipo de alerta y el webhook de entrega de Twilio (B8, B9)
- Medir baseline del KPI K6 en producción (bloqueador B4)

---

## Documentos de este módulo

- [../../../docs/OperationsLuxuryApp/Tasks/20260820-guia-operations-tasks-alertas-handoff.md](./../../../docs/OperationsLuxuryApp/Tasks/20260820-guia-operations-tasks-alertas-handoff.md) — **para retomar el proyecto en otra sesión**
- [../../../docs/SystemLuxuryApp/AiChat/20260801-discovery-system-ai-chat.md](./../../../docs/SystemLuxuryApp/AiChat/20260801-discovery-system-ai-chat.md) — PASO 1
- [../../../docs/SystemLuxuryApp/AiChat/20260801-arquitectura-system-ai-chat-entidad.md](./../../../docs/SystemLuxuryApp/AiChat/20260801-arquitectura-system-ai-chat-entidad.md) — PASO 0.5
- [../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md](./../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md) — PASO 2 (FASE 0)
- [../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-anclaje-grupos.md](./../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-anclaje-grupos.md) — **enmienda a la FASE 0 (leer junto con el 02)**
- [../../../docs/SystemLuxuryApp/Logs/20260818-analisis-system-logs-riesgos.md](./../../../docs/SystemLuxuryApp/Logs/20260818-analisis-system-logs-riesgos.md) — PASO 3
- [../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md](./../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md) — PASO 4
- [../../../docs/OperationsLuxuryApp/Tasks/20260821-auditoria-operations-tasks-validacion-calendario.md](./../../../docs/OperationsLuxuryApp/Tasks/20260821-auditoria-operations-tasks-validacion-calendario.md) — **validación contra un calendario real (Royal Reforma)**
- [../../../docs/OperationsLuxuryApp/Tasks/20260821-analisis-operations-tasks-flujos.md](./../../../docs/OperationsLuxuryApp/Tasks/20260821-analisis-operations-tasks-flujos.md) — **qué se automatiza, qué se queda y qué se quita**
- [../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-flujos.md](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-flujos.md) — prompt autocontenido que produjo el reporte `06`
- [../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md](./../../../docs/SystemLuxuryApp/Logs/20260818-checklist-system-logs.md) — tracking

---

## Referencias externas (NO mover — viven en su propio tema)

Verificado el 2026-08-17: no existe documentación de este refactor fuera de esta carpeta.
Los siguientes documentos son contexto necesario y permanecen en su ubicación original.

| Documento | Por qué importa |
| --- | --- |
| [Estándar de notificaciones](../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md) | Define la "Fase 3" de mensajería que hoy mantiene bloqueado el canal WhatsApp (bloqueador B1) |
| [Auditoría de notificaciones](../../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md) | Estado real de los canales de notificación |
| [Auditoría de jobs](../../../docs/AdminLuxuryApp/Jobs/20260812-auditoria-admin-jobs-results.md) | El módulo agrega jobs nuevos al catálogo de Hangfire |
| [Validación de remediación de jobs](../../../docs/AdminLuxuryApp/Jobs/20260812-auditoria-admin-jobs-validacion.md) | Criterios ya aplicados a los jobs existentes |

### Documentación del motor actual (a actualizar, no a mover)

`api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/README.md` líneas 9 y 65-66
describen RecurringTasks en dos renglones. Si el plan reubica la capa de aplicación fuera de
`ReclutamientoLuxuryApp`, ese README debe actualizarse. **Tarea del plan, no de esta carpeta.**

### No confundir con el otro sistema de tareas

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/` es un **sistema distinto**: tareas
operativas con grupos de trabajo, seguimiento y tickets legales (9 submódulos con README propio).
No se toca en este refactor.
