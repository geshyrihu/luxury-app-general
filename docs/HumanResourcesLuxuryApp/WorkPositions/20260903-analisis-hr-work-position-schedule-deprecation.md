# WorkPositionSchedule - Inventario de consumidores

**Generado:** 2026-09-04
**Proposito:** Documentar todos los puntos donde se referencia la entidad `WorkPositionSchedule` o cualquiera de sus 24 propiedades, en preparacion para una futura consolidacion/eliminacion definitiva de la entidad.
**Origen del marcador:** `// TODO-DEPRECATE:` colocado en `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs` (cambio solo de comentarios, sin alteracion de comportamiento ni build break).

> Antes de cualquier cambio destructivo sobre estas propiedades, este inventario debe estar completo y revisado.

---

## 0. Resumen ejecutivo

| Dimension | Cantidad |
|---|---|
| Referencias backend (.cs) | ~70 lineas distribuidas en 14 archivos |
| Referencias frontend (.ts) | ~30 lineas distribuidas en 9 archivos |
| Modulos backend con consumidores | 6 (`Admin/WorkPositionSchedule`, `Reclutamiento/WorkPosition`, `Committee`, `CandidateProcess`, `RecursosHumanos/EmployeeFile`, `RecursosHumanos/Employee`+`Reclutamiento/Reclutamiento/Recruitment`) |
| Modulos frontend con consumidores | 3 (`admin.luxuryapp/catalogos-generales`, `reclutamiento.luxuryapp/work-position`, `recursos-humanos.luxuryapp/expediente-del-empleado/employee-file`, `reclutamiento.luxuryapp/solicitud-vacante`) |
| Archivos con mayor concentracion | `WorkPositionAppService.cs`, `WorkPositionMapper.cs`, `WorkPositionAddOrEditDTO.cs`, `WorkPositionScheduleAppService.cs`, `WorkPositionScheduleDtos.cs`, `ApplicationDbContextModelSnapshot.cs` + 6 designers de migraciones |
| Migraciones que referencian la entidad | 6 designers historicos + `20260903212058_MakeWorkPositionSchedulesGlobal` (activa) |

**Observacion clave:** la mayoria de las propiedades se exponen a traves de DTOs y AutoMapper. La limpieza requerira coordinacion en 3 capas (entidad + mapper + DTO) y romperia la API publica si no se versiona.

---

## 1. Entity-level consumers (entidad, tabla, FK, navegacion)

### 1.1 Backend

| Archivo | Linea | Snippet / Rol |
|---|---|---|
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs` | 16 | `[Table("WorkPositionSchedules")]` (declaracion) |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs` | 17 | `public class WorkPositionSchedule : GuidIdEntity, IAuditable` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPosition.cs` | 65-66 | `[Column("WorkPositionScheduleId")] public Guid? WorkPositionScheduleId { get; set; }` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPosition.cs` | 71 | `public WorkPositionSchedule WorkPositionSchedule { get; set; }` (nav) |
| `api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs` | 752 | `public DbSet<WorkPositionSchedule> WorkPositionSchedule { get; set; }` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Infrastructure/Persistence/Recruitment/WorkPositionScheduleConfiguration.cs` | 5-29 | `IEntityTypeConfiguration<WorkPositionSchedule>` con FK, longitud maxima e indices |
| `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs` | 215 | `services.AddScoped<IWorkPositionScheduleAppService, WorkPositionScheduleAppService>();` |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/Interfaces/IWorkPositionScheduleAppService.cs` | 4-13 | Interfaz publica (8 metodos) |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/Services/WorkPositionScheduleAppService.cs` | 4-5 | Implementacion del AppService |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/Services/WorkPositionScheduleAppService.cs` | 9,20,59,69,108,122,136,144,165,169,189,276 | Usos de `dbContext.WorkPositionSchedule` (CRUD) |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/EndPoints/WorkPositionScheduleEndpoints.cs` | 4-45 | 8 endpoints REST (GetList, GetById, Create, Update, UpdateStatus, Delete, GetUsageCount, DeleteWithReplacement) |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/DTOs/WorkPositionScheduleDtos.cs` | 1-94 | 7 records (ListItem, Detail, CreateOrUpdate, UpdateStatus, ReplaceUsage, DeleteWithReplacementResult, UsageCount) |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Services/WorkPositionAppService.cs` | 34,57,473 | `.Include(x => x.WorkPositionSchedule)` (proyecciones del nav) |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Services/WorkPositionAppService.cs` | 92,145,281,359 | `x.WorkPositionScheduleId` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Mapping/WorkPositionMapper.cs` | 11-12,20-21,27-29,31-32,43-56,58-64 | Mappings de `WorkPositionScheduleId/Name` y de los 14 dias + TurnoTrabajo |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/DTOs/WorkPositionListDto.cs` | 29-30 | `public Guid? WorkPositionScheduleId / string WorkPositionScheduleName` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/DTOs/WorkPositionDTO.cs` | 60,64,68 | `WorkPositionScheduleId / Name / TurnoTrabajo` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/DTOs/WorkPositionAddOrEditDTO.cs` | 12,16,65,68,71,74,77,80,83,86,89,92,95,98,101,104,138,142,153,159-189 | Campos en `WorkPositionAddOrEditDTO` y `WorkPositionRequestAddOrEditDTO` |
| `api/LuxuryApp.Application/Modules/CommitteeLuxuryApp/Services/CommitteeAppService.cs` | 110-112 | `.Include(x => x.WorkPositionSchedule)` |
| `api/LuxuryApp.Application/Modules/CommitteeLuxuryApp/Services/CommitteeAppService.cs` | 191,199,227,235 | `position.WorkPositionSchedule / .LunesEntrada` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs` | 36,644,925 | `.ThenInclude(x => x.WorkPositionSchedule)` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs` | 958,3144,3203 | `WorkPositionSchedule?.TurnoTrabajo` y `dto.TurnoTrabajo` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/DTOs/CandidateApplicationProcessHiringDto.cs` | 63 | `public TurnoTrabajo? TurnoTrabajo` |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/DTOs/CandidateProcessVacancyDetailDto.cs` | 21 | `public TurnoTrabajo TurnoTrabajo` |
| `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs` | 385 | `.Include(x => x.WorkPositionSchedule)` |
| `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs` | 395,397-410 | Proyecciones anonimas de los 14 dias y TurnoTrabajo |
| `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/Services/RequestEmployeeRegisterAppService.cs` | 337-338 | `WorkPositionSchedule.TurnoTrabajo` (mapeo a Turno) |
| `api/LuxuryApp.Application/Modules/AdminLuxuryApp/Infraestructura/AppImplementationTracking/OrgStructureValidation/Services/OrgStructureValidationService.cs` | 39 | `if (!position.WorkPositionScheduleId.HasValue)` (validacion) |
| `api/LuxuryApp.Tests/Application/Modules/AppImplementationTracking/OrgStructureValidationServiceTests.cs` | 25 | `WorkPositionScheduleId = workPositionScheduleId,` (test) |

**Migraciones (historico de modelos):**

| Archivo | Lineas relevantes |
|---|---|
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/ApplicationDbContextModelSnapshot.cs` | 15886, 15888, 15902, 15907, 16013, 16015, 21744, 21746, 21757, 22656 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260903212058_MakeWorkPositionSchedulesGlobal.cs` | 9, 15-44 (migracion activa con `IX_WorkPositionSchedules_*`) |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260903212058_MakeWorkPositionSchedulesGlobal.Designer.cs` | 15889, 15891, 15905, 15910, 16016, 16018, 21747, 21749, 21760, 22659 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260830194935_AddApplicationRoleSystemRole.Designer.cs` | 15820, 15822, 15836, 15841, 15951, 15953, 21660, 21662, 21673, 22562 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260830183800_AddApplicationRoleCodeAndColorHex.Designer.cs` | 15817, 15819, 15833, 15838, 15948, 15950, 21657, 21659, 21670, 22559 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260903195020_AddSortOrderToEmployeeDocument.Designer.cs` | 15889, 15891, 15905, 15910, 16020, 16022, 21751, 21753, 21764, 22663 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260901193721_AddFonacotCredit.Designer.cs` | 15863, 15865, 15879, 15884, 15994, 15996, 21714, 21716, 21727, 22621 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260903154106_ExtractEmployeeBeneficiary.Designer.cs` | 15882, 15884, 15898, 15903, 16013, 16015, 21744, 21746, 21757, 22656 |
| `api/LuxuryApp.Application/Infrastructure/Data/Migrations/20260831131722_AddOnboardingChecklistSlaSupport.Designer.cs` | 15849, 15851, 15865, 15870, 15980, 15982, 21700, 21702, 21713, 22607 |

### 1.2 Frontend

| Archivo | Linea | Snippet / Rol |
|---|---|---|
| `appsweb/angular/src/app/core/constants/endpoints/admin.endpoints.ts` | 222-237 | `WorkPositionSchedule: { create / delete / getAll / getById / update / updateStatus / getUsageCount / replaceUsage }` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts` | 1, 26 | `interface WorkPositionScheduleDto / WorkPositionScheduleAddOrEdit` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts` | 3 | `interface WorkPositionScheduleFormGroup` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts` | 51, 68 | `class WorkPositionScheduleForm / FormGroup<WorkPositionScheduleFormGroup>` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-list.ts` | 70 | `class WorkPositionScheduleList` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-list.ts` | 33-49, 75, 102, 132, 159, 165, 171, 187-188 | `WorkPositionScheduleDto` y endpoints |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts` | 151-163 | `onGetItem<WorkPositionScheduleDto>(...getById)`, `onPost(...create)` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-replace-usage-form.ts` | 26, 37, 47, 54, 80-83 | `WorkPositionScheduleReplaceUsageForm` consume `WorkPositionScheduleDto[]` via `getAll` |
| `appsweb/angular/src/app/apps/admin.luxuryapp/admin.routes.ts` | 254 | `(m) => m.WorkPositionScheduleList` (registro lazy) |
| `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts` | 69-70, 137-138, 217-237 | `workPositionSchedules = signal<WorkPositionScheduleOption[]>([])` + interface local `WorkPositionScheduleOption` |
| `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/interfaces/work-position.model.ts` | 63-64 | `workPositionScheduleId / workPositionScheduleName` |

---

## 2. Propiedades

### 2.1 Name

#### Backend
- `WorkPositionSchedule.cs:23-27` — declaracion con `[Required]`, `[StringLength(100)]`.
- `WorkPositionScheduleConfiguration.cs:9` — `HasIndex(x => x.Name).HasDatabaseName("IX_WorkPositionSchedules_Name")`.
- `WorkPositionScheduleConfiguration.cs:17-18` — `.HasMaxLength(100)`.
- `WorkPositionScheduleAppService.cs:11` — `.OrderBy(x => x.Name)`.
- `WorkPositionScheduleAppService.cs:30-31, 37, 73-74, 78, 211-217, 273-281, 289` — validacion `NormalizeName`, unicidad, asignacion, mapeo a DTO.
- `WorkPositionScheduleDtos.cs:7, 36` — `public string Name` en `ListItemDto` y `CreateOrUpdateDto`.
- `WorkPositionAppService.cs:93, 146` — proyeccion `WorkPositionScheduleName = x.WorkPositionSchedule.Name`.
- `WorkPositionMapper.cs:12, 21, 28, 55` — `MapFrom(... WorkPositionSchedule.Name ...)`.
- `WorkPositionListDto.cs:30`, `WorkPositionDTO.cs:64`, `WorkPositionAddOrEditDTO.cs:16, 142` — campo `WorkPositionScheduleName` en DTOs derivados.
- Migraciones (snapshot + designers) — `b.HasIndex("Name").HasDatabaseName("IX_WorkPositionSchedules_Name")`.

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:3, 27` — `name: string`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:5` — `name: FormControl<string>`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:70-73` — FormControl con `Validators.required / maxLength(100)`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-replace-usage-form.ts:64` — `.map((s) => ({ label: s.name, value: s.id }))`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts:150, 186, 219` — `label: schedule.name` / `selected?.name` / `name: string` en interface.

### 2.2 Description

#### Backend
- `WorkPositionSchedule.cs:33-36` — `[StringLength(250)] public string Description`.
- `WorkPositionScheduleConfiguration.cs:20-21` — `.HasMaxLength(250)`.
- `WorkPositionScheduleAppService.cs:38, 79, 290, 320` — `Description = dto.Description?.Trim() ?? ""` / `= schedule.Description`.
- `WorkPositionScheduleDtos.cs:8, 37` — `public string Description`.

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:4, 28` — `description: string`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:6` — FormControl.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:74-77` — FormControl con `maxLength(250)`.

### 2.3 IsActive

#### Backend
- `WorkPositionSchedule.cs:42-44` — `[Column("IsActive")] public bool IsActive { get; set; } = true`.
- `WorkPositionScheduleAppService.cs:39, 80, 112, 117, 129, 174, 285, 291, 321` — CRUD + `UpdateStatusAsync` + filtro en `DeleteWithReplacementAsync` + mapeos.
- `WorkPositionScheduleDtos.cs:9, 38, 61` — campo en `ListItemDto / CreateOrUpdateDto / UpdateStatusDto`.
- `WorkPositionAppService.cs:285, 363` — `AnyAsync(x => x.Id == DTO.WorkPositionScheduleId.Value && x.IsActive)` (validacion al asignar horario a un puesto).

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:5, 29` — `isActive: boolean`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:7` — FormControl.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:78` — FormControl con default `true`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-replace-usage-form.ts:63` — `.filter((s) => s.isActive && s.id !== excludedId)`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts:148, 220` — `.filter((s) => s.isActive)` / `isActive: boolean`.

### 2.4 WorkPositions (nav collection)

#### Backend
- `WorkPositionSchedule.cs:50` — `public HashSet<WorkPosition> WorkPositions { get; set; } = []`.
- `WorkPositionScheduleConfiguration.cs:12-15` — `HasMany(x => x.WorkPositions).WithOne(x => x.WorkPositionSchedule).HasForeignKey(x => x.WorkPositionScheduleId).OnDelete(DeleteBehavior.Restrict)`.
- `WorkPositionScheduleAppService.cs:126, 149, 182-187` — uso indirecto via `WorkPosition.AnyAsync(x => x.WorkPositionScheduleId == id)`.

#### Frontend
- No aplica (navegacion EF interna, no expuesta a UI).

### 2.5 TurnoTrabajo

#### Backend
- `WorkPositionSchedule.cs:56-57` — `[Column("WorkShift")] public TurnoTrabajo TurnoTrabajo`.
- `WorkPositionScheduleAppService.cs:40, 81, 292, 293, 322, 323` — CRUD + `TurnoTrabajoName = schedule.TurnoTrabajo.GetDisplayName()`.
- `WorkPositionScheduleDtos.cs:10, 11, 39` — `TurnoTrabajo` (enum) y `TurnoTrabajoName` (string).
- `WorkPositionAppService.cs:147` — `Turno = x.WorkPositionSchedule != null ? x.WorkPositionSchedule.TurnoTrabajo.GetDisplayName() : ""`.
- `WorkPositionMapper.cs:29, 58, 80` — `MapFrom(... TurnoTrabajo.GetDisplayName() ...)` y `(TurnoTrabajo?)`.
- `WorkPositionAddOrEditDTO.cs:59, 153` — `public TurnoTrabajo? TurnoTrabajo` en ambas DTOs.
- `WorkPositionDTO.cs:68` — `public TurnoTrabajo TurnoTrabajo`.
- `WorkPositionHoursDTO.cs:8` — `public string TurnoTrabajo` (display).
- `CandidateProcessAppService.cs:958, 3144, 3203` — `WorkPositionSchedule?.TurnoTrabajo` y `dto.TurnoTrabajo`.
- `CandidateApplicationProcessHiringDto.cs:63` — `public TurnoTrabajo? TurnoTrabajo`.
- `CandidateProcessVacancyDetailDto.cs:21` — `public TurnoTrabajo TurnoTrabajo`.
- `EmployeeFileAppService.cs:395` — `TurnoTrabajo = x.WorkPositionSchedule.TurnoTrabajo.ToString()`.
- `RequestEmployeeRegisterAppService.cs:337-338` — `WorkPositionSchedule.TurnoTrabajo`.
- `CommitteeAppService.cs:110-112` — `.Include(x => x.WorkPositionSchedule)` para Turno.

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:6, 7, 31` — `turnoTrabajo: number / turnoTrabajoName: string`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:8` — `turnoTrabajo: FormControl<number>`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:60, 79-82, 126` — `cb_turnoTrabajo` + FormControl + `EnumSelectService.turnoTrabajo()`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts:221` — `turnoTrabajoName: string` en `WorkPositionScheduleOption`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/interfaces/work-position.model.ts:69` — `turnoTrabajo: string` en `IWorkPositionHours`.
- `appsweb/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/interfaces/employee-file.interfaces.ts:142` — `turnoTrabajo: string` en `EmployeeFileWorkPositionDTO`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.ts:25, 40, 63, 70, 89-90` — `turnoTrabajo?: number | null`, FormControl y `cb_turnoTrabajo`.
- `appsweb/angular/src/app/core/services/enum-select.service.ts:136` — `turnoTrabajo = (d?: boolean) => this.onLoadEnumList("turno-trabajo", d)`.

### 2.6 TipoTurnoEspecial

#### Backend
- `WorkPositionSchedule.cs:64-66` — `[Column("SpecialShiftType")] public string TipoTurnoEspecial`.
- `WorkPositionScheduleConfiguration.cs:23-24` — `.HasMaxLength(50)`.
- `WorkPositionScheduleAppService.cs:41, 82, 221-243, 249, 294, 324` — `NormalizeSpecialShiftDays` (limpia los 14 dias si hay turno especial) + `EnsureScheduleHasUsableHours`.
- `WorkPositionScheduleDtos.cs:12, 40` — `public string TipoTurnoEspecial`.

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:8, 31` — `tipoTurnoEspecial: string`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:9` — FormControl.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:61-65, 83-86, 117-140` — opciones (`Turno fijo / 24x24 / 12x12`), FormControl, signal espejo + `valueChanges` que limpia los 14 controles de dias.

> **Nota:** `TipoTurnoEspecial` no se expone en los DTOs de `WorkPosition` (Mapper), por lo que no se consume en el frontend fuera del modulo de catalogos.

### 2.7-2.20. Los 14 campos diarios (Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo) - Entrada/Salida

Todos siguen el mismo patron. Listo a continuacion las referencias canonicas (las 14 propiedades tienen exactamente la misma huella):

#### Backend (plantilla comun por dia)

- `WorkPositionSchedule.cs` (lineas 72-145) — declaracion con `[Column("MondayEntry" / "MondayExit" / ...)] public TimeSpan?`.
- `WorkPositionScheduleAppService.cs:42-55, 83-96, 229-260, 295-328` — propagacion CRUD + `NormalizeSpecialShiftDays` + `EnsureScheduleHasUsableHours`.
- `WorkPositionScheduleDtos.cs:13-26, 41-54` — `public TimeSpan?` en DTOs.
- `WorkPositionAppService.cs:94-107` — `LunesEntrada = x.WorkPositionSchedule != null ? x.WorkPositionSchedule.LunesEntrada : null` (y los 13 equivalentes para los demas dias).
- `WorkPositionMapper.cs:31-32, 43-56, 58-64` — `MapFrom(... WorkPositionSchedule.LunesEntrada ...)` y resto.
- `WorkPositionAddOrEditDTO.cs:65-104, 159-189` — campos en `WorkPositionAddOrEditDTO` y `WorkPositionRequestAddOrEditDTO`.
- `EmployeeFileAppService.cs:397-410` — proyecciones anonimas (Lunes/Martes/.../Domingo entrada y salida).
- `CommitteeAppService.cs:199, 235` — `schedule.LunesEntrada` (idem resto).
- Migraciones (ApplicationDbContextModelSnapshot + 6 designers) — `b.Property<TimeSpan?>("LunesEntrada")` con `HasColumnName("MondayEntry")` y equivalentes.

#### Frontend (plantilla comun por dia)

- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:9-22, 32-45` — `lunesEntrada: string | null` (idem resto) en `WorkPositionScheduleDto` y `WorkPositionScheduleAddOrEdit`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:10-23` — `lunesEntrada: FormControl<string | null>` (idem resto).
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:87-100, 108, 177` — FormControl + `days[]` + helper `toTimeInput`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-list.ts:134` — `formatDay("Lun", item.lunesEntrada, item.lunesSalida)` (y los demas).
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/work-position-form.ts:81, 223-236` — `schedule?.lunesEntrada` y `lunesEntrada: string | null` en `WorkPositionScheduleOption` (los 14).
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/work-position/interfaces/work-position.model.ts:70-83` — `lunesEntrada: string | null` ... `domingoSalida: string | null` en `IWorkPositionHours` (los 14).
- `appsweb/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/interfaces/employee-file.interfaces.ts:144-157` — `lunesEntrada?: string` ... `domingoSalida?: string` (los 14).
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.html:99-144` — bindeo de las 14 celdas en la tabla de horario semanal.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.ts:26-39, 71-83` — campos en `WorkPositionDetailDTO` y FormGroup.

### 2.21 ObservationsWorkShift

#### Backend
- `WorkPositionSchedule.cs:158-159` — `[Column("WorkShiftObservations")] [MaxLength(500)] public string ObservationsWorkShift`.
- `WorkPositionScheduleAppService.cs:56, 97, 304, 334` — Trim + propagacion CRUD + mapeo.
- `WorkPositionScheduleDtos.cs:27, 55` — `public string ObservationsWorkShift`.
- `WorkPositionAddOrEditDTO.cs:155-156, 192-193` — `public string ObservationsWorkShift` en `WorkPositionRequestAddOrEditDTO` (anadido en este ciclo, mapper extendido).

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts:23, 46` — `observationsWorkShift: string`.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule-form.interface.ts:24` — FormControl.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts:101-104` — FormControl con `maxLength(500)`.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.ts:39, 84` — `observationsWorkShift?: string` en `WorkPositionDetailDTO` y FormGroup.
- `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form.html:59-63` — renderizado condicional.

### 2.22-2.25. CreatedAt / CreatedBy / UpdatedAt / UpdatedBy (heredados de IAuditable)

Estos campos son genericos y se comparten con muchas entidades. En el contexto de `WorkPositionSchedule`:

#### Backend (uso explicito en esta entidad)
- `WorkPositionSchedule.cs:164-183` — declaracion de los 4 campos.
- `WorkPositionScheduleAppService.cs` — no se asignan explicitamente (los llena la infraestructura de auditoria o quedan en default).
- `WorkPositionScheduleDtos.cs` — no expone estos campos en los DTOs.
- Migraciones — las columnas son generadas por EF (`CreatedAt` / `CreatedBy` / `UpdatedAt` / `UpdatedBy`).

#### Frontend
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/interfaces/work-position-schedule.dto.ts` — no incluye los campos de auditoria.
- `appsweb/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts` — no se persisten en el form.

> **Conclusión:** la eliminacion de `WorkPositionSchedule` arrastraria solo las columnas genericas de `IAuditable`, que se recrean automaticamente si la entidad se mantiene o se renombra.

---

## 3. Plan de eliminacion definitiva (borrador - REQUIERE APROBACION)

### 3.1 Premisas
- El inventario (este archivo) esta completo y validado contra el codigo.
- El equipo confirma el objetivo de la consolidacion (p. ej. mover todo a un nuevo modelo `WorkShiftDefinition`, eliminar la entidad, o partirla en microservicio).
- Existe un plan de versionado de API (las propiedades llegan a Angular via swagger).

### 3.2 Fases sugeridas

| Fase | Accion | Riesgo |
|---|---|---|
| 0 | Mantener marcadores `// TODO-DEPRECATE:`. No hay cambios funcionales. | Nulo (estado actual). |
| 1 | Versionar la API publica (v1 actual, v2 nueva). | Bajo |
| 2 | En backend: introducir un nuevo DTO de salida sin las propiedades marcadas. Mantener los campos como `null` (no romper el contrato). | Bajo |
| 3 | Frontend migra a v2: quitar las referencias a las propiedades marcadas en sus DTOs y templates. | Medio |
| 4 | Cuando no queden consumidores en Angular: marcar los campos del backend como `[Obsolete]` (con warning de compilacion). | Bajo |
| 5 | Generar migracion EF que dropee las columnas (mantener la tabla y la entidad). | Medio (datos historicos) |
| 6 | Si la consolidacion es eliminacion total: migracion que dropea la tabla `WorkPositionSchedules` y la entidad C#. | Alto |

### 3.3 Riesgos especificos identificados
- **IDOR / multi-tenant:** los listados filtran por `CustomerId` (eliminado en `MakeWorkPositionSchedulesGlobal`); la eliminacion del filtro de cliente ya se completo.
- **Datos huerfanos:** el endpoint `WorkPositionSchedule_DeleteWithReplacement` (anadido en este ciclo) reasigna FK antes de borrar; ya mitiga el problema.
- **Migraciones historicas:** 6 designers referencian la entidad; cualquier drop requiere un snapshot regenerado.
- **Formularios con `Validators.maxLength`:** las longitudes declaradas en la entidad (Name 100, Description 250, TipoTurnoEspecial 50, ObservationsWorkShift 500) deben revisarse en el plan de consolidacion.

### 3.4 Proximos pasos sugeridos
1. Decidir el modelo destino (consolidar / partir / eliminar).
2. Si la decision es "eliminar", redactar plan formal con timeline y versionado.
3. Si la decision es "consolidar", definir el modelo `WorkShiftDefinition` objetivo y mapear las 24 propiedades actuales a las nuevas.
4. Cualquiera de las dos: ejecutar fases 1-2 del plan §3.2 antes de tocar el modelo de datos.

---

## 4. Trazabilidad

- **Marcadores colocados:** 2026-09-04 en `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/WorkPositionSchedule.cs` (header de clase + 24 lineas inline `// TODO-DEPRECATE:`).
- **Build:** `dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj` → 0 errores (cambio solo de comentarios).
- **Inventario generado:** 2026-09-04 (este archivo).
- **Skill aplicada:** read-only inventory + busqueda con `grep` para mapear todos los consumidores.
