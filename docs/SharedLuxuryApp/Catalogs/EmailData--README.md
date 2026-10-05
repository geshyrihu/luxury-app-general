# EmailData (Configuracion de Correo)

> **Area:** Sistema / Catalogos
> **Ultima actualizacion:** `2026-07-28`

Configuracion SMTP por cliente (datos de empresa para pie de correo). Solo `SuperUsuario`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/admin/catalogs/email-data/{id}` | Por ID |
| `GET` | `api/admin/catalogs/email-data/list` | Listar |
| `POST` | `api/admin/catalogs/email-data` | Crear |
| `PUT` | `api/admin/catalogs/email-data/{id}` | Actualizar |

**Reglas:** Tabla compartida con `CustomerDataCompany`. Ordenado por `NumeroCliente`.
