# Minuta (Reuniones / Minutas)

> **Modulo padre:** JuntasMensuales
> **Ultima actualizacion:** `2026-06-25`

Gestion completa de reuniones, minutas, seguimiento de pendientes y envio de correos.

## MeetingsController (`api/Meetings`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{id}` | Reunion por ID |
| `GET` | `MeetingReportPdf/{id}` | Datos para PDF (AllowAnonymous) |
| `GET` | `list/{customerId}/{tipoJunta}` | Listar por cliente y tipo |
| `GET` | `GetDetails/{id}` | Detalles de minuta |
| `POST` | `` | Crear |
| `POST` | `SendEmailResponsible/{id}/{customerId}/{eAreaMinutasDetalles}/{applicationUserId}` | Email a responsable |
| `POST` | `EnviarEmailPendientesResponsable/{customerId}/{eAreaMinutasDetalles}` | Email pendientes |
| `POST` | `SendEmailAllPendingMeeting` | Email todas pendientes |
| `GET` | `MinutaPendientes/{id}` | Pendientes de reunion |
| `GET` | `MinutaAllPendientes/{customerId}` | Pendientes de cliente |
| `GET` | `SeguimientoMinutas/{customerId}/{status}` | Seguimiento |
| `PUT` | `{id}` | Actualizar |
| `DELETE` | `{id}` | Eliminar |

## MeetingsDetailsController (`api/MeetingsDetails`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{id}` | Detalle por ID |
| `GET` | `DetallesFiltro/{meetingId}/{estatus}` | Minutas filtradas |
| `GET` | `GetAll/{meetingId}/{status}` | Listar detalles |
| `POST` | `` | Crear detalle |
| `PUT` | `{id}` | Actualizar |
| `DELETE` | `{id}` | Eliminar |

**Reglas:** CRUD completo con envio de correos, generacion de PDF y seguimiento de pendientes.
