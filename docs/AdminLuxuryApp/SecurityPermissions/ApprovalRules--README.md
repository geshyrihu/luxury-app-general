# ApprovalRules (Reglas de Aprobacion)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Matriz de aprobacion: que roles pueden aprobar solicitudes de que otros roles.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/approval-rules/matrix` | Obtener matriz |
| `PUT` | `api/approval-rules/matrix` | Actualizar matriz |

**Reglas:** Solo `SuperUsuario, Administrador`. Aprobadores: 7 roles fijos. Targets: roles Corporate + Staff. Reemplazo completo en transaccion. Reglas invalidas se omiten con warning.
