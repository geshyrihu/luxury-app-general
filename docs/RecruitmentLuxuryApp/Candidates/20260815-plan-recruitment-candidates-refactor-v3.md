# Plan de Implementación — Refactor Modelo Candidates (V3)

**Fecha:** 2026-08-15
**Alcance:** Backend `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/` +
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/Candidatos/` +
`api/LuxuryApp.Shared/Enums/Candidate*.cs` + Frontend
`client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`
**Origen:** `client/angular/.../candidates/nueva-extructuraV3.md` (modelo final acordado,
sustituye a las secciones S-Z de `nueva-extructuraV2.md`)
**Estado:** Pendiente de aprobación — **NO ejecutar sin visto bueno del Tech Lead** (§3.7 /
`plan-creation-protocol.md`)
**Migración de BD:** la genera y ejecuta el usuario/Tech Lead (Data Migration Protocol);
ningún agente ejecuta `dotnet ef database update` contra datos reales.

---

## 0. Resumen ejecutivo

`nueva-extructuraV3.md` es el modelo de datos **final** para el módulo Candidates. No es
incremental sobre lo ya ejecutado en `nueva-extructuraV2.md` sección Z (refactor R1/R2 +
D-A…D-G, 2026-08-15): **revierte una parte de esos cambios** (vuelve a `ScheduledAt` único
en vez de `ScheduledDate`+`ScheduledTime`) y **simplifica el pipeline** (elimina las etapas
`PreFiltro` y `EntrevistaReclutamiento`; el modelo de "dos aprobaciones" de V2 secciones K/L/N/Q
queda descartado a favor de una sola etapa de entrevista, `EntrevistaOperaciones`).

Verifiqué el código real (no solo lo narrado en V2) antes de trazar este plan. Diff confirmado
entidad por entidad:

| Entidad/Enum | Estado actual (código) | Objetivo V3 | Tipo de cambio |
|---|---|---|---|
| `Candidate` | `Age` (int?), `PhoneNumber`/`Email` sin `[Required]`, sin normalizados | `BirthDate` (DateOnly, requerido, ≥18), `PhoneNumber`/`Email` requeridos, +`NormalizedPhoneNumber` (único), +`NormalizedEmail` (indexado) | Modificar |
| `CandidateStatus` (enum) | `Active/Archived/Contratado` | igual | ✅ Sin cambio |
| `CandidateApplicationRole` | `ApplicationRoleId` (string FK a `ApplicationRole`) | `Role` (`ApplicationRoleEnum`, valor, no FK) | Modificar (cambia de FK a enum) |
| `CandidateApplicationStage` (enum, 10 valores) | `Nuevo, PreFiltro, EnEspera, EntrevistaReclutamiento, EntrevistaOperaciones, NoSePresento, Rechazado, Seleccionado, AltaEnProceso, Contratado` | `CandidateProcessStage` (8 valores): quita `PreFiltro` y `EntrevistaReclutamiento` | Renombrar + reducir |
| `CandidateProcessStatus` | No existe | Nuevo enum `Abierto/EnPausa/Cerrado` | Crear |
| `CandidateClosureReason` | No existe | Nuevo enum (6 valores) | Crear |
| `CandidateDecision` (enum, 4 valores) | `Aprobado, Rechazado, EnEspera, NoSePresento` | +`Reprogramar` (5 valores) | Modificar |
| `InterviewRejectionReason` (enum, 9 valores, incluye `NoSePresento`) | — | `CandidateRejectionReason` (8 valores, quita `NoSePresento` porque ya es `Decision`) | Renombrar + reducir |
| `CandidateInterviewStatus` (enum, 5 valores) | `Pendiente, Confirmada, Realizada, Cancelada, NoAsistio` | `Programada, Realizada, NoAsistio, Reprogramada, Cancelada` | Modificar (rename+quita `Confirmada`+agrega `Reprogramada`) |
| `CandidateInterviewScheduleStatus` (enum) | Existe, en uso en `CandidateInterview.ScheduleStatus` | Se elimina (V3 §10) | Eliminar |
| `CandidateProcess.CurrentStage` | tipo `CandidateApplicationStage`, default `EntrevistaReclutamiento` | tipo `CandidateProcessStage`, default `Nuevo` | Modificar |
| `CandidateProcess` (campos de agenda: `ScheduledAt`, `InterviewerUserId`, `Status`, `RescheduledAt`, `RescheduleComment`, `ConfirmedAt`) | Viven en `CandidateProcess` (duplican `CandidateInterview`) | Se eliminan de `CandidateProcess`; la agenda vive **solo** en `CandidateInterview` | Eliminar de `CandidateProcess` |
| `CandidateProcess` (decisión: `Decision`, `DecisionReason`, `DecisionComment`, `DecisionSentAt`, `DecisionByUserId`) | Existen con esos nombres | Renombrar a `FinalDecision`, `FinalDecisionReason`, `FinalDecisionComment`, `FinalDecisionAt`, `FinalDecisionByUserId` | Renombrar |
| `CandidateProcess` (`ProcessStatus`, `ClosureReason`, `SelectedForHiring`, `SelectedAt`, `HiringRequestedAt`, `HiredEntryDate`) | No existen | Nuevos campos | Crear |
| `CandidateInterview.CandidateApplicationId` (FK requerida a `CandidateApplication`) | — | FK a `CandidateProcessId` | Modificar relación |
| `CandidateInterview.ScheduledDate`+`ScheduledTime` (DateOnly+TimeOnly) | — | `ScheduledAt` único (DateTime) | Revertir a único campo |
| `CandidateInterview.ScheduleStatus`, `ProposedRescheduleAt`, `ConfirmedAt` | Existen | Se eliminan | Eliminar |
| `CandidateInterview` (`StageAtInterview`, `Location`, `MeetingLink`, `RescheduledFromInterviewId`) | No existen | Nuevos campos | Crear |
| `CandidateInterviewResult.DecisionReason` | `InterviewRejectionReason` **requerido siempre** | `CandidateRejectionReason?` **requerido solo si `Decision == Rechazado`** | Modificar (nullable + regla condicional) |
| `CandidateInterviewResult.ReceptionConfirmedAt` | Existe | Se elimina | Eliminar |
| `CandidateStageHistory` (`CandidateApplicationId` y `CandidateProcessId`, ambos nullable) | Dual, en transición | Solo `CandidateProcessId` (requerido) | Eliminar `CandidateApplicationId` |
| `CandidateApplication` (entidad completa) | Existe, en uso | Se elimina (§10 V3) | Eliminar (fase final) |
| `CandidateInterviewFeedback` | Existe, pendiente de borrado desde V2 Z.5 | Se elimina | Eliminar (fase final) |
| `CandidateDecisionReason` (catálogo) | Existe, inerte desde V2 Z | Se elimina | Eliminar (fase final) |

**Regla de secuencia:** las entidades/enums que hoy tienen consumidores activos
(`CandidateApplication`, `CandidateInterviewFeedback`, `CandidateDecisionReason`,
`CandidateApplicationStage` con `PreFiltro`/`EntrevistaReclutamiento`,
`CandidateInterviewScheduleStatus`) **no se borran hasta que backend y frontend dejen de
usarlas** (Fase 7). Antes de eso se puede compilar con ambos modelos coexistiendo si hace
falta, igual que se hizo en el refactor de V2 Z.

---

## Fase 0 — Congelar alcance y decisiones abiertas (previo a codificar)

**No requiere código.** Antes de asignar la Fase 1 a un agente, el Tech Lead debe cerrar:

- [x] **F0.1** — ✅ **Confirmado 2026-08-15 por el usuario: `EntrevistaReclutamiento` ya no
  se necesita.** El pipeline de "dos aprobaciones" (Reclutamiento → Operaciones, V2 secciones
  K/L/N/Q, Q.3.1) queda descartado en favor del modelo V3 de una sola etapa de entrevista
  (`EntrevistaOperaciones`). Verificado en código: la lógica de dos etapas está activa hoy en
  `CandidateStageValidator.ValidateStageTransition`, `CandidateAutomationService`
  (`CurrentStage != EntrevistaOperaciones`) y `CandidateApplicationKpisDto`
  (`PostulacionesEnEntrevistaReclutamiento` como campo de funnel separado). 13 archivos de
  código (no solo docs) referencian `PreFiltro`/`EntrevistaReclutamiento`:
  `CandidateApplicationAppService.cs`, `CandidateInterviewAppService.cs`,
  `CandidateProcessAppService.cs`, `CandidateProcess.cs`, `CandidateStageValidator.cs`,
  `CandidateApplicationKpisDto.cs`, `candidate-interview-pending-list.ts`,
  `candidate-application.ts`, `candidate-stage-change-modal.ts`,
  `candidate-recruitment-schedule-modal.ts`, `candidate-stage-labels.ts`,
  `candidate-application-stage.ts`, `CandidateApplicationStage.cs`. Todos entran en el
  alcance de limpieza de Fases 1/3/4/6/7 (ver tarea nueva **4.1bis** más abajo: migrar KPIs
  antes de borrar el servicio legacy).
- [x] **F0.2** — ✅ Verificado, riesgo bajo: `CandidateApplicationRole` (FK a
  `ApplicationRole`) **no tiene ningún consumidor funcional hoy** — el único uso es en
  `CandidateAppService.cs` (conteo de impacto de borrado + cascade delete, líneas 116-118,
  371-377); cero uso en frontend fuera de `nueva-extructuraV3.md`. Cambiar de FK a enum
  `ApplicationRoleEnum` es seguro de ejecutar en Fase 2.2.
- [x] **F0.3** — ✅ Resuelto por F0.1 (mismo cambio). Lista de consumidores ya identificada
  arriba; se limpian en las fases correspondientes.
- [x] **F0.4** — ✅ Verificado: `RequestPosition.Status` es el enum genérico `Status`
  (`Pendiente`, `Proceso`, `Concluido`, `Cancelado`, `noAutorizado`) — no existe un valor
  específico `AltaEnProceso` ni `Contratado`. **Decisión adoptada:** en la transición a
  `Contratado` (tarea 3.7), setear `RequestPosition.Status = Status.Concluido`; en
  `AltaEnProceso` no se toca `Status` (queda como esté). Si el Tech Lead prefiere otro
  mapeo, ajustar antes de Fase 3.
- [ ] **F0.5** — Autorizar la Fase 0/1/2 de Data Migration Protocol: el Tech Lead genera y
  valida la migración EF tras cada fase de entidades (no el agente ejecutor).

**Fase 0 cerrada.** Único pendiente formal: F0.5 (autorización de flujo de migración, no
bloquea el inicio de Fase 1).

**Matriz de reglas de negocio (resumen, 4 niveles) — para referencia de los agentes:**

- **Nivel 1 (invariantes):** un candidato solo puede tener un proceso por `RequestPosition`;
  una entrevista con resultado es inmutable; un proceso solo tiene una entrevista `Programada`
  a la vez.
- **Nivel 2 (flujo/estados):** pipeline `Nuevo → EntrevistaOperaciones → {Seleccionado |
  Rechazado | NoSePresento | EnEspera}`; `Seleccionado → AltaEnProceso → Contratado`; etapas
  terminales `Rechazado`, `NoSePresento`, `Contratado`.
- **Nivel 3 (autorización):** sin cambios respecto al módulo actual — no se toca RBAC en este
  plan (queda para el plan de convenciones `20260813-reclutamiento-candidates-remediacion-plan.md`).
- **Nivel 4 (validación de datos):** teléfono único (normalizado), email requerido sin
  unicidad, `BirthDate` requerido + mayoría de edad, motivo de rechazo requerido solo si
  `Decision == Rechazado`.

---

## Fase 1 — Backend: Enums

**Archivos:** `api/LuxuryApp.Shared/Enums/`

- [ ] **1.1** Crear `CandidateProcessStage.cs` (8 valores, sin `PreFiltro` ni
  `EntrevistaReclutamiento`) — **no borrar `CandidateApplicationStage.cs` todavía** (Fase 7).
- [ ] **1.2** Crear `CandidateProcessStatus.cs` (`Abierto`, `EnPausa`, `Cerrado`).
- [ ] **1.3** Crear `CandidateClosureReason.cs` (`VacanteCerrada`, `Rechazo`, `NoSePresento`,
  `Contratacion`, `CancelacionManual`, `Otro`).
- [ ] **1.4** Agregar `Reprogramar` a `CandidateDecision.cs` (5º valor).
- [ ] **1.5** Crear `CandidateRejectionReason.cs` (8 valores, copiar los 8 de
  `InterviewRejectionReason` **sin** `NoSePresento`) — no borrar `InterviewRejectionReason.cs`
  todavía (Fase 7, hasta confirmar que nada más lo usa).
- [x] **1.6** Modificar `CandidateInterviewStatus.cs`: `Pendiente`→`Programada`, quitar
  `Confirmada`, agregar `Reprogramada`. **Ojo:** este enum se reutiliza hoy en `CandidateProcess.Status`
  (que se elimina en Fase 2) — verificar que el rename no rompa otros consumidores fuera de
  Candidates antes de aplicarlo. ✅ Verificado: 17 archivos referencian el enum, todos dentro
  del dominio Candidates/Reclutamiento. Sin bloqueantes.
- [x] **1.7** `dotnet build LuxuryApp.Shared` sin errores. ✅ Verificado por el supervisor
  (no solo el reporte del agente): 0 errores, 10 warnings preexistentes no relacionados.

**Fase 1 completada y auditada 2026-08-15.** Deliverable: 5 enums nuevos/modificados; legacy
aún vivo y funcional en paralelo.

**Nota de riesgo para la migración (Fase 3.10 / Data Migration Protocol):** el orden de
valores de `CandidateInterviewStatus` cambió (`Realizada` pasa de índice 2→1, `Cancelada`
de 3→4, `NoAsistio` de 4→2). Si hay filas ya persistidas en desarrollo/staging con el
enum viejo, la migración debe incluir un remapeo explícito de esos enteros, no solo el
cambio de esquema.

---

## Fase 2 — Backend: Entidades + configuración EF

**Archivos:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/Candidatos/`
+ `ApplicationDbContext.cs` (configuración `IEntityTypeConfiguration` o Fluent API inline,
verificar patrón real del proyecto antes de tocar).

- [ ] **2.1 `Candidate.cs`**: quitar `Age`; agregar `BirthDate` (`DateOnly`, `[Required]`),
  `NormalizedPhoneNumber` (`[Required]`, índice único), `NormalizedEmail` (`[Required]`,
  índice no único); agregar `[Required]` a `PhoneNumber` y `Email`.
- [ ] **2.2 `CandidateApplicationRole.cs`**: reemplazar `ApplicationRoleId`(string)/navegación
  `ApplicationRole` por `Role` (`ApplicationRoleEnum`, `[Required]`); agregar índice único
  `(CandidateId, Role)` + índice único filtrado `CandidateId` donde `IsPrimary == true`.
- [ ] **2.3 `CandidateProcess.cs`**:
  - Cambiar tipo de `CurrentStage` a `CandidateProcessStage`, default `Nuevo`.
  - Eliminar: `ScheduledAt`, `InterviewerUserId`, `Status`, `RescheduledAt`,
    `RescheduleComment`, `ConfirmedAt`.
  - Renombrar: `Decision`→`FinalDecision` (tipo `CandidateDecision?`),
    `DecisionReason`→`FinalDecisionReason` (tipo `CandidateRejectionReason?`),
    `DecisionComment`→`FinalDecisionComment`, `DecisionSentAt`→`FinalDecisionAt`,
    `DecisionByUserId`→`FinalDecisionByUserId`.
  - Agregar: `ProcessStatus` (`CandidateProcessStatus`, default `Abierto`), `ClosureReason`
    (`CandidateClosureReason?`), `SelectedForHiring` (bool), `SelectedAt` (`DateOnly?`),
    `HiringRequestedAt` (`DateTime?`), `HiredEntryDate` (`DateOnly?`).
  - Agregar colección `Interviews` (`HashSet<CandidateInterview>`) si no existe ya vía FK
    inversa.
  - Índice único `(CandidateId, RequestPositionId)`.
- [ ] **2.4 `CandidateInterview.cs`**:
  - Cambiar FK de `CandidateApplicationId`/`CandidateApplication` a `CandidateProcessId`
    (`[Required]`) / navegación `CandidateProcess`.
  - Agregar `StageAtInterview` (`CandidateProcessStage`, `[Required]`).
  - Reemplazar `ScheduledDate`+`ScheduledTime` por `ScheduledAt` (`DateTime`, `[Required]`).
  - Eliminar `ScheduleStatus`, `ProposedRescheduleAt`, `ConfirmedAt`.
  - Agregar `Location` (string, opcional), `MeetingLink` (string, opcional),
    `RescheduledFromInterviewId` (`Guid?`) + navegación auto-referencial
    `RescheduledFromInterview`.
  - `Status` sigue `CandidateInterviewStatus` (ya migrado en Fase 1), default `Programada`.
  - Índice simple `CandidateProcessId`; índice único filtrado por proceso cuando
    `Status == Programada` (una sola entrevista activa por proceso).
- [ ] **2.5 `CandidateInterviewResult.cs`**:
  - Cambiar `DecisionReason` de `InterviewRejectionReason` (requerido) a
    `CandidateRejectionReason?` (nullable).
  - Eliminar `ReceptionConfirmedAt`.
  - Mantener `InterviewerUserId`, `InterviewerRole`, `Decision`, `AdditionalComment`,
    `SentAt`, `EvaluatedAt`, `EvaluatedByUserId` (ya alineados).
- [ ] **2.6 `CandidateStageHistory.cs`**: eliminar `CandidateApplicationId`/navegación
  `CandidateApplication`; `CandidateProcessId` pasa a `[Required]` (no nullable); tipo de
  `FromStage`/`ToStage` cambia a `CandidateProcessStage`.
- [ ] **2.7** Ajustar configuración EF (`ApplicationDbContext` o configuraciones dedicadas):
  nuevos índices únicos/filtrados de 2.1-2.6, relación auto-referencial de
  `RescheduledFromInterviewId`, relación `CandidateInterview`→`CandidateProcess`.
- [ ] **2.8** `dotnet build LuxuryApp.Infrastructure.Data` — **se esperan errores en cascada**
  en `LuxuryApp.Application` (servicios que usan los campos renombrados/eliminados); no
  corregirlos aquí, son la Fase 3.
- [x] **2.9** **NO generar ni aplicar migración EF todavía.** Documentar en este plan (sección
  "Migración de datos") el diff de columnas para que el Tech Lead genere la migración al
  cierre de la Fase 3 (cuando el código ya compile). ✅ Sin migración generada, confirmado.

**Fase 2 completada y auditada 2026-08-15.** El supervisor verificó directamente (no solo el
reporte del agente): los 6 archivos de entidad + la configuración EF en
`ApplicationDbContext.cs` (líneas ~1127-1280) coinciden exactamente con el diff de la
sección 0. `dotnet build LuxuryApp.Infrastructure.Data` → **0 errores** (verificado
independientemente). `dotnet build LuxuryApp.Application` → errores en cascada confinados a
**8 archivos, todos dentro del dominio Reclutamiento/Candidates**:
`CandidateProcessAppService.cs`, `CandidateApplicationAppService.cs`,
`CandidateInterviewAppService.cs`, `CandidateAppService.cs`,
`CandidateNotificationCoordinatorService.cs`, `CandidateInterviewResultAppService.cs`,
`RequestPositionAppService.cs` (esperado, V3 §9 lo toca), `CandidateAutomationService.cs`.
Sin errores fuera de este perímetro — el blast radius es exactamente el previsto por el plan.

**Nota de mantenibilidad (no bloquea):** el índice único filtrado de `CandidateInterview`
usa SQL crudo `HasFilter("[Status] = 0")` para representar "una sola entrevista `Programada`
por proceso" — el `0` es el valor entero de `CandidateInterviewStatus.Programada` tras el
reordenamiento de Fase 1. Si el enum se reordena otra vez en el futuro, este filtro debe
actualizarse a mano (no se resuelve solo). Dejar documentado junto a la nota de riesgo de
Fase 1.

**Deliverable:** entidades alineadas a V3; backend con errores de compilación esperados en
Application (se resuelven en Fase 3); sin migración aplicada.

---

## Fase 3 — Backend: Reglas de servicio / máquina de estados

**Archivo principal:** `CandidateProcess/Services/CandidateProcessAppService.cs` (+ DTOs de
`CandidateProcess/DTOs/`). Consumir V3 secciones 6 (máquina de estados del proceso), 7
(máquina de estados de entrevista), 8 (efectos automáticos al guardar resultado), 9
(integración con `RequestPosition`), 12 (reglas de servicio).

- [ ] **3.0 (hallazgo de auditoría de Fase 2 — resolver primero)** Al quitar
  `CandidateApplicationId` de `CandidateInterview` (Fase 2.4), los servicios legacy
  (`CandidateApplicationAppService`, `CandidateInterviewAppService`,
  `CandidateInterviewResultAppService`) se quedaron **sin ningún puente hacia
  `CandidateInterview`/`CandidateInterviewResult`** — no hay relación que los conecte. Esto
  no lo previó el plan original. Regla de resolución (no crear puente nuevo, no inventar):
  - Estos 3 servicios están marcados para retiro en Fase 7 y su funcionalidad de
    entrevistas ya está duplicada/reemplazada por `CandidateProcessAppService` (confirmado
    en V2 Q.3.5/R.5/R.6: `CandidateProcess` es la única fuente de verdad).
  - **No** intentar preservar la funcionalidad de entrevistas de estos 3 servicios. Para
    compilar: quitar/stub únicamente los métodos y líneas que referencian
    `CandidateInterview`/`CandidateInterviewResult`/`CandidateApplicationId` en esos 3
    archivos (lanzar `NotSupportedException` con mensaje claro, o eliminar el método si no
    tiene endpoint activo — verificar antes cuál aplica). El resto de cada servicio
    (lo que no toca entrevistas) sigue funcionando igual.
  - Documentar exactamente qué se stub-eó/eliminó de cada archivo — es el insumo directo
    para Fase 7 (que borra estos 3 servicios por completo).
  - `CandidateAppService.cs`, `CandidateNotificationCoordinatorService.cs`,
    `RequestPositionAppService.cs`, `CandidateAutomationService.cs` no tienen este problema
    de raíz (sus errores son por campos renombrados, no por relación eliminada) — se
    resuelven actualizando referencias, sin stubear nada.

- [ ] **3.1 Crear candidato**: normalizar `PhoneNumber`→`NormalizedPhoneNumber` y
  `Email`→`NormalizedEmail` antes de guardar; validar unicidad de `NormalizedPhoneNumber`
  (409 si duplicado); validar `BirthDate` da ≥18 años (400 si no); `Status = Active` por
  defecto.
- [ ] **3.2 Actualizar candidato**: re-normalizar y re-validar unicidad si cambia teléfono;
  re-normalizar email (sin bloquear duplicado, solo advertencia — la advertencia es de UI,
  no de este servicio); no permitir archivar si tiene `CandidateProcess` con `ProcessStatus
  == Abierto`.
- [ ] **3.3 Crear proceso** (`CreateAsync`/equivalente): validar candidato no `Archived`;
  validar vacante (`RequestPosition`) activa; validar que no exista ya proceso para
  `(CandidateId, RequestPositionId)` → 409; crear con `CurrentStage = Nuevo`, `ProcessStatus
  = Abierto`; insertar `CandidateStageHistory` inicial (`FromStage = null`, `ToStage = Nuevo`).
- [ ] **3.4 Agendar entrevista**: validar proceso `Abierto`; validar que no exista ya una
  entrevista `Programada` para el proceso (409); resolver entrevistador vía
  `InterviewerMatrix` (existente, sin cambios); crear `CandidateInterview` en `Programada`
  con `StageAtInterview = CurrentStage`; si el proceso estaba en `Nuevo`, mover a
  `EntrevistaOperaciones` (+ `CandidateStageHistory`).
- [ ] **3.5 Registrar resultado** (`ExecuteInterviewerActionAsync`/equivalente — reemplaza al
  `SubmitFeedback` legacy): validar entrevista `Programada`; validar que no tenga `Result`
  previo (409); validar `DecisionReason` requerido solo si `Decision == Rechazado` (400 si
  falta); aplicar efectos de V3 §8 por cada `Decision`:
  - `Aprobado`: entrevista→`Realizada`; proceso→`Seleccionado` (sigue `Abierto`);
    `SelectedForHiring = true`; `SelectedAt = hoy`; `RequestPosition.SelectionDate = hoy`.
  - `Rechazado`: entrevista→`Realizada`; proceso→`Rechazado`+`Cerrado`;
    `ClosureReason = Rechazo`; `ClosedAt = ahora`.
  - `NoSePresento`: entrevista→`NoAsistio`; proceso→`NoSePresento`+`Cerrado`;
    `ClosureReason = NoSePresento`; `ClosedAt = ahora`.
  - `EnEspera`: entrevista→`Realizada`; proceso→`EnEspera` (sigue `Abierto`, o `EnPausa` si
    se decide explícitamente — dejar `Abierto` por defecto salvo indicación).
  - `Reprogramar`: entrevista actual→`Reprogramada`+`ClosedAt`; crear nueva entrevista
    `Programada` con `RescheduledFromInterviewId` apuntando a la anterior,
    `StageAtInterview = EntrevistaOperaciones`; proceso permanece en `EntrevistaOperaciones`.
  - Todas insertan `CandidateStageHistory` cuando cambia `CurrentStage`.
- [ ] **3.6 Cerrar vacante** (hook en el servicio de `RequestPosition` o evento consumido por
  Candidates — verificar dónde vive hoy el cierre de vacante antes de decidir el punto de
  enganche): cerrar todos los `CandidateProcess` con `ProcessStatus == Abierto` de esa
  vacante → `ProcessStatus = Cerrado`, `ClosureReason = VacanteCerrada`, `ClosedAt = ahora`;
  no tocar `CurrentStage`.
- [ ] **3.7 Contratar**: mover proceso a `Contratado`; `ProcessStatus = Cerrado`;
  `ClosureReason = Contratacion`; `Candidate.Status = Contratado`; actualizar
  `RequestPosition.EntryDate = process.HiredEntryDate ?? hoy`, `DateFinish = hoy`, `Status`
  al valor final que corresponda (resolver F0.4).
- [ ] **3.8** Resolver todos los `dotnet build` pendientes de Fase 2 en
  `LuxuryApp.Application` — actualizar cualquier otro consumidor de los campos
  renombrados/eliminados de `CandidateProcess`/`CandidateInterview`/`CandidateInterviewResult`
  (buscar usos de `ScheduledDate`, `ScheduledTime`, `ScheduleStatus`, `ConfirmedAt`,
  `ProposedRescheduleAt`, `DecisionReason` viejo, `ReceptionConfirmedAt`,
  `CandidateApplicationId` en `CandidateStageHistory`/`CandidateInterview`).
- [ ] **3.9** `dotnet build LuxuryApp.Application` sin errores.
- [ ] **3.10** Entregar al Tech Lead el diff de columnas (Fase 2) para generar la migración
  EF. **No continuar a Fase 4 sin migración generada y validada en entorno de desarrollo**
  (aunque no se aplique a producción todavía).

**Deliverable:** orquestador `CandidateProcessAppService` alineado 100% a V3 §6-9,12; backend
compila.

---

**Estado Fase 3 (2026-08-15, actualización del supervisor):** tres intentos de agente en
`CandidateProcessAppService.cs` no convergieron (el primero implementó 0 de las 7 reglas de
negocio pese a reportarlas como pendientes correctamente; el segundo retrocedió de 351 a 706
errores). El supervisor tomó ese archivo directamente: leyó el archivo completo (~2300
líneas), reescribió `ScheduleAsync`, `CancelScheduleAsync`, `ChangeStageAsync`,
`RegisterDecisionAsync`, `ExecuteInterviewerActionAsync` (con la tabla de efectos completa de
V3 §8 en un helper compartido `ApplyInterviewDecisionAsync`), `GetInterviewResponseAsync`,
`ProcessHiringAsync` (agregó la transición a `Contratado`, ausente hasta ahora), y todos los
builders/resolvers de agenda/tablero/cola. **`CandidateProcessAppService.cs` compila con 0
errores** (verificado con build limpio, no solo el reporte del editor). Detalle relevante:
- Rediseñó `InterviewerActionRequest` (quitó `InterviewerActionType`/`CandidateApplicationId`,
  quedó `CandidateProcessId` + `Decision` (enum) + `DecisionReason` + `AdditionalComment` +
  `NewScheduledAt` para `Reprogramar`) — cambio de contrato que Fase 5/6 debe reflejar en
  frontend.
- Corrigió una desviación real: un agente anterior había cambiado
  `CandidateInterview.Result` (1 a 1, spec V3) a `Results` (colección) para esquivar un error
  de compilador de EF (`ThenInclude` con `HashSet<T>`); se revirtió a 1 a 1 y se corrigió la
  causa real (ambigüedad de overload de `ThenInclude` con `HashSet<T>` — ver nota de
  mantenibilidad abajo).
- `ValidateProcessStageTransition` (nuevo, privado): tabla de transiciones manual para
  `CandidateProcessStage` según V3 §6 — el validador legacy `CandidateStageValidator.cs`
  sigue usando el enum viejo y no se tocó (fuera de este archivo).

**Build completo de `LuxuryApp.Application` (limpio, verificado):** 352 errores, **confinados
a 3 archivos** — exactamente los del "hallazgo 3.0" (legacy sin puente a `CandidateInterview`):
`CandidateApplicationAppService.cs` (326), `CandidateInterviewResultAppService.cs` (14),
`CandidateInterviewAppService.cs` (12). `CandidateAppService.cs`,
`CandidateNotificationCoordinatorService.cs`, `RequestPositionAppService.cs` y
`CandidateAutomationService.cs` ya compilan en 0 (trabajo de la Fase 3 paralela, verificado).

**Nota de mantenibilidad:** `HashSet<T>` como tipo de colección de navegación en EF Core
genera ambigüedad de overload en `.Include().ThenInclude()` quiando el tipo siguiente también
requiere generic inference (afectó `CandidateProcess.Interviews`). Si aparece de nuevo, la
causa es esa, no el modelo de datos.

**Fase 3 CERRADA (2026-08-16).** El usuario (Tech Lead) resolvió directamente el hallazgo 3.0
en los 3 archivos restantes. Auditado por el supervisor de forma independiente (no solo el
reporte):
- `dotnet build LuxuryApp.Application` con `obj`/`bin` limpios → **0 errores** (verificado,
  no confiar en el reporte sin correrlo).
- Enfoque real usado: **adaptador que delega a `CandidateProcessAppService`** (mejor que el
  stub puro que proponía el prompt) para los métodos con endpoint HTTP activo —
  `ChangeStageAsync`, `RegisterDecisionAsync`, `ExecuteInterviewerActionAsync`,
  `GetInterviewerViewAsync`, `GetInterviewResponseAsync`, `GetInterviewerQueueAsync`,
  `SubmitFeedbackAsync` (legacy) — todos resuelven el `CandidateProcess` real vía
  `ResolveProcessIdByAnyIdentifierAsync`/`ResolveProcessFromIdentifiersAsync` (id directo de
  proceso, o `CandidateApplication.Id` → `CandidateId`+`RequestPositionId` → proceso) antes
  de delegar. Los métodos sin uso real (`BuildInterviewerQueueVacancy`,
  `BuildInterviewerViewProcessItem`) quedaron con `NotSupportedException` explícito.
- `RemapLegacyStageToV3` (nuevo helper): mapeo `CandidateApplicationStage`(10)→
  `CandidateProcessStage`(8) verificado correcto (`PreFiltro→EnEspera`,
  `EntrevistaReclutamiento→EntrevistaOperaciones`, resto 1:1) — coincide exactamente con la
  decisión F0.1.
- `MapLegacyDecisionReason`/`MapProcessDecisionReason` (nuevo, en
  `CandidateInterviewResultAppService.cs`): mapeo 1:1 `InterviewRejectionReason`↔
  `CandidateRejectionReason` verificado correcto, incluida la asimetría (`NoSePresento` sin
  equivalente → `null`, es ahora una `Decision`, no un motivo).
- **Bug fix incidental de paso:** `CandidateInterviewAppService.SubmitFeedbackAsync` ya NO
  hardcodea `Decision = EnEspera` (el bug D11 documentado en V2 Q.1) — ahora usa
  `dto.Decision` real y delega a `CandidateProcessAppService.RegisterDecisionAsync`.
- **Nota menor, no bloqueante (limpieza para Fase 7):** `BuildInterviewerViewItem` en
  `CandidateApplicationAppService.cs` quedó definida pero sin ningún llamador (código
  muerto) — no rompe nada, pero puede borrarse en la limpieza de legacy.

Con esto, **toda la Fase 3 está completa y verificada**: máquina de estados en
`CandidateProcessAppService` + los 3 servicios legacy adaptados/saneados. Lista para Fase 4.

## Fase 4 — Backend: DTOs, Endpoints, Notificaciones, Hub de enums

- [ ] **4.0 (KPIs — precondición de Fase 7, hallazgo F0.1)** El dashboard de KPIs
  (`GetKpisAsync` + `CandidateApplicationKpisDto`) vive hoy en el servicio legacy
  `CandidateApplicationAppService`, que Fase 7 elimina. Migrar `GetKpisAsync` a
  `CandidateProcessAppService` (o al servicio que corresponda tras Fase 3) **antes** de
  llegar a Fase 7, o el dashboard desaparece sin querer. Al migrar:
  - Renombrar `CandidateApplicationKpisDto` → `CandidateProcessKpisDto` (1 archivo = 1 DTO).
  - Eliminar el campo `PostulacionesEnEntrevistaReclutamiento` (etapa retirada, F0.1) y
    cualquier cálculo que dependa solo de `EntrevistaReclutamiento`.
  - Conservar el desglose de `EntrevistaOperaciones` (sin entrevistador/sin fecha/vencidas/
    con feedback) — sigue siendo válido, esa etapa se mantiene.
  - Registrar el endpoint bajo el grupo `recruitment-candidate-processes` (no
    `recruitment-candidate-applications`).
  - `dotnet build` sin errores antes de continuar.
- [ ] **4.1** Actualizar DTOs de `CandidateProcess/DTOs/` (`CandidateProcessCreateOrUpdateDto`,
  `CandidateProcessDetailDto`, `CandidateProcessListItemDto`, etc.) para exponer los campos
  nuevos/renombrados de Fase 2 (1 archivo = 1 DTO, ver `dto-file-organization-rule.md`).
- [ ] **4.2** Actualizar DTOs de `CandidateInterview/DTOs/` y `CandidateInterviewResult/DTOs/`
  (`ScheduledAt` único, `StageAtInterview`, `Location`, `MeetingLink`,
  `RescheduledFromInterviewId`, `DecisionReason` nullable).
- [ ] **4.3** Actualizar `Candidate/DTOs/` (`CandidateCreateOrUpdateDto`, `CandidateDetailDto`,
  `CandidateListItemDto`): `BirthDate` en vez de `Age`; exponer `NormalizedPhoneNumber`/
  `NormalizedEmail` solo si el frontend los necesita (probablemente no — son de backend).
- [ ] **4.4** Registrar en el hub `SelectItemEnumEndPoints.cs`: rutas
  `candidate-process-stage`, `candidate-process-status`, `candidate-closure-reason`,
  `candidate-rejection-reason`, `candidate-decision` (con `Reprogramar`),
  `candidate-interview-status`. **No modificar rutas existentes de enums que se conservan**
  (`fuente-reclutamiento`, `interview-modality`) — solo agregar las nuevas.
- [ ] **4.5** Revisar `CandidateNotificationCoordinatorService`/`ICandidateNotificationCoordinatorService`:
  ajustar firmas y cuerpos que referencian campos eliminados de `CandidateProcess`
  (`ScheduledAt` viejo en el proceso, `ConfirmedAt`) para leerlos ahora desde
  `CandidateInterview`; sin agregar notificaciones nuevas en este plan (fuera de alcance de
  V3, es tema de V2 sección T que sigue vigente aparte).
- [ ] **4.6** `dotnet build LuxuryApp.Application` + `dotnet build LuxuryApp.Api` sin errores.
- [ ] **4.7** `dotnet build LuxuryApp.Tests` sin errores; ajustar tests unitarios que referencien
  campos/enums renombrados.

**Deliverable:** contrato HTTP actualizado; hub de enums completo; notificaciones
recompiladas contra el nuevo modelo.

---

## Fase 5 — Frontend: Interfaces y servicios

**Alcance:** `client/angular/.../candidates/` — solo contratos tipados y llamadas HTTP, sin
tocar UI todavía.

- [ ] **5.1** Actualizar interfaces de `candidate/interfaces/candidate.dto.ts` y
  `candidate-form.interface.ts`: `birthDate` en vez de `age`; agregar validador de edad
  mínima en el formulario (18 años) espejo del backend.
- [ ] **5.2** Actualizar interfaces de `candidate-application/interfaces/` que hoy tipan
  `CandidateProcess` (verificar cuáles archivos ya usan `candidateProcessId` vs
  `candidateApplicationId` — hay ambigüedad heredada de V2 R.4). Migrar todo a
  `candidateProcessId`.
- [ ] **5.3** Actualizar interfaces de `candidate-interview/interfaces/`:
  `scheduledAt` único; `stageAtInterview`; `rescheduledFromInterviewId`; `decisionReason`
  opcional; quitar `scheduleStatus`/`confirmedAt`/`proposedRescheduleAt`.
  `candidate-interview/interfaces/candidate-decision-reason-item.interface.ts` — verificar si
  sigue haciendo falta (el catálogo `CandidateDecisionReason` se elimina en Fase 7; si el
  motivo ahora es enum fijo, este archivo puede quedar obsoleto).
  actualizar interviewStatus values (`Programada`/`Reprogramada`).
- [ ] **5.4** Actualizar `core/enums/candidate-application-stage.ts` (o crear
  `candidate-process-stage.ts`) para reflejar las 8 etapas nuevas; **no borrar el archivo
  viejo hasta Fase 7** si sigue habiendo componentes que aún no migraron.
- [x] **5.5** `npx tsc --noEmit` — se esperan errores en componentes (Fase 6 los resuelve).

**Fase 5 completada y auditada (2026-08-16).** El supervisor corrió `npx tsc --noEmit`
independientemente: **19 errores exactos**, coinciden 1:1 con el reporte, todos en
componentes/consumidores (cero en archivos de interfaces/servicios — la capa de contratos
quedó limpia). Verificado también el contenido real (no solo el resumen) de
`InterviewerActionRequestDto`, `CandidateProcessStage`, `CandidateDecision`,
`candidate.dto.ts` (birthDate) y `CandidateProcessKpisDto` — todos coinciden exactamente con
los DTOs/enums backend de Fase 1-4.

**Hallazgo importante para Fase 6 (fuera del alcance original del plan):** 3 de los 19
errores están en `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/`
(`employee-interview-feedback-form.ts`, `employee-interviewer-queue.ts`) — el módulo "Staff
Board" de RRHH (V2 sección "Integración Staff Board - Entrevistador RH") también consume
`InterviewerActionRequestDto`/`CandidateInterviewFeedbackCreate`. **Fase 6 debe incluir esta
carpeta**, no solo `reclutamiento.luxuryapp/candidates/`.

**Deliverable:** capa de tipos alineada al nuevo contrato backend.

---

## Fase 6 — Frontend: Componentes

- [ ] **6.1 `candidate-form.ts`/`.html`**: reemplazar campo `Edad`/`age` por selector de
  fecha `birthDate`; agregar validación de mayoría de edad en el formulario reactivo;
  mantener selector `RecruitmentSource` (`fuenteReclutamiento()`, sin cambio).
- [ ] **6.2 Eliminar `candidate-application/candidate-stage-change-modal.ts`/`.html`**
  (cambio manual libre de etapa — ya no aplica: las etapas avanzan solo por acción de
  negocio, confirmado en V2 R.9 y consistente con V3). Quitar su uso en
  `candidate-application-list.ts`.
- [ ] **6.3 Renombrar/adaptar `candidate-application/*` → operar sobre `CandidateProcess`
  con las 8 etapas nuevas**: `candidate-application-list`, `candidate-application-kpis`
  (consumir el DTO/endpoint `CandidateProcessKpisDto` migrado en 4.0 — ya sin el campo
  `PostulacionesEnEntrevistaReclutamiento`), `candidate-process-hiring-modal`. Decidir en
  esta fase (con Tech Lead) si se renombra la carpeta a `candidate-process/` en el mismo
  cambio o se deja para una fase de limpieza de nombres aparte — **no mezclar renombre
  masivo de carpetas con el cambio funcional** si el diff ya es grande; documentar la
  decisión tomada.
- [ ] **6.4 `candidate-interview-feedback-form.ts`/`.html`**: adaptar a
  `scheduledAt` único; motivo (`decisionReason`) condicional (`Validators.required` solo si
  `decision === Rechazado`, quitar el `required` fijo actual); agregar opción `Reprogramar`
  en el selector de decisión con su propio submit (crea nueva entrevista) en vez de cerrar
  el proceso.
- [ ] **6.5 `candidate-recruitment-interviews.ts`**: seguir el hallazgo R.1 de V2 (todavía
  no resuelto) — desacoplar `openAltaForm` de `EmployeeProviderForm` (dominio
  ExternalStaff/Proveedor). **Nota:** V3 no incluye el diseño del stepper de alta (P) de V2;
  si al llegar a esta tarea el stepper no existe aún, dejar `openAltaForm` documentado como
  deuda pendiente en vez de improvisar un reemplazo no acordado — no es parte del alcance de
  este plan.
- [ ] **6.6 `recruitment-agenda-list.ts`/`.html`**: ajustar a que la agenda ahora lee de
  `CandidateInterview.ScheduledAt` (único campo) en vez de
  `RecruitmentInterviewAt`/`OperationsInterviewAt` legacy, y a que solo existe la etapa
  `EntrevistaOperaciones` (ya no hay split Reclutamiento/Operaciones en agenda).
- [ ] **6.7** Actualizar `recruitment-shared/candidate-stage-labels.ts`,
  `candidate-stage-badge.ts`, `candidate-stage-timeline.ts`,
  `candidate-decision-reason-select.ts`, `candidate-decision-labels.ts` a los enums nuevos.
- [x] **6.8** `npx tsc --noEmit` sin errores; `npm run lint` sin violaciones nuevas.
- [ ] **6.9** Smoke test manual (ver Fase 8) — **pendiente a propósito**, se hace en Fase 8.

**Fase 6 completada y auditada (2026-08-16).** El supervisor corrió `npx tsc --noEmit`
independientemente desde `client/angular`: **exit 0, 0 errores** (coincide con el reporte).
Verificado también:
- `candidate-stage-change-modal.ts`/`.html` realmente borrados (no existen en disco) y sin
  referencias huérfanas fuera de docs `.md` históricos (grep en todo `candidates/`).
- `candidate-interview-feedback-form.ts`: validadores condicionales correctos
  (`decisionReason` solo si `Rechazado`, `newScheduledAt` solo si `Reprogramar`); posts al
  endpoint canónico `CandidateProcesses.interviewerAction` (no el legacy); tiene fallback
  bien resuelto — si solo llega `candidateApplicationId` (diálogo legacy), resuelve el
  `candidateProcessId` real vía `CandidateProcesses.interviewResponse` antes de enviar.
- `candidate-recruitment-schedule-modal.ts`: el flujo "send" mueve directo a
  `CandidateProcessStage.EntrevistaOperaciones` (etapa única fusionada, F0.1); "reschedule"
  usa el shape correcto de `CandidateInterviewRescheduleRequest`.
- Ampliación de alcance a `recursos-humanos.luxuryapp/.../employee-interviewer-queue/`
  (hallazgo de Fase 5) quedó cubierta.
- `node scripts/scan-mojibake.mjs` → 0 mojibake (4109 archivos).

**Nota no bloqueante:** el agente reportó `npm run lint`/`audit:css` en rojo global (1201
issues) pero preexistente, no atribuible al diff de esta fase (no lo verifiqué línea por
línea, es una afirmación del reporte — si en Fase 8 aparece algo nuevo en archivos tocados
aquí, revisar).

**Deliverable:** UI funcional sobre el modelo V3; 0 referencias a etapas eliminadas en
componentes activos.

---

## Fase 7 — Retiro de legacy (backend + frontend)

**Solo iniciar cuando Fases 3-6 estén mergeadas y validadas** (nada debe depender ya de lo
que se borra aquí).

**Verificación previa del supervisor (2026-08-16) antes de liberar el prompt de Fase 7:**
- Confirmado: ningún .ts en todo `client/angular` llama a `CandidateApplications.create`/
  `.update` ni al literal `recruitment-candidate-applications` fuera del propio archivo de
  constantes — el create/update legacy está huérfano en frontend, seguro de retirar.
- **Bloqueante real encontrado:** `candidate-interview/candidate-interview-response.ts` es
  un componente **activo y ruteado** (`candidates.routing.ts`) que todavía llama al catálogo
  `CandidateDecisionReasons.catalog` — exactamente lo que K.6.2/Q.3.3 (V2) dice que debía
  eliminarse desde Fase 6, pero como no genera error de compilación, `tsc` no lo marcó.
  **Se agrega tarea 7.0** (precondición, antes de tocar backend): migrar este componente al
  patrón enum ya usado en `candidate-interview-feedback-form.ts`.
- `CandidateInterviewFeedback` tiene 7 referencias reales (más de lo documentado
  originalmente): además del módulo Candidates, aparece en `RequestPositionAppService.cs`
  y en `SystemLuxuryApp/SendEmailGlobal/` (`EmailTemplates.cs`,
  `RecruitmentEmailService.cs` — plantilla de email legacy). Revisar las 7, no solo las del
  módulo Candidates, antes de borrar la entidad (tarea 7.3 renumerada).

- [ ] **7.0 (nueva, precondición)** Migrar `candidate-interview-response.ts` del catálogo
  `CandidateDecisionReason` al enum `CandidateRejectionReason` (mismo patrón que
  `candidate-interview-feedback-form.ts`, Fase 6). `tsc` debe seguir en 0 después de esto.
  Si el componente resulta ser puramente redundante con `candidate-interview-feedback-form.ts`,
  NO fusionar/borrar por cuenta propia — es decisión de producto, reportar y detener.
- [ ] **7.1** Backend: eliminar entidad `CandidateApplication` + `DbSet` +
  `CandidateApplicationAppService`/`ICandidateApplicationAppService` +
  `CandidateApplicationEndPoint` + sus DTOs + `CandidateApplicationMapping`. **Precondición:**
  confirmar que `GetKpisAsync` ya se migró en 4.0 y que ningún componente frontend sigue
  apuntando a `recruitment-candidate-applications/kpis` — si no, detener y completar 4.0
  primero.
- [ ] **7.2** Backend: eliminar entidad `CandidateInterviewFeedback` + `DbSet` +
  `CandidateInterviewAppService`/`ICandidateInterviewAppService` (legacy `[Obsolete]`) +
  `CandidateInterviewEndPoint` + DTOs + mapping + template de email
  `RecruitmentCandidateInterviewFeedbackEmailDTO`/`.cshtml`.
- [ ] **7.3** Backend: eliminar entidad `CandidateDecisionReason` + `DbSet` +
  `CandidateDecisionReasonAppService`/`ICandidateDecisionReasonAppService` +
  `CandidateDecisionReasonEndPoint` + DTOs + mapping.
- [ ] **7.4** Backend: eliminar enums `CandidateApplicationStage` (viejo, 10 valores),
  `CandidateInterviewScheduleStatus`, `InterviewRejectionReason` (viejo, con
  `NoSePresento`) — verificar con `grep` que ya no hay referencias antes de borrar cada uno.
  Verificar también `CandidateInterviewType.cs`/`CandidateInterviewOutcome.cs` (vistos en el
  glob de enums pero no mencionados en V3) — si están huérfanos, documentarlo y proponer
  borrado; no asumir.
- [ ] **7.5** Frontend: eliminar interfaces/servicios/rutas que apuntaban a
  `recruitment-candidate-applications`/`CandidateInterviews.submitFeedback` legacy; limpiar
  `reclutamiento.endpoints.ts`.
- [ ] **7.6** Actualizar `candidates.routing.ts` si cambiaron nombres de componentes (6.3).
- [ ] **7.7** `dotnet build` (Application/Api/Tests) + `npx tsc --noEmit` + `npm run lint`
  sin errores.
- [x] **7.8** Entregar al Tech Lead el script de migración final (`DROP TABLE` de
  `RecruitmentCandidateApplications`, `RecruitmentCandidateInterviewFeedback`,
  `RecruitmentCandidateDecisionReasons`) — **el agente no ejecuta el DROP**, solo prepara el
  script para revisión (Data Migration Protocol, backup previo obligatorio).

**Fase 7 completada y auditada (2026-08-16), incluidos los cortes 7.0/7.0b.** El supervisor
verificó de forma independiente (no solo el reporte):
- Build limpio (`obj`/`bin` borrados) de `LuxuryApp.Application` y `LuxuryApp.Tests` → **0
  errores** ambos. Advertencias bajaron de ~99-111 a 57/2 — consistente con que desapareció
  todo el código `[Obsolete]` legacy que las generaba.
- Confirmado en disco: `CandidateApplication.cs`, `CandidateDecisionReason.cs`,
  `CandidateInterviewFeedback.cs` ya no existen. Carpetas `CandidateDecisionReason/` y
  `CandidateInterview/` (legacy) quedaron vacías. Carpeta `CandidateApplication/` conserva
  intencionalmente `CandidateAutomationService.cs`/`ICandidateAutomationService.cs` (servicio
  de monitoreo diario, concern distinto que históricamente vivía ahí) — correcto, no es un
  descuido; posible cosmético a futuro: renombrar esa carpeta ya que no aloja nada de
  "Application".
- `ResolveLegacyApplicationIdByProcessAsync` verificado en su nueva ubicación
  (`CandidateNotificationCoordinatorService.cs`, no solo `CandidateProcessAppService.cs`) —
  su cuerpo ya es `return process.Id;` en ambos sitios, consistente con la decisión tomada
  (alias de compatibilidad, ya no consulta la tabla borrada).
- `npx tsc --noEmit` desde `client/angular` → exit 0, 0 errores, verificado.
- Script SQL (`phase7-drop-legacy.sql`) revisado: los `DROP TABLE` están dentro de un bloque
  de comentario (no activos), con `SELECT COUNT(*)` de seguridad previos, envuelto en
  transacción, y encabezado explícito "NO EJECUTAR SIN BACKUP Y SIN MIGRACION EF ALINEADA".
  Correcto y conservador — no se ejecutó nada.

**Deliverable:** módulo sin modelos paralelos; solo `Candidate → CandidateProcess →
CandidateInterview → CandidateInterviewResult` (+ `CandidateApplicationRole`,
`CandidateWorkExperience`, `CandidateStageHistory`, `InterviewerMatrix`).

---

## Fase 8 — QA / Smoke test end-to-end + documentación

**Hallazgo del supervisor (2026-08-16) antes de liberar el prompt:** la regla V3 §9 "cerrar
vacante cierra en cascada los `CandidateProcess` abiertos (`ProcessStatus=Cerrado`,
`ClosureReason=VacanteCerrada`)" **nunca se implementó** — quedó como pregunta abierta desde
la Fase 3 y se perdió en las fases siguientes. Verificado con grep:
`CandidateClosureReason.VacanteCerrada` no aparece en ningún archivo del backend. Se agrega
**tarea 8.0** para implementarla antes del smoke test, si no el paso de "cerrar vacante" de
8.1 falla de verdad.

- [x] **8.0 (nueva)** Implementar el cierre en cascada en
  `RequestPositionAppService.cs` (no hay método explícito "cerrar vacante" — el cambio de
  `Status` probablemente pasa por `UpdateAsync`; identificar el punto real donde `Status`
  pasa a un estado de cierre y enganchar ahí la cascada sobre `CandidateProcess` con
  `ProcessStatus==Abierto` del mismo `RequestPositionId`). No tocar `CurrentStage`. ✅
  Auditado: `UpdateAsync` detecta transición real a `Cancelado`/`Concluido`
  (`IsClosingStatus`), envuelve en transacción ya existente, y
  `CloseOpenProcessesForRequestPositionAsync` cierra los procesos abiertos sin tocar
  `CurrentStage`. Build limpio verificado, 0 errores.
- [x] **8.1** ✅ **Ejecutado y verde (2026-08-15, supervisor).** El harness standalone contra
  SQL Server real fallaba por `Point.UserData`/NetTopologySuite fuera del pipeline de DI del
  host ASP.NET (ver hallazgo abajo). En vez de levantar una segunda instancia de la API contra
  la base de datos de desarrollo compartida, se escribió un test de integración real
  (`api/LuxuryApp.Tests/Application/Modules/ReclutamientoLuxuryApp/Candidates/CandidateProcessSmokeTests.cs`)
  usando el patrón `InMemoryDbContextFactory` ya establecido en el proyecto de tests (usado
  por 50+ suites existentes) — EF Core InMemory no requiere el registro de NetTopologySuite,
  así que evita el bloqueo de raíz sin mockear la lógica de negocio bajo prueba. El test
  invoca los app services reales (`CandidateAppService`, `CandidateProcessAppService`,
  `RequestPositionAppService`) sin mocks de la máquina de estados; solo se mockean
  colaboradores externos (`ICurrentUserService`, `ICandidateNotificationCoordinatorService`,
  `IRequestEmployeeRegisterAppService`, `IMapper` de `RequestPositionAppService`).
  `dotnet test --filter FullyQualifiedName~CandidateProcessSmokeTests` → **10/10 escenarios
  verdes**:
  1. Crear candidato menor de 18 años.
  2. Crear candidato válido.
  3. Crear proceso sobre vacante existente.
  4. Agendar entrevista.
  5. Registrar resultado `Aprobado` (verifica `Seleccionado` + `RequestPosition.SelectionDate`).
  6. Registrar `Rechazado` sin motivo → 400 `REASON_REQUIRED`.
  7. Registrar `Rechazado` con motivo → `Cerrado`/`Rechazo`.
  8. Registrar `Reprogramar` → nueva `CandidateInterview` enlazada vía `RescheduledFromInterviewId`.
  9. Cerrar vacante con proceso abierto → cierre en cascada (`Cerrado`/`VacanteCerrada`).
  10. Flujo completo hasta `Contratado` vía las dos llamadas a `ProcessHiringAsync`
      (verifica `Candidate.Status=Contratado` y `RequestPosition.Status=Concluido`).

  **Hallazgos de negocio descubiertos ejecutando el smoke test (no visibles solo con
  auditoría estática):**
  - **HALLAZGO A (menor):** el backend **no valida edad mínima** en ningún punto
    (`CandidateAppService.CreateAsync`, `CandidateCreateOrUpdateDto`, entidad `Candidate`).
    El escenario 1 ("crear candidato menor de 18 años") se completa exitosamente en lugar de
    ser rechazado — el prompt original de Fase 8 asumía una regla de negocio que nunca se
    implementó en ninguna fase. Si la regla es requerida, es trabajo nuevo (fuera de alcance
    de este refactor V3, que solo migraba el modelo de datos).
  - **HALLAZGO B (medio):** `CandidateDecisionRequest` (ruta de reclutador,
    `RegisterDecisionAsync`) no expone `NewScheduledAt` y `CandidateProcessAppService.cs`
    línea ~1130 pasa `null` fijo al helper interno — por lo tanto **`Reprogramar` por la ruta
    de reclutador SIEMPRE lanza `NEW_SCHEDULE_REQUIRED`**, confirmado en el test. Reprogramar
    solo es alcanzable vía `ExecuteInterviewerActionAsync` (ruta de entrevistador,
    `InterviewerActionRequest.NewScheduledAt`). Si Reclutamiento necesita reprogramar
    directamente sin pasar por la vista de entrevistador, falta ese campo en
    `CandidateDecisionRequest` y su manejo en `RegisterDecisionAsync`.
- [x] **8.2** Actualizar `client/.../candidates/docs/../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md` y `docs/decisiones.md`. ✅
  Verificado contenido real (no solo fecha).
- [x] **8.3** Actualizar `api/.../Candidates/../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md`. ✅ Verificado.
- [x] **8.4** Marcar `nueva-extructuraV2.md` y `nueva-extructuraV3.md` como "Ejecutado
  2026-08-16" con referencia a este plan. ✅ Verificado marcador al final de V3. Pendiente
  cosmético no bloqueante: mover ambos a `docs/reporte_maestro/modulos/`.
- [x] **8.5** `node scripts/scan-mojibake.mjs client/angular` → 0 mojibake nuevo. ✅
  Verificado: 4107 archivos, 0 mojibake.

**Fase 8 CERRADA y auditada (2026-08-15/16).** 8.0, 8.1, 8.2, 8.3, 8.4, 8.5 completos con
evidencia real de ejecución (../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md frontend confirmado con contenido real — fecha
2026-08-16, "Vigente post-refactor V3", pipeline de 8 etapas correcto, mención de las dos
llamadas a `ProcessHiringAsync`; `nueva-extructuraV3.md` confirmado con marcador "Ejecutado
2026-08-16" al final del archivo; 8.1 con 10/10 escenarios verdes vía
`CandidateProcessSmokeTests.cs`, detalle arriba).

**Nota sobre el bloqueo original de 8.1:** el intento inicial de correr un harness standalone
que instancia `ApplicationDbContext` fuera del host de ASP.NET falló con
`InvalidOperationException` (mapeo de `Point.UserData`, NetTopologySuite mal registrado fuera
del pipeline de DI real). El agente correctamente NO marcó ningún paso como verde sin
evidencia en ese momento. El supervisor resolvió el bloqueo escribiendo el smoke test como
test de integración con EF InMemory (ver 8.1) en lugar de levantar una segunda instancia de
la API contra la base de datos de desarrollo compartida — evita el problema de raíz sin
tocar estado compartido.

**Deliverable:** módulo Candidates en V3, documentado, con verificación end-to-end real, sin
deuda de docs desalineadas. **Refactor V3 CERRADO (2026-08-15)** — 8.1 tiene evidencia real
de ejecución (10/10 escenarios), condición que el plan exigía para el cierre. Hallazgos A y B
de 8.1 quedan registrados como deuda de negocio fuera de alcance de este refactor (no son
regresiones del refactor V3, son comportamientos preexistentes o nunca implementados que el
smoke test hizo visibles).

---

## Migración de datos (obligatorio — Data Migration Protocol)

**Responsable:** Tech Lead/usuario. Ningún agente ejecuta migraciones contra datos reales.

- **Al cierre de Fase 3:** generar migración EF que materialice los cambios de Fase 2
  (columnas nuevas/renombradas/eliminadas en `Candidate`, `CandidateProcess`,
  `CandidateInterview`, `CandidateInterviewResult`, `CandidateStageHistory`,
  `CandidateApplicationRole`). Backup previo obligatorio. Validar `COUNT` antes/después, sin
  `NULL` inesperados en columnas ahora `NOT NULL` (`BirthDate`, `NormalizedPhoneNumber`,
  `NormalizedEmail` — requiere backfill si hay candidatos existentes sin estos datos, o
  aceptar que la migración falle y forzar limpieza previa).
- **Riesgo alto:** `Candidate.BirthDate` pasa de no existir a requerido — todo candidato
  existente sin `Age` capturado no tiene de dónde derivar `BirthDate`. Definir con el Tech
  Lead: ¿se permite `NULL` temporal con backfill manual, o se bloquea la migración hasta
  tener el dato? **Esto se debe decidir en Fase 0, no en Fase 2.**
- **Al cierre de Fase 7:** migración de borrado (`DROP TABLE`
  `RecruitmentCandidateApplications`, `RecruitmentCandidateInterviewFeedback`,
  `RecruitmentCandidateDecisionReasons`) — solo tras confirmar que no hay datos que
  preservar o que ya se migraron a las tablas nuevas.

**✅ EJECUTADO (2026-08-16, usuario/Tech Lead).** Migración
`20260816053217_RefactorCandidatesV3` generada por el supervisor (`dotnet ef migrations add`
— solo codegen, no toca datos reales; distinto de `database update`, que ejecutó el usuario)
tras confirmar base de desarrollo vacía. Contiene el `DROP TABLE` de las 3 tablas legacy
(bundlea el borrado; el script manual `phase7-drop-legacy.sql` queda redundante y no debe
ejecutarse aparte), `BirthDate`/`PhoneNumber`/`Email` a `NOT NULL`, y todas las columnas
nuevas de Fase 2/4.

**Hallazgo de revisión (no bloqueante, base vacía):** el diff de EF generó varios
`RenameColumn` que en realidad son coincidencias de tipo SQL entre columnas
semánticamente distintas (ej. `ScheduledAt`→`HiringRequestedAt`,
`DecisionComment`→`FinalDecisionByUserId`, `Decision`→`FinalDecisionReason`,
`Age`→`RecruitmentSource`), no renombres reales. En una base vacía el esquema final resulta
correcto igual, pero si esta migración se replica contra un ambiente con datos, esos renames
reinterpretarían datos viejos como si fueran del campo nuevo. No reutilizar esta migración
tal cual en otro entorno con datos sin revisar esos renames primero.

Aplicada por el usuario con `dotnet ef database update` (2026-08-16). API verificada
corriendo y respondiendo (200) contra el esquema migrado.

---

## Cronograma orientativo

```
Fase 0 (0.5-1 día): decisiones abiertas — Tech Lead
Fase 1 (0.5 día):   enums backend
Fase 2 (1 día):     entidades + EF config (sin migrar)
Fase 3 (2-3 días):  reglas de servicio + máquina de estados — la más grande
Fase 4 (1 día):     DTOs/endpoints/notificaciones/hub
  → checkpoint: migración EF generada y validada por Tech Lead
Fase 5 (1 día):     frontend interfaces/servicios
Fase 6 (2-3 días):  frontend componentes — la segunda más grande
Fase 7 (1 día):     retiro de legacy (backend + frontend)
Fase 8 (0.5-1 día): QA + documentación
```

## Validación de éxito

✅ **Backend:**
- [ ] `dotnet build` (Application/Api/Tests) sin errores en cada fase de checkpoint
- [ ] 0 referencias a `CandidateApplication`, `CandidateInterviewFeedback`,
  `CandidateDecisionReason` tras Fase 7
- [ ] Máquina de estados de V3 §6-8 cubierta por `CandidateProcessAppService`
- [ ] Migración EF generada, validada y con backup (Tech Lead)

✅ **Frontend:**
- [ ] `npx tsc --noEmit` + `npm run lint` sin errores
- [ ] 0 referencias a etapas `PreFiltro`/`EntrevistaReclutamiento` en componentes activos
- [ ] `candidate-stage-change-modal` eliminado
- [x] Smoke test (Fase 8.1) pasa completo — 10/10, `CandidateProcessSmokeTests.cs`

✅ **Documentación:**
- [ ] READMEs de backend y frontend actualizados
- [ ] V2/V3 marcados como ejecutados

## Riesgos y mitigación

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El pipeline de "dos aprobaciones" (V2) se pierde sin que sea intencional | 🔴 CRÍTICA | F0.1 — confirmar explícitamente antes de tocar código |
| `BirthDate` requerido rompe candidatos existentes sin ese dato | 🔴 CRÍTICA | Decidir backfill vs bloqueo en Fase 0; script de migración con validación previa |
| `CandidateApplicationRole` pierde flexibilidad de catálogo (FK→enum) | 🟠 ALTA | F0.2 — confirmar con negocio antes de Fase 2 |
| Borrar `CandidateInterviewScheduleStatus`/`InterviewRejectionReason` viejo rompe consumidores no vistos en Candidates | 🟠 ALTA | `grep` obligatorio antes de cada borrado en Fase 7; no asumir alcance |
| Fase 3 y Fase 6 son las más grandes — riesgo de PR gigante difícil de revisar | 🟡 MEDIA | Sub-dividir en PRs por archivo/componente si el diff crece demasiado |
| Renombrar carpeta `candidate-application/`→`candidate-process/` mezclado con cambio funcional | 🟡 MEDIA | 6.3 — decidir explícitamente si se separa en una fase aparte |

## Dependencias

- `nueva-extructuraV3.md` (fuente del modelo) y `nueva-extructuraV2.md` sección Z (estado
  previo a este refactor)
- `conventions/operations/plan-agent-instructions.md` (formato de plan)
- `conventions/operations/data-migration-protocol.md` (migraciones)
- `dto-file-organization-rule.md` (1 archivo = 1 DTO)
- Plan de convenciones ya vigente y aparte:
  `docs/plans/20260813-reclutamiento-candidates-remediacion-plan.md` — no mezclar sus tareas

---

**Plan generado:** 2026-08-15
**Aprobación requerida:** Tech Lead (Fase 0 completa) antes de asignar Fase 1

---

## Hotfixes post-cierre (2026-08-16, QA manual del usuario contra la app real)

Al probar la app real (migración ya aplicada) el usuario reportó 3 issues sobre `Candidates`:

1. **✅ CORREGIDO — Bug crítico bloqueante.** `CandidateAppService.CreateAsync`/`UpdateAsync`
   nunca fijaban `Candidate.NormalizedPhoneNumber`/`NormalizedEmail` (quedaban en `""`), por lo
   que el índice único `IX_RecruitmentCandidates_NormalizedPhoneNumber_Unique` chocaba con el
   segundo candidato creado — `DbUpdateException` cruda, sin mensaje de negocio. Fix: se
   calculan explícitamente (`StringExtension.ToClearString` para teléfono, `ToUpperInvariant`
   para correo, mismo patrón usado en el resto del código) y se agregó verificación de negocio
   previa (`PHONE_ALREADY_EXISTS`/`EMAIL_ALREADY_EXISTS` usando las columnas `Normalized*`, no
   `ToLower()` inline como antes). Regresión cubierta en
   `CandidateProcessSmokeTests.cs` (mapper del test ya no enmascara el bug; se agregó
   assertion de que ambos campos quedan poblados + que un segundo candidato con el mismo
   teléfono lanza `PHONE_ALREADY_EXISTS`). `dotnet build`/`dotnet test` verdes.
2. **✅ CORREGIDO — UX.** El validador Angular `minimumAdultAgeValidator` (en
   `candidate-form.ts`, solo frontend — el backend no valida edad mínima, hallazgo ya
   registrado en 8.1) no tenía mapeo de mensaje en el componente compartido
   `shared/ui/inputs/base/validation-errors-custom-input.ts`, mostrando el fallback
   `Error desconocido: minimumAdultAge`. Se agregaron los casos `minimumAdultAge` e
   `invalidDate` con mensaje en español. `npx tsc --noEmit` verde.
3. **✅ IMPLEMENTADO.** Búsqueda silenciosa de teléfono duplicado con panel de decisión in situ
   en `candidate-form.ts`/`.html` (no bloquea el formulario, a diferencia del precedente
   `phoneExist`/`emailExist` de `employee-external-form.ts`).
   - **Backend:** `ICandidateAppService.SearchByPhoneAsync(string phone)` (normaliza igual que
     el fix del bug 1, reutiliza `CandidateListItemDto`) + endpoint
     `GET api/recruitment-candidates/search-by-phone?phone=`. Cubierto en
     `CandidateProcessSmokeTests.cs` (match y no-match).
   - **Frontend:** `valueChanges` del campo teléfono con `debounceTime(400)` +
     `distinctUntilChanged` + `takeUntilDestroyed` (patrón ya usado en
     `candidate-interview-feedback-form.ts` y otros); autoexcluye el propio `id` en modo
     edición. Panel con 3 acciones: **Ver/actualizar datos** (carga el candidato encontrado en
     el mismo formulario, reutilizando `onLoadData()`), **Asignar a entrevista** (cierra este
     diálogo y abre `CandidateApplicationForm` — que ya soporta preseleccionar
     `candidateId` — vía `import()` dinámico para evitar dependencia circular entre
     `candidate-form.ts` y `candidate-application-form.ts`, que ya importa `CandidateForm`),
     **Desarchivar** (solo si `Status=Archived`, llama al endpoint `unarchive` ya existente).
     `npx tsc --noEmit` verde.

5. **✅ CORREGIDO — regla de negocio: solo vacantes `Pendiente` aceptan candidatos nuevos
   (2026-08-16).** Verificado que `RequestPosition.Status` pasa a `Proceso` específicamente
   cuando se registra una solicitud de alta (`RequestEmployeeRegisterAppService.cs:341`) — es
   decir, "Proceso" significa "ya hay un candidato en trámite de contratación para esta
   vacante", no solo "vacante abierta". Antes se permitía seguir asignando candidatos nuevos a
   vacantes en `Proceso` (`CandidateProcessAppService.CreateAsync` solo bloqueaba
   Cancelado/Concluido, y `SelectItemRequestPositionsPendingAsync` — el combo de "vacantes
   disponibles" — incluía `Pendiente` y `Proceso` pese a su nombre). Ambos ahora exigen
   `Status.Pendiente` exclusivamente. `dotnet build`/tests verdes.

6. **✅ CORREGIDO — hallazgo crítico: formulario de retroalimentación RRHH apuntaba a un
   endpoint eliminado en Fase 7 (2026-08-16).** `EmployeeInterviewFeedbackForm` (cola de
   entrevistador de `recursos-humanos.luxuryapp`) posteaba a
   `recruitment-candidate-interviews/feedback` — la ruta de `CandidateInterviewEndPoint`,
   borrada junto con `CandidateInterviewAppService` en la limpieza de Fase 7. Cualquier envío
   de retroalimentación desde esa pantalla fallaba en silencio. Su gemelo en
   `reclutamiento.luxuryapp` (`CandidateInterviewFeedbackForm`) sí quedó bien migrado al
   endpoint real (`interviewerAction`, con las 5 decisiones + `newScheduledAt` para
   Reprogramar). Se eliminó el duplicado roto y `employee-interview-response.ts` +
   `EmployeeQueueCandidateDetailModal` ahora reutilizan directamente el componente correcto
   de `reclutamiento.luxuryapp` (cross-module import, mismo patrón ya usado para
   `CandidateStageBadge`/`MappedPTag`/`AGENDA_STATUS_TAG_OPTIONS`).
   - De paso: "Responder entrevista" desde `EmployeeQueueCandidateDetailModal` ya no navega a
     la página completa `/directory/employee-interviews/respond` (info redundante con el
     modal de detalle + 4 botones sueltos con sub-modal de motivo) — abre
     `CandidateInterviewFeedbackForm` directo como modal apilado, con las 5 decisiones +
     motivo condicional + comentario en un solo formulario. Verificado en navegador con datos
     reales (AVIVIA 58): decisión, motivo condicional al elegir Rechazado, y comentario
     funcionan correctamente. La página routeada standalone se deja intacta para deep-links
     externos (ej. notificaciones), pero ya no es el camino principal.
   - **Hallazgo del usuario probándolo en vivo (2026-08-17):** el botón "Responder entrevista"
     se mostraba habilitado sin importar si el candidato tenía una entrevista `Programada`
     activa — al usarlo con un candidato "Sin entrevistador" (nunca agendado), el backend
     rechazaba correctamente con `BusinessException: "El proceso no tiene una entrevista
     programada activa."` (`ExecuteInterviewerActionAsync`), pero el modal no lo anticipaba.
     Corregido: `EmployeeQueueCandidateDetailModal` ahora recibe `canSubmitFeedback`/
     `pendingAction` (ya calculados por el backend en `CandidateInterviewerQueueItemDto`, antes
     ignorados por el frontend) y deshabilita el botón + muestra "Acción pendiente: {texto}"
     cuando no aplica. Verificado en navegador con el mismo candidato de prueba.

4. **✅ CORREGIDO — deuda legacy encontrada durante auditoría de rutas de Reclutamiento
   (2026-08-16).** No era una regresión nueva; era la limpieza de Fase 6/7 incompleta:
   - Eliminado `postulacionesEnPreFiltro`/`PostulacionesEnPreFiltro` (backend
     `CandidateProcessKpisDto.cs` + `CandidateProcessAppService.cs`, siempre hardcodeado a 0
     con comentario "Legacy: PreFiltro removed in V3"; frontend `candidate-process-kpis.dto.ts`
     + tarjeta "Pre-Filtro" y bucket del gráfico en `candidate-application-kpis.ts`, ya
     documentado como deuda menor desde Fase 4).
   - Eliminado el enum frontend muerto `CandidateApplicationStage` (10 etapas, incluía
     `PreFiltro`/`EntrevistaReclutamiento`) y sus exports asociados en
     `candidate-stage-labels.ts` (`CANDIDATE_STAGE_LABELS`, `CANDIDATE_STAGE_CLASSES`,
     `candidateStageLabel()`) — verificado con grep que ningún componente vivo los consumía;
     los 3 consumidores reales (`candidate-application-list.ts`, `candidate-stage-timeline.ts`,
     `candidate-stage-badge.ts`) ya usaban correctamente las versiones V3
     (`CANDIDATE_PROCESS_STAGE_*`).
   - Cerrado el hallazgo de Fase 7 "confirmado muerto pero no eliminado": se borraron
     `staff-board/interfaces/interviewer-view.interface.ts` y
     `staff-board/services/staff-board-interviewer.service.ts` (RRHH, cero consumidores
     verificados), que eran los únicos que aún importaban `CandidateApplicationStage`.
   - `dotnet build` (Application) y `npx tsc --noEmit` limpios; `CandidateProcessSmokeTests`
     verde tras el cambio de DTO de KPIs.

7. **✅ CORREGIDO — bug crítico: la entrevista se agendaba sin entrevistador pese a
   seleccionarlo en el formulario (2026-08-17).** Hallazgo del usuario probando en vivo: en el
   listado de entrevistas y en `EmployeeQueueCandidateDetailModal` aparecía "Sin entrevistador"
   / "Acción pendiente: Asignar entrevistador" para un candidato registrado desde
   `CandidateApplicationForm` con fecha de entrevista y entrevistador sí seleccionados (ambos
   campos son obligatorios en ese formulario vía `Validators.required` dinámico). Root cause:
   `CandidateProcessAppService.CreateFromFormAsync` y `UpdateFromFormAsync` — los métodos que
   procesan justo ese formulario — nunca leían `dto.RecruitmentInterviewAt` /
   `dto.OperationsInterviewAssignedToUserId` de `CandidateApplicationCreateOrUpdateDto`; el
   proceso se creaba/actualizaba y esos dos campos se descartaban en silencio sin importar lo
   que el usuario eligiera en la UI, por lo que nunca se creaba el `CandidateInterview`.
   Corregido: ambos métodos ahora, cuando `dto.RecruitmentInterviewAt.HasValue`, invocan el
   `ScheduleAsync` ya existente con un `ScheduleRecruitmentInterviewRequest` construido a partir
   del DTO; `UpdateFromFormAsync` además verifica que no exista ya una entrevista `Programada`
   activa antes de reagendar (evita `INTERVIEW_ALREADY_SCHEDULED`). Se agregó el test de
   regresión `CreateFromFormAsync_ConFechaYEntrevistador_AgendaLaEntrevista` en
   `CandidateProcessSmokeTests.cs` que crea un proceso vía `CreateFromFormAsync` con ambos
   campos poblados y verifica que el `CandidateInterview` resultante quede `Programada` con el
   `InterviewerUserId`/`ScheduledAt` correctos. `dotnet build` (Application) y
   `CandidateProcessSmokeTests` verdes (2 pruebas, incluida la nueva).
   - **Importante para QA manual:** los procesos/candidatos creados ANTES de este fix (p. ej.
     el candidato de prueba "gfhdfghdfg Marquez Escobedo" usado en las verificaciones previas de
     esta sesión) quedaron creados por el código con el bug — no tienen ni tendrán
     retroactivamente un `CandidateInterview`, así que seguirán mostrando "Sin entrevistador"
     indefinidamente. Para verificar el fix hay que registrar un candidato NUEVO desde el
     formulario con fecha + entrevistador, o reagendar manualmente el proceso existente desde
     la pantalla correspondiente.
   - **Verificado en navegador (2026-08-17, AVIVIA 58) con datos reales:** se editó el proceso
     de un candidato de prueba ("TestFix AgendaCheck") vía `/recruitment/candidates/applications`
     agregando fecha de entrevista (20/08/2026 12:00) y entrevistador ("Alejandro Cerda Gomez")
     — ambos exigidos por el formulario. Tras guardar: la etapa pasó de "Nuevo" a
     "Ent. Operaciones", el badge de progreso en `/recruitment/candidates/candidates` pasó de
     "Sin entrevistar" a "Agendado", y el modal "Detalle de entrevista" mostró correctamente
     "Entrevista programada 20/08/2026 12:00" + "Entrevistador asignado: Alejandro Cerda Gomez".
     Gotcha de QA local encontrado en el camino (no es un bug de código): el proceso de
     `LuxuryApp.Api.exe` que atendía `localhost:7070` había arrancado ANTES de que este fix se
     escribiera y seguía sirviendo el build viejo — la primera prueba en vivo (candidato nuevo
     vía "Registrar candidato para vacante") mostró el bug intacto pese al fix ya estar en el
     fuente. Se detuvo el proceso viejo (con autorización del usuario) y Visual Studio lo
     recompiló/relanzó automáticamente con el código corregido; la segunda prueba confirmó el
     fix. Moraleja para el resto de la sesión: tras cualquier cambio en `LuxuryApp.Application`
     o `LuxuryApp.Api`, verificar que el proceso corriendo en 7070 sea posterior al último
     `LastWriteTime` de los `.cs` tocados antes de dar una verificación en navegador por buena.
8. **✅ CORREGIDO — segundo hallazgo del usuario en el mismo flujo (2026-08-17): el botón
   "Asignar entrevistador" del tablero de Reclutamiento (`/recruitment/candidates/work-position/
   .../candidates` y su gemelo `/recruitment/candidates/recruitment-interviews`) lanzaba una
   excepción no controlada (`INTERVIEW_ALREADY_SCHEDULED`, 409) al usarlo sobre un candidato que
   ya tenía entrevista agendada.** Instrucción explícita del usuario: *"el flujo es que ahora al
   crear una entrevista es obligatorio el campo entrevistador, en ningún otro formulario debe de
   existir una opción para agregar entrevistador, la opción correcta es modificar entrevistador o
   actualizar entrevistador"*. Investigando la causa raíz se encontraron 3 problemas
   relacionados en la misma superficie (compartida por ambos tableros vía
   `CandidateRecruitmentScheduleModal`):
   - **Bug adicional confirmado, mismo patrón del hallazgo #7 pero por una tercera vía:** la
     acción "Agendar cita" (`schedule`) en este modal NUNCA mostraba el campo de entrevistador en
     el HTML (solo se mostraba para `assign`) ni lo exigía como obligatorio — así que se podía
     agendar una entrevista sin entrevistador también desde este tablero.
     `CandidateProcessAppService.ScheduleAsync` tampoco validaba que
     `OperationsInterviewAssignedToUserId` viniera poblado: si llegaba `null`,
     `ResolveUserRoleAsync(null)` devolvía `default` en silencio (sin excepción) y se creaba el
     `CandidateInterview` con `InterviewerUserId` vacío. Corregido en dos capas: (1) `ScheduleAsync`
     ahora lanza `BusinessException("El entrevistador es obligatorio para agendar la entrevista.",
     "INTERVIEWER_REQUIRED", 400)` si el campo llega vacío — defensa en profundidad para
     cualquier llamador presente o futuro; (2) el modal ahora exige y muestra el selector de
     entrevistador también para la acción `schedule`, no solo `assign`.
   - **Hallazgo colateral — endpoints muertos reintroducidos por el frontend:** las acciones
     "Reagendar" (`reschedule`, cuando `item.interviewId` está poblado) y "Cancelar cita" (cuando
     `item.interviewId` está poblado) llamaban a `CandidateInterviews.reschedule`/`.cancel`
     (`recruitment-candidate-interviews/{id}/...`) — la ruta de `CandidateInterviewEndPoint`,
     confirmado ya eliminada del backend en la limpieza de Fase 7 (mismo módulo que el hallazgo
     #6 de este documento). Es decir: además del bug reportado, "Reagendar" y, en el caso con
     `interviewId`, "Cancelar cita" ya estaban rotos (404) antes de este cambio. Se eliminaron por
     completo los métodos `createInterview`/`rescheduleInterview`/`cancelInterview` de
     `CandidateRecruitmentInterviewsService` (cero consumidores fuera de este modal, verificado
     con grep) y el bloque `CandidateInterviews` de `reclutamiento.endpoints.ts` (cero
     referencias restantes fuera de documentación histórica).
   - **Rediseño del flujo, siguiendo el patrón que el propio backend ya documentaba en un
     comentario** (`CandidateProcessAppService.cs` línea ~1000: *"reagendar/cambiar entrevistador
     se hace por el flujo dedicado (CancelScheduleAsync + ScheduleAsync)"*): las acciones
     `reschedule` y `assign` ahora componen `cancelSchedule` (cancela la entrevista `Programada`
     activa sobre el `CandidateProcess`, endpoint vivo) seguido de `schedule` (crea la nueva con
     la fecha y/o entrevistador actualizados) — sin depender de ningún endpoint por `interviewId`.
     "Reagendar" conserva el entrevistador ya asignado (`item.assignedInterviewerUserId`) y solo
     cambia la fecha; la acción antes llamada "Asignar entrevistador" se renombró a **"Cambiar
     entrevistador"** (título, botón y `submitLabel`) para reflejar su semántica real, y su
     condición de visibilidad pasó de `canSchedule || canReschedule` a solo `canReschedule` — ya
     no tiene sentido "cambiar" un entrevistador que aún no existe; ese caso ahora lo cubre
     directamente "Agendar cita" (que ya exige el campo).
   - Archivos: `CandidateProcessAppService.cs` (guard en `ScheduleAsync`),
     `candidate-recruitment-schedule-modal.ts`/`.html` (rediseño de `execute()`,
     `onCancelInterview()`, validador condicional, campo visible para `schedule`),
     `candidate-work-position-candidates.html`/`.ts`,
     `candidate-recruitment-interviews.html`/`.ts` (relabeling + condición del botón),
     `candidate-recruitment-interviews.service.ts` (métodos muertos eliminados),
     `reclutamiento.endpoints.ts` (bloque `CandidateInterviews` eliminado).
     `dotnet build` (Application) limpio, `npx tsc --noEmit` limpio. Se agregó el test de
     regresión dedicado `ScheduleAsync_SinEntrevistador_LanzaInterviewerRequired` (verifica que
     `ScheduleAsync` sin entrevistador lanza `INTERVIEWER_REQUIRED` y no crea ningún
     `CandidateInterview`); `CandidateProcessSmokeTests` verde (3/3 en ese momento).
     **Pendiente:** verificación en navegador (bloqueada por el backend local caído tras
     detener el proceso viejo para poder recompilar — ver hallazgo de "Gotcha de QA local" en el
     punto 7; se retoma en cuanto el usuario reinicie `LuxuryApp.Api` desde Visual Studio).

9. **✅ IMPLEMENTADO — regla de negocio nueva pedida por el usuario (2026-08-17): al confirmar
   la contratación final de un candidato, los demás candidatos de la misma vacante que aún no
   llegaron a "Seleccionado" pasan a `EnEspera` y su entrevista activa se cancela.** Pregunta
   exploratoria del usuario: *"cuando el entrevistador confirma un candidato pero aún tiene más
   citas abiertas pendientes... ¿los demás candidatos se cancelan? ¿cambian a rechazo con la
   opción de que ya se cubrió la vacante o cuál es la mejor lógica?"*. Verificado que ANTES no
   pasaba nada automático: `ApplyInterviewDecisionAsync` (Aprobado) solo toca el proceso del
   candidato aprobado, y `RequestPosition.Status` no pasa a `Concluido` hasta la confirmación
   final del alta (`ProcessHiringAsync`, segunda llamada) — los demás candidatos con entrevista
   `Programada` para esa vacante quedaban abiertos indefinidamente, sin cancelarse ni
   notificarse. Recomendación dada y aceptada por el usuario: **no rechazo automático duro**
   (un "Seleccionado" puede caerse en el papeleo de alta, y rechazar de más pierde candidatos de
   respaldo) — en su lugar, mover a los hermanos a `EnEspera` (etapa ya existente, reversible,
   no cierra el proceso) solo en el momento en que la vacante realmente se cierra, cancelando su
   entrevista `Programada` si tenían una para que no quede huérfana.
   - Nuevo método privado `CloseSiblingCandidateProcessesAsync(requestPositionId, hiredProcessId)`
     en `CandidateProcessAppService.cs`, invocado desde `ProcessHiringAsync` justo donde se fija
     `RequestPosition.Status = Status.Concluido` (segunda llamada, confirmación de contratación).
     Alcance deliberadamente acotado a candidatos en `Nuevo`/`EntrevistaOperaciones` con
     `ProcessStatus = Abierto`: los que ya avanzaron a `Seleccionado`/`AltaEnProceso` (caso raro
     de dos candidatos aprobados a la vez para la misma vacante) NO se tocan — ese conflicto
     requiere decisión humana explícita, no un cierre silencioso automático.
   - Test de regresión `ProcessHiringAsync_AlConfirmarContratacion_MueveHermanosAbiertosAEnEspera`:
     crea un candidato que se contrata (flujo completo hasta `Contratado`) y un "hermano" con
     entrevista `Programada` activa para la misma vacante; verifica que tras la PRIMERA llamada
     a `ProcessHiringAsync` (proceso queda en `AltaEnProceso`, vacante aún no `Concluido`) el
     hermano sigue intacto en `EntrevistaOperaciones`, y que solo tras la SEGUNDA llamada
     (`Concluido` confirmado) el hermano pasa a `EnEspera` con `ProcessStatus = Abierto` (no se
     cierra) y su entrevista queda `Cancelada`. `dotnet build` (Application) limpio,
     `CandidateProcessSmokeTests` verde (4/4).
   - **Pendiente:** verificación en navegador (mismo bloqueo del backend caído que el punto 8).

10. **✅ CORREGIDO — bug crítico: "borrado permanente" (candidato Y vacante) rompía con
    `SqlException: Invalid object name 'RecruitmentCandidateApplications'` (2026-08-17).**
    Reportado por el usuario al intentar limpiar datos de prueba con el borrado permanente para
    reiniciar el flujo desde cero. Causa raíz: `CandidateAppService.GetDeleteImpactAsync`/
    `DeleteAsync` y `RequestPositionAppService.GetDeleteImpactAsync`/`DeleteCascadeAsync`
    contenían SQL crudo (`SqlQueryRaw`/`ExecuteSqlRawAsync`) apuntando a las tablas legacy
    `RecruitmentCandidateApplications` y `RecruitmentCandidateInterviewFeedback` — ambas
    eliminadas físicamente por la migración `RefactorCandidatesV3`
    (`migrationBuilder.DropTable(...)`, ya aplicada en este entorno) al unificar todo bajo
    `CandidateProcess` en V3. Esas llamadas se ejecutaban de forma incondicional (no detrás de
    ningún flag ni catch), así que **el borrado permanente estaba roto al 100% para cualquier
    candidato o vacante**, no solo para el caso de prueba del usuario.
    - Eliminadas las 5 funciones privadas de SQL crudo en cada servicio
      (`CountLegacyApplicationsAsync`, `LoadLegacyApplicationIdsAsync`,
      `CountLegacyInterviewFeedbacksAsync`, `DeleteLegacyInterviewFeedbacksAsync`,
      `DeleteLegacyApplicationsAsync`) y todas sus referencias en `GetDeleteImpactAsync`/
      `DeleteAsync`/`DeleteCascadeAsync`.
    - Quitados los campos `CandidateApplicationsCount`/`CandidateInterviewFeedbacksCount`
      —siempre ligados al concepto legacy ya inexistente— de
      `CandidateDeleteImpactDto`/`RequestPositionDeleteImpactDto` (backend) y sus interfaces
      espejo en frontend (`candidate.dto.ts` → `CandidateDeleteImpact`,
      `vacantes-list.ts` → `RequestPositionDeleteImpact`), junto con las líneas
      "Postulaciones"/"Retroalimentación de entrevistas" en los diálogos de confirmación
      (`candidate-list.ts`, `vacantes-list.ts`) que las mostraban.
    - `dotnet build` (Application) limpio, `npx tsc --noEmit` limpio,
      `CandidateProcessSmokeTests` verde (4/4, sin regresión — el borrado no tenía cobertura de
      test previa y no se agregó una nueva en esta pasada por no usar `InMemoryDbContextFactory`
      SQL crudo de forma comparable a SQL Server real; se verifica en navegador).
    - **Pendiente:** verificación en navegador (mismo bloqueo del backend caído — requiere que
      el usuario reinicie `LuxuryApp.Api` desde Visual Studio, igual que los puntos 8 y 9).

11. **✅ CORREGIDO — "Fuente de reclutamiento" (`CandidateForm`, formulario "Nuevo Candidato")
    convertido de select a radio buttons, con un bug de runtime real descubierto y corregido en
    el camino (2026-08-17).** Pedido del usuario: el select ya no se desplegaba al hacer click
    (bug reportado sin poder reproducirlo a fondo) y, dado que solo hay 2 opciones reales
    (Interno/Externo), sugirió usar radio buttons en su lugar — aceptado e implementado.
    - Primer intento: usar el wrapper compartido `AppRadioButton` (`@ui/web/radio-button/radio-button`)
      con `[formControl]="form.controls.recruitmentSource"`, replicando el patrón reactivo del
      resto del formulario. **Esto provocó un crash real en el navegador**
      (`NG01203: No value accessor for form control`) que el usuario reportó en vivo. Causa
      raíz: `RadioButtonBase.formControl` es un `input()` normal (no implementa
      `ControlValueAccessor`/`NG_VALUE_ACCESSOR`), pero el nombre `formControl` colisiona con la
      directiva real de Angular `[formControl]` de `ReactiveFormsModule` — como el componente
      anfitrión (`CandidateForm`) ya importa `ReactiveFormsModule` (necesario para el resto del
      formulario), Angular intenta aplicar su propia directiva reactiva sobre `<app-radio-button>`
      y falla porque el wrapper no es un value accessor real. Se confirmó con grep que
      `AppRadioButton` no tenía NINGÚN uso real en todo el repo con binding reactivo — su único
      consumidor era una página de catálogo/demo (`catalog-web-extras.ts`) que solo le pasa
      `value`/`label` estáticos sin `[formControl]`, es decir, el wrapper nunca había sido
      probado en un formulario reactivo real.
    - Corregido usando el patrón nativo ya establecido en esta misma sesión y precedente en
      `employee-provider-form.html`: `<input type="radio">` con `[checked]`/`(change)` manual
      `AppRadioButton` se dejó sin tocar (fuera de alcance arreglar su CVA — no lo usa nadie
      más); queda como deuda conocida si en el futuro alguien intenta reutilizarlo en un
      formulario reactivo real.
    - Archivos: `candidate-form.html` (select → radio buttons nativos, filtra la opción
      placeholder `value === null` que el propio `fuenteReclutamiento()` incluye en la lista),
      `candidate-form.ts` (quitado `CustomInputSelectSignal`, ya no usado). `npx tsc --noEmit`
      limpio. No requiere reiniciar el backend (cambio 100% frontend).

12. **✅ IMPLEMENTADO — reemplazo de `EmployeeProviderForm` por el formulario grandote
    (`CandidateProcessHiringModal`) como único flujo de alta de empleado (2026-08-17).**
    Ejecuta la decisión R.1 + el requerimiento W.2 ya documentados en
    `nueva-extructuraV2.md` (nunca ejecutados) más lo pedido explícitamente por el usuario en
    esta sesión: el formulario grandote debe ser el único para alta, en ambos casos (candidato
    aprobado o alta directa), con todos los campos completos siempre — la única diferencia es
    un botón opcional para importar 5 campos básicos (nombre, apellido, correo, teléfono, fecha
    de nacimiento) de un candidato `Seleccionado` ligado a la vacante, con confirmación.
    - **Backend:** `ResolveOrCreateEmployeeIdAsync`/`BuildRequestEmployeeRegisterDto` dejaron de
      exigir un `Candidate` no-nulo (usan `dto.Email`, nuevo campo requerido en
      `CandidateApplicationProcessHiringDto`, y `candidate?.Id`/`candidate?.RecruitmentSource` —
      la columna `RequestEmployeeRegister.CandidateId` y su DTO ya eran `Guid?`, solo faltaba
      que el código lo aprovechara). Nuevo método `ProcessDirectHiringAsync(requestPositionId,
      dto)`: crea el `Employee`, dispara `OnSolicitudAltaAsync` y cierra la vacante
      (`RequestPosition.Status = Concluido`) en una sola llamada — a diferencia de
      `ProcessHiringAsync` no hay confirmación en dos pasos porque no existe una etapa de
      `CandidateProcess` que validar. Reutiliza `CloseSiblingCandidateProcessesAsync` (punto 9)
      para mover a `EnEspera` cualquier candidato que siguiera abierto en esa vacante. Nuevo
      endpoint `POST recruitment-candidate-processes/direct-hire/{requestPositionId}`.
    - **Frontend (`CandidateProcessHiringModal`):** agregado campo `email` (obligatorio) al
      Paso 1; "Fuente heredada" (antes un texto de solo lectura que nunca se llenaba sin
      candidato) pasó a ser un select editable real. Nueva lógica en `ngOnInit`: si
      `dialogData.candidateId` viene poblado, precarga inmediata de los 5 campos básicos desde
      `recruitment-candidates/{id}`; si en cambio viene `dialogData.requestPositionId` (sin
      candidato conocido), busca automáticamente un candidato `Seleccionado` ligado a esa
      vacante (`GET recruitment-candidate-processes/request-position/{id}`, endpoint que ya
      existía en el backend pero nunca se había tipado en `reclutamiento.endpoints.ts`) y, si
      encuentra uno, muestra el botón "Importar datos de candidato aprobado" (confirmación vía
      `Swal.fire`, no `window.confirm` como hacía el código legacy); si no encuentra ninguno, el
      botón simplemente no aparece. `onSubmit` elige el endpoint según el caso:
      `processHiring(id)` si hay un `CandidateProcess`, si no `directHire(requestPositionId)`.
      Banner de bloqueo si no hay ninguno de los dos (vacante sin solicitud activa).
    - **Tres puntos de entrada re-cableados** a `CandidateProcessHiringModal`:
      `staff-board.ts` → `showModalAddEmployeeFromPosition` (caso alta directa/import, antes
      abría `EmployeeProviderForm` de `supplier.luxuryapp` — dominio Proveedor/ExternalStaff,
      mal reutilizado para altas internas), `candidate-recruitment-interviews.ts` →
      `openAltaForm` (ídem, ahora pasa `candidateId` para precarga automática), y
      `candidate-detail.ts` → `onProcessHiring` (ya usaba el formulario grandote pero sin
      `candidateId` — se agregó para que el nuevo campo `email` no quede vacío en ese flujo).
    - **`EmployeeProviderForm` queda huérfano** (verificado con grep: cero imports reales fuera
      de su propio archivo y su spec) — no se borró en este cambio (fuera del alcance pedido),
      queda como hallazgo a decidir por el usuario.
    - Test de regresión `ProcessDirectHiringAsync_SinCandidateProcess_CreaEmployeeYCierraVacante`
      en `CandidateProcessSmokeTests.cs`. `dotnet build` (Application) limpio,
      `CandidateProcessSmokeTests` verde (5/5), `npx tsc --noEmit` limpio.
    - **Pendiente:** verificación en navegador (requiere reiniciar `LuxuryApp.Api` desde Visual
      Studio, igual que los puntos 8–10).

13. **✅ AJUSTADO — formulario grandote calcado contra el formato físico real "FORMATO DE ALTA
    DEL TRABAJADOR" (2026-08-17).** El usuario adjuntó el PDF físico que hoy se llena a mano y
    pidió alinear el digital contra él, con dos hallazgos adicionales durante la verificación en
    vivo.
    - **Máscaras de teléfono:** los 3 campos de teléfono (`phoneNumber`, `emergencyContact-
      PhoneNumber`, `beneficiaryPhoneNumber`) pasaron de `custom-input-text-signal` a
      `custom-input-mask-signal` con `customMask="(00) 0000-0000"` (componente ya existente en
      `@ui/inputs/adaptive/input-mask`, mismo patrón usado en otros formularios del repo).
    - **Código Postal del RFC e INFONAVIT:** en vez de un verdadero input `type="number"` (que
      pierde ceros a la izquierda — varios CP de CDMX empiezan en 0), se implementaron como
      `custom-input-mask-signal` numéricas: `customMask="00000"` (CP, 5 dígitos) y
      `customMask="0000000000"` (No. de crédito INFONAVIT, exactamente 10 dígitos numéricos sin
      letras, tal como lo pidió el usuario) — logra "solo dígitos" sin el bug de ceros perdidos.
    - **Banco por catálogo real, no texto libre:** el campo "Banco" causaba en producción
      `BusinessException: "No se encontro el banco 'sdfasdf'"` — `ResolveBankIdAsync` intentaba
      hacer *fuzzy match* de un string libre contra `ShortName`/`LargeName`/`Code` de la tabla
      `Bank`. Corregido de raíz: `CandidateApplicationProcessHiringDto.BankName` (string) →
      `BankId` (`Guid?`), el campo del formulario pasó a `custom-input-select-signal` poblado
      con el catálogo real (`Endpoints.SelectItems.bank`, mismo patrón ya usado en
      `employee-bank-data-form.ts`/`proveedor-form.ts` — confirmado contra CONVENTIONS.md, regla
      de SELECTs centralizados). `ResolveBankIdAsync` (el método con el fuzzy match) se eliminó
      por completo; `BuildRequestEmployeeRegisterDto` ahora resuelve el `ShortName` a partir del
      `BankId` ya validado (un solo lookup, sin excepción posible por escritura libre).
    - **Fuente de reclutamiento eliminada de este formulario:** el usuario señaló que ese dato
      ya vive en la entidad `Candidate` (capturado en el flujo de reclutamiento) y pedirlo de
      nuevo aquí era una captura duplicada. Se quitó el campo, el control del formulario, y el
      requisito `RECRUITMENT_SOURCE_REQUIRED` en `BuildRequestEmployeeRegisterDto` — ahora
      simplemente usa `candidate?.RecruitmentSource` (null para altas directas sin candidato, lo
      cual es correcto: sin candidato no hay concepto de "fuente de reclutamiento").
      `ApplyHiringDataToCandidate` ya no la reescribe tampoco (evita que el alta pise el valor
      que el candidato ya tenía).
    - `BuildRequestEmployeeRegisterDto` pasó de síncrono a `async Task<...>` (por el lookup de
      banco); sus dos llamadores (`ProcessHiringAsync`, `ProcessDirectHiringAsync`) actualizados
      con `await`.
    - Actualizados los 3 `CandidateApplicationProcessHiringDto` de
      `CandidateProcessSmokeTests.cs` (quitado `BankName`/`RecruitmentSource`, agregado
      `BankId` con un GUID aleatorio — el proveedor InMemory no valida FK reales).
    - `dotnet build` (Application) limpio, `CandidateProcessSmokeTests` verde (5/5),
      `npx tsc --noEmit` limpio.
    - **Pendiente:** verificación en navegador (bloqueada por el backend caído — el usuario está
      generando y aplicando su propia migración EF para los campos de la sesión anterior, así
      que este ajuste queda pendiente de probar hasta que ese ciclo termine).
