# LogApp (Logs del Sistema y Brevo)

> **Area:** Sistema / Auditoria
> **Ultima actualizacion:** `2026-06-25`

Consulta de logs de Serilog y log de envios de Brevo (transaccional).

## LogsController (`api/Logs`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Logs` | Logs con filtros (level, message, fechas) y paginacion |
| `DELETE` | `api/Logs/all` | Limpiar todos (TRUNCATE) |

## BrevoEmailLogController (`api/brevo-email-log`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/brevo-email-log` | Logs de Brevo (proxy seguro a API v3) |

**Reglas:** `BrevoEmailLog` es proxy a Brevo API con API key desde `ISecretProvider`. Limite maximo 200 registros.
