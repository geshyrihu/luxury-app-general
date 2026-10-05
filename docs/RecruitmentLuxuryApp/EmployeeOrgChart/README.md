# EmployeeOrganigrama (Organigrama)

> **Area:** RH / Puestos
> **Ultima actualizacion:** `2026-06-25`

Organigrama jerarquico multi-cliente con arbol de puestos y reasignacion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/WorkPositionOrgChart/tree/{customerId}` | Arbol completo |
| `PATCH` | `api/WorkPositionOrgChart/reassign` | Reasignar en jerarquia |

**Reglas:** Solo puestos activos. Soporta jerarquia multi-cliente via `OrgHierarchy`. Prevencion de ciclos (BFS). Reordenamiento de hermanos. Niveles recalculados en cascada. Transaccional.
