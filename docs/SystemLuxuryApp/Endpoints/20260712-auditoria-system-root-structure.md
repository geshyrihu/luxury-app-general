# Reporte Actual De Estructura E Inventario De Raíz

Fecha de corte: 2026-07-25
Ubicación analizada: `D:\repos\luxuryapp-api`

## 1. Objetivo

Este documento resume el estado actual de la app a nivel de:

- estructura por módulos en backend y frontend
- carpetas existentes en la raíz
- archivos sueltos en la raíz
- clasificación práctica de cada archivo/carpeta:
  - `VIGENTE`
  - `SOPORTE`
  - `GENERADO`
  - `HISTORICO`
  - `PUNTUAL`
  - `POR REUBICAR`
  - `POR CONFIRMAR`

No es un reporte de rutas ni de endpoints. Es un mapa de organización física del repo.

---

## 2. Estructura Modular Actual

### 2.1 Backend

Raíz backend principal:

- `api/LuxuryApp.Application/Moduls`

Módulos detectados:

- `AdminLuxuryApp`
- `AuthLuxuryApp`
- `CobranzaLuxuryApp`
- `CommitteeLuxuryApp`
- `ContabilidadLuxuryApp`
- `DireccionLuxuryApp`
- `LegalLuxuryApp`
- `MantenimientoLuxuryApp`
- `OperationsLuxuryApp`
- `ReclutamientoLuxuryApp`
- `RecursosHumanosLuxuryApp`
- `SharedLuxuryApp`
- `SupplierLuxuryApp`
- `SystemLuxuryApp`

Otras capas backend relevantes:

- `api/LuxuryApp.Api`
- `api/LuxuryApp.Shared`
- `api/LuxuryApp.Infrastructure.Data`
- `api/LuxuryApp.Infrastructure.Vault`
- `api/LuxuryApp.Providers`
- `api/LuxuryApp.Tests`

### 2.2 Frontend

Raíz frontend modular principal:

- `client/angular/src/app/apps`

Apps detectadas:

- `admin.luxuryapp`
- `auth.luxuryapp`
- `cobranza.luxuryapp`
- `committee.luxuryapp`
- `contabilidad.luxuryapp`
- `direccion.luxuryapp`
- `legal.luxuryapp`
- `mantenimiento.luxuryapp`
- `operations.luxuryapp`
- `public.luxuryapp`
- `reclutamiento.luxuryapp`
- `recursos-humanos.luxuryapp`
- `resident.luxuryapp`
- `security.luxuryapp`
- `supplier.luxuryapp`
- `system.luxuryapp`
- `web.luxuryapp`

Capas frontend adicionales:

- `client/angular/src/app/core`
- `client/angular/src/app/shared`
- `client/angular/src/app/routing`

### 2.3 Lectura Arquitectónica Rápida

Hay un espejo razonable entre dominios backend y apps frontend en:

- admin
- auth
- cobranza
- committee
- contabilidad
- direccion
- legal
- mantenimiento
- operations
- reclutamiento
- recursos-humanos
- supplier
- system

Diferencias estructurales visibles:

- `SharedLuxuryApp` existe solo en backend como transversal
- `public.luxuryapp`, `resident.luxuryapp`, `security.luxuryapp`, `web.luxuryapp` existen solo en frontend como portales/experiencias

---

## 3. Carpetas De La Raíz

### 3.1 Carpetas núcleo del proyecto

| Carpeta | Estado | Lectura |
|---|---|---|
| `api` | `VIGENTE` | Backend principal del sistema |
| `client` | `VIGENTE` | Frontend principal del sistema |
| `docs` | `VIGENTE` | Lugar correcto para planes, bitácoras y documentación viva |
| `scripts` | `VIGENTE` | Lugar correcto para automatizaciones reutilizables |
| `respaldo` | `SOPORTE` | Respaldos/manual baseline para comparar o restaurar |
| `skills` | `SOPORTE` | Skill tooling local |

### 3.2 Carpetas de tooling / agentes / entorno

| Carpeta | Estado | Lectura |
|---|---|---|
| `.agents` | `VIGENTE` | Skills e instrucciones del entorno agente |
| `.codex` | `VIGENTE` | Configuración local de Codex |
| `.codex-plugins` | `SOPORTE` | Plugins locales de Codex |
| `.claude` | `SOPORTE` | Config local de Claude |
| `.cursor` | `SOPORTE` | Config local de Cursor |
| `.gemini` | `SOPORTE` | Config local de Gemini |
| `.qwen` | `SOPORTE` | Config local de Qwen |
| `.kilo` | `SOPORTE` | Config local del flujo Kilo |
| `.antigravity` | `SOPORTE` | Config local de ese agente/herramienta |

### 3.3 Carpetas técnicas del repo / IDE / build

| Carpeta | Estado | Lectura |
|---|---|---|
| `.git` | `VIGENTE` | Repo git |
| `.github` | `VIGENTE` | CI/CD, workflows |
| `.githooks` | `VIGENTE` | Hooks del repo |
| `.vscode` | `SOPORTE` | Config compartible de VS Code |
| `.vs` | `PUNTUAL` | Carpeta local de Visual Studio, no es documentación ni fuente |
| `.venv` | `PUNTUAL` | Entorno Python local |
| `.build-artifacts` | `POR CONFIRMAR` | Parece artefacto local/temporal |
| `.code-review-graph` | `POR CONFIRMAR` | Parece salida de tooling de auditoría |

---

## 4. Archivos Sueltos En La Raíz

## 4.1 Archivos que sí deben vivir en raíz

| Archivo | Estado | Motivo |
|---|---|---|
| `CONVENTIONS.md` | `VIGENTE` | Fuente de verdad global |
| `AGENTS.md` | `VIGENTE` | Instrucción global del repo para agentes |
| `.gitignore` | `VIGENTE` | Config repo |
| `.editorconfig` | `VIGENTE` | Config repo |
| `.mcp.json` | `SOPORTE` | Config de tooling |
| `.opencode.json` | `SOPORTE` | Config de tooling |
| `.claudeignore` | `SOPORTE` | Config de tooling |
| `package.json` | `VIGENTE` | Dependencias Node del root para utilitarios |
| `package-lock.json` | `VIGENTE` | Lockfile del root |
| `skills-lock.json` | `SOPORTE` | Lock de skills/tooling |
| `CLAUDE.md` | `SOPORTE` | Entrada de agente |
| `CODEX.md` | `SOPORTE` | Entrada de agente |
| `GEMINI.md` | `SOPORTE` | Entrada de agente |
| `QWEN.md` | `SOPORTE` | Entrada de agente |
| `ANTIGRAVITY.md` | `SOPORTE` | Entrada de agente |

## 4.2 Reportes generados o snapshots de auditoría

| Archivo | Estado | Lectura |
|---|---|---|
| `endpoint-radiography.md` | `GENERADO` | Reporte generado por `generate-radiography-v2.js` |
| `routes-radiography.md` | `GENERADO` | Reporte generado por `generate-routes-radiography.js` |
| `endpoint-audit-report.md` | `GENERADO` | Reporte puntual de auditoría |
| `swagger-api.json` | `GENERADO` | Snapshot OpenAPI local; hoy lo consumen scripts |
| `end-points-12-07-2026.json` | `HISTORICO` | Snapshot histórico |
| `end-points-12-07-2026-refactor.json` | `HISTORICO` | Snapshot histórico comparativo |
| `LOGS.TXT` | `PUNTUAL` | Evidencia temporal de errores/depuración |

Lectura importante:

- estos archivos sí sirven como evidencia o insumo de análisis
- pero ensucian la raíz si se quedan ahí indefinidamente
- a mediano plazo deberían concentrarse en `docs/reports/` o `docs/audits/`, excepto `swagger-api.json` si temporalmente sigue siendo insumo operativo

## 4.3 Planes en raíz

| Archivo | Estado | Lectura |
|---|---|---|
| `relocation-plan.md` | `POR REUBICAR` | Plan de trabajo; debería vivir en `docs/plans/` |
| `plan-refactor-select-item.md` | `POR REUBICAR` | Plan de trabajo; debería vivir en `docs/plans/` |

Observación:

- ya existe `docs/plans/` con múltiples planes fechados
- por consistencia, estos dos ya no deberían vivir en la raíz

## 4.4 Scripts/utilitarios sueltos en raíz

| Archivo | Estado | Lectura |
|---|---|---|
| `generate-radiography-v2.js` | `VIGENTE` | Generador principal de radiografía actual |
| `generate-radiography.js` | `HISTORICO` | Versión anterior, superada por `v2` |
| `generate-routes-radiography.js` | `VIGENTE` | Generador actual de radiografía de rutas |
| `validate-endpoints-routes.py` | `SOPORTE` | Validador técnico puntual contra `swagger-api.json` |
| `fix_json_props.py` | `PUNTUAL` | Script quirúrgico ad hoc para un archivo específico de cobranza |
| `move_vacations.ps1` | `PUNTUAL` | Script de refactor puntual, no parece parte de operación recurrente |
| `update_backend_routes.ps1` | `PUNTUAL` | Script de refactor puntual |
| `update_frontend_routes.ps1` | `PUNTUAL` | Script de refactor puntual |

Lectura práctica:

- `generate-radiography-v2.js` y `generate-routes-radiography.js` sí son utilitarios importantes
- el resto parece más de cirugía de una sesión/refactor específica
- esos scripts puntuales idealmente no deberían seguir sueltos en raíz

## 4.5 Archivos JSON de muestra, prueba o evidencia

| Archivo | Estado | Lectura |
|---|---|---|
| `aspel-presupeusto.json` | `POR CONFIRMAR` | Parece payload/snapshot de contabilidad para pruebas/análisis |
| `flujo-efectivo.json` | `POR CONFIRMAR` | Parece payload/snapshot de contabilidad para pruebas/análisis |
| `login-test.json` | `PUNTUAL` | Archivo mínimo de prueba/manual |

Lectura:

- probablemente sí sirvan como insumo funcional/manual
- pero no deberían quedarse en raíz si no forman parte de un flujo automatizado
- mejor ubicación potencial: `docs/samples/`, `docs/fixtures/` o `respaldo/`

---

## 5. Hallazgos Reales Del Estado Actual

## 5.1 La raíz ya está mezclando cuatro tipos de cosas

Hoy conviven en raíz:

- archivos estructurales del repo
- documentación viva
- reportes generados
- scripts puntuales de refactor

Eso explica por qué ya cuesta distinguir qué es parte estable del proyecto y qué fue apoyo temporal.

## 5.2 Sí hay una base clara de qué es operativo

Lo operativo hoy, de forma razonable, es:

- `api/`
- `client/`
- `docs/`
- `scripts/`
- `CONVENTIONS.md`
- `AGENTS.md`
- archivos de configuración root
- `generate-radiography-v2.js`
- `generate-routes-radiography.js`

## 5.3 Sí hay ruido real en raíz

Los principales generadores de ruido son:

- planes `.md` fuera de `docs/plans/`
- reportes `.md` grandes generados directamente en raíz
- snapshots `.json` históricos
- scripts `.ps1` y `.py` de una sola campaña/refactor
- `LOGS.TXT`

## 5.4 Riesgo actual

El riesgo no es técnico inmediato, sino operativo:

- cuesta saber qué ejecutar
- cuesta saber qué archivo es vigente y cuál ya fue reemplazado
- se vuelve más fácil apoyarse en un snapshot viejo o en un script viejo

---

## 6. Propuesta De Orden Sin Borrar Nada Aún

### 6.1 Lo que sí debería permanecer en raíz

- `api/`
- `client/`
- `docs/`
- `scripts/`
- `respaldo/`
- `CONVENTIONS.md`
- `AGENTS.md`
- archivos de configuración del repo
- entradas de agentes (`CLAUDE.md`, `CODEX.md`, etc.)
- `package.json` y `package-lock.json`

### 6.2 Lo que debería migrarse a `docs/`

Destino sugerido:

- `docs/plans/`
  - `relocation-plan.md`
  - `plan-refactor-select-item.md`

- `docs/reports/`
  - `endpoint-audit-report.md`
  - `endpoint-radiography.md`
  - `routes-radiography.md`

- `docs/snapshots/`
  - `swagger-api.json`
  - `end-points-12-07-2026.json`
  - `end-points-12-07-2026-refactor.json`

- `docs/fixtures/` o `docs/samples/`
  - `aspel-presupeusto.json`
  - `flujo-efectivo.json`
  - `login-test.json`

- `docs/logs/`
  - `LOGS.TXT`

### 6.3 Lo que debería migrarse a `scripts/`

- `generate-radiography-v2.js`
- `generate-routes-radiography.js`
- `validate-endpoints-routes.py`

Y evaluar si conservar o archivar:

- `generate-radiography.js`
- `fix_json_props.py`
- `move_vacations.ps1`
- `update_backend_routes.ps1`
- `update_frontend_routes.ps1`

### 6.4 Lo que debería ir a histórico o archivo

Si decides conservarlos solo como referencia:

- `generate-radiography.js`
- `end-points-12-07-2026.json`
- `end-points-12-07-2026-refactor.json`
- scripts puntuales de refactor ya ejecutado

Un destino razonable sería:

- `docs/archive/`
- o `respaldo/tooling/`

---

## 7. Dictamen Final

La estructura modular de la aplicación ya tiene una base bastante clara en `api/` y `client/`, pero la raíz del repo sí está cargada de artefactos de transición del refactor:

- reportes generados
- planes temporales
- snapshots
- scripts quirúrgicos

No parece que haya “basura” obvia para borrar a ciegas, pero sí hay muchos elementos que ya no deberían seguir viviendo en raíz.

### Prioridad recomendada

1. Mantener sin tocar lo estructural y operativo
2. Reubicar planes a `docs/plans/`
3. Reubicar reportes a `docs/reports/`
4. Reubicar snapshots a `docs/snapshots/`
5. Reubicar scripts vigentes a `scripts/`
6. Separar scripts/ad hoc históricos en `docs/archive/` o `respaldo/`

---

## 8. Archivo Creado A Propósito De Esta Auditoría

Este archivo se creó para dejar una referencia actual, legible y reutilizable del estado de la raíz:

- `ROOT-STRUCTURE-AND-INVENTORY-REPORT.md`

