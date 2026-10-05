# Módulo de Reportes Dinámicos — Arquitectura e Implementación

**Sistema:** LuxuryApp ERP — Contabilidad Online
**Stack:** Angular 22 + Bootstrap 5 / .NET 10 (architecture by features)
**Fecha de actualización:** 2026-05-04 — Implementación completa hasta Fase 3 (parcial)

---

## Estado de Implementación Final

| Fase | Estado | Fecha |
|------|--------|-------|
| Fase 1 — MVP | **COMPLETADA** | 2026-04-22 |
| Fase 2 — Intermedia | **COMPLETADA** | 2026-04-23 |
| Fase 3 — Avanzada | **COMPLETADA (parcial)** | 2026-05-04 |

### Archivos Implementados (Estado Real)

**Backend (.NET):**

| Componente | Archivo | Ubicación |
|------------|---------|-----------|
| **Controlador** | `DynamicReportController.cs` | `DynamicReports/Controller/` |
| **Servicios Core** | `DynamicReportEngineService.cs` | `DynamicReports/Services/` |
| | `ReportDefinitionService.cs` | `DynamicReports/Services/` |
| **Resolutores** | `AccountFilterResolver.cs` | `DynamicReports/Services/` |
| | `PeriodValueExtractor.cs` | `DynamicReports/Services/` |
| | `FormulaEvaluatorService.cs` | `DynamicReports/Services/` |
| **Exportación** | `ReportPdfExportService.cs` | `DynamicReports/Services/` |
| | `ReportExcelExportService.cs` | `DynamicReports/Services/` |
| **Interfaces** | `IDynamicReportEngineService.cs` | `DynamicReports/Interfaces/` |
| | `IReportDefinitionService.cs` | `DynamicReports/Interfaces//` |
| **DTOs Clave** | `ReportDefinitionDTO.cs`, `ReportResultDTO.cs` | `DynamicReports/DTOs/` |
| | `AccountCatalogItemDTO.cs`, `ExecuteReportRequestDTO.cs` | `DynamicReports/DTOs/` |

**Frontend (Angular) — ruta base: `src/app/features/contabilidad/dynamic-reports/`:**

| Archivo | Ruta |
|---------|------|
| Modelos TypeScript | `models/report-definition.interface.ts` |
| Catálogo | `pages/report-catalog/report-catalog.ts/.html` |
| Builder | `pages/report-builder/report-builder.ts/.html` |
| Visor | `pages/report-viewer/report-viewer.ts/.html` |
| Guía de Ayuda | `pages/report-guide/report-guide.ts/.html` |
| Rutas | `src/app/routing/pages.routing.ts` (Nuevas rutas lazy-loaded) |

> **Nota:** Se eliminaron los servicios locales para utilizar directamente `ApiResponseService` inyectado en los componentes, eliminando lógica duplicada y siguiendo el estándar de arquitectura centralizada.

### Endpoints Finales — `api/dynamic-reports`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/customer/{customerId}` | Listado de reportes del cliente |
| GET | `/templates` | Plantillas globales reutilizables |
| GET | `/{id}` | Obtener definición completa por ID |
| POST | `/` | Crear nueva definición |
| PUT | `/{id}` | Actualizar definición existente |
| DELETE | `/{id}` | Soft delete (IsActive = false) |
| POST | `/execute` | Ejecutar reporte y obtener datos JSON |
| GET | `/accounts/{customerId}/{year}` | Catálogo de cuentas para autocomplete |
| POST | `/execute/pdf` | Ejecutar y descargar PDF (QuestPDF) |
| POST | `/execute/excel` | Ejecutar y descargar Excel (EPPlus) |

### Rutas Angular Implementadas

| Ruta | Componente |
|------|-----------|
| `/contabilidad/reportes` | `ReportCatalog` |
| `/contabilidad/reportes/nuevo` | `ReportBuilder` |
| `/contabilidad/reportes/editar/:id` | `ReportBuilder` |
| `/contabilidad/reportes/ver/:id` | `ReportViewer` |
| `/contabilidad/reportes/guia` | `ReportGuide` |

---

## 1. Análisis del Problema y Solución

El sistema ha evolucionado de un modelo de reportes hardcodeados a un **Motor Dinámico de Reporting**. 

### 1.1 Solución Adoptada
- **Desacoplamiento**: El frontend solo se encarga de la configuración visual (Builder). Toda la lógica contable, financiera y de cálculo reside en el backend.
- **Normalización**: Se utiliza un modelo de datos unificado (`ReportResultDTO`) que permite renderizar cualquier reporte (EPF, Resultados, Flujo de Caja) usando el mismo componente `ReportViewer`.
- **Persistencia Flexible**: Las definiciones se guardan como JSONB en PostgreSQL, permitiendo evolucionar la estructura del reporte sin cambios de esquema en la BD.

---

## 2. Motor de Cálculos y Reglas

### 2.1 Tipos de Renglón Soportados
- `account`: Suma de saldos de cuentas filtradas por prefijo, nivel o identificador único.
- `subtotal`: Suma/resta de valores de renglones previos dentro de la misma sección.
- `grandTotal`: Totales finales que pueden cruzar secciones.
- `formula`: Evaluadas dinámicamente mediante `FormulaEvaluatorService` usando NCalc.
- `header` / `spacer`: Elementos visuales de organización.

### 2.2 Resolución de Periodos
El sistema soporta extracciones dinámicas para:
- **Mensual**: Valor del mes solicitado.
- **Acumulado**: Sumatoria desde el inicio del año hasta el mes solicitado.
- **Anual**: Sumatoria de los 12 meses.
- **Presupuesto**: Comparativa contra datos de la tabla de presupuestos de Aspel.

---

## 3. Integración con Aspel

Se reutiliza el `ContabilidadOnlineLocalService` para el fetch de datos crudos. El motor dinámico transforma estos datos en un índice de búsqueda rápida (`Dictionary<string, AspelAccountDTO>`) para resolver los filtros definidos por el usuario en tiempo de ejecución.

**Optimización:** Se realiza un único fetch masivo por año/cliente, cacheando los resultados durante la ejecución del reporte para minimizar latencia.

---

## 4. Exportación y Presentación

- **PDF (QuestPDF)**: Generación de documentos en formato landscape, respetando sangrías (indents), negritas y estilos definidos en el builder.
- **Excel (EPPlus)**: Generación de libros con formato contable, permitiendo al usuario realizar análisis adicionales offline.
- **UI (Bootstrap 5 + catálogo `@ui/*`)**: Uso intensivo de `signals` para reactividad fluida en el builder y manejo de estados asíncronos en el visor.

---

## 5. Próximos Pasos (Fase 3 Continua)

- [ ] Comparativos entre años (requiere fetch de múltiples años).
- [ ] Periodos trimestrales automáticos.
- [ ] Integración con AI Auditor para sugerencias de diseño.

---
_Documento actualizado al cierre de implementación de Fase 2 y 3 (Mayo 2026)._
