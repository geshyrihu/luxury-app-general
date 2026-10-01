# Cuestionario de Descubrimiento: Módulo de Onboarding Checklist

## SECCIÓN 1: CONTEXTO DEL NEGOCIO

### P1.1: ¿Cuál es el problema que resuelve este módulo?

**Respuesta del Tech Lead:**
El módulo busca resolver la falta de retroalimentación y seguimiento entre Operaciones y Reclutamiento cuando un elemento de nuevo ingreso llega a sitio.
Actualmente se requiere un control estricto de acciones obligatorias (compra de uniforme, entrega de herramientas, capacitación, firma de contrato, etc.).

**Actores involucrados:**
- **Operaciones:** `Administrador`, `GerenteOperaciones`, `GerenteAtencion`. (Son los responsables de realizar la acción en sitio y marcarla como completada desde `/directory/staff`).
- **Reclutamiento:** Reciben retroalimentación y notificaciones cada vez que Operaciones marca un hito.
*(Nota: Almacén queda fuera del alcance por el momento).*

**Valor aportado:**
Asegurar mediante notificaciones y fechas límite que ningún empleado de nuevo ingreso se quede sin sus herramientas, capacitaciones o firmas esenciales, forzando a Operaciones a cumplir los hitos a tiempo.

## SECCIÓN 2: REGLAS DE NEGOCIO Y DATOS

### P1.2: Límites de tiempo y ubicaciones del catálogo

**Respuesta del Tech Lead:**
- **Estructura de Datos:** La entidad `ChecklistOptionCatalog` deberá ser modificada para incluir un campo de tiempo/Límite de SLA (ej. `TimeOnly` o cantidad de horas/días) que defina la fecha límite esperada para completar esa acción.
- **Trigger / Inicio del Reloj:** El contador de tiempo de estas tareas arranca exactamente en el momento en que **Reclutamiento concluye el Alta** del empleado.
- **Ubicación del Catálogo:** 
  - Backend: `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/`
  - Frontend: `client/angular/src/app/apps/admin.luxuryapp/catalogos-generales`
  - Router: Se inyectará en `admin-modules.ts`.

## SECCIÓN 3: FLUJOS Y UI

### P1.3: Asignación Dinámica por Roles y Modal UI

**Respuesta del Tech Lead:**
- **Asignación Dinámica (M:N):** El checklist NO es igual para todos. `ChecklistOptionCatalog` debe tener una relación Muchos-a-Muchos con `ApplicationRoleEnum`. De este modo, el sistema sabe que "Firma de contrato" aplica a todos, pero "Entrega de Radio" solo aplica a Guardias. Al hacer el Alta, solo se pre-poblan los checks que corresponden al Rol del nuevo empleado.
- **UI en Operaciones (`/directory/staff`):**
  - Existirá un ícono indicador con un label en la fila del empleado si tiene acciones pendientes.
  - Al hacer clic, se abre un **Modal** con el detalle de las acciones, sus fechas de vencimiento y marcadores (check/uncheck). También se incluye un `textarea` para guardar Notas.
- **Notificaciones (Idempotencia):** Al guardar el modal, solo se disparan notificaciones a Reclutamiento si **hubo un cambio real** en el estado de algún check. Si se guarda sin cambios, el sistema omite el ruido.

### P1.4: Auditoría en Segundo Plano (Hangfire)

**Respuesta del Tech Lead:**
- **Job Programado:** Correrá de Lunes a Viernes a las 9:00 a.m.
- **Regla de Cansancio (Anti-Spam):**
  - Notifica **1 día antes** de que venza.
  - Notifica **1 día después** de que venció.
  - Notifica **todos los días hábiles siguientes** hasta que sea completado por Operaciones.
