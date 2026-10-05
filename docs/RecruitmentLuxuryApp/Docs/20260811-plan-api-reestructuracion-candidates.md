# Plan API - Reestructuracion Candidates

Fecha: 2026-08-11
Alcance:

- solo backend;
- sin depender de frontend;
- tomando como base la propuesta actual de fusion hacia `CandidateProcess`.

## Objetivo

Reestructurar el API de `Candidates` para eliminar duplicidad entre:

- `CandidateApplication`;
- `CandidateInterview`;
- `CandidateInterviewFeedback`;
- `CandidateInterviewResult`;

y converger a un modelo backend mas simple y consistente.

## Estado objetivo

Tablas o entidades objetivo:

1. `RequestPosition`
2. `Candidate`
3. `CandidateApplicationRole`
4. `CandidateWorkExperience`
5. `CandidateProcess`
6. `CandidateStageHistory`
7. `CandidateDecisionReason`
8. `InterviewerMatrix`

Piezas a retirar del modelo operativo:

1. `CandidateApplication`
2. `CandidateInterview`
3. `CandidateInterviewFeedback`
4. `CandidateInterviewResult`

---

## Fase 1 - Consolidacion del modelo de datos

### Objetivo

Definir la nueva entidad `CandidateProcess` en infraestructura y dejar lista la migracion base.

### Trabajo

1. Crear entidad `CandidateProcess`.
2. Configurar tabla nueva en `ApplicationDbContext`.
3. Configurar relaciones:
   - `CandidateProcess -> Candidate`
   - `CandidateProcess -> RequestPosition`
   - `CandidateProcess -> CandidateDecisionReason`
   - `CandidateStageHistory -> CandidateProcess`
4. Crear entidad puente `CandidateApplicationRole`.
5. Configurar relacion N:M:
   - `CandidateApplicationRole -> Candidate`
   - `CandidateApplicationRole -> ApplicationRole`
6. Ajustar `RequestPosition`:
   - dejar `DateFinish`
   - retirar `ConfirmationFinish`
   - retirar `SelectionDate`
   - retirar `EntryDate`
   - retirar `Fuente`
7. Ajustar `Candidate`:
   - retirar `RecruitmentSource`
   - confirmar que `CvFileName` queda solo aqui
8. Mantener temporalmente tablas legacy mientras corre la migracion funcional.

### Salida esperada

- nueva entidad compilando;
- migracion generada;
- sin romper aun servicios legacy.

---

## Fase 2 - Migracion de datos legacy a CandidateProcess

### Objetivo

Poblar `CandidateProcess` con informacion actual de `CandidateApplication` y `CandidateInterview`.

### Trabajo

1. Definir regla de mapeo:
   - `CandidateApplication.Id` o nuevo `Guid` para `CandidateProcess`
   - `CandidateId`
   - `RequestPositionId`
   - `CurrentStage`
   - `ApplicationDate -> RegisterDate`
   - entrevistas legacy/nuevas -> `ScheduledAt`
   - entrevistador -> `InterviewerUserId`
   - snapshots de decision -> `Decision`, `DecisionReasonId`, `DecisionComment`
   - `ClosedAt`
2. Si existe `CandidateInterviewResult`, priorizarla sobre snapshots legacy.
3. Si existe `CandidateInterviewFeedback`, usarla solo como fallback de migracion.
4. Migrar `CandidateStageHistory` para que apunte a `CandidateProcess`.
5. Migrar o reconstruir `LastDecision` ya consolidada.

### Salida esperada

- data funcional disponible en `CandidateProcess`;
- historial amarrado a la nueva entidad.

---

## Fase 3 - Servicios backend nuevos

### Objetivo

Crear la capa de aplicacion de `CandidateProcess` y empezar a sacar dependencias del modelo viejo.

### Trabajo

1. Crear carpeta nueva:
   - `Candidates/CandidateProcess`
2. Crear:
   - DTOs
   - Interface
   - Mapping
   - AppService
   - EndPoint
3. Operaciones minimas:
   - crear proceso candidato-vacante
   - agendar entrevista
   - reagendar
   - cancelar
   - confirmar
   - cerrar con decision
   - listar por vacante
   - listar por candidato
   - listar agenda reclutamiento
   - listar cola entrevistador
4. Mover la escritura de historial de etapas al nuevo servicio.

### Salida esperada

- `CandidateProcessAppService` como nueva fuente de verdad.

---

## Fase 4 - Reescritura de consultas operativas

### Objetivo

Reescribir consultas de negocio que hoy dependen de `CandidateApplication` o `CandidateInterview`.

### Trabajo

1. Reescribir agenda de reclutamiento.
2. Reescribir interviewer queue.
3. Reescribir board de entrevistas.
4. Reescribir listados por vacante.
5. Reescribir detalle por puesto o work position.
6. Reescribir KPIs que dependan de entrevista/postulacion.

### Regla

Desde esta fase, las lecturas nuevas ya no deben consultar tablas legacy salvo para comparacion controlada.

### Avance 2026-08-11

Ya quedo montada la primera capa de lectura sobre `CandidateProcess`, sin agregar cambios nuevos al modelo fisico:

1. `GET api/recruitment-candidate-processes/candidate/{candidateId}`
   - lista procesos del candidato en el modelo nuevo.
2. `GET api/recruitment-candidate-processes/request-position/{requestPositionId}`
   - devuelve detalle operativo de la vacante con activos e historico.
3. `GET api/recruitment-candidate-processes/work-position/{workPositionId}`
   - devuelve detalle operativo por puesto agrupando vacantes y sus candidatos.

Notas:

- este corte no agrega una migracion adicional;
- la migracion consolidada sigue pudiendo salir en un solo paquete;
- aun falta reescribir agenda, interviewer queue y boards legacy para que lean primero `CandidateProcess`.

### Avance 2026-08-11 (cierre operativo backend)

Quedo migrada la capa operativa principal de backend para dejar de leer columnas legacy en consultas, notificaciones y automatizaciones:

1. Consultas operativas sobre `CandidateProcess`
   - `GetRecruitmentAgendaAsync`
   - `GetRecruitmentInterviewBoardAsync`
   - `GetInterviewerQueueAsync`
2. Puentes legacy mantenidos temporalmente
   - `CandidateApplicationAppService.GetRecruitmentAgendaAsync()`
   - `CandidateApplicationAppService.GetRecruitmentInterviewBoardAsync()`
   - `CandidateApplicationAppService.GetInterviewerQueueAsync()`
   - ahora delegan a `CandidateProcessAppService`.
3. Notificaciones operativas sobre `CandidateProcess`
   - `CandidateNotificationCoordinatorService` ya carga `CandidateProcess`
     como fuente de verdad.
   - la fecha de entrevista sale de `ScheduledAt`.
   - el entrevistador asignado sale de `InterviewerUserId`.
   - el CV adjunto sale del `Candidate` maestro usando
     `RecruitmentMasterCandidateCvDirectory(candidateId)`.
4. Automatizacion diaria sobre `CandidateProcess`
   - `CandidateAutomationService` ya evalua:
     - etapa detenida;
     - agenda pendiente;
     - recordatorio;
     - vencida;
     - escalada;
   - usando `RegisterDate`, `ScheduledAt`, `InterviewerUserId` y `Decision`.

Pendiente para la siguiente fase:

- reescribir payloads y contratos que aun nombren `candidateApplicationId`
  solo por compatibilidad semantica;
- retirar definitivamente servicios y entidades legacy del flujo operativo;
- ejecutar la migracion unica final de limpieza.

### Avance 2026-08-11 (puente controlado legacy)

Se dio un paso adicional para no seguir mezclando agenda en dos modelos al mismo tiempo:

1. `CandidateApplicationAppService.ScheduleRecruitmentInterviewAsync()`
   - ahora intenta resolver el `CandidateProcess` activo por
     `CandidateId + RequestPositionId`;
   - si existe, agenda primero sobre `CandidateProcess`;
   - despues sincroniza la sombra legacy en `CandidateApplication`
     para no romper pantallas viejas mientras termina la transicion.
2. `CandidateApplicationAppService.CancelRecruitmentInterviewAsync()`
   - sigue la misma estrategia;
   - cancelacion operativa en `CandidateProcess` primero;
   - sincronizacion legacy despues.
3. Servicios marcados como legacy explicito:
   - `ICandidateInterviewAppService`
   - `CandidateInterviewAppService`
   - `ICandidateInterviewResultAppService`
   - `CandidateInterviewResultAppService`
4. Cambio de etapa y decision tambien pasan por el nucleo nuevo:
   - `CandidateApplicationAppService.ChangeStageAsync()`
   - `CandidateApplicationAppService.RegisterDecisionAsync()`
   - si existe `CandidateProcess` activo, primero delegan en
     `CandidateProcessAppService` y despues sincronizan la sombra legacy.
5. Correccion semantica de notificacion:
   - al enviar a `EntrevistaOperaciones`, la notificacion usa
     `CandidateProcess.Id` cuando ya existe proceso nuevo, evitando disparar el
     coordinador con un ID legacy incompatible.
6. Acciones del entrevistador sobre el nucleo nuevo:
   - `ExecuteInterviewerActionAsync()` ya delega en `CandidateProcess` para:
     - feedback (`EnEspera`);
     - no show;
     - rechazo;
     - aprobacion.
   - cuando existe proceso nuevo, ya no inserta `CandidateInterviewFeedback`
     como fuente operativa.
7. Correccion de regla en `CandidateProcess.RegisterDecisionAsync()`:
   - `Aprobado` desde `EntrevistaReclutamiento` ahora pasa a
     `EntrevistaOperaciones`;
   - `Aprobado` desde `EntrevistaOperaciones` pasa a `Seleccionado`;
   - `EnEspera` ya no cierra el proceso;
   - solo decisiones terminales cierran `ClosedAt`.

Resultado:

- la agenda deja de depender solo de columnas legacy incluso cuando el flujo
  entra todavia por `CandidateApplication`;
- cambio de etapa, decision y agenda ya no quedan partidos entre dos fuentes;
- las acciones del entrevistador ya no dependen de persistir feedback legacy
  cuando existe `CandidateProcess`;
- queda mas claro que `CandidateInterview*` ya no debe crecer funcionalmente.

### Avance 2026-08-11 (lectura/escritura legacy de feedback sobre el nucleo nuevo)

Se ajusto la compatibilidad temporal de `CandidateInterviewAppService` para que
no siga reforzando `CandidateInterviewFeedback` como fuente operativa cuando ya
existe un `CandidateProcess` activo:

1. `SubmitFeedbackAsync()`
   - resuelve la postulacion legacy;
   - busca el `CandidateProcess` activo por `CandidateId + RequestPositionId`;
   - si el proceso existe:
     - registra confirmacion de recepcion en `CandidateProcess.ConfirmedAt`
       cuando aplique;
     - delega la decision a `CandidateProcessAppService.RegisterDecisionAsync()`;
     - dispara notificaciones usando `process.Id`;
     - devuelve un `CandidateInterviewFeedbackItemDTO` sintetico para no romper
       el contrato temporal.
2. `GetByApplicationAsync()`
   - si existe `CandidateProcess`, ya no lee `CandidateInterviewFeedback`;
   - arma la respuesta desde `CandidateProcess.Decision*`,
     `CandidateProcess.ConfirmedAt` y `CandidateProcess.ScheduledAt`;
   - si no existe proceso nuevo, conserva el fallback legacy.

Resultado:

- los endpoints legacy de feedback ya no obligan a seguir insertando feedback
  legacy cuando el proceso nuevo esta activo;
- la decision operativa queda centralizada en `CandidateProcess`;
- la compatibilidad de contrato se mantiene mientras se limpia frontend y
  endpoints consumidores.

### Avance 2026-08-11 (resultado legacy de entrevista sobre CandidateProcess)

Tambien se alineo `CandidateInterviewResultAppService` para no seguir dejando
el resultado final en una segunda fuente cuando la entrevista ya esta modelada
en `CandidateProcess`:

1. `RegisterResultAsync()`
   - resuelve la entrevista legacy;
   - valida motivo vs decision;
   - si encuentra `CandidateProcess` activo asociado a la postulacion legacy:
     - delega la decision a `CandidateProcessAppService.RegisterDecisionAsync()`;
     - sincroniza la sombra minima de `CandidateInterview` (`Status`, `ClosedAt`);
     - devuelve un `CandidateInterviewResultItemDTO` sintetico compatible.
2. `GetHistoryByInterviewAsync()`
   - si existe `CandidateProcess`, arma la respuesta desde
     `Decision`, `DecisionReasonId`, `DecisionComment`, `DecisionSentAt` y
     `DecisionByUserId`;
   - si no existe proceso nuevo, conserva el fallback a
     `CandidateInterviewResult`.

Resultado:

- `CandidateInterviewResult` deja de crecer como fuente operativa cuando el
  proceso nuevo ya existe;
- feedback y resultado legacy ya convergen hacia el mismo nucleo de decision;
- el retiro final de tablas legacy queda mejor preparado para la fase de
  limpieza.

### Avance 2026-08-11 (contratos de transicion hacia CandidateProcess)

Se dejo preparada una capa de compatibilidad de contratos para que frontend y
consumidores puedan migrar sin romper el API actual:

1. DTOs process-backed ahora exponen tambien `CandidateProcessId`
   - `InterviewerApplicationViewDTO`
   - `CandidateInterviewResponseDTO`
   - `CandidateInterviewerQueueItemDTO`
   - `CandidateRecruitmentInterviewBoardItemDTO`
2. Compatibilidad mantenida
   - `CandidateApplicationId` se conserva en los mismos contratos;
   - cuando el dato realmente viene de `CandidateProcess`, ambos campos salen
     con `process.Id`;
   - cuando la respuesta sigue viniendo de flujo legacy, `CandidateProcessId`
     sale `null`.
3. Accion del entrevistador preparada para ambos mundos
   - `InterviewerActionRequest` ahora admite `CandidateProcessId` opcional;
   - `ExecuteInterviewerActionAsync()` intenta resolver primero el proceso
     nuevo y, si no viene, conserva el camino legacy por `CandidateApplicationId`.

Resultado:

- el contrato deja de esconder que la fuente real ya es `CandidateProcess`;
- se reduce el acoplamiento semantico a `CandidateApplication` sin romper
  pantallas actuales;
- la siguiente fase puede empezar a mover consumidores a `CandidateProcessId`
  de manera explicita.

### Avance 2026-08-11 (CandidateInterview como fachada legacy sobre CandidateProcess)

Se completo otro tramo de compatibilidad para que la operacion de entrevistas
ya no dependa de `CandidateInterview` como motor principal cuando existe el
nucleo nuevo:

1. Escritura legacy redirigida a `CandidateProcess`
   - `CreateInterviewAsync()`
   - `RescheduleInterviewAsync()`
   - `ConfirmInterviewAsync()`
   - `CancelInterviewAsync()`
   - `CloseInterviewAsync()`
2. Lectura legacy redirigida a `CandidateProcess`
   - `GetInterviewsByApplicationAsync()`
   - `GetInterviewsByWorkPositionAsync()`
   - `GetInterviewsByInterviewerAsync()`
3. Compatibilidad mantenida
   - si existe proceso activo, la respuesta sale sintetizada desde
     `CandidateProcess`;
   - si no existe proceso nuevo, se conserva el fallback sobre
     `CandidateInterview`;
   - `CandidateInterviewItemDTO` ya expone `CandidateProcessId`.
4. Correcciones tecnicas del puente
   - las operaciones de reagenda, confirmacion, cancelacion y cierre ya cargan
     la `CandidateApplication` legacy para resolver correctamente el proceso
     nuevo asociado;
   - el rol seguro de fallback del entrevistador quedo alineado con el enum
     real: `ApplicationRoleEnum.GerenteOperaciones`.

Resultado:

- `CandidateInterview` queda mas cerca de una fachada de compatibilidad y menos
  de un segundo flujo operativo;
- el nucleo nuevo sigue consolidandose sin tocar la data protegida de
  `RequestPosition`;
- la siguiente fase ya puede concentrarse en limpieza y retiro de dependencias
  operativas legacy.

### Avance 2026-08-11 (CV maestro del candidato y detalle legacy process-backed)

Se endurecieron dos reglas mas del dominio sin requerir migracion adicional:

1. CV maestro del candidato como fuente operativa
   - `UploadCvAsync()` en `CandidateApplicationAppService` ya guarda el archivo
     en el directorio maestro del candidato;
   - la validacion de alta ya revisa `Candidate.CvFileName`;
   - `BuildCvFileUrl()` y `ResolveCvFileName()` dejaron de depender de la ruta
     legacy por postulacion.
2. Sombra legacy minimizada
   - `CandidateApplication.CvFileName` se mantiene solo como sombra temporal de
     compatibilidad mientras exista la columna en BD;
   - la entidad y DTOs quedaron documentados como legacy en este punto.
3. Detalle legacy alimentado desde el nucleo nuevo
   - `CandidateApplicationDetailDTO` ahora expone `CandidateProcessId`;
   - `CandidateApplicationAppService.GetByIdAsync()` conserva el `Id` legacy de
     la postulacion, pero si existe `CandidateProcess` activo arma el detalle
     principal desde `CandidateProcessDetailDTO`;
   - `LivesNearWorkplace` queda explicitamente marcado como campo legacy
     pendiente de retiro.

Resultado:

- el CV deja de estar repartido entre dos lugares operativos;
- el endpoint legacy de detalle ya no obliga a leer semantica vieja cuando el
  proceso nuevo existe;
- la siguiente fase puede enfocarse en retirar mas campos y comportamientos
  heredados de `CandidateApplication`.

### Avance 2026-08-11 (listados legacy process-backed)

Se termino de cerrar el puente de lectura de bandejas legacy para que no solo
compilen, sino que ya consuman mejor el nucleo nuevo:

1. `CandidateApplicationAppService.GetTrayAsync()`
   - ahora prioriza `CandidateProcess` activo por
     `CandidateId + RequestPositionId`;
   - expone `CandidateProcessId` en cada item;
   - toma etapa, vacante, cliente, CV y decision desde `CandidateProcess`
     cuando ya existe.
2. `CandidateApplicationAppService.GetByStageAsync()`
   - filtra la etapa usando `CandidateProcess.CurrentStage` como fuente de
     verdad cuando el proceso nuevo existe;
   - solo hace fallback a `CandidateApplication.CurrentStage` si aun no hay
     proceso consolidado.
3. Nombres de entrevistador ya resueltos
   - los listados dejaron de regresar solo `InterviewerUserId` como texto;
   - ahora resuelven el nombre real contra `dbContext.Users` tanto para datos
     legacy como para procesos nuevos.

Resultado:

- la bandeja legacy ya no oculta que el proceso real vive en
  `CandidateProcess`;
- los consumidores existentes pueden seguir usando `CandidateApplicationId`
  mientras empiezan a migrar a `CandidateProcessId`;
- la siguiente fase ya puede concentrarse en quitar mas semantica vieja y no
  en corregir incoherencias de lectura.

### Avance 2026-08-11 (contratos y endpoints process-first en entrevistas)

Se dio otro paso para que el API ya no obligue a integrarse pensando en
`CandidateApplication` cuando la fuente real es `CandidateProcess`:

1. DTOs legacy suavizados para transicion
   - `CandidateInterviewCreateDTO`
   - `CandidateInterviewFeedbackCreateDTO`
   - ahora aceptan `CandidateProcessId` como identificador preferido;
   - `CandidateApplicationId` queda opcional y solo como compatibilidad.
2. Feedback legacy ya puede resolverse por proceso
   - `ICandidateInterviewAppService.GetByProcessAsync()`
   - `GET api/recruitment-candidate-interviews/process/{candidateProcessId}`
3. Citas legacy ya pueden resolverse por proceso
   - `ICandidateInterviewAppService.GetInterviewsByProcessAsync()`
   - `GET api/recruitment-candidate-interviews/by-process/{candidateProcessId}`
4. `CandidateInterviewAppService`
   - `SubmitFeedbackAsync()` ya intenta resolver primero por `CandidateProcessId`;
   - `CreateInterviewAsync()` ya trabaja process-first y solo cae a
     `CandidateApplication` si aun no existe proceso nuevo;
   - los items de feedback sinteticos ya exponen `CandidateProcessId`.
5. Notificaciones process-first
   - `ICandidateNotificationCoordinatorService` ya expone metodos nuevos
     centrados en `CandidateProcess`;
   - `CandidateNotificationCoordinatorService` mantiene wrappers legacy, pero
     la implementacion real ya vive en los metodos `NotifyProcess*`;
   - automatizaciones y flujos principales ya llaman esos metodos nuevos.

Resultado:

- la semantica del API operativo queda mas alineada con el modelo nuevo;
- los contratos nuevos ya pueden integrarse sin depender de IDs legacy;
- se conserva compatibilidad temporal para no romper frontend mientras termina
  la limpieza final.

### Avance 2026-08-11 (CandidateInterviewResult process-first)

Tambien se alineo el bloque de resultados de entrevista para no seguir
obligando al API a operar con `InterviewId` legacy como identificador
principal:

1. DTOs de resultado suavizados para transicion
   - `CandidateInterviewResultCreateDTO`
   - `CandidateInterviewResultItemDTO`
   - ahora admiten/exponen `CandidateProcessId`;
   - `InterviewId` queda como compatibilidad temporal.
2. Historial de resultados por proceso
   - `ICandidateInterviewResultAppService.GetHistoryByProcessAsync()`
   - `GET api/recruitment-candidate-interview-results/process/{candidateProcessId}`
3. `CandidateInterviewResultAppService`
   - `RegisterResultAsync()` ya intenta resolver primero por
     `CandidateProcessId`;
   - solo cae a `CandidateInterview` si aun no existe proceso nuevo;
   - el item sintetico ya refleja `CandidateProcessId` cuando la decision vive
     en el nucleo nuevo.

Resultado:

- feedback, cita y resultado legacy ya quedaron con una ruta clara hacia
  `CandidateProcess`;
- se reduce otro punto de dependencia dura en tablas legacy;
- la siguiente limpieza puede concentrarse en retiro real de endpoints y tablas
  de compatibilidad, no en seguir corrigiendo escritura operativa.

---

## Fase 5 - Notificaciones y automatizaciones

### Objetivo

Montar notificaciones y automatizaciones sobre `CandidateProcess`.

### Trabajo

1. Reescribir coordinador de notificaciones:
   - nueva entrevista enviada
   - reagenda
   - confirmacion
   - cancelacion
   - decision enviada
2. Reescribir automatizaciones:
   - vencidas
   - sin feedback
   - escalaciones
3. Reescribir payloads de email, SignalR, push y multicanal.
4. Corregir deep links para que apunten a componentes definitivos.

---

## Fase 6 - Limpieza de legacy

### Objetivo

Retirar dependencias del modelo anterior.

### Trabajo

1. Marcar servicios legacy como obsoletos temporalmente.
2. Quitar endpoints no usados.
3. Eliminar `CandidateInterviewFeedback`.
4. Eliminar `CandidateInterviewResult` si ya absorbimos decision en `CandidateProcess`.
5. Eliminar `CandidateApplication` y `CandidateInterview` del flujo operativo.
6. Generar migracion final de limpieza.

### Condicion de entrada

No entrar aqui hasta que:

- consultas;
- notificaciones;
- y pruebas de flujo;

esten estables sobre `CandidateProcess`.

---

## Fase 7 - Endurecimiento de reglas de dominio

### Objetivo

Cerrar reglas para evitar que el modelo vuelva a contaminarse.

### Reglas a asegurar

1. El CV solo vive en `Candidate`.
2. `RequestPosition` solo guarda datos de vacante.
3. `DateFinish` se llena automaticamente al concluir vacante.
4. `InterviewerUserId` es la unica referencia persistida al entrevistador.
5. Los roles del entrevistador se resuelven por usuario/matriz, no por columna duplicada.
6. La decision final vive en una sola fuente de verdad.
7. Las etapas se auditan en `CandidateStageHistory`.

---

## Orden recomendado de ejecucion

1. Fase 1 - modelo
2. Fase 2 - migracion de datos
3. Fase 3 - nuevo servicio
4. Fase 4 - consultas
5. Fase 5 - notificaciones
6. Fase 6 - limpieza
7. Fase 7 - endurecimiento

---

## Lo que conviene hacer ya

Si hoy solo vamos a trabajar API, mi recomendacion inmediata es:

1. crear `CandidateProcess`;
2. crear `CandidateApplicationRole`;
3. ajustar `RequestPosition` y `Candidate`;
4. dejar lista la migracion;
5. despues abrir el nuevo `CandidateProcessAppService`.

Ese es el siguiente corte tecnico mas sano.
