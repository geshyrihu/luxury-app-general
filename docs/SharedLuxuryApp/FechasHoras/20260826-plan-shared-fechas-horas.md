# Orquestación — Manejo de Fechas y Horas (remediación transversal)

**Fecha:** 2026-08-26 · **Protocolo:** `AGENTS.md` §Protocolo de Orquestación (mismo esquema que
`20260821-d11-organigrama-roles-orquestacion.md`)
**Origen:** `docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`
(informe completo con evidencia de código, tablas por módulo y el plan de acción de la sección 5).

## Rol de cada agente en este flujo

| Rol | Quién | Hace |
|---|---|---|
| Arquitecto/Auditor/Orquestador | Claude (esta sesión, o cualquier sesión que retome este documento) | Escribe cada prompt, audita el reporte de finalización, registra el veredicto aquí. **No escribe el código final.** |
| Ejecutor | Agente CLI externo (OpenCode / Aider / Claude Code CLI, según lo que el usuario tenga a mano) | Recibe el prompt de un ticket, lo ejecuta exactamente, entrega el reporte de finalización. |
| Aprobador | Usuario | Decide en los puntos donde el diagnóstico exige una decisión de negocio (ver Fase 3), y pega los prompts al ejecutor. |

## Por qué este documento es el mecanismo de continuidad entre sesiones

Este archivo (tablero + bitácora de auditoría al final) es **lo único que debe sobrevivir si se
pierde la sesión de chat.** Si una sesión nueva retoma este trabajo, el procedimiento es:

1. Leer la sección **"Tablero de tickets"** — la columna `Estado` dice exactamente dónde se quedó.
2. Leer la última entrada de **"Auditoría"** (al final, la más reciente) — tiene el veredicto
   completo del último ticket cerrado y qué sigue.
3. Si un ticket quedó `🔄 En ejecución` sin entrada de auditoría, **no asumir que está bien** —
   pedir al usuario el reporte de finalización de ese ticket antes de continuar, o revisar el
   estado real del código (build, grep de los patrones del ticket) antes de redactar el siguiente
   prompt.
4. **Regla de oro (igual que en D-11): el prompt del siguiente ticket se redacta solo después de
   que el anterior esté aprobado**, nunca por adelantado — así cada prompt puede incorporar lo que
   se aprendió en el ticket previo.

No existe un `LEDGER.md` separado para este trabajo — a diferencia de la migración del monolito
(`../../../docs/SharedLuxuryApp/DesignSystem/20260901-changelog-shared-design-system-execution-ledger.md`, que coordina relevos dentro de una sola tarea larga con muchos
archivos), aquí cada ticket es una unidad pequeña y autocontenida con su propio prompt, así que el
tablero + la bitácora de este mismo documento cumplen esa función sin aparato adicional.

---

## Tablero de tickets

### Fase 1 — Backend mecánico, sin riesgo de datos (listo para ejecutar)

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
| **FH-01** | `DateTime.Now` → `DateTime.UtcNow` en los 13 archivos confirmados (informe §2.2) | S | — | ✅ Cerrado (13/13) — con FH-01b + FH-01c |
| **FH-01b** | Corrección: 2 líneas de `CandidateProcessAppService.cs` (agendado de entrevista) deben usar `DateTimeExtension.GetMexicoTime()`, no `DateTime.UtcNow` | XS | FH-01 | ✅ Cerrado — verificado por Claude |
| **FH-01c** | Corrección: 1 ocurrencia de `DateTime.Now` que faltó en el conteo original de FH-01 (`CobranzaOnlineDashboardAppService.cs:1269`) | XS | FH-01 | ✅ Cerrado — verificado por Claude |
| **FH-02** | Unificar `.Parse(`/`DateOnly.Parse(` sin cultura a `.ParseExact(..., CultureInfo.InvariantCulture)` en los 5 archivos / 8 llamadas confirmadas (informe §2.2). Incluía fallback mal elegido en `FundingAppService.cs:730` (`DateTime.UtcNow` → `DateTimeExtension.GetMexicoTime()`). | S | — | ✅ Cerrado — verificado por Claude |
| **FH-03** | Documentar en `conventions/backend/backend-rules.md` (referenciado desde CONVENTIONS.md §4.1) la regla crítica que prohíbe `DateTime.Now`/`DateTime.Today`, con el caso real de FH-01b como diagnóstico. Verificación manual por grep (mismo patrón que la regla de `[FromForm]`/415 ya existente), sin script ni hook nuevo. | S | FH-01c, FH-02, FH-14 | ✅ Cerrado — verificado por Claude |

### Fase 1.5 — Estandarizar `DateTimeExtension` como fuente única de "hoy/ahora" en México

**Hallazgo del usuario (2026-08-26), no estaba en el informe original.** Ya existe
`api/LuxuryApp.Shared/Extensions/DateTimeExtension.cs`, con `GetMexicoTime()`/`GetMexicoDateOnly()`
implementados correctamente (`TimeZoneInfo.ConvertTimeFromUtc`, con fallback Windows/Linux). Se usa
en **41 archivos**, casi siempre como `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`
para poblar campos de fecha de negocio ("hoy" para una solicitud, un registro, etc.).

El problema: otros **~90 archivos** usan en su lugar `DateOnly.FromDateTime(DateTime.UtcNow)` — un
patrón que el informe original (§2.1) marcó como "✅ OK". Es un error de esa auditoría: da el día
calendario **UTC**, no el día calendario de **México**, y durante las 6 horas entre las 18:00 y las
23:59 hora de México, ese patrón devuelve **el día siguiente**. Es la misma familia de bug que
`DateTime.Now` (día equivocado), solo que invisible porque usa `UtcNow` y "parece" correcto.

Confirmado además que FH-01 introdujo una regresión real por esta misma confusión: ver FH-01b.

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
| **FH-12** | `DateOnly.FromDateTime(DateTime.UtcNow)` → `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`, **25 archivos / 35 llamadas** (recontado 2026-08-26: la estimación de "~90 archivos" del informe original era incorrecta). Claude leyó las 35 líneas una por una antes de escribir el prompt; corrección directa, no diagnóstico previo. | M | FH-01b | ✅ Cerrado (25/25 + variante FH-12b) — verificado por Claude |
| **FH-12b** | Corrección: 2 líneas de `PropertyMemberService.cs` (117, 136) con la variante `DateOnly.FromDateTime(asOf ?? DateTime.UtcNow)`, no cubierta por el grep exacto de FH-12 | XS | FH-12 | ✅ Cerrado — verificado por Claude |
| **FH-14** | `DateTime.Today` → `DateTimeExtension.GetMexicoDateOnly()`, 15 archivos / 27 llamadas (nuevo hallazgo, 2026-08-26, detectado al redactar FH-02; no cubierto por el grep original del informe, que solo buscaba `DateTime\.Now\b`). Claude leyó los 27 puntos uno por uno antes de escribir el prompt — todos son "hoy" de negocio en México, sin excepción encontrada; se aplica corrección directa, no diagnóstico previo. Incluye `RecurringTaskGeneratorService.cs:78`, dejado pendiente deliberadamente por FH-02. | S | FH-02 | ✅ Cerrado — verificado por Claude |

### Fase 2 — Backend: campos de auditoría huérfanos (riesgo bajo, migración aditiva)

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
**Recontado 2026-08-26**: las 9 entidades no son homogéneas en riesgo — se investigó cada una
(consumidores por grep, colisiones de nombre, si existe o no un campo `CreatedAt` previo) antes de
escribir el primer prompt, y se dividió en 4 sub-tickets por nivel de riesgo real, no por lote
arbitrario:

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
| **FH-04a** | 4 entidades sin colisión, con `CreatedAt` previo, ≤3 consumidores c/u: `RegistroChecador`, `UserRefreshToken`, `WorkGroup`, `BudgetProposal` (su `CreatedBy` viejo está confirmado muerto, sin ningún uso) | M | — | ✅ Cerrado — verificado por Claude |
| **FH-04b** | 2 entidades sin ningún campo `CreatedAt` previo (solo tienen "actualización"): `DiagramDraw`, `ManualDiagram` — backfill de `CreatedAt` desde el campo de actualización existente, consumidores migrados a `UpdatedAt ?? CreatedAt` | M | FH-04a | ✅ Cerrado (con FH-04b-fix) — verificado por Claude |
| **FH-04b-fix** | Corrección: `DiagramDrawMapping.cs` mapea `DiagramDraw`→`DiagramDrawDTO` por convención sin `.ForMember`; al perder la propiedad `UpdateAt` en la entidad, deja `DiagramDrawDTO.UpdateAt` en `0001-01-01` en 3 endpoints (`GetDiagramByIdAsync`, `CreateDiagramAsync`, `UpdateDiagramAsync`) | XS | FH-04b | ✅ Cerrado — verificado por Claude |
| **FH-04c** | 2 entidades con colisión de nombre real: `Announcement` y `CustomDocument` ya tienen una propiedad de navegación `CreatedBy` (`ApplicationUser`) activamente usada (5 y 4 referencias) — renombrada a `CreatedByUser` con `[ForeignKey(nameof(CreatedById))]` explícito; sin `RenameColumn` en la migración (solo 6 `AddColumn` aditivos) | M | FH-04a | ✅ Cerrado — verificado por Claude |
| **FH-04d** | `Tasks` (entidad legacy) — recontado: **56 ocurrencias en 5 archivos de servicio** (se sumó `RecurringTaskGenerationService.cs`) **+ 6 archivos de test** con fixtures que construyen `Tasks` directamente (hallazgo previo al escribir el ticket, no estaba en el informe). Verificado sin riesgo de AutoMapper (`TasksAddOrEditDTO` no tiene campo de fecha de creación). | M | FH-04a | ✅ Cerrado — verificado por Claude |


### Fase 3 — Backend: `DateTime`→`DateOnly` (riesgo alto de negocio — guardia de datos obligatoria)

Cada ticket de esta fase **solo diagnostica y reporta**, nunca migra directamente — sigue el Caso B
de la sección 5.4 del informe (consulta de distribución horaria antes de decidir). Los tickets de
migración real (`FH-09+`) se redactan **después** de que el usuario decida, por grupo, qué día es
el correcto para los campos que sí tienen variación horaria real.

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
| **FH-05** | Diagnóstico RRHH-Permisos: `LeaveRequest.RequestDate/ApprovalDate`, `LeaveRequestHistory.ChangeDate`, `VacationRequest.RequestDate/ApprovalDate`, `VacationRequestHistory.ChangeDate` | S | — | ✅ Cerrado — decisión: día calendario de México |
| **FH-06** | Diagnóstico Nómina + Mantenimiento: `NominaEncabezado.FechaAprobacion/FechaCierre`, `BitacoraMantenimiento.FechaRegistro` | S | — | ✅ Cerrado — tablas vacías (0 filas), decisión: día calendario de México (consistencia con FH-05) |
| **FH-07** | Diagnóstico Tasks: la entidad legacy `Tasks` (10 campos) + `TaskInstance.ScheduledDate/DueDate/CreatedFromRecurrenceDate` + `TaskMessageReads.ReadingDate` + `TaskWorkPlan.SendDate`. Incluye la pregunta previa: ¿`Tasks` sigue vigente o se retira en favor de `TaskInstance`? | S | — | ✅ Cerrado — ver detalle (decisión mixta por campo) |
| **FH-08** | Diagnóstico del resto de casos sueltos: `MigrationVerificationLog.VerificationDate`, ~~`BudgetProposal.CreatedDate`~~ (obsoleto, ya renombrado a `CreatedAt` por FH-04a), `EstadoFinanciero.UploadDate/AuthorizationDate/SendDate`, `AnnouncementAnalytics.ViewDate`, `AsambleaChecklistExecution.DueDate`, `GoogleCalendarEvent.RecurrenceEndDate`, `ReportSubmissionRecord.RegisterDate`, `EntregaRecepcionCliente.Fecha`, `OrdenCompraComprobantePago.UploadDate`, `RequestEmployeeRegisterFile.UploadDate`, `CollectionActivity.ActivityDate`, ~~`TaskWorkPlan.SendDate`~~ (duplicado del informe original — ya cubierto en FH-07/FH-09c, no repetir aquí) | S | — | ✅ Cerrado — decisión: día calendario de México en los 10 restantes |
| **FH-09a** | RRHH-Permisos: columnas `DateOnly?` aditivas (`RequestDay`/`ApprovalDay`/`ChangeDay`) + backfill vía `AT TIME ZONE` (día México) en las 4 entidades de FH-05. Solo pasos 1-2 de la estrategia de 5 pasos (§5.4) — sin cutover de código todavía | S | FH-05 | ✅ Cerrado — verificado por Claude |
| **FH-09b** | Nómina + Mantenimiento: columnas `DateOnly?` aditivas (`FechaAprobacionDay`/`FechaCierreDay`/`FechaRegistroDay`) + backfill vía `AT TIME ZONE` (día México) en las 2 entidades de FH-06. Tablas vacías hoy — backfill es no-op, pero queda listo para cuando haya datos | S | FH-06 | ✅ Cerrado — verificado por Claude |
| **FH-09c** | Tasks: columnas `DateOnly?` aditivas (`ScheduledDay`, más 8 campos vacíos de `Task`, 3 de `TaskInstance`, 1 de `TaskMessageReads`) + `SendDay` en `TaskWorkPlan` — backfill vía `AT TIME ZONE` (día México). **`ClosedDate` explícitamente excluido** (decisión de negocio: la hora de cierre sí importa, se queda como `DateTime`) | M | FH-07 | ✅ Cerrado — verificado por Claude |
| **FH-09d** | Resto de casos sueltos (10 entidades de FH-08): columnas `DateOnly?` aditivas (`VerificationDay`, `UploadDay`/`AuthorizationDay`/`SendDay` en `EstadoFinanciero`, `ViewDay`, `DueDay`, `RecurrenceEndDay`, `RegisterDay`, `FechaDay`, `UploadDay` en `OrdenCompraComprobantePago`, `UploadDay` en `RequestEmployeeRegisterFile`, `ActivityDay`) + backfill vía `AT TIME ZONE` (día México) | M | FH-08 | ✅ Cerrado — verificado por Claude |
| **FH-09+** | (Sin pendientes — FH-09a/b/c/d cubren la Fase 3 completa) | — | — | ✅ N/A |

### Fase 4 — Frontend: gobierno de `DateService` (sin riesgo de datos, solo presentación) — ✅ COMPLETA (FH-10 a FH-11p, 14 apps, 0 `| date` residuales verificados)

| Ticket | Contenido | Tamaño | Depende de | Estado |
|---|---|:-:|---|:-:|
| **FH-10** | Pipe `apiDate` (envuelve `DateService.parseDate` + `DatePipe`) + regla en CONVENTIONS.md que prohíbe `new Date()`/`formatDate`/`\| date` directos sobre datos del API en componentes de feature | M | — | ✅ Cerrado — verificado por Claude |
| **FH-11a** | `resident.luxuryapp`: migrar `propiedades-form.html` (`Property.DelinquentSince`, único uso de `\| date` en toda la app) a `apiDate` — piloto para validar el patrón antes de escalar | XS | FH-10 | ✅ Cerrado — verificado por Claude |
| **FH-11b** | `committee.luxuryapp` (`ContratoPoliza.StartDate/EndDate`), `compras.luxuryapp` (`fechaSolicitud`, quita workaround `:'UTC'` x2, conserva `CommonModule` por `\| number`), `auth.luxuryapp` (`Credential.SubscriptionExpirationDate`, quita workaround `:'UTC'`) — cierra todas las apps de 1 archivo | S | FH-11a | ✅ Cerrado — verificado por Claude |
| **FH-11c** | `direccion.luxuryapp` (3), `contabilidad.luxuryapp` (3), `system.luxuryapp` (4), `legal.luxuryapp` (4) — 14 archivos, 27 ocurrencias (recontado en auditoría). Incluye caso especial: `ticket-legal-reportes-externos`/`internos` inyectan `DatePipe` programáticamente para formatear `Date` nativos de un selector de rango (no API) — ese uso se conserva sin tocar | M | FH-11b | ✅ Cerrado — verificado por Claude |
| **FH-11d** | `admin.luxuryapp` — 6 archivos, 9 ocurrencias (timestamps de auditoría/bitácora con hora real, sin riesgo de desfase confirmado, migrados por consistencia con la regla de FH-10). Caso especial: `log-api-report` conserva `CommonModule` por `[ngStyle]` | S | FH-11c | ✅ Cerrado — verificado por Claude |
| **FH-11e** | `reclutamiento.luxuryapp` — 7 archivos, 19 ocurrencias (mayoría timestamps de entrevista `DateTime`; `candidate.applicationDate` en 3 puntos es `CandidateProcess.RegisterDate`, `DateOnly` real). `CommonModule`/`DatePipe` reemplazados en los 7; `CurrencyPipe` conservado aparte en uno | M | FH-11d | ✅ Cerrado — verificado por Claude |
| **FH-11f** | `supplier.luxuryapp` — 7 archivos vivos (no 8: `provider-quotation/cuadro-comparativo-list.html` es huérfano, sin ruta ni referencia — excluido, ver detalle), 12 ocurrencias reales (recontadas con búsqueda multilínea, una se perdía en el grep simple por wrap de Prettier) | M | FH-11e | ✅ Cerrado — verificado por Claude |
| **FH-11g** | `cobranza.luxuryapp` — 19 archivos, 34 ocurrencias (recontadas con búsqueda multilínea). 13 workarounds `:'UTC'` a quitar. 2 hallazgos aparte sin relación (pipes `\| json`/`\| slice` usados sin importar, bugs preexistentes) | L | FH-11f | ✅ Cerrado — verificado por Claude |
| **FH-11h** | `mantenimiento.luxuryapp/fire-equipment/` (1ª mitad) — 11 archivos, 30 ocurrencias, sin complicaciones (todo `CommonModule`/`DatePipe` reemplazable directo, 4 conservan `Location`) | L | FH-11g | ✅ Cerrado — verificado por Claude |
| **FH-11i** | `mantenimiento.luxuryapp/logs+inspection+reports` (2ª mitad) — 8 archivos, 20 ocurrencias + 3 llamadas programáticas a `formatDate()` sobre campos del API a convertir. Incluye archivo con bytes NULL preexistentes (`recepcion-pipas-agua-list.ts`) — no tocar la corrupción, solo no empeorarla | M | FH-11h | ✅ Cerrado — verificado por Claude |
| **FH-11j** | `operations.luxuryapp` — 20 archivos, 34 ocurrencias. `CommonModule` reemplazado en 19; conservado en 1 (`announcement-list`, por `\| slice`) | L | FH-11i | ✅ Cerrado — verificado por Claude |
| **FH-11k** | `recursos-humanos.luxuryapp/employee-file-detail.html` — 1 archivo, 25 ocurrencias (el expediente completo del empleado, muchas secciones distintas). Primer ticket de varios para terminar `recursos-humanos.luxuryapp` (30 archivos, 91 ocurrencias en total) | M | FH-11j | ✅ Cerrado — verificado por Claude |
| **FH-11l** | `recursos-humanos.luxuryapp/nomina/` — 6 archivos, 12 ocurrencias. 3 conservan `CommonModule` (por `\| currency` sin `CurrencyPipe` propio); 1 (`modal-dias-no-habiles`) tenía `\| date` sin `CommonModule`/`DatePipe` importado en absoluto (bug preexistente, corregido de paso) | M | FH-11k | ✅ Cerrado — verificado por Claude |
| **FH-11m** | `recursos-humanos.luxuryapp/incidencias-sanciones/` — 4 archivos, 9 ocurrencias. 1 conserva `CommonModule` (`sanction-list`, por `[ngClass]`). 2 archivos con corrupción preexistente de bytes NUL (no tocar). 1 hallazgo `[ngClass]` sin importar (no tocar) | M | FH-11l | ✅ Cerrado — verificado por Claude |
| **FH-11n** | `recursos-humanos.luxuryapp/vacaciones-permisos` — 9 archivos (7 con `.html` + 2 `.ts` con `template:` inline en `shared/`), 25 ocurrencias reales (24 del ticket + 1 hallada por el ejecutor en `[text]="..."`, fuera del alcance del regex `{{ }}` de auditoría), sin workarounds `:'UTC'`. `solicitudes-historial.ts`: `DatePipe` programático legítimo (`onSearch()`) intacto | L | FH-11m | ✅ Cerrado — verificado por Claude |
| **FH-11o** | `recursos-humanos.luxuryapp/contratos+entrevistas+evaluaciones` (clúster final) — 12 archivos, 26 ocurrencias. 2 workarounds `:"UTC"`. Conserva `CommonModule` en 1 (`resultado-evaluacion`, por `\| number`) y `CurrencyPipe` en 1 (`work-contract-detail`). 2 hallazgos de pipe sin importar (`\| currency`, `\| number`) | M | FH-11n | ✅ Cerrado — verificado por Claude |
| **FH-11p** | Limpieza final — 3 gaps residuales de `\| date` en apps ya "cerradas": `reclutamiento.luxuryapp` (1 occ. envuelta, import ya correcto), `operations.luxuryapp/diagram-gallery` (`template:` inline, 1 occ.), `supplier.luxuryapp` (copia huérfana de `cuadro-comparativo-list`, 1 occ., por completitud). **Fase 4 completa: 0 `\| date` en las 14 apps** | S | FH-11o | ✅ Cerrado — verificado por Claude |
| **FH-2Xa** | `cobranza.luxuryapp` — 7 archivos `.dto.ts` (incluye duplicado en `external-compatibility/`) con campos `Date \| string` → `string`. Verificado: formularios ya convierten con `dateS.getDateFormat()` antes de armar el payload; `ChargeTemplateResponseDTO` ya estaba bien tipado (no se toca) | S | FH-11p | ✅ Cerrado — verificado por Claude |
| **FH-2Xb** | 3 bugs reales de escritura (formularios que envían `Date` crudo al API sin `dateS.getDateFormat()`: `employee-personal-data-form`, `modificacion-salario-form`, `status-request-salary-modification-form`) + 4 DTOs genuinos restantes (`pending-item.dto`, `recurring-task-template-catalog`, `RequestSalaryModificationSeedDTO`, `RequestDismissalDraftDTO`) narrowed a `string` | M | FH-2Xa | ✅ Cerrado — verificado por Claude |
| **FH-2X+** | Investigación ampliada: de 50 archivos con `Date \| string` detectados, ~15 son `FormControl` ya seguros (convierten correctamente, cosméticos, decisión: no tocar), ~3 son controles de filtro de rango deliberadamente flexibles (no tocar), ~3 son componentes UI compartidos (`input-date`, no tocar), resto cubierto en FH-2Xa/FH-2Xb. **PROYECTO COMPLETO** — alcance decidido (bug real + DTOs genuinos) cerrado | — | FH-2Xb | ✅ Cerrado |

---

## Prompts entregados

| Ticket | Archivo |
|---|---|
| FH-01 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01-backend-datetimenow-a-utcnow.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01-backend-datetimenow-a-utcnow.md) |
| FH-01b | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01b-correccion-scheduling-mexico-time.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01b-correccion-scheduling-mexico-time.md) |
| FH-01c | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01c-correccion-syncmessage-faltante.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-01c-correccion-syncmessage-faltante.md) |
| FH-02 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-02-backend-parse-invariant-culture.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-02-backend-parse-invariant-culture.md) |
| FH-14 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-14-backend-datetimetoday-a-mexicotime.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-14-backend-datetimetoday-a-mexicotime.md) |
| FH-03 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-03-conventions-prohibir-now-today.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-03-conventions-prohibir-now-today.md) |
| FH-12 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-12-backend-dateonly-utcnow-a-mexicodateonly.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-12-backend-dateonly-utcnow-a-mexicodateonly.md) |
| FH-12b | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-12b-correccion-propertymember-asof.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-12b-correccion-propertymember-asof.md) |
| FH-04a | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04a-backend-iauditable-batch-simple.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04a-backend-iauditable-batch-simple.md) |
| FH-04b | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04b-backend-iauditable-diagramas.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04b-backend-iauditable-diagramas.md) |
| FH-04b-fix | [`../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04b-fix-diagramdraw-automapper.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260826-prompt-shared-fechas-horas-FH-04b-fix-diagramdraw-automapper.md) |
| FH-04c | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-04c-backend-iauditable-announcement-customdocument.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-04c-backend-iauditable-announcement-customdocument.md) |
| FH-04d | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-04d-backend-iauditable-tasks-legacy.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-04d-backend-iauditable-tasks-legacy.md) |
| FH-09a | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09a-backend-dateonly-rrhh-permisos-aditivo.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09a-backend-dateonly-rrhh-permisos-aditivo.md) |
| FH-09b | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09b-backend-dateonly-nomina-mantenimiento-aditivo.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09b-backend-dateonly-nomina-mantenimiento-aditivo.md) |
| FH-09c | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09c-backend-dateonly-tasks-aditivo.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09c-backend-dateonly-tasks-aditivo.md) |
| FH-09d | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09d-backend-dateonly-resto-casos-aditivo.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-09d-backend-dateonly-resto-casos-aditivo.md) |
| FH-10 | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-10-frontend-pipe-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-10-frontend-pipe-apidate.md) |
| FH-11a | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11a-frontend-migrar-resident-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11a-frontend-migrar-resident-apidate.md) |
| FH-11b | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11b-frontend-migrar-committee-compras-auth-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11b-frontend-migrar-committee-compras-auth-apidate.md) |
| FH-11c | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11c-frontend-migrar-direccion-contabilidad-system-legal-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11c-frontend-migrar-direccion-contabilidad-system-legal-apidate.md) |
| FH-11d | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11d-frontend-migrar-admin-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11d-frontend-migrar-admin-apidate.md) |
| FH-11e | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11e-frontend-migrar-reclutamiento-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11e-frontend-migrar-reclutamiento-apidate.md) |
| FH-11f | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11f-frontend-migrar-supplier-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11f-frontend-migrar-supplier-apidate.md) |
| FH-11g | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11g-frontend-migrar-cobranza-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11g-frontend-migrar-cobranza-apidate.md) |
| FH-11h | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11h-frontend-migrar-mantenimiento-fire-equipment-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11h-frontend-migrar-mantenimiento-fire-equipment-apidate.md) |
| FH-11i | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11i-frontend-migrar-mantenimiento-logs-reportes-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11i-frontend-migrar-mantenimiento-logs-reportes-apidate.md) |
| FH-11j | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11j-frontend-migrar-operations-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11j-frontend-migrar-operations-apidate.md) |
| FH-11k | [`../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11k-frontend-migrar-rrhh-employee-file-detail-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260827-prompt-shared-fechas-horas-FH-11k-frontend-migrar-rrhh-employee-file-detail-apidate.md) |
| FH-11l | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11l-frontend-migrar-rrhh-nomina-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11l-frontend-migrar-rrhh-nomina-apidate.md) |
| FH-11m | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11m-frontend-migrar-rrhh-incidencias-sanciones-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11m-frontend-migrar-rrhh-incidencias-sanciones-apidate.md) |
| FH-11n | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11n-frontend-migrar-rrhh-vacaciones-permisos-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11n-frontend-migrar-rrhh-vacaciones-permisos-apidate.md) |
| FH-11o | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11o-frontend-migrar-rrhh-contratos-entrevistas-evaluaciones-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11o-frontend-migrar-rrhh-contratos-entrevistas-evaluaciones-apidate.md) |
| FH-11p | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11p-frontend-migrar-gaps-residuales-apidate.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-11p-frontend-migrar-gaps-residuales-apidate.md) |
| FH-2Xa | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-2Xa-frontend-tipado-estricto-dto-cobranza.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-2Xa-frontend-tipado-estricto-dto-cobranza.md) |
| FH-2Xb | [`../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-2Xb-frontend-bugs-escritura-y-dto-genuinos.md`](./../../../docs/SharedLuxuryApp/FechasHoras/20260828-prompt-shared-fechas-horas-FH-2Xb-frontend-bugs-escritura-y-dto-genuinos.md) |

---

## Auditoría

<!-- Cada ticket cerrado agrega aquí su propia entrada "### Detalle — FH-XX (veredicto)", la más reciente al final, igual que en D-11. No borrar entradas anteriores: son el historial. -->

### Detalle — FH-01 (regresión detectada, corrección en curso)

El ejecutor aplicó los 13 reemplazos indicados. Al revisar el resultado (por aviso del usuario
sobre `DateTimeExtension.cs`, no por verificación propia previa — hallazgo que debí anticipar en el
informe original), se confirmó una regresión real en
`CandidateProcessAppService.cs:1258,2524`: la comparación de agendado de entrevista pasó de
`DateTime.Now.AddMinutes(-30)` a `DateTime.UtcNow.AddMinutes(-30)`, pero el valor comparado
(`scheduledDateTime`/`scheduledAt`) se construye con
`request.ScheduledDate.Value.ToDateTime(request.ScheduledTime.Value)` — hora de pared de México
capturada del formulario, `Kind=Unspecified`, nunca convertida a UTC. Antes del cambio, si el
servidor corría en hora de México, la regla funcionaba por coincidencia; después del cambio, queda
mal en cualquier configuración de servidor.

Verificado también (línea 22 del mismo archivo, `thirtyDaysAgo`/`sevenDaysAgo` contra `ClosedAt`) y
`NotificationUserAppService.cs:117-118` (contra `CreatedAt`) — esos sí comparan contra campos UTC
reales, el reemplazo ahí es correcto, no se tocan.

**Veredicto: ⚠️ Aprobado con corrección obligatoria.** FH-01b corrige las 2 líneas antes de
continuar a FH-02. No se re-audita FH-01 completo — el resto de los 13 puntos y los 4 `TODO`
quedan pendientes de confirmar con el reporte de finalización del ejecutor cuando llegue.

### Detalle — FH-01b (aprobado, verificado independientemente)

El ejecutor entregó reporte de finalización (`reporte-opencode.md`, aportado por el usuario).
Verificación independiente de Claude, no aceptado solo por el reporte:

- Leídas las líneas 1259 y 2525 del archivo real (se desplazaron +1 por el `using` agregado,
  correctamente reportado) — coinciden exactamente con el diff declarado.
- Confirmado `using LuxuryApp.Shared.Extensions;` agregado, sin duplicar el existente
  `using LuxuryApp.Shared.Constants;`.
- `grep -c "DateTime.UtcNow"` sobre el archivo → **17**, coincide con lo reportado.
- `dotnet build api/LuxuryApp.sln` (solución completa, no solo el `.csproj` que usó el ejecutor) →
  falló por bloqueo de archivos del proceso `LuxuryApp.Api` en ejecución (mismo patrón ya conocido
  de auditorías D11) — repetido con `-o .tmp-audit-build` (carpeta aislada): **0 errores**, 128
  advertencias preexistentes no relacionadas.

**Veredicto: ✅ Aprobado.** La regresión de agendado queda corregida.

### Detalle — FH-01 (auditoría independiente, no vía reporte del ejecutor)

Sin reporte de finalización formal de FH-01 en mano, Claude verificó directamente contra el
código (no se acepta ningún ticket solo por inferencia):

- `grep` de `DateTime\.Now\b` sobre los 13 archivos del ticket → **1 ocurrencia restante**,
  `CobranzaOnlineDashboardAppService.cs:1269` (`SyncMessage` de `BuildFallbackDashboardAsync`) — no
  es un fallo del ejecutor: el prompt original de FH-01 listaba para ese archivo las líneas "265,
  790, 994, 1638, 1912" y omitió la 1269 por error de transcripción de Claude al redactar el
  ticket, pese a que esa línea sí aparecía en la evidencia original de la auditoría del informe.
- Los 4 `TODO(FH-01)` están presentes y en los archivos/líneas correctos.
- `node scripts/audit-conventions.mjs` → **10 errores**, el baseline conocido y estable de este
  repo (mismo valor citado en las auditorías D11-04/05/06) — sin regresión.
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → **0 errores**.

**Veredicto: 🟡 12/13 puntos correctos. FH-01c entregado para el punto faltante.** No se cierra
FH-01 hasta que FH-01c quede aprobado.

### Detalle — FH-01c (aprobado, verificado independientemente) — FH-01 cerrado

El ejecutor entregó reporte de finalización. Verificación independiente de Claude:

- Leída la línea 1269 real del archivo → `DateTime.UtcNow`, coincide con el diff declarado.
- Leído el `TODO(FH-01)` de la línea 790 → actualizado para incluir "1269" en la lista, coincide.
- `grep "DateTime\.Now\b" \| "TODO(FH-01)"` sobre el archivo → 0 y 1 respectivamente, coincide.
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` (aislado, evita el bloqueo del proceso
  `LuxuryApp.Api` en ejecución) → **0 errores**, 128 advertencias preexistentes.

**Veredicto: ✅ Aprobado.**

**FH-01 queda cerrado por completo: 13/13 puntos correctos** (12 del ticket original + 1 vía
FH-01c), con la regresión de agendado corregida vía FH-01b. Sigue **FH-02** (unificar `.Parse(`
sin cultura a `.ParseExact(..., CultureInfo.InvariantCulture)`).

### FH-02 — prompt entregado, con verificación previa del riesgo de FH-01b

Antes de redactar el prompt se verificó, archivo por archivo, si alguno de los 5 puntos de FH-02
tenía el mismo riesgo que causó la regresión de FH-01b (comparar un valor de negocio en hora de
México contra una función pensada para UTC):

- `VacationRequestApprovalEndPoints.cs:53`, `LeaveRequestApprovalEndPoints.cs:45`,
  `RequestSalaryModificationAppService.cs:58`: confirmado por lectura del código y del frontend
  (`DateService.getDateFormat()`) que son `DateOnly` puro (`"yyyy-MM-dd"`, sin componente de hora)
  — sin riesgo de huso horario, solo cultura.
- `RecurringTaskGeneratorService.cs:82,88`: confirmado leyendo `IHolidayService.cs` completo que
  `h.Start` siempre es `"yyyy-MM-dd"` — mismo caso, solo cultura. De paso se detectó
  `DateTime.Today` en la línea 77 del mismo archivo (mismo problema de fondo que `DateTime.Now`,
  no cubierto por el grep original del informe) — **no se mete en este ticket**, se registra como
  hallazgo nuevo (FH-14) para no repetir el error de alcance de FH-01.
- `FundingAppService.cs:730`: **sí tiene el mismo riesgo.** Parsea el atributo `Fecha` de un CFDI
  (factura fiscal mexicana), que representa hora local del emisor (México), no UTC. El fallback
  actual (`DateTime.UtcNow.ToString()`) está mal por la misma razón que la línea de
  `CandidateProcessAppService.cs` en FH-01b. Corregido en el prompt: `DateTimeExtension.GetMexicoTime()`.

**Corrección de alcance:** el ticket se venía describiendo como "6 puntos" en el tablero y en la
conversación con el usuario — es incorrecto, son **5 archivos, 8 llamadas** (2+2+1+2+1). Ya
corregido en la fila de la tabla de arriba.

### Detalle — FH-02 (aprobado, verificado independientemente)

El ejecutor entregó reporte de finalización. Verificación independiente de Claude (lectura directa
de los 5 archivos, no solo el reporte):

- `VacationRequestApprovalEndPoints.cs:55` y `LeaveRequestApprovalEndPoints.cs:47` →
  `DateOnly.ParseExact(startDate/endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture)`, coincide.
- `RequestSalaryModificationAppService.cs:59` → coincide.
- `RecurringTaskGeneratorService.cs:81-90` → `holidays` es ahora `HashSet<DateOnly>`, ambas
  llamadas a `.Select(h => DateOnly.ParseExact(...))` coinciden, `var today = DateTime.Today;`
  (línea 78) **intacto** como se pidió, y el único ajuste de compilación derivado
  (`holidays.Contains(DateOnly.FromDateTime(occurrenceDate))`, línea 138) es correcto y mínimo.
- `FundingAppService.cs:732-734` → `DateTime.ParseExact(..., "yyyy-MM-ddTHH:mm:ss",
  CultureInfo.InvariantCulture)` con fallback `DateTimeExtension.GetMexicoTime()`, coincide. El
  ejecutor reportó honestamente que no encontró ninguna muestra real de CFDI en `api/Tests/` para
  verificar el formato — usó el formato SAT estándar indicado en el prompt, como se preveía.
- `grep "DateOnly\.Parse(\|DateTime\.Parse("` sobre los 5 archivos → 0 líneas.
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline, sin regresión).
- `node scripts/scan-mojibake.mjs api` → **68 ocurrencias** (baseline, sin regresión).
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → **0 errores**.

**Veredicto: ✅ Aprobado, sin corrección.** Sigue **FH-03** (regla de convención que prohíba
`DateTime.Now`/`DateTime.Today`).

### FH-14 — decisión de saltar el diagnóstico previo

El tablero preveía FH-14 como "solo diagnóstico" (mismo patrón cauteloso que FH-05/06/07/08/12).
Al redactar el prompt, Claude leyó directamente los 27 puntos (15 archivos) en vez de delegar esa
lectura a un ejecutor en un ticket separado — el volumen era manejable y cada punto se pudo
clasificar con certeza (todos alimentan cálculos de fecha de negocio: alta de empleado, corte de
cobranza, quincena de nómina, vencimiento de contrato, agenda semanal; ninguno es un caso técnico
ambiguo). Por eso FH-14 se entrega como corrección directa, no como diagnóstico + ticket de
migración separado — a diferencia de FH-05/06/07/08/12, donde el volumen (~90 archivos en FH-12) o
la necesidad real de una decisión de negocio (Fase 3, `DateTime`→`DateOnly`) sí justifican
mantener el paso de diagnóstico separado.

### Detalle — FH-14 (aprobado, verificado independientemente)

El ejecutor entregó reporte de finalización. Verificación independiente de Claude:

- `grep "DateTime\.Today\b"` sobre todo `LuxuryApp.Application` → **1 sola coincidencia**, en
  `AspelCobranzaHausLive/Docs/documentacion-endpoints-aspel-cobranza.md` (documentación, fuera de
  alcance, tal como preveía el ticket). Cero en código.
- Verificados directamente los 3 casos con matiz de tipo: `TaskInstancesEndPoints.cs:20`
  (`date ?? DateTimeExtension.GetMexicoDateOnly()`, tipo `DateTime` preservado),
  `AgendaSemanalAppService.cs:15,31` (ambos casos, tipo preservado),
  `RecurringTaskGeneratorService.cs:78` (`var today = DateTimeExtension.GetMexicoDateOnly();`,
  sigue siendo `DateTime`, compatible con `.Year`/`.AddDays(7)` de las líneas siguientes).
- Verificado que no hay `using` duplicado en `CandidateProcessAppService.cs` ni
  `RequestEmployeeRegisterAppService.cs` (ya lo tenían).
- Verificado que `AspelCobranzaHausDetalleAppService.cs` conserva intacto el `FechaCargo`/
  `TODO(FH-01)` de FH-01 (se corrió de línea 243 a 245-246 solo por la inserción del `using` en el
  mismo archivo, contenido idéntico).
- `PeriodoNominaAppService.cs:290` (el de mayor impacto, determina quincena) → correcto.
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → **0 errores**.
- `node scripts/audit-conventions.mjs` → **10** (baseline, sin regresión).
- `node scripts/scan-mojibake.mjs api` → **68** (baseline, sin regresión).

**Veredicto: ✅ Aprobado, sin corrección.**

### Detalle — FH-03 (aprobado, verificado independientemente)

El ejecutor entregó el diff en forma resumida (con "..." en vez del texto literal completo, pese a
que el ticket pedía el diff exacto) — Claude no aceptó el resumen como prueba y leyó directamente
el archivo completo (líneas 304-383):

- La nueva sección `## 🔴 REGLA CRÍTICA: Fechas y horas...` coincide carácter por carácter con el
  contenido especificado en el ticket: regla explícita, bloque de ejemplos ✅/❌, reglas derivadas,
  el caso real de FH-01b como diagnóstico, y el bloque de validación por grep.
- Nivel de encabezado correcto (`##`, no `###`) — el ejecutor notó y resolvió correctamente una
  inconsistencia real del archivo (la sección vecina "DisplayName en Español" está en `###`, un
  nivel más anidado de lo que su propio contenido sugiere) siguiendo el contenido literal del
  ticket en vez de imitar ciegamente el vecino.
- Ubicación correcta: después de "DisplayName en Español", antes de "Prohibiciones clave".
- La línea nueva en "Prohibiciones clave" coincide.
- `grep "DateTime.Now\|DateTime.Today"` sobre el archivo → 10 líneas, todas dentro de la sección
  nueva — confirmado, ninguna fuera.
- `node scripts/audit-conventions.mjs` → **10** (baseline, sin regresión).
- Confirmado por timestamp de archivo que ningún `.cs` en `LuxuryApp.Application`/`Api` tiene fecha
  de modificación posterior a `backend-rules.md` — no se tocó código.

**Veredicto: ✅ Aprobado, sin corrección.**

Con esto, toda la **Fase 1 y Fase 1.5 parcial** quedan cerradas: FH-01/01b/01c, FH-02, FH-03, FH-14.
Pendiente en Fase 1.5: **FH-12** (diagnóstico de los ~90 archivos `DateOnly.FromDateTime(DateTime.UtcNow)`).
Pendiente en Fase 2: **FH-04**. Pendiente en Fase 3: **FH-05 a FH-08** (diagnóstico, gated por
decisión de negocio). Pendiente Fase 4 completa (frontend).

### FH-12 — decisión de saltar el diagnóstico previo (mismo criterio que FH-14)

Al recontar el patrón real (`grep` exacto, no la estimación del informe), el alcance bajó de "~90
archivos" a **25 archivos / 35 llamadas** — manejable para que Claude leyera las 35 ocurrencias
directamente antes de redactar el prompt, igual que en FH-14. Todas resultaron ser "hoy" de negocio
en México sin excepción (vencimiento de contrato/inspección, antigüedad de vacaciones, mora,
cartera vencida, alta de miembro de propiedad, fecha de firma, fecha de resolución de incidente).
Por eso FH-12 se entrega como corrección directa, no como diagnóstico + ticket de migración
separado. La entrada del tablero (Fase 1.5, arriba) ya quedó corregida con el conteo real.

### Detalle — FH-12 (25/25 archivos correctos, 1 variante fuera de alcance → FH-12b)

El ejecutor entregó reporte de finalización. Verificación independiente de Claude:

- Confirmado por lectura directa de `LuxuryApp.Application.csproj:86` que
  `LuxuryApp.Shared.Extensions` es un global using del proyecto — el hallazgo del ejecutor es
  correcto; explica por qué los `using` explícitos agregados en FH-01b/FH-02/FH-14 eran redundantes
  (no incorrectos, solo innecesarios — no causaron ningún error de build en ninguna auditoría).
- `grep "DateOnly\.FromDateTime\(DateTime\.UtcNow\)"` sobre `LuxuryApp.Application` → 0 archivos.
- `PropertyMemberService.cs:558` (rama `?` del ternario) confirmado intacto, solo la rama `:`
  (línea 559) fue tocada, como se pidió.
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → 0 errores.
- `audit-conventions.mjs` (10) / `scan-mojibake.mjs` (68) sin regresión.

**Hallazgo propio de Claude, no reportado por el ejecutor (quien sí lo detectó y correctamente no
lo tocó):** `PropertyMemberService.cs:117,136` tienen `DateOnly.FromDateTime(asOf ?? DateTime.UtcNow)`
— misma familia de bug (cuando `asOf` es null, el caso común de "responsable financiero ahora"),
pero el grep de FH-12 solo buscaba la subcadena exacta sin la variante `?? DateTime.UtcNow`. Grep
adicional confirmó que son las únicas 2 ocurrencias de esta variante en todo `LuxuryApp.Application`
— alcance acotado, no un patrón grande sin cubrir.

**Veredicto: 🟡 25/25 del alcance original correctos. FH-12b entregado para las 2 líneas fuera de
ese alcance.** No se cierra FH-12 hasta que FH-12b quede aprobado.

### Detalle — FH-12b (aprobado, verificado independientemente) — FH-12 cerrado

El ejecutor entregó reporte de finalización. Verificación independiente de Claude:

- Leídas directamente las líneas 117 y 136 del archivo real → ambas usan
  `DateOnly.FromDateTime(asOf ?? DateTimeExtension.GetMexicoDateOnly())`, coincide.
- `grep "DateTime.UtcNow\|DateTimeExtension"` sobre el archivo completo → 9 líneas totales, todas
  usando `DateTimeExtension.GetMexicoDateOnly()`, ninguna con `DateTime.UtcNow` restante. La rama
  `?` del ternario (línea 558, `owner.StartDate.Value`) confirmada intacta.
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → 0 errores.
- `audit-conventions.mjs` (10) / `scan-mojibake.mjs` (68) sin regresión.

**Veredicto: ✅ Aprobado, sin corrección.**

Con esto, **FH-12 queda cerrado por completo** (25/25 del alcance original + la variante de
FH-12b). Toda la **Fase 1 y Fase 1.5 completas**. Pendiente: **FH-04** (Fase 2), **FH-05 a FH-08**
(Fase 3, diagnóstico gated por decisión de negocio), y **Fase 4 completa** (frontend).

### Detalle — FH-04a (aprobado, verificado independientemente)

El ejecutor entregó reporte de finalización completo. Verificación independiente de Claude, no
aceptada solo por el reporte:

- Leídas las 4 entidades completas (`RegistroChecador.cs`, `UserRefreshToken.cs`, `WorkGroup.cs`,
  `BudgetProposal.cs`) → coinciden exactamente con el bloque `IAuditable` especificado, mismo estilo
  que `RecruitmentSourceCatalog.cs`. `ITenantEntity`/`UserCreateId`/`UserCreate` conservados donde
  correspondía.
- `ChekadorEmpleadosAppService.cs`: confirmado que `CreadoEn = ahora,` se eliminó y que `ahora`
  sigue usándose en `FechaHora = ahora` — no quedó variable huérfana.
- `TaskGroupAppService.cs`: línea 80 (`x.CreatedAt,`), línea 102 (lado derecho `x.CreatedAt`, lado
  izquierdo del DTO `DateCreation` intacto, confirmado también en `TaskGroupDTO.cs:13`), línea 130
  (`DateCreation = DateTime.UtcNow,`) confirmada eliminada del inicializador de `new WorkGroup`.
- `BudgetProposalService.cs`: 0 ocurrencias de `CreatedDate` — ambas líneas eliminadas.
- **Hallazgo real del ejecutor, verificado y aceptado**: 2 archivos de test
  (`RecurringTaskComplianceAppServiceTests.cs`, `RecurringTaskGenerationServiceTests.cs`)
  referenciaban `WorkGroup.DateCreation` y no compilaban — fuera del alcance grep original del
  ticket (que solo cubría `Application`/`Infrastructure.Data`), corregidos a `CreatedAt`,
  confirmados en el archivo real.
- Migración `20260827043846_OrphanAuditFieldsBatchA.cs` leída completa: los 4 `RenameColumn` (no
  drop+add), 11 `AddColumn` con tipos y nulabilidad exactos al patrón establecido
  (`nvarchar(max)`/`datetime2`, `nullable: true`), `BudgetProposals` correctamente sin duplicar
  `CreatedBy`. `Down()` revierte simétrico.
- Confirmado que no quedó ningún `.csproj.bak` en `LuxuryApp.Infrastructure.Data/` tras la maniobra
  D1 del ejecutor (renombrar temporalmente `LuxuryApp.DataContext.csproj` para que `dotnet ef`
  resolviera el proyecto correcto).
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → 0 errores.
- `audit-conventions.mjs` (10) / `scan-mojibake.mjs` (68) sin regresión.

**Veredicto: ✅ Aprobado, sin corrección.** Sigue **FH-04c** (colisión de nombres en `Announcement`/
`CustomDocument`) o **FH-04d** (`Tasks` legacy, ~40 referencias) — a decidir cuál primero.

### Detalle — FH-04b (entidades/servicios/migración correctos, 1 regresión real → FH-04b-fix)

El ejecutor entregó reporte de finalización completo y correcto en todo lo que el ticket pedía
explícitamente. Verificación independiente de Claude: las 2 entidades, los 2 archivos de servicio,
y la migración `20260827045121_OrphanAuditFieldsBatchB.cs` (leída completa) coinciden exactamente
con lo especificado — secuencia de 6 pasos correcta, sin `DateTime.MinValue`, `ManualPasoDTO`
correctamente sin tocar (confirmado que no hay mapeo hacia ese campo). Build 0 errores,
`audit-conventions`/`scan-mojibake` en baseline.

**Hallazgo propio de Claude, no cubierto por el ticket original ni detectado por el ejecutor:**
`DiagramDrawMapping.cs:8` — `CreateMap<DiagramDraw, DiagramDrawDTO>()` sin `.ForMember`, mapeo por
convención de nombres. Antes de FH-04b, `DiagramDraw.UpdateAt` coincidía en nombre con
`DiagramDrawDTO.UpdateAt` y AutoMapper los enlazaba solo. FH-04b dividió `UpdateAt` en
`CreatedAt`/`UpdatedAt` en la entidad — ningún nombre coincide ya, así que AutoMapper deja
`DiagramDrawDTO.UpdateAt` en `0001-01-01` (su valor por defecto) en 3 de los 4 métodos del
servicio (`GetDiagramByIdAsync`, `CreateDiagramAsync`, `UpdateDiagramAsync` — todos los que usan
`mapper.Map<DiagramDrawDTO>(...)`). Solo `GetDiagramsAsync` (que construye el DTO a mano) queda
bien. Este tipo de bug **no lo detecta `dotnet build`** — AutoMapper resuelve el mapeo en tiempo de
ejecución, no en compilación. `ManualDiagram` no tiene este riesgo (confirmado: no existe ningún
`CreateMap<ManualDiagram, ...>` en el proyecto, toda su serialización es manual).

**Lección para futuros tickets FH-04c/FH-04d (y cualquier renombrado de propiedad de entidad):**
antes de cerrar un ticket que renombra un campo de entidad, hay que buscar también
`CreateMap<Entidad,` en `**/Mapping/**` (no solo los consumidores directos vía `.` grep) — un
mapeo por convención sin `.ForMember` es invisible al build y a los greps de "¿quién usa
`.NombreViejo`?", porque AutoMapper no referencia el nombre viejo, simplemente deja de encontrarlo.

**Veredicto: 🟡 FH-04b no se cierra hasta que FH-04b-fix quede aprobado.**

### Detalle — FH-04b-fix (aprobado, verificado independientemente) — FH-04b cerrado

El ejecutor entregó reporte de finalización. Verificación independiente de Claude: leído
`DiagramDrawMapping.cs` completo → `CreateMap<DiagramDraw, DiagramDrawDTO>()` tiene el
`.ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt))`
exacto, los otros 2 `CreateMap` intactos. `dotnet build api/LuxuryApp.sln` → 0 errores.
`audit-conventions.mjs` (10) / `scan-mojibake.mjs` (68) sin regresión.

**Hallazgo adicional del ejecutor, no solicitado pero relevante:** no existe en el repo ningún
test que llame `AssertConfigurationIsValid()` sobre los perfiles de AutoMapper — ese es
precisamente el mecanismo que habría detectado este bug en CI/test en vez de en auditoría manual.
Queda anotado como gap de cobertura, fuera del alcance de esta orquestación de fechas/horas (no se
abre ticket propio aquí).

**Veredicto: ✅ Aprobado, sin corrección.** **FH-04b queda cerrado por completo.**

Con esto, la **Fase 2 completa hasta ahora: FH-04a ✅, FH-04b ✅**. Pendientes: **FH-04c**
(`Announcement`/`CustomDocument`, colisión de nombre con `CreatedBy`) y **FH-04d** (`Tasks`
legacy, ~40 referencias) — el usuario indicó que se harán todos, orden a definir por Claude.

### Detalle — FH-04c (aprobado, verificado independientemente)

El ejecutor entregó reporte de finalización completo, incluyendo 3 correcciones fuera de lo
enumerado literalmente en el ticket pero necesarias para compilar (D1): `OrderByDescending` x2 y
una asignación manual redundante en `AnnouncementAppService.cs`, 2 asignaciones redundantes en
`CustomDocumentAppService.cs`, y — el hallazgo más valioso — `BoardDirectorsAppService.cs:34,582`
en `LegalLuxuryApp` (módulo no mencionado en el ticket) que consultaba `CustomDocument.CreateAt`
directamente.

Verificación independiente de Claude, aplicando explícitamente la lección de FH-04b-fix (revisar
`CreateMap<Entidad,` antes de aprobar cualquier rename):
- Leídas las 2 entidades completas: bloque `IAuditable` correcto, `CreatedByUser` con
  `[ForeignKey(nameof(CreatedById))]`, `CreatedById` intacto.
- `AnnouncementAppService.cs` completo (675 líneas): las 3 `.Include(a => a.CreatedByUser)`, las 2
  `OrderByDescending(a => a.CreatedAt)`, sin ninguna asignación manual a `CreateAt`/`CreatedAt`
  restante.
- **Chequeo específico de AutoMapper** (`CreateMap<Announcement, AnnouncementDTO>()`, sin
  `.ForMember`): `AnnouncementDTO.CreatedAt` ya tenía ese nombre exacto desde antes de este ticket
  — el mapeo por convención estaba roto desde antes (`CreateAt` de la entidad vs `CreatedAt` del
  DTO no coincidían) y el rename de este ticket lo **corrigió de rebote**, sin introducir ninguna
  regresión nueva. Confirmado también que `AnnouncementListDTO`/`AnnouncementAdminListDTO` no
  tienen ningún campo `CreateAt`/`CreatedAt` (solo `PublishedAt`/`ExpirationDate`, sin tocar).
- `CustomDocument`: confirmado que no existe ningún `CreateMap<CustomDocument, ...>` en todo el
  proyecto — toda su serialización es manual (`CustomDocumentAppService.cs` leído completo), sin
  riesgo de AutoMapper.
- `CommitteeCustomDocumentDTO.CreateAt` (módulo `CommitteeLuxuryApp`, campo `string`): confirmado
  que se llena vía una proyección anónima intermedia (`CustomDocumentAppService.GetAllByCustomerAsync`
  ya construye `CreateAt = d.CreatedAt.ToString(...)`) + un round-trip de JSON — nunca referencia el
  nombre de la propiedad de la entidad directamente, así que es inmune al rename.
- Migración `20260827123716_OrphanAuditFieldsBatchC.cs` leída completa: exactamente 6
  `AddColumn` (nullable: true), sin `RenameColumn` ni cambios de FK — coincide con el criterio.
- `BoardDirectorsAppService.cs:34,582` verificadas: `d.CreatedAt`, correcto.
- Sin `.bak` colgado. `dotnet build api/LuxuryApp.sln` → 0 errores. `audit-conventions.mjs` (10) /
  `scan-mojibake.mjs` (68) sin regresión.

**Veredicto: ✅ Aprobado, sin corrección.**

Con esto, **FH-04a, FH-04b y FH-04c cerrados**. Queda **FH-04d** (`Tasks` legacy, ~40 referencias
en 4 archivos) para completar la Fase 2 por completo.

### Detalle — FH-04d (aprobado, verificado independientemente) — FH-04d cerrado

El ejecutor reportó 5 puntos pendientes/sin confirmar en su propio informe. Verificación
independiente de cada uno:

1. **`Tasks.cs` → `IAuditable`.** Leído directamente: `public class Tasks : GuidIdEntity,
   IAuditable`, bloque de 4 propiedades estándar, `CreateDate` renombrado a `CreatedAt`. Correcto.

2. **Tabla física `"Task"` (singular) en la migración, no `"Tasks"`.** El ejecutor marcó esto
   como "pendiente confirmar" porque el atributo `[Table("Tasks")]` en la entidad sigue diciendo
   plural. Investigado a fondo: existe `TasksConfiguration : IEntityTypeConfiguration<Tasks>`
   (`api/LuxuryApp.Infrastructure.Data/Data/EntityConfigurations/Operaciones/TasksConfiguration.cs`)
   con `builder.ToTable("Task")` explícito — Fluent API tiene precedencia sobre el atributo de
   datos. Este override está presente desde al menos la migración `20260810004746_JobVacancyRequests`
   (17 migraciones atrás), es decir, es una discrepancia preexistente y deliberada, no algo que
   FH-04d introdujo. El ejecutor usó correctamente `table: "Task"` en el `RenameColumn`/`AddColumn`
   (coherente con el snapshot real del modelo); mi ticket original asumía `"Tasks"` por el atributo
   y esa asunción era la equivocada. **No requiere corrección.**

3. **3 archivos `.cshtml` con `@ticket.CreateDate` / `@Model.CreateDate`.** Leídas las 3
   ViewModels (`TicketMessageEmailViewModel`, `ReportPendingTicketGroupEmailViewModel` →
   `TicketInfo`, `TaskNotificationEmailViewModel` → `TicketInfo`): en las 3, `CreateDate` es un
   `string` propio de la ViewModel (no la entidad), poblado en los 3 call sites
   (`ScheduledTaskService.cs:113`, `EmailMessageAppService.cs:111`,
   `ScheduledTaskEmailService.cs:125`) vía `entity.CreatedAt.ToString(...)` / `t.CreatedAt.ToString(...)`
   — ya correctamente actualizados para leer `.CreatedAt` de la entidad. El nombre `CreateDate` en
   la ViewModel es un campo propio e independiente que no necesita renombrarse. **Sin riesgo, sin
   regresión.**

4. **4 líneas "revertidas" en `TaskAppService.cs` (322/384/562/608).** Confirmado: son lecturas de
   `x.CreateDate` sobre los DTOs proyectados (`TasksItemDTO`, `MyRequestTasksDTO`,
   `MyAssignedTasksDTO`, `TaskMonitoringDTO`), no sobre la entidad — los mismos DTOs asignan
   `CreateDate = x.CreatedAt` en las líneas 306/366/532/588 (entidad → DTO). Correcto tal como lo
   describió el ejecutor.

5. **9 archivos extra renombrados + `RecurringTaskSchedulerJob.cs:54` (4º inicializador).**
   `RecurringTaskSchedulerJob.cs` leído completo: el bloque `new Tasks { ... }` (líneas 46-58) no
   tiene ninguna asignación a `CreateDate`/`CreatedAt` — limpio, `IAuditable` lo puebla
   automáticamente vía `SaveChangesAsync`. Grep global de `CreateDate` en todo `api/` confirma que
   las únicas ocurrencias restantes son: DTOs con su propio campo `CreateDate` (nombre de
   propiedad propio, no de la entidad), snapshots de migraciones históricas (congelados,
   correctos), y las 3 ViewModels/`.cshtml` ya verificadas como seguras. **Cero lecturas de
   `Tasks.CreateDate` sobreviven en el código de producción.**

Verificación mecánica propia (no solo el reporte del ejecutor):
- `dotnet build api/LuxuryApp.sln -o .tmp-audit-build` → **0 errores** (incluye `LuxuryApp.Tests`).
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline sin cambio, no relacionados).
- `node scripts/scan-mojibake.mjs api` → **68 ocurrencias** (baseline sin cambio; el nuevo archivo
  de migración `OrphanAuditFieldsBatchD.cs` no aparece en la lista → sin BOM nuevo).

**Veredicto: ✅ Aprobado, sin corrección.** Los 5 puntos que el ejecutor dejó como pendientes
quedan todos resueltos: 4 eran falsos positivos (comportamiento correcto mal etiquetado como
"sin confirmar") y 1 (conteo `SELECT COUNT(*) FROM Tasks`, bloqueado por auth de SQL Server) no
es bloqueante para el veredicto de código — es una verificación operativa a correr por el Tech
Lead antes de `dotnet ef database update` en el entorno real, junto con el resto de la migración
acumulada de la Fase 2 (Batches A-D).

Con esto, **Fase 2 completa: FH-04a ✅, FH-04b ✅ (+ FH-04b-fix ✅), FH-04c ✅, FH-04d ✅**. Las 9
entidades huérfanas de `IAuditable` identificadas en el informe original ya implementan la
interfaz. Sigue la **Fase 3** (FH-05 a FH-08, diagnóstico `DateTime`→`DateOnly`, condicionada a
decisiones de negocio por entidad) o la **Fase 4** (frontend) — a decidir orden.

### Incidente post-cierre — despliegue real de las migraciones acumuladas (Batches A-D)

El usuario restableció la base de datos real (`LuxuryBuildingGroup`) y la dejó aplicada solo hasta
`AddPasswordRecoveryCodes` (2026-08-25) — es decir, **ninguna de las migraciones de la Fase 2**
(Batches A-D) estaba aplicada todavía. Al arrancar la app (auto-migrate en `Program.cs:212`), la
migración `OrphanAuditFieldsBatchB` falló con error SQL 15248 (`sp_rename` ambiguo) en
`[Diagrams].[Fecha de Actualización]`. El usuario intentó resolverlo eliminando las 4 migraciones
individuales (A/B/C/D) y regenerando una sola `OrphanAuditFieldsBatchABCD` — el mismo error
persistió (mismo statement, distinto `newName`).

**Diagnóstico (Claude, verificado contra la BD real vía consulta que corrió el usuario en SSMS):**

1. **Causa raíz del error 15248:** el nombre físico real de la columna en SQL Server es
   `Fecha de Actualización` (mojibake — doble codificación UTF-8/CP1252 de la "ó"), confirmado con
   `SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Diagrams')` (collation de la BD:
   `Modern_Spanish_CI_AS`). El literal en el código C# (`Fecha de Actualización`, con "ó" real)
   nunca coincidió con la columna física — por eso `sp_rename` no podía resolver el objeto sin
   importar a qué se renombrara.

2. **Bug semántico adicional en `OrphanAuditFieldsBatchABCD` regenerada** (no relacionado con el
   punto 1, encontrado en revisión independiente): al borrar y re-scaffoldear las 4 migraciones en
   una sola pasada, EF generó un diff automático que **invirtió el mapeo semántico** de
   `Fecha de Actualización` (Diagrams) y `ActualizadoEn` (ManualFlows) — ambos son, por nombre,
   timestamps de "última actualización", pero el diff los mapeó a `CreatedAt` en vez de `UpdatedAt`,
   y agregó `UpdatedAt` como columna nueva **sin backfill** (habría quedado `NULL` en todas las
   filas existentes, perdiendo el historial real de última actualización). La migración original
   escrita a mano (Batch B, ya auditada y aprobada) sí tenía el mapeo correcto con backfill; el
   auto-scaffold no preservó esa intención semántica. Esto nunca llegó a aplicarse contra la BD real
   (el error 15248 bloqueó el `Up()` antes de llegar a ese statement, y EF hace rollback transaccional
   de toda la migración fallida), así que no hubo pérdida de datos — pero se habría producido en el
   siguiente intento si no se corregía.

**Corrección aplicada por Claude** (reescritura completa de
`api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260827133516_OrphanAuditFieldsBatchABCD.cs`,
sin tocar el `.Designer.cs` — el modelo actual ya no tiene ningún `HasColumnName` legacy para
Diagrams, así que el snapshot no necesitaba cambios):

- `Fecha de Actualización`/`ActualizadoEn` → `UpdatedAt` (no `CreatedAt`), restaurando el mapeo
  semántico correcto.
- `CreatedAt` nuevo para Diagrams/ManualFlows: aditivo nullable → `UPDATE ... SET CreatedAt =
  UpdatedAt` (backfill) → `AlterColumn` a `NOT NULL` — mismo patrón seguro que Batch B original.
- **La columna de Diagrams se resuelve por SQL dinámico** (`sys.columns` + `LIKE
  N'Fecha de Actualizaci%'` + `sp_rename` vía variable), en vez de hardcodear el byte corrupto
  `ó` como literal C#. Motivo: `scripts/scan-mojibake.mjs` (gate de `pre-push`, corre sobre `api/`)
  marca ese literal como mojibake y `fix-mojibake.mjs` lo "corregiría" de vuelta a `ó`, rompiendo la
  migración otra vez. Confirmado con `node scripts/scan-mojibake.mjs api`: el archivo `.cs` corregido
  da 0 coincidencias.
- `Down()`: el rollback de Diagrams usa un nombre ASCII limpio nuevo (`FechaDeActualizacionLegacy`)
  en vez de intentar reproducir el nombre corrupto original — `Down()` es una ruta de emergencia, no
  necesita ser byte-idéntica al estado previo.

**Verificación propia:** `dotnet build api/LuxuryApp.sln` → 0 errores. `audit-conventions.mjs` → 10
(baseline sin cambio). `scan-mojibake.mjs api` → el archivo `OrphanAuditFieldsBatchABCD.cs` no
aparece en los resultados (solo su `.Designer.cs` conserva el BOM preexistente, igual que el resto
del historial de migraciones).

**Pendiente (le corresponde al usuario, no a Claude — sin acceso a la BD real):** reintentar el
arranque de la app con la migración corregida y confirmar que `OrphanAuditFieldsBatchABCD` aplica
limpio contra `LuxuryBuildingGroup`.

**Resuelto (2026-08-27):** el usuario reintentó el arranque — `logs.txt` sin errores, migración
aplicada limpia. Conteo de filas en `Task` antes/después: **42410 / 42410** — confirma cero pérdida
de datos, cumpliendo el mandato de la §5.4 del informe original. **Incidente cerrado. Fase 2 100%
desplegada contra la base de datos real.**

### Detalle — FH-05 (diagnóstico completo, decisión de negocio registrada) — FH-05 cerrado

Diagnóstico ejecutado directamente por el usuario contra la BD real (`LuxuryBuildingGroup`), sin
pasar por el ejecutor — es una consulta de solo lectura, no un cambio de código.

**Consultas corridas** (distribución de `DATEPART(HOUR, campo)` por campo, sobre las 4 entidades de
RRHH-Permisos: `LeaveRequests`, `LeaveRequestHistory`, `VacationRequests`, `VacationRequestHistory`
— nombres de tabla en plural para las dos primeras, corregido en el momento tras un primer intento
con nombres singulares que dio `Invalid object name`).

**Resultado:** los 5 campos con datos (`LeaveRequestHistory.ChangeDate` está vacía, 0 filas) muestran
variación horaria real, concentrada en horas UTC 14-23 con una cola real en horas UTC 0-7 — firma
clásica de horario laboral de México (UTC-6) capturado con `DateTime.UtcNow`. La cola (~4% de filas
en `VacationRequest.RequestDate`, proporciones similares en el resto) son solicitudes nocturnas en
México que UTC empuja al día calendario siguiente — justo el riesgo de desfase de día que describe
§5.4 Caso B. Confirmado: **no son campos de fecha pura, son instantes reales** — no es seguro
truncar con un `CAST` directo sobre UTC.

**Decisión de negocio (usuario, dueño del dato):** el día correcto para los 6 campos es el **día
calendario de México**, no el día UTC.

Con esa decisión, se verificó que `AT TIME ZONE 'Central Standard Time (Mexico)'` (el mismo TZ ID
que ya usa `DateTimeExtension.GetMexicoTime()` en C#) es reconocido por la instancia real de SQL
Server del proyecto (`SELECT SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard
Time (Mexico)'` → convierte correctamente). Con eso se redactó **FH-09a**, que implementa
únicamente los pasos 1-2 de §5.4 (columnas `DateOnly?` aditivas + backfill verificado) — sin tocar
las columnas `DateTime` existentes ni el código de aplicación. El cutover (leer/escribir las
columnas nuevas desde servicios/DTOs) queda para un ticket posterior, después de un período de
validación.

### Detalle — FH-09a (aprobado, verificado independientemente) — FH-09a cerrado

Verificación independiente (no solo el reporte del ejecutor):

- **4 entidades** (`LeaveRequest.cs`, `LeaveRequestHistory.cs`, `VacationRequest.cs`,
  `VacationRequestHistory.cs`): diff leído completo — únicamente los 6 bloques de propiedad nuevos
  `DateOnly?` (`RequestDay`/`ApprovalDay`/`ChangeDay`), exactamente como los especificaba el ticket.
  Los 6 campos `DateTime` originales, sin ningún cambio.
- **Migración `20260827140956_DateOnlyRrhhPermisosAditivo.cs`**: leída completa — 6
  `AddColumn<DateOnly>(..., nullable: true)`, backfill `migrationBuilder.Sql(...)` con la conversión
  `AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)'` exacta para los 6 campos, sobre
  los nombres de tabla correctos (`LeaveRequests`/`LeaveRequestHistory`/`VacationRequests`/
  `VacationRequestHistory`). `Down()` = 6 `DropColumn`, sin tocar columnas viejas. Sin
  `RenameColumn`/`AlterColumn` sobre ningún campo existente.
- **4 archivos adicionales modificados** en el mismo directorio (`LeaveRequestApprovalEndPoints.cs`,
  `SolicitudVacacionesService.cs`, `VacationRequestApprovalEndPoints.cs`,
  `AprobacionVacacionesService.cs`) — verificado con grep que **no** contienen ninguna referencia a
  `RequestDay`/`ApprovalDay`/`ChangeDay`: son cambios de tickets anteriores de esta misma sesión
  (FH-01/FH-02/FH-12/FH-14), no de FH-09a. El ejecutor no los tocó, confirmado.
- `dotnet build api/LuxuryApp.sln` → **0 errores**.
- `grep -rn "\.RequestDay\b\|\.ApprovalDay\b\|\.ChangeDay\b" api/LuxuryApp.Application/` → **0
  resultados** — confirmado que ningún servicio/DTO consume las columnas nuevas todavía (sin
  cutover accidental).
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline sin cambio).
- `node scripts/scan-mojibake.mjs api` → **69 ocurrencias** (mismo baseline que al cierre de
  FH-04d; ninguno de los 6 archivos de este ticket aparece en la lista — el ejecutor tenía razón:
  69 es el baseline real del proyecto, no 68 como se registró por error en el cierre de FH-04d antes
  de que existiera este archivo de migración adicional).

**Veredicto: ✅ Aprobado, sin corrección.** Fase 3 avanza: RRHH-Permisos tiene ahora las columnas
`DateOnly?` con el día calendario de México ya calculado y disponible, sin haber tocado el
comportamiento actual de la aplicación. El cutover (leer/escribir `RequestDay`/`ApprovalDay`/
`ChangeDay` desde servicios y DTOs, y eventualmente retirar los campos `DateTime`) queda pendiente
como ticket futuro, después de un período de validación en producción — no antes de que el usuario
decida aplicar esta migración contra la base real.

Sigue: FH-06/FH-07/FH-08 (diagnósticos restantes de Fase 3) o Fase 4 (frontend) — a decidir orden.
Pendiente sin resolver del hilo de esta sesión: la pregunta de despliegue a producción, interrumpida
por el usuario — retomar solo si el usuario la trae de vuelta explícitamente.

### Detalle — FH-09b (aprobado, verificado independientemente) — FH-09b cerrado

Verificación independiente:

- **`NominaEncabezado.cs`**: diff vía `git diff` — 2 propiedades nuevas `DateOnly?`
  (`FechaAprobacionDay`, `FechaCierreDay`) exactamente como las especificaba el ticket. Los campos
  `DateTime?` originales intactos.
- **`BitacoraMantenimiento.cs`**: **`git diff` no mostró ningún cambio** — investigado, no es un
  problema del ejecutor: la carpeta `Tenant/Maintenance/Logs/` coincide con la regla `.gitignore:34`
  (`[Ll]ogs/`, sin ancla de raíz) que estaba pensada para carpetas de logs de runtime, no para código
  fuente — `git check-ignore -v` lo confirma. El archivo (y sus 13 hermanos en esa misma carpeta:
  `BitacoraDetectorHumo`, `BitacoraEquipoBase`, `BitacoraEstacionManual`, `BitacoraExtintor`,
  `BitacoraHidrante`, `ControlPrestamoHerramienta`, `ElevatorsEmergencyCall`,
  `ElevatorSparePartsChange`, `Medidor`, `MedidorLectura`, `Piscina`, `PiscinaBitacora`,
  `RecepcionPipaAgua`) **nunca ha estado en el historial de git** — no es un problema nuevo de este
  ticket, es preexistente y afecta a todo ese directorio. Verificado leyendo el archivo directamente
  del disco (no vía git): tiene la propiedad `FechaRegistroDay` exactamente como la especifica el
  ticket, después de `FechaRegistro` (que sigue con su `[Column("RegisteredAt")]` intacto).
  **Hallazgo reportado al usuario, fuera del alcance de este ticket** — requiere corregir la regla
  del `.gitignore` (anclarla, ej. `/logs/` o una ruta específica) y hacer el primer commit de estos
  14 archivos.
- **Migración `20260827143621_DateOnlyNominaMantenimientoAditivo.cs`**: leída completa — 3
  `AddColumn<DateOnly>(..., nullable: true)`, backfill correcto (usa `RegisteredAt`, la columna
  física real, no `FechaRegistro`). `Down()` = 3 `DropColumn`. Sin tocar columnas existentes.
- `dotnet build api/LuxuryApp.sln` → **0 errores**.
- `grep -rn "\.FechaAprobacionDay\b\|\.FechaCierreDay\b\|\.FechaRegistroDay\b" api/LuxuryApp.Application/` → **0 resultados**.
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline sin cambio).
- `node scripts/scan-mojibake.mjs api` → **69 ocurrencias** (baseline sin cambio; ninguno de los
  archivos de este ticket aparece en la lista).

**Veredicto: ✅ Aprobado, sin corrección.** Fase 3: RRHH-Permisos y Nómina+Mantenimiento ya tienen
sus columnas `DateOnly?` aditivas con el día calendario de México, sin tocar el comportamiento
actual. Quedan **FH-07** (`Tasks` legacy + `TaskInstance`, con la pregunta previa de si `Tasks`
sigue vigente) y **FH-08** (resto de casos sueltos) para completar los diagnósticos de Fase 3, según
el orden acordado con el usuario (terminar Fase 3 antes de pasar a Fase 4 — frontend).

**Hallazgo independiente, no relacionado con fechas/horas — pendiente de acción del usuario:** el
`.gitignore` de `api/` tiene una regla `[Ll]ogs/` (línea 34) sin ancla de raíz que excluye del
control de versiones cualquier carpeta llamada `logs`/`Logs` en cualquier profundidad del árbol —
no solo carpetas reales de logs de runtime, también atrapó la carpeta de entidades de dominio
`LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Maintenance/Logs/` (14 archivos de entidades de
Mantenimiento, incluyendo `BitacoraMantenimiento.cs`). Esos 14 archivos existen y funcionan en disco
con normalidad, pero **nunca han tenido respaldo en git** — ningún commit los incluye, así que si se
pierde el directorio de trabajo local se pierde también su historial completo. Recomendación: anclar
la regla (ej. `/logs/` para la carpeta de logs de runtime en la raíz del proyecto, no un patrón
global) y hacer un primer commit de esos 14 archivos.

**Hallazgo del `.gitignore` — resuelto (2026-08-27):** corregido con una excepción explícita
(`!.../Tenant/Maintenance/Logs/` + `/**`) después de la regla `[Ll]ogs/`, y comiteado
(`e7bdfba4`, "fix(gitignore): dejar de ignorar Entities/Tenant/Maintenance/Logs/") junto con los 14
archivos que ahora tienen historial de git por primera vez. Commit acotado — no incluye ningún otro
cambio pendiente de tickets anteriores de esta sesión.

### Detalle — FH-07 (diagnóstico completo, decisiones de negocio por campo) — FH-07 cerrado

**Pregunta previa resuelta (contradice la premisa del tablero original):** `TaskInstance` NO es un
reemplazo de `Tasks` (legacy). Son entidades completamente distintas en módulos distintos —
`TaskInstance` vive en `ReclutamientoLuxuryApp/.../RecurringTasks/` (tareas recurrentes de
Reclutamiento, un feature acotado), mientras `Tasks` es el sistema general de tickets/tareas de
Operaciones (activamente usado en Dashboard, Legal, WorkPlan, Announcements — confirmado por el
volumen de trabajo de FH-04d). Coinciden en nombre genérico "Task" por casualidad, no por relación
de sucesión. `Tasks` está claramente vigente.

**Diagnóstico de datos** (consultas corridas por el usuario contra `LuxuryBuildingGroup`,
`Task`=42410 filas, `TaskInstances`=0, `TaskMessageReads`=0, `TaskWorkPlans`=178):

- 8 de los 10 campos de `Task` (`BreachedAt`, `LastAlertAt`, `RecurrenceSourceDate`,
  `PlannedStartDate/EndDate`, `ActualStartDate/EndDate`, `RecurrenceEndDate`) y los 4 campos de
  `TaskInstance`/`TaskMessageReads` tienen **0 filas pobladas** — sin riesgo, mismo tratamiento que
  FH-06 (columnas aditivas + backfill no-op, decisión: día calendario de México por consistencia).
- `Task.ScheduledDate` y `TaskWorkPlan.SendDate`: tienen variación horaria real en los datos, pero
  verificado en código que **ambos se muestran siempre sin hora** (`"dd-MMM-yy"` en
  `TaskAppService.cs:126`, `SupervisionReportsAppService.cs:151`; `.ToString("d")`/`"dd-MMM-yy"` en
  los 4 puntos de `SendDate` ya documentados en el detalle de esta misma sesión) y la lógica de
  negocio solo compara existencia (`!= null`), nunca la hora
  (`reglas-negocio-tasks-legal.md:96`). Candidatos claros a `DateOnly`, decisión: día calendario de
  México.
- `Task.ClosedDate`: variación horaria real, poblado tanto por `DateTime.UtcNow` (cierres
  automáticos, `TaskAppService.cs:1420,982,405`) como por `DTO.ClosedDate` (formulario). A
  diferencia de los otros dos, **sí se muestra con hora exacta** en al menos un punto
  (`entity.ClosedDate.Value.ToString("dd-MMM-yy HH:mm")`, `TaskAppService.cs:117`). Consultado el
  usuario explícitamente: **la hora de cierre sí importa** — `ClosedDate` se excluye por completo de
  este esfuerzo de migración a `DateOnly`, se queda como `DateTime` indefinidamente.

**Duplicado detectado:** `TaskWorkPlan.SendDate` aparecía tanto en FH-07 como en FH-08 en el tablero
original (heredado del informe). Ya cubierto aquí — se tachó de la fila de FH-08 para no repetirlo.

Con esto se redactó **FH-09c** (ver tablero) — 12 campos aditivos `DateOnly?` (`ScheduledDay` +
8 vacíos de `Task` + 3 de `TaskInstance` + 1 de `TaskMessageReads`) + `SendDay` en `TaskWorkPlan`,
excluyendo explícitamente `ClosedDate`.

### Detalle — FH-09c (aprobado, verificado independientemente) — FH-09c cerrado

Verificación independiente:

- **4 entidades** (`Tasks.cs`, `TaskInstance.cs`, `TaskMessageReads.cs`, `TaskWorkPlan.cs`): diff
  leído completo. `Tasks.cs` mezcla en el mismo diff los cambios de `IAuditable`/`CreatedAt` de
  FH-04d (ya cerrado, aún sin commitear) con los nuevos de este ticket — aislados correctamente: las
  9 propiedades `DateOnly?` nuevas están en los lugares exactos que pedía el ticket, y `ClosedDate`
  no tiene ningún cambio asociado (exclusión respetada). Las otras 3 entidades, diff limpio y exacto.
- **Migración `20260827193410_DateOnlyTasksAditivo.cs`**: leída completa — 14
  `AddColumn<DateOnly>(..., nullable: true)` sobre las tablas correctas (`Task`, `TaskInstances`,
  `TaskMessageReads`, `TaskWorkPlans`), backfill con la conversión `AT TIME ZONE` correcta para los
  14 campos, con los `WHERE` de nullability correctos por campo. `Down()` = 14 `DropColumn`. Cero
  referencias a `ClosedDate` en toda la migración.
- `dotnet build api/LuxuryApp.sln` → **0 errores**.
- `grep` de las 13 propiedades nuevas en `api/LuxuryApp.Application/` → **0 resultados**.
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline sin cambio).
- `node scripts/scan-mojibake.mjs api` → **71 ocurrencias** (subió de 69). Verificado
  independientemente cuáles son las 2 nuevas: `20260827170132_ActiveHiringRequestPerVacancy.cs` +
  `.Designer.cs` — una migración de Reclutamiento completamente ajena a este ticket y a esta
  orquestación (trabajo externo del usuario, confirmado por el nombre y que no aparece en ningún
  ticket FH-*). Ninguno de los 4 archivos de FH-09c aparece en la lista. El claim del ejecutor
  ("no es mío, es de otro módulo") se confirma correcto — nuevo baseline real: **10 / 71**.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, **Fase 3 completa excepto FH-08** (el único
diagnóstico que falta). FH-09a, FH-09b y FH-09c ya dejaron las columnas `DateOnly?` aditivas listas
en RRHH-Permisos, Nómina+Mantenimiento y Tasks — ninguna todavía en uso por la aplicación (cutover
pendiente, ticket futuro tras período de validación).

### Detalle — FH-08 (diagnóstico completo, decisión de negocio) — FH-08 cerrado

**`BudgetProposal.CreatedDate` obsoleto:** ya no existe, FH-04a lo renombró a `CreatedAt`
(`IAuditable`) hace varios tickets. Descartado del alcance sin necesidad de diagnóstico.

**Trampa de nombres confirmada en las 10 entidades restantes** — solo `AnnouncementAnalytics` y
`GoogleCalendarEvent(s)` tienen tabla física con nombre parecido a la clase; el resto usa nombres en
inglés sin relación aparente: `MigrationVerificationLog`→`MigrationLogs`,
`EstadoFinanciero`→`FinancialStatements`, `AsambleaChecklistExecution`→`AssemblyChecklistLogs`,
`ReportSubmissionRecord`→`ReportSubmissions`, `EntregaRecepcionCliente`→`UnitDeliveries` (y la
propiedad `Fecha` mapea a la columna `Date`, no `Fecha`), `OrdenCompraComprobantePago`→
`PurchaseOrderPayments`, `RequestEmployeeRegisterFile`→`RecruitmentRequestEmployeeRegisterFiles`,
`CollectionActivity`→`CollectionActivities`.

**Diagnóstico de datos** (consultas corridas por el usuario contra `LuxuryBuildingGroup`):

- 3 tablas vacías (`MigrationLogs`, `RecruitmentRequestEmployeeRegisterFiles`,
  `CollectionActivities`) — sin riesgo, mismo tratamiento que FH-06/FH-07 (aditivo, backfill no-op).
- `AsambleaChecklistExecution.DueDate` (50/50 filas) y `GoogleCalendarEvent.RecurrenceEndDate`
  (39/39 filas): **100% de los datos en hora 0** — nunca tuvieron hora real, truncado técnico sin
  ambigüedad, no requiere decisión de negocio (Caso B primer bullet de §5.4).
- `EstadoFinanciero.UploadDate/AuthorizationDate/SendDate` (273 filas): variación horaria real, pero
  confirmado en código (`FinancialReportAppService.cs:76-77,108,276-277`) que siempre se muestran
  `.ToString("d")` — nunca la hora. Candidato confirmado.
- `AnnouncementAnalytics.ViewDate`, `ReportSubmissionRecord.RegisterDate`,
  `EntregaRecepcionCliente.Fecha`, `OrdenCompraComprobantePago.UploadDate`: variación horaria real
  en los datos, pero sin evidencia concluyente en el código consumidor (ni un `.ToString("d")` que
  confirme que nunca se usa la hora, ni un `HH:mm` que confirme lo contrario, a diferencia del caso
  de `Task.ClosedDate` en FH-07). Presentado al usuario con recomendación (mismo patrón que otros
  timestamps de "registro/carga" ya confirmados seguros) — **el usuario confirmó incluir los 4**.

**Decisión de negocio (usuario):** día calendario de México para los 10 campos restantes de FH-08
(los 9 con datos + backfill real, más `MigrationVerificationLog.VerificationDate` que ya estaba en
la lista de "tablas vacías").

Con esto se redactó **FH-09d** (ver tablero) — 12 columnas aditivas `DateOnly?` en 10 entidades.
Con FH-09a/b/c/d, **la Fase 3 queda completa**: los 4 diagnósticos (FH-05/06/07/08) resueltos, con
decisión de negocio explícita en cada campo, y las columnas `DateOnly?` aditivas listas (sin cutover
de código todavía) en las 20 entidades tocadas a lo largo de la fase.

### Detalle — FH-09d (aprobado, verificado independientemente) — FH-09d cerrado — Fase 3 completa

Verificación independiente:

- **10 entidades**: diff leído completo (9 vía `git diff`, `EntregaRecepcionCliente.cs` vía lectura
  directa — mismo caso que ya se documentó, no está bajo una carpeta ignorada por accidente, es
  tracking normal). Las 12 propiedades `DateOnly?` nuevas están exactamente donde el ticket las
  pedía. Confirmado que respetó las exclusiones: `BudgetProposal.cs` no tocado,
  `GoogleCalendarEvent.StartAt/EndAt` intactos, `CollectionActivity.PromisedDate` intacto,
  `RequestEmployeeRegisterFile.ValidatedAt` intacto.
- **Migración `20260827224610_DateOnlyRestoCasosAditivo.cs`**: leída completa — 12
  `AddColumn<DateOnly>(..., nullable: true)` sobre las tablas correctas, backfill correcto para las
  12, incluyendo `UnitDeliveries` leyendo `[Date]` (no `Fecha`). `Down()` = 12 `DropColumn`.
- `dotnet build api/LuxuryApp.sln` → **0 errores**.
- `grep` de las 10 propiedades nuevas en `api/LuxuryApp.Application/` → **0 resultados**.
- `node scripts/audit-conventions.mjs` → **10 errores** (baseline sin cambio).
- `node scripts/scan-mojibake.mjs api` → **71 ocurrencias**, mismo listado exacto que en el cierre
  de FH-09c (los +2 siguen siendo `ActiveHiringRequestPerVacancy`, nada nuevo). Ninguno de los 10
  archivos de FH-09d aparece.

**Veredicto: ✅ Aprobado, sin corrección.**

**Con esto, la Fase 3 queda 100% completa.** Los 4 diagnósticos (FH-05/06/07/08) están cerrados con
decisión de negocio explícita por campo, y FH-09a/b/c/d dejaron las columnas `DateOnly?` aditivas
con backfill verificado (día calendario de México) en las ~30 entidades tocadas a lo largo de la
fase — ninguna todavía en uso por la aplicación. Excepciones documentadas y respetadas en todo
momento: `Task.ClosedDate` (la hora sí importa, se queda `DateTime`), `BudgetProposal.CreatedDate`
(ya resuelto en Fase 2), y los campos de horario real de calendario (`GoogleCalendarEvent.StartAt/
EndAt`).

**Siguiente decisión (para el usuario):** cutover de código (leer/escribir las columnas `*Day` desde
servicios y DTOs, tras un período de validación) vs. pasar a la **Fase 4** (frontend — gobierno de
`DateService`, sin riesgo de datos).

### Detalle — FH-10 (aprobado, verificado independientemente) — FH-10 cerrado

**Corrección de diseño durante la ejecución** (no un error del ejecutor, un hallazgo real): el
ticket original proponía que `apiDate` delegara siempre en `DateService.parseDate()`. El ejecutor
detectó que el regex interno de `parseDate()` (`/^(\d{4})-(\d{2})-(\d{2})/`) hace match por
**prefijo**, no exacto — así que un `DateTime` completo como `"2026-08-27T02:00:00Z"` también cae en
esa rama, descarta la hora y trata el día como local. Es el "riesgo residual" que ya había señalado
el informe original (§3.2), ahora confirmado como bug real de cara al nuevo pipe. Claude decidió en
el momento: el pipe distingue `DateOnly` puro (`/^\d{4}-\d{2}-\d{2}$/`, match exacto) de cualquier
otro string — solo el primero pasa por `DateService.parseDate()`, el resto usa `new Date()` directo
(interpretación UTC correcta de JS). Sin tocar `DateService` (fuera de alcance del ticket, evita
efectos colaterales sobre sus otros 139 consumidores).

Verificación independiente:

- **`api-date.pipe.ts`**: leído completo — implementa exactamente la lógica corregida (match exacto
  de `DateOnly` → `DateService.parseDate()`; cualquier otro caso, incluyendo `DateTime` con hora/Z y
  valores `Date` ya instanciados → `new Date()` directo). Inyección por constructor con defaults
  `inject(...)`, permite instanciar el pipe directo en tests sin `TestBed`.
- **`api-date.pipe.spec.ts`**: leído completo y **corrido independientemente** (no solo el reporte
  del ejecutor) — `node --max-old-space-size=8192 node_modules/vitest/vitest.mjs run
  src/app/shared/pipes/api-date.pipe.spec.ts` → **6/6 tests pasan**, incluyendo el caso crítico
  (`"2026-08-27T02:00:00Z"` → `"26/08/2026"`, no `"27/08/2026"`) que exactamente demuestra la
  corrección funcionando.
- **Documentación**: `frontend-prohibitions.md` y `angular-services-catalog.md` leídos completos
  (no se pudo usar `git diff` — `docs-conventions/` no está bajo ningún repo git de los tres del
  proyecto, hallazgo aparte sin relación con este ticket) — ambos coinciden exactamente con lo que
  pedía el ticket.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**,
  "Application bundle generation complete" (134.5s). Los únicos 5 warnings (`NG8113`, imports sin
  usar en `WorkPositionForm`/`WorkPositionList`) son preexistentes y ajenos a este ticket, tal como
  reportó el ejecutor.
- `grep -rn "ApiDatePipe\|apiDate" src/app` → **0 resultados** fuera de la propia definición del
  pipe — confirmado que ninguna plantilla ni componente lo usa todavía.
- `node scripts/scan-mojibake.mjs` sobre los 4 archivos nuevos/modificados → **0 mojibake**.

**Nota de robustez (no bloqueante):** el test del caso 2 depende de que la máquina donde corre tenga
la hora local en México (`Intl.DateTimeFormat().resolvedOptions().timeZone` → confirmado
`America/Mexico_City` en esta máquina) — si el pipeline de CI corriera en otro huso horario, el test
podría fallar. Esto es correcto en producción real (el navegador del usuario final siempre usa su
propia hora local, que para usuarios de México es la correcta), pero es una fragilidad de CI a tener
en cuenta si en el futuro se corre en un runner con huso horario distinto — no requiere acción ahora.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto arranca la Fase 4. Sigue **FH-11+**: migrar,
módulo por módulo, las ~95 plantillas que hoy usan `\| date` directo sobre campos `DateOnly` al pipe
`apiDate` — un ticket por app (`cobranza.luxuryapp`, `recursos-humanos.luxuryapp`, etc.).

### Detalle — FH-11a (aprobado, verificado independientemente) — FH-11a cerrado — piloto validado

Verificación independiente (nota: `git diff`/`git status` fallaron en un primer intento por confundir
el directorio de trabajo con el de la raíz del proyecto — la raíz no tiene commits; corregido usando
`cd client/angular && git diff` en un solo comando):

- **`propiedades-form.ts`**: `import { DatePipe }` → `import { ApiDatePipe }` con la ruta relativa
  correcta (`../../../shared/pipes/api-date.pipe`, confirmada porque el proyecto no tiene alias
  `@shared`, solo `@ui/*`); `DatePipe` → `ApiDatePipe` en el arreglo `imports`. `grep` confirma cero
  uso residual de `DatePipe`/`| date` nativo en el archivo.
- **`propiedades-form.html`**: `delinquentSince | date:'dd/MM/yyyy'` → `delinquentSince | apiDate`
  (formato por defecto del pipe, correcto).
- `git status` confirma que **solo esos 2 archivos** cambiaron dentro de `resident.luxuryapp/`.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Los mismos 4 warnings `NG8113` preexistentes de `WorkPositionForm`/
  `WorkPositionList` (ajenos a este ticket) que ya aparecían en el build de FH-10.

**Veredicto: ✅ Aprobado, sin corrección. Patrón de migración FH-11 validado.** El proceso
(identificar campo `DateOnly` real → cambiar import + `imports:[...]` → cambiar `| date` por
`| apiDate` en la plantilla → build) funcionó limpio en su primera aplicación real. Sigue **FH-11b+**
escalando a las apps más grandes (`recursos-humanos.luxuryapp`, `operations.luxuryapp`,
`mantenimiento.luxuryapp`, `cobranza.luxuryapp`, ...) por orden de tamaño, según lo documentado en
el tablero — con atención especial a `auth.luxuryapp`/`compras.luxuryapp` por su workaround `:'UTC'`
preexistente.

### Detalle — FH-11b (aprobado, verificado independientemente) — FH-11b cerrado

Verificación independiente:

- **6 archivos** (3 apps): `git status` confirma que solo esos 6 cambiaron. Diff leído completo
  para cada uno:
  - `committee.luxuryapp/poliza-seguro-edificio`: `CommonModule` → `ApiDatePipe` (reemplazo
    completo, correcto — la plantilla no usaba nada más de `CommonModule`), 2 campos migrados.
  - `compras.luxuryapp/historial-compras`: `CommonModule` **conservado**, `ApiDatePipe` agregado
    (correcto — el `| number:'1.2-2'` sigue intacto en las 2 líneas donde aparece), las 2
    ocurrencias de `fechaSolicitud` migradas con el workaround `:'UTC'` eliminado.
  - `auth.luxuryapp/password-manager`: `DatePipe` → `ApiDatePipe` (reemplazo completo, correcto —
    era el único uso en toda la app), `subscriptionExpirationDate` migrado con `:'UTC'` eliminado.
- `grep -rn "\| date\|DatePipe\b"` en los 3 directorios → solo coincidencias de `ApiDatePipe` (el
  patrón `DatePipe\b` también matchea el sufijo de "ApiDatePipe") — **cero `DatePipe` nativo real,
  cero `\| date` residual**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**,
  "Application bundle generation complete" (131s). Mismos 5 warnings `NG8113` preexistentes de
  `WorkPositionForm`/`WorkPositionList`, ajenos a este ticket.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, **todas las apps de 1 archivo están migradas**
(`resident`, `committee`, `compras`, `auth`). Sigue escalar a las apps medianas
(`direccion.luxuryapp`/`contabilidad.luxuryapp`, 3 c/u; `system.luxuryapp`/`legal.luxuryapp`, 4 c/u;
`admin.luxuryapp`, 6) antes de las grandes (`reclutamiento.luxuryapp` 7, `supplier.luxuryapp` 8,
`cobranza.luxuryapp`/`mantenimiento.luxuryapp` 19 c/u, `operations.luxuryapp` 20,
`recursos-humanos.luxuryapp` 30).

### Detalle — FH-11c (aprobado, verificado independientemente) — FH-11c cerrado

**Aclaración de conteo:** el ticket original decía "21 ocurrencias" (error de conteo manual de
Claude al agrupar por tarea); el ejecutor reportó "26" (también un recuento manual, off por uno).
El recuento real, verificado con `grep -rc "\| apiDate"` sobre los 14 archivos después de la
migración, es **27** — coincide exactamente con el recuento independiente de Claude sobre el grep
original antes de escribir el ticket. Ninguna de las dos cifras en prosa afectó el resultado: la
migración cubre las 27 ocurrencias reales, ninguna de más ni de menos.

Verificación independiente:

- **28 archivos** (14 `.ts` + 14 `.html`): `git status` confirma que son exactamente los
  esperados, nada fuera de las 4 apps tocado.
- `grep -rn "\| date\b"` en las 4 apps → **0 resultados residuales**.
- Casos delicados verificados con diff completo:
  - **T8** (`eleven-labs-settings.html`, ternario): la sustitución respetó la sintaxis del
    condicional (`sub.nextBillingDate ? (sub.nextBillingDate | apiDate: "mediumDate") : "N/D"`).
  - **T11** (`poliza-seguro-edificio` de `legal.luxuryapp`, distinto al de `committee.luxuryapp` ya
    migrado en FH-11b): confirmado que es el archivo correcto (ruta
    `legal.luxuryapp/asuntos-legales-y-seguros/committee/poliza-seguro-edificio/`), `CommonModule`
    reemplazado por `ApiDatePipe`, ruta relativa de 5 niveles (`../../../../../shared/pipes/`)
    correcta según la profundidad real de esa carpeta.
  - **T12/T13** (`ticket-legal-reportes-externos`/`internos`): `datePipe = inject(DatePipe)`
    **intacto** en ambos (confirmado con grep dedicado), `CommonModule` y `DatePipe` conservados sin
    tocar en el arreglo `imports`, `ApiDatePipe` agregado junto a ellos — exactamente el tratamiento
    especial que pedía el ticket para el uso programático sobre `Date` nativos.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto quedan migradas: `resident`, `committee`,
`compras`, `auth`, `direccion`, `contabilidad`, `system`, `legal` (8 de 14 apps con `\| date`).
Restan las 6 más grandes: `admin.luxuryapp` (6), `reclutamiento.luxuryapp` (7),
`supplier.luxuryapp` (8), `cobranza.luxuryapp`/`mantenimiento.luxuryapp` (19 c/u),
`operations.luxuryapp` (20), `recursos-humanos.luxuryapp` (30).

### Detalle — FH-11d (aprobado, verificado independientemente) — FH-11d cerrado

Verificación independiente:

- **12 archivos** (6 `.ts` + 6 `.html`): `git status` confirma exactamente los esperados. Diff
  completo leído para los 12 — los 9 `| date` migrados a `apiDate` con formato preservado en cada
  caso, incluyendo el ternario de `brevo-email-logs.html`.
- **T1/T2** (`access-dashboard`, `access-events`): `DatePipe` → `ApiDatePipe`, reemplazo limpio.
- **T3/T4/T6** (`audit-entries`, `brevo-email-logs`, `user-activity-history`): `CommonModule` →
  `ApiDatePipe`, reemplazo limpio.
- **T5** (`log-api-report`): `CommonModule` **conservado**, `ApiDatePipe` agregado — confirmado con
  `grep "ngStyle"` que los 2 usos (líneas 122 y 137) siguen intactos.
- `grep -rn "\| date\b"` en `admin.luxuryapp` → **0 residuales**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, 9 de 14 apps con `\| date` migradas. Restan las
5 más grandes: `reclutamiento.luxuryapp` (7), `supplier.luxuryapp` (8), `cobranza.luxuryapp`/
`mantenimiento.luxuryapp` (19 c/u), `operations.luxuryapp` (20), `recursos-humanos.luxuryapp` (30).

### Detalle — FH-11e (aprobado, verificado independientemente) — FH-11e cerrado

**Hueco real en el ticket, cerrado por el ejecutor sin pedírselo:** la Tarea 6
(`candidate-work-position-candidates`) listaba 5 ocurrencias, pero la plantilla tiene 6 —
`vacancy.nextInterviewAt` en la línea 170 (un campo del mismo nombre que el de la Tarea 5, pero en
un archivo distinto) se quedó fuera de la redacción del ticket por error de Claude al pasar del
grep original a la lista de tareas. El ejecutor lo detectó y lo migró igual, dejándolo explícito en
su reporte.

Verificación independiente:

- **14 archivos** (7 `.ts` + 7 `.html`) en el alcance del ticket — confirmado con diff completo.
  Se encontraron **5 archivos adicionales modificados** en `reclutamiento.luxuryapp`
  (`candidate-interviewer-queue.interface.ts`, `candidate-recruitment-interviews.interface.ts`/
  `.service.ts`, `solicitud-alta-list.html`/`.ts`) — verificado que **ninguno** referencia
  `ApiDatePipe`/`DatePipe`/`\| date`: son cambios pequeños y aditivos de otra sesión/trabajo en
  curso, sin relación con este ticket, no tocados por el ejecutor para esta migración.
- `candidate-work-position-candidates`: diff confirma las 6 ocurrencias reales migradas (incluida
  la que faltaba en el ticket), `CommonModule`/`DatePipe` reemplazados por `ApiDatePipe`,
  `CurrencyPipe` conservado importado por separado — `\| currency` intacto en las 2 líneas donde
  aparece.
- `grep -rc "\| apiDate"` en los 7 `.html` → **19 en total**, coincide exactamente con el recuento
  original de Claude sobre el grep crudo antes de escribir el ticket (el error estaba solo en la
  prosa de la Tarea 6, no en los datos).
- `grep -rn "\| date\b"` → **0 residuales**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, 10 de 14 apps con `\| date` migradas. Restan
las 4 más grandes: `supplier.luxuryapp` (8), `cobranza.luxuryapp`/`mantenimiento.luxuryapp` (19
c/u), `operations.luxuryapp` (20), `recursos-humanos.luxuryapp` (30).

**Nota metodológica para FH-11f y siguientes:** el grep simple de una sola línea (`| date`) puede
no detectar ocurrencias donde Prettier envuelve la expresión y el `|` queda en una línea distinta
de `date:` — pasó en `orden-compra-list.html` de `supplier.luxuryapp` (3 ocurrencias reales, el
grep simple solo encontraba 2). A partir de FH-11f se usa una búsqueda multilínea
(`perl -0777 -ne '...'`) tanto para el diagnóstico como para la verificación de "cero residuales".

**Hallazgo aparte — código huérfano:**
`supplier.luxuryapp/po/provider-quotation/cuadro-comparativo-list.html` (y su `.ts` hermano) no
está referenciado en ningún routing ni import de todo el proyecto — es una carpeta paralela casi
idéntica a `supplier.luxuryapp/quotes/provider-quotation/` (la que sí está ruteada). No se tocó, no
se eliminó — queda fuera del alcance de FH-11f, reportado para que el equipo decida si lo elimina
en un ticket de limpieza aparte.

### Detalle — FH-11f (aprobado, verificado independientemente) — FH-11f cerrado

**Corrección propia:** el ticket tenía un typo de ruta en la nota de exclusión
(`po/provider-quotation/...` en vez de `provider-quotation/...`, sin `po/`) — no causó problema, el
ejecutor identificó y respetó el archivo huérfano correcto de todas formas.

Verificación independiente:

- **14 archivos** (7 `.ts` + 7 `.html`): `git status` confirma exactamente los esperados, el
  huérfano (`provider-quotation/cuadro-comparativo-list.html`, ruta correcta sin `po/`) **no**
  aparece en la lista de cambios — confirmado también que sigue con `\| date` nativo intacto.
- Diff completo de `orden-compra-list` (el caso más complejo, 3 ocurrencias incluida la envuelta en
  2 líneas junto a `\| number`) — las 3 migradas correctamente, `item.total \| number` intacto.
- **Repetí el mismo error que documenté en el ticket**: mi primer intento de contar `\| apiDate` con
  `grep -c` de una sola línea dio 11 (no 12) — la ocurrencia envuelta de `orden-compra-list` no se
  contó porque el `\|` y `apiDate` quedan en líneas distintas, exactamente el problema que motivó la
  nota metodológica de este ticket. Recontado con el método multilínea (`perl -0777`): **12/12
  correcto** en los 7 archivos.
- `grep -rn "'UTC'"` sobre los 2 archivos con workaround → **0 residuales**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, 11 de 14 apps con `\| date` migradas
(descontando la app fantasma del archivo huérfano). Restan las 3 más grandes:
`cobranza.luxuryapp`/`mantenimiento.luxuryapp` (19 c/u), `operations.luxuryapp` (20),
`recursos-humanos.luxuryapp` (30) — **usar el método de búsqueda multilínea desde el diagnóstico
inicial, no solo al verificar**, dado el volumen y la alta probabilidad de wraps de Prettier en
plantillas grandes.

### Detalle — FH-11g (aprobado, verificado independientemente) — FH-11g cerrado

Verificación independiente:

- **38 archivos** (19 `.ts` + 19 `.html`): `git status` confirma exactamente los esperados.
- **Hallazgo positivo — el ejecutor mejoró una instrucción incorrecta del ticket:**
  `native-statement.ts` — el ticket decía "conserva `CommonModule`" (Claude asumió que `\| uppercase`
  dependía de `CommonModule`, error de investigación). El diff muestra que `UpperCasePipe` ya estaba
  importado por separado en el archivo original — el ejecutor lo detectó y quitó `CommonModule` por
  completo (correcto, y `ng build` lo confirma: si hubiera faltado algo, el compilador de Angular lo
  habría marcado). También movió `providers: [DatePipe, CurrencyPipe]` → `providers: [CurrencyPipe]`,
  limpieza correcta ya que `DatePipe` deja de usarse en ese archivo.
- **`payment-detail-modal.ts`/`payments.ts`** (Tareas 13/15): diff confirma `CommonModule` quitado,
  `ApiDatePipe` agregado, `CurrencyPipe` conservado. En `payments.ts`, `providers: [DatePipe]`
  **intacto** tal como pedía el ticket (el `DatePipe` del import de nivel superior se conserva solo
  para ese provider, ya no aparece en el arreglo `imports` del componente).
- **Los 2 hallazgos preexistentes** (`\| json` sin `JsonPipe` en `approval-detail-modal.html:31`,
  `\| slice` sin `SlicePipe` en `invoice-list.html:129`) — confirmados **intactos**, sin tocar; el
  `\| date` de esos mismos 2 archivos sí se migró correctamente.
- Búsqueda multilínea (`perl -0777`) sobre las 19 plantillas → **0 `\| date` residuales**.
- `grep -rn "'UTC'"` → **0 residuales** (los 13 workarounds eliminados).
- Recuento multilínea de `\| apiDate` → **34/34**, coincide exacto por archivo con lo esperado.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, 12 de 14 apps (contando la app fantasma del
huérfano de FH-11f como ya resuelta) con `\| date` migradas. Restan las 2 más grandes:
`mantenimiento.luxuryapp` (19), `operations.luxuryapp` (20), y la más grande de todas,
`recursos-humanos.luxuryapp` (30).

**Nota:** para `mantenimiento.luxuryapp` se investigaron ambos clústers juntos (una sola pasada de
diagnóstico sobre las 19 archivos) y se redactaron FH-11h y FH-11i en el mismo turno — desviación
menor de la regla de oro (redactar el siguiente solo tras aprobar el anterior), justificada porque
ambos tickets cubren archivos disjuntos sin dependencia entre sí; no se entrega FH-11i al ejecutor
hasta que FH-11h esté aprobado.

**Hallazgo aparte — corrupción de bytes NULL:**
`mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.ts` tiene bytes `\x00`
literales incrustados en un string (`"Pipa vac\x00\x00a"`, probablemente "Pipa vacía" — 16 bytes
NULL en total, ~8 caracteres afectados), confirmado con `file` (marca el archivo como "data", no
texto) y un dump hexadecimal. Causa distinta al mojibake habitual del proyecto (no es
doble-codificación CP1252, son bytes NULL reales). No se toca en FH-11i más allá de no empeorarlo —
queda como hallazgo para un ticket de limpieza aparte.

### Detalle — FH-11h (aprobado, verificado independientemente) — FH-11h cerrado

Verificación independiente:

- **22 archivos** (11 `.ts` + 11 `.html`): `git status` confirma exactamente los esperados.
- El ejecutor reportó que su primer intento falló en build (`TS2307`/`NG1010`, ruta relativa
  incorrecta) y lo corrigió — verificado el estado **final**, no el reporte: las rutas son 4 niveles
  para los 4 archivos superficiales (`extinguisher-log/`, `hydrant-log/`, `manual-call-point-log/`,
  `smoke-detector-log/`) y 5 niveles para los 7 anidados un nivel más en
  `inspection-periods/*/`. `Location` intacto y en uso activo (`location = inject(Location)`) en
  las 4 Tareas 8-11.
- Búsqueda multilínea (`perl -0777`) sobre las 11 plantillas → **0 `\| date` residuales**, recuento
  de `\| apiDate` → **30/30**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Sigue **FH-11i** (la segunda mitad de
`mantenimiento.luxuryapp`, ya redactado — el caso con `formatDate()` programático y el archivo con
bytes NULL).

### Detalle — FH-11i (aprobado, verificado independientemente) — FH-11i cerrado — `mantenimiento.luxuryapp` completo

Verificación independiente, con atención extra en los 2 puntos de mayor riesgo del ticket:

- **Archivo con bytes NULL** (`recepcion-pipas-agua-list.ts`): recontados los bytes `\x00` con un
  script Python antes y después — **16 bytes NULL, misma posición, mismo contenido** que antes del
  ticket. Confirmado que la edición fue quirúrgica, sin empeorar la corrupción preexistente. El
  diff `.html` de ese mismo componente (git sí puede diffear el `.html`, no el `.ts` binario) muestra
  las 4 migraciones correctas con los workarounds `:'UTC'` eliminados.
- **Las 3 conversiones de `formatDate()` programático**: diff completo de `medidor-lectura-list.ts`
  y `recepcion-pipas-agua-reporte.ts` — las 3 llamadas sobre campos del API
  (`item.fechaRegistro`, `item.horaLlegada`, `item.horaTermino`) convertidas correctamente a
  `this.apiDatePipe.transform(...)` con `inject(ApiDatePipe)`, sin el workaround de zona horaria.
  La llamada legítima `fmtDt` (sobre `Date` nativo, línea 161 de `recepcion-pipas-agua-reporte.ts`)
  quedó **intacta**, confirmado con grep dedicado — y el import de `formatDate` se conservó
  correctamente en ese archivo (porque `fmtDt` lo sigue usando) pero se quitó por completo en
  `medidor-lectura-list.ts` (donde ya no quedaba ningún uso).
- **16 archivos** (8 `.ts` + 8 `.html`): `git status` confirma exactamente los esperados.
- `CommonModule` conservado correctamente en T6/T7/T8 (por `\| number`); reemplazado en T1-T5.
- Búsqueda multilínea sobre las 8 plantillas → **0 `\| date` residuales**, recuento de `\| apiDate`
  → **20/20**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, **`mantenimiento.luxuryapp` queda 100%
migrado** (FH-11h + FH-11i, 19 archivos, 50 ocurrencias + 3 conversiones programáticas). Con
FH-11a-i completos, quedan solo **2 apps**: `operations.luxuryapp` (20) y la más grande de todas,
`recursos-humanos.luxuryapp` (30).

### Detalle — FH-11j (aprobado, verificado independientemente) — FH-11j cerrado

**Aclaración de conteo:** el ejecutor reportó "33" ocurrencias migradas (el ticket decía 34).
Recontado con aritmética directa sobre el resultado de la búsqueda multilínea (`perl -0777`,
sumando por archivo): **34/34** — coincide exacto con el ticket original. Era un error de conteo
en el reporte del ejecutor, no un hueco real; la migración está completa.

Verificación independiente:

- **40 archivos** (20 `.ts` + 20 `.html`): `git status` confirma exactamente los esperados.
- `announcement-list.ts`/`.html` (Tarea 4, caso especial): confirmado `CommonModule` conservado
  junto con `ApiDatePipe` agregado, `\| slice` intacto en las 2 líneas donde aparece.
- Búsqueda multilínea sobre las 20 plantillas → **0 `\| date` residuales**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, 13 de 14 apps con `\| date` migradas. Queda
solo **`recursos-humanos.luxuryapp`** (30 archivos, la más grande) para completar toda la Fase 4.

### Detalle — FH-11k (aprobado, verificado independientemente) — FH-11k cerrado

Verificación independiente:

- **2 archivos**: `git status` confirma exactamente los esperados.
- Búsqueda multilínea (`perl -0777`) → **0 `\| date` residuales**, recuento de `\| apiDate` →
  **25/25**, incluyendo las 2 ocurrencias que el ejecutor reportó como envueltas en múltiples
  líneas (`item.endDate`, 2 secciones distintas).
- `grep -n "'UTC'"` → **0 residuales** (los 3 workarounds eliminados: `pd.birth`,
  `pd.dateAdmission`, `eval.evaluationDate` — coincide con el ticket).
- `CurrencyPipe` conservado, `DatePipe` reemplazado por `ApiDatePipe` con la ruta relativa correcta
  (5 niveles).
- El hallazgo aparte (`\| number` sin `DecimalPipe`, líneas 1257/1563) confirmado **intacto**, sin
  tocar — mismas líneas que antes del ticket.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Quedan **29 archivos / 66 ocurrencias** de
`recursos-humanos.luxuryapp` — el resto de la app, a agrupar por módulo en los siguientes tickets.

### Detalle — FH-11l (aprobado, verificado independientemente) — FH-11l cerrado

Verificación independiente:

- **12 archivos** (6 `.ts` + 6 `.html`): `git status` confirma exactamente los esperados; los
  otros 208 archivos modificados en el repo son de tickets FH-11a–k previos, aún sin commitear.
- Búsqueda multilínea (`perl -0777`) → **0 `\| date` residuales**, recuento de `\| apiDate` →
  **12/12**, incluyendo la ocurrencia envuelta en 2 líneas (`item.fechaFin`,
  `periodos-nomina.html`).
- `grep -rn "'UTC'|\"UTC\""` → **0 residuales** (los 11 workarounds `:"UTC"` eliminados).
- `CommonModule` conservado correctamente en Tareas 3/4/6 (`tiempo-extra`, `incidencias-nomina`,
  `modal-prestamo-detalle`) — verificado que `\| currency` sigue intacto en los 3 (10 puntos en
  total entre los 3 archivos).
- `CommonModule` reemplazado por `ApiDatePipe` en Tareas 1/5 (`periodos-nomina`,
  `evidencias-nomina`).
- Tarea 2 (`modal-dias-no-habiles`) confirmada: el `.ts` no importaba `CommonModule` ni `DatePipe`
  antes del ticket (bug preexistente real, verificado leyendo el archivo previo a la migración) —
  ahora importa `ApiDatePipe` correctamente, bug corregido de paso.
- Rutas relativas de import verificadas por conteo de directorios: 6 niveles arriba en
  `periodos-nomina`/`tiempo-extra`/`incidencias-nomina`/`evidencias-nomina`, 7 niveles arriba en
  `modal-dias-no-habiles`/`modal-prestamo-detalle` — todas correctas en el diff.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Quedan **23 archivos / 54 ocurrencias** de
`recursos-humanos.luxuryapp` (incidencias/sanciones, vacaciones/permisos, contratos, cola de
entrevistadores) — a agrupar en los siguientes tickets.

### Detalle — FH-11m (aprobado, verificado independientemente) — FH-11m cerrado

Verificación independiente:

- **8 archivos** (4 `.ts` + 4 `.html`): `git status` confirma exactamente los esperados.
- `incident-list.ts` y `sanction-list.ts` son binarios para `git diff` (por los bytes NUL
  preexistentes) — verificados textualmente vía Python: `DatePipe`→`ApiDatePipe` correcto en
  ambos, `CommonModule` conservado en `sanction-list.ts` (por `[ngClass]`).
- Bytes NUL preexistentes **confirmados intactos**: `incident-list.ts` = 6 (mismas 3 líneas de
  strings de UI), `sanction-list.ts` = 4 (mismas 2 líneas) — coincide exactamente con el conteo
  antes del ticket.
- Búsqueda multilínea (`perl -0777`) → **0 `\| date` residuales**, recuento de `\| apiDate` →
  **9/9**, incluyendo las 2 ocurrencias envueltas en `sanction-list.html`
  (`effectiveEndDate`, segunda `appliedDate`).
- `grep -rn "'UTC'|\"UTC\""` → **0 residuales** (5 workarounds eliminados: 1 en
  `suspension-days-manager`, 4 en `sanction-list`).
- `[ngClass]` confirmado intacto en `incident-attachments.html` (1 punto) y `sanction-list.html` (2
  puntos) — el hallazgo de import faltante en `incident-attachments.ts` reportado, no tocado.
- Nota menor no bloqueante: en `sanction-list.html` (línea ~92) quedó un espacio extra entre
  `{{ item.severityLevel }} |` y `{{ item.appliedDate |` tras el reemplazo — es un artefacto de
  texto en un nodo HTML (los espacios colapsan al renderizar), sin efecto funcional; no se pidió
  corrección.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Quedan **21 archivos / 50 ocurrencias** (19 `.html` +
2 `.ts` con `template:` inline en `shared/`) de `recursos-humanos.luxuryapp` — vacaciones/permisos
(siguiente clúster), contratos, cola de entrevistadores, evaluaciones.

### Detalle — FH-11n (aprobado, verificado independientemente) — FH-11n cerrado

Verificación independiente:

- **9 archivos legítimos del ticket**: diffs revisados uno a uno, `CommonModule`/`DatePipe`
  redundantes limpiados correctamente en Tareas 1, 2 y 9; `CommonModule` solo reemplazado (sin
  otro uso) en 3–6 y 8; las 25 ocurrencias reales migradas a `apiDate` — incluida 1 ocurrencia
  extra en `vacaciones-pasadas-registro.html` dentro de `[text]="'Fecha de Ingreso: ' + (...)"`
  (property binding, no `{{ }}`), que mi regex de auditoría original no capturaba — hallazgo
  correcto del ejecutor, no listado en el ticket.
- `solicitudes-historial.ts`: `providers: [DatePipe]`, `inject(DatePipe)` y las 2 llamadas
  `datePipe.transform(...)` en `onSearch()` confirmadas **intactas**; `CommonModule` reemplazado
  por `ApiDatePipe` en `imports:` solo para el uso de plantilla.
- Búsqueda multilínea + búsqueda de bindings `[...]="...| date"` → **0 residuales** en los 9
  archivos.
- **Hallazgo crítico fuera de alcance**: `git status` reveló 5 archivos adicionales modificados sin
  relación con este ticket ni con `| date`/`apiDate` en absoluto —
  `calendario-vacaciones-permisos/calendario-vacaciones-permisos.ts` (nueva lógica de colores de
  eventos + `console.log` de depuración), `modal-permiso-detalle.ts`/`.html` y
  `modal-vacacion-detalle.ts`/`.html` (rediseño completo de los modales, nuevos helpers, **cambio
  de endpoint** `LeaveRequest.getDetail` → `LeaveRequestApproval.detail`), 397 líneas
  insertadas / 87 eliminadas en total. Confirmado que ninguno de los 5 tuvo nunca un `| date`.
  Consultado con el usuario: confirmó que es trabajo propio/de otra sesión, ajeno a esta
  orquestación — se deja intacto, no se audita ni se revierte aquí.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, "Output
  location" impreso. Mismos 5 warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado (los 9 archivos del ticket), sin corrección.** Quedan **12 archivos / 26
ocurrencias** de `recursos-humanos.luxuryapp` (contratos + cola de entrevistadores + evaluaciones)
— el último clúster antes de completar toda la Fase 4.

### Detalle — FH-11o (aprobado, verificado independientemente) — FH-11o cerrado

Verificación independiente:

- **12 archivos legítimos del ticket** revisados diff por diff: `DatePipe`→`ApiDatePipe` en 6
  (Tareas 1, 3, 4, 5, 6, 12); `CurrencyPipe` conservado en Tarea 2; `CommonModule`+`DatePipe`
  redundantes limpiados en Tareas 7, 8, 9, 10; `CommonModule` conservado en Tarea 11 (por
  `\| number`).
- Búsqueda multilínea + bindings `[...]="...| date"` → **0 residuales** en los 12. 26/26
  `apiDate`. `\| currency` y `\| number` confirmados intactos (hallazgos reportados, no tocados).
- 2 workarounds `:"UTC"` eliminados (Tareas 11 y 12) — confirmado con grep.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, mismos 5
  warnings `NG8113` preexistentes.
- **Hallazgo crítico fuera de alcance (segunda vez, mismo patrón que FH-11n)**: `git status` reveló
  3 archivos adicionales sin relación con este ticket —
  `employee-interviewer-queue.ts`/`.html`/`.service.ts` — con una funcionalidad nueva completa
  ("Seguimiento de alta": método `reconfirmPresentation()`, nuevo signal, nuevo endpoint de
  servicio, nueva sección de UI). Consultado con el usuario: confirmó que es trabajo propio/de
  otra sesión — se deja intacto, no se audita ni se revierte aquí.
- **Verificación del gap reportado por el ejecutor** (2 `\| date` residuales en apps "cerradas"):
  ambos confirmados — `reclutamiento.luxuryapp/candidate-recruitment-interviews.html` (1 occ.
  envuelta, import `ApiDatePipe` ya correcto de un ticket previo) y
  `supplier.luxuryapp/provider-quotation/cuadro-comparativo-list.html` (huérfano, sin referencias,
  confirmado de nuevo). **Además encontré un tercer gap no reportado por el ejecutor**:
  `operations.luxuryapp/diagrams/diagram/diagram-gallery/diagram-gallery.ts` (plantilla inline,
  `CommonModule`, 1 occ. sin migrar) — su propio grep de verificación de cierre no lo detectó.
  Ticket de limpieza **FH-11p** redactado para los 3.

**Veredicto: ✅ Aprobado (los 12 archivos del ticket), sin corrección.** Con FH-11o cerrado,
`recursos-humanos.luxuryapp` queda completo. Queda pendiente **FH-11p** (limpieza de 3 gaps
residuales) para que la Fase 4 quede en 0 `\| date` en todo el proyecto.

### Detalle — FH-11p (aprobado, verificado independientemente) — FH-11p cerrado, Fase 4 completa

Verificación independiente:

- **Tarea 1** (`candidate-recruitment-interviews.html`): la ocurrencia envuelta migrada
  correctamente a `apiDate:` (línea 253-254); el `.ts` no requería cambios (import ya correcto de
  un ticket previo).
- **Tarea 2** (`diagram-gallery.ts`): `CommonModule` → `ApiDatePipe` correcto (ruta 5 niveles),
  ocurrencia dentro del `template:` inline migrada.
- **Tarea 3** (`cuadro-comparativo-list` huérfano): `CommonModule` → `ApiDatePipe` correcto (ruta
  3 niveles), ocurrencia migrada. Confirmado que la versión viva
  (`quotes/provider-quotation/cuadro-comparativo-list`) no fue tocada por este ticket — el diff
  que aparece ahí es acumulado desde FH-11f (este repo no tiene commits intermedios, `git diff`
  siempre compara contra el HEAD original), verificado con una lectura directa del archivo antes
  de escribir el ticket (ya decía `apiDate` en ese momento).
- **Verificación global de cierre de Fase 4** — corrida independientemente en 3 formas: búsqueda
  multilínea de `\| date` en `{{ }}` sobre todos los `.html` de `src/app/apps`, búsqueda de
  `\| date` real en `.ts` (excluyendo falsos positivos tipo `dates || dates`), y búsqueda de
  bindings `[...]="...\| date"` — **las 3 devuelven 0 resultados** en las 14 apps.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, mismos 5
  warnings `NG8113` preexistentes y ajenos.
- Nota (no bloqueante, mismo patrón que FH-11n/FH-11o): `candidate-recruitment-interviews.ts` /
  `.interface.ts` / `.service.ts` siguen mostrando la misma funcionalidad ajena
  (`reconfirmPresentation`) ya confirmada por el usuario como trabajo propio de otra sesión — no
  se audita ni se toca aquí.

**Veredicto: ✅ Aprobado, sin corrección. FASE 4 COMPLETA** — las 14 apps de
`client/angular/src/app/apps` migradas de `\| date` a `\| apiDate`, 0 residuales confirmados de
forma independiente en todos los patrones de uso (mustache, plantilla inline, bindings).

### Detalle — FH-2Xa (aprobado, verificado independientemente) — FH-2Xa cerrado

Verificación independiente:

- **7 archivos**: `git status` confirma exactamente los esperados (working tree limpio tras el
  commit `79dee8a8`, sin arrastre de cambios ajenos de tickets previos).
- Diff completo revisado: los 7 archivos con los campos narrowed a `string`/`string | null`
  exactamente como se pidió; `ChargeTemplateResponseDTO` intacto; ningún `FormControl` ni lógica
  de formularios tocada.
- `grep "Date | string\|string | Date"` sobre los 7 archivos → **0 residuales**.
- `npx tsc --noEmit -p tsconfig.json` → **corrido independientemente, exit 0, 0 errores** — confirma
  que el narrowing no rompió ningún consumidor (los formularios ya convertían con
  `dateS.getDateFormat()` antes de armar el payload, tal como se había verificado antes de escribir
  el ticket).
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, mismos 5
  warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección.** Primer módulo de FH-2X+ cerrado limpiamente, sin
sorpresas de compilación. Quedan 8 archivos con `Date \| string` fuera de `cobranza.luxuryapp`
(recursos-humanos.luxuryapp x3, operations.luxuryapp x1, un componente de input compartido x1, y
otros) — a evaluar caso por caso en el siguiente ticket, ya que no todos son DTOs de API (algunos
son tipos de `FormControl`/props de componente, con semántica distinta).

### Investigación previa a FH-2Xb — alcance real descubierto

El grep exacto (`campo: Date | string;`) solo capturaba 8 archivos; un grep más amplio reveló
**50 archivos** con la unión en distintos patrones: DTOs genuinos de API, `FormControl<Date |
string>` en formularios (la mayoría ya convierte correctamente antes de enviar), controles de
filtro de rango de fechas (deliberadamente flexibles porque el widget compartido `input-date`
puede emitir `Date` o `string`), y funciones utilitarias privadas (`formatDate`/`toDate`/etc, que
aceptan ambos tipos a propósito). Se confirmó que `input-date.ts`'s `control = input<AbstractControl
| any>()` no impone ningún tipo estricto — la mayoría del laxismo es histórico, no forzado por el
componente compartido.

Durante esta clasificación se encontraron **3 bugs reales**: formularios que envían un `Date` crudo
al API sin `dateS.getDateFormat()` (`employee-personal-data-form.ts`, `modificacion-salario-form.ts`,
`status-request-salary-modification-form.ts`) — mismo riesgo de desfase UTC que motivó la Fase 4,
en sentido de escritura. Consultado con el usuario, se decidió el alcance final: arreglar estos 3
bugs + tipar los DTOs genuinos restantes, dejando fuera los `FormControl` ya-seguros y los
controles de filtro (bajo valor, mismo riesgo de auditoría exhaustiva por archivo).

### Detalle — FH-2Xb (aprobado, verificado independientemente) — FH-2Xb cerrado

Verificación independiente:

- **7 archivos**: `git status` confirma exactamente los esperados.
- **Tarea 1** (`employee-personal-data-form.ts`): `DateService` importado e inyectado, `birth` en
  el payload de `onSubmit()` ahora pasa por `dateS.getDateFormat(...)` — confirmado que antes el
  payload llevaba el valor crudo del `FormControl` sin conversión.
- **Tareas 2-3** (`modificacion-salario-form.ts`, `status-request-salary-modification-form.ts`):
  mismo patrón — `DateService` inyectado, `transformPayload` ahora sobreescribe `executionDate`/
  `requestDate` con `dateS.getDateFormat(...)` en vez de enviar `this.form.getRawValue()` crudo.
  Las interfaces `RequestSalaryModificationEditDTO`/`StatusFormDTO` narrowed a `string | null`.
- **Tareas 4-7**: las 4 interfaces DTO narrowed correctamente (`pending-item.dto.ts`,
  `recurring-task-template-catalog.interface.ts`, `RequestSalaryModificationSeedDTO`,
  `RequestDismissalDraftDTO`), sin tocar la lógica de envío (ya era correcta en estos 4).
- `grep "Date | string\|string | Date"` sobre los 7 archivos → **0 residuales reales** — los únicos
  4 matches restantes son las firmas de los helpers privados `toDate(value: string | Date | ...)`,
  exactamente los que el ticket marcó como fuera de alcance por diseño.
- `npx tsc --noEmit -p tsconfig.json` → **corrido independientemente, exit 0, 0 errores**.
- `npx ng build --configuration production` → **corrido independientemente, 0 errores**, mismos 5
  warnings `NG8113` preexistentes y ajenos.

**Veredicto: ✅ Aprobado, sin corrección. PROYECTO COMPLETO.** Fase 4 (migración `apiDate`, 14
apps, 0 residuales) + Fase FH-2X+ (bug real de escritura corregido en 3 formularios + DTOs
genuinos tipados estrictamente) cerradas. El resto de `Date \| string` en la app (FormControl
ya-seguros, controles de filtro, componentes UI compartidos) queda documentado como decisión
consciente de no tocar — no aporta valor real y el riesgo de auditoría no se justifica.
