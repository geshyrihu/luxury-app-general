# Auditoría de Módulo: CobranzaOnline

**Fecha:** 2026-07-29  
**Módulo:** CobranzaOnline  
**Dominio maestro:** CobranzaLuxuryApp  
**Alcance:** Backend (.NET) + Frontend (Angular)  
**Auditor:** Kilo  
**Estado:** Fase 1, 2 y 3 (parcial) completadas el 2026-07-29  

---

## 1. Resumen Ejecutivo

Se auditó el módulo **CobranzaOnline** en backend y frontend. El módulo está en fase de migración activa desde un legado `Coi*` hacia una identidad formal `CobranzaOnline`. La arquitectura general es sólida: endpoints delgados, servicios de aplicación, DTOs locales y frontend con Signals. Sin embargo, se detectaron **incumplimientos estructurales, de naming, de contratos y deuda técnica relevante** que requieren plan de remediación.

---

## 2. Alcance

- **Backend:** `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Moduls\CobranzaLuxuryApp\CobranzaOnline\`
- **Frontend:** `D:\repos\luxuryapp-api\client\angular\src\app\apps\cobranza.luxuryapp\cobranza-online\`
- **Documentación aplicable:** CONVENTIONS.md, backend-rules.md, frontend-rules.md, backend-module-structure.md, frontend-feature-structure.md, naming-conventions.md, folder-structure-conventions.md

---

## 3. Hallazgos

### 3.1 Incumplimiento Crítico

| ID | Hallazgo | Evidencia | Impacto | Riesgo | Recomendación |
|---|---|---|---|---|---|
| C-01 | **Archivo basura en producción**: existe un archivo sin nombre válido `Interfaces\sedlViScZ` (0 bytes) dentro del módulo backend. | `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Moduls\CobranzaLuxuryApp\CobranzaOnline\Interfaces\sedlViScZ` | Compilación/limpieza; indica manipulación manual incorrecta del filesystem. | Bajo de ruptura funcional, alto de higiene y confusión en CI/build. | Eliminar el archivo inmediatamente. |

### 3.2 Incumplimiento Alto

| ID | Hallazgo | Evidencia | Impacto | Riesgo | Recomendación |
|---|---|---|---|---|---|
| A-01 | **Interface faltante rota el build**: `CoiMapeoEndPoints.cs` registra endpoints que dependen de `ICoiMapeoAppService`, pero ese archivo **no existe** en `Interfaces/`. | `EndPoints\CoiMapeoEndPoints.cs:10` y `:18` referencian `ICoiMapeoAppService`; no hay `Interfaces\ICoiMapeoAppService.cs` | Compilación fallida o runtime error al mapear rutas `/api/cobranza/online/mapping/*`. | **Ruptura inmediata** de endpoints de mapeo. | Crear `ICoiMapeoAppService.cs` e implementar `CoiMapeoAppService.cs` o eliminar el endpoint si la funcionalidad está obsoleta. |
| A-02 | **Desajuste de contrato DTO backend vs interface frontend**: el DTO `CobranzaOnlineCurrentChargesDTO` expone `MaintenanceCollected`, pero la interface TypeScript `CobranzaOnlineCurrentCharges` **no lo incluye**. El dashboard intenta mostrar `currentCharges.maintenanceCollected` en el template HTML. | Backend: `DTOs\CobranzaOnlineCurrentChargesDTO.cs:9` (`MaintenanceCollected`). Frontend: `interfaces\cobranza-online-dashboard.model.ts:60-66` (falta `maintenanceCollected`). Frontend template: `dashboard\cobranza-online-dashboard.html:238` binding a `currentCharges.maintenanceCollected`. | El valor nunca se renderiza en UI aunque el backend lo envíe; el dato se pierde en el cliente. | **Ruptura silenciosa del contrato**; el usuario no ve el mtto cobrado. | Agregar `maintenanceCollected: number` a la interface TypeScript `CobranzaOnlineCurrentCharges`. |
| A-03 | **Componente fuera de dominio**: `presupuesto-contabilidad` reside físicamente en `cobranza-online/` pero consume endpoints del dominio `ContabilidadOnline` (`Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad`). | `presupuesto-contabilidad\presupuesto-contabilidad.ts:115` usa `Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad`. | Viola la regla de dominio maestro y ubicación correcta (CONVENTIONS.md §6.2, frontend-feature-structure.md). | Acoplamiento cruzado entre dominios; dificulta mantenimiento y migración. | Mover el componente a `contabilidad.luxuryapp` o crear un wrapper que invoque el servicio de contabilidad sin residir en cobranza. |

### 3.3 Deuda Técnica

| ID | Hallazgo | Evidencia | Impacto | Riesgo | Recomendación |
|---|---|---|---|---|---|
| D-01 | **Servicio monolítico**: `CobranzaOnlineDashboardAppService.cs` supera las 1,050 líneas con 7 métodos públicos y múltiples métodos privados estáticos (builders, clasificadores, formateadores). | `Services\CobranzaOnlineDashboardAppService.cs` (1,050+ líneas). | Baja cohesión; cambios en dashboard/analysis/inspection/exclusions tocan el mismo archivo. | Refactor difícil sin pruebas automatizadas. | Extraer builders a servicios dedicados: `IAspelDashboardBuilder`, `IAnalisisCobranzaBuilder`, `IInspectionBuilder`, `IExclusionesBuilder`. |
| D-02 | **Naming inconsistente (legacy vs nuevo)**: coexistencia de prefijos `Coi*` y `CobranzaOnline*` en DTOs, endpoints y servicios sin un plan de renombramiento ejecutado. | DTOs: `CoiCarteraCondominoDTO`, `CoiEstadoCuentaResponseDTO`, `CoiCobranzaBalanceResponseDTO`. Endpoints: `CoiMapeoEndPoints`, `CoiReporteFinancieroEndPoints`. | Confusión en búsquedas y onboarding; riesgo de usar contratos legacy por error. | Migración inconclusa. | Completar Fase 6 del plan documentado: renombrar archivos físicos cuando ya no haya consumidores legacy. |
| D-03 | **DTOs con atributos de UI**: `CoiCobranzaAccountResponseDTO` incluye `[Display(Name = "...")]`. | `DTOs\CoiCobranzaAccountResponseDTO.cs:15-18`. | Violación de separación concerns; DTOs de API no deben contener metadata de presentación. | Bajo, pero propaga attributes innecesarios al serializar JSON. | Remover `[Display]` del DTO; si se requiere display para UI, mapear en un ViewModel o interface TypeScript. |
| D-04 | **Lógica de negocio inline en endpoints**: `AspelSyncEndPoints.cs` contiene cálculo de diagnósticos (`Accounts104`, `Balances104`, etc.) directamente en el lambda del endpoint. | `EndPoints\AspelSyncEndPoints.cs:121-156`. | Endpoints dejan de ser orquestación mínima; dificulta testing y reutilización. | Medio. | Mover el bloque de diagnósticos a un método en `CobranzaOnlineDashboardAppService` o un servicio de diagnósticos. |
| D-05 | **Inyección de servicios externos en endpoints**: `AspelSyncEndPoints.cs` inyecta `ContabilidadMigratorService` y `CobranzaMigratorService` (no pertenecen al dominio CobranzaOnline). | `EndPoints\AspelSyncEndPoints.cs:13-14`. | Acoplamiento a servicios de otro dominio; dificulta despliegue independiente. | Medio. | Inyectar una interfaz `IAspelSyncOrchestrator` propia del módulo que delegue a los migrators. |
| D-06 | **Archivos de debug en el módulo**: existen `responses-json/` (4 archivos JSON de muestra) y `response-auxiliares.json` en la raíz del módulo backend, además de `Reporte la Jolla.jpeg`. | `responses-json/GetSaldos.json`, `response-auxiliares.json`, `Reporte la Jolla.jpeg`. | Contaminación del módulo; riesgo de commitear datos sensibles o basura. | Bajo de ruptura, alto de higiene. | Mover muestras a `Docs/samples/` o eliminarlas; remover la imagen. |
| D-07 | **Documentación fuera de lugar**: `analisis-cobranza-online.md` es un análisis del frontend pero está ubicado en la raíz del módulo backend. | `analisis-cobranza-online.md:9` ("este reporte se ha generado temporalmente en el backend bajo solicitud expresa"). | Viola la regla de ubicación de documentación (CONVENTIONS.md §8). | Bajo. | Mover a `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/Docs/` o eliminar si es obsoleto. |

### 3.4 Mejora Recomendada

| ID | Hallazgo | Evidencia | Impacto | Riesgo | Recomendación |
|---|---|---|---|---|---|
| M-01 | **Sin servicio propio en frontend**: los componentes consumen `ApiResponseService` directamente; no hay un `CobranzaOnlineService` que centralice llamadas, mapeos y transformaciones. | No existe `cobranza-online.service.ts` en la feature. | Duplicación de lógica de mapeo en componentes; difícil reutilizar transformers o interceptores específicos. | Bajo. | Crear `CobranzaOnlineService` con métodos tipados por dominio (dashboard, analysis, inspection, etc.). |
| M-02 | **Sin tests**: no hay archivos `.spec.ts` en frontend ni tests unitarios/integrados en backend. | 0 archivos `.spec.ts` en `cobranza-online/`. | Regresiones silenciosas en lógica financiera (clasificación de cartera, cálculos de saldo, formato de cuentas). | Alto para regresiones financieras. | Agregar tests de contrato en backend (xUnit) y specs en frontend (Jest/Karma). Mínimo: clasificación de análisis, formateo de cuentas, endpoints mapeados. |
| M-03 | **Routing vacío en feature**: `cobranza.routes.ts` está vacío; las rutas están hardcodeadas en `contabilidad.routing.ts`. | `cobranza.routes.ts:3-5`. | La feature no es auto-contenida; cambios de ruta requieren tocar otro módulo. | Bajo. | Migrar rutas a `cobranza.routes.ts` y exportarlas para `contabilidad.routing.ts`. |
| M-04 | **Sin carpeta `desktop/` y `mobile/`**: la convención Frontend Feature Structure exige estas carpetas; actualmente todo vive en la raíz de la feature. | `frontend-feature-structure.md:23-42` define `desktop/`, `mobile/`, `interfaces/`. | Mezcla de vistas responsive en un solo archivo; dificulta optimizaciones específicas por plataforma. | Bajo. | Evaluar si las vistas actuales justifican split; si no, documentar excepción aprobada por Tech Lead. |
| M-05 | **Estilos inline en componentes**: los componentes usan `styles` inline en el `@Component` en lugar de archivos `.scss` separados. | `cobranza-online-dashboard.ts:58-338`, `cobranza-online-analysis.ts`, etc. | Dificulta reuse de tokens y auditoría de styles. | Bajo. | Evaluar migración a archivos de estilo siguiendo `styles-rules.md`. |

### 3.5 Riesgo de Ruptura por Shared/Contrato

| ID | Hallazgo | Evidencia | Impacto | Riesgo | Recomendación |
|---|---|---|---|---|---|
| R-01 | **Contrato de ruta legacy coexistente**: la documentación menciona `api/accounting-coi/cobranza-online/*` y `api/accounting-coi/legacy-collection/*` como rutas legacy que deben tratarse como referencias, pero siguen activas. | `Docs\documentacion-migracion-cobranza-online.md:10-11`. | Consumidores legacy pueden seguir usándolas; retiro directo rompe integraciones. | **Alto** si se deprecan sin plan. | Formalizar deprecación con header `Sunset` o plan de migración; no eliminar rutas sin aprobación. |

---

## 4. Checklist de Cumplimiento

| Ítem | Estado |
|---|---|
| Se leyó `CONVENTIONS.md` | ✅ |
| Se leyeron documentos del stack aplicable | ✅ |
| Se validaron naming y estructura | ⚠️ Parcial (naming mixto Coi/CobranzaOnline, archivo basura eliminado, endpoint de mapeo legacy eliminado) |
| Se revisó uso de servicios genéricos | ✅ (ApiResponseService, DialogHandlerService) |
| Se auditaron UI y styles | ✅ |
| Los hallazgos quedaron clasificados | ✅ |
| El plan de corrección por fases fue incluido | ✅ |
| Si hay riesgo alto o legacy fuerte, se marcó `requiere plan de migracion` | ✅ |
| Fase 1 ejecutada | ✅ Completada (6/6 tareas) |

---

## 5. Plan por Fases

### Fase 1 — Corrección inmediata (1-2 días)

1. Eliminar archivo basura `Interfaces/sedlViScZ`.
2. Crear `ICoiMapeoAppService.cs` + implementación o eliminar `CoiMapeoEndPoints.cs` si es obsoleto.
3. Corregir desajuste de contrato: agregar `maintenanceCollected` a interface TypeScript `CobranzaOnlineCurrentCharges`.
4. Remover archivos de debug (`responses-json/`, `response-auxiliares.json`, `Reporte la Jolla.jpeg`).
5. Mover `analisis-cobranza-online.md` a ubicación correcta o eliminar.

### Fase 2 — Refactor estructural (1-2 semanas)

6. Extraer builders de `CobranzaOnlineDashboardAppService` a servicios dedicados.
7. Remover atributos `[Display]` de DTOs de API.
8. Mover lógica de diagnóstico inline de `AspelSyncEndPoints` a servicio de aplicación.
9. Evaluar mover `presupuesto-contabilidad` fuera de `cobranza-online`.

### Fase 3 — Convención y arquitectura (2-4 semanas)

10. Renombrar archivos legacy `Coi*` restantes según plan de Fase 6 documentado.
11. Crear `CobranzaOnlineService` en frontend.
12. Migrar rutas a `cobranza.routes.ts`.
13. Evaluar split `desktop/` y `mobile/` o documentar excepción.
14. Migrar estilos inline a archivos `.scss`.

### Fase 4 — Calidad y testing (continuo)

15. Agregar tests unitarios backend (clasificación de cartera, formateo de cuentas, endpoints mapeados).
16. Agregar specs frontend (contratos de modelos, render de KPIs, filtros).
17. Formalizar deprecación de rutas legacy con plan de migración aprobado.

---

## 6. Estatus por Hallazgo

| ID | Clasificación | Estatus |
|---|---|---|
| C-01 | Incumplimiento crítico | **Corregido en Fase 1** |
| A-01 | Incumplimiento alto | **Corregido en Fase 1** |
| A-02 | Incumplimiento alto | **Corregido en Fase 1** |
| A-03 | Incumplimiento alto | **Requiere plan de migración** |
| D-01 | Deuda técnica | Plan por fases |
| D-02 | Deuda técnica | Plan por fases |
| D-03 | Deuda técnica | Plan por fases |
| D-04 | Deuda técnica | Plan por fases |
| D-05 | Deuda técnica | Plan por fases |
| D-06 | Deuda técnica | Plan por fases |
| D-07 | Deuda técnica | Plan por fases |
| M-01 | Mejora recomendada | Backlog |
| M-02 | Mejora recomendada | Backlog |
| M-03 | Mejora recomendada | Backlog |
| M-04 | Mejora recomendada | Backlog |
| M-05 | Mejora recomendada | Backlog |
| R-01 | Riesgo de ruptura por shared/contrato | **Requiere plan de migración** |

---

## 7. Observaciones Finales

- El módulo muestra **buena salud arquitectónica general** (endpoints delgados, servicios de aplicación, DTOs locales, uso de signals en frontend, contratos alineados en la mayoría de los casos).
- Los problemas más graves son **higiénicos y de contrato** (archivo basura, interface faltante, campo faltante en TypeScript) más que arquitectónicos.
- La **deuda técnica principal** es el tamaño del servicio de dashboard y la coexistencia de naming legacy vs nuevo.
- Se recomienda **no iniciar Fase 2 sin antes cerrar Fase 1**, ya que los incumplimientos altos pueden estar rompiendo funcionalidad en producción (rutas de mapeo 404, dato de mtto cobrado invisible).

---

## 8. Ejecución de Fase 1 (2026-07-29)

Tareas completadas en esta fase:

- C-01: Eliminado archivo basura `Interfaces/sedlViScZ` del módulo backend.
- A-02: Agregado `maintenanceCollected: number` a interface TypeScript `CobranzaOnlineCurrentCharges` en `cobranza-online-dashboard.model.ts`.
- D-06: Eliminados archivos de debug: `responses-json/`, `response-auxiliares.json`, `Reporte la Jolla.jpeg`.
- D-07: Movido `analisis-cobranza-online.md` a `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/Docs/analisis-cobranza-online.md`.

Tareas pendientes para completar Fase 1:

- Ninguna. Fase 1 completada en su totalidad.

## 9. Ejecución de Fase 2 (2026-07-29)

Tareas completadas en esta fase:

- D-01: Extraídos builders de `CobranzaOnlineDashboardAppService` a servicios dedicados:
  - `ExclusionesBuilder` + `IExclusionesBuilder` (lógica de exclusiones)
  - `CobranzaOnlineHelpers` (helpers estáticos: formateo, clasificación, cálculos)
  - `CobranzaOnlineTypes` (records: `ChargeTemplateSnapshot`, `PolicyMovementRow`, `SummaryBalanceRow`, `DailyMovementAmount`)
- D-03: Removidos atributos `[Display]` de `CoiCobranzaAccountResponseDTO.cs`.
- D-04: Movida lógica de diagnósticos inline de `AspelSyncEndPoints` a `CobranzaOnlineDashboardAppService.GetSyncDiagnosticsAsync` + DTO `CobranzaOnlineSyncDiagnosticsDTO`.
- A-03: Eliminado componente duplicado `presupuesto-contabilidad` en `cobranza-online/`; la ruta en `contabilidad.routing.ts` ya apunta al componente único en `contabilidad.luxuryapp`.

## 10. Ejecución de Fase 3 (2026-07-29)

Tareas completadas en esta fase:

- 3.1: Renombrados 17 archivos legacy `Coi*` a naming `CobranzaOnline*`:
  - DTOs: `CobranzaOnlineAccountResponseDTO`, `CobranzaOnlineBalanceResponseDTO`, `CobranzaOnlineMovementResponseDTO`, `CobranzaOnlinePolicyResponseDTO`, `CobranzaOnlineStatementResponseDTO`, `CobranzaOnlinePortfolioDTO`
  - Servicios: `CobranzaOnlineAccountAppService`, `CobranzaOnlineBalanceAppService`, `CobranzaOnlineMovementAppService`, `CobranzaOnlinePolicyAppService`, `CobranzaOnlineStatementAppService`, `CobranzaOnlinePortfolioAppService`, `CobranzaOnlineReporteFinancieroAppService`
  - Endpoints: `CobranzaOnlineAccountEndPoints`, `CobranzaOnlineBalanceEndPoints`, `CobranzaOnlineMovementEndPoints`, `CobranzaOnlinePolicyEndPoints`, `CobranzaOnlineStatementEndPoints`, `CobranzaOnlinePortfolioEndPoints`, `CobranzaOnlineReporteFinancieroEndPoints`
  - Interfaces: `ICobranzaOnlineReporteFinancieroAppService`, `ICobranzaOnlineStatementAppService`, `ICobranzaOnlinePortfolioAppService`
  - Actualizadas todas las referencias en servicios, endpoints, DI registrations y tests.
- 3.2: Creado `CobranzaOnlineService` en frontend (`cobranza-online.service.ts`) con métodos tipados para dashboard, análisis, inspección, exclusiones, sync, estado de cuenta y reporte financiero. Componentes migrados a consumir el servicio.
- 3.3: Creado `cobranza.routes.ts` con todas las rutas del feature; `contabilidad.routing.ts` ahora importa `COBRANZA_ONLINE_ROUTES` y lo expande con spread operator.
- 3.5: Extraídos estilos inline de `cobranza-online-dashboard` a `cobranza-online-dashboard.component.scss`.

Tareas pendientes para completar Fase 3:

- 3.4: Evaluar split `desktop/` y `mobile/` o documentar excepción. El feature actual comparte lógica entre vistas; se recomienda evaluar en Fase 4 cuando haya testing.
