# BoardDirectors (Consejo de Administracion / Portal)

> **Area:** Legal / Consejo
> **Ultima actualizacion:** `2026-06-25`

Portal de consulta para miembros del Consejo de Administracion: documentos, estados financieros, minutas y presentaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BoardDirectors/documents/{customerId}/{documentType}` | Documentos por tipo |
| `GET` | `api/BoardDirectors/financial-reports/{customerId}` | Estados financieros (ano actual+) |
| `GET` | `api/BoardDirectors/monthly-meetings/{customerId}` | Juntas mensuales (ano actual+) |
| `GET` | `api/BoardDirectors/meeting-minutes/{customerId}` | Minutas (navegacion) |
| `GET` | `api/BoardDirectors/meeting-minutes-detail/{meetingId}` | Detalle de reunion con asistentes, areas, acuerdos |
| `GET` | `api/BoardDirectors/document-by-type/{customerId}/{documentType}` | Documentos por tipo (duplicado) |

**Reglas:** Solo lectura. Filtra por ano actual+. Agrupa detalles de minuta por area. Solo ultimo seguimiento por detalle.
