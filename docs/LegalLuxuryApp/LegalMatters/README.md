# LegalMatter (Asuntos Legales / Materias)

> **Area:** Legal / Materias
> **Ultima actualizacion:** `2026-06-25`

Catalogo de asuntos legales organizados por categoria. Usado en tickets legales.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/LegalMatter` | Listar agrupado por categoria |
| `GET` | `api/LegalMatter/{id}` | Por ID |
| `POST` | `api/LegalMatter` | Crear |
| `PUT` | `api/LegalMatter/{id}` | Actualizar |
| `DELETE` | `api/LegalMatter/{id}` | Eliminar |
| `GET` | `api/LegalMatter/Category/{id}` | Categoria por ID |
| `POST` | `api/LegalMatter/Category` | Crear categoria |
| `PUT` | `api/LegalMatter/Category/{id}` | Actualizar categoria |
| `DELETE` | `api/LegalMatter/Category/{id}` | Eliminar categoria |

**Reglas:** `IsInternal` distingue asuntos internos vs externos. Categoria auto-creada si no existe. Materias usadas en tickets legales (`TaskLegal`).
