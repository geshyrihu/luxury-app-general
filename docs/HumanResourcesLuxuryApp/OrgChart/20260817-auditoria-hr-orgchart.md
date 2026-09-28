# Auditoría de Organigrama (EmployeeOrgChart)

**Fecha:** 2026-08-17
**Módulo:** RecursosHumanosLuxuryApp / Expediente del Empleado (Org Chart)
**Analista:** Antigravity

## 1. Resumen Ejecutivo
Se ha realizado una auditoría exhaustiva del flujo de Organigrama (`org-chart.ts` en el frontend y `WorkPositionOrgChartAppService.cs` en el backend). El módulo presenta una arquitectura moderna, basada en Signals (Angular 17+) y Entity Framework Core con transacciones robustas. En términos generales, cumple con un alto estándar de calidad, aunque se identifican áreas menores de mejora técnica y de cumplimiento estricto con las convenciones vigentes.

## 2. Visión Funcional
El organigrama permite la visualización jerárquica de los puestos de trabajo de un cliente específico, y la edición gráfica de la estructura (reubicación de nodos, cambio de jefe, reordenamiento) mediante drag & drop, restringido a usuarios con el rol `SuperUsuario`.

## 3. Hallazgos en Frontend (`org-chart.ts` / `.html` / `.interfaces.ts`)

### Puntos Fuertes:
- **Estado y Reactividad:** Implementación excelente de Angular 17+ usando `signal`, `computed` y `effect`. Uso correcto de `ChangeDetectionStrategy.OnPush`.
- **Estructura de Plantillas:** Uso correcto del nuevo control flow (`@if`, `@for`).
- **Accesibilidad:** Uso de `aria-live`, `aria-label`, y atributos enfocables (`tabindex`).
- **Iconografía:** Uso correcto de `<app-icon>` en lugar de implementaciones legacy.
- **Componentes Base:** Uso de los componentes del Design System (`lx-sidebar`, `lx-tabs`, `lx-avatar`, `lx-tag`, `il-button`).

### Áreas de Mejora (Deuda Técnica / Observaciones):
- **Violación de Tokens (Colores Hardcodeados en JS):** En `org-chart.interfaces.ts`, los mapas `DEPTO_BORDER_COLORS` usan clases de Tailwind (`border-blue-500`) y `DEPTO_ACCENT_COLORS` usa literales HEX (`#3b82f6`). Según la convención *Design Tokens Rule (RN-DS-041)*, los colores dinámicos deben inyectarse mediante variables CSS / Tokens del Design System en vez de literales HEX quemados.
- **Validación del Drag & Drop:** Al reordenar filas, Angular confía en eventos nativos `dragstart`/`drop`. Se deben asegurar flujos para usuarios sin mouse o trackpad avanzado, aunque existe funcionalidad de botones "Subir", "Bajar", "A raíz" en la tabla, mitigando este impacto.

## 4. Hallazgos en Backend (`WorkPositionOrgChartAppService.cs` / Endpoints)

### Puntos Fuertes:
- **Transaccionalidad:** El método `ReassignAsync` envuelve los cambios estructurales en un `BeginTransactionAsync`, asegurando que `OrgHierarchy` no quede corrupto.
- **Validación de Ciclos:** El algoritmo `WouldCreateCycleAsync` (BFS) evita correctamente referencias circulares (Ej: un puesto no puede reportar a su propio subordinado).
- **Recálculo en Cascada:** La lógica de `RecalculateLevelsAsync` y la normalización en `NormalizeSiblingOrders` reindexan los niveles y posiciones eficientemente.
- **Logging y Metadata:** El endpoint en `WorkPositionOrgChartEndPoints.cs` tiene anotado correctamente `LogActivityMetadata`, y el servicio usa `ILogger` adecuadamente en caso de errores en la transacción.

### Áreas de Mejora (Deuda Técnica / Observaciones):
- **Carga Eager (N+1 mitigado pero pesado):** En `GetTreeAsync`, se hace `.Include(wp => wp.ApplicationRole).Include(wp => wp.Employee).ThenInclude(e => e.User)`. Con organigramas grandes, esta proyección puede traer muchos datos (fotos, datos extra) a memoria. Recomendación futura: proyectar directo a un DTO mediante `.Select()`.
- **Paginación / Filtros:** `GetTreeAsync` retorna toda la organización. Para clientes muy grandes, esto puede saturar la carga inicial (aunque Graph requiere cargar la estructura, es necesario tener cuidado con el volumen de datos de usuario).

## 5. Matriz de Reglas de Negocio Verificadas
- **RN-NIVEL 1 (Invariante):** Un nodo no puede reportarse a sí mismo ni a un descendiente (Evita ciclos infinitos). ✅ Confirmado en Backend.
- **RN-NIVEL 2 (Flujo):** Reordenamiento de nodos hermanos reasigna el índice de ordenamiento (SortOrder) preservando un estado continuo sin saltos. ✅ Confirmado en Backend (`NormalizeSiblingOrders`).
- **RN-NIVEL 3 (Seguridad):** Sólo el rol `SuperUsuario` puede ver la pestaña "Editar" y realizar cambios de estado en Frontend. En backend, la ruta requiere autorización pero no se valida explícitamente el rol dentro del `AppService`. ⚠️ **Observación:** Frontend lo restringe, pero si se llama al API por Postman, no hay un `[Authorize(Roles="SuperUsuario")]` evidente en el Endpoint, lo cual es una vulnerabilidad potencial.
- **RN-NIVEL 4 (Validación):** El arrastre a "Raíz" significa un `ReportsTo = null`. ✅ Confirmado (envía nulo a backend y lo procesa correctamente).

## 6. Checklist de Validación y Plan de Remediación

**Prioridad Alta (Seguridad):**
- [ ] **Endpoint Authorization:** Verificar e implementar la validación del rol `SuperUsuario` en el endpoint `PATCH api/work-position-org-chart/reassign`, ya que actualmente depende únicamente del control en el Frontend.

**Prioridad Media (UX / Tokens):**
- [ ] **Tokens de Diseño:** Refactorizar `DEPTO_ACCENT_COLORS` para que consuma tokens `--ds-*` o `--color-department-*` inyectados vía CSS nativo en el elemento `svg`, para asegurar que reaccionen adecuadamente a los cambios de tema claro/oscuro de acuerdo con RN-DS-040.

**Prioridad Baja (Optimización):**
- [ ] **Proyección SQL:** En `GetTreeAsync`, en lugar de cargar las entidades completas con `.Include()`, emplear `.Select(wp => new WorkPositionOrgChartNodeDto { ... })` para reducir drásticamente el uso de memoria RAM en el servidor para clientes muy grandes.
