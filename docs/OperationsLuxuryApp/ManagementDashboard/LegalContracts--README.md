# ContratosLegal (Contratos por Vencer - Dashboard)

> **Modulo padre:** DireccionDashboard
> **Ultima actualizacion:** `2026-06-25`

Resumen de contratos y polizas para la direccion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/direccion-dashboard/contratos-por-vencer` | Contratos que vencen en 2 meses |
| `GET` | `api/direccion-dashboard/contratos-vigentes` | Todos los contratos vigentes |

**Reglas:** Solo `Direccion, SuperUsuario`. Consulta `ContratoPoliza` con `IsCurrent = true`. Dias restantes calculados.
