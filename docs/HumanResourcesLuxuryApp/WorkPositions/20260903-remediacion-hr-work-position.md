# Plan de Implementación - Remediación WorkPosition y Horarios

**Fecha**: 2026-09-03
**Módulo**: WorkPosition / WorkPositionSchedule
**Contexto**: Hallazgos aprobados de la auditoría punta a punta (../../../docs/HumanResourcesLuxuryApp/WorkPositions/20260903-auditoria-hr-work-position-schedule.md)

## 1. Remediación Frontend (Angular)

**Archivos afectados:**
- `client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.ts`
- `client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-form.html`

**Cambios a implementar:**
1. Crear un Custom Validator sincrónico en Angular llamado `requireBothOrNoneTimeValidator` (o implementarlo inline en el componente) que valide pares de controles: `lunesEntrada`/`lunesSalida`, `martesEntrada`/`martesSalida`, etc.
2. Si para un día el usuario ingresa la hora de entrada, DEBE ingresar la de salida (y viceversa). Si ambos están vacíos, es válido (día de descanso).
3. Aplicar el validador a nivel del `FormGroup` general.
4. En el HTML (`work-position-schedule-form.html`), exponer un mensaje de validación si este error a nivel de grupo se dispara, indicando: *"Para los días laborables, debes capturar tanto la hora de entrada como la de salida."*

## 2. Remediación Backend (C# / EF Core)

### Tarea A: Refactor de `ReplaceDiasDeTrabajo` (Merge vs Recreate)

**Archivo:**
- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule/Services/WorkPositionScheduleAppService.cs`

**Cambios a implementar:**
1. Reemplazar la lógica de `ReplaceDiasDeTrabajo` que actualmente hace `schedule.DiasDeTrabajo.Clear()` por un patrón de **Merge**.
2. Buscar en `schedule.DiasDeTrabajo` si ya existe un elemento que coincida en `DiaSemana` y `NumeroSemanaCiclo`.
3. Si existe, actualizar sus horas (`HoraEntrada`, `HoraSalida`, `EsDescanso`).
4. Si no existe, agregarlo con un nuevo `Guid.NewGuid()`.
5. Eliminar aquellos elementos previos de la lista que no hayan venido en el nuevo DTO.
6. Esto evitará fragmentación de índices y re-generación masiva de IDs en la tabla hija.

### Tarea B: Soft Delete para WorkPosition (Evitar Hard Delete histórico)

**Archivos:**
- `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/Services/WorkPositionAppService.cs`
- Entidades relacionadas si aplica interfaz `ISoftDelete` o ajuste en el enum de `State`.

**Cambios a implementar:**
1. En `DeleteByIdAsync`, eliminar el código que ejecuta `dbContext.WorkPosition.Remove(entity)` y que borra las entidades asociadas de RRHH (Requests, Dismissals, etc.).
2. Reemplazarlo por una baja lógica. Se debe inspeccionar el Enum `State` usado en `ActivateAsync` (probablemente `State.Inactivo` o equivalente).
3. Actualizar el estado de la entidad a inactivo/baja, y desasignar el `EmployeeId` (si existe y si el negocio requiere liberar al empleado de la plaza cancelada), o aplicar el estándar de SoftDelete del proyecto (ej: interfaz `ISoftDelete`).
4. Guardar cambios y retornar éxito indicando: *"El puesto de trabajo ha sido desactivado/cancelado para preservar el historial."*
5. Remover el código destructor de RequestDismissal, RequestSalaryModification, etc. (la historia de la plaza debe vivir para trazabilidad).

## 3. Criterios de Aceptación (Verificación)

- [ ] **Front**: Al llenar solo "Entrada" un Lunes, el botón "Guardar" debe estar deshabilitado o arrojar un error de validación en pantalla, evitando un HTTP 400.
- [ ] **Back (Merge)**: Modificar el horario un par de veces no debe incrementar masivamente el salto de identificadores/filas (los IDs originales se preservan).
- [ ] **Back (SoftDelete)**: Al eliminar un `WorkPosition` con historial de contratación, no debe fallar ni borrar los requests previos, simplemente debe pasar a estado Inactivo/Baja.
