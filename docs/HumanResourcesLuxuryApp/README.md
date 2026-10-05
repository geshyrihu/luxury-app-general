# RecursosHumanos (Modulo Central RH)

> **Area:** RH / Recursos Humanos
> **Ultima actualizacion:** `2026-06-25`

Modulo integral de RH con aprobaciones, contratos, evaluaciones, incidencias, nominas y mas.

---

## Submodulos

### VacationRequestApproval (`api/vacation-request-approvals`)
Aprobacion/rechazo/cancelacion de solicitudes de vacaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `` | Listar (filtrado por alcance) |
| `GET` | `history` | Historial |
| `GET` | `{id}/detail` | Detalle |
| `PUT` | `{id}/approve` | Aprobar |
| `PUT` | `{id}/reject` | Rechazar (requiere motivo) |
| `PUT` | `{id}/cancel` | Cancelar (solo Approved) |
| `GET` | `calendar-events/{year}/{customerId}` | Eventos calendario |
| `GET` | `{employeeId}/balance` | Saldo empleado |
| `GET` | `{employeeId}/balance-by-year` | Saldo por ano |
| `GET` | `{employeeId}/available-years` | Anos disponibles |
| `GET` | `overlapping-requests` | Solicitudes traslapadas |

**Reglas:** Aprobador solo ve empleados de su alcance (`IApprovalRuleService`). No auto-aprobacion.

### MyLeaveRequests (`api/my-leave-requests`)
Solicitudes de permiso del empleado actual. CRUD con `multipart/form-data`.

### LeaveRequestApproval (`api/leave-request-approvals`)
Aprobacion/rechazo/cancelacion de permisos. Misma estructura que vacaciones.

### WorkContract (`api/hr/work-contracts`)
Contratos laborales con templates HTML y addendums.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `` | Listar |
| `GET` | `by-employee/{employeeId}` | Por empleado |
| `GET` | `{id}` | Detalle |
| `POST` | `` | Crear |
| `PUT` | `{id}` | Actualizar |
| `PATCH` | `{id}/terminate` | Terminar |
| `DELETE` | `{id}` | Eliminar (soft) |
| `GET` | `expiring/{days}` | Proximos a vencer |

### ContractTemplate (`api/hr/contract-templates`)
Plantillas de contratos con renderizado previo y toggle activo.

### ContractAddendum (`api/hr/contract-addendums`)
Addendums a contratos con firma y cancelacion. Estados: Draft, Pending, Signed, Cancelled.

### AddendumTemplate (`api/hr/addendum-templates`)
Plantillas de addendums.

### EmployeeClinicalData (`api/EmployeeClinicalData`)
Datos clinicos de empleados. CRUD.

### EmployeeBankData (`api/EmployeeBankData`)
Datos bancarios de empleados. CRUD con upsert.

### VacationBalanceAdmin (`api/admin/vacation-balances`)
Vista consolidada de saldos. Solo `SuperUsuario`.

### PerformanceEvaluations (`api/PerformanceEvaluations`)
Evaluaciones de desempeno con categorias, respuestas y comentarios.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `Create` | Crear |
| `PUT` | `Update/{id}` | Actualizar |
| `GET` | `{id}/result` | Resultado |
| `GET` | `employee/{employeeId}/history` | Historial por empleado |
| `DELETE` | `{id}` | Eliminar |
| `GET` | `customer/{customerId}/history` | Historial por cliente |

### IncidentReport (`api/hr/incident-report`)
Reporte de incidencias con estadisticas, alertas de 72h y exportacion Excel.

### SanctionType (`api/hr/sanction-types`)
Catalogo de tipos de sancion. CRUD con soft delete y toggle activo.

### TiempoExtra (`api/hr/nomina/tiempo-extra`)
Gestion de tiempo extra con aprobacion/rechazo y evidencias.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `` | Listar |
| `GET` | `{id}` | Detalle |
| `POST` | `` | Crear |
| `PUT` | `{id}` | Actualizar |
| `PUT` | `{id}/aprobar` | Aprobar |
| `PUT` | `{id}/rechazar` | Rechazar |
| `DELETE` | `{id}` | Eliminar |
| `POST` | `{id}/evidencias` | Subir evidencia |

---

## Servicios Compartidos

| Servicio | Funcion |
|----------|---------|
| `VacationHelperService` | Calculo de saldos, registro de vacaciones, cancelaciones |
| `VacationCalculator` | Calculo de dias habiles, anos de antiguedad, dias por LFT |
| `ApprovalRuleService` | Determinacion de alcance de aprobadores |
| `HrNotificationCoordinatorService` | Notificaciones de RH (creadas, aprobadas, rechazadas) |
| `LeaveRequestService` | CRUD de permisos |
| `EmployeeFileAppService` | Expediente consolidado del empleado |
