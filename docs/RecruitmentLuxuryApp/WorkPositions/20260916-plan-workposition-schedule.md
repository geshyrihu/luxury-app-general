# Migración de WorkPositionSchedule a Modelo Propio (Relación 1:1)

**Fecha:** 2026-09-16
**Módulo:** RecruitmentLuxuryApp / WorkPositions
**Objetivo:** Eliminar la dependencia del catálogo global de horarios y asegurar que cada `WorkPosition` posea su propio `WorkPositionSchedule`, respetando las convenciones del sistema (`CONVENTIONS.md`).

---

> **Actualización 2026-09-24 (auditoría `20260924-auditoria-reclutamiento-work-positions.md`):** el dueño del módulo confirmó que el horario es **1:1 con el puesto** y que el catálogo está **deprecado**. Los pasos 1.1, 1.2 y 1.3 estaban marcados como hechos pero **no lo están**: `WorkPositionSchedule` conserva `HashSet<WorkPosition> WorkPositions`, la configuración lo relaciona uno-a-muchos con `DeleteBehavior.Restrict`, no hay índice único y la migración `20260916211954_WorkPositionScheduleOneToOne` solo agregó `CycleWeeksDuration` y `Description` (sin SQL de clonado). Se desmarcan y pasan a **ACC-017** de la auditoría, planificado en el plan `20260924-remediacion-reclutamiento-work-positions.md` (Fase 1) y el plan propio de ACC-017 (Fase 2). Los pasos 2.x y 3.x conservan su estado; el 2.3 queda incompleto mientras los DTOs de alta/edición sigan aceptando `WorkPositionScheduleId`.

## Fase 1: Modificación de Entidades y Creación de Migración

- [ ] **1.1. Modificar `WorkPositionSchedule.cs`:**
  - Agregar la propiedad `public Guid WorkPositionId { get; set; }`.
  - Reemplazar `HashSet<WorkPosition> WorkPositions` por `public WorkPosition WorkPosition { get; set; }`.
  - Evaluar/Eliminar anotaciones de validación irrelevantes para un modelo "propio" (ej. `Name` podría pasar a no requerido o eliminarse si se acuerda).
- [ ] **1.2. Modificar `WorkPosition.cs`:**
  - Eliminar o ajustar la clave foránea. Si `WorkPositionId` está en el Schedule, aquí se cambia a una navegación inversa `public WorkPositionSchedule WorkPositionSchedule { get; set; }`.
- [ ] **1.3. Generar Migración EF Core:**
  - Ejecutar el comando para crear la migración (ej. `dotnet ef migrations add WorkPositionScheduleOneToOne`).
  - **CRÍTICO:** Editar la migración manualmente e inyectar `migrationBuilder.Sql(...)` para **clonar** los horarios existentes y asignarlos a cada `WorkPosition` (Data Migration Protocol).

## Fase 2: Refactorización Backend (Application Layer)

- [x] **2.1. Eliminar Catálogo Obsoleto:**
  - Eliminar por completo el módulo backend `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules` (Endpoints, AppService, DTOs).
- [x] **2.2. Actualizar `WorkPositionEndPoints.cs`:**
  - Agregar endpoints para gestionar el horario dentro de `RecruitmentLuxuryApp/WorkPositions`:
    - `GET api/work-positions/{id:guid}/schedule`
    - `PUT api/work-positions/{id:guid}/schedule`
- [x] **2.3. Actualizar `IWorkPositionAppService` y DTOs:**
  - Implementar la lógica para crear, leer y actualizar el horario y sus `DiasDeTrabajo` asociados a un `WorkPosition`.
- [x] **2.4. Compilación y Pruebas Unitarias:**
  - Asegurar que el proyecto compila (`dotnet build`).
  - Corregir cualquier servicio o test roto por la eliminación del catálogo.

## Fase 3: Refactorización Frontend (Angular Layer)

- [x] **3.1. Eliminar Módulo Frontend Obsoleto:**
  - Borrar `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule`.
  - Quitar sus referencias en el routing.
- [x] **3.2. Actualizar DTOs y Servicios Frontend:**
  - Modificar `WorkPositionService.ts` agregando `getSchedule(workPositionId)` y `updateSchedule(workPositionId, payload)`.
- [ ] **3.3. Integrar UI en WorkPositions:**
  - Dentro de `recruitment.luxuryapp/work-positions`, integrar el formulario del horario.
  - Se recomienda usar una pestaña (Tab) en el modo "Edición" (for-edit) o embeberlo directamente.
  - Asegurarse de seguir las reglas de UI Desktop/Mobile (`CONVENTIONS.md`).

## Fase 4: Auditoría y Verificación Punta a Punta

- [ ] **4.1. Verificación de Reglas de Negocio (RN):**
  - Comprobar que los Días de Trabajo se generan correctamente basados en el `TipoJornada`.
- [ ] **4.2. Ejecutar Sello de Calidad Baseline:**
  - Correr `npm run lint` en el frontend y actualizar baseline si hay violaciones intencionales reparadas, sin introducir violaciones nuevas.
- [ ] **4.3. Prueba Funcional Completa:**
  - Crear un puesto de trabajo nuevo y asignarle un horario personalizado.
  - Editar el puesto y cambiar el horario. Verificar aislamiento de datos en la BD.
