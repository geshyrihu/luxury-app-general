# 📁 CONVENTIONS_FOLDER-FRONT.MD — Reglas de Directorios, Namespaces y Ubicación de Archivos (Frontend)

> ✨ Actualizado por **Tech Lead** — **2026-09-09**  
> Fundamento: `CONVENTIONS.md` (sistema rector vigente 2026-08-12) + [`CONVENTIONS_FOLDER_API.MD`](CONVENTIONS_FOLDER_API.MD) (contraparte backend, mismo árbol de decisión).  
> Solo reglas referentes a **dónde vive el código y los documentos** del **frontend** (`appsweb/angular/src/app/`).  
> ℹ️ Este documento se separó de `CONVENTIONSFOLDER.MD` (antes §13, renombrado a `CONVENTIONS_FOLDER_API.MD`) el 2026-09-09 para independizar backend y frontend.

---

## 1️⃣ 🅰️ Frontend (Angular) — Mismos criterios que el backend, aplicados a `appsweb/angular/src/app/`

> Todo lo verificado en esta sección corresponde a `d:\repos\luxuryapp-api\appsweb\angular\src\app\` (verificado 2026-09-09). El objetivo es que backend y frontend compartan el **mismo árbol de decisión** (ver §6.1 de `CONVENTIONS_FOLDER_API.MD`) aunque las carpetas físicas se llamen distinto por idioma/framework.

### 1.0 ✅ Rutas de frontend en `CONVENTIONS.md` — corregidas (resuelto 2026-09-09)

`CONVENTIONS.md` referenciaba repetidamente `client/angular/src/app/apps/[modulo].luxuryapp/...`, una ruta que ya no existe (`client/` fue eliminado; el frontend vive en `appsweb/angular/`, con `modules/` en vez de `apps/`). Esta inconsistencia se detectó y **se corrigió el 2026-09-09**: las ~30 referencias en `CONVENTIONS.md` ahora usan `appsweb/angular/src/app/modules/[modulo].luxuryapp/...`. Ver `conventions-path-correction-20260909` en memoria del proyecto para el detalle de qué líneas se tocaron.

**Deuda relacionada, aún pendiente:** `CONVENTIONS.md` §4.6/§4.7 enlaza un "Piloto Frontend" (`.../reclutamiento.luxuryapp/candidates/docs/{README,setup,decisiones}.md`) que **no existe** en el filesystem — la ruta se corrigió, pero el archivo destino nunca se creó. Pendiente de que el Tech Lead decida si se crea el piloto o se retira la referencia.

### 1.1 🗺️ Mapa de carpetas raíz (`src/app/`)

| Carpeta | Rol | Equivalente backend |
|---------|-----|----------------------|
| `modules/` | Módulos de negocio, kebab-case + sufijo `.luxuryapp` (17 módulos, mapeo 1:1 confirmado contra `Modules/` del backend) | `Modules/[Nombre]LuxuryApp/` |
| `core/` | Bootstrap técnico de la app: auth (guards/services), interceptors HTTP, layout raíz, rutas de error (404/500/offline), constantes/enums/interfaces **genéricos** | Parcialmente `api/LuxuryApp.Application/Shared/` (la parte de servicios técnicos/DTOs base) |
| `shared/` | Piezas reutilizables **presentacionales/técnicas** sin bootstrap: `directives/`, `pipes/`, `utils/`, `ui/` (catálogo de componentes, ver CONVENTIONS.md §5.5) | Parcialmente `api/LuxuryApp.Application/Shared/` (la parte de UI/utils) |
| `shared/integration/[modulo-origen]/` | Piezas de UN módulo de negocio expuestas para que OTROS módulos las consuman (DTOs, forms, servicios) | `Modules/SharedLuxuryApp/` |
| `routing/` | Definición de rutas por dominio (`*.routing.ts`) | Sin equivalente directo — propio de SPA |

> A diferencia del backend, que concentra toda la infraestructura técnica en un único `Shared/` raíz, Angular la separa por convención de framework en `core/` (servicios singleton, interceptors, contratos base — se importan una vez) y `shared/` (declarables reutilizables — se importan en cada feature). Es una diferencia de patrón esperada, no un defecto a corregir.

### 1.2 🌳 Árbol de decisión (mismo criterio que §6.1 de `CONVENTIONS_FOLDER_API.MD`, aplicado a Angular)

1. **¿Solo lo usa un submódulo/feature?** → vive dentro de ESA feature (ej. `candidates/candidate-applications/interfaces/`, `candidates/desktop/`). No tocar ningún `-shared`.
2. **¿Lo usan 2+ submódulos del mismo grupo?** (ej. `candidate-applications/` y `candidate-interview/` dentro de `candidates/`) → `[grupo]/shared/` a nivel de grupo.
3. **¿Lo usan 2+ submódulos del mismo módulo `.luxuryapp`?** → `[modulo]-shared/` a nivel de módulo — único ejemplo real hoy: `recruitment.luxuryapp/recruitment-shared/`.
4. **¿Lo usan 2+ módulos `.luxuryapp` distintos?** → `shared/integration/[modulo-origen]/` — ejemplos reales: `shared/integration/reclutamiento/`, `shared/integration/recursos-humanos/`, `shared/integration/supplier/`.
5. **¿Es una capacidad técnica/presentacional sin significado de negocio?** → `shared/ui/`, `shared/directives/`, `shared/pipes/`, `shared/utils/`, o si es un servicio/interceptor de aplicación → `core/services/`, `core/http/`.

### 1.2bis 🔒 Referencias cruzadas — aislamiento de submódulos (espejo §5.2 de `CONVENTIONS_FOLDER_API.MD`)

> **🔴 REGLA:** **Prohibido** que un submódulo importe directamente las piezas internas de un submódulo hermano. Lo compartido sube a la carpeta `shared/` del nivel que corresponda, **solo** cuando 2+ submódulos lo consumen.

| Si la pieza la consumen… | Vive en… | Ejemplo |
|--------------------------|----------|---------|
| 1 submódulo (solo él) | dentro de ESE submódulo | `candidates/candidate-core/interfaces/candidate.dto.ts` |
| 2+ submódulos del mismo grupo | `[grupo]/shared/` | `candidates/shared/` (si `candidate-core` **y** `candidate-applications` lo necesitan) |
| 2+ grupos del mismo módulo `.luxuryapp` | `[modulo]-shared/` | `recruitment.luxuryapp/recruitment-shared/candidate-stage-badge` |
| 2+ módulos `.luxuryapp` distintos | `shared/integration/[modulo-origen]/` | `shared/integration/reclutamiento/…` |

**Reglas de aislamiento (obligatorias):**

1. **❌ Prohibido:** dependencia cruzada directa entre submódulos hermanos. Ej. `candidate-core/candidate-detail.ts` NO debe importar `candidate-applications/candidate-process-hiring-modal`. Si la necesita, la pieza compartida sube a `candidates/shared/`.
2. **❌ Prohibido:** dependencias circulares entre submódulos del mismo grupo (A importa B y B importa A). Si se detecta, es hallazgo.
3. **🔴 Regla de oro — `shared/` NO es el lugar por defecto:** una carpeta `shared/` de grupo **solo** existe para lo que consumen 2+ submódulos hermanos. Nunca se crea de forma preventiva.
4. **Dirección única de dependencia:** un submódulo puede consumir de `[grupo]/shared/`, `[modulo]-shared/`, `shared/integration/` y `core/`/`shared/` — pero **nunca** de las carpetas internas de otro submódulo hermano.
5. Cada submódulo mantiene su **propia** estructura completa (`interfaces/`, `desktop/`, `mobile/`) igual que cualquier feature (§1.3). `shared/` no la reemplaza, la complementa solo para lo verdaderamente compartido.

> ⚠️ **Estado actual (deuda, no corregida retroactivamente):** hoy el frontend **sí** tiene cruces entre submódulos hermanos (ej. `candidate-core/candidate-detail.ts` importa `candidate-applications/candidate-process-hiring-modal`; `candidate-core/interfaces/candidate.dto.ts` importa de `candidate-applications/`). La regla aplica **desde ahora** para código nuevo; los cruces existentes se reportan y entran a plan de migración (§1.5 y CONVENTIONS.md §3.8 — no reubicar por iniciativa propia).

### 1.3 ✅ Ejemplo real: `candidates/` hoy (espejo de la agrupación backend, organizado por submódulo y plataforma)

```tree
modules/recruitment.luxuryapp/candidates/
├── candidate-core/                           ← submódulo: ficha maestra (espejo CandidateCore)
│   ├── candidate-list.*                      ← listado principal
│   ├── candidate-form.*                      ← create/update
│   ├── candidate-detail.*                    ← detalle
│   ├── candidate-status-tag-options.ts       ← tags de estado
│   ├── candidate-interview-progress-tag-options.ts
│   ├── desktop/candidate-list-desktop.*      ← plataforma web del listado
│   ├── mobile/candidate-list-mobile.*        ← plataforma móvil del listado
│   └── interfaces/candidate.dto.ts, candidate-form.interface.ts
├── former-employee-talent-pool/              ← pantalla específica del grupo
├── candidate-applications/                   ← submódulo: procesos/automatización
│   ├── desktop/
│   ├── mobile/
│   └── interfaces/
├── candidate-interview/                      ← submódulo: entrevistas y feedback
│   ├── desktop/
│   ├── mobile/
│   ├── interfaces/
│   └── candidate-interview-detail-modal.*    ← modal de detalle de entrevista
├── candidate-interviewer-queue/              ← submódulo: cola del entrevistador
├── candidate-recruitment-interviews/         ← submódulo: agenda de entrevistas
└── candidate-work-position-candidates/       ← submódulo: candidatos por puesto
```

**Espejo estructural con el backend:** igual que `ReclutamientoLuxuryApp/Candidates/` agrupa sus submódulos de dominio (`CandidateCore/`, `CandidateProcesses/`, `CandidateApplications/`, `CandidatesWorkExperience/`), en frontend `candidates/` agrupa sus submódulos de pantalla (`candidate-core/`, `candidate-applications/`, `candidate-interview/`, `candidate-interviewer-queue/`, `candidate-recruitment-interviews/`, `candidate-work-position-candidates/`). Todo submódulo que pertenezca al grupo `candidates/` vive DENTRO de `candidates/`, nunca como hermano suelto a nivel de `recruitment.luxuryapp/`.

**🔴 REGLA — la raíz de un grupo no es cajón de sastre:** el backend no tiene archivos `.cs` sueltos en `Candidates/` (todo vive en un submódulo). Igual en frontend: los archivos sueltos de un grupo (`candidate-list.ts`, `candidate-form.ts`, `candidate-detail.ts`, `*-tag-options.ts`) pertenecen a un submódulo (`candidate-core/`) y NO se dejan en la raíz de `candidates/`. Las carpetas `desktop/`, `mobile/` e `interfaces/` que sirven a una única pieza se anidan dentro del submódulo de esa pieza, no en el grupo.

**Regla de profundidad (espejo §6.4/§6.5 del backend):**

| Nivel | Backend (`api/LuxuryApp.Application/`) | Frontend (`appsweb/angular/src/app/`) |
|-------|----------------------------------------|---------------------------------------|
| 1 | `Modules/` (contenedor, sin namespace) | `modules/` (contenedor) |
| 2 | `[Modulo]LuxuryApp/` (módulo) | `[modulo].luxuryapp/` (módulo) |
| 3 | `[Grupo]/` (ej. `Candidates/`) | `[grupo]/` (ej. `candidates/`) |
| 4 | `[Submódulo]/` (ej. `CandidateCore/`) | `[submódulo]/` (ej. `candidate-applications/`) |
| 5 (opcional) | `[Categoría]/` (`DTOs/`, `Services/`, `Entities/`) | `desktop/`, `mobile/`, `interfaces/` |

El caso estándar es **4 niveles** (`[módulo]/[grupo]/[submódulo]/[categoría]`). Un 5º nivel (o más) solo aparece con subdominio funcional intermedio y, al igual que en backend (§10 de `CONVENTIONS_FOLDER_API.MD`), requiere aprobación del Tech Lead.

Al aplicar el árbol de decisión §1.2 no compares 1:1 el nombre de carpeta backend↔frontend — compara **quién consume qué** y respeta la agrupación por submódulo.

### 1.4 ⚠️ Ejemplo real de `-shared` a nivel de módulo: `recruitment-shared/` (único hoy, y sin categorizar)

```tree
modules/recruitment.luxuryapp/recruitment-shared/
├── agenda-status-tag-options.ts
├── candidate-cv-upload.ts / .html
├── candidate-decision-labels.ts
├── candidate-photo-upload.ts / .html
├── candidate-stage-badge.ts
├── candidate-stage-labels.ts
├── candidate-stage-timeline.ts
├── mapped-p-tag.ts
└── request-status-style.ts
```

Es el único módulo con un `-shared` propio en todo `modules/` (ninguno de los otros 16 módulos tiene su equivalente, aunque varios tienen 2+ submódulos que probablemente duplican lógica similar — no auditado en esta pasada). Además, a diferencia del backend (`Shared/Policies/Interfaces` + `/Services`), sus 9 archivos están sueltos sin subcarpetas por tipo.

> **Regla forward-looking (aplica desde hoy, no retroactiva):** un nuevo `[modulo]-shared/` que se cree de aquí en adelante debe categorizar por tipo igual que cualquier submódulo (`components/` o el nombre del componente suelto si es standalone, `interfaces/`, `pipes/`), replicando lo que ya hace `candidates/interfaces/`. No mover `recruitment-shared/` retroactivamente sin plan — reorganizarlo rompe imports en producción.

### 1.5 ⚠️ Deuda detectada: `core/enums/` y `core/interfaces/` mezclan lo genérico con lo específico de un módulo

Verificado: `core/enums/` contiene tanto enums técnicos genuinamente globales (`dialog-size.enum.ts`, `button-type.enum.ts`, `sweetalert-icon.enum.ts`) como enums de negocio exclusivos de Reclutamiento (`candidate-decision.ts`, `candidate-interview-progress-status.ts`, `candidate-process-stage.ts`, `candidate-rejection-reason.ts`, `candidate-status.ts`, `fuente-reclutamiento.ts`). Lo mismo ocurre en `core/interfaces/` (mezcla `api-response.dto.ts` genérico con `comite-vigilancia.interface.ts`, `busqueda-proveedor.interface.ts` específicos de otros módulos).

Esto contradice el mismo criterio de "2+ consumidores" que rige `Shared/` en el backend (§5.2/§6.1 de `CONVENTIONS_FOLDER_API.MD`): un enum usado solo por Reclutamiento no debería vivir en la capa técnica global que todos los módulos importan.

- **No se corrige en esta sesión** — mover archivos reales de `core/` rompe imports en producción sin un plan de migración (buscar-y-reemplazar de imports, verificación de build, etc.).
- **Sí se prohíbe desde hoy:** ningún enum/interfaz/DTO de negocio específico de un módulo se agrega a `core/enums/` o `core/interfaces/`. Un enum nuevo de negocio va dentro de su módulo/feature, o si es cross-módulo, a `shared/integration/[modulo-origen]/` (§1.2 punto 3).

### 1.6 🏷️ Naming y casing (ya documentado en CONVENTIONS.md §6bis, confirmado contra código real)

Confirmado: los módulos reales coinciden exactamente con el catálogo cerrado de CONVENTIONS.md §6bis — esa parte del documento rector SÍ está vigente; solo la ruta física (ver §1.0, ya corregida) estaba desactualizada.

### 1.7 🧭 Aliases de import (espejo del acortamiento de namespace del backend)

> **🔴 REGLA:** los imports de Angular se acortan igual que los namespaces del backend (§2 de `CONVENTIONS_FOLDER_API.MD`). Así como un namespace C# ya no lleva el prefijo `LuxuryApp.Application.Modules.` y arranca directamente en `RecruitmentLuxuryApp.CandidateCore.DTOs`, un import TypeScript no lleva el prefijo `src/app/modules/` y arranca directamente en el alias del módulo.

| Backend (`api/LuxuryApp.Application/`) | Frontend (`appsweb/angular/src/app/`) |
|----------------------------------------|---------------------------------------|
| `namespace RecruitmentLuxuryApp.CandidateCore.DTOs;` | `import { X } from "@recruitment.luxuryapp/candidates/interfaces/candidate.dto";` |

**Mapeo (declarado en `tsconfig.json` → `compilerOptions.paths`):**

```
"@<modulo>.luxuryapp/*"  →  "./src/app/modules/<modulo>.luxuryapp/*"   (módulos de negocio)
"@core/*"                →  "./src/app/core/*"                         (bootstrap técnico)
"@shared/*"              →  "./src/app/shared/*"                       (piezas reutilizables)
"@ui/*"                  →  "./src/app/shared/ui/*"                   (catálogo UI; alias histórico conservado)
```

- ✅ **Correcto:** `import { CandidateStageBadge } from "@recruitment.luxuryapp/recruitment-shared/candidate-stage-badge";`
- ✅ **Correcto:** `import { BankForm } from "@admin.luxuryapp/catalogos-generales/banks/bank-form";`
- ✅ **Correcto:** `import { DynamicDialogConfig } from "@core/services/dialog-handler.service";`
- ✅ **Correcto:** `import { ApiDatePipe } from "@shared/pipes/api-date.pipe";`
- ❌ **Prohibido:** `import { X } from "src/app/modules/recruitment.luxuryapp/recruitment-shared/candidate-stage-badge";`
- ❌ **Prohibido:** `import { X } from "src/app/core/services/dialog-handler.service";`

**Reglas obligatorias:**

1. Todo import de un módulo `.luxuryapp` usa el alias `@<modulo>.luxuryapp/…`, nunca la ruta física `src/app/modules/…`.
2. Todo import de `core/` usa `@core/…`; todo import de `shared/` usa `@shared/…` (salvo `shared/ui/`, que usa `@ui/…`). Nunca `src/app/core/…` ni `src/app/shared/…`.
3. El alias de cada módulo debe estar declarado en `tsconfig.json` (`compilerOptions.paths`). Un módulo nuevo sin su alias es un hallazgo.
4. Los imports dinámicos (`loadComponent` / `loadChildren` en `.routing.ts`) usan el mismo alias: `import("@recruitment.luxuryapp/candidates/candidate-core/candidate-list")`.
5. `@ui/*` se conserva como alias de `shared/ui/*` por compatibilidad histórica (ver CONVENTIONS.md §5.5); los imports de `shared/ui/` siguen usando `@ui/…`, no `@shared/ui/…`.
6. Un import dentro del mismo módulo puede usar ruta relativa (`../`, `./`) o el alias; el alias es obligatorio para referencias **entre** módulos `.luxuryapp` distintos y para `core`/`shared`.

---

## 📚 Documentación asociada

| Documento | Propósito |
|-----------|-----------|
| [`CONVENTIONS.MD`](CONVENTIONS.MD) | Sistema rector completo (reglas generales) |
| [`CONVENTIONS_FOLDER_API.MD`](CONVENTIONS_FOLDER_API.MD) | Contraparte backend — mismo árbol de decisión aplicado a `api/LuxuryApp.Application/` |
| [`AGENTS.md`](../AGENTS.md) | Instrucciones para agentes (jerarquía de convenciones) |

---

**Fin del documento.**
