# PersonalAusente (Personal Ausente - Dashboard)

> **Modulo padre:** DireccionDashboard
> **Ultima actualizacion:** `2026-06-25`

Resumen de personal ausente (permisos + vacaciones) para la direccion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/direccion-dashboard/personal-ausente` | Personal ausente |

**Reglas:** Solo `Direccion, SuperUsuario`. Cruza LeaveRequest + VacationRequest aprobadas. Solo roles Corporativos + Staff directivo. Ventana 10 dias.
