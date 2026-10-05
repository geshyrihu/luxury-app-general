# Reglas de Negocio — IncidenciasAdministrativas

Este documento describe las reglas de negocio **validadas y confirmadas** para implementación.

---

## 1. Incidencia (`IncidentAppService`)

### 1.1 Creación

- El empleado y el tipo de incidencia son **obligatorios**.
- La descripción debe tener entre **10 y 2000 caracteres**.
- La fecha y hora del incidente son **obligatorias**.
- El nivel de severidad es **obligatorio**.
- El tipo de sanción es **opcional**. Si se proporciona, se crea automáticamente un registro `Sanction` vinculado con estatus `Activa` y `AllowAppeal = true`.
- El estatus inicial siempre es **`Reportado`**.
- El campo `ReportedByUserId` se asigna al usuario autenticado en sesión.
- **Filtro de cliente:** el `customerId` se recibe como parámetro desde el frontend (`CustomerIdService`). En POST va en el cuerpo del DTO (`dto.CustomerId`); en GET va como `[FromQuery] Guid customerId`. No se usa `currentUserService.CustomerId` para este propósito.

### 1.2 Edición

- Solo se pueden editar incidencias en estatus **`Reportado`**.
- Incidencias canceladas (`IsCancelled = true`) **no son editables**.

### 1.3 Resolución

- Solo disponible para incidencias **no canceladas**.
- **Regla de tiempo:** debe haber transcurrido al menos **1 día hábil** (lunes a viernes) desde la creación del acta. No cuenta sábado ni domingo.
- Al resolver se registran: `InvestigationNotes`, `SanctionApplied`, `DecisionRationale`, `ResolutionDate`.
- El estatus final: `ResueltoSinSancion` o `ResueltoConSancion`.
- **Autorización:** usa la misma jerarquía `ApprovalRuleService` que vacaciones/permisos. ⚠️ _Pendiente definir flujo exacto (Duda C)._

### 1.4 Cancelación

- Requiere motivo (`CancellationReason`), máximo 500 caracteres.
- Una incidencia ya cancelada **no se puede cancelar de nuevo** (409).
- Las incidencias canceladas no aparecen en listados (`!x.IsCancelled`).

### 1.5 Eliminación física

- **Solo SuperUsuario** puede eliminar registros físicamente (403 para otros roles).

### 1.6 Aislamiento por cliente

- Todas las consultas de `Incident` deben filtrar por `CustomerId` del usuario en sesión.
- El global query filter de EF Core solo cubre `ISoftDeletable`, **no** `CustomerId`.

---

## 2. Testigos (`IncidentWitnessAppService`)

- **Límite máximo: 3 testigos** por incidencia. Si ya hay 3 → 400.
- **Unicidad:** no se puede registrar un testigo con la misma combinación `FullName + Phone` dentro de la misma incidencia → 409.
- Campos requeridos: `FullName`, `Position`, `Phone`, `Statement` (todos obligatorios).
- Solo visibles/editables testigos del mismo cliente (`CustomerId`).
- Testigos de incidencias canceladas no son visibles.

---

## 3. Adjuntos (`IncidentAttachmentAppService`)

- Tipos permitidos: **JPG, PNG, PDF**.
- Tamaño máximo por archivo: **2 MB**.
- Límite máximo por incidencia: **10 archivos**.
- **Al eliminar:** se borra el registro en BD **y** el archivo físico del disco.
- Solo visibles/eliminables adjuntos del mismo cliente (`CustomerId`).

---

## 4. Días de Suspensión (`SuspensionDayAppService`)

- Se vinculan a una incidencia existente. Si no existe → 404.
- Se registran en bulk (varios días a la vez).
- Fechas normalizadas a medianoche antes de persistir.

### Validaciones de negocio (NUEVAS / CONFIRMADAS)

| Regla                     | Descripción                                                                         | Código HTTP |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------- |
| Sin lunes                 | No se puede aplicar suspensión en **lunes** (`DayOfWeek.Monday`)                    | 400         |
| Sin sábado                | No se puede aplicar suspensión en **sábado** (`DayOfWeek.Saturday`)                 | 400         |
| Sin días consecutivos     | Cuando se registran **más de 1 día**, ninguno puede ser consecutivo al otro         | 400         |
| Sin duplicados en request | Fechas repetidas dentro del mismo request                                           | 400         |
| Sin duplicados en BD      | Fechas ya registradas para esa incidencia                                           | 409         |
| Máximo 8 días             | El total acumulado (existentes + nuevos) no puede superar **8 días** por incidencia | 400         |

### Catálogo de sanciones con suspensión (referencia)

- Suspensión tipo 1 → **0 días** (amonestación, sin días)
- Suspensión tipo 2 → **1–3 días**
- Suspensión tipo 3 → **4–8 días**

---

## 5. Sanciones (`SanctionAppService`)

### 5.1 Flujo único de creación

- **Solo existe un camino:** la sanción se crea **automáticamente** en `IncidentAppService.AddAsync` cuando el usuario selecciona un `SanctionTypeId` al crear la incidencia.
- El endpoint `SanctionAppService.AddAsync` (manual) se **elimina** para evitar duplicados.
- Una sola sanción por incidencia (validado con `AnyAsync` → 409 si ya existe).
- `AllowAppeal = true`, estatus inicial `Activa`, `AppliedByUserId` y `AppliedDate` asignados por servidor.
- Se dispara notificación `ISanctionNotificationService.NotifySanctionAppliedAsync` al crear.

### 5.2 Cambio de estatus

- Al marcar como `Cumplida` se registra `CompletedDate = UTC ahora`.
- Las notas internas se acumulan (no se reemplazan).

### 5.3 Eliminación

- Usa jerarquía `ApprovalRuleService` para validar si el usuario puede eliminar. ⚠️ _Pendiente definir detalle (Duda C)._

### 5.4 Sanciones por vencer

- Consulta sanciones `Activa` con `EffectiveEndDate` dentro de N días (parámetro).

---

## 6. Tipos de Incidencia (`IncidentTypeAppService`)

- Scoped por cliente (`CustomerId`).
- Se pueden activar/desactivar. Solo se muestran activos en el formulario.
- **Eliminación bloqueada** si el tipo ya fue usado en alguna incidencia (`Incident` con ese `IncidentTypeId` existe → 409).

---

## 7. Generación y Gestión del Acta Administrativa

### Flujo definido (3 acciones):

| Acción                 | Endpoint                      | Comportamiento                                                                                                                                  |
| ---------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Descargar Acta**     | `GET {id}/generate-act`       | Genera PDF con QuestPDF, lo persiste en disco, marca `IsActGenerated = true`, guarda ruta en `AdministrativeActPdfPath` y lo descarga.          |
| **Subir Acta Firmada** | `POST {id}/upload-signed-act` | Recibe el PDF escaneado/firmado, lo guarda en disco reemplazando el anterior, marca `IsActGenerated = true`, guarda `AdministrativeActPdfPath`. |
| **Ver Acta Firmada**   | `GET {id}/signed-act`         | Devuelve el PDF firmado almacenado en disco para visualizar en el visor. Solo disponible si `IsActGenerated = true`.                            |

- El nombre del archivo descargado usa **nombre del empleado + fecha del incidente**: `acta-{nombre-slug}-{DD-MM-YYYY}.pdf`.
- La URL de lectura del acta se construye con `IFileReadPathService.GetIncidentAttachmentFilePath` y se devuelve en `IncidentListDTO.AdministrativeActPdfUrl`.
- El botón **"Ver Acta"** solo aparece en el listado cuando `isActGenerated === true && administrativeActPdfUrl` tiene valor.
- El acta firmada se puede **reemplazar**: subir uno nuevo borra el anterior del disco.
- ⚠️ **Pendiente (Duda C):** ¿Solo ciertos estatus pueden generar/subir el acta?

---

## 8. Autorización — `ApprovalRuleService` ⚠️ PENDIENTE (Duda C)

Se usará la misma jerarquía que vacaciones/permisos para:

- Quién puede resolver incidencias
- Quién puede eliminar sanciones

Flujo exacto a definir en sesión separada.

---

---

## 9. Expediente del Empleado — Especificación

### 9.1 Componente 1 — Listado de Empleados (`employee-file-list`)

**Ruta:** `hr/employee-files` (lazy, `canActivate: [authGuard]`)

**Propósito:** Punto de entrada al módulo de expedientes. Permite filtrar empleados del cliente activo y navegar al expediente individual.

**Filtros disponibles:**

| Filtro   | Tipo                | Descripción                        |
| -------- | ------------------- | ---------------------------------- |
| Estatus  | Select (radio)      | Todos / Activos / Inactivos        |
| Búsqueda | Text (globalFilter) | Nombre, número de empleado, puesto |

**Columnas de la tabla:**

| Columna      | Campo                                           |
| ------------ | ----------------------------------------------- |
| Nombre       | `user.fullName`                                 |
| No. Empleado | `numberEmployee`                                |
| Puesto       | `workPosition.applicationRole.displayName`      |
| Departamento | `workPosition.applicationRole.departament`      |
| Estatus      | `isActive` (badge Verde/Rojo)                   |
| Acciones     | Botón "Ver Expediente" → navega al componente 2 |

**Datos del backend:**

- Endpoint: `GET hr/employee-files?customerId={id}&isActive={bool|null}`
- DTO: `EmployeeFileSummaryDTO` (id, fullName, numberEmployee, puesto, departamento, isActive)
- Filtro de cliente: `[FromQuery] Guid customerId` (patrón estándar)

**Navegación:** el botón "Ver Expediente" navega a `hr/employee-files/{employeeId}` usando `RouterLink` o `Router.navigate`.

---

### 9.2 Componente 2 — Expediente Completo (`employee-file-detail`)

**Ruta:** `hr/employee-files/:employeeId`

**Propósito:** Vista unificada de toda la información relacionada al empleado, organizada en pestañas (`p-tabs`).

**Cabecera fija (siempre visible):**

- Foto / avatar del empleado
- Nombre completo, No. Empleado, Puesto, Departamento
- Badge de estatus (Activo / Inactivo)

**Pestañas y contenido:**

| Tab | Título                              | Entidad / Datos                                                                                                        |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **Datos Personales**                | `ApplicationUser` (nombre, email, teléfono) + `PersonData` (CURP, RFC, NSS, fecha nacimiento, estado civil, dirección) |
| 2   | **Datos de Contacto de Emergencia** | `EmployeeEmergencyContact[]` (nombre, parentesco, teléfono)                                                            |
| 3   | **Datos Clínicos**                  | `EmployeeClinicalData` (tipo de sangre, alergias, enfermedades, discapacidad)                                          |
| 4   | **Datos Bancarios**                 | `EmployeeBankData` (banco, CLABE, número de cuenta)                                                                    |
| 5   | **Contratos**                       | `WorkContract[]` (tipo, fecha inicio/fin, salario, estatus)                                                            |
| 6   | **Posición y Salario**              | `WorkPosition` actual + historial `RequestSalaryModification[]`                                                        |
| 7   | **Vacaciones y Permisos**           | `VacationRequest[]` + `LeaveRequest[]` (fechas, estatus, días)                                                         |
| 8   | **Incidencias**                     | `Incident[]` con sanciones asociadas (`Sanction`) — solo lectura, badge de estatus                                     |
| 9   | **Evaluaciones**                    | `PerformanceEvaluation[]` (periodo, calificación, resultado)                                                           |
| 10  | **Solicitudes**                     | `RequestEmployeeRegister` (alta) + `RequestDismissal` (baja)                                                           |

**Reglas de visualización:**

- Todos los datos son **solo lectura** en esta vista — el expediente es consultivo.
- Las pestañas cargan sus datos **bajo demanda** (lazy per tab) para no sobrecargar la primera carga.
- Cada pestaña muestra un estado vacío descriptivo si no hay datos ("Sin contratos registrados", etc.).
- Filtro de cliente en todos los endpoints: `customerId` del `CustomerIdService`.

**Endpoints necesarios (nuevo controlador `EmployeeFileController`):**

```
GET hr/employee-files?customerId={id}&isActive={bool}     → lista resumen
GET hr/employee-files/{employeeId}/summary                → cabecera (datos básicos)
GET hr/employee-files/{employeeId}/personal-data          → Tab 1
GET hr/employee-files/{employeeId}/emergency-contacts     → Tab 2
GET hr/employee-files/{employeeId}/clinical-data          → Tab 3
GET hr/employee-files/{employeeId}/bank-data              → Tab 4
GET hr/employee-files/{employeeId}/contracts              → Tab 5
GET hr/employee-files/{employeeId}/work-position          → Tab 6
GET hr/employee-files/{employeeId}/vacations-leaves       → Tab 7
GET hr/employee-files/{employeeId}/incidents              → Tab 8
GET hr/employee-files/{employeeId}/evaluations            → Tab 9
GET hr/employee-files/{employeeId}/requests               → Tab 10
```

---

## Plan de Implementación

### Backend (en orden de ejecución)

1. **`SuspensionDayAppService.AddBulkAsync`** — agregar validaciones: sin lunes/sábado, sin consecutivos, máximo 8 total
2. **`IncidentWitnessAppService.AddAsync`** — máximo 3, unicidad FullName+Phone
3. **`IncidentAttachmentAppService.DeleteAsync`** — borrar archivo físico del disco al eliminar
4. **`IncidentTypeAppService.DeleteAsync`** — bloquear si tiene incidencias asociadas
5. **`IncidentAppService`** — agregar filtro CustomerId en todos los listados; corregir validación a 1 día hábil
6. **`IncidentAppService.AddAsync`** — eliminar endpoint manual de `SanctionAppService.AddAsync`; mantener solo el flujo automático
7. **`IncidentController`** — nuevo endpoint `POST {id}/upload-signed-act` y `GET {id}/signed-act`
8. **`IncidentPdfService`** — nuevo método `SaveSignedActAsync(Guid incidentId, IFormFile file)`

### Frontend (en orden de ejecución)

9. **`suspension-days-manager.ts`** — validar lunes/sábado y días consecutivos antes de enviar
10. **`incident-list.html/.ts`** — reemplazar "Generar Acta" por "Subir Acta"; agregar "Ver Acta" solo si `isActGenerated`
11. **`employee-file-list.ts`** — listado de empleados con filtros activo/inactivo + búsqueda + botón navegación
12. **`employee-file-detail.ts`** — expediente completo con 10 pestañas, carga lazy por pestaña, cabecera fija
