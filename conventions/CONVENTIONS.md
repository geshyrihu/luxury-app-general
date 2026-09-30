 CONVENTIONS.md - Sistema Rector de Convenciones LuxuryApp

> **Fuente rectora del proyecto.**
> Este archivo define la jerarquía documental, las reglas mínimas universales y el
> orden de lectura obligatorio para cualquier agente o desarrollador.
>
> **Regla madre:** todo documento especializado deriva de este archivo y queda
> subordinado a el. Ningun documento secundario puede crear reglas nuevas por su cuenta.
>
> **Fecha de corte del sistema rector:** 2026-09-16 (referencia única para decidir si un documento es legacy; ver §2 y §8.1)
>
> **Estado:** Vigente

---

## 1. Que es este archivo

`CONVENTIONS.md` **no** intenta contener cada regla detallada del proyecto. Su función es:

1. Ser el **índice rector** de las convenciones.
2. Definir las **reglas mínimas universales**.
3. Definir la **precedencia documental**.
4. Definir el **orden de lectura obligatorio por tipo de tarea**.
5. Indicar **que documento especializado gobierna cada dominio**.

Si una regla detallada no vive aqui, debe vivir en un documento especializado
referenciado por este archivo.

---

## 2. Precedencia Documental

Cuando haya dudas, esta es la jerarquía obligatoria:

1. `CONVENTIONS.md`
2. `./core/*`
3. Documentos especializados por dominio en `./`
   - Incluye guias operativas de auditoria en `./audit/` (framework de auditoría exhaustiva)
4. Documentos de módulo y reportes centralizados en `docs/`:
   - Estructura física estricta en `docs/`: `docs/[ModuleLuxuryApp]/[Submodulo]/` (Estructura PLANA sin subcarpetas adicionales).
   - Backend Nivel 1: `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/README.md` (Nivel 1)
   - Backend Nivel 2: `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md` (Nivel 2)
   - Frontend: `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/operativo.md` (Operativo)
   - Frontend: `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/setup.md` (Onboarding)
   - Frontend: `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/decisiones.md` (Matriz de decisiones)
   - Auditorías y Reportes en `docs/`: `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md`
5. Documentacion tecnica de apoyo y reglas en este directorio `conventions/`
6. Componentes visuales como `conventions-viewer`

### Reglas de precedencia

- Si un documento secundario contradice este archivo, **gana este archivo**.
- Si un documento especializado contradice otro documento especializado, debe corregirse la contradiccion; no se permite convivencia de dos reglas validas para el mismo caso.
- Si falta una regla, el agente **no asume**: propone la regla y espera aprobacion del Tech Lead.
- Si una regla nueva contradice el estado actual del codigo, **no entra en vigor** hasta tener plan de migracion aprobado.
- Si un documento legacy usa estructura, numeracion, secciones o autoridad
  previa a la **fecha de corte del sistema rector** (2026-09-16, ver cabecera), no puede usarse como fuente normativa primaria.
  Solo puede usarse como insumo historico y debe validarse contra
  `CONVENTIONS.md` y `./*` antes de producir auditorias, planes o
  implementaciones.
- Ningun agente puede citar una seccion numerada vieja de `CONVENTIONS.md`, un
  índice historico o una guia legacy como fundamento de una regla vigente sin
  confirmar primero que sigue absorbida y activa en el sistema rector actual.

Ver tambien:
- [Precedencia Documental](./core/precedencia-documental.md)
- [Governance](./core/governance.md)

---

## 3. Reglas Minimas Universales

Estas reglas aplican siempre, sin importar si la tarea es backend, frontend,
flutter, auditoria, remediacion, documentacion o UI.

1. **No asumir, verificar.**
   No asumir APIs, librerias, helpers, endpoints, rutas, DTOs, nombres, estructura o dependencias instaladas.
2. **Leer antes de escribir.**
   Todo agente debe leer el contexto y la documentacion aplicable antes de modificar.
3. **No duplicar.**
   No duplicar logica, servicios, componentes, reglas o documentacion si ya existe una fuente oficial.
4. **Respetar naming, estructura y ubicacion.**
   Nombres, carpetas, archivos y namespaces siguen catalogos oficiales.
5. **No tocar shared sin control especial.**
   Ningun DTO shared, interface shared, helper shared, servicio base, contrato transversal, componente shared, pipe shared, widget shared, **SelectItem, SelectItemEnum o catalogo centralizado** se modifica sin analisis de impacto y aprobacion explicita. 🔴 CRÍTICA: SelectItem/SelectItemEnum **NUNCA se modifican post-creación**; si se necesitan valores distintos, se crea NUEVO (e.g., SelectItemStatusExtended).
6. **No romper contratos sensibles.**
   No cambiar rutas publicas, propiedades serializadas, algoritmos contables, reglas de seguridad, autorizacion o contratos externos sin instruccion explicita.
7. **Cambios importantes requieren flujo formal.**
   Analisis previo, plan por fases, checklist de tareas, aprobacion y luego ejecucion.
8. **No reubicar por iniciativa propia.**
   Si la ubicacion correcta no esta clara:
   - creacion nueva: proponer y esperar aprobacion
   - codigo existente: reportar o incluir en plan de migracion
9. **Los documentos tambien obedecen convenciones.**
   Ubicacion exacta, nombre exacto, estructura minima obligatoria y actualizacion del documento existente antes de crear duplicados.
10. **Toda regla aprobada debe reflejarse en el sistema completo.**
     Eso incluye `CONVENTIONS.md`, documentos especializados correspondientes (backend/, frontend/, audit/, operations/, modules/), índices afectados (`README.md`, `operations/README.md`, etc), documentación de módulos ([module]/docs/), el `conventions-viewer`, y cualquier capa operativa o visual subordinada que dependa de esa taxonomia.

11. **Servicios: reutilizar catálogos oficiales antes de crear propios — y ubicarlos en el nivel correcto.**
     - **Backend:** Servicios genéricos en `core/services/`, `core/http/services/`, `core/auth/services/`. Servicios de módulo en `Modules/[Modulo]/Services/` o `AppServices/`. **Prohibido** crear duplicados de `ApiResponseService`, `PaginationStore`, `CustomToastService`, `DialogHandlerService`, `StorageService`, `AuthService`, `EnumSelectService`, `DateService`, `FormHelper`, `GlobalErrorService`.
     - **Frontend:** Servicios genéricos en `core/services/` (70+ documentados). Servicios de feature en `providers` del componente (no en módulo). Ver catálogos obligatorios:
       - Backend: [Backend Generic Services Catalog](./backend/backend-generic-services-catalog.md)
       - Frontend: [Angular Services Catalog](./frontend/angular-services-catalog.md) + [Frontend Generic Services Catalog](./frontend/frontend-generic-services-catalog.md)
     - **Regla de ubicación:** Si el servicio es transversal a ≥2 módulos → `core/services/`. Si es específico de 1 módulo → dentro del módulo (`Services/`, `AppServices/`, o `providers` del componente). **Nunca** crear servicio local si ya existe en catálogo compartido.

Ver detalle en:
- [Rules Universales](./core/rules-universales.md)

---

## 3bis. Guía Rápida por Tarea — "Quiero hacer X, ¿dónde miro?"

> **Propósito:** Índice orientado a la acción. Si sabes **qué vas a hacer**, esta tabla te lleva directo a los documentos que necesitas leer **antes de escribir código**.
>
> El índice por dominios técnicos (§5.x) sigue vigente para consulta profunda.

### 1️⃣ CREAR ENTIDAD BACKEND
- **Ubicación**: `api/LuxuryApp.Application/Modules/[Modulo]/Domain/Entities/`
- **Naming**: PascalCase, hereda `GuidIdEntity` si tiene `Id`
- **Documentos clave**:
  - [Backend Rules](./backend/backend-rules.md) — tipo de columna, fechas, validaciones
  - [Naming Conventions](./catalogs/naming-conventions.md) — PascalCase, sufijos
  - [CONVENTIONS_ENTITIES.md](./CONVENTIONS_ENTITIES.md) — estructura entidad EF Core
  - [Folder Structure](./catalogs/folder-structure-conventions.md) — carpetas Domain/
  - [Backend Module Structure](./backend/backend-module-structure.md) — organización por módulo
  - [Enum DisplayName](./backend/enum-display-name-extension.md) — `[Display(Name="...")]` en español obligatorio

### 2️⃣ CREAR ENDPOINT / APP SERVICE / SERVICE
- **Ubicación**: `.../AppServices/` o `.../Services/` + `.../EndPoints/`
- **Métodos estándar**: `CreateAsync`, `GetByIdAsync`, `GetListAsync`, `UpdateAsync`, `DeleteByIdAsync`, `DeleteRangeAsync`
- **Constructor primario (C# 12)**: Obligatorio en Services/AppServices
- **DTOs**: 1 archivo = 1 DTO (`CreateXxxDTO`, `UpdateXxxDTO`, `XxxResponseDTO`)
- **Servicios genéricos**: Ver catálogo obligatorio antes de crear — si ya existe en `core/services/`, `core/http/services/`, `core/auth/services/` **no duplicar**.
- **Documentos clave**:
  - [API Method Naming](./backend/api-method-naming-conventions.md) — 6 patrones genéricos
  - [DTO Naming](./backend/dto-naming-conventions.md) — sufijos obligatorios
  - [DTO File Organization](./backend/dto-file-organization-rule.md) — 1 archivo = 1 DTO
  - [Backend Generic Services](./backend/backend-generic-services-catalog.md) — servicios base reutilizables (ApiResponseService, PaginationStore, CustomToastService, DialogHandlerService, StorageService, AuthService, EnumSelectService, DateService, FormHelper, GlobalErrorService)
  - [Select Items Centralization](./backend/select-items-centralization-rule.md) — **NO crear endpoints Select locales**

### 3️⃣ CREAR COMPONENTE FRONTEND (Angular 17+)
- **Ubicación**: `appsweb/angular/src/app/modules/[modulo].luxuryapp/[grupo]/[submodulo]/[categoria]/`
- **Naming**: `[entity]-[purpose].component.ts` (kebab-case)
- **Estándar**: Standalone + `OnPush` + `signal()`/`computed()`/`effect()`
- **Imports**: Alias `@[modulo].luxuryapp/...` (nunca rutas físicas `src/app/...`)
- **UI base**: Consumir `shared/ui` primero
- **Servicios**: Inyectar de catálogo compartido (`core/services/`) — no crear locales si ya existe. Ver [Angular Services Catalog](./frontend/angular-services-catalog.md) (70+ servicios: ApiResponseService, PaginationStore, CustomToastService, DialogHandlerService, StorageService, AuthService, EnumSelectService, DateService, FormHelper, GlobalErrorService, etc.)
- **Documentos clave**:
  - [Frontend Feature Structure](./frontend/frontend-feature-structure.md) — estructura carpetas
  - [Angular Components API](./frontend/angular-components-api.md) — `input()`, `model()`, standalone, OnPush
  - [Angular Signals & State](./frontend/angular-signals-and-state.md) — reactividad, Store Services, caching
  - [UI Shared Library](./ui/ui-shared-library-architecture.md) — catálogo componentes base
  - [UI Usage Catalog](./ui/ui-usage-catalog.md) — cuándo usar cada componente
  - [CONVENTIONS_FOLDER-FRONT.MD](./CONVENTIONS_FOLDER-FRONT.MD) — aliases, naming, desktop/mobile

### 4️⃣ CREAR FORMULARIO REACTIVO
- **Patrón**: `FormGroup<IType>` tipado, validadores custom
- **Fechas**: **NUNCA** `new Date()`, `formatDate`, ni `| date` directo → pipe `apiDate` + `DateService.getDateFormat()`
- **Documentos clave**:
  - [Angular Forms Pattern](./frontend/angular-forms-pattern.md) — Reactive Forms tipados
  - [Frontend Prohibitions](./frontend/frontend-prohibitions.md) — prohibiciones lectura/escritura fechas
  - [Angular Services Catalog](./frontend/angular-services-catalog.md) — `DateService`, `ApiDatePipe`
  - [CONVENTIONS.md §6.1](./CONVENTIONS.md#61-shared-contratos-y-dtos) — fila 11 "Fechas y horas" (detalle en Backend Rules)

### 5️⃣ USAR / CONFIGURAR SELECT (DROPDOWN)
- **Backend**: Solo 2 hubs oficiales (prohibido crear locales):
  - Enums estáticos → `SelectItemEnumEndPoints.cs` → `GET /api/select-item-enum/{ruta}`
  - Dinámicos → `SelectItemEndPoints.cs` → `GET /api/select-items/{ruta}`
- **Frontend**: Consumir endpoints centrales
- **Display**: Siempre `enum.GetDisplayName()` (español)
- **Regla de oro**: **NUNCA modificar SelectItem existente** → crear nuevo (`SelectItemStatusExtended`)
- **Documentos clave**:
  - [Select Items Centralization](./backend/select-items-centralization-rule.md) — hubs, naming, prohibiciones
  - [Enum DisplayName](./backend/enum-display-name-extension.md) — `GetDisplayName()`

### 6️⃣ MANEJAR ARCHIVOS (UPLOAD / DOWNLOAD / VIEW PDF)
- **Backend**: `IFileReadPathService` / `IFileWritePathService` (nunca exponer rutas físicas)
- **Frontend**: `<iw-button-view-pdf>` + `PdfViewerModal` (modal automático)
- **Multipart**: `[FromForm]` obligatorio, `.DisableAntiforgery()` condicional
- **Documentos clave**:
  - [Document Read/Write](./backend/document-read-write-pattern.md) — backend
  - [Document Display](./frontend/document-display-pattern.md) — frontend/UI
  - [Multipart/Antiforgery](./backend/multipart-antiforgery.md) — `[FromForm]`, antiforgery

### 7️⃣ ESTILOS / TOKENS / ICONOS
- **Tokens**: Solo `var(--ds-*)`, `var(--primary-*)`, `var(--surface-*)` — **NUNCA hardcodear** `#hex`, `px`, `rem`
- **Iconos**: Catálogo `AppIcon` → `<app-icon [icon]="AppIcon.X" />` (referencia tipada)
- **Responsive**: Desktop/Mobile separados
- **Documentos clave**:
  - [Design Tokens Rule](./ui/design-tokens-rule.md) — tokens obligatorios, prefijos permitidos
  - [UI Desktop Rules](./ui/ui-desktop-rules.md) / [UI Mobile Rules](./ui/ui-mobile-rules.md)
  - [Styles Rules](./styles/styles-rules.md) — estructura global

### 8️⃣ CREAR MÓDULO NUEVO (End-to-End)
- **Fase 0 OBLIGATORIA**: Business Rules Discovery **antes** de cualquier plan
- **6 documentos obligatorios** por módulo: lista y ubicaciones en §4.7; contenido mínimo en Module Documentation Instructions
- **Estructura docs**: `docs/[Modulo]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md` (plana, §6ter)
- **Documentos clave**:
  - [Business Rules Discovery Phase 0](./operations/business-rules-discovery-phase-0.md) — **lectura obligatoria antes de planear**
  - [Plan Creation Protocol](./operations/plan-creation-protocol.md) — 11 secciones formales
  - [Module Documentation Instructions](./operations/module-documentation-instructions.md) — 6 docs obligatorios
  - [Discovery Questionnaire](./operations/discovery-questionnaire-template.md)

### 9️⃣ AUDITAR MÓDULO EXISTENTE
- **Framework**: 8 secciones + checklist interactivo + matriz RN 4 niveles
- **4 niveles RN**: Invariante → Flujo → Seguridad → Validación (deben originarse en Fase 0)
- **Entregable**: `docs/[Modulo]/[Submodulo]/YYYYMMDD-auditoria-...md` con hallazgos + plan remediación
- **Documentos clave**:
  - [Audit Prompt Comprehensive](./audit/audit-prompt-comprehensive.md) — template completo
  - [Audit Checklist Completo](./audit/audit-checklist-completo.md) — 6 tipos de errores
  - [Audit Agent Instructions](./operations/audit-agent-instructions.md) — guía operativa
  - [Ejemplo Auditoría Candidates](./audit/ejemplo-auditoria-candidates.md) — piloto real

### 🔟 MIGRAR / REFACTORIZAR / LEGACY / ENCODING
- **Protocolo cumplimiento**: `compliance-protocol.md` + `data-migration-protocol.md`
- **Anti-Spanglish**: `GOVERNANCE-ANTI-SPANGLISH-RULES.md` (fases 0-4, target 2026-12-31)
- **Encoding/Mojibake**: `scan-mojibake.mjs` **debe dar 0** antes de merge
- **Documentos clave**:
  - [Compliance Protocol](./core/compliance-protocol.md)
  - [Data Migration Protocol](./operations/data-migration-protocol.md)
  - [Anti-Spanglish Rules](./GOVERNANCE-ANTI-SPANGLISH-RULES.md)
  - [Encoding Rules](./operations/encoding-rules.md) + [Encoding Strict](./encoding-stricto.md)
   - [Scripts scanner](../scripts/scan-mojibake.mjs) + [fix-mojibake.mjs](../scripts/fix-mojibake.mjs)

### 1️⃣1️⃣ COMMIT / PUSH DE CAMBIOS DE AGENTES
- **Regla:** solo incluir cambios atribuibles a la sesión actual del agente; nunca mezclar cambios del usuario u otros agentes.
- **Formato:** Conventional Commits en español, con scope `web`, `api` o `mobile`.
- **Flujo obligatorio:** revisar diff, stagear rutas exactas, validar staging, crear un commit por repositorio y hacer push al upstream.
- **Documento rector:** [Agent Commit and Push Protocol](./operations/agent-commit-push.md)

---

## Índice Cruzado Rápido (Búsqueda Directa)

| Si buscas... | Documento / Sección |
|--------------|---------------------|
| "Dónde pongo esta entidad" | [Backend Module Structure](./backend/backend-module-structure.md) + [Folder Structure](./catalogs/folder-structure-conventions.md) |
| "Cómo nombro este DTO" | [DTO Naming](./backend/dto-naming-conventions.md) + [DTO File Org](./backend/dto-file-organization-rule.md) |
| "Qué métodos debo tener en el service" | [API Method Naming](./backend/api-method-naming-conventions.md) + [Generic Services](./backend/backend-generic-services-catalog.md) |
| "Cómo hago un componente standalone" | [Angular Components API](./frontend/angular-components-api.md) + [Signals & State](./frontend/angular-signals-and-state.md) |
| "Dónde está el select de estados" | [Select Items Centralization](./backend/select-items-centralization-rule.md) (hubs únicos) |
| "Qué token de color uso" | [Design Tokens Rule](./ui/design-tokens-rule.md) + `_colors.scss` |
| "Cómo subo un archivo" | [Document Read/Write](./backend/document-read-write-pattern.md) + [Multipart](./backend/multipart-antiforgery.md) |
| "Reglas de naming general" | [Naming Conventions](./catalogs/naming-conventions.md) |
| "Checklist antes de crear archivo" | [Implementation Checklist](./operations/implementation-checklist.md) |
| "Reglas de precedencia documental" | [Precedencia Documental](./core/precedencia-documental.md) + [Governance](./core/governance.md) |
| "Workflow por tipo de tarea (detalle)" | [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md) — **§4 es fuente normativa** |
| "Servicios existentes y dónde crearlos" | [Angular Services Catalog](./frontend/angular-services-catalog.md) + [Backend Generic Services](./backend/backend-generic-services-catalog.md) + **CONVENTIONS.md §3 regla 11** |
| "Cómo committear y hacer push como agente" | [Agent Commit and Push Protocol](./operations/agent-commit-push.md) |

---

## 4. Orden de Lectura Obligatorio por Tipo de Tarea

**FUENTE DE VERDAD NORMATIVA:** Este apartado (§4).

El documento [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
es espejo operativo. Si hay desalineación, gana §4. Al cambiar §4 se re-sincroniza ese documento en el mismo cambio.

### 4.1 Implementacion Backend

1. `CONVENTIONS.md` (§6bis para ubicación de archivos)
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
2bis. [CONVENTIONS_FOLDER_API.MD](CONVENTIONS_FOLDER_API.MD) — 🔴 CRÍTICA: Namespaces, módulos, submódulos, SubServices/Helpers, naming
3. [Backend Rules](./backend/backend-rules.md)
4. [Naming Conventions](./catalogs/naming-conventions.md)
5. [Folder Structure Conventions](./catalogs/folder-structure-conventions.md)
6. [Backend Module Structure](./backend/backend-module-structure.md)
6bis. [Namespace Conventions](./backend/namespace-conventions.md) — 🔴 CRÍTICA: path-based, sin prefijo LuxuryApp.Application (2026-09-11)
7. [Backend Generic Services Catalog](./backend/backend-generic-services-catalog.md)
8. [Document Read/Write Pattern](./backend/document-read-write-pattern.md) — si el modulo maneja archivos o documentos
9. [Backend Export Services](./backend/backend-export-services.md) — 🔴🟠 ALTA: Excel (ClosedXML) & PDF (PdfSharp) generation, si el modulo exporta datos
10. Documento del modulo si existe

### 4.2 Implementacion Frontend

1. `CONVENTIONS.md` (§6bis para ubicación de archivos)
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
2bis. [CONVENTIONS_FOLDER-FRONT.MD](CONVENTIONS_FOLDER-FRONT.MD) — 🔴 CRÍTICA: Estructura submódulos (grupo→submódulo→categoría), desktop/mobile, naming, aliases de import `@[modulo].luxuryapp/`, guía de ubicación
3. [Frontend Rules](./frontend/frontend-rules.md)
4. [UI Desktop Rules](./ui/ui-desktop-rules.md)
5. [UI Mobile Rules](./ui/ui-mobile-rules.md)
6. [Styles Rules](./styles/styles-rules.md)
7. [Naming Conventions](./catalogs/naming-conventions.md)
8. [Frontend Feature Structure](./frontend/frontend-feature-structure.md)
9. [Frontend API Endpoints](./frontend/frontend-api-endpoints.md)
10. [Frontend Generic Services Catalog](./frontend/frontend-generic-services-catalog.md)
11. [Document Display Pattern](./frontend/document-display-pattern.md) — si el modulo muestra documentos/PDFs en listados

**Angular 17+ Infrastructure (Obligatorio antes de escribir código):**

12. [Angular: App Initialization](./frontend/angular-app-initialization.md) — 🔴 CRÍTICA: app.config.ts, providers, interceptadores, APP_INITIALIZER
13. [Angular: Services Catalog](./frontend/angular-services-catalog.md) — 🔴 CRÍTICA: 70+ servicios compartidos, cuándo inyectar vs crear
14. [Angular: HTTP Interceptors](./frontend/angular-http-interceptors.md) — 🔴 CRÍTICA: JWT + token refresh sincronizado, offline, image handling
14bis. [JWT Storage Security](./frontend/jwt-storage-security.md) — 🔴 CRÍTICA: Access token en memoria, refresh token en HttpOnly cookie, NUNCA localStorage
15. [Angular: Dialog/Modal Abstraction](./frontend/angular-dialog-modal-pattern.md) — 🔴 CRÍTICA: Web/Mobile unificado, DialogHandlerService
16. [Angular: Error Handling Pattern](./frontend/angular-error-handling-pattern.md) — 🔴 CRÍTICA: GlobalErrorHandler, logging, user feedback

**Angular 17+ Deep Dives (Requerido para componentes nuevos):**

17. [Angular: Signals, State & Caching](./frontend/angular-signals-and-state.md) — 🔴 CRÍTICA: signal(), computed(), effect(), Store Services pattern, caching strategy
18. [Angular: Forms Pattern](./frontend/angular-forms-pattern.md) — 🔴🟠 ALTA: Reactive Forms tipados, validadores custom, FormGroup<IType>
19. [Angular: Routing & Functional Guards](./frontend/angular-routing-guards.md) — 🔴🟠 ALTA: CanActivateFn, múltiples guards, lazy loading
20. [Angular: Components API](./frontend/angular-components-api.md) — 🔴🟠 ALTA: input(), model(), standalone, OnPush, @if/@for/@switch
21. [Accessibility (A11Y) Rules](./ui/a11y-accessibility-rules.md) — 🔴🟡 MEDIA: aria-label, keyboard navigation, contrast, touch targets
22. [Angular: Testing Patterns](./frontend/angular-testing-patterns.md) — 🔴🟡 MEDIA: TestBed setup, mocking, component & service testing
23. [Frontend Export & Download Services](./frontend/frontend-export-download-services.md) — 🔴🟠 ALTA: Excel (exceljs), PDF viewing (ng2-pdf-viewer), download patterns, si el modulo exporta/descarga datos

24. Documento del modulo o feature si existe

### 4.3 Implementacion Flutter

1. `CONVENTIONS.md`
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. [Flutter Rules](./flutter/flutter-rules.md)
4. [Naming Conventions](./catalogs/naming-conventions.md)
5. [Flutter Feature Structure](./flutter/flutter-feature-structure.md)
6. [Flutter Generic Services Catalog](./flutter/flutter-generic-services-catalog.md)
7. Documento del modulo si existe

### 4.4 Auditoria de Modulo

1. `CONVENTIONS.md`
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. [audit-prompt-comprehensive.md](./audit/audit-prompt-comprehensive.md) — Template de auditoría exhaustiva
4. [audit-checklist-completo.md](./audit/audit-checklist-completo.md) — Checklist interactivo
5. [ejemplo-auditoria-candidates.md](./audit/ejemplo-auditoria-candidates.md) — Ejemplo aplicado (piloto)
6. Documento del stack correspondiente
7. Documentos de naming, estructura, UI y styles que apliquen
8. Documento del modulo si existe
9. [Agent Task Catalog](./operations/agent-task-catalog.md)
10. [Audit Agent Instructions](./operations/audit-agent-instructions.md) — guia operativa de ejecucion

**Entregables de Auditoría:**

11. Auditoría ejecutada: `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md` (hallazgos reales con línea de código + plan remediación)
12. Plan derivado obligatorio si hay hallazgos críticos o altos

### 4.5 Documentacion, Remediacion y Migracion

1. `CONVENTIONS.md`
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. [Compliance Protocol](./core/compliance-protocol.md)
4. Documento especializado del stack
5. Documentos de estructura y naming aplicables
6. Documento del modulo si existe
7. Si hay conflicto con legacy: crear o seguir plan de migracion aprobado
8. [Agent Task Catalog](./operations/agent-task-catalog.md)
9. Si la tarea es crear plan: [Plan Creation Protocol](./operations/plan-creation-protocol.md)
10. Si la tarea es crear guia: [Guides Creation Protocol](./operations/guides-creation-protocol.md)
11. Si la tarea es documentar modulo existente: [Module Documentation Instructions](./operations/module-documentation-instructions.md)
    - Los **6 documentos obligatorios por módulo**, su ubicación y contenido: ver §4.7.

### 4.6 Creacion de Modulo Nuevo

**Nota:** Flujo completo cuando se solicita un modulo nuevo. Incluye descubrimiento de
reglas de negocio **antes** de planificacion. Ver diagrama de flujo en §5.9.

1. `CONVENTIONS.md` (este archivo)
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. [Discovery Questionnaire Template](./operations/discovery-questionnaire-template.md)
4. [FASE 0: Business Rules Discovery](./operations/business-rules-discovery-phase-0.md) — **lectura obligatoria antes de cualquier plan**
5. Estructura de documentos de módulo nuevo: `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md` (estructura plana §6ter; tipos: `discovery`, `business-rules`, `architecture`, `plan`, `documentation`, `checklist`)
6. [Application Roles Catalog](./operations/application-roles-catalog.md) — roles reales para Nivel 3 (Seguridad/RBAC)
7. [Plan Creation Protocol](./operations/plan-creation-protocol.md)
8. [Plan Agent Instructions](./operations/plan-agent-instructions.md)
9. [Data Migration Protocol](./operations/data-migration-protocol.md)
10. [Module Documentation Instructions](./operations/module-documentation-instructions.md)

**Timeline esperado:** 8-12 semanas (segun complejidad)

**Estructura plana por submódulo:**
```
docs/[ModuleLuxuryApp]/[Submodulo]/
├── YYYYMMDD-discovery-[modulo]-[submodulo].md
├── YYYYMMDD-business-rules-[modulo]-[submodulo].md
├── YYYYMMDD-architecture-[modulo]-[submodulo].md
├── YYYYMMDD-plan-[modulo]-[submodulo].md
├── YYYYMMDD-documentation-[modulo]-[submodulo].md
└── YYYYMMDD-checklist-[modulo]-[submodulo].md
```
*(Sin subcarpetas adicionales dentro de `[Submodulo]/`)*

**Referencia:** §6ter (estructura plana de documentos por módulo/submódulo)

### 4.7 Documentacion de Modulo Existente

**Nota:** Cuando un módulo backend/frontend ya existe y necesita documentarse de forma coherente.

**6 documentos obligatorios, sin excepciones opcionales.** Ubicación, contenido mínimo de cada uno y reglas de actualización: [Module Documentation Instructions](./operations/module-documentation-instructions.md).

| # | Documento | Ubicación |
|---|-----------|-----------|
| 1 | README del módulo (Nivel 1) | `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/README.md` |
| 2 | Documentación técnica (Nivel 2) | `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md` |
| 3 | Operativo (frontend) | `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/operativo.md` |
| 4 | Setup / onboarding (frontend) | `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/setup.md` |
| 5 | Decisiones (frontend) | `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/decisiones.md` |
| 6 | Auditoría ejecutada | `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md` |

**Orden de lectura obligatorio para developers:**

1. CONVENTIONS.md
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. Este apartado (§4.7)
4. README.md del módulo
5. Documentación técnica (Nivel 2)
6. Setup.md (si es dev nuevo)
7. Decisiones.md (si va a hacer una feature)
8. Arquitectura (si es senior dev)

**Referencias para ejemplos:**

- [Ejemplo Completo: Reclutamiento/Candidates](../docs/RecruitmentLuxuryApp/Candidates/20260813-auditoria-reclutamiento-candidatos.md)
- [Guía de Delegación a Otros Agentes](./guides/guia-delegacion-documentacion-modulos.md)
- Pilotos frontend (`operativo.md`, `setup.md`, `decisiones.md` de Candidates): **aún no existen** en `appsweb/angular/.../recruitment.luxuryapp/candidates/`; se crearán al documentar ese módulo.

### 4.8 Ejecución y Delegación Estratégica (Agentes CLI)

**Nota:** Regla oficial para la ejecución de código por agentes. El agente en sesión (Arquitecto) planea, y delega la escritura masiva a agentes CLI.

1. `CONVENTIONS.md`
2. [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
3. [Delegacion Estrategica](../.agents/skills/delegacion-estrategica/SKILL.md) — **Lectura obligatoria para usar Aider, KiloCode, OpenHands u OmniRoute**.

---

## 5. Dominios Documentales Oficiales

## 5.1 Core

- [Rules Universales](./core/rules-universales.md)
- [Precedencia Documental](./core/precedencia-documental.md)
- [Workflow por Tipo de Tarea](./core/workflow-por-tipo-de-tarea.md)
- [Compliance Protocol](./core/compliance-protocol.md)
- [Governance](./core/governance.md)
- [Governance by Role](./core/governance-by-role.md)
- [Tech Lead Training](./core/tech-lead-training.md)
- [Template de Documentos](./core/template-documentos-convencion.md)
- [README Convenciones](./README.md) — Índice general y guía de navegación del directorio `conventions/`

## 5.2 Backend

- [Backend Rules](./backend/backend-rules.md)
- [Backend Module Structure](./backend/backend-module-structure.md)
- [Backend Prohibitions](./backend/backend-prohibitions.md)
- [Backend Generic Services Catalog](./backend/backend-generic-services-catalog.md)
- [Arquitectura Monolítica Unificada](./backend/arquitectura-monolitica.md) — **NUEVO (2026-09-01): Todo el código de dominio, aplicación e infraestructura (EF Core, Logs, Vault) vive EXCLUSIVAMENTE dentro del proyecto `LuxuryApp.Application`. EXCEPCIONES permitidas: `LuxuryApp.Api` (endpoints, deprecable), `LuxuryApp.Tests` (test suites, path-based desde 2026-09-11). No crear nuevos satélites sin aprobación Tech Lead.**
- [Document Read/Write Pattern](./backend/document-read-write-pattern.md) — **PATRÓN OBLIGATORIO: IFileReadPathService, IFileWritePathService, acceso seguro a archivos**
- [DTO File Organization Rule](./backend/dto-file-organization-rule.md) — **REGLA CRÍTICA: 1 archivo = 1 DTO**
- [Select Items Centralization Rule](./backend/select-items-centralization-rule.md) — **REGLA CRÍTICA: hubs centralizados para SELECTs**
- [Enum Display Name Extension](./backend/enum-display-name-extension.md) — **REGLA CRÍTICA: DisplayName en español para enums**
- [API Method Naming Conventions](./backend/api-method-naming-conventions.md) — **Catálogo .NET estándar: 6 patrones genéricos, Async obligatorio, DTOs integrados**
- [DTO Naming Conventions](./backend/dto-naming-conventions.md) — **Naming DTOs: Create/Update/Response, sufijos obligatorios**
- [Multipart/Antiforgery Pattern](./backend/multipart-antiforgery.md) — **[FromForm] obligatorio, .DisableAntiforgery() condicional**
- [Testing Namespace Conventions](./backend/testing-namespace-conventions.md) — **Namespaces path-based para tests (2026-09-11)**
- [API & DTO/DAO Integration](./backend/API-AND-DTODAO-INTEGRATION.md) — **Integración API-DTO-DAO, patrones de mapeo**
- [Convenciones Entidades](./CONVENTIONS_ENTITIES.md) — Reglas de naming y estructura para entidades EF Core
- [Convenciones Testing](./CONVENTIONS_TESTING.md) — Estándares de testing backend/frontend
- [API Method Naming (Legado)](./API-METHOD-NAMING.md) — Versión previa, ver `backend/api-method-naming-conventions.md`

## 5.3 Frontend

- [Frontend Rules](./frontend/frontend-rules.md)
- [Frontend Feature Structure](./frontend/frontend-feature-structure.md)
- [Frontend API Endpoints](./frontend/frontend-api-endpoints.md)
- [Frontend Prohibitions](./frontend/frontend-prohibitions.md)
- [Frontend Generic Services Catalog](./frontend/frontend-generic-services-catalog.md)
- [Document Display Pattern](./frontend/document-display-pattern.md) — **PATRÓN OBLIGATORIO: WebButtonIconViewPdf, PdfViewerModal, nombres legibles en UI**

## 5.4 Flutter

- [Flutter Rules](./flutter/flutter-rules.md)
- [Flutter Feature Structure](./flutter/flutter-feature-structure.md)
- [Flutter Prohibitions](./flutter/flutter-prohibitions.md)
- [Flutter Generic Services Catalog](./flutter/flutter-generic-services-catalog.md)

## 5.5 UI

- [UI Desktop Rules](./ui/ui-desktop-rules.md)
- [UI Mobile Rules](./ui/ui-mobile-rules.md)
- [UI Usage Catalog](./ui/ui-usage-catalog.md)
- [UI/UX Composition Rules](./ui/ui-ux-composition-rules.md) — **REGLA CRÍTICA: Alineación de formularios, cero márgenes improvisados, reglas para Toggles y uso de Grid/Flexbox.**
- [UI Shared Library Architecture](./ui/ui-shared-library-architecture.md)
- [UI Audit Protocol](./ui/ui-audit-protocol.md) — **Auditoría de componentes, responsive, accesibilidad, diseño**
- [Design Tokens Rule](./ui/design-tokens-rule.md) — **REGLA CRÍTICA: todos los valores visuales vía tokens, NUNCA hardcodeados**
- [Conventions Viewer Governance](./ui/conventions-viewer-governance.md)
- [Decision Tree Components](./decision-tree-components.md) — Árbol de decisión para crear/ubicar componentes UI


- **Iconos:** `<app-icon>` es el estándar web; `<ili-icon>` el de móvil (solo en `shared/ui/mobile/**`); `<lx-icon>` es el wrapper adaptativo. Los valores salen del catálogo `AppIcon` y `pi pi-` directo está prohibido. Regla completa: [Icon Usage Rule](./ui/icon-usage-rule.md) y [app-icon Usage](./ui/app-icon-usage.md); severidad en la tabla de §6.1 (fila 9).


## 5.6 Styles

- [Styles Rules](./styles/styles-rules.md)
- [Styles Structure](./styles/styles-structure.md)
- [Styles Tokens and Theming](./styles/styles-tokens-theming.md)

### 5.6.1 Repintado por tema en canvas / SVG generado por JS (RN-DS-040)

Todo componente que resuelva tokens a valores concretos en JS (canvas, SVG
generado, colores calculados) DEBE registrar un `effect()` sobre
`ThemeService.themeMode` que fuerce el repintado. Resolver un token en JS rompe
la reactividad de tema que `var()` da gratis; recuperarla es responsabilidad
del componente.

- Referencias: RN-DS-015 y RN-DS-027 en `docs/SharedLuxuryApp/DesignSystem/20260809-plan-design-system-remediacion.md` (todo valor visual responde al cambio de tema; la validación estática en verde no autoriza afirmar que el criterio se cumple en el DOM).
- Patrón canúnico en `appsweb/angular` (charts): `trackChartTheme()` en
  `src/app/shared/ui/web/charts/echarts-adapters.ts` crea el `effect()` que lee
  `themeMode()` e incrementa `dsThemeTick`; las funciónes que resuelven tokens
  (`cssVar`, `resolveDsColor`) leen `dsThemeTick` para registrarse como
  dependencia, de modo que los `computed`/`[style.*]` que las usan se
  reevalúan al cambiar de tema.
- `scripts/audit-ds-tokens.mjs` detecta (heurística) archivos que leen un token
  `--ds-*` vía `getComputedStyle`/`getPropertyValue` sin referenciar
  `themeMode` o `ThemeService`: son candidatos a token congelado.
- **Corolario (APIs que aceptan valores derivados de tokens):** un componente no
  puede devolver la reactividad de tema a un valor que ya llegó resuelto. Cuando
  una API acepte valores derivados de tokens, debe aceptar una **función que los
  produzca** (`optionsFactory`), no solo el resultado (`options`). El resultado
  ya resuelto queda congelado; la función se re-invoca al cambiar el tema y
  resuelve los tokens frescos. Patrón canúnico en `appsweb/angular`:
  `chart-wrapper.ts` expone `optionsFactory` (un `() => EChartsCoreOption`) que
  su `computed` re-invoca dentro de la dependencia de `dsThemeTick`, frente a
  `options` que es un escape hatch no reactivo.

### 5.6.2 Capas de tokens con alcance de módulo (RN-DS-041)

Un color que **solo usa un módulo** no pertenece a `core/_colors.scss`. Va en una
capa con alcance propio, con prefijo del módulo, declarada una sola vez en el
archivo que la usa. La regla que se cumple no es "todo color es un token del DS",
sino **"ningún color se escribe dos veces"**.

Referencia: `src/styles/custom/_financial-tables.scss` (Sprint 4, 2026-08-10).
103 hex dispersos pasaron a 49 tokens `--rf-*` declarados en un solo bloque, con
0 hex fuera de él. Los valores no se alinearon a `--ds-*` porque la medición de
distancia perceptual (ΔE76) dio entre 5 y 13 en 13 de 16 casos: alinearlos
habría sido un cambio visible, no una refactorización.

Dos reglas que se derivan de ese trabajo:

1. **Una capa con alcance es invariante al tema, o no lo es — nunca a medias.**
   Mezclar tokens derivados de `--ds-*` (que cambian con el tema) con literales
   fijos produce, en el tema contrario, texto de un tema sobre fondo del otro.
2. **Antes de sustituir un color por un token, mide.** Si ΔE > 2.5 el cambio es
   perceptible y deja de ser una refactorización: requiere visto bueno de quien
   sea dueño de esa pantalla.

## 5.7 Catalogos Transversales

- [Naming Conventions](./catalogs/naming-conventions.md)
- [Folder Structure Conventions](./catalogs/folder-structure-conventions.md)
- [File Structure Conventions](./catalogs/file-structure-conventions.md)
- [Module Master Domain Map](./catalogs/module-master-domain-map.md)
- [Nomenclatura Convenciones](./nomenclatura-convenciones.md) — Catálogo de nomenclatura legado (referencia histórica)
- [Plan Estandarización Nomenclatura](./PLAN_ESTANDARIZACION_NOMENCLATURA.md) — Plan de migración a inglés puro (2026-09)

## 5.8 Auditoria

**Regla clave:** Toda auditoría de módulo verifica Reglas de Negocio (RN-MOD-NNN) clasificadas en 4 niveles jerárquicos:

1. **Nivel 1: Invariantes de Dominio** — restricciones inmutables del negocio
2. **Nivel 2: Flujo y Estados** — ciclos de vida, transiciones válidas
3. **Nivel 3: Seguridad/Autorización** — RBAC, protección de datos, auditoría
4. **Nivel 4: Validación de Datos** — formatos, límites, constraints

Estos 4 niveles **deben originarse en FASE 0** (cuando se planea el módulo) y **verificarse en auditoría**.

**Framework de Auditoría Exhaustiva (2026-08-10):**

- [audit-prompt-comprehensive.md](./audit/audit-prompt-comprehensive.md) — Prompt template completo para auditar cualquier módulo (8 secciones detalladas)
- [audit-checklist-completo.md](./audit/audit-checklist-completo.md) — Checklist interactivo con 6 tipos de errores a buscar (entidades, permisos, flujos, validaciones, lógica)
- [security-audit-checklist.md](./audit/security-audit-checklist.md) — 🔴 Clases de ataque (aislamiento por `Customer`, control de acceso, inyección), veredicto confirmado/necesita validación/rechazado, verificación adversarial (adaptado de `cloudflare/security-audit-skill`, 2026-09-30)
- [ejemplo-auditoria-candidates.md](./audit/ejemplo-auditoria-candidates.md) — Aplicación real paso a paso (ejemplo piloto: Reclutamiento/Candidates)
- [Audit Agent Instructions](./operations/audit-agent-instructions.md) — guia operativa nivel 3; matriz RN con 4 niveles
- [Auditoría Rutas Agentes 2026-09-10](./AUDIT_RUTAS_AGENTES_20260910.md) — Inventario y análisis de rutas de agentes

**Auditorías Ejecutadas (Hallazgos Reales):**

- `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md` — Hallazgos específicos por módulo, con línea de código y plan remediación

### 5.8.1 Modo baseline en los audits de `appsweb/angular`

Los audits de calidad del frontend (`npm run lint`) trabajan en **modo baseline**:

- **Qué significa:** las violaciones **preexistentes** quedan registradas en un baseline y se
  **toleran** (se reportan como `conocidas`). El sello solo falla (exit 1) ante violaciones
  **NUEVAS** (fuera del baseline). Una violación ya registrada que desaparece se reporta como
  `resuelta`.
- **El baseline SOLO PUEDE BAJAR.** Nunca se regenera para "arreglar" un fallo. Un baseline
  que crece significa deuda nueva; el sello existe exactamente para impedirlo.
- **`--update-baseline` se usa ÚNICAMENTE al resolver violaciones** (porque el baseline debe
  reflejar la deuda real restante), **nunca al introducirlas**. Si el lint falla y el arreglo
  correcto es resolver la violación, se resuelve y luego se actualiza el baseline.
- **Dónde viven:** `./conventions/audit/baseline-*.json` (`baseline-apps.json`,
  `baseline-apps-ui.json`, `baseline-tokens.json`, `baseline-design.json`, `baseline-css.json`).
  **Estado (2026-09-19):** Sistema baseline planificado. Archivos no existen aún. Se crearán al activar el sistema baseline (requiere aprobación Tech Lead).
- **Clave estable:** cada entrada es `<archivo relativo>|<descripción de la violación>`, **sin
  nómero de línea**, para que mover código no genere falsos positivos.

Audits en modo baseline: `audit:apps`, `audit:apps-ui`, `audit:tokens`, `audit:design`,
`audit:css`. Ver runbook Fase 2 en `docs/SharedLuxuryApp/DesignSystem/` (tareas 2.2-2.8, estructura plana §6ter).

## 5.9 Operacion

### Flujo Obligatorio: Modulo Nuevo → FASE 0 → Plan → Auditoria

Orden de lectura detallado: **§4.6**. Diagrama del flujo completo:

```
1. Discovery Questionnaire
   ↳
2. FASE 0: Pre-Planeación (Business Rules Discovery)
   ├── 0.1 Problem Statement + KPIs
   ├── 0.2 Matriz Reglas de Negocio (4 niveles jerárquicos)
   └── 0.3 Pre-Mortem + Flujos (Happy/Sad/Edge)
   ↳
3. Plan Formal (11 secciones)
   ├── Secciones 1-3: alimentadas por FASE 0
   ├── Secciones 4-11: implementación detallada
   └── Criterios de paso: verificables contra FASE 0
   ↳
4. Auditoría de Módulo (con trazabilidad RN)
   ├── Verificar que cada Regla de Negocio está en código
   ├── Validar 4 niveles jerárquicos (Invariante → Flujo → Seguridad → Validación)
   └── Generar plan de remediación si hay brechas
```

**Referencias obligatorias** (listadas en detalle en §4.6):

- [Discovery Questionnaire Template](./operations/discovery-questionnaire-template.md)
- [FASE 0: Business Rules Discovery](./operations/business-rules-discovery-phase-0.md)
- [Application Roles Catalog](./operations/application-roles-catalog.md)
- [Plan Creation Protocol](./operations/plan-creation-protocol.md)
- [Plan Agent Instructions](./operations/plan-agent-instructions.md)
- [Data Migration Protocol](./operations/data-migration-protocol.md)
- [Audit Module Conventions](./audit/audit-module-conventions.md)

**Regla clave:** Ningun plan puede iniciarse sin completar FASE 0. FASE 0 es obligatoria y debe ser auditable (documentada en el módulo).

**Ubicación de FASE 0:**
- **Módulos nuevos:** `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-business-rules-[modulo]-[submodulo].md`
- **Módulos existentes (re-auditoría):** `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md` (sección "Matriz de Reglas de Negocio - 4 Niveles")

### Documentos de Operación

- [Operations README](./operations/README.md)
- [Implementation Checklist](./operations/implementation-checklist.md)
- [Available Features](./operations/available-features.md)
- [Module Documentation Instructions](./operations/module-documentation-instructions.md)
- [Guides Creation Protocol](./operations/guides-creation-protocol.md)
- [Encoding Rules](./operations/encoding-rules.md)
- [Encoding Strict Mode](./encoding-stricto.md) — Reglas estrictas de encoding y anti-mojibake (scanner canúnico)
- [Git Hooks and Audit Automation](./operations/git-hooks-and-audits.md)
- [Developer Onboarding](./operations/developer-onboarding.md)
- [Tech Lead Onboarding](./operations/tech-lead-onboarding.md)

### 5.9.1 Notificaciones — Email, Push, In-App, WhatsApp

✅ **APROBADA (2026-08-12).** El sistema de notificaciones es centralizado, tipado y con URLs resueltas en el dispatcher. Reglas mínimas (prohibido hardcodear URLs, URLs relativas a OneSignal y colores inline en email; obligatorio Razor y `IFileReadPathService.GetSecureFileUrl()`), servicios obligatorios y documentos de detalle: [Backend Notifications Rules](./backend/backend-notifications-rules.md).

### 5.9.2 Background Jobs (Hangfire) — Procesos Recurrentes

✅ **APROBADA (2026-08-12).** Los jobs recurrentes siguen un patrón centralizado (naming `[Concepto]Job`, `async Task ExecuteAsync()`, tenant/usuario por `ITenantAccessor`/`ICurrentUserService`, `try-catch` con logging obligatorio, cron documentado, dashboard `/hangfire` solo Admin; cambios de horario requieren Tech Lead). Ubicación oficial: `api/LuxuryApp.Application/Modules/AdminLuxuryApp/Infraestructura/Jobs/Workers/`, registro único en `HangfireJobCatalog.cs`. Detalle: [Backend Jobs Hangfire](./backend/backend-jobs-hangfire.md) y [Jobs Checklist](./backend/backend-jobs-checklist.md). Plan: `docs/AdminLuxuryApp/Jobs/20260812-remediacion-admin-jobs.md`.

## 5.10 Modulos

- [CobranzaNativa Module Conventions](./modules/cobranza-nativa-module-conventions.md)
- [CobranzaOnline Module Documentation](./modules/cobranza-online-module-documentation.md)

## 5.11 Ecosistema de Agentes y Skills

Este dominio gobierna las habilidades (`skills`) y directrices operativas para las IAs (Antigravity, Aider, KiloCode, etc.). 
Los agentes deben apoyarse en estos recursos en lugar de usar guías obsoletas:

- **Carpeta oficial de habilidades:** `.agents/skills/` / `.kilocode/skills/`
- [Delegacion Estrategica](../.agents/skills/delegacion-estrategica/SKILL.md) — Estrategia oficial de orquestación, fallback (OmniRoute) y ejecución CLI.
- [Planeacion Modulos](../.agents/skills/planeacion-modulos/SKILL.md) — Workflow para planear módulos ANTES de escribir código.
- [Angular Developer](../.agents/skills/angular-developer/SKILL.md) — Guía especializada para desarrollo frontend.
- [Guide Agent Instructions](./guides/guide-agent-instructions.md) — Instrucciones para agentes de documentación
- [Guía Delegación Documentación Módulos](./guides/guia-delegacion-documentacion-modulos.md) — Protocolo de delegación a agentes CLI

## 5.12 Gobernanza de Idioma & Anti-Spanglish

**Objetivo:** Prevenir mezcla español-inglés (spanglish) en nuevo código y auditar coherencia idiomática.

Documento oficial: [GOVERNANCE-ANTI-SPANGLISH-RULES.md](./GOVERNANCE-ANTI-SPANGLISH-RULES.md)

## 5.13 Estándar de Diseño para Documentos MD

**Objetivo:** Uniformidad visual, operacional y de gobernanza en todos los documentos (planes, reportes, auditorías).

**Documentos oficiales:**
- [DOCUMENT-DESIGN-STANDARD.md](./DOCUMENT-DESIGN-STANDARD.md) — 11 secciones canónicas, emojis estratégicos, paleta Mermaid, checklists
- [DOCUMENT-RULES-MANDATORY.md](./DOCUMENT-RULES-MANDATORY.md) — 🔴 6 reglas obligatorias (tablas de inventario, ADR, metadata, automatización, riesgos)

**6 Reglas Obligatorias (en orden de aplicación):**

| Regla | Requisito | Ubicación | Verificación PR |
|---|---|---|---|
| **REGLA 1** | Tabla inventario (Componente \| Cambio \| Esfuerzo S/M/L) | §5 Alcance | Buscar patrón `\| S/M/L \|` |
| **REGLA 2** | Tabla matriz Dependencias (Sistema \| Relación \| Versión \| Impacto) | §10 Dependencias | Buscar tabla con 4 cols (no bullets) |
| **REGLA 3** | ADR mini (Decisión \| Alternativa rechazada \| Razón) | §6 Arquitectura | Buscar sección "Decisiones de Diseño" |
| **REGLA 4** | Metadata en fases (Owner \| Esfuerzo \| Dependencias \| Criterio éxito) | §7 Fases | Cada fase tiene tabla 4 cols |
| **REGLA 5** | Especificar Automatización (E2E/Unit/Manual) | §8 Criterios de Paso | Buscar palabra "Automatización" |
| **REGLA 6** | Marcar 🔴 riesgos críticos (Impacto/Probabilidad Alta) | §9 Riesgos | Riesgos críticos tienen emoji 🔴 |

**Aplicación:**
- ✅ Todos los **nuevos planes** (obligatorio 100%)
- ✅ Todos los **reportes de auditoría** (obligatorio REGLA 6, recomendado 1)
- ✅ Todos los **análisis de coherencia** (obligatorio REGLA 1, 6)
- ⏳ Documentos existentes: agregar por prioridad (ver DOCUMENT-RULES-MANDATORY.md "Cómo Aplicar")

**Reglas minimales (extracto):**

| Capa | Idioma | Enforcement |
|------|--------|-------------|
| HTTP API (rutas, verbs) | 🇬🇧 100% Inglés | Obligatorio |
| DTO/Record (propiedades públicas) | 🇬🇧 100% Inglés | Obligatorio + CI gate |
| Entidad EF Core | 🇬🇧 100% Inglés | Obligatorio + CI gate |
| Interfaz/Clase pública | 🇬🇧 100% Inglés | Obligatorio |
| Namespace/Carpeta | 🇬🇧 100% Inglés | Obligatorio |
| Privados/métodos privados | 🟡 Español permitido (temporalmente) | Deuda técnica (target: 2026-12-31) |

**Patrones prohibidos:**
- Prefijos nominales españoles (FechaX, NumeroX, TipoX) en público. Usar inglés: CreationDate, AccountNumber, PolicyType.
- Preposiciones compuestas (MetodoDePago, DiasDeTrabajo). Usar PaymentMethod, WorkDays.
- Adjetivos españoles + sustantivo inglés (TotalCuentasActivas). Usar TotalActiveAccounts.

**Prioridad de migración:** Fase 0–4 definidas en GOVERNANCE-ANTI-SPANGLISH-RULES.md §3 (Risk-Based).

**Decisiones bloqueantes (Tech Lead):**
1. Opción A (Pure English) u Opción B (Transición + Aspel handling)?
2. ¿Migración de BD o [Column("nombreViejo")]?
3. ¿Sync frontend o [JsonPropertyName]?

Revisar y resolver antes de ejecutar Fase 2 (Namespaces) o Fase 3 (DTOs/Entities).

---

## 6. Reglas Especiales ya Acordadas

### 6.1 Shared, contratos y DTOs

- Nada compartido se modifica sin analisis de impacto y aprobacion explicita.
- Si una correccion requerida afecta shared o contrato externo, primero se reporta y se propone plan de migracion.
- En backend, todo DTO local que declare `Id` debe heredar de `GuidIdEntityDTO`.
- En backend, los namespaces se derivan de la ruta fisica (politica unica, ver §6bis y CONVENTIONS_FOLDER_API.MD §2).

#### Reglas críticas — resumen y dónde vive cada una

Este apartado **no repite** el detalle de las reglas: cada una vive completa (con ejemplos, gates y comandos de auditoría) en su documento especializado, que es lectura obligatoria al tocar ese tema (§3bis y §4). Aquí solo se fija **qué regla existe, su severidad y quién la gobierna**. Un hallazgo de auditoría se clasifica según la columna "Severidad".

| # | Regla | Severidad | En una línea | Gate hoy | Documento que la gobierna |
|---|-------|-----------|--------------|----------|---------------------------|
| 1 | 1 archivo = 1 DTO | 🔴 CRÍTICA | Cada DTO en su propio archivo; varios por archivo es hallazgo crítico. | ✅ ratchet en `api/` (`multiDtoPerFile`) | [DTO File Organization](./backend/dto-file-organization-rule.md) |
| 2 | Sin `?` en propiedades | 🔴 CRÍTICA | El proyecto usa `#nullable disable`; nunca `?` en DTOs, Entities o records (causa CS8632). | ✅ ratchet en `api/` solo para tipos de referencia (`nullableRefProps`); `Guid?`/`DateTime?`/enum? son informativos, alcance pendiente de decisión (ver `backend/backend-rules.md`) | [Backend Rules](./backend/backend-rules.md) |
| 3 | Constructores primarios (C# 12) | 🟡 Consistencia | Services/AppServices inyectan por constructor primario, no por campos `private readonly`; se corrige al tocar el archivo. | ⬜ sin gate | [Backend Rules](./backend/backend-rules.md) |
| 4 | SELECTs centralizados | 🔴 CRÍTICA | Solo 2 hubs: `SelectItemEnumEndPoints` (enums) y `SelectItemEndPoints` (dinámicos). Prohibido crear locales. | ✅ ratchet en `api/` solo para endpoints SelectItem fuera de `SharedLuxuryApp` (`localSelectItemEndpoint`); el resto 🔶 greps manuales | [Select Items Centralization](./backend/select-items-centralization-rule.md) |
| 5 | Nunca modificar un SelectItem existente | 🔴 CRÍTICA | Si hace falta otra lista, crear una nueva (p. ej. `SelectItemStatusExtended`); modificarla rompe a los consumidores. | ⬜ sin gate (revisión humana) | [Select Items Centralization](./backend/select-items-centralization-rule.md) |
| 6 | DisplayName en español | 🔴 CRÍTICA | Todo enum con `[Display(Name="...")]` y listados con `GetDisplayName()`, nunca `ToString()`. | 🔶 greps manuales | [Enum Display Name](./backend/enum-display-name-extension.md) |
| 7 | Textos sin mojibake | 🔴 CRÍTICA | `node scripts/scan-mojibake.mjs <ruta>` debe dar 0 antes de mergear (`npm run audit:encoding`). | ✅ CI, solo `appsweb/angular` (api, docs y conventions sin gate) | [Encoding Rules](./operations/encoding-rules.md) |
| 8 | Tokens CSS, nunca hardcoding | 🔴 CRÍTICA | Todo valor visual vía `var(--ds-*)`, `var(--primary-*)`, `var(--surface-*)`. | ✅ CI `audit:tokens`, alcance `src/styles` + `shared/ui`; `modules/**` solo se reporta | [Design Tokens Rule](./ui/design-tokens-rule.md) |
| 9 | Iconos vía catálogo | 🔴 CRÍTICA | `<app-icon [icon]="AppIcon.X" />`; un nombre inexistente no falla, no dibuja. Gate: `npm run audit:icon-names`. | ✅ CI `audit:icon-names` | [Icon Usage Rule](./ui/icon-usage-rule.md) |
| 11 | Fechas y horas | 🔴 CRÍTICA | Backend: `DateOnly`/`DateTime`/`TimeOnly` según semántica, sin `DateTime.Now`. Frontend: lectura con pipe `apiDate`, escritura con `DateService.getDateFormat()`. | ✅ ratchet en `api/` para `DateTime.Now/Today` (`dateTimeNow`); frontend 🔶 greps manuales | [Backend Rules](./backend/backend-rules.md) · [Frontend Prohibitions](./frontend/frontend-prohibitions.md) |
| 12 | Documentos (carga, lectura, visualización) | 🔴 CRÍTICA | Nunca exponer rutas físicas; mostrar `Name`, no el UUID; usar `<iw-button-view-pdf>`; borrar el archivo al borrar la entidad. | ⬜ sin gate | [Document Read/Write](./backend/document-read-write-pattern.md) · [Document Display](./frontend/document-display-pattern.md) |
| 13 | `[FromForm]` en multipart | 🔴 CRÍTICA | Todo endpoint con `IFormFile` lleva `[FromForm]` (sin él, HTTP 415); `.DisableAntiforgery()` solo con Bearer stateless y análisis documentado. | ✅ ratchet en `api/` (`formFileWithoutFromForm`, heurística por archivo de endpoints) | [Multipart/Antiforgery](./backend/multipart-antiforgery.md) |

**Columna "Gate hoy"** (inspirada en la columna "Checked by" de `CONSTRAINTS.md` de `addyosmani/agent-skills`: una regla sin comando que la verifique es una aspiración, no una restricción):

- ✅ **CI:** un comando bloquea el merge automáticamente.
- 🔶 **grep manual:** el documento de la regla trae comandos de auditoría, pero nadie los corre por defecto.
- ⬜ **sin gate:** solo depende de que el agente o el revisor la recuerden.

Estado a 2026-09-25: de 13 reglas, 8 tienen gate (1, 2, 4, 7, 8, 9, 11, 13; las reglas 2, 4 y 11 solo de forma parcial), 1 tiene solo grep manual (6) y 4 no tienen gate (3, 5, 10, 12). Los gates 7, 8 y 9 son del frontend (`appsweb/angular`). Los de backend (1, 2, 4, 11, 13) son un **ratchet** en `api/scripts/audit-conventions-backend.mjs` + `api/.github/workflows/conventions-gate.yml`: la deuda existente queda fijada en `api/scripts/conventions-gate.baseline.json` y el CI falla solo si una regla empeora (10 `ProjectTo`, 8 `DateTime.Now/Today`, 42 `?` en tipos de referencia, 22 archivos con más de un DTO, 3 endpoints con `IFormFile` sin `[FromForm]`, 1 endpoint SelectItem local). El gate está commiteado en `api/` (commit `4048096a0`) y se activa en GitHub al llegar a `main`; `api/` sigue sin `TreatWarningsAsErrors`, hooks ni tests de arquitectura, y el CI aún no compila ni corre `LuxuryApp.Tests`. Al añadir o bajar un gate, se actualiza esta celda en el mismo cambio.

> **Regla de sincronía:** si cambia una regla de esta tabla, se cambia primero su documento especializado y aquí solo la fila (§7 y regla 10 de §3).

### 6.2 Backend y frontend deben corresponderse

- El dominio maestro backend debe mapear al dominio frontend equivalente.
- El nombre semantico del modulo debe ser el mismo entre back y front.
- Backend usa convencion de nombres del stack; frontend usa convencion de carpeta/ruta del stack.

### 6.3 Endpoints frontend

- Todos los endpoints frontend se registran por dominio en `appsweb/angular/src/app/core/constants`.
- No se permite hardcodear strings de endpoint en componentes o servicios de feature fuera del patron oficial.

### 6.4 UI y styles

- Toda feature consume primero desde `appsweb/angular/src/app/shared/ui`.
- Si falta un componente o patron visual, se propone y se espera aprobacion antes de crearlo.
- `appsweb/angular/src/styles` es capa global controlada; no se agregan tokens o estructuras nuevas sin revisar impacto.
- UI y styles forman parte obligatoria de la auditoria de modulo.

### 6.5 Viewer de convenciones

Existe un viewer vivo en:
[conventions-viewer](../appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer)

Ese viewer no es fuente de verdad, pero **debe** actualizarse cuando cambie el sistema oficial de convenciones.

Reglas operativas del viewer:

- no introduce reglas nuevas por su cuenta
- refleja la taxonomia oficial vigente
- mantiene sincronizados dataset, etiquetas, filtros y referencias documentales
- no conserva helpers, mapeos o secciones viejas que ya no correspondan al sistema rector actual
- cualquier desalineacion entre documentos oficiales y viewer se reporta y se corrige

---

## 6bis. Directorios, Namespaces y Ubicación de Archivos

**FUENTE DE VERDAD DETALLADA:** [CONVENTIONS_FOLDER_API.MD](CONVENTIONS_FOLDER_API.MD) (backend) y [CONVENTIONS_FOLDER-FRONT.MD](CONVENTIONS_FOLDER-FRONT.MD) (frontend) — documentos independientes especializados en estructura física del código, separados el 2026-09-09 (antes un único `CONVENTIONSFOLDER.MD`).

Este apartado resume decisiones. Para detalles, ejemplos y diagramas de backend ver CONVENTIONS_FOLDER_API.MD; de frontend ver CONVENTIONS_FOLDER-FRONT.MD.

### Principios fundamentales

1. **Namespaces derivados de ubicación física** — El namespace refleja la ruta de carpetas. No existen namespaces fijos por tipo.
2. **Módulos fijos, submódulos únicos por módulo** — catálogo cerrado (backend + frontend). Cada submódulo vive en un único módulo padre. Si otro módulo necesita un concepto similar, define su propio submódulo con nombre diferenciado.
3. **Máximo 4-5 niveles de profundidad** — Backend: `[Módulo].[Grupo].[Submódulo].[Categoría]` (4 niveles; sin prefijo de proyecto ni segmento `Modules`, ambos eliminados 2026-09-11, ver CONVENTIONS_FOLDER_API.MD §2). Frontend: `[módulo]/[grupo]/[submódulo]/[categoría]` (espejo). Excepción con subdominio funcional intermedio (5): `AdminLuxuryApp`.
4. **Límite de 300 líneas por clase/componente** — Si se excede, refactorizar en SubServices/Helpers.
5. **Aliases de import frontend (espejo del namespace backend)** — Igual que el backend acorta el namespace arrancando en el módulo (`RecruitmentLuxuryApp.CandidateCore.DTOs`), el frontend acorta el import arrancando en el alias: `@recruitment.luxuryapp/…` (módulos), `@core/…` (bootstrap técnico), `@shared/…` (piezas reutilizables) y `@ui/…` (catálogo UI, alias histórico). Nunca la ruta física `src/app/…`. Ver CONVENTIONS_FOLDER-FRONT.MD §1.7.

### Módulos oficiales (catálogo cerrado)

**Backend:** `AccountingLuxuryApp`, `AdminLuxuryApp`, `AuthLuxuryApp`, `CollectionsLuxuryApp`, `CommitteeLuxuryApp`, `HumanResourcesLuxuryApp`, `LegalLuxuryApp`, `MaintenanceLuxuryApp`, `ManagementLuxuryApp`, `OperationsLuxuryApp`, `PurchasesLuxuryApp`, `RecruitmentLuxuryApp`, `ResidentsLuxuryApp`, `SharedLuxuryApp`, `SupplierLuxuryApp`, `SystemLuxuryApp`.

**Frontend:** `accounting.luxuryapp`, `admin.luxuryapp`, `auth.luxuryapp`, `collections.luxuryapp`, `committee.luxuryapp`, `human-resources.luxuryapp`, `legal.luxuryapp`, `maintenance.luxuryapp`, `management.luxuryapp`, `operations.luxuryapp`, `public.luxuryapp`, `purchases.luxuryapp`, `recruitment.luxuryapp`, `resident.luxuryapp`, `shared.luxuryapp`, `supplier.luxuryapp`, `system.luxuryapp`, `web.luxuryapp` (sin backend).

**Mapeo Backend ↔ Frontend:** Nombres equivalentes (ej. `AdminLuxuryApp` ↔ `admin.luxuryapp`).

> **Nota sobre `SharedLuxuryApp` / `shared.luxuryapp`:** Aunque comparten nombre base, tienen semántica distinta:
> - **Backend `SharedLuxuryApp`**: Módulo de dominio con código transversal (helpers, DTOs shared, SelectItem hubs centralizados, EnumExtensions). Vive en `api/LuxuryApp.Application/Modules/SharedLuxuryApp/`.
> - **Frontend `shared.luxuryapp`**: Capa de componentes/servicios UI reutilizables (botones, tablas, modales, pipes, guards). Vive en `appsweb/angular/src/app/modules/shared.luxuryapp/`.
> No son "el mismo módulo" en ambos lados; el backend provee contratos/datos, el frontend provee UI components.

### SubServices y Helpers — Estratificación de 3 niveles

Ubicación según **alcance de consumo**:

| Nivel | Ubicación | Ejemplo | Restricción |
|-------|-----------|---------|-------------|
| **1 — Submódulo (exclusivo)** | `[Submódulo]/SubServices/` o `/Helpers/` | `Candidates/SubServices/CandidateValidationService.cs` | Solo ese submódulo |
| **2 — Módulo (compartido entre submódulos)** | `[Módulo]/SubServices/` o `/Helpers/` | `ReclutamientoLuxuryApp/SubServices/RecruitmentCommonService.cs` | Varios submódulos del mismo módulo |
| **3 — SharedLuxuryApp (multi-módulo)** | `SharedLuxuryApp/Helpers/` o `/SubServices/` | `SharedLuxuryApp/Helpers/DateHelper.cs` | Múltiples módulos distintos |

**Máximo 2 archivos por carpeta** (SubServices o Helpers).

### Naming por tipo de pieza

**Backend:** `[Nombre]DTO`, `Create[Entity]DTO`, `[Entity]ResponseDTO`, `I[Nombre]`, `[Nombre]AppService`, `[Nombre]Service`, `[Nombre]EndPoints`, Entity (sin sufijo), `[Nombre]Types` (enums), `[Nombre]Mapper`, `[Nombre]Job`, `[Nombre]Builder`.

**Backend - Métodos API (🔴 CRÍTICA):** Catálogo .NET estándar sin personalización Entity-específica. Ver `conventions/backend/api-method-naming-conventions.md` — 6 patrones genéricos, criterion explícito, Async obligatorio, DTOs integrados (naming: `conventions/backend/dto-naming-conventions.md`, organización: `conventions/backend/dto-file-organization-rule.md`), endpoints con verbo HTTP correcto.

| Patrón | Ejemplo |
|--------|---------|
| Crear | `CreateAsync(CreateBankDTO)` |
| Leer (uno) | `GetByIdAsync(Guid id)` |
| Leer (lista) | `GetListAsync()` |
| Actualizar | `UpdateAsync(Guid id, UpdateBankDTO)` |
| Eliminar (uno) | `DeleteByIdAsync(Guid id)` |
| Eliminar (lote) | `DeleteRangeAsync(IEnumerable<Guid>)` |

**Frontend:** `[entity]-list`, `[entity]-form`, `[entity]-detail`, `[entity]-[purpose]-modal`, `[entity]-list-desktop`, `[entity]-list-mobile`, `[entity].dto`, `[entity]-form.interface`, `[nombre].service`, `[nombre]-store.service`, `[nombre].pipe`, `[modulo].routing`, `[entity]-status-tag-options`, `[archivo].spec`.

**Casing:** Backend = PascalCase. Frontend = kebab-case.

### Prohibiciones

- ❌ Inventar nuevos módulos fuera del catálogo cerrado.
- ❌ Crear carpetas arbitrarias (`components/`, `utils/`, `models/`).
- ❌ Duplicar namespaces o servicios sin justificación de alcance.
- ❌ Exceder 300 líneas sin refactorizar.

### Fuente de verdad detallada

Para ejemplos aplicados, diagramas de decisión, excepciones controladas y casos de estudio:
- **Backend:** [CONVENTIONS_FOLDER_API.MD](CONVENTIONS_FOLDER_API.MD) — §2 Namespaces + ejemplos, §5 Reglas de Submódulos, §6 árbol de decisión Shared/SharedLuxuryApp, A12 Catálogo de Servicios Compartidos.
- **Frontend:** [CONVENTIONS_FOLDER-FRONT.MD](CONVENTIONS_FOLDER-FRONT.MD) — §1.1 Mapa de carpetas, §1.2 árbol de decisión, §1.2bis Referencias cruzadas y aislamiento de submódulos, §1.3-1.6 Estructura submódulos, naming, deuda detectada, §1.7 Aliases de import.

---

## 6ter. Estructura y Ubicación de Documentos y Reportes en `docs/`

> **🔴 REGLA OBLIGATORIA DE ESTRUCTURA Y UBICACIÓN DE DOCUMENTOS:**
> Todos los documentos, reportes, planes, guías, análisis y auditorías deben alojarse en `docs/` siguiendo exactamente el árbol de Módulos y Submódulos del sistema (mismo estándar que el API y Frontend).

### 1️⃣ Jerarquía Estricta de Carpetas

```
docs/
└── [ModuleLuxuryApp]/                 ← Nivel 1: Módulo oficial (ej: RecruitmentLuxuryApp, AdminLuxuryApp, SystemLuxuryApp)
    └── [Submodulo]/                   ← Nivel 2: Submódulo oficial (ej: Candidates, Banks, Jobs, Notifications)
        ├── YYYYMMDD-[tipo]-[modulo]-[submodulo].md  ← Nivel 3: Archivos PLANOS (cero subcarpetas)
        └── YYYYMMDD-[tipo]-[descripcion].md
```

### 2️⃣ Regla de Estructura Plana (Sin Anidamiento Adicional)

- 🚫 **PROHIBIDO:** Crear subcarpetas adicionales dentro de `docs/[ModuleLuxuryApp]/[Submodulo]/` (por ejemplo, NO usar `docs/.../auditorias/`, `docs/.../planes/`, `docs/.../v1/`).
- ✅ **CORRECTO:** Todos los archivos de un submódulo residen **directamente** bajo la carpeta del submódulo.

### 3️⃣ Naming Normalizado para Archivos

El tipo de documento, módulo, submódulo y fecha quedan explícitos en el nombre del archivo:

`YYYYMMDD-[tipo]-[modulo]-[submodulo].md`

**Tipos permitidos (`[tipo]`):**
- `auditoria`: Auditorías de código, arquitectura o seguridad
- `plan`: Planes de implementación o refactorización
- `remediacion`: Planes e informes de remediación
- `analisis`: Análisis técnicos, diagnósticos y FASE 0
- `especificacion`: Estándares y especificaciones técnicas
- `guia`: Guías operativas o walkthroughs
- `setup`: Guías de configuración y onboarding
- `changelog`: Registros de cambios y bitácoras
- `arquitectura`: Diseños y arquitectura de solución

**Ejemplos Reales:**
- `docs/RecruitmentLuxuryApp/Candidates/20260813-auditoria-reclutamiento-candidatos.md`
- `docs/AdminLuxuryApp/Banks/20260729-auditoria-admin-banks.md`
- `docs/SystemLuxuryApp/Notifications/20260812-especificacion-sistema-notificaciones.md`
- `docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-manejo-fechas-horas.md`

---

## 7. Gobernanza y Cambios

- Solo el Tech Lead aprueba nuevas reglas o cambios a reglas existentes.
- Toda regla aprobada obliga a actualizar:
  - `CONVENTIONS.md`
  - documento especializado correspondiente
  - índices afectados
  - `conventions-viewer`
  - capas operativas o visuales subordinadas afectadas
  - bitacora de cambios
- Toda auditoria, remediacion o migracion relevante sigue tambien el ciclo
  oficial de `core/compliance-protocol.md`.
- La fecha de ultima revision es el control oficial de vigencia.
- Existira bitacora oficial en:
  [changelog.md](./changelog.md)

---

## 8. Documentos de Apoyo Existentes que Deben Preservarse

Estos documentos contienen conocimiento valioso y se consideran apoyo oficial
mientras su contenido se consolida en la nueva estructura:

- [arquitectura-shared-ui.md](../appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md)
- [estandar-hoja-estilos.md](../appsweb/angular/src/styles/estandar-hoja-estilos.md)
- [DESIGN.md](../appsweb/angular/src/styles/DESIGN.md)

No deben duplicarse. Deben absorberse, resumirse o referenciarse desde los
documentos especializados correspondientes.

**Nota (2026-08-06):** Documentos consolidados y eliminados recientemente:
- ✅ DESIGN_CONVENTIONS.md → absorbido en ui/ui-desktop-rules.md + ui/ui-mobile-rules.md
- ✅ DEVELOPER_ONBOARDING.md → absorbido en operations/developer-onboarding.md
- ✅ AVAILABLE_FEATURES.md → absorbido en operations/available-features.md
- ✅ IMPLEMENTATION_CHECKLIST.md → absorbido en operations/implementation-checklist.md
- ✅ TECH_LEAD_TRAINING.md → absorbido en operations/tech-lead-onboarding.md + core/tech-lead-training.md
- ✅ PROTOCOLO_COMPLIANCE_CONVENCIONES.md → absorbido en core/compliance-protocol.md

## 8.1 Estado transitorio legacy

Los documentos históricos no deben borrarse de forma anticipada. Mientras se
valida que ya fueron absorbidos correctamente:

- se conservan en su ubicación actual si aún tienen referencias activas
- se registran como candidatos a legacy
- solo se mueven o retiran con validación explícita del Tech Lead
- no pueden operar como autoridad primaria si contradicen o anteceden al sistema
  rector vigente (fecha de corte 2026-09-16, ver cabecera)

Control temporal:
- [Legacy de Convenciones](../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)

---

## 9. Indices Principales

- [Guía Shared Reporte Maestro (Legacy)](../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)
- [Plan de Reestructuración](../docs/SharedLuxuryApp/Conventions/20260729-plan-shared-conventions-restructure.md) — movido fuera de `conventions/` el 2026-09-09 (es un plan fechado ya ejecutado, no una regla); ruta actual según §6ter
