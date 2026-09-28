# Auditoría End-to-End: Recursos Humanos ↔ Reclutamiento (post-migración de Expediente)

- **Fecha:** 2026-08-22
- **Auditor:** Arquitecto/Auditor Fullstack Senior (modo solo-lectura, sin cambios de código)
- **Marco normativo:** `CONVENTIONS.md` (vigente 2026-08-12), `docs-conventions/audit/*`
- **Alcance:**
  - Frontend: `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/` (~190 archivos) y `client/angular/src/app/apps/reclutamiento.luxuryapp/` (~205 archivos)
  - Backend: `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/` (~299 archivos) y `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/` (~236 archivos)
- **Funcionalidades core auditadas:** WorkPositions, Altas/Bajas, Candidato→Empleado, Modificación de sueldo, Documentación (bancaria/clínica/contacto de emergencia/dirección/documentos).
- **Metodología:** 4 subauditorías paralelas de solo lectura (frontend RRHH, frontend Reclutamiento, backend RRHH, backend Reclutamiento), más verificación directa de hallazgos cruzados, más incorporación (no duplicación) del audit previo [`../../../docs/RecruitmentLuxuryApp/Candidates/20260819-auditoria-reclutamiento-integrado.md`](../reporte_maestro/modulos/../../../docs/RecruitmentLuxuryApp/Candidates/20260819-auditoria-reclutamiento-integrado.md), que ya cubrió en profundidad la cadena Candidatos↔RequestPosition↔RequestEmployeeRegister a nivel de BD y convenciones.
- **Nota de vigencia:** este documento no reemplaza al de 2026-08-19; lo complementa con el ángulo específico de la migración de expediente (RRHH visor vs Reclutamiento dueño) y con WorkPositions/Altas/Bajas/Sueldo, que aquel no cubrió a este nivel de detalle.

---

## 0. Resumen Ejecutivo

**Veredicto: 🟡 Migración arquitectónicamente correcta en el backend de escritura, pero con dos brechas de aislamiento sin cerrar — una en frontend, una en autorización backend — que rompen el mandato de "RRHH = solo lector".**

Lo que sí quedó bien hecho:

- `EmployeeFile/` en RRHH (el "expediente consolidado") es **100% de solo lectura**, verificado en los tres niveles: interfaz (`IEmployeeFileAppService.cs:5` lo documenta explícitamente), servicio (`EmployeeFileAppService.cs:4`, todas las queries `.AsNoTracking()`, cero `SaveChangesAsync`) y endpoints (`EmployeeFileEndPoints.cs:13-58`, los 12 son `MapGet`).
- El frontend de RRHH (`employee-file-detail.ts`) consume ese expediente correctamente en modo lectura, incluso reutilizando el componente compartido `EmployeeDocumentList` de Reclutamiento con `[isReadOnly]="true"` para el tab de Documentos.
- Reclutamiento sí es dueño real de la escritura: `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact`, `EmployeeInternal` tienen CRUD completo con endpoints, servicios y DTOs propios en `ReclutamientoLuxuryApp/Employee/*`.
- El flujo Candidato→Empleado (`CandidateProcessAppService.ProcessHiringAsync`) sí sincroniza banco/clínica/emergencia al contratar (confirmado en el audit 2026-08-19, §2.2).

Lo que **rompe** el mandato de solo-lectura:

1. **🔴 CRÍTICO — Frontend:** `EmployeeBankDataList`/`EmployeeBankDataFormComponent` dentro de `recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-bank-data/` es un CRUD completo (crear/editar/eliminar), enrutado, en el whitelist de rutas y accesible para el rol `RecursosHumanos`. No es código muerto: es una pantalla viva que contradice directamente el propósito declarado de la migración. Ver §3.1.
2. **🔴 CRÍTICO — Backend (autorización):** la policy `"ExpedienteEmpleado"` que protege `EmployeeBankData`, `EmployeeClinicalData` y `EmployeeEmergencyContact` en Reclutamiento incluye el rol `RecursosHumanos` en su `RequireRole(...)`, con un comentario explícito ("RRHH y Reclutamiento comparten escritura"). Esto significa que aunque se borrara la UI del punto 1, **la API seguiría aceptando escritura desde RRHH**. No hay ningún documento en `docs/` que registre esta decisión como intencional. Ver §3.1.
3. **🔴 CRÍTICO — Backend (endpoints huérfanos):** `RecursosHumanosLuxuryApp/Employees/Employees/EndPoints/EmployeesEndpoints.cs` sigue exponiendo `POST api/employees/create-employee` y `create-employee-external`, que delegan a `IEmployeeInternalAppService` — una interfaz que **vive físicamente en Reclutamiento**. El archivo de rutas quedó en el módulo equivocado tras la migración, y su `EmployeeMapper.cs` duplica (con superposiciones ambiguas) perfiles de AutoMapper que Reclutamiento ya define correctamente. Ver §3.2.

El resto de los hallazgos (código muerto, deuda técnica, documentación desactualizada) es amplio pero de menor riesgo funcional — se detalla en las secciones siguientes.

---

## 1. Mapa de Componentes y Flujos

### 1.1 WorkPositions (plantillas de trabajo) — dueño: Reclutamiento

| Capa | Componente/Servicio | Endpoint | Notas |
|---|---|---|---|
| Frontend | `WorkPositionForm` (`estructura-organizacional/work-position/work-position-form.ts:145,183-191`) | `GET work-positions/for-edit/{id}`, `POST/PUT work-positions` | Endpoint **hardcodeado como string literal**, no vía `EndpointsReclutamiento` (ver §3.3). |
| Frontend | `WorkPositionHours` (`work-position-hours.ts:43`) | `GET work-positions/hours/{id}` | Hardcodeado. |
| Frontend | `JobDescriptionForm` (`job-description-form.ts:86,151`) | `GET/POST job-descriptions/{id}` + `AiService.generateJobDescription/analyzeJobDescription` | Hardcodeado pese a existir `EndpointsReclutamiento.JobDescriptions.getById()`. |
| Backend | `WorkPositionEndPoints.cs:9-73` → `IWorkPositionAppService` → `WorkPositionAppService.cs` | `api/work-positions` (11 rutas: GET/POST/PUT/DELETE/PATCH) | Folio automático `{RFC}-{SortOrder}-{consecutivo}`; crear puesto autogenera `JobDescription`. |
| Backend — bug REST | `assign-employee/{userId}/{workPositionId}` (`WorkPositionEndPoints.cs:60`) | **`MapGet`** para una operación de escritura | Debería ser `POST`/`PATCH`; el resto del archivo sí usa verbos correctos. |

### 1.2 Candidato → Empleado (hiring) — dueño: Reclutamiento (`Candidates/CandidateProcess`)

```
Candidate (registro)
   → CandidateProcess (postulación a WorkPosition/RequestPosition, etapa "Nuevo")
   → Pipeline de etapas (ValidateProcessStageTransition, matriz completa)
      Nuevo → EntrevistaOperaciones → Seleccionado → AltaEnProceso → Contratado
      (ramas: EnEspera, Rechazado, NoSePresento)
   → POST .../{id}/process-hiring   (CandidateProcessAppService.ProcessHiringAsync, línea 195-276)
      1ª llamada (stage=Seleccionado): exige CV cargado, resuelve/crea Employee
         → llama RequestEmployeeRegisterAppService.OnSolicitudAltaAsync(...) → stage=AltaEnProceso
      2ª llamada (stage=AltaEnProceso): confirma contratación → stage=Contratado, ClosedAt=now
   → Alterno: POST direct-hire/{requestPositionId} (ProcessDirectHiringAsync) — alta sin pipeline de candidato
```

- Frontend: `CandidateApplicationForm` → `CandidateProcessHiringModal` (`candidate-process-hiring-modal.ts:483-486`) → `processHiring()`/`directHire()`.
- `RequestEmployeeRegisterCreatedEvent` → email a Sistemas; `RequestEmployeeRegisterConfirmedEvent` → genera contrato (`EmployeeContractGeneratorService`).
- Búsqueda de usuario por email **sí filtra por `CustomerId`** en el código actual (`CandidateProcessAppService.cs:2381-2386`) — el riesgo de colisión entre tenants documentado en `Candidates/Docs/documentacion-candidates.md:265` está **desactualizado**, no vigente (ver §2.2 — documento a corregir, no código).
- Hallazgos de seguridad/BD de esta cadena ya documentados en detalle en el audit previo (§2.3, §4 de `../../../docs/RecruitmentLuxuryApp/Candidates/20260819-auditoria-reclutamiento-integrado.md`): redundancia de `Folio`/`ConfirmationFinish`/fechas entre `RequestPosition`↔`RequestEmployeeRegister`↔`CandidateProcess`, política de autorización AND-eada que bloquea a entrevistadores, foto de candidato guardada con extensión `.pdf` incorrecta, notificación de agenda como stub vacío. No se repiten aquí — ver ese documento.

### 1.3 Altas — dueño: Reclutamiento

| Capa | Componente/Servicio | Endpoint |
|---|---|---|
| Frontend | `SolicitudAltaForm` (`solicitud-alta-form.ts:112-116`) | `POST EndpointsReclutamiento.RecruitmentRequests.solicitudAlta(applicationUserId)` |
| Backend | `RequestEmployeeRegisterEndPoints.cs` → `IRequestEmployeeRegisterAppService` | `api/request-employee-register` — CRUD + `status`, export Excel, PDF de formato de alta |

### 1.4 Bajas — dueño: Reclutamiento

| Capa | Componente/Servicio | Endpoint |
|---|---|---|
| Frontend | `SolicitudBajaForm` (`solicitud-baja-form.ts:353-359`) | `POST` multipart `RecruitmentRequests.solicitudBaja(customerId, employeeId, applicationUserId)` — valida evaluaciones de desempeño antes de permitir baja por tipo "Evaluación" (`:319-327,338-342`) |
| Backend | `RequestDismissalEndPoints.cs` → `ISolicitudBajaAppService` | `api/request-dismissal` — CRUD + `status`, autorización dual Legal/Nóminas (`{id}/authorize/{department}`), adjuntar incidente/evaluación, export Excel |
| Backend — eventos | `RequestDismissalRequestedHandler.cs:16-20` | Crea ticket legal condicionalmente solo si `LawyerAssistance == true` |

### 1.5 Modificación de Sueldo — dueño: Reclutamiento

| Capa | Componente/Servicio | Endpoint |
|---|---|---|
| Frontend | `SolicitudModificacionSalarioForm` (`solicitud-modificacion-salario-form.ts:260-266`) | `POST RecruitmentRequests.solicitudModificacionSalario(customerId, applicationUserId)` — auto-completa nuevo puesto desde vacante seleccionada |
| Backend | `RequestSalaryModificationEndPoints.cs` → `IRequestSalaryModificationAppService` | `api/request-salary-modification` — `get-data`, status, `PUT {id}`, list, export Excel |
| Backend — eventos | `RequestSalaryModificationHandler.cs` | Solo envía email; la aplicación del cambio vive en el AppService |

**Nota estructural aclarada (no es duplicación):** `Reclutamiento/RequestDismissal/`, `Reclutamiento/RequestSalaryModification/`, `Reclutamiento/RequestPosition/`, `Reclutamiento/RequestEmployeeRegister/` (top-level) contienen **solo** `Events/`+`Handlers/`+`README.md` — es el patrón de eventos de dominio para efectos secundarios (emails, tickets legales, generación de contrato). El CRUD real vive en `Reclutamiento/Recruitment/{Concepto}/` con `DTOs/EndPoints/Interfaces/Services/Mapping`. Verificado por lectura directa — **no hay dos implementaciones del mismo concepto**, contra la hipótesis inicial de la auditoría.

### 1.6 Captura de Expediente del Empleado — dueño: Reclutamiento

| Dato | Frontend (captura, `reclutamiento.luxuryapp/expediente-del-empleado/`) | Backend (`ReclutamientoLuxuryApp/Employee/`) | Policy |
|---|---|---|---|
| Datos bancarios | `EmployeeBankDataForm` — `onLoadData`(GET)+`onSubmit`(PUT/POST) vía `FormHelper.submitCrud` | `EmployeeBankDataEndPoints.cs:25-34` — `POST/PUT/DELETE api/employee-bank-data` | `ExpedienteEmpleado` |
| Datos clínicos | `EmployeeClinicalDataForm` | `EmployeeClinicalDataEndPoints.cs:21-30` — `POST/PUT/DELETE api/employee-clinical-data` | `ExpedienteEmpleado` |
| Contacto de emergencia | `EmployeeEmergencyContactForm` | `EmployeeEmergencyContactEndPoints.cs:19-36` — `PUT/POST/DELETE api/employee-emergency-contact` | `ExpedienteEmpleado` |
| Dirección/Personal/Laboral/Principal/Avatar | `EmployeeAddressForm`, `EmployeePersonalDataForm`, `EmployeeLaboralDataForm`, `EmployeePrincipalDataForm`, `EmployeeAvatarForm` | `EmployeeInternalEndpoints.cs:25-76` — `PUT api/employee-internal/update-{tipo}-data/{id}` | — |

### 1.7 Expediente del Empleado (visor) — dueño: RecursosHumanos

| Ruta | Componente | Endpoint | Estado |
|---|---|---|---|
| `employee-files` | `EmployeeFileList` | `GET hr/employee-files` | ✅ Readonly (`showAdd=false`, único botón "Ver Expediente") |
| `employee-files/:employeeId` | `EmployeeFileDetail` (tabs: Personales/Emergencia/Clínicos/Bancarios/Puesto/Vacaciones/Incidencias/Evaluaciones/Solicitudes) | `GET hr/employee-files/{id}/{tab}` | ✅ Readonly (tablas `p-table` sin botones de edición) |
| `employee-files/:employeeId` (tab Documentos) | `EmployeeDocumentList` (importado de Reclutamiento) | `hr/employee-document/*` | ✅ Readonly vía `[isReadOnly]="true"` — pero protección solo de plantilla, ver §3.3 |
| `employee-files/:employeeId` (tab Contratos) | Botón "Subir firmado" | `POST hr/work-contract/{id}/upload-signed` | ✅ Fuera del alcance de la migración (Contratos es propio de RRHH) |
| `bank-data` | **`EmployeeBankDataList`/`EmployeeBankDataFormComponent`** | `GET employee-bank-data/list/{customerId}`, **`POST`/upsert, `DELETE`** | 🔴 **CRUD completo, no readonly** — ver §3.1 |

---

## 2. Código Muerto o Basura (qué se elimina)

### 2.1 Backend — `.cs.disabled` y artefactos legacy

| Archivo | Referencias activas | Origen / Recomendación |
|---|---|---|
| `RecursosHumanosLuxuryApp/Employees/ViewModels/ModificacionSalarioEmailViewModel.cs.disabled` | 0 | Eliminar o resolver |
| `RecursosHumanosLuxuryApp/Employees/ViewModels/SolicitudAltaEmailViewModel.cs.disabled` | 0 | Eliminar o resolver |
| `RecursosHumanosLuxuryApp/Employees/ViewModels/SolicitudBajaEmailViewModel.cs.disabled` | 0 | Eliminar o resolver |
| `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/DTOs/EvaluationCategoryFormDTO.cs.disabled` | 0 | Eliminar o resolver |
| `RecursosHumanosLuxuryApp/IncidenciasAdministrativas/HRIncident/DTOs/IncidentAttachmentDetailDTO.cs.disabled` | 0 | Eliminar o resolver |
| `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/DTOs/ManualBalanceUpdateDTO.cs.disabled` | 0 | Eliminar o resolver |
| `ReclutamientoLuxuryApp/Reclutamiento/Recruitment/ViewModels/SolicitudVacanteEmailViewModel.cs.disabled` | 0 | Cuarentena formal confirmada en `docs/reporte_maestro/20260815-INFORME-LIMPIEZA-ARCHIVOS-NO-UTILIZADOS.md:71` (`QUARANTINE_CANDIDATE`) — pendiente decisión final de borrado |
| `RecursosHumanosLuxuryApp/LegacyArtifacts/LeaveRequest/SolicitudPermisos.cd` | 0 | Diagrama de clases de Visual Studio, no compila. Eliminar |
| `RecursosHumanosLuxuryApp/LegacyArtifacts/Shared/map.txt` | 0 | Volcado crudo de tabla de aprobaciones con GUIDs de BD. Eliminar |

### 2.2 Frontend — archivos de scratch/IA fuera de convención

`reclutamiento.luxuryapp/candidates/` tiene 6 `.md` sueltos en la **raíz del feature** (no en `docs/`, que sí existe y es la ubicación correcta según CONVENTIONS.md §4.7):

- `extructura.md` — boceto de entidades que el propio repo admite no coincide con el esquema real implementado.
- `prompt.md`, `extructura-global-empelados.md`, `nueva-extructuraV2.md`, `nueva-extructuraV3.md`, `nuevos-requerimientos.md` — notas de análisis/debate con "Decisiones abiertas", "Pendientes de decisión".
- Además `modulo-candidates-doc.html` (839 líneas, HTML autogenerado con endpoints ficticios, roles obsoletos y ~60 estilos inline) — ya señalado en el audit 2026-08-19 (M10).

Recomendación: mover a `candidates/docs/` (que ya existe con `arquitectura/`, `audotoria/` [sic, typo], `plans/`) o eliminar con aprobación si ya no aportan valor. `CandidateProcessAppService.cs:1193` incluso cita `nueva-extructuraV3.md` en un docstring de producción — referencia a un scratch, no a documentación oficial.

### 2.3 Frontend — DTO y ruta huérfanos (0 referencias, confirmado)

- `EmployeeBankDataAddOrEditDTO` (`recursos-humanos/employee-bank-data/interfaces/employee-bank-data.interfaces.ts:16-25`) — declarado, nunca importado; el propio formulario no lo usa.
- `ROUTES.RECURSOS_HUMANOS.DATOS_BANCARIOS` (`client/angular/src/app/routing/route-paths.ts:898`) — sin ningún `router.navigate` que la use en toda la base de código. **Evidencia de que el enlace de navegación sí se retiró en la migración, pero el componente CRUD, la ruta y el guard se quedaron atrás** (ver §3.1 — esta es la causa raíz más probable del hallazgo crítico).

### 2.4 Backend — código huérfano de ownership incorrecto (candidato a mover, no a borrar)

`EmployeesEndpoints.cs` (`RecursosHumanosLuxuryApp/Employees/Employees/`) y `EmployeeMapper.cs` en el mismo submódulo no son "muertos" (tienen tráfico real) pero están **en el módulo equivocado** — ver hallazgo crítico §3.2. Requiere decisión de gobernanza (mover a Reclutamiento vs eliminar), no un borrado directo.

### 2.5 Tests rotos (import a ruta inexistente)

4 specs en `reclutamiento.luxuryapp/expediente-del-empleado/` importan `EmployeeInternalService` desde una ruta que no existe:

- `employee-bank-data/employee-bank-data-form.spec.ts:8`
- `employee-bank-data/employee-bank-data-list.spec.ts:5`
- `employee-clinical-data/employee-clinical-data-form.spec.ts:6`
- `employee-clinical-data/employee-clinical-data-list.spec.ts:5`

Todos usan `"../../employee-internal/services/employee-internal.service"`; el archivo real está en `employee-internal/employee-internal.service.ts` (**sin** subcarpeta `services/`). Verificar con el runner si estos specs están fallando silenciosamente o si el CI los está saltando — no es "basura" per se, pero probablemente da falsa sensación de cobertura.

---

## 3. Deuda Técnica y Bugs (qué está mal)

### 3.1 🔴 CRÍTICO — Escritura residual de datos bancarios en RRHH (frontend + backend)

**Frontend:** `employee-bank-data-list.html:16-20,55-59,76` tiene botones "Agregar Datos Bancarios", `iw-button-edit`, `iw-button-delete` con confirmación → `onModalForm()`/`onDelete()` (`employee-bank-data-list.ts:88-109`) → modal `EmployeeBankDataFormComponent` → `FormHelper.submitCrud(...)` contra `Endpoints.HR.EmployeeBankData.upsert`. Ruteada (`human-resources.routing.ts:463-480`, roles `SuperUsuario`/`RecursosHumanos`), en whitelist activo (`route-whitelist.ts:299`).

**Backend:** la policy compartida lo permite explícitamente:

```csharp
// api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:63-69
// Expediente del empleado: RRHH y Reclutamiento comparten escritura
// (Reclutamiento arma el expediente durante el alta del candidato).
options.AddPolicy("ExpedienteEmpleado", policy =>
    policy.RequireRole(SuperUsuario, Direccion, RecursosHumanos, Reclutamiento, Administrador));
```

Esta misma policy protege también `EmployeeClinicalData` y `EmployeeEmergencyContact` — en esos dos casos el frontend de RRHH **sí** se corrigió a solo-lectura, pero el backend **no** impone esa restricción a nivel de autorización. Cualquier usuario con rol `RecursosHumanos` puede escribir esos tres recursos vía llamada directa a la API, sin pasar por la UI.

No existe documento en `docs/` (revisado `CLASIFICACION-72-AMARRAS.md` y los planes de migración) que registre "escritura compartida" como decisión intencional. Todo apunta a un descuido: se retiró el link de navegación y (parcialmente) la UI, pero no la ruta ni el guard del frontend, y no se restringió la policy del backend.

**Impacto:** viola el invariante de negocio declarado por el usuario ("RRHH ahora es solo lector"). Riesgo de doble escritura sobre el mismo dato desde dos módulos sin coordinación (posible condición de carrera/pérdida de datos si RRHH y Reclutamiento editan el mismo registro bancario en paralelo, ya que no comparten capa de mapeo).

### 3.2 🔴 CRÍTICO — Endpoints de creación de empleado en el módulo equivocado

`RecursosHumanosLuxuryApp/Employees/Employees/EndPoints/EmployeesEndpoints.cs:9` mapea `api/employees` con:

- `MapPost("create-employee", ...)` (línea 23) → `appService.CreateEmployeeAsync(DTO)`
- `MapPost("create-employee-external", ...)` (línea 29) → `appService.CreateEmployeeExternal(DTO)`

`appService` es `IEmployeeInternalAppService`, cuya interfaz e implementación viven en `ReclutamientoLuxuryApp/Employee/EmployeeInternal/`. `IEmployeeInternalAppService.cs:41` documenta `CreateEmployeeAsync` como *"Crea un nuevo expediente completo de empleado interno (Identity, Employee, PersonData, Address)"*. Es decir: un archivo de rutas físicamente en RecursosHumanos sigue exponiendo públicamente la creación de PersonData/Address (datos migrados), duplicando lo que Reclutamiento ya expone correctamente y completo en `api/employee-internal` (`EmployeeInternalEndpoints.cs:9`).

`EmployeeMapper.cs` (mismo submódulo) refuerza el problema con perfiles de AutoMapper que se superponen con `EmployeeInternalMappingProfile.cs` de Reclutamiento para los mismos pares de tipos:

| RRHH (`EmployeeMapper.cs`) | Reclutamiento (`EmployeeInternalMappingProfile.cs`) |
|---|---|
| `EmployeeAddOrEditDTO ↔ Employee` (línea 24) | `Employee ↔ EmployeeAddOrEditDTO` (línea 10) |
| `Employee → EmployeeLaboralDataEditDTO` (línea 73-76) | mismo par exacto (línea 13) |
| `PersonData → EmployeePersonalDataEditDTO` (línea 78) | `Employee → EmployeePersonalDataEditDTO` (línea 12) — **misma DTO destino, entidad fuente distinta: mapeo ambiguo** |
| `EmployeeAddressDataEditDTO → Address` (línea 80) | `Employee → EmployeeAddressDataEditDTO` (línea 14) |
| `EmployeeEmergencyContactAddOrEditDTO → EmployeeEmergencyContact` (línea 32-34) | duplicado exacto en `EmployeeEmergencyContactMapper.cs:9` |

Adicionalmente, los DTOs que consume `IEmployeeInternalAppService` (`EmployeeCreateDTO`, `EmployeeAddOrEditDTO`, `EmployeeDossierDto`, `EmployeeGetDTO`, `EmployeeAdminEditDTO`) siguen alojados físicamente en `RecursosHumanosLuxuryApp/Employees/Employees/DTOs/` — ownership de carpeta no coincide con ownership funcional.

**Recomendación:** requiere decisión de gobernanza (Tech Lead) — mover `create-employee`/`create-employee-external` + los DTOs + eliminar el `EmployeeMapper.cs` duplicado hacia Reclutamiento, o documentar explícitamente por qué RRHH conserva esa vía de creación.

### 3.3 🟠 Alto — Endpoints hardcodeados en vez de constantes centralizadas (viola §6.3 CONVENTIONS.md)

CONVENTIONS.md §6.3: *"No se permite hardcodear strings de endpoint en componentes o servicios de feature fuera del patrón oficial."*

- `work-position-form.ts:146` → `` `work-positions/for-edit/${this.id()}` ``
- `work-position-hours.ts:43` → `` `work-positions/hours/${id}` ``
- `work-position-list.ts:146` → `` `work-positions/list-by-customer/${customerId}/${stateStr}` `` (existe `WorkPositions.list` con firma similar — verificar duplicidad)
- `job-description-form.ts:86` → `` `job-descriptions/${this.id()}` `` pese a existir `EndpointsReclutamiento.JobDescriptions.getById(id)`, usado en otras partes del mismo módulo

### 3.4 🟠 Alto — AutoMapper contradice la convención documentada del propio módulo

`ReclutamientoLuxuryApp/Docs/documentacion-modulo-reclutamiento.md:119` declara: *"Mapeo: Explícito `ToDto()` (AutoMapper prohibido)"*. Sin embargo, **33 archivos** del módulo usan `IMapper`/`Profile` de AutoMapper — prácticamente todo `Reclutamiento/*` legacy (`WorkPositionAppService`, `RequestEmployeeRegisterAppService`, `RequestPositionAppService`, `SolicitudBajaAppService`, `RequestSalaryModificationAppService`, `CustomerProviderAppService`, `JobDescriptionAppService`, etc.) y partes de `Employee/*` (`EmployeeInternalAppService`, `EmployeeEmergencyContactAppService`, `EmployeeBankDataMappingProfile`) y `Candidates/*` (`CandidateAppService`, `InterviewerMatrixAppService`, `CandidateWorkExperienceAppService`, `CandidateInterviewResultAppService`).

Solo `CandidateProcessAppService.cs` (el servicio "fusionado" más reciente) cumple la regla (0 usos de AutoMapper). Esto es deuda técnica extensa y transversal, no un caso aislado — cualquier plan de remediación tocaría casi todos los servicios del módulo.

### 3.5 🟠 Alto — Violaciones a "1 archivo = 1 DTO" (CONVENTIONS.md §6.1)

| Archivo | DTOs en el mismo archivo | Módulo |
|---|---|---|
| `EmployeeFile/DTOs/EmployeeFileVacationsLeavesDTO.cs` | 4 tipos | RRHH |
| `EmployeeFile/DTOs/EmployeeFileWorkPositionDTO.cs` | 2 tipos | RRHH |
| `EmployeeFile/DTOs/EmployeeFileRequestsDTO.cs` | 4 tipos | RRHH |
| `EmployeeFile/DTOs/EmployeeFileIncidentDTO.cs` | 2 tipos | RRHH |
| `Employee/EmployeeBankData/DTOs/EmployeeBankDataDTOs.cs` | 2 tipos | Reclutamiento |
| `Employee/EmployeeClinicalData/DTOs/EmployeeClinicalDataDTOs.cs` | 2 tipos | Reclutamiento |
| `Reclutamiento/WorkPosition/DTOs/WorkPositionAddOrEditDTO.cs` | 2 tipos (`WorkPositionAddOrEditDTO` + `WorkPositionRequestAddOrEditDTO`, casi idénticos — ~28 campos de horario duplicados) | Reclutamiento |
| `RecruitmentSourceCatalog/DTOs/RecruitmentSourceCatalogDtos.cs` | 3 tipos | Reclutamiento |
| `Candidates/Notifications/Interfaces/IMultiChannelAlertService.cs` | interfaz + enum `AlertSeverity` | Reclutamiento (ya reportado en audit 2026-08-19, M21) |

El sufijo plural `*DTOs.cs` es señal fiable del patrón en este código base.

### 3.6 🟠 Alto — Bug REST: GET usado para escritura

`WorkPositionEndPoints.cs:60-62` — `GET assign-employee/{userId}/{workPositionId}` ejecuta una asignación (escritura) vía verbo `GET`. Riesgo real: prefetch de navegador, proxies/CDN o crawlers pueden disparar la asignación sin intención. Debe ser `POST`/`PATCH`, como el resto de endpoints de escritura del mismo archivo.

### 3.7 🟡 Medio — Documentación desactualizada tras la migración (patrón repetido en 6+ documentos)

| Documento | Problema |
|---|---|
| `RecursosHumanosLuxuryApp/README.md:60-64` | Describe `EmployeeClinicalData`/`EmployeeBankData` como "CRUD" propio de RRHH con rutas `api/EmployeeClinicalData`/`api/EmployeeBankData` — **ya no existen como tales**; toda la escritura vive en Reclutamiento. No menciona `EmployeeFile/` (el módulo readonly real). |
| `RecursosHumanosLuxuryApp/documentacion-modulo-rrhh.md:147` | Ruta incorrecta (`api/hr/employees` vs real `api/employees`) y atribución "CRUD + expediente" incorrecta |
| `RecursosHumanosLuxuryApp/Employees/Employees/README.md` | Habla de "EmployeesController"/"EmployeeExternalController" (MVC) cuando el código ya migró a Minimal API |
| `ReclutamientoLuxuryApp/Reclutamiento/RequestDismissal/README.md:8-21` (y análogos de RequestSalaryModification/RequestPosition/RequestEmployeeRegister) | Rutas documentadas en PascalCase (`api/RequestDismissal/List`) no coinciden con las reales kebab-case (`api/request-dismissal`) |
| `Candidates/Docs/documentacion-candidates.md:265,278-281,360-365` | Documenta un riesgo de búsqueda de usuario "sin CustomerId" en `ProcessHiringAsync` que **ya fue remediado en código** (`CandidateProcessAppService.cs:2381-2386` sí filtra por `CustomerId`) — corregir el documento, no el código |
| `documentacion-candidates.md:127-138` | Enum `CandidateApplicationStage` documentado no coincide con el `CandidateProcessStage` real — la doc describe la entidad predecesora `CandidateApplication`, no la actual `CandidateProcess` fusionada |
| `reglas-negocio-modulo-recursoshumanos.md:1445` | Referencia ruta obsoleta pre-reorganización `Moduls/` (`Features/VacationBalanceAdmin/...`) |

### 3.8 🟡 Medio — Tipos `any` (dentro del alcance de expediente)

- `reclutamiento.luxuryapp`: `employee-emergency-contact-form.ts:52,53,71`; `employee-address-form.ts:80,95`; `employee-personal-data-form.ts:104,133,138`; `employee-principal-data-form.ts:81`; `employee-laboral-data-form.ts:116,133,151,160`; `employee-avatar-form.ts:25,26,27,37,69`.
- `recursos-humanos.luxuryapp`: `employee-bank-data-form.ts:55` (`get f() { return this.form.controls as any; }`).

### 3.9 🟡 Medio — Typo funcional en campo de formulario

`employee-emergency-contact-form.ts:53` — `contacOfBeneficiary` (falta la "t" de "contact"), replicado en `config.data.contacOfBeneficiary` (línea 54). Al ser nombre de propiedad consumido internamente (no serializado con ese nombre exacto al backend, verificar), corregirlo requiere confirmar que no rompe el contrato — si el DTO real del backend usa el nombre correcto, esto puede ya estar silenciosamente desconectado.

### 3.10 🟡 Medio — Comentarios muertos y referencias a servicios eliminados

Comentarios de un servicio `EmployeeAddOrEditService` que ya no existe, en `employee-address-form.ts:21,32`, `employee-principal-data-form.ts:22,44`, `employee-laboral-data-form.ts:30,51`, `employee-avatar-form.ts:20,30` — este último incluso deja una línea muerta que **ni siquiera compilaría** si se descomentara (`// this.applicationUserId() = this.employeeAddOrEditService.onGetId();`, asignación a una función `input()`).

### 3.11 🟡 Medio — Protección de solo lectura solo en plantilla, no en TS

`EmployeeDocumentList` (reutilizado en RRHH con `[isReadOnly]="true"`): los botones están correctamente detrás de `@if (!isReadOnly())` en el HTML, pero los métodos TS (`onDeleteFile`, `onValidate`, `onReject`, `uploadNewDocument`) **no re-validan `isReadOnly()` internamente**. Es defensa en profundidad débil — no explotable sin acceso a devtools/consola, pero un patrón a corregir dado que ya causó el problema mayor en §3.1 (una capa de protección que descansa solo en ocultar el botón).

### 3.12 🟡 Medio/cosmético — Mojibake extendido en pantallas de expediente

205 ocurrencias en 55 archivos de `recursos-humanos.luxuryapp/expediente-del-empleado/`. Ejemplos: "Pestaóas" (Pestañas), "Telófono" (Teléfono), "condiciones clónicas" (clínicas), "Documentacin". Además, ~30 lugares usan el carácter literal `'é'` como valor de reemplazo (`?? 'é'`) donde se esperaba "N/A" — parece un find/replace fallido de un placeholder — y `employee-bank-data-list.html:39,93,96` muestran literal `"??"` (probablemente un emoji roto). Viola la regla crítica de encoding de CONVENTIONS.md §6.1; correr `node scripts/scan-mojibake.mjs client/angular` para confirmar cobertura completa antes de mergear cualquier fix.

También detectado en backend: comentarios/summary con mojibake (`Ã³`, `Ã­`) en `EmployeesEndpoints.cs`/`EmployeeExternalEndpoints.cs` y en `DependencyInjection.Authorization.cs` (box-drawing corrupto en comentarios, ya reportado en audit 2026-08-19, M22).

### 3.13 🟢 Bajo — Duplicación de fuentes de verdad ya reportada en audit 2026-08-19 (referencia, no repetición)

Ver §4 de `../../../docs/RecruitmentLuxuryApp/Candidates/20260819-auditoria-reclutamiento-integrado.md` para: iconos fuera de catálogo (C1), select de vacantes fuera del hub centralizado (C2), fronteras de apps rotas — `recursos-humanos.luxuryapp` importa de `reclutamiento.luxuryapp` en 8 archivos (C3, `audit:apps` falla), políticas AND-eadas que bloquean entrevistadores (A1), foto de candidato guardada como `.pdf` (A2), notificación de agenda como stub vacío (A3), redundancia de BD en la cadena de alta (A8, 7 puntos), `CandidateProcessAppService` de 2652 líneas (god-class, plan de acción #13).

**Nota de refuerzo:** el hallazgo C3 de ese audit (frontera de apps rota, RRHH importa de Reclutamiento en el lado frontend) es la misma familia de problema que el hallazgo §3.1/§3.2 de este documento (backend/frontend de RRHH reteniendo acoplamiento con datos que ya no le pertenecen) — ambos apuntan a que el corte de responsabilidad de la migración no se cerró limpiamente en ninguna de las dos direcciones.

---

## 4. Oportunidades de Mejora (qué se mejora)

1. **Cerrar la frontera de escritura de una vez, en las tres capas.** Restringir la policy `"ExpedienteEmpleado"` a `{SuperUsuario, Reclutamiento, Administrador}` (quitar `RecursosHumanos`/`Direccion` si el negocio confirma que no deben escribir), eliminar la ruta/componente `EmployeeBankDataList`/`Form` de `recursos-humanos.luxuryapp`, y mover `create-employee`/`create-employee-external` + DTOs asociados a Reclutamiento. Esto cierra §3.1 y §3.2 en un solo esfuerzo coordinado — conviene planificarlos juntos porque tocan la misma policy y el mismo flujo de creación de empleado.
2. **Unificar el patrón de mapeo.** Decidir explícitamente entre AutoMapper y mapeo explícito para todo `ReclutamientoLuxuryApp` (hoy la documentación dice una cosa y el 90% del código legacy hace otra); si se adopta AutoMapper como estándar real, actualizar `documentacion-modulo-reclutamiento.md:119`; si se mantiene "prohibido", planificar la migración de los 33 archivos empezando por los que tienen mapeos superpuestos con RRHH (§3.2).
3. **Centralizar constantes de endpoint de WorkPositions.** Extender `EndpointsReclutamiento.WorkPositions` con las variantes `for-edit`, `hours`, `list-by-customer` ya usadas como literales, y forzar su uso (elimina 4 hardcodes puntuales, cumple §6.3).
4. **Adoptar un componente/servicio compartido de "agenda status"** para reemplazar las 3 fuentes de verdad divergentes ya señaladas en el audit 2026-08-19 (A7) — oportunidad de simplificación de Signals/estado que reduce superficie de bugs de UI.
5. **Extraer responsabilidades de `CandidateProcessAppService` (2652 líneas)** en servicios más pequeños (transición de etapa, alta de empleado/sincronización de expediente, notificaciones, queries de bandeja) — mejora testabilidad y reduce el radio de blast de cualquier cambio futuro en el flujo de contratación.
6. **Reforzar `isReadOnly` en profundidad**, no solo en plantilla: los métodos de escritura de `EmployeeDocumentList` deberían verificar `isReadOnly()` internamente (guard clause), no confiar solo en que el botón esté oculto — patrón reutilizable para cualquier componente compartido entre un contexto de escritura (Reclutamiento) y uno de solo lectura (RRHH).
7. **Ejecutar `node scripts/scan-mojibake.mjs client/angular` con `--fix` (o el flujo equivalente) sobre `expediente-del-empleado/`** antes de cualquier otro cambio en esas pantallas — 205 ocurrencias en 55 archivos es alto volumen pero mecánico de corregir con el escáner ya existente.
8. **Actualizar los 7 documentos desactualizados de §3.7 en el mismo PR que cierre cada hallazgo relacionado** (no como tarea aparte) — evita que vuelvan a desincronizarse inmediatamente.
9. **Reparar los 4 specs con import roto (§2.5) y confirmar cobertura real** antes de asumir que el módulo de captura de expediente está bien testeado — actualmente esa suposición no está verificada por el runner.

---

## 5. Plan de Acción

### 🔴 Prioridad Alta — Cerrar brechas de aislamiento (requiere aprobación de Tech Lead, afecta autorización y rutas públicas)

1. **Decidir y ejecutar el cierre de escritura bancaria en RRHH (§3.1).**
   - Confirmar con negocio/Tech Lead si `RecursosHumanos` debe poder escribir datos bancarios/clínicos/emergencia alguna vez, o si es 100% solo Reclutamiento.
   - Si la respuesta es "solo Reclutamiento": eliminar ruta `bank-data` + `EmployeeBankDataList`/`EmployeeBankDataFormComponent` de `recursos-humanos.luxuryapp`, quitar de `route-whitelist.ts:299`, y restringir `"ExpedienteEmpleado"` en `DependencyInjection.Authorization.cs:63-69` quitando `RecursosHumanos`.
   - Test de aceptación: un usuario con rol `RecursosHumanos` (sin `Reclutamiento`) debe recibir 403 al intentar `POST/PUT/DELETE api/employee-bank-data`, `api/employee-clinical-data`, `api/employee-emergency-contact`.
2. **Mover `create-employee`/`create-employee-external` a Reclutamiento (§3.2).**
   - Reubicar `EmployeesEndpoints.cs` (las dos rutas de creación) y los DTOs (`EmployeeCreateDTO`, `EmployeeAddOrEditDTO`, `EmployeeDossierDto`, `EmployeeGetDTO`, `EmployeeAdminEditDTO`) desde `RecursosHumanosLuxuryApp/Employees/Employees/` hacia `ReclutamientoLuxuryApp/Employee/EmployeeInternal/`.
   - Eliminar los perfiles de `EmployeeMapper.cs` que duplican `EmployeeInternalMappingProfile.cs`/`EmployeeEmergencyContactMapper.cs`; verificar que no quede mapeo ambiguo (`PersonData → EmployeePersonalDataEditDTO` vs `Employee → EmployeePersonalDataEditDTO`) antes de borrar.
   - Requiere análisis de impacto: identificar todos los consumidores actuales de `api/employees/create-employee*` antes de mover la ruta (puede haber integraciones o frontend apuntando ahí).

### 🟠 Prioridad Media — Deuda estructural

3. Fix REST: `assign-employee` de `GET` a `POST`/`PATCH` (§3.6) — cambio de contrato, coordinar con frontend que lo consume.
4. Resolver los 4 specs con import roto (§2.5): corregir la ruta de import a `../../employee-internal/employee-internal.service.ts`.
5. Centralizar endpoints hardcodeados de WorkPositions en `EndpointsReclutamiento` (§3.3).
6. Decidir postura sobre AutoMapper (§3.4) y documentarla; si se mantiene "prohibido", crear plan de migración incremental (no en este ciclo, es transversal a ~30 archivos).
7. Resolver violaciones "1 DTO = 1 archivo" (§3.5) — 9 archivos, mecánico, bajo riesgo.
8. Reforzar `isReadOnly()` en profundidad en `EmployeeDocumentList` (§3.11).

### 🟡 Prioridad Baja — Limpieza y documentación

9. Eliminar los 8 archivos `.cs.disabled` sin referencias (§2.1) — confirmar con Tech Lead antes de borrar el de Reclutamiento (ya cuarentenado formalmente).
10. Eliminar `LegacyArtifacts/` (§2.1).
11. Mover/eliminar los 6 `.md` sueltos + `modulo-candidates-doc.html` en `candidates/` (§2.2).
12. Eliminar `EmployeeBankDataAddOrEditDTO` huérfano y evaluar si `ROUTES.RECURSOS_HUMANOS.DATOS_BANCARIOS` debe eliminarse junto con la ruta (depende del punto 1).
13. Actualizar los 7 documentos desactualizados (§3.7).
14. Corregir typo `contacOfBeneficiary` → `contactOfBeneficiary` (§3.9, verificar contrato antes).
15. Eliminar comentarios muertos de `EmployeeAddOrEditService` (§3.10).
16. Ejecutar `scan-mojibake.mjs` sobre `expediente-del-empleado/` y corregir las 205 ocurrencias (§3.12).
17. Corregir tipos `any` listados en §3.8.

### Referencia cruzada — Plan de acción ya vigente para Candidatos/WorkPosition/Alta

Los puntos 🔴 1-6 y 🟠 7-13 de `../../../docs/RecruitmentLuxuryApp/Candidates/20260819-auditoria-reclutamiento-integrado.md` (§5) siguen vigentes y no se repiten aquí — en particular C3 (fronteras de apps rotas) es prioritario coordinarlo con el punto 2 de este plan, ya que ambos tocan el límite de responsabilidad entre `recursos-humanos.luxuryapp` y `reclutamiento.luxuryapp`.

**Criterio de cierre de esta auditoría:** los tests de aceptación del punto 1 (403 para RecursosHumanos en escritura de expediente) en verde, `EmployeesEndpoints.cs` sin rutas de creación de empleado, y los 7 documentos de §3.7 actualizados.
