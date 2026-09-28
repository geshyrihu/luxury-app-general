# Plan de Implementación: Módulo de Onboarding Checklist

**Estado:** Borrador (Pendiente de aprobación)
**Módulo:** Recursos Humanos / Reclutamiento / Operaciones
**Autor:** Antigravity Arquitecto

---

## 1. Resumen Ejecutivo
Implementar un sistema de seguimiento de *Onboarding* con asignación dinámica por Rol, control estricto de SLA (Service Level Agreement), y auditoría automática para asegurar que Operaciones cumpla con las entregas de herramientas y firmas a los empleados de nuevo ingreso.

## 2. Objetivo
Evitar cuellos de botella y omisiones en el alta de personal, garantizando que cada Rol reciba exactamente lo que necesita en tiempo y forma, y que Reclutamiento tenga visibilidad en tiempo real sin saturarse de notificaciones innecesarias.

## 3. Alcance
- Modificación del esquema de base de datos para soportar M:N con Roles y métricas de SLA.
- Modificación del flujo de "Alta de Empleado" para pre-poblar checklists.
- Creación del Job de Hangfire para auditoría diaria.
- Modificación del panel administrativo (Catálogos) y del panel de Operaciones (Staff).

## 4. Restricciones
- **Días Hábiles:** El Job y el cálculo de fechas límite ignorarán estrictamente Sábados y Domingos.
- **Roles:** El catálogo se limitará estrictamente al uso de `ApplicationRoleEnum`.

---

## 5. FASES DE IMPLEMENTACIÓN

### FASE 1: Migración Estructural de Datos (Backend M:N)
**Complejidad:** S (Pequeña)
1. **Entidad `ChecklistOptionCatalog`:** Agregar la propiedad `int DiasSla` (cuántos días hábiles tienen para cumplirlo).
2. **Nueva Entidad `ChecklistOptionRole` (M:N):** Crear una tabla pivote para vincular `ChecklistOptionCatalogId` con `ApplicationRoleEnum Role`.
3. **Entidad `EmployeeOnboardingChecklist`:** Agregar la propiedad `DateTime Deadline` (para congelar el cálculo de la fecha límite en el momento de la creación).
4. **Migración EF:** Generar y aplicar la migración (`dotnet ef migrations add`). *Tipo: Reversible*.

### FASE 2: Backend Core (El Disparador y el API)
**Complejidad:** M (Media)
1. **CRUD del Catálogo:** Actualizar `ChecklistOptionCatalogAppService` para recibir y guardar la lista de roles (`List<ApplicationRoleEnum>`) y los `DiasSla`.
2. **Trigger del Alta (`ProcessHiringAppService`):**
   - Interceptar el momento exacto en que un empleado pasa a estatus Activo.
   - Consultar el catálogo filtrando por el `Role` del empleado.
   - Insertar los registros en `EmployeeOnboardingChecklist` calculando el `Deadline` (`Fecha Actual + DiasSla`, omitiendo fines de semana).
3. **API de Operaciones:**
   - Crear endpoint para obtener el checklist de un empleado.
   - Crear endpoint `UpdateChecklistAsync` con la lógica de **Idempotencia**: Si `IsCompleted` o `Notes` no cambian, retornar `true` sin enviar notificaciones.

### FASE 3: El Policía de Tiempo (Job Hangfire)
**Complejidad:** M (Media)
1. **Clase `OnboardingChecklistSlaJob`:** 
   - CRON: `0 9 * * 1-5` (L-V a las 9 AM).
   - Consulta: `WHERE IsCompleted == false`.
   - Lógica de Anti-Spam: Disparar notificación (a Operaciones) SOLO SI la fecha actual coincide con `Deadline - 1 día hábil`, `Deadline + 1 día hábil`, o si `Fecha Actual > Deadline` (lunes a viernes).

### FASE 4: Interfaces de Usuario (Angular)
**Complejidad:** L (Grande)
1. **Admin UI (`catalogos-generales`):**
   - Modificar formulario para agregar input numérico `DiasSla` y un MultiSelect para `Roles`.
2. **Staff UI (`/directory/staff`):**
   - Agregar ícono en la fila de la tabla si el empleado tiene tareas pendientes.
   - Construir el **Modal de Onboarding**: Lista de tareas, check (toggle), badge con `Deadline` (rojo si está vencido, verde si está a tiempo), y el `textarea` para `Notes`.
   - Lógica de guardado que envíe solo los checks modificados y despliegue SweetAlert de éxito.

---

## 6. Riesgos y Contingencias
- **Riesgo:** Desincronización horaria (Timezones) en el cálculo del Job de Hangfire.
  - **Mitigación:** Asegurar que `Deadline` y `DateTime.Now` operen estandarizados (UTC o Local configurado explícitamente en el Job).

## 7. Criterios de Paso (Done)
- Ninguna notificación se dispara si se guarda el modal sin cambios reales.
- El Job ignora sábados y domingos.
- Las tareas asignadas a un "Guardia" al darle de alta no incluyen "Laptop" (si Laptop es solo para Administrativos).
