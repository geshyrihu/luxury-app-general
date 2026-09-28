# Registro de Requerimientos y Reglas de Negocio (LuxuryApp)

Este documento rastrea las reglas de negocio, requerimientos y bugs identificados. 
Operamos en **Modo Estricto**: cada solicitud debe quedar perfectamente definida antes de ser enviada a ejecución. Una vez que el lote esté listo, el agente ejecutor lo procesará y validará contra estas reglas.

## 1. Reglas de Negocio Definidas

### 1.1 Responsabilidades y Límites Operativos
**Roles Involucrados:** `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`.

**Permisos (Lo que Operaciones SÍ puede hacer):**
- Crear un Puesto de Trabajo (`WorkPosition`).
- Crear/Modificar la Descripción del Puesto de Trabajo.
- Configurar los horarios y prestaciones que ofrece el cliente para ese puesto.
- Solicitar la Baja de un empleado activo vinculado a un puesto.
- Solicitar la Modificación de Salario de un empleado activo.

**Restricciones e Informativo (Exclusivo de Reclutamiento/RRHH):**
- **Registro y Alta:** Reclutamiento se encarga de registrar formalmente al empleado.
- **Automatización de Accesos:** Al momento de registrarse como empleado (cubriendo una vacante activa), el sistema envía automáticamente las credenciales de LuxuryApp vía Email y WhatsApp.
- **Documentación:** La recaudación y validación del expediente de documentos la realiza única y exclusivamente Reclutamiento.

---

## 2. Backlog de Tareas y Bugs (Pendientes de Ejecución)

### 2.3 Implementación de Auditoría en WorkPosition
**Tipo:** Backend / Seguridad y Trazabilidad
**Descripción:** Implementar la interfaz `IAuditable` (o su equivalente en la arquitectura del proyecto) en la entidad `WorkPosition.cs`.
**Requerimientos Estrictos:**
- Modificar la firma de la entidad para heredar/implementar la interfaz de auditoría.
- Asegurar que la tabla rastree automáticamente fechas y usuarios responsables de creación y modificación (`CreatedBy`, `CreatedAt`, `ModifiedBy`, etc.).
- Incluir estas nuevas columnas en la planeación de la migración de Entity Framework.

### 2.4 Aislamiento Estricto de Dominios (Reclutamiento vs Recursos Humanos)
**Tipo:** Arquitectura Frontend / Validación
**Descripción:** Programar un mecanismo de verificación (script o regla de Linter) para garantizar que no exista acoplamiento entre los módulos de RRHH y Reclutamiento.
**Requerimientos Estrictos:**
- Los archivos dentro de `apps/reclutamiento.luxuryapp` tienen **prohibido** importar componentes, servicios o modelos de `apps/recursos-humanos.luxuryapp`.
- De manera recíproca, `apps/recursos-humanos.luxuryapp` no puede consumir nada de `apps/reclutamiento.luxuryapp`.
- Si ambos módulos requieren el mismo componente (ej. un modal o UI específica), este debe moverse a un módulo neutral o `shared`, nunca cruzarse entre dominios.
*(Estatus: Documentado y en espera de ejecución).*

### 2.5 Automatización: Creación de Vacante por Solicitud de Baja
**Tipo:** Backend / Regla de Negocio (Domain Event)
**Descripción:** Al generarse/ejecutarse una Solicitud de Baja, el sistema debe crear en automático una Solicitud de Vacante (`RequestPosition`) para cubrir ese hueco.
**Requerimientos Estrictos:**
- Interceptar la creación de la Solicitud de Baja en el servidor.
- Leer el `WorkPosition` actual del empleado al que se le aplicará la baja.
- Disparar la creación de una `RequestPosition` para ese mismo puesto, dejándola en estatus inicial (ej. "Pendiente").
- Toda esta transacción debe ocurrir en el Backend, garantizando que RRHH o Reclutamiento sean notificados de inmediato sobre la necesidad de reemplazo.

### 2.6 Notificaciones y Evaluaciones de Renovación de Contrato
**Tipo:** Backend / Base de Datos y Tareas Programadas (Hangfire)
**Descripción:** Al acercarse la fecha de fin de contrato, el sistema alertará y exigirá a Operaciones que evalúe al empleado para decidir su renovación.
**Requerimientos Estrictos y Reglas de Negocio:**
- **Entidad Dedicada:** Crear `ContractRenewalEvaluation` para llevar el control del ciclo, vinculada a una `PerformanceEvaluation` (Evaluación de desempeño existente).
- **R1 (Obligatoriedad):** Operaciones está OBLIGADA a completar el cuestionario de evaluación en su totalidad antes de poder registrar una decisión formal de renovación.
- **R2 (Toma de Decisión):** Operaciones toma la decisión final (Renovar / No Renovar). Reclutamiento y RRHH reciben notificaciones para dar seguimiento administrativo.
  - *TODO Pendiente:* Si la decisión es "No Renovar", se deberá enlazar posteriormente con la creación automática de una Solicitud de Baja (se implementará cuando se aborde el módulo de bajas).
- **R3 (Notificaciones):** Usar un Job diario (Hangfire) para alertar a los 30, 15 y 5 días vía Email e In-App. 
  - *TODO Pendiente:* WhatsApp queda descartado temporalmente hasta tener las plantillas aprobadas.
*(Estatus: Definición completa - En ejecución).*

### 2.7 Regularización Retroactiva: Asignación de Roles y Accesos (Herramientas Dev)
**Tipo:** Backend Script / Herramienta Interna (Dev Tools)
**Descripción:** Construir un método ejecutable manualmente para actualizar a los empleados históricos que no pasaron por la nueva automatización de alta.
**Requerimientos Estrictos:**
- **Criterio de Procesamiento:** El script solo debe procesar Empleados que estén `Activos`, que cubran un `WorkPosition` `Activo`, y cuyo `Customer` asociado también esté `Activo`.
- **Acciones:** Para cada empleado que cumpla el criterio, el sistema deberá:
  1. Asignar su Rol en sistema (`ApplicationRole`) basándose en su puesto de trabajo.
  2. Otorgarle los permisos de acceso al cliente (`AccessCustomer`) correspondiente a su puesto.
- **Ubicación Arquitectónica:** 
  - Backend: `AdminLuxuryApp/Infraestructura/UpdateDataBase/`
  - Frontend: `admin.luxuryapp/herramientas-dev/update-data-base`

### 2.9 Refactorización de Generación de Folios (`WorkPosition.Folio`)
**Tipo:** Backend / Refactor de Lógica de Negocio
**Descripción:** Identificar el mecanismo actual de generación de la propiedad `Folio` en los puestos de trabajo y actualizarlo a un nuevo estándar de codificación.
**Requerimientos Estrictos:**
- **Auditoría Inicial:** Rastrear cómo y dónde se asigna actualmente `WorkPosition.Folio` (ApplicationService, Dominio o BD).
- **Implementación del Nuevo Estándar:** Modificar la lógica para que siga el nuevo formato corporativo (por definir).
- **Protección Histórica:** Garantizar que la refactorización aplique únicamente para los nuevos registros, respetando la nomenclatura de los folios generados históricamente en la base de datos para no romper dependencias visuales o documentales.
*(Estatus: Documentado - Pendiente de confirmación del nuevo formato a utilizar).*

### 2.10 Identificador Visual de Color para Roles (`ApplicationRole`)
**Tipo:** Backend / Extensión de Entidad (Identity)
**Descripción:** Extender la entidad `ApplicationRole` (que hereda de `IdentityRole`) para agregar una propiedad que permita colorear y agrupar visualmente los roles en la interfaz.
**Requerimientos Estrictos:**
- **Nueva Propiedad:** Añadir un campo (enum o string, según convenga para la paleta de diseño) destinado a almacenar el código de color (hexadecimal o clase CSS).
- **Lógica Semántica:** La asignación de este color debe tomar en consideración las propiedades existentes `RoleType` y `Departament`, para que visualmente haya coherencia (ej. todos los roles de Mantenimiento comparten una gama, o los de nivel Directivo destacan con un color específico).
- **Migración de Base de Datos:** Generar y aplicar la migración de EF Core para actualizar la tabla base de los roles.
- **DTOs:** Exponer esta nueva propiedad hacia Angular para inyectarla dinámicamente en las etiquetas y organigramas.
*(Estatus: Documentado y en espera de ejecución).*

---

## 3. Completado

### 2.1 Restricción de Edición: Sueldo Actual (Operaciones)
**Tipo:** Modificación UI / Seguridad de Formulario
**Descripción:** En el formulario "Editar Puesto" del lado de Operaciones, la propiedad **"Sueldo Actual"** debe configurarse como **solo lectura (read-only)**.
**Regla de Negocio:** Refuerza la regla 1.1; Operaciones no puede editar salarios directamente, deben usar el flujo de "Solicitud de Modificación de Salario".
**Implementación:**
- Frontend (`work-position-form.html`): el control de "Sueldo Actual" pasó de `[readonly]` a `[disabled]="!canEditCurrentSalary()"`, para que además de verse bloqueado visualmente, Angular lo excluya de `form.value` y no se envíe en el submit para roles de Operaciones. "Sueldo Presupuestado" (`sueldoBase`) permanece editable para todos, sin cambios.
- Backend (`WorkPositionAppService.cs`): se inyectó `ICurrentUserService` y se agregó `CanEditCurrentSalary()`, que solo autoriza a `SuperUsuario` y `RecursosHumanos`. La asignación de `employee.Salary = DTO.Sueldo` en `AddAsync` y `UpdateAsync` ahora está condicionada a ese chequeo, ignorando el valor enviado por cualquier otro rol sin depender del bloqueo del cliente.
*(Estatus: Completado — 2026-08-30. Detalle técnico en `reporte-codex.md`).*

### 2.2 Migración Estructural: Horarios de Trabajo (WorkPosition)
**Tipo:** Refactor de Base de Datos / EF Core
**Descripción:** Planear y ejecutar una migración controlada sobre `WorkPosition.cs`.
**Requerimientos Estrictos:**
1. **Extracción:** Sacar todas las propiedades de "horas de trabajo" de `WorkPosition` y pasarlas a una nueva entidad independiente (ej. `WorkPositionSchedule`).
2. **Relación:** Establecer una relación estricta de uno-a-uno (1:1) entre `WorkPosition` y la nueva entidad de horarios.
3. **Escalabilidad (Turnos Especiales):** La nueva entidad debe estar estructuralmente preparada para configurar jornadas operativas especiales o atípicas, manejando esquemas literales como "24x24", "12x12", "12x36" u otras configuraciones de seguridad/operación.
**Implementación:**
- Puntos 1 y 2 (extracción a `WorkPositionSchedule` y relación 1:1 con `WorkPosition`) ya estaban resueltos en una migración previa (`RefactorWorkPositionAndRoles` / `RemoveObsoleteWorkSchedule` / `DropLegacyScheduleColumnsFromWorkPosition`).
- Punto 3 (exclusión mutua Turno Fijo vs. Turno Especial) se cerró en esta pasada:
  - Frontend (`work-position-schedule-form.ts`/`.html`): señal `isSpecialShift` derivada de `tipoTurnoEspecial.valueChanges` (via signal espejo, ya que un `FormControl` no es un signal); al elegir un turno especial se limpian los 14 controles de día (`resetDayControls()`) y el grid de días se oculta con `@if (!isSpecialShift())`.
  - Backend (`WorkPositionScheduleAppService.cs`): `NormalizeSpecialShiftDays(dto)` fuerza a `null` las 14 propiedades de día cuando `TipoTurnoEspecial` no viene vacío, ejecutándose en `CreateAsync` y `UpdateAsync` antes de persistir. `EnsureScheduleHasUsableHours` se ajustó para no exigir "al menos un día" cuando es turno especial (si no, guardar un 24x24 habría fallado siempre).
*(Estatus: Completado — 2026-08-30. Detalle técnico en `reporte-codex.md`).*

### 2.8 Reclutamiento: Pool de Talento de Empleados Inactivos (Reingresos)
**Tipo:** Nueva Funcionalidad (Fullstack)
**Descripción:** Crear una vista en Reclutamiento dedicada a explorar a los ex-empleados (inactivos) para facilitar flujos de reingreso.
**Requerimientos Estrictos:**
- **Listado y Filtros:** Tabla de empleados inactivos con capacidad de filtrado general y filtrado específico por `Customer` (Cliente).
- **Consulta de Expediente:** Acceso directo para visualizar el expediente histórico del empleado desde esta pantalla.
- **Flujo de Postulación (Reingreso):** Botón de "Postular" que ejecute la siguiente lógica:
  1. Buscar si el exempleado ya tiene un registro en la tabla `Candidates`. Si no existe, crearlo heredando sus datos del perfil de empleado.
  2. Conectar el registro del candidato con el modal de agendamiento para vincularlo a una vacante activa y generarle una entrevista.
**Implementación:**
- Ya existía casi completa al iniciar esta tarea (backend: `CandidateAppService.GetFormerEmployeesAsync` + `EnsureCandidateFromFormerEmployeeAsync`; frontend: `former-employee-talent-pool` ya montado en `candidates.routing.ts` bajo `former-employees`). Se auditó contra los 3 requerimientos estrictos y solo faltaba la confirmación explícita antes de postular.
- **Listado y filtros:** `GetFormerEmployeesAsync` filtra por `!User.Active`, admite `customerId` opcional y búsqueda libre (`pagination.Filter`) sobre nombre, email, teléfono, cliente, folio y puesto; el front pagina con `p-table` y expone un `customerControl` con "Todos los clientes".
- **Consulta de expediente:** en vez de cruzar hacia `recursos-humanos.luxuryapp` (prohibido por la regla 2.4 de aislamiento de dominios), "Ver candidato" abre `CandidateDetail` — la ficha ya vive en el dominio de Reclutamiento, evitando el acoplamiento cruzado.
- **Postulación:** `onPostulate` ahora pide confirmación con `Swal.fire` (patrón ya usado en `candidate-application-list.ts`) antes de llamar a `ensureCandidate` (`POST recruitment-candidates/former-employees/{employeeId}/ensure-candidate`), que crea o reutiliza el `Candidate` (`IsInTalentPool = true`, dedup por email/teléfono normalizados) y abre `CandidateProcessHiringModal` con el `candidateId` resultante para vincularlo a una vacante.
*(Estatus: Completado — 2026-08-30. Detalle técnico y rutas en `reporte-codex.md`).*
