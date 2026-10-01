# Orquestación de implementación — Alertas de Tareas Recurrentes

**Fecha:** 2026-08-20 · **Protocolo:** `AGENTS.md` §Protocolo de Orquestación
**Plan base:** `docs/modulos-existente/alertas-tareas-recurrentes/04-implementation-plan.md`
**Análisis de flujos:** `06-analisis-flujos-simplificacion.md` (consolidado con `06b` de Kilo)

---

## 1. Cómo funciona este protocolo

| Rol | Quién | Qué hace |
| --- | --- | --- |
| **Arquitecto / Auditor** | El agente de análisis (esta sesión) | Diseña, redacta los prompts, **audita** el resultado. No escribe el código final |
| **Ejecutor** | Agente CLI local (Claude Code, Aider, Cline) | Escribe el código de **un ticket a la vez** y reporta al terminar |
| **Coordinador** | El dueño del módulo | Copia el prompt al CLI, trae de vuelta el reporte, aprueba el avance |

**Ciclo por ticket:**

```text
Arquitecto genera el prompt  →  Coordinador lo pega en el CLI  →  CLI ejecuta y reporta
        ↑                                                                    │
        └──────────  Arquitecto audita el diff y el reporte  ←───────────────┘
                     ✅ aprueba → siguiente ticket
                     ❌ rechaza → prompt de corrección
```

**Regla de oro:** un ticket abierto a la vez. No se genera el prompt del siguiente hasta que el
anterior pase la auditoría. Los prompts se redactan **al momento**, no por adelantado: cada uno
incorpora lo aprendido en la auditoría del anterior.

### Qué debe reportar el CLI al terminar (obligatorio)

Sin este reporte no hay auditoría, y sin auditoría no hay siguiente ticket:

1. **Archivos tocados**, con ruta y una línea de qué cambió en cada uno
2. **Salida literal** de los comandos de verificación que el ticket pidió correr
3. **Decisiones que tomó por su cuenta** y por qué (todo lo que el prompt no especificaba)
4. **Lo que NO hizo** del ticket, y el motivo
5. **Riesgos que detectó** y no estaban en el prompt

### Cómo audita el Arquitecto

Nunca sobre el reporte solo. Cada auditoría corre `git diff`, lee el código resultante y ejecuta
los mismos comandos de verificación por su cuenta. El reporte dice qué buscar; el código dice qué
pasó. Ver el detalle de cada auditoría en la bitácora (§7).

---

## 2. Tablero de tickets

| Ticket | Contenido | Fase | Tamaño | Depende de | Estado |
| --- | --- | :-: | :-: | --- | :-: |
| **T-01** | Verificación, apagado del motor legado y monitoreo de corrida | F0 | S | — | ✅ Aprobado con corrección |
| **T-01b** | Corrección: el job legado **revive en cada arranque** | F0 | XS | T-01 | ✅ Aprobado |
| **T-02** | `Critical` en `PriorityLevel` + corregir los 3 consumidores rotos | F1 | S | T-01b | ✅ Aprobado |
| **T-03** | Extender `RecurringTaskTemplate` + migración (sólo esquema, sin lógica) | F1 | M | T-02 | ✅ Aprobado con excepción justificada |
| **T-04** | Servicio de catálogo + validaciones + endpoints | F1 | M | T-03 | ✅ Aprobado con corrección |
| **T-04b** | Corrección: `POST` no debe devolver HTTP 400 en errores de negocio | F1 | XS | T-04 | ✅ Aprobado |
| **T-05** | Ampliar `recurrence-input`: varios días del mes, último día del mes (rangos/presets fuera de alcance) | F1 | M | T-03 | ✅ Aprobado |
| **T-06** | Pantalla única de catálogo (lista + formulario, sin cablear routing) | F1 | M | T-04, T-05 | ✅ Aprobado con corrección |
| **T-06b** | Corrección: ruta equivocada del select de criticidad (`select-items` → `select-item-enum`) | F1 | XS | T-06 | ✅ Aprobado |
| **T-07** | Campos e índices en `Tasks` | F2 | S | T-03 | ✅ Aprobado, sin corrección — el nombre físico real es `Task` |
| **T-07b** | ~~Corrección: nombre de tabla `Task` → `Tasks`~~ | F2 | XS | T-07 | ❌ **Descartado** — la premisa era incorrecta |
| **T-07c** | Regenerar las migraciones de T-03 y T-07, eliminadas en la reversión de BD | F1/F2 | S | T-03, T-07 (entidades) | ✅ Aprobado |
| **T-08** | Generador único reescrito | F2 | L | T-04, T-07 | ✅ Aprobado |
| **T-08b** | Corrección: fecha inyectada que la RRULE no autoriza | F2 | XS | T-08 | ✅ Aprobado |
| **T-09** | Entidad `TaskAlertLog` + migración (sólo esquema) | F3 | S | T-08 | ✅ Aprobado |
| **T-08c** | Corrección: horizonte de generación por plantilla, no fijo | F2 | S | T-08, T-09 | ✅ Aprobado |
| **T-09b** | Motor de alertas: lógica (aviso previo, recordatorio, vencida) | F3 | L | T-08c, T-09 | 🟡 Aprobado con corrección |
| **T-09c** | Corrección: bitácora registra canal fijo, no el real | F3 | S | T-09b | ✅ Aprobado |
| **T-10** | Agrupación por destinatario y tope de alertas | F3 | M | T-09c | ✅ Aprobado |
| **T-11** | Escalera de incumplimiento y arrastre (sin nivel "jefe", D-11 no listo) | F4 | M | T-10 | ✅ Aprobado |
| **T-12** | Justificación con aprobación del jefe — retomada como **D11-04** en `20260821-d11-organigrama-roles-orquestacion.md` | F4 | M | T-11, D11-02 | ⏸️ D-11 completo (a-b, 02, 03) — D11-04 listo para arrancar |
| **T-13** | Reapuntar `TaskAttachment`, checklist y cierre endurecido — desglosado en 13a-13e por tamaño (mismo criterio que T-03/T-04, T-07/T-08, T-09/T-09b) | F5 | M | T-07 | ✅ Aprobado |
| **T-13a** | Esquema: reapuntar `TaskAttachment` a `Tasks`/`RecurringTaskTemplate` + crear `TaskChecklistItem` (sin lógica) | F5 | S | T-07 | ✅ Aprobado |
| **T-13b** | Servicio + endpoints de checklist (CRUD de pasos dentro de una tarea) | F5 | S | T-13a | ✅ Aprobado |
| **T-13c** | Cierre endurecido: `CloseTaskAsync` valida checklist completo + comprobante si `RequiresAttachment` | F5 | S | T-13a, T-13b | ✅ Aprobado |
| **T-13d** | Backend: endpoints de subida/consulta/borrado de `TaskAttachment` (comprobante) — sin esto T-13c nunca es alcanzable en la práctica | F5 | S | T-13a, T-13c | ✅ Aprobado |
| **T-13e** | Frontend: `task-checklist-panel` + subida de comprobante en detalle de tarea | F5 | M | T-13b, T-13d | ✅ Aprobado |
| **T-14** | Tablero de cumplimiento — desglosado en 14a (backend) / 14b (frontend); **sin** el digest "por jefe" (bloqueado por D-11/`OrgHierarchy`, mismo motivo que T-11 omitió el nivel "jefe") | F6 | M | T-09b, T-13 | ✅ Aprobado |
| **T-14a** | Backend: consultas y conteos del tablero (por grupo/área/persona, K5 comprobante en críticas) | F6 | M | T-09b, T-11, T-13 | ✅ Aprobado |
| **T-14b** | Frontend: pantalla del tablero de cumplimiento | F6 | M | T-14a | ✅ Aprobado |
| **T-15** | Retiro del motor viejo | F7 | S | T-08, T-13 | ⏸️ |
| **T-16** | WhatsApp: dispatcher, plantillas por tipo y webhook de entrega | F8 | M | T-09b | ⏸️ **Bloqueado externamente** — ver `20260821-whatsapp-plantillas-especificacion.md` |
| **T-17** | Conectar a routing el catálogo de plantillas (T-06), inalcanzable desde el menú desde que se construyó — entrada en `/admin` (`admin.routes.ts`, tile en `admin-modules.ts`, whitelist) | F1 | XS | T-06 | ✅ Aprobado |
| **T-18** | 🔴 **Crítico** — retirar el job parche `RecurringTaskSchedulerJob` (genera `Tasks` sin `CustomerId`, activo en producción desde T-03) y registrar en Hangfire los 3 servicios reales del motor nuevo (`RecurringTaskGenerationService`, `TaskAlertEngineService`, `TaskEscalationService`), que nunca se ejecutan | F7 | M | T-08, T-09b, T-11 | ✅ Aprobado — ejecutado directamente, no por el flujo Kilo Code |

**Ruta crítica:** T-01 → T-02 → T-03 → T-04 → T-08 → T-09. T-05, T-07 y T-13 pueden ir en
paralelo si hay más de un ejecutor.

**Nota sobre T-09:** se dividió en esquema (T-09) y lógica (T-09b), mismo patrón que
T-03/T-04 y T-07/T-08 — cada migración se audita mejor sola.

**Nota sobre T-08c:** al diseñar T-09b se detectó una grieta entre dos tickets ya aprobados —
`TaskAlertLog.TasksId` (T-09) es obligatoria, pero T-08 genera con horizonte fijo de 7 días
mientras `AdvanceNoticeDays` permite hasta 30. Una plantilla con aviso previo largo no tendría
tarea contra la cual registrar el aviso. El propio plan ya lo anticipaba (`RT-01`:
"Horizonte ≥ 35 días **y** aviso calculado desde la plantilla") — T-08 sólo implementó la segunda
mitad. T-08c corrige el horizonte a `Math.Max(7, template.AdvanceNoticeDays)` por plantilla, sin
reabrir el esquema de T-09.

**Nota sobre T-04b:** corrigió un defecto real de contrato HTTP en el `POST`, con origen en mi propio prompt de T-04.

**Nota sobre T-03:** el plan ya separaba esquema (T-03) de lógica de negocio (T-04) desde su
diseño original. No hizo falta partirlo más: es la unidad de auditoría correcta tal como está.

---

## 3. Comandos de verificación reales

`AGENTS.md` menciona `npm run audit:...`, pero **no existe un `package.json` en la raíz**. Los
comandos reales son:

| Qué verifica | Comando | Dónde se corre |
| --- | --- | --- |
| Convenciones del repo | `node scripts/audit-conventions.mjs` | Raíz |
| Reglas en archivos de agentes | `node scripts/check-agent-rules.mjs` | Raíz |
| Codificación rota | `node scripts/scan-mojibake.mjs <ruta>` | Raíz |
| Endpoints hardcodeados | `node scripts/scan-hardcoded-endpoints.mjs` | Raíz |
| Tokens de diseño | `npm run audit:tokens` | `client/angular` |
| Fronteras de UI | `npm run audit:ui` | `client/angular` |
| Sistema de diseño | `npm run audit:design-conventions` | `client/angular` |
| Compilación backend | `dotnet build api/LuxuryApp.sln` | Raíz |

> ⚠️ `audit-conventions.mjs` hoy reporta **10 errores pre-existentes** ajenos a este módulo
> (skills `luxuryapp-core` fuera de sincronía y 2 referencias fantasma). El criterio de cada
> ticket es **no aumentar** ese número, no llegar a cero.

> ⚠️ `scan-mojibake.mjs` **no cubre `.md`**. `scripts/scan-mojibake.mjs:147` define
> `exts = ['.ts', '.html', '.scss', '.cs', '.json', '.js', '.mjs', '.resx']`. Correrlo sobre una
> carpeta que sólo tiene markdown reporta "Archivos: 0" y un ✓ que no verificó nada. Descubierto
> en la auditoría de T-01b (detalle en §7). Si un ticket toca `.md`, no hay verificación
> automática de mojibake para eso — se revisa a mano.

---

## 4. Prompts entregados

| Ticket | Archivo para copiar |
| --- | --- |
| T-01 | [`../../../docs/OperationsLuxuryApp/Tasks/20260820-prompt-operations-tasks-T-01-verificacion-y-monitoreo.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260820-prompt-operations-tasks-T-01-verificacion-y-monitoreo.md) |
| T-04 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-04-servicio-catalogo.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-04-servicio-catalogo.md) |
| T-04b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-04b-correccion-status-post.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-04b-correccion-status-post.md) |
| T-07 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07-campos-indices-tasks.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07-campos-indices-tasks.md) |
| T-07b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07b-correccion-nombre-tabla.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07b-correccion-nombre-tabla.md) — **no enviado, descartado** |
| T-07c | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07c-regenerar-migraciones.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-07c-regenerar-migraciones.md) |
| T-08 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08-generador-unico.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08-generador-unico.md) |
| T-08b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08b-correccion-fecha-inyectada.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08b-correccion-fecha-inyectada.md) |
| T-09 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09-taskalertlog-esquema.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09-taskalertlog-esquema.md) |
| T-08c | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08c-horizonte-por-plantilla.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-08c-horizonte-por-plantilla.md) |
| T-09b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09b-motor-alertas.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09b-motor-alertas.md) |
| T-09c | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09c-correccion-canal-bitacora.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-09c-correccion-canal-bitacora.md) |
| T-10 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-10-agrupacion-tope-alertas.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-10-agrupacion-tope-alertas.md) |
| T-11 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-11-escalera-incumplimiento-arrastre.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-11-escalera-incumplimiento-arrastre.md) |
| T-05 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-05-recurrence-input-varios-dias.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-05-recurrence-input-varios-dias.md) |
| T-06 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-06-pantalla-catalogo.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-06-pantalla-catalogo.md) |
| T-01b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-01b-correccion-apagado-job.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-01b-correccion-apagado-job.md) |
| T-02 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-02-critical-priority-level.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-02-critical-priority-level.md) |
| T-03 | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-03-extender-recurring-task-template.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-03-extender-recurring-task-template.md) |
| T-06b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-06b-fix-ruta-criticidad.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-06b-fix-ruta-criticidad.md) |
| T-13a | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13a-esquema-checklist-y-reapunte-adjuntos.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13a-esquema-checklist-y-reapunte-adjuntos.md) |
| T-13b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13b-servicio-endpoints-checklist.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13b-servicio-endpoints-checklist.md) |
| T-13c | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13c-cierre-endurecido.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13c-cierre-endurecido.md) |
| T-13d | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13d-endpoints-comprobante.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13d-endpoints-comprobante.md) |
| T-13d (corrección) | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13d-fix-orden-borrado-transaccional.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13d-fix-orden-borrado-transaccional.md) |
| T-13e | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13e-panel-checklist-comprobante.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13e-panel-checklist-comprobante.md) |
| T-14a | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-14a-backend-tablero-cumplimiento.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-14a-backend-tablero-cumplimiento.md) |
| T-14b | [`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-14b-frontend-tablero-cumplimiento.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-14b-frontend-tablero-cumplimiento.md) |
| T-17 | [`../../../docs/OperationsLuxuryApp/Tasks/20260824-prompt-operations-tasks-T-17-conectar-catalogo-tareas-recurrentes.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260824-prompt-operations-tasks-T-17-conectar-catalogo-tareas-recurrentes.md) |
| T-18 | [`../../../docs/OperationsLuxuryApp/Tasks/20260824-prompt-operations-tasks-T-18-registrar-motor-nuevo-hangfire.md`](./../../../docs/OperationsLuxuryApp/Tasks/20260824-prompt-operations-tasks-T-18-registrar-motor-nuevo-hangfire.md) |

Cada archivo contiene **sólo el prompt de ese ticket**, sin el tablero ni la auditoría. Se entrega
tal cual al agente ejecutor — nunca este documento de orquestación completo, que incluye los 16
tickets y tentaría a hacer más de uno a la vez.

---

## 5. Lo que ningún ticket resuelve todavía

- Los conteos de producción del bloqueador B4/B6 **los corre el equipo**, no el agente. T-15
  (retiro del motor viejo) depende de ellos.
- El bloqueador B5 (10 errores pre-existentes de `audit-conventions.mjs`) es deuda del repo, no
  de este módulo, y no se arregla en ningún ticket de esta orquestación.
- El apagado **definitivo** del job legado requiere código (retirar su entrada de
  `HangfireJobCatalog.cs` y su `case` en `Schedule`); eso es T-15, no T-01/T-01b.
- T-16 (WhatsApp) necesita 6 plantillas de Twilio Content Template nuevas, una por
  `TaskAlertType`, que no existen — las 4 aprobadas hoy (`IWhatsAppService`) son específicas del
  módulo Legal. Alta y aprobación en la consola de Twilio/WhatsApp Business **las corre el
  equipo**, no el agente. Especificación de contenido y variables lista para entregar:
  `docs/plans/20260821-whatsapp-plantillas-especificacion.md`. En cuanto haya Content SID, T-16
  se retoma como ticket de código normal.
- T-12 (justificación con aprobación del jefe) depende de resolver "el jefe" vía `OrgHierarchy`,
  que sigue anclada a `WorkPosition` (D-11, refactor a roles, no ha aterrizado) — mismo motivo
  por el que T-11 omitió el nivel "día 1: jefe" de la escalera. El 2026-08-21 se decidió atacar
  D-11 directamente (ver `docs/plans/20260821-d11-organigrama-roles-orquestacion.md`); T-12 se
  retoma ahí como D11-04 en cuanto D11-02 esté aprobado.

---

## 6. Riesgos señalados por el ejecutor, pendientes de un ticket futuro

| Riesgo | De qué ticket salió | A qué ticket futuro pertenece |
| --- | --- | --- |
| Frontend hardcodea Alta/Baja como únicas opciones visibles de prioridad | T-02 | T-06 (pantalla única de catálogo) |

---

## 7. Bitácora de tickets

| Ticket | Enviado | Reportado | Auditoría | Notas |
| --- | --- | --- | --- | --- |
| T-01 | 2026-08-20 | 2026-08-21 | ✅ **Aprobado con corrección** | 8/8 puntos verificados de forma independiente. Detectó un error de mi prompt (ver detalle abajo). Corrección en T-01b |
| T-01b | 2026-08-21 | 2026-08-21 | ✅ **Aprobado** | Citas de línea exactas, alcance respetado. El comando de verificación que le pedí correr era inútil: ver hallazgo del scanner en §3 |
| T-02 | 2026-08-21 | 2026-08-21 | ✅ **Aprobado** | 5/5 archivos verificados por diff, compilación y búsqueda de consumidores confirmadas de forma independiente |
| T-03 | 2026-08-21 | 2026-08-21 | ✅ **Aprobado con excepción justificada** | Migración bien construida, incluyendo una conversión de datos correcta que no le pedí. Un archivo fuera del alcance declarado del prompt, por una razón válida: ver detalle |
| T-04 | 2026-08-21 | 2026-08-21 | ✅ **Aprobado con corrección** | 12/13 puntos verificados de forma independiente, incluida una prueba empírica de la librería RRULE. 1 hallazgo real con origen en mi prompt: corrección en T-04b |
| T-04b | 2026-08-21 | 2026-08-21 | ✅ **Aprobado** | Cambio de una línea, exactamente el pedido. Resto del archivo idéntico |
| T-07 | 2026-08-21 | 2026-08-21 | 🟠 **Bloqueado** | Campos e índices correctos; la migración generada apunta a una tabla `Task` que no existe. Corrección en T-07b |
| T-07b | 2026-08-21 | — | ⏸️ **Pausado — diagnóstico contradicho por evidencia real** | Ver detalle abajo |

### Reversión de diagnóstico — T-07 / T-07b (2026-08-21)

El dueño del módulo aplicó las migraciones acumuladas contra una base de datos real y reportó que
**corrieron sin ningún error**, incluida la de T-07 que apunta a `table: "Task"` (singular).

**Esto contradice directamente la conclusión de la auditoría de T-07.** Un `AddColumn`/`CreateIndex`
no puede tener éxito contra una tabla que no existe — si corrió limpio, `"Task"` es algo real y
consultable en esa base. La evidencia estática que sostenía la conclusión anterior (ningún otro
`[Table("Task")]` en el repo, ninguna migración `CreateTable` rastreable, forma anómala en el
snapshot, sin Fluent API que sobreescriba) sigue siendo cierta como observaciones de código, pero
el argumento adicional — "servicios activos consultan `dbContext.Tasks` sin fallos reportados" —
se apoyaba en lectura estática, nunca en ejecución real contra esta base en esta sesión, y quedó
insuficiente frente al resultado real.

**No se conoce el mecanismo exacto** (posible sinónimo de base de datos, un baseline distinto al
asumido, u otra causa no identificada). No se inventa una explicación sin evidencia.

**Resolución (2026-08-21):** el dueño del módulo confirmó que el nombre físico real de la tabla
**es `Task`** (singular). La entidad declara `[Table("Tasks")]`.

**Explicación más probable, no verificada por acceso directo a la base:** existe un **sinónimo de
SQL Server** llamado `Tasks` que apunta a la tabla real `Task`. Esto reconcilia ambos hechos
observados sin contradicción:

- Las consultas de EF Core contra `dbContext.Tasks` (que generan SQL sobre `"Tasks"`) funcionan
  porque el sinónimo redirige de forma transparente a la tabla real — por eso ningún servicio
  activo del sistema falla.
- **`ALTER TABLE` no puede ejecutarse a través de un sinónimo en SQL Server** — debe apuntar al
  objeto físico real. Por eso la migración original de T-07 (`table: "Task"`) aplicó sin error: ya
  apuntaba al nombre correcto. La corrección que yo había propuesto (cambiar a `"Tasks"`) casi
  con certeza habría **fallado** al aplicarse, por la misma razón.

**Decisión: T-07 queda aprobado tal como se generó originalmente, sin ninguna modificación.**
T-07b se descarta por completo — su premisa (que `"Task"` era un error) quedó refutada por
evidencia real de un entorno donde la migración corrió limpia.

**Error de origen, documentado para no repetirlo:** la conclusión inicial se apoyó sólo en lectura
de código — atributos `[Table]`, ausencia de `CreateTable` en el historial de migraciones, y
lectura estática de servicios — sin considerar que puede existir una capa de indirección a nivel
de base de datos (sinónimos, vistas) que ningún archivo del repositorio refleja. **Regla para
tickets futuros que generen migraciones sobre entidades no tocadas recientemente por EF:** el
código puede confirmar consistencia interna, pero no sustituye una verificación contra el
esquema físico real cuando el resultado es sorprendente o el historial de migraciones tiene
huecos (como la ausencia total de un `CreateTable` para esta entidad).

### Hallazgo adicional: el mecanismo real (2026-08-21)

La causa de que la migración de T-07 se aplicara sin que nadie ejecutara `dotnet ef database
update` manualmente: `api/LuxuryApp.Api/Program.cs` corre
`await dbContext.Database.MigrateAsync()` **en cada arranque de la API**, auto-aplicando
cualquier migración pendiente. No hizo falta un sinónimo ni ningún mecanismo exótico — bastó con
levantar la aplicación localmente una vez. El dueño del módulo ya comentó ese bloque en
`Program.cs` como medida de protección mientras se sigue iterando el esquema del módulo; no se
toca en ningún ticket de esta orquestación salvo que él lo pida explícitamente.

**Consecuencia práctica para el resto de la orquestación:** mientras el auto-migrate esté
comentado, generar una migración es seguro — no se aplica sola. Si en algún punto se reactiva,
cualquier migración pendiente en la carpeta se aplicará en el siguiente arranque de cualquiera
que levante la API, sin aviso previo.

**Estado tras la reversión:** el dueño del módulo eliminó las dos migraciones generadas
(`RecurringTaskTemplateAlertsFields` de T-03 y `TasksAlertFieldsAndIndices` de T-07) junto con su
efecto en el snapshot, y revirtió la base de datos. **Las entidades en C# no se tocaron** —
siguen teniendo todos los campos e índices de ambos tickets. T-07c regenera únicamente los
archivos de migración, sin volver a auditar las entidades (ya aprobadas).

### Detalle — Auditoría T-07c

Ambas migraciones regeneradas coinciden con las versiones ya aprobadas de T-03 y T-07, verificado
leyendo los archivos en disco completos, no sólo lo pegado en el reporte. `Task` (singular) se
conserva en la de `Tasks`. Ningún `DropColumn` de columnas legadas en ninguna de las dos.

**Mejora respecto a la versión original, no un defecto:** `RecurrenceRule` y `RequiresAttachment`
se agregan directamente `NOT NULL` con `defaultValue`, evitando el paso intermedio de
`AlterColumn` que tenía la versión anterior — válido, SQL Server rellena las filas existentes con
el valor por omisión al agregar la columna.

**Hallazgo menor, no bloqueante:** el backfill de `RecurrenceRule` usa
`COALESCE(NULLIF(Interval, 0), 1)`, que sólo protege contra `Interval = 0`. La versión original
usaba `WHEN Interval < 1 THEN 1 ELSE Interval`, que también protegía contra valores negativos. Un
`Interval` negativo preexistente produciría una RRULE inválida (`FREQ=DAILY;INTERVAL=-5`). Riesgo
de alcance muy estrecho: la aplicación nunca permitió escribir un valor así (`[Range(1,365)]` a
nivel API antes de que T-03 retirara esas columnas del modelo), la tabla origen está confirmada
sin uso (B7), y cualquier edición futura desde el catálogo de T-04 rechazaría el valor. No amerita
ticket de corrección.

**El reporte de que EF mezcló ambas migraciones al generarlas y hubo que separarlas a mano** es
consistente con lo verificado: los archivos finales están correctamente separados, sin
contaminación cruzada entre las dos entidades.

### Detalle — Auditoría T-01

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | El `.sql` sólo contiene `SELECT` | ✅ | `grep` de `update\|delete\|drop\|insert\|alter\|truncate` → cero. 7 `SELECT` |
| 2 | El aviso llega a una persona | ✅ | `NotifyRunIssuesAsync` se invoca **fuera** del bucle de clientes; resuelve usuarios de `SistemasGeneral` y despacha |
| 3 | WhatsApp fuera de los canales | ✅ | `RunAlertChannels` = InApp, Push, PushWeb |
| 4 | La lógica de generación no cambió | ✅ | El diff sólo agrega contadores; el cálculo de ocurrencias, festivos y creación de instancias intacto |
| 5 | Motor legado intacto | ✅ | `git diff --stat` en `api/`: **un solo archivo** modificado |
| 6 | Sin regresión de convenciones | ✅ | Corrí `audit-conventions.mjs`: sigue en 10 |
| 7 | Sin mojibake | ✅ | Corrí el scanner sobre el archivo tocado: cero. Los 11 BOM están en archivos ajenos (migraciones, `EmployeeDocument`) |
| 8 | Reporte con las 5 secciones | ✅ | Presentes; "lo que no hizo" viene fundido en Decisiones |

**Hallazgo del ejecutor, correcto — mi prompt tenía un error:** afirmaba que el job legado *"se
activa desde base de datos"*. **Es falso.** `HangfireExtensions.RegisterRecurringJobsAsync`
(`HangfireExtensions.cs:34-49`) recorre el arreglo `HangfireJobCatalog.Jobs` y registra **todos**
los jobs en cada arranque, con su cron por omisión en código. Hangfire sólo persiste el registro
resultante.

**Consecuencia que la guía original no advertía:** borrar el job desde el panel de Hangfire es
**temporal**; vuelve solo en el siguiente arranque o despliegue. Es la falsa confianza que este
módulo existe para eliminar. Corregido en T-01b.

**Efecto sobre el plan:** apagar el motor legado de forma permanente **requiere tocar código**, no
configuración. T-15 cambia de forma en consecuencia.

### Detalle — Auditoría T-01b

Corrigió la guía `docs/migraciones/20260820-alertas-apagar-job-legado.md`, distinguiendo apagado
temporal (panel de Hangfire, no sobrevive a un reinicio) de apagado definitivo (código, pertenece
a T-15), con citas exactas: `HangfireExtensions.cs:34-49`, `HangfireJobCatalog.cs:30`,
`HangfireJobCatalog.cs:100-102`. Alcance respetado: no tocó ningún `.cs`.

**Hallazgo de infraestructura, no del ticket:** el comando de verificación que le pedí correr
(`scan-mojibake.mjs docs/migraciones`) no verificaba nada — el scanner no cubre `.md` (ver §3).
El ejecutor reportó el "Archivos: 0" con honestidad; el error fue mío al diseñar el prompt.
Verifiqué el archivo a mano: sin BOM, UTF-8 válido, cero patrones de mojibake.

Consecuencia más amplia: `AGENTS.md` §Nota para Kilo manda correr este scanner antes de commitear
como garantía de cero mojibake, y para documentación esa garantía no existe. Lo demuestra el
propio `AGENTS.md`, que tiene mojibake en el encabezado del Protocolo de Orquestación (se lee
"Orquestaci?n") y en su línea 66, donde `npm` quedó partido — nadie lo detectó porque el scanner
no mira archivos `.md`.

### Detalle — Auditoría T-02

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | `Critical` agregado al final, `High`/`Low` intactos | ✅ | `git diff` de `PriorityLevel.cs`: sólo inserción al final |
| 2 | `SelectItemEnumEndPoints.cs` sin tocar | ✅ | No aparece en `git status` |
| 3 | Toggle bloqueado en críticas, antes de `SaveChangesAsync` | ✅ | Leí el método completo: el `return` de error está antes del `Update`/`SaveChangesAsync` |
| 4 | Orden del tablero: Crítica → Alta → Baja | ✅ | `GetPriorityOrder` con `switch` expression, legible y extensible. Ocurre tras `ToListAsync()` (en memoria), no necesita traducción SQL |
| 5 | Reporte de supervisión incluye críticas | ✅ | `(tm.Priority == High \|\| tm.Priority == Critical)`, expresión LINQ estándar traducible por EF Core |
| 6 | Módulo de tareas recurrentes intacto | ✅ | El único diff en ese archivo es el de T-01, sin cambios nuevos |
| 7 | Sin regresión de convenciones | ✅ | Corrí el script: sigue en 10 |
| 8 | Sin mojibake en los 4 `.cs` tocados | ✅ | Verificado archivo por archivo |
| 9 | Búsqueda exhaustiva de consumidores | ✅ | Repetí el `grep`: 14 archivos totales. Los 8 no corregidos son DTOs de paso, la entidad y el enum — ninguno compara por igualdad. Confirmado inofensivo |

**Riesgo real que el ejecutor señaló, no inventado:** hay frontend que hardcodea Alta/Baja como
únicas opciones de prioridad visibles. No lo verifiqué en este ciclo — queda registrado en §6,
para el ticket de catálogo (T-06), que sí toca Angular.

### Detalle — Auditoría T-07

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | 3 campos nuevos (`BreachedAt`, `LastAlertAt`, `RecurrenceSourceDate`), tipos y nombres correctos | ✅ | Leí `Tasks.cs` completo |
| 2 | Sin `CarriedOverFrom`, sin cambios a `CustomerId`, sin `ITenantEntity` | ✅ | Confirmado |
| 3 | 3 índices con las columnas exactas | ✅ | `[Index(nameof(CustomerId), nameof(Status), nameof(PlannedEndDate))]` y análogos |
| 4 | Servicios/generadores/scheduler sin tocar | ✅ | Sin archivos nuevos fuera de entidad + migración |
| 5 | Migración aditiva (sólo `AddColumn`/`CreateIndex`) | ✅ | Revisé `Up()` completo |
| 6 | Sin regresión de convenciones ni mojibake | ✅ | Verificado |
| 7 | **La migración apunta a una tabla que existe** | ❌ **CRÍTICO** | Ver hallazgo abajo. Bloquea el ticket hasta T-07b |

**Hallazgo: la migración de T-07 apunta a `table: "Task"` (singular); la entidad dice
`[Table("Tasks")]` (plural).** Esto **no lo causó T-07**: rastreado hasta el commit base del
repositorio (antes de T-01), el `ApplicationDbContextModelSnapshot.cs` ya tenía
`b.ToTable("Task", (string)null);` para esta entidad. Era un error latente en los metadatos de
migración, invisible porque nadie había vuelto a generar una migración sobre `Tasks` hasta este
ticket — T-07 fue el primero en exponerlo, no el que lo introdujo.

Evidencia de que `Tasks` (plural) es el nombre real, sin acceso a base de datos: (1) ningún otro
`[Table("Task")]` singular en todo el repo; (2) no existe ninguna migración `CreateTable` para
esta entidad en todo el historial — la tabla se creó fuera de EF Core; (3) es la única entidad de
~200 en el snapshot con la forma `ToTable("Task", (string)null)` — sus 17 hermanas del mismo
módulo usan la forma simple con el nombre plural; (4) sin Fluent API que la sobreescriba; (5)
decenas de servicios activos consultan `dbContext.Tasks` en producción sin fallos reportados —
si la tabla real fuera `"Task"`, esas consultas fallarían siempre.

**Por qué nadie lo había visto:** es un problema de metadatos de migración, no de compilación.
Ningún `dotnet build` lo detecta. Sólo sale a la luz al generar una migración nueva sobre la
entidad, o al intentar aplicar las migraciones acumuladas contra una base de datos real — donde
habría fallado en el peor momento posible, al desplegar.

**No se aprueba T-07 hasta que T-07b corrija esto.** El ticket en sí —campos e índices— está bien
hecho; el bloqueo es exclusivamente sobre el nombre de tabla en la migración generada.

### Detalle — Auditoría T-13a

Leí `TaskAttachment.cs` y `TaskChecklistItem.cs` completos: el reapunte y la entidad nueva
coinciden exactamente con el ER del plan y con el prompt. Revisé la migración
(`20260821210108_TaskChecklistItemAndAttachmentRepoint.cs`) línea por línea: usa
`principalTable: "Task"` (singular) para la FK a la tabla de tareas — no es un error, es
consistente con el hallazgo ya verificado y cerrado en la auditoría de T-07/T-07b (el nombre
físico real de la tabla es `Task`, no `Tasks`).

Encontré una decisión propia del ejecutor, no pedida en el prompt pero necesaria y bien explicada:
`TaskInstance.Attachments` (colección legacy) hubiera hecho que EF Core recreara una FK sombra
`TaskInstanceId` al generar la migración, porque ese lado de la relación seguía declarado aunque
`TaskAttachment` ya no tuviera la navegación de vuelta. Lo resolvió con
`modelBuilder.Entity<TaskInstance>().Ignore(x => x.Attachments)` en `ApplicationDbContext.cs:981`,
sin tocar `TaskInstance.cs` (respeta "no toques TaskInstance" del prompt) y con comentario
explicando el porqué.

Confirmé que `CloseTaskAsync` (`TaskAppService.cs:875`) no fue tocada — cero referencias a
`TaskChecklistItem` o `RequiresAttachment` ahí; no se adelantó a T-13c.

**Verificación independiente:** `dotnet build api/LuxuryApp.sln` → 0 errores. No se aplicó la
migración a una BD (correcto, es la práctica ya establecida en esta orquestación: migración lista,
aplicación es decisión separada del equipo).

**Veredicto: ✅ Aprobado.** Sigue T-13b (servicio + endpoints CRUD de checklist).

### Detalle — Auditoría T-13b

Leí los 6 archivos nuevos completos (DTOs, interfaz, servicio, mapper, endpoints) más el registro
en `DependencyInjection.Controllers.cs` y el test. Todo coincide exactamente con el prompt:
`ValidateTaskAccess`/`ValidateTaskAccessAsync` reutilizan el mismo patrón `CanManageAnyCustomer()`
+ comparación de `CustomerId` que T-04; `ToggleDoneAsync` es un alternador simétrico real
(verificado en el código, no sólo en el test); `AddAsync`/`DeleteAsync`/`GetByTaskIdAsync` validan
acceso antes de tocar datos; endpoints sin restricción de rol, tal como se pidió.

Los 3 tests en `TaskChecklistAppServiceTests.cs` usan `ApplicationDbContext` en memoria real (no
todo mockeado) y cubren exactamente lo que importaba: alta con estado inicial correcto,
reversibilidad del toggle en ambos sentidos (incluye verificar que `DoneByUserId`/`DoneAt` se
limpian al des-marcar), y rechazo 403 cuando la tarea es de otro cliente.

**Verificación independiente:** `dotnet build` → 0 errores. `dotnet test --filter
TaskChecklistAppServiceTests` → **3/3 pasan**, igual que lo reportado.

**Veredicto: ✅ Aprobado.** Sigue T-13c (cierre endurecido en `CloseTaskAsync`).

### Detalle — Auditoría T-13c

Leí `CloseTaskAsync` completo tras el cambio: las dos validaciones quedaron exactamente donde
indicaba el prompt (después del check de `closedByUser`, antes de `TicketDirectory(...)` y de
cualquier mutación de `entity`), con `return` temprano igual que el resto del método. La condición
de comprobante usa `RecurringTemplateId`/`RequiresAttachment`, no `Priority == Critical` —
correcto conforme a la regla final de `RN-ALT-034`.

Los 4 tests nuevos en `TaskAppServiceTests.cs` son sólidos: además de verificar
`result.Success`/mensaje, verifican el `Status` realmente persistido en el `DbContext` después de
la llamada — confirman que un cierre rechazado no deja la tarea a medio mutar. Cubren exactamente
los 4 casos pedidos (checklist pendiente, comprobante faltante, caso feliz, tarea manual sin
plantilla). Confirmé por mi cuenta que `CloseTaskAsync` sólo se invoca desde `TasksEndpoints.cs` —
no hay job ni proceso automático que dependiera del comportamiento anterior.

**Verificación independiente:** `dotnet build` → 0 errores. `dotnet test --filter
TaskAppServiceTests.CloseTaskAsync` → **4/4 pasan**, igual que lo reportado.

**Veredicto: ✅ Aprobado.** Sigue T-13d (frontend: panel de checklist + comprobante).

### Detalle — Auditoría T-13d

Leí los 4 archivos nuevos completos más el registro DI. Todo coincide con el prompt y en varios
puntos lo supera: `RecurringTemplateId` correctamente resuelto de `access.Task`, nunca del DTO;
la decisión propia del ejecutor de usar `SaveOrigExt` en vez de `SaveAsync` para imágenes es
correcta y bien fundamentada — verifiqué directamente en `SecureFileStorageService.cs:243-258`
que `SaveAsync` fuerza la extensión `.pdf` sin importar el contenido real, algo que mi propio
prompt no advirtió (cité `CustomDocumentAppService.AddAsync` como referencia sin notar que ese
archivo sólo maneja PDFs). El renombre a `TaskAttachmentFileDTO` por colisión con un
`TaskAttachmentDTO` legacy también está bien resuelto y declarado.

Los 6 tests usan `SecureFileStorageService` + `LocalFileProvider` **reales** contra un directorio
temporal (no mockean el almacenamiento) — verifican escritura y borrado físico de archivo real.
El test 6 es la verificación de punta a punta que pedí: sube un adjunto real y confirma que
`CloseTaskAsync` (T-13c) deja de bloquear el cierre.

**Encontré un problema real en `DeleteAsync`** (línea 84-90): borra el archivo físico **antes**
de `transaction.CommitAsync()`, al revés del orden de la referencia
`CustomDocumentAppService.DeleteAsync` que el propio prompt pedía seguir. Si `CommitAsync()`
fallara después de que `SaveChangesAsync()` ya encoló el `DELETE` (caso raro pero real: caída de
conexión, timeout de commit), la transacción se revierte pero el archivo físico ya se borró —
queda un registro de `TaskAttachment` en BD apuntando a un archivo inexistente, que además
seguiría contando como comprobante válido para la validación de T-13c (`AnyAsync` sólo verifica
que el registro exista, no que el archivo exista). Es un caso límite, no un bug que dispare en el
camino feliz, pero socava exactamente la garantía que T-13c existe para dar. Envío corrección:
`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-13d-fix-orden-borrado-transaccional.md` — invertir el orden, `CommitAsync()` antes de
`DeleteFile(...)`.

**Verificación independiente:** `dotnet build` → 0 errores. `dotnet test --filter
TaskAttachmentAppServiceTests` → **6/6 pasan**, igual que lo reportado.

**Veredicto: 🟡 Aprobado con corrección.** El resto (subida, listado, validación MIME, permisos,
resolución server-side de `RecurringTemplateId`) está bien hecho, no requiere cambios.

**Corrección verificada (T-13d-fix):** confirmé línea por línea que `DeleteAsync` ahora hace
`SaveChangesAsync()` → `CommitAsync()` → `DeleteFile(...)`, en ese orden. También confirmé, a
pedido explícito del usuario antes del reporte de esta corrección: `CreatedByName` resuelve al
usuario que subió el adjunto (`CreatedBy = currentUserService.UserId` en `UploadAsync`), no al
creador de la tarea; y el binding `[FromForm] TaskAttachmentUploadDTO` sigue exactamente la misma
forma de `record` que `TelefonosEmergenciaAddOrEditDTO`/`CustomerImageAddDTO`, endpoints
multipart ya en producción en este mismo repo (aunque, como ellos, sin test de integración HTTP
real — brecha preexistente del proyecto, no de este ticket). No se agregó test de fallo de
`CommitAsync`; motivo aceptado: EF InMemory no tiene semántica transaccional real que permita
simularlo con fidelidad.

`dotnet build` → 0 errores. `dotnet test --filter TaskAttachmentAppServiceTests` → **6/6 pasan**.

**Veredicto final: ✅ Aprobado. T-13d cerrado por completo.**

### Detalle — Auditoría T-13e

Leí `task-checklist-panel.ts`/`.html`/`.spec.ts`, la integración en `task-view.ts`/`.html`, el
bloque de endpoints nuevo y las dos interfaces. Todo coincide exactamente con el prompt:
- Panel insertado entre "Actions" y "Timeline" en `task-view.html:184`, exactamente donde pedí.
- `iw-button-view-pdf` usado con `[fileName]` (verifiqué contra `button-view-pdf.ts` que ese es
  el `@Input` real) — no replicó el binding `[pdf]` incorrecto que señalé como error preexistente
  a no copiar.
- `FormData` construido con las claves exactas `TasksId`/`File`, verificado también por un test
  que lee `formData.get("TasksId")`/`formData.get("File")` directamente.
- `onToggleDone` actualiza sólo el item local con la respuesta del PATCH, sin recargar toda la
  lista — igual que pedí.
- No duplicó validación de cierre en el frontend; no tocó `task-form.ts`/`task-close.ts`.

Los 6 tests son genuinos: cubren carga paralela, alta, toggle, borrado (checklist y adjunto),
subida multipart con verificación de las claves del `FormData`, y — el más valioso — renderizado
real verificando `pdfButton.url()`/`pdfButton.fileName()` del componente `iw-button-view-pdf`
efectivamente instanciado, más el `src`/`alt` del `<img>` para el caso no-PDF.

**Verificación independiente:** `vitest run` (config aislada `vitest.cobranza-nativa.config.ts`)
→ 1 archivo, **6/6 pasan**. `scan-mojibake.mjs` sobre los 8 archivos tocados → 0 mojibake.

**Veredicto: ✅ Aprobado.** Con esto cierra T-13 completo (a–e).

### Detalle — Auditoría T-14a

Leí el servicio, los DTOs y el endpoint completos. Verifiqué el criterio de "vencida" línea por
línea contra `TaskEscalationService.cs:33` y `TaskAlertEngineService.cs:18` — coincide exactamente
(`PlannedEndDate < now`, `ClosedDate == null`, `Status != Cancelled`), no es un criterio inventado.
Verifiqué el riesgo que el propio ejecutor señaló (`WorkGroupName`/`CategoryName` idénticos):
confirmé en `WorkGroup.cs` que la entidad no tiene ningún campo de nombre propio — es una
característica real y preexistente del modelo, ya presente desde T-04 en
`RecurringTaskCatalogMapper` (`WorkGroupName` también sale de `WorkGroupCategories.Name` ahí), no
un error nuevo de este ticket.

Permiso: `visibleGroupIds` para no-administradores = grupos donde administra (`WorkGroupMembers.IsAdmin`)
+ grupos donde tiene tareas asignadas — extensión correcta del patrón de
`TaskAppService.cs:483-499`. El test 4 confirma aislamiento real entre dos administradores de
grupos distintos del mismo cliente.

**Verificación independiente:** `dotnet build` → 0 errores. `dotnet test --filter
RecurringTaskComplianceAppServiceTests` → **4/4 pasan**, igual que lo reportado.

**Veredicto: ✅ Aprobado.** Sigue T-14b (frontend: pantalla del tablero).

### Detalle — Auditoría T-14b

Leí el componente, el HTML, el spec, el bloque de endpoints, la interfaz y los tres archivos de
routing tocados. Todo coincide con el prompt: sin acciones de escritura (`[showAdd]="false"`
columna "Grupo" única, K5 calculado en cliente con el caso `N/A` cubierto por un test dedicado.

Encontró y resolvió algo que el prompt no anticipó: `route-whitelist.ts` — un mecanismo de rutas
permitidas que, de no actualizarse, habría dejado la pantalla inaccesible pese a estar bien
construida y bien ruteada en `recurring-tasks.routing.ts`. Buen hallazgo por iniciativa propia,
bien reportado.

Nota menor sin impacto funcional: usa `onGetList<ComplianceDashboardDTO>` para traer un objeto
único en vez de `onGetItem` — ambos métodos son funcionalmente idénticos en
`api-response.service.ts` (misma llamada HTTP, sólo difiere la etiqueta de log), no es un defecto,
no amerita corrección.

**Verificación independiente:** `vitest run` → 1 archivo, **4/4 pasan**. `scan-mojibake.mjs` sobre
8 archivos → 0 mojibake.

**Veredicto: ✅ Aprobado.** T-14 cerrado por completo (a-b).

### Detalle — Auditoría T-06

Leí `recurring-task-catalog-form.ts`/`.html` y `recurring-task-catalog-list.ts`/`.html` completos,
más los dos `.spec.ts`. `git status --short` en `client/angular` confirma que el alcance tocado
coincide exactamente con lo declarado: ninguna pantalla vieja, ni `recurring-tasks.routing.ts`, ni
`pages.routes.ts` tocados.

**Formulario:** filtro `visibility !== "Público"` implementado literal en `loadWorkGroups()`.
Validador cruzado `backupRequiredForCriticalValidator` correcto (a nivel de `FormGroup`, no sólo
del control). `onWorkGroupChange` limpia `backupUserId` al cambiar de grupo — buena adición no
pedida explícitamente. `app-recurrence-input` conectado exactamente como se indicó
(`formControlName`, no `[control]` aislado). `p-panel [toggleable]/[collapsed]` para la sección
(`panel-aprobaciones.ts`, `notifications-gadget.ts`, `notifications-list-web.ts` lo usan igual),
`web-custom-input-datepicker-signal` es el selector real del componente (no una invención).

**Lista:** sigue el patrón exacto de `task-template-list.ts` (vista dual web/mobile,
selector de cliente. `onToggleStatus` usa `onPatch` al endpoint correcto, no hay acción de borrado.
Columnas `workGroupName`/`criticality`/`status`, tal como pedía el ticket.

**Bug real encontrado — y es mío, no del ejecutor.** En mi propio prompt de T-06 escribí la ruta
del select-item de `priority-level` como `api/select-items/priority-level`, citando T-02/T-03. Esa
ruta no existe. Verifiqué el registro real: `SelectItemEnumEndPoints.cs` registra
`priority-level` bajo `MapGroup("api/select-item-enum")`; el grupo `api/select-items`
(`SelectItemEndPoints.cs`) es un catálogo hecho a mano y no tiene ninguna entrada `priority-level`.
El ejecutor confió en mi cita (razonable, no tenía por qué dudar) y llamó
`apiResponseS.onGetSelectItem(...)` (→ `select-items/priority-level`, 404) en vez de
`onGetEnumSelectItem(...)` (→ `select-item-enum/priority-level`, la ruta real). Como `criticality`
tiene `Validators.required` y el selector queda sin opciones, el formulario completo queda
imposible de enviar en producción.

Los "5 tests passed" reportados no lo detectan: `recurring-task-catalog-form.spec.ts` mockea
`apiResponseS.onGetSelectItem` directamente sin verificar que sea el método correcto de
`ApiResponseService` — el mock responde sin importar si el código real llama al helper equivocado.
Esto no es un descuido del ejecutor, es un límite estructural de mockear por nombre de método sin
aserción de cuál método correspondía.

**Verificación independiente, no acepté el reporte del ejecutor sin más:**
- `scan-mojibake.mjs` corrido por mí sobre los 9 archivos tocados de T-06 (interfaz, lista, forma,
  specs, dos archivos de endpoints) → `0` mojibake, consistente con lo reportado.
- Test suite: corrí `vitest run --config vitest.cobranza-nativa.config.ts` apuntando a los dos
  archivos exactos de T-06 (config aislada ya existente, reutilizada de T-05, sin crear una
  temporal nueva). Resultado literal:
  ```text
  Test Files  2 passed (2)
       Tests  5 passed (5)
    Duration  17.02s
  ```
  Coincide con lo reportado por el ejecutor. (Nota: un primer intento con filtro por substring
  `-- catalog` no filtró nada y corrió miles de specs de todo `shared/ui`, sin producir resumen en
  82 líneas de salida — descartado; la corrida válida fue con rutas de archivo explícitas.)

**Veredicto: 🟡 Aprobado con corrección.** El resto del ticket (lista, formulario, campos,
validaciones, alcance) está bien hecho y no requiere cambios. Envío `T-06b`
(`../../../docs/OperationsLuxuryApp/Tasks/20260821-prompt-operations-tasks-T-06b-fix-ruta-criticidad.md`) — cambio de un método (`onGetSelectItem` →
`onGetEnumSelectItem`) en `loadCriticalities()`, más una aserción de spec que hubiera atrapado esto.

### Detalle — Auditoría T-06b

Leí el archivo directamente (no había baseline de `git diff` porque `recurring-task-catalog-form.ts`
sigue sin comitear desde T-06) y confirmé línea por línea: `loadCriticalities()` ahora llama
`onGetEnumSelectItem`, exactamente como pedía el ticket.

Revisé el spec: el mock `apiResponseS` ya no tiene la clave `onGetSelectItem` — fue renombrada a
`onGetEnumSelectItem`, así que revertir el fix rompería el test por "no es función", no sólo por
un valor de retorno equivocado. Agregó un test nuevo, `"loads criticalities from the enum select
endpoint"`, que asegura explícitamente `expect(apiResponseS.onGetEnumSelectItem).toHaveBeenCalledWith(Endpoints.SelectItems.priorityLevel)`.
Cumple el criterio de PASO tal como se pidió.

**Verificación independiente:**
```text
Test Files  2 passed (2)
     Tests  6 passed (6)
  Duration  11.02s
```
```text
Archivos: 0 (2 escaneados)
✓ CERO mojibake / corrupción ortográfica encontrado (scan-mojibake.mjs).
```
Ambos coinciden con lo reportado. `select-item.endpoints.ts` y `operations.endpoints.ts` no fueron
tocados de nuevo (correcto, el fix no requería cambiar la cadena de ruta, sólo el método).

**Veredicto: ✅ Aprobado.** T-06 y T-06b cerrados.

### Detalle — T-18 (ejecutado directamente, no por Kilo Code)

**Excepción de protocolo, explícita:** el usuario pidió que esta vez lo ejecutara yo mismo en vez
de generar el prompt para el ejecutor externo, con dos instrucciones puntuales: no tocar nada del
resto del `git status` (hay decenas de archivos sin comitear de tickets previos ya aprobados) y no
borrar cambios ajenos. Seguí el ticket T-18 al pie de la letra, como si fuera el ejecutor.

**Paso 0 — Guardia de datos, resultado real contra la BD de desarrollo:**
```
TaskRecurringTemplates: 0 filas totales (no hizo falta desglosar por Status)
Task con RecurringTemplateId IS NOT NULL AND CustomerId IS NULL: 0 filas
```
Ambos en cero — el parche nunca llegó a crear datos huérfanos porque nadie había dado de alta
ninguna `RecurringTaskTemplate` todavía (consistente con que T-17, el único camino de alta, se
aprobó apenas hoy). El defecto era real pero **latente**, no manifestado. Sin necesidad de
decisión de limpieza de datos.

**Paso 1 — Retiro del parche:** quité la entrada `"generar-instancias-tareas-recurrentes-legado"`
del arreglo `Jobs` y su `case` en `Schedule()` (`HangfireJobCatalog.cs`), y la línea
`services.AddScoped<RecurringTaskSchedulerJob>();` de `DependencyInjection.Controllers.cs`. **No
borré `RecurringTaskSchedulerJob.cs`** — verifiqué con `test -f` después de terminar que el
archivo sigue en disco, tal como pedía el ticket.

**Paso 2 y 3 — Jobs nuevos:** `RecurringTaskGenerationEngineJob.cs`, `TaskAlertEngineJob.cs`,
`TaskEscalationEngineJob.cs`, mismo molde exacto que `RecurringTaskGenerationJob.cs` (constructor
primario, `Stopwatch`, `try/catch` con `logger.LogError` + `throw`, sin tragarse la excepción).
Registrados en `HangfireJobCatalog.cs` (`Jobs` + `Schedule()`) con claves nuevas
(`generar-tareas-recurrentes-motor-nuevo`, `motor-alertas-tareas-recurrentes`,
`motor-escalacion-tareas-recurrentes`) y cron por omisión (medianoche / 8:00 / 8:30, hora de
México) — ajustable después, no es una decisión cerrada. Registrados también en DI, mismo patrón
explícito que ya usaba `RecurringTaskSchedulerJob`.

**No toqué** `"generar-instancias-tareas-recurrentes"` (sin sufijo) ni `RecurringTaskGenerationJob.cs`
ni `RecurringTaskGeneratorService.cs` — el motor legado real (`TaskInstance`) queda intacto,
territorio exclusivo de T-15.

**Verificación, corrida por mí mismo ya que no hay un segundo ejecutor que auditar esta vez:**
- `git status --short` acotado a las carpetas tocadas: exactamente 2 archivos modificados + 3
  nuevos, nada más — confirmé que no se movió ni se tocó ningún archivo de los que ya estaban sin
  comitear de tickets previos.
- `dotnet build LuxuryApp.sln` (carpeta de salida aislada): **0 errores**.
- `node scripts/audit-conventions.mjs`: sigue en **10**, sin regresión.
- `node scripts/scan-mojibake.mjs` sobre las carpetas tocadas: **cero**.

**Pendiente, fuera de este ticket:** no se aplicó ningún cambio a una base de datos más allá de
las dos consultas `SELECT` de solo lectura del Paso 0. La próxima vez que arranque la API (local o
donde sea), `RegisterRecurringJobsAsync` registrará los 3 jobs nuevos y dejará de registrar el
parche retirado — eso no lo puedo forzar ni verificar desde aquí sin levantar el proceso completo.

**Veredicto: ✅ Aprobado.**

**Corrección post-aprobación (mismo día, misma sesión):** al verificar el efecto real en Hangfire
(consultando `[HangFire].[Set]` donde `[Key] = 'recurring-jobs'` directamente, porque el dashboard
está bloqueado por un 401 no relacionado con este ticket — ver más abajo), confirmé que los 3 jobs
nuevos sí se registraron, pero **`generar-instancias-tareas-recurrentes-legado` seguía presente**
en el almacenamiento de Hangfire pese a haberse retirado del catálogo en código. Causa: `AddOrUpdate`
nunca borra — sólo agrega/actualiza. Retirar una entrada del arreglo `Jobs` sólo evita que se
vuelva a registrar en el próximo arranque; no elimina lo que ya estaba guardado, y la clase
`RecurringTaskSchedulerJob` sigue en disco y resoluble por el activador de Hangfire aunque ya no
tenga `AddScoped` explícito. El job retirado habría seguido disparándose indefinidamente con su
cron ya obsoleto.

**Corregido en `api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs`:** `RegisterRecurringJobsAsync`
ahora, después de registrar el catálogo, consulta `JobStorage.Current.GetConnection().GetRecurringJobs()`
y llama `RemoveIfExists` sobre cualquier clave que ya no esté en `HangfireJobCatalog.Jobs` —
reconciliación automática en cada arranque, no sólo alta. `dotnet build` limpio (0 errores),
`audit-conventions.mjs` sigue en 10, mojibake en cero. **Requiere que la API se reinicie** para
que tanto los 3 jobs nuevos como esta limpieza surtan efecto — no se puede forzar desde aquí sin
levantar el proceso completo.

### Nota — HTTP 401 en `/api/hangfire` y `/admin/jobs`, no relacionado con T-17/T-18

El usuario reportó 401 al entrar directo a `http://localhost:7070/api/hangfire/` o a
`/admin/jobs` (que lo embebe en un iframe). Verificado en
`AuthenticationServiceExtensions.cs:19-52`: la API usa **exclusivamente JWT Bearer** — no hay
esquema de cookie. El único bypass existente (`OnMessageReceived` leyendo `access_token` de la
query string) está acotado a `/ws/notificationHub` (SignalR), no a `/api/hangfire`. Una
navegación directa del navegador (o el `src` de un iframe) no adjunta el JWT que Angular guarda en
memoria — así que `HttpContext.User` nunca se autentica para esa ruta y
`HangfireAuthorizationFilter.Authorize` (que exige `IsInRole("SuperUsuario")`) rechaza con 401
**sin importar el rol real de quien prueba**. Es un gap preexistente, no algo que rompieron T-17 o
T-18 — ninguno de los dos tocó autenticación, el filtro de autorización de Hangfire, ni
`Program.cs`. Verificación alternativa mientras no se resuelva: consultar directamente
`[HangFire].[Set]`/`[HangFire].[Hash]` por SQL (como se hizo arriba), no por el dashboard. Queda
fuera de esta orquestación — no se abrió ticket, es un gap de infraestructura transversal.

### Detalle — T-17 (aprobado)

Leí los 3 archivos en los puntos exactos tocados. `admin.routes.ts:362-373` coincide carácter por
carácter con el prompt: `path: "recurring-task-catalog"`, `canActivate: [authGuard]` (sin
`superUsuarioGuard`, tal como pedía la justificación de `RN-ALT-021`), import perezoso apuntando
al archivo real de T-06. `admin-modules.ts:308-315` agrega el tile en la sección correcta
("Configuración de Sistema"), mismo `color`/`bgColor` que sus 8 vecinos, sin inventar paleta.
`route-whitelist.ts:48` agrega la entrada en el bloque `/admin/...`.

**Verifiqué el alcance por timestamps** (mismo motivo que en tickets anteriores): los 3 archivos
se tocaron el 2026-08-24 a las 06:46-06:47; `recurring-task-catalog-list.ts` y
`recurring-task-catalog-form.ts` conservan su timestamp del 2026-08-21 — no se tocaron, tal como
exigía el prompt.

**Verificación independiente, no acepté el reporte sin más:**
- `node scripts/scan-mojibake.mjs` sobre los 3 archivos: **cero**.
- `npx vitest run` sobre los 2 specs de T-06: **6/6 pasan**, coincide con lo reportado.

**Hallazgo real: el reporte omite la verificación manual en navegador que el prompt pedía
explícitamente** ("abre `/admin` y confirma que el tile aparece y navega correctamente"). El
reporte del ejecutor no tiene esa sección ni la menciona como no realizada con motivo — sólo
faltó. No levanté el stack completo (API + Angular + login) para hacerla yo mismo — es
desproporcionado para un cambio mecánico de 3 archivos, y verifiqué por lectura de código que el
nombre exportado (`RecurringTaskCatalogList`) y la ruta del import coinciden exactamente con el
archivo real. Riesgo residual bajo, pero **no verificado en runtime** — el propio usuario ya dijo
que iba a probar la app; que confirme este tile específico al hacerlo.

**Veredicto: ✅ Aprobado.** El único pendiente es esa verificación manual, que queda a cargo de
quien pruebe la app — no amerita bloquear el ticket ni pedir una repetición sólo por eso, dado lo
mecánico del cambio y lo ya verificado por código.

### Detalle — Auditoría T-05

Leí los 3 archivos completos. `monthDays` como arreglo, `lastDayOfMonth` mutuamente excluyente
(if/else-if en `generateRRule`, nunca mezcla `BYMONTHDAY=-1` con otros días), HTML sigue el
patrón visual exacto de las opciones existentes, mojibake corregido. El test
`"...without mixing monthDays"` prueba directamente el caso ambiguo que más me preocupaba.

**Verifiqué de forma independiente las dos fricciones que reportaron, no las acepté sin más:**
corrí yo mismo `vitest run recurrence-input` sin scope de proyecto — se colgó más de 2 minutos
sin salida. Causa confirmada: `vitest.config.ts` mezcla el proyecto de unit tests con un segundo
proyecto de Storybook que levanta Chromium real vía Playwright. Repliqué su solución (config
aislada temporal, borrada después) y confirmé **21/21** de forma independiente. Confirmé también
que `scan-mojibake.mjs` necesita la ruta completa desde la raíz del repo, no relativa a
`client/angular/` — su reporte era preciso en ambos casos, no una excusa.

Hallazgo lateral sin acción requerida: `vitest.candidates.temp.config.ts` (de otra sesión) sigue
abandonado en la carpeta, y `vitest.cobranza-nativa.config.ts` es una config aislada
**permanente** para otro módulo — confirma que este patrón (aislar el proyecto de Storybook por
módulo) ya es práctica aceptada en el repo, útil para el próximo ticket de frontend.

`git status` en `client/angular/` confirma sólo los 3 archivos declarados, nada más tocado.

### Detalle — Auditoría T-11

Leí `TaskEscalationService.cs` completo. Los 3 niveles (escalación día 3, incumplimiento día 5,
arrastre semanal) coinciden exactamente con el prompt. `BackupUserId` nulo manejado sin fallar.
`BreachedAt` se marca una sola vez. La cadencia de arrastre consulta `MAX(SentAt)` en
`TaskAlertLog` — confirmado que `Tasks.LastAlertAt` no aparece en ningún punto del archivo, la
precaución de acoplamiento con T-09b se respetó.

Dos aportes no pedidos explícitamente: un test dedicado (`AssertLastAlertAtWasNotTouched`) que
convierte la advertencia del prompt sobre `LastAlertAt` en una aserción ejecutable, y persistir
`BreachedAt` incluso cuando no hay ningún destinatario al que notificar — separa correctamente
"pasaron 5 días" (hecho objetivo) de "se logró avisar" (resultado del despacho), con un
`SaveChangesAsync` explícito para el caso donde el guardado normal nunca se habría disparado.

Build, 7/7 tests, `audit-conventions.mjs` (sigue en 10) y mojibake confirmados de forma
independiente. `OrgHierarchy` y `HangfireJobCatalog.cs` sin tocar.

**Nota de alcance registrada al enviar el ticket:** se omite el nivel "día 1: jefe vía
organigrama" de `RN-ALT-053` porque el refactor de `OrgHierarchy` a roles con `CustomerId`
(decisión #19, bloqueador D-11) no ha llegado — el esquema actual sigue anclado a `WorkPosition`
y, por su propio diseño, no filtra por cliente ("independiente a la empresa (Cross-Customer)",
según el comentario de la entidad). Implementar ese nivel ahora reabriría RS-01. Sigue la
contingencia ya prevista en el plan: escalación de nivel 1 (grupo) + respaldo, documentando la
limitación.

### Detalle — Auditoría T-10

Leí `TaskAlertEngineService.cs` completo. Dos fases limpiamente separadas (resolver sin
despachar, luego agrupar por `(AssigneeId, AlertType)` y despachar). `ResolveAlertTypeAsync` y
`HasAlertAsync` sin tocar. El caso de una sola tarea reproduce exactamente el título/cuerpo/ruta
previos — confirmado contra T-09c. El corte en 5 tareas por mensaje se verificó con un test que
comprueba explícitamente que la sexta tarea NO aparece listada, no sólo que aparece "y 1 más".

Extras razonables no pedidos explícitamente: manejo defensivo de tareas sin `AssigneeId`
(cuentan en `Failed`, se excluyen del despacho) y orden determinista de los grupos antes de
despachar. Build, 10/10 tests, `audit-conventions.mjs` (sigue en 10) y mojibake confirmados de
forma independiente.

### Detalle — Auditoría T-09c

`SendAlertAsync` reemplaza el `Add` fijo por `TaskChannels.Select(...)`, verificado línea por
línea: una fila por canal, mismo `Delivered`/`SentAt`/`AlertType`, `DispatchAsync` sigue siendo
una sola llamada. Los 6 tests ajustados con precisión — el nuevo helper `AssertTaskAlertLogs`
verifica 3 filas, mismo tipo/entrega, los tres canales representados sin repetidos. La fila
`Vencida` insertada a mano en el arrange del cuarto test se mantuvo en 1, como correspondía.
Build y 6/6 tests confirmados de forma independiente.

### Detalle — Auditoría T-09b

Leí `TaskAlertEngineService.cs` completo: filtro `IsRecurring == true` presente en la consulta
base, throttle de 24 horas antes de resolver el tipo de alerta, vencida detectada una sola vez
(consulta previa a `TaskAlertLog`), aviso previo calculado desde `AdvanceNoticeDays` vía
`Include(x => x.RecurringTemplate)`, `Delivered` fiel a si `DispatchAsync` lanzó excepción,
`LastAlertAt` actualizado siempre. Los 6 tests cubren exactamente los escenarios pedidos, con
fechas relativas (`DateTime.UtcNow`), no fijas — no van a ser frágiles según el día que corran.

**Hallazgo confirmado, el mismo que el ejecutor señaló en "Riesgos" de su propio reporte:**
`TaskAlertLog.Channel` queda fijo en `InApp` sin importar que el despacho real vaya a los tres
canales (`InApp`, `Push`, `PushWeb`). Contradice el propósito de la bitácora (`RN-ALT-028`: "por
qué canal"). Corrección en T-09c: una fila de bitácora por canal realmente despachado, sin
dividir la llamada a `DispatchAsync`. Ningún test de T-09b se rompe por este cambio de forma
incidental — los que asumen una sola fila se actualizan explícitamente en T-09c.

### Detalle — Auditoría T-08c

`horizonEnd` se calcula ahora dentro de `ProcessTemplateAsync` como
`Math.Max(GenerationHorizonDays, template.AdvanceNoticeDays)`, verificado línea por línea contra
el archivo en disco. `MaxAdvanceNoticeDays = 30` acota el cálculo de festivos una sola vez en
`GenerateAsync`. Nada más del método cambió. Los 2 tests nuevos prueban exactamente los bordes
pedidos (20 días de aviso genera a 15; 3 días de aviso no genera más allá del mínimo de 7), con
una decisión acertada no pedida explícitamente: afirman sobre `RecurrenceSourceDate` en vez de
`PlannedEndDate`, evitando que el test sea frágil según el día de la semana en que corra. Build y
9/9 tests confirmados de forma independiente. Ningún archivo de T-09/`TaskAlertLog` tocado.

### Detalle — Auditoría T-09

Enum, entidad, `DbSet` y registro en `SelectItemEnumEndPoints.cs` verificados contra el código en
disco, coinciden exactamente con lo pedido. La migración apunta a `principalTable: "Task"`
(singular) sin que hiciera falta corregirlo — el ejecutor aplicó la nota de T-08 sin desviarse.
Build, `audit-conventions.mjs` y `scan-mojibake.mjs` corridos de forma independiente: limpio.

Detalle cosmético, no bloqueante: comentario suelto `// Sugerencia: TaskAlertLogs` en
`ApplicationDbContext.cs:472`, residuo de autocompletado. No amerita ticket de corrección.

### Detalle — Auditoría T-08b

Línea eliminada, resto de `GetOccurrences` idéntico a lo ya auditado. Test nuevo reproduce
exactamente el caso empírico verificado en T-08 (miércoles 19-ago-2026 con `FREQ=WEEKLY;BYDAY=MO`
→ sólo lunes 24-ago-2026). Build y 7/7 tests confirmados de forma independiente.

### Detalle — Auditoría T-08

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | Horizonte de 7 días, no 35 | ✅ | `GenerationHorizonDays = 7` |
| 2 | Dirección del ajuste según `BYMONTHDAY=-1` | ✅ | `IsEndOfMonthPattern` + `AdjustForBusinessDay` correctos |
| 3 | `RecurrenceSourceDate` siempre con la fecha cruda | ✅ | Se asigna en todos los casos, ajustado o no |
| 4 | Idempotencia por `(RecurringTemplateId, PlannedEndDate)`, fecha ajustada | ✅ | Consulta exacta sobre esas dos columnas |
| 5 | Responsable determinista por `UserId` ordinal | ✅ | `OrderBy(x => x, StringComparer.Ordinal)` |
| 6 | Sin persistencia de corresponsables | ✅ | Sólo `AssigneeId` se guarda |
| 7 | Folio con el generador oficial | ✅ | `IGenerateFolioService.OnGenerateFolioTicketMessage` |
| 8 | `CustomerId` heredado de la plantilla | ✅ | `template.CustomerId` |
| 9 | Sin WhatsApp en los canales | ✅ | `TaskChannels` = InApp/Push/PushWeb |
| 10 | Reporte agregado a `SistemasGeneral` sólo si hay incidencias | ✅ | Mismo patrón que T-01, verificado |
| 11 | Re-validación de grupo en tiempo de generación (activo, no público, con administrador) | ✅ | Antes de generar cada ocurrencia |
| 12 | Un fallo por plantilla no detiene la corrida | ✅ | `try/catch` dentro del bucle |
| 13 | Sin registro en Hangfire | ✅ | `HangfireJobCatalog.cs` y `HangfireExtensions.cs` sin cambios |
| 14 | **Ocurrencias generadas coinciden con la RRULE configurada** | ❌ **Defecto real** | Ver hallazgo abajo. Corrección en T-08b |

**Hallazgo, verificado empíricamente con la librería real, no por lectura de código:**
`GetOccurrences` agrega `template.StartDate` a la lista de ocurrencias **incondicionalmente**
(línea 144, `occurrences.Add(startDate);`), sin importar si la RRULE realmente la produce. Con
`FREQ=WEEKLY;BYDAY=MO` y `StartDate` en miércoles, monté un script aislado contra `Ical.Net
5.2.3`: la librería, por sí sola, devuelve correctamente sólo los lunes; con la línea inyectada,
el miércoles se cuela como ocurrencia adicional que ningún lunes-only autoriza.

Cuando `StartDate` coincide con el patrón, el resultado es idéntico con o sin la línea — por eso
no se nota en el caso común, y por eso los 6 tests que ya existen no lo atrapan: los 6 usan
`FREQ=DAILY;INTERVAL=1` (valor por omisión del helper `CreateTemplate`), que no tiene restricción
de día, así que `StartDate` siempre coincide. Ningún test ejercita una RRULE semanal o mensual con
fecha de inicio desalineada.

**No es un caso de laboratorio:** T-04 valida que la `RecurrenceRule` sea sintácticamente válida,
pero nunca que `StartDate` coincida con su propio patrón (`BYDAY`/`BYMONTHDAY`). Un usuario que
elige "cada lunes" y captura la plantilla un martes generaría, con el código actual, una tarea
extra el martes de captura, además de las correctas de cada lunes.

**Un aporte real que sí conviene reconocer:** el mismo método resolvió, sin que yo lo pidiera
explícitamente, un problema que el motor vigente que se retira ni siquiera enfrentaba de la misma
forma — cualquier RRULE sin `UNTIL`/`COUNT` (la mayoría) hace que `GetOccurrences` de `Ical.Net`
lance `EvaluationOutOfRangeException` si no se le acota un límite. El código ya fija
`recurrencePattern.Until` al final del horizonte de generación antes de evaluar, evitando ese
error — lo verifiqué provocándolo deliberadamente sin ese ajuste. Sin esa parte, el generador
completo fallaría en la mayoría de los casos reales, no sólo en el de fecha desalineada.

**Riesgo no bloqueante que dejo anotado, no corregido aquí:** T-04 podría validar en el futuro que
`StartDate` sea una ocurrencia válida de su propia `RecurrenceRule` al guardar la plantilla, para
que este tipo de desalineación no llegue nunca al generador. No lo agrego como ticket todavía —
la corrección de T-08b ya hace que el generador sea correcto aunque la plantilla esté mal
configurada, así que no es urgente.

### Detalle — Auditoría T-04b

El archivo `RecurringTaskCatalog/` no estaba bajo control de versiones (`git status` lo marca
`??`), así que no había línea base para `git diff`. Verifiqué leyendo el archivo completo y
comparándolo contra la versión que ya había revisado en la auditoría de T-04: **el único cambio
es la línea 24**, de `Results.BadRequest(result)` a `TypedResults.Ok(result)`. `GET`, `GET list`,
`PUT` y `PATCH` — roles, rutas, metadata — idénticos carácter por carácter. Compilación limpia,
cero mojibake, `audit-conventions.mjs` sigue en 10.

### Detalle — Auditoría T-04

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | Las 5 validaciones, en orden, compartidas entre Create/Update | ✅ | Leí `ValidateTemplateAsync` completo: grupo existe → pertenece al cliente → activo → no público → tiene administrador → RRULE válida → aviso previo en rango → crítica exige rol y respaldo |
| 2 | `ICurrentUserService.UserRole` usado directo, sin `UserManager` | ✅ | `CanManageAnyCustomer()` compara el string único |
| 3 | `CustomerId` derivado de `WorkGroup`, no del DTO | ✅ | `entity.CustomerId = validation.WorkGroup.CustomerId` en ambos métodos |
| 4 | `WorkGroupName` usa el mismo criterio que el catálogo de grupos existente | ✅ | Comparé contra `TaskGroupAppService.cs:78`: `NameGroup = x.WorkGroupCategories.Name` — idéntico. `WorkGroup` no tiene nombre propio en el esquema, no es un atajo |
| 5 | Ubicación del código nuevo, como submódulo de `Tasks/` | ✅ | 6 archivos bajo `RecurringTaskCatalog/`, mismo patrón de carpetas que `WorkGroup/` |
| 6 | Nada de checklist/justificación/bitácora/comprobante/generador | ✅ | Ausentes |
| 7 | Archivos de tickets anteriores sin cambios nuevos | ✅ | `git diff --stat` idéntico al de T-03 en los 6 archivos compartidos |
| 8 | Registro en DI | ✅ | Una línea junto a `ITaskGroupAppService`, mismo patrón |
| 9 | AutoMapper no necesita registro manual | ✅ | `AddCustomAutoMapper` escanea todos los ensamblados no dinámicos por reflexión |
| 10 | Sin regresión de convenciones | ✅ | Corrí el script: sigue en 10 |
| 11 | Sin mojibake en lo tocado | ✅ | Escaneo específico de la carpeta nueva + el archivo de DI: cero |
| 12 | `POST` no crashea con `NullReferenceException` en error | ✅ | El guardia `if (!result.Success)` está antes de `.Data.Id` |
| 13 | `POST` devuelve HTTP consistente con el resto del archivo | ❌ | Ver hallazgo abajo. Corrección en T-04b |

**Verificación empírica, no sólo lectura de código:** monté un script aislado con `Ical.Net 5.2.3`
para probar si el chequeo extra `.Contains("FREQ=")` en `TryParseRecurrenceRule` era necesario.
Resultado: **no lo es**. La librería ya lanza excepción para cualquier cadena no vacía sin
`FREQ=` — incluida exactamente `"esto no es una rrule"`, el caso de prueba del prompt. Sólo una
cadena vacía o de espacios no lanza (cae en `Frequency=Yearly` por defecto), y ese caso ya está
cubierto antes por `IsNullOrWhiteSpace`. El chequeo extra es **redundante pero inofensivo**: no
rechaza ninguna RRULE válida porque el RFC exige `FREQ` siempre. No amerita corrección.

**Hallazgo real, con origen en mi propio prompt:** el `POST` devuelve `Results.BadRequest(result)`
(HTTP 400) cuando `CreateAsync` rechaza la plantilla, mientras que `GET`/`PUT`/`PATCH` del mismo
archivo devuelven `TypedResults.Ok(...)` siempre, con el resultado de negocio dentro del cuerpo —
igual que el archivo de referencia `TaskGroupsEndpoints.cs`. Verifiqué el consumidor real:
`client/angular/src/app/core/http/services/api-response.service.ts` — su
`processResponse`/`handleError` leen `response.success` asumiendo que la petición ya llegó en
2xx. Un `400` real activaría el flujo de error HTTP de Angular en vez del de negocio, rompiendo
el toast esperado justo en el endpoint con más validaciones del ticket.

El origen es mío: di como referencia un archivo cuyo `POST` nunca falla por reglas de negocio y
por eso nunca tuvo que decidir qué código devolver en el error. El guardia que agregó el ejecutor
(`if (!result.Success)`) sí era necesario —sin él, `.Data.Id` explota—; lo único que sobra es el
`400`. Corrección quirúrgica en T-04b.

**Sobre la discrepancia "seis rutas" vs las cinco implementadas:** es error mío. El prompt decía
"Seis rutas, espejo de `TaskGroupsEndpoints.cs`" y luego listaba cinco bullets. El ejecutor no
inventó una sexta (habría sido `DELETE`, explícitamente prohibido) y señaló la discrepancia en su
reporte. Correcto de su parte.

### Detalle — Auditoría T-03

| # | Punto | Resultado | Cómo lo verifiqué |
| --- | --- | :-: | --- |
| 1 | `ITenantEntity` igual que `WorkGroup` | ✅ | `CustomerId`/`Customer` sin anotaciones propias, patrón idéntico |
| 2 | `RecurrenceRule` reemplaza los 4 campos legados en C# | ✅ | Leí la entidad completa: `Pattern`/`Interval`/`DayOfWeek`/`DayOfMonth` ya no existen en la clase |
| 3 | `Criticality` reutiliza `PriorityLevel` | ✅ | Sin enum nuevo |
| 4 | `AdvanceNoticeDays`, `BackupUserId`, `ExpectedDeliverableName`, `RequiresAttachment` | ✅ | Los 4 presentes con las anotaciones pedidas |
| 5 | `AssigneeId` sigue sin `[Required]` | ✅ | Confirmado sin cambio |
| 6 | Índice `(CustomerId, WorkGroupId)` | ✅ | `[Index(nameof(CustomerId), nameof(WorkGroupId))]` — confirmé que es la convención ya usada en 5+ entidades del repo (`Accounting/AR/*`), no una invención |
| 7 | Migración 100% aditiva, sin `DropColumn` de las 4 columnas legadas | ✅ | Leí `Up()` completo: sólo `AddColumn`, `AlterColumn` (nullable→NOT NULL) e índices/FK nuevos |
| 8 | Nada de checklist, justificación, alert log, `TaskAttachment` | ✅ | Confirmado |
| 9 | Cero servicios/endpoints/frontend nuevos | ✅ | Ningún archivo de `Services/`, `EndPoints/` o Angular en la lista de tocados, salvo la excepción del punto 10 |
| 10 | **`RecurringTaskSchedulerJob.cs` sí se tocó** — prohibido explícitamente en el prompt | ⚠️ **Excepción, no violación** | Ver razonamiento abajo |
| 11 | Sin regresión de convenciones | ✅ | Corrí el script: sigue en 10 |
| 12 | Sin mojibake en los archivos tocados | ✅ | Verificado uno por uno |

**Sobre el punto 10, la única desviación del alcance declarado.** Mi prompt decía "No toques
ningún servicio", en singular categórico. Era una instrucción que yo mismo volví imposible de
cumplir: al retirar `Pattern`/`Interval`/`DayOfWeek`/`DayOfMonth` de la entidad, el método
`GetNextOccurrence` de `RecurringTaskSchedulerJob.cs` — que los usaba directamente — dejaba de
compilar. Y el prompt también exigía, sin matices, "la compilación pasa sin errores nuevos". Las
dos instrucciones eran incompatibles y no lo detecté al escribirlo.

Verifiqué la corrección línea por línea (`git diff` completo, no sólo el resumen del reporte):
reescribe `GenerateInstances` para parsear `RecurrenceRule` con `Ical.Net`, el mismo mecanismo que
ya usa el motor vigente (`RecurringTaskGeneratorService.cs`). No toca el generador de folios —que
sigue teniendo el bug de 49 caracteres documentado en `02b`— porque corregirlo no era necesario
para compilar y está fuera de este ticket. **Efecto colateral positivo, verificado, no inventado
por el ejecutor:** el método viejo tenía un `_ => default` para los patrones `EveryXDays` y
`Custom`, que rompía el bucle tras la primera fecha — esos dos patrones **ya generaban como
máximo una instancia, nunca más**, desde antes de este ticket. La reescritura no degrada nada que
funcionara; corrige un callejón sin salida preexistente como consecuencia de usar RRULE en vez de
aritmética por casos.

**Sobre el riesgo que el ejecutor señaló ("si hay recurrencias Custom reales, la migración las
convierte a FREQ=DAILY").** Dado lo anterior, ese riesgo es menor de lo que el propio ejecutor
pensaba: `Custom` ya no generaba nada útil antes de este cambio, así que convertirla a diaria no
es una regresión funcional, es una plantilla que pasa de "rota" a "genera algo razonable por
defecto". Se agradece la cautela — declarar el riesgo sin saber que ya estaba roto fue lo correcto
de hacer — pero no bloquea el ticket.

**Precedente para prompts futuros:** cuando un ticket retira campos de una entidad, hay que
declarar explícitamente qué otros archivos los consumen (aquí me faltó revisar
`RecurringTaskSchedulerJob.cs` antes de escribir el prompt) y decidir de antemano si se corrigen
en el mismo ticket o si el ticket se bloquea hasta que exista uno previo que los desacople. Lo
aplico desde T-04 en adelante: antes de prohibir tocar un archivo, verifico primero que nada roto
por el propio ticket dependa de él.

**No se aplicó `dotnet ef database update`.** El ejecutor reportó que la herramienta bloqueó la
operación por no tener confirmado el entorno de destino, tal como el prompt le pedía declarar en
vez de omitir. Correcto: no hay entorno de desarrollo accesible desde este ciclo. La migración se
revisó a mano (arriba, punto 7) en su lugar.
