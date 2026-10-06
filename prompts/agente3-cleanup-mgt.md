# Agente 3 - Limpieza de Imports Muertos (Management, HR, Committee)

**Misión:** Eliminar referencias huérfanas en los arreglos `imports: [...]` de `@Component`. 

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/management.luxuryapp`
- `appsweb/angular/src/app/modules/human-resources.luxuryapp`
- `appsweb/angular/src/app/modules/committee.luxuryapp`

## Tareas

1. **Limpiar `imports: []` muertos:**
   - Busca en los `.ts` de tu dominio cualquier mención en el array `imports: [...]` de:
     `WebButtonLabel`, `WebButtonIcon`, `WebButtonIconDelete`, `WebButtonIconEdit`, `MobileButtonLabel`, `MobileButtonLabelEdit`, `MobileButtonIcon`, `MobileButtonIconEdit`, `WebButtonIconViewPdf`.
   - **Elimínalos** del array.

2. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(mgt,hr,committee): remueve imports huerfanos de botones legacy en array de componentes`