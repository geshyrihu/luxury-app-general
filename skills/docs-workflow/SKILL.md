---
name: docs-workflow
description: Workflow de documentación técnica LuxuryApp. Genera documentación de módulos, auditorías de código y planes de implementación a partir de análisis del repositorio.
---

# 📚 Docs Workflow — LuxuryApp

Esta skill coordina la generación de documentación técnica post-análisis. No contiene reglas de formato (ver CONVENTIONS.md §11). Contiene solo procesos y referencias.

## 📂 Contenido

### Prompts (proceso puro, en `prompts/`)

| Prompt | Cuándo usarlo | Output que genera |
|--------|---------------|-------------------|
| `prompt-analisis-modulo.md` | Necesitas documentar un módulo nuevo (backend + frontend + diagramas) | `docs/<modulo>/tipo-modulo-nombre.md` |
| `prompt-generar-audit.md` | Terminaste un análisis y necesitas el documento de hallazgos | `docs/audit/YYYYMMDD-descripcion-audit.md` |
| `prompt-generar-plan.md` | Necesitas un plan de implementación detallado con fases | `docs/plans/YYYYMMDD-descripcion-plan.md` |

### Templates (esqueletos de output, en `templates/`)

| Template | Descripción |
|----------|-------------|
| `template-doc-modulo.md` | Estructura de documentación técnica de módulo |
| `template-audit.md` | Estructura de auditoría técnica con hallazgos |
| `template-plan-modulo.md` | Estructura de plan de implementación con fases |

## ⚙️ Reglas de formato

TODAS las reglas de formato viven en **`CONVENTIONS.md §11`**:
- Fechas `dd-MMM-yy`
- Emojis en títulos y bloques
- Diagramas Mermaid obligatorios (flowchart swimlanes + sequence)
- Bloques `> [!NOTE/TIP/WARNING/IMPORTANT]`
- Breadcrumbs con emojis
- Checklist de validación final

No duplicar estas reglas en los prompts. Cada prompt referencia §11.

## 🔗 Referencias externas

| Recurso | Ubicación |
|---------|-----------|
| Roles del sistema | `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs` |
| RoleType | `api/LuxuryApp.Shared/Enums/RoleType.cs` |
| Departamentos | `api/LuxuryApp.Shared/Enums/Departament.cs` |
| Catálogo de apps | `CONVENTIONS.md §14` |
| Estándares de encoding | `skills/core/documentation-encoding.md` |
