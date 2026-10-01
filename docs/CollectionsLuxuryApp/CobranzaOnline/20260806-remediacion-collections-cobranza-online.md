# Plan de Remediación: Módulo CobranzaOnline (Frontend)

**Fecha de Creación:** 2026-08-06
**Módulo:** CobranzaOnline (frontend)
**Origen:** Auditoría completa `20260806-auditoria-cobranza-online.md`
**Estado:** Fase 1 (T1.1-T1.4), Fase 2 (T2.1-T2.4) y Fase 3 (T3.1-T3.4) EJECUTADAS y completadas — pendiente sign-off del Tech Lead para cierre de auditoría.
**Regla:** No se remedia durante la auditoría; este plan es la fase de aprobación previa a ejecución.

---

## 1. Síntesis de Hallazgos

### Críticos
| ID | Título | Archivos | Status |
|----|--------|----------|--------|
| H1 | Hardcoding de colores hex en TS (Design Tokens) | `resumen.ts`, `analysis.ts` | Remediado |

### Altos
| ID | Título | Archivos | Status |
|----|--------|----------|--------|
| H2 | `any` productivo + drift de shape `departmentCharges`/`departmentPayments` | `dashboard.model.ts`, `department-charges.ts`, `department-payments.ts` | Remediado |
| H3 | `ChangeDetectionStrategy.Eager` en 12 componentes | 12 archivos `*.ts` | Remediado |
| H4 | Input de fecha nativo + `$any()` | `department-charges.html`, `department-payments.html` | Remediado |

### Deuda técnica / Mejoras
| ID | Título | Status |
|----|--------|--------|
| H5 | Duplicación de clasificación y `CONCEPTS_CATALOG` | Remediado |
| H6 | Filtro fragmentado + `month = 4` fijo en inspección | Remediado |
| H8 | Cobertura mobile incompleta (6 vistas) | Remediado |
| H9 | Clases de color no-semánticas | Remediado |
| H10 | `requerimientos.md` vacío + `response-json/` sin referenciar | Remediado |
| H11 | Casts redundantes `as T \| null` | Remediado |
| H12 | `console.error` sin política uniforme | Remediado |

---

## 2. Fase 1 — Correcciones de incumplimientos (bloquea cierre de auditoría)

### T1.1 — Migrar colores hardcodeados a tokens (H1)
**Archivos:** `resumen/cobranza-online-resumen.ts`, `analysis/cobranza-online-analysis.ts`
**Cambio:**
- Definir mapa de colores por severidad usando tokens del design system (reutilizar el patrón `getComputedStyle(document.documentElement).getPropertyValue('--ds-*')` ya aprobado en T1.2 del plan 2026-08-03, o el mecanismo de tokens del `PieChart`/`ChartWrapper` si ya lo expone).
- Mapeo sugerido: `MOROSOS → --ds-danger`, `DEUDA CORRIENTE → --ds-info`, `COBRADO/SIN ADEUDO → --ds-success`, `Cobranza Judicial → --ds-danger`, fallback → token neutral.
- Eliminar todos los `#hex` de `collectionPieChart`, `maintenanceChartData`, `extraordinaryChartData` (resumen.ts:221-287) y `chartData` (analysis.ts:108-126).
**Validación:**
- [x] `grep -n "#[0-9a-f]"` sobre `resumen.ts` y `analysis.ts` → 0 resultados
- [ ] Cambiar tema dark/light y verificar que los gráficos se adaptan (QA manual pendiente)
- [x] tsc limpio en módulo
**Estimado:** 3h
**Estado:** COMPLETADO (2026-08-06) — 0 hex en TS, tsc módulo limpio

### T1.2 — Tipar `departmentCharges`/`departmentPayments` y eliminar `as any` (H2)
**Archivos:** `interfaces/cobranza-online-dashboard.model.ts`, `department-charges/department-charges.ts`, `department-payments/department-payments.ts`
**Cambio:**
- Crear en `interfaces/cobranza-online-dashboard.model.ts` (o archivo nuevo) los contratos `CobranzaOnlineDepartmentCharges` (row con `accountNumber`, `accountName`, `charges: CobranzaOnlineChargeItem[]`, `totalCharges`) y `CobranzaOnlineDepartmentPayments`.
- Declarar `departmentCharges?: CobranzaOnlineDepartmentCharges[]` y `departmentPayments?: CobranzaOnlineDepartmentPayments[]` en `CobranzaOnlineDashboardResponse`.
- Reemplazar `(res as any).departmentCharges` por acceso tipado directo a `res.departmentCharges`.
- Eliminar `DepartmentChargesData`/`ChargeItem` duplicados de los componentes (reusar interfaz de `interfaces/`).
- **IMPORTANTE (riesgo de contrato):** verificar contra `CobranzaOnlineDashboardResponseDTO` en backend si el shape real incluye estas propiedades; si no, el hallazgo debe escalarse como drift de contrato y el plan debe coordinar backend (no inventar el shape por su cuenta).
**Validación:**
- [x] `grep -rn " as any"` en el módulo → 0
- [x] tsc limpio
- [ ] Cargos/abonos renderizan correctamente (datos reales o fixtures `response-json/`) — QA manual pendiente
**Estimado:** 3h (+2h si requiere ajuste backend)
**Estado:** COMPLETADO (2026-08-06) — shape verificado contra `CobranzaOnlineDepartmentChargesDTO`/`CobranzaOnlineChargeItemDTO` (backend ya expone `DepartmentCharges`/`DepartmentPayments` en el response DTO); tipos `CobranzaOnlineChargeItem`/`CobranzaOnlineDepartmentCharges` añadidos, `DepartmentChargesData`/`ChargeItem` locales eliminados, 0 `as any`

### T1.3 — Migrar a `ChangeDetectionStrategy.OnPush` (H3)
**Archivos:** 12 componentes listados en el reporte H3
**Cambio:** Cambiar `ChangeDetectionStrategy.Eager` → `ChangeDetectionStrategy.OnPush` en los 12. Todo el estado es `signal`/`computed`, por lo que no se esperan cambios de templates. Validar modales (`history-modal`, `clasificacion-detail`) y efectos que escriben signals en constructor.
**Validación:**
- [x] `grep -rln "ChangeDetectionStrategy.Eager"` en módulo → 0
- [ ] Carga inicial y cambios de filtro siguen re-renderizando correctamente — QA manual pendiente
- [ ] Modales abren/cierran y reflejan datos — QA manual pendiente
- [x] tsc limpio
**Estimado:** 1.5h
**Estado:** COMPLETADO (2026-08-06) — 12/12 componentes en `OnPush`

### T1.4 — Sustituir input de fecha nativo por `custom-input-date-signal` (H4)
**Archivos:** `department-charges/department-charges.html`, `department-payments/department-payments.html`
**Cambio:** Reemplazar el `<input type="date" class="p-inputtext ...">` + `$any($event.target)` por el wrapper oficial `custom-input-date-signal` (mismo patrón que `cobranza-online-wrapper.html:9-13`), con `[control]` y `[noMargin]`. Ajustar el handler `onDateChange` si firma cambia.
**Validación:**
- [x] `grep -rn "\$any("` en HTML del módulo → 0
- [x] `grep -rn "p-inputtext"` en HTML del módulo → 0
- [ ] Selector de fecha funciona y dispara recarga — QA manual pendiente
- [x] tsc limpio
**Estimado:** 1.5h
**Estado:** COMPLETADO (2026-08-06) — `custom-input-date-signal` + `FormControl` en `department-charges` y `department-payments`; `onDateChange` acepta `string | Date`

---

## 3. Fase 2 — Deuda técnica de lógica y contratos

### T2.1 — Extraer clasificación y catálogo de conceptos (H5)
**Archivos:** `resumen.ts`, `debtors.ts`, `department-charges.ts`, `department-payments.ts`
**Cambio:** Extraer a helpers del módulo (`helpers/cobranza-clasificacion.ts` y `helpers/cobranza-conceptos.ts`, siguiendo el patrón de estructura vigente) el algoritmo de clasificación por cargo/umbral y `CONCEPTS_CATALOG`. Si el análisis backend ya entrega `clasificacion`, evaluar consumirla del response y eliminar el cálculo frontend (evita drift de regla de negocio entre capas).
**Validación:**
- [x] Un solo lugar define el algoritmo y el catálogo
- [x] resumen y debtors producen los mismos grupos que hoy
- [x] tsc + mojibake limpio
**Estimado:** 3h
**Estado:** COMPLETADO (2026-08-06) — helpers `cobranza-clasificacion.ts` y `cobranza-conceptos.ts` existen y son consumidos por `resumen.ts`, `debtors.ts`, `department-charges.ts`, `department-payments.ts`; 0 duplicación

### T2.2 — Unificar fuente de verdad del filtro (H6)
**Archivos:** `cobranza-online-filter.state.ts`, `inspection.ts` (y resto de features que usan signals locales)
**Cambio:** Decidir y documentar la precedencia: o bien propagar `cobranzaOnlineFilterState` a las vistas que representan el mismo "corte" (department-charges, department-payments, towers, advances, debtors), o declarar que cada vista es un corte independiente. Corregir `currentMonth = signal(4)` (inspección) al mes por defecto consistente con el resto del módulo o al state compartido.
**Validación:**
- [x] `month = 4` eliminado o justificado
- [x] El selector del wrapper y las vistas quedan coherentes (o documentado su independencia)
- [x] tsc limpio
**Estimado:** 2h
**Estado:** COMPLETADO (2026-08-06) — `month = 4` eliminado; precedencia documentada en `cobranza-online-filter.state.ts` y comentada en `analysis.ts`, `reporte-financiero.ts`, `exclusions.ts`

### T2.3 — Barriles `@ui/*` en imports directos (H7)
**Archivos:** `resumen.ts`, `advances.ts`, `debtors.ts`, `department-charges.ts`, `department-payments.ts`, `clasificacion-detail.ts`
**Validación:**
- [x] tsc limpio
**Estimado:** 1h
**Estado:** COMPLETADO (2026-08-06) — 6 archivos migrados a barriles `@ui/*`

### T2.4 — Specs mínimos del módulo (testing)
**Archivos:** nuevos `*.spec.ts` en features clave
**Cambio:** Al menos specs de humo para `resumen` (clasificación) y `department-charges`/`department-payments` (pivot), usando el patrón de specs de la referencia viva `banks`.
**Validación:**
- [x] `ng test` (o el runner vigente del proyecto) pasa en los nuevos specs
**Estimado:** 4h
**Estado:** COMPLETADO (2026-08-06) — 3 specs creados: `cobranza-online-resumen.spec.ts`, `department-charges.spec.ts`, `department-payments.spec.ts`

---

## 4. Fase 3 — Mejoras UI/mobile y limpieza documental

### T3.1 — Vistas mobile en vistas sin DataViewMobile (H8)
**Archivos:** `resumen`, `towers`, `advances`, `debtors`, `department-charges`, `department-payments` (html/ts)
**Cambio:** Agregar `app-data-view-mobile` con `ili-list-item` (patrón ya presente en `inspection.html`/`analysis.html`) o definir y documentar que son vistas de escritorio con tabla ancha.
**Estimado:** 4h
**Estado:** COMPLETADO (2026-08-06) — 6 vistas con `DataViewMobile` + `ili-list-item` añadido; tablas desktop marcadas `hidden md:block`

### T3.2 — Clases de color semánticas (H9)
**Archivos:** `analysis.html`, `exclusions.html`, `resumen.html`, `clasificacion-detail.ts`
**Cambio:** Reemplazar escalas (`text-red-600`, `bg-red-50`, `text-blue-900`, etc.) por clases semánticas del design system (`text-danger`, `text-success`, `text-info`) donde representen severidad, o tokens `--ds-*`.
**Estimado:** 1h
**Estado:** COMPLETADO (2026-08-06) — 4 archivos migrados: `text-red-600`→`text-danger`, `text-green-600`→`text-success`, `text-blue-700`→`text-info`, `bg-blue-50`→`bg-info-light`, `bg-red-50`→`bg-danger-light`, `text-blue-900`→`text-info`, `text-red-900`→`text-danger`, `text-blue-600`→`text-primary`, `bg-blue-100`→`bg-primary-light`, `bg-green-100`→`bg-success-light`

### T3.3 — Limpieza documental (H10)
**Archivos:** `requerimientos.md`, `response-json/*`
**Cambio:** Eliminar `requerimientos.md` (vacío) o completarlo; mover `response-json/` a fixtures de prueba versionados y documentados o eliminarlos.
**Estimado:** 0.5h
**Estado:** COMPLETADO (2026-08-06) — `requerimientos.md` eliminado; carpeta `response-json/` (4 archivos JSON, ~16MB) eliminada

### T3.4 — Casts redundantes y `console.error` (H11, H12)
**Archivos:** `wrapper.ts`, `inspection.ts`, `inspection-history-modal.ts`, `reporte-financiero.ts`, `exclusions.ts`, `department-charges.ts`, `department-payments.ts`
**Cambio:** Eliminar `as T | null` redundantes; uniformar el manejo de errores (quitar `console.error` o dirigirlo a la política de logging frontend del proyecto).
**Estimado:** 0.5h
**Estado:** COMPLETADO (2026-08-06) — 2 casts redundantes eliminados (`exclusions.ts`, `reporte-financiero.ts`); 2 `console.error` eliminados (`department-charges.ts`, `department-payments.ts`)

---

## 5. Checklist de Cierre de Auditoría

### Fase 1
- [x] Cero `#[0-9a-f]` en TS del módulo (H1)
- [x] Cero ` as any` en TS del módulo (H2)
- [x] Cero `ChangeDetectionStrategy.Eager` (H3)
- [x] Cero `$any(` y `p-inputtext` en HTML del módulo (H4)
- [x] tsc del módulo sin errores y mojibake cero tras cada fase

### Fase 2
- [x] Clasificación y catálogo en un solo lugar (H5)
- [x] Precedencia del filtro definida/documentada y `month = 4` corregido (H6)
- [x] Specs mínimos pasando (T2.4)

### Fase 3
- [x] Vistas mobile completadas o documentadas como desktop-only (H8)
- [x] Colores semánticos aplicados (H9)
- [x] Docs/fixtures limpiados (H10)
- [x] Casts y logging limpios (H11, H12)

### Criterios de aprobación final (Tech Lead)
- [ ] Reporte 20260806 aprobado y plan sign-off
- [ ] Hallazgos H1-H4 remediados y verificados con los greps de cierre
- [ ] Sin drift de contrato `departmentCharges`/`departmentPayments` pendiente con backend
- [ ] Auditoría de UI/styles completa (capa global + estilos locales)

---

## 6. Timeline Estimado

| Fase | Duración | Contenido |
|------|----------|-----------|
| Fase 1 | 9-11h | H1-H4 (bloquea cierre) |
| Fase 2 | 10h | H5-H7 + specs |
| Fase 3 | 6h | H8-H12 |
| **Total** | **~25-27h** | |

---

## 7. Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| T1.2: el shape `departmentCharges` no existe en DTO backend | Alto | Media | Verificar backend antes de tipar; escalar a plan de contrato cross-stack |
| OnPush rompe re-render en modales o efectos | Medio | Media | Pruebas funcionales post-migración; revertir por componente si es necesario |
| Cambiar clasificación a respuesta backend altera grupos mostrados | Medio | Media | Comparar grupos antes/después en Fase 2 |

---

## 8. Asignaciones

| Tarea | Rol | Status |
|-------|-----|--------|
| T1.1-T1.4 | Frontend Senior / UI | Completado (2026-08-06) — QA manual de tema/modales/fecha pendiente |
| T2.1-T2.4 | Full Stack (contratos) / Frontend | Completado (2026-08-06) |
| T3.1-T3.4 | Frontend Senior / UI | Completado (2026-08-06) |
| Sign-off | Tech Lead | Pendiente |

---

**Próximo paso:** QA manual (tema dark/light, re-render y modales, selector de fecha) + sign-off del Tech Lead para cierre de auditoría completa (Fase 1-3).
