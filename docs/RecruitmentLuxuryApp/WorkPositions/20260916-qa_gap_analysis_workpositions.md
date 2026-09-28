# Análisis Punta a Punta (QA Gap Analysis)
**Módulo:** RecruitmentLuxuryApp / WorkPositions (Horarios 1:1)
**Fecha:** 2026-09-16

## Resumen Ejecutivo
Se ejecutó una auditoría teórica y destructiva sobre la refactorización recién implementada para aislar los `WorkPositionSchedule` a una relación 1:1 con `WorkPosition`. 

El código base actual en `WorkPositionAppService.cs` revela un alto nivel de madurez técnica, implementando `System.Data.IsolationLevel.Serializable` para blindar la creación/edición del horario de concurrencias sucias, y un uso correcto de `BusinessException` para validaciones de matriz de 28 días.

A continuación se detalla la matriz de evaluación.

## Matriz de Evaluación

| Proceso / Entidad | Vulnerabilidad Encontrada (Teórica) | Causa Raíz | Solución Propuesta (Código/Patrón) |
| :--- | :--- | :--- | :--- |
| **Integridad Relacional (Cascade Delete)** | Posible orfandad. Si se elimina físicamente o lógicamente un `WorkPosition`, el `WorkPositionSchedule` (y sus 28 `DiasDeTrabajo`) podrían quedar vivos en la BD. | La migración configuró el FK `WorkPositionId`, pero si `JobPositions` no ejecuta un borrado en cascada (Cascade Delete) en EF Core, o si el borrado de la aplicación es **Soft Delete**, la tabla de horarios seguirá acumulando basura. | Si el sistema usa *Soft Delete*, modificar `WorkPositionAppService.DeleteByIdAsync` para también cambiar el estado de `WorkPositionSchedule.IsActive = false`. Si usa *Hard Delete*, asegurar `.OnDelete(DeleteBehavior.Cascade)` en `ApplicationDbContext`. |
| **Máquina de Estado** | Se puede editar el horario de un Puesto Inactivo / Cerrado. | El método `UpdateScheduleAsync` no verifica el `workPosition.State`. Permite actualizar la jornada laboral incluso si el Puesto de Trabajo ya no está vacante o está dado de baja. | En `UpdateScheduleAsync`, agregar validación: `if (workPosition.State == State.Inactive) throw new BusinessException("No se puede alterar el horario de un puesto inactivo", ...)` |
| **Concurrencia** | (Mitigado) Doble click de submit. | N/A | El desarrollador ya implementó `IsolationLevel.Serializable`. Felicidades, no hay brecha aquí. |
| **Validaciones Espejo** | Generación de Días por Plantilla en Backend | El DTO permite inyectar 28 días arbitrarios, pero si `TipoJornada` no es `Personalizado` (ej. Matutino), el Frontend autocompleta los días. Sin embargo, el Backend confía a ciegas en el array y los guarda sin recalcular la plantilla. | En `ApplyDiasDeTrabajo`, si `TipoJornada != Personalizado`, el backend debería ignorar el array de entrada y sobreescribirlo invocando un `ScheduleTemplateBuilder.Generate(TipoJornada)`. |

> [!CAUTION]
> **Aprobación Requerida:** Nunca se implementan estos parches teóricos sin la autorización explícita. Por favor revisa las propuestas de solución y confirma si deseas que deleguemos la reparación de alguna de ellas.
