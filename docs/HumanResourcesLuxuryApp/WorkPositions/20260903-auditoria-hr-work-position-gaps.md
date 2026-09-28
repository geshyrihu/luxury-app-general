# QA Gap Analysis - WorkPositionSchedules

## Objetivo
Evaluación destructiva de casos borde, concurrencia e integridad del módulo `WorkPositionSchedules`, identificando vulnerabilidades antes de pasar a producción.

## Matriz de Brechas (Gaps) Identificadas

### 1. TOCTOU (Time-of-Check to Time-of-Use) en Creación (Backend)
- **Proceso / Entidad**: `CreateAsync` (WorkPositionScheduleAppService)
- **Vulnerabilidad**: Posible creación de horarios duplicados (mismo nombre).
- **Causa Raíz**: El método `EnsureNameIsUniqueAsync` se ejecuta ANTES de abrir la transacción `Serializable`. En un entorno concurrente, dos requests simultáneas pueden validar la inexistencia del nombre en paralelo y ambas pasarán a la fase de inserción, rompiendo la invariante de nombres únicos.
- **Solución Propuesta**: Mover la llamada `await EnsureNameIsUniqueAsync(name, excludeId: null);` DENTRO del bloque `using var transaction = await dbContext.Database.BeginTransactionAsync(...)`.

### 2. Efecto Secundario Destructivo en DELETE Puro (Integridad Relacional)
- **Proceso / Entidad**: `DeleteAsync` (WorkPositionScheduleAppService)
- **Vulnerabilidad**: Un borrado HTTP DELETE desencadena mutaciones masivas en cascada sobre otras entidades (`JobPositions`), sin el conocimiento o intención del usuario.
- **Causa Raíz**: Si el horario tiene puestos asignados, el código silenciosamente migra todos los puestos a un horario predeterminado (`_defaultScheduleId`). Un DELETE puro no debería enmascarar una operación compleja de reasignación sin consentimiento.
- **Solución Propuesta**: Modificar `DeleteAsync` para lanzar `BusinessException` (409 Conflict) si el horario está en uso (`positions.Any()`). El usuario DEBE ser forzado a utilizar el flujo y endpoint explícito `DeleteWithReplacementAsync` provisto.

### 3. Masking de Restricciones Únicas (Concurrency)
- **Proceso / Entidad**: `UpdateAsync` (WorkPositionScheduleAppService)
- **Vulnerabilidad**: Falso positivo en mensajes de error de concurrencia.
- **Causa Raíz**: El bloque catch de concurrencia traga `EsUniqueConstraintViolation(ex)` asumiendo siempre que es un conflicto de colisión de los índices de `DiaDeTrabajo`. Si el error en realidad es porque se violó un `UniqueConstraint` del campo `Name`, el usuario recibirá "Otro usuario modificó este horario", dificultando la comprensión del problema (nombre duplicado).
- **Solución Propuesta**: Garantizar que el control de concurrencia evalúe el nombre del índice violado (por ej., verificando `ex.InnerException.Message.Contains("IX_WorkPositionSchedules_Name")`), o bien basarse estrictamente en la validación en transacción.

### 4. Bypass de Validación de Duplicidad en Matriz (Días Huérfanos/Colisiones)
- **Proceso / Entidad**: `EnsureScheduleIsConsistent` (WorkPositionScheduleAppService)
- **Vulnerabilidad**: Payload malicioso o defectuoso sortea las validaciones básicas y explota en EF.
- **Causa Raíz**: La validación exige que `dto.DiasDeTrabajo.Count == expected` (ej. 7 días para 1 semana). Sin embargo, un array con 7 objetos idénticos (ej. siete lunes) pasa la validación. Al llegar a `ReplaceDiasDeTrabajoAsync`, el diccionario intentará reemplazar, dejando al modelo inconsistente o disparando errores fatales de EF.
- **Solución Propuesta**: Requerir que la colección de días sea estrictamente un conjunto único: validar que `.Select(x => new {x.DiaSemana, x.NumeroSemanaCiclo}).Distinct().Count() == expected`.

### 5. Borrado Ciego de Días (Riesgo de Constraints)
- **Proceso / Entidad**: `DeleteAsync` (WorkPositionScheduleAppService)
- **Vulnerabilidad**: Fallo de base de datos al eliminar, dejando posibles registros huérfanos.
- **Causa Raíz**: Se invoca `.Remove(schedule)` cargando la entidad raíz SIN `.Include(x => x.DiasDeTrabajo)`. Si la base de datos no está configurada con `ON DELETE CASCADE` de forma nativa a nivel SQL, Entity Framework fallará porque desconoce a los hijos en memoria al emitir el comando.
- **Solución Propuesta**: Añadir `.Include(x => x.DiasDeTrabajo)` al recuperar el horario a borrar para asegurar el cascade en memoria, o respaldarse explícitamente en el DeleteBehaviour físico.

### 6. Turnos Nocturnos Indefinidos y Validaciones Espejo (Frontend/Backend)
- **Proceso / Entidad**: `requireBothOrNoneTimeValidator` (Frontend) y `EnsureScheduleIsConsistent` (Backend)
- **Vulnerabilidad**: El dominio no define si el sistema soporta turnos nocturnos (donde HoraSalida < HoraEntrada, por ejemplo, 18:00 a 06:00 del día siguiente).
- **Causa Raíz**: Ni el front ni el backend validan que `HoraEntrada < HoraSalida`. Si la plataforma de nómina / asistencias aguas abajo no soporta turnos cruzados (midnight overlap), la falta de esta restricción dejará pasar datos inutilizables.
- **Solución Propuesta**: Confirmar con Negocio si se soportan turnos nocturnos. Si NO se soportan, añadir validador de secuencia temporal en ambas capas (`HoraEntrada < HoraSalida`). Si SÍ se soportan, agregar tests que prueben específicamente este escenario.
