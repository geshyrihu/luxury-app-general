# Plan de Implementación: Motor de Políticas RRHH (Confidencialidad)

**Estado:** Aprobado para ejecución (Claude)
**Módulo:** Recursos Humanos / Control de Accesos
**Autor:** Antigravity Arquitecto

---

## 1. Resumen Ejecutivo
Implementar un "Motor de Políticas" centralizado (`IHrActionPolicyService`) para garantizar la confidencialidad táctica en la gestión del personal. Este motor controlará qué roles pueden ver folios y solicitar movimientos estructurales (Bajas, Vacantes, Sueldos), eliminando el código espagueti de permisos en Angular y reemplazándolo por un diseño *Backend-Driven UI*.

## 2. Objetivo
Garantizar la Separación de Funciones (SoD) aislando a los roles operativos (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`) de los procesos y visibilidad que corresponden exclusivamente a la mesa de control de recursos humanos.

## 3. Restricciones y Estándares
- **Backend-Driven UI:** Angular NO calculará permisos basándose en el rol del usuario logueado. Angular solo leerá banderas booleanas provistas por el DTO.
- **Sanitización de Datos:** Los datos confidenciales deben ser destruidos/nulificados en el Backend antes de viajar por la red si el usuario no tiene permisos.

---

## 4. FASES DE IMPLEMENTACIÓN

### FASE 1: El Motor Central (Backend Domain)
**Complejidad:** M (Media)
1. **Creación del Servicio:** Implementar `IHrActionPolicyService` (y su clase) en la capa `Application.Contracts` (o `Shared`).
2. **Métodos Base:**
   - `bool CanManageStructuralHr(ApplicationRoleEnum userRole)`
   - `bool CanViewConfidentialHrData(ApplicationRoleEnum userRole)`
3. **Mapeo de Reglas:** 
   - Roles Autorizados: `SuperUsuario`, `RecursosHumanos`, `Reclutamiento`, `GerenteMantenimiento`, `SistemasGeneral`, `SupervisionOperativa`.
   - Roles Denegados: Todos los demás (incluyendo `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`).

### FASE 2: DTOs, Sanitización y Bloqueo de Mutaciones (Backend AppServices)
**Complejidad:** L (Alta)
1. **Extender DTOs:** Agregar a `WorkPositionListDto` (o el equivalente que use `/directory/staff`) los booleanos:
   - `CanRequestDismissal`
   - `CanRequestVacancy`
   - `CanModifySalary`
   - `CanViewSensitiveData`
2. **Sanitización en GET (Listados):** 
   - Modificar el AppService que lista el Staff (`WorkPositionAppService` o `EmployeeAppService`).
   - Inyectar el `ICurrentUserService` y `IHrActionPolicyService`.
   - Llenar los nuevos booleanos del DTO.
   - **Critical:** Si `!CanViewConfidentialHrData`, iterar la lista de resultados y fijar `Folio = null` y `VacantesActivas = null` (o en 0).
3. **Protección en POST/PUT:**
   - Inyectar la validación en los comandos de `Crear Baja`, `Crear Vacante` y `Modificar Sueldo`.
   - Lanzar `BusinessException(403)` si el usuario falla el chequeo de `CanManageStructuralHr`.

### FASE 3: Filtro de Notificaciones (Event Handlers)
**Complejidad:** M (Media)
1. Ubicar los manejadores de eventos (Ej. `VacancyRequestedHandler`, `RequestDismissalRequestedHandler`).
2. Modificar la construcción de destinatarios (`To`, `Bcc`). Filtrar la lista de roles a notificar cruzándolos contra un nuevo método en el motor: `FilterAllowedRolesForNotification(List<ApplicationRoleEnum> targetRoles)`.

### FASE 4: Refactor Frontend (Backend-Driven UI en Angular)
**Complejidad:** S (Pequeña)
1. Actualizar la Interfaz TypeScript (`.dto.ts`) para incluir los nuevos booleanos del backend.
2. Ir al HTML de `/directory/staff` (la tabla principal y su menú contextual de 3 puntitos).
3. Reemplazar cualquier chequeo condicional de roles por un simple `@if (item.canRequestDismissal)` para mostrar/ocultar los botones.
4. Ocultar las columnas "Folio" y "Vacantes" basándose en el mismo DTO (si la data viene nula o si `canViewSensitiveData` es falso).

---

## 5. Riesgos y Contingencias
- **Riesgo:** Un test automatizado asume que la columna Folio siempre existe y se rompe.
  - **Mitigación:** Proveer un valor por defecto o guion (`"-"`) en el DTO si el cliente espera un string.
