# Prompt Fase 7 — Paso 7: corrección — 3 imports que Paso 3 clasificó mal como "reales"

Al preparar la migración de los últimos archivos con PrimeNG genuino,
se descubrió que la auditoría de Paso 3 tuvo **3 falsos positivos**:
clasificó estos 3 imports como "uso real" porque el script de
verificación hizo match de la subcadena `p-button`/`p-inputgroup-addon`
dentro de un `<style>` embebido o un string de `styleClass`, no en un
tag `<p-button>`/`<p-inputgroup-addon>` real. Verificado a mano,
leyendo el `.html` completo de cada uno: **ningún tag real de esos
componentes existe**, son imports muertos igual que los 109 de Paso 3.

## 1. `ai-agent.ts`

```
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/ai-agent/ai-agent.ts
```

Quita:
```diff
-import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
```
y `ButtonModule` del arreglo `imports:`.

**No toques** la regla CSS `.p-drawer .p-button.justify-content-start
.p-button-label { ... }` dentro del `<style>` embebido del mismo
archivo (línea ~174) — sigue siendo necesaria mientras el paquete
PrimeNG (y su CSS) siga instalado; es un tema de estilos, no de
imports de componente, y se resuelve junto con el resto de
`_prime-*.scss` cuando se retire PrimeNG del todo (Fase 7 final, ver
`04-bitacora-cambios.md`).

## 2. `report-builder.ts`

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.ts
```

Quita:
```diff
-import { InputGroupAddonModule } from "@ui/web/primeng-inputgroupaddon/primeng-inputgroupaddon";
```
y `InputGroupAddonModule` del arreglo `imports:`.

**No toques** las clases `p-inputgroup`/`p-inputgroup-sm`/
`p-inputgroup-addon` en `report-builder.html` (línea ~371-374) — son
clases CSS puestas a mano sobre un `<div>`/`<span>` nativo (nunca fue
el componente Angular `<p-inputgroup-addon>`), siguen dependiendo del
CSS de PrimeNG cargado globalmente. Mismo tratamiento que el punto 1.

## 3. `manuals-and-processes-editor.ts`

```
src/app/modules/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/manuals-and-processes-editor/manuals-and-processes-editor.ts
```

Quita:
```diff
-import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
```
y `ButtonModule` del arreglo `imports:`.

**No toques** los 2 usos de `[styleClass]="'p-button-sm
p-button-outlined'"` pasados a `<lx-file-upload>` (líneas 300 y 598)
— son strings de clase CSS consumidos por ese componente propio, no
por PrimeNG, mismo tratamiento que arriba.

## Verificación

- `grep -n "primeng" <cada archivo>.ts` → 0 resultados en los 3.
- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- No debería cambiar nada visualmente (las clases CSS de PrimeNG que
  mencionan `p-button`/`p-inputgroup-addon` en los templates siguen
  intactas, solo se retira el import muerto del componente Angular).

## Listo cuando

- Los 3 imports muertos retirados.
- Las reglas/clases CSS de PrimeNG intactas (no son parte de este
  prompt).
- `tsc`/build limpios.
