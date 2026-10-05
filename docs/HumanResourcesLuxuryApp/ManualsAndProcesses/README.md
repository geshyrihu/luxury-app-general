# ManualsAndProcesses (Manuales y Procesos)

> **Area:** RH / Recursos Humanos
> **Ultima actualizacion:** `2026-06-25`

Gestion de manuales/procesos con pasos, imagenes, diagramas (XML), enlaces, versiones y adjuntos. Soporta acceso global o por cliente/rol.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/manuals` | Listar accesibles |
| `GET` | `{id}` | Detalle |
| `POST` | `` | Crear template |
| `PUT` | `{id}` | Actualizar |
| `DELETE` | `{id}` | Eliminar (cascada) |
| `POST` | `{manualId}/pasos` | Agregar paso |
| `PUT` | `{manualId}/pasos/{pasoId}` | Actualizar paso |
| `DELETE` | `{manualId}/pasos/{pasoId}` | Eliminar paso |
| `PATCH` | `{manualId}/pasos/reordenar` | Reordenar pasos |
| `POST` | `{manualId}/pasos/{pasoId}/imagenes` | Subir imagen (1600x1600) |
| `DELETE` | `{manualId}/pasos/{pasoId}/imagenes/{imagenId}` | Eliminar imagen |
| `POST` | `{manualId}/pasos/{pasoId}/enlaces` | Agregar enlace |
| `DELETE` | `{manualId}/pasos/{pasoId}/enlaces/{enlaceId}` | Eliminar enlace |
| `POST` | `{manualId}/versiones` | Agregar version |
| `DELETE` | `{manualId}/versiones/{versionId}` | Eliminar version |
| `POST` | `{manualId}/adjuntos` | Subir adjunto |
| `DELETE` | `{manualId}/adjuntos/{adjuntoId}` | Eliminar adjunto |
| `POST` | `{manualId}/pasos/{pasoId}/diagrama` | Crear diagrama XML |
| `GET` | `diagrama/{diagramaId}` | Obtener diagrama |
| `PUT` | `diagrama/{diagramaId}` | Actualizar diagrama |
| `DELETE` | `{manualId}/pasos/{pasoId}/diagrama` | Eliminar diagrama |

**Reglas:** Acceso controlado por `TemplateRoles`/`TemplateCustomers`. Un diagrama por paso. `SuperUsuario` ve todo. Limpieza de archivos fisicos post-transaccion.
