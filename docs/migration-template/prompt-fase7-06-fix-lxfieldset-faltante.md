# Prompt Fase 7 — Paso 6 (corrección final): `LxFieldset` sigue faltando

`ng build` ya da exit 0 / 0 ERROR — pero eso **no prueba que este
archivo esté bien**, porque el proyecto tiene `strictTemplates:
false` y Angular no valida en build que cada tag del template tenga
un componente/directiva real detrás. Confirmado leyendo el archivo:
`LxFieldset` se restauró en el prompt anterior para `CustomerIdService`,
pero **no para `LxFieldset`** — el import completo desapareció.

Archivo:
```
src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeo/evaluation-template/formulario-plantilla-evaluacion.ts
```

El `.html` del mismo componente sigue usando `<lx-fieldset>` en 2
lugares (líneas 68 y 148: `<lx-fieldset [formGroup]="categoryGroup"
cdkDrag class="custom-fieldset">` ... `</lx-fieldset>`). Sin el import
ni la entrada en `imports:`, ese tag es hoy un elemento HTML inerte —
sin agrupamiento, sin el comportamiento que `LxFieldset` provee.

## Fix

1. Agrega de vuelta el import (usa el mismo estilo de alias `@ui/...`
   que el resto del archivo, no relativo):
   ```ts
   import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
   ```
2. Agrega `LxFieldset` de vuelta al arreglo `imports:` del
   `@Component` (puede ir en cualquier posición, no importa el orden).

No toques nada más de este archivo — `CustomerIdService` ya quedó
bien restaurado, no lo muevas ni cambies su import a alias si ya
quedó como relativo, eso no es parte de este fix.

## Por qué esto importa para el resto de Fase 7

Este patrón (una regresión que el build no detecta porque el proyecto
no valida templates estrictamente) puede repetirse en cualquier otro
archivo tocado por Paso 3. Antes de dar por cerrado un archivo con
colateral confirmado, compara su `.html` contra su `imports:` —
`ng build` limpio no es prueba suficiente cuando el elemento removido
solo vive en el template, no en código TypeScript.

## Verificación

- `grep -n "lx-fieldset" <archivo>.html` y confirma que `LxFieldset`
  está importado y en `imports:` del `.ts`.
- `npx tsc --noEmit`: sigue en 0 errores (no debería cambiar nada acá,
  el bug era de template, no de tipos).
- `ng build`: sigue en exit 0 / 0 ERROR.
- Prueba visual de la pantalla `formulario-plantilla-evaluacion`
  (crear/editar plantilla de evaluación, sección de categorías) para
  confirmar que el fieldset se ve y se comporta como antes (drag para
  reordenar categorías).

## Listo cuando

- `LxFieldset` importado y registrado de nuevo.
- Captura de la pantalla confirmando que el fieldset de categorías se
  ve y funciona igual que antes del Paso 3.
