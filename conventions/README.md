# 📋 Conventions — Índice

**Última revisión:** 2026-09-10  
**Estado:** ✅ Limpia (9 archivos vigentes, 18 movidos a review_files/)

Esta carpeta (`conventions/`, en la raíz del repo) es la **ubicación única** de todas las reglas, protocolos y estándares del proyecto. Se consolidó aquí el 2026-09-09.

> **Punto de entrada obligatorio:** [`CONVENTIONS.md`](CONVENTIONS.md)
> 
> **Estándar de nomenclatura:** [`NOMENCLATURA_CONVENCIONES.md`](NOMENCLATURA_CONVENCIONES.md) ⭐ NUEVO

---

## 🚀 Archivos movidos a `review_files/` (2026-09-10)

Los siguientes **18 archivos NO son convenciones vigentes** — son operacionales, auditoría, onboarding, histórico, etc. Se movieron a `review_files/` con estructura:

```
review_files/
├── audit/                  (4 archivos: auditoría, checklists)
├── onboarding/            (3 archivos: setup, git hooks, guías)
├── agent-instructions/    (2 archivos: instrucciones para agentes)
├── governance/            (3 archivos: roles, responsabilidades)
├── support/               (3 archivos: guides, reportes técnicos)
└── changelog/             (2 archivos: histórico de features)
```

**Criterio:** Si un archivo es histórico, operacional, de soporte o contiene instrucciones → NO va en `conventions/` → va en `review_files/[categoría]/`.

---

## Empezar por aquí

1. Leer [`CONVENTIONS.md`](CONVENTIONS.md) — sistema rector, precedencia, orden de lectura por tipo de tarea.
2. Leer [`core/workflow-por-tipo-de-tarea.md`](core/workflow-por-tipo-de-tarea.md).
3. Ir al dominio correspondiente a tu tarea (ver abajo).

---

## ✅ Archivos vigentes (9 total)

### Documentos rectores (MAYÚSCULAS = fuente de verdad)

| Documento | Propósito |
|-----------|-----------|
| [`CONVENTIONS.md`](CONVENTIONS.md) | 🔴 **CRÍTICA** — Sistema rector completo. Lectura obligatoria. |
| [`CONVENTIONS_FOLDER_API.MD`](CONVENTIONS_FOLDER_API.MD) | Backend: Namespaces, módulos, submódulos, catálogo Shared Services |
| [`CONVENTIONS_FOLDER-FRONT.MD`](CONVENTIONS_FOLDER-FRONT.MD) | Frontend: Estructura Angular, decisiones, submódulos |
| [`CONVENTIONS_ENTITIES.md`](CONVENTIONS_ENTITIES.md) | Naming de entidades en `ApplicationDbContext` |

### Reglas especializadas (kebab-case)

| Documento | Propósito |
|-----------|-----------|
| [`encoding-stricto.md`](encoding-stricto.md) | UTF-8 obligatorio, no mojibake |
| [`decision-tree-components.md`](decision-tree-components.md) | Flujo de decisión: cuándo usar qué componente |
| [`changelog.md`](changelog.md) | Histórico de cambios, aprobaciones, versiones |

### Índices y gobernanza

| Documento | Propósito |
|-----------|-----------|
| [`../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md`](../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md) | Este archivo — Navegación y estructura |
| [`NOMENCLATURA_CONVENCIONES.md`](NOMENCLATURA_CONVENCIONES.md) | ⭐ **NUEVO** — Estándar de naming para archivos de convenciones |

### Protocolos operativos compartidos

| Documento | Propósito |
|-----------|-----------|
| [`operations/agent-commit-push.md`](operations/agent-commit-push.md) | Flujo común de commit/push y protección de cambios entre agentes |

---

## Dominios oficiales (subcarpetas)

| Carpeta | Contenido |
|---------|-----------|
| [`core/`](core) | Fundamentos: precedencia, gobernanza, workflow por tipo de tarea |
| [`backend/`](backend) | Reglas .NET 10 |
| [`frontend/`](frontend) | Reglas Angular 22 |
| [`flutter/`](flutter) | Reglas Flutter |
| [`ui/`](ui) | Componentes, diseño, accesibilidad |
| [`styles/`](styles) | CSS, tokens, temas |
| [`catalogs/`](catalogs) | Naming, estructura de carpetas/archivos |
| [`operations/`](operations) | Protocolos de documentación, auditoría, planes, onboarding |
| [`modules/`](modules) | Convenciones específicas de módulos puntuales |
| [`audit/`](audit) | Framework de auditoría: metodología, checklists, plantillas |
| [`guides/`](guides) | Protocolos para crear guías y delegar documentación |
| [`legacy/`](legacy) | Control de transición de contenido histórico ya absorbido |

**No debe haber nada aquí que no sea regla, protocolo, plantilla reutilizable o su control de transición.** Reportes de auditoría puntuales, resúmenes de sesión y planes de proyecto fechados NO van aquí — van en `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md` segun estructura plana de `CONVENTIONS.md` §6ter (ver [Política de qué NO va aquí](#política-de-qué-no-va-aquí) abajo).

---

## Referencias rápidas

### Backend
- [Backend Rules](backend/backend-rules.md)
- [Backend Module Structure](backend/backend-module-structure.md)
- [Document Read/Write Pattern](backend/document-read-write-pattern.md)

### Frontend
- [Frontend Rules](frontend/frontend-rules.md)
- [Angular: Signals & State](frontend/angular-signals-and-state.md)
- [Angular: Dialog/Modal Pattern](frontend/angular-dialog-modal-pattern.md)

### UI & Styles
- [UI Desktop Rules](ui/ui-desktop-rules.md)
- [Design Tokens Rule](ui/design-tokens-rule.md)
- [Styles Rules](styles/styles-rules.md)

### Auditoría
- [audit-prompt-comprehensive.md](audit/audit-prompt-comprehensive.md)
- [audit-checklist-completo.md](audit/audit-checklist-completo.md)

---

## Piezas absorbidas desde legacy (ya vigentes, no históricas)

- [core/governance-by-role.md](core/governance-by-role.md)
- [core/compliance-protocol.md](core/compliance-protocol.md)
- [audit/audit-by-role.md](audit/audit-by-role.md)
- [core/tech-lead-training.md](core/tech-lead-training.md)
- [operations/developer-onboarding.md](operations/developer-onboarding.md)
- [operations/tech-lead-onboarding.md](operations/tech-lead-onboarding.md)
- [ui/conventions-viewer-governance.md](ui/conventions-viewer-governance.md)
- [operations/module-documentation-instructions.md](operations/module-documentation-instructions.md)
- [`CONVENTIONS_FOLDER_API.MD` §12](CONVENTIONS_FOLDER_API.MD) — Catálogo de Servicios Compartidos (reemplaza `backend/backend-shared-services-catalog.md`, eliminado 2026-09-09)

## Legacy controlado y trazabilidad

- [legacy/../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](legacy/../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)
- [legacy/legacy-transition-matrix.md](legacy/legacy-transition-matrix.md)
- [legacy/20260730-master-coverage-status.md](legacy/20260730-master-coverage-status.md)
- [legacy/20260730-document-traceability-audit.md](legacy/20260730-document-traceability-audit.md)

Los documentos históricos en la raíz de esta carpeta no deben tomarse como fuente primaria solo por existir. Su uso queda controlado por la trazabilidad legacy y por `CONVENTIONS.md`.

## Política de qué NO va aquí

El 2026-09-09 se sacaron de esta carpeta 6 archivos que eran reportes/resúmenes/planes fechados, no reglas: `NULABILIDAD-COBRANZA-ONLINE-20260803.md`, `work-position-schedule-deprecation-inventory.md`, `20260810-auditoria-conventions-md.md`, `RESUMEN_SESION_CONVENTIONS_2026_08_10.md`, `20260729-conventions-system-restructure-plan.md`, `20260730-consolidacion-documental-total-plan.md` — reubicados bajo `docs/[Modulo]/[Submodulo]/` segun §6ter. Criterio para futuros archivos: si tiene fecha en el nombre y describe un evento/hallazgo/plan puntual ya ejecutado, no va en `conventions/`; si define una regla, protocolo o plantilla reutilizable, sí.

**Nota:** `agent-audit-protocol.md` y `PROTOCOLO_COMPLIANCE_CONVENCIONES.md` estaban listados aquí como "apoyo histórico activo" — el segundo **ya no existe** (absorbido en `core/compliance-protocol.md`, ver corrección en `legacy/../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md`). `DESIGN_CONVENTIONS.md` tampoco existe (absorbido en `ui/ui-desktop-rules.md` + `ui/ui-mobile-rules.md` per `CONVENTIONS.md` §8).

