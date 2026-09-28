# 🎨 API Communication & Dialogs

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §4 (API Access) y §2 (Diálogos, §2.16; Lookups, §2.17). Este archivo contiene ejemplos detallados.

## 3.5. ApiResponseService (OBLIGATORIO)
**Prohibido** usar `HttpClient` o `DataConnectorService` directamente en features.
- `onGetList<T>(url)`: GET de listado completo.
- `onGetItem<T>(url)`: GET de un elemento individual.
- `onGetPaged<T>(url, params)`: GET paginado via query params.
- `onPost<T>(url, data)`: Crear registro. Muestra toast de éxito automáticamente.
- `onPut<T>(url, data)`: Actualizar registro completo.
- `onDelete(url)`: Eliminar registro.
- `onDownloadFile(url)`: Descarga archivo como Blob.

## 3.6. Manejo de Diálogos (DialogHandlerService)
Abrir modales **siempre** mediante `DialogHandlerService`. Nunca instanciar `DialogService` directamente.
- `DialogSize.sm`: 700 px (Formularios simples).
- `DialogSize.md`: 1000 px (Estándar).
- `DialogSize.lg`: 1200 px (Formularios complejos).
- `DialogSize.full`: 100 vw x 100 vh (Visores PDF).

## 3.8. Lookups (SelectItem)
- Retornar siempre `SelectItem<T>` con `label`, `value` e `image`.
- Usar `SelectItemController` para base de datos.
