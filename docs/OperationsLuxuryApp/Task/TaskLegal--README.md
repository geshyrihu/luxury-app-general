# TaskLegal (Tickets Legales)

> **Modulo padre:** Tasks
> **Ultima actualizacion:** `2026-06-25`

Gestion de tickets legales con notificacion WhatsApp, PDF y metricas.

## Via TaskController (`api/tasks`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `legal/all` | Todas las legales (roles Legal, CoordinacionLegal, Admin, SuperUsuario) |
| `GET` | `legal/pending` | Pendientes (filtro isInternal, unassigned) |
| `GET` | `legal/customer` | Por cliente del usuario |

## Servicios (TaskLegalAppService)

- `CreateLegalTaskAsync`: Crea ticket con folio, notifica WhatsApp, notificacion app + SignalR
- `CreatePdf`: Genera PDF de reporte legal interno
- `ObtenerResumenTickets`: Metricas de tickets en rango de fechas
- CRUD de `LegalMatter` / `LegalMatterCategory`

**Reglas:** WorkGroupId fijo para legal. Notificacion WhatsApp al area legal. Folio con `IGenerateFolioService`. Asignacion automatica.
