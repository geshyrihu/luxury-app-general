# 🌐 Git Workflow Standard

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §17. Este archivo contiene ejemplos detallados.

## 5.1. Nomenclatura de Branches
Formato: `<prefijo>/<COD-ticket>-descripcion-en-kebab-case`

| Prefijo    | Cuándo usarlo                                |
| ---------- | -------------------------------------------- |
| `feature/` | Nueva funcionalidad                          |
| `fix/`     | Corrección de bug en desarrollo              |
| `hotfix/`  | Corrección urgente en producción             |
| `release/` | Preparación de versión para despliegue       |
| `chore/`   | Tareas de mantenimiento (deps, config, docs) |

## 5.2. Commits Standard
- Mensaje en **español**, imperativo, máximo 72 caracteres en la primera línea.
- Formato: `<tipo>: <descripción breve>`

| Tipo       | Cuándo                               |
| ---------- | ------------------------------------ |
| `feat`     | Nueva funcionalidad                  |
| `fix`      | Corrección de bug                    |
| `refactor` | Refactorización sin cambio funcional |
| `docs`     | Solo documentación                   |
| `chore`    | Tareas de mantenimiento              |

**Ejemplo**: `feat: agregar endpoint de aprobación de gastos`
