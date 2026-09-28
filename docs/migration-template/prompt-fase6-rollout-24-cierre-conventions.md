# Prompt 24 — Fase 6: actualizar la regla especial de PrimeNG en CONVENTIONS.md

Fase 6 (migración de `p-table` → `AppTable`) concluyó por completo:
0 archivos `<p-table>` reales en todo el repo, todas las funciones de
PrimeNG reconstruidas en `AppTable`. `conventions/CONVENTIONS.md`
tiene una regla que dice explícitamente que `p-table` es "la única
excepción vigente de uso directo de PrimeNG" — eso ya no es cierto,
hay que actualizarla.

## Archivo a editar

```
conventions/CONVENTIONS.md
```

Busca la sección `### Regla especial vigente de PrimeNG` (línea
~408). Actualmente dice:

```markdown
### Regla especial vigente de PrimeNG

- En features Angular, `p-table` y su ecosistema directo necesario para
  construir la tabla son la **unica** excepcion vigente de uso directo de
  PrimeNG.
- Esa excepcion no habilita el uso directo de otros componentes PrimeNG en
  features.
  - El uso de `p-table` debe seguir el patron oficial definido en
    `./ui/*` y en `appsweb/angular/src/app/shared/ui/*`.
```

Reemplázala por (ajusta redacción si lo ves necesario, pero conserva
el sentido: la excepción ya no existe, PrimeNG queda prohibido en
features, `app-table` es el estándar):

```markdown
### Regla especial de PrimeNG — RETIRADA (Fase 6 completada 2026-09-16)

- **La excepción de `p-table` queda retirada.** Fase 6 de la migración
  PrimeNG→Bootstrap concluyó: 0 archivos `<p-table>` reales en todo el
  repo (verificado en `.html` y en plantillas inline `.ts`), todas las
  funciones de PrimeNG (agrupación, reordenar filas/columnas,
  selección, columnas congeladas, pie de tabla) reconstruidas en
  `AppTable`.
- **PrimeNG queda prohibido en features Angular sin excepción.** Usa
  `<app-table>` (`appsweb/angular/src/app/shared/ui/web/table/table.ts`)
  para cualquier necesidad de tabla — soporta orden, agrupación,
  reordenar filas/columnas, selección múltiple y columnas congeladas.
  El patrón oficial de uso sigue definido en `./ui/*` y en
  `appsweb/angular/src/app/shared/ui/*`.
- Detalle completo de la migración y decisiones de diseño en
  `docs/migration-template/04-bitacora-cambios.md`.
```

## No toques nada más en este prompt

Solo esa sección. Los `.scss`/`package.json` de PrimeNG (Fase 7,
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
