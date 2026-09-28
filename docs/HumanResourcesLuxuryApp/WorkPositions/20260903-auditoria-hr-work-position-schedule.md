# Auditoría Punta a Punta - Módulo WorkPosition y WorkPositionSchedule (2026-09-03)

## Objetivo
Análisis destructivo (QA & Arquitectura) evaluando casos borde, integridad referencial y máquinas de estado para los módulos de Puestos de Trabajo y sus Horarios (WorkPosition y WorkPositionSchedule).

## Matriz de Reglas de Negocio - 4 Niveles

| Nivel | Regla | Estado |
|---|---|---|
| **Nivel 1 (Invariantes)** | Un WorkPositionSchedule (Horario) con puestos activos no puede ser eliminado. | ✅ Cumple (Se desactiva lógicamente) |
| **Nivel 2 (Flujos/Estados)** | Un WorkPosition no puede asignarse a un horario inactivo. | ✅ Cumple (`IsActive == true` verificado en AppService) |
| **Nivel 3 (Seguridad)** | Solo roles estructurales de RRHH pueden editar sueldos actuales (`CanEditCurrentSalary`). | ✅ Cumple (Se aísla lógicamente la edición del sueldo real) |
| **Nivel 4 (Validación)** | Todo día laborable debe tener hora de entrada y salida, o ser marcado como descanso. | ❌ Brecha entre Front y Back (Ver detalle) |

## QA Gap Analysis (Matriz de Vulnerabilidades)

| Proceso / Entidad | Vulnerabilidad Encontrada | Causa Raíz | Solución Propuesta (Código/Patrón) |
|---|---|---|---|
| **Validaciones (Front vs Back)** | Posible error 400 indescifrable para el usuario al capturar horarios parciales. | En `work-position-schedule-form.ts`, el frontend infiere `esDescanso = !entrada && !salida`. Si el usuario captura solo Entrada y omite Salida, `esDescanso = false` y se envía la Salida vacía. El frontend lo da por válido (no hay `Validators.required` cruzados), pero el backend bloquea con `WORK_POSITION_SCHEDULE_DAY_WITHOUT_HOURS`. | Implementar un Validador Cruzado (Custom Validator) a nivel de `FormGroup` en Angular que invalide el formulario si hay Entrada sin Salida o viceversa, mostrando un error amigable en UI. |
| **Persistencia (Integridad)** | Re-generación de IDs huérfanos al actualizar `DiasDeTrabajo` en `WorkPositionSchedule`. | En `UpdateAsync`, el backend usa `schedule.DiasDeTrabajo.Clear()` y añade nuevas entidades con `Guid.NewGuid()`. Esto fragmenta índices, invalida referencias en memoria y depende puramente del *Cascade Delete*, perdiendo la identidad del registro original. | Modificar `ReplaceDiasDeTrabajo` para hacer un *Merge* (actualizar los existentes buscando por `DiaSemana` y `NumeroSemanaCiclo`, eliminar los sobrantes, insertar los nuevos) preservando los GUIDs. |
| **Persistencia (Cascadas)** | Riesgo de pérdida de información histórica al eliminar un `WorkPosition`. | `DeleteByIdAsync` elimina físicamente (HARD DELETE) entidades como `RequestPosition`, `RequestEmployeeRegister`, `RequestDismissal`. Un Puesto de Trabajo tiene impacto contable, histórico y de auditoría; destruirlo compromete la trazabilidad de plazas que existieron. | Implementar el patrón Soft Delete (`IsDeleted = true`, `DeletedAt`) para `WorkPosition` tal como se hace con la desactivación de horarios, previniendo orfandad en histórico de RRHH. |
| **UI (Consistencia de UX)** | Manejo de longitud máxima asimétrica entre Front y Back. | El DTO/Entidad marca que `observaciones` tiene 500 caracteres, pero la experiencia no previene al usuario ni muestra contadores. Además el nombre asume limpieza con `.Trim()` que el Front no restringe. | Sincronizar Validators (ej: `Validators.maxLength(500)`) y proveer auto-trimming en el CustomInput de Angular. |

## Conclusión y Próximos Pasos

Se identificaron brechas importantes en la validación espejo (Nivel 4) y en el manejo de persistencia e histórico (Niveles 1 y 2). 

> **IMPORTANTE**: No se ha escrito ningún código correctivo. Según el protocolo de orquestación, solicito la **aprobación explícita del usuario** sobre estas vulnerabilidades encontradas antes de proceder a generar los planes formales o scripts de ejecución (prompts Aider/KiloCode) para parchar los hallazgos.
