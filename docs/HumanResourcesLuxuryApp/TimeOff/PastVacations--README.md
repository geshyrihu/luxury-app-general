# PastVacations (Vacaciones Pasadas - Registro Admin)

> **Area:** RH / Recursos Humanos
> **Ultima actualizacion:** `2026-06-25`

Registro administrativo de vacaciones pasadas (solo roles autorizados).

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/past-vacations` | Registrar vacacion pasada |

**Reglas:** Solo `SuperUsuario, RecursosHumanos, Administrador, Asistente, GerenteOperaciones, GerenteAtencion`. Delega a `VacationHelperService.RegisterPastVacationAsync`.
