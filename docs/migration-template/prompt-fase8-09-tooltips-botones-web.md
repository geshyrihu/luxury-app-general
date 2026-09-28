# Prompt Fase 8 — Tooltips en botones web vía `[lxTooltip]` (mismo motor que Lagos)

## ⛔ Dependencia bloqueante

Este prompt **no debe ejecutarse** antes de cerrar
`prompt-fase8-07-verificar-lxtooltip-runtime.md`.

Hoy los botones muestran tooltip con el `title` **nativo** del navegador.
Si `[lxTooltip]` (que pasa por `NgbTooltip`) no funciona en runtime y se
quita el `title`, los botones quedarían **sin ningún tooltip** — peor que
ahora. Si el prompt 07 concluyó que hay que corregir la directiva,
corregirla primero.

## Contexto (verificado)

- Lagos usa `ngbTooltip` de `@ng-bootstrap/ng-bootstrap`, con
  `placement="top"`:
  `templates_admin/lagos/.../shared/data/data/buttons/buttons.ts`.
- Lagos además trae un fallback con `data-toggle="tooltip"` +
  `title` (tooltip de **Bootstrap JS**).
- **Ese fallback NO aplica en nuestro repo:** `angular.json` tiene
  `"scripts": []` → no hay Bootstrap JS cargado. Nuestro único camino es
  ng-bootstrap.
- El repo ya tiene el wrapper oficial: `LxTooltipDirective`
  (`shared/ui/adaptive/tooltip/tooltip.directive.ts`), que envuelve
  `NgbTooltip` — **mismo motor que Lagos** — y se usa en ~128 lugares.
  **Usar el wrapper; no importar `@ng-bootstrap/ng-bootstrap` directo en
  los botones.**
- Estado actual de los botones: el tooltip sale del `title` nativo, y
  solo **5 archivos** lo declaran:
  - `web-icon/button.ts`
  - `web-label/button.ts`
  - `web-icon/button-item.ts`
  - `mobile-icon/button.ts`
  - `mobile-label/button.ts`

  Las otras **~23 variantes web** (`iw-button-edit`, `iw-button-delete`,
  `il-button-save`, `il-button-add`, …) **no tienen tooltip alguno hoy**.

## Alcance

Motor: `[lxTooltip]` (alias de `NgbTooltip`). Solo **web**:
`shared/ui/buttons/web-icon/*` y `shared/ui/buttons/web-label/*`
(26 componentes, specs excluidos). **Móvil queda fuera de alcance** (no
hay hover; `ion-button` conserva su `title` nativo).

### 1. `shared/ui/buttons/base/base-button.ts`

Agregar:

```ts
tooltip = input<string>("");
tooltipPosition = input<"top" | "bottom" | "left" | "right">("top");
protected tooltipText = computed(() =>
  this.tooltip() || this.title() || this.ariaLabel() || this.label(),
);
```

Precedencia `tooltip` → `title` → `ariaLabel` → `label`: así las ~23
variantes que hoy no tienen tooltip empiezan a mostrar uno **sin tocar
ningún consumidor**.

### 2. En cada template de botón web

- Importar `LxTooltipDirective` desde `@ui/adaptive/tooltip`.
- Agregarlo al array `imports` del componente.
- En el `<button>`:

```html
[lxTooltip]="tooltipText()"
[tooltipPosition]="tooltipPosition()"
[tooltipDisabled]="!tooltipText()"
```

- **Quitar `[attr.title]`** (evita el tooltip nativo duplicado junto al
  estilizado). Aplica a `web-icon/button.ts`, `web-label/button.ts` y
  `web-icon/button-item.ts`.
- **Conservar `[attr.aria-label]`** (accesibilidad, no es tooltip).
- Los `<button>` que hoy no tienen tooltip solo necesitan las 3 líneas
  nuevas + el import.

### 3. Consumidores

No se toca ninguno de los ~100 usos de `iw-*` / `il-*`.

## Restricciones

- **No** importar `@ng-bootstrap/ng-bootstrap` dentro de
  `shared/ui/buttons`: se usa el wrapper `[lxTooltip]`.
- **No** usar `data-toggle="tooltip"` ni cargar `bootstrap.bundle`: no hay
  Bootstrap JS en `angular.json`.
- **No** tocar botones móviles (`mobile-icon/*`, `mobile-label/*`).
- **No** cambiar clases CSS, severidades ni la API existente.
- Cambio en `shared/ui`: registrar el análisis de impacto (1 clase base +
  26 templates, 0 consumidores afectados) en la bitácora.

## Verificación

- `npx tsc --noEmit` → 0 errores.
- `npx ng build --configuration production` con log completo
  (`> log 2>&1`, sin `tail`) → exit 0, 0 `ERROR`.
- `npm run audit:ui` verde.
- `git diff --check` sin errores.
- **Runtime obligatorio:**
  - hover sobre un `iw-button` **icon-only** dentro de una tabla (p. ej.
    Task Engine) → tooltip visible, posición arriba;
  - hover sobre un `il-button` con label → tooltip visible;
  - confirmar que **no** aparece el tooltip nativo del navegador en
    paralelo;
  - tema claro y oscuro;
  - capturas como evidencia.

## Listo cuando

- Todos los botones **web** muestran tooltip con un único mecanismo
  (ng-bootstrap vía `[lxTooltip]`), sin `title` nativo.
- 0 consumidores modificados y 0 dependencias nuevas.
- Evidencia runtime en claro/oscuro.
- Entrada nueva en `04-bitacora-cambios.md` con archivos tocados,
  resultado de build y capturas.
- Documentado que el fallback `data-toggle="tooltip"` de Lagos **no
  aplica** por ausencia de Bootstrap JS.
