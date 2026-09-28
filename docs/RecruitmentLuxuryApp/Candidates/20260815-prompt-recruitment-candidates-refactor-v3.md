# Prompts de ejecución — Refactor Candidates V3

Cada prompt es autocontenido: se entrega **uno a la vez** al agente ejecutor (no adelantar
fases). El agente debe leer primero
`docs/plans/20260815-candidates-refactor-v3-plan.md` completo (es la fuente de verdad de
alcance y reglas) y luego `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/nueva-extructuraV3.md`
para el detalle de entidades/enums/reglas. Al terminar cada fase, el agente debe **detenerse
y reportar** (no continuar a la siguiente fase) para que Claude (supervisor) audite el diff
contra el plan antes de liberar el siguiente prompt.

Reglas transversales para el agente ejecutor (repetir si hace falta):
- No generar ni ejecutar migraciones EF contra base de datos real. Solo dejar el modelo listo
  para que el Tech Lead genere la migración (Data Migration Protocol).
- No borrar entidades/enums legacy fuera de la Fase 7, aunque parezcan no usados — verificar
  con `grep`/build antes de cualquier borrado.
- Si algo en el plan no coincide con lo que encuentra en el código real, **detenerse y
  reportar la discrepancia** en vez de improvisar una decisión de diseño no acordada.
- Seguir `CONVENTIONS.md` (1 archivo = 1 DTO, enums vía hub `SelectItemEnum`, sin AutoMapper,
  etc.) — no reintroducir patrones prohibidos al tocar código legacy.

---

## Prompt Fase 0 — Decisiones abiertas ✅ CERRADA (2026-08-15)

Ya no hace falta ejecutar este prompt: las 5 preguntas F0.1-F0.5 se investigaron y
resolvieron directamente (ver `docs/plans/20260815-candidates-refactor-v3-plan.md` sección
"Fase 0"). Resumen para el agente ejecutor, dáselo como contexto fijo antes de la Fase 1:

```
Decisiones ya cerradas para este refactor (no las vuelvas a cuestionar):
- F0.1: EntrevistaReclutamiento se elimina del pipeline. Solo queda una etapa de entrevista:
  EntrevistaOperaciones. Confirmado por el usuario 2026-08-15.
- F0.2: CandidateApplicationRole pasa de FK (ApplicationRoleId) a enum (Role:
  ApplicationRoleEnum) sin riesgo — no tiene consumidores funcionales hoy.
- F0.3: PreFiltro se elimina junto con EntrevistaReclutamiento (mismo cambio F0.1).
- F0.4: RequestPosition.Status no tiene valor específico para "alta en proceso"/"contratado".
  Al contratar (tarea 3.7), usa Status.Concluido. En AltaEnProceso no toques Status.
- F0.5: ningún agente ejecuta migraciones EF contra base de datos real.
```

---

## Prompt Fase 1 — Enums backend

```
Contexto: estamos ejecutando docs/plans/20260815-candidates-refactor-v3-plan.md, Fase 1.
Ya se resolvieron las decisiones de Fase 0 (te las paso aparte si aplica).

Archivos: api/LuxuryApp.Shared/Enums/

Tareas (checklist 1.1-1.7 del plan):
1. Crea CandidateProcessStage.cs con 8 valores: Nuevo, EnEspera, EntrevistaOperaciones,
   NoSePresento, Rechazado, Seleccionado, AltaEnProceso, Contratado (con [Display(Name=...)]
   en español, sigue el patrón de api/LuxuryApp.Shared/Enums/CandidateApplicationStage.cs
   existente). NO borres CandidateApplicationStage.cs.
2. Crea CandidateProcessStatus.cs: Abierto, EnPausa, Cerrado.
3. Crea CandidateClosureReason.cs: VacanteCerrada, Rechazo, NoSePresento, Contratacion,
   CancelacionManual, Otro.
4. Agrega el valor Reprogramar a api/LuxuryApp.Shared/Enums/CandidateDecision.cs (5º valor,
   no reordenar los existentes).
5. Crea CandidateRejectionReason.cs copiando los 8 valores de InterviewRejectionReason.cs
   SIN el valor NoSePresento. NO borres InterviewRejectionReason.cs.
6. Modifica api/LuxuryApp.Shared/Enums/CandidateInterviewStatus.cs: renombra Pendiente a
   Programada, elimina Confirmada, agrega Reprogramada. Antes de tocarlo, haz grep de
   "CandidateInterviewStatus" en todo el repo (no solo Candidates) y repórtame si hay
   consumidores fuera del módulo Candidates que este rename podría romper — si los hay,
   detente y pregúntame antes de continuar.
7. dotnet build LuxuryApp.Shared debe compilar sin errores.

Al terminar, dame el diff de los 6 archivos y el resultado del build. No toques nada de
Fase 2 (entidades) todavía.
```

---

## Prompt Fase 2 — Entidades + configuración EF

```
Contexto: Fase 1 ya aprobada. Ejecutando docs/plans/20260815-candidates-refactor-v3-plan.md,
Fase 2. Lee la tabla de diff completa al inicio del plan (sección 0) antes de tocar código,
ahí está el detalle campo por campo.

Archivos:
api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/Candidatos/Candidate.cs
.../CandidateApplicationRole.cs
.../CandidateProcess.cs
.../CandidateInterview.cs
.../CandidateInterviewResult.cs
.../CandidateStageHistory.cs
+ la configuración EF correspondiente (busca dónde se configuran estas entidades hoy —
ApplicationDbContext u otro archivo de configuración — antes de asumir el patrón).

Tareas (checklist 2.1-2.9 del plan). Sigue exactamente los renombres/campos de la tabla de
diff de la sección 0 del plan para cada entidad. Puntos que requieren cuidado especial:

- Candidate.cs: quitar Age, agregar BirthDate (DateOnly, [Required]), NormalizedPhoneNumber
  ([Required], único), NormalizedEmail ([Required], indexado no único). Age puede seguir
  usándose en otros lugares del código (DTOs, frontend) — NO los toques todavía, eso es
  Fase 4/6. Aquí solo cambia la entidad.
- CandidateProcess.cs: esta es la que más cambia. Quita los campos de agenda (ScheduledAt,
  InterviewerUserId, Status, RescheduledAt, RescheduleComment, ConfirmedAt) — ya viven en
  CandidateInterview. Renombra Decision→FinalDecision, DecisionReason→FinalDecisionReason
  (tipo CandidateRejectionReason?), DecisionComment→FinalDecisionComment,
  DecisionSentAt→FinalDecisionAt, DecisionByUserId→FinalDecisionByUserId. Agrega
  ProcessStatus, ClosureReason, SelectedForHiring, SelectedAt, HiringRequestedAt,
  HiredEntryDate. CurrentStage cambia de tipo CandidateApplicationStage a
  CandidateProcessStage, default Nuevo.
- CandidateInterview.cs: cambia la FK de CandidateApplicationId a CandidateProcessId.
  Reemplaza ScheduledDate+ScheduledTime por un solo ScheduledAt (DateTime). Elimina
  ScheduleStatus, ProposedRescheduleAt, ConfirmedAt. Agrega StageAtInterview
  (CandidateProcessStage), Location, MeetingLink, RescheduledFromInterviewId (Guid?) +
  navegación auto-referencial.
- CandidateInterviewResult.cs: DecisionReason pasa de InterviewRejectionReason (requerido) a
  CandidateRejectionReason? (nullable). Elimina ReceptionConfirmedAt.
- CandidateStageHistory.cs: elimina CandidateApplicationId y su navegación;
  CandidateProcessId pasa a [Required] (no nullable); FromStage/ToStage cambian de tipo a
  CandidateProcessStage.

No borres CandidateApplication.cs ni sus referencias todavía (Fase 7).

Después de editar entidades, actualiza la configuración EF con los índices nuevos descritos
en el plan (único NormalizedPhoneNumber, índice CandidateId+Role único en
CandidateApplicationRole, índice único filtrado de entrevista Programada por proceso, etc.)

dotnet build LuxuryApp.Infrastructure.Data debe compilar. Se ESPERAN errores en
LuxuryApp.Application (servicios que usan los campos que acabas de renombrar/eliminar) — no
los corrijas, son la Fase 3. Repórtame la lista de archivos con error para que sirva de
insumo a la Fase 3.

NO generes ni ejecutes ninguna migración EF (`dotnet ef migrations add`, `database update`).
Eso lo hace el Tech Lead al cierre de Fase 3.

Al terminar, dame el diff de las 6 entidades + configuración EF, el resultado del build de
Infrastructure.Data, y la lista de errores esperados en Application.
```

---

## Prompt Fase 3 — Reglas de servicio / máquina de estados

```
Contexto: Fase 2 ya aprobada (entidades migradas, Infrastructure.Data compila,
Application tiene errores esperados). Ejecutando
docs/plans/20260815-candidates-refactor-v3-plan.md, Fase 3 — la fase más grande.

Archivo principal:
api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateProcess/Services/CandidateProcessAppService.cs
+ su interfaz ICandidateProcessAppService.cs + DTOs en CandidateProcess/DTOs/

Antes de escribir código, lee nueva-extructuraV3.md secciones 6 (máquina de estados del
proceso), 7 (máquina de estados de entrevista), 8 (efectos automáticos al guardar
resultado), 9 (integración con RequestPosition) y 12 (reglas de servicio) — están citadas
textualmente porque son la especificación exacta a implementar.

Tareas (checklist 3.1-3.10 del plan):
1. Crear candidato: normalizar telefono/email, validar unicidad de NormalizedPhoneNumber
   (409 si duplica), validar BirthDate da >=18 años (400 si no).
2. Actualizar candidato: re-normalizar/re-validar si cambia teléfono; no permitir archivar
   con procesos ProcessStatus==Abierto.
3. Crear proceso: candidato no Archived, vacante activa, no duplicar
   (CandidateId+RequestPositionId) (409), CurrentStage=Nuevo, ProcessStatus=Abierto,
   insertar CandidateStageHistory inicial.
4. Agendar entrevista: proceso Abierto, no otra entrevista Programada activa (409), resolver
   entrevistador vía InterviewerMatrix (sin cambios ahí), crear CandidateInterview
   Programada con StageAtInterview=CurrentStage, si CurrentStage==Nuevo mover a
   EntrevistaOperaciones + historial.
5. Registrar resultado (reemplaza/renombra el flujo que hoy hace
   ExecuteInterviewerActionAsync — revisa el código actual antes de decidir si extiendes el
   método existente o creas uno nuevo, y dime cuál elegiste y por qué): implementa
   EXACTAMENTE la tabla de efectos de la sección 8 de nueva-extructuraV3.md para cada
   Decision (Aprobado/Rechazado/NoSePresento/EnEspera/Reprogramar). DecisionReason
   obligatorio solo si Decision==Rechazado (valida 400 si falta).
6. Cerrar vacante: busca dónde vive hoy el cierre de RequestPosition antes de decidir el
   punto de enganche — no asumas que existe un evento ya preparado. Repórtame qué
   encontraste. Cierra en cascada los CandidateProcess Abiertos de esa vacante
   (ProcessStatus=Cerrado, ClosureReason=VacanteCerrada).
7. Contratar: proceso a Contratado+Cerrado+ClosureReason=Contratacion,
   Candidate.Status=Contratado, actualizar RequestPosition (EntryDate, DateFinish, Status —
   usa la respuesta de F0.4 para el valor de Status).
8. Resuelve TODOS los errores de compilación heredados de Fase 2 en LuxuryApp.Application
   (no solo en CandidateProcessAppService — busca cualquier otro archivo que referencie los
   campos renombrados/eliminados).
9. dotnet build LuxuryApp.Application sin errores.
10. Prepara (no ejecutes) el resumen de diff de columnas de Fase 2 para que yo se lo pase al
    Tech Lead y genere la migración EF.

Al terminar, dame: el diff completo, el resultado del build, y la lista de decisiones que
tomaste donde el código real no coincidía exactamente con lo narrado en el plan (por
ejemplo, el punto de enganche de "cerrar vacante").
```

---

## Prompt Fase 3 — Cierre (hallazgo 3.0, 3 archivos legacy restantes)

```
Contexto: CandidateProcessAppService.cs (el orquestador nuevo) ya compila en 0 errores — lo
completó el supervisor directamente tras varios intentos fallidos de agentes. También ya
compilan en 0: CandidateAppService.cs, CandidateNotificationCoordinatorService.cs,
RequestPositionAppService.cs, CandidateAutomationService.cs. Verificado con build limpio
(rm -rf obj/bin + dotnet build), no confíes en builds incrementales viejos.

Quedan exactamente 3 archivos con error, los del "hallazgo 3.0" (servicios legacy que
perdieron su relación hacia CandidateInterview/CandidateInterviewResult cuando se quitó
CandidateApplicationId de esas entidades, y que además ahora comparten DTOs con
CandidateProcessAppService que fueron rediseñados):

1. api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs (326 errores)
2. api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/Services/CandidateInterviewResultAppService.cs (14 errores)
3. api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs (12 errores)

Lee primero docs/plans/20260815-candidates-refactor-v3-plan.md sección "Fase 3" completa
(incluida la tarea 3.0 y el bloque "Estado Fase 3" al final, que documenta exactamente qué
ya se hizo y qué DTOs cambiaron de forma).

Cambios de contrato ya aplicados que te van a generar la mayoría de los 326 errores de
CandidateApplicationAppService.cs — no son bugs tuyos, son consecuencia de decisiones ya
tomadas, no las reviertas:
- InterviewerActionRequest ya NO tiene Action/InterviewerActionType/CandidateApplicationId/
  InterviewAt/ReceptionConfirmedAt. Ahora es: CandidateProcessId (Guid), Decision
  (CandidateDecision), DecisionReason (CandidateRejectionReason?), AdditionalComment
  (string), NewScheduledAt (DateTime?, para Reprogramar). OJO: el endpoint
  `POST api/recruitment-candidate-applications/interviewer-action` (en
  CandidateApplicationEndPoint.cs linea 94) SIGUE registrado y usa este mismo DTO — por eso
  CandidateApplicationAppService.ExecuteInterviewerActionAsync no compila, su cuerpo usa los
  campos viejos que ya no existen.
- ChangeStageApplicationRequest.ToStage cambio de tipo CandidateApplicationStage a
  CandidateProcessStage. CandidateApplication.CurrentStage sigue siendo
  CandidateApplicationStage (10 valores, sin tocar). Son tipos incompatibles ahora: el
  metodo ChangeStageAsync de CandidateApplicationAppService ya no puede asignar
  request.ToStage a model.CurrentStage directamente.
- CandidateDecisionRequest.DecisionReason cambio de InterviewRejectionReason? a
  CandidateRejectionReason?. CandidateApplication.LastDecisionReason sigue siendo
  InterviewRejectionReason? (sin tocar). Mismo problema de incompatibilidad de tipos.
- CandidateInterview.Result es 1 a 1 (nullable, NO coleccion) — si ves algun sitio que
  asuma "Results" (plural) o una lista, es codigo viejo, corrigelo a Result (singular).
- CandidateStageHistory ya NO tiene CandidateApplicationId (solo CandidateProcessId,
  requerido). Cualquier codigo que intente escribir historial de etapa para una
  CandidateApplication debe eliminarse, no repararse (no hay donde guardarlo ya).

REGLA DE RESOLUCION (aplica a los 3 archivos, ya usada con exito en otros 2 servicios de
este mismo lote — sigue el mismo patron):
Para cada metodo roto, decide entre:
(a) Si es CRUD puro de CandidateApplication SIN tocar agenda/entrevista/decision/motivo
    (ejemplos en CandidateApplicationAppService: GetTrayAsync, GetByStageAsync, GetByIdAsync,
    CreateAsync, UpdateAsync, UploadCvAsync) — arreglalo normalmente, actualizando
    referencias a los campos/tipos que sí siguen existiendo. No lo stubees.
(b) Si el metodo maneja agenda, entrevista, decision, motivo de rechazo, o el alta
    (duplica lo que CandidateProcessAppService ya hace completo) — verifica en
    CandidateApplicationEndPoint.cs (o el EndPoint correspondiente de los otros 2 archivos)
    si el metodo sigue teniendo una ruta HTTP activa:
    - Si SI tiene ruta activa: reemplaza el cuerpo por
      `throw new NotSupportedException("Este flujo fue reemplazado por CandidateProcessAppService (V3), usa api/recruitment-candidate-processes/... en su lugar.");`
      manteniendo la firma del metodo intacta (no rompas la interfaz).
    - Si NO tiene ruta activa: puedes eliminar el metodo completo de la clase Y de su
      interfaz (ICandidateApplicationAppService / ICandidateInterviewAppService /
      ICandidateInterviewResultAppService), pero solo si confirmas que ningun otro archivo
      lo llama (grep del nombre del metodo en todo api/ antes de borrar).
    Candidatos probables a (b) en CandidateApplicationAppService, basado en las firmas de
    ICandidateApplicationAppService.cs: GetRecruitmentAgendaAsync,
    GetRecruitmentInterviewBoardAsync, ScheduleRecruitmentInterviewAsync,
    CancelRecruitmentInterviewAsync, ChangeStageAsync, RegisterDecisionAsync,
    ProcessHiringAsync, GetInterviewerViewAsync, ExecuteInterviewerActionAsync,
    GetInterviewResponseAsync, GetInterviewerQueueAsync. GetKpisAsync es dudoso: si su
    cuerpo solo agrega/cuenta sin escribir agenda/decision, puede que solo necesite arreglo
    de referencias, no stub — evalualo, no asumas.
(c) Para CandidateInterviewResultAppService.cs y CandidateInterviewAppService.cs: son
    servicios completos de retroalimentacion legacy, probablemente casi todos sus metodos
    caen en (b). Revisa si ya estan marcados [Obsolete] (el plan menciona que
    CandidateInterviewAppService ya lo estaba antes de este refactor) — si es asi, es
    señal adicional de que stubear es correcto.

No toques CandidateProcessAppService.cs, CandidateAppService.cs,
CandidateNotificationCoordinatorService.cs, RequestPositionAppService.cs,
CandidateAutomationService.cs — ya estan en 0 errores, no los necesitas y podrias romperlos.

Verifica con: `rm -rf api/LuxuryApp.Application/obj api/LuxuryApp.Application/bin && dotnet
build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q 2>&1 | grep "error
CS"` — build limpio, no confies en incremental. Meta: 0 errores en los 3 archivos.

Cuando termines, corre tambien (si existen como proyectos separados en la solución):
`dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj` y
`dotnet build api/LuxuryApp.Tests/LuxuryApp.Tests.csproj` (ajusta rutas si difieren) — pueden
tener sus propios errores en cascada si referencian estos 3 servicios o los DTOs
rediseñados.

Al terminar, tu reporte debe incluir: por cada uno de los 3 archivos, la lista de métodos que
stubeaste (con el motivo: sin ruta activa vs. reemplazado) vs. los que arreglaste
normalmente, el resultado exacto del build limpio (0 errores esperado), y cualquier
discrepancia entre lo que este prompt asumía y lo que encontraste en el código real. No
reportes "listo" si no verificaste el build limpio tú mismo.
```

---

## Prompt Fase 4 — DTOs, Endpoints, Notificaciones, Hub de enums

```
Contexto: Fase 3 está COMPLETA y auditada (backend LuxuryApp.Application compila en 0
errores, build limpio verificado por el supervisor el 2026-08-16). El orquestador
CandidateProcessAppService.cs tiene la máquina de estados completa; los 3 servicios legacy
(CandidateApplicationAppService, CandidateInterviewAppService,
CandidateInterviewResultAppService) quedaron como adaptadores que delegan a
CandidateProcessAppService donde aplica.

No hay migración EF generada todavía para este refactor (verificado: la última migración en
api/LuxuryApp.Infrastructure.Data/Data/Migrations/ es 20260811203819_RefactorCandidates, de
ANTES de este refactor V3). Esto no te bloquea: las tareas de esta fase son cambios de
código (DTOs, endpoints, hub de enums), no tocan el esquema de datos. Sigue sin generar ni
ejecutar ninguna migración tú — eso lo hace el Tech Lead por separado.

Verifiqué el estado real de cada pieza antes de escribir este prompt (no asumas que algo ya
está hecho solo porque lo dice una versión vieja del plan):
- GetKpisAsync YA vive en CandidateProcessAppService.cs (línea ~18) pero sigue devolviendo
  CandidateApplicationKpisDto (el DTO NO se renombró ni se movió de carpeta). El endpoint
  GET recruitment-candidate-processes/kpis YA está registrado en CandidateProcessEndPoint.cs
  (línea ~19) apuntando a este método — no necesitas registrar el endpoint, solo arreglar el
  DTO. CandidateApplicationAppService.GetKpisAsync (legacy, el endpoint
  GET recruitment-candidate-applications/kpis en CandidateApplicationEndPoint.cs línea ~36
  sigue activo) — revisa si ya delega al de CandidateProcess o si calcula por su cuenta; si
  calcula por su cuenta con datos legacy, decide si conviene que también delegue (patrón ya
  usado en los otros métodos de ese archivo) para no mantener dos cálculos de KPI en
  paralelo.
- Candidate/DTOs/CandidateCreateOrUpdateDto.cs y CandidateDetailDto.cs SIGUEN con
  `public int? Age` (no se tocaron en Fase 2/3, solo se cambió la entidad). Confirmado con
  grep, pendiente.
- CandidateInterview/DTOs/ (CandidateInterviewCreateDto.cs, CandidateInterviewItemDto.cs,
  CandidateInterviewRescheduleDto.cs) y CandidateInterviewResult/DTOs/
  (CandidateInterviewResultCreateDto.cs, CandidateInterviewResultItemDto.cs) SIGUEN con
  campos viejos (ScheduledDate/ScheduledTime/ScheduleStatus/ProposedRescheduleAt,
  ReceptionConfirmedAt, tipo InterviewRejectionReason). Compilan porque nada los llena ya
  desde esos campos de la entidad (quedaron huérfanos/sin mapear), no porque estén
  correctos. Pendiente real.
- CandidateProcess/DTOs/ (CandidateProcessListItemDto.cs, CandidateProcessDetailDto.cs) YA
  tienen CurrentStage tipo CandidateProcessStage y Decision/DecisionReason correctos (lo hizo
  el supervisor en Fase 3) pero NO exponen ProcessStatus, ClosureReason, SelectedForHiring,
  SelectedAt, HiringRequestedAt, HiredEntryDate — pendiente si hace falta exponerlos en algún
  DTO de lectura (evalúa cuál necesita cada campo, no los agregues todos a ciegas).
- Hub de enums: verifiqué api/LuxuryApp.Application/Moduls/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs
  — HOY solo existe la ruta "fuente-reclutamiento". NINGUNA de las rutas nuevas
  (candidate-process-stage, candidate-process-status, candidate-closure-reason,
  candidate-rejection-reason, candidate-decision, candidate-interview-status) existe, y
  tampoco existe "interview-modality" (una versión vieja del plan decía que ya existía, es
  falso, verifica tú mismo con grep antes de asumir nada de docs viejas).

Lee docs/plans/20260815-candidates-refactor-v3-plan.md sección "Fase 4" completa antes de
empezar (y el bloque "Estado Fase 3" justo arriba, para el contexto de qué cambiaron los
otros dos agentes/el supervisor).

TAREAS (en este orden):

1. Candidate/DTOs/: cambia `Age` (int?) por `BirthDate` (DateOnly) en
   CandidateCreateOrUpdateDto.cs y CandidateDetailDto.cs. Verifica dónde se mapean estos DTOs
   (probablemente en Candidate/Services/CandidateAppService.cs) y ajusta el mapeo a
   BirthDate. Si ese servicio ya usa BirthDate internamente (confírmalo, no asumas) puede que
   solo falte el DTO.

2. CandidateInterview/DTOs/ — reescribe cada uno para reflejar la entidad real (ScheduledAt
   único DateTime, StageAtInterview, Location, MeetingLink, RescheduledFromInterviewId,
   Status con los 5 valores nuevos). Quita ScheduledDate/ScheduledTime/ScheduleStatus/
   ProposedRescheduleAt. Verifica los mapeos en CandidateInterviewAppService.cs (ya
   reescrito, puede que ya use los campos nuevos internamente sin que el DTO los exponga
   todavía — en ese caso el fix es solo del DTO).

3. CandidateInterviewResult/DTOs/ — DecisionReason tipo CandidateRejectionReason? (nullable),
   quita ReceptionConfirmedAt. Verifica mapeos en CandidateInterviewResultAppService.cs.

4. CandidateProcess/DTOs/CandidateProcessDetailDto.cs (y ListItemDto si aplica): evalúa y
   agrega los campos de negocio que falten para que el frontend pueda mostrar el estado real
   del proceso: ProcessStatus, ClosureReason, SelectedForHiring, SelectedAt,
   HiringRequestedAt, HiredEntryDate. 1 archivo = 1 DTO, no crees un DTO nuevo si el
   existente solo necesita campos adicionales.

5. KPIs: renombra CandidateApplicationKpisDto → CandidateProcessKpisDto (archivo nuevo en
   CandidateProcess/DTOs/, borra el viejo de CandidateApplication/DTOs/ SOLO si nada más lo
   usa — grep primero). Actualiza CandidateProcessAppService.GetKpisAsync() para devolver el
   tipo nuevo. Elimina el campo PostulacionesEnEntrevistaReclutamiento y cualquier cálculo
   que dependa solo de la etapa EntrevistaReclutamiento (ya no existe, confirmado F0.1).
   Conserva el desglose de EntrevistaOperaciones. Decide qué hacer con
   CandidateApplicationAppService.GetKpisAsync (ver nota de contexto arriba) y documenta tu
   decisión.

6. Hub de enums — agrega en SelectItemEnumEndPoints.cs (sigue el patrón exacto de la línea
   de fuente-reclutamiento que ya existe, con Map<T>(...)): candidate-process-stage
   (CandidateProcessStage), candidate-process-status (CandidateProcessStatus),
   candidate-closure-reason (CandidateClosureReason), candidate-rejection-reason
   (CandidateRejectionReason), candidate-decision (CandidateDecision, ya con Reprogramar),
   candidate-interview-status (CandidateInterviewStatus). NO toques la ruta
   fuente-reclutamiento existente.

7. CandidateNotificationCoordinatorService.cs / ICandidateNotificationCoordinatorService.cs:
   revisa que ningún método siga leyendo campos de agenda directamente de CandidateProcess
   (ya no existen ahí desde Fase 2) — deben leerse desde CandidateInterview. Si ya compila en
   0 errores (confirmado en Fase 3), probablemente ya está bien; solo confirma, no asumas que
   hay trabajo pendiente aquí si no encuentras nada roto. No agregues notificaciones nuevas.

8. `rm -rf api/LuxuryApp.Application/obj api/LuxuryApp.Application/bin && dotnet build
   api/LuxuryApp.Application/LuxuryApp.Application.csproj` → 0 errores (build limpio).
   Luego `dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj` y
   `dotnet build api/LuxuryApp.Tests/LuxuryApp.Tests.csproj` (verifica las rutas reales de
   estos .csproj antes, pueden diferir) → 0 errores, ajustando tests que referencien tipos
   renombrados.

Al terminar, tu reporte debe incluir: diff o resumen por archivo de las 8 tareas, el
fragmento exacto de SelectItemEnumEndPoints.cs con las 6 rutas nuevas, tu decisión sobre
CandidateApplicationAppService.GetKpisAsync y por qué, resultado de los 3 builds limpios, y
cualquier discrepancia entre lo que este prompt asumía y lo que encontraste.
```

---

## Prompt Fase 5 — Frontend: interfaces y servicios

```
Contexto: backend completo (Fases 1-4 aprobadas y auditadas, 0 errores en Application/Api/
Tests con build limpio). Ejecutando docs/plans/20260815-candidates-refactor-v3-plan.md,
Fase 5.

Alcance: client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/ +
client/angular/src/app/core/enums/ + client/angular/src/app/core/services/enum-select.service.ts
— SOLO interfaces y servicios, sin tocar componentes/HTML todavía (eso es Fase 6).

Verifiqué el estado real del frontend antes de escribir este prompt (no asumas nada de
versiones viejas del plan):
- candidate/interfaces/candidate.dto.ts línea 25 y candidate-form.interface.ts línea 9:
  siguen con `age?: number` / `age: FormControl<number | null>`. Confirmado, pendiente.
- candidate-interview/interfaces/interviewer-action-request.dto.ts tiene el contrato VIEJO
  completo: `{ candidateApplicationId: string; candidateProcessId?: string; action:
  InterviewerActionType; reasonId?: string; comment?: string; receptionConfirmedAt?: string
  }`. El backend YA NO tiene nada de esto — InterviewerActionRequest (C#) ahora es:
  `{ candidateProcessId: Guid (requerido); decision: CandidateDecision (requerido);
  decisionReason?: CandidateRejectionReason; additionalComment: string; newScheduledAt?:
  DateTime (requerido solo si decision es Reprogramar) }`. Este DTO se reescribe completo,
  no se parchea.
- core/enums/candidate-application-stage.ts tiene el enum VIEJO de 10 valores completo
  (Nuevo, PreFiltro, EnEspera, EntrevistaReclutamiento, EntrevistaOperaciones, NoSePresento,
  Rechazado, Seleccionado, AltaEnProceso, Contratado). No existe todavía ningún enum de 8
  valores en el frontend.
- candidate-application/interfaces/candidate-application.ts usa `CandidateApplicationStage`
  en al menos 5 sitios (currentStage x2, fromStage, toStage x2) — es el archivo más afectado
  por el cambio de enum.
- 20 archivos .ts en el módulo referencian `candidateApplicationId` — no asumas que son
  todos del mismo tipo de uso, revisa cada uno (puede ser un campo real del contrato legacy
  que sigue vivo hasta Fase 7, o puede ser confusión con candidateProcessId).
- client/angular/src/app/core/constants/endpoints/reclutamiento.endpoints.ts YA tiene
  declarado el grupo completo `CandidateProcesses` (interviewerAction, schedule,
  cancelSchedule, changeStage, kpis, interviewResponse, etc., todos apuntando a
  recruitment-candidate-processes/...) — NO necesitas agregar rutas ahí, ya existen. Lo que
  falta es que los servicios/componentes las USEN en vez de las de `CandidateApplications`
  (legacy, recruitment-candidate-applications/...).
- core/services/enum-select.service.ts SOLO tiene `fuenteReclutamiento()`. Ninguno de los 6
  métodos para las rutas nuevas del hub (candidate-process-stage, candidate-process-status,
  candidate-closure-reason, candidate-rejection-reason, candidate-decision,
  candidate-interview-status) existe. Sigue el patrón exacto del método
  `fuenteReclutamiento` que ya está ahí.

Lee docs/plans/20260815-candidates-refactor-v3-plan.md sección "Fase 5" y también la sección
"0. Resumen ejecutivo" (tabla de diff completa, es tu referencia de qué campo backend
corresponde a qué) y el bloque "Estado Fase 4" para el detalle de DTOs backend ya cerrados
(CandidateProcessKpisDto, CandidateProcessDetailDto con ProcessStatus/ClosureReason/
SelectedForHiring/SelectedAt/HiringRequestedAt/HiredEntryDate, etc.).

TAREAS (en este orden):

1. candidate/interfaces/candidate.dto.ts y candidate-form.interface.ts: reemplaza `age` por
   `birthDate` (string ISO o Date, sigue el patrón que ya use el módulo para otras fechas).
   Agrega validador reactivo de mayoría de edad (18 años) espejo del backend
   (Candidate.BirthDate validation en CandidateAppService/CandidateProcessAppService).

2. Crea core/enums/candidate-process-stage.ts con las 8 etapas de CandidateProcessStage
   (Nuevo, EnEspera, EntrevistaOperaciones, NoSePresento, Rechazado, Seleccionado,
   AltaEnProceso, Contratado — sin PreFiltro ni EntrevistaReclutamiento). NO borres
   candidate-application-stage.ts todavía (Fase 7).

3. candidate-application/interfaces/candidate-application.ts: migra currentStage/fromStage/
   toStage de CandidateApplicationStage al nuevo CandidateProcessStage.

4. Reescribe interviewer-action-request.dto.ts completo con el contrato nuevo (ver arriba).
   Busca todos los consumidores de este archivo (grep InterviewerActionRequestDto en todo el
   módulo) y anota cuáles quedan rotos — no los arregles todavía si son componentes (Fase 6),
   pero si son otros archivos de interfaces/servicios sí corrígelos aquí.

5. candidate-interview/interfaces/: alinea con la entidad/DTO real — scheduledAt único
   (Date/string), stageAtInterview, rescheduledFromInterviewId, location, meetingLink;
   decisionReason opcional; quita scheduleStatus/confirmedAt/proposedRescheduleAt; status
   con los 5 valores nuevos (Programada/Realizada/NoAsistio/Reprogramada/Cancelada). Revisa
   si candidate-decision-reason-item.interface.ts sigue haciendo falta (el catálogo
   CandidateDecisionReason se elimina en Fase 7) — dime tu conclusión, no lo borres todavía.

6. Revisa uno por uno (no en bloque) los 20 archivos que usan candidateApplicationId: para
   cada uso, decide si debe migrar a candidateProcessId (si el dato real que se envía/recibe
   ya es un id de CandidateProcess) o si debe quedarse igual porque el endpoint que consume
   sigue siendo genuinamente el legacy `recruitment-candidate-applications/...` (válido hasta
   Fase 7). Dame la lista completa de archivos con la decisión tomada en cada uno.

7. enum-select.service.ts: agrega los 6 métodos nuevos siguiendo el patrón exacto de
   `fuenteReclutamiento()` (mismo estilo de nombre, mismo tipo de retorno), uno por cada ruta
   nueva del hub listada arriba.

8. Servicios que llaman interviewerAction/changeStage/registerDecision: haz que apunten al
   grupo `CandidateProcesses` de reclutamiento.endpoints.ts (no `CandidateApplications`) y
   usen los DTOs ya corregidos de los puntos 3-4.

9. KPIs: si hay una interfaz frontend para el dashboard (busca
   CandidateApplicationKpisDto o similar en candidate-application/interfaces/), renómbrala/
   actualízala para reflejar CandidateProcessKpisDto (backend, Fase 4) — sin el campo
   postulacionesEnEntrevistaReclutamiento (ya no existe) y confirma si
   postulacionesEnPreFiltro sigue presente en el backend (quedó como hallazgo pendiente de
   Fase 4, dato siempre en 0 pero el campo existe) — refleja lo que el backend realmente
   devuelve, no lo que "debería" devolver.

10. `npx tsc --noEmit` desde client/angular — se esperan errores en componentes/HTML, NO los
    corrijas (son Fase 6). Dame la lista completa de archivos con error como insumo exacto
    para el siguiente prompt.

Al terminar, tu reporte debe incluir: diff o resumen por archivo de las 10 tareas, la
decisión tomada en cada uno de los 20 archivos de candidateApplicationId (tarea 6), y la
lista de errores de tsc pendientes para Fase 6 (archivo + línea + mensaje).
```

---

## Prompt Fase 6 — Frontend: componentes

```
Contexto: Fase 5 completa y auditada (0 errores en interfaces/servicios; capa de contratos
verificada campo por campo contra el backend). Ejecutando
docs/plans/20260815-candidates-refactor-v3-plan.md, Fase 6 — la fase más grande de frontend.
Trabaja archivo por archivo y compila frecuentemente, no acumules un diff inmanejable.

El supervisor corrió `npx tsc --noEmit` desde client/angular y verificó EXACTAMENTE 19
errores reales, todos en componentes/consumidores (ningún archivo de interfaces). Esta es tu
lista de trabajo real, no una lista aproximada — cada tarea de abajo referencia los errores
concretos que resuelve:

ALCANCE — 2 carpetas, no solo una (hallazgo de Fase 5, antes fuera del plan original):
- client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/ (16 de los 19 errores)
- client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/
  (3 errores — el "Staff Board" de RRHH también consume InterviewerActionRequestDto)

TAREAS (cada una resuelve errores de tsc específicos, verifica con tsc después de cada una):

1. candidate/candidate-form.ts + .html: reemplaza el campo de Edad por un selector de fecha
   de nacimiento (birthDate, la interfaz ya lo tiene desde Fase 5) con validación de mayoría
   de edad en el formulario reactivo. No toques el selector de RecruitmentSource. (No genera
   error de tsc listado, pero es checklist 6.1 del plan — hazlo aunque no esté en la lista de
   errores).

2. candidate-application/candidate-application-kpis.ts líneas 170 y 337: quita las 2
   referencias a `postulacionesEnEntrevistaReclutamiento` (ya no existe en
   CandidateProcessKpisDto desde Fase 4). Revisa si hay una tarjeta/columna en el HTML que
   muestre ese dato y quítala también, no dejes UI apuntando a un campo inexistente.

3. candidate-interview/candidate-interview-feedback-form.ts líneas 121 y 137: el objeto que
   arma para InterviewerActionRequestDto todavía usa `candidateApplicationId` y `action`
   (ya no existen). Reescribe el submit con el contrato nuevo: `candidateProcessId`,
   `decision` (CandidateDecision), `decisionReason` (requerido solo si decision ===
   CandidateDecision.Rechazado — cambia el Validators.required fijo a condicional),
   `additionalComment`, `newScheduledAt` (requerido solo si decision ===
   CandidateDecision.Reprogramar). Agrega la opción Reprogramar al selector de decisión del
   formulario, con su propio campo de fecha/hora nueva cuando se selecciona.

4. candidate-interviewer-queue/candidate-interviewer-queue.ts líneas 213, 224 y 238: mismo
   problema que el punto 3 (3 sitios que arman InterviewerActionRequestDto con el shape
   viejo) — corrige los 3 con el contrato nuevo.

5. candidate-recruitment-interviews/candidate-recruitment-schedule-modal.ts:
   - línea 215: usa `CandidateApplicationStage.EntrevistaReclutamiento` donde se espera
     `CandidateProcessStage` — esa etapa ya no existe en el pipeline nuevo (colapsó a una
     sola etapa EntrevistaOperaciones, decisión F0.1). Revisa la lógica alrededor: si el
     código distinguía "enviar a entrevista de reclutamiento" vs "de operaciones", ahora es
     un solo flujo, ajusta la lógica, no solo el tipo.
   - línea 234: el objeto que arma para reagendar usa `proposedRescheduleAt` (no existe en
     CandidateInterviewRescheduleRequest). Revisa qué campo real espera esa interfaz (Fase 5
     ya la alineó) y úsalo.

6. candidate/candidate-detail.ts líneas 136-137: comparación entre `CandidateProcessStage` y
   `CandidateApplicationStage` sin overlap (son tipos distintos ahora). Revisa qué dato
   real está comparando (probablemente el detalle del candidato compara la etapa actual
   contra un valor hardcodeado del enum viejo) y corrige al tipo/enum nuevo.

7. recruitment-shared/candidate-decision-labels.ts línea 3: el `Record<CandidateDecision,
   string>` de labels no tiene la clave `Reprogramar` (5º valor del enum, agregado en Fase
   1). Agrega la etiqueta en español ("Reprogramar" o similar, sigue el tono de las demás
   etiquetas del mismo objeto).

8. recruitment-shared/candidate-stage-timeline.ts líneas 26 y 29: la función/componente
   recibe `CandidateProcessStage` pero su firma sigue esperando `CandidateApplicationStage`.
   Actualiza la firma (parámetros/tipos genéricos) al enum nuevo.

9. recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/
   employee-interview-feedback-form.ts línea 102: el objeto que arma para
   CandidateInterviewFeedbackCreate usa `interviewAt` (no existe en esa interfaz tras Fase
   5). Revisa qué campo real corresponde (probablemente se fusionó con scheduledAt de
   CandidateInterview) y corrígelo.

10. recursos-humanos.luxuryapp/.../employee-interviewer-queue/employee-interviewer-queue.ts
    líneas 253, 264 y 278: mismo problema que los puntos 3-4 (InterviewerActionRequestDto
    con shape viejo), 3 sitios — corrige los 3 con el contrato nuevo.

11. candidate-application/candidate-stage-change-modal.ts/.html: bórralo (cambio manual
    libre de etapa ya no aplica — la etapa avanza solo por acciones automáticas, decisión
    V2 R.9). Quita su uso/import en candidate-application-list.ts. Verifica con grep que no
    quede ninguna referencia huérfana antes de darlo por hecho.

12. candidate-recruitment-interviews/candidate-recruitment-interviews.ts: NO intentes
    resolver el hallazgo R.1 de V2 (desacople de EmployeeProviderForm en openAltaForm) — no
    está en el alcance de V3, no lo toques. Si sigue así, repórtamelo como deuda pendiente
    explícita, no lo arregles ni lo empeores.

13. recruitment-agenda-list.ts/.html: verifica que lee `CandidateInterview.scheduledAt`
    único (ya no hay split Reclutamiento/Operaciones, solo EntrevistaOperaciones) — si algo
    en este archivo ya compila pero muestra datos de una entrevista que ya no existe como
    concepto separado, corrígelo aunque tsc no lo marque como error.

14. ANTES de renombrar cualquier carpeta (candidate-application/ → candidate-process/, si se
    te ocurre por consistencia): DETENTE y pregúntame explícitamente. El plan lo deja como
    decisión abierta a propósito — no lo hagas sin confirmar, es un cambio de gran superficie
    que puede romper imports en cascada.

15. `npx tsc --noEmit` desde client/angular → 0 errores (confirma con el comando exacto,
    pégame la salida). `npm run lint` sin violaciones nuevas.

16. No hagas smoke test todavía (es Fase 8). Solo confirma que compila y lint pasa.

Al terminar, tu reporte debe incluir: diff o resumen por cada una de las 16 tareas (con
número de línea de antes/después en los casos de los errores de tsc), resultado exacto de
tsc y lint, y cualquier pregunta que me hiciste (punto 14) o deuda que dejaste documentada
explícitamente (punto 12).
```

---

## Prompt Fase 7 — Retiro de legacy

```
Contexto: Fases 1-6 completas y auditadas (backend 0 errores build limpio; frontend tsc exit
0). Ejecutando docs/plans/20260815-candidates-refactor-v3-plan.md, Fase 7 — la más delicada:
borra entidades, tablas y código. Sé conservador: antes de cada borrado, corre grep del
símbolo en TODO el repo (no solo en Candidates) y pégame el resultado antes de eliminar,
aunque este prompt diga que se puede borrar. Si encuentras un consumidor vivo que este
prompt no previó, DETENTE y avísame — no lo borres ni lo parches por tu cuenta.

El supervisor verificó lo siguiente antes de escribir este prompt (no partas de cero):

- Backend: ningún archivo .ts en TODO client/angular llama a
  `CandidateApplications.create`/`.update` ni al literal `recruitment-candidate-applications`
  fuera de reclutamiento.endpoints.ts y un doc histórico. El create/update legacy de
  CandidateApplication está huérfano en el frontend — seguro de retirar del lado backend.
- **BLOQUEANTE REAL, más amplio de lo previsto originalmente — resuélvelo ANTES de tocar
  backend (tarea 0, ampliada tras primer intento fallido de esta misma fase):** hay
  **4 consumidores vivos** del catálogo legacy `CandidateDecisionReason`, no solo 1:
  1. `reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response.ts`
     — ruteado (`candidates.routing.ts`), llama directo a
     `CandidateDecisionReasons.catalog?decision=...` con `CandidateDecisionReasonItem[]`.
  2. `recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/employee-interview-response.ts`
     — mismo patrón: fetch directo al catálogo, `CandidateDecisionReasonItem[]`,
     `reasonId` en el payload de acción.
  3. `recursos-humanos.luxuryapp/.../employee-interviewer-queue/employee-interview-feedback-form.ts`
     + `.html` — usa el componente wrapper `CandidateDecisionReasonSelect` (importado desde
     `reclutamiento.luxuryapp/candidates/recruitment-shared/`).
  4. `recruitment-shared/candidate-decision-reason-select.ts` (el wrapper) — **NO está
     huérfano** (una verificación previa se equivocó en esto): lo consume el punto 3. Solo
     se puede borrar cuando 1, 2 y 3 ya no dependan de él.
  Todos deben migrar al mismo patrón: motivo = enum `CandidateRejectionReason`, condicional
  solo si `decision === Rechazado`, vía `enum-select.service.ts` ->
  `candidateRejectionReason()` (Fase 5). El patrón de referencia correcto ya existe en
  `candidate-interview-feedback-form.ts` (arreglado en Fase 6) — cópialo, no lo reinventes.
  Si borras el backend de `CandidateDecisionReason` sin migrar los 4, rompes páginas reales
  en producción (Reclutamiento Y Staff Board de RRHH).
- Backend: `CandidateInterviewFeedback` tiene 7 referencias reales, más de las que
  documentaba el plan original: además del propio módulo Candidates
  (`CandidateAppService.cs` probablemente conteo de impacto/cascade-delete,
  `CandidateApplicationAppService.cs`, `CandidateInterviewEndPoint.cs`,
  `CandidateInterviewMapping.cs`, `CandidateInterviewAppService.cs`), también aparece en
  `RequestPositionAppService.cs` (verifica por qué — probablemente delete-impact) y en
  `SystemLuxuryApp/SendEmailGlobal/` (`EmailTemplates.cs`,
  `RecruitmentEmailService.cs` — plantilla de email legacy de feedback de entrevista).
  Revisa los 7 antes de borrar la entidad, no asumas que son solo los del módulo Candidates.

Lee docs/plans/20260815-candidates-refactor-v3-plan.md sección "Fase 7" completa y el bloque
"Estado Fase 6" justo antes, para contexto de qué ya quedó limpio en frontend.

TAREAS (en este orden — el orden importa, cada una es precondición de la siguiente):

0. **PRECONDICIÓN (ampliada — el intento anterior de esta fase encontró que el bloqueo no
   era solo 1 archivo, son 4).** Migra los 3 consumidores reales del catálogo legacy al
   patrón enum (copia el patrón ya correcto de `candidate-interview-feedback-form.ts`,
   Fase 6):
   a. `candidate-interview/candidate-interview-response.ts`: quita el fetch a
      `CandidateDecisionReasons.catalog` y el uso de `CandidateDecisionReasonItem`; usa
      `enum-select.service.ts` -> `candidateRejectionReason()` (Fase 5), motivo condicional
      solo si `decision === Rechazado`.
   b. `recursos-humanos.luxuryapp/.../employee-interviewer-queue/employee-interview-response.ts`:
      mismo arreglo que (a) — mismo patrón de fetch directo al catálogo, mismo fix.
   c. `recursos-humanos.luxuryapp/.../employee-interviewer-queue/employee-interview-feedback-form.ts`
      + `.html`: quita el uso del componente `CandidateDecisionReasonSelect`; reemplázalo por
      el selector de enum inline (mismo patrón que `candidate-interview-feedback-form.ts` —
      si ese archivo usa un control de formulario simple con las opciones del enum, replica
      exactamente esa estructura, no inventes una nueva).
   d. Con (a), (b) y (c) migrados, confirma con grep que `candidate-decision-reason-select.ts`
      y `candidate-decision-reason-item.interface.ts` ya no tienen consumidores — si es así,
      bórralos aquí mismo (son frontend, no backend, no hace falta esperar a la tarea 5).
   Si al revisar cualquiera de los 3 componentes descubres que es puramente redundante con
   otro (misma función, dos componentes duplicados entre Reclutamiento y RRHH), NO los
   fusiones ni borres por tu cuenta — repórtamelo y detente, es una decisión de producto que
   no te toca. `npx tsc --noEmit` debe seguir en 0 después de este paso antes de continuar
   a las tareas de backend (1 en adelante).

1. Backend: confirma con grep que nada más en el repo (backend o frontend) llama a
   `recruitment-candidate-applications` create/update. Si limpio, elimina
   `CandidateApplication` completo: entidad, `DbSet`, `CandidateApplicationAppService` +
   `ICandidateApplicationAppService`, `CandidateApplicationEndPoint`, sus DTOs, su Mapping.
   Recuerda: varios métodos de este servicio ya delegan a `CandidateProcessAppService`
   (patrón de adaptador de Fase 3) — al borrar el archivo completo no pierdes lógica real,
   solo el envoltorio.

2. Backend: con la tarea 0 ya cerrada (frontend no llama más al catálogo), elimina
   `CandidateDecisionReason`: entidad, `DbSet`, `CandidateDecisionReasonAppService` +
   interfaz, `CandidateDecisionReasonEndPoint`, DTOs, Mapping.

3. Backend: elimina `CandidateInterviewFeedback` — pero PRIMERO revisa y resuelve las 7
   referencias reales (no solo el módulo Candidates, ver nota arriba). El template de email
   legacy (`RecruitmentCandidateInterviewFeedbackEmailDTO`/`.cshtml`,
   `SendCandidateInterviewFeedbackEmailAsync` o similar en `RecruitmentEmailService.cs`)
   probablemente ya no se invoca desde ningún flujo activo (la notificación real usa
   `NotifyProcessInterviewFeedbackSubmittedAsync`, ver `CandidateNotificationCoordinatorService`
   de Fase 4) — confírmalo con grep de quién llama al método de email legacy antes de
   borrarlo. Luego elimina la entidad, `DbSet`, `CandidateInterviewAppService` (el legacy
   `[Obsolete]`), interfaz, `CandidateInterviewEndPoint`, DTOs, Mapping.

4. Backend: verifica con grep (uno por uno, no en bloque) y elimina si están huérfanos:
   `CandidateApplicationStage` (el enum viejo de 10 valores — ya no debería tener
   consumidores tras las tareas 1-3), `CandidateInterviewScheduleStatus`,
   `InterviewRejectionReason` (el viejo, con `NoSePresento`, reemplazado por
   `CandidateRejectionReason` desde Fase 1). También revisa `CandidateInterviewType.cs` y
   `CandidateInterviewOutcome.cs` — no están mencionados en ningún lugar de V3 ni de este
   plan, puede que ya estuvieran huérfanos desde antes del refactor V3; confirma antes de
   tocarlos, no asumas que son parte de este refactor.

5. Frontend: elimina `recruitment-shared/candidate-decision-reason-select.ts` SOLO si
   confirmaste en la tarea 0 que ya no lo usa nada (ni siquiera indirectamente vía el
   patrón de interfaz `CandidateDecisionReasonItem`). Limpia
   `reclutamiento.endpoints.ts` quitando el grupo `CandidateDecisionReasons` y cualquier
   ruta de `CandidateApplications` que ya no tenga ningún consumidor (verifica cada una, el
   grupo completo `CandidateApplications` puede que aún tenga rutas de lectura vivas — no
   borres el grupo entero a ciegas).

6. Actualiza `candidates.routing.ts` si algo cambió de nombre/ubicación en las tareas
   anteriores.

7. `rm -rf` obj/bin de Application y build limpio: `dotnet build`
   (Application + Api + Tests) → 0 errores. `npx tsc --noEmit` desde client/angular → 0
   errores. `npm run lint`.

8. Prepara (NO ejecutes) el script SQL de `DROP TABLE` para
   `RecruitmentCandidateApplications`, `RecruitmentCandidateInterviewFeedback`,
   `RecruitmentCandidateDecisionReasons` — con backup previo documentado, para que el Tech
   Lead lo revise y ejecute junto con la migración EF pendiente de todo el refactor.

Al terminar, tu reporte debe incluir: cómo resolviste la precondición 0 (o si me
preguntaste), el resultado de grep de cada símbolo antes de cada borrado (tareas 1-5), el
resultado de los 3 builds/checks limpios, y el script SQL preparado (sin ejecutar).
```

---

## Prompt Fase 8 — QA / Smoke test + documentación

```
Contexto: Fase 7 completa y auditada (build limpio backend 0 errores, tsc frontend 0
errores, módulos legacy retirados). Ejecutando
docs/plans/20260815-candidates-refactor-v3-plan.md, Fase 8, la última.

HALLAZGO DEL SUPERVISOR — resuélvelo ANTES del smoke test (tarea 0, nueva): la regla de V3
sección 9 "cuando la vacante se cierra sin contratación, los procesos abiertos se cierran en
cascada (ProcessStatus=Cerrado, ClosureReason=VacanteCerrada)" nunca se implementó. Verificado
con grep: `CandidateClosureReason.VacanteCerrada` no aparece en ningún archivo del backend.
Esto viene de la Fase 3 (quedó como pregunta sin resolver sobre dónde engancharlo) y se
perdió en las fases siguientes. Sin esto, un paso del smoke test de abajo va a fallar de
verdad, no es un problema de la prueba.

TAREA 0 (implementar antes de continuar):
- Revisa api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestPosition/Services/RequestPositionAppService.cs.
  No hay un método explícito "cerrar vacante" — el cambio de Status probablemente pasa por
  UpdateAsync (RequestPositionAddOrEditDTO trae el Status nuevo) o por otro flujo que
  encuentres. Identifica dónde el Status de RequestPosition pasa a Cancelado (o Concluido
  sin que ya sea resultado de un Contratado vía CandidateProcessAppService.ProcessHiringAsync
  — ese caso ya está cubierto, no lo dupliques).
- En ese punto, cuando el Status cambie a un estado de cierre y sea un cambio real (no
  no-op), agrega: buscar todos los CandidateProcess con RequestPositionId igual y
  ProcessStatus==Abierto, y para cada uno: ProcessStatus=Cerrado, ClosureReason=VacanteCerrada,
  ClosedAt=ahora. NO toques CurrentStage (V3 §9 es explícito: la etapa se queda como estaba).
  Usa una transacción si el método ya no tiene una.
- dotnet build LuxuryApp.Application → 0 errores antes de seguir.

1. Smoke test manual end-to-end (documenta cada paso con resultado real, no supuesto — si
   algo falla, repórtalo como falla, no lo omitas ni lo asumas):
   - Crear candidato con BirthDate de una persona menor de 18 años → debe rechazar.
   - Crear candidato válido.
   - Crear proceso sobre una vacante existente.
   - Agendar entrevista.
   - Registrar resultado Aprobado → verificar CurrentStage=Seleccionado y
     RequestPosition.SelectionDate actualizado.
   - Con otro proceso, registrar resultado Rechazado sin motivo → debe rechazar (400).
   - Registrar resultado Rechazado con motivo → verificar proceso Cerrado.
   - Registrar resultado Reprogramar (requiere newScheduledAt) → verificar que se crea una
     nueva CandidateInterview con RescheduledFromInterviewId apuntando a la anterior.
   - Cerrar una vacante con un proceso Abierto (vía la tarea 0 recién implementada) →
     verificar que el proceso pasa a ProcessStatus=Cerrado, ClosureReason=VacanteCerrada.
   - Proceso completo hasta Contratado: Seleccionado → AltaEnProceso (ProcessHiringAsync
     primera llamada) → Contratado (ProcessHiringAsync segunda llamada, ver Fase 3) →
     verificar Candidate.Status=Contratado y RequestPosition.Status=Concluido.
2. Actualiza client/angular/.../candidates/docs/README.md y docs/decisiones.md al estado
   real post-refactor (vigentes a 2026-08-11, quedaron desalineados — el pipeline ya no
   tiene 10 etapas sino 8, CandidateApplication ya no existe, etc.).
3. Actualiza api/.../Candidates/README.md (vigente a 2026-08-10, con hallazgos de auditoría
   que ya no aplican tras el refactor).
4. Marca nueva-extructuraV2.md y nueva-extructuraV3.md como "Ejecutado 2026-08-16" con
   referencia a docs/plans/20260815-candidates-refactor-v3-plan.md. Pregúntame si además
   quieres moverlos a docs/reporte_maestro/modulos/ antes de hacerlo (sugerencia del plan,
   no obligatoria).
5. node scripts/scan-mojibake.mjs client/angular → debe dar 0 mojibake nuevo.
6. Deja un resumen corto (no un documento nuevo) de deuda pendiente conocida y explícitamente
   fuera de este refactor, para que quede registrada: openAltaForm/EmployeeProviderForm sin
   desacoplar (R.1, V2), staff-board/interviewer-view.interface.ts y
   staff-board-interviewer.service.ts muertos sin borrar (Fase 7), y cualquier otra que hayas
   encontrado en el camino.

Al terminar, dame el reporte completo del smoke test (resultado real paso a paso, incluida
la tarea 0 nueva), confirma las 3 actualizaciones de documentación, y el resumen de deuda
pendiente del punto 6.
```
