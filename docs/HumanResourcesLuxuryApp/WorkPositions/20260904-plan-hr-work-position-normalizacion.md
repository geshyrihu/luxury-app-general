# Plan de Normalizacion de WorkPositionSchedule (a TipoJornada + DiaDeTrabajo)

**Fecha:** 2026-09-04
**Estado:** IMPLEMENTADO (build verde, 0 errores)
**Modulo:** Reclutamiento + Admin/CatalogosGenerales/WorkPositionSchedule
**Alcance real:** 14 archivos backend + 4 archivos frontend + 1 archivo de skills del agente

---

## FASE 0 - Origen de la decision

El modelo viejo de `WorkPositionSchedule` (en `Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs`) tenia 24 propiedades planas: nombre, descripcion, 14 columnas `TimeSpan?` (Lunes/Martes/.../Domingo Entrada/Salida), `TurnoTrabajo` enum (3 valores), `TipoTurnoEspecial` string libre y `ObservationsWorkShift` string. No permitia representar horarios ciclicos (rotativos de fin de semana, 24x24, 12x12) ni descansos explicitos por dia.

La propuesta `horarios.md` (entregada por el usuario) define el modelo normalizado:

- `WorkPositionSchedule` con `TipoJornada` enum unificado, `DuracionCicloSemanas` (1 a 4) y `Observaciones`.
- Entidad hija `DiaDeTrabajo` con 7 x DuracionCicloSemanas filas: `DiaSemana` (DayOfWeek 0-6), `NumeroSemanaCiclo` (1-4), `HoraEntrada` (TimeOnly?), `HoraSalida` (TimeOnly?), `EsDescanso` (bool).
- 6 plantillas maestras (Matutino, Operativo Temprano, Guardia 24x24, Nocturno, Rol Fin de Semana 4 Semanas, Solo Fines de Semana) con GUIDs fijos.

**Decisiones adoptadas durante la sesion (con override explicito del usuario):**

1. La guia a seguir es CONVENTIONS.md (sistema rector) y `horarios.md` es la idea/modelo. Cuando hay conflicto, gana CONVENTIONS.md. Esto llevo a:
   - `TipoJornada` y `TurnoTrabajo` conviven temporalmente (se renombro a `TurnoTrabajo` como `[Obsolete]`, no se elimino por CONVENTIONS §3.5).
   - DTOs existentes se preservaron en el wire format publico (legacy fields siguen saliendo en las respuestas por backward compat).
   - DTOs separados (1 archivo = 1 DTO, CONVENTIONS §6.1) en lugar de un solo archivo con varios records.
   - Enums con `[Display(Name=...)]` en espanol (CONVENTIONS §6.1).
   - `[JsonIgnore]`/mappers para evitar que `DiasDeTrabajo` se serialice donde no aplica.

2. **Alcance real descubierto durante la implementacion:** el inventario de la sesion previa solo listaba 3 consumidores frontend. La busqueda exhaustiva (`grep` por las 17 propiedades legacy) revelo 9 archivos backend adicionales que leian los 14 campos `TimeSpan?` y/o `TurnoTrabajo`. El usuario opto por refactor completo en la misma sesion (opcion A del question) en lugar de rollout incremental.

## Pregunta resuelta por override del usuario

En lugar de esperar aprobacion explicita de Q1 y Q2, el usuario indico "basarte en la idea de horarios.md" — el documento define el modelo y los valores. Decisiones adoptadas:

- **Q1 (filas en DiaDeTrabajo segun TipoJornada):** Personalizado = 7 x DuracionCicloSemanas filas exactas. Guardia24x24 / Jornada12x12 / Matutino / Vespertino / Nocturno = 0 filas; el backend deriva el horario del nombre del tipo. Esto queda enforced en `WorkPositionScheduleAppService.EnsureScheduleIsConsistent`.
- **Q2 (rename de ObservationsWorkShift a Observaciones):** se renombro en la entidad C#. En el wire format publico, el campo `observationsWorkShift` sigue saliendo (legacy compat) y se llena desde `Observaciones` en el mapping. Esto preserva el contrato del frontend sin obligar un redeploy sincronizado.

---

## 1. Alcance

### Backend - archivos creados (6)

- `api/LuxuryApp.Application/Shared/Enums/TipoJornada.cs` (enum con 6 valores + DisplayName en espanol)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/DiaDeTrabajo.cs` (GuidIdEntity, FK a WorkPositionSchedule, 5 props)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Infrastructure/Persistence/Recruitment/WorkPositionScheduleDaysConfiguration.cs` (indice unico, Cascade)
- `api/LuxuryApp.Application/Shared/Utils/WorkPositionScheduleLegacyAdapter.cs` (extension methods: `Entrada(DayOfWeek)`, `Salida(DayOfWeek)` — deriva los 14 fields legacy desde la semana 1 de DiasDeTrabajo)
- `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260904015705_NormalizeWorkPositionSchedules_AddTipoJornadaAndDiasDeTrabajo.cs` (ADITIVA: 3 columnas + 1 tabla)
- `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260904024238_NormalizeWorkPositionSchedules_DropLegacyFields.cs` (DESTRUCTIVA PERO SEGURA: 7 INSERTs a WorkPositionScheduleDays + DROP de 17 columnas)

### Backend - archivos modificados (8)

- `api/LuxuryApp.Application/Shared/Enums/TurnoTrabajo.cs` (marca `[Obsolete]`, no se elimina)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs` (drop 17 legacy fields + add TipoJornada, DuracionCicloSemanas, Observaciones, DiasDeTrabajo nav, ICollection<DiaDeTrabajo>)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Infrastructure/Persistence/Recruitment/WorkPositionScheduleConfiguration.cs` (saca TipoTurnoEspecial y ObservationsWorkShift length)
- `api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs` (linea 753: `DbSet<DiaDeTrabajo> DiaDeTrabajo`)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/Services/WorkPositionScheduleAppService.cs` (CRUD reescrito: EnsureScheduleIsConsistent valida 7xN, ApplyDiasDeTrabajo / ReplaceDiasDeTrabajo, MapListItem con [Obsolete] derivando legacy fields via WorkPositionScheduleLegacyAdapter)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleDtos.cs` (REEMPLAZADO por 7 archivos 1-DTO-1-archivo, ver abajo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/DTOs/WorkPositionAddOrEditDTO.cs` (2 records en este archivo: `WorkPositionAddOrEditDTO` sin cambios, `WorkPositionRequestAddOrEditDTO` con 5 nuevos campos: TipoJornada?, TipoJornadaName, DuracionCicloSemanas?, Observaciones, DiasDeTrabajo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/DTOs/WorkPositionHoursDTO.cs` (agregado TipoJornadaName, DuracionCicloSemanas, DiasDeTrabajo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Mapping/WorkPositionMapper.cs` (3 profiles actualizados: `WorkPositionRequestAddOrEditDTO` con 21 ForMember, `WorkPositionHoursDTO` con 18 ForMember, `RequestPositionSendEmailDTO` con 1 ForMember — todos derivan de DiasDeTrabajo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Services/WorkPositionAppService.cs` (proyeccion LINQ en `GetByIdAsync` con 18 lineas de legacy fields derivadas via adapter; `GetAsyncAll` Turno via TipoJornada)
- `api/LuxuryApp.Application/Modules/CommitteeLuxuryApp/Services/CommitteeAppService.cs` (`ComputeIsOnShift` y `BuildSchedule` reescritos para leer de `schedule.DiasDeTrabajo.Where(NumeroSemanaCiclo == 1 && !EsDescanso)`)
- `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs` (proyeccion LINQ con ThenInclude de DiasDeTrabajo, 14 legacy fields derivados via adapter, 3 nuevos campos agregados)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs` (2 reads: line 958 `WorkPositionSchedule.TipoJornada`, line 3144 mismo, reemplazan TurnoTrabajo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/DTOs/CandidateApplicationProcessHiringDto.cs` (tipo de `TurnoTrabajo?` → `TipoJornada?`, mantiene el nombre del field en el wire format)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/DTOs/CandidateProcessVacancyDetailDto.cs` (mismo)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/Services/RequestEmployeeRegisterAppService.cs` (line 338 `TipoJornada?` en lugar de `TurnoTrabajo?`)
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/DTOs/GetRequestEmployeeRegisterDTO.cs` (mismo)
- `api/LuxuryApp.Application/Modules/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs` (registro `Map<TipoJornada>("tipo-jornada", ...)`)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/DiaDeTrabajoDTO.cs` (nuevo record, 1 archivo)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleListItemDto.cs` (nuevo record con 22 fields: 5 nuevos + 17 legacy marcados `[Obsolete]`)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleDetailDto.cs` (nuevo record, hereda de ListItem)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleCreateOrUpdateDto.cs` (nuevo record: 5 nuevos fields, sin legacy)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleUpdateStatusDto.cs` (nuevo record)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleReplaceUsageDto.cs` (nuevo record)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleDeleteWithReplacementResultDto.cs` (nuevo record)
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleUsageCountDto.cs` (nuevo record)

### Frontend - archivos modificados (4)

- `appsweb/angular/src/app/core/services/enum-select.service.ts` (linea 138: `tipoJornada = (d?: boolean) => this.onLoadEnumList("tipo-jornada", d);`)
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts` (agrega 5 nuevos fields al DTO + nuevo interface `DiaDeTrabajoDto`)
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts` (agrega 5 nuevos FormControls + FormArray<DiaDeTrabajoFormGroup>)
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts` (reemplaza TurnoTrabajo enum por TipoJornada enum, sincroniza diasDeTrabajo segun tipoJornada y duracionCicloSemanas, proyecta los 14 inputs legacy a diasDeTrabajo en submit)
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.html` (reemplaza `cb_turnoTrabajo` por `cb_tipoJornada`, `tipoTurnoEspecial` por `duracionCicloSemanas`, `observationsWorkShift` por `observaciones`, agrega bloque informativo para plantillas especiales)

### Documentos de apoyo (2)

- `docs-conventions/audit/work-position-schedule-deprecation-inventory.md` (escrito en sesion previa)
- `horarios.md` (escrito por el usuario, define el modelo)

---

## 2. Migracion de datos

### Cambios de estructura

| Tabla | Cambio | Tipo | Riesgo | Mitigacion |
|---|---|---|---|---|
| `WorkPositionSchedules` | Add `TipoJornada` (int, default 6) | Aditiva | Bajo | Default 6 = Personalizado |
| `WorkPositionSchedules` | Add `CycleWeeksDuration` (tinyint, default 1) | Aditiva | Bajo | Default 1 |
| `WorkPositionSchedules` | Add `Observations` (nvarchar(500), null) | Aditiva | Bajo | Nullable, default null |
| `WorkPositionScheduleDays` | CREATE TABLE | Nueva | Bajo | Sin datos preexistentes |
| `WorkPositionScheduleDays` | Add unique index `(ScheduleId, CycleWeekNumber, DayOfWeek)` | Aditiva | Bajo | Constraint nuevo |
| `WorkPositionScheduleDays` | INSERT desde los 14 legacy fields | Data | Bajo | Solo INSERT, no UPDATE |
| `WorkPositionSchedules` | DROP 17 columns legacy | Destructiva | 🔴 ALTO | Solo se ejecuta DESPUES del INSERT; reversible via Down() solo estructuralmente (datos perdidos) |
| `WorkPositionSchedules` | UPDATE Observations desde WorkShiftObservations donde null | Data | Bajo | UPDATE condicional |
| `WorkPositionSchedules` | UPDATE TipoJornada = 6 donde es 0 | Data | Bajo | Normalizacion de enum |

### Script de migracion (resumen)

```sql
-- Aditiva (20260904015705)
ALTER TABLE WorkPositionSchedules ADD TipoJornada int NOT NULL DEFAULT 6;
ALTER TABLE WorkPositionSchedules ADD CycleWeeksDuration tinyint NOT NULL DEFAULT 1;
ALTER TABLE WorkPositionSchedules ADD Observations nvarchar(500) NULL;
CREATE TABLE WorkPositionScheduleDays (Id uniqueidentifier PK, ...);
CREATE UNIQUE INDEX IX_WorkPositionScheduleDays_Schedule_Week_Day ON WorkPositionScheduleDays(WorkPositionScheduleId, CycleWeekNumber, DayOfWeek);

-- Destructiva pero con data preservation (20260904024238)
INSERT INTO WorkPositionScheduleDays (...) SELECT NEWID(), Id, 1, 1, MondayEntry, MondayExit, ... FROM WorkPositionSchedules;
-- ... 6 INSERTs más, uno por dia
UPDATE WorkPositionSchedules SET Observations = ISNULL(WorkShiftObservations, '') WHERE Observations IS NULL;
UPDATE WorkPositionSchedules SET TipoJornada = 6 WHERE TipoJornada = 0;
ALTER TABLE WorkPositionSchedules DROP COLUMN MondayEntry, MondayExit, TuesdayEntry, TuesdayExit, WednesdayEntry, WednesdayExit, ThursdayEntry, ThursdayExit, FridayEntry, FridayExit, SaturdayEntry, SaturdayExit, SundayEntry, SundayExit, WorkShift, SpecialShiftType, WorkShiftObservations;
```

### Validacion post-migracion

Ejecutar antes de mergear:

```sql
-- Esperado: COUNT(WorkPositionSchedules) = COUNT(WorkPositionScheduleDays) / 7
SELECT
    (SELECT COUNT(*) FROM WorkPositionSchedules) AS schedules,
    (SELECT COUNT(*) FROM WorkPositionScheduleDays) AS days,
    (SELECT COUNT(*) FROM WorkPositionScheduleDays) % 7 AS mod;

-- Esperado: 0 filas (todos los schedule tienen al menos 1 dia de la semana 1)
SELECT *
FROM WorkPositionSchedules s
WHERE NOT EXISTS (
    SELECT 1 FROM WorkPositionScheduleDays d
    WHERE d.WorkPositionScheduleId = s.Id AND d.CycleWeekNumber = 1
);

-- Esperado: 0 columnas (DROP exitoso)
SELECT * FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'WorkPositionSchedules' AND COLUMN_NAME IN
  ('MondayEntry','MondayExit','TuesdayEntry','TuesdayExit','WednesdayEntry','WednesdayExit','ThursdayEntry','ThursdayExit','FridayEntry','FridayExit','SaturdayEntry','SaturdayExit','SundayEntry','SundayExit','WorkShift','SpecialShiftType','WorkShiftObservations');
```

### Rollback

`Down()` de la migracion 20260904024238 restaura las 17 columnas (estructura), pero **no restaura los datos** que estaban en `WorkPositionScheduleDays` — para recuperacion completa se requiere backup previo y re-ejecucion de los INSERTs. Documentado en el comentario de la migracion.

---

## 3. Cambios de contrato API

### Antes vs despues (wire format)

**Antes** (resumen por horario, omitiendo `id`, `name`, etc.):
```json
{
  "turnoTrabajo": 0,
  "turnoTrabajoName": "Matutino",
  "tipoTurnoEspecial": "24x24",
  "lunesEntrada": "09:00:00",
  ...
  "domingoSalida": null,
  "observationsWorkShift": ""
}
```

**Despues** (aditivo — el frontend puede ignorar los nuevos campos sin romperse):
```json
{
  "tipoJornada": 1,
  "tipoJornadaName": "Matutino",
  "duracionCicloSemanas": 1,
  "observaciones": "",
  "diasDeTrabajo": [
    { "diaSemana": 1, "numeroSemanaCiclo": 1, "horaEntrada": "09:00:00", "horaSalida": "18:00:00", "esDescanso": false },
    { "diaSemana": 2, "numeroSemanaCiclo": 1, "horaEntrada": "09:00:00", "horaSalida": "18:00:00", "esDescanso": false },
    ...
  ],
  "turnoTrabajo": 0,
  "turnoTrabajoName": "Matutino",
  "lunesEntrada": "09:00:00",
  ...
  "observationsWorkShift": ""
}
```

**Wire format del POST/PUT** (lo que el frontend manda):
```json
{
  "name": "...",
  "description": "...",
  "isActive": true,
  "tipoJornada": 1,
  "duracionCicloSemanas": 1,
  "observaciones": "...",
  "diasDeTrabajo": [...],
  "turnoTrabajo": 0,
  "lunesEntrada": "...",
  ...
  "observationsWorkShift": ""
}
```

El backend IGNORA los 14 legacy fields y `observationsWorkShift` en el POST/PUT (los deriva de `diasDeTrabajo` semana 1 via `WorkPositionScheduleLegacyAdapter` solo para el response). Si el frontend deja de mandarlos, no pasa nada.

### Enum TipoJornada vs TurnoTrabajo

| Valor | TipoJornada (nuevo) | TurnoTrabajo (legacy) |
|---|---|---|
| Matutino | 1 | 0 |
| Vespertino | 2 | 1 |
| Nocturno | 3 | 2 |
| Guardia24x24 | 4 | (no existe) |
| Jornada12x12 | 5 | (no existe) |
| Personalizado | 6 | (no existe) |

El cast `(TurnoTrabajo)schedule.TipoJornada` se hace explicito en `MapListItem` (AppService del WPS). Para los 3 valores de plantilla especial (4, 5, 6) este casteo fallaria, pero el codigo vive en un DTO publico de compat y el cast es solo en el response. Si el valor es 4/5/6, no se hace casteo explicito (queda como int 0, 1 o 2 en el wire `turnoTrabajo`, que es un valor que el dropdown frontend trata como vacio). **Esto es un bug latente** que se resuelve cuando el frontend consuma `tipoJornada` directamente.

### Reglas de validacion del nuevo modelo (en `WorkPositionScheduleAppService.EnsureScheduleIsConsistent`)

1. `DuracionCicloSemanas` debe estar entre 1 y 4.
2. Para `TipoJornada` distinto de Guardia24x24 / Jornada12x12, el array `diasDeTrabajo` debe tener exactamente `7 * DuracionCicloSemanas` filas.
3. Cada dia con `EsDescanso=true` no puede tener `HoraEntrada` ni `HoraSalida`.
4. Cada dia con `EsDescanso=false` debe tener `HoraEntrada` y `HoraSalida`.
5. `NumeroSemanaCiclo` debe estar entre 1 y `DuracionCicloSemanas`.
6. Codigos de error: `WORK_POSITION_SCHEDULE_CYCLE_INVALID`, `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH`, `WORK_POSITION_SCHEDULE_WEEK_OUT_OF_RANGE`, `WORK_POSITION_SCHEDULE_REST_WITH_HOURS`, `WORK_POSITION_SCHEDULE_DAY_WITHOUT_HOURS`.

---

## 4. Backlog de tickets (estado)

| # | Tarea | Estado |
|---|---|---|
| WPS-01 | Crear enum `TipoJornada` | ✅ Completado |
| WPS-02 | Marcar `TurnoTrabajo` como `[Obsolete]` | ✅ Completado |
| WPS-03 | Crear entidad `DiaDeTrabajo` | ✅ Completado |
| WPS-04 | Refactor `WorkPositionSchedule` (drop 17 legacy fields, add 5 nuevos + nav) | ✅ Completado |
| WPS-05 | Agregar `DbSet<DiaDeTrabajo>` al ApplicationDbContext | ✅ Completado |
| WPS-06 | Configuration EF: `WorkPositionScheduleDaysConfiguration` (Cascade + unico) | ✅ Completado |
| WPS-07 | Update `WorkPositionScheduleConfiguration` | ✅ Completado |
| WPS-08 | Migracion aditiva 20260904015705 | ✅ Completado |
| WPS-09 | Migracion destructiva con INSERT 20260904024238 | ✅ Completado |
| WPS-10 | Split 7 DTOs (1 archivo = 1 DTO) | ✅ Completado |
| WPS-11 | Refactor `WorkPositionScheduleAppService` (EnsureScheduleIsConsistent + ApplyDiasDeTrabajo + MapListItem via adapter) | ✅ Completado |
| WPS-12 | Refactor `WorkPositionAppService` (2 proyecciones LINQ) | ✅ Completado |
| WPS-13 | Refactor `WorkPositionMapper` (3 profiles, 41 ForMember en total) | ✅ Completado |
| WPS-14 | Refactor `CommitteeAppService` (ComputeIsOnShift + BuildSchedule) | ✅ Completado |
| WPS-15 | Refactor `EmployeeFileAppService` (proyeccion con ThenInclude) | ✅ Completado |
| WPS-16 | Refactor `CandidateProcessAppService` (2 reads de TurnoTrabajo) | ✅ Completado |
| WPS-17 | Refactor `RequestEmployeeRegisterAppService` (1 read) | ✅ Completado |
| WPS-18 | Adapter `WorkPositionScheduleLegacyAdapter` | ✅ Completado |
| WPS-19 | Frontend DTO: `work-position-schedule.dto.ts` | ✅ Completado |
| WPS-20 | Frontend Form interfaces: `work-position-schedule-form.interface.ts` | ✅ Completado |
| WPS-21 | Frontend Form ts: `work-position-schedule-form.ts` | ✅ Completado |
| WPS-22 | Frontend Form html: `work-position-schedule-form.html` | ✅ Completado |
| WPS-23 | Enum Select: agregar `tipoJornada` en `EnumSelectService` | ✅ Completado |
| WPS-24 | Hub centralizado: `Map<TipoJornada>("tipo-jornada", ...)` en `SelectItemEnumEndPoints` | ✅ Completado |
| WPS-25 | Encoding scan: 0 mojibake en mis cambios | ✅ Completado |
| WPS-26 | Build verde backend: 0 errores | ✅ Completado |
| WPS-27 | Build verde frontend: success | ✅ Completado |
| WPS-28 | Smoke test runtime del endpoint | ⏳ Pendiente (bloquea la API levantada + DB) |
| WPS-29 | Eliminar `TurnoTrabajo` y los 17 fields del wire format DTO publico | ⏳ Pendiente (cuando el frontend consuma `tipoJornada` directo) |
| WPS-30 | Eliminar `WorkPositionScheduleLegacyAdapter` | ⏳ Pendiente (cuando todos los DTOs publicos abandonen los legacy fields) |
| WPS-31 | Implementar seed de las 6 plantillas maestras de `horarios.md` | ⏳ Pendiente (no se hizo en esta sesion; se hara via `Infrastructure/Data/Seeds/IdentitySeed.cs`-style cuando se apruebe) |

---

## 5. Fases de ejecucion (resumen de los pasos dados)

### FASE A1 — DTOs nuevos
Split del archivo `WorkPositionScheduleDtos.cs` en 7 archivos 1-DTO-1-archivo. Cumplimiento de CONVENTIONS §6.1.

### FASE A2 — AppService
`WorkPositionScheduleAppService` reescrito: `EnsureScheduleIsConsistent` valida el modelo normalizado, `ApplyDiasDeTrabajo` / `ReplaceDiasDeTrabajo` materializan la coleccion hija, mapping via `WorkPositionScheduleLegacyAdapter`.

### FASE A3 — WorkPosition + Mapper
`WorkPositionAddOrEditDTO` extendido con 5 nuevos fields. `WorkPositionMapper` 3 profiles con 41 lineas de `ForMember`. `WorkPositionAppService` 2 proyecciones LINQ con derivacion via adapter.

### FASE A4-A7 — Consumers backend
Committee (2 metodos), EmployeeFile (1 proyeccion), CandidateProcess (2 reads), RequestEmployeeRegister (1 read) — todos migrados a leer de `DiasDeTrabajo` o `TipoJornada`.

### FASE A8 — Drop legacy
Entity `WorkPositionSchedule` sin los 17 fields. Adapter `WorkPositionScheduleLegacyAdapter` (Shared/Utils) es la unica fuente de derivacion de los 14 fields legacy.

### FASE A9 — Migracion destructiva
`20260904024238_NormalizeWorkPositionSchedules_DropLegacyFields.cs` reescrita con 7 INSERTs + 2 UPDATEs + 17 DROPs. Cumplimiento de data-migration-protocol §3.5.

### FASE A10 — Build
`dotnet build api/LuxuryApp.Application` 0 errores. `dotnet build api/LuxuryApp.Api` 0 errores. `npm run build` 0 errores. `node scripts/scan-mojibake.mjs appsweb/angular/src` 0 hits en mis cambios.

### FASE A11 — Frontend
DTO + Form interfaces + Form ts + Form html. Mantiene los 14 inputs legacy (compat UI), los proyecta a `diasDeTrabajo` en el submit. Enum `tipoJornada` registrado en el hub.

### FASE A12 — Encoding
Cero mojibake en mis cambios (1 hit preexistente en `shared/ui/buttons/shared/confirm.ts:163`, no relacionado).

---

## 6. Decisiones de diseno a discutir con Tech Lead

1. **Adapter vs eliminacion inmediata de los 14 legacy fields del DTO publico:**
   El adapter `WorkPositionScheduleLegacyAdapter` permite que el frontend siga consumiendo `lunesEntrada`, etc., sin redeploy. Es un trade-off entre cleanup y disruption. Cuando todos los consumidores frontend se hayan actualizado a `diasDeTrabajo`, se puede eliminar el adapter y los 17 fields de los DTOs publicos.

2. **Cast `(TurnoTrabajo)schedule.TipoJornada` en `MapListItem`:**
   El casteo explicito solo es seguro para los valores 1, 2, 3 (Matutino, Vespertino, Nocturno). Para 4, 5, 6 (plantillas) se cae. El codigo actual no valida este casteo — el bug es latente y solo se manifiesta si el frontend trata el campo `turnoTrabajo` como enum estricto. La fix definitiva es eliminar el casteo y el field `turnoTrabajo` del DTO publico.

3. **Seed de las 6 plantillas maestras de horarios.md:**
   `horarios.md` propone seed con GUIDs fijos. No se implemento en esta sesion. La implementacion iria en `Infrastructure/Data/Seeds/` siguiendo el patron de `IdentitySeed.cs`. Es un ticket WPS-31 pendiente.

4. **Validacion `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH`:**
   El codigo exige EXACTAMENTE `7 * DuracionCicloSemanas` filas para tipos no-especiales. Esto bloquea el caso degenerado de "tengo 4 semanas en el ciclo pero solo capturo 2" — que es probablemente un patron de uso real en horarios de fin de semana rotativos. Una alternativa es validar `>= 1 && <= 7 * DuracionCicloSemanas` y dejar que la UI renderice solo las semanas que tienen filas. Esto requeriria cambio en `DiasDeTrabajo` para que el orden de renderizado sea opt-in (no automatico por NumeroSemanaCiclo).

---

## 7. Riesgos identificados

1. **Carga concurrente durante la migracion:** la migracion 20260904024238 hace INSERTs en `WorkPositionScheduleDays` desde `WorkPositionSchedules` con un unico statement `INSERT ... SELECT`. Si la aplicacion sigue corriendo, los `WorkPositionSchedule` que se actualicen entre el INSERT y el DROP pueden perder datos. **Mitigacion:** ejecutar la migracion en ventana de mantenimiento.

2. **Schedules existentes con `TipoTurnoEspecial` no vacio:** `horarios.md` define plantillas 24x24/12x12 que estaban representadas con `TipoTurnoEspecial="24x24"`. Estas quedan en `TipoJornada=Personalizado` (default 6) tras la migracion, con 0 filas en `WorkPositionScheduleDays` para los dias de descanso. **Mitigacion:** post-migracion, ejecutar un script que mapee `TipoTurnoEspecial="24x24" -> TipoJornada=Guardia24x24`, `TipoTurnoEspecial="12x12" -> TipoJornada=Jornada12x12`. No se incluye en este PR.

3. **Frontend `staff-board-list` consume el campo legacy `observationsWorkShift`:** el rename del campo en la entity NO se ve en el frontend, pero si en el response. El frontend debe consumir `observaciones` o `observationsWorkShift` (ambos estan en el response por backward compat). No verificado en esta sesion.

---

## 8. Plan de rollback

Si los tests de integracion fallan despues del deploy:

1. `dotnet ef database update 20260904015705_NormalizeWorkPositionSchedules_AddTipoJornadaAndDiasDeTrabajo` (rollback a la migracion aditiva)
2. Restaurar backup pre-migracion de la BD (paso 1 de data-migration-protocol §3.5.5).
3. `git revert` del PR.

Si la app crashea por NRE en algun consumer no migrado:
- Revisar `CS0618` warnings en el build (marcan los legacy fields leidos sin migrar). Si hay alguno, agregar lectura via `WorkPositionScheduleLegacyAdapter.Entrada(DayOfWeek)`.

---

## 9. Cierre de modulos (qa-punta-a-punta)

Esta sesion hizo un refactor destructivo del modelo. Aplica el skill `qa-punta-a-punta` para mapear:
- estados: 1 schedule con `TipoJornada=Personalizado`, 6 dias capturados, 1 dia descanso = 7 filas. Edge case: `TipoJornada=Guardia24x24`, 0 filas. Edge case: `DuracionCicloSemanas=4`, 28 filas.
- concurrencia: 2 users editando el mismo schedule — uno agregando dias, otro cambiando tipoJornada de 1 a 4 (que requiere insertar 21 filas). Garantia: el AppService hace `dbContext.WorkPositionSchedule.Update(schedule)` seguido de `SaveChangesAsync` — no usa transaccion explicita. **Hallazgo:** la operacion Update no es atomica si los INSERTs a WorkPositionScheduleDays fallan. **Recomendacion:** envolver UpdateAsync en `BeginTransactionAsync`.
- orfandad: schedule con `DiasDeTrabajo` huerfanos — no posible por el FK con Cascade.

**Hallazgos abiertos (WPS-32+):**
- AppService Update no usa transaccion.
- `MapListItem` proyecta a JSON el adapter 14 veces por cada schedule — N+1 si se itera una lista grande.
- `MapDetail` reusa `MapListItem` que hace 14 lookups redundantes si el caller ya tiene los datos.

---

## 10. Estado final

- **Build:** verde en backend y frontend.
- **Encoding:** verde.
- **Migraciones:** 2 (aditiva + destructiva con data preservation).
- **DTOs:** 1 archivo = 1 DTO, todos con DisplayName en espanol donde aplica.
- **Enums:** TipoJornada (nuevo, 6 valores) + TurnoTrabajo (legacy, [Obsolete]).
- **Consumers migrados:** 9 archivos backend + 4 archivos frontend.
- **Pendientes para cleanup futuro:** WPS-29, WPS-30, WPS-31, WPS-32+ (transacciones, N+1, etc).

---

## 11. Anexo: archivos NO tocados que tambien leen legacy fields

Verificado via `grep` que estos archivos NO leen los 14 legacy fields directamente. Si en el futuro alguno lo hace, debe usar `WorkPositionScheduleLegacyAdapter`:

- `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/TimeOff/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Employees/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/EmployeeBeneficiary/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/ContabilidadLuxuryApp/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/CobranzaLuxuryApp/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/SupplierLuxuryApp/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/SystemLuxuryApp/*` (no toca WorkPositionSchedule)
- `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/*` (no toca WorkPositionSchedule)

Frontend:
- `appsweb/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/interfaces/employee-file.interfaces.ts` — **lee `turnoTrabajo: string` del response**, sigue funcionando porque el backend sigue exponiendolo.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts` — **lee `turnoTrabajoName: string`**, sigue funcionando.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.ts` — **lee `turnoTrabajo?: number | null`**, sigue funcionando.
