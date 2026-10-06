# Agente 6 - Recovery Protocol (Core, Routing, Shared No-UI)

**Misión:** Reparar la compilación (NG8001), revertir daños en el layout base y aislar estrictamente tus cambios. Fuiste afectado por un commit concurrente (Agente 5 te pisó archivos en la corrida anterior). Esta vez recuperarás el control.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/core`
- `appsweb/angular/src/app/routing`
- `appsweb/angular/src/app/shared` (EXCEPTO `shared/ui`)
- `appsweb/angular/src/app/*.ts` y `*.html` (Archivos raíz)

## Tareas de Recuperación

1. **Reparar Import de Iconos (NG8001):**
   - El componente de UI para iconos ahora es el wrapper adaptativo `LxIcon`.
   - Busca en tus archivos `.ts` el import de `AppIcon`.
   - Cámbialo por: `import { LxIcon } from '@ui/adaptive/icon/icon';`
   - En el decorador `@Component({ imports: [..., AppIcon, ...] })`, cambia `AppIcon` por `LxIcon`.
   - El tag en el HTML/TS debe ser `<lux-icon>`.

2. **Revertir Daño Colateral en Layout (Falsos Positivos):**
   - Componentes críticos como `<app-header-committee-desktop>` fueron erróneamente renombrados a `<lux-header-committee-desktop-web>` en la corrida anterior.
   - Revisa `core/layout` y archivos raíz. TODO lo que sea estructural (header, sidebar propio, layout principal) que fue alterado a `lux-` debe volver a `app-`.
   - **Regla:** Si el tag NO pertenece a los oficiales de `shared/ui/web` (como `lux-table-web`, `lux-spinner-web`), **devuélvelo a su nombre original `<app-...>`**.

3. **Guardado y Commit Aislado (CRÍTICO):**
   - Ejecuta exactamente:
     `git add appsweb/angular/src/app/core appsweb/angular/src/app/routing appsweb/angular/src/app/shared/directives appsweb/angular/src/app/shared/integration appsweb/angular/src/app/shared/pipes appsweb/angular/src/app/shared/user-account-access appsweb/angular/src/app/shared/utils appsweb/angular/src/app/*.ts appsweb/angular/src/app/*.html`
   - **PROHIBIDO** usar `git add .` o `git commit -a`.
   - Crea un commit: `fix(core,root): repara layout NG8001 y revierte falsos positivos estructurales`