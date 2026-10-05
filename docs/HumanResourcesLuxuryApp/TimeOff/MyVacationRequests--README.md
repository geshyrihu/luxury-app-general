# MyVacationRequests (Mis Solicitudes de Vacaciones)

> **Area:** RH / Recursos Humanos
> **Ultima actualizacion:** `2026-06-25`

Autoservicio de vacaciones para empleados: saldo, solicitud, historial.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/my-vacation-requests/my-balance` | Saldo actual |
| `GET` | `api/my-vacation-requests/available-years` | Anos disponibles |
| `POST` | `api/my-vacation-requests` | Crear solicitud |
| `GET` | `api/my-vacation-requests` | Mis solicitudes |
| `GET` | `{id}/detail` | Detalle completo |
| `GET` | `{id}` | Resumen |
| `PUT` | `{id}` | Actualizar (solo Pendiente) |
| `DELETE` | `{id}` | Eliminar (solo Pendiente) |

**Reglas:** Balance por ano aniversario (no calendario). Dias solicitados = habiles (excluye domingos + feriados MX). < 6 meses = no puede solicitar. 6-12 meses = solo adelanto. 12+ = saldo completo. Sin acumulacion de periodos vencidos. Sin traslape de solicitudes.
