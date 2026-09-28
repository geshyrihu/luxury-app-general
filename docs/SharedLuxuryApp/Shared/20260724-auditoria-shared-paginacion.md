# Auditoría de uso de `PaginationCommonDTO` (paginación) — 2026-07-24

Fuente de verdad backend: `LuxuryApp.Shared/DTOs/PaginationCommonDTO.cs`.

## 1. Contrato canónico (el DTO)

| Propiedad | Tipo | Default | Notas |
|---|---|---|---|
| `Page` | `int` | 1 | Página (base 1). |
| `RecordsNumber` | `int` | 30 | Tamaño de página. **Se recorta a máx. 200** (`MaxRecordsNumber`). |
| `Filter` | `string` | — | Búsqueda global. |
| `SortField` | `string` | — | Campo de ordenamiento. |
| `SortOrder` | `int?` | 1 | 1 asc / -1 desc. |

Se aplica con `QueryableExtensions.Paginate<T>(query, pagination)`.

**Veredicto general: NO está estandarizado.** Conviven 3 estilos de binding en el back y **4 vocabularios de parámetros** en el front, incompatibles entre sí. Hay casos donde los parámetros **se ignoran silenciosamente** y el endpoint usa los defaults (página 1, 30 registros, sin filtro).

---

## 2. Backend — 3 estilos de binding

### Estilo A ✅ (canónico) — `[AsParameters] PaginationCommonDTO` (GET, query)
Bind case-insensitive por nombre de propiedad (`page`, `recordsNumber`, `filter`, `sortField`, `sortOrder`).

- `AccessControl/AccessOperationsEndpoints.cs:25` (`events`)
- `AccessControl/VisitsEndpoints.cs:34`
- `Inventory/InventarioProductoEndpoints.cs:31, 41`
- `ToolLoan/ControlPrestamoHerramientasEndPoints.cs:12`
- `Provider/ProvidersEndPoints.cs:53, 57`
- `Purchases/PurchaseOrderDetail/OrdenCompraDetalleEndPoints.cs:31`
- `Purchases/SolicitudCompra/SolicitudCompraDetalleEndPoints.cs:38`
- `AuditEntries/AuditEntriesEndPoints.cs:17`
- `LogApp/LogsEndPoints.cs:13`
- `UserActivityHistory/UserActivityHistoryEndPoints.cs:17`

### Estilo B ⚠️ (manual, vocabulario propio) — `[FromQuery] int page, int limit, string sort, string order, string filter` → construye el DTO a mano
Inventa los nombres **`limit` / `sort` / `order`** que **NO** coinciden con el DTO (`RecordsNumber` / `SortField` / `SortOrder`).

- `Inventory/ProductosEndpoints.cs:18` (`paged`)
- `Inventory/SalidasProductosEndpoints.cs:19` (`get-paged-list`)
- `Tasks/TasksEndpoints.cs:30` (`list/{taskGroupId}/{status}`)

### Estilo C ⚠️ (POST + body JSON) — `PaginationCommonDTO filter` como cuerpo
- `PasswordManager/PasswordsEndpoints.cs:13` (`credentials/filter`, `MapPost`)

---

## 3. Frontend — 4 vocabularios

| Vocabulario | Parámetros que envía | Compatible con | Dónde |
|---|---|---|---|
| **A ✅** (canónico) | `page`, `recordsNumber`/`RecordsNumber`, `filter`/`Filter` | Estilo A | `provider-list.ts:173`, `warehouse-stock-add.ts:134`, `visit-list.ts:40` (`recordsNumber`), builder `salidas-productos` (`RecordsNumber`/`Page`) |
| **B ⚠️** | `page`, `limit`, `sort`, `order`, `filter` | Estilo B (manual) | `task-list.ts:355`, `productos-list.ts:105,138` |
| **C ❌** | `page`, `pageSize`, `filter`/`search` | **nada** | `PaginationService` (`pageSize`), `password-list.ts:82` (`pageSize`+`search`) |
| **Prefijo ❌** | `pagination.Page`, `pagination.RecordsNumber`, `pagination.Filter` | **nada** (`[AsParameters]` no usa prefijo) | `audit-entries.ts:137` |

---

## 4. Casos concretos ROTOS (parámetros ignorados → defaults)

1. **`audit-entries.ts:137`** — envía `pagination.Page` / `pagination.RecordsNumber` / `pagination.Filter`. El endpoint es `[AsParameters]`, que **no** usa prefijo → **ninguno bindea** → siempre página 1, 30 registros, sin filtro. (El hermano `log-api-report.ts:113` lo hace bien: `RecordsNumber` sin prefijo).
2. **`password-list.ts:82`** — envía `pageSize` y `search`. El DTO espera `RecordsNumber` y `Filter` → **tamaño de página y búsqueda ignorados**.
3. **`PaginationService` (C)** — envía `pageSize`. Consumidores: `product-output-list.ts`, `purchase-request-add-product-form.ts`, `product-modal-add.ts`. Los endpoints destino (`SolicitudCompraDetalle`/`OrdenCompraDetalle`, estilo A) esperan `RecordsNumber` → **el tamaño de página se ignora** (usa 30).
4. **Builder `ProductOutputs.getPaged`** (`operations.endpoints.ts:503`) — arma `RecordsNumber=..&Page=..`, pero el endpoint `SalidasProductos/get-paged-list` (estilo B) espera **`limit`** → `RecordsNumber` no bindea a `limit`.
5. **Ordenamiento vía estilo A**: nadie envía `SortField`/`SortOrder` desde el front; el `sort`/`order` (vocabulario B) solo funciona en los 3 endpoints manuales. En los `[AsParameters]` el ordenamiento por servidor está de facto sin usar.

---

## 5. Recomendación de estandarización

**Elegir el contrato canónico A** (el del DTO) y unificar todo:

- **Backend:** convertir los 3 endpoints estilo B (`Productos/paged`, `Salidas/get-paged-list`, `Tasks/list`) a `[AsParameters] PaginationCommonDTO` (elimina el vocabulario `limit/sort/order`). Evaluar pasar `Passwords/credentials/filter` de POST-body a GET+`[AsParameters]`, o dejarlo documentado como excepción.
- **Frontend:** un **único helper** que construya los query params desde un estado de tabla `{ page, recordsNumber, filter, sortField, sortOrder }` con los nombres del DTO. Reemplazar:
  - vocabulario C (`pageSize`/`search`) y el prefijo `pagination.*`,
  - vocabulario B (`limit`/`sort`/`order`),
  - y refactorizar `PaginationService` para emitir `recordsNumber` (no `pageSize`).
- Mantener el tope de 200 (`MaxRecordsNumber`) como única fuente; el front no debería pedir más.

### Prioridad de arreglo (bugs vivos)
1. `audit-entries.ts` (prefijo `pagination.`).
2. `password-list.ts` (`pageSize`/`search`).
3. `PaginationService` (`pageSize` → `recordsNumber`) + sus 3 consumidores.
4. Builder `ProductOutputs.getPaged` vs endpoint `limit`.
