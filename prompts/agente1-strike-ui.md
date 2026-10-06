# Agente 1 - Strike Team (Operación Manual en UI)

**Misión:** Tu script automatizado `clean-buttons.mjs` falló en limpiar 3 archivos específicos debido a un bug de parseo. El compilador no miente. Entra manualmente a estos archivos y elimina los identificadores del array `imports: []`.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/shared/ui/`

## Tareas Quirúrgicas

1. **`shared/ui/inputs/web/custom-input-upload-pdf-signal.ts`**
   - Elimina `WebButtonLabel` del decorador `@Component`.

2. **`shared/ui/inputs/web/input-file/input-file.ts`**
   - Elimina `WebButtonIconDelete` del decorador `@Component`.

3. **`shared/ui/web/data-grid/data-grid.ts`**
   - Elimina `WebButtonLabel` y `WebButtonIcon` del decorador `@Component`.

## Guardado y Commit
- `git add appsweb/angular/src/app/shared/ui/`
- Commit: `fix(ui): limpieza manual de imports legacy omitidos por script`