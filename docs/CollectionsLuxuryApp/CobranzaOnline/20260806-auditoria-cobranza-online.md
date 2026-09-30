# Auditoría Completa Frontend: Módulo CobranzaOnline

**Fecha de Auditoría:** 2026-08-06
**Módulo:** CobranzaOnline (frontend)
**Ubicación:** `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/`
**Estado:** Auditoría Completa Finalizada (modalidad única vigente por `audit-module-conventions.md`)
**Severidad General:** ALTA (incumplimientos altos de tokens y `any` productivo; requiere plan de remediación)

---

## 1. Resumen Ejecutivo

El módulo **CobranzaOnline** es el visor en vivo (lectura stateless) integrado con Aspel COI: resumen, inspección, análisis, reporte financiero, exclusiones, cargos/abonos por departamento, torres, adelantos y morosidad. Esta auditoría es **frontend-focused**: el backend ya fue auditado por completo en `20260803-auditoria-cobranza-online.md` y sus hallazgos críticos (DisplayName, colores en dashboard legacy) quedaron registrados; este reporte verifica el estado vigente del frontend tras la independización de rutas (`/cobranza/online/*`), la migración a `ApiResponseService` y la eliminación total de SCSS locales.

**Situación actual:**
- ✅ Rutas independizadas y centralizadas (`COBRANZA_ONLINE_ROUTES` + `Endpoints.CobranzaOnline.*`)
- ✅ Todos los componentes consumen `ApiResponseService` (cero `HttpClient` directo)
- ✅ Endpoints frontend alineados con backend (verificado ruta por ruta)
- ✅ `authGuard` en ruta padre (cubre los 10 children)
- ✅ Lazy loading + standalone + signals/effect
- ✅ Cero SCSS locales (estilos globales/catálogo); zero mojibake; tsc limpio en el módulo
- ⚠️ **Incumplimientos altos:** hardcoding de colores hex en TS (resumen y analysis), `any` productivo en contrato (`departmentCharges`/`departmentPayments`), `ChangeDetectionStrategy.Eager` en 12 componentes, bypass a catálogo UI en input de fecha nativo

**Impacto:** Los colores hardcodeados rompen la regla crítica de Design Tokens y el tema no responde a cambios globales; el `any` productivo oculta drift de contrato real con el backend (el DTO no declara `departmentCharges`/`departmentPayments`); `Eager` fuerza re-renders innecesarios.

---

## 2. Alcance

### Cobertura estructural (obligatoria, incluye subcarpetas)

| Capa | Ubicación | Archivos |
|------|-----------|----------|
| Rutas | `cobranza-online.routes.ts` | 1 |
| Wrapper | `cobranza-online-wrapper.{ts,html}` | 2 |
| State | `state/cobranza-online-filter.state.ts` | 1 |
| Interfaces / DTOs | `interfaces/*.model.ts` | 7 |
| Features | `resumen/`, `inspection/`, `analysis/`, `reporte-financiero/`, `exclusions/`, `department-charges/`, `department-payments/`, `towers/`, `advances/`, `debtors/` | 20 (10 ts + 10 html) |
| Modales | `inspection/cobranza-online-inspection-history-modal.*`, `resumen/cobranza-online-clasificacion-detail.ts` | 3 |
| Docs / fixtures | `02-business-rules-analysis.md`, `requerimientos.md`, `response-json/*.json` | 6 |
| **Total** | | **40 archivos** |

### Capas auditadas (según `audit-checklist.md`)

- [x] Arquitectura y estructura de carpetas
- [x] Naming
- [x] Contratos y DTOs (interfaces frontend + alineación backend)
- [x] Servicios genéricos (`ApiResponseService`, `DialogHandlerService`, `TableScrollHeightService`)
- [x] Lógica de negocio (clasificación frontend, reglas RN-COB-001..008)
- [x] Acceso a datos / API (Endpoints centralizados)
- [x] Seguridad y permisos (authGuard, aislamiento por customerId)
- [x] UI y styles (catálogo, utilidades, colores hardcodeados, estilos globales usados)
- [x] Mobile (DataViewMobile presente en parte de las vistas)
- [x] Performance (signals/computed, `Eager` vs `OnPush`)
- [x] Testing (cobertura frontend)
- [x] Logging (`console.error`)
- [x] Documentación (business-rules, requerimientos, fixtures)
- [x] Deuda técnica y riesgos

### Flujos funcionales mínimos verificados (lectura estática de código)

- Carga de resumen con filtro de fecha compartido (wrapper + resumen)
- Carga de dashboard en towers/advances/debtors con filtros locales
- Análisis con fecha de corte propia
- Inspección con histórico anual en modal (`DialogHandlerService`)
- Exclusiones read-only con match de Property
- Cargos/abonos pivot por concepto (con `(res as any).departmentCharges`)

---

## 3. Hallazgos

### Clasificación por severidad

| ID | Clasificación | Título |
|----|---------------|--------|
| H1 | Incumplimiento crítico | Hardcoding de colores hex en TS (Design Tokens) |
| H2 | Incumplimiento alto | `any` productivo en contrato tipado + drift de shape con backend |
| H3 | Incumplimiento alto | `ChangeDetectionStrategy.Eager` en 12 componentes |
| H4 | Incumplimiento alto | Bypass al catálogo UI en input de fecha nativo + `$any()` |
| H5 | Deuda técnica | Duplicación de clasificación y `CONCEPTS_CATALOG` |
| H6 | Deuda técnica | Fuente de verdad del filtro fragmentada (incl. `month = 4` fijo) |
| H8 | Deuda técnica | Cobertura mobile incompleta en 6 vistas |
| H9 | Mejora recomendada | Clases de color no-semánticas (`text-red-600`, `bg-red-50`, etc.) |
| H10 | Mejora recomendada | `requerimientos.md` vacío y `response-json/` sin referenciar |
| H11 | Mejora recomendada | Casts redundantes `as T \| null` sobre respuestas ya tipadas |
| H12 | Mejora recomendada | `console.error` sin política uniforme de logging frontend |

---

### 🔴 H1 — Hardcoding de colores en TypeScript (Design Tokens)
**Severidad:** INCUMPLIMIENTO CRÍTICO (regla crítica §6.1: tokens CSS obligatorios)

**Archivos:**
- `resumen/cobranza-online-resumen.ts:221-234` (`colors = { MOROSOS: "#ef4444", "DEUDA CORRIENTE": "#3b82f6", "COBRADO / SIN ADEUDO": "#22c55e" }` + fallback `"#94a3b8"`)
- `resumen/cobranza-online-resumen.ts:263` (`["#e2e8f0"]`), `:272` y `:287` (`["#22c55e", "#f59e0b"]`)
- `analysis/cobranza-online-analysis.ts:108-109,125-126` (`["#b91c1c", "#2563eb", "#166534"]`, `["#b91c1c", "#d97706", "#2563eb"]`)

**Evidencia:**
```typescript
// resumen.ts:221-234
const colors = {
  MOROSOS: "#ef4444",        // debe ser var(--ds-danger)
  "DEUDA CORRIENTE": "#3b82f6",  // debe ser var(--ds-info)
  "COBRADO / SIN ADEUDO": "#22c55e", // debe ser var(--ds-success)
};
const chartColors = items.map(
  (item) => colors[item.clasificacion as keyof typeof colors] || "#94a3b8",
);
```

**Impacto:** El tema no responde a cambios de tokens globales; viola la regla crítica 8 de CONVENTIONS.md. **Nota:** el hallazgo H2 del reporte 2026-08-03 se marcó "remediado" en `cobranza-online-dashboard.ts` (ya eliminado), pero la práctica se **replicó** en `resumen.ts` y `analysis.ts` → incumplimiento vigente.

**Recomendación:** Definir tokens semánticos del módulo (o reutilizar `--ds-*`) y leerlos vía `getComputedStyle` (patrón ya aprobado en el plan 2026-08-03, T1.2), o mapear severidades a tokens del catálogo del PieChart/ChartWrapper.

---

### 🟠 H2 — `any` productivo en contrato tipado y drift de shape
**Severidad:** INCUMPLIMIENTO ALTO (§4.2 / §7: no `any` productivo; checklist: shapes legacy no declarados)

**Archivos:**
- `interfaces/cobranza-online-dashboard.model.ts:103-104` → `departmentCharges?: any[];` y `departmentPayments?: any[];`
- `department-charges/department-charges.ts:167-168` → `(res as any).departmentCharges`
- `department-payments/department-payments.ts:177-178` → `(res as any).departmentPayments`

**Evidencia:**
```typescript
// dashboard.model.ts:103-104
departmentCharges?: any[];
departmentPayments?: any[];
// department-charges.ts:167-168
if (res && (res as any).departmentCharges) {
  const sourceData = (res as any).departmentCharges as DepartmentChargesData[];
```

**Impacto:**
- El shape real de `departmentCharges`/`departmentPayments` **no está declarado en el DTO backend** (revisado `CobranzaOnlineDashboardResponseDTO`) ni en la interfaz frontend: se accede por `as any`. Esto es exactamente el drift que el checklist exige reportar (dependencia de shapes legacy no declarados).
- El frontend define `DepartmentChargesData`/`ChargeItem` **localmente** en cada componente, en lugar de tiparlo en `interfaces/`.
- Viola "no se permite `any` productivo ... cuando el módulo ya tiene DTO/interface disponible".

**Recomendación:** Tipo `CobranzaOnlineDepartmentCharges` / `CobranzaOnlineDepartmentPayments` en `interfaces/`, declarados opcionalmente en el response del dashboard (o como endpoint separado) y eliminados los casts `as any`.

---

### 🟠 H3 — `ChangeDetectionStrategy.Eager` en 12 componentes
**Severidad:** INCUMPLIMIENTO ALTO (audit-by-role Frontend: verificación "ChangeDetectionStrategy.OnPush")

**Archivos (12 de 22 .ts):** `cobranza-online-wrapper.ts`, `cobranza-online-resumen.ts`, `cobranza-online-analysis.ts`, `cobranza-online-inspection.ts`, `cobranza-online-inspection-history-modal.ts`, `cobranza-online-reporte-financiero.ts`, `cobranza-online-exclusions.ts`, `department-charges.ts`, `department-payments.ts`, `cobranza-online-towers.ts`, `cobranza-online-advances.ts`, `cobranza-online-debtors.ts`.

**Impacto:** `Eager` no es la estrategia oficial del proyecto; fuerza re-renders ante cualquier cambio en el árbol, contradiciendo el patrón moderno con signals/computed (donde `OnPush` + signals es suficiente). Solo `cobranza-online-clasificacion-detail.ts` usa `OnPush`.

**Recomendación:** Migrar a `ChangeDetectionStrategy.OnPush`; dado que todo el estado es `signal`/`computed`, no debería requerir cambios de templates. Validar modales y efectos antes de aplicar.

---

### 🟠 H4 — Bypass al catálogo UI en control de fecha nativo + `$any()`
**Severidad:** INCUMPLIMIENTO ALTO (§4.2: catálogo UI obligatorio; frontend-prohibitions: no bypass al design system)

**Archivos:**
- `department-charges/department-charges.html:27-32`
- `department-payments/department-payments.html:27-32`

**Evidencia:**
```html
<input
  type="date"
  class="p-inputtext p-component p-inputtext-sm"
  [value]="currentDate()"
  (change)="onDateChange($any($event.target).value)"
/>
```


**Recomendación:** Sustituir por `custom-input-date-signal` con `[control]`/`[noMargin]`; tipar el handler del evento sin `$any`.

---

### 🟡 H5 — Duplicación de lógica de negocio y catálogo
**Severidad:** DEUDA TÉCNICA (frontend-rules: no duplicar; mantenibilidad)

**Evidencia:**
- Algoritmo de clasificación por cargo/umbral (COBRANZA JUDICIAL ≥ 3 cuotas, MOROSOS ≥ 1 cuota o extraordinario, DEUDA CORRIENTE, REVISAR) duplicado íntegro en `resumen.ts:68-106` y `debtors.ts:63-95`.
- `CONCEPTS_CATALOG` (26 conceptos), `DepartmentChargesData`, `ChargeItem`, `PivotRow` duplicados íntegros entre `department-charges.ts` y `department-payments.ts` (~50 líneas).

**Impacto:** Riesgo de drift entre copias (ya hay typo en comentario `sLTIMO` en `department-payments.ts:192`); cambiar un umbral de clasificación requiere tocar dos lugares.

**Recomendación:** Extraer a helpers del módulo (p. ej. `helpers/cobranza-clasificacion.ts`, `helpers/cobranza-conceptos.ts`), o a `interfaces/` para los tipos. Como la clasificación replica reglas del análisis backend, idealmente debe consumirse del response backend y no recalcularse en frontend (ver H6 riesgos).

---

### 🟡 H6 — Fuente de verdad del filtro fragmentada
**Severidad:** DEUDA TÉCNICA (frontend-rules: "precedencia clara de fuente de verdad" cuando se comparte estado)

**Evidencia:**
- `cobranzaOnlineFilterState` (year/month/day) se usa solo en `wrapper` y `resumen`.
- Cada feature mantiene sus propios signals: `analysis` (`cutoffDateInput`), `reporte-financiero` (`year/mesInicio/mesFin`), `exclusions` (`year`), `department-charges`/`department-payments`/`towers`/`advances`/`debtors` (`year/month/day` locales), `inspection` (`year` actual, **`month = signal(4)` hardcodeado** — valor por defecto sospechoso de abril fijo, `inspection.ts:63`).

**Impacto:** El selector de "Fecha corte" del wrapper no propaga a la mayoría de las vistas; cada pantalla puede mostrar cortes distintos; el default de inspección (abril) parece un residuo de depuración.

**Recomendación:** Unificar al state compartido o declarar explícitamente que cada vista es un corte independiente (documentarlo). Revisar `month = 4` como bug potencial.

---

**Severidad:** MEJORA RECOMENDADA (frontend-rules: consumir desde `@ui/*`)

**Evidencia:**

**Impacto:** Inconsistencia con el patrón de barriles `@ui/*`; riesgo de que un análisis automatizado de "no imports directos de librerías UI" marque el módulo.


---

### 🟡 H8 — Cobertura mobile incompleta
**Severidad:** DEUDA TÉCNICA (frontend-rules: "desktop y mobile cuando aplique")

**Evidencia:** Tienen `DataViewMobile`: `inspection`, `analysis`, `reporte-financiero`, `exclusions`. **No tienen** vista mobile: `resumen`, `towers`, `advances`, `debtors`, `department-charges`, `department-payments`.

**Impacto:** En pantallas móviles, 6 vistas renderizan tablas anchas (`min-width` 50-72rem) sin `hidden md:block`; UX degradada.

**Recomendación:** Agregar `app-data-view-mobile` (patrón ya usado en el módulo) o definir que son vistas de escritorio y ocultarlas con patrón mobile equivalente.

---

### 🟡 H9 — Clases de color no-semánticas
**Severidad:** MEJORA RECOMENDADA (UI/styles: preferir clases semánticas del design system)

**Evidencia:** `text-red-600`, `text-green-700`, `text-blue-700`, `text-green-600`, `text-red-500`, `bg-blue-50`, `bg-red-50`, `text-blue-900`, `text-red-900` en `analysis.html`, `exclusions.html`, `resumen.html`, `clasificacion-detail.ts`. El módulo ya usa correctamente `text-success`, `text-warning`, `text-primary` en otras vistas (resumen.html:54, advances.html).

**Impacto:** Colores de escala cruda no reaccionan a tokens semánticos de severidad; menor.

**Recomendación:** Migrar a `text-danger/text-success/text-info` o a tokens `--ds-*` cuando el catálogo lo permita.

---

### 🟡 H10 — `requerimientos.md` vacío y `response-json/` sin referenciar
**Severidad:** MEJORA RECOMENDADA (documentación)

**Evidencia:** `requerimientos.md` tiene 0 líneas; `response-json/{auxiliares,cuentas,polizas,saldos}.json` no son referenciados por ningún `.ts`.

**Recomendación:** Eliminar `requerimientos.md` vacío (o completarlo) y mover `response-json/` a fixtures de prueba documentados o eliminarlos.

---

### 🟡 H11 — Casts redundantes `as T | null`
**Severidad:** MEJORA RECOMENDADA (naming/typing)

**Evidencia:** `wrapper.ts:147` (`(response as CobranzaOnlineSyncResponse)?.diagnostics`), `inspection.ts:127`, `inspection-history-modal.ts:140`, `reporte-financiero.ts:139`, `exclusions.ts:134-135` (`(response as X | null) ?? null`). `onGetItem<T>`/`onPost<T>` ya devuelven `T | null`.

**Recomendación:** Eliminar los casts redundantes.

---

### 🟡 H12 — `console.error` sin política uniforme
**Severidad:** MEJORA RECOMENDADA (logging)

**Evidencia:** `department-charges.ts:205` y `department-payments.ts:215` (`console.error(e)`). No existe un logger frontend oficial; el resto del módulo no loguea errores en UI.

**Recomendación:** Uniformar con el patrón de logging del proyecto (si existe) o al menos registrar vía servicio de notificación.

---

## 4. Cumplimiento de Convenciones

| Regla | Cumple | Observación |
|-------|--------|-------------|
| §4.2 Endpoints centralizados (`core/constants`) | ✅ | `Endpoints.CobranzaOnline.*` alineado con backend |
| §4.2 `ApiResponseService` (sin `HttpClient` directo) | ✅ | 100% de componentes |
| §4.2 AuthGuard + lazy loading + standalone | ✅ | Ruta padre `canActivate: [authGuard]` |
| §4.2 No `any` productivo | ❌ | H2 (`departmentCharges`/`departmentPayments`) |
| §6.1 Design Tokens CSS | ❌ | H1 (hex en resumen/analysis) |
| §2 / §13 ChangeDetectionStrategy.OnPush | ❌ | 12 componentes `Eager` (H3) |
| Frontend Feature Structure (desktop/mobile/interfaces) | ⚠️ | Patrón `interfaces/` OK; mobile parcial (H8) |
| Naming (kebab-case, sufijo `-wrapper`, sin sufijo `Component`) | ✅ | `cobranza-online-wrapper`, archivos sin sufijo Component |
| Mobile (DataViewMobile) | ⚠️ | 4 de 10 vistas (H8) |
| UI Audit (styles locales/globales, `::ng-deep`) | ✅ | Sin styles locales, sin `::ng-deep`, `styles: []` cero |
| Documentación del módulo (business-rules) | ✅ | `02-business-rules-analysis.md` (RN-COB-001..008) |
| Testing frontend | ❌ | 0 specs en el módulo |
| Mojibake | ✅ | CERO (scanner) |
| tsc en módulo | ✅ | 0 errores (11 errores preexistentes ajenos al módulo) |

---

## 5. Validación Funcional de Flujos Críticos (lectura de código)

### ✅ Flujo 1: Resumen con filtro compartido
`wrapper` + `resumen` usan `cobranzaOnlineFilterState`; cambio de fecha en `custom-input-date-signal` → `onDateChange` → `loadData` → `Endpoints.CobranzaOnline.Dashboard.get`. **OK.**

### ✅ Flujo 2: Inspección + histórico
`inspection.ts` carga listado; `onSelectRow` abre `CobranzaOnlineInspectionHistoryModal` vía `DialogHandlerService`; el modal carga `inspectionHistory`. **OK** (pero `month = 4` default, H6).

### ✅ Flujo 3: Sincronización manual (doble-submit)
`wrapper.onSyncNow` protege con `if (this.syncRunning()) return;` y cierra en `finally`. **OK frontend.** Backend sigue sin mutex (H7 del reporte 2026-08-03, pendiente).

### ⚠️ Flujo 4: Cargos/abonos por departamento
Lee `(res as any).departmentCharges` del dashboard (H2): shape no declarado, lógica pivot local duplicada (H5). **Riesgo de drift.**

### ⚠️ Flujo 5: Exclusiones
Endpoints `excludedAccounts` y `updateExcludedAccount` existen e interfaz `CobranzaOnlineExcludedAccountUpsert` está definida, pero la UI es **read-only** (`// Readonly view`). El upsert backend está definido pero no consumido. **Inconsistencia menor** a documentar.

### Reglas de negocio e invariantes (checklist obligatorio)
- Invariantes: RN-COB-001 (sync transaccional), RN-COB-002 (lectura stateless / no tocar presupuesto) — **documentadas** en `02-business-rules-analysis.md`.
- Unicidades/duplicidad: no aplica (módulo de lectura; no hay INSERT en operación diaria salvo sync timestamps y exclusions upsert no usado).
- Casos negativos auditados: `null` en `onGetItem` → `?? null` / `?? []` (correcto); `formatDate` tolera NaN; `pct` tolera total 0. **Sin evidencia de carreras de concurrencia nuevas** en frontend.
- Defensa por capa: clasificación de deuda se **recalcula en frontend** (resumen/debtors) replicando reglas del análisis backend — riesgo de drift de regla de negocio entre capas (recomendado: consumir clasificación del response).

---

## 6. Evidencia y Referencias

### Verificaciones ejecutadas (2026-08-06)
```bash
# tsc módulo
tsc -p tsconfig.json --noEmit 2>&1 | grep -c "cobranza-online"  → 0 errores
# mojibake
scan-mojibake.mjs client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online → CERO mojibake
# any productivo
grep -rn " as any" → department-charges.ts:167-168, department-payments.ts:177-178
# hex en TS
grep "#[0-9a-fA-F]" resumen.ts analysis.ts → 11 colores hardcodeados
# ChangeDetectionStrategy
grep -rln "ChangeDetectionStrategy.Eager" → 12 archivos
# endpoints front vs back
Endpoints.CobranzaOnline.* ↔ api/.../CobranzaOnline/EndPoints/* → alineados ruta por ruta
# estado compartido
grep -rln "cobranzaOnlineFilterState" → wrapper, resumen (solo 2 de 12)
```

### Archivos revisados
- 40 archivos del módulo (listados en Alcance)
- `conventions/audit/audit-module-conventions.md`
- `conventions/audit/audit-checklist.md`
- `conventions/audit/audit-by-role.md`
- `conventions/frontend/*` (feature-structure, rules, api-endpoints, generic-services-catalog, prohibitions)
- `conventions/SCRIPTS_AUDITORIA.md`
- Referencia viva `admin.luxuryapp/catalogos-generales/banks`
- Reporte previo `20260803-auditoria-cobranza-online.md` y plan `20260803-cobranza-online-remediacion-plan.md`

---

## 7. Impacto y Riesgo

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Colores hex rompen tema (H1) | Medio | Alta | Migrar a tokens (Fase 1) |
| Drift de shape `departmentCharges` (H2) | Alto | Media | Tipar en `interfaces/` + validar DTO backend (Fase 1) |
| `Eager` rendimiento (H3) | Bajo | Alta | Migrar a OnPush (Fase 1) |
| Regla de clasificación duplicada front/back (H5/H6) | Alto (drift de regla de negocio) | Media | Consumir clasificación del response o extraer helper (Fase 2) |
| `month = 4` fijo en inspección (H6) | Medio | Baja | Revisar y corregir (Fase 1) |
| Falta de specs (testing) | Alto (regresiones) | Alta | Fase 2 |

---

## 8. Recomendación

**El módulo es funcional y compila limpio, pero no cierra auditoría completa por incumplimientos altos (H1-H4) y deuda de contrato (H2) que pueden producir drift con backend. Se requiere plan de remediación por fases.** No se remedia durante la auditoría (regla crítica). El detalle de fases, checklist y estatus está en:

- Plan: `docs/plans/20260806-cobranza-online-remediacion-plan.md`

---

## 9. Estatus por Hallazgo

| ID | Hallazgo | Estatus |
|----|----------|---------|
| H1 | Hardcoding de colores | Pendiente (Fase 1) |
| H2 | `any` productivo + drift de shape | Pendiente (Fase 1) |
| H3 | `ChangeDetectionStrategy.Eager` | Pendiente (Fase 1) |
| H4 | Input de fecha nativo + `$any` | Pendiente (Fase 1) |
| H5 | Duplicación clasificación/catálogo | Pendiente (Fase 2) |
| H6 | Filtro fragmentado + `month=4` | Pendiente (Fase 2) |
| H8 | Mobile incompleto | Pendiente (Fase 3) |
| H9 | Clases de color no-semánticas | Pendiente (Fase 3) |
| H10 | `requerimientos.md` vacío / fixtures | Pendiente (Fase 3) |
| H11 | Casts redundantes | Pendiente (Fase 3) |
| H12 | `console.error` | Pendiente (Fase 3) |

---

## 10. Auditor y Fecha

**Auditor:** opencode (deepseek-v4-flash-free)
**Fecha:** 2026-08-06
**Próxima revisión:** 2026-08-13 (post-remediación Fase 1)

---

**Fin del Reporte de Auditoría**
