# Prompt 7b — Fase 6: agregar orden inicial (`sortField`/`sortOrder`) a `app-table`

Al auditar el lote de `collections.luxuryapp` se encontró que
`cobranza-online-clasificacion-detail.ts` usa
`[sortField]="'balance'"` y `[sortOrder]="-1"` (ordenar por saldo
descendente al abrir, sin que el usuario haga clic) — `AppTable` no
declara esos inputs, así que el binding no hace nada (no rompe el
build porque `strictTemplates: false`, confirmado corriendo `ng build`
real, pero el orden inicial se pierde en silencio). El mismo patrón
aparece en **4 archivos más**, todavía sin migrar:

```
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.html
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/task-group-category-list/task-group-category-list.html
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-presentacion.html
```

Se agrega soporte real ahora para que estos 4 (y cualquier otro que
aparezca) lo hereden funcionando, en vez de repetir el hallazgo cada
vez.

## Cambio en `shared/ui/web/table/table.ts`

Agrega 2 inputs nuevos a `AppTable` y usa `linkedSignal` (ya
disponible en Angular 22) para que el signal interno se siembre del
input pero el usuario pueda seguir cambiándolo al hacer clic en un
encabezado — exactamente el caso de uso para el que existe
`linkedSignal`:

```ts
import { linkedSignal } from "@angular/core"; // agregar al import existente de "@angular/core"

// nuevos inputs, junto a los demás inputs de AppTable
initialSortField = input<string | undefined>(undefined);
initialSortOrder = input<1 | -1>(1);

// reemplaza las 2 líneas actuales:
//   sortField = signal<string | null>(null);
//   sortOrder = signal<1 | -1>(1);
// por:
sortField = linkedSignal<string | null>(() => this.initialSortField() ?? null);
sortOrder = linkedSignal<1 | -1>(() => this.initialSortOrder());
```

No cambies nada más de la lógica de `sort()`/`filteredValue`/
`sortedValue` — siguen leyendo `this.sortField()`/`this.sortOrder()`
igual que antes, `linkedSignal` es una API compatible (se lee y se
escribe igual que un `signal` normal vía `.set()`).

## Actualiza el único consumidor ya migrado

En `cobranza-online-clasificacion-detail.ts`, cambia:

```diff
- [sortField]="'balance'"
- [sortOrder]="-1"
+ [initialSortField]="'balance'"
+ [initialSortOrder]="-1"
```

## Verificación

1. `npx tsc --noEmit` limpio.
2. `ng build` sin errores nuevos (los warnings `NG8113` de imports no
   usados que ya existían no son de este cambio, ignóralos).
3. Prueba `cobranza-online-clasificacion-detail` (ábrela desde donde
   se dispare ese modal/diálogo) y confirma que carga con las filas ya
   ordenadas por saldo descendente, y que sigue pudiéndose reordenar
   por otra columna con clic.
4. Captura real.

## Listo cuando

- `table.ts` con los 2 inputs nuevos vía `linkedSignal`.
- `cobranza-online-clasificacion-detail.ts` actualizado.
- `tsc`/`ng build` limpios.
- Captura confirmando el orden inicial funcionando.

Con esto, los 4 archivos pendientes (`customer-data-company-list`,
`module-app-rol-list`, `task-group-category-list`,
`solicitud-compra-presentacion`) solo necesitarán el mismo cambio de
nombre (`sortField`→`initialSortField`, `sortOrder`→`initialSortOrder`)
cuando les toque su lote — no hace falta tocarlos ahora, ya se
resuelve cuando el codemod estándar los migre (el codemod no toca
estos nombres, así que ese paso seguirá siendo manual, pero ya sabemos
exactamente qué hacer).
