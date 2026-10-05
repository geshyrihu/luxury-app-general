# ContractPolicy (Contratos y Polizas)

> **Area:** Legal / Contratos
> **Ultima actualizacion:** `2026-06-25`

Gestion de contratos y polizas de seguros con archivos adjuntos.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/PolicyContract/{id}` | Por ID |
| `GET` | `api/PolicyContract/List/{customerId}/{isCurrent}` | Listar por cliente y vigencia |
| `POST` | `api/PolicyContract` | Crear (form con archivo) |
| `PUT` | `api/PolicyContract/{id}` | Actualizar (form) |
| `DELETE` | `api/PolicyContract/{id}` | Eliminar + archivo fisico |
| `GET` | `api/PolicyContract/GetDocument/{id}` | Metadata del documento |
| `DELETE` | `api/PolicyContract/DeleteDocument/{id}` | Eliminar solo archivo |
| `GET` | `api/PolicyContract/building-insurance/{customerId}` | Poliza de seguro de edificio |

**Reglas:** Etiquetas de vigencia: `Vigente`, `Vencido`, `Proximo a vencer` (45 dias). Duracion en "X anos Y meses" o "Indefinido". `TypeOfContract` discrimina tipo. Archivos via `ISecureFileStorageService`.
