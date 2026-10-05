# LegalDirectories (Directorios Legales)

> **Area:** Legal / Directorios
> **Ultima actualizacion:** `2026-06-25`

Directorio de comites de vigilancia. Controller delgado que delega a `IComiteVigilanciaAppService.GetAllCommitteesAsync`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/LegalDirectories/Committees` | Todos los comites globales |

**Reglas:** Filtra `Customer.Active == true`. Agrupa por `NombreCorto`/`NumeroCliente`. Miembros ordenados por `EPosicionComite`.
