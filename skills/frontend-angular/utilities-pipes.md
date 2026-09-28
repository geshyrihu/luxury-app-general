# 🎨 Angular Pipes & Utility Services

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §2 (Pipes §2.14, Servicios §2.15). Este archivo contiene ejemplos detallados.

## 3.13. Pipes Disponibles
**Prohibido** crear duplicados. Importar desde `@core/modules/custom-pipe.module`:
- `capitalizado`: `'hola'` -> `'Hola'`.
- `eBoolText`: `true` -> `'Si'`.
- `currencyMexico`: `1234` -> `'$1,234.00'`.
- `phoneFormat`: `'5551234567'` -> `'(555) 123-4567'`.
- `filesize` (archivo `ilesize.pipe.ts` por legado): Formatea tamaño de archivo (MB, KB).

## 3.14. Servicios Utilitarios (NO reinventar)

### DateService
**Prohibido** usar `new Date()`.
- `getDateNow()`: '2026-04-14' (YYYY-MM-DD).
- `formatToYyyyMmDd(value)`: Asegura el formato estándar.

### EnumSelectService
Shortcut para todos los enums. **Prohibido** hardcodear Selects.
- `enumS.status()`: Observable para EStatus.
- `enumS.sex()`: Observable para ESex.
- **Regla**: `[data]` del input debe ser un **signal**. Usar `()` en template: `[data]="cb_status()"`.

### StorageService
Local Storage tipado. Prohibido `localStorage.setItem`.
- `storage.store('key', obj)`.
- `storage.retrieve('key')`.

### TableScrollHeightService
Altura dinámica restando header y footer. Usar `[scrollHeight]="tableHeightS.scrollHeight()"`.
