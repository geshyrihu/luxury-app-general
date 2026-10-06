# Agente 1 - Renombramiento Core y UI (Ejecución Fase 1 y 2)

**Misión:** Eres el responsable de cambiar las bases de `shared/ui` y configurar la infraestructura general para el gran refactor de nombres (Fase 1 y Fase 2). Operarás estrictamente en `appsweb/angular/src/app/shared/ui` y archivos de configuración raíz.

## Tareas

1. **Renombrar Carpetas Físicas (git mv):**
   - `appsweb/angular/src/app/shared/ui/base` -> `appsweb/angular/src/app/shared/ui/core`
   - `appsweb/angular/src/app/shared/ui/shared` -> `appsweb/angular/src/app/shared/ui/primitives`

2. **Actualizar Alias de TypeScript:**
   - En `tsconfig.json` (o similar), cambiar `"@ui/base/*"` a `"@ui/core/*"`.
   - Cambiar `"@ui/shared/*"` a `"@ui/primitives/*"`.

3. **Renombrar Selectores en `shared/ui`:**
   - En la carpeta `adaptive/`: Cambiar `selector: "lx-..."` a `selector: "lux-..."`. (Excepto `lx-section-nav` que ya es `lux-section-nav`). No cambiar atributos como `[lxTooltip]`.
   - En las carpetas `primitives/`, `inputs/`, `charts/`, `ai-chat-widget/`, `image-analysis-dialog/`: Cambiar `selector: "app-..."` a `selector: "lux-..."` (sin sufijo web). Incluye `app-icon` -> `lux-icon`.
   - En la carpeta `web/`: Cambiar `selector: "app-..."` a `selector: "lux-...-web"` (ej. `app-table` -> `lux-table-web`).

4. **Actualizar Imports Internos:**
   - Cambiar rutas relativas o absolutas (`@ui/shared` -> `@ui/primitives`, `@ui/base` -> `@ui/core`) dentro de los propios componentes de `shared/ui`.

**Restricciones:** No toques `src/app/modules/`. Solo `shared/ui` y configs globales. Haz un commit atómico.