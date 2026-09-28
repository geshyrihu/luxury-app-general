# FASE 0: Análisis de Reglas de Negocio (Motor de Políticas RRHH)

## 0.1 Problem Statement & KPIs

### El Problema
Actualmente, el panel de directorio/staff expone opciones e información confidencial (creación de vacantes, bajas, modificación de salarios, folios y conteo de vacantes activas) a roles puramente operativos (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`). Esto rompe la Separación de Funciones (SoD) y vulnera la confidencialidad táctica de RRHH (ej. un Administrador puede ver si están buscando un reemplazo para su propio puesto).

### KPIs de Éxito
1. **Confidencialidad Táctica (Cero Fugas):** 
   - **Target:** 0 incidentes donde roles no autorizados puedan ver folios o vacantes activas de su mismo nivel.
   - **Verificación:** Sanitización de DTOs comprobada vía Postman (el JSON debe llegar nulo para roles operativos).
2. **Robustez de API (Cero Inserciones Ilícitas):**
   - **Target:** 100% de rechazos (HTTP 403) si un rol operativo intenta inyectar un POST para solicitar baja, vacante o modificación de salario.
3. **Reducción de Ruido (Notificaciones):**
   - **Target:** Roles operativos son excluidos sistemáticamente de los correos automáticos sobre movimientos estructurales.

---

## 0.2 Matriz de Reglas de Negocio (4 Niveles)

| ID | Nivel | Regla de Negocio | Código/Ubicación Afectada |
|---|---|---|---|
| RN-HRP-001 | Nivel 1 (Validación) | Los roles operativos (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`) no tienen autoridad estructural **sobre puestos de su mismo anillo** (ver "Actualización 2026-09-24"). | `IHrActionPolicyService` (Nuevo Servicio). |
| RN-HRP-002 | Nivel 2 (Datos/DTO) | El DTO de salida de puestos de trabajo/staff debe incluir banderas: `CanRequestDismissal`, `CanRequestVacancy`, `CanModifySalary`, `CanViewSensitiveData`. | `WorkPositionListDto` (o equivalente). |
| RN-HRP-003 | Nivel 2 (Sanitización) | Si `CanViewSensitiveData == false`, los campos `Folio`, `Sueldo` (si aplica) y `VacantesActivas` deben sobreescribirse a nulo/vacío en el Backend antes de serializar el JSON. | `WorkPositionAppService` o `StaffAppService`. |
| RN-HRP-004 | Nivel 3 (Condicionales UI) | El frontend en Angular será estrictamente pasivo (Backend-Driven UI): mostrará u ocultará opciones en el menú contextual basándose EXCLUSIVAMENTE en los booleanos del DTO. | `solicitud-alta-list.html` / `directory/staff`. |
| RN-HRP-005 | Nivel 4 (Automatización/Filtro) | Todo manejador de eventos que notifique sobre bajas, vacantes o sueldos debe consultar al `IHrActionPolicyService` para filtrar los roles destinatarios. | Event Handlers en `Application/Moduls`. |

---

## 0.3 Pre-Mortem y Flujos Transaccionales

### Pre-Mortem (Riesgos)
1. **Riesgo:** Un Administrador guarda el ID de un puesto e intenta hacer un POST manual vía cURL para pedir una baja.
   * **Mitigación:** RN-HRP-001 inyecta un bloqueo 403 `Forbidden` a nivel Endpoint/AppService para las acciones de mutación.
2. **Riesgo:** Angular oculta la columna "Folio", pero el dato sigue viajando oculto en la pestaña Network del navegador.
   * **Mitigación:** RN-HRP-003 obliga a "limpiar" el campo en C# antes de devolver la respuesta HTTP.

### Flujos (Criterios de Paso)
1. **Lectura Sanitizada:** Un `GerenteAtencion` carga `/directory/staff`. El backend calcula sus permisos, le manda los booleanos en `false`, y borra los Folios del objeto JSON. Angular oculta los botones.
2. **Defensa Activa:** Un `Administrador` intenta modificar su sueldo. El `UpdateSalaryAsync` invoca la política, falla, y tira excepción de negocio.
3. **Notificación Limpia:** RRHH da de baja a un elemento. El EventHandler arma el correo. Consulta el PolicyService, el cual retira a los Administradores de la lista Bcc. RRHH y Sistemas reciben el correo; Operaciones no se entera prematuramente.

---

## 0.4 Actualización 2026-09-24 (decisión del dueño del módulo)

Origen: auditoría `docs/RecruitmentLuxuryApp/WorkPositions/20260924-auditoria-reclutamiento-work-positions.md` (DUDA-004 y RN-WP-010). La redacción original de RN-HRP-001 no coincidía con `HrActionPolicyService`, que ya modela un "anillo de autoridad"; este apartado fija la regla vigente.

### Autoridad estructural por rol (RN-HRP-001, vigente)

| Grupo | Roles | Autoridad estructural |
|---|---|---|
| Acceso total | `SuperUsuario`, `Direccion` | Total, sobre cualquier puesto |
| Autorizados | `RecursosHumanos`, `Reclutamiento`, `GerenteMantenimiento`, `SupervisionOperativa` | Total, sobre cualquier puesto |
| Restringidos (anillo operativo) | `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente` | Solo sobre puestos de terceros (fuera del anillo); **incluye editar el horario**. No pueden gestionarse ni verse entre ellos |
| Sin autoridad | Los 32 roles restantes del enum (entre ellos `Legal`, `CoordinacionLegal`, `SistemasGeneral`, `Mensajeria`, `Contador`, `Condomino`, `Proveedor`) | Ninguna (falla cerrado) |

### Alcance (aclaración de RN-HRP-001)
La regla aplica a **todas las mutaciones**, no solo a las solicitudes de baja, vacante y modificación salarial: alta, edición, baja lógica, reactivación, asignación, desasignación y horario del puesto (`WorkPositionAppService`). Las lecturas de horario y horas no exigen autoridad; las que devuelven sueldo o folio quedan bajo RN-HRP-003.

### Pendiente de implementación
- `Direccion` **no** está en `AuthorizedRoles` de `HrActionPolicyService` (ACC-018 de la auditoría).
- Las 7 mutaciones de `WorkPositionAppService` no invocan la política (ACC-002).
- Efecto colateral a revisar al incorporar `Direccion`: pasa a ver folios y sueldos, a poder editar el sueldo actual del empleado y a figurar en los destinatarios de RN-HRP-005.
