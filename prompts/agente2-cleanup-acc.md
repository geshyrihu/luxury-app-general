# Agente 2 - Limpieza de Imports Muertos (Accounting, Admin)

**Misión:** Eliminar referencias huérfanas en los arreglos `imports: [...]` de `@Component`. 

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/accounting.luxuryapp`
- `appsweb/angular/src/app/modules/admin.luxuryapp`

## Tareas

1. **Limpiar `imports: []` muertos:**
   - Busca en los `.ts` de tu dominio cualquier mención en el array `imports: [...]` de:
     `WebButtonLabel`, `WebButtonIcon`, `WebButtonIconDelete`, `WebButtonIconEdit`, `MobileButtonLabel`, `MobileButtonLabelEdit`, `MobileButtonIcon`, `MobileButtonIconEdit`, `WebButtonIconViewPdf`.
   - **Elimínalos** del array.

2. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(accounting,admin): remueve imports huerfanos de botones legacy en array de componentes`