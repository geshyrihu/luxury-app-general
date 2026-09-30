
Fase 6 (migración de `p-table` → `AppTable`) concluyó por completo:
0 archivos `<p-table>` reales en todo el repo, todas las funciones de
tiene una regla que dice explícitamente que `p-table` es "la única
hay que actualizarla.

## Archivo a editar

```
conventions/CONVENTIONS.md
```

~408). Actualmente dice:

```markdown

- En features Angular, `p-table` y su ecosistema directo necesario para
  construir la tabla son la **unica** excepcion vigente de uso directo de
  features.
  - El uso de `p-table` debe seguir el patron oficial definido en
    `./ui/*` y en `appsweb/angular/src/app/shared/ui/*`.
```

Reemplázala por (ajusta redacción si lo ves necesario, pero conserva
features, `app-table` es el estándar):

```markdown

- **La excepción de `p-table` queda retirada.** Fase 6 de la migración
  repo (verificado en `.html` y en plantillas inline `.ts`), todas las
  selección, columnas congeladas, pie de tabla) reconstruidas en
  `AppTable`.
  `<app-table>` (`appsweb/angular/src/app/shared/ui/web/table/table.ts`)
  para cualquier necesidad de tabla — soporta orden, agrupación,
  reordenar filas/columnas, selección múltiple y columnas congeladas.
  El patrón oficial de uso sigue definido en `./ui/*` y en
  `appsweb/angular/src/app/shared/ui/*`.
- Detalle completo de la migración y decisiones de diseño en
  `docs/migration-template/04-bitacora-cambios.md`.
```

## No toques nada más en este prompt

retiro de dependencias) y el resto de `conventions/ui/*`/
`arquitectura-shared-ui.md` (también Fase 7) quedan para después, no
son parte de este cambio puntual.

## Verificación

- Confirma que el archivo sigue siendo Markdown válido (no rompiste
  ningún encabezado ni lista).
- No requiere `tsc`/`ng build` (es solo documentación, no código).

## Listo cuando

- La sección actualizada refleja que la excepción de `p-table` ya no
  existe.
- Nada más en el archivo se tocó.
