# Banks (Bancos)

> **Area:** Sistema / Catalogos
> **Ultima actualizacion:** `2026-07-29`

Catalogo de bancos. CRUD con validacion de nombre corto unico. Solo
`SuperUsuario`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/admin/catalogs/banks/{id}` | Obtener banco por ID |
| `GET` | `api/admin/catalogs/banks` | Listado completo |
| `POST` | `api/admin/catalogs/banks/paged` | Listado paginado con filtro y orden |
| `POST` | `api/admin/catalogs/banks` | Crear |
| `PUT` | `api/admin/catalogs/banks/{id}` | Actualizar |
| `DELETE` | `api/admin/catalogs/banks/{id}` | Eliminar |

**Reglas**

- `ShortName` unico
- orden alfabetico por `ShortName`
- `409` si existe duplicado de `ShortName`
- acceso restringido a `SuperUsuario`
