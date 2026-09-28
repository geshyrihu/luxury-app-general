# Prompt Fase 8 — Detalle final: spec huérfano de `bottom-nav`

Al borrar `adaptive/bottom-nav/bottom-nav.ts` en el Paso 2, quedó sin
borrar su spec:

```
src/app/shared/ui/adaptive/bottom-nav/bottom-nav.spec.ts
```

Sigue importando `./bottom-nav` (el componente ya borrado) — `tsc
--noEmit` no lo detecta porque este proyecto no incluye `.spec.ts` en
ese chequeo, pero rompería `vitest run` si alguien corriera los tests.
Bórralo (y la carpeta `adaptive/bottom-nav/` si queda vacía después).

**No relacionado, no tocar**: de paso se encontró
`web/header-customer/header-customer.spec.ts`, que también está
"huérfano" (importa `./haeder-customer`, con un typo en el nombre real
del archivo) — es un bug preexistente sin relación con PrimeNG ni con
esta limpieza, de antes de esta sesión. Fuera de alcance, no lo toques
aquí.

## Verificación

- El archivo ya no existe.
- `npx tsc --noEmit`: 0 errores (no debería cambiar nada, ya estaba en
  0 antes de este borrado).
- Si tienes forma de correr `vitest`/`npm test` en tu entorno,
  confirma que no hay ningún test roto por este archivo. Si no puedes
  correrlo, dilo explícitamente en vez de asumir que está bien.

## Listo cuando

- `bottom-nav.spec.ts` borrado.
- Con esto se cierra por completo el Paso 2 de Fase 8. Pueden seguir
  con `action-menu` y `image` como estaba planeado.
