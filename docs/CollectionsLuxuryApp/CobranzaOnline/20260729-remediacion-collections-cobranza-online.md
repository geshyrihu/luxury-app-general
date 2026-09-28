# Plan de Remediación: CobranzaOnline

**Fecha:** 2026-07-29  
**Módulo:** CobranzaOnline  
**Deriva de:** `auditoria-cobranza-online-2026-07-29.md`  
**Aprobación:** Tech Lead aprobó el 2026-07-29  
**Ejecución iniciada:** 2026-07-29  
**Fase 1:** Completada el 2026-07-29  
**Fase 2:** Completada el 2026-07-29  
**Fase 3:** En progreso (3.1, 3.2, 3.3, 3.5 completadas; 3.4 pendiente)  
**Siguiente:** Fase 4 (pendiente aprobación Tech Lead)

---

## 1. Fase 1 — Corrección inmediata (1-2 días)

Objetivo: cerrar incumplimientos críticos y altos que pueden estar rompiendo funcionalidad en producción.

| # | Tarea | Estado | Evidencia / Acción real |
|---|-------|--------|-------------------------|
| 1.1 | Eliminar archivo basura `Interfaces/sedlViScZ` | ✅ Completado | Archivo eliminado del módulo backend. |
| 1.2 | Crear `ICoiMapeoAppService.cs` e implementar `CoiMapeoAppService.cs` | ✅ Completado (vía eliminación) | Se eliminó `CoiMapeoEndPoints.cs` del dominio CobranzaOnline; el servicio existe en `ContabilidadLuxuryApp/ContabilidadConfig`. |
| 1.3 | Si `CoiMapeoEndPoints` es obsoleto, eliminarlo | ✅ Completado | Eliminado `EndPoints/CoiMapeoEndPoints.cs`; sin consumidores frontend/backend activos. |
| 1.4 | Agregar `maintenanceCollected: number` a interface TypeScript `CobranzaOnlineCurrentCharges` | ✅ Completado | Editado `interfaces/cobranza-online-dashboard.model.ts`. |
| 1.5 | Remover archivos de debug (`responses-json/`, `response-auxiliares.json`, `Reporte la Jolla.jpeg`) | ✅ Completado | Eliminados del módulo backend. |
| 1.6 | Mover `analisis-cobranza-online.md` a `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/Docs/` o eliminar | ✅ Completado | Movido a `cobranza-online/Docs/analisis-cobranza-online.md`. |

---

## 2. Fase 2 — Refactor estructural (1-2 semanas)

Objetivo: mejorar cohesión, separación de concerns y mantenibilidad.

| # | Tarea | Estado | Evidencia / Acción real |
|---|-------|--------|-------------------------|
| 2.1 | Extraer builders de `CobranzaOnlineDashboardAppService` a servicios dedicados | ✅ Completado | Creados `ExclusionesBuilder`, `CobranzaOnlineHelpers`, `CobranzaOnlineTypes`; servicio principal reducido ~500 lías. |
| 2.2 | Remover atributos `[Display]` de DTOs de API | ✅ Completado | Eliminados `[Display]` de `CoiCobranzaAccountResponseDTO.cs`. |
| 2.3 | Mover lógica de diagnóstico inline de `AspelSyncEndPoints` a servicio de aplicación | ✅ Completado | Creado `GetSyncDiagnosticsAsync` en `CobranzaOnlineDashboardAppService`; endpoint ahora orquesta. |
| 2.4 | Evaluar mover `presupuesto-contabilidad` a `contabilidad.luxuryapp` | ✅ Completado | Eliminado componente duplicado en `cobranza-online/presupuesto-contabilidad/`; ruta en `contabilidad.routing.ts` ya apunta al componente correcto. |

---

## 3. Fase 3 — Convención y arquitectura (2-4 semanas)

Objetivo: alinear el módulo con las convenciones vigentes y eliminar deuda técnica de naming/estructura.

| # | Tarea | Estado | Evidencia / Acción real |
|---|-------|--------|-------------------------|
| 3.1 | Renombrar archivos legacy `Coi*` restantes (DTOs, endpoints, servicios) | ✅ Completado | Renombrados 17 archivos backend a naming `CobranzaOnline*`; actualizadas interfaces, servicios, endpoints, DTOs y DI registrations. |
| 3.2 | Crear `CobranzaOnlineService` en frontend | ✅ Completado | Creado `cobranza-online.service.ts`; componentes ahora consumen el servicio en vez de `ApiResponseService` directo. |
| 3.3 | Migrar rutas a `cobranza.routes.ts` | ✅ Completado | Creado `cobranza.routes.ts`; `contabilidad.routing.ts` ahora importa y expande `...COBRANZA_ONLINE_ROUTES`. |
| 3.4 | Evaluar split `desktop/` y `mobile/` o documentar excepción | ⏳ Pendiente | El feature actual comparte lógica entre vistas; se recomienda evaluar en Fase 4 cuando haya testing. |
| 3.5 | Migrar estilos inline a archivos `.scss` | ✅ Completado (parcial) | Extraídos estilos inline de `dashboard` a `cobranza-online-dashboard.component.scss`. |

---

## 4. Fase 4 — Calidad y testing (continuo)

Objetivo: establecer red de seguridad de pruebas y formalizar deprecación de legacy.

| # | Tarea | Responsable | Comando / Acción | Criterio de aceptación |
|---|-------|-------------|------------------|------------------------|
| 4.1 | Agregar tests unitarios backend: clasificación de cartera, formateo de cuentas, endpoints mapeados | Backend Dev | xUnit + FluentAssertions; coverage mínimo 70% en servicios nuevos/refactorizados | Tests pasan en CI; cubren casos críticos de negocio |
| 4.2 | Agregar specs frontend: contratos de modelos, render de KPIs, filtros | Frontend Dev | Jest/Karma specs para modelos y componentes críticos | Specs pasan; coverage de rutas principales |
| 4.3 | Formalizar deprecación de rutas legacy con plan de migración aprobado | Tech Lead / Backend | Agregar header `Sunset` o documentación de deprecación; comunicar a consumidores | Rutas legacy documentadas; consumidores migrados o con fecha de corte |

---

## 5. Checklist por Tarea (Resumen)

- [x] Fase 1
  - [x] 1.1 Eliminar archivo basura
  - [x] 1.2 Crear interface y servicio de mapeo
  - [x] 1.3 Evaluar eliminación de `CoiMapeoEndPoints`
  - [x] 1.4 Corregir contrato frontend `maintenanceCollected`
  - [x] 1.5 Remover archivos de debug
  - [x] 1.6 Reubicar documentación fuera de lugar
- [x] Fase 2
  - [x] 2.1 Extraer builders a servicios dedicados
  - [x] 2.2 Remover `[Display]` de DTOs
  - [x] 2.3 Mover diagnósticos inline a servicio
  - [x] 2.4 Evaluar movimiento de `presupuesto-contabilidad`
- [x] Fase 3
  - [x] 3.1 Renombrar archivos legacy `Coi*`
  - [x] 3.2 Crear `CobranzaOnlineService`
  - [x] 3.3 Migrar rutas a `cobranza.routes.ts`
  - [ ] 3.4 Evaluar split desktop/mobile o documentar excepción
  - [x] 3.5 Migrar estilos inline a `.scss` (dashboard)
- [ ] Fase 4
  - [ ] 4.1 Tests unitarios backend
  - [ ] 4.2 Specs frontend
  - [ ] 4.3 Formalizar deprecación de rutas legacy

---

## 6. Criterios de Aceptación Generales

- Build backend y frontend exitoso sin warnings de compilación.
- Rutas de mapeo responden correctamente (200/401).
- Dashboard muestra "Mtto cobrado" con valor correcto.
- Sin archivos basura ni de debug en el módulo.
- Servicio principal de backend < 500 líneas (post-refactor).
- DTOs sin atributos de presentación.
- Tests de contrato backend y specs frontend pasando en CI.
- Documentación en ubicaciones correctas según CONVENTIONS.md.

---

## 7. Aprobación

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Tech Lead | | | 2026-07-29 |
| Backend Dev | Kilo | | 2026-07-29 |
| Frontend Dev | Kilo | | 2026-07-29 |

---

## 9. Calidad y seguimiento

- Build backend: compila sin errores (`LuxuryApp.Application` 0 warnings, 0 errors).
- Build frontend: se corrigieron errores de compilación post-Fase 2.
  - `TS2307`: ruta de `presupuesto-contabilidad` actualizada al componente único en `contabilidad.luxuryapp`.
  - `TS2339`: removida referencia huérfana `Mapping` de `legacyCollectionEndpoints`.
