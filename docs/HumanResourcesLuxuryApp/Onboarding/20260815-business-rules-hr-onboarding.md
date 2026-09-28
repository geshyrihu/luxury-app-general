# FASE 0: Análisis de Reglas de Negocio (Onboarding Checklist)

## 0.1 Problem Statement & KPIs

### El Problema
Actualmente existe una desconexión operativa entre Reclutamiento y Operaciones una vez que un empleado nuevo ingresa a sitio. La falta de retroalimentación sistemática provoca que entregables críticos (herramientas, uniformes, capacitación, firmas) se retrasen, queden en el olvido, o que Reclutamiento no se entere si el proceso se completó en sitio.

### KPIs de Éxito
1. **Reducción de Tareas Expiradas (SLA)**
   - **Baseline:** Desconocido / Tareas manuales sin rastreo.
   - **Target:** 95% de las tareas de onboarding completadas dentro de la fecha límite (SLA).
   - **Timeline:** Medible 30 días post-lanzamiento.
   - **Verificación:** Dashboard SQL consultando `EmployeeOnboardingChecklist` donde `CompletedAt <= Deadline`.

2. **Cero Ruido (Idempotencia y Anti-Spam)**
   - **Baseline:** Exceso de correos/mensajes directos redundantes.
   - **Target:** 100% de las notificaciones push/email del módulo corresponden exclusivamente a un cambio de estado real o una alerta de vigencia legítima (T-1, T+1, T+N).
   - **Timeline:** Desde el Día 1.
   - **Verificación:** Logs del Job de Hangfire cruzados contra fechas de caducidad.

3. **Precisión de Roles (Cero Checklists Basura)**
   - **Baseline:** Todos reciben las mismas instrucciones genéricas.
   - **Target:** 0 incidencias de un empleado recibiendo una tarea de catálogo que no le corresponda a su Rol.
   - **Timeline:** Desde el Día 1.
   - **Verificación:** Cruce de `EmployeeOnboardingChecklist` vs `ApplicationRoleEnum`.

---

## 0.2 Matriz de Reglas de Negocio (4 Niveles)

| ID | Nivel | Regla de Negocio | Código/Ubicación Afectada |
|---|---|---|---|
| RN-ONB-001 | Nivel 1 (Validación) | La tabla pivote `EmployeeOnboardingChecklists` no permite duplicidad entre Empleado y Tarea. Un mismo empleado no puede tener asignada la misma tarea dos veces. | `ApplicationDbContext.cs` (Índice Único existente). |
| RN-ONB-002 | Nivel 2 (Datos e Inter-Entidades) | El catálogo global de tareas (`ChecklistOptionCatalogs`) debe estar vinculado a `ApplicationRoleEnum` (M:N) y poseer un tiempo límite en días (`DiasSla`). | `ChecklistOptionCatalog.cs` (Agregar navegación `Roles` y propiedad `DiasSla`). |
| RN-ONB-003 | Nivel 2 (Estados y Triggers) | El cronómetro del SLA arranca **exactamente** en el momento en que Reclutamiento ejecuta el "Alta" del empleado, insertando en ese instante las tareas que crucen con su Rol. | `ProcessHiringAppService.cs` (o donde viva el Alta) → Llama al servicio de Onboarding. |
| RN-ONB-004 | Nivel 3 (Reglas Condicionales) | En el frontend, al oprimir "Guardar" en el Modal, el payload solo enviará notificaciones a Reclutamiento si el estado `IsCompleted` o `Notes` cambió respecto a la BD. Idempotencia pura. | `employee-onboarding-form.ts` / `OnboardingAppService.cs`. |
| RN-ONB-005 | Nivel 4 (Automatización) | Un job de Hangfire correrá Lunes a Viernes a las 09:00 a.m. para barrer las tareas pendientes. | `OnboardingChecklistSlaJob.cs`. |
| RN-ONB-006 | Nivel 4 (Automatización / Spam) | Regla estricta de notificaciones del Job: Solo se alerta 1 día antes del vencimiento (T-1), 1 día después (T+1), y diariamente en días hábiles (T+N) si sigue vencido. | `OnboardingChecklistSlaJob.cs` (Lógica de filtrado de fechas contra el SLA). |

---

## 0.3 Pre-Mortem y Flujos Transaccionales

### Pre-Mortem (Identificación Temprana de Riesgos)
1. **Riesgo:** El Job de Hangfire evalúa fines de semana y alerta a Gerentes el sábado a las 9am.
   * **Mitigación:** La expresión CRON será `0 9 * * 1-5` (L-V 9:00 AM) y el cálculo de "T-1" o "T+1" deberá considerar días hábiles (ignorar S/D al calcular la diferencia de días).
2. **Riesgo:** Un administrador edita el Catálogo Global y le quita el Rol "Guardia" a una tarea que ya estaba asignada a 50 guardias.
   * **Mitigación:** Los cambios en el catálogo M:N solo afectan a las ALTAS FUTURAS, preservando la integridad histórica en la tabla `EmployeeOnboardingChecklist`.
3. **Riesgo:** Operaciones entra al modal de un empleado y le da "Guardar" compulsivamente sin cambiar nada, inundando a Reclutamiento de notificaciones.
   * **Mitigación:** (RN-ONB-004) El AppService validará el Diff. Si no hay cambios de estado, realiza un `return` temprano y suprime el servicio de emails/push.

### Flujos (Criterios de Paso)
1. **Flujo de Inicialización (El Alta):**
   - **Trigger:** Reclutamiento aprueba el ingreso.
   - **Paso:** El sistema lee el `ApplicationRoleEnum` del nuevo empleado, busca en `ChecklistOptionCatalog` qué tareas coinciden con ese rol, e inserta registros en `EmployeeOnboardingChecklist` con `Deadline = FechaAlta + DiasSla`.
2. **Flujo Operativo (Gestión Diaria):**
   - **Trigger:** El Gerente de Operaciones ve el ícono de alerta en `/directory/staff` y abre el modal.
   - **Paso:** Marca "Entrega de Uniforme" y anota "Talla M". Guarda. Reclutamiento recibe Push Notification.
3. **Flujo de Auditoría (El Policía):**
   - **Trigger:** Lunes 9:00 a.m. Hangfire Job.
   - **Paso:** Encuentra que la "Firma de contrato" venció el viernes (T+1). Dispara correo a Operaciones exigiendo resolución.
