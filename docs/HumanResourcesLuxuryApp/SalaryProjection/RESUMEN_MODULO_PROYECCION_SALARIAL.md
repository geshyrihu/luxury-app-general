# Resumen del Módulo de Proyección Salarial

Este documento consolida los avances, reglas de negocio e implementaciones técnicas realizadas en el módulo de Proyección Salarial (Frontend y Backend).

## 1. Esquema Actual (Fotografía de Plantilla)
El "Esquema Actual" representa el costo nominal en tiempo real de la nómina ocupada.

### Reglas de Negocio
- **Solo Lectura Estricta:** El "Esquema Actual" es un reflejo de la base de datos operativa. No permite edición manual de sueldos, agregar plazas nuevas ni eliminar registros manualmente a través de la interfaz.
- **Filtro de Plazas:** Solo se incluyen plazas que cumplan TRES condiciones:
  1. `State == State.Activo`
  2. Tengan un empleado asignado (`EmployeeId != null`) - Las vacantes NO se incluyen en la proyección del gasto actual.
  3. Tengan un rol/título definido (`ApplicationRoleId != null`).
- **Sincronización Automática (Auto-Refresh):** Cada vez que un usuario consulta un folio que empieza con "Esquema Actual", el backend intercepta la petición `GetByIdAsync`, elimina silenciosamente el Escenario Base temporal y lo vuelve a construir consultando las tablas de recursos humanos (`JobPositions`, `Employees`), asegurando que siempre se muestre la fotografía real actualizada de la empresa.

### Implementación Técnica
- **Backend:** `SalaryProjectionsAppService.GetByIdAsync` maneja la recarga. Se implementó un bloque `try-catch (DbUpdateConcurrencyException)` para evitar errores de llave duplicada causados por peticiones GET concurrentes desde el frontend (debido a guards/resolvers o Angular Strict Mode).
- **Backend:** `SalaryProjectionsAppService.BuildBaseScenarioAsync` aplica los filtros mencionados.
- **Frontend:** La señal `isEditable` en `salary-projections-detail.ts` evalúa `!projection.name.startsWith('Esquema Actual')`. Cuando es falso, se ocultan los botones de Guardar, Agregar Plaza y se deshabilitan las celdas y paneles laterales.

## 2. Creación y Edición de Nuevas Propuestas (Ajustes Salariales)
Cuando el usuario desea proyectar un aumento o ajuste, se debe usar una propuesta nueva separada del "Esquema Actual".

### Reglas de Negocio
- **El Escenario Base es Sagrado:** Dentro de una nueva proyección (ej. "Ajuste Nov 2026"), el escenario de índice 0 ("Escenario Base") se clona directamente de la fotografía operativa. Este escenario sirve **únicamente como espejo de comparación**. A nivel interfaz (HTML) y lógica, está estrictamente bloqueado para evitar alteraciones accidentales.
- **Auto-generación de Escenario Editable:** Dado que el Escenario Base es intocable, al crear una nueva proyección desde el modal, el backend genera automáticamente un segundo escenario clonado llamado **"Propuesta 1"**.
- **Flujo de Trabajo del Usuario:** 
  1. El usuario crea la proyección.
  2. Abre la vista de detalle.
  3. Visualiza la tabla con los dos escenarios lado a lado (Base vs Propuesta 1).
  4. Haz clic en la fila correspondiente a "Propuesta 1" para modificar únicamente el `Sueldo mensual neto` en el panel lateral.
  5. Al hacer clic en "Aplicar y Simular", la interfaz recalcula en tiempo real impuestos (ISN), cargas patronales (IMSS, RCV, Infonavit), primas y aguinaldo.

### Implementación Técnica
- **Backend:** En `SalaryProjectionsAppService.CreateAsync`, si la petición no incluye escenarios adicionales, el backend inyecta `initialProposal` ("Propuesta 1") copiando los datos del base para proveer un lienzo editable de inmediato.
- **Frontend:** La plantilla `salary-projections-detail.html` evalúa `scenario.name !== 'Escenario Base'` antes de renderizar los botones de lápiz (edición) o papelera (eliminación), y antes de habilitar el evento `(click)` en las celdas de la tabla.
- **Frontend:** El botón superior de "Agregar plaza nueva" se bloquea dinámicamente (`[disabled]="activeScenario()?.name === 'Escenario Base'"`) para forzar que el usuario seleccione "Propuesta 1" si desea simular un nuevo puesto.

## 3. Consideraciones Pendientes o Bugs Conocidos
- **Caché en Navegador / Angular:** En ocasiones, si se actualiza la lógica del backend mientras el usuario tiene la pestaña abierta, el estado de la proyección puede desincronizarse o no mostrar el segundo escenario ("Propuesta 1"). Se recomienda limpiar la propuesta e iniciar de nuevo en caso de errores residuales en la vista.
- **Renderizado de la Tabla:** La vista es plana por escenario (18 columnas). El footer usa `colspan="4"` para "TOTALES", 3 celdas vacías y 11 columnas numéricas; `emptymessage` usa `colspan="18"`. Si se agregan o quitan columnas, debe actualizarse la plantilla HTML y estos `colspan` en sincronía.
- **Pendiente — eliminar `SalaryProjectionItem.DateAdmission`:** campo snapshot de la fecha de ingreso.
  La UI ya lee `Employee.DateAdmission` en vivo (vía `MapToDTO`). Se conserva solo como fallback.
  Tarea futura: quitar la columna con migración EF cuando no haya datos/consumidores que la usen.
- **Resuelto — Cuotas patronales (RCV / INFONAVIT / IMSS):** Ya no son estáticas ni `0`. Se implementó el motor de simulación con parámetros dinámicos anualizados (`SocialSecurityParameter`), una interfaz de administración de prima de riesgo por cliente (`/hr/salary-projections-risk-premium`), y las cuotas se calculan sobre el Salario Base de Cotización (SBC) topado a 25 UMAs, considerando los topes y cuotas progresivas (como el aumento progresivo en Cesantía y Vejez). Se visualizan dinámicamente a través de `SalaryProjectionItemSimulationDTO` en el frontend.
- **Pendiente — flags del puesto (`Aguinaldo` / `Vacaciones`):** hoy aparecen en `false` en puestos existentes (probable default de migración) pero deben ser `true`; el motor los calcula igual. Revisar/corregir el dato.
