# Auditoría: Cobranza Online

**Fecha:** 2026-07-31
**Frontend:** `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online`
**Backend:** `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline`

---

## 📊 Resumen Ejecutivo

**Estado:** 85%
**Hallazgos Críticos:** 1
**Fortalezas:** Excelente adopción de Signals, Minimal APIs, y Standalone Components. Se respeta la centralización de SelectItems y uso de `ApiResponseService`.
**Prioridad:** Corto plazo

---

## ✅ Verificación Rápida - Cumplimiento

| Aspecto | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Estructura (Standalone/No-Modules) | ✓ | ✓ | Cumple al 100%. No hay NgModules. |
| State Management (Signals) | ✓ | - | Cumple. Uso exclusivo de `signal`, `computed`, `effect`. Cero `BehaviorSubject`. |
| Templates | ✓ | - | Uso de nuevo control flow y componentes UI adaptativos. |
| API Access | ✓ | ✓ | Uso exclusivo de `ApiResponseService`. Cero `HttpClient`. |
| Endpoints (Minimal API, Kebab-case) | - | ✓ | Uso de `MapGroup`, `MapGet`, etc. Rutas correctas (`api/cobranza/online/*`). |
| DTOs (1 DTO por archivo) | - | ✓ | Cumple la regla de segregación. |
| Responses | - | ✓ | - |
| Design Tokens (CSS) | ❌ | - | **CRÍTICO:** Colores y fondos hardcodeados en SCSS. |
| SelectItems Centralizados | - | ✓ | Cero endpoints SelectItem en el módulo. |

**Brechas Identificadas:**
1. **[CRÍTICO] Design Tokens ignorados:** El archivo `cobranza-online-dashboard.component.scss` contiene múltiples colores hardcodeados (e.g., `#ffffff`, `#0f172a`, `linear-gradient` con hex). Violan la regla estricta de usar `var(--ds-*)` / `var(--co-*)` centralizado.
2. **[ALTO] Ausencia de artefactos FASE 0:** No se encontró `02-business-rules-analysis.md` según el protocolo actual. La documentación en `Docs/` tiene formato legacy (`analisis-cobranza-online.md`).

---

## 🔍 PHASE 2: DEEP AUDIT

### STEP 2.1: Reglas de Negocio Implementadas

No se halló el artefacto formal `02-business-rules-analysis.md` de la FASE 0. Las reglas se han inferido de la documentación legacy (`analisis-cobranza-online.md`) y el código:

| ID | Descripción | Nivel | Ubicación Backend | Ubicación Frontend | Documentada |
|:---|:-----------|:-----:|:-----:|:-----:|:-----:|
| RN-COB-001 | Resumen 401 en vivo consultado directo de Aspel | 2-Flujo | `AspelSyncEndPoints.cs` | `cobranza-online-dashboard.ts` | ⚠️ Legacy |
| RN-COB-002 | Drilldown por departamento (Cuentas Nivel 3) | 2-Flujo | `CobranzaOnlineStatementEndPoints` | `cobranza-online-dashboard.ts` | ⚠️ Legacy |

### STEP 2.2: Matriz de Roles por Tarea

El módulo actual es mayoritariamente de lectura (Dashboards, Reportes Financieros) y de Sincronización.

| Funcionalidad | Endpoint/Componente | Roles Permitidos | Roles Restringidos | Estado |
|:---|:---|:---|:---|:---|
| **VER** Dashboard | GET `dashboard/customer/...` | Autorizado explícito | - | ✓ |
| **SYNC** Aspel | POST `aspel-sync/...` | - | - | ⚠️ Faltan RBAC explícitos en endpoints de sync |

### STEP 2.3: Problemas Funcionales

| Tipo | Descripción | Línea / Archivo | Severidad |
|:---|:---|:---|:---|
| Estilos Hardcodeados | `cobranza-online-dashboard.component.scss` tiene colores como `#173b72`, `#166534`. | `cobranza-online-dashboard.component.scss` | CRÍTICA |
| Deuda Documental | Documentación en `Docs/` sigue estándar previo a Julio 2026. | Directorio `Docs/` | MEDIA |

---

## 📋 Plan de Acción (Brechas)

[ACCIÓN-001]
├── Título: Migrar SCSS a Design Tokens
├── Descripción: Reemplazar todos los códigos HEX en `cobranza-online-dashboard.component.scss` por variables CSS de la paleta oficial (e.g. `var(--primary-700)`, `var(--surface-a)`).
├── Fase: INMEDIATA
├── Complejidad: Pequeña
├── Story Points: 2
└── Criterio de éxito: Cero coincidencias de `#[0-9A-Fa-f]` en el SCSS del módulo.

[ACCIÓN-002]
├── Título: Alinear Documentación a FASE 0
├── Descripción: Migrar `analisis-cobranza-online.md` al formato de `02-business-rules-analysis.md` documentando invariantes, flujos y seguridad explícita.
├── Fase: CORTO PLAZO
├── Complejidad: Media
├── Story Points: 3
└── Criterio de éxito: Existencia de matriz de 4 niveles de reglas de negocio en la documentación.
