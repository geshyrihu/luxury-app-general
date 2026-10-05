# ComiteVigilancia (Comite de Vigilancia)

> **Area:** Operaciones / Comite
> **Ultima actualizacion:** `2026-07-30`

Gestion de miembros del Comite de Vigilancia con envio de credenciales de acceso.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/comites-vigilancia/{id}` | Miembro por ID |
| `GET` | `api/comites-vigilancia/list/{customerId}` | Listar por cliente |
| `POST` | `api/comites-vigilancia` | Registrar miembro |
| `PUT` | `api/comites-vigilancia/{id}` | Actualizar |
| `DELETE` | `api/comites-vigilancia/{id}` | Eliminar |
| `POST` | `api/comites-vigilancia/{id}/send-credentials` | Enviar credenciales por email |

**Reglas:** Ordenado por `PosicionComite` (Presidente, Tesorero, Secretario...). `SendCredentials` genera password aleatorio, crea username si hace falta, reasigna password del usuario y envia email con la lista de modulos disponibles.
