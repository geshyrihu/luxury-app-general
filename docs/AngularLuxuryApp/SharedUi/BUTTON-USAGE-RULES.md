# Reglas de uso de botones — opciones de menú / acciones de fila

> **Alcance:** aplican **únicamente** a las *opciones de menú* y *acciones de fila*
> (el `<td>` de opciones de una tabla, o las acciones de un item de lista). **NO**
> aplican a botones generales: "Agregar" del caption, botones de formulario, CTAs,
> toolbars, etc. — esos se eligen por diseño, no por esta regla.

## Regla raíz — la plataforma la decide el CONTENEDOR

Todo se divide por si está o no dentro de `<app-data-view-mobile>`:

| ¿Dónde está? | Componentes permitidos | Prohibido |
|---|---|---|
| **FUERA** de `<app-data-view-mobile>` (tablas, vistas desktop) | **web**: `iw-button-*`, `il-button-*`, `<app-action-menu>` | ❌ nada `ii-*` / `ili-*` / `<ili-action-menu>` |
| **DENTRO** de `<app-data-view-mobile>` (móvil/Ionic) | **móvil**: `ii-button-*`, `ili-button-*`, `<ili-action-menu>` | ❌ nada `iw-*` / `il-*` / `<app-action-menu>` |

- Un `<p-table>` **nunca** está dentro de `<app-data-view-mobile>` → siempre usa
  componentes **web** (`iw-*` / `il-*` / `<app-action-menu>`).
- **Prohibido** usar `web-icon` / `web-label` / `<app-action-menu>` dentro de
  `<app-data-view-mobile>`.

## Regla hija — icono vs label la decide el ACTION-MENU

Ya elegida la plataforma, dentro de una **tabla** (contexto web):

| ¿Los botones están dentro de un `<app-action-menu>`? | Botón |
|---|---|
| **NO** (acción directa e inline en el `<td>`) | `iw-button-*` (**solo icono**) |
| **SÍ** (dropdown de acciones) | `il-button-*` (**label + icono**) |

Y dentro de `<app-data-view-mobile>` (contexto móvil), las acciones van dentro de
`<ili-action-menu>` → `ili-button-*` (**label + icono**).

## Las 4 variantes de botón + los 2 action-menus

| Botón | Prefijo | Muestra | Plataforma |
|---|---|---|---|
| web-icon | `iw-button-*` | solo icono | Web |
| web-label | `il-button-*` | label + icono | Web |
| mobile-icon | `ii-button-*` | solo icono | Móvil (Ionic) |
| mobile-label | `ili-button-*` | label + icono | Móvil (Ionic) |

| Action menu | Selector | Motor | Usar en |
|---|---|---|---|
| Móvil | `<ili-action-menu>` | bottom-sheet nativo | Solo dentro de `<app-data-view-mobile>` |

## Matriz final

| Contexto | Action-menu | Botón |
|---|---|---|
| Fila de `<p-table>`, **directa** (sin action-menu) | — | `iw-button-*` (solo icono) |
| Dentro de `<app-action-menu>` (en `<p-table>` o cualquier vista web) | `<app-action-menu>` | `il-button-*` (label + icono) |
| Dentro de `<app-data-view-mobile>` | `<ili-action-menu>` | `ili-button-*` (label + icono) |

## Ejemplos de referencia

### Web — acción directa en la tabla → solo icono (`iw-*`)
```html
<td class="no-print">
  <div class="flex gap-1">
    <iw-button-edit styleClass="btn--circle" (clicked)="onEdit(item)" />
    <iw-button-delete styleClass="btn--circle" (confirmed)="onDelete(item.id)" />
  </div>
</td>
```

### Web — dentro de `<app-action-menu>` → label + icono (`il-*`)
```html
<app-action-menu>
  <ng-container actions>
    <il-button-edit label="Editar" (clicked)="onEdit(item)" />
    <il-button-delete label="Eliminar" (confirmed)="onDelete(item.id)" />
  </ng-container>
</app-action-menu>
```

### Móvil — dentro de `<app-data-view-mobile>` → `<ili-action-menu>` + `ili-*`
```html
<app-data-view-mobile ...>
  <ng-template #listItemTemplate let-item>
    <ion-item ...>
      <ili-action-menu slot="end">
        <ili-button-edit label="Editar" (clicked)="onEdit(item)" />
        <ili-button-delete label="Eliminar" (confirmed)="onDelete(item.id)" />
      </ili-action-menu>
    </ion-item>
  </ng-template>
</app-data-view-mobile>
```

## Migración pendiente (más adelante)

- Consumidores que usan `<app-action-menu>` **dentro de `<app-data-view-mobile>`**
  deben migrar a `<ili-action-menu>` + botones `ili-*` (hoy `app-action-menu` es
  híbrido y funciona, pero la regla exige el mobile explícito).
- Consumidores que usan `il-*` dentro de `<app-data-view-mobile>` → `ili-*`.
- Se buscarán las concurrencias en un paso posterior.
