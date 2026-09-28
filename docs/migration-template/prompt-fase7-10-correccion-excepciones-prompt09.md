# Prompt Fase 7 — Corrección de las 3 excepciones reportadas en Prompt 09

El chalán dejó 3 archivos sin tocar en Prompt 09 por precaución
(correcto no borrar sin confirmar) — verifiqué cada uno a mano.
Veredicto: **1 era real pero de otra naturaleza** (bug preexistente,
no PrimeNG real), **2 estaban mal diagnosticados** (también son
imports muertos, igual que el resto).

## 1. `calendario-maestro-lista.ts` — NO tocar, es un bug preexistente sin relación con PrimeNG

Investigado a fondo: el `.html` de este archivo **ya usa `<lx-menu
#menu>`** (Bootstrap real, línea ~36), no `<p-menu>` — por eso mi
auditoría anterior no lo encontró. El `.ts` sigue tipando el
parámetro como `Menu` (de `@ui/web/primeng-menu/primeng-menu`) y
llamando `menu.toggle(event)` (línea 119) — pero **`LxMenu` no tiene
ningún método `toggle()`** (verificado leyendo su fuente:
`src/app/shared/ui/adaptive/menu/menu.ts` solo declara inputs, no
métodos; su versión web `AppMenu` sí tiene `toggle(): void` sin
parámetros, pero `LxMenu` no lo reexpone). Esto significa que
`menu.toggle(event)` probablemente **falla en runtime ahora mismo**
(`TypeError: menu.toggle is not a function`) — un bug preexistente de
cuando se migró la plantilla de `<p-menu>` a `<lx-menu>` sin ajustar
esta llamada imperativa, sin relación con esta limpieza de Fase 7.

**No lo toques en este prompt** — arreglarlo bien requiere decidir si
`LxMenu`/`AppMenu` deben exponer un `toggle()` público (cambio de API
de un componente compartido) o si el patrón de este archivo debe
cambiar a otra forma de disparar el popup. Repórtalo aparte como
hallazgo para que el equipo lo priorice — no es parte del retiro de
PrimeNG (el tipo `Menu` que sigue importado no bloquea nada crítico,
solo es un tipo incorrecto).

## 2. `contract-renewal-form.ts` — SÍ migrar, uso real confirmado

```
src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/contract-renewal-form.ts
```
Confirmado: `<p-button>` real en 2 sitios (líneas ~186 y ~196),
importado directo desde `primeng/button` (no vía wrapper). Migra
igual que los demás casos de `p-button` → `il-button` de esta sesión:

```diff
-import { ButtonModule } from "primeng/button";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
```
(ajusta `imports:` del `@Component` igual) y en el template cambia
cada `<p-button ...>` por `<il-button ...>` con el mapeo habitual
(`label`, `severity`, `(onClick)`→`(clicked)`, etc. — revisa las
props exactas de cada uno de los 2 sitios antes de migrar, no asumas
que son idénticos).

## 3. `cobranza-online-detalle-condominos.ts` — corrección: también es import muerto

```
src/app/modules/collections.luxuryapp/cobranza-online/detalle-condominos/cobranza-online-detalle-condominos.ts
```
El chalán reportó `SelectButtonModule` (de `primeng/selectbutton`
directo) como uso real — **verificado que no lo es**: 0 apariciones de
`<p-selectbutton` en su `.html`. Quita:
```diff
-import { SelectButtonModule } from "primeng/selectbutton";
```
y `SelectButtonModule` del arreglo `imports:`.

## 4. `committee-cobranza-web.ts` — hallazgo nuevo, import muerto

No estaba en ninguna lista anterior — encontrado en un barrido de
imports directos `primeng/*` (sin pasar por wrapper propio):
```
src/app/modules/committee.luxuryapp/cobranza/committee-cobranza-web.ts
```
Confirmado: 0 apariciones de `<p-tag` en su `.html`. Quita:
```diff
-import { TagModule } from "primeng/tag";
```
y `TagModule` del arreglo `imports:`.

## Verificación

- `grep -rn "from \"primeng/\|from 'primeng/" src/app/modules --include="*.ts"`
  → tras este prompt debe dar solo 2 resultados reales: el de
  `contract-renewal-form.ts` (si decides mantenerlo mientras migras,
  bórralo al terminar) y el de `catalog-web-extras.ts`
  (`MegaMenuItem, MenuItem, TreeNode` — ya documentado como excepción
  de tipos, no tocar) — y el de `conventions-viewer.service.ts` (dentro
  de un string de documentación, no tocar). Al terminar este prompt
  debe dar **0 imports de componente real**, solo esos 2 casos de
  tipos/documentación.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`, no uses `tail` ni reportes "inconcluso"**.
- Captura real de `contract-renewal-form.ts` (los 2 botones migrados).

## Listo cuando

- `contract-renewal-form.ts` migrado y verificado con captura.
- `cobranza-online-detalle-condominos.ts` y `committee-cobranza-web.ts`
  sin el import muerto.
- `calendario-maestro-lista.ts` sin tocar, reportado aparte como bug
  preexistente (no lo cierres como parte de Fase 7).
- `tsc`/build limpios, build confirmado terminado (no "inconcluso").
