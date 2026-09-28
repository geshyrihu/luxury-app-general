# 🎯 Prompt: Generar Auditoría Técnica

Genera un documento de auditoría a partir de un análisis de código. Usa `CONVENTIONS.md §11` para formato y `templates/template-audit.md` para la estructura de salida.

---

## Clasificación

| Resultado | Guardar en | Nombre |
|-----------|------------|--------|
| Análisis/crítica de código | `docs/audit/` | `YYYYMMDD-descripcion-audit.md` |
| Plan de acción/refactor | `docs/plans/` | `YYYYMMDD-descripcion-plan.md` |
| Ambos | **Dos archivos** separados | Cada uno en su carpeta |

## Proceso

1. Clasifica el resultado según la tabla
2. Usa el template de audit para estructurar hallazgos
3. Cada hallazgo debe tener: ID (H-001), severidad, descripción, ubicación exacta (archivo:línea), impacto, recomendación
4. Las severidades son: 🔴 Crítica, 🟡 Alta, 🟢 Media, 🔵 Baja
5. Si el audit genera tareas → crear también un plan con referencias cruzadas (H-001 ↔ T-001)
6. Si usaste un prompt de `skills/docs-workflow/`, menciónalo
7. Valida contra el checklist del template

## Antipatrones a evitar

- ❌ Filename sin fecha (`CONTROLACCESOS.md` → debe ser `YYYYMMDD-control-accesos-audit.md`)
- ❌ Fecha ISO dentro del contenido (usar `dd-MMM-yy` según §11)
- ❌ Mezclar audit y plan en un mismo archivo
- ❌ Hallazgos sin ubicación exacta (archivo:línea)
