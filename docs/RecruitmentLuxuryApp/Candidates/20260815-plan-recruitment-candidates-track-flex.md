# Plan: Track Flex — Purgar PrimeFlex de componentes de input

**Fecha:** 2026-09-14
**Alcance:** Solo atributos `class="..."` y `customClass="..."` en componentes de input
**Archivos afectados:** 22 archivos HTML
**Ocurrencias PrimeFlex:** ~38 reemplazos

---

## Resumen de hallazgos

| Clase PrimeFlex | Ocurrencias | Reemplazo BS5 | Archivos |
|-----------------|------------:|---------------|----------|
| `w-full` | 30 | `w-100` | 21 |
| `w-15rem` | 1 | `w-100` (o `style="width:15rem"`) | 1 |
| `w-5` | 1 | `w-100` o `col` | 1 |
| `mb-3` | 1 | `mb-3` (compatible) | 1 |
| `me-1` | 1 | `me-1` (compatible) | 1 |
| `md:w-auto` | 1 | `d-md-auto` o `w-md-auto` | 1 |
| `flex-1` | 1 | `flex-fill` | 1 |
| `flex-grow-1` | 1 | `flex-grow-1` (compatible) | 1 |
| `d-none` | 1 | `d-none` (compatible) | 1 |

**Clases ya compatibles (no requieren cambio):** `mb-3`, `me-1`, `flex-grow-1`, `d-none`

**Clases que sí requieren reemplazo:** `w-full`→`w-100`, `w-15rem`→custom/`w-100`, `w-5`→`col`, `flex-1`→`flex-fill`, `md:w-auto`→evaluar

---

## Archivos afectados por categoría

### A. `customClass="w-full"` en componentes `custom-input-*` (18 archivos)

| # | Archivo | Línea | Componente | Clase actual |
|---|---------|-------|------------|--------------|
| 1 | `operations/.../solicitud-modificacion-salario-form.html` | 7,17,27,37,48,60,72,81,92 | `custom-input-*` (×9) | `w-full` |
| 2 | `operations/.../ordenes-servicio-list.html` | 13 | `custom-input-text-signal` | `w-15rem` |
| 3 | `operations/.../ordenes-servicio-list.html` | 221 | `custom-input-text-signal` | `w-full` |
| 4 | `operations/.../warehouse-form.html` | 25 | `custom-input-text-signal` | `w-full mb-3` |
| 5 | `operations/.../solicitud-baja-form.html` | 210,224 | `custom-input-text/number-signal` | `w-full` |
| 6 | `accounting/.../gasto-fijo-servicios.html` (budgeting) | 48,163 | `custom-input-select-signal` | `w-full` |
| 7 | `accounting/.../gasto-fijo-servicios.html` (general-ledger) | 44,129 | `custom-input-select-signal` | `w-full` |
| 8 | `human-resources/.../realizar-evaluacion.html` | 84 | `custom-input-textarea-signal` | `w-full` |
| 9 | `human-resources/.../motivo-rechazo-formulario.html` | 2 | `custom-input-textarea-signal` | `w-full` |
| 10 | `human-resources/.../vacaciones-pasadas-registro.html` | 95 | `custom-input-textarea-signal` | `w-full` |
| 11 | `operations/.../image-generation-dialog.html` | 70 | `custom-input-textarea-signal` | `w-full` |
| 12 | `operations/.../reglamentos-list.html` | 137 | `custom-input-textarea-signal` | `w-full` |
| 13 | `collections/.../native-statement.html` | 17 | `custom-input-date-signal` | `w-full md:w-auto` |
| 14 | `collections/.../native-statement.html` | 23 | `custom-input-select-signal` | `flex-grow-1` |
| 15 | `collections/.../bulk-import-modal.html` | 30 | `custom-input-file-signal` | `w-full` |
| 16 | `admin/.../customer-data-company-form.html` | 35 | `custom-input-phone-prefix` | `w-5` |
| 17 | `admin/.../customer-data-company-form.html` | 40 | `custom-input-mask-signal` | `flex-1` |

### B. `class="..."` en inputs nativos `<input>`, `<select>` (7 archivos)

| # | Archivo | Línea | Elemento | Clase actual |
|---|---------|-------|----------|--------------|
| 18 | `management/.../junta-mensual-session-reschedule-form.html` | 12,17 | `<input>` | `w-full p-inputtext p-component` |
| 19 | `management/.../junta-mensual-session-reschedule-form.html` | 22 | `<select>` | `w-full p-inputtext p-component` |
| 20 | `operations/.../product-output-form.html` | 28 | `<input pInputText>` | `w-full` |
| 21 | `maintenance/.../fire-inspection-period-detector-detail.html` | 43 | `<select>` | `p-inputtext w-full` |
| 22 | `maintenance/.../fire-inspection-period-estacion-detail.html` | 43 | `<select>` | `p-inputtext w-full` |
| 23 | `maintenance/.../fire-inspection-period-extintor-detail.html` | 62 | `<select>` | `p-inputtext w-full` |
| 24 | `maintenance/.../fire-inspection-period-hidrante-detail.html` | 77 | `<select>` | `p-inputtext w-full` |
| 25 | `recruitment/.../employee-document-list.html` | 20,33 | `<select>`, `<input>` | `p-inputtext p-component w-full` |
| 26 | `core/layout/.../profile-user.html` | 23 | `<ion-select>` | `w-full` |

### C. Sin PrimeFlex (no requieren acción)

| Archivo | Clases encontradas | Motivo |
|---------|-------------------|--------|
| `mock-aspel-dashboard.html` | `filter-select`, `account-parent-select` | Solo clases custom |
| `former-employee-talent-pool.html` | `customer-filter` | Solo clase custom |
| `mock-aspel-poliza-form.html` | `required-field` | Solo clase custom |
| `piscina-bitacora-list.html` | `d-none` | Compatible BS5 |

---

## Reglas de reemplazo

| De | A | Contexto |
|----|---|----------|
| `w-full` | `w-100` | En `customClass="..."` de componentes `custom-input-*` |
| `w-full` | `w-100` | En `class="..."` de inputs nativos |
| `w-15rem` | `style="width: 15rem"` | Solo 1 caso, no hay equivalente BS5 exacto |
| `w-5` | `col` | En `<custom-input-phone-prefix>`, contexto de grid |
| `flex-1` | `flex-fill` | En `<custom-input-mask-signal>` |
| `md:w-auto` | `w-md-auto` | Evaluar si BS5 soporta, si no → `@media` custom |


---

## Estrategia de ejecución

1. **Lote 1 — `w-full` en `customClass` de `custom-input-*`** (18 archivos, ~25 reemplazos):
   - Regex: `customClass="w-full"` → `customClass="w-100"`
   - Regex: `customClass="w-full mb-3"` → `customClass="w-100 mb-3"`
   - Caso especial `w-15rem` → `style="width: 15rem"` (1 archivo)
   - Caso especial `w-5` → evaluar contexto (1 archivo)

2. **Lote 2 — `w-full` en `class` de inputs nativos** (7 archivos, ~8 reemplazos):
   - Regex: `"w-full p-inputtext` → `"p-inputtext` (quitar `w-full`, agregar `w-100` al final si necesario)

3. **Lote 3 — Clases sueltas** (2 reemplazos):
   - `flex-1` → `flex-fill` (1 archivo)
   - `md:w-auto` → evaluar (1 archivo)

4. **Verificación:** `ng build` + inspección visual de al menos 3 formularios.

---

## Criterio de aceptación

- `grep -r "w-full" appsweb/angular/src --include="*.html" | grep -i "custom-input\|ion-input\|<input\|<select\|<textarea"` → 0 resultados
- `ng build` sin errores
- Commit: `refactor: purge primeflex classes from inputs project-wide`

---

## Fuente de datos

- Inventario escaneado: `ses_f5fe97adfffeXeGRYnOg6rCKmZ` (explore agent, 22 archivos)
- Reglas de reemplazo: `docs/plans/primeflex-migration-audit.md` §Mapa de Reemplazo
- Addendum: `docs/plans/primeflex-migration-addendum.md`
