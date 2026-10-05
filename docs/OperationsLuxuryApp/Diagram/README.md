# Modulo: Diagram (Diagramas Draw.io)

> **Area funcional:** Operaciones / Documentacion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona almacenamiento de diagramas Draw.io con segmentacion por rol/cliente.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/DiagramDraw?customerId={id}` | Diagramas visibles para el rol+cliente |
| `GET` | `api/DiagramDraw/{id}` | Diagrama por ID |
| `POST` | `api/DiagramDraw` | Crear con clientes/roles objetivo |
| `PUT` | `api/DiagramDraw/{id}` | Actualizar |
| `DELETE` | `api/DiagramDraw/{id}` | Eliminar |

**Reglas:** Visibilidad: cliente propio O cliente en lista objetivo O rol en roles objetivo.
