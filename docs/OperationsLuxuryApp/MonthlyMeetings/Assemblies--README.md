# Asamblea (Checklist de Asamblea)

> **Modulo padre:** JuntasMensuales
> **Ultima actualizacion:** `2026-06-25`

Checklist operativo para sesiones de asamblea. Catalogo (SuperUsuario) + ejecucion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/AsambleaChecklistTemplate` | Catalogo |
| `GET` | `api/AsambleaChecklistTemplate/{id}` | Item por ID |
| `POST` | `api/AsambleaChecklistTemplate` | Crear item catalogo |
| `PUT` | `api/AsambleaChecklistTemplate/{id}` | Actualizar item |
| `DELETE` | `api/AsambleaChecklistTemplate/{id}` | Desactivar item |
| `GET` | `api/AsambleaChecklist/session/{sessionId}` | Checklist operativo de sesion |
| `PUT` | `api/AsambleaChecklist/{executionId}/status` | Actualizar estatus |
