# Agente 5 - Limpieza de Imports Muertos (Legal, Purchases, Collections, Public)

**Misión:** Eliminar referencias huérfanas en los arreglos `imports: [...]` de `@Component`. 

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/legal.luxuryapp`
- `appsweb/angular/src/app/modules/purchases.luxuryapp`
- `appsweb/angular/src/app/modules/collections.luxuryapp`
- `appsweb/angular/src/app/modules/public.luxuryapp`

## Tareas

1. **Limpiar `imports: []` muertos:**
   - Busca en los `.ts` de tu dominio cualquier mención en el array `imports: [...]` de:
     `WebButtonLabel`, `WebButtonIcon`, `WebButtonIconDelete`, `WebButtonIconEdit`, `MobileButtonLabel`, `MobileButtonLabelEdit`, `MobileButtonIcon`, `MobileButtonIconEdit`, `WebButtonIconViewPdf`.
   - **Elimínalos** del array.

2. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(legal,purchases,collections,public): remueve imports huerfanos de botones legacy en array de componentes`