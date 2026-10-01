# 🎨 Tables & Mobile Hybrid Patterns

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §2 (Tablas, §2.14) y §15 (Responsive). Este archivo contiene ejemplos detallados.

## 3.7. Estándares para Tablas (p-table)
- **Clase obligatoria**: `styleClass="custom-table card hidden md:block"`.
- **Scroll dinámico**: `[scrollHeight]="scrollHeight()"` usando `TableScrollHeightService`.
- **Filtro global**: `[globalFilterFields]="globalFilterFields()"` (usar `computed` en el componente).
- **Acciones**: Usar `custom-button-edit` y `custom-button-delete`.

## 3.7.1. Versión Móvil (app-data-view-mobile)
- Es **estrictamente obligatorio** incluir la versión móvil sincronizada con la tabla de escritorio debajo de la `p-table`.
- **Sincronización**: Usar el mismo `dataSignal()`, `globalFilterFields()` y referencia `#dt`.
- **Acciones Móviles**: Usar `app-action-menu`.

## 3.14. Helpers de Tabla
- `globalFilterFields(data)`: Extrae automáticamente las keys para búsqueda global.
- `rowsPerPageOptions()`: [30, 50, 75, 100, 150, 200].
