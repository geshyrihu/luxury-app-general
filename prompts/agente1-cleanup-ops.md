# Agente 1 - Limpieza de Imports Muertos (Operations, Auth, Shared/UI)

**Misión:** Has eliminado con éxito las carpetas de botones legacy. Sin embargo, algunos componentes en tu dominio aún tienen `WebButtonLabel` o `WebButtonIcon` perdidos dentro de sus arreglos `imports: [...]` en el decorador `@Component`. Como ya no importan el archivo (el import arriba fue borrado), Angular lanza el error `NG1010` / `TS2304`.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/operations.luxuryapp`
- `appsweb/angular/src/app/modules/auth.luxuryapp`
- `appsweb/angular/src/app/shared/ui/`

## Tareas

1. **Limpiar `imports: []` muertos:**
   - Busca en los `.ts` de tu dominio cualquier mención en el array `imports: [...]` de:
     `WebButtonLabel`, `WebButtonIcon`, `WebButtonIconDelete`, `WebButtonIconEdit`, `MobileButtonLabel`, `MobileButtonLabelEdit`, `MobileButtonIcon`, `MobileButtonIconEdit`, `WebButtonIconViewPdf`.
   - **Elimínalos** del array.
   - Revisa específicamente:
     - `shared/ui/inputs/web/custom-input-upload-pdf-signal.ts`
     - `shared/ui/inputs/web/input-file/input-file.ts`
     - `shared/ui/web/data-grid/data-grid.ts`

2. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(operations,ui): remueve imports huerfanos de botones legacy en array de componentes`