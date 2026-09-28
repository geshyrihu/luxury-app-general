# Fase 2 — Catálogo y tipo `AppIcon`/`AppIconName` (valores mdi actuales)

Fecha: 2026-08-11 · Fase del prompt `opencode-prompt.md` (Fase 2)
Depende de: `20260810-diccionario-iconos.md` (Fases 1 y 1-bis, aprobadas)
Estado del gate: **VERDE** (`npx ng build --configuration development` compila)

---

## Qué se hizo

1. **`app-icon.catalog.ts` creado** en
   `client/angular/src/app/shared/ui/shared/app-icon/app-icon.catalog.ts`:
   `export const AppIcon = { … } as const;` con **534 entradas** y el tipo
   derivado `export type AppIconName = (typeof AppIcon)[keyof typeof AppIcon];`.

   - Las **534** filas provienen de `roles.json` (1:1 mdi→rol de la Fase 1-bis),
     ordenadas alfabéticamente por rol.
   - Los **valores son los `mdi:` ACTUALES** (no material), p. ej.
     `{ Search: "mdi:magnify", Add: "mdi:plus", … }` — la migración
     `mdi → material-symbols-light` es la Fase 4, no esta.
   - Se **excluyó `prefijo`** (`mdi:prefijo`): único rol "SIN EQUIVALENTE",
     falso positivo porque en `icon-mapping.ts:204` es texto en un comentario,
     no un icono real. Por eso el catálogo tiene 534 y no 535.

2. **`app-icon.ts` actualizado**:
   - `icon = input<AppIconName | null | undefined>();` (antes `string`).
   - **Eliminado el borrador `enum AppIconName`** de 19 miembros (lo exigía el
     prompt §0: el enum está solo en la Fase 2, indicado aquí).
   - Reexportado el **tipo** `AppIconName` desde `app-icon.catalog.ts`.

## Desviación documentada (colisión de nombre)

El prompt Fase 2.4 pide "reexporta `AppIcon` y `AppIconName` desde donde ya se
exporte el componente `AppIcon`". **Eso es imposible literalmente**: el
componente ya exporta `export class AppIcon` en `app-icon.ts`, y no se puede
tener `export const AppIcon` (el catálogo) en el mismo módulo (identificador
duplicado).

Decisión tomada:

- El **tipo `AppIconName`** se reexporta desde `app-icon.ts`
  (`export type { AppIconName } from "./app-icon.catalog";`), así los
  consumidores importan componente y tipo de un solo sitio.
- El **objeto `AppIcon`** queda únicamente en `app-icon.catalog.ts`; los
  consumidores que usen `AppIcon.X` lo importan de ahí
  (`app-icon/app-icon.catalog`). No se tocan las 562 importaciones existentes
  del componente.

Alternativa (no aplicada por ser cambio amplio y fuera del guion): renombrar el
componente. Se descarta por seguridad.

## Hallazgos

1. **`strictTemplates: false`** en `client/angular/tsconfig.json` (línea 44):
   con el input tipado, los literales de plantilla **NO se validan con el
   compilador**. El gate F2 compila porque Angular no hace type-check estricto
   de plantillas. Implicación directa para la **Fase 4**: la promesa "cada
   literal `mdi:` que quede es ahora un error de compilación" **no se cumplirá**
   mientras `strictTemplates:false` siga activo. No se activó aquí (riesgo de
   miles de errores preexistentes en todo el proyecto y fuera del guion de F2);
   se propone acordar su activación antes de Fase 4 o en ella.

2. **Literal mal formado encontrado** (inventario Fase 0 aparentemente
   incompleto): en
   `src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/asunto-legal/asunto-legal-lista.html:34`
   aparece `icon="mdi:plus mr-2"` — icono pegando una clase CSS en el mismo
   atributo. NO está en el catálogo (el literal correcto es `mdi:plus`). Compila
   en silencio por el hallazgo 1. **No se corrigió** (Fase 2 prohíbe tocar
   plantillas); queda pendiente de Fase 4/migración.

3. **Valores legacy fuera del tipo** (resolubles en runtime, no son `mdi:`, no
   están en `AppIconName`): `icon="circle"` y `icon="fluent-color:…"`
   (2 usos) y `[icon]="'bolt'"` (1 uso) detectados en `<app-icon>`. Se resuelven
   ok en runtime vía `resolveIconifyIcon`/`PRIME_TO_ICONIFY`
   (`circle→mdi:circle`, `bolt→mdi:lightning-bolt`; `fluent-color:…` pasa tal
   cual). Bibliografía: no son pendientes de F2; conviene migrarlos en Fase 4.

## Gate F2

- Ejecutado: `npx ng build --configuration development` (workdir
  `client/angular`).
- **Resultado: compila correctamente** (solo warnings NO relacionados con
  iconos: `NG8113` de `LxDivider` y `CustomInputDateSignal` sin usar, preexistentes).
- Zero literales `mdi:` en uso fuera del catálogo tras validar manualmente las
  323 ocurrencias estáticas+literal-binding de `<app-icon>` (TODAS presentes,
  aparte del literal mal formado del hallazgo 2).

## Pendientes para fases siguientes

- Fase 3: tipar los ~239 campos dinámicos (`col.icon`, `category.icon`, …) a
  `AppIconName`; los venidos de API se reportan, no se tipan.
- Fase 4: cambiar los 534 valores `mdi:` → `material-symbols-light:` en
  `app-icon.catalog.ts` (solo valores). Precondición a decidir: activar
  `strictTemplates:true` para que los literales residuales sean errores (ver
  hallazgo 1).