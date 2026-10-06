# Agente 6 - Strike Team (Rescate de Módulo Ignorado)

**Misión:** En la pasada tanda, el módulo `shared.luxuryapp` se quedó sin limpiar porque tu dominio explícito solo abarcaba `src/app/shared/` (la carpeta core), dejando fuera `src/app/modules/shared.luxuryapp`. Ahora te encargarás de él.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/shared.luxuryapp`

## Tareas Quirúrgicas

1. **Limpieza de Catálogos (NG1010 / TS2304):**
   - Entra a las carpetas dentro de `catalogs/` (banks, cfdi-usage, document-catalog, onboarding-checklist-options, payment-method, payment-type, recruitment-sources, units-of-measurement).
   - Abre los archivos `*-list-desktop.ts` y elimina `WebButtonIconEdit` del arreglo `imports: []`.
   - Abre los archivos `*-list-mobile.ts` y elimina `MobileButtonLabelEdit` del arreglo `imports: []`.

## Guardado y Commit
- `git add appsweb/angular/src/app/modules/shared.luxuryapp`
- Commit: `fix(shared-module): limpia imports legacy en catalogos de shared.luxuryapp`