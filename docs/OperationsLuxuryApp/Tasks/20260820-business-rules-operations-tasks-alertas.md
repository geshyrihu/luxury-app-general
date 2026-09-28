# FASE 0 — ANÁLISIS DE REGLAS DE NEGOCIO

# Alertas de Tareas Recurrentes

**Fecha:** 2026-08-17
**Versión:** 1.0
**Estado:** EN REVISIÓN
**Tipo de trabajo:** B — Ampliación del motor `TaskEngine`
**Prefijo de reglas:** `RN-ALT`
**Insumos:** `01-discovery-cuestionario.md`, `01b-entidad-estructura.md`
**Protocolo:** `conventions/operations/fase-0-business-rules-discovery.md`

---

## 0.1 PROBLEM STATEMENT + KPIs

### El problema

> Actualmente, el **personal responsable de obligaciones recurrentes** (contadores, RR.HH.,
> mantenimiento, proveedores) sufre de **falta de un control claro y de vigilancia externa**
> cuando intenta **cumplir tareas periódicas obligatorias**, lo que resulta en **incumplimientos
> que sólo se detectan cuando llega el daño** —multa, cliente molesto o retrabajo.
>
> Esto afecta a **todas las áreas operativas y corporativas de todos los clientes**, con un
> costo verificado de **6 multas de ~$5,000 MXN = $30,000 MXN**.

**Causa raíz (declarada por el dueño del proceso):** el responsable **sí sabía** de la obligación.
Se le pasó porque *"su control no fue lo suficientemente claro"*. **No es un problema de
desconocimiento ni de falta de aviso inicial**, sino de:

1. Ausencia de un lugar único donde el responsable vea qué le falta y qué tan urgente es.
2. Ausencia de vigilancia externa: el olvido de una persona no dispara ninguna señal hacia arriba.
3. Detección reactiva: el "sistema de alerta" real fue un tercero externo (el SAT).

**Lo que ya existe y no resuelve el problema:** el motor `TaskEngine` genera las tareas cada noche
y envía **una única** notificación al crearlas
(`RecurringTaskGeneratorService.cs:164-178`). Después de esa notificación, el sistema
**nunca vuelve a insistir, no detecta el vencimiento y no avisa a nadie más**.

### KPIs / OKRs

| # | Métrica | Baseline | Target | Plazo | Método de verificación |
|:--|:--|:--|:--|:--|:--|
| K1 | Multas por obligación recurrente olvidada | 6 (histórico acumulado) | 0 | 6 meses tras liberación de Fase 1 | Registro contable de multas y recargos |
| K2 | Costo por multas evitables | $30,000 MXN perdidos | $0 adicionales | 6 meses tras liberación | Registro contable |
| K3 | Quién detecta el incumplimiento | Un tercero externo (llega la multa) | El sistema, antes del `DueDate` | Fase 1 | Comparar `fecha de alerta` vs `fecha de sanción` en bitácora de alertas |
| K4 | Tiempo entre vencimiento y enterarse el superior | Semanas | ≤ 1 día en tareas críticas | Fase 1 | `timestamp` de la alerta de escalación vs `DueDate` |
| K5 | Tareas críticas cerradas con comprobante | 0 % (no existe el requisito) | 100 % | Fase 2 | Conteo `TaskAttachment` por instancia crítica cerrada |
| K6 | Tareas vencidas sin cerrar al corte mensual | **Sin medir — ver B4** | Reducción ≥ 70 % vs baseline | 3 meses tras Fase 1 | Consulta sobre `TaskInstances` |
| K7 | Corridas exitosas del job de generación | Sin monitoreo | 100 % con alerta ante fallo | Fase 1 | Bitácora de Hangfire + alerta a `SistemasGeneral` |

**Bloqueador B4:** K6 no puede fijar su meta numérica hasta ejecutar sobre la base de datos
productiva:

```sql
SELECT COUNT(*) FROM TaskInstances
WHERE DueDate < GETUTCDATE() AND CompletedAt IS NULL;
```

Responsable: Tech Lead. Sin este dato, K6 queda con meta relativa (≥70 % de reducción) en vez de
absoluta.

---

## 0.2 MATRIZ DE REGLAS DE NEGOCIO (4 NIVELES)

### NIVEL 1 — Invariantes de Dominio

> Verdades que no cambian, sin importar qué otro requerimiento se modifique.

| ID | Regla | Justificación | Ubicación en código |
|:--|:--|:--|:--|
| `RN-ALT-001` | Toda obligación recurrente **debe existir como `TaskTemplateItem` con `RecurrenceRule` válida** para poder ser vigilada | El sistema no puede alertar sobre lo que no está capturado. Es la condición de existencia del módulo | `Entities/Tenant/Operations/TaskEngine/TaskTemplateItem.cs:50` |
| `RN-ALT-002` | Una tarea **vencida nunca desaparece** del historial: se cierra, se justifica con aprobación, o se marca abandonada — pero permanece consultable | Sin trazabilidad del incumplimiento, el módulo tapa el problema en lugar de exponerlo | Nuevo — regla sobre `TaskInstances` |
| `RN-ALT-003` | Toda tarea marcada **CRÍTICA debe tener un destinatario de escalación resoluble** al momento de guardarse | Sin destinatario, la alerta crítica muere en silencio y produce confianza falsa | Nuevo — validación al guardar plantilla |
| `RN-ALT-004` | El **responsable no puede aprobar su propia justificación** | Si el responsable se auto-perdona, el control no existe | Nuevo — `OrgHierarchy` resuelve al aprobador |
| `RN-ALT-005` | La obligación **existe aunque el rol esté vacante**, y **toda tarea tiene siempre responsable**: si no hay quién ocupe el rol, se asigna al jefe o a otro responsable. **Nunca queda sin dueño** | Suspender la generación borra la obligación del radar justo cuando hay más riesgo. Y una tarea sin dueño es una tarea que nadie hace | `TaskInstance.cs:49-50` — `AssigneeId` **permanece `[Required]`, sin cambio de esquema** |
| `RN-ALT-006` | **Ninguna alerta puede reportarse como enviada si el canal no la entregó realmente** | `SmsService` hoy reporta éxito sin enviar. Es el modo de falla que el módulo busca eliminar | `Providers/Services/SmsService.cs:9-32` |
| `RN-ALT-007` | **Reasignar una tarea no modifica su `DueDate`** | Reasignar no puede ser una forma de resetear el reloj del incumplimiento | `Entities/Tenant/Operations/TaskEngine/TaskInstance.cs:71` |

---

### NIVEL 2 — Flujo y Estados

> Ciclo de vida de una instancia de tarea y sus transiciones válidas.

| ID | Regla | Quién la ejecuta | Ubicación en código |
|:--|:--|:--|:--|
| `RN-ALT-010` | Estados válidos: `Pendiente` → `EnProceso` → `Completada`; con ramas `Reasignada`, `Justificada` y `Abandonada` | Sistema y usuarios según transición | `Entities/Tenant/Operations/TaskEngine/TaskInstance.cs:61` |
| `RN-ALT-011` | **`Vencida` es estado derivado, no persistido:** `DueDate < ahora AND CompletedAt IS NULL` | Sistema (cálculo) | `TaskInstance.cs:71,76` |
| `RN-ALT-012` | `Justificada` **no es un estado terminal**: queda en espera de aprobación y **no detiene el ciclo de alertas** | Responsable solicita | Nuevo |
| `RN-ALT-013` | `JustificacionAprobada` saca la tarea del ciclo. `JustificacionRechazada` la devuelve a `Pendiente` | Jefe resuelto vía `OrgHierarchy` | `Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs:16` |
| `RN-ALT-014` | **Tolerancia máxima: 5 días vencida.** Cumplido el quinto día sin cierre ni justificación aprobada, la tarea se marca como **incumplimiento formal** y se **arrastra** al periodo siguiente con explicación. **No deja de alertar: cambia de cadencia** (modificada 2026-08-20; antes eran 30 días con abandono silencioso) | Sistema (job) | Nuevo job en `HangfireJobCatalog.cs` |
| `RN-ALT-015` | Al marcarse el incumplimiento se notifica a `Direccion`, `SuperUsuario` y `SupervisionOperativa`, y la tarea permanece visible en el tablero hasta que se cierre o se justifique | Sistema | Nuevo |
| `RN-ALT-053` | **Escalera de escalación comprimida a 5 días.** Día 0: responsable y corresponsables. Día 1: jefe vía organigrama. Día 3: responsable de respaldo y supervisión operativa. Día 5: Dirección, `SuperUsuario` y `SupervisionOperativa` + incumplimiento formal. **Las críticas arrancan la escalera el mismo día del vencimiento** | Sistema (job) | Nuevo |
| `RN-ALT-054` | **Un usuario tiene un solo rol.** La escalación de nivel 2 se resuelve con ese rol. Si un usuario tuviera más de uno, el módulo **no elige**: reporta la anomalía y pasa al respaldo | Sistema | Convención del proyecto; el esquema de Identity no la impone. Patrón ya usado en `ScheduledTaskService.cs:404-421` |
| `RN-ALT-051` | **Arrastre:** la tarea con incumplimiento formal pasa al periodo siguiente conservando su antigüedad y su explicación, en lugar de archivarse. Su cadencia baja a semanal para no saturar, pero **nunca se apaga** | Sistema | Nuevo. Validado con el calendario del cliente (`05` §3.3) |
| `RN-ALT-016` | Las instancias **ya generadas conservan su responsable original**; el cambio de ocupante del rol afecta sólo a instancias futuras | Sistema | `RecurringTaskGeneratorService.cs:126-153` |
| `RN-ALT-017` | Si el **cliente se da de baja**, sus tareas dejan de generarse y las pendientes dejan de alertar | Sistema | `RecurringTaskGeneratorService.cs:18-22` |
| `RN-ALT-018` | **Cadena de resolución del responsable** cuando el rol está vacante en el cliente: (1) usuario con el rol → (2) jefe vía `OrgHierarchy` → (3) responsable de respaldo. Se detiene en el primer nivel que resuelva | Sistema | `RecurringTaskGeneratorService.cs:44-58`; `OrgHierarchy.cs:16` |
| `RN-ALT-019` | Al asignar por vacante (niveles 2 o 3 de `RN-ALT-018`), la tarea se marca como **asignación por excepción** y el jefe recibe aviso explícito de que hay obligaciones sin titular | Sistema | Nuevo |

**Diagrama de estados:**

```
                        ┌──────────────┐
                        │  Pendiente   │◄──────────────┐
                        └──────┬───────┘               │
              ┌────────────────┼────────────────┐      │
              ▼                ▼                ▼      │
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┴──┐
       │ EnProceso   │  │ Reasignada  │  │  Justificada   │
       └──────┬──────┘  └──────┬──────┘  │ (espera visto  │
              │                │         │     bueno)     │
              │                │         └───┬────────┬───┘
              ▼                │             ▼        ▼
       ┌─────────────┐         │      ┌──────────┐ ┌──────────┐
       │ Completada  │◄────────┘      │ Aprobada │ │Rechazada │
       └─────────────┘                └──────────┘ └────┬─────┘
                                                        │
   Vencida = DueDate < ahora AND CompletedAt IS NULL    │
   (derivado, no persistido)                            │
              │ 5 días (tolerancia máxima)              │
              ▼                                         │
       ┌───────────────┐                                │
       │ Incumplimiento│                                │
       └───────────────┘        vuelve a Pendiente ─────┘
```

---

### NIVEL 3 — Seguridad y Autorización

> Roles del catálogo oficial (`application-roles-catalog.md` + `ApplicationRoleEnum.cs`).

| ID | Regla | Roles autorizados | Restricción | Ubicación en código |
|:--|:--|:--|:--|:--|
| `RN-ALT-020` | **Reciben tareas asignadas** únicamente los `RoleType` `Corporate`(2), `Staff`(3) y `Contractor`(5) | — | `System`(0), `Executive`(1) y `Client`(4) quedan excluidos | `Shared/Enums/RoleType.cs` |
| `RN-ALT-021` | **Crear y editar plantillas** de tareas recurrentes | `SuperUsuario`, `Direccion`, `Administrador` | Sólo sobre clientes a los que tienen acceso | `Entities/.../TaskTemplate.cs:27` |
| `RN-ALT-022` | **Marcar una tarea como CRÍTICA** | `SuperUsuario`, `Direccion` | Restringido para evitar saturación (riesgo PM-06) | Nuevo |
| `RN-ALT-023` | **Aprobar o rechazar una justificación** | Jefe del responsable, resuelto vía `OrgHierarchy` | **El responsable no puede aprobar la suya** (`RN-ALT-004`) | `OrgHierarchy.cs:16,30` |
| `RN-ALT-024` | **Reasignar una tarea vencida** | Jefe del responsable, `SuperUsuario`, `Direccion` | Conserva `DueDate` original (`RN-ALT-007`) | Nuevo |
| `RN-ALT-025` | **Ver el tablero de cumplimiento completo** | `SuperUsuario`, `Direccion`, `SupervisionOperativa` | Sin filtro de cliente para `SuperUsuario` y `Direccion` | Nuevo |
| `RN-ALT-026` | **Ver el tablero de su área** | Cualquier jefe con subordinados en `OrgHierarchy` | Filtrado a su rama del organigrama | Nuevo |
| `RN-ALT-027` | El responsable **sólo ve sus propias tareas**, no las de sus pares | Roles `Corporate`, `Staff`, `Contractor` | Filtro por `AssigneeId` y `CustomerId` | `TaskInstance.cs:50` |
| `RN-ALT-028` | Toda alerta enviada, escalación, justificación y cierre **se registra en bitácora auditable** (quién, qué, cuándo, por qué canal) | — | Requisito de auditoría; alimenta K3 y K4 | Nuevo — extender `NotificationLog` |
| `RN-ALT-029` | La **tasa de aprobación de justificaciones por jefe** es visible para `Direccion` | `Direccion`, `SuperUsuario` | Mitiga PM-04 (jefe que aprueba todo sin leer) | Nuevo |

---

### NIVEL 4 — Validación de Datos

| ID | Campo / Regla | Obligatorio | Formato / Restricción | Ubicación en código |
|:--|:--|:--|:--|:--|
| `RN-ALT-030` | `RecurrenceRule` debe ser una RRULE válida del estándar iCalendar | Sí | Parseable por `Ical.Net.DataTypes.RecurrencePattern` | `TaskTemplateItem.cs:50`; uso en `RecurringTaskGeneratorService.cs:90` |
| `RN-ALT-031` | **Criticidad** de la tarea | Sí | Se usa `PriorityLevel` con el valor **`Critical` agregado al final** (modificada 2026-08-20; antes se planeaba un enum propio). No se renumera ni renombra ningún miembro existente | `Shared/Enums/PriorityLevel.cs` |
| `RN-ALT-055` | Sólo `SuperUsuario` y `Direccion` pueden marcar `Critical`, tanto en plantilla como en tarea manual | Sí | Extiende `RN-ALT-022` al ticket manual, ahora que el valor existe para todos | `Shared/Enums/PriorityLevel.cs` |
| `RN-ALT-056` | **La criticidad de una tarea generada desde plantilla es inmutable.** Ningún usuario, ni el administrador del grupo, puede cambiarla. Cambiarla exige cambiar la plantilla, y aplica a las tareas futuras | Sí | Bloquea el *toggle* de `TaskAppService.cs:962` cuando `RecurringTemplateId` no es nulo | `Tasks.cs:214` |
| `RN-ALT-057` | Una tarea generada **no puede cancelarse ni cerrarse saltándose sus requisitos**; sí avanza de estado con normalidad. Congelar el estado impediría completarla: lo que se restringe es cancelar y cerrar sin comprobante | Sí | Distinto de `RN-ALT-056`, que congela la criticidad | `Tasks.cs:119-121` |
| `RN-ALT-032` | **Días de aviso previo**, configurables por tarea | Sí | Entero ≥ 0 y ≤ 30. Default sugerido 3 | Nuevo campo en `TaskTemplateItem` |
| `RN-ALT-033` | **Responsable de respaldo** para escalación | Sí, **sólo si la tarea es CRÍTICA** | Debe ser un `ApplicationUser` activo | Nuevo campo. Ver `RN-ALT-003` |
| `RN-ALT-034` | **Comprobante** al cerrar la tarea | Sí, cuando la plantilla lo exija | Al menos un `TaskAttachment` ligado a la `Tasks`. MIME permitido: PDF e imagen. **No** se usa `BeforeWork`/`AfterWork` | `Entities/.../TaskAttachment.cs:32-42` |
| `RN-ALT-035` | **Motivo escrito** al solicitar justificación | Sí | Texto no vacío, mínimo 20 caracteres. Mitiga PM-04 | Nuevo. Base: `TaskComment.cs:33` |
| `RN-ALT-036` | `PhoneNumber` del responsable requerido para el canal WhatsApp | Sí para ese canal | Ya obligatorio en el sistema | `Entities/System/Access/ApplicationUser.cs:26-28` |
| `RN-ALT-037` | **Canales habilitados en este módulo:** InApp, Push App, Push Web, Email y WhatsApp. **SMS queda fuera por el momento** | — | Un canal sólo puede declararse habilitado si entrega de verdad (`RN-ALT-006`) | `Shared/Enums/NotificationChannel.cs`; `NotificationDispatcher.cs:34-39` |
| `RN-ALT-038` | La tarea **no se duplica** para la misma fecha de recurrencia y el mismo responsable | — | Validación ya implementada | `RecurringTaskGeneratorService.cs:126-133` |
| `RN-ALT-039` | Las alertas **no se emiten en días festivos** para tareas cuya ventana caiga en festivo | — | Reutiliza `IHolidayService` | `RecurringTaskGeneratorService.cs:60-74,115-124` |

---

## 0.3 PRE-MORTEM + FLUJOS CRÍTICOS

### Pre-Mortem

> Los 8 supuestos fallidos fueron **confirmados por el dueño del proceso como ya ocurridos** en
> otros módulos. Ninguno es hipotético: **todos con probabilidad Alta**.

| ID | Supuesto fallido | Impacto | Prob. | Mitigación | Owner |
|:--|:--|:--|:--|:--|:--|
| PM-01 | La obligación nunca se dio de alta como tarea recurrente | El módulo es irrelevante | **Alta** | Fase explícita de carga inicial por área, con responsable nombrado y criterio de paso. **No hay datos previos que migrar (P1.6.2), así que la captura manual es condición de existencia** | Tech Lead + responsables de área |
| PM-02 | El responsable no tiene `WorkPosition` en `OrgHierarchy` | La escalación crítica no encuentra jefe y muere en silencio | **Alta** | `RN-ALT-003` + `RN-ALT-033`: respaldo obligatorio validado al guardar. Reporte de responsables sin puesto | Backend |
| PM-03 | Cierran la tarea sin haberla hecho | Tablero en verde con incumplimiento real | **Alta** | `RN-ALT-034` comprobante obligatorio en críticas + checklist por pasos + auditoría `RN-ALT-028` | Backend |
| PM-04 | El jefe aprueba toda justificación sin leerla | La escalación se vuelve trámite | **Alta** | `RN-ALT-035` motivo escrito obligatorio + `RN-ALT-029` tasa de aprobación visible a Dirección | Backend + Frontend |
| PM-05 | Nadie abre el tablero de cumplimiento | Se construye una pantalla que nadie consulta | **Alta** | El digest semanal **empuja** la información por correo; el tablero no es el único canal | Backend |
| PM-06 | Todo se marca como crítico | El ruido entierra las alertas que importan | **Alta** | `RN-ALT-022` restringe quién puede marcar crítico + reporte de proporción crítica/normal | Tech Lead |
| PM-07 | El job de generación falla y nadie lo nota | Un día sin tareas generadas, sin señal | **Alta** | K7: monitoreo de corrida diaria con alerta a `SistemasGeneral` | DevOps + Backend |
| PM-08 | Se conecta el canal SMS al placeholder actual | El sistema reporta "enviado" sin enviar: confianza falsa | **Neutralizado** | **SMS queda fuera del alcance** (`RN-ALT-037`). El riesgo se elimina por exclusión, no por mitigación. Si en el futuro se incorpora, `RN-ALT-006` lo bloquea hasta implementar proveedor real | Backend |

---

### Flujo Feliz — Obligación fiscal cumplida a tiempo

```
1. Admin captura "Pagar ISR" como TaskTemplateItem: RRULE mensual día 17,
   criticidad CRÍTICA, aviso previo 5 días, respaldo = Gerente de Operaciones
2. El job nocturno genera la instancia y resuelve responsables por RoleId(Contador)+CustomerId
3. Día 12 (5 días antes): alerta al contador por campanita + push
4. Día 16: alerta por campanita + push + correo
5. Día 17 por la mañana: alerta por campanita + push + WhatsApp
6. El contador realiza el pago, cierra la tarea y adjunta el acuse (obligatorio por ser crítica)
7. La tarea pasa a Completada con CompletedAt y CompletedBy registrados
8. El jefe nunca recibió una sola alerta: la autonomía se respetó
```

**Criterio de PASO:**
- 3 alertas previas entregadas y registradas en bitácora, en las fechas exactas
- Cierre **rechazado** si no se adjunta comprobante
- `CompletedAt`, `CompletedBy` y `TaskAttachment` poblados
- Cero notificaciones al superior
- Tiempo de respuesta del endpoint de cierre < 500 ms

---

### Flujo Triste — Obligación crítica vencida

```
1. Mismos pasos 1-5 del flujo feliz
2. El contador no realiza el pago. Pasa el DueDate del día 17
3. El sistema calcula la tarea como Vencida (DueDate < ahora AND CompletedAt IS NULL)
4. MISMO DÍA: por ser CRÍTICA, escala al jefe resuelto vía OrgHierarchy,
   por todos los canales disponibles. Si no hay jefe, va al respaldo obligatorio
5. Cada 24 h se reinsiste al contador por campanita + push
6. A los 3 días vencida sube un nivel más en el organigrama, por correo + WhatsApp
7. El jefe reasigna la tarea a otro contador — conservando el DueDate original del día 17
8. El nuevo responsable la recibe YA VENCIDA y la cierra con acuse
```

**Criterio de PASO:**
- La escalación al jefe ocurre el **mismo día** del vencimiento (K4 ≤ 1 día)
- Si `OrgHierarchy` no resuelve jefe, la alerta llega al respaldo — **nunca se pierde**
- La reasignación **no modifica** `DueDate` (`RN-ALT-007`)
- Toda la cadena queda en bitácora auditable (`RN-ALT-028`)

---

### Flujo Borde 1 — Responsable de vacaciones

```
1. El job va a generar la tarea y detecta que el responsable está en periodo vacacional
2. La tarea SE ASIGNA IGUAL (no se salta, no se reasigna sola)
3. En el momento de la asignación, el sistema notifica al jefe:
   "Se asignó una tarea CRÍTICA a un colaborador en vacaciones"
4. El jefe decide: la deja, la reasigna, o la reprograma
```

**Criterio de PASO:**
- El aviso al jefe es **preventivo** (al asignar), no reactivo (al vencer)
- La tarea existe con responsable asignado, sin excepción ni salto
- Se registra en bitácora que el aviso de vacaciones se emitió

---

### Flujo Borde 2 — Rol vacante en el cliente

```
1. El contador renuncia en marzo. Nadie tiene el rol Contador en ese cliente
2. Llega el día 17 de abril. El job genera la tarea IGUAL
3. Aplica la cadena de RN-ALT-018: no hay usuario con el rol
   → sube al jefe vía OrgHierarchy → LA TAREA SE ASIGNA AL JEFE
4. Se marca como asignación por excepción y el jefe recibe aviso explícito:
   "Se te asignó una obligación porque el rol Contador está vacante en este cliente"
5. El jefe la ejecuta él mismo, o la reasigna a alguien más
6. En mayo contratan a alguien con rol Contador
7. Las tareas futuras se le asignan automáticamente. Las de abril conservan su historial
```

**Criterio de PASO:**
- La instancia de abril **existe** en la base de datos, no se saltó
- La instancia **tiene responsable**: `AssigneeId` nunca queda vacío (`RN-ALT-005`)
- **Sin cambio de esquema:** `AssigneeId` permanece `[Required]`
- El jefe recibió aviso de que la asignación fue por excepción, no rutinaria
- Al aparecer el nuevo ocupante del rol, las instancias futuras lo toman sin intervención manual
- Si tampoco hay jefe en `OrgHierarchy`, cae al respaldo obligatorio (`RN-ALT-033`)

---

### Flujo Borde 3 — Justificación rechazada

```
1. Tarea crítica vencida. El responsable solicita justificación con motivo escrito
2. La tarea pasa a Justificada, PERO las alertas NO se detienen
3. El jefe lee el motivo y lo rechaza
4. La tarea vuelve a Pendiente, sigue vencida y sigue escalando
5. Al quinto día sin resolución se marca incumplimiento formal y se arrastra al periodo siguiente
6. Se notifica a Direccion, SuperUsuario y SupervisionOperativa
7. Permanece en el tablero como incumplimiento definitivo
```

**Criterio de PASO:**
- Solicitar justificación **no silencia** las alertas (`RN-ALT-012`)
- El rechazo devuelve la tarea a `Pendiente` conservando el `DueDate` vencido
- El incumplimiento al día 5 notifica a los 3 destinos, **no borra** el registro (`RN-ALT-002`) y **sigue alertando** en cadencia semanal (`RN-ALT-051`)

---

## MAPEO FASE 0 → PLAN FORMAL

| Bloque de FASE 0 | Alimenta | Sección del plan |
|:--|:--|:--|
| 0.1 Problem Statement + KPIs | → | 1. Resumen Ejecutivo y 9. Métricas de Éxito |
| 0.2 Matriz RN (Niveles 1-4) | → | 3. Arquitectura y Diseño Técnico |
| 0.3 Pre-Mortem | → | 7. Riesgos y Mitigaciones |
| 0.3 Flujos y criterios de PASO | → | 5. Fases de Ejecución y 6. Criterios de Completitud |

**Regla:** si una sección del plan contradice esta FASE 0, se rechaza. FASE 0 es la fuente de verdad.

---

## CHECKLIST DE VALIDACIÓN DE FASE 0

- [x] Problem Statement en formato Actor → Problema → Acción → Consecuencia → Escala
- [x] KPIs: 7 definidos, cada uno con baseline, target, plazo y método de verificación
- [x] Reglas de negocio: 37 reglas distribuidas en los 4 niveles (7 / 10 / 10 / 10)
- [x] Cada RN numerada `RN-ALT-NNN`
- [x] Cada RN mapeada a ubicación de código o marcada explícitamente como nueva
- [x] Pre-Mortem: 8 supuestos, todos con mitigación y responsable
- [x] Flujos: 5 documentados (feliz, triste, 3 bordes) con criterio de PASO
- [x] Documento autoexplicativo, sin referencias a conversaciones externas
- [x] Sin placeholders ni TODO
- [ ] **Aprobación del dueño del proceso** ← gate abierto

---

## ESTADO DE ESTA FASE 0

- [ ] Problem Statement aprobado
- [ ] KPIs aprobados (K6 pendiente de baseline — bloqueador B4)
- [ ] Roles y permisos aprobados
- [ ] Reglas de negocio (4 niveles) aprobadas
- [ ] Flujos aprobados
- [ ] Pre-Mortem aprobado

**Próximo paso tras aprobación:** `03-riesgos-dependencias.md` (PASO 3).
