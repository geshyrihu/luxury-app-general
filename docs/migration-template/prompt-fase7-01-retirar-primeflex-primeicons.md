# Prompt Fase 7 — Paso 1: retirar `primeflex` y `primeicons` (0 uso confirmado)

Auditoría exhaustiva (2026-09-16, ver `04-bitacora-cambios.md`)
confirmó **0 uso real** de PrimeFlex y PrimeIcons en todo
`appsweb/angular/src`:

- **PrimeFlex**: ningún `.scss` lo importa, `angular.json` nunca lo
  incluyó en `styles`, y no hay ninguna clase utilitaria de PrimeFlex
  (`p-d-flex`, `p-grid`, `p-col-*`, etc.) en ninguna plantilla.
- **PrimeIcons**: ningún `pi pi-*`/`pi-*` real en código (el único
  match encontrado está dentro de un string de documentación que ya
  marca el patrón como "retirado"). Solo queda cargado como CSS muerto.

Esto es **independiente** de PrimeNG en sí (que todavía tiene uso real
y no se toca en este prompt).

## 1. `appsweb/angular/package.json`

Quita estas 2 líneas (dentro de `dependencies`):

```diff
-    "primeflex": "^4.0.0",
-    "primeicons": "8.0.1",
```

**No toques** `"primeng": "22.1.1"` ni `"@primeuix/themes"` /
`"@primeuix/utils"` — esos siguen en uso real (ver bitácora, bloqueo
por `ConfirmDialog` global y catálogo interno).

## 2. `appsweb/angular/angular.json`

Busca en el array `styles` (línea ~87):

```diff
-              "node_modules/primeicons/primeicons.css",
```

Quita esa línea completa (una sola entrada dentro del arreglo).

## 3. Reinstalar dependencias

Después de editar `package.json`, corre `npm install` (o el gestor
que use el proyecto) dentro de `appsweb/angular` para que
`node_modules`/lockfile queden consistentes con el `package.json`
nuevo.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Confirma que `node_modules/primeflex` y `node_modules/primeicons` ya
  no existen tras el `npm install`.
- No requiere capturas — ningún selector CSS de PrimeFlex/PrimeIcons
  estaba en uso, no debería cambiar nada visualmente. Aun así, abre
  una pantalla cualquiera para confirmar que no hay iconos rotos.

## Listo cuando

- `primeflex`/`primeicons` fuera de `package.json` y `node_modules`.
- Línea de `primeicons.css` fuera de `angular.json`.
- `tsc`/build limpios (log completo, no `tail`).
- `primeng`/`@primeuix/*` siguen intactos (no es parte de este paso).
