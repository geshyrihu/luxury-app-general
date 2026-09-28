# 📋 Estándar de Nomenclatura: Archivos de Convenciones

**Vigencia:** 2026-09-10  
**Aplicable a:** `d:/repos/luxuryapp-api/conventions/`

---

## Regla Madre

**TODO archivo en `conventions/` DEBE definir UNA regla vigente de arquitectura, desarrollo o convención.**

Si el archivo es histórico, operacional, de auditoría, onboarding o instrucciones → **NO pertenece aquí** → `review_files/`.

---

## Patrones Válidos de Nomenclatura

### 1. Documentos Rectores (CONVENTIONS_*.MD)

**Propósito:** Especificaciones completas de un dominio.  
**Patrón:** `CONVENTIONS_[DOMINIO].MD` (MAYÚSCULAS, guión bajo)

| Archivo | Scope | Vigencia |
|---------|-------|----------|
| `CONVENTIONS.md` | Sistema rector global | ✅ Vigente |
| `CONVENTIONS_FOLDER_API.MD` | Directorios + namespaces backend | ✅ Vigente |
| `CONVENTIONS_FOLDER-FRONT.MD` | Directorios + estructura frontend | ✅ Vigente |
| `CONVENTIONS_ENTITIES.md` | Entity naming en ApplicationDbContext | ✅ Vigente |

**Regla:** Máximo 1 archivo `CONVENTIONS_*` por dominio. Si existe, es la fuente de verdad.

---

### 2. Reglas Especializadas (kebab-case.md)

**Propósito:** Una regla, una decisión, una guideline específica.  
**Patrón:** `[regla]-[aspecto].md` (minúsculas, guión)

| Archivo | Contenido | Vigencia |
|---------|-----------|----------|
| `encoding-stricto.md` | UTF-8 obligatorio, no mojibake | ✅ Vigente |
| `decision-tree-components.md` | Cuándo usar qué componente (flujo de decisión) | ✅ Vigente |

**Regla:** Máximo 3-5 archivos especializados. Si creces más, crea un `CONVENTIONS_[DOMINIO].MD`.

---

### 3. Histórico (changelog.md)

**Propósito:** Registro de cambios aprobados en convenciones.  
**Patrón:** `changelog.md` (singular, minúscula)

| Archivo | Contenido |
|---------|-----------|
| `changelog.md` | Historial de decisiones, cambios de versión, aprobaciones |

**Regla:** 1 único archivo histórico. Agregar entradas nuevas al inicio (reverse cronológico).

---

### 4. Índices (../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)

**Propósito:** Navegación y mapeo de contenido.  
**Patrón:** `../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md` (singular)

| Archivo | Contenido |
|---------|-----------|
| `../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md` | Índice, descripción breve de cada archivo, lectura recomendada |

**Regla:** 1 único README. Actualizar cuando agregues/elimines archivos.

---

## Excepciones controladas

### Legacy (convenciones/legacy/)

Los archivos en `legacy/` son **histórico controlado de transición de documentos**. Pueden tener fechas en FRONTMATTER pero NO en nombre de archivo:

```markdown
❌ PROHIBIDO: legacy-transition-matrix.md
✅ CORRECTO:  legacy-transition-matrix.md

# legacy-transition-matrix.md
---
name: legacy-transition-matrix
date: 2026-07-29
---
```

**Razón:** Facilita búsqueda y navegación. La fecha va en metadatos, no en nombre.

### Números y "fase-0"

Estandarizar números en inglés y al final del nombre (si es descriptor):

```markdown
❌ PROHIBIDO:  fase-0-business-rules-discovery.md
✅ CORRECTO:   business-rules-discovery-phase-0.md

❌ PROHIBIDO:  conventions-viewer-fase-0-update.md
✅ CORRECTO:   conventions-viewer-update.md
```

### Acronyms (a11y, i18n)

Los acronyms técnicos son válidos, pero colocar al inicio o de forma clara:

```markdown
✅ CORRECTO:   a11y-accessibility-rules.md
❌ PROHIBIDO:  accessibility-a11y-rules.md
```

---

## Prohibiciones (NO deben estar en conventions/)

❌ **Auditoría:** `audit-*.md`, `auditoria-*.md` → `review_files/audit/`

❌ **Onboarding:** `onboarding-*.md`, `*-setup.md` → `review_files/onboarding/`

❌ **Instrucciones para agentes:** `agent-*.md`, `*-instructions.md` → `review_files/agent-instructions/`

❌ **Gobernanza operacional:** `gobernanza-*.md`, `roles-*.md`, `responsabilidades-*.md` → `review_files/governance/`

❌ **Soporte/Guides:** `*-guide.md`, `*-viewer*.md` → `review_files/support/`

❌ **Histórico específico de features:** `changelog-[feature].md` → `review_files/changelog/`

❌ **Reportes técnicos:** `alias.md`, `reporte-*.md` → `review_files/support/`

---

## Flujo de Decisión: ¿Dónde va un archivo nuevo?

```
¿Es una REGLA DE ARQUITECTURA o CONVENCIÓN VIGENTE?
        │
        ├─ SÍ → ¿Es un dominio completo (backend, frontend, entities)?
        │        │
        │        ├─ SÍ → CONVENTIONS_[DOMINIO].MD (en conventions/)
        │        │
        │        └─ NO → [regla]-[aspecto].md (en conventions/)
        │
        └─ NO → ¿Qué categoría?
                 │
                 ├─ Auditoría → review_files/audit/
                 ├─ Onboarding → review_files/onboarding/
                 ├─ Instrucciones para agentes → review_files/agent-instructions/
                 ├─ Gobernanza → review_files/governance/
                 ├─ Soporte/Guides → review_files/support/
                 ├─ Histórico → review_files/changelog/
                 └─ Otro → ¿REALMENTE necesario? (proponer antes de crear)
```

---

## Validación: Auditoría de Nomenclatura

**Comandos para verificar:**

```bash
# ✅ Listar SOLO archivos válidos (en conventions/)
ls -la conventions/*.md

# ❌ Verificar que NO hay archivos prohibidos
ls -la conventions/ | grep -E "(audit|onboarding|agent-|governance|guide|viewer|changelog-|roles|responsabilidades)"

# ✅ Verificar que review_files/ tiene estructura correcta
tree review_files/ -L 2
```

---

## Referencias

| Documento | Ubicación |
|-----------|-----------|
| **CONVENTIONS.md** | `conventions/CONVENTIONS.md` (rector global) |
| **CONVENTIONS_FOLDER_API.MD** | `conventions/CONVENTIONS_FOLDER_API.MD` (backend directorios) |
| **CONVENTIONS_FOLDER-FRONT.MD** | `conventions/CONVENTIONS_FOLDER-FRONT.MD` (frontend directorios) |
| **Convenciones especializadas** | `conventions/encoding-stricto.md`, `decision-tree-components.md` |
| **Histórico** | `conventions/changelog.md` |
| **Índice** | `conventions/../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md` |

---

## Cambio de Nomenclatura Histórica

| Antes (❌ NO usar) | Ahora (✅ Usar) | Motivo |
|---------|--------|--------|
| `docs-conventions/` | `conventions/` | Raíz única, no anidada |
| `CONVENTIONSFOLDER.MD` | `CONVENTIONS_FOLDER_API.MD` + `CONVENTIONS_FOLDER-FRONT.MD` | Separación clara back/front |
| Nombres largos con fechas | Nombres semánticos | Facilita búsqueda y mantenimiento |

---

**Última actualización:** 2026-09-10  
**Aprobado por:** Tech Lead (pendiente confirmación)

