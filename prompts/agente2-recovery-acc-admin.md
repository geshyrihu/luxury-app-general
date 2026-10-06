# Agente 2 - Recovery Protocol (Accounting & Admin)

**Misión:** Reparar la compilación (NG8001) y revertir el daño colateral causado por reemplazos ciegos en tu dominio.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/accounting`
- `appsweb/angular/src/app/modules/admin`

## Tareas de Recuperación

1. **Reparar Import de Iconos (NG8001):**
   - El componente de UI para iconos ahora es el wrapper adaptativo `LxIcon`.
   - Busca en tus archivos `.ts` el import de `AppIcon` (ej. `import { AppIcon } from '@ui/primitives...'` o rutas relativas).
   - Cámbialo por: `import { LxIcon } from '@ui/adaptive/icon/icon';`
   - En el decorador `@Component({ imports: [..., AppIcon, ...] })`, cambia `AppIcon` por `LxIcon`.
   - El tag en el HTML/TS debe ser `<lux-icon>`. Si aún dice `<app-icon>`, cámbialo.

2. **Revertir Daño Colateral (Falsos Positivos):**
   - Revisa tus HTML/TS buscando `<lux-`.
   - **Regla:** Si el tag NO pertenece a los oficiales de `shared/ui/web` (como `lux-table-web`, `lux-spinner-web`, `lux-action-menu-web`, `lux-avatar-web`, `lux-tag-web`), **devuélvelo a su nombre original `<app-...>`**.
   - Los componentes de tu propio dominio (ej. `<app-accounting-report>`) NUNCA deben llevar prefijo `lux-`.

3. **Guardado y Commit Aislado (CRÍTICO):**
   - `git add appsweb/angular/src/app/modules/accounting appsweb/angular/src/app/modules/admin`
   - **PROHIBIDO** usar `git add .`, `git commit -a` o `git commit -A`.
   - Crea un commit: `fix(accounting,admin): repara imports NG8001 y revierte falsos positivos de codemod`