# 📊 Análisis de Mejora: Plan-Operations-Inspections-Recorridos

**Documento analizado:** `20260929-plan-operations-inspections-recorridos.md`  
**Fecha análisis:** 2026-09-29  
**Estándar de referencia:** `DOCUMENT-DESIGN-STANDARD.md` (nuevo)

---

## ✅ Fortalezas Confirmadas (qué hacer más seguido)

| Elemento | Ubicación | Por qué funciona |
|---|---|---|
| **Emojis estratégicos** | Titles (🧭, 📋, 🎯) | Actúan como breadcrumb visual; usuario scanea rápido |
| **Metadata clara** | §1 (tabla) | Elimina ambigüedad sobre módulo/tipo/origen antes de leer |
| **Glosario bilingüe** | §6 (🗺️ Glosario de Clases en Español) | Puente entre negocio (español) y código (inglés); crítico para equipos distribuidos |
| **Diagrama Mermaid dual** | §3 (HOY vs MAÑANA) + §6 (relaciones) | HOY/MAÑANA muestra cambio; relaciones muestra entidades en contexto |
| **Reglas de Negocio numeradas** | §6 (RN-INS-001...) | Rastreable en auditorías; permite referencia cruzada código ↔ negocio |
| **Fases con checklists** | §7 (Fase 0–6) | Operacional; ejecutor ve qué completó sin leer toda la descripción |
| **Criterios de Paso (paths)** | §8 (happy/sad/edge) | Previene interpretaciones; "qué es PASS" es explícito |
| **Pre-mortem** | §9 (Supuesto fallido / Mitigación) | Identifica riesgos ANTES de que ocurran; mitiga ejecución ciega |
| **Cierre esperado** | §11 (resonancia con Problem Statement) | Círculo cerrado; valida que el plan resuelve lo que se planteó |

---

## 🟡 Mejoras Recomendadas (no bloqueantes, valor agregado)

### A. Secciones 5 (Alcance) — Mejorar la visualización

**Situación actual:**
```markdown
## 5. 🗺️ Alcance

**Dentro de alcance:**
- Backend: `Modules/OperationsLuxuryApp/Inspections/` — entidades, servicios, DTOs, endpoints (ampliado con las capacidades portadas).
- Frontend: `maintenance.luxuryapp/inspection/` (se mantiene ahí, se amplía y rediseña).
```

**Propuesta de mejora:**

Agregar una tabla "Inventario de cambios" que cuantifique el esfuerzo:

```markdown
## 5. 🗺️ Alcance

| Componente | Cambio | Esfuerzo | Status |
|---|---|---|---|
| Backend: Inspection (entidad) | Agregar `RecurrenceUnit`, `Assignees`, renombrar campos | M | 🟡 |
| Backend: InspectionAssetItem (tabla) | Renombrar `InspectionCondominiumAsset`, agregar `EquipmentId` | M | 🟡 |
| Backend: Endpoints | Unificar 3 grupos → 1, agregar QR | M | 🟡 |
| Frontend: inspection/ | Rediseño UI ejecutor, eliminar legacy (18+15 archivos) | L | 🟡 |
| Jobs: Hangfire | Retiro `FireInspectionCycleGenerationJob`, alta job unificado | S | 🟡 |
| Migraciones: BD | 20 tablas DROP (vacías) + 10 columnas ADD/RENAME | L | 🟡 |

**Leyenda:** S=Small (1-2h), M=Medium (2-8h), L=Large (>8h)
```

**Beneficio:** ejecutor ve de un vistazo cuántas "cosas" son pequeñas vs grandes.

---

### B. Sección 6 (Arquitectura) — Agregar decisiones ADR (Architecture Decision Record)

**Situación actual:**
El glosario y diagrama están bien, pero no explican **por qué** se tomaron decisiones específicas de diseño.

**Propuesta de mejora:**

Bajo el glosario, agregar mini-ADR:

```markdown
### 🏛️ Decisiones de Diseño (Por qué)

| Decisión | Alternativa rechazada | Razón |
|---|---|---|
| 1 recorrido = N equipos con `Position` | 1 recorrido = 1 equipo (como Machinery) | Negocio requiere agrupar multiequipo (T-203 precedente) |
| `Status` enum (NotStarted/InProgress/Completed/Reopened) | Booleanos `IsStarted`, `IsCompleted` | Estados complejos; enum es más limpio y trazable |
| QR resuelve "ejecución activa del recorrido de ese equipo" | QR fijo a 1 ejecución singular | Recorridos son recurrentes; flexible es más útil |
| `InspectionAssignee` con `IsPrimary` | Único `PrimaryAssignee` + array `Backups` | Normalizacion; evita duplicidad de concepto |
| Notificación al completar (no al marcar hallazgo) | Notificar inmediatamente al marcar crítico | Evita spam; notif única al cierre; auditoría clara |
```

**Beneficio:** futuro arquitecto/auditor entiende las trade-offs sin tener que inferirlas.

---

### C. Sección 7 (Fases) — Agregar "Owner" y "Timeline Estimada"

**Situación actual:**
```markdown
### Fase 1 — 🏗️ Modelo unificado (entidades + migración)
- Migración EF: agregar a `Inspection` los campos...

**Checklist:**
- [ ] Migración aplica y revierte limpio en dev
```

**Propuesta de mejora:**

```markdown
### Fase 1 — 🏗️ Modelo unificado (entidades + migración)

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 2-3 días |
| Dependencias previas | Fase 0 completada |
| Criterio de éxito | Build sin errores, 0 referencias huérfanas |

**Descripción:** Migración EF: agregar a `Inspection` los campos...

**Checklist:**
- [ ] Migración aplica y revierte limpio en dev
- [ ] 0 referencias a entidades retiradas (`grep`)
```

**Beneficio:** sprint planning tiene información completa (duración + responsable + prerequisitos).

---

### D. Sección 8 (Criterios de Paso) — Agregar "Automation" (manual vs. automatizado)

**Situación actual:**
```markdown
**Happy path:** Recorrido semanal con equipos de 2 categorías...
**PASS si:** los 4 pasos ocurren sin error, con datos correctos.
```

**Propuesta de mejora:**

```markdown
**Happy path:** Recorrido semanal con equipos de 2 categorías → job genera → se ejecuta → se notifica.
**PASS si:** los 4 pasos ocurren sin error, con datos correctos.
**Automatización:** E2E test en Cypress (ej. `spec/operations/inspections.cy.ts`)

**Sad path:** Responsable base no se presenta → supervisor reasigna.
**PASS si:** reasignación visible de inmediato.
**Automatización:** Unit test en xUnit (ReasignAsync)
```

**Beneficio:** QA sabe qué test escribir; no necesita adivinar.

---

### E. Sección 9 (Riesgos) — Colorear la fila crítica con emoji 🔴

**Situación actual:**
```markdown
| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Migración `DROP TABLE` corre en producción... | Pérdida de datos... | Baja |
```

**Propuesta de mejora:**

```markdown
| 🔴 Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Migración `DROP TABLE` corre en producción sin conteo previo = 0 | Pérdida de datos | Baja | Fase 0 exige conteo = 0 verificado |
```

**Beneficio:** Tech Lead ve riesgos críticos sin leer toda la tabla.

---

### F. Sección 10 (Dependencias) — Matriz de impacto (no solo listas)

**Situación actual:**
```markdown
## 10. 🔗 Dependencias e Impactos

- Depende de: `Equipment`/`InventoryCategory` (ya estable, T-203).
- Impacta: `HangfireJobCatalog.cs` (retiro de 1 job, alta de 1 job nuevo).
```

**Propuesta de mejora:**

```markdown
## 10. 🔗 Dependencias e Impactos

### Matriz de Dependencias

| Sistema | Relación | Versión mínima | Impacto en este plan |
|---|---|---|---|
| `Equipment` / `InventoryCategory` | **Depende de** | Ya estable (T-203) | Alto (diseño de datos asume Equipment fijo) |
| `ServiceOrder` | **Impacta** (FK rename) | Actual | Bajo (FK nullable, transparente) |
| `HangfireJobCatalog` | **Impacta** (job swap) | Actual | Medio (1 job nuevo, 1 retiro) |
| `logbook.routing.ts` | **Impacta** (rutas legado) | Actual | Bajo (10 rutas eliminadas) |
| Otros módulos | **No impacta** | N/A | Cero (alcance contenido) |
```

**Beneficio:** ejecutor identifica módulos que necesitan coordinación.

---

## 🎯 Plantilla Simplificada (Para futuros planes)

Si quieres un **checklist rápido** para validar nuevos planes:

```markdown
## Checklist de Calidad (Antes de cerrar un plan)

### Estructura
- [ ] Título captura tensión, no es neutral
- [ ] §2 Metadata tiene: módulo, tipo, origen, datos, doc previo
- [ ] §3 Panorama tiene diagrama Mermaid + leyenda

### Contenido
- [ ] §4 Problem Statement es concreto (no genérico)
- [ ] §4 KPIs tienen baseline/target/timeline/verificación
- [ ] §4 Objetivo lista 5-10 capacidades
- [ ] §5 Alcance: dentro vs fuera con justificación
- [ ] §6 Glosario: ≥8 términos, emoji + clase + negocio

### Gobernanza
- [ ] §6 Reglas de Negocio: formato RN-XXX-NNN categorizado
- [ ] §7 Fases: descripción + checklist ≤10 items
- [ ] §8 Criterios de Paso: happy + sad + ≥1 edge
- [ ] §9 Riesgos: tabla 5 cols, ≥3 supuestos, 🔴 si crítico
- [ ] §10 Dependencias: qué se depende, qué se impacta

### Cierre
- [ ] §11 Cierre resuena con Problem Statement (círculo)
- [ ] Todos los links internos son relativos
- [ ] Rutas de código en backticks
- [ ] Emojis consistentes
```

---

## 📌 Recomendación Ejecutiva

**El documento `20260929-plan-operations-inspections-recorridos.md` es excelente.** Sigue 9 de 10 patrones canónicos y proporciona información operacional clara.

**Próximas mejoras (por orden de valor):**

1. ✅ **Inventario visual (§5)** — Cuantificar componentes por esfuerzo
2. ✅ **Matriz de impacto (§10)** — Claridad en módulos que se tocan
3. ✅ **ADR mini (§6)** — Explicar por qué las decisiones
4. ✅ **Owner + Timeline (§7)** — Información de sprint planning

---

**Fecha creado:** 2026-09-29  
**Documento estándar:** `DOCUMENT-DESIGN-STANDARD.md`  
**Próxima revisión:** Aplicar este estándar a 3 planes nuevos + recolectar feedback
