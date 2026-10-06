# Prompt para Agente externo 5 (Fase 2b) — corregir ejemplo de documentación malformado en Admin

Eres documentador/implementador Angular. Corrige un ejemplo de código **dentro de un string TypeScript** (no es template runtime, no afecta build ni `audit:ui`) que está marcado como `<!-- OK -->` pero en realidad muestra la sintaxis rota que el resto del repo ya corrigió.

## Scope exclusivo

- `src/app/modules/admin.luxuryapp/admin-hub/conventions-viewer/conventions-viewer.service.ts` (bloque alrededor de las líneas 405-416, dentro de `examples.angular.code`)

## Trabajo

El string actual (dentro de un template literal) dice:

```
<!-- OK -->
<lux-button-web-primary (clicked)="save()">Guardar</il-button-primary>
<lux-button-web displayMode="icon"-edit aria-label="Editar registro" />
<custom-input-text-signal [control]="form.controls.name" />
```

Dos líneas están rotas (selector inventado `lux-button-web-primary`, cierre de tag inconsistente `</il-button-primary>`, y el sufijo inerte `displayMode="icon"-edit`). Corrígelas para que reflejen la API real y consistente usada ya en el resto del repo tras Fase 2:

```
<!-- OK -->
<lux-button-web kind="save" (clicked)="save()">Guardar</lux-button-web>
<lux-button-web kind="edit" displayMode="icon" ariaLabel="Editar registro" />
<custom-input-text-signal [control]="form.controls.name" />
```

- Verifica contra `src/app/shared/ui/buttons/web/button.ts` que `kind="save"` y `kind="edit"` son valores válidos de `WebButtonKind`, y que el input se llama `ariaLabel` (no `aria-label`) en `BaseButton` antes de dar por bueno el reemplazo — no copies el ejemplo de este prompt sin verificar.
- No cambies ningún otro ejemplo del archivo ni la lógica del servicio. Es un cambio de un string de documentación, nada más.
- No requiere build ni worktree aislado por el tamaño del cambio, pero igual commitea solo este path con pathspec explícito.

Reporta el diff exacto y confirma que verificaste los inputs reales antes de aplicar.

## Reporte de ejecución

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: diff exacto aplicado, confirmación de que verificaste `kind="save"`/`kind="edit"` y `ariaLabel` contra el código real de `ButtonWeb`/`BaseButton`, y el commit usado.

## Reporte de ejecución

**Commit:** `77bde2294` — `fix(admin): corrige ejemplo malformado de botones en visor de convenciones` — 1 file changed, +2/−2, únicamente `src/app/modules/admin.luxuryapp/admin-hub/conventions-viewer/conventions-viewer.service.ts` (commit pathspec explícito en `main`).

**Diff exacto aplicado** (bloque `ui-usage-catalog` → `examples.angular.code`, líneas 410-417):

```diff
           code: `<!-- OK -->
-<lux-button-web-primary (clicked)="save()">Guardar</il-button-primary>
-<lux-button-web displayMode="icon"-edit aria-label="Editar registro" />
+<lux-button-web kind="save" (clicked)="save()">Guardar</lux-button-web>
+<lux-button-web kind="edit" displayMode="icon" ariaLabel="Editar registro" />
 <custom-input-text-signal [control]="form.controls.name" />
```

**Verificación previa contra código real (antes de aplicar, no se copió el prompt a ciegas):**

- `kind="save"` y `kind="edit"` son valores válidos de `WebButtonKind`: unión en `src/app/shared/ui/buttons/web/button.ts:14-26`, con default declarado en `DEFAULTS` (`button.ts:32-34`: `save` → label "Guardar"/icon `save`, `edit` → label "Editar"/icon `edit`).
- El input correcto es `ariaLabel` (no `aria-label`): `src/app/shared/ui/buttons/base/base-button.ts:40` → `ariaLabel = input<string>("")`. El `aria-label` del string original era un atributo HTML que no corresponde a ningún input del componente.
- `custom-input-text-signal` se dejó sin cambios.

**Alcance:** solo el string de documentación del ejemplo `ui-usage-catalog`; ningún otro ejemplo ni la lógica del servicio. No se requirió build ni worktree. El diff resultante es idéntico al propuesto tras confirmar los inputs reales. Este reporte quedó sin commitear (la instrucción pedía commitear solo el path del código).
