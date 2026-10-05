# Backfill (Conciliacion Historica de Juntas)

> **Modulo padre:** JuntasMensuales
> **Ultima actualizacion:** `2026-06-25`

Conciliacion manual de sesiones mensuales historicas contra Google Calendar.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/JuntaMensualSessionBackfill/preview` | Vista previa (query: customerId, windowDays) |
| `POST` | `api/JuntaMensualSessionBackfill/apply` | Aplicar conciliacion |
