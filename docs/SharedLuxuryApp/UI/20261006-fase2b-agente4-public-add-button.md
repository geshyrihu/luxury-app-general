# Prompt para Agente externo 4 (Fase 2b) — reparar botón "add" malformado en Public

Eres implementador Angular. Repara el selector inventado `lux-button-web-add` en un único archivo del módulo público.

## Scope exclusivo

- `src/app/modules/public.luxuryapp/emergency-phones/telefonos-emergencia.html` (línea ~29, un botón)

## Trabajo

- Reemplaza `<lux-button-web-add label="Agregar" (clicked)="onModalForm({ id: '', title: 'Nuevo Registro' })" />` por `<lux-button-web kind="add" label="Agregar" (clicked)="onModalForm({ id: '', title: 'Nuevo Registro' })" />`.
- Preserva el `@if (aspRoleS.hasRole(AspRole.SuperUsuario))` que envuelve el botón; no lo toques.
- Verifica si `label="Agregar"` es redundante con el default de `kind="add"` (`DEFAULTS.add.label` en `src/app/shared/ui/buttons/web/button.ts`); si es idéntico puedes dejarlo explícito o quitarlo, decide por consistencia con otros botones `kind="add"` ya migrados en el repo (ejemplo: busca `kind="add"` en `shared.luxuryapp/catalogs/**` para ver el patrón usado).

Worktree aislado desde el `main` local actual (post Fase 2), solo este path. Verificación: `ng build`, `npm run audit:ui`, `git diff --check`.

## Reporte de ejecución

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: commit/branch/worktree usado, antes/después del botón, decisión sobre `label="Agregar"` explícito vs default, resultado de `ng build` y `npm run audit:ui`.

---

## Reporte de ejecución — Agente 4 (Fase 2b)

- **Worktree:** `.kilo/worktrees/public-add-button` (aislado desde el `main` local `73f7f0bd6`).
- **Branch:** `fix/public-add-button-malformed`
- **Commit:** `3fb3f8e85` — 1 file changed, +2/−2.
- **Path:** `src/app/modules/public.luxuryapp/emergency-phones/telefonos-emergencia.html`

### Antes / después

Antes:

```html
@if (aspRoleS.hasRole(AspRole.SuperUsuario)) {
<lux-button-web-add
  label="Agregar"
  (clicked)="onModalForm({ id: '', title: 'Nuevo Registro' })"
/>
}
```

Después:

```html
@if (aspRoleS.hasRole(AspRole.SuperUsuario)) {
<lux-button-web
  kind="add"
  (clicked)="onModalForm({ id: '', title: 'Nuevo Registro' })"
/>
}
```

El `@if (aspRoleS.hasRole(AspRole.SuperUsuario))` quedó intacto.

### Decisión sobre `label="Agregar"`

Se **retiró** por redundante: coincide con `DEFAULTS.add.label = "Agregar"` (`src/app/shared/ui/buttons/web/button.ts:32`). Patrón del repo: los botones `kind="add"` migrados no llevan `label` (p. ej. `report-catalog.html:18`, `legal-pendientes-minuta-desktop.html:104`, `diagram-list.html:26`, `lux-table-caption.html:14/40`, `medidores-list-desktop.html:5`); solo se mantiene explícito cuando difiere del default (p. ej. `catalog-web-item.ts:299` → `label="Crear"`). Nota: `shared.luxuryapp/catalogs/**` no contiene ningún `kind="add"`, así que el patrón se tomó del resto del repo.

### Verificación

- `ng build` → **EXIT=0** (bundle generado). Única advertencia: `NG8113` (`LxTooltipDirective` importado sin uso en `catalog-web-item.ts`), preexistente y fuera de scope. Sin NG8001/NG8002.
- `npm run audit:ui` → `✅ shared/ui: fronteras web/móvil/base respetadas.`
- `git diff --check` → sin errores (exit 0).
