# JobDescription (Descripcion de Puestos)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Descripciones detalladas de puestos con generacion y analisis via IA.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/job-descriptions/{id}` | Por ID |
| `GET` | `api/job-descriptions/by-workposition/{workPositionId}` | Por puesto |
| `GET` | `api/job-descriptions` | Listar |
| `POST` | `api/job-descriptions` | Crear |
| `PUT` | `api/job-descriptions/{id}` | Actualizar |
| `DELETE` | `api/job-descriptions/{id}` | Eliminar |
| `POST` | `api/job-descriptions/GenerateProposal` | Propuesta IA |
| `POST` | `api/job-descriptions/Analyze` | Analisis critico IA |

**Reglas:** IA via `IAiAssistantService`. `GenerateProposal` genera propuesta con titulo, tono e instrucciones. `Analyze` evalua descripcion existente.
